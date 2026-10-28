# 人体器官工作流科普（organ-workflow）

面向公众的器官科普网站：选择器官后，展示该器官的**工作流动画、时间轴与分步科普讲解**。
目前六个器官（肺、心脏、肾脏、肝脏、胃、咽喉）均已完成完整工作流：肺 4 个阶段、其余各 3 个阶段，共 19 段程序化 SVG 动画。

> ⚠️ **免责声明**：本网站仅用于公众科普，不构成医疗诊断或治疗建议；所有动画与数字均为示意，不针对任何个体情况。本站不接入任何真实患者数据，不展示诊断结论。

## 技术栈

| 端 | 技术 |
| -- | ---- |
| 前端 | Vue 3（`<script setup lang="ts">`）+ Vite + Pinia + Vue Router + Three.js（红细胞粒子动画）+ 原生 CSS |
| 后端 | Node.js + Express + TypeScript（`tsx` 开发 / `tsc` 构建） |
| 数据 | TypeScript 数据文件（`server/src/data/organs.ts`），无数据库，便于后续替换 |

## 快速开始

环境要求：Node.js ≥ 18（推荐 20+）。

```bash
# 1. 安装根目录与 client/server 全部依赖（npm workspaces）
npm install

# 2. 配置环境变量（可选，有默认值）
cp server/.env.example server/.env

# 3. 一键启动：后端 3001 + 前端 5173（concurrently）
npm run dev
```

启动后：

- 前端：<http://localhost:5173>（直接访问某器官：<http://localhost:5173/organ/lung>）
- 健康检查：<http://localhost:3001/api/health>

## 常用脚本

| 命令 | 说明 |
| ---- | ---- |
| `npm run dev` | 同时启动后端（3001）与前端（5173），热更新 |
| `npm run build` | 先构建后端（`tsc` → `server/dist`），再构建前端（`vue-tsc` 类型检查 + `vite build` → `client/dist`） |
| `npm run start` | 启动后端生产服务；若存在 `client/dist` 则同时托管前端（SPA 回退到 index.html） |
| `npm run typecheck` | 前后端 TypeScript 类型检查 |
| `npm run dev:server` / `npm run dev:client` | 单独启动某一端 |

## 环境变量

**server/.env**（参考 `server/.env.example`）：

| 变量 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `PORT` | `3001` | 后端端口 |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS 允许的前端来源，多个用逗号分隔 |
| `HOST` | `0.0.0.0` | 监听地址 |

**client/.env**（参考 `client/.env.example`，可选）：

| 变量 | 默认值 | 说明 |
| ---- | ------ | ---- |
| `VITE_API_BASE_URL` | `/api` | API 基础路径；开发环境由 Vite 把 `/api`、`/media` 代理到 `http://localhost:3001` |

## API

| 方法 | 路径 | 说明 |
| ---- | ---- | ---- |
| GET | `/api/health` | 健康检查，返回 `{ status: "ok", timestamp }` |
| GET | `/api/organs` | 器官摘要列表（id、name、emoji、summary、available、stageCount） |
| GET | `/api/organs/:organId` | 单个器官完整科普数据（含 `stages` 工作流阶段数组）；不存在返回 404 `{ error: "Not Found" }` |
| GET | `/media/*` | 科普媒体静态文件（`server/public/media`） |

- 统一错误处理：404 → `{ error: "Not Found" }`；500 → `{ error: "Internal Server Error" }`（不泄露堆栈）。
- 安全：`helmet` 基础安全头、`cors` 白名单、`morgan` 仅记录方法/路径/状态码（不记录请求体，不记录用户敏感信息）。
- 后端只提供科普数据与媒体元数据，不提供任何诊断、治疗或个体化建议。

## 目录结构

