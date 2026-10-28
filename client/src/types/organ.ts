/** 与后端 server/src/types.ts 保持一致的数据模型 */

export type MediaType = 'video' | 'three' | 'particle';

export interface WorkflowStage {
  id: string;
  order: number;
  title: string;
  description: string;
  keyPoint: string;
  durationSec: number;
  mediaType: MediaType;
  mediaSrc?: string;
  particlePreset?: string;
}

export interface Organ {
  id: string;
  name: string;
  emoji: string;
  summary: string;
  available: boolean;
  stages: WorkflowStage[];
}

export interface OrganSummary {
  id: string;
  name: string;
  emoji: string;
  summary: string;
  available: boolean;
  stageCount: number;
}
