<script setup lang="ts">
import { ref, watch } from 'vue';

/**
 * 视频播放器（preload="metadata"）。
 * 视频加载失败时向上抛出 media-error，由父组件降级为 Three.js/CSS 动画占位。
 */
const props = defineProps<{
  src: string;
  playing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'media-error', message: string): void;
  (e: 'ended'): void;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);

watch(
  () => props.playing,
  (playing) => {
    const video = videoRef.value;
    if (!video) return;
    if (playing) void video.play().catch(() => undefined); // 自动播放被浏览器拦截时静默忽略
    else video.pause();
  },
);

function onError(): void {
  emit('media-error', '视频资源不可用');
}

function onEnded(): void {
  emit('ended');
}
</script>

<template>
  <div class="video-player">
    <video
      ref="videoRef"
      :src="src"
      controls
      preload="metadata"
      playsinline
      @error="onError"
      @ended="onEnded"
    ></video>
  </div>
</template>

<style scoped>
.video-player {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--media-bg);
}

.video-player video {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}
</style>
