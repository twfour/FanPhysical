var summerExamQuestions = [
  {
    id: "single-01",
    type: "single",
    chapter: "曲线运动",
    source: "curve_training_02_nonuniform_river",
    prompt: String.raw`河宽为 \(d\)，船头始终垂直河岸，静水船速为 \(v\)。实测轨迹满足

\[x(y)=\frac{u_0}{v}y+\frac{u_1}{v}\left[\frac y2-\frac{d}{4\pi}\sin\left(\frac{2\pi y}{d}\right)\right].\]

水流速度的最大值为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(u_0\)` },
      { key: "B", text: String.raw`\(u_0+\dfrac{u_1}{2}\)` },
      { key: "C", text: String.raw`\(u_0+u_1\)` },
      { key: "D", text: String.raw`\(u_0+2u_1\)` }
    ],
    answer: ["C"],
    explanation: String.raw`由 \(\mathrm dx/\mathrm dy=u(y)/v\)，求导得 \(u(y)=u_0+u_1\sin^2(\pi y/d)\)。当 \(y=d/2\) 时水速最大，故 \(u_{\max}=u_0+u_1\)。`
  },
  {
    id: "single-02",
    type: "single",
    chapter: "平抛运动",
    source: "projectile_a_06_bottle_holes",
    prompt: String.raw`高为 \(H\) 的水箱侧壁有两个不同高度的小孔，两股水流恰好落在同一点。若一个孔在液面下深度为 \(H/4\)，则另一孔在液面下的深度为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(\dfrac H4\)` },
      { key: "B", text: String.raw`\(\dfrac H3\)` },
      { key: "C", text: String.raw`\(\dfrac{2H}{3}\)` },
      { key: "D", text: String.raw`\(\dfrac{3H}{4}\)` }
    ],
    answer: ["D"],
    explanation: String.raw`孔深为 \(h\) 时射程满足 \(L^2\propto h(H-h)\)。两个不同孔同射程时有 \(h_1+h_2=H\)，所以 \(h_2=3H/4\)。`
  },
  {
    id: "single-03",
    type: "single",
    chapter: "圆周运动",
    source: "circular_motion_example6",
    prompt: String.raw`半径为 \(r\) 的主动轮以角速度 \(\omega_0\) 转动，通过不打滑的皮带带动半径为 \(\lambda r\) 的从动轮。两轮边缘点的向心加速度之比 \(a_1/a_0\) 为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(\dfrac1\lambda\)` },
      { key: "B", text: String.raw`\(\lambda\)` },
      { key: "C", text: String.raw`\(\dfrac1{\lambda^2}\)` },
      { key: "D", text: String.raw`\(\lambda^2\)` }
    ],
    answer: ["A"],
    explanation: String.raw`无滑动给出两轮边缘线速度相等。由 \(a_c=v^2/r\)，从动轮半径是主动轮的 \(\lambda\) 倍，故 \(a_1/a_0=1/\lambda\)。`
  },
  {
    id: "single-04",
    type: "single",
    chapter: "圆周运动日常",
    source: "circular_daily_ex3_hilly_road",
    prompt: String.raw`质量为 \(m\) 的汽车以速度 \(v\) 通过半径为 \(r\) 的圆弧桥最低点。路面对汽车的支持力为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(mg\)` },
      { key: "B", text: String.raw`\(m\dfrac{v^2}{r}\)` },
      { key: "C", text: String.raw`\(mg-m\dfrac{v^2}{r}\)` },
      { key: "D", text: String.raw`\(mg+m\dfrac{v^2}{r}\)` }
    ],
    answer: ["D"],
    explanation: String.raw`最低点的向心方向竖直向上，径向方程为 \(N-mg=mv^2/r\)，所以 \(N=mg+mv^2/r\)。`
  },
  {
    id: "single-05",
    type: "single",
    chapter: "万有引力与宇宙航行",
    source: "gravitation_course_07_planet_breakup",
    prompt: String.raw`某星球半径为 \(R\)，表面重力加速度为 \(g\)。为了使赤道处物质不因自转而脱离，星球自转周期的最小值为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(\pi\sqrt{R/g}\)` },
      { key: "B", text: String.raw`\(2\pi\sqrt{R/g}\)` },
      { key: "C", text: String.raw`\(2\pi\sqrt{g/R}\)` },
      { key: "D", text: String.raw`\(\sqrt{2\pi R/g}\)` }
    ],
    answer: ["B"],
    explanation: String.raw`赤道解体临界满足 \(\omega^2R=g\)，所以 \(\omega_{\max}=\sqrt{g/R}\)，进而 \(T_{\min}=2\pi/\omega_{\max}=2\pi\sqrt{R/g}\)。`
  },
  {
    id: "single-06",
    type: "single",
    chapter: "行星运动与变轨等问题",
    source: "lesson9_course_02_exoplanet_mass",
    prompt: String.raw`甲行星绕其中心恒星做圆周运动，轨道半径是地球轨道半径的 \(1/4\)，周期是地球公转周期的 \(1/10\)。该恒星与太阳的质量比为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(\dfrac5{16}\)` },
      { key: "B", text: String.raw`\(\dfrac{16}{25}\)` },
      { key: "C", text: String.raw`\(\dfrac{25}{16}\)` },
      { key: "D", text: String.raw`\(\dfrac{25}{4}\)` }
    ],
    answer: ["C"],
    explanation: String.raw`由开普勒第三定律的动力学形式 \(M\propto r^3/T^2\)，质量比为 \((1/4)^3/(1/10)^2=25/16\)。`
  },
  {
    id: "single-07",
    type: "single",
    chapter: "功和功率",
    source: "lesson10_course_01_crane_work",
    prompt: String.raw`质量为 \(800\,\mathrm{kg}\) 的货物由静止开始，以 \(1.5\,\mathrm{m/s^2}\) 的加速度竖直向上运动 \(2\,\mathrm s\)。取 \(g=10\,\mathrm{m/s^2}\)，拉力做功为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(2.40\times10^4\,\mathrm J\)` },
      { key: "B", text: String.raw`\(2.52\times10^4\,\mathrm J\)` },
      { key: "C", text: String.raw`\(2.76\times10^4\,\mathrm J\)` },
      { key: "D", text: String.raw`\(3.12\times10^4\,\mathrm J\)` }
    ],
    answer: ["C"],
    explanation: String.raw`拉力 \(T=m(g+a)=9200\,\mathrm N\)，位移 \(h=at^2/2=3\,\mathrm m\)，故 \(W=Th=2.76\times10^4\,\mathrm J\)。`
  },
  {
    id: "single-08",
    type: "single",
    chapter: "动能定理",
    source: "lesson11_course_05_incline_loop",
    prompt: String.raw`小球进入半径为 \(R=0.9\,\mathrm m\) 的竖直光滑圆轨道。取 \(g=10\,\mathrm{m/s^2}\)，小球恰能不断轨通过最高点时，最低点的最小速度为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(3\,\mathrm{m/s}\)` },
      { key: "B", text: String.raw`\(3\sqrt5\,\mathrm{m/s}\)` },
      { key: "C", text: String.raw`\(3\sqrt6\,\mathrm{m/s}\)` },
      { key: "D", text: String.raw`\(9\,\mathrm{m/s}\)` }
    ],
    answer: ["B"],
    explanation: String.raw`最高点临界条件为 \(v_t^2=gR\)。由最低点到最高点应用能量关系，得 \(v_b^2=v_t^2+4gR=5gR=45\)，故 \(v_b=3\sqrt5\,\mathrm{m/s}\)。`
  },
  {
    id: "single-09",
    type: "single",
    chapter: "机械能守恒定律",
    source: "lesson12_course_05_arc_max_height",
    prompt: String.raw`小球以 \(v_0^2=4gR\) 从光滑圆弧轨道最低点进入，在圆心角为 \(\varphi\) 的末端离轨。若离轨后最高点相对最低点的高度恰为 \(2R\)，则 \(\varphi\) 为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(30^\circ\)` },
      { key: "B", text: String.raw`\(45^\circ\)` },
      { key: "C", text: String.raw`\(60^\circ\)` },
      { key: "D", text: String.raw`\(90^\circ\)` }
    ],
    answer: ["D"],
    explanation: String.raw`令 \(c=\cos\varphi\)，由圆弧段能量关系和离轨后的斜抛上升量可得 \(H/R=2-c^2-c^3\)。令 \(H=2R\)，在允许范围内只有 \(c=0\)，故 \(\varphi=90^\circ\)。`
  },
  {
    id: "single-10",
    type: "single",
    chapter: "功能关系",
    source: "lesson13_course_03_mechanical_energy_graph",
    prompt: String.raw`物体竖直上升时，机械能从 \((0,0)\) 线性增至 \((3\,\mathrm m,120\,\mathrm J)\)，撤去拉力后又线性减至最高点 \((6\,\mathrm m,90\,\mathrm J)\)。取 \(g=10\,\mathrm{m/s^2}\)，物体质量为（ ）。`,
    options: [
      { key: "A", text: String.raw`\(1.0\,\mathrm{kg}\)` },
      { key: "B", text: String.raw`\(1.5\,\mathrm{kg}\)` },
      { key: "C", text: String.raw`\(2.0\,\mathrm{kg}\)` },
      { key: "D", text: String.raw`\(2.5\,\mathrm{kg}\)` }
    ],
    answer: ["B"],
    explanation: String.raw`最高点动能为零，机械能等于重力势能，因此 \(90=mg\times6\)，解得 \(m=1.5\,\mathrm{kg}\)。`
  },
  {
    id: "multiple-01",
    type: "multiple",
    chapter: "曲线运动",
    source: "curve_training_01_concepts",
    prompt: String.raw`赛车沿半径逐渐减小的平面弯道运动，速率同时均匀增大。关于赛车的加速度，下列说法正确的是（ ）。`,
    options: [
      { key: "A", text: String.raw`切向加速度 \(a_t\gt0\)` },
      { key: "B", text: String.raw`法向加速度 \(a_n=v^2/R\gt0\)，且一般随运动增大` },
      { key: "C", text: String.raw`合加速度方向保持不变` },
      { key: "D", text: String.raw`该运动不是加速度矢量恒定的匀变速运动` }
    ],
    answer: ["A", "B", "D"],
    explanation: String.raw`速率增大给出 \(a_t\gt0\)；轨迹弯曲且 \(v\) 增大、\(R\) 减小，使 \(a_n=v^2/R\) 增大。切线、法线方向和两分量之比都在变化，所以合加速度方向不恒定。`
  },
  {
    id: "multiple-02",
    type: "multiple",
    chapter: "平抛运动",
    source: "projectile_lesson_09_plane_comparison",
    prompt: String.raw`高度为 \(H\) 的光滑斜面倾角为 \(\theta\)。质点 \(A\) 做平抛，质点 \(B\) 以相同水平初速度沿斜面运动。若测得二者水平位移满足 \(x_B=2x_A\)，则（ ）。`,
    options: [
      { key: "A", text: String.raw`\(\theta=30^\circ\)` },
      { key: "B", text: String.raw`\(t_B=2t_A\)` },
      { key: "C", text: String.raw`二者落地速度大小相等` },
      { key: "D", text: String.raw`二者落地速度方向相同` }
    ],
    answer: ["A", "B", "C"],
    explanation: String.raw`水平位移比等于时间比，而 \(t_B/t_A=1/\sin\theta=2\)，故 \(\theta=30^\circ\)。两物体初速度大小相同、下降高度相同且无耗散，末速度大小相等；运动约束不同，末速度方向不同。`
  },
  {
    id: "multiple-03",
    type: "multiple",
    chapter: "圆周运动",
    source: "circular_motion_friction",
    prompt: String.raw`小球用只能拉、不能推的轻绳约束，在竖直平面内做半径为 \(r\) 的圆周运动。全过程只有重力做功。关于恰能通过最高点的临界状态，下列说法正确的是（ ）。`,
    options: [
      { key: "A", text: String.raw`最高点最小速度为 \(\sqrt{gr}\)` },
      { key: "B", text: String.raw`最低点最小速度为 \(\sqrt{5gr}\)` },
      { key: "C", text: String.raw`最低点绳张力为 \(5mg\)` },
      { key: "D", text: String.raw`半径改为 \(\lambda r\) 后，两临界速度均乘 \(\sqrt\lambda\)，最低点临界张力仍为 \(6mg\)` }
    ],
    answer: ["A", "B", "D"],
    explanation: String.raw`最高点临界张力为零，故 \(v_t^2=gr\)。能量关系给出 \(v_b^2=5gr\)；最低点径向方程 \(T_b-mg=mv_b^2/r\)，所以 \(T_b=6mg\)。`
  },
  {
    id: "multiple-04",
    type: "multiple",
    chapter: "圆周运动日常",
    source: "circular_daily_ex10_turntable_sensor",
    prompt: String.raw`小球以不变的速率 \(v\) 做圆周运动，约束切换后轨道半径由 \(r\) 变为 \(\lambda r\)。下列关系正确的是（ ）。`,
    options: [
      { key: "A", text: String.raw`\(F_2/F_1=1/\lambda\)` },
      { key: "B", text: String.raw`\(T_2/T_1=\lambda\)` },
      { key: "C", text: String.raw`切换前后角速度相同` },
      { key: "D", text: String.raw`向心力突变必然导致速率瞬间突变` }
    ],
    answer: ["A", "B"],
    explanation: String.raw`速率不变时 \(F_c=mv^2/r\)、\(T=2\pi r/v\)，所以力与半径成反比、周期与半径成正比，角速度变为原来的 \(1/\lambda\)。径向冲量可改变速度方向而不必改变速率。`
  },
  {
    id: "multiple-05",
    type: "multiple",
    chapter: "万有引力与宇宙航行",
    source: "gravitation_course_01_perihelion_speed",
    prompt: String.raw`天体沿椭圆轨道运动，近日点、远日点距离分别为 \(r_p,r_a\)。若保持半长轴不变而增大轨道偏心率，则（ ）。`,
    options: [
      { key: "A", text: String.raw`\(v_p/v_a=r_a/r_p\)` },
      { key: "B", text: String.raw`\(g_p/g_a=(r_a/r_p)^2\)` },
      { key: "C", text: String.raw`公转周期增大` },
      { key: "D", text: String.raw`近日点与远日点的速度比增大` }
    ],
    answer: ["A", "B", "D"],
    explanation: String.raw`近、远点角动量守恒给出 \(r_pv_p=r_av_a\)，引力加速度满足 \(g\propto1/r^2\)。半长轴不变时周期不变；偏心率增大使 \(r_a/r_p\) 增大，速度比随之增大。`
  },
  {
    id: "multiple-06",
    type: "multiple",
    chapter: "行星运动与变轨等问题",
    source: "lesson9_course_08_sync_transfer",
    prompt: String.raw`卫星采用霍曼转移，从半径 \(r_1\) 的圆轨道升至半径 \(r_2\) 的圆轨道，其中 \(r_2\gt r_1\)。下列说法正确的是（ ）。`,
    options: [
      { key: "A", text: String.raw`转移椭圆半长轴为 \(a_t=(r_1+r_2)/2\)` },
      { key: "B", text: String.raw`转移飞行时间为 \(\pi\sqrt{a_t^3/(GM)}\)` },
      { key: "C", text: String.raw`转移轨道近地点速度小于半径 \(r_1\) 圆轨道速度` },
      { key: "D", text: String.raw`转移轨道远地点速度小于半径 \(r_2\) 圆轨道速度，因此第二次点火仍需沿速度方向加速` }
    ],
    answer: ["A", "B", "D"],
    explanation: String.raw`霍曼轨道的半长轴为两圆轨道半径的平均值，飞行过程是转移椭圆的半个周期。近地点第一次加速使速度高于原圆轨道速度；到远地点时速度低于目标圆轨道速度，需要再次顺向加速圆化。`
  },
  {
    id: "multiple-07",
    type: "multiple",
    chapter: "功和功率",
    source: "lesson10_course_10_rated_power_car",
    prompt: String.raw`质量为 \(m\) 的车辆在恒定阻力 \(f\) 下以恒功率 \(P\) 加速。关于恒功率阶段，下列说法正确的是（ ）。`,
    options: [
      { key: "A", text: String.raw`牵引力 \(F=P/v\)` },
      { key: "B", text: String.raw`加速度 \(a(v)=(P/v-f)/m\)` },
      { key: "C", text: String.raw`极限速度 \(v_m=P/f\)` },
      { key: "D", text: String.raw`车辆可在有限时间内严格达到极限速度` }
    ],
    answer: ["A", "B", "C"],
    explanation: String.raw`由 \(P=Fv\) 得牵引力随速度增大而减小。牛顿第二定律给出 \(a=(P/v-f)/m\)，当 \(v\to P/f\) 时加速度趋于零，因此极限速度只能渐近达到。`
  },
  {
    id: "multiple-08",
    type: "multiple",
    chapter: "动能定理",
    source: "lesson11_course_09_conveyor_return",
    prompt: String.raw`质量为 \(1\,\mathrm{kg}\) 的滑块以 \(3\,\mathrm{m/s}\) 向左滑上向右以 \(1\,\mathrm{m/s}\) 运动的传送带，滑动摩擦力为 \(2\,\mathrm N\)。取向右为正，直到滑块与传送带同速，下列结论正确的是（ ）。`,
    options: [
      { key: "A", text: String.raw`滑块加速度为 \(+2\,\mathrm{m/s^2}\)` },
      { key: "B", text: String.raw`该过程持续 \(2\,\mathrm s\)` },
      { key: "C", text: String.raw`接触面的相对滑动路程为 \(4\,\mathrm m\)` },
      { key: "D", text: String.raw`该过程产生热量 \(4\,\mathrm J\)` }
    ],
    answer: ["A", "B", "C"],
    explanation: String.raw`滑块速度由 \(-3\) 变到 \(+1\)，加速度为 \(+2\)，故时间为 \(2\,\mathrm s\)。相对速度由 \(-4\) 匀变到零，相对路程为 \(4\,\mathrm m\)，热量 \(Q=f\Delta s_{rel}=8\,\mathrm J\)。`
  },
  {
    id: "multiple-09",
    type: "multiple",
    chapter: "机械能守恒定律",
    source: "lesson12_course_06_ball_spring_platform",
    prompt: String.raw`质量为 \(m\) 的小球从未压缩轻弹簧上端正上方 \(H\) 处由静止释放，落到平台后压缩劲度系数为 \(k\) 的弹簧。以首次接触时压缩量 \(x=0\)。下列结论正确的是（ ）。`,
    options: [
      { key: "A", text: String.raw`\(mg(H+x)=\dfrac12mv^2+\dfrac12kx^2\)` },
      { key: "B", text: String.raw`速度最大时 \(x=mg/k\)` },
      { key: "C", text: String.raw`最大压缩量也等于 \(mg/k\)` },
      { key: "D", text: String.raw`\(x_{\max}=\dfrac{mg+\sqrt{m^2g^2+2kmgH}}{k}\)` }
    ],
    answer: ["A", "B", "D"],
    explanation: String.raw`全过程能量守恒给出 A。速度最大时合力为零，故 \(kx=mg\)。最大压缩处速度为零，代入能量式并取正根得到 D；它位于速度最大点之后。`
  },
  {
    id: "multiple-10",
    type: "multiple",
    chapter: "功能关系",
    source: "lesson13_course_01_conveyor_energy",
    prompt: String.raw`水平传送带以 \(6\,\mathrm{m/s}\) 匀速运动，将质量 \(1.5\,\mathrm{kg}\) 的木块由静止轻放在带上。动摩擦因数为 \(0.30\)，取 \(g=10\,\mathrm{m/s^2}\)。木块达到共同速度前，下列结论正确的是（ ）。`,
    options: [
      { key: "A", text: String.raw`相对滑动路程为 \(6\,\mathrm m\)` },
      { key: "B", text: String.raw`摩擦生热为 \(27\,\mathrm J\)` },
      { key: "C", text: String.raw`电动机额外做功为 \(27\,\mathrm J\)` },
      { key: "D", text: String.raw`电动机额外做功不等于木块动能增加量，因为还要补偿摩擦产生的内能` }
    ],
    answer: ["A", "B", "D"],
    explanation: String.raw`加速度为 \(\mu g=3\,\mathrm{m/s^2}\)，达到带速需 \(2\,\mathrm s\)。木块位移 \(6\,\mathrm m\)，带面位移 \(12\,\mathrm m\)，相对路程为 \(6\,\mathrm m\)。故 \(Q=27\,\mathrm J\)，电动机额外做功为 \(54\,\mathrm J\)。`
  }
];

