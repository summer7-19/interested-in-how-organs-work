import { onUnmounted, watch } from 'vue';
import { useOrganStore } from '../stores/organStore';

/**
 * 工作流播放器：包装 store 的播放/暂停/切阶段逻辑，
 * 并在播放状态下按当前阶段 durationSec 自动推进到下一阶段（循环播放）。
 *
 * 定时器等运行状态使用普通变量管理，不进入 Vue 响应式系统。
 */
export function useWorkflowPlayer() {
  const store = useOrganStore();
  let stageTimer: ReturnType<typeof setTimeout> | null = null;

  function clearStageTimer(): void {
    if (stageTimer !== null) {
      clearTimeout(stageTimer);
      stageTimer = null;
    }
  }

  function scheduleStageTimer(): void {
    clearStageTimer();
    if (!store.isPlaying || !store.isCurrentAvailable) return;
    const stage = store.currentStage;
    if (!stage) return;
    stageTimer = setTimeout(() => {
      store.nextStage();
    }, Math.max(3, stage.durationSec) * 1000);
  }

  watch(
    () => [store.isPlaying, store.workflowStage, store.selectedOrganId, store.isCurrentAvailable] as const,
    () => scheduleStageTimer(),
    { immediate: true },
  );

  onUnmounted(clearStageTimer);

  return {
    toggle: () => store.togglePlay(),
    next: () => store.nextStage(),
    prev: () => store.prevStage(),
  };
}
