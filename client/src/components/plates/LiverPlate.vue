<script setup lang="ts">
/**
 * 肝脏图版：与肺图版同一套「卡通 × 解剖」画风（深红厚描边、渐变、高光、纸面图注）。
 * - liver-lobule：肝小叶——门管区的血液经肝血窦流向中央静脉，胆汁反向流向胆管
 * - liver-metabolism：糖代谢——血糖升高时合成糖原储存，血糖下降时分解糖原释放葡萄糖
 * - liver-detox：解毒与胆汁生成——肝细胞分解、改造有害物质，产物随血液或胆汁排出
 */
defineProps<{ preset: string }>();

const rad = (deg: number): number => (deg * Math.PI) / 180;
const LOBULE = { x: 330, y: 200 };

function at(r: number, deg: number): [number, number] {
  return [LOBULE.x + r * Math.cos(rad(deg)), LOBULE.y + r * Math.sin(rad(deg))];
}
const fix = (v: number): string => v.toFixed(1);

/** 肝细胞索：自中央静脉向小叶周边放射 */
const CORD_ANGLES = [0, 60, 120, 180, 240, 300];
const cords = CORD_ANGLES.map((deg) => {
  const [x1, y1] = at(44, deg);
  const [x2, y2] = at(112, deg);
  return { d: `M${fix(x1)} ${fix(y1)} L ${fix(x2)} ${fix(y2)}` };
});
const hepatocytes = CORD_ANGLES.flatMap((deg) =>
  [60, 82, 104].map((r) => {
    const [x, y] = at(r, deg);
    return { x: Number(fix(x)), y: Number(fix(y)), deg };
  }),
);

/** 肝血窦：位于细胞索之间，血液由周边流向中央静脉 */
const SINUS_ANGLES = [30, 90, 150, 210, 270, 330];
const sinusoids = SINUS_ANGLES.map((deg) => {
  const [x1, y1] = at(128, deg);
  const [x2, y2] = at(38, deg);
  const [mx, my] = at(82, deg + 8);
  return { d: `M${fix(x1)} ${fix(y1)} Q ${fix(mx)} ${fix(my)} ${fix(x2)} ${fix(y2)}` };
});
const bloodDots = sinusoids.flatMap((s, i) =>
  [0, 1].map((k) => ({
    d: s.d,
    dur: '4.8s',
    begin: `${(k * 2.4 - 4.8 + i * 0.28).toFixed(2)}s`,
  })),
);

/** 毛细胆管：胆汁自肝细胞反向流向外周胆管 */
const BILE_ANGLES = [186, 306, 66];
const bilePaths = BILE_ANGLES.map((deg) => {
  const [x1, y1] = at(46, deg);
  const [x2, y2] = at(116, deg);
  const [mx, my] = at(80, deg + 5);
  return { d: `M${fix(x1)} ${fix(y1)} Q ${fix(mx)} ${fix(my)} ${fix(x2)} ${fix(y2)}` };
});
const bileDots = bilePaths.flatMap((b, i) => [
  { d: b.d, dur: '4.2s', begin: `${(i * 0.5 - 4.2).toFixed(2)}s` },
  { d: b.d, dur: '4.2s', begin: `${(i * 0.5 - 2.1).toFixed(2)}s` },
]);

/** 门管区（门静脉 + 肝动脉 + 胆管）位于小叶角部 */
const TRIADS = [
  { x: 206, y: 200 },
  { x: 386, y: 100 },
  { x: 386, y: 300 },
];

/** 肝糖原颗粒（放大视窗内的示意分布） */
const GLYCOGEN: Array<[number, number]> = [
  [302, 196], [320, 188], [340, 190], [358, 198], [370, 212], [366, 230],
  [350, 240], [330, 242], [310, 236], [296, 222], [294, 206], [314, 214],
  [332, 204], [352, 214], [358, 228], [340, 226], [322, 224], [306, 222],
  [326, 236], [346, 208], [314, 200], [338, 216], [350, 224], [310, 210],
];

