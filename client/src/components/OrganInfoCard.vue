<script setup lang="ts">
import type { Organ } from '../types/organ';

defineProps<{ organ: Organ }>();
</script>

<template>
  <div class="organ-card">
    <div class="organ-head">
      <span class="organ-emoji">{{ organ.emoji }}</span>
      <div class="organ-text">
        <h2 class="organ-name">{{ organ.name }}</h2>
        <p class="organ-summary">{{ organ.summary }}</p>
      </div>
      <span class="badge" :class="organ.available ? 'badge-ok' : 'badge-wip'">
        {{ organ.available ? '可探索' : '内容筹备中' }}
      </span>
    </div>
    <p v-if="!organ.available || organ.stages.length === 0" class="organ-wip">
      🚧 该器官的工作流内容正在筹备中，敬请期待。可先返回人体图，探索已上线的「肺」工作流。
    </p>
  </div>
</template>

<style scoped>
.organ-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.organ-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.organ-emoji {
  font-size: 34px;
  line-height: 1;
}

.organ-text {
  flex: 1;
  min-width: 0;
}

.organ-name {
  margin: 0 0 4px;
  font-size: 20px;
}

.organ-summary {
  margin: 0;
  color: var(--text-dim);
  font-size: 13.5px;
  line-height: 1.7;
}

.badge {
  margin-left: auto;
}

.organ-wip {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--warn-line);
  background: var(--warn-tint);
  color: var(--warn);
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.8;
}
</style>
