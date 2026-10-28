<script setup lang="ts">
/**
 * 胃图版：同一套「卡通 × 解剖」画风。
 * - stomach-fill：食管送入食物，胃舒张收纳，蠕动波把食物与胃液搅成食糜
 * - stomach-juice：胃腔 + 黏膜剖面——胃腺分泌盐酸与胃蛋白酶原，蛋白质被切成多肽
 * - stomach-empty：幽门括约肌分批放行，食糜进入十二指肠与小肠
 */
defineProps<{ preset: string }>();

/** 胃轮廓：贲门 → 胃底 → 胃大弯 → 胃窦 → 幽门 → 胃小弯 */
const STOMACH_PATH =
  'M258 84 C 236 66 202 70 186 96 C 170 122 166 156 172 192 ' +
  'C 178 228 194 258 220 280 C 244 300 276 308 306 302 ' +
  'C 330 297 344 282 348 264 C 352 250 344 240 330 236 ' +
  'C 318 232 312 220 312 206 C 312 190 318 174 322 158 ' +
  'C 326 142 320 122 302 108 C 288 98 272 90 258 84 Z';

const ESOPHAGUS_PATH = 'M262 4 C 260 34 260 60 262 86';
const DUODENUM_PATH = 'M346 254 C 372 246 396 244 412 252 C 430 260 436 282 432 304';

/** 食物自食管进入胃，在胃内绕行搅拌 */
const FOOD_PATH =
  'M262 2 C 262 30 262 58 262 80 C 268 96 284 112 296 130 ' +
  'C 312 154 316 182 306 204 C 296 226 272 236 250 228 ' +
  'C 230 220 222 200 230 182 C 238 164 258 158 270 168';

/** 食糜：胃窦 → 幽门 → 十二指肠 → 小肠 */
const CHYME_PATH =
  'M296 246 C 312 262 324 262 334 252 C 358 246 380 240 400 250 ' +
  'C 418 260 424 282 428 302 C 448 324 482 342 512 346 C 542 350 568 340 594 320';

/** 蠕动收缩带（裁切在胃轮廓内，自上而下推进） */
const WAVE_PATH = 'M162 152 C 210 196 302 194 354 150';

const waves = [0, 2.2, 4.4].map((begin) => ({ begin: `${begin}s` }));

const foodDots = Array.from({ length: 5 }, (_, i) => ({ begin: `${(i * 1.35 - 6.75).toFixed(2)}s` }));

const chymeDots = Array.from({ length: 6 }, (_, i) => ({
  begin: `${(i * 0.55 + (i > 2 ? 2.4 : 0)).toFixed(2)}s`,
}));

/** 蛋白质珠链：两段多肽被切开的位置留出空隙 */
const PEPTIDE_LEFT = [
  { x: 248, y: 128 },
  { x: 270, y: 116 },
  { x: 292, y: 124 },
];
const PEPTIDE_RIGHT = [
  { x: 318, y: 116 },
  { x: 340, y: 124 },
  { x: 362, y: 116 },
];

const acidDots = Array.from({ length: 4 }, (_, i) => ({ begin: `${(i * 1.15 - 4.6).toFixed(2)}s` }));
const pepsinogenDots = Array.from({ length: 4 }, (_, i) => ({ begin: `${(i * 1.15 - 3.4).toFixed(2)}s` }));
</script>