```
organ-workflow/
├── package.json                 # npm workspaces + concurrently 一键启动
├── README.md
├── client/
│   ├── package.json
│   ├── vite.config.ts           # /api 与 /media 代理到 http://localhost:3001
│   ├── index.html
│   └── src/
│       ├── main.ts / App.vue / style.css
│       ├── router/index.ts      # / 与 /organ/:organId
│       ├── stores/organStore.ts # Pinia：organs / selectedOrganId / selectedOrgan / workflowStage / isPlaying / loading / error
│       ├── services/api.ts      # fetch 封装（VITE_API_BASE_URL，默认 /api）
│       ├── types/organ.ts
│       ├── composables/
│       │   ├── useParticleFlow.ts    # Three.js 红细胞运氧粒子（CatmullRomCurve3 + 颜色随位置变化）
│       │   └── useWorkflowPlayer.ts  # 播放/暂停/自动按 durationSec 推进阶段
│       ├── components/
│       │   ├── BodyMap.vue           # 人体主图（可点击器官 + 放大聚焦点，@selection 式事件接口）
│       │   ├── AnatomyViewer.vue     # 图版容器：按预设分发场景、图例与读屏描述、手绘抖动滤镜
│       │   ├── anatomyPaths.ts       # 肺轮廓/叶间裂/支气管树共享路径
│       │   ├── plates/
│       │   │   ├── HeartPlate.vue    # 心动周期 / 双循环 / 心电传导
│       │   │   ├── KidneyPlate.vue   # 肾小球滤过 / 肾小管重吸收 / 尿液排出
│       │   │   ├── LiverPlate.vue    # 肝小叶 / 糖代谢 / 解毒与胆汁
│       │   │   ├── StomachPlate.vue  # 收纳搅拌 / 胃液消化 / 食糜排空
│       │   │   └── ThroatPlate.vue   # 共用通道 / 会厌 / 声带发声
│       │   ├── ParticleFlow.vue / VideoPlayer.vue
│       │   ├── OrganInfoCard.vue / WorkflowPanel.vue / WorkflowTimeline.vue
│       │   └── DisclaimerBar.vue     # 底部固定免责声明
│       └── views/OrganExplorerView.vue
└── server/
    ├── package.json / tsconfig.json
    ├── public/media/            # 媒体目录（当前为空也能运行，见其中 README）
    └── src/
        ├── index.ts / app.ts
        ├── routes/organs.ts
        ├── data/organs.ts       # 科普内容数据源（在此扩展新器官）
        ├── types.ts
        └── middleware/error.ts
```

## 功能要点

- **人体主图交互**：首页为书籍图版风格的**躯干正面**，外形仿解剖挂图——无头、无双臂、无双腿，颈部上缘与骨盆底缘平切；外轮廓由一条连续闭合曲线构成（颈侧 → 斜方肌 → 肩峰 → 胸侧 → 腰 → 髋），无折角、无左右拼缝；内部器官整体缩小并收拢后按解剖位置摆放气管/支气管、两肺、心脏、肝、肾、输尿管与膀胱；器官采用厚深红描边 + 柔和明暗 + 高光的卡通×解剖画风。点击器官后以该器官为中心**放大过渡**（其他器官淡出、约 0.7s），进入工作流演示；左上角「返回人体图」随时回到主图。可探索器官带呼吸引导光环；`/organ/lung` 深链直接进入演示视图。
- **工作流时间轴**：可点击切换阶段；播放时按每阶段 `durationSec` 自动推进并循环；暂停时进度条冻结。
- **器官科普图版（卡通 × 解剖 SVG 插画）**：全部 19 个场景均为手工绘制的 SVG 图版，深红厚描边、器官渐变着色、内阴影与白色高光兼顾卡通亲和力与科学可读性；SMIL 动画跟随播放/暂停，并尊重系统"减少动态效果"设置；无需 WebGL。
  - **肺**：呼吸运动（肺叶缩放、膈肌升降、肋骨起伏）、气体进入（空气粒子沿气管→支气管→肺运动）、肺泡气体交换（O₂/CO₂ 双向粒子流）、红细胞运氧（Three.js 粒子）。
  - **心脏**：心动周期（四腔切面 + 房室瓣 + 乳头肌，心房先收、心室后收，血流粒子经瓣膜进入大血管）、双循环（肺循环与体循环两条环路首尾相接，蓝色缺氧血/红色富氧血）、心电传导（窦房结→房室结→传导束→普肯耶纤维，配左上角心电图波形）。
  - **肾脏**：肾小球滤过（入球小动脉→毛细血管球→滤液进入肾小囊）、肾小管重吸收（水/葡萄糖/钠离子退回毛细血管，废物留下）、尿液排出（集合管→肾盂→输尿管→膀胱→尿道）。
  - **肝脏**：肝小叶（六边形小叶、门管区、肝血窦与胆汁流向）、糖代谢（饭后合成糖原/空腹分解，血糖粒子双向流动）、解毒与胆汁生成（肝细胞放大、毒素分解并结合为无毒产物、生成胆汁进入胆囊）。
  - **胃**：收纳与搅拌（食管把食团送入胃，蠕动波把食物推向幽门）、胃液与蛋白质初步消化（胃腺的壁细胞分泌盐酸、主细胞分泌胃蛋白酶原，蛋白质被切成多肽，黏液层保护胃壁）、食糜排空（幽门括约肌一张一合，食糜分批进入十二指肠）。
  - **咽喉**：呼吸与吞咽共用通道（蓝色空气粒子走鼻腔→咽→喉→气管，橙色食物粒子走口腔→咽→食管，两条通路在咽交叉）、会厌（吞咽瞬间会厌翻转盖住喉口，避免食物误入气管）、声带振动发声（声带在气流中开合振动，形成声门裂处的疏密波）。
