import type { Organ } from '../types';

/**
 * 科普内容数据源（首期以 TypeScript 数据文件维护，便于后续无缝替换为数据库）。
 *
 * 约定：
 * - 所有关键数字若不确定来源，一律标注"约"或"示意"，不虚构精确医学数据；
 * - 文案仅做通俗科普，不构成诊断、治疗或个体化建议；
 * - 新增器官：在此数组追加一个 Organ 对象即可，前端自动渲染（无需改前端代码）。
 */
export const organs: Organ[] = [
  {
    id: 'lung',
    name: '肺',
    emoji: '🫁',
    summary: '负责气体交换：空气经气道进入肺泡，氧气进入血液，二氧化碳随呼气排出。',
    available: true,
    stages: [
      {
        id: 'breathing',
        order: 1,
        title: '呼吸运动',
        description:
          '吸气时，膈肌收缩下移、肋间肌抬起，胸腔随之扩张，肺被带动着变大，肺内气压降低，空气顺势被"吸"进来；' +
          '呼气时呼吸肌放松，胸腔回缩，肺依靠自身弹性回缩，把气体推出去。' +
          '安静状态下呼吸频率约为每分钟 12–20 次（示意区间，个体差异较大）。',
        keyPoint: '胸腔扩张 → 肺容积增大 → 气体流入；呼气则刚好相反。',
        durationSec: 16,
        mediaType: 'three',
        particlePreset: 'lung-breathing',
      },
      {
        id: 'airflow',
        order: 2,
        title: '气体进入',
        description:
          '空气经上呼吸道加温、加湿后，沿气管下行并分叉进入左右支气管，随后像树杈一样反复分支、越分越细，' +
          '最终到达细支气管和肺泡。气道内壁的纤毛与黏液会拦截大部分灰尘和异物（示意）。',
        keyPoint: '气管 → 支气管 → 细支气管 → 肺泡，是空气进入肺的通道。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'airflow',
      },
      {
        id: 'exchange',
        order: 3,
        title: '肺泡气体交换',
        description:
          '肺泡是无数个微小的气囊（成年人约有 3 亿个左右，示意数量），囊壁极薄，外面包裹着密集的毛细血管。' +
          '氧气从肺泡内扩散进入血液，二氧化碳则从血液反方向扩散进入肺泡，随呼气排出体外。',
        keyPoint: '气体交换依靠"扩散"完成：氧气进入血液，二氧化碳离开血液。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'gas-exchange',
      },
      {
        id: 'rbc-transport',
        order: 4,
        title: '红细胞运氧',
        description:
          '氧气进入血液后与红细胞中的血红蛋白结合，红细胞颜色由暗红变为鲜红，随血流经肺静脉回到心脏，再被泵往全身；' +
          '在组织处卸下氧气后颜色又逐渐变暗，沿静脉返回肺部重新装氧，循环往复。' +
          '血液循环一周约需 1 分钟量级（示意）。',
        keyPoint: '血红蛋白像"载氧车"：在肺泡装氧变鲜红，在组织卸氧变暗红。',
        durationSec: 18,
        mediaType: 'particle',
        particlePreset: 'rbc-flow',
      },
    ],
  },
  {
    id: 'heart',
    name: '心脏',
    emoji: '🫀',
    summary: '推动血液循环的动力泵，把富氧血送往全身各处。',
    available: true,
    stages: [
      {
        id: 'cardiac-cycle',
        order: 1,
        title: '心动周期：收缩与舒张',
        description:
          '心脏有四个腔室：右心房、右心室接收全身回流的缺氧血，左心房、左心室负责把富氧血泵向全身。' +
          '一次心跳里，心房先收缩把血挤进心室，随后心室强力收缩，把血液分别送入肺动脉和主动脉；' +
          '瓣膜像单向门，只允许血液向前流动、防止倒流。安静时心跳约每分钟 60–80 次（示意区间）。',
        keyPoint: '心房收血 → 心室泵血 → 瓣膜单向放行，一个周期就是一次"心跳"。',
        durationSec: 16,
        mediaType: 'three',
        particlePreset: 'heart-cycle',
      },
      {
        id: 'circulation',
        order: 2,
        title: '双循环：肺循环与体循环',
        description:
          '心脏把血液循环分成两条首尾相接的环路：肺循环从右心室出发到肺，血液在这里卸下二氧化碳、装上氧气后回到左心房；' +
          '体循环从左心室出发奔向全身组织，把氧气和养分送出去、带走二氧化碳，再经静脉回到右心房。' +
          '两条环路同时进行，任何一处断开都会让循环无法维持（示意）。',
        keyPoint: '肺循环负责"换气"，体循环负责"送货收货"，两者由心脏串联成 8 字形回路。',
        durationSec: 15,
        mediaType: 'three',
        particlePreset: 'heart-circulation',
      },
      {
        id: 'conduction',
        order: 3,
        title: '心电传导：心跳的起点',
        description:
          '心跳由心脏自身的"电路"发起：右心房上部的窦房结定时放电，电信号先让两个心房收缩；' +
          '信号传到房室结稍作延迟，好让心室有时间充盈；随后沿传导束快速下行，从心尖向上扩散，' +
          '使心室几乎同时收缩。这条通路的节律就是心电图上看到的波形（示意）。',
        keyPoint: '窦房结定节拍 → 房室结延迟 → 传导束让心室同步收缩。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'heart-conduction',
      },
    ],
  },
  {
    id: 'kidney',
    name: '肾脏',
    emoji: '🫘',
    summary: '过滤血液、生成尿液，调节体内水分与电解质平衡。',
    available: true,
    stages: [
      {
        id: 'filtration',
        order: 1,
        title: '肾小球滤过',
        description:
          '血液经入球小动脉进入肾小球——一团盘绕的毛细血管球，被肾小囊包裹。毛细血管壁和囊壁都很薄，' +
          '水、盐分、葡萄糖等小分子被"压"进囊腔形成原尿，血细胞和大分子蛋白质则留在血管里。' +
          '成人每天生成的原尿量很大，绝大部分随后会被重新吸收（示意，不给出具体数值）。',
        keyPoint: '滤过像"细筛子"：小分子进入原尿，血细胞与蛋白质留在血中。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'kidney-filter',
      },
      {
        id: 'reabsorption',
        order: 2,
        title: '肾小管重吸收',
        description:
          '原尿沿肾小管流过，管壁细胞把有用的物质"捞回来"：绝大部分水、几乎全部葡萄糖和大部分钠离子被重新吸收，' +
          '回到管外的毛细血管中；剩下的废物和多余水分继续留在管内，尿液逐渐浓缩。' +
          '重吸收让身体既排出废物，又不至于丢掉宝贵的水和养分（示意）。',
        keyPoint: '重吸收＝回收站：水、葡萄糖、钠离子回到血液，废物留下。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'kidney-reabsorb',
      },
      {
        id: 'urine',
        order: 3,
        title: '尿液的收集与排出',
        description:
          '经过重吸收的尿液流入集合管，汇入肾盂，再沿输尿管向下输送，暂存在膀胱中。' +
          '膀胱充盈到一定程度时发出"该排尿了"的信号，尿液经尿道排出体外。' +
          '肾脏通过调节尿量和尿液浓度，帮助维持体内水分与电解质的平衡（示意）。',
        keyPoint: '集合管 → 肾盂 → 输尿管 → 膀胱 → 尿道，是尿液离开身体的通道。',
        durationSec: 13,
        mediaType: 'three',
        particlePreset: 'kidney-urine',
      },
    ],
  },
  {
    id: 'liver',
    name: '肝脏',
    emoji: '🟤',
    summary: '人体最大的内脏器官之一，参与代谢、解毒与胆汁生成。',
    available: true,
    stages: [
      {
        id: 'lobule',
        order: 1,
        title: '门静脉与肝小叶',
        description:
          '肝脏有双重血供：肝动脉带来富氧血，门静脉则把来自胃肠道的血液送来——其中带着刚吸收的糖、氨基酸等养分。' +
          '血液流入肝小叶间的小血管，经肝血窦缓慢流过肝细胞，最后汇入中央静脉离开肝脏。' +
          '肝小叶是肝脏的基本工作单元，肝细胞就沿血窦排列（示意）。',
        keyPoint: '肝动脉供氧、门静脉送养分，血液在肝小叶的血窦里与肝细胞"交换"。',
        durationSec: 15,
        mediaType: 'three',
        particlePreset: 'liver-lobule',
      },
      {
        id: 'metabolism',
        order: 2,
        title: '糖代谢与糖原储存',
        description:
          '饭后血糖升高，肝细胞把多余的葡萄糖收进来，合成为糖原储存起来，就像给身体"充电"；' +
          '空腹或运动时血糖下降，肝细胞再把糖原分解成葡萄糖释放回血液，维持血糖平稳。' +
          '肝脏还参与脂肪和蛋白质的代谢，是身体的"代谢中枢"（示意）。',
        keyPoint: '血糖高 → 存成糖原；血糖低 → 糖原分解回血糖。',
        durationSec: 15,
        mediaType: 'three',
        particlePreset: 'liver-metabolism',
      },
      {
        id: 'detox',
        order: 3,
        title: '解毒与胆汁生成',
        description:
          '来自肠道的血液里可能带有酒精、药物残余等需要处理的物质，肝细胞通过一系列化学反应把它们改造、' +
          '分解或打包，变成更容易随胆汁或尿液排出的形式；同时肝细胞持续生成胆汁，经胆管汇集到胆囊暂存，' +
          '进食后再排入肠道帮助消化脂肪（示意）。',
        keyPoint: '肝细胞一边"改造"有害物质，一边生产帮助消化脂肪的胆汁。',
        durationSec: 15,
        mediaType: 'three',
        particlePreset: 'liver-detox',
      },
    ],
  },
  {
    id: 'stomach',
    name: '胃',
    emoji: '🥣',
    summary: '暂存并研磨食物，用胃液把蛋白质初步分解，再把食糜分批送入小肠。',
    available: true,
    stages: [
      {
        id: 'receive',
        order: 1,
        title: '收纳与搅拌',
        description:
          '食物经食管进入胃。胃像一个有弹性的口袋，胃底和胃体可以舒张，把一餐食物暂时收纳起来；' +
          '胃壁的肌肉层有节律地蠕动，把食物与胃液搅拌、研磨成半流质的食糜。' +
          '胃的容量在进食后可明显增大（示意，个体差异较大）。',
        keyPoint: '胃先"存"再"搅"：舒张收纳食物，蠕动把食物与胃液混合成食糜。',
        durationSec: 15,
        mediaType: 'three',
        particlePreset: 'stomach-fill',
      },
      {
        id: 'juice',
        order: 2,
        title: '胃液与蛋白质初步消化',
        description:
          '胃黏膜里的胃腺分泌盐酸和胃蛋白酶原。盐酸让胃液呈强酸性，并把胃蛋白酶原激活成胃蛋白酶；' +
          '胃蛋白酶把长链蛋白质切成较短的多肽，为后续在小肠的消化做准备。' +
          '胃黏膜表面的黏液层则保护胃壁，避免被胃酸和蛋白酶"消化"（示意）。',
        keyPoint: '盐酸激活胃蛋白酶 → 蛋白质被切成多肽；黏液层保护胃壁自身。',
        durationSec: 15,
        mediaType: 'three',
        particlePreset: 'stomach-juice',
      },
      {
        id: 'empty',
        order: 3,
        title: '食糜排空',
        description:
          '被研磨成食糜的食物分批通过幽门进入十二指肠。幽门括约肌像一道闸门，控制每次放行的量，' +
          '让小肠有足够时间继续消化和吸收。胃排空的速度与食物种类有关：脂肪多的食物停留更久，' +
          '流质则排空较快（示意）。',
        keyPoint: '幽门括约肌分批放行，食糜进入十二指肠继续消化吸收。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'stomach-empty',
      },
    ],
  },
  {
    id: 'throat',
    name: '咽喉',
    emoji: '🗣️',
    summary: '呼吸与吞咽共用的通道，也是发声的"乐器"：会厌保护气道，声带振动发声。',
    available: true,
    stages: [
      {
        id: 'shared-passage',
        order: 1,
        title: '呼吸与吞咽共用通道',
        description:
          '咽位于鼻腔、口腔和喉的后方，是空气和食物都要经过的"十字路口"：呼吸时空气经咽进入前方的喉和气管；' +
          '吞咽时食团也从咽经过，再进入后方的食管。正因为共用一条通道，边吃边说笑时更容易呛到（示意）。',
        keyPoint: '咽是呼吸与吞咽共用的通道：空气向前入喉，食物向后入食管。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'throat-shared',
      },
      {
        id: 'epiglottis',
        order: 2,
        title: '会厌：气道的"盖子"',
        description:
          '吞咽的一瞬间，喉会上提，会厌像盖子一样向后下方翻转，把喉口盖住，食团因此滑入食管而不会误入气管；' +
          '吞咽结束后会厌复位，呼吸恢复。这个动作由神经反射自动完成，不需要我们刻意控制（示意）。',
        keyPoint: '吞咽时会厌盖住喉口，让食团走后方的食管。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'throat-epiglottis',
      },
      {
        id: 'voice',
        order: 3,
        title: '声带振动发声',
        description:
          '喉内的声带是两片有弹性的黏膜皱襞，中间的缝隙叫声门裂。呼气时声带闭合，气流从缝隙中挤出，' +
          '使声带快速振动发出声音；声带拉紧时振动更快、音调更高，呼气强弱和口腔、鼻腔的共鸣则影响音量与音色（示意）。',
        keyPoint: '气流冲击闭合的声带 → 振动发声；声带拉紧，音调变高。',
        durationSec: 14,
        mediaType: 'three',
        particlePreset: 'throat-voice',
      },
    ],
  },
];