<template>
  <g filter="url(#av-ink-wobble)">
    <defs>
      <linearGradient id="sp-stomach" x1="0.15" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#f8bcc6" />
        <stop offset="0.5" stop-color="#ec94a3" />
        <stop offset="1" stop-color="#d37383" />
      </linearGradient>
      <linearGradient id="sp-mucosa" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f4b8c2" />
        <stop offset="0.55" stop-color="#e18b9b" />
        <stop offset="1" stop-color="#c76d7e" />
      </linearGradient>
      <linearGradient id="sp-bowel" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="#f3a6b1" />
        <stop offset="1" stop-color="#d97d8d" />
      </linearGradient>
      <clipPath id="sp-body-clip"><path :d="STOMACH_PATH" /></clipPath>
    </defs>

    <!-- ================= 收纳与搅拌 ================= -->
    <g v-if="preset === 'stomach-fill'">
      <ellipse cx="300" cy="342" rx="150" ry="10" fill="#e9e1cd" />

      <!-- 十二指肠（幽门以下） -->
      <path :d="DUODENUM_PATH" fill="none" stroke="#7e1f2e" stroke-width="25" stroke-linecap="round" />
      <path :d="DUODENUM_PATH" fill="none" stroke="url(#sp-bowel)" stroke-width="17" stroke-linecap="round" />

      <!-- 食管 -->
      <path :d="ESOPHAGUS_PATH" fill="none" stroke="#7e1f2e" stroke-width="32" stroke-linecap="round" />
      <path :d="ESOPHAGUS_PATH" fill="none" stroke="url(#sp-stomach)" stroke-width="22" stroke-linecap="round" />
      <g stroke="#b85263" stroke-width="2.8" stroke-linecap="round">
        <line x1="251" y1="22" x2="273" y2="22" />
        <line x1="250" y1="40" x2="272" y2="40" />
        <line x1="250" y1="58" x2="272" y2="58" />
        <line x1="251" y1="74" x2="273" y2="74" />
      </g>
      <path d="M252 12 C 250 36 250 58 252 78" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35" />

      <!-- 胃体 -->
      <path :d="STOMACH_PATH" fill="url(#sp-stomach)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round" />
      <g clip-path="url(#sp-body-clip)">
        <!-- 胃大弯内侧暗部 -->
        <path d="M176 118 C 160 160 160 214 178 252 C 196 290 232 312 276 312 L 276 322 C 214 326 166 292 152 240 C 140 194 146 146 164 110 Z" fill="#b8566a" opacity="0.18" />
        <!-- 胃皱襞 -->
        <g fill="none" stroke="#b4525f" stroke-width="2.3" opacity="0.42" stroke-linecap="round">
          <path d="M196 140 C 230 128 268 132 300 150" />
          <path d="M186 178 C 220 164 270 170 308 190" />
          <path d="M196 216 C 230 206 272 216 302 234" />
          <path d="M212 252 C 240 246 272 254 294 268" />
        </g>
        <!-- 蠕动收缩带 -->
        <g v-for="(w, i) in waves" :key="`sp-wave-${i}`">
          <path :d="WAVE_PATH" fill="none" stroke="#b74a5e" stroke-width="17" opacity="0" stroke-linecap="round">
            <animateTransform
              attributeName="transform" type="translate" values="0 -150; 0 70"
              dur="6.6s" :begin="w.begin" repeatCount="indefinite"
            />
            <animate
              attributeName="opacity" values="0;0.22;0.22;0" keyTimes="0;0.15;0.78;1"
              dur="6.6s" :begin="w.begin" repeatCount="indefinite"
            />
          </path>
        </g>
        <!-- 高光 -->
        <path d="M192 120 C 180 160 182 210 200 246" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.34" />
        <ellipse cx="228" cy="120" rx="20" ry="12" fill="#ffffff" opacity="0.22" transform="rotate(-24 228 120)" />
      </g>

      <!-- 食物粒子 -->
      <g v-for="(d, i) in foodDots" :key="`sp-food-${i}`">
        <circle r="5.4" fill="#c98a4b" stroke="#8a5a24" stroke-width="1.4" opacity="0">
          <animateMotion :path="FOOD_PATH" dur="7s" :begin="d.begin" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.95;0" keyTimes="0;0.06;0.9;1" dur="7s" :begin="d.begin" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="plate-label">
        <text x="292" y="34">食管</text>
        <path d="M290 30 L 274 34" />
        <text x="96" y="104">胃底</text>
        <path d="M150 110 L 190 100" />
        <text x="88" y="216">胃体</text>
        <path d="M146 210 L 174 200" />
        <text x="380" y="300">幽门</text>
        <path d="M378 294 L 352 262" />
        <text x="452" y="330">十二指肠</text>
        <path d="M450 324 L 432 302" />
      </g>
    </g>

    <!-- ================= 胃液与蛋白质初步消化 ================= -->
    <g v-else-if="preset === 'stomach-juice'">
      <!-- 胃腔背景 -->
      <rect x="0" y="0" width="640" height="300" fill="#fdf7ee" />

      <!-- 黏膜剖面（含黏液层与胃腺） -->
      <path
        d="M0 296 C 78 280 138 304 208 292 C 278 280 330 302 400 292 C 468 282 542 302 640 284 L 640 400 L 0 400 Z"
        fill="url(#sp-mucosa)"
      />
      <path
        d="M0 296 C 78 280 138 304 208 292 C 278 280 330 302 400 292 C 468 282 542 302 640 284"
        fill="none" stroke="#cbe0c0" stroke-width="11" opacity="0.95"
      />
      <path
        d="M0 296 C 78 280 138 304 208 292 C 278 280 330 302 400 292 C 468 282 542 302 640 284"
        fill="none" stroke="#7e1f2e" stroke-width="3.4"
      />

      <!-- 两条胃腺：胃小凹 → 腺管（开口穿过黏膜表面） -->
      <g>
        <path
          d="M186 292 C 190 320 194 356 196 402 L 236 402 C 238 356 242 320 244 292"
          fill="#fbe6ea" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round"
        />
        <path
          d="M410 292 C 414 320 418 356 420 402 L 460 402 C 462 356 466 320 468 292"
          fill="#fbe6ea" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round"
        />
        <!-- 黏液细胞 / 壁细胞 / 主细胞（左右壁各一列） -->
        <g v-for="(cx, gi) in [216, 440]" :key="`sp-cells-${gi}`">
          <g v-for="s in [-1, 1]" :key="`sp-cell-${gi}-${s}`">
            <rect :x="cx + s * 11 - 7" y="304" width="14" height="18" rx="5" fill="#a9c9a2" stroke="#6f8f6b" stroke-width="1.3" />
            <rect :x="cx + s * 11 - 7" y="330" width="14" height="20" rx="5" fill="#eaa563" stroke="#b56f34" stroke-width="1.3" />
            <rect :x="cx + s * 11 - 7" y="358" width="14" height="22" rx="5" fill="#8fb3cd" stroke="#5a7f9b" stroke-width="1.3" />
            <circle :cx="cx + s * 11" cy="313" r="1.8" fill="#4f6f4b" />
            <circle :cx="cx + s * 11" cy="340" r="1.8" fill="#8a4f1f" />
            <circle :cx="cx + s * 11" cy="369" r="1.8" fill="#3f627c" />
          </g>
        </g>
      </g>

      <!-- 胃酸（盐酸）：自壁细胞经胃小凹进入胃腔 -->
      <g v-for="(d, i) in acidDots" :key="`sp-acid-${i}`">
        <circle r="4.6" fill="#e8913f" stroke="#a95f1c" stroke-width="1.3" opacity="0">
          <animateMotion
            path="M206 340 C 206 322 212 308 216 296 C 218 280 214 264 204 252 C 196 242 190 234 186 226"
            dur="4.6s" :begin="d.begin" repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0;1;0.95;0" keyTimes="0;0.08;0.82;1" dur="4.6s" :begin="d.begin" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 胃蛋白酶原：自主细胞分泌，进入胃腔后激活（变色） -->
      <g v-for="(d, i) in pepsinogenDots" :key="`sp-pep-${i}`">
        <circle r="4.6" fill="#8fb3cd" stroke="#5a7f9b" stroke-width="1.3" opacity="0">
          <animateMotion
            path="M430 372 C 430 350 434 330 438 310 C 442 294 446 278 452 264 C 458 252 462 246 466 240"
            dur="4.6s" :begin="d.begin" repeatCount="indefinite"
          />
          <animate attributeName="fill" values="#8fb3cd;#8fb3cd;#9a7bb5;#9a7bb5" keyTimes="0;0.45;0.7;1" dur="4.6s" :begin="d.begin" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.95;0" keyTimes="0;0.08;0.82;1" dur="4.6s" :begin="d.begin" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 胃腔中的蛋白质链：被胃蛋白酶切成两段多肽 -->
      <g>
        <path
          :d="`M${PEPTIDE_LEFT[0].x} ${PEPTIDE_LEFT[0].y} C 262 108 280 134 300 120`"
          fill="none" stroke="#a995b8" stroke-width="2" opacity="0.7"
        />
        <path
          :d="`M310 120 C 330 134 344 108 362 116`"
          fill="none" stroke="#a995b8" stroke-width="2" opacity="0.7"
        />
        <g>
          <animateTransform
            attributeName="transform" type="translate" values="0 0; -7 2; 0 0"
            keyTimes="0;0.5;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
          />
          <g v-for="(b, i) in PEPTIDE_LEFT" :key="`sp-pepL-${i}`">
            <circle :cx="b.x" :cy="b.y" r="7.4" fill="#bdaecb" stroke="#6f5f84" stroke-width="1.6" />
            <circle :cx="b.x - 2" :cy="b.y - 2.2" r="2" fill="#ffffff" opacity="0.45" />
          </g>
        </g>
        <g>
          <animateTransform
            attributeName="transform" type="translate" values="0 0; 7 -2; 0 0"
            keyTimes="0;0.5;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
          />
          <g v-for="(b, i) in PEPTIDE_RIGHT" :key="`sp-pepR-${i}`">
            <circle :cx="b.x" :cy="b.y" r="7.4" fill="#bdaecb" stroke="#6f5f84" stroke-width="1.6" />
            <circle :cx="b.x - 2" :cy="b.y - 2.2" r="2" fill="#ffffff" opacity="0.45" />
          </g>
        </g>
        <!-- 胃蛋白酶（切开的动作） -->
        <g>
          <animateTransform
            attributeName="transform" type="translate" values="0 -8; 0 12; 0 -8"
            keyTimes="0;0.5;1" dur="5s" repeatCount="indefinite" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
          />
          <circle cx="305" cy="86" r="12" fill="#9a7bb5" stroke="#5f4677" stroke-width="2" />
          <path d="M305 86 L 316 79" stroke="#fdf7ee" stroke-width="6" stroke-linecap="round" />
          <circle cx="301" cy="82" r="2.6" fill="#ffffff" opacity="0.6" />
        </g>
      </g>

      <!-- 胃腔内漂浮的食糜颗粒 -->
      <g fill="#c9a06a" opacity="0.55">
        <circle cx="96" cy="112" r="5" />
        <circle cx="142" cy="188" r="4.2" />
        <circle cx="236" cy="74" r="4.6" />
        <circle cx="410" cy="150" r="4.4" />
        <circle cx="470" cy="106" r="3.8" />
        <circle cx="530" cy="180" r="4.6" />
        <circle cx="356" cy="62" r="3.6" />
      </g>

      <g class="plate-label">
        <text x="40" y="58">胃腔</text>
        <text x="58" y="150">蛋白质 → 多肽</text>
        <path d="M166 156 L 240 134" />
        <text x="118" y="236">胃酸（盐酸）</text>
        <path d="M180 242 L 204 262" />
        <text x="384" y="212">胃蛋白酶原 → 胃蛋白酶</text>
        <path d="M452 220 L 452 246" />
        <text x="504" y="252">黏液层</text>
        <path d="M502 258 L 480 282" />
        <text x="512" y="330">胃腺</text>
        <path d="M510 324 L 466 322" />
        <text x="20" y="322">壁细胞（分泌盐酸）</text>
        <path d="M152 316 L 198 330" />
        <text x="20" y="362">主细胞（分泌胃蛋白酶原）</text>
        <path d="M172 356 L 204 364" />
      </g>
    </g>

    <!-- ================= 食糜排空 ================= -->
    <g v-else-if="preset === 'stomach-empty'">
      <ellipse cx="330" cy="368" rx="180" ry="10" fill="#e9e1cd" />

      <!-- 小肠（十二指肠延续的盘曲，向画面外延伸） -->
      <path
        d="M430 306 C 452 328 478 342 506 346 C 538 351 570 340 604 316"
        fill="none" stroke="#7e1f2e" stroke-width="30" stroke-linecap="round"
      />
      <path
        d="M430 306 C 452 328 478 342 506 346 C 538 351 570 340 604 316"
        fill="none" stroke="url(#sp-bowel)" stroke-width="21" stroke-linecap="round"
      />
      <path
        d="M430 306 C 452 328 478 342 506 346 C 538 351 570 340 604 316"
        fill="none" stroke="#b95769" stroke-width="19" stroke-dasharray="3 13" opacity="0.45" stroke-linecap="round"
      />

      <!-- 十二指肠 -->
      <path d="M330 248 C 360 240 388 238 406 250 C 424 262 428 288 430 306" fill="none" stroke="#7e1f2e" stroke-width="26" stroke-linecap="round" />
      <path d="M330 248 C 360 240 388 238 406 250 C 424 262 428 288 430 306" fill="none" stroke="url(#sp-bowel)" stroke-width="18" stroke-linecap="round" />

      <!-- 胃（收缩态，略缩小） -->
      <g transform="translate(250 200) scale(0.8) translate(-250 -200)">
        <path :d="STOMACH_PATH" fill="url(#sp-stomach)" stroke="#7e1f2e" stroke-width="4.6" stroke-linejoin="round" />
        <g clip-path="url(#sp-body-clip)">
          <path :d="WAVE_PATH" fill="none" stroke="#b74a5e" stroke-width="20" opacity="0.26" stroke-linecap="round">
            <animateTransform attributeName="transform" type="translate" values="0 -140; 0 80" dur="3.4s" repeatCount="indefinite" />
          </path>
          <path d="M192 120 C 180 160 182 210 200 246" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.32" />
          <g fill="#c98a4b" opacity="0.75">
            <circle cx="248" cy="196" r="6" />
            <circle cx="270" cy="216" r="5" />
            <circle cx="232" cy="222" r="4.6" />
            <circle cx="288" cy="240" r="5.4" />
            <circle cx="256" cy="252" r="4.4" />
          </g>
        </g>

        <!-- 幽门括约肌：两道括约肌唇，分批张开 -->
        <g stroke="#7e1f2e" stroke-width="3" fill="#d97f8f">
          <ellipse cx="330" cy="240" rx="9" ry="12" transform="rotate(-20 330 240)">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 -5; 0 0" keyTimes="0;0.5;1" dur="3s" repeatCount="indefinite" additive="sum" />
          </ellipse>
          <ellipse cx="330" cy="262" rx="9" ry="12" transform="rotate(20 330 262)">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 5; 0 0" keyTimes="0;0.5;1" dur="3s" repeatCount="indefinite" additive="sum" />
          </ellipse>
        </g>
      </g>

      <!-- 食糜粒子：胃内 → 幽门 → 十二指肠 → 小肠 -->
      <g v-for="(d, i) in chymeDots" :key="`sp-chyme-${i}`">
        <circle r="5.2" fill="#c9a06a" stroke="#8a5a24" stroke-width="1.4" opacity="0">
          <animateMotion :path="CHYME_PATH" dur="5.6s" :begin="d.begin" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.95;0" keyTimes="0;0.07;0.88;1" dur="5.6s" :begin="d.begin" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="plate-label">
        <text x="132" y="272">胃窦</text>
        <path d="M160 266 L 236 264" />
        <text x="356" y="196">幽门括约肌</text>
        <path d="M384 202 L 342 232" />
        <text x="196" y="332">食糜</text>
        <path d="M232 326 L 292 276" />
        <text x="348" y="356">十二指肠</text>
        <path d="M394 348 L 412 288" />
        <text x="470" y="268">小肠</text>
        <path d="M498 274 L 514 340" />
      </g>
    </g>
  </g>
</template>
