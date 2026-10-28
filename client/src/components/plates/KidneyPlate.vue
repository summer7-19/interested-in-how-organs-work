<script setup lang="ts">
/**
 * 肾脏图版：同一套「卡通 × 解剖」画风。
 * - kidney-filter：肾小球滤过——入球/出球小动脉、肾小球、肾小囊、原尿
 * - kidney-reabsorb：肾小管重吸收——水、葡萄糖、钠离子回到毛细血管，废物留下
 * - kidney-urine：集合管 → 肾盂 → 输尿管 → 膀胱 → 尿道
 */
defineProps<{ preset: string }>();

/** 滤过：血液进入肾小球 → 滤液进入肾小囊 → 沿肾小管流走 */
const FILTRATE_PATH =
  'M236 196 C 252 176 276 176 292 192 C 306 206 320 226 340 236 C 366 248 392 240 414 252 C 440 266 466 292 508 296';
/** 血液路径：入球小动脉 → 肾小球内盘绕 → 出球小动脉 */
const BLOOD_PATH =
  'M96 252 C 124 248 152 240 176 230 C 202 219 222 228 238 230 C 256 232 270 222 272 206 ' +
  'C 274 192 262 182 250 186 C 238 190 236 204 246 210 C 258 218 276 208 282 192 ' +
  'C 288 176 300 160 318 148 C 326 143 332 137 340 132';
/** 肾小球毛细血管球外轮廓 */
const TUFT_PATH =
  'M248 146 C 280 144 306 162 310 190 C 314 220 296 248 264 254 ' +
  'C 234 259 206 244 198 218 C 190 192 202 160 226 150 C 233 147 240 146 248 146 Z';

/** 重吸收：三种物质从管腔回到毛细血管 */
const REABSORB = [
  { from: [214, 214], to: [214, 322], c: '#5b8cb8', label: '水' },
  { from: [300, 200], to: [300, 336], c: '#d99a4e', label: '葡萄糖' },
  { from: [388, 224], to: [388, 320], c: '#8a7bb0', label: '钠离子' },
];

/** 尿液通路：集合管 → 肾盂 → 输尿管 → 膀胱 */
const URINE_PATH =
  'M262 196 C 276 206 292 214 302 222 C 314 240 322 264 330 288 C 344 322 372 340 402 348 C 420 352 434 356 442 360';
</script>

