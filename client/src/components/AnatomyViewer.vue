<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  FISSURE_LEFT,
  FISSURE_RIGHT,
  LUNG_LEFT_PATH,
  LUNG_RIGHT_PATH,
  LUNG_TREE,
  TREE_COLORS,
} from './anatomyPaths';
import HeartPlate from './plates/HeartPlate.vue';
import LiverPlate from './plates/LiverPlate.vue';
import KidneyPlate from './plates/KidneyPlate.vue';
import StomachPlate from './plates/StomachPlate.vue';
import ThroatPlate from './plates/ThroatPlate.vue';

/**
 * 器官科普图版：「卡通 × 解剖」插画风——深红厚描边、柔和明暗与高光，
 * 同时保留解剖结构（支气管树、肺血管、叶间裂、心脏大血管、膈肌）。
 *
 * 预设对应各器官工作流的阶段：
 * - 肺：lung-breathing（呼吸运动）、airflow（气体进入）、gas-exchange（肺泡气体交换）
 * - 心脏：heart-cycle（心动周期）、heart-circulation（双循环）、heart-conduction（心电传导）
 * - 肝脏：liver-lobule（肝小叶）、liver-metabolism（糖代谢）、liver-detox（解毒与胆汁）
 * - 肾脏：kidney-filter（肾小球滤过）、kidney-reabsorb（重吸收）、kidney-urine（尿液排出）
 * - 胃：stomach-fill（收纳与搅拌）、stomach-juice（胃液与蛋白质初步消化）、stomach-empty（食糜排空）
 * - 咽喉：throat-shared（共用通道）、throat-epiglottis（会厌保护）、throat-voice（声带发声）
 *
 * 复杂场景拆到 plates/ 下的子组件（<g> 根节点），由 preset 前缀选择。
 * 动画使用 SMIL，通过 svg.pauseAnimations()/unpauseAnimations() 统一跟随播放状态；
 * 用户开启"减少动态效果"时默认静止，仍可通过播放按钮手动观看。
 */
const props = withDefaults(
  defineProps<{
    preset?: string;
    playing?: boolean;
  }>(),
  { preset: 'lung-breathing', playing: true },
);

const svgRef = ref<SVGSVGElement | null>(null);
let reducedMotion = false;

function applyPlayState(): void {
  const svg = svgRef.value;
  if (!svg) return;
  if (props.playing && !reducedMotion) svg.unpauseAnimations();
  else svg.pauseAnimations();
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  applyPlayState();
});
watch(() => props.playing, applyPlayState);

const isLungScene = computed(() => props.preset === 'lung-breathing' || props.preset === 'airflow');

