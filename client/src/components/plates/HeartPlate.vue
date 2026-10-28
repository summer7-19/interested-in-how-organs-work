<script setup lang="ts">
/**
 * 心脏图版：与肺图版同一套「卡通 × 解剖」画风（深红厚描边、渐变、高光、纸面图注）。
 * - heart-cycle：心动周期——四腔切面、房室瓣与大血管，心房先收、心室后收
 * - heart-circulation：双循环——肺循环与体循环两条环路首尾相接
 * - heart-conduction：心电传导——窦房结 → 房室结 → 传导束，附心电图节律
 */
defineProps<{ preset: string }>();

/** 传导信号路径：窦房结 → 房室结 → 室间传导束 → 心尖 */
const CONDUCTION_MAIN =
  'M282 152 C 300 172 312 186 322 198 C 326 222 328 248 330 272 C 332 292 326 308 314 318';
const CONDUCTION_BRANCH = 'M330 272 C 344 286 354 300 358 314';

/** 四个方向的血流路径（心房 → 心室 → 大血管） */
const FLOW_TD = 'M268 194 C 274 202 282 208 287 216';
const FLOW_RV_PA = 'M282 214 C 278 186 280 158 288 132 C 292 118 296 104 296 90';
const FLOW_MV = 'M376 192 C 372 202 366 210 361 218';
const FLOW_LV_AO = 'M360 212 C 362 176 366 144 380 122 C 394 100 420 96 434 116';

const flowDots = [
  { d: FLOW_TD, begin: '-0.2s', dur: '2.2s', c: '#5b8cb8' },
  { d: FLOW_MV, begin: '-0.6s', dur: '2.2s', c: '#d24d60' },
];

/** 大血管内的血流（绘制在房室之下，只在血管露出心肌处可见） */
const vesselDots = [
  { d: FLOW_RV_PA, begin: '-1.1s', dur: '2.2s', c: '#5b8cb8' },
  { d: FLOW_LV_AO, begin: '-1.6s', dur: '2.2s', c: '#d24d60' },
];

/** 心电图纸迹（两个心动周期） */
const ECG_PATH =
  'M48 356 L 120 356 C 128 356 130 348 136 348 C 142 348 144 356 152 356 ' +
  'L 176 356 L 184 330 L 192 372 L 200 356 L 240 356 ' +
  'C 250 356 254 342 264 342 C 274 342 278 356 290 356 ' +
  'L 344 356 C 352 356 354 348 360 348 C 366 348 368 356 376 356 ' +
  'L 400 356 L 408 330 L 416 372 L 424 356 L 464 356 ' +
  'C 474 356 478 342 488 342 C 498 342 502 356 514 356';
</script>

