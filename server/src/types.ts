/**
 * 后端数据类型定义。
 * 本站仅提供公众科普内容，不包含任何诊断、治疗或个体化建议数据。
 */

export type MediaType = 'video' | 'three' | 'particle';

/** 工作流阶段 */
export interface WorkflowStage {
  id: string;
  /** 展示顺序，从 1 开始 */
  order: number;
  title: string;
  /** 2–3 句通俗解释 */
  description: string;
  /** 一个"关键点"摘要 */
  keyPoint: string;
  /** 建议停留时长（秒），用于自动推进与时间轴进度 */
  durationSec: number;
  /** 媒体类型：视频 / Three.js 动画 / 粒子动画 */
  mediaType: MediaType;
  /** 可选，相对路径如 /media/lung-breathing.mp4（文件缺失时前端自动降级为动画占位） */
  mediaSrc?: string;
  /** 可选，预设名；particle 类型用粒子预设，three 类型用作 Three.js 场景预设 */
  particlePreset?: string;
}

/** 器官完整科普数据 */
export interface Organ {
  id: string;
  name: string;
  emoji: string;
  summary: string;
  /** false 表示内容筹备中（stages 可能为空数组），前端展示"内容筹备中" */
  available: boolean;
  stages: WorkflowStage[];
}

/** 器官摘要（列表接口返回） */
export interface OrganSummary {
  id: string;
  name: string;
  emoji: string;
  summary: string;
  available: boolean;
  stageCount: number;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

export interface ApiError {
  error: string;
}