- **红细胞运氧动画（Three.js 粒子）**：粒子沿闭合 `CatmullRomCurve3` 血管环路运动，颜色随路径位置由鲜红（肺泡处装氧）渐变到暗红（组织处卸氧），节点标记脉动，附图例。
- **性能与健壮性**：
  - 每帧读写的动画状态保存在普通 JS 对象中，**不进入 Vue 响应式系统**；
  - 移动端（<768px）自动降低粒子数量（900→320）与像素比；
  - `onUnmounted` 完整销毁 renderer / geometry / material / 纹理 / ResizeObserver / RAF；
  - WebGL 不可用时自动降级为 CSS 占位动画；
  - 视频使用 `preload="metadata"`；媒体文件缺失或加载失败时自动降级为 Three.js/CSS 动画占位，不阻塞主流程；
  - 加载中显示骨架屏，接口失败显示可重试错误状态。
- **视觉**：温和干净的科普读物 / 自然博物馆风（米白纸色背景 + 白色卡片 + 细边框 + 单一柔和暖橙强调色）；界面本身无渐变、无发光、无玻璃拟态（器官插画内部的明暗渐变属于图版画风）；媒体区域固定 16:9 中性浅底，避免布局跳动；移动端单列堆叠。

## 素材与许可

当前页面所有动画与插画均为 **Three.js / SVG（SMIL）/ CSS 程序化生成**，不依赖任何第三方素材（无版权风险）。
如需添加视频，放入 `server/public/media/` 并在数据中配置 `mediaType: "video"` + `mediaSrc`；
所有外部素材必须记录来源与许可（优先 CC0 / CC BY 或自制），登记在 `server/public/media/README.md`。

## 扩展新器官

在 `server/src/data/organs.ts` 的 `organs` 数组追加一个对象即可，前端无需改动：

```ts
{
  id: 'stomach',
  name: '胃',
  emoji: '🥣',
  summary: '一句话功能简介。',
  available: true,
  stages: [
    {
      id: 'stomach-stage-1',
      order: 1,
      title: '阶段标题',
      description: '2–3 句通俗解释（不确定的数字标注"约/示意"）。',
      keyPoint: '一个关键点。',
      durationSec: 15,
      mediaType: 'three',          // video / three / particle
      particlePreset: 'rbc-flow',  // three 场景预设或粒子预设；也可配 mediaSrc 播放视频
    },
  ],
}
```

数据模型（`server/src/types.ts`）：`Organ` = { id, name, emoji, summary, available, stages }；
`WorkflowStage` = { id, order, title, description, keyPoint, durationSec, mediaType, mediaSrc?, particlePreset? }。

## 关于 3D 解剖选择组件（@somakine/vue）

按需求优先评估了 `@somakine/vue`（npm v0.2.0，Vue 3 + Three.js 的 3D 解剖查看器）。它存在且接口良好（含 `@selection` 事件），但**必须搭配单独的 DataPack 资源包**（如 `@somakine/musculoskeletal-basic`，GLB 模型按需加载、不随组件分发），且其结构 ID 与本项目"肺/心/肾/肝"的映射无法离线验证、第三方模型素材许可需先审计。这符合预设的"安装或使用受限"条件，故首期降级为**自定义 SVG 器官选择层**，并保持相同的 `@selection` 式事件接口（`emit('selection', organId)`）；`OrganSelector.vue` 为独立组件，后续替换为 `@somakine/vue` 时无需改动父组件逻辑。