/** 糖代谢场景的肝脏外轮廓：上方为完整肝穹窿、右叶宽厚、左叶较窄，下缘有胆囊窝凹陷 */
const LIVER_PATH =
  'M204 260 C 192 236 196 208 214 192 C 244 168 280 158 314 160 ' +
  'C 348 146 396 144 430 156 C 460 166 486 178 500 196 ' +
  'C 512 216 512 242 500 264 ' +
  'C 488 290 466 306 442 308 C 424 311 410 306 402 296 ' +
  'C 394 284 376 280 366 290 C 352 304 330 310 310 306 ' +
  'C 288 318 256 314 236 298 C 220 286 210 272 204 260 Z';

/** 糖代谢：入血（餐后）与回血（空腹）路径 */
const GLUCOSE_IN = 'M22 240 C 84 240 144 234 202 228 C 236 224 266 220 294 218';
const GLUCOSE_OUT = 'M392 208 C 436 208 476 204 510 198 C 552 190 590 178 620 168';

/** 解毒：含废物血液 → 肝细胞 → 无毒产物回血 */
const TOXIN_PATH =
  'M18 148 C 82 146 142 152 196 162 C 214 166 226 170 240 176 ' +
  'C 280 188 310 198 342 204 C 380 210 404 198 436 184 C 490 160 540 142 620 112';
/** 胆汁通路：肝细胞 → 毛细胆管 → 胆囊 */
const BILE_PATH = 'M334 294 C 362 312 390 322 418 328 C 442 333 466 334 486 330';
</script>

