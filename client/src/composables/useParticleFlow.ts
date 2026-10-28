import * as THREE from 'three';
import { onUnmounted, ref, watch, type Ref } from 'vue';

/**
 * 红细胞运氧粒子动画（科普示意）。
 *
 * - 粒子沿闭合 CatmullRomCurve3 血管环路运动：肺泡毛细血管(装氧) → 心脏 → 全身组织(卸氧) → 返回肺
 * - 粒子颜色随路径参数 t 变化：肺泡附近鲜红（富氧），组织附近暗红（缺氧）
 * - 动画状态使用普通 JS 对象管理，刻意不进入 Vue 响应式系统（每帧读写，避免依赖收集开销）
 * - 移动端（<768px）自动降低粒子数量与像素比
 */

// 颜色语义：柔和鲜红＝富氧血，柔和暗红＝缺氧血（低饱和，避免荧光感）
const COLOR_BRIGHT = new THREE.Color('#e06368');
const COLOR_DARK = new THREE.Color('#8a3c42');

/**
 * 路径参数 t 与含氧量的对应关系：
 * 0 = 肺泡毛细血管（刚装氧，最鲜红）→ 0.3 附近经过心脏 → 0.55 附近到达全身组织（卸氧，最暗）
 * → 0.8 之后返回肺部重新装氧，逐渐变亮。
 */
function oxygenLevel(t: number): number {
  let level: number;
  if (t < 0.3) level = 1;
  else if (t < 0.55) level = 1 - (t - 0.3) / 0.25;
  else if (t < 0.8) level = 0;
  else level = (t - 0.8) / 0.2;
  const clamped = Math.min(Math.max(level, 0), 1);
  return clamped * clamped * (3 - 2 * clamped); // smoothstep，让颜色过渡更柔和
}

interface ParticleRuntime {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  group: THREE.Group;
  rafId: number;
  observer: ResizeObserver | null;
  textures: THREE.Texture[];
  curve: THREE.CatmullRomCurve3;
  times: Float32Array;
  speeds: Float32Array;
  count: number;
  positionAttr: THREE.BufferAttribute;
  colorAttr: THREE.BufferAttribute;
  lungNode: THREE.Mesh;
  tissueNode: THREE.Mesh;
  heartNode: THREE.Mesh;
  lut: Float32Array;
}

