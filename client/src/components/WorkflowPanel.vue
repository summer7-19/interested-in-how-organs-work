<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useOrganStore } from '../stores/organStore';
import { useWorkflowPlayer } from '../composables/useWorkflowPlayer';
import OrganInfoCard from './OrganInfoCard.vue';
import WorkflowTimeline from './WorkflowTimeline.vue';
import AnatomyViewer from './AnatomyViewer.vue';
import ParticleFlow from './ParticleFlow.vue';
import VideoPlayer from './VideoPlayer.vue';

const store = useOrganStore();
const player = useWorkflowPlayer();

const stage = computed(() => store.currentStage);
const mediaKey = computed(() => (stage.value ? `${store.selectedOrganId}-${stage.value.id}` : 'none'));

// 视频加载失败时降级为动画占位；阶段切换后重置降级状态
const videoFailed = ref(false);
watch(
  () => stage.value?.id,
  () => {
    videoFailed.value = false;
  },
);

function resolveMediaSrc(src: string): string {
  return /^https?:\/\//.test(src) || src.startsWith('/') ? src : `/media/${src}`;
}
</script>

<template>
  <section class="panel workflow-panel">
    <!-- 骨架屏 -->
    <div v-if="store.detailLoading && !store.selectedOrgan" class="skeleton-wrap" aria-busy="true">
      <div class="skeleton sk-line w40"></div>
      <div class="skeleton sk-line w90"></div>
      <div class="skeleton sk-block"></div>
      <div class="skeleton sk-line w70"></div>
    </div>

    <template v-else-if="store.selectedOrgan">
      <OrganInfoCard :organ="store.selectedOrgan" />

      <template v-if="store.isCurrentAvailable">
        <WorkflowTimeline
          :stages="store.stages"
          :current="store.workflowStage"
          :playing="store.isPlaying"
          @select="store.setStage"
        />

        <!-- 媒体区域：按阶段 mediaType 切换（视频 / Three.js 动画 / 粒子动画） -->
        <div class="stage-media">
          <template v-if="stage">
            <div v-if="stage.mediaType === 'video' && stage.mediaSrc && !videoFailed" class="media-slot">
              <VideoPlayer
                :key="mediaKey"
                :src="resolveMediaSrc(stage.mediaSrc)"
                :playing="store.isPlaying"
                @media-error="videoFailed = true"
                @ended="player.next"
              />
            </div>
            <div v-else-if="stage.mediaType === 'video' && videoFailed" class="media-slot">
              <p class="media-note">⚠️ 视频资源不可用（{{ stage.mediaSrc }}），已切换为动画占位。</p>
              <AnatomyViewer preset="lung-breathing" :playing="store.isPlaying" />
            </div>
            <AnatomyViewer
              v-else-if="stage.mediaType === 'three'"
              :key="mediaKey"
              :preset="stage.particlePreset ?? 'lung-breathing'"
              :playing="store.isPlaying"
            />
            <ParticleFlow
              v-else-if="stage.mediaType === 'particle'"
              :key="mediaKey"
              :preset="stage.particlePreset ?? 'rbc-flow'"
              :playing="store.isPlaying"
            />
            <div v-else class="media-placeholder"><span>🎞 本阶段媒体内容筹备中</span></div>
          </template>
        </div>

        <!-- 科普文案 -->
        <div v-if="stage" class="stage-copy">
          <h3 class="stage-title">
            <span class="stage-order">阶段 {{ stage.order }}</span>
            {{ stage.title }}
          </h3>
          <p class="stage-desc">{{ stage.description }}</p>
          <p class="key-point"><strong>💡 关键点：</strong>{{ stage.keyPoint }}</p>
        </div>

        <!-- 播放控制 -->
        <div class="stage-controls">
          <button class="btn" type="button" @click="player.prev">⏮ 上一阶段</button>
          <button class="btn primary" type="button" @click="player.toggle">
            {{ store.isPlaying ? '⏸ 暂停' : '▶ 播放' }}
          </button>
          <button class="btn" type="button" @click="player.next">下一阶段 ⏭</button>
        </div>
      </template>

      <!-- 内容筹备中（available=false 或 stages 为空） -->
      <div v-else class="coming-soon">
        <p class="coming-emoji">🚧</p>
        <p><strong>「{{ store.selectedOrgan.name }}」内容筹备中</strong></p>
        <p class="coming-hint">工作流动画与讲解正在制作，敬请期待。可点击左上角「返回人体图」，先探索已上线的「肺」。</p>
      </div>
    </template>

    <div v-else class="empty-hint">
      <p class="coming-emoji">🫁</p>
      <p>点击人体图上的器官，开始探索它的"工作流"。</p>
    </div>

    <p v-if="store.error" class="inline-error">⚠️ {{ store.error }}</p>
  </section>
</template>

<style scoped>
.workflow-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 420px;
  min-width: 0;
}

.media-slot {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.media-note {
  margin: 0;
  font-size: 12.5px;
  color: var(--warn);
}

.media-placeholder {
  aspect-ratio: 16 / 9;
  display: grid;
  place-items: center;
  border: 1px dashed var(--line-strong);
  border-radius: 12px;
  color: var(--text-dim);
  font-size: 13.5px;
  background: var(--media-bg);
}

.stage-title {
  margin: 0 0 6px;
  font-size: 17px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stage-order {
  font-size: 11.5px;
  color: var(--accent-dark);
  border: 1px solid var(--accent);
  background: var(--accent-tint);
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
}

.stage-desc {
  margin: 0 0 10px;
  color: var(--text-dim);
  line-height: 1.9;
  font-size: 14px;
  max-width: 640px;
}

.key-point {
  margin: 0;
  padding: 10px 12px;
  border-left: 3px solid var(--accent);
  background: var(--accent-tint);
  border-radius: 0 9px 9px 0;
  font-size: 13.5px;
  line-height: 1.8;
  max-width: 640px;
}

.stage-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.coming-soon {
  padding: 30px 0;
}
</style>