<template>
  <g filter="url(#av-ink-wobble)">
    <defs>
      <linearGradient id="hp-muscle" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0" stop-color="#e98f9b" />
        <stop offset="0.55" stop-color="#c94a5c" />
        <stop offset="1" stop-color="#98263a" />
      </linearGradient>
      <linearGradient id="hp-lung" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="#f9c4ca" />
        <stop offset="0.55" stop-color="#ef97a4" />
        <stop offset="1" stop-color="#d8737f" />
      </linearGradient>
      <linearGradient id="hp-tissue" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="#e6d5b8" />
        <stop offset="1" stop-color="#cbb08a" />
      </linearGradient>
      <clipPath id="hp-cavity-clip">
        <path
          transform="translate(322 224) scale(0.94) translate(-322 -224)"
          d="M236 196 C 228 158 248 128 278 126 C 294 108 330 106 348 120 C 372 104 406 120 410 152
             C 416 190 408 236 388 272 C 372 302 352 326 330 340 C 306 330 286 306 268 274 C 246 236 238 216 236 196 Z"
        />
      </clipPath>
      <clipPath id="hp-body-clip">
        <path
          d="M236 196 C 228 158 248 128 278 126 C 294 108 330 106 348 120 C 372 104 406 120 410 152
             C 416 190 408 236 388 272 C 372 302 352 326 330 340 C 306 330 286 306 268 274 C 246 236 238 216 236 196 Z"
        />
      </clipPath>
    </defs>

    <!-- ================= 心动周期 ================= -->
    <g v-if="preset === 'heart-cycle'">
      <ellipse cx="320" cy="368" rx="176" ry="11" fill="#e9e1cd" />

      <g transform="translate(320 236)">
        <g>
          <animateTransform
            attributeName="transform" type="scale" values="1;1.045;0.99;1"
            keyTimes="0;0.3;0.62;1" dur="1.2s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.35 0 0.65 1;0.35 0 0.65 1;0.35 0 0.65 1"
          />
          <g transform="translate(-320 -236)">
            <!-- 大血管 -->
            <g fill="none" stroke-linecap="round">
              <path d="M282 214 C 278 186 280 158 288 132 C 292 118 296 104 296 90" stroke="#7e1f2e" stroke-width="21" />
              <path d="M282 214 C 278 186 280 158 288 132 C 292 118 296 104 296 90" stroke="#5b8cb8" stroke-width="15" />
              <path d="M360 212 C 362 176 366 144 380 122 C 394 100 420 96 434 116" stroke="#7e1f2e" stroke-width="23" />
              <path d="M360 212 C 362 176 366 144 380 122 C 394 100 420 96 434 116" stroke="#d24d60" stroke-width="17" />
              <path d="M250 84 C 252 110 256 132 262 152" stroke="#7e1f2e" stroke-width="20" />
              <path d="M250 84 C 252 110 256 132 262 152" stroke="#5b8cb8" stroke-width="14" />
              <path d="M444 196 C 424 188 410 180 400 172" stroke="#7e1f2e" stroke-width="13" />
              <path d="M444 196 C 424 188 410 180 400 172" stroke="#d24d60" stroke-width="8" />
            </g>

            <!-- 大血管内的血流：压在心肌之下，只在血管露出心肌处可见 -->
            <g v-for="(dot, i) in vesselDots" :key="`hp-vessel-${i}`">
              <circle r="4.6" :fill="dot.c" stroke="#7e1f2e" stroke-width="1.2" opacity="0">
                <animateMotion :path="dot.d" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.84;1" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
              </circle>
            </g>

            <!-- 心肌外轮廓 -->
            <path
              d="M236 196 C 228 158 248 128 278 126 C 294 108 330 106 348 120 C 372 104 406 120 410 152
                 C 416 190 408 236 388 272 C 372 302 352 326 330 340 C 306 330 286 306 268 274 C 246 236 238 216 236 196 Z"
              fill="url(#hp-muscle)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round"
            />
            <g clip-path="url(#hp-body-clip)">
              <path d="M244 200 C 240 240 252 282 274 312" fill="none" stroke="#ae3a4b" stroke-width="10" opacity="0.25" stroke-linecap="round" />
              <path d="M262 148 C 252 174 250 204 258 230" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.3" />
            </g>

            <!-- 心房：右心房（缺氧血，偏蓝）、左心房（富氧血，偏红） -->
            <g clip-path="url(#hp-cavity-clip)">
              <path
                d="M250 186 C 245 162 252 140 270 132 C 288 124 307 132 313 149 C 319 166 313 183 297 191 C 282 198 262 196 253 190 C 250 188 249 187 250 186 Z"
                fill="#cfe0ec" stroke="#6f92ad" stroke-width="1.8" stroke-linejoin="round"
              />
              <path
                d="M350 164 C 347 147 356 134 372 132 C 389 130 400 139 401 154 C 402 170 392 181 376 182 C 361 183 351 175 350 164 Z"
                fill="#f0c6cc" stroke="#b3606e" stroke-width="1.8" stroke-linejoin="round"
              />
              <!-- 房间隔 -->
              <path d="M319 142 C 322 156 323 168 324 178" fill="none" stroke="#c26a78" stroke-width="4" stroke-linecap="round" opacity="0.8" />

              <!-- 心室：右心室呈月牙形包绕室间隔，左心室更大、延伸至心尖 -->
              <path
                d="M262 210 C 284 200 299 208 302 226 C 306 246 300 266 289 281 C 283 289 273 291 267 285 C 257 273 252 251 253 234 C 254 221 257 214 262 210 Z"
                fill="#bfd5e6" stroke="#6f92ad" stroke-width="1.8" stroke-linejoin="round"
              />
              <path
                d="M332 214 C 356 204 380 214 389 240 C 398 268 390 296 374 314 C 362 328 348 334 338 332 C 326 330 318 312 316 288 C 314 254 320 228 332 214 Z"
                fill="#e9a3ad" stroke="#b3606e" stroke-width="1.8" stroke-linejoin="round"
              />
              <!-- 心室肌小梁（示意） -->
              <g fill="none" stroke="#9fbacd" stroke-width="3.5" stroke-linecap="round" opacity="0.75">
                <path d="M266 234 C 271 250 274 266 275 278" />
                <path d="M283 228 C 287 246 287 262 284 276" />
              </g>
              <g fill="none" stroke="#cf8793" stroke-width="3.5" stroke-linecap="round" opacity="0.65">
                <path d="M334 252 C 340 272 342 294 340 310" />
                <path d="M360 242 C 366 264 368 290 364 308" />
              </g>

              <!-- 室间隔 -->
              <path d="M306 204 C 313 244 322 286 330 322" fill="none" stroke="#c26a78" stroke-width="6" stroke-linecap="round" />

              <!-- 房室瓣：瓣叶向心室腔内张开 -->
              <g fill="none" stroke="#f7efe3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M257 203 C 268 208 277 212 283 217" />
                <path d="M304 202 C 296 208 289 212 285 216" />
                <path d="M331 207 C 342 211 351 214 356 218" />
                <path d="M378 205 C 370 210 363 214 358 217" />
              </g>
              <!-- 乳头肌与腱索 -->
              <g fill="none" stroke="#f7efe3" stroke-width="1.2" stroke-linecap="round" opacity="0.85">
                <path d="M283 218 L 279 248" />
                <path d="M356 218 L 352 252" />
                <path d="M356 218 L 344 246" />
              </g>
              <ellipse cx="278" cy="256" rx="5.5" ry="11" fill="#b7cddd" stroke="#6f92ad" stroke-width="1.1" transform="rotate(6 278 256)" />
              <ellipse cx="352" cy="262" rx="5.5" ry="12" fill="#e2b0b8" stroke="#b3606e" stroke-width="1.1" transform="rotate(-6 352 262)" />
              <ellipse cx="342" cy="254" rx="5" ry="10" fill="#e2b0b8" stroke="#b3606e" stroke-width="1.1" transform="rotate(10 342 254)" />

              <!-- 高光 -->
              <path d="M266 236 C 262 256 262 272 268 284" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35" />
              <path d="M336 248 C 332 270 334 296 342 312" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35" />
            </g>

            <!-- 血流方向粒子 -->
            <g v-for="(dot, i) in flowDots" :key="`hp-flow-${i}`">
              <circle r="5.5" :fill="dot.c" stroke="#7e1f2e" stroke-width="1.4" opacity="0">
                <animateMotion :path="dot.d" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.08;0.82;1" :dur="dot.dur" :begin="dot.begin" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        </g>
      </g>

      <g class="plate-label">
        <text x="470" y="78">主动脉</text>
        <path d="M468 82 L 420 106" />
        <text x="176" y="82">肺动脉</text>
        <path d="M216 86 L 288 96" />
        <text x="104" y="146">右心房</text>
        <path d="M158 150 L 256 160" />
        <text x="470" y="164">左心房</text>
        <path d="M468 168 L 396 166" />
        <text x="104" y="286">右心室</text>
        <path d="M158 282 L 256 272" />
        <text x="470" y="316">左心室</text>
        <path d="M468 312 L 382 296" />
        <text x="410" y="228">瓣膜</text>
        <path d="M408 224 L 366 216" />
      </g>
    </g>

    <!-- ================= 双循环 ================= -->
    <g v-else-if="preset === 'heart-circulation'">
      <ellipse cx="320" cy="368" rx="196" ry="11" fill="#e9e1cd" />

      <!-- 肺循环环路（上半）：左半蓝＝心脏 → 肺，右半红＝肺 → 心脏 -->
      <path d="M320 216 A 108 64 0 0 1 320 88" fill="none" stroke="#7e1f2e" stroke-width="15" stroke-linecap="round" opacity="0.9" />
      <path d="M320 216 A 108 64 0 0 1 320 88" fill="none" stroke="#9dc0dd" stroke-width="10" stroke-linecap="round" />
      <path d="M320 88 A 108 64 0 0 1 320 216" fill="none" stroke="#7e1f2e" stroke-width="15" stroke-linecap="round" opacity="0.9" />
      <path d="M320 88 A 108 64 0 0 1 320 216" fill="none" stroke="#e69aa6" stroke-width="10" stroke-linecap="round" />

      <!-- 体循环环路（下半）：右半红＝心脏 → 组织，左半蓝＝组织 → 心脏 -->
      <path d="M320 224 A 108 64 0 0 1 320 352" fill="none" stroke="#7e1f2e" stroke-width="15" stroke-linecap="round" opacity="0.9" />
      <path d="M320 224 A 108 64 0 0 1 320 352" fill="none" stroke="#e69aa6" stroke-width="10" stroke-linecap="round" />
      <path d="M320 352 A 108 64 0 0 1 320 224" fill="none" stroke="#7e1f2e" stroke-width="15" stroke-linecap="round" opacity="0.9" />
      <path d="M320 352 A 108 64 0 0 1 320 224" fill="none" stroke="#9dc0dd" stroke-width="10" stroke-linecap="round" />

      <!-- 粒子：沿半环推进 -->
      <g v-for="n in 3" :key="`hp-pulm-out-${n}`">
        <circle r="5.5" fill="#5b8cb8" stroke="#7e1f2e" stroke-width="1.3" opacity="0">
          <animateMotion path="M320 216 A 108 64 0 0 1 320 88" dur="4.4s" :begin="`${(n - 1) * 1.45 - 4.4}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.06;0.88;1" dur="4.4s" :begin="`${(n - 1) * 1.45 - 4.4}s`" repeatCount="indefinite" />
        </circle>
      </g>
      <g v-for="n in 3" :key="`hp-pulm-in-${n}`">
        <circle r="5.5" fill="#d24d60" stroke="#7e1f2e" stroke-width="1.3" opacity="0">
          <animateMotion path="M320 88 A 108 64 0 0 1 320 216" dur="4.4s" :begin="`${(n - 1) * 1.45 - 2.9}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.06;0.88;1" dur="4.4s" :begin="`${(n - 1) * 1.45 - 2.9}s`" repeatCount="indefinite" />
        </circle>
      </g>
      <g v-for="n in 3" :key="`hp-sys-out-${n}`">
        <circle r="5.5" fill="#d24d60" stroke="#7e1f2e" stroke-width="1.3" opacity="0">
          <animateMotion path="M320 224 A 108 64 0 0 1 320 352" dur="4.4s" :begin="`${(n - 1) * 1.45 - 3.6}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.06;0.88;1" dur="4.4s" :begin="`${(n - 1) * 1.45 - 3.6}s`" repeatCount="indefinite" />
        </circle>
      </g>
      <g v-for="n in 3" :key="`hp-sys-in-${n}`">
        <circle r="5.5" fill="#5b8cb8" stroke="#7e1f2e" stroke-width="1.3" opacity="0">
          <animateMotion path="M320 352 A 108 64 0 0 1 320 224" dur="4.4s" :begin="`${(n - 1) * 1.45 - 2.1}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.06;0.88;1" dur="4.4s" :begin="`${(n - 1) * 1.45 - 2.1}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 两肺（骑跨在肺循环环路顶端） -->
      <path
        d="M266 62 C 250 62 240 76 240 92 C 240 108 250 122 266 122 C 277 122 283 114 283 102 L 283 76 C 283 66 276 62 266 62 Z"
        fill="url(#hp-lung)" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round"
      />
      <path
        d="M374 62 C 390 62 400 76 400 92 C 400 108 390 122 374 122 C 363 122 357 114 357 102 L 357 76 C 357 66 364 62 374 62 Z"
        fill="url(#hp-lung)" stroke="#7e1f2e" stroke-width="3" stroke-linejoin="round"
      />

      <!-- 全身组织 -->
      <rect x="284" y="290" width="72" height="46" rx="13" fill="url(#hp-tissue)" stroke="#a98d66" stroke-width="3" />
      <text x="320" y="318" text-anchor="middle" font-size="12.5" fill="#6f6656">全身组织</text>

      <!-- 心脏（位于两环交界，随心跳轻微搏动） -->
      <g transform="translate(320 212)">
        <g>
          <animateTransform
            attributeName="transform" type="scale" values="1;1.06;1"
            keyTimes="0;0.28;1" dur="1.2s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.35 0 0.65 1;0.35 0 0.65 1"
          />
          <g transform="translate(-320 -212)">
            <path
              d="M320 240 C 304 228 288 212 288 196 C 288 182 300 174 310 177 C 316 178 320 183 320 186 C 320 183 324 178 330 177 C 340 174 352 182 352 196 C 352 212 336 228 320 240 Z"
              fill="url(#hp-muscle)" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round"
            />
            <path d="M306 192 C 303 202 304 212 310 220" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35" />
          </g>
        </g>
      </g>

      <g class="plate-label">
        <text x="296" y="48">肺</text>
        <path d="M312 52 L 326 84" />
        <text x="444" y="228">心脏</text>
        <path d="M440 232 L 358 212" />
        <text x="62" y="128">肺循环</text>
        <path d="M118 132 L 214 132" />
        <text x="62" y="296">体循环</text>
        <path d="M118 292 L 212 268" />
      </g>
    </g>

    <!-- ================= 心电传导 ================= -->
    <g v-else-if="preset === 'heart-conduction'">
      <ellipse cx="320" cy="368" rx="176" ry="11" fill="#e9e1cd" />

      <!-- 心肌剪影（淡填充，突出传导系统） -->
      <path
        d="M236 196 C 228 158 248 128 278 126 C 294 108 330 106 348 120 C 372 104 406 120 410 152
           C 416 190 408 236 388 272 C 372 302 352 326 330 340 C 306 330 286 306 268 274 C 246 236 238 216 236 196 Z"
        fill="#f6e3dd" stroke="#7e1f2e" stroke-width="4" stroke-linejoin="round"
      />
      <!-- 四腔淡描（帮助辨认传导系统所在的房室位置） -->
      <g stroke="#d3a99e" stroke-width="2" stroke-linejoin="round" clip-path="url(#hp-cavity-clip)">
        <path d="M250 186 C 245 162 252 140 270 132 C 288 124 307 132 313 149 C 319 166 313 183 297 191 C 282 198 262 196 253 190 C 250 188 249 187 250 186 Z" fill="#fbece8" />
        <path d="M350 164 C 347 147 356 134 372 132 C 389 130 400 139 401 154 C 402 170 392 181 376 182 C 361 183 351 175 350 164 Z" fill="#fbece8" />
        <path d="M262 210 C 284 200 299 208 302 226 C 306 246 300 266 289 281 C 283 289 273 291 267 285 C 257 273 252 251 253 234 C 254 221 257 214 262 210 Z" fill="#f0f4f7" />
        <path d="M332 214 C 356 204 380 214 389 240 C 398 268 390 296 374 314 C 362 328 348 334 338 332 C 326 330 318 312 316 288 C 314 254 320 228 332 214 Z" fill="#fbece8" />
      </g>
      <path d="M322 148 C 326 196 330 252 332 322" fill="none" stroke="#c99a8f" stroke-width="3" stroke-dasharray="7 8" opacity="0.8" />

      <!-- 窦房结：放电脉冲环 -->
      <circle cx="282" cy="150" r="11" fill="#f6c9cf" stroke="#7e1f2e" stroke-width="3" />
      <circle cx="282" cy="150" r="11" fill="none" stroke="#4e7d61" stroke-width="2.5" opacity="0">
        <animate attributeName="r" values="11;34" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.85;0" dur="1.2s" repeatCount="indefinite" />
      </circle>

      <!-- 房室结 -->
      <ellipse cx="322" cy="198" rx="13" ry="10" fill="#f6c9cf" stroke="#7e1f2e" stroke-width="3" transform="rotate(12 322 198)" />

      <!-- 传导束与束支 -->
      <path :d="CONDUCTION_MAIN" fill="none" stroke="#7e1f2e" stroke-width="9" stroke-linecap="round" opacity="0.9" />
      <path :d="CONDUCTION_MAIN" fill="none" stroke="#4e7d61" stroke-width="4.5" stroke-linecap="round" />
      <path d="M330 272 C 316 288 308 302 304 312" fill="none" stroke="#7e1f2e" stroke-width="7" stroke-linecap="round" opacity="0.85" />
      <path d="M330 272 C 316 288 308 302 304 312" fill="none" stroke="#4e7d61" stroke-width="3.4" stroke-linecap="round" />
      <path :d="CONDUCTION_BRANCH" fill="none" stroke="#7e1f2e" stroke-width="7" stroke-linecap="round" opacity="0.85" />
      <path :d="CONDUCTION_BRANCH" fill="none" stroke="#4e7d61" stroke-width="3.4" stroke-linecap="round" />

      <!-- 普肯耶纤维：自心尖向心室壁扩散 -->
      <g fill="none" stroke="#4e7d61" stroke-width="2.4" stroke-linecap="round" opacity="0.9">
        <path d="M304 312 C 301 307 299 303 298 299" />
        <path d="M304 312 C 306 307 307 303 307 299" />
        <path d="M358 314 C 362 309 365 304 367 299" />
        <path d="M358 314 C 354 310 352 306 351 302" />
      </g>

      <!-- 传导中的电信号粒子 -->
      <g v-for="n in 2" :key="`hp-cond-${n}`">
        <circle r="5" fill="#4e7d61" stroke="#fdf6ec" stroke-width="1.6" opacity="0">
          <animateMotion :path="CONDUCTION_MAIN" dur="1.2s" :begin="`${(n - 1) * 0.6}s`" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0.9;0" keyTimes="0;0.08;0.88;1" dur="1.2s" :begin="`${(n - 1) * 0.6}s`" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 心电图（左上角插图，避免与底部图例重叠） -->
      <g transform="translate(40 -95) scale(0.46)">
        <path d="M48 380 L 514 380" fill="none" stroke="#d9cdb6" stroke-width="3" stroke-dasharray="6 10" />
        <path :d="ECG_PATH" fill="none" stroke="#b8452f" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="900">
          <animate attributeName="stroke-dashoffset" values="900;0" dur="2.6s" repeatCount="indefinite" />
        </path>
      </g>

      <g class="plate-label">
        <text x="176" y="128">窦房结</text>
        <path d="M216 132 L 272 146" />
        <text x="360" y="196">房室结</text>
        <path d="M358 200 L 336 198" />
        <text x="392" y="286">传导束</text>
        <path d="M390 282 L 338 280" />
        <text x="392" y="330">普肯耶纤维</text>
        <path d="M390 326 L 374 322" />
        <text x="42" y="96">心电图（示意）</text>
      </g>
    </g>
  </g>
</template>