var summerExamRendered = false;
var summerExamMathRendered = false;
var summerExamHasResult = false;

function summerExamQuestionsByType(type) {
  return summerExamQuestions.filter(function (question) {
    return question.type === type;
  });
}

function createSummerExamOption(question, option) {
  var label = document.createElement("label");
  label.className = "summer-exam-option";
  label.dataset.option = option.key;

  var input = document.createElement("input");
  input.type = question.type === "single" ? "radio" : "checkbox";
  input.name = "summer-exam-" + question.id;
  input.value = option.key;
  input.id = "summer-exam-" + question.id + "-" + option.key;
  input.onchange = function () {
    markSummerExamChanged(label.closest(".summer-exam-question"));
  };

  var key = document.createElement("strong");
  key.className = "summer-exam-option-key";
  key.innerText = option.key + ".";

  var text = document.createElement("span");
  text.className = "summer-exam-option-text";
  text.innerHTML = option.text;

  label.appendChild(input);
  label.appendChild(key);
  label.appendChild(text);
  return label;
}

function createSummerExamQuestion(question, number) {
  var card = document.createElement("article");
  card.className = "summer-exam-question";
  card.dataset.questionId = question.id;

  var heading = document.createElement("div");
  heading.className = "summer-exam-question-heading";

  var numberLabel = document.createElement("span");
  numberLabel.className = "summer-exam-question-number";
  numberLabel.innerText = "第 " + number + " 题";

  var chapter = document.createElement("span");
  chapter.className = "summer-exam-chapter";
  chapter.innerText = question.chapter;

  heading.appendChild(numberLabel);
  heading.appendChild(chapter);

  var prompt = document.createElement("div");
  prompt.className = "summer-exam-prompt";
  prompt.innerHTML = question.prompt;

  var options = document.createElement("div");
  options.className = "summer-exam-options";
  question.options.forEach(function (option) {
    options.appendChild(createSummerExamOption(question, option));
  });

  var feedback = document.createElement("div");
  feedback.className = "summer-exam-feedback";
  feedback.hidden = true;

  var verdict = document.createElement("p");
  verdict.className = "summer-exam-verdict";

  var answer = document.createElement("p");
  answer.className = "summer-exam-answer";
  answer.innerText = "正确答案：" + question.answer.join("、");

  var explanation = document.createElement("div");
  explanation.className = "summer-exam-explanation";
  explanation.innerHTML = "<strong>解析：</strong>" + question.explanation;

  feedback.appendChild(verdict);
  feedback.appendChild(answer);
  feedback.appendChild(explanation);

  card.appendChild(heading);
  card.appendChild(prompt);
  card.appendChild(options);
  card.appendChild(feedback);
  return card;
}