<template>
  <g filter="url(#av-ink-wobble)">
    <defs>
      <linearGradient id="kp-kidney" x1="0.2" y1="0" x2="0.85" y2="1">
        <stop offset="0" stop-color="#d4707a" />
        <stop offset="0.55" stop-color="#ab3a47" />
        <stop offset="1" stop-color="#7f2230" />
      </linearGradient>
      <linearGradient id="kp-lumen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7eac4" />
        <stop offset="1" stop-color="#e9cf95" />
      </linearGradient>
      <linearGradient id="kp-bladder" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#f6b3bd" />
        <stop offset="1" stop-color="#dd8493" />
      </linearGradient>
      <radialGradient id="kp-tuft" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stop-color="#e2919c" />
        <stop offset="0.7" stop-color="#cf5468" />
        <stop offset="1" stop-color="#b33f52" />
      </radialGradient>
    </defs>

    <!-- ================= 肾小球滤过 ================= -->
    <g v-if="preset === 'kidney-filter'">
      <ellipse cx="320" cy="368" rx="196" ry="11" fill="#e9e1cd" />

      <!-- 入球 / 出球小动脉 -->
      <path d="M84 264 C 120 258 150 244 176 230" fill="none" stroke="#7e1f2e" stroke-width="17" stroke-linecap="round" />
      <path d="M84 264 C 120 258 150 244 176 230" fill="none" stroke="#c4566a" stroke-width="11" stroke-linecap="round" />
      <path d="M266 176 C 292 160 314 146 340 132" fill="none" stroke="#7e1f2e" stroke-width="14" stroke-linecap="round" />
      <path d="M266 176 C 292 160 314 146 340 132" fill="none" stroke="#a3465a" stroke-width="8.5" stroke-linecap="round" />

      <!-- 肾小管（沿囊腔右侧延伸） -->
      <path d="M320 232 C 356 258 386 246 414 258 C 446 272 470 296 512 300" fill="none" stroke="#7e1f2e" stroke-width="30" stroke-linecap="round" />
      <path d="M320 232 C 356 258 386 246 414 258 C 446 272 470 296 512 300" fill="none" stroke="url(#kp-lumen)" stroke-width="21" stroke-linecap="round" />

      <!-- 肾小囊（双层壁） -->
      <circle cx="248" cy="204" r="96" fill="#fdf6ec" stroke="#7e1f2e" stroke-width="4" />
      <circle cx="248" cy="204" r="80" fill="#fbf0e4" stroke="#c9b39b" stroke-width="2.4" stroke-dasharray="7 8" />

      <!-- 肾小球：盘绕的毛细血管球 -->
      <path :d="TUFT_PATH" fill="url(#kp-tuft)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round" />
      <g fill="none" stroke-linecap="round">
        <path d="M248 160 C 282 160 298 180 292 200 C 286 222 256 230 238 216 C 220 202 222 174 242 166 C 258 159 274 168 274 184 C 274 198 258 206 246 202 C 236 198 234 186 242 180" stroke="#7e1f2e" stroke-width="9" opacity="0.55" />
        <path d="M248 160 C 282 160 298 180 292 200 C 286 222 256 230 238 216 C 220 202 222 174 242 166 C 258 159 274 168 274 184 C 274 198 258 206 246 202 C 236 198 234 186 242 180" stroke="#f5c2c9" stroke-width="4" />
        <path d="M212 210 C 206 190 218 168 240 160" stroke="#7e1f2e" stroke-width="7" opacity="0.45" />
        <path d="M212 210 C 206 190 218 168 240 160" stroke="#f5c2c9" stroke-width="3" />
        <path d="M272 230 C 288 224 298 214 304 200" stroke="#7e1f2e" stroke-width="7" opacity="0.45" />
        <path d="M272 230 C 288 224 298 214 304 200" stroke="#f5c2c9" stroke-width="3" />
      </g>

      <!-- 血细胞：沿小动脉进出，留在血管内 -->
      <g v-for="n in 4" :key="`kp-rbc-${n}`">
        <ellipse rx="6" ry="4.2" fill="#c8384f" stroke="#7e1f2e" stroke-width="1.3" opacity="0">
          <animateMotion :path="BLOOD_PATH" dur="4.6s" :begin="`${(n - 1) * 1.15 - 4.6}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.06;0.9;1" dur="4.6s" :begin="`${(n - 1) * 1.15 - 4.6}s`" repeatCount="indefinite" />
        </ellipse>
      </g>

      <!-- 滤液（原尿）：小分子穿出血管进入囊腔并流入肾小管 -->
      <g v-for="n in 5" :key="`kp-filtrate-${n}`">
        <circle r="4.6" fill="#e8b959" stroke="#a97f2c" stroke-width="1.3" opacity="0">
          <animateMotion :path="FILTRATE_PATH" dur="5s" :begin="`${(n - 1) * 1 - 5}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.95;0" keyTimes="0;0.08;0.88;1" dur="5s" :begin="`${(n - 1) * 1 - 5}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="plate-label">
        <text x="58" y="286">入球小动脉</text>
        <path d="M104 280 L 128 268" />
        <text x="366" y="122">出球小动脉</text>
        <path d="M364 126 L 340 140" />
        <text x="132" y="344">肾小球</text>
        <path d="M176 338 L 224 246" />
        <text x="106" y="128">肾小囊</text>
        <path d="M156 132 L 178 140" />
        <text x="470" y="344">肾小管</text>
        <path d="M468 338 L 452 310" />
        <text x="470" y="176">滤液（原尿）</text>
        <path d="M468 182 L 430 246" />
      </g>
    </g>

    <!-- ================= 肾小管重吸收 ================= -->
    <g v-else-if="preset === 'kidney-reabsorb'">
      <ellipse cx="320" cy="368" rx="230" ry="11" fill="#e9e1cd" />

      <!-- 毛细血管（管外） -->
      <path d="M64 322 C 132 300 190 344 254 330 C 320 316 372 350 436 328 C 484 312 522 324 556 336" fill="none" stroke="#7e1f2e" stroke-width="19" stroke-linecap="round" />
      <path d="M64 322 C 132 300 190 344 254 330 C 320 316 372 350 436 328 C 484 312 522 324 556 336" fill="none" stroke="#c4566a" stroke-width="12" stroke-linecap="round" />

      <!-- 肾小管（管腔） -->
      <path d="M64 190 C 132 166 190 214 254 198 C 320 182 372 224 436 200 C 484 182 522 196 556 208" fill="none" stroke="#7e1f2e" stroke-width="40" stroke-linecap="round" />
      <path d="M64 190 C 132 166 190 214 254 198 C 320 182 372 224 436 200 C 484 182 522 196 556 208" fill="none" stroke="url(#kp-lumen)" stroke-width="29" stroke-linecap="round" />
      <path d="M64 190 C 132 166 190 214 254 198 C 320 182 372 224 436 200 C 484 182 522 196 556 208" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.35" transform="translate(0 -9)" />

      <!-- 管壁细胞（示意） -->
      <g fill="#d8b06e" stroke="#a97f2c" stroke-width="1.6">
        <rect x="120" y="192" width="16" height="16" rx="5" transform="rotate(-14 128 200)" />
        <rect x="204" y="188" width="16" height="16" rx="5" transform="rotate(10 212 196)" />
        <rect x="300" y="182" width="16" height="16" rx="5" transform="rotate(-10 308 190)" />
        <rect x="404" y="192" width="16" height="16" rx="5" transform="rotate(12 412 200)" />
      </g>

      <!-- 重吸收：水 / 葡萄糖 / 钠离子 从管腔进入毛细血管 -->
      <g v-for="(item, i) in REABSORB" :key="`kp-absorb-${i}`">
        <path
          :d="`M${item.from[0]} ${item.from[1]} C ${item.from[0] - 4} ${item.from[1] + 44} ${item.to[0] - 6} ${item.to[1] - 44} ${item.to[0]} ${item.to[1]}`"
          fill="none" :stroke="item.c" stroke-width="2.4" stroke-dasharray="5 7" opacity="0.55"
        />
        <g v-for="n in 3" :key="`kp-absorb-${i}-${n}`">
          <circle r="5" :fill="item.c" stroke="#7e1f2e" stroke-width="1.2" opacity="0">
            <animateMotion
              :path="`M${item.from[0]} ${item.from[1]} C ${item.from[0] - 4} ${item.from[1] + 44} ${item.to[0] - 6} ${item.to[1] - 44} ${item.to[0]} ${item.to[1]}`"
              dur="3.2s" :begin="`${(n - 1) * 1.05 - 3.2 + i * 0.4}s`" repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.86;1" dur="3.2s" :begin="`${(n - 1) * 1.05 - 3.2 + i * 0.4}s`" repeatCount="indefinite" />
          </circle>
        </g>
      </g>

      <!-- 废物：继续留在管内向下游流动 -->
      <g v-for="n in 4" :key="`kp-waste-${n}`">
        <circle r="4.8" fill="#9a9275" stroke="#6f6952" stroke-width="1.3" opacity="0">
          <animateMotion
            path="M96 196 C 160 174 214 216 276 202 C 340 188 396 226 456 204 C 500 188 528 198 552 206"
            dur="5.4s" :begin="`${(n - 1) * 1.2 - 5.4}s`" repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur="5.4s" :begin="`${(n - 1) * 1.2 - 5.4}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="plate-label">
        <text x="56" y="130">肾小管（原尿）</text>
        <path d="M128 136 L 146 164" />
        <text x="452" y="280">毛细血管</text>
        <path d="M490 286 L 502 312" />
        <text x="120" y="268">水</text>
        <path d="M148 272 L 196 214" />
        <text x="238" y="272">葡萄糖</text>
        <path d="M270 268 L 296 214" />
        <text x="400" y="300">钠离子</text>
        <path d="M400 294 L 390 226" />
        <text x="452" y="140">废物留在管内</text>
        <path d="M506 146 L 476 188" />
      </g>
    </g>

    <!-- ================= 尿液收集与排出 ================= -->
    <g v-else-if="preset === 'kidney-urine'">
      <ellipse cx="320" cy="368" rx="196" ry="11" fill="#e9e1cd" />

      <!-- 肾脏（豆形，右侧肾门） -->
      <path
        d="M198 74 C 258 62 314 100 322 162 C 328 208 316 250 296 276
           C 286 296 268 310 246 314 C 230 317 214 308 208 294
           C 180 268 170 228 172 190 C 174 140 180 86 198 74 Z"
        fill="url(#kp-kidney)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round"
      />
      <path d="M196 106 C 186 142 184 190 194 232" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.28" />

      <!-- 髓质锥体（示意） -->
      <g fill="none" stroke="#f0c3c6" stroke-width="2.2" opacity="0.6">
        <path d="M206 130 C 226 150 234 178 230 206" />
        <path d="M244 120 C 262 148 268 184 262 214" />
        <path d="M282 126 C 292 154 294 186 288 212" />
      </g>

      <!-- 集合管：向肾盂汇集 -->
      <g fill="none" stroke="#7e1f2e" stroke-width="5.4" stroke-linecap="round" opacity="0.9">
        <path d="M206 132 C 232 158 252 186 272 214" />
        <path d="M244 122 C 266 152 280 186 286 216" />
        <path d="M282 128 C 292 158 294 190 292 218" />
      </g>
      <g fill="none" stroke="#e8b959" stroke-width="2.4" stroke-linecap="round">
        <path d="M206 132 C 232 158 252 186 272 214" />
        <path d="M244 122 C 266 152 280 186 286 216" />
        <path d="M282 128 C 292 158 294 190 292 218" />
      </g>

      <!-- 肾盂 -->
      <path d="M270 208 C 288 202 302 210 304 224 C 306 240 296 250 282 248 C 274 246 270 238 272 230 Z" fill="#f0d08a" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round" />

      <!-- 输尿管 -->
      <path d="M292 246 C 316 274 328 304 344 330 C 358 352 384 362 414 366" fill="none" stroke="#7e1f2e" stroke-width="15" stroke-linecap="round" />
      <path d="M292 246 C 316 274 328 304 344 330 C 358 352 384 362 414 366" fill="none" stroke="#f0d08a" stroke-width="8" stroke-linecap="round" />

      <!-- 膀胱 -->
      <ellipse cx="444" cy="358" rx="34" ry="25" fill="url(#kp-bladder)" stroke="#7e1f2e" stroke-width="3.4" />
      <path d="M424 344 C 430 336 444 334 456 340" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.45" />
      <path d="M430 382 L 430 392" stroke="#7e1f2e" stroke-width="9" stroke-linecap="round" />
      <path d="M430 382 L 430 392" stroke="#dd8493" stroke-width="5" stroke-linecap="round" />

      <!-- 尿液粒子：集合管 → 肾盂 → 输尿管 → 膀胱 -->
      <g v-for="n in 5" :key="`kp-urine-${n}`">
        <circle r="4.8" fill="#e8b959" stroke="#a97f2c" stroke-width="1.3" opacity="0">
          <animateMotion :path="URINE_PATH" dur="4.6s" :begin="`${(n - 1) * 0.92 - 4.6}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.95;0" keyTimes="0;0.06;0.9;1" dur="4.6s" :begin="`${(n - 1) * 0.92 - 4.6}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <g class="plate-label">
        <text x="330" y="92">集合管</text>
        <path d="M328 98 L 292 132" />
        <text x="330" y="196">肾盂</text>
        <path d="M328 192 L 306 216" />
        <text x="376" y="300">输尿管</text>
        <path d="M374 296 L 340 300" />
        <text x="492" y="352">膀胱</text>
        <path d="M490 348 L 478 352" />
        <text x="474" y="392">尿道</text>
        <path d="M470 386 L 436 388" />
      </g>
    </g>
  </g>
</template>