## 关于图形与设计

- **器官图版**：手工绘制的**卡通 × 解剖**风格 SVG 插画——深红厚描边（约 #7e1f2e）、器官渐变着色、内阴影与白色高光兼顾卡通亲和力与科学可读性；肺含支气管树（轮廓裁剪在肺叶内）、肺门动静脉、叶间裂与心切迹，心脏含主动脉弓、肺动脉、腔静脉与冠状血管，气体交换场景为"呼吸性细支气管 + 肺泡 + 毛细血管网 + 红细胞"的呼吸单元图；首页人体主图改为**仿解剖挂图的躯干正面**（无头、无双臂、无双腿，颈部与骨盆底缘平切；外轮廓为一条连续闭合曲线，无折角与拼缝），内部器官缩小收拢后按解剖位置摆放。纸质感由 feTurbulence 颗粒叠层与 feDisplacementMap 手绘抖动实现，全部程序生成、无外部素材、无版权风险。红细胞运氧动画保留 Three.js 粒子实现。
- **页面设计**：遵循 Anthropic 官方 [`frontend-design`](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) 技能的方法论（主题考据 → 设计令牌 → 对照检查 → 构建 → 截图自评），并按其"反模板"清单校准：避开"米白底 + 陶土橙"等 AI 默认配色套路，采用苔绿强调色 + 图鉴式排版。
- **REDSkill（小红书技能生态）**：未集成。该生态需通过小红书自己的 CLI/账号体系分发技能，且未指定具体的图像技能名；如需接入，提供对应技能的 SKILL.md 或名称后可替换/增强当前的 SVG 图版方案。

## 生产部署

方式一（单服务，推荐简单场景）：

```bash
npm run build     # 生成 server/dist 与 client/dist
npm run start     # 后端在 3001 端口同时托管 API 与 client/dist（SPA 回退已内置）
```

方式二（前后端分离）：前端 `client/dist` 任意静态托管（Nginx / 对象存储），将 `VITE_API_BASE_URL` 指向后端地址，并把后端 `CLIENT_ORIGIN` 设为前端域名。

## 验收对照

1. ✅ `npm install && npm run dev` 可启动前后端（3001 / 5173）
2. ✅ 前端通过 `GET /api/organs`、`GET /api/organs/heart` 等获取数据
3. ✅ 主图上点击「肺 / 心脏 / 肝脏 / 肾脏 / 胃 / 咽喉」放大并加载各自工作流
4. ✅ 时间轴可播放/暂停、上一/下一阶段、点击跳转，播放时按 durationSec 自动推进
5. ✅ 肺：呼吸运动 / 气体进入 / 肺泡气体交换 三段 SVG 图版可展示
6. ✅ 红细胞运氧粒子动画可展示，颜色随位置（肺泡鲜红 ↔ 组织暗红）变化
7. ✅ 心脏：心动周期 / 双循环 / 心电传导 三段 SVG 图版可展示
8. ✅ 肾脏：肾小球滤过 / 肾小管重吸收 / 尿液排出 三段 SVG 图版可展示
9. ✅ 肝脏：肝小叶 / 糖代谢 / 解毒与胆汁 三段 SVG 图版可展示
10. ✅ 胃：收纳与搅拌 / 胃液与蛋白质初步消化 / 食糜排空 三段 SVG 图版可展示
11. ✅ 咽喉：共用通道 / 会厌 / 声带振动发声 三段 SVG 图版可展示
12. ✅ 路由 `/organ/lung`、`/organ/heart`、`/organ/liver`、`/organ/kidney`、`/organ/stomach`、`/organ/throat` 均可直接访问
13. ✅ 移动端上下堆叠布局，粒子数量自动降低
14. ✅ 页面底部固定科普免责声明
15. ✅ `GET /api/health` 返回 `{ status: "ok", timestamp }`
16. ✅ 器官数据集中在 `server/src/data/organs.ts`，可无前端改动扩展
17. ✅ 首页人体主图外形仿解剖挂图：无头、无双臂、无双腿，颈部与骨盆底缘平切，外轮廓为一条连续闭合曲线（无折角、无左右拼缝）；身体左右对称、比例匀称；器官缩小收拢，统一为卡通 × 解剖插画风
