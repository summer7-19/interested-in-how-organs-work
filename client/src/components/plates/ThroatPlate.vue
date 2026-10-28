<script setup lang="ts">
import { computed } from 'vue';

/**
 * 咽喉图版：同一套「卡通 × 解剖」画风。
 * - throat-shared：颈段矢状剖面——咽是呼吸与吞咽的十字路口，空气向前入喉，食物向后入食管
 * - throat-epiglottis：吞咽时会厌翻转盖住喉口，食团滑入食管
 * - throat-voice：喉部放大——声带闭合、气流挤出使声带振动发声
 */
const props = defineProps<{ preset: string }>();

const isNeckScene = computed(
  () => props.preset === 'throat-shared' || props.preset === 'throat-epiglottis',
);

/** 空气：鼻腔 → 咽 → 喉 → 气管 */
const AIR_PATH =
  'M200 72 C 240 70 280 74 304 84 C 322 100 330 120 328 144 ' +
  'C 326 168 318 188 312 206 C 308 220 306 230 306 242 ' +
  'C 306 262 304 282 304 304 C 304 336 304 360 304 384';

/** 食物：口腔 → 咽 → 食管 */
const FOOD_PATH =
  'M206 158 C 240 156 274 158 298 164 C 316 174 328 190 338 208 ' +
  'C 348 228 352 252 352 282 C 352 316 352 350 352 384';

const airDots = Array.from({ length: 5 }, (_, i) => ({ begin: `${(i * 0.9 - 4.5).toFixed(2)}s` }));
const foodDots = Array.from({ length: 5 }, (_, i) => ({ begin: `${(i * 0.9 - 4.5).toFixed(2)}s` }));
const bolusDots = [
  { begin: '-1.4s', r: 10.5 },
  { begin: '-3.1s', r: 8 },
];

/** 声带振动：气流自下而上穿过声门 */
const VOICE_AIR = 'M320 372 C 320 340 320 310 320 282 C 320 260 320 240 320 222 C 320 200 320 178 320 156';
</script>