const legend = computed(() => {
  switch (props.preset) {
    case 'lung-breathing':
      return '吸气 → 胸腔扩大、肺随膈肌下降而扩张充气；呼气 → 膈肌回升、肺回缩（示意动画，非真实比例）';
    case 'airflow':
      return '气流方向：气管 → 支气管 → 细支气管 → 肺（蓝色粒子示意空气）';
    case 'gas-exchange':
      return '绿色粒子＝氧气经肺泡壁进入毛细血管；灰色粒子＝二氧化碳从血液进入肺泡随呼气排出';
    case 'heart-cycle':
      return '蓝色＝缺氧血（右心 → 肺）；红色＝富氧血（左心 → 全身）。心房先收缩，心室随后强力收缩（示意）';
    case 'heart-circulation':
      return '肺循环：右心室 → 肺 → 左心房；体循环：左心室 → 全身组织 → 右心房，两条环路首尾相接';
    case 'heart-conduction':
      return '电信号自窦房结发出 → 房室结短暂延迟 → 传导束下行 → 心室同步收缩；左上角曲线为对应的心电图波形（示意）';
    case 'kidney-filter':
      return '入球小动脉送入血液，肾小球把水和小分子"滤"入肾小囊形成原尿；血细胞与蛋白质留在血管内';
    case 'kidney-reabsorb':
      return '原尿沿肾小管流动，水、葡萄糖、钠离子被重吸收回毛细血管，废物与多余水分留下';
    case 'kidney-urine':
      return '尿液经集合管 → 肾盂 → 输尿管 → 膀胱暂存，最后经尿道排出';
    case 'liver-lobule':
      return '门管区位于小叶角部：门静脉送来养分、肝动脉送来氧气，血液流经肝血窦汇入中央静脉；胆汁则反向流向胆管';
    case 'liver-metabolism':
      return '饭后血糖升高 → 肝细胞合成糖原储存；空腹血糖下降 → 糖原分解成葡萄糖释放回血液（示意）';
    case 'liver-detox':
      return '肝细胞把酒精、药物残余等分解、改造（紫色 → 绿色），产物随血液带走或经胆汁排出；同时生成帮助消化脂肪的胆汁';
    case 'stomach-fill':
      return '食物经食管进入胃，胃舒张收纳；胃壁蠕动波自上而下推进，把食物与胃液搅成食糜（示意）';
    case 'stomach-juice':
      return '壁细胞分泌盐酸、主细胞分泌胃蛋白酶原；盐酸激活胃蛋白酶，把蛋白质切成多肽；黏液层保护胃壁';
    case 'stomach-empty':
      return '幽门括约肌像闸门分批放行，食糜经十二指肠进入小肠继续消化吸收';
    case 'throat-shared':
      return '蓝色粒子＝空气：鼻腔 → 咽 → 喉 → 气管；橙色粒子＝食物：口腔 → 咽 → 食管，两条通路在咽交叉';
    case 'throat-epiglottis':
      return '吞咽时会厌向后下方翻转、盖住喉口，食团经咽滑入食管；吞咽结束会厌复位，呼吸恢复';
    case 'throat-voice':
      return '呼气时声带闭合，气流从声门裂挤出使声带振动；拉紧声带振动加快、音调升高（夸张示意）';
    default:
      return '';
  }
});

const ariaLabel = computed(() => {
  switch (props.preset) {
    case 'lung-breathing':
      return '呼吸运动解剖示意图：气管、支气管、两肺、心脏与膈肌，吸气时膈肌下降、肺扩张';
    case 'airflow':
      return '气体进入示意图：空气沿气管、左右支气管及肺内支气管树进入两肺';
    case 'gas-exchange':
      return '肺泡气体交换示意图：呼吸性细支气管连接肺泡，周围包绕毛细血管网，氧气进入血液，二氧化碳进入肺泡';
    case 'heart-cycle':
      return '心动周期示意图：心脏四腔切面，心房收缩把血液挤入心室，心室收缩将血液泵入肺动脉与主动脉';
    case 'heart-circulation':
      return '双循环示意图：上方为肺循环，下方为体循环，两条环路通过心脏串联';
    case 'heart-conduction':
      return '心电传导示意图：窦房结放电，经房室结与传导束传向心室，下方为对应的心电图波形';
    case 'kidney-filter':
      return '肾小球滤过示意图：血液经入球小动脉进入肾小球，滤液进入肾小囊后流入肾小管';
    case 'kidney-reabsorb':
      return '肾小管重吸收示意图：水、葡萄糖、钠离子从肾小管回到毛细血管，废物留在管内';
    case 'kidney-urine':
      return '尿液收集与排出示意图：集合管汇入肾盂，经输尿管进入膀胱，再由尿道排出';
    case 'liver-lobule':
      return '肝小叶示意图：六边形的肝小叶中央为中央静脉，周边门管区含门静脉、肝动脉与胆管，血液经肝血窦流向中央静脉';
    case 'liver-metabolism':
      return '糖代谢示意图：葡萄糖经门静脉进入肝脏合成糖原储存，空腹时糖原分解为葡萄糖回到血液';
    case 'liver-detox':
      return '解毒示意图：含废物的血液进入肝细胞，有害物质被分解改造后随血液带走，部分形成胆汁经胆管进入胆囊';
    case 'stomach-fill':
      return '胃的收纳与搅拌示意图：食管送入食物，胃体舒张，蠕动波把食物与胃液混合成食糜';
    case 'stomach-juice':
      return '胃液分泌示意图：胃腺的壁细胞分泌盐酸、主细胞分泌胃蛋白酶原，蛋白质在胃腔中被切成多肽，表面黏液层保护胃壁';
    case 'stomach-empty':
      return '胃排空示意图：幽门括约肌分批放行，食糜经幽门进入十二指肠与小肠';
    case 'throat-shared':
      return '咽喉矢状剖面示意图：鼻腔与口腔汇入咽，空气经喉进入气管，食物经咽进入后方食管';
    case 'throat-epiglottis':
      return '吞咽保护示意图：会厌翻转盖住喉口，食团绕过喉进入后方食管';
    case 'throat-voice':
      return '声带发声示意图：甲状软骨内的两片声带闭合，气流通过声门使其振动';
    default:
      return '人体器官科普示意图';
  }
});