function renderSummerExamSection(type, containerId, startNumber) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  summerExamQuestionsByType(type).forEach(function (question, index) {
    container.appendChild(createSummerExamQuestion(question, startNumber + index));
  });
}

function renderSummerExam() {
  if (summerExamRendered) return;
  renderSummerExamSection("single", "summerExamSingleQuestions", 1);
  renderSummerExamSection("multiple", "summerExamMultipleQuestions", 11);
  summerExamRendered = true;
}

function renderSummerExamMath() {
  renderSummerExam();
  if (summerExamMathRendered) return;
  var panel = document.getElementById("summerExamPanel");
  if (!panel || !window.MathJax || !window.MathJax.typesetPromise) return;
  window.MathJax.typesetPromise([panel]).then(function () {
    summerExamMathRendered = true;
  }).catch(function (error) {
    console.warn("Summer exam MathJax render failed", error);
  });
}

function selectedSummerExamAnswers(question) {
  return Array.prototype.slice.call(document.querySelectorAll('input[name="summer-exam-' + question.id + '"]:checked')).map(function (input) {
    return input.value;
  }).sort();
}

function summerExamAnswersMatch(selected, answer) {
  var expected = answer.slice().sort();
  if (selected.length !== expected.length) return false;
  for (var index = 0; index < expected.length; index += 1) {
    if (selected[index] !== expected[index]) return false;
  }
  return true;
}

