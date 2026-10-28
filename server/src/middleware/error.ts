import type { NextFunction, Request, Response } from 'express';

/** 兜底 404：所有未匹配路由（含 /api/*）返回统一 JSON */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: 'Not Found' });
}

/**
 * 统一错误处理：对外只返回安全的固定文案，不泄露堆栈与内部细节；
 * 详细错误仅打印到服务端日志。
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[server] Unhandled error:', err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({ error: 'Internal Server Error' });
}
