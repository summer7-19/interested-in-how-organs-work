<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrganStore } from '../stores/organStore';
import BodyMap from '../components/BodyMap.vue';
import WorkflowPanel from '../components/WorkflowPanel.vue';

/**
 * 探索页：人体主图 → 点击器官放大 → 工作流演示。
 * - main：展示人体主图，器官可点击（可探索器官带引导光环）
 * - zooming：以被点器官为中心放大过渡（约 0.7s），其他器官淡出
 * - detail：进入该器官的工作流演示（/organ/:organId 深链直接进入此阶段）
 */
const route = useRoute();
const router = useRouter();
const store = useOrganStore();

type Phase = 'main' | 'zooming' | 'detail';

const phase = ref<Phase>('main');
const zoomTargetId = ref<string | null>(null);
const zoomStyle = ref<Record<string, string>>({});
let zoomPending = false;
let zoomTimer: ReturnType<typeof setTimeout> | null = null;

function organIdFromRoute(): string {
  const value = route.params.organId;
  return typeof value === 'string' ? value : '';
}

onMounted(async () => {
  if (store.organs.length === 0) await store.fetchOrgans();
  const id = organIdFromRoute();
  if (id) {
    if (id !== store.selectedOrganId) await store.selectOrgan(id);
    phase.value = 'detail'; // 深链访问：直接进入放大后的演示视图
  }
});

watch(
  () => route.params.organId,
  (value) => {
    const id = typeof value === 'string' ? value : '';
    if (id) {
      if (id !== store.selectedOrganId) void store.selectOrgan(id);
      if (!zoomPending) phase.value = 'detail';
    } else {
      zoomPending = false;
      if (zoomTimer !== null) {
        clearTimeout(zoomTimer);
        zoomTimer = null;
      }
      phase.value = 'main';
    }
  },
);

function handleSelection(organId: string, focus: { xp: number; yp: number; k: number }): void {
  if (phase.value !== 'main') return;
  zoomTargetId.value = organId;
  zoomStyle.value = {
    transformOrigin: `${focus.xp}% ${focus.yp}%`,
    '--zk': String(focus.k),
  };
  zoomPending = true;
  phase.value = 'zooming';
  void router.push(`/organ/${organId}`);
  zoomTimer = setTimeout(() => {
    zoomTimer = null;
    zoomPending = false;
    phase.value = organIdFromRoute() === organId ? 'detail' : 'main';
  }, 720);
}

function goBack(): void {
  void router.push('/');
}

async function retry(): Promise<void> {
  if (store.organs.length === 0) await store.fetchOrgans();
  const id = store.selectedOrganId ?? organIdFromRoute();
  if (id) await store.selectOrgan(id);
  else await store.fetchOrgans();
}
</script>

<template>
  <main class="explorer-stage">
    <!-- 主图：人体图版，点击器官放大 -->
    <template v-if="phase !== 'detail'">
      <div class="main-stage" :class="{ zooming: phase === 'zooming' }">
        <div class="figure-wrap" :style="zoomStyle">
          <BodyMap
            :organs="store.organs"
            :selected-id="store.selectedOrganId"
            :dim-id="phase === 'zooming' ? zoomTargetId : null"
            @selection="handleSelection"
          />
        </div>
        <p v-if="store.error && store.organs.length === 0" class="error-box">
          ⚠️ {{ store.error }}
          <button class="btn" type="button" @click="retry">🔄 重试</button>
        </p>
      </div>
    </template>

    <!-- 放大后的器官工作流演示 -->
    <section v-else class="detail-wrap">
      <div class="detail-top">
        <button class="btn" type="button" @click="goBack">← 返回人体图</button>
      </div>
      <WorkflowPanel />
    </section>
  </main>
</template>

<style scoped>
.main-stage {
  max-width: 620px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.figure-wrap {
  width: 100%;
  transition: transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.45s ease;
  transform: scale(1);
}

.zooming .figure-wrap {
  transform: scale(var(--zk, 2));
}

.zooming .figure-wrap :deep(.body-map) {
  border-color: transparent;
}

.zooming .figure-wrap :deep(.body-map-caption) {
  opacity: 0;
}

.detail-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 980px;
  margin: 0 auto;
  animation: detail-rise 0.35s ease both;
}

@keyframes detail-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