function clearSummerExamOptionMarks(card) {
  card.querySelectorAll(".summer-exam-option").forEach(function (option) {
    option.classList.remove("is-correct-answer", "is-wrong-selection");
  });
}

function markSummerExamChanged(card) {
  if (!card || !summerExamHasResult) return;
  card.classList.remove("is-correct", "is-incorrect", "is-unanswered");
  clearSummerExamOptionMarks(card);
  var feedback = card.querySelector(".summer-exam-feedback");
  if (feedback) feedback.hidden = true;
  var result = document.getElementById("summerExamResult");
  var message = document.getElementById("summerExamResultMessage");
  if (result) result.classList.add("is-stale");
  if (message) message.innerText = "答案已修改，请重新提交批卷。";
}

function markSummerExamQuestion(question, selected, correct) {
  var card = document.querySelector('[data-question-id="' + question.id + '"]');
  if (!card) return;
  card.classList.remove("is-correct", "is-incorrect", "is-unanswered");
  card.classList.add(selected.length ? (correct ? "is-correct" : "is-incorrect") : "is-unanswered");
  clearSummerExamOptionMarks(card);

  card.querySelectorAll(".summer-exam-option").forEach(function (option) {
    var key = option.dataset.option;
    if (question.answer.indexOf(key) >= 0) option.classList.add("is-correct-answer");
    if (selected.indexOf(key) >= 0 && question.answer.indexOf(key) < 0) option.classList.add("is-wrong-selection");
  });

  var feedback = card.querySelector(".summer-exam-feedback");
  var verdict = card.querySelector(".summer-exam-verdict");
  if (feedback) feedback.hidden = false;
  if (verdict) {
    verdict.innerText = !selected.length ? "未作答，本题 0 分" : (correct ? "回答正确，本题 5 分" : "回答错误，本题 0 分");
  }
}

