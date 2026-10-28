import { Router } from 'express';
import { organs } from '../data/organs';
import type { OrganSummary } from '../types';

const router = Router();

/**
 * GET /api/organs
 * 器官摘要列表：id、name、emoji、summary、available、stageCount
 */
router.get('/', (_req, res) => {
  const summaries: OrganSummary[] = organs.map((organ) => ({
    id: organ.id,
    name: organ.name,
    emoji: organ.emoji,
    summary: organ.summary,
    available: organ.available,
    stageCount: organ.stages.length,
  }));
  res.json(summaries);
});

/**
 * GET /api/organs/:organId
 * 单个器官完整科普数据（含 stages 工作流阶段数组）
 */
router.get('/:organId', (req, res) => {
  const organ = organs.find((item) => item.id === req.params.organId);
  if (!organ) {
    res.status(404).json({ error: 'Not Found' });
    return;
  }
  res.json(organ);
});

export default router;
