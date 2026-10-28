import fs from 'node:fs';
import path from 'node:path';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import organsRouter from './routes/organs';
import { errorHandler, notFoundHandler } from './middleware/error';

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const MEDIA_DIR = path.resolve(__dirname, '../public/media');
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');

export function createApp(): Express {
  const app = express();

  // helmet 基础安全头。此处关闭 CSP / COEP 以便托管前端构建产物与媒体文件；
  // 生产环境如需更严格策略，可按需收紧。
  app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
  app.use(cors({ origin: allowedOrigins }));
  // 仅记录方法/路径/状态码等访问日志，不记录请求体，不记录任何用户敏感信息
  app.use(
    morgan('tiny', {
      skip: (req) => req.url === '/api/health',
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  /** GET /api/health 健康检查 */
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/organs', organsRouter);

  // 科普媒体静态资源（占位视频、说明文件等；缺失时前端自动降级为动画占位）
  app.use('/media', express.static(MEDIA_DIR, { maxAge: '1d', fallthrough: true }));

  // 若已构建前端（client/dist），可选由后端统一托管（SPA 回退到 index.html）
  const clientIndex = path.join(CLIENT_DIST, 'index.html');
  if (fs.existsSync(clientIndex)) {
    app.use(express.static(CLIENT_DIST));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/media')) {
        next();
        return;
      }
      res.sendFile(clientIndex);
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
