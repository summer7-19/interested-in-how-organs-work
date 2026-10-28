<script setup lang="ts">
import type { OrganSummary } from '../types/organ';

/**
 * 人体主图：仿解剖挂图的外形——无头、无双臂的躯干正面（颈部上缘与骨盆底缘切断），
 * 外轮廓由一条连续闭合曲线构成：颈侧 → 斜方肌 → 肩峰 → 胸侧 → 腰 → 髋 → 骨盆底缘，
 * 全程无折角、无镜像拼缝；内部器官按解剖位置居中排布。
 * 插画风格与科普图版一致：深红厚描边 + 柔和明暗 + 高光，兼顾卡通亲和力与解剖结构
 * （气管支气管树、大血管、肝叶、肾门与输尿管等）。
 *
 * 点击器官 → 发出 selection（含放大聚焦点与缩放倍数），由父组件完成放大过渡并进入
 * 该器官的工作流演示。肾脏位于腹膜后，为保证可点击与可读性绘制在肠管之前。
 */
const props = defineProps<{
  organs: OrganSummary[];
  selectedId: string | null;
  /** 放大过渡中需要变暗其他器官时，传入保持高亮的目标器官 id */
  dimId?: string | null;
}>();

const emit = defineEmits<{
  (e: 'selection', organId: string, focus: { xp: number; yp: number; k: number }): void;
}>();

/** 放大聚焦点：按图版（含图注）高度换算百分比；整图放大 1.15、器官组缩小 0.88，k 相抵 */
const FOCUS: Record<string, { xp: number; yp: number; k: number }> = {
  throat: { xp: 50, yp: 29.7, k: 2.5 },
  lung: { xp: 50, yp: 39, k: 1.93 },
  heart: { xp: 52.9, yp: 43.4, k: 2.17 },
  stomach: { xp: 60.5, yp: 61.7, k: 2.02 },
  liver: { xp: 44.7, yp: 57.1, k: 1.98 },
  kidney: { xp: 50, yp: 66.5, k: 1.78 },
};

/** 选中标记环 */
const RING_CENTER: Record<string, { x: number; y: number }> = {
  lung: { x: 260, y: 262 },
  heart: { x: 274, y: 292 },
  stomach: { x: 314, y: 380 },
  liver: { x: 240, y: 376 },
  kidney: { x: 260, y: 434 },
};

const RING_RADIUS: Record<string, number> = {
  lung: 102,
  heart: 66,
  stomach: 48,
  liver: 70,
  kidney: 86,
};

/** 引导光环（呼吸节奏脉动） */
const HALO: Record<string, { x: number; y: number; r: number }> = {
  lung: { x: 260, y: 260, r: 84 },
  heart: { x: 274, y: 292, r: 56 },
  stomach: { x: 314, y: 380, r: 48 },
  liver: { x: 240, y: 376, r: 58 },
  kidney: { x: 260, y: 436, r: 78 },
};

const ORGAN_NAMES: Record<string, string> = {
  throat: '咽喉',
  lung: '肺',
  heart: '心脏',
  stomach: '胃',
  liver: '肝脏',
  kidney: '肾脏',
};

function isAvailable(id: string): boolean {
  return props.organs.find((o) => o.id === id)?.available ?? false;
}

function titleOf(id: string): string {
  const name = ORGAN_NAMES[id] ?? id;
  return isAvailable(id) ? `${name} · 点击放大并观看运作过程` : `${name} · 内容筹备中`;
}

function select(id: string): void {
  const focus = FOCUS[id];
  if (focus) emit('selection', id, focus);
}

type Pt = [number, number];
/** 一段三次贝塞尔：控制点 1、控制点 2、终点 */
type Cubic = [Pt, Pt, Pt];

/**
 * 躯干左半轮廓（自颈部上缘中点向下）：颈侧 → 颈根 → 斜方肌 → 肩峰 → 胸侧 → 肋缘
 * → 腰（轻微内收）→ 髋（略外扩）→ 骨盆底缘。左半按镜像反向折回右半，闭合为单条曲线，
 * 避免左右两半各自填充造成的渐变接缝。
 */
