import { defineStore } from 'pinia';
import { fetchOrganDetail, fetchOrgans } from '../services/api';
import type { Organ, OrganSummary, WorkflowStage } from '../types/organ';

interface OrganState {
  organs: OrganSummary[];
  selectedOrganId: string | null;
  selectedOrgan: Organ | null;
  /** 当前工作流阶段下标（0-based） */
  workflowStage: number;
  isPlaying: boolean;
  /** 器官列表加载中 */
  loading: boolean;
  /** 器官详情加载中 */
  detailLoading: boolean;
  error: string | null;
}

function toMessage(err: unknown): string {
  return err instanceof Error ? err.message : '未知错误，请稍后重试';
}

export const useOrganStore = defineStore('organ', {
  state: (): OrganState => ({
    organs: [],
    selectedOrganId: null,
    selectedOrgan: null,
    workflowStage: 0,
    isPlaying: false,
    loading: false,
    detailLoading: false,
    error: null,
  }),

  getters: {
    stages: (state): WorkflowStage[] => state.selectedOrgan?.stages ?? [],
    stageCount(): number {
      return this.stages.length;
    },
    currentStage: (state): WorkflowStage | null => state.selectedOrgan?.stages[state.workflowStage] ?? null,
    /** 当前器官是否有可播放的完整工作流 */
    isCurrentAvailable: (state): boolean =>
      Boolean(state.selectedOrgan?.available && state.selectedOrgan.stages.length > 0),
  },

  actions: {
    async fetchOrgans(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        this.organs = await fetchOrgans();
      } catch (err) {
        this.error = toMessage(err);
      } finally {
        this.loading = false;
      }
    },

    async fetchOrganDetail(organId: string): Promise<void> {
      this.detailLoading = true;
      this.error = null;
      try {
        const organ = await fetchOrganDetail(organId);
        // 等待期间用户可能已切换到其他器官，丢弃过期响应
        if (this.selectedOrganId !== organId) return;
        this.selectedOrgan = organ;
        this.workflowStage = 0;
        // 有完整工作流的器官自动开始播放动画
        this.isPlaying = organ.available && organ.stages.length > 0;
      } catch (err) {
        if (this.selectedOrganId === organId) {
          this.error = toMessage(err);
          this.isPlaying = false;
        }
      } finally {
        this.detailLoading = false;
      }
    },

    async selectOrgan(organId: string): Promise<void> {
      if (!organId) return;
      this.selectedOrganId = organId;
      this.selectedOrgan = null;
      this.workflowStage = 0;
      this.isPlaying = false;
      await this.fetchOrganDetail(organId);
    },

    setStage(index: number): void {
      const count = this.stageCount;
      if (count === 0) return;
      const clamped = Math.min(Math.max(index, 0), count - 1);
      if (clamped === this.workflowStage) return;
      this.workflowStage = clamped;
    },

    nextStage(): void {
      if (this.stageCount === 0) return;
      this.setStage((this.workflowStage + 1) % this.stageCount);
    },

    prevStage(): void {
      if (this.stageCount === 0) return;
      this.setStage((this.workflowStage - 1 + this.stageCount) % this.stageCount);
    },

    togglePlay(): void {
      if (!this.isCurrentAvailable) return;
      this.isPlaying = !this.isPlaying;
    },

    clearError(): void {
      this.error = null;
    },
  },
});