export function useParticleFlow(containerRef: Ref<HTMLElement | null>, playingRef: Ref<boolean>) {
  const failed = ref(false);
  let runtime: ParticleRuntime | null = null;
  const state = { playing: playingRef.value, elapsed: 0 };
  const tmpVec = new THREE.Vector3();

  watch(playingRef, (value) => {
    state.playing = value;
  });
  onUnmounted(dispose);

  function makeDotTexture(textures: THREE.Texture[]): THREE.CanvasTexture {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // 实心圆点贴图（靠画布抗锯齿获得柔和边缘，不使用渐变）
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    textures.push(texture);
    return texture;
  }

  function buildColorLUT(): Float32Array {
    const lut = new Float32Array(256 * 3);
    const color = new THREE.Color();
    for (let i = 0; i < 256; i++) {
      color.copy(COLOR_DARK).lerp(COLOR_BRIGHT, oxygenLevel(i / 255));
      lut[i * 3] = color.r;
      lut[i * 3 + 1] = color.g;
      lut[i * 3 + 2] = color.b;
    }
    return lut;
  }

  function update(dt: number): void {
    const rt = runtime;
    if (!rt) return;
    if (state.playing) state.elapsed += dt;

    const { curve, times, speeds, count, lut, positionAttr, colorAttr } = rt;
    for (let i = 0; i < count; i++) {
      if (state.playing) times[i] = (times[i] + dt * speeds[i]) % 1;
      curve.getPoint(times[i], tmpVec);
      positionAttr.setXYZ(i, tmpVec.x, tmpVec.y, tmpVec.z);
      const ci = (oxygenLevel(times[i]) * 255) | 0;
      colorAttr.setXYZ(i, lut[ci * 3], lut[ci * 3 + 1], lut[ci * 3 + 2]);
    }
    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // 节点脉动：肺（青）与组织（紫）反相，心脏快跳
    const pulse = 1 + 0.08 * Math.sin(state.elapsed * 2.4);
    rt.lungNode.scale.setScalar(pulse);
    rt.tissueNode.scale.setScalar(2 - pulse);
    rt.heartNode.scale.setScalar(1 + 0.15 * Math.sin(state.elapsed * 5));
    rt.group.rotation.y = -0.28 + Math.sin(state.elapsed * 0.18) * 0.1;
  }

  function init(): void {
    const el = containerRef.value;
    if (!el || runtime) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      failed.value = true;
      return;
    }

    const mobile = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.setClearColor(0xf8f3e9, 1); // 纸底色场景背景
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 60);
    camera.position.set(0, 0.1, 4.3);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2.5, 3, 4);
    scene.add(keyLight);

    const group = new THREE.Group();
    scene.add(group);

    // 闭合血管环路：肺(装氧) → 心脏 → 全身组织(卸氧) → 回肺
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.55, 1.05, 0.1),
        new THREE.Vector3(-0.85, 0.85, 0.35),
        new THREE.Vector3(-0.25, 0.25, 0.3),
        new THREE.Vector3(0.6, -0.15, 0.15),
        new THREE.Vector3(1.5, -0.85, 0),
        new THREE.Vector3(0.85, -1.15, -0.25),
        new THREE.Vector3(-0.25, -0.85, -0.35),
        new THREE.Vector3(-0.95, -0.05, -0.3),
      ],
      true,
      'catmullrom',
      0.6,
    );

    // 半透明血管管道（浅底上用柔和的玫瑰灰）
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, mobile ? 140 : 240, 0.2, mobile ? 10 : 14, true),
      new THREE.MeshBasicMaterial({ color: 0xc9a0a6, transparent: true, opacity: 0.5, depthWrite: false }),
    );
    tube.renderOrder = 0;
    group.add(tube);

    // 关键节点标记：肺泡（柔和蓝）、组织（柔和绿）、心脏（柔和红）
    const lungNode = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.3, 1),
      new THREE.MeshBasicMaterial({ color: 0x6f93b8, wireframe: true, transparent: true, opacity: 0.85 }),
    );
    lungNode.position.set(-1.55, 1.05, 0.1);
    const tissueNode = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.34, 1),
      new THREE.MeshBasicMaterial({ color: 0x8aa27a, wireframe: true, transparent: true, opacity: 0.85 }),
    );
    tissueNode.position.set(1.5, -0.85, 0);
    const heartNode = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 20, 16),
      new THREE.MeshStandardMaterial({ color: 0xc0304e, roughness: 0.45 }),
    );
    heartNode.position.set(-0.25, 0.25, 0.3);
    group.add(lungNode, tissueNode, heartNode);

    // 红细胞粒子
    const textures: THREE.Texture[] = [];
    const count = mobile ? 320 : 900;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const material = new THREE.PointsMaterial({
      size: mobile ? 0.1 : 0.085,
      map: makeDotTexture(textures),
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      alphaTest: 0.12,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    points.renderOrder = 2;
    group.add(points);

    const times = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      times[i] = Math.random();
      // 每秒沿环路推进 5%–9.5%，即约 11–20 秒跑完一圈（示意节奏）
      speeds[i] = 0.05 + Math.random() * 0.045;
    }

    const rt: ParticleRuntime = {
      renderer,
      scene,
      camera,
      group,
      rafId: 0,
      observer: null,
      textures,
      curve,
      times,
      speeds,
      count,
      positionAttr: geometry.getAttribute('position') as THREE.BufferAttribute,
      colorAttr: geometry.getAttribute('color') as THREE.BufferAttribute,
      lungNode,
      tissueNode,
      heartNode,
      lut: buildColorLUT(),
    };
    runtime = rt;

    const resize = () => {
      const host = containerRef.value;
      if (!host) return;
      const w = host.clientWidth || 640;
      const h = host.clientHeight || 360;
      rt.camera.aspect = w / h;
      rt.camera.updateProjectionMatrix();
      rt.renderer.setSize(w, h);
    };
    rt.observer = new ResizeObserver(resize);
    rt.observer.observe(el);
    resize();

    let last = performance.now();
    const tick = (now: number) => {
      if (runtime !== rt) return; // 已销毁
      rt.rafId = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      rt.renderer.render(rt.scene, rt.camera);
    };
    rt.rafId = requestAnimationFrame(tick);
  }

  function dispose(): void {
    const rt = runtime;
    if (!rt) return;
    runtime = null;
    cancelAnimationFrame(rt.rafId);
    rt.observer?.disconnect();
    rt.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((item) => item.dispose());
      else mat?.dispose();
    });
    for (const texture of rt.textures) texture.dispose();
    rt.renderer.dispose();
    rt.renderer.domElement.remove();
  }

  return { init, dispose, failed };
}