<template>
  <g filter="url(#av-ink-wobble)">
    <defs>
      <linearGradient id="tp-trachea" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#f2a2ac" />
        <stop offset="1" stop-color="#d8788a" />
      </linearGradient>
      <linearGradient id="tp-esophagus" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#dfb0c4" />
        <stop offset="1" stop-color="#bd849e" />
      </linearGradient>
      <linearGradient id="tp-larynx" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#f7d3d8" />
        <stop offset="1" stop-color="#e2a7b1" />
      </linearGradient>
      <linearGradient id="tp-slab" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="#faf3e6" />
        <stop offset="1" stop-color="#efe0c9" />
      </linearGradient>
      <clipPath id="tp-neck-clip">
        <path
          d="M156 26 C 236 14 320 16 360 36 C 380 74 386 140 382 210
             C 378 284 362 340 332 364 C 296 382 226 382 192 368
             C 162 354 152 296 154 226 C 156 150 146 62 156 26 Z"
        />
      </clipPath>
    </defs>

    <!-- ================= 颈段剖面：共用通道 / 会厌 ================= -->
    <g v-if="isNeckScene">
      <ellipse cx="300" cy="380" rx="150" ry="9" fill="#e9e1cd" opacity="0.7" />

      <!-- 颈部剖面底 -->
      <path
        d="M156 26 C 236 14 320 16 360 36 C 380 74 386 140 382 210
           C 378 284 362 340 332 364 C 296 382 226 382 192 368
           C 162 354 152 296 154 226 C 156 150 146 62 156 26 Z"
        fill="url(#tp-slab)" stroke="#d9c3a3" stroke-width="2.6" stroke-linejoin="round"
      />
      <path
        d="M352 46 C 372 88 378 150 374 212 C 370 278 356 330 330 352 L 340 368 C 370 344 388 288 392 212 C 396 144 386 78 362 40 Z"
        fill="#dcc0a2" opacity="0.24"
      />

      <!-- 食管（后方通道，压在喉之下） -->
      <path d="M332 228 C 346 242 354 260 354 282 C 354 316 353 350 354 384" fill="none" stroke="#7e1f2e" stroke-width="30" stroke-linecap="round" />
      <path d="M332 228 C 346 242 354 260 354 282 C 354 316 353 350 354 384" fill="none" stroke="url(#tp-esophagus)" stroke-width="20" stroke-linecap="round" />

      <!-- 鼻腔 -->
      <path
        d="M176 62 C 208 50 254 52 288 64 C 302 74 298 92 282 100
           C 250 110 208 106 184 96 C 174 88 170 70 176 62 Z"
        fill="#fbe6e9" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round"
      />
      <g fill="none" stroke="#d98f9d" stroke-width="2.4" opacity="0.8" stroke-linecap="round">
        <path d="M186 68 C 214 62 248 64 276 74" />
        <path d="M184 80 C 214 76 246 78 282 86" />
        <path d="M188 92 C 216 92 244 94 274 96" />
      </g>
      <path d="M160 72 C 168 68 172 74 168 82" fill="#f6d6dc" stroke="#7e1f2e" stroke-width="2.6" />

      <!-- 口腔 + 舌 -->
      <path
        d="M172 136 C 206 126 250 128 282 140 C 308 150 306 174 286 184
           C 248 194 200 192 178 182 C 166 174 164 148 172 136 Z"
        fill="#fbeef0" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round"
      />
      <path
        d="M186 176 C 214 190 252 192 274 182 C 282 176 278 168 266 166
           C 238 162 202 162 186 170 Z"
        fill="#e8889a" stroke="#a34452" stroke-width="2.4" stroke-linejoin="round"
      />
      <g fill="#fdfbf6" stroke="#c9a98c" stroke-width="1.6">
        <rect x="172" y="138" width="12" height="9" rx="2.5" transform="rotate(-8 178 142)" />
        <rect x="186" y="134" width="12" height="9" rx="2.5" transform="rotate(-4 192 138)" />
        <rect x="200" y="132" width="12" height="9" rx="2.5" />
      </g>

      <!-- 咽（共用通道，向上延伸至鼻咽） -->
      <g clip-path="url(#tp-neck-clip)">
        <path d="M304 18 C 322 56 332 96 332 132 C 332 168 328 198 320 224" fill="none" stroke="#7e1f2e" stroke-width="52" stroke-linecap="butt" />
        <path d="M304 18 C 322 56 332 96 332 132 C 332 168 328 198 320 224" fill="none" stroke="#f9e3e7" stroke-width="42" stroke-linecap="butt" />
        <path d="M294 26 C 312 60 322 96 322 132 C 322 168 318 198 310 220" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.5" />
        <path d="M318 26 C 336 60 346 96 346 132 C 346 168 342 198 334 220" fill="none" stroke="#e7b4c1" stroke-width="7" stroke-linecap="round" opacity="0.35" />
      </g>

      <!-- 喉（甲状软骨包裹的气道入口） -->
      <path
        d="M288 224 C 300 218 314 218 326 224 C 336 240 338 262 332 278
           C 324 290 312 294 306 294 C 300 294 288 290 280 278
           C 274 262 276 240 288 224 Z"
        fill="url(#tp-larynx)" stroke="#7e1f2e" stroke-width="3.4" stroke-linejoin="round"
      />
      <path d="M306 226 L 306 288" stroke="#d08a97" stroke-width="2.2" opacity="0.55" />
      <path d="M296 232 C 300 252 300 270 298 284" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.4" />

      <!-- 声带（示意，两条小皱襞） -->
      <g fill="#f7e3d7" stroke="#a34452" stroke-width="1.8">
        <path d="M294 256 C 299 253 304 255 306 260 C 302 264 297 264 293 261 Z" />
        <path d="M318 256 C 313 253 308 255 306 260 C 310 264 315 264 319 261 Z" />
      </g>

      <!-- 会厌：站立 / 吞咽时翻转盖住喉口 -->
      <g v-if="preset === 'throat-shared'">
        <path
          d="M288 228 C 286 210 294 194 308 186 C 318 180 326 186 324 198
             C 322 210 308 220 294 230 Z"
          fill="#cfe0c4" stroke="#6f8f6b" stroke-width="3" stroke-linejoin="round"
        />
        <path d="M296 216 C 300 202 308 192 318 188" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.5" />
      </g>
      <g v-else>
        <path
          d="M288 228 C 286 210 294 194 308 186 C 318 180 326 186 324 198
             C 322 210 308 220 294 230 Z"
          fill="#cfe0c4" stroke="#6f8f6b" stroke-width="3" stroke-linejoin="round"
        >
          <animateTransform
            attributeName="transform" type="rotate" values="0 288 228; 60 288 228; 60 288 228; 0 288 228"
            keyTimes="0;0.22;0.78;1" dur="5s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.5 1;0 0 1 1;0.4 0 0.5 1"
          />
        </path>
        <path d="M296 216 C 300 202 308 192 318 188" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.5">
          <animateTransform
            attributeName="transform" type="rotate" values="0 288 228; 60 288 228; 60 288 228; 0 288 228"
            keyTimes="0;0.22;0.78;1" dur="5s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.5 1;0 0 1 1;0.4 0 0.5 1"
          />
        </path>
      </g>

      <!-- 气管（带软骨环） -->
      <path d="M304 288 C 303 320 305 352 304 384" fill="none" stroke="#7e1f2e" stroke-width="36" stroke-linecap="round" />
      <path d="M304 288 C 303 320 305 352 304 384" fill="none" stroke="url(#tp-trachea)" stroke-width="26" stroke-linecap="round" />
      <g stroke="#b85263" stroke-width="2.8" stroke-linecap="round">
        <line x1="291" y1="304" x2="317" y2="304" />
        <line x1="291" y1="322" x2="317" y2="322" />
        <line x1="291" y1="340" x2="317" y2="340" />
        <line x1="291" y1="358" x2="317" y2="358" />
        <line x1="291" y1="376" x2="317" y2="376" />
      </g>
      <path d="M292 296 C 290 320 290 352 292 378" fill="none" stroke="#ffffff" stroke-width="3.4" stroke-linecap="round" opacity="0.35" />

      <!-- 呼吸：空气 鼻腔 → 咽 → 喉 → 气管 -->
      <g v-if="preset === 'throat-shared'">
        <g v-for="(d, i) in airDots" :key="`tp-air-${i}`">
          <circle r="5.4" fill="#5f93bd" stroke="#3f6c8f" stroke-width="1.5" opacity="0">
            <animateMotion :path="AIR_PATH" dur="4.5s" :begin="d.begin" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0.92;0" keyTimes="0;0.06;0.9;1" dur="4.5s" :begin="d.begin" repeatCount="indefinite" />
          </circle>
        </g>
        <g v-for="(d, i) in foodDots" :key="`tp-food-${i}`">
          <circle r="4.8" fill="#c98a4b" stroke="#8a5a24" stroke-width="1.4" opacity="0">
            <animateMotion :path="FOOD_PATH" dur="4.5s" :begin="d.begin" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0.92;0" keyTimes="0;0.06;0.9;1" dur="4.5s" :begin="d.begin" repeatCount="indefinite" />
          </circle>
        </g>
      </g>

      <!-- 吞咽：食团经过咽 → 食管，会厌同时盖住喉口 -->
      <g v-else>
        <g v-for="(d, i) in bolusDots" :key="`tp-bolus-${i}`">
          <g opacity="0">
            <animateMotion :path="FOOD_PATH" dur="5s" :begin="d.begin" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.9;1" dur="5s" :begin="d.begin" repeatCount="indefinite" />
            <circle :r="d.r" fill="#e2a866" stroke="#8a5a24" stroke-width="1.8" />
            <circle :r="d.r * 0.55" cy="-2" fill="#f0c795" opacity="0.6" />
          </g>
        </g>
      </g>

      <g class="plate-label">
        <text x="92" y="72">鼻腔</text>
        <path d="M138 78 L 176 80" />
        <text x="88" y="160">口腔</text>
        <path d="M134 158 L 168 158" />
        <text x="392" y="106">咽（共用通道）</text>
        <path d="M390 112 L 344 118" />
        <text x="392" y="186">会厌</text>
        <path d="M390 192 L 324 216" />
        <text x="186" y="256">喉</text>
        <path d="M218 258 L 278 258" />
        <text x="186" y="336">气管</text>
        <path d="M218 334 L 286 330" />
        <text x="392" y="346">食管</text>
        <path d="M390 344 L 370 334" />
      </g>
    </g>

    <!-- ================= 声带振动发声 ================= -->
    <g v-else-if="preset === 'throat-voice'">
      <ellipse cx="320" cy="380" rx="140" ry="9" fill="#e9e1cd" opacity="0.7" />

      <!-- 气管与环状软骨（喉的下方） -->
      <path d="M320 292 C 319 326 321 358 320 386" fill="none" stroke="#7e1f2e" stroke-width="86" stroke-linecap="round" />
      <path d="M320 292 C 319 326 321 358 320 386" fill="none" stroke="url(#tp-trachea)" stroke-width="70" stroke-linecap="round" />
      <g stroke="#b85263" stroke-width="3.4" stroke-linecap="round">
        <line x1="292" y1="322" x2="348" y2="322" />
        <line x1="292" y1="344" x2="348" y2="344" />
        <line x1="292" y1="366" x2="348" y2="366" />
      </g>
      <ellipse cx="320" cy="288" rx="54" ry="16" fill="#efc3cc" stroke="#7e1f2e" stroke-width="3.4" />

      <!-- 甲状软骨（喉的"盾牌"） -->
      <path
        d="M320 52 C 372 56 406 88 410 134 C 414 182 394 226 358 252
           C 344 262 332 268 320 268 C 308 268 296 262 282 252
           C 246 226 226 182 230 134 C 234 88 268 56 320 52 Z"
        fill="url(#tp-larynx)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round"
      />
      <path d="M320 54 C 312 72 308 92 308 112" fill="none" stroke="#d08a97" stroke-width="2.6" opacity="0.6" />
      <path d="M320 54 C 328 72 332 92 332 112" fill="none" stroke="#d08a97" stroke-width="2.6" opacity="0.6" />
      <path d="M296 62 C 286 88 284 124 288 156 C 291 178 296 196 302 214" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.38" />

      <!-- 喉腔（声门所在） -->
      <path
        d="M320 66 C 336 66 344 84 344 110 C 344 150 342 200 340 240
           C 338 258 330 266 320 266 C 310 266 302 258 300 240
           C 298 200 296 150 296 110 C 296 84 304 66 320 66 Z"
        fill="#a85262" opacity="0.42"
      />

      <!-- 声带：两片黏膜皱襞，中间为声门裂 -->
      <g>
        <animateTransform
          attributeName="transform" type="translate" values="0 0; -2.4 0; 0 0; 2.4 0; 0 0"
          dur="0.36s" repeatCount="indefinite"
        />
        <path d="M292 192 C 302 186 312 190 316 201 C 312 212 302 215 292 210 Z" fill="#f7e3d7" stroke="#a34452" stroke-width="2.2" stroke-linejoin="round" />
        <path d="M296 196 C 302 193 308 195 311 200" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.55" />
      </g>
      <g>
        <animateTransform
          attributeName="transform" type="translate" values="0 0; 2.4 0; 0 0; -2.4 0; 0 0"
          dur="0.36s" repeatCount="indefinite"
        />
        <path d="M348 192 C 338 186 328 190 324 201 C 328 212 338 215 348 210 Z" fill="#f7e3d7" stroke="#a34452" stroke-width="2.2" stroke-linejoin="round" />
        <path d="M344 196 C 338 193 332 195 329 200" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity="0.55" />
      </g>

      <!-- 振动标记 -->
      <g fill="none" stroke="#b84a5e" stroke-width="2.6" stroke-linecap="round">
        <g opacity="0">
          <animate attributeName="opacity" values="0;0.9;0" dur="0.36s" repeatCount="indefinite" />
          <path d="M276 190 C 272 196 272 204 276 210" />
          <path d="M364 190 C 368 196 368 204 364 210" />
        </g>
        <g opacity="0">
          <animate attributeName="opacity" values="0.9;0;0.9" dur="0.36s" repeatCount="indefinite" />
          <path d="M266 184 C 260 194 260 206 266 216" />
          <path d="M374 184 C 380 194 380 206 374 216" />
        </g>
      </g>

      <!-- 气流自下而上穿过声门 -->
      <g v-for="n in 5" :key="`tp-voice-air-${n}`">
        <circle r="4.6" fill="#5f93bd" stroke="#3f6c8f" stroke-width="1.4" opacity="0">
          <animateMotion :path="VOICE_AIR" dur="2.6s" :begin="`${(n - 1) * 0.52 - 2.6}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.08;0.84;1" dur="2.6s" :begin="`${(n - 1) * 0.52 - 2.6}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="plate-label">
        <text x="86" y="120">甲状软骨</text>
        <path d="M172 126 L 246 140" />
        <text x="404" y="112">喉腔</text>
        <path d="M402 118 L 344 124" />
        <text x="404" y="212">声带（声襞）</text>
        <path d="M402 208 L 352 204" />
        <text x="86" y="252">声门裂</text>
        <path d="M156 246 L 316 214" />
        <text x="86" y="332">气流</text>
        <path d="M134 326 L 296 316" />
        <text x="404" y="336">气管</text>
        <path d="M402 330 L 352 328" />
      </g>
    </g>
  </g>
</template>
