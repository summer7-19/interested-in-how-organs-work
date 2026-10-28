<script setup lang="ts">
import type { WorkflowStage } from '../types/organ';

defineProps<{
  stages: WorkflowStage[];
  current: number;
  playing: boolean;
}>();

defineEmits<{
  (e: 'select', index: number): void;
}>();
</script>

<template>
  <div class="timeline" role="tablist" aria-label="工作流阶段时间轴">
    <button
      v-for="(stage, index) in stages"
      :key="stage.id"
      type="button"
      class="tl-node"
      :class="{ active: index === current, done: index < current }"
      role="tab"
      :aria-selected="index === current"
      @click="$emit('select', index)"
    >
      <span class="tl-dot"></span>
      <!-- 当前阶段：自动推进进度细线（时长 = durationSec，暂停时冻结） -->
      <span
        v-if="index === current"
        class="tl-progress"
        :style="{
          animationDuration: `${Math.max(3, stage.durationSec)}s`,
          animationPlayState: playing ? 'running' : 'paused',
        }"
      ></span>
      <span class="tl-title">{{ stage.title }}</span>
    </button>
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  overflow-x: auto;
  padding: 4px 2px 2px;
}

.tl-node {
  position: relative;
  flex: 1 0 auto;
  min-width: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 4px 6px 6px;
  cursor: pointer;
  font-family: inherit;
}

/* 节点之间的细连接线 */
.tl-node::before {
  content: '';
  position: absolute;
  top: 10px;
  left: calc(50% + 12px);
  width: calc(100% - 24px);
  height: 2px;
  background: var(--line-strong);
}

.tl-node:last-child::before {
  display: none;
}

/* 小圆点：当前阶段纯色填充 */
.tl-dot {
  position: relative;
  z-index: 1;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--panel);
  border: 2px solid var(--line-strong);
  transition: background 0.15s ease, border-color 0.15s ease;
}

.tl-node.done .tl-dot {
  border-color: var(--accent);
  background: var(--accent-tint);
}

.tl-node.active .tl-dot {
  border-color: var(--accent);
  background: var(--accent);
}

/* 当前阶段的推进进度：细线、纯色 */
.tl-progress {
  position: absolute;
  top: 21px;
  left: 50%;
  margin-left: -36px;
  width: 72px;
  max-width: 80%;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
  transform-origin: center;
  transform: scaleX(0);
  animation-name: tl-grow;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes tl-grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.tl-title {
  font-size: 12px;
  color: var(--text-dim);
  white-space: nowrap;
}

.tl-node.active .tl-title {
  color: var(--accent-dark);
  font-weight: 600;
}
</style>
