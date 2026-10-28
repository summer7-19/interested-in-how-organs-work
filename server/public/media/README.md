# 媒体资源目录（server/public/media）

此目录中的文件通过 `GET /media/<文件名>` 静态访问（开发环境由 Vite 代理到 3001 端口）。

## 放置视频（可选）

当前所有动画均由前端 Three.js / CSS 程序化生成，**不依赖任何第三方素材**，
因此此目录默认为空也能正常运行。

如果某个工作流阶段在 `server/src/data/organs.ts` 中配置了
`mediaType: "video"` 与 `mediaSrc`（如 `/media/lung-breathing.mp4`），
请将对应 mp4 文件放到本目录。文件缺失或加载失败时，前端会自动降级为
Three.js / CSS 占位动画，不会阻塞页面主流程。

## 素材许可要求

引入任何外部素材前必须记录来源与许可（优先 CC0 / CC BY 或自制素材），
并在此表格登记：

| 文件名 | 来源 | 许可 | 链接 |
| ------ | ---- | ---- | ---- |
| （示例）lung-breathing.mp4 | 自制 | CC0 | - |
