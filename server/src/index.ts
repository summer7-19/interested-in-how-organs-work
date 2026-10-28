import path from 'node:path';
import http from 'node:http';
import dotenv from 'dotenv';
import { createApp } from './app';

// 显式指向 server/.env，避免受启动时工作目录影响
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? '0.0.0.0';

const app = createApp();
const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`[organ-workflow] API server: http://localhost:${PORT}`);
  console.log(`[organ-workflow] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[organ-workflow] CORS CLIENT_ORIGIN: ${process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'}`);
});

function shutdown(): void {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 3000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
