#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var R = String.raw;
var root = path.resolve(__dirname, "..");
var problemDir = path.join(root, "data", "problems");

function step(title, content) {
  return { title: title, content: content };
}

function animation(variant, playable, params, duration, notes) {
  return {
    enabled: true,
    level: playable ? "animated" : "interactive_diagram",
    type: "required_one_test_model",
    variant: variant,
    playable: playable,
    interactive: true,
    notes: notes,
    params: params || {},
    timeline: { duration: duration || 6, loop: false }
  };
}

function optionKey(option) {
  return String(option).trim().charAt(0);
}

function optionTitle(option) {
  return String(option).replace(/^\s*[A-D][.．、]\s*/, "");
}

function makeOptionAnalyses(config) {
  return config.options.map(function (option) {
    var key = optionKey(option);
    return {
      option: key,
      title: optionTitle(option),
      thinking: config.optionThinking,
      formula: typeof config.optionFormulas === "string"
        ? config.optionFormulas
        : (config.optionFormulas[key] || config.optionFormulas.common || "根据题意建立物理关系。"),
      judgment: config.optionJudgments[key]
    };
  });
}

function choice(config) {
  return {
    id: config.id,
    originalNumber: "单" + config.number,
    chapter: "必修一结业测试",
    title: "单选第" + config.number + "题：" + config.model,
    question: config.question,
    options: config.options,
    answer: config.answer,
    animation: config.animation,
    knowledge: config.knowledge,
    steps: config.steps,
    analysis: { title: "单选第" + config.number + "题分项解析" },
    optionAnalyses: makeOptionAnalyses(config),
    analysisPresentation: { collapseEachStep: true },
    practice: config.practice
  };
}

function solution(config) {
  return {
    id: config.id,
    originalNumber: "解" + config.number,
    chapter: "必修一结业测试",
    title: "解答第" + config.number + "题：" + config.model,
    question: config.question,
    answer: config.answer,
    animation: config.animation,
    knowledge: config.knowledge,
    steps: config.steps,
    analysis: { title: "解答第" + config.number + "题分步解析" },
    analysisPresentation: { collapseEachStep: true },
    practice: config.practice
  };
}