const BODY_LEFT: Cubic[] = [
  [[235, 158], [231, 170], [227, 182]], // 颈侧（自顶端即外张）
  [[222, 192], [216, 199], [208, 205]], // 颈根
  [[194, 212], [180, 220], [168, 230]], // 斜方肌 → 肩坡
  [[158, 238], [155, 248], [154, 262]], // 肩峰
  [[154, 278], [156, 298], [158, 318]], // 胸廓侧缘
  [[160, 338], [162, 356], [163, 376]], // 肋缘
  [[164, 392], [164, 410], [163, 426]], // 腰（轻微内收）
  [[162, 440], [160, 454], [159, 468]], // 髂骨 → 髋
  [[158, 488], [161, 504], [165, 514]], // 髋侧 → 大腿根（内收）
  [[186, 520], [220, 520], [260, 520]], // 骨盆底缘（平切）
];

const NECK_TOP: Pt = [260, 146];
const NECK_TOP_LEFT: Pt = [237, 146];
const MIRROR_X = 520;

/** 闭合躯干外形：颈部上缘 → 左半轮廓 → 镜像反向折回 → 上缘收口 */
const BODY_OUTLINE = (() => {
  let d = `M${NECK_TOP[0]} ${NECK_TOP[1]} L ${NECK_TOP_LEFT[0]} ${NECK_TOP_LEFT[1]}`;
  const starts: Pt[] = [NECK_TOP_LEFT];
  for (const [c1, c2, p] of BODY_LEFT) {
    d += ` C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p[0]} ${p[1]}`;
    starts.push(p);
  }
  for (let i = BODY_LEFT.length - 1; i >= 0; i -= 1) {
    const [c1, c2] = BODY_LEFT[i];
    const s = starts[i];
    d += ` C ${MIRROR_X - c2[0]} ${c2[1]} ${MIRROR_X - c1[0]} ${c1[1]} ${MIRROR_X - s[0]} ${s[1]}`;
  }
  return `${d} Z`;
})();

/** 支气管树（观察者左侧肺；右侧镜像复用） */
const LUNG_TREE = [
  { d: 'M235 238 C 226 234 218 229 212 222', w: 4.4 },
  { d: 'M212 222 C 204 218 198 212 194 204', w: 3 },
  { d: 'M212 222 C 206 232 202 242 200 252', w: 3 },
  { d: 'M231 248 C 224 254 218 262 214 272', w: 3.2 },
  { d: 'M200 252 C 196 262 196 272 198 282', w: 2.6 },
  { d: 'M214 272 C 210 282 208 292 208 300', w: 2.6 },
];

/** 心脏大血管：先画深色描边层再叠彩色层，得到与参考图一致的外轮廓 */
const HEART_VESSELS = [
  { d: 'M282 258 C 284 246 286 232 290 220', w: 9, c: '#d24d60' },
  { d: 'M290 220 C 294 208 306 206 312 216 C 317 224 316 234 310 240 C 306 244 302 246 298 248', w: 9, c: '#d24d60' },
  { d: 'M292 216 L 291 203', w: 5, c: '#d24d60' },
  { d: 'M300 211 L 300 198', w: 5, c: '#d24d60' },
  { d: 'M272 258 C 268 246 266 238 262 232', w: 8, c: '#5b8cb8' },
  { d: 'M262 232 C 252 238 242 246 235 252', w: 7, c: '#5b8cb8' },
  { d: 'M262 232 C 274 236 282 240 288 246', w: 7, c: '#5b8cb8' },
];

/** 可探索器官（用于引导光环；咽喉在颈部单独绘制光环） */
const explorable = ['lung', 'heart', 'stomach', 'liver', 'kidney'];
</script>

