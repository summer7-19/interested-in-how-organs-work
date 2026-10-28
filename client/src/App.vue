<script setup lang="ts">
import DisclaimerBar from './components/DisclaimerBar.vue';
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <h1 class="app-title">🫁 人体器官工作流科普</h1>
      <p class="app-subtitle">
        在人体图上点击器官 → 放大并分阶段观看它如何运转（程序生成的示意动画，仅用于科普）
      </p>
    </header>
    <router-view />
    <DisclaimerBar />
  </div>
</template>