<template>
  <g filter="url(#av-ink-wobble)">
    <defs>
      <linearGradient id="lp-lobule" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#fdf1ef" />
        <stop offset="0.6" stop-color="#f9e0e0" />
        <stop offset="1" stop-color="#f2cdd1" />
      </linearGradient>
      <linearGradient id="lp-vein" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#d6e5f0" />
        <stop offset="1" stop-color="#9db8ce" />
      </linearGradient>
      <linearGradient id="lp-organ" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0" stop-color="#cd6a72" />
        <stop offset="0.5" stop-color="#a83846" />
        <stop offset="1" stop-color="#85232f" />
      </linearGradient>
      <linearGradient id="lp-cell" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#fdeeea" />
        <stop offset="1" stop-color="#f2cfcd" />
      </linearGradient>
      <linearGradient id="lp-gall" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#a9c29a" />
        <stop offset="1" stop-color="#7fae8e" />
      </linearGradient>
    </defs>

    <!-- ================= 肝小叶 ================= -->
    <g v-if="preset === 'liver-lobule'">
      <ellipse cx="320" cy="368" rx="210" ry="11" fill="#e9e1cd" />

      <!-- 小叶轮廓（六边形） -->
      <path
        d="M258 80 C 300 70 360 70 402 80 C 440 88 468 138 476 200
           C 468 262 440 312 402 320 C 360 330 300 330 258 320
           C 220 312 192 262 184 200 C 192 138 220 88 258 80 Z"
        fill="url(#lp-lobule)" stroke="#7e1f2e" stroke-width="4.5" stroke-linejoin="round"
      />

      <!-- 肝细胞索 -->
      <g stroke-linecap="round" opacity="0.8">
        <path v-for="(c, i) in cords" :key="`lp-cord-${i}`" :d="c.d" stroke="#f0c3c6" stroke-width="16" />
      </g>
      <ellipse
        v-for="(c, i) in hepatocytes" :key="`lp-hepatocyte-${i}`"
        :cx="c.x" :cy="c.y" rx="7.5" ry="4.8"
        fill="#eaa2ac" stroke="#9c3b4b" stroke-width="1.2"
        :transform="`rotate(${c.deg} ${c.x} ${c.y})`"
      />

      <!-- 肝血窦 -->
      <path
        v-for="(s, i) in sinusoids" :key="`lp-sinus-${i}`" :d="s.d"
        fill="none" stroke="#fdf5ea" stroke-width="9" stroke-linecap="round"
      />

      <!-- 毛细胆管（绿色虚线） -->
      <path
        v-for="(b, i) in bilePaths" :key="`lp-bile-${i}`" :d="b.d"
        fill="none" stroke="#7d9b6a" stroke-width="2.2" stroke-dasharray="6 6" stroke-linecap="round" opacity="0.9"
      />

      <!-- 中央静脉 -->
      <circle cx="330" cy="200" r="31" fill="url(#lp-vein)" stroke="#7e1f2e" stroke-width="4" />
      <path d="M311 191 C 320 182 334 180 345 187" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.55" />
      <g>
        <rect x="288" y="240" width="84" height="24" rx="12" fill="#fdf8f0" fill-opacity="0.94" stroke="#d9cdb6" stroke-width="1.2" />
        <text x="330" y="256" text-anchor="middle" font-size="12" fill="#8a8375">中央静脉</text>
      </g>

      <!-- 门管区：门静脉（蓝）· 肝动脉（红）· 胆管（绿） -->
      <g v-for="(t, i) in TRIADS" :key="`lp-triad-${i}`">
        <circle :cx="t.x - 7" :cy="t.y - 8" r="9" fill="#8fb0cc" stroke="#7e1f2e" stroke-width="2.6" />
        <circle :cx="t.x + 9" :cy="t.y - 2" r="6" fill="#d4646f" stroke="#7e1f2e" stroke-width="2.2" />
        <circle :cx="t.x - 1" :cy="t.y + 11" r="6" fill="#9bb783" stroke="#7e1f2e" stroke-width="2.2" />
      </g>

      <!-- 血液粒子：沿肝血窦流向中央静脉 -->
      <circle
        v-for="(d, i) in bloodDots" :key="`lp-rbc-${i}`"
        r="5" fill="#cf5468" stroke="#7e1f2e" stroke-width="1.2" opacity="0"
      >
        <animateMotion :path="d.d" :dur="d.dur" :begin="d.begin" repeatCount="indefinite" />
        <animate
          attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.08;0.8;1"
          :dur="d.dur" :begin="d.begin" repeatCount="indefinite"
        />
      </circle>

      <!-- 胆汁粒子：反方向流向外周胆管 -->
      <circle
        v-for="(d, i) in bileDots" :key="`lp-bile-dot-${i}`"
        r="4.2" fill="#8fae78" stroke="#5d7a4e" stroke-width="1.2" opacity="0"
      >
        <animateMotion :path="d.d" :dur="d.dur" :begin="d.begin" repeatCount="indefinite" />
        <animate
          attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.08;0.82;1"
          :dur="d.dur" :begin="d.begin" repeatCount="indefinite"
        />
      </circle>

      <g class="plate-label">
        <text x="44" y="118">门管区</text>
        <path d="M92 122 L 186 188" />
        <text x="496" y="238">肝血窦</text>
        <path d="M494 232 L 430 240" />
        <text x="494" y="302">胆汁流向</text>
        <path d="M492 296 L 388 286" />
        <text x="64" y="308">肝细胞索</text>
        <path d="M122 304 L 248 292" />
      </g>
    </g>

    <!-- ================= 糖代谢与糖原储存 ================= -->
    <g v-else-if="preset === 'liver-metabolism'">
      <ellipse cx="320" cy="360" rx="212" ry="11" fill="#e9e1cd" />

      <!-- 血管：门静脉（入）与肝静脉（出） -->
      <g fill="none" stroke-linecap="round">
        <path d="M18 240 C 80 240 140 234 200 228" stroke="#7e1f2e" stroke-width="19" />
        <path d="M18 240 C 80 240 140 234 200 228" stroke="#7d9fc0" stroke-width="13" />
        <path d="M510 210 C 546 202 584 188 624 172" stroke="#7e1f2e" stroke-width="19" />
        <path d="M510 210 C 546 202 584 188 624 172" stroke="#7d9fc0" stroke-width="13" />
      </g>

      <!-- 肝脏 -->
      <path :d="LIVER_PATH" fill="url(#lp-organ)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round" />
      <path d="M246 176 C 232 200 230 232 240 262" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.26" />
      <path d="M300 160 C 290 184 288 210 294 234" fill="none" stroke="#6f1a25" stroke-width="2.4" stroke-linecap="round" opacity="0.28" />

      <!-- 放大视窗：肝细胞内的糖原颗粒 -->
      <ellipse cx="346" cy="220" rx="86" ry="50" fill="#fdf5ec" stroke="#c9b39b" stroke-width="2.4" stroke-dasharray="8 7" />
      <ellipse cx="398" cy="222" rx="14" ry="12" fill="#f0dcc6" stroke="#c9a98c" stroke-width="2" />
      <circle cx="398" cy="222" r="4.2" fill="#b98d5f" />
      <g transform="translate(340 218)">
        <g>
          <animateTransform
            attributeName="transform" type="scale" values="0.94;1.08;0.94"
            keyTimes="0;0.5;1" dur="8s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          />
          <g transform="translate(-340 -218)">
            <circle
              v-for="(g, i) in GLYCOGEN" :key="`lp-glycogen-${i}`"
              :cx="g[0]" :cy="g[1]" r="6.2"
              fill="#e8b959" stroke="#a97f2c" stroke-width="1.4"
            />
          </g>
        </g>
      </g>
      <text x="330" y="262" text-anchor="middle" font-size="11.5" fill="#8a8375">肝糖原颗粒</text>

      <!-- 葡萄糖粒子：餐后进入、空腹放出 -->
      <g v-for="n in 4" :key="`lp-glu-in-${n}`">
        <circle r="5.4" fill="#e8b959" stroke="#a97f2c" stroke-width="1.3" opacity="0">
          <animateMotion :path="GLUCOSE_IN" dur="4.2s" :begin="`${(n - 1) * 1.05 - 4.2}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.08;0.82;1" dur="4.2s" :begin="`${(n - 1) * 1.05 - 4.2}s`" repeatCount="indefinite" />
        </circle>
      </g>
      <g v-for="n in 4" :key="`lp-glu-out-${n}`">
        <circle r="5.4" fill="#e8b959" stroke="#a97f2c" stroke-width="1.3" opacity="0">
          <animateMotion :path="GLUCOSE_OUT" dur="4.2s" :begin="`${(n - 1) * 1.05 - 4.2}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.08;0.82;1" dur="4.2s" :begin="`${(n - 1) * 1.05 - 4.2}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 状态提示 -->
      <g font-size="12.5" fill="#6f6656">
        <rect x="28" y="52" width="214" height="30" rx="15" fill="#ffffff" fill-opacity="0.72" stroke="#d9cdb6" stroke-width="1.2" />
        <text x="44" y="72">饭后：血糖升高 → 合成糖原</text>
        <rect x="394" y="52" width="222" height="30" rx="15" fill="#ffffff" fill-opacity="0.72" stroke="#d9cdb6" stroke-width="1.2" />
        <text x="410" y="72">空腹：糖原分解 → 血糖回升</text>
      </g>

      <g class="plate-label">
        <text x="42" y="296">门静脉</text>
        <path d="M100 292 L 134 240" />
        <text x="528" y="258">肝静脉</text>
        <path d="M556 252 L 558 198" />
        <text x="96" y="330">肝细胞（放大）</text>
        <path d="M224 326 L 262 232" />
      </g>
    </g>

    <!-- ================= 解毒与胆汁生成 ================= -->
    <g v-else-if="preset === 'liver-detox'">
      <ellipse cx="320" cy="352" rx="150" ry="11" fill="#e9e1cd" />

      <!-- 血管 -->
      <g fill="none" stroke-linecap="round">
        <path d="M16 148 C 80 146 140 152 194 162 C 210 165 220 169 232 174" stroke="#7e1f2e" stroke-width="19" />
        <path d="M16 148 C 80 146 140 152 194 162 C 210 165 220 169 232 174" stroke="#7d9fc0" stroke-width="13" />
        <path d="M414 186 C 460 168 506 152 560 134 C 580 127 600 120 624 112" stroke="#7e1f2e" stroke-width="19" />
        <path d="M414 186 C 460 168 506 152 560 134 C 580 127 600 120 624 112" stroke="#cf7d86" stroke-width="13" />
      </g>

      <!-- 肝细胞 -->
      <circle cx="326" cy="204" r="94" fill="url(#lp-cell)" stroke="#7e1f2e" stroke-width="4.5" />
      <circle cx="352" cy="176" r="28" fill="#e7bcc4" stroke="#7e1f2e" stroke-width="3" />
      <circle cx="358" cy="172" r="9.5" fill="#b06a78" stroke="#7e1f2e" stroke-width="1.8" />
      <g fill="#e6b1b9" stroke="#a95a67" stroke-width="1.6">
        <ellipse cx="270" cy="182" rx="13" ry="8" transform="rotate(-18 270 182)" />
        <ellipse cx="288" cy="242" rx="12" ry="7.5" transform="rotate(12 288 242)" />
        <ellipse cx="380" cy="252" rx="13" ry="8" transform="rotate(-10 380 252)" />
        <ellipse cx="398" cy="150" rx="10" ry="6.5" transform="rotate(20 398 150)" />
        <ellipse cx="334" cy="118" rx="11" ry="7" transform="rotate(-8 334 118)" />
        <ellipse cx="256" cy="210" rx="9" ry="6" transform="rotate(14 256 210)" />
      </g>
      <path d="M266 148 C 278 136 294 130 310 130" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.5" />

      <!-- 胆管 → 胆囊 -->
      <path :d="BILE_PATH" fill="none" stroke="#7e1f2e" stroke-width="13" stroke-linecap="round" />
      <path :d="BILE_PATH" fill="none" stroke="#a8bd8c" stroke-width="8" stroke-linecap="round" />
      <ellipse cx="504" cy="328" rx="27" ry="19" fill="url(#lp-gall)" stroke="#7e1f2e" stroke-width="3" transform="rotate(-8 504 328)" />
      <path d="M522 316 C 528 308 538 306 546 310" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.4" />
      <path d="M530 334 C 548 340 564 344 582 346" fill="none" stroke="#7e1f2e" stroke-width="11" stroke-linecap="round" />
      <path d="M530 334 C 548 340 564 344 582 346" fill="none" stroke="#a8bd8c" stroke-width="6.5" stroke-linecap="round" />

      <!-- 毒素粒子：进入肝细胞后被改造，颜色由紫转绿 -->
      <g v-for="n in 4" :key="`lp-toxin-${n}`">
        <circle r="5.6" stroke="#7e1f2e" stroke-width="1.3" opacity="0">
          <animate attributeName="fill" values="#8a7bb0;#8a7bb0;#7fa08a;#7fa08a" keyTimes="0;0.42;0.56;1" dur="6.4s" :begin="`${(n - 1) * 1.6 - 6.4}s`" repeatCount="indefinite" />
          <animateMotion :path="TOXIN_PATH" dur="6.4s" :begin="`${(n - 1) * 1.6 - 6.4}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.95;0" keyTimes="0;0.06;0.9;1" dur="6.4s" :begin="`${(n - 1) * 1.6 - 6.4}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 胆汁粒子 -->
      <g v-for="n in 3" :key="`lp-bile-${n}`">
        <circle r="4.6" fill="#9aa455" stroke="#6d7538" stroke-width="1.2" opacity="0">
          <animateMotion :path="BILE_PATH" dur="3.6s" :begin="`${(n - 1) * 1.2 - 3.6}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.08;0.84;1" dur="3.6s" :begin="`${(n - 1) * 1.2 - 3.6}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="plate-label">
        <text x="26" y="108">含废物的血液</text>
        <path d="M118 112 L 128 144" />
        <text x="70" y="262">分解 · 结合</text>
        <path d="M150 266 L 254 232" />
        <text x="466" y="88">无毒产物回到血液</text>
        <path d="M512 94 L 540 134" />
        <text x="238" y="334">生成胆汁</text>
        <path d="M298 328 L 356 312" />
        <text x="548" y="292">胆囊</text>
        <path d="M546 298 L 520 316" />
      </g>
    </g>
  </g>
</template>