<template>
  <figure class="body-map">
    <svg
      viewBox="0 0 520 580"
      class="figure-svg"
      role="group"
      aria-label="解剖挂图风格人体躯干器官图：点击器官可放大观看其工作过程"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- 体表与器官的柔和明暗（顶光，左上亮 → 右下暗） -->
        <linearGradient id="bm-skin" x1="0.15" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f8edde" />
          <stop offset="0.55" stop-color="#efdcc7" />
          <stop offset="1" stop-color="#e2c7aa" />
        </linearGradient>
        <linearGradient id="bm-lung" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f9c4ca" />
          <stop offset="0.5" stop-color="#ef97a4" />
          <stop offset="1" stop-color="#d8737f" />
        </linearGradient>
        <linearGradient id="bm-heart" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f08a95" />
          <stop offset="0.5" stop-color="#cf4759" />
          <stop offset="1" stop-color="#a02637" />
        </linearGradient>
        <linearGradient id="bm-liver" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stop-color="#cd6a72" />
          <stop offset="0.5" stop-color="#a83846" />
          <stop offset="1" stop-color="#85232f" />
        </linearGradient>
        <linearGradient id="bm-kidney" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#cf5f6a" />
          <stop offset="0.5" stop-color="#a52f3d" />
          <stop offset="1" stop-color="#7f1f2c" />
        </linearGradient>
        <linearGradient id="bm-stomach" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f9bcc4" />
          <stop offset="0.5" stop-color="#eb8d9b" />
          <stop offset="1" stop-color="#d47585" />
        </linearGradient>
        <linearGradient id="bm-intestine" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f4aab4" />
          <stop offset="0.55" stop-color="#e28694" />
          <stop offset="1" stop-color="#cd6c7d" />
        </linearGradient>
        <linearGradient id="bm-bladder" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f6b3bd" />
          <stop offset="1" stop-color="#e98696" />
        </linearGradient>
        <linearGradient id="bm-trachea" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f2a2ac" />
          <stop offset="1" stop-color="#dc7b89" />
        </linearGradient>
        <linearGradient id="bm-larynx" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f8d7dc" />
          <stop offset="1" stop-color="#e2a7b1" />
        </linearGradient>
        <linearGradient id="bm-diaphragm" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#e0d2ea" />
          <stop offset="1" stop-color="#bfa9d1" />
        </linearGradient>

        <!-- 体表阴影裁切（沿整条闭合轮廓） -->
        <clipPath id="bm-body-clip">
          <path :d="BODY_OUTLINE" />
        </clipPath>
      </defs>

      <!-- 整体在画布内略放大并上下居中，减少四周留白；器官组另行缩小以实现紧凑感 -->
      <g transform="translate(260 307) scale(1.15) translate(-260 -350)">

      <!-- ============ 人体轮廓（无头、无双臂：一条闭合曲线，无拼接缝） ============ -->
      <path :d="BODY_OUTLINE" fill="url(#bm-skin)" />

      <!-- 体表明暗：柔和的侧影、胸腹受光与颈根阴影，全部裁切在轮廓内 -->
      <g clip-path="url(#bm-body-clip)">
        <ellipse cx="238" cy="300" rx="52" ry="76" fill="#ffffff" opacity="0.14" />
        <ellipse cx="332" cy="326" rx="34" ry="132" fill="#d9bb9a" opacity="0.15" />
        <ellipse cx="260" cy="404" rx="42" ry="50" fill="#dcc0a2" opacity="0.13" />
        <ellipse cx="260" cy="492" rx="40" ry="24" fill="#dcc0a2" opacity="0.18" />
        <ellipse cx="260" cy="188" rx="26" ry="8" fill="#d8b795" opacity="0.28" />
      </g>

      <!-- 轮廓线（单条路径一次描边） -->
      <path :d="BODY_OUTLINE" fill="none" stroke="#c1a381" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" />

      <!-- ============ 咽喉（喉 + 气管，位于颈部） ============ -->
      <g
        class="organ clickable"
        :class="{ selected: selectedId === 'throat', dimmed: Boolean(dimId) && dimId !== 'throat' }"
        role="button"
        tabindex="0"
        :aria-label="titleOf('throat')"
        @click="select('throat')"
        @keydown.enter.prevent="select('throat')"
        @keydown.space.prevent="select('throat')"
      >
        <!-- 选中标记环 + 引导光环（颈部单独绘制） -->
        <ellipse
          v-if="selectedId === 'throat'"
          cx="260" cy="190" rx="34" ry="46"
          fill="none" stroke="#4e7d61" stroke-width="3" stroke-dasharray="10 8" opacity="0.7"
        />
        <ellipse cx="260" cy="190" rx="30" ry="42" fill="none" stroke="#4e7d61" stroke-width="2.5">
          <animate attributeName="rx" values="30;38;30" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="ry" values="42;50;42" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.05;0.5" dur="2.8s" repeatCount="indefinite" />
        </ellipse>
        <!-- 喉（甲状软骨） -->
        <path
          d="M247 152 C 254 146 266 146 273 152 C 278 164 279 178 276 190
             C 271 200 264 204 260 204 C 256 204 249 200 244 190
             C 241 178 242 164 247 152 Z"
          fill="url(#bm-larynx)" stroke="#7e1f2e" stroke-width="2.8" stroke-linejoin="round"
        />
        <path d="M260 154 L 260 200" stroke="#d08a97" stroke-width="1.6" opacity="0.5" />
        <path d="M250 158 C 248 170 248 182 251 192" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.4" />
        <!-- 气管（带软骨环） -->
        <rect x="252" y="190" width="16" height="61" rx="8" fill="url(#bm-trachea)" stroke="#7e1f2e" stroke-width="2.6" />
        <line x1="255" y1="202" x2="265" y2="202" stroke="#b85263" stroke-width="2.2" stroke-linecap="round" />
        <line x1="255" y1="215" x2="265" y2="215" stroke="#b85263" stroke-width="2.2" stroke-linecap="round" />
        <line x1="255" y1="228" x2="265" y2="228" stroke="#b85263" stroke-width="2.2" stroke-linecap="round" />
        <line x1="255" y1="241" x2="265" y2="241" stroke="#b85263" stroke-width="2.2" stroke-linecap="round" />
        <path d="M255 196 C 255 212 255 232 255 246" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" opacity="0.35" />
        <!-- 透明命中区：扩大颈部的可点击范围 -->
        <ellipse cx="260" cy="188" rx="30" ry="42" fill="#ffffff" fill-opacity="0" />
        <title>{{ titleOf('throat') }}</title>
      </g>

      <!-- ============ 器官组：整体略缩小并收拢，位于胸廓与骨盆之间 ============ -->
      <g transform="translate(260 358) scale(0.88) translate(-260 -340)">

      <!-- ============ 肺（两叶同属一个器官） ============ -->
      <g
        class="organ clickable"
        :class="{ selected: selectedId === 'lung', dimmed: Boolean(dimId) && dimId !== 'lung' }"
        role="button"
        tabindex="0"
        :aria-label="titleOf('lung')"
        @click="select('lung')"
        @keydown.enter.prevent="select('lung')"
        @keydown.space.prevent="select('lung')"
      >
        <circle
          v-if="selectedId === 'lung'"
          :cx="RING_CENTER.lung.x"
          :cy="RING_CENTER.lung.y"
          :r="RING_RADIUS.lung"
          fill="none"
          stroke="#4e7d61"
          stroke-width="3"
          stroke-dasharray="10 8"
          opacity="0.7"
        />
        <!-- 观察者左侧＝解剖学右肺（三叶） -->
        <g transform="translate(260 260) scale(0.93) translate(-260 -260)">
        <g>
          <path
            d="M204 178 C 194 178 186 186 180 200 C 172 220 168 246 168 272 C 168 296 172 318 180 332 C 186 343 196 347 206 343 C 216 339 224 327 229 309 C 234 289 236 263 235 237 C 235 217 232 199 226 188 C 219 179 211 177 204 178 Z"
            fill="url(#bm-lung)" stroke="#7e1f2e" stroke-width="3.4" stroke-linejoin="round"
          />
          <path d="M180 200 C 173 222 169 248 169 274 C 169 298 173 318 181 332 C 176 316 174 296 174 272 C 174 246 177 220 184 202 Z" fill="#b4515f" opacity="0.32" />
          <path d="M174 244 C 190 238 210 236 230 240" fill="none" stroke="#9c3b4b" stroke-width="2.2" opacity="0.7" stroke-linecap="round" />
          <path d="M171 270 C 186 290 206 306 228 316" fill="none" stroke="#9c3b4b" stroke-width="2.2" opacity="0.7" stroke-linecap="round" />
          <path
            v-for="(t, i) in LUNG_TREE" :key="`bm-tree-l-${i}`" :d="t.d"
            fill="none" stroke="#96394a" :stroke-width="t.w" stroke-linecap="round" opacity="0.9"
          />
          <path d="M190 214 C 183 240 181 268 186 296" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.4" />
        </g>
        <!-- 观察者右侧＝解剖学左肺（两叶，心切迹） -->
        <g transform="translate(520,0) scale(-1,1)">
          <path
            d="M204 178 C 194 178 186 186 180 200 C 172 220 168 246 168 272 C 168 296 172 318 180 332 C 186 343 196 347 206 343 C 216 339 224 327 229 309 C 234 289 236 263 235 237 C 235 217 232 199 226 188 C 219 179 211 177 204 178 Z"
            fill="url(#bm-lung)" stroke="#7e1f2e" stroke-width="3.4" stroke-linejoin="round"
          />
          <path d="M180 200 C 173 222 169 248 169 274 C 169 298 173 318 181 332 C 176 316 174 296 174 272 C 174 246 177 220 184 202 Z" fill="#b4515f" opacity="0.24" />
          <path d="M171 258 C 186 280 206 300 228 314" fill="none" stroke="#9c3b4b" stroke-width="2.2" opacity="0.7" stroke-linecap="round" />
          <path
            v-for="(t, i) in LUNG_TREE" :key="`bm-tree-r-${i}`" :d="t.d"
            fill="none" stroke="#96394a" :stroke-width="t.w" stroke-linecap="round" opacity="0.9"
          />
          <path d="M190 214 C 183 240 181 268 186 296" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.3" />
        </g>
        </g>
        <title>{{ titleOf('lung') }}</title>
      </g>

      <!-- 主支气管（压在两肺内缘之上，强调进气通道） -->
      <path d="M260 218 C 250 226 240 232 233 242" fill="none" stroke="#7e1f2e" stroke-width="14" stroke-linecap="round" />
      <path d="M260 218 C 270 226 280 232 287 242" fill="none" stroke="#7e1f2e" stroke-width="14" stroke-linecap="round" />
      <path d="M260 218 C 250 226 240 232 233 242" fill="none" stroke="url(#bm-trachea)" stroke-width="9" stroke-linecap="round" />
      <path d="M260 218 C 270 226 280 232 287 242" fill="none" stroke="url(#bm-trachea)" stroke-width="9" stroke-linecap="round" />

      <!-- ============ 心脏（含主动脉弓、肺动脉分支、心房心室、冠状动脉） ============ -->
      <g
        class="organ clickable"
        :class="{ selected: selectedId === 'heart', dimmed: Boolean(dimId) && dimId !== 'heart' }"
        role="button"
        tabindex="0"
        :aria-label="titleOf('heart')"
        @click="select('heart')"
        @keydown.enter.prevent="select('heart')"
        @keydown.space.prevent="select('heart')"
      >
        <circle
          v-if="selectedId === 'heart'"
          :cx="RING_CENTER.heart.x" :cy="RING_CENTER.heart.y" :r="RING_RADIUS.heart"
          fill="none" stroke="#4e7d61" stroke-width="3" stroke-dasharray="10 8" opacity="0.7"
        />
        <g>
          <path
            v-for="(v, i) in HEART_VESSELS" :key="`bm-vessel-ink-${i}`" :d="v.d"
            fill="none" stroke="#7e1f2e" :stroke-width="v.w + 4" stroke-linecap="round"
          />
          <path
            v-for="(v, i) in HEART_VESSELS" :key="`bm-vessel-${i}`" :d="v.d"
            fill="none" :stroke="v.c" :stroke-width="v.w" stroke-linecap="round"
          />
          <!-- 心房（后层） -->
          <path d="M246 262 C 242 250 246 241 256 238 C 266 236 274 241 277 250 L 277 262 Z" fill="#c04a5b" stroke="#7e1f2e" stroke-width="2.6" stroke-linejoin="round" />
          <path d="M279 258 C 282 245 292 240 301 244 C 309 248 312 257 309 266 L 280 268 Z" fill="#c04a5b" stroke="#7e1f2e" stroke-width="2.6" stroke-linejoin="round" />
          <!-- 心室体（心尖朝观察者右下） -->
          <path
            d="M247 262 C 241 276 240 294 247 310 C 254 326 266 335 279 335 C 289 335 296 328 299 316 C 303 300 301 276 293 260 C 287 248 277 242 265 244 C 255 246 249 252 247 262 Z"
            fill="url(#bm-heart)" stroke="#7e1f2e" stroke-width="3.4" stroke-linejoin="round"
          />
          <path d="M268 252 C 276 270 282 292 288 316" fill="none" stroke="#e57d8b" stroke-width="2.6" stroke-linecap="round" opacity="0.9" />
          <path d="M256 266 C 264 278 272 288 280 298" fill="none" stroke="#e57d8b" stroke-width="2.2" stroke-linecap="round" opacity="0.8" />
          <path d="M257 258 C 251 272 250 288 255 302" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.38" />
        </g>
        <title>{{ titleOf('heart') }}</title>
      </g>

      <!-- ============ 膈肌 ============ -->
      <path
        d="M166 344 C 196 328 226 322 258 326 C 292 322 322 326 356 344 L 356 356 C 322 340 292 344 258 348 C 226 344 196 342 166 356 Z"
        fill="url(#bm-diaphragm)" stroke="#9a84ae" stroke-width="2.2" stroke-linejoin="round"
      />
      <path d="M180 344 C 208 331 234 327 258 331" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.4" />

      <!-- ============ 肝脏（膈下偏观察者左，分叶 + 镰状韧带 + 胆囊） ============ -->
      <g
        class="organ clickable"
        :class="{ selected: selectedId === 'liver', dimmed: Boolean(dimId) && dimId !== 'liver' }"
        role="button"
        tabindex="0"
        :aria-label="titleOf('liver')"
        @click="select('liver')"
        @keydown.enter.prevent="select('liver')"
        @keydown.space.prevent="select('liver')"
      >
        <circle
          v-if="selectedId === 'liver'"
          :cx="RING_CENTER.liver.x" :cy="RING_CENTER.liver.y" :r="RING_RADIUS.liver"
          fill="none" stroke="#4e7d61" stroke-width="3" stroke-dasharray="10 8" opacity="0.7"
        />
        <path
          d="M190 356 C 204 344 226 340 246 344 C 263 347 278 355 288 364 C 294 370 296 377 293 384 C 290 392 281 398 269 401 C 251 406 229 406 213 400 C 199 395 190 384 188 372 C 187 364 187 360 190 356 Z"
          fill="url(#bm-liver)" stroke="#7e1f2e" stroke-width="3.4" stroke-linejoin="round"
        />
        <!-- 右叶隆起高光与镰状韧带 -->
        <path d="M258 360 C 270 364 278 370 278 378 C 278 385 270 390 260 389 C 264 380 263 369 258 360 Z" fill="#d08a92" opacity="0.3" />
        <path d="M170 390 C 194 400 222 404 250 400" fill="none" stroke="#6d1a26" stroke-width="6" opacity="0.16" stroke-linecap="round" />
        <path d="M232 344 C 230 364 228 384 225 402" fill="none" stroke="#8f2c3b" stroke-width="2.2" opacity="0.55" />
        <circle cx="200" cy="372" r="1.7" fill="#5f1721" opacity="0.28" />
        <circle cx="214" cy="386" r="1.4" fill="#5f1721" opacity="0.24" />
        <circle cx="188" cy="386" r="1.3" fill="#5f1721" opacity="0.22" />
        <circle cx="242" cy="378" r="1.4" fill="#5f1721" opacity="0.2" />
        <!-- 胆囊 -->
        <ellipse cx="250" cy="400" rx="9" ry="5.6" fill="#7fae8e" stroke="#4f7d60" stroke-width="2" transform="rotate(-18 250 400)" />
        <path d="M182 362 C 200 354 222 352 242 356" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.28" />
        <title>{{ titleOf('liver') }}</title>
      </g>

      <!-- ============ 胃（膈下偏观察者右） ============ -->
      <g
        class="organ clickable"
        :class="{ selected: selectedId === 'stomach', dimmed: Boolean(dimId) && dimId !== 'stomach' }"
        role="button"
        tabindex="0"
        :aria-label="titleOf('stomach')"
        @click="select('stomach')"
        @keydown.enter.prevent="select('stomach')"
        @keydown.space.prevent="select('stomach')"
      >
        <circle
          v-if="selectedId === 'stomach'"
          :cx="RING_CENTER.stomach.x" :cy="RING_CENTER.stomach.y" :r="RING_RADIUS.stomach"
          fill="none" stroke="#4e7d61" stroke-width="3" stroke-dasharray="10 8" opacity="0.7"
        />
        <path d="M297 338 C 297 344 299 349 302 353" fill="none" stroke="#7e1f2e" stroke-width="11" stroke-linecap="round" />
        <path d="M297 338 C 297 344 299 349 302 353" fill="none" stroke="url(#bm-trachea)" stroke-width="7" stroke-linecap="round" />
        <path
          d="M292 348 C 304 342 319 345 328 354 C 337 364 341 378 338 392 C 335 406 326 415 312 418 C 300 420 292 414 290 405 C 288 397 292 390 297 385 C 301 381 300 374 296 371 C 289 365 287 356 292 348 Z"
          fill="url(#bm-stomach)" stroke="#7e1f2e" stroke-width="3.2" stroke-linejoin="round"
        />
        <path d="M290 405 C 285 414 284 422 286 430" fill="none" stroke="#7e1f2e" stroke-width="11" stroke-linecap="round" />
        <path d="M290 405 C 285 414 284 422 286 430" fill="none" stroke="url(#bm-stomach)" stroke-width="7" stroke-linecap="round" />
        <path d="M304 358 C 312 366 316 378 314 390" fill="none" stroke="#b4515f" stroke-width="2.2" opacity="0.45" stroke-linecap="round" />
        <path d="M298 396 C 302 402 307 407 313 409" fill="none" stroke="#b4515f" stroke-width="2" opacity="0.4" stroke-linecap="round" />
        <path d="M305 357 C 312 365 315 377 313 387" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35" />
        <title>{{ titleOf('stomach') }}</title>
      </g>

      <!-- ============ 大肠（框形）+ 小肠（盘曲） ============ -->
      <g class="organ ctx">
        <path
          d="M210 456 C 210 442 210 432 212 426 C 228 419 250 416 262 418 C 278 420 296 424 302 434 C 306 446 306 456 304 466 C 300 478 288 485 274 486 C 252 488 234 484 224 474 C 216 466 212 460 210 456"
          fill="none" stroke="#7e1f2e" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"
        />
        <path
          d="M210 456 C 210 442 210 432 212 426 C 228 419 250 416 262 418 C 278 420 296 424 302 434 C 306 446 306 456 304 466 C 300 478 288 485 274 486 C 252 488 234 484 224 474 C 216 466 212 460 210 456"
          fill="none" stroke="url(#bm-intestine)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"
        />
        <path
          d="M210 456 C 210 442 210 432 212 426 C 228 419 250 416 262 418 C 278 420 296 424 302 434 C 306 446 306 456 304 466 C 300 478 288 485 274 486 C 252 488 234 484 224 474 C 216 466 212 460 210 456"
          fill="none" stroke="#b95769" stroke-width="15" stroke-dasharray="3 12" opacity="0.5" stroke-linecap="round"
        />
        <g fill="none" stroke-linecap="round">
          <path d="M224 456 C 226 442 240 436 249 446 C 257 454 253 466 243 469" stroke="#7e1f2e" stroke-width="16" />
          <path d="M244 470 C 246 456 260 448 271 456 C 280 463 276 475 266 478" stroke="#7e1f2e" stroke-width="16" />
          <path d="M268 480 C 272 466 286 458 297 466 C 306 473 302 482 292 484" stroke="#7e1f2e" stroke-width="16" />
          <path d="M224 456 C 226 442 240 436 249 446 C 257 454 253 466 243 469" stroke="url(#bm-intestine)" stroke-width="11" />
          <path d="M244 470 C 246 456 260 448 271 456 C 280 463 276 475 266 478" stroke="url(#bm-intestine)" stroke-width="11" />
          <path d="M268 480 C 272 466 286 458 297 466 C 306 473 302 482 292 484" stroke="url(#bm-intestine)" stroke-width="11" />
        </g>
        <path d="M216 428 C 240 421 276 421 300 432" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.3" />
      </g>

      <!-- ============ 肾脏（肾门 + 输尿管；绘制在肠管之前便于观察） ============ -->
      <g
        class="organ clickable"
        :class="{ selected: selectedId === 'kidney', dimmed: Boolean(dimId) && dimId !== 'kidney' }"
        role="button"
        tabindex="0"
        :aria-label="titleOf('kidney')"
        @click="select('kidney')"
        @keydown.enter.prevent="select('kidney')"
        @keydown.space.prevent="select('kidney')"
      >
        <circle
          v-if="selectedId === 'kidney'"
          :cx="RING_CENTER.kidney.x" :cy="RING_CENTER.kidney.y" :r="RING_RADIUS.kidney"
          fill="none" stroke="#4e7d61" stroke-width="3" stroke-dasharray="10 8" opacity="0.7"
        />
        <!-- 输尿管（肾门 → 膀胱） -->
        <path d="M220 434 C 228 450 238 462 250 470" fill="none" stroke="#7a5a24" stroke-width="8" stroke-linecap="round" />
        <path d="M300 434 C 292 450 282 462 270 470" fill="none" stroke="#7a5a24" stroke-width="8" stroke-linecap="round" />
        <path d="M220 434 C 228 450 238 462 250 470" fill="none" stroke="#e8c25a" stroke-width="4.4" stroke-linecap="round" />
        <path d="M300 434 C 292 450 282 462 270 470" fill="none" stroke="#e8c25a" stroke-width="4.4" stroke-linecap="round" />
        <!-- 观察者左侧肾脏 -->
        <g>
          <path
            d="M194 402 C 206 397 217 404 219 416 C 220 423 217 429 212 432 C 217 436 221 443 220 452 C 218 465 208 472 197 468 C 186 464 181 452 182 438 C 183 422 186 409 194 402 Z"
            fill="url(#bm-kidney)" stroke="#7e1f2e" stroke-width="3.2" stroke-linejoin="round"
          />
          <path d="M197 416 C 205 413 212 418 213 426 C 214 434 209 442 201 442 C 193 442 188 436 188 428 C 188 422 191 418 197 416 Z" fill="#f0a0a8" opacity="0.32" />
          <circle cx="199" cy="450" r="1.6" fill="#6f1a25" opacity="0.3" />
          <circle cx="207" cy="458" r="1.3" fill="#6f1a25" opacity="0.25" />
          <path d="M190 416 C 187 430 187 444 191 456" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.35" />
        </g>
        <!-- 观察者右侧肾脏 -->
        <g transform="translate(520,0) scale(-1,1)">
          <path
            d="M194 402 C 206 397 217 404 219 416 C 220 423 217 429 212 432 C 217 436 221 443 220 452 C 218 465 208 472 197 468 C 186 464 181 452 182 438 C 183 422 186 409 194 402 Z"
            fill="url(#bm-kidney)" stroke="#7e1f2e" stroke-width="3.2" stroke-linejoin="round"
          />
          <path d="M197 416 C 205 413 212 418 213 426 C 214 434 209 442 201 442 C 193 442 188 436 188 428 C 188 422 191 418 197 416 Z" fill="#f0a0a8" opacity="0.22" />
          <path d="M190 416 C 187 430 187 444 191 456" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.28" />
        </g>
        <title>{{ titleOf('kidney') }}</title>
      </g>

      <!-- ============ 膀胱（盆腔中央） ============ -->
      <g class="organ ctx">
        <path d="M260 484 L 260 498" stroke="#7e1f2e" stroke-width="9" stroke-linecap="round" />
        <path d="M260 484 L 260 498" stroke="url(#bm-bladder)" stroke-width="5" stroke-linecap="round" />
        <ellipse cx="260" cy="470" rx="21" ry="15" fill="url(#bm-bladder)" stroke="#7e1f2e" stroke-width="3" />
        <path d="M247 462 C 251 456 260 455 268 459" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.4" />
      </g>

      <!-- ============ 可探索器官的引导光环 ============ -->
      <circle
        v-for="id in explorable"
        :key="`halo-${id}`"
        :cx="HALO[id].x" :cy="HALO[id].y" :r="HALO[id].r"
        fill="none" stroke="#4e7d61" stroke-width="2.5"
      >
        <animate attributeName="r" :values="`${HALO[id].r}; ${HALO[id].r + 14}; ${HALO[id].r}`" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.05;0.5" dur="2.8s" repeatCount="indefinite" />
      </circle>
      </g>
      </g>
    </svg>
    <figcaption class="body-map-caption">
      点击器官，放大并观看它的工作过程；肾脏位于腹膜后，为确保可读性绘制在肠管之前。
    </figcaption>
  </figure>
</template>

<style scoped>
.body-map {
  position: relative;
  width: 100%;
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f3e9;
  border: 1px solid var(--line);
}

.figure-svg {
  display: block;
  width: 100%;
  height: auto;
}

/* 纸面颗粒（feTurbulence 生成，程序生成无外部素材） */
.body-map::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='9'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23p)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

.organ {
  transition: opacity 0.45s ease;
}

.organ.ctx {
  pointer-events: none;
}

.organ.clickable {
  cursor: pointer;
  outline: none;
}

.organ.clickable:hover,
.organ.clickable:focus-visible {
  opacity: 0.84;
}

.organ.dimmed {
  opacity: 0.14;
}

.body-map-caption {
  margin: 0;
  padding: 9px 14px 11px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-dim);
  text-align: center;
  border-top: 1px solid #efe6d5;
  background: #fbf7ef;
}
</style>