/** 呼吸共用缓动（顺滑的吸-呼曲线） */
const BREATH_SPLINE = '0.45 0 0.55 1;0.45 0 0.55 1';

/** 空气粒子路径（沿气管 → 支气管 → 肺内支气管下支） */
const AIR_PATH_LEFT =
  'M320 34 C 320 66 320 94 320 112 C 310 126 292 138 270 146 C 256 151 248 160 244 172 ' +
  'C 234 190 224 206 218 224 C 211 244 208 266 210 288 C 211 300 213 310 216 318';
const AIR_PATH_RIGHT =
  'M320 34 C 320 66 320 94 320 112 C 330 126 348 138 370 146 C 384 151 392 160 396 172 ' +
  'C 406 190 416 206 422 224 C 429 244 432 266 430 288 C 429 300 427 310 424 318';

/** 气体交换场景的 O2 / CO2 粒子路径 */
const O2_PATH =
  'M288 202 C 288 174 292 152 302 138 C 328 128 354 136 368 152 C 380 148 398 126 420 114 C 440 104 458 100 474 98';
const CO2_PATH =
  'M468 318 C 436 302 406 282 382 262 C 362 276 332 282 308 278 C 288 272 276 258 281 240 C 285 228 293 222 296 220';

/** 空气粒子时间参数（负 begin 使粒子开局即分布在路径上） */
const airDots = Array.from({ length: 7 }, (_, i) => ({
  begin: `${(i * 0.85 - 6).toFixed(2)}s`,
  dur: '6s',
}));

/** O2 / CO2 粒子时间参数 */
const o2Dots = Array.from({ length: 5 }, (_, i) => ({
  begin: `${(i * 1.2 - 6).toFixed(2)}s`,
  dur: '6s',
}));
const co2Dots = Array.from({ length: 5 }, (_, i) => ({
  begin: `${(i * 1.3 - 6.5).toFixed(2)}s`,
  dur: '6.5s',
}));

/** 毛细血管网上静止的红细胞（位置沿网线，带旋转） */
const staticRBCs: Array<{ x: number; y: number; r: number }> = [
  { x: 300, y: 114, r: -10 },
  { x: 366, y: 148, r: 40 },
  { x: 386, y: 214, r: 90 },
  { x: 352, y: 276, r: 20 },
  { x: 300, y: 290, r: -80 },
  { x: 244, y: 274, r: 140 },
  { x: 214, y: 214, r: 95 },
  { x: 238, y: 152, r: 50 },
];

/** 心脏大血管：深色描边层 + 彩色层，得到参考图式的外轮廓 */
const HEART_VESSELS = [
  { d: 'M328 188 C 326 174 326 160 328 146', w: 15, c: '#5b8cb8' },
  { d: 'M352 208 C 354 188 352 172 344 164 C 337 157 327 159 323 167', w: 14, c: '#d24d60' },
  { d: 'M332 156 L 330 142', w: 6, c: '#d24d60' },
  { d: 'M341 154 L 342 140', w: 6, c: '#d24d60' },
  { d: 'M349 158 L 353 145', w: 6, c: '#d24d60' },
  { d: 'M362 222 C 352 204 338 194 322 190', w: 12, c: '#5b8cb8' },
  { d: 'M318 262 C 317 272 316 280 315 288', w: 11, c: '#5b8cb8' },
];

