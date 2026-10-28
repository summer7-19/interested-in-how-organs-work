<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useParticleFlow } from '../composables/useParticleFlow';

/**
 * 红细胞运氧粒子动画区域（16:9，避免布局跳动）。
 * 粒子颜色随路径位置变化：肺泡附近鲜红（富氧），组织附近暗红（缺氧）。
 */
const props = withDefaults(
  defineProps<{
    preset?: string;
    playing?: boolean;
  }>(),
  { preset: 'rbc-flow', playing: true },
);

const containerRef = ref<HTMLDivElement | null>(null);
const flow = useParticleFlow(containerRef, computed(() => props.playing));

onMounted(() => flow.init());
onUnmounted(() => flow.dispose());

const isFailed = computed(() => flow.failed.value);
</script>

<template>
  <div class="particle-flow">
    <div ref="containerRef" class="particle-canvas-host" aria-hidden="true"></div>

    <!-- WebGL 不可用时的 CSS 占位动画 -->
    <div v-if="isFailed" class="particle-fallback">
      <p>当前环境不支持 WebGL，已切换为 CSS 占位动画</p>
      <div class="fallback-dots" aria-hidden="true">
        <span v-for="n in 8" :key="n" class="fallback-dot" :style="{ animationDelay: `${n * 0.18}s` }"></span>
      </div>
    </div>

    <div class="particle-legend">
      <span class="legend-item"><i class="dot dot-o2"></i>肺泡处装氧 → 鲜红</span>
      <span class="legend-item"><i class="dot dot-co2"></i>组织处卸氧 → 暗红</span>
    </div>
  </div>
</template>

<style scoped>
.particle-flow {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f3e9; /* 与 Three.js 场景背景一致的纸底色 */
  border: 1px solid var(--line);
}

/* 纸面颗粒（feTurbulence 生成，平铺叠加，程序生成无外部素材） */
.particle-flow::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.09;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='9'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23p)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

.particle-canvas-host {
  position: absolute;
  inset: 0;
}

.particle-canvas-host :deep(canvas) {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
}

.particle-legend {
  position: absolute;
  top: 10px;
  left: 12px;
  right: 12px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  pointer-events: none;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-dim);
  background: var(--panel);
  padding: 4px 9px;
  border-radius: 999px;
  border: 1px solid var(--line);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot-o2 {
  background: #e06368; /* 柔和鲜红＝富氧 */
}

.dot-co2 {
  background: #8a3c42; /* 柔和暗红＝缺氧 */
}

.particle-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.particle-fallback p {
  font-size: 12px;
  color: var(--text-dim);
  margin: 0;
}

.fallback-dots {
  display: flex;
  gap: 8px;
}

.fallback-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #8a3c42;
  animation: dot-color 3s ease-in-out infinite;
}

@keyframes dot-color {
  0%,
  100% {
    background: #8a3c42;
  }
  45% {
    background: #e06368;
  }
}
</style>