var problems = [
  choice({
    number: 1,
    id: "spring_test_single_01_marathon",
    model: "半程马拉松概念辨析",
    question: "男子半程马拉松新国家纪录在厦门诞生。2022 年 12 月 18 日早上 7 点 30 分鸣枪，选手彭建华以 1 小时 02 分 30 秒跑完 21 km 的赛程。下列说法正确的是（　　）。",
    options: [
      "A. ‘7 点 30 分’表示的是时刻",
      "B. ‘21 km’表示此次行程的位移大小",
      "C. 彭建华全程的平均速度约为 21 km/h",
      "D. ‘km’为国际单位制中的基本单位"
    ],
    answer: "A",
    knowledge: ["时刻与时间间隔", "路程与位移", "平均速度", "国际单位制"],
    animation: animation("spring_test_01_marathon", true, {
      distance: { label: "赛程", value: 21, min: 5, max: 42, step: 1, unit: "km" },
      duration: { label: "用时", value: 62.5, min: 30, max: 150, step: 0.5, unit: "min" }
    }, 6, "沿赛道显示路程随时间累积，并区分路程、位移与平均速度。"),
    steps: [
      step("辨认时刻", "‘7 点 30 分’对应时间轴上的一个点，是时刻；‘1 小时 02 分 30 秒’才是时间间隔。"),
      step("区分路程和位移", "题目给出的 \\(21\\,\\mathrm{km}\\) 是赛程长度，即路程。没有终点相对起点的位置，不能把它直接当作位移大小。"),
      step("检查平均速度", "平均速度定义为位移与时间之比：\\(\\bar{\\vec v}=\\Delta\\vec r/\\Delta t\\)。题目只能算平均速率，不能确定平均速度。"),
      step("核对单位制", "国际单位制的长度基本单位是 \\(\\mathrm m\\)，\\(\\mathrm{km}\\) 是带词头的长度单位。故只有 A 正确。")
    ],
    optionThinking: "分别从时间轴、位移定义、平均速度定义和国际单位制四个概念核对，不把日常语言中的‘速度’混作物理量。",
    optionFormulas: {
      A: R`\[t_\text{时刻}=7{:}30\]`,
      B: R`\[s\ne |\Delta\vec r|\quad\text{（一般情况）}\]`,
      C: R`\[\bar{\vec v}=\frac{\Delta\vec r}{\Delta t}\]`,
      D: R`\[1\,\mathrm{km}=10^3\,\mathrm m\]`
    },
    optionJudgments: {
      A: "‘7 点 30 分’是时间轴上的瞬间，A 正确。",
      B: "21 km 是沿路线累计的路程，不是由起点直接指向终点的位移，B 错误。",
      C: "缺少位移信息，不能求平均速度；即使算平均速率也约为 \\(20.16\\,\\mathrm{km/h}\\)，C 错误。",
      D: "国际单位制长度基本单位为米，D 错误。"
    },
    practice: {
      title: "进阶近似题：圆形赛道上的路程与平均速度",
      question: "运动员沿半径为 \\(50\\,\\mathrm m\\) 的圆形跑道匀速跑完 \\(2.5\\) 圈，用时 \\(500\\,\\mathrm s\\)。求路程、位移大小、平均速率和平均速度大小，并说明平均速度方向。",
      answer: "**路程**\n\n\\(s=2.5\\times2\\pi R=250\\pi\\,\\mathrm m\\)。\n\n**位移**\n\n终点在起点对径处，故 \\(|\\Delta\\vec r|=2R=100\\,\\mathrm m\\)。\n\n**平均量**\n\n\\(\\bar v_s=s/t=\\pi/2\\,\\mathrm{m/s}\\)，\\(|\\bar{\\vec v}|=|\\Delta\\vec r|/t=0.20\\,\\mathrm{m/s}\\)，方向由起点指向终点。",
      thinking: "**解题思路**\n\n先用圈数计算轨迹长度，再根据终点位置画位移矢量。平均速率用路程，平均速度用位移，二者不能共用同一个分子。"
    }
  }),
  solution({
    number: 16,
    id: "spring_test_solution_16_police_chase",
    model: "警车货车箱子追及",
    question: "在平直公路上，货车 B 以 \\(v_2=20\\,\\mathrm{m/s}\\) 匀速行驶，车尾悬挂着离地很近的箱子 C。警车 A 以 \\(v_1=30\\,\\mathrm{m/s}\\) 匀速追赶货车。当二者距离 \\(s_0=60\\,\\mathrm m\\) 时警车鸣笛示意其减速；货车经 \\(t_0=1\\,\\mathrm s\\) 后立即以 \\(a_2=2\\,\\mathrm{m/s^2}\\) 加速逃离，箱子同时脱落并以 \\(a_3=2\\,\\mathrm{m/s^2}\\) 做匀减速运动。警员看到箱子脱落立刻以 \\(a_1=4\\,\\mathrm{m/s^2}\\) 刹车。货车最大速度为 \\(v_m=30\\,\\mathrm{m/s}\\)。求：（1）箱子脱落时警车与箱子的距离；（2）判断警车是否撞上箱子；若不撞，求最小间距；（3）警车停下时与货车的距离。",
    answer: "（1）\\(50\\,\\mathrm m\\)；（2）不会相撞，最小间距 \\(25\\,\\mathrm m\\)；（3）\\(137.5\\,\\mathrm m\\)。",
    knowledge: ["分阶段追及", "相对运动", "刹车停止", "速度上限"],
    animation: animation("spring_test_16_police_chase", true, {
      policeSpeed: { label: "警车初速度", value: 30, min: 20, max: 40, step: 1, unit: "m/s" },
      truckSpeed: { label: "货车初速度", value: 20, min: 10, max: 28, step: 1, unit: "m/s" },
      initialGap: { label: "初始车距", value: 60, min: 30, max: 100, step: 5, unit: "m" }
    }, 8.5, "按鸣笛等待、箱子脱落、警车刹车、货车达限速四个阶段同步显示三者位置。"),
    steps: [
      step("第一阶段：求脱落时距离", "鸣笛后 1 s 内警车和货车仍匀速。警车追近 \\((30-20)\\times1=10\\,\\mathrm m\\)，故箱子脱落时距离 \\(\\Delta s=60-10=50\\,\\mathrm m\\)。"),
      step("第二阶段：建立相对运动", "以箱子脱落为新零时刻 \\(\\tau=0\\)。警车相对箱子的初速度为 \\(10\\,\\mathrm{m/s}\\)，相对加速度为 \\(-4-(-2)=-2\\,\\mathrm{m/s^2}\\)。相对追近量为 \\(\\Delta x_{AC}=10\\tau-\\tau^2\\)。"),
      step("判断碰撞和最小间距", "当相对速度 \\(10-2\\tau=0\\) 时追近量最大，得 \\(\\tau=5\\,\\mathrm s\\)、最大追近量 \\(25\\,\\mathrm m\\)。它小于初距 50 m，所以不撞；最小间距为 \\(50-25=25\\,\\mathrm m\\)。"),
      step("第三阶段：警车停车时车距", "警车刹车 \\(7.5\\,\\mathrm s\\) 停下，鸣笛后总时间为 8.5 s。其位移为 \\(30\\times1+30^2/(2\\times4)=142.5\\,\\mathrm m\\)。货车先走 \\(20\\,\\mathrm m\\)，再用 5 s 加速到 30 m/s，走 \\(125\\,\\mathrm m\\)，最后匀速 2.5 s 走 75 m；加上初距 60 m，货车位置为 280 m。故车距 \\(280-142.5=137.5\\,\\mathrm m\\)。")
    ],
    practice: {
      title: "进阶近似题：带延迟与限速的三车追及",
      question: "警车以 \\(28\\,\\mathrm{m/s}\\) 追赶初速 \\(18\\,\\mathrm{m/s}\\) 的货车，初距 \\(50\\,\\mathrm m\\)。货车延迟 1 s 后以 \\(2\\,\\mathrm{m/s^2}\\) 加速并掉落箱子，最高速度 28 m/s；箱子以 \\(2\\,\\mathrm{m/s^2}\\) 减速，警车同时以 \\(5\\,\\mathrm{m/s^2}\\) 刹车。求脱落时距离、警车与箱子的最小距离，以及警车停车时与货车的距离。",
      answer: "**脱落时**\n\n距离 \\(50-(28-18)\\times1=40\\,\\mathrm m\\)。\n\n**箱子最小距离**\n\n相对速度 10 m/s、相对减速度 3 m/s²，最大追近量 \\(10^2/(2\\times3)=50/3\\,\\mathrm m\\)，故最小距离 \\(70/3\\,\\mathrm m\\)。\n\n**停车时货车距离**\n\n警车总位移 \\(28\\times1+28^2/(2\\times5)=106.4\\,\\mathrm m\\)。货车到此时位移为 \\(18+115+16.8=149.8\\,\\mathrm m\\)，再计初距 50 m，车距为 \\(93.4\\,\\mathrm m\\)。",
      thinking: "**解题思路**\n\n每次状态突变都重新设时间零点。箱子问题优先用相对运动求最大追近量；货车问题必须先判断达到限速的时刻。"
    }
  }),
  solution({
    number: 17,
    id: "spring_test_solution_17_rocket",
    model: "火箭多阶段升降",
    question: "物理老师从操场竖直向上发射一枚总质量为 \\(2\\,\\mathrm{kg}\\) 的火箭模型。\\(t=0\\) 时发动机点火，提供竖直向上、大小恒为 \\(45\\,\\mathrm N\\) 的推力；3 s 后发动机熄火。火箭到达最高点后打开降落伞，在降落伞作用下向下做匀加速运动，到达地面时速度大小为 \\(9\\,\\mathrm{m/s}\\)。火箭筒体运动过程中受到的空气阻力大小恒为 \\(5\\,\\mathrm N\\)，取 \\(g=10\\,\\mathrm{m/s^2}\\)，忽略喷气导致的质量变化。求：（1）发动机熄火时的速度；（2）最大高度；（3）若降落伞阻力恒定，求其大小。",
    answer: "（1）\\(30\\,\\mathrm{m/s}\\)；（2）\\(81\\,\\mathrm m\\)；（3）\\(14\\,\\mathrm N\\)。",
    knowledge: ["牛顿第二定律", "竖直多阶段运动", "空气阻力", "降落伞"],
    animation: animation("spring_test_17_rocket", true, {
      thrust: { label: "发动机推力", value: 45, min: 30, max: 70, step: 1, unit: "N" },
      mass: { label: "火箭质量", value: 2, min: 1, max: 5, step: 0.5, unit: "kg" },
      drag: { label: "筒体阻力", value: 5, min: 0, max: 12, step: 1, unit: "N" }
    }, 23.4, "动画依次呈现动力上升、熄火减速、最高点开伞和匀加速下降。"),
    steps: [
      step("动力上升阶段", "上升时空气阻力向下。由 \\(45-20-5=2a_1\\)，得 \\(a_1=10\\,\\mathrm{m/s^2}\\)。3 s 后速度 \\(v_1=a_1t=30\\,\\mathrm{m/s}\\)，上升高度 \\(h_1=\\frac12a_1t^2=45\\,\\mathrm m\\)。"),
      step("熄火上升阶段", "熄火后重力与空气阻力均向下，减速度大小 \\(a_2=(20+5)/2=12.5\\,\\mathrm{m/s^2}\\)。继续上升 \\(h_2=v_1^2/(2a_2)=36\\,\\mathrm m\\)。"),
      step("求最大高度", "火箭从地面到最高点的高度为 \\(H=h_1+h_2=45+36=81\\,\\mathrm m\\)。"),
      step("开伞下降阶段", "从最高点由静止下降，\\(9^2=2a_3H\\)，得 \\(a_3=0.5\\,\\mathrm{m/s^2}\\)。向下取正，\\(mg-f-F_\\text{伞}=ma_3\\)，即 \\(20-5-F_\\text{伞}=1\\)，所以 \\(F_\\text{伞}=14\\,\\mathrm N\\)。")
    ],
    practice: {
      title: "进阶近似题：火箭升降的符号化通式",
      question: "质量为 \\(m\\) 的火箭由静止竖直发射，推力恒为 \\(F\\)，上升阻力恒为 \\(f\\)，发动机工作 \\(\\tau\\) 后熄火。最高点开伞，由静止下降并以速度 \\(v_L\\) 落地。假设下降时筒体阻力仍为 \\(f\\)，伞阻力恒为 \\(P\\)。推导熄火速度、最大高度和 \\(P\\) 的通式。",
      answer: "**动力段**\n\n\\(a_1=(F-mg-f)/m\\)，\\(v_1=a_1\\tau\\)，\\(h_1=a_1\\tau^2/2\\)。\n\n**惯性上升段**\n\n减速度 \\(a_2=g+f/m\\)，故 \\(h_2=v_1^2/(2a_2)\\)，\\(H=h_1+h_2\\)。\n\n**开伞下降段**\n\n\\(a_3=v_L^2/(2H)\\)，向下列式 \\(mg-f-P=ma_3\\)，所以 \\(P=mg-f-mv_L^2/(2H)\\)。",
      thinking: "**解题思路**\n\n每个阶段重新确定速度方向与阻力方向，先由动力学求加速度，再接运动学。最高点是速度归零和阻力换向的分界。"
    }
  }),
  solution({
    number: 18,
    id: "spring_test_solution_18_unloading",
    model: "斜面传送带平板车卸货",
    question: "货物由静止从斜面顶端滑下，经过 B 点进入顺时针匀速传送带，再由 C 点滑上静止在水平地面的无动力平板车。货物质量 \\(m=140\\,\\mathrm{kg}\\)，平板车质量 \\(M=20\\,\\mathrm{kg}\\)，斜面高度 \\(h=2.5\\,\\mathrm m\\)、倾角 \\(30^\\circ\\)，货物与斜面动摩擦因数 \\(\\mu_1=\\sqrt3/6\\)；传送带速度 \\(v=8\\,\\mathrm{m/s}\\)、长度 \\(l=10.5\\,\\mathrm m\\)，货物与带间动摩擦因数 \\(\\mu_2=0.3\\)；货物与平板车、平板车与地面间动摩擦因数分别为 \\(\\mu_3=0.4\\)、\\(\\mu_4=0.2\\)。忽略经过 B、C 的能量损失，取 \\(g=10\\,\\mathrm{m/s^2}\\)。求：（1）到 B 点的速度；（2）在传送带上的时间；（3）平板车至少需要多长。",
    answer: "（1）\\(5\\,\\mathrm{m/s}\\)；（2）\\(1.5\\,\\mathrm s\\)；（3）\\(2.0\\,\\mathrm m\\)。",
    knowledge: ["斜面摩擦", "传送带相对运动", "板块模型", "相对位移"],
    animation: animation("spring_test_18_unloading", true, {
      beltSpeed: { label: "传送带速度", value: 8, min: 5, max: 12, step: 0.5, unit: "m/s" },
      beltMu: { label: "带面摩擦因数", value: 0.3, min: 0.1, max: 0.6, step: 0.05, unit: "" },
      cartMu: { label: "车面摩擦因数", value: 0.4, min: 0.2, max: 0.7, step: 0.05, unit: "" }
    }, 4, "货物按斜面、传送带、平板车三个阶段连续运动，右图显示速度分段变化。"),
    steps: [
      step("斜面阶段", "斜面长 \\(s=h/\\sin30^\\circ=5\\,\\mathrm m\\)。加速度 \\(a_1=g(\\sin30^\\circ-\\mu_1\\cos30^\\circ)=2.5\\,\\mathrm{m/s^2}\\)，故 \\(v_B=\\sqrt{2a_1s}=5\\,\\mathrm{m/s}\\)。"),
      step("传送带共速阶段", "货物初速 5 m/s 小于带速 8 m/s，摩擦向右，加速度 \\(a_2=\\mu_2g=3\\,\\mathrm{m/s^2}\\)。经 \\(t_1=(8-5)/3=1\\,\\mathrm s\\) 共速，位移 \\(s_1=(5+8)t_1/2=6.5\\,\\mathrm m\\)。"),
      step("传送带匀速阶段", "剩余距离 \\(10.5-6.5=4\\,\\mathrm m\\)，共速后用时 \\(t_2=4/8=0.5\\,\\mathrm s\\)。总时间为 \\(1.5\\,\\mathrm s\\)。"),
      step("平板车相对位移", "货物上车速度 8 m/s。滑动时货物加速度 \\(a_m=-\\mu_3g=-4\\,\\mathrm{m/s^2}\\)；平板车受货物摩擦 \\(560\\,\\mathrm N\\) 向右、地面摩擦 \\(\\mu_4(m+M)g=320\\,\\mathrm N\\) 向左，故 \\(a_M=(560-320)/20=12\\,\\mathrm{m/s^2}\\)。相对加速度为 \\(-16\\,\\mathrm{m/s^2}\\)，经 0.5 s 共速，相对位移 \\(8\\times0.5-\\frac12\\times16\\times0.5^2=2.0\\,\\mathrm m\\)。平板车至少长 2.0 m。")
    ],
    practice: {
      title: "进阶近似题：传送带速度反向与板车临界",
      question: "货物以速度 \\(u_0\\) 滑上传送带，带速为 \\(v\\)，两者方向相同但大小任意，动摩擦因数为 \\(\\mu\\)，带长为 \\(L\\)。货物离带后以速度 \\(u_C\\) 滑上质量为 \\(M\\) 的平板车，货物质量为 \\(m\\)，货物—车、车—地动摩擦因数为 \\(\\mu_3,\\mu_4\\)。写出判断摩擦方向、是否在带上共速、以及平板车最小长度的一般步骤。",
      answer: "**传送带阶段**\n\n摩擦方向由 \\(v-u_0\\) 的符号决定，货物加速度为 \\(a=\\mu g\\,\\mathrm{sgn}(v-u_0)\\)。先算共速时间 \\(t_c=|v-u_0|/(\\mu g)\\) 与共速前位移；若该位移超过 \\(L\\)，则货物未共速便离带。\n\n**平板车阶段**\n\n滑动时 \\(a_m=-\\mu_3g\\)，\\(a_M=[\\mu_3mg-\\mu_4(m+M)g]/M\\)。若 \\(a_M\\le a_m\\)，两者不能靠该阶段追上；若 \\(a_M\\gt a_m\\)，共速时间 \\(t=u_C/(a_M-a_m)\\)，最小长度为相对位移 \\(L_{\\min}=u_Ct-\\frac12(a_M-a_m)t^2=u_C^2/[2(a_M-a_m)]\\)。",
      thinking: "**解题思路**\n\n传送带和板车都必须先做‘相对速度—摩擦方向—阶段终点’判断。公式只有在共速发生于当前接触区间内时才有效。"
    }
  }),
  choice({
    number: 9,
    id: "spring_test_single_09_circle_groove",
    model: "斜面圆槽相对静止",
    question: "小球 C 置于光滑圆形槽 B 内，B 放在倾角为 \\(\\theta\\) 的足够长光滑斜面 A 上。B、C 一起沿斜面下滑，稳定后 C 与 B 相对静止。下列位置关系正确的是（　　）。上方动画区给出圆槽中的受力方向示意。",
    options: [
      "A. C 偏在圆槽靠斜面上方的一侧",
      "B. C 偏在圆槽沿斜面下方的一侧",
      "C. C 位于圆槽相对斜面的槽底，槽心与 C 的连线垂直斜面",
      "D. C 位于圆槽水平方向的最右侧"
    ],
    answer: "C",
    knowledge: ["加速参考系", "等效重力", "斜面共同加速度", "圆槽约束"],
    animation: animation("spring_test_09_circle_groove", true, {
      angle: { label: "斜面角", value: 30, min: 10, max: 50, step: 1, unit: "deg" },
      g: { label: "重力加速度", value: 10, min: 5, max: 15, step: 0.5, unit: "m/s^2" }
    }, 6, "圆槽沿光滑斜面下滑，动画显示小球最终位于等效重力方向的最低点。"),
    steps: [
      step("求共同加速度", "B、C 系统沿光滑斜面下滑，其共同加速度为 \\(a=g\\sin\\theta\\)，方向沿斜面向下。"),
      step("转到圆槽参考系", "在随 B 加速的参考系中，小球除重力外还受沿斜面向上的惯性力 \\(ma\\)。"),
      step("求等效重力", "重力沿斜面的分量 \\(mg\\sin\\theta\\) 恰被惯性力抵消，只剩垂直斜面向下的分量 \\(mg\\cos\\theta\\)。"),
      step("确定平衡位置", "相对静止时圆槽支持力与等效重力反向，故小球位于相对斜面的槽底，槽心到 C 的半径垂直斜面，选 C。")
    ],
    optionThinking: "先求圆槽的平动加速度，再在随槽参考系中用 \\(\\vec g_\\text{eff}=\\vec g-\\vec a\\) 找到相对最低点。",
    optionFormulas: R`\[a=g\sin\theta,\qquad \vec g_\text{eff}=\vec g-\vec a,\qquad |\vec g_\text{eff}|=g\cos\theta\]`,
    optionJudgments: {
      A: "等效重力没有沿斜面向上的分量，小球不会停在该侧，A 错误。",
      B: "重力沿斜面分量已被惯性力抵消，小球不会偏向斜面下方，B 错误。",
      C: "等效重力垂直斜面，小球位于该方向的槽底，C 正确。",
      D: "平衡位置由等效重力而不是地面水平方向决定，D 错误。"
    },
    practice: {
      title: "进阶近似题：圆槽受外力时的平衡方位",
      question: "圆形槽沿倾角为 \\(\\theta\\) 的斜面以给定加速度 \\(A\\) 向下运动，槽内光滑小球相对槽静止。求等效重力沿斜面和垂直斜面的分量，并确定槽心到小球的半径与斜面法线的夹角。",
      answer: "**等效重力分量**\n\n沿斜面向下取正：\\(g_{\\parallel}=g\\sin\\theta-A\\)；垂直斜面向内：\\(g_\\perp=g\\cos\\theta\\)。\n\n**平衡方位**\n\n槽心到小球的半径沿 \\(\\vec g_\\text{eff}\\) 方向，故相对斜面法线的偏角满足 \\(\\tan\\varphi=(g\\sin\\theta-A)/(g\\cos\\theta)\\)。当 \\(A=g\\sin\\theta\\) 时退化为原题的 \\(\\varphi=0\\)。",
      thinking: "**解题思路**\n\n把圆槽参考系看成带有惯性力的静力学问题。先求等效重力矢量，再让圆槽法向支持力与它反向。"
    }
  }),
  choice({
    number: 10,
    id: "spring_test_single_10_steel_coil",
    model: "钢卷刹车离地临界",
    question: "半径为 \\(R\\) 的圆形钢卷放在货车水平车面上，未采用其他固定方式，只由前、后两个三角尖楔顶住下端。尖楔与钢卷接触点距车面高度为 \\(h\\)，尖楔相对车面不滑动，钢卷与尖楔间摩擦不计。货车急刹时，为保证钢卷不离开车面，刹车加速度大小不能超过（　　）。",
    options: [
      "A. \\(\\frac{g\\sqrt{2Rh-h^2}}{R-h}\\)",
      "B. \\(\\frac{g(R-h)}{R}\\)",
      "C. \\(\\frac{g\\sqrt{2Rh-h^2}}{R}\\)",
      "D. \\(\\frac{g\\sqrt{R^2-h^2}}{R-h}\\)"
    ],
    answer: "A",
    knowledge: ["加速参考系", "临界离地", "圆几何", "共点力平衡"],
    animation: animation("spring_test_10_steel_coil", true, {
      radius: { label: "钢卷半径", value: 1, min: 0.6, max: 2, step: 0.1, unit: "m" },
      contactHeight: { label: "接触点高度比", value: 0.4, min: 0.15, max: 0.8, step: 0.05, unit: "R" },
      accel: { label: "刹车加速度", value: 6, min: 0, max: 15, step: 0.5, unit: "m/s^2" }
    }, 6, "用惯性力、重力和尖楔支持力显示钢卷离开车面的临界。"),
    steps: [
      step("作接触几何", "钢卷圆心高为 \\(R\\)。接触点与圆心的竖直距离为 \\(R-h\\)，水平距离为 \\(x=\\sqrt{R^2-(R-h)^2}=\\sqrt{2Rh-h^2}\\)。"),
      step("确定临界状态", "刹车参考系中钢卷受向前的惯性力 \\(ma\\)。刚要离开车面时，车面对钢卷的支持力为零。"),
      step("分解尖楔支持力", "尖楔支持力通过圆心。由水平、竖直平衡，有 \\(N x/R=ma\\)，\\(N(R-h)/R=mg\\)。"),
      step("求加速度上限", "两式相除得 \\(a/g=x/(R-h)\\)，故 \\(a_{\\max}=g\\sqrt{2Rh-h^2}/(R-h)\\)，选 A。")
    ],
    optionThinking: "先由圆几何求接触法线的水平、竖直投影，再在刹车参考系中令车面支持力恰为零。",
    optionFormulas: R`\[x=\sqrt{2Rh-h^2},\qquad \frac{a_{\max}}g=\frac{x}{R-h}\]`,
    optionJudgments: {
      A: "该式同时包含接触法线的水平投影和竖直投影，A 正确。",
      B: "只保留了竖直距离比例，遗漏圆周几何的水平投影，B 错误。",
      C: "分母应为接触点到圆心的竖直距离 \\(R-h\\)，C 错误。",
      D: "水平距离应由 \\(R^2-(R-h)^2\\) 得到，而不是 \\(R^2-h^2\\)，D 错误。"
    },
    practice: {
      title: "进阶近似题：由接触角统一钢卷临界",
      question: "圆柱形货物由水平车面和前方光滑挡块共同约束。挡块支持力方向与竖直方向夹角为 \\(\\varphi\\)。货车刹车时，求货物不离开车面的最大减速度；再把 \\(\\varphi\\) 用圆半径 \\(R\\) 和接触点高度 \\(h\\) 表示。",
      answer: "**力学临界**\n\n离地临界时挡块支持力的竖直分量平衡重力、水平分量平衡惯性力，因此 \\(a_{\\max}=g\\tan\\varphi\\)。\n\n**圆几何**\n\n\\(\\tan\\varphi=\\sqrt{2Rh-h^2}/(R-h)\\)，代回即得原题通式。",
      thinking: "**解题思路**\n\n先把几何信息压缩成支持力方向角，再做两力分解。这样同一结论可直接迁移到不同形状的挡块。"
    }
  }),
  choice({
    number: 11,
    id: "spring_test_single_11_force_sensor",
    model: "下蹲起跳压力图像",
    question: "水平力传感器记录人对其压力 \\(F\\) 随时间的变化。人从静止站立开始，先下蹲，再原地向上跳起，离开传感器后落回。图像中站立压力基线、下蹲和起跳阶段以及一段 \\(F=0\\) 的腾空区间均可辨认。取 \\(g=10\\,\\mathrm{m/s^2}\\)。下列说法正确的是（　　）。",
    options: [
      "A. 图像表明人向上跳起后离开传感器两次",
      "B. 根据离开与落回传感器的时刻，可计算人跳起后离开传感器的高度",
      "C. 在图示 \\(t_1\\) 到 \\(t_2\\) 内，人从静止站立下蹲到最低点",
      "D. 从最低点向上跳起至离开传感器的过程中，人始终处于超重状态"
    ],
    answer: "B",
    knowledge: ["超重与失重", "压力图像", "冲量", "竖直上抛"],
    animation: animation("spring_test_11_force_sensor", true, {
      mass: { label: "人的质量", value: 60, min: 40, max: 90, step: 1, unit: "kg" },
      jumpHeight: { label: "跳起高度", value: 0.45, min: 0.2, max: 1, step: 0.05, unit: "m" }
    }, 8, "左侧显示下蹲、蹬地、腾空、落地，右侧绘制压力—时间图像。"),
    steps: [
      step("确定压力基线", "静止站立时 \\(F=mg\\)。压力高于 \\(mg\\) 表示质心加速度向上，低于 \\(mg\\) 表示加速度向下。"),
      step("识别腾空区间", "人与传感器分离时压力为零。图中只有一个连续的 \\(F=0\\) 区间，对应一次腾空。"),
      step("由腾空时间求高度", "若离地到落回同一高度的总时间为 \\(T\\)，则初速度 \\(v_0=gT/2\\)，跳起高度 \\(H=v_0^2/(2g)=gT^2/8\\)。"),
      step("判断下蹲和起跳", "最低点和离地都要结合速度积分判断，不能只看某两个压力时刻；起跳后段可出现 \\(F\\lt mg\\) 以减小向上速度，故不始终超重。选 B。")
    ],
    optionThinking: "以 \\(F=mg\\) 为基线判断加速度，用 \\(F=0\\) 判断离地；位置和速度必须通过加速度随时间的积分判断。",
    optionFormulas: R`\[F-mg=ma,\qquad v_0=\frac{gT}{2},\qquad H=\frac{gT^2}{8}\]`,
    optionJudgments: {
      A: "图中只有一段连续零压力区间，表示一次离地，A 错误。",
      B: "腾空时间可给出离地速度和最大高度，B 正确。",
      C: "最低点对应速度由负变正，必须积分 \\((F-mg)/m\\) 才能定位，不能直接认定为 \\(t_2\\)，C 错误。",
      D: "离地前可有压力低于体重的阶段，人并非始终超重，D 错误。"
    },
    practice: {
      title: "进阶近似题：由分段压力求起跳高度",
      question: "质量为 \\(60\\,\\mathrm{kg}\\) 的人在最低点速度为零。随后传感器示数先为 \\(1200\\,\\mathrm N\\)，持续 \\(0.40\\,\\mathrm s\\)；再为 \\(300\\,\\mathrm N\\)，持续 \\(0.20\\,\\mathrm s\\)，之后降为零并离地。取 \\(g=10\\,\\mathrm{m/s^2}\\)。求离地速度和相对离地点的最大高度。",
      answer: "**冲量求速度**\n\n合力冲量为 \\((1200-600)\\times0.40+(300-600)\\times0.20=180\\,\\mathrm{N\\,s}\\)。故 \\(v_0=180/60=3.0\\,\\mathrm{m/s}\\)。\n\n**上升高度**\n\n\\(H=v_0^2/(2g)=0.45\\,\\mathrm m\\)。",
      thinking: "**解题思路**\n\n压力变化时加速度不是单一常量。把各段净力冲量相加，比逐段先求位移更直接。"
    }
  }),
  choice({
    number: 12,
    id: "spring_test_single_12_cable_car",
    model: "缆车加速摩擦判零",
    question: "缆车沿与水平方向成 \\(30^\\circ\\) 的绳缆向上做匀加速直线运动。车厢内 P、Q 两物体与车厢保持相对静止。四种图示中，P、Q 的接触面方向不同。P、Q 间摩擦力可能为零的是（　　）。上方动画区显示无摩擦时接触面法线与等效重力的关系。",
    options: ["A. 图 A 所示", "B. 图 B 所示", "C. 图 C 所示", "D. 图 D 所示"],
    answer: "C",
    knowledge: ["随体参考系", "等效重力", "接触面摩擦", "共同加速度"],
    animation: animation("spring_test_12_cable_car", true, {
      accel: { label: "缆车加速度", value: 3, min: 0.5, max: 8, step: 0.5, unit: "m/s^2" },
      cableAngle: { label: "缆绳角度", value: 30, min: 15, max: 50, step: 1, unit: "deg" }
    }, 6, "缆车上行时显示 \\(m\\vec g-m\\vec a\\) 的等效方向；接触面垂直该方向时摩擦可为零。"),
    steps: [
      step("转到缆车参考系", "在随缆车加速的参考系中，每个物体除重力外还受与缆车加速度反向的惯性力 \\(-m\\vec a\\)。"),
      step("构造等效重力", "定义 \\(\\vec g_\\text{eff}=\\vec g-\\vec a\\)。若 P、Q 间摩擦为零，则接触面对物体只能提供法向力。"),
      step("写出判零条件", "物体相对静止且只有重力、惯性力和法向力时，法向力必须与 \\(-m\\vec g_\\text{eff}\\) 同向，即接触面必须垂直 \\(\\vec g_\\text{eff}\\)。"),
      step("对照图示", "四个摆放中，只有图 C 的接触面法线与所需合力方向一致，因此 C 正确。")
    ],
    optionThinking: "不要先猜摩擦方向。先假设摩擦为零，求重力与惯性力的合力方向，再检查接触面法线能否单独提供它。",
    optionFormulas: R`\[\vec g_\text{eff}=\vec g-\vec a,\qquad \vec N=-m\vec g_\text{eff}\quad(f=0)\]`,
    optionJudgments: {
      A: "图 A 的接触面法线与所需合力不共线，仍需摩擦，A 错误。",
      B: "图 B 的法向力方向不能同时平衡重力与惯性力，B 错误。",
      C: "图 C 的法线与 \\(-\\vec g_\\text{eff}\\) 同向，摩擦可以为零，C 正确。",
      D: "图 D 的接触面角度与等效重力方向不匹配，D 错误。"
    },
    practice: {
      title: "进阶近似题：反求无摩擦接触面的方向",
      question: "车厢以加速度 \\(a\\) 沿与水平成 \\(\\alpha\\) 的方向向上运动。质量为 \\(m\\) 的物块要在车厢内某光滑固定面上保持相对静止。求该面的法线方向，并写出法向力大小。",
      answer: "**等效重力**\n\n取水平向右、竖直向上，\\(\\vec a=(a\\cos\\alpha,a\\sin\\alpha)\\)，故 \\(\\vec g_\\text{eff}=(-a\\cos\\alpha,-g-a\\sin\\alpha)\\)。\n\n**法线方向与大小**\n\n支持力应沿 \\(-\\vec g_\\text{eff}\\)，其与水平夹角满足 \\(\\tan\\phi=(g+a\\sin\\alpha)/(a\\cos\\alpha)\\)，大小 \\(N=m\\sqrt{a^2\\cos^2\\alpha+(g+a\\sin\\alpha)^2}\\)。接触面与该法线垂直。",
      thinking: "**解题思路**\n\n把非惯性系问题统一成等效重力问题。光滑面只允许一个法向力，所以法线方向由等效重力唯一确定。"
    }
  }),
  choice({
    number: 13,
    id: "spring_test_single_13_stacked_plates",
    model: "三层工件急刹错位",
    question: "三块完全相同的均质板状工件上下对齐放在卡车上，只有最下面工件与车厢底部固定。运输途中司机紧急刹车。若各接触面的摩擦性质相同，下列可能出现的状态是（　　）。",
    options: [
      "A. 三层依次向车头错开，越上层越靠前",
      "B. 上层相对中层向车尾错开",
      "C. 中层向车尾、上层向车头交错",
      "D. 上面两层保持对齐，并相对固定的底层一起向车头滑动"
    ],
    answer: "D",
    knowledge: ["惯性", "多层摩擦", "相对运动", "临界静摩擦"],
    animation: animation("spring_test_13_stacked_plates", true, {
      brake: { label: "刹车减速度", value: 7, min: 2, max: 12, step: 0.5, unit: "m/s^2" },
      mu: { label: "摩擦因数", value: 0.4, min: 0.15, max: 0.8, step: 0.05, unit: "" }
    }, 6, "底层固定随车减速，上面两层可保持对齐并整体相对底层向车头滑动。"),
    steps: [
      step("判断相对趋势", "卡车向前行驶时急刹，未固定工件因惯性相对车厢向车头方向运动，不可能主动向车尾错开。"),
      step("比较两接触面的临界", "设接触面静摩擦因数相同。维持顶层随车所需摩擦为 \\(ma\\)，上限为 \\(\\mu mg\\)；维持上面两层随车所需总摩擦为 \\(2ma\\)，底界面上限为 \\(2\\mu mg\\)。两处临界条件均为 \\(a=\\mu g\\)。"),
      step("进入滑动后", "超过临界时，上面两层可作为整体相对底层前滑。顶层由中层摩擦减速，中层同时受顶层反作用和底层摩擦，二者可保持相同加速度。"),
      step("对照状态", "因此上面两层保持对齐、共同相对底层向车头错开的 D 图是可能状态。")
    ],
    optionThinking: "先用惯性判断所有未固定层的相对滑动方向，再比较各界面‘所需摩擦/最大摩擦’的比例。",
    optionFormulas: R`\[f_{12,\max}=\mu mg,\qquad f_{23,\max}=2\mu mg,\qquad a_c=\mu g\]`,
    optionJudgments: {
      A: "相同摩擦性质下两层可以保持相同加速度，不必逐层形成越来越大的前错位，A 不是题设对应状态。",
      B: "急刹时自由层相对车厢趋向车头，不会向车尾，B 错误。",
      C: "中层向车尾与惯性趋势相反，C 错误。",
      D: "两界面临界条件相同，上面两层可对齐并整体前滑，D 正确。"
    },
    practice: {
      title: "进阶近似题：N 层板的同步滑动临界",
      question: "\\(N\\) 块质量均为 \\(m\\) 的相同薄板叠放在车上，最下层固定，相邻界面静摩擦因数均为 \\(\\mu\\)。车以减速度 \\(a\\) 刹车。证明各界面维持其上方全部板随车运动的临界条件相同，并讨论 \\(a\\gt\\mu g\\) 后可能的整体滑动方式。",
      answer: "**第 \\(j\\) 个界面**\n\n其上共有 \\(n\\) 块板，需要摩擦 \\(nma\\)；法向力为 \\(nmg\\)，最大静摩擦为 \\(\\mu nmg\\)。\n\n**统一临界**\n\n\\(nma\\le\\mu nmg\\Rightarrow a\\le\\mu g\\)，与层数和界面位置无关。\n\n**超过临界**\n\n所有未固定板可以保持相对对齐，作为一个整体相对固定底层向车头滑动。",
      thinking: "**解题思路**\n\n不要逐块列很多方程。对任一界面以上的全部板作整体，质量与法向力都按相同倍数增长，临界比值会自动约去层数。"
    }
  }),
  choice({
    number: 14,
    id: "spring_test_single_14_spring_cases",
    model: "弹簧连接体三种方向",
    question: "轻质弹簧连接物块 a、b。图 I 中两物块在水平轨道上，图 II 中两物块在固定斜面上，图 III 中两物块竖直放置。三种情形均沿图示方向用大小恒定的力 \\(F\\) 拉 a，使 a、b 一起做匀加速直线运动。加速度大小分别为 \\(a_1,a_2,a_3\\)，弹簧伸长量分别为 \\(x_1,x_2,x_3\\)，不计摩擦。下列关系正确的是（　　）。",
    options: [
      "A. \\(a_1\\gt a_2\\gt a_3\\)，且 \\(x_1=x_2=x_3\\)",
      "B. \\(a_1\\gt a_3\\gt a_2\\)，且 \\(x_1\\gt x_3\\gt x_2\\)",
      "C. \\(a_2\\gt a_1\\gt a_3\\)，且 \\(x_1=x_2=x_3\\)",
      "D. \\(a_3\\gt a_2\\gt a_1\\)，且 \\(x_1\\gt x_3\\gt x_2\\)"
    ],
    answer: "A",
    knowledge: ["连接体整体法", "弹簧隔离法", "牛顿第二定律", "重力分量"],
    animation: animation("spring_test_14_spring_cases", true, {
      force: { label: "拉力", value: 30, min: 15, max: 60, step: 1, unit: "N" },
      slopeAngle: { label: "斜面角", value: 30, min: 15, max: 50, step: 1, unit: "deg" }
    }, 6, "并列显示水平、斜面、竖直三种连接体；加速度不同而弹簧伸长相同。"),
    steps: [
      step("整体求加速度", "设两物块总质量为 \\(M\\)。水平时 \\(a_1=F/M\\)，斜面上拉时 \\(a_2=F/M-g\\sin\\theta\\)，竖直上拉时 \\(a_3=F/M-g\\)。"),
      step("比较加速度", "因 \\(0\\lt\\sin\\theta\\lt1\\)，故 \\(a_1\\gt a_2\\gt a_3\\)。"),
      step("隔离物块 b", "设 b 的质量为 \\(m_b\\)，运动方向上的重力分量为 \\(m_bg_\\parallel\\)。有 \\(kx-m_bg_\\parallel=m_ba\\)。"),
      step("代回整体结果", "而 \\(a=F/M-g_\\parallel\\)，故 \\(kx=m_bF/M\\)，与轨道方向无关，所以 \\(x_1=x_2=x_3\\)。选 A。")
    ],
    optionThinking: "加速度用整体法，弹簧伸长用隔离 b。把整体加速度代回隔离方程，重力分量会抵消。",
    optionFormulas: R`\[a=\frac FM-g_\parallel,\qquad kx-m_bg_\parallel=m_ba\Rightarrow kx=\frac{m_bF}{M}\]`,
    optionJudgments: {
      A: "加速度依次减小，而三种弹簧伸长相等，A 正确。",
      B: "斜面重力分量小于竖直重力分量，故 \\(a_2\\gt a_3\\)，且伸长量不分大小，B 错误。",
      C: "水平情形没有反向重力分量，应有最大加速度，C 错误。",
      D: "竖直上拉加速度最小，且伸长量相等，D 错误。"
    },
    practice: {
      title: "进阶近似题：任意方向连接体的伸长不变量",
      question: "质量分别为 \\(m_a,m_b\\) 的两物块由劲度系数为 \\(k\\) 的轻弹簧连接，在一条与重力方向成任意角度的光滑直轨上运动。沿轨道方向用恒力 \\(F\\) 拉 \\(a\\)。证明稳定匀加速阶段的弹簧伸长与轨道方向无关，并求其值。",
      answer: "**整体加速度**\n\n令重力沿运动反方向分量为 \\(g_\\parallel\\)，则 \\(a=F/(m_a+m_b)-g_\\parallel\\)。\n\n**隔离 b**\n\n\\(kx-m_bg_\\parallel=m_ba\\)。代入得 \\(kx=m_bF/(m_a+m_b)\\)，所以 \\(x=m_bF/[k(m_a+m_b)]\\)，与 \\(g_\\parallel\\) 无关。",
      thinking: "**解题思路**\n\n同一个重力分量既影响整体加速度，也直接作用在 b 上；代回后恰好抵消。这比逐个方向分别计算更能看出不变量。"
    }
  }),
  choice({
    number: 15,
    id: "spring_test_single_15_braking_graph",
    model: "刹车变换图像",
    question: "汽车匀速行驶时，驾驶员发现车头前方 \\(30\\,\\mathrm m\\) 处有动物横穿公路，经过 \\(0.2\\,\\mathrm s\\) 反应时间后刹车。刹车过程中汽车的 \\(x/t^2\\)-\\(1/t\\) 图像是一条直线，其纵轴截距为 \\(-1\\,\\mathrm{m/s^2}\\)，横轴截距为 \\(0.1\\,\\mathrm{s^{-1}}\\)。下列说法正确的是（　　）。",
    options: [
      "A. 汽车刹车的加速度大小为 \\(1\\,\\mathrm{m/s^2}\\)",
      "B. 汽车刹车后在 \\(10\\,\\mathrm s\\) 时停下来",
      "C. 汽车最终没有撞上动物",
      "D. 汽车刹车后 \\(6\\,\\mathrm s\\) 内行驶的位移大小为 \\(36\\,\\mathrm m\\)"
    ],
    answer: "C",
    knowledge: ["匀变速图像变换", "反应距离", "刹车停止", "安全距离"],
    animation: animation("spring_test_15_braking_graph", true, {
      speed: { label: "初速度", value: 10, min: 5, max: 20, step: 0.5, unit: "m/s" },
      decel: { label: "刹车减速度", value: 2, min: 1, max: 5, step: 0.25, unit: "m/s^2" },
      reaction: { label: "反应时间", value: 0.2, min: 0, max: 1, step: 0.05, unit: "s" }
    }, 6, "汽车先按反应时间匀速，再匀减速；右图绘制 \\(x/t^2\\) 对 \\(1/t\\) 的直线。"),
    steps: [
      step("变换运动方程", "刹车位移满足 \\(x=v_0t+\\frac12at^2\\)。两边除以 \\(t^2\\)，得 \\(x/t^2=v_0(1/t)+a/2\\)。"),
      step("读出初速度和加速度", "纵截距 \\(a/2=-1\\)，故 \\(a=-2\\,\\mathrm{m/s^2}\\)。横截距满足 \\(0=0.1v_0-1\\)，故 \\(v_0=10\\,\\mathrm{m/s}\\)。"),
      step("求停车时间和距离", "刹车时间 \\(t_s=v_0/|a|=5\\,\\mathrm s\\)，刹车距离 \\(s_b=v_0^2/(2|a|)=25\\,\\mathrm m\\)。反应距离为 \\(s_r=v_0\\times0.2=2\\,\\mathrm m\\)。"),
      step("判断碰撞", "总停车距离 \\(27\\,\\mathrm m\\lt30\\,\\mathrm m\\)，汽车在动物前 \\(3\\,\\mathrm m\\) 停下，故 C 正确。")
    ],
    optionThinking: "先把图像的斜率、截距还原成 \\(v_0,a\\)，再检查物理停止时刻，不能把匀减速公式延伸到停车之后。",
    optionFormulas: R`\[\frac{x}{t^2}=v_0\frac1t+\frac a2,\qquad t_s=\frac{v_0}{|a|},\qquad s_b=\frac{v_0^2}{2|a|}\]`,
    optionJudgments: {
      A: "纵截距是 \\(a/2\\)，故减速度大小为 \\(2\\,\\mathrm{m/s^2}\\)，A 错误。",
      B: "横轴截距不是停车时间；实际停车时间为 5 s，B 错误。",
      C: "反应距离与刹车距离之和为 27 m，小于 30 m，C 正确。",
      D: "刹车 5 s 后已停车，6 s 内刹车位移仍为 25 m，D 错误。"
    },
    practice: {
      title: "进阶近似题：由截距反推安全余量",
      question: "某车刹车阶段的 \\(x/t^2\\)-\\(1/t\\) 图像纵截距为 \\(-2\\,\\mathrm{m/s^2}\\)，横截距为 \\(0.20\\,\\mathrm{s^{-1}}\\)。驾驶员反应时间为 \\(0.30\\,\\mathrm s\\)，障碍物初距 \\(16.5\\,\\mathrm m\\)。求初速度、刹车加速度、总停车距离及安全余量。",
      answer: "**图像参数**\n\n\\(a/2=-2\\Rightarrow a=-4\\,\\mathrm{m/s^2}\\)。横截距给出 \\(0=0.20v_0-2\\)，故 \\(v_0=10\\,\\mathrm{m/s}\\)。\n\n**停车距离**\n\n反应距离 \\(3.0\\,\\mathrm m\\)，刹车距离 \\(v_0^2/(2|a|)=12.5\\,\\mathrm m\\)，总计 \\(15.5\\,\\mathrm m\\)。安全余量为 \\(1.0\\,\\mathrm m\\)。",
      thinking: "**解题思路**\n\n纵截距先乘 2 得加速度，横截距再反求初速度。最后把反应段和制动段分开计算。"
    }
  }),
  choice({
    number: 2,
    id: "spring_test_single_02_grid_slide",
    model: "八格匀减速滑行",
    question: "地上有连续排列的 8 个等大格子。石块从第 1 个格子的前端踢出，沿直线滑动并恰好停在第 8 个格子的后端，总滑行时间为 \\(t_0\\)。石块不转动、不滚动，且与地面的动摩擦因数处处相同。下列说法正确的是（　　）。",
    options: [
      "A. 石块到达第 6 个格子后端的速度，是到达第 1 个格子前端速度的一半",
      "B. 石块通过第 1 个格子的时间为 \\(\\frac14t_0\\)",
      "C. 石块通过前 2 个格子的时间为 \\((2-\\sqrt3)t_0\\)",
      "D. 石块通过第 1 个格子与第 8 个格子的平均速度之比为 \\((3-\\sqrt8):1\\)"
    ],
    answer: "A",
    knowledge: ["匀减速直线运动", "逆向思维", "速度位移关系", "平均速度"],
    animation: animation("spring_test_02_grid_slide", true, {
      speed: { label: "初速度", value: 8, min: 4, max: 16, step: 0.5, unit: "m/s" },
      cells: { label: "格子数", value: 8, min: 4, max: 12, step: 1, unit: "" }
    }, 6, "石块在等长八格中匀减速至零，右图同步显示速度随时间下降。"),
    steps: [
      step("建立总过程", "设每格长度为 \\(l\\)，减速度大小为 \\(a\\)。末速度为零，所以 \\(v_0=at_0\\)，且 \\(8l=\\frac12at_0^2\\)。"),
      step("写出分界速度", "到达第 \\(k\\) 格后端时，剩余距离为 \\((8-k)l\\)。由 \\(v_k^2=2a(8-k)l\\)，得 \\(v_k=v_0\\sqrt{(8-k)/8}\\)。"),
      step("写出分段时间", "到达第 \\(k\\) 格后端的时刻为 \\(t_k=t_0\\bigl(1-\\sqrt{1-k/8}\\bigr)\\)。"),
      step("逐项比较", "代入 \\(k=6\\) 得 \\(v_6=v_0/2\\)。其余时间与平均速度关系均不符合上述通式，故选 A。")
    ],
    optionThinking: "利用末速度为零把过程倒看成由静止开始的匀加速，再用剩余距离求各分界速度和时间。",
    optionFormulas: R`\[v_k=v_0\sqrt{\frac{8-k}{8}},\qquad t_k=t_0\left(1-\sqrt{1-\frac{k}{8}}\right)\]`,
    optionJudgments: {
      A: "\\(v_6/v_0=\\sqrt{2/8}=1/2\\)，A 正确。",
      B: "\\(t_1/t_0=1-\\sqrt{7/8}\\ne1/4\\)，B 错误。",
      C: "\\(t_2/t_0=1-\\sqrt3/2=(2-\\sqrt3)/2\\)，题给结果多了 2 倍，C 错误。",
      D: "两段平均速度之比为 \\(\\sqrt8+\\sqrt7\\)，不等于 \\(3-\\sqrt8\\)，D 错误。"
    },
    practice: {
      title: "进阶近似题：N 等分匀减速的通式",
      question: "物块以初速度 \\(v_0\\) 滑入长度为 \\(L\\) 的粗糙水平面并恰在末端停止。把 \\(L\\) 等分为 \\(N\\) 段。求通过第 \\(k\\) 段起点时的速度、通过前 \\(k\\) 段的时间，以及第 1 段和第 \\(N\\) 段平均速度之比。",
      answer: "**分界速度**\n\n第 \\(k\\) 段起点前已走 \\((k-1)L/N\\)，故 \\(v_{k-1}=v_0\\sqrt{(N-k+1)/N}\\)。\n\n**累计时间**\n\n\\(t_k=t_0\\left(1-\\sqrt{1-k/N}\\right)\\)。\n\n**平均速度比**\n\n\\(\\bar v_1/\\bar v_N=(v_0+v_1)/v_{N-1}=\\sqrt N+\\sqrt{N-1}\\)。",
      thinking: "**解题思路**\n\n不要逐段重复列运动学方程。先用 \\(v^2=2a\\times\\)剩余距离得到任意分界速度，再由匀变速平均速度处理首尾两段。"
    }
  }),
  choice({
    number: 4,
    id: "spring_test_single_04_curved_slope",
    model: "弧形坡道准静态受力",
    question: "汽车沿弧形坡道缓慢下坡，先后经过坡度较大的 A 点和坡度较小的 B 点。关于汽车在 A、B 两点的受力，下列说法正确的是（　　）。",
    options: [
      "A. 坡道对车的支持力在 A 点比 B 点小",
      "B. 坡道对车的摩擦力在 A 点比 B 点小",
      "C. 车受到的合外力在 A 点比 B 点小",
      "D. 坡道对车的作用力在 A 点与 B 点等大"
    ],
    answer: "A、D（按题面‘缓慢’作准静态理解，原题存在单选歧义）",
    knowledge: ["准静态平衡", "斜面受力", "支持力", "静摩擦力"],
    animation: animation("spring_test_04_curved_slope", true, {
      maxAngle: { label: "最大坡角", value: 38, min: 15, max: 55, step: 1, unit: "deg" }
    }, 6, "汽车缓慢经过不同坡度位置，受力箭头与右侧分力曲线同步变化。"),
    steps: [
      step("采用准静态近似", "‘缓慢下坡’表示速度和加速度都可忽略，汽车在每个位置近似满足 \\(\\sum\\vec F=0\\)。"),
      step("沿局部切线分解", "设局部坡角为 \\(\\theta\\)，有 \\(N=mg\\cos\\theta\\)，静摩擦力大小 \\(f=mg\\sin\\theta\\)。"),
      step("比较 A、B", "因 \\(\\theta_A\\gt\\theta_B\\)，故 \\(N_A\\lt N_B\\)，而 \\(f_A\\gt f_B\\)。两点合外力均近似为零。"),
      step("检查单选歧义", "支持力与摩擦力的矢量和始终与重力等大反向，故坡道对车的作用力大小均为 \\(mg\\)，D 也正确。按题面给出的‘缓慢’条件，A、D 同时成立；若命题人只希望保留一个答案，还需补充不能采用准静态近似等额外条件。")
    ],
    optionThinking: "把弧形坡道在每一点局部看成斜面，先比较支持力和摩擦力分量，再比较二者的矢量合力。",
    optionFormulas: R`\[N=mg\cos\theta,\qquad f=mg\sin\theta,\qquad \vec N+\vec f=-m\vec g\]`,
    optionJudgments: {
      A: "A 点更陡，\\(N_A\\lt N_B\\)，A 正确。",
      B: "更陡处所需摩擦力更大，故 \\(f_A\\gt f_B\\)，B 错误。",
      C: "两点均近似平衡，合外力均为零，C 错误。",
      D: "坡道作用力是 \\(\\vec N+\\vec f\\)，其大小在两点均为 \\(mg\\)，D 也正确。因此原题按准静态模型不满足单选要求。"
    },
    practice: {
      title: "进阶近似题：变坡度上的匀速下放",
      question: "质量为 \\(m\\) 的小车在局部坡角为 \\(\\theta(x)\\) 的粗糙弯坡上，被沿坡向上的轻绳以张力 \\(T(x)\\) 匀速下放。求支持力和摩擦力；讨论何时摩擦方向改变，并求坡道对车总作用力的大小。",
      answer: "**法向平衡**\n\n\\(N=mg\\cos\\theta\\)。\n\n**切向平衡**\n\n取沿坡向下为正，\\(mg\\sin\\theta-T-f=0\\)，故 \\(f=mg\\sin\\theta-T\\)。正值表示摩擦向上，负值表示摩擦向下。\n\n**方向临界**\n\n当 \\(T=mg\\sin\\theta\\) 时摩擦为零并换向。\n\n**总作用力**\n\n坡道作用力大小为 \\(R=\\sqrt{N^2+f^2}\\)，此时不再恒等于 \\(mg\\)，因为绳张力也参与平衡。",
      thinking: "**解题思路**\n\n弯坡只改变局部切线方向。每个位置都建立切向—法向坐标，再用摩擦力的代数符号判断真实方向。"
    }
  }),
  choice({
    number: 5,
    id: "spring_test_single_05_light_chain",
    model: "五彩灯绳系平衡",
    question: "五个质量均为 \\(m\\) 的小彩灯由轻绳依次连接并静止。天花板与彩灯 1 间的细绳同竖直方向夹角 \\(\\theta_1=30^\\circ\\)，连接彩灯 2、3 的细绳同水平方向夹角为 \\(\\theta_2\\)，彩灯 5 右侧受水平恒力 \\(F\\)。下列说法错误的是（　　）。",
    options: [
      "A. 连接天花板和彩灯 1 的细绳拉力为 \\(\\frac{10\\sqrt3}{3}mg\\)",
      "B. \\(\\theta_2=45^\\circ\\)",
      "C. 水平恒力 \\(F=\\frac{5\\sqrt3}{3}mg\\)",
      "D. 保持 \\(F\\) 方向不变并缓慢增大 \\(\\theta_1\\)，则 \\(F\\) 持续增大"
    ],
    answer: "B",
    knowledge: ["多结点平衡", "整体法", "隔离法", "绳张力"],
    animation: animation("spring_test_05_light_chain", true, {
      theta: { label: "顶部夹角", value: 30, min: 10, max: 55, step: 1, unit: "deg" },
      count: { label: "彩灯数", value: 5, min: 3, max: 8, step: 1, unit: "" }
    }, 6, "用整体法显示顶部拉力分量，并用截取后三盏灯的方法求中段绳角。"),
    steps: [
      step("整体法", "把五盏灯整体作为研究对象，外力只有总重力 \\(5mg\\)、顶部绳拉力 \\(T_1\\) 和水平力 \\(F\\)。"),
      step("求顶部拉力与水平力", "竖直、水平平衡分别给出 \\(T_1\\cos30^\\circ=5mg\\)、\\(F=T_1\\sin30^\\circ\\)，故 \\(T_1=10\\sqrt3mg/3\\)，\\(F=5\\sqrt3mg/3\\)。"),
      step("隔离后三盏灯", "截取彩灯 3、4、5，有 \\(T_{23}\\sin\\theta_2=3mg\\)、\\(T_{23}\\cos\\theta_2=F\\)，所以 \\(\\tan\\theta_2=3\\sqrt3/5\\)，并非 \\(45^\\circ\\)。"),
      step("讨论角度变化", "一般有 \\(F=5mg\\tan\\theta_1\\)，在 \\(0\\lt\\theta_1\\lt90^\\circ\\) 内随角度单调增大。故错误项为 B。")
    ],
    optionThinking: "先对全部彩灯用整体法求顶部张力和外力，再截取绳链右端若干盏灯求中段绳的方向。",
    optionFormulas: R`\[T_1\cos\theta_1=5mg,\quad F=T_1\sin\theta_1,\quad \tan\theta_2=\frac{3mg}{F}\]`,
    optionJudgments: {
      A: "由竖直平衡可得题给拉力，A 正确。",
      B: "\\(\\tan\\theta_2=3\\sqrt3/5\\ne1\\)，故 \\(\\theta_2\\ne45^\\circ\\)，B 错误，符合题问。",
      C: "由整体水平平衡得 \\(F=5\\sqrt3mg/3\\)，C 正确。",
      D: "\\(F=5mg\\tan\\theta_1\\) 随 \\(\\theta_1\\) 增大，D 正确。"
    },
    practice: {
      title: "进阶近似题：N 盏灯绳链的任意截面",
      question: "\\(N\\) 盏质量均为 \\(m\\) 的灯由轻绳串联静止，最右端受水平力 \\(F\\)。顶部绳与竖直夹角为 \\(\\alpha\\)。求 \\(F\\) 和顶部张力；再求连接第 \\(q\\) 与第 \\(q+1\\) 盏灯的绳同水平方向夹角 \\(\\beta_q\\)。",
      answer: "**整体平衡**\n\n\\(T_0\\cos\\alpha=Nmg\\)，\\(F=T_0\\sin\\alpha\\)，故 \\(T_0=Nmg/\\cos\\alpha\\)，\\(F=Nmg\\tan\\alpha\\)。\n\n**截取右端**\n\n第 \\(q+1\\) 至第 \\(N\\) 盏共有 \\(N-q\\) 盏，故 \\(\\tan\\beta_q=(N-q)mg/F=(N-q)/(N\\tan\\alpha)\\)。",
      thinking: "**解题思路**\n\n求外力优先用整体法，求某段绳方向则在该处切开并隔离右端。这样方程数最少，也不会在多个结点间重复传递张力。"
    }
  }),
  choice({
    number: 6,
    id: "spring_test_single_06_nail_basket",
    model: "双钉悬篮调节",
    question: "竖直墙面上有不等高的固定钉 A、B，一根轻绳依次绕过 A、B 后，两端悬挂同一吊篮。现把 B 竖直下移到 C，使 A、C 等高且 C 在 B 的正下方，再用原绳重新悬挂。细绳始终在同一竖直平面内，不计绳与钉间摩擦。下列说法正确的是（　　）。",
    options: [
      "A. 调整后细绳张力比调整前小",
      "B. 调整后细绳张力比调整前大",
      "C. 调整后细绳对两个钉子的总作用力大小比调整前小",
      "D. 调整后细绳对两个钉子的总作用力大小比调整前大"
    ],
    answer: "A",
    knowledge: ["同绳张力", "几何约束", "共点力平衡", "整体法"],
    animation: animation("spring_test_06_nail_basket", true, {
      heightDiff: { label: "钉高差", value: 1.2, min: 0, max: 2.5, step: 0.1, unit: "m" },
      span: { label: "水平间距", value: 3, min: 2, max: 5, step: 0.1, unit: "m" }
    }, 6, "并列显示调节前后绳路：上段缩短会使两条悬挂支路变长并更接近竖直。"),
    steps: [
      step("比较上方绳段", "A、B 水平距离不变。调整前 \\(AB=\\sqrt{d^2+h^2}\\)，调整后 \\(AC=d\\)，故上方绳段缩短。"),
      step("利用绳长不变", "原绳总长不变，所以上方绳段缩短的长度转移到两条悬挂支路，使 V 形支路总长增加。"),
      step("比较支路角度和张力", "两支路张力相等，吊篮平衡要求它们与竖直方向夹角相同。水平跨度固定而支路变长，夹角 \\(\\alpha\\) 变小。由 \\(2T\\cos\\alpha=Mg\\)，张力减小。"),
      step("检查钉子总受力", "把整根轻绳作为研究对象，吊篮对绳的合力与两钉对绳的合力始终平衡，因此两个钉子所受绳的总作用力矢量大小不变。故选 A。")
    ],
    optionThinking: "先用总绳长判断悬挂支路的长度和角度，再由吊篮竖直平衡比较张力；总作用力要对整根绳使用整体法。",
    optionFormulas: R`\[AB=\sqrt{d^2+h^2}\gt d=AC,\qquad 2T\cos\alpha=Mg\]`,
    optionJudgments: {
      A: "调节后 \\(\\alpha\\) 变小、\\(\\cos\\alpha\\) 变大，故 \\(T\\) 变小，A 正确。",
      B: "张力实际减小，B 错误。",
      C: "两钉所受绳的总作用力矢量仍与吊篮重力等大，C 错误。",
      D: "总作用力矢量大小不变，并不增大，D 错误。"
    },
    practice: {
      title: "进阶近似题：可移动支点与绳长约束",
      question: "两固定支点水平间距为 \\(d\\)、初始高差为 \\(h\\)，轻绳依次绕过两点且两端共同悬挂质量为 \\(M\\) 的重物。设重物两侧绳与竖直夹角均为 \\(\\alpha\\)，总绳长为 \\(L\\)。写出 \\(\\alpha\\) 与 \\(d,h,L\\) 的关系；求张力，并讨论支点高差连续减小时张力的单调性。",
      answer: "**绳长约束**\n\n上方绳段为 \\(\\sqrt{d^2+h^2}\\)，两悬挂支路总长 \\(S=L-\\sqrt{d^2+h^2}\\)。由水平投影得 \\(S\\sin\\alpha=d\\)，故 \\(\\sin\\alpha=d/S\\)。\n\n**张力**\n\n\\(T=Mg/(2\\cos\\alpha)\\)。\n\n**单调性**\n\n当 \\(h\\) 减小时，上方绳段缩短，\\(S\\) 增大，\\(\\sin\\alpha\\) 减小，因此 \\(T\\) 单调减小。",
      thinking: "**解题思路**\n\n把复杂绳路拆成‘支点间绳段’和‘两条悬挂支路’，先守恒总绳长，再用水平投影连接角度。"
    }
  }),
  choice({
    number: 7,
    id: "spring_test_single_07_incline_lift",
    model: "定滑轮缓慢提升",
    question: "用固定在斜面上方的定滑轮和轻绳缓慢提升斜面上的重物。斜面体上表面光滑，滑轮位置如图示，重物沿斜面上移时绳与斜面的夹角逐渐增大。下列说法正确的是（　　）。",
    options: [
      "A. 重物受到的支持力不变",
      "B. 重物受到的支持力减小",
      "C. 斜面受到地面的支持力不变",
      "D. 斜面受到地面的支持力先增大后减小"
    ],
    answer: "B",
    knowledge: ["动态平衡", "光滑斜面", "力的分解", "整体与隔离"],
    animation: animation("spring_test_07_incline_lift", true, {
      angle: { label: "斜面角", value: 25, min: 15, max: 40, step: 1, unit: "deg" },
      pulleyHeight: { label: "滑轮高度", value: 2.5, min: 1.5, max: 4, step: 0.1, unit: "m" }
    }, 6, "重物沿斜面接近固定滑轮，绳方向改变，支持力随绳法向分量增大而减小。"),
    steps: [
      step("确定变化角", "设斜面角为 \\(\\theta\\)，绳与斜面的夹角为 \\(\\beta\\)。由图示固定滑轮位置，重物上移时 \\(\\beta\\) 增大。"),
      step("列切向平衡", "缓慢运动近似平衡，沿斜面有 \\(T\\cos\\beta=mg\\sin\\theta\\)，所以 \\(T=mg\\sin\\theta/\\cos\\beta\\)。"),
      step("列法向平衡", "绳在离开斜面的方向有分量 \\(T\\sin\\beta\\)，故 \\(N+T\\sin\\beta=mg\\cos\\theta\\)，即 \\(N=mg\\cos\\theta-mg\\sin\\theta\\tan\\beta\\)。"),
      step("判断单调性", "随 \\(\\beta\\) 增大，\\(\\tan\\beta\\) 增大，支持力 \\(N\\) 减小，因此 B 正确。")
    ],
    optionThinking: "把绳的方向变化明确为变量 \\(\\beta\\)，分别沿斜面和垂直斜面列准静态平衡方程。",
    optionFormulas: R`\[T\cos\beta=mg\sin\theta,\qquad N=mg\cos\theta-T\sin\beta\]`,
    optionJudgments: {
      A: "绳的法向分量随位置改变，支持力不会保持不变，A 错误。",
      B: "\\(N=mg\\cos\\theta-mg\\sin\\theta\\tan\\beta\\) 随 \\(\\beta\\) 增大而减小，B 正确。",
      C: "斜面受重物压力变化，地面支持力也随之改变，C 错误。",
      D: "在题图所示连续接近滑轮的区间内，法向压力单调减小，没有先增后减，D 错误。"
    },
    practice: {
      title: "进阶近似题：由固定滑轮坐标求支持力",
      question: "斜面倾角为 \\(\\theta\\)，重物沿斜面坐标为 \\(s\\)。固定滑轮相对斜面起点的水平、竖直坐标分别为 \\(X,Y\\)。重物由绳缓慢上拉，斜面光滑。写出绳角 \\(\\beta(s)\\)、张力 \\(T(s)\\) 和支持力 \\(N(s)\\)，并给出失去接触的临界方程。",
      answer: "**几何关系**\n\n重物坐标为 \\((s\\cos\\theta,s\\sin\\theta)\\)，故 \\(\\tan(\\theta+\\beta)=(Y-s\\sin\\theta)/(X-s\\cos\\theta)\\)。\n\n**动态平衡**\n\n\\(T=mg\\sin\\theta/\\cos\\beta\\)，\\(N=mg\\cos\\theta-mg\\sin\\theta\\tan\\beta\\)。\n\n**接触临界**\n\n令 \\(N=0\\)，得 \\(\\tan\\beta=\\cot\\theta\\)，再与几何关系联立即可求临界位置。",
      thinking: "**解题思路**\n\n先由坐标几何确定绳方向，再列力学方程；接触是否存在最后用 \\(N\\ge0\\) 检查。"
    }
  }),
  choice({
    number: 8,
    id: "spring_test_single_08_handcart",
    model: "倾斜小推车双支持力",
    question: "搬运小推车的中间支架与底板垂直。正方体货物放在底板上，初始底板水平，随后缓慢下压把手，直到底板与水平面的夹角为 \\(60^\\circ\\)。小推车位置不变，不计货物与支架、底板间摩擦。下列说法正确的是（　　）。",
    options: [
      "A. 小推车对货物的作用力方向先水平向左、后竖直向上",
      "B. 小推车对货物的作用力大小先增大后减小",
      "C. 支架对货物的支持力一直增大",
      "D. 底板对货物的支持力一直增大"
    ],
    answer: "C",
    knowledge: ["双接触面支持力", "共点力平衡", "力的正交分解"],
    animation: animation("spring_test_08_handcart", true, {
      maxAngle: { label: "最大倾角", value: 60, min: 20, max: 75, step: 1, unit: "deg" },
      mass: { label: "货物质量", value: 10, min: 2, max: 30, step: 1, unit: "kg" }
    }, 6, "推车缓慢倾斜，底板与支架两支持力按 \\(mg\\cos\\alpha\\)、\\(mg\\sin\\alpha\\) 变化。"),
    steps: [
      step("确定支持力方向", "底板支持力垂直底板，支架支持力垂直支架。因支架与底板垂直，两支持力也互相垂直。"),
      step("建立平衡方程", "设底板倾角为 \\(\\alpha\\)。沿底板和垂直底板分解重力，得 \\(N_\\text{支}=mg\\sin\\alpha\\)，\\(N_\\text{底}=mg\\cos\\alpha\\)。"),
      step("判断变化", "当 \\(\\alpha\\) 从 \\(0\\) 增至 \\(60^\\circ\\)，支架支持力增大，底板支持力减小。"),
      step("判断总作用力", "两支持力的矢量和始终与重力等大反向，方向竖直向上、大小恒为 \\(mg\\)。故选 C。")
    ],
    optionThinking: "支持力必须垂直接触面。把重力分解到随推车转动的两条正交方向，就能直接得到两个支持力。",
    optionFormulas: R`\[N_\text{支}=mg\sin\alpha,\qquad N_\text{底}=mg\cos\alpha,\qquad \vec N_\text{支}+\vec N_\text{底}=-m\vec g\]`,
    optionJudgments: {
      A: "推车对货物的总作用力始终竖直向上，A 错误。",
      B: "总作用力大小始终为 \\(mg\\)，B 错误。",
      C: "\\(\\sin\\alpha\\) 在该区间单调增大，C 正确。",
      D: "\\(\\cos\\alpha\\) 单调减小，底板支持力减小，D 错误。"
    },
    practice: {
      title: "进阶近似题：双光滑接触的失效顺序",
      question: "质量为 \\(m\\) 的方块同时接触互相垂直的光滑底板与支架，底板倾角 \\(\\alpha\\) 从 \\(0\\) 缓慢增大到 \\(100^\\circ\\)。在假定两接触均存在时求两支持力，并用支持力非负条件判断哪一接触先失效及其临界角。",
      answer: "**假定接触存在**\n\n\\(N_\\text{支}=mg\\sin\\alpha\\)，\\(N_\\text{底}=mg\\cos\\alpha\\)。\n\n**非负条件**\n\n当 \\(0\\le\\alpha\\le90^\\circ\\) 时两力均非负；到 \\(\\alpha=90^\\circ\\) 时 \\(N_\\text{底}=0\\)。继续增大角度会要求底板提供拉力，不可能，因此方块先失去底板接触。",
      thinking: "**解题思路**\n\n先按约束存在列方程，再用法向力必须非负检验。接触临界就是对应支持力等于零。"
    }
  }),
];

problems.sort(function (left, right) {
  return Number(left.originalNumber.replace(/\D/g, "")) - Number(right.originalNumber.replace(/\D/g, ""));
});

var generatedEntries = problems.map(function (problem) {
  var fileName = problem.id + ".json";
  fs.writeFileSync(path.join(problemDir, fileName), JSON.stringify(problem, null, 2) + "\n", "utf8");
  return { id: problem.id, file: fileName };
});

var indexPath = path.join(problemDir, "index.json");
var index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
var generatedIds = {};
generatedEntries.forEach(function (entry) {
  generatedIds[entry.id] = true;
});
index.problems = index.problems.filter(function (entry) {
  return !generatedIds[entry.id];
});
var insertAt = index.problems.findIndex(function (entry) {
  return entry.id === "mechanics_three_stacked_bodies";
});
if (insertAt < 0) insertAt = index.problems.length;
index.problems.splice.apply(index.problems, [insertAt, 0].concat(generatedEntries));
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n", "utf8");

console.log("Generated " + problems.length + " required-one test problem files.");