/** 肺门血管：肺动脉（蓝）与肺静脉（红）从心脏两侧伸入肺门，压在肺之下 */
const HILAR_VESSELS = [
  { d: 'M320 188 C 304 184 286 182 268 184 C 256 185 246 189 238 194', w: 6.5, c: '#5b8cb8' },
  { d: 'M316 210 C 300 206 282 207 264 211 C 252 214 242 218 236 223', w: 6, c: '#c5576a' },
  { d: 'M364 188 C 380 184 398 182 416 184', w: 6.5, c: '#5b8cb8' },
  { d: 'M368 210 C 384 207 402 207 420 211', w: 6, c: '#c5576a' },
];
</script>

<template>
  <figure class="anatomy-viewer">
    <svg
      ref="svgRef"
      class="anatomy-svg"
      viewBox="0 0 640 400"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="ariaLabel"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- 器官明暗（顶光） -->
        <linearGradient id="av-lung" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f9c4ca" />
          <stop offset="0.5" stop-color="#ef97a4" />
          <stop offset="1" stop-color="#d8737f" />
        </linearGradient>
        <linearGradient id="av-heart" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f08a95" />
          <stop offset="0.5" stop-color="#cf4759" />
          <stop offset="1" stop-color="#a02637" />
        </linearGradient>
        <linearGradient id="av-trachea" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#f2a2ac" />
          <stop offset="1" stop-color="#d8788a" />
        </linearGradient>
        <linearGradient id="av-diaphragm" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#e0d2ea" />
          <stop offset="1" stop-color="#bda6d0" />
        </linearGradient>
        <linearGradient id="av-capillary" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#d76a7a" />
          <stop offset="1" stop-color="#b23f50" />
        </linearGradient>
        <radialGradient id="av-alveoli" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stop-color="#fde6eb" />
          <stop offset="0.6" stop-color="#f5c0c9" />
          <stop offset="1" stop-color="#e59aa8" />
        </radialGradient>

        <!-- 肺内结构裁剪：支气管树/叶间裂只落在肺轮廓内 -->
        <clipPath id="av-lung-left"><path :d="LUNG_LEFT_PATH" /></clipPath>
        <clipPath id="av-lung-right"><path :d="LUNG_RIGHT_PATH" /></clipPath>

        <!-- 手绘抖动：让轮廓与线条呈现纸面手绘的轻微不规则 -->
        <filter id="av-ink-wobble" filterUnits="userSpaceOnUse" x="0" y="0" width="640" height="400">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <!-- ================= 场景一 / 二：呼吸系统解剖 + 呼吸运动（airflow 叠加气流粒子） ================= -->
      <g v-if="isLungScene" filter="url(#av-ink-wobble)">
        <!-- 台面投影 -->
        <ellipse cx="320" cy="358" rx="172" ry="11" fill="#e9e1cd" />

        <!-- 肋骨（吸气时上抬） -->
        <g>
          <animateTransform
            attributeName="transform" type="translate" values="0 0; 0 -7; 0 0"
            keyTimes="0;0.45;1" dur="4.4s" repeatCount="indefinite"
            calcMode="spline" :keySplines="BREATH_SPLINE"
          />
          <path d="M150 170 C 230 118 410 118 490 170" fill="none" stroke="#ddc9a8" stroke-width="6" stroke-linecap="round" />
          <path d="M158 212 C 236 162 404 162 482 212" fill="none" stroke="#e3d3b6" stroke-width="6" stroke-linecap="round" />
          <path d="M168 254 C 242 208 398 208 472 254" fill="none" stroke="#e9dcc6" stroke-width="6" stroke-linecap="round" />
        </g>

        <!-- 气管（带软骨环） -->
        <rect x="306" y="28" width="28" height="96" rx="14" fill="url(#av-trachea)" stroke="#7e1f2e" stroke-width="3.5" />
        <line x1="312" y1="46" x2="328" y2="46" stroke="#b85263" stroke-width="3.2" stroke-linecap="round" />
        <line x1="312" y1="62" x2="328" y2="62" stroke="#b85263" stroke-width="3.2" stroke-linecap="round" />
        <line x1="312" y1="78" x2="328" y2="78" stroke="#b85263" stroke-width="3.2" stroke-linecap="round" />
        <line x1="312" y1="94" x2="328" y2="94" stroke="#b85263" stroke-width="3.2" stroke-linecap="round" />
        <line x1="312" y1="110" x2="328" y2="110" stroke="#b85263" stroke-width="3.2" stroke-linecap="round" />
        <path d="M312 38 C 312 60 312 84 312 112" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35" />

        <!-- 左右主支气管（入肺门） -->
        <path d="M317 116 C 306 130 290 140 270 148 C 256 153 248 161 243 171" fill="none" stroke="#7e1f2e" stroke-width="18" stroke-linecap="round" />
        <path d="M323 116 C 334 130 350 140 370 148 C 384 153 392 161 397 171" fill="none" stroke="#7e1f2e" stroke-width="18" stroke-linecap="round" />
        <path d="M317 116 C 306 130 290 140 270 148 C 256 153 248 161 243 171" fill="none" stroke="url(#av-trachea)" stroke-width="12" stroke-linecap="round" />
        <path d="M323 116 C 334 130 350 140 370 148 C 384 153 392 161 397 171" fill="none" stroke="url(#av-trachea)" stroke-width="12" stroke-linecap="round" />

        <!-- 肺门血管（压在肺轮廓之下，读作自心脏伸入肺门） -->
        <g fill="none" stroke-linecap="round">
          <path v-for="(v, i) in HILAR_VESSELS" :key="`hv-hink-${i}`" :d="v.d" stroke="#7e1f2e" :stroke-width="v.w + 5" />
          <path v-for="(v, i) in HILAR_VESSELS" :key="`hv-h-${i}`" :d="v.d" :stroke="v.c" :stroke-width="v.w" />
        </g>

        <!-- 左肺（解剖学右肺，三叶）：呼吸时以肺门为中心缩放 -->
        <g transform="translate(238,234)">
          <g>
            <animateTransform
              attributeName="transform" type="scale" values="1;1.05;1"
              keyTimes="0;0.45;1" dur="4.4s" repeatCount="indefinite"
              calcMode="spline" :keySplines="BREATH_SPLINE"
            />
            <g transform="translate(-238,-234)">
              <path :d="LUNG_LEFT_PATH" fill="url(#av-lung)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round" />
              <g clip-path="url(#av-lung-left)">
                <path d="M172 195 C 162 225 156 258 158 288 C 160 314 172 332 190 337 C 181 322 176 300 175 274 C 174 244 178 216 186 196 Z" fill="#b4515f" opacity="0.3" />
                <path v-for="(f, i) in FISSURE_LEFT" :key="`fl-${i}`" :d="f" fill="none" stroke="#9c3b4b" stroke-width="2.6" opacity="0.75" />
                <path v-for="(t, i) in LUNG_TREE" :key="`tl-${i}`" :d="t.d" fill="none" :stroke="TREE_COLORS[t.c]" :stroke-width="t.w" :opacity="t.o ?? 1" stroke-linecap="round" />
                <path d="M186 208 C 176 240 173 272 180 302" fill="none" stroke="#ffffff" stroke-width="5.5" stroke-linecap="round" opacity="0.4" />
              </g>
            </g>
          </g>
        </g>

        <!-- 右肺（解剖学左肺，两叶，心切迹）：内部结构镜像复用 -->
        <g transform="translate(402,234)">
          <g>
            <animateTransform
              attributeName="transform" type="scale" values="1;1.05;1"
              keyTimes="0;0.45;1" dur="4.4s" repeatCount="indefinite"
              calcMode="spline" :keySplines="BREATH_SPLINE"
            />
            <g transform="translate(-402,-234)">
              <path :d="LUNG_RIGHT_PATH" fill="url(#av-lung)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round" />
              <g clip-path="url(#av-lung-right)">
                <path d="M470 196 C 482 220 488 250 487 278 C 486 304 476 324 458 336 C 464 318 468 294 467 268 C 466 240 462 216 454 198 Z" fill="#b4515f" opacity="0.24" />
                <path v-for="(f, i) in FISSURE_RIGHT" :key="`fr-${i}`" :d="f" fill="none" stroke="#9c3b4b" stroke-width="2.6" opacity="0.75" />
                <path v-for="(t, i) in LUNG_TREE" :key="`tr-${i}`" :d="t.d" fill="none" :stroke="TREE_COLORS[t.c]" :stroke-width="t.w" :opacity="t.o ?? 1" stroke-linecap="round" transform="translate(640,0) scale(-1,1)" />
                <path d="M454 208 C 464 240 467 272 460 302" fill="none" stroke="#ffffff" stroke-width="5.5" stroke-linecap="round" opacity="0.3" />
              </g>
            </g>
          </g>
        </g>

        <!-- 心脏（大血管 + 心房 + 心室 + 冠状血管，随心跳轻微搏动） -->
        <g transform="translate(344,238)">
          <g>
            <animateTransform
              attributeName="transform" type="scale" values="1;1.03;1"
              keyTimes="0;0.3;1" dur="1.1s" repeatCount="indefinite"
              calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
            />
            <g transform="translate(-344,-238)">
              <!-- 大血管：描边层 -->
              <path
                v-for="(v, i) in HEART_VESSELS" :key="`hv-ink-${i}`" :d="v.d"
                fill="none" stroke="#7e1f2e" :stroke-width="v.w + 5" stroke-linecap="round"
              />
              <path
                v-for="(v, i) in HEART_VESSELS" :key="`hv-${i}`" :d="v.d"
                fill="none" :stroke="v.c" :stroke-width="v.w" stroke-linecap="round"
              />
              <!-- 心房（后层） -->
              <path d="M314 216 C 306 200 314 188 330 186 C 342 185 350 192 352 202 L 352 216 Z" fill="#c04a5b" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round" />
              <path d="M356 214 C 360 198 372 192 384 198 C 392 202 394 212 390 222 L 356 220 Z" fill="#c04a5b" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round" />
              <!-- 心室体（前层，心尖朝图右下） -->
              <path
                d="M312 218 C 300 230 296 250 300 270 C 304 292 320 308 342 316 C 358 322 370 316 374 302 C 380 284 378 258 370 240 C 363 226 352 218 340 216 C 330 214 319 214 312 218 Z"
                fill="url(#av-heart)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round"
              />
              <!-- 室间沟 + 冠状血管 -->
              <path d="M342 220 C 350 244 358 272 366 298" fill="none" stroke="#a84450" stroke-width="2.4" opacity="0.55" />
              <path d="M320 232 C 334 242 348 254 358 268 C 362 274 365 280 366 286" fill="none" stroke="#f0919c" stroke-width="3" stroke-linecap="round" />
              <path d="M330 228 C 324 240 320 252 318 264" fill="none" stroke="#f0919c" stroke-width="2.4" opacity="0.85" stroke-linecap="round" />
              <path d="M318 232 C 311 250 310 272 317 292" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" opacity="0.32" />
            </g>
          </g>
        </g>

        <!-- 膈肌（吸气时下降变平） -->
        <g>
          <animateTransform
            attributeName="transform" type="translate" values="0 0; 0 12; 0 0"
            keyTimes="0;0.45;1" dur="4.4s" repeatCount="indefinite"
            calcMode="spline" :keySplines="BREATH_SPLINE"
          />
          <path d="M172 334 C 246 308 394 308 468 334 L 468 350 L 172 350 Z" fill="url(#av-diaphragm)" stroke="#8f7aa0" stroke-width="3" stroke-linejoin="round" />
          <path d="M186 336 C 248 314 392 314 454 336" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.4" />
        </g>

        <!-- 图注（书籍式引线标注） -->
        <g class="plate-label">
          <text x="352" y="50">气管</text>
          <path d="M350 46 L 336 46" />
          <text x="112" y="148">右肺</text>
          <path d="M140 152 L 176 162" />
          <text x="520" y="148">左肺</text>
          <path d="M518 152 L 470 162" />
          <text x="252" y="262">心脏</text>
          <path d="M280 258 L 302 252" />
          <text x="492" y="342">膈肌</text>
          <path d="M490 338 L 470 332" />
        </g>

        <!-- 气流粒子（仅 airflow 预设） -->
        <g v-if="preset === 'airflow'">
          <g v-for="(dot, i) in airDots" :key="`air-l-${i}`">
            <circle r="5.5" fill="#5f93bd" stroke="#3f6c8f" stroke-width="1.5" opacity="0">
              <animateMotion :path="AIR_PATH_LEFT" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.06;0.86;1" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
            </circle>
          </g>
          <g v-for="(dot, i) in airDots" :key="`air-r-${i}`">
            <circle r="5.5" fill="#5f93bd" stroke="#3f6c8f" stroke-width="1.5" opacity="0">
              <animateMotion :path="AIR_PATH_RIGHT" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.06;0.86;1" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </g>

      <!-- ================= 场景三：呼吸单元（肺泡 + 毛细血管网气体交换） ================= -->
      <g v-else-if="preset === 'gas-exchange'" filter="url(#av-ink-wobble)">
        <ellipse cx="320" cy="366" rx="210" ry="11" fill="#e9e1cd" />

        <!-- 呼吸性细支气管（末端没入肺泡） -->
        <path d="M340 28 C 336 50 332 74 326 100 C 323 114 320 124 318 136" fill="none" stroke="#7e1f2e" stroke-width="24" stroke-linecap="round" />
        <path d="M340 28 C 336 50 332 74 326 100 C 323 114 320 124 318 136" fill="none" stroke="url(#av-trachea)" stroke-width="17" stroke-linecap="round" />
        <path d="M334 44 L 344 40" stroke="#b85263" stroke-width="5" stroke-linecap="round" />
        <path d="M331 62 L 341 58" stroke="#b85263" stroke-width="5" stroke-linecap="round" />
        <path d="M326 84 L 336 80" stroke="#b85263" stroke-width="5" stroke-linecap="round" />

        <!-- 相邻肺泡 -->
        <circle cx="176" cy="272" r="40" fill="url(#av-alveoli)" stroke="#7e1f2e" stroke-width="4" />
        <circle cx="416" cy="238" r="34" fill="url(#av-alveoli)" stroke="#7e1f2e" stroke-width="4" />
        <path d="M158 254 C 168 242 182 238 194 242" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.5" />
        <path d="M402 224 C 410 216 418 213 428 216" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.45" />

        <!-- 主肺泡（带内壁暗示） -->
        <circle cx="300" cy="212" r="78" fill="url(#av-alveoli)" stroke="#7e1f2e" stroke-width="4.5" />
        <circle cx="300" cy="212" r="60" fill="none" stroke="#d98f9d" stroke-width="2.2" stroke-dasharray="6 7" opacity="0.8" />
        <path d="M262 178 C 274 162 292 154 310 155" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.55" />

        <!-- 毛细血管网：环绕肺泡的连续血管，并向邻近肺泡发出分支 -->
        <g fill="none" stroke-linecap="round">
          <path
            d="M300 112 C 372 112 396 160 390 214 C 385 262 350 292 300 290 C 250 288 214 260 210 214 C 206 166 232 114 300 112 Z"
            stroke="#7e1f2e" stroke-width="13"
          />
          <path d="M212 214 C 206 220 200 228 197 238" stroke="#7e1f2e" stroke-width="11" />
          <path
            d="M300 112 C 372 112 396 160 390 214 C 385 262 350 292 300 290 C 250 288 214 260 210 214 C 206 166 232 114 300 112 Z"
            stroke="url(#av-capillary)" stroke-width="8"
          />
          <path d="M212 214 C 206 220 200 228 197 238" stroke="url(#av-capillary)" stroke-width="6.5" />
        </g>

        <!-- 网内的红细胞（静止示意） -->
        <g v-for="(rbc, i) in staticRBCs" :key="`rbc-${i}`">
          <ellipse :cx="rbc.x" :cy="rbc.y" rx="8" ry="5.6" fill="#df586a" stroke="#7e1f2e" stroke-width="1.8" :transform="`rotate(${rbc.r} ${rbc.x} ${rbc.y})`" />
          <ellipse :cx="rbc.x - 2.2" :cy="rbc.y - 1.6" rx="2.6" ry="1.5" fill="#ffffff" opacity="0.45" :transform="`rotate(${rbc.r} ${rbc.x} ${rbc.y})`" />
        </g>

        <!-- 血管出入口：肺动脉支（入，蓝）与肺静脉支（出，红） -->
        <path d="M470 322 C 432 302 402 282 380 262" fill="none" stroke="#7e1f2e" stroke-width="18" stroke-linecap="round" />
        <path d="M380 150 C 410 128 442 112 476 100" fill="none" stroke="#7e1f2e" stroke-width="18" stroke-linecap="round" />
        <path d="M470 322 C 432 302 402 282 380 262" fill="none" stroke="#5b8cb8" stroke-width="12" stroke-linecap="round" />
        <path d="M380 150 C 410 128 442 112 476 100" fill="none" stroke="#cf5468" stroke-width="12" stroke-linecap="round" />

        <!-- O2：肺泡内 → 穿过肺泡壁进入毛细血管网 → 汇入肺静脉支 -->
        <g v-for="(dot, i) in o2Dots" :key="`o2-${i}`">
          <circle r="5.5" fill="#4f9e8f" stroke="#3e7f72" stroke-width="1.5" opacity="0">
            <animateMotion :path="O2_PATH" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.06;0.86;1" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
          </circle>
        </g>

        <!-- CO2：肺动脉支 → 毛细血管网 → 穿过肺泡壁进入肺泡 -->
        <g v-for="(dot, i) in co2Dots" :key="`co2-${i}`">
          <circle r="5" fill="#a0988a" stroke="#8a8274" stroke-width="1.5" opacity="0">
            <animateMotion :path="CO2_PATH" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.06;0.86;1" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
          </circle>
        </g>

        <!-- 图注 -->
        <g class="plate-label">
          <text x="404" y="40">呼吸性细支气管</text>
          <path d="M402 36 L 344 46" />
          <text x="300" y="358">肺泡</text>
          <path d="M300 350 L 300 296" />
          <text x="104" y="118">毛细血管网</text>
          <path d="M152 122 L 232 152" />
          <text x="96" y="196">红细胞</text>
          <path d="M136 200 L 206 212" />
        </g>
      </g>

      <!-- ================= 心脏 / 肝脏 / 肾脏 / 胃 / 咽喉：独立图版组件 ================= -->
      <HeartPlate v-else-if="preset.startsWith('heart-')" :preset="preset" />
      <LiverPlate v-else-if="preset.startsWith('liver-')" :preset="preset" />
      <KidneyPlate v-else-if="preset.startsWith('kidney-')" :preset="preset" />
      <StomachPlate v-else-if="preset.startsWith('stomach-')" :preset="preset" />
      <ThroatPlate v-else-if="preset.startsWith('throat-')" :preset="preset" />
    </svg>
    <figcaption v-if="legend" class="anatomy-legend">{{ legend }}</figcaption>
  </figure>
</template>

<style scoped>
.anatomy-viewer {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f3e9; /* 图版纸底 */
  border: 1px solid var(--line);
}

.anatomy-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* 纸面颗粒（feTurbulence 生成，平铺叠加，程序生成无外部素材） */
.anatomy-viewer::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='9'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23p)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

/* 图注（子图版组件的标注也一并命中） */
:deep(.plate-label text) {
  font-size: 13px;
  fill: #8a8375;
}

:deep(.plate-label path) {
  fill: none;
  stroke: #b3a98f;
  stroke-width: 1.5;
}

.anatomy-legend {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 10px;
  margin: 0;
  font-size: 12px;
  color: var(--text-dim);
  pointer-events: none;
}
</style>