function summerExamResultMessage(score, unanswered) {
  if (unanswered) return "仍有 " + unanswered + " 道题未作答，可修改后再次提交。";
  if (score === 100) return "满分，十个章节的核心模型全部通过。";
  if (score >= 85) return "整体掌握扎实，重点复查标红题目的条件边界。";
  if (score >= 70) return "基础模型已建立，建议按错题章节回到对应近似题复习。";
  return "建议先根据逐题解析整理错因，再回到对应模型页重新推导。";
}

function gradeSummerExam(event) {
  if (event) event.preventDefault();
  var singleScore = 0;
  var multipleScore = 0;
  var answered = 0;

  summerExamQuestions.forEach(function (question) {
    var selected = selectedSummerExamAnswers(question);
    var correct = summerExamAnswersMatch(selected, question.answer);
    if (selected.length) answered += 1;
    if (correct) {
      if (question.type === "single") singleScore += 5;
      else multipleScore += 5;
    }
    markSummerExamQuestion(question, selected, correct);
  });

  var total = singleScore + multipleScore;
  var unanswered = summerExamQuestions.length - answered;
  var result = document.getElementById("summerExamResult");
  result.hidden = false;
  result.classList.remove("is-stale");
  document.getElementById("summerExamTotalScore").innerText = total;
  document.getElementById("summerExamSingleScore").innerText = singleScore + " / 50";
  document.getElementById("summerExamMultipleScore").innerText = multipleScore + " / 50";
  document.getElementById("summerExamAnsweredCount").innerText = answered + " / 20";
  document.getElementById("summerExamResultMessage").innerText = summerExamResultMessage(total, unanswered);
  summerExamHasResult = true;
  renderSummerExamMath();
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetSummerExam() {
  var form = document.getElementById("summerExamForm");
  if (form) form.reset();
  document.querySelectorAll(".summer-exam-question").forEach(function (card) {
    card.classList.remove("is-correct", "is-incorrect", "is-unanswered");
    clearSummerExamOptionMarks(card);
    var feedback = card.querySelector(".summer-exam-feedback");
    if (feedback) feedback.hidden = true;
  });
  var result = document.getElementById("summerExamResult");
  if (result) {
    result.hidden = true;
    result.classList.remove("is-stale");
  }
  summerExamHasResult = false;
  var panel = document.getElementById("summerExamPanel");
  if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initSummerExam() {
  renderSummerExam();
  renderSummerExamMath();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSummerExam);
} else {
  initSummerExam();
}
