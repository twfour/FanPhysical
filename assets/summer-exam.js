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
    explanation: String.raw`<p><strong>建立关系：</strong>船沿垂直河岸方向的速度恒为 \(v\)，故 \(\mathrm dy/\mathrm dt=v\)，横向水速满足 \(u(y)=\mathrm dx/\mathrm dt=v\,\mathrm dx/\mathrm dy\)。</p><p><strong>求导化简：</strong>\[\frac{\mathrm dx}{\mathrm dy}=\frac{u_0}{v}+\frac{u_1}{v}\left[\frac12-\frac12\cos\left(\frac{2\pi y}{d}\right)\right],\]所以 \[u(y)=u_0+\frac{u_1}{2}\left[1-\cos\left(\frac{2\pi y}{d}\right)\right]=u_0+u_1\sin^2\left(\frac{\pi y}{d}\right).\]</p><p><strong>取最大值：</strong>当 \(y=d/2\) 时 \(\sin^2(\pi y/d)=1\)，于是 \(u_{\max}=u_0+u_1\)，对应 \(\boxed{\mathrm C}\)。</p>`
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
    explanation: String.raw`<p><strong>出流速度：</strong>孔在液面下深度为 \(h\)，由托里拆利定律 \(v=\sqrt{2gh}\)。孔距地面的高度为 \(H-h\)，水滴下落时间为 \(t=\sqrt{2(H-h)/g}\)。</p><p><strong>射程：</strong>\[L=vt=2\sqrt{h(H-h)},\qquad L^2=4h(H-h).\]</p><p><strong>同射程条件：</strong>\(h_1(H-h_1)=h_2(H-h_2)\)。两个孔高度不同，故 \(h_1+h_2=H\)。代入 \(h_1=H/4\)，得 \[h_2=H-\frac H4=\frac{3H}{4},\]对应 \(\boxed{\mathrm D}\)。</p>`
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
    explanation: String.raw`<p><strong>无滑动约束：</strong>主动轮边缘速度 \(v_0=\omega_0r\)，从动轮边缘速度 \(v_1=\omega_1\lambda r\)，皮带不打滑给出 \(v_1=v_0\)。</p><p><strong>向心加速度之比：</strong>\[\frac{a_1}{a_0}=\frac{v_1^2/(\lambda r)}{v_0^2/r}=\frac1\lambda.\]</p><p>所以数值因子为 \(1/\lambda\)，对应 \(\boxed{\mathrm A}\)。</p>`
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
    explanation: String.raw`<p><strong>确定方向：</strong>汽车位于圆弧桥最低点，圆心在汽车上方，因此向心加速度方向竖直向上，大小为 \(a_n=v^2/r\)。</p><p><strong>列径向方程：</strong>取向上为正，\[N-mg=m\frac{v^2}{r}.\]</p><p><strong>解出支持力：</strong>\[N=mg+m\frac{v^2}{r},\]对应 \(\boxed{\mathrm D}\)。</p>`
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
    explanation: String.raw`<p><strong>临界条件：</strong>赤道处物质刚好不脱离时支持力为零，万有引力提供全部向心力，因此 \[m\omega^2R=mg.\]</p><p><strong>求临界角速度：</strong>\[\omega_{\max}=\sqrt{\frac gR}.\]</p><p><strong>换算周期：</strong>周期越小角速度越大，故最小周期为 \[T_{\min}=\frac{2\pi}{\omega_{\max}}=2\pi\sqrt{\frac Rg},\]对应 \(\boxed{\mathrm B}\)。选项 C 的量纲也不是时间。</p>`
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
    explanation: String.raw`<p><strong>动力学关系：</strong>圆轨道满足 \(GMm/r^2=m4\pi^2r/T^2\)，所以 \[M=\frac{4\pi^2r^3}{GT^2}.\]</p><p><strong>作比并代入：</strong>\[\frac{M_\star}{M_\odot}=\left(\frac{r_\star}{r_\oplus}\right)^3\left(\frac{T_\oplus}{T_\star}\right)^2=\left(\frac14\right)^3\left(10\right)^2=\frac{100}{64}=\frac{25}{16}.\]</p><p>对应 \(\boxed{\mathrm C}\)。</p>`
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
    explanation: String.raw`<p><strong>求拉力：</strong>由 \(T-mg=ma\)，\[T=m(g+a)=800(10+1.5)=9200\,\mathrm N.\]</p><p><strong>求位移：</strong>货物由静止做匀加速运动，\[h=\frac12at^2=\frac12\times1.5\times2^2=3.0\,\mathrm m.\]</p><p><strong>求功：</strong>拉力与位移同向，\[W=Th=9200\times3.0=27600\,\mathrm J=2.76\times10^4\,\mathrm J,\]对应 \(\boxed{\mathrm C}\)。</p>`
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
    explanation: String.raw`<p><strong>最高点临界：</strong>恰不断轨时支持力为零，\[mg=m\frac{v_t^2}{R}\Rightarrow v_t^2=gR=10\times0.9=9.\]</p><p><strong>最低点到最高点：</strong>高度增加 \(2R\)，机械能守恒：\[\frac12mv_b^2=\frac12mv_t^2+mg(2R),\]故 \[v_b^2=v_t^2+4gR=9+4\times10\times0.9=45.\]</p><p>因此 \[v_b=\sqrt{45}=3\sqrt5\,\mathrm{m/s},\]对应 \(\boxed{\mathrm B}\)。</p>`
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
    explanation: String.raw`<p><strong>分段建模：</strong>圆弧段先用机械能守恒求离轨速度，再把离轨速度分解，计算斜抛阶段继续上升的高度。令 \(c=\cos\varphi\)，整理两段高度可得 \[\frac HR=2-c^2-c^3.\]</p><p><strong>代入题设高度：</strong>\[2-c^2-c^3=2\Rightarrow c^2(1+c)=0.\]</p><p>在题图对应的 \(0^\circ\leq\varphi\leq90^\circ\) 范围内 \(c\geq0\)，只能取 \(c=0\)。因此 \[\cos\varphi=0\Rightarrow\varphi=90^\circ,\]对应 \(\boxed{\mathrm D}\)。</p>`
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
    explanation: String.raw`<p><strong>读取图像：</strong>物体在 \(h=6\,\mathrm m\) 处到达最高点，此时 \(v=0\)，所以机械能全部为重力势能，图中对应 \(E=90\,\mathrm J\)。</p><p><strong>代入：</strong>取零势能面为 \(h=0\)，\[E=mgh\Rightarrow90=m\times10\times6.\]</p><p><strong>求质量：</strong>\[m=\frac{90}{60}=1.5\,\mathrm{kg},\]对应 \(\boxed{\mathrm B}\)。</p>`
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
    explanation: String.raw`<p><strong>分解加速度：</strong>沿轨迹切向有 \(a_t=\mathrm dv/\mathrm dt\)。速率均匀增大，所以 \(a_t\gt0\)，A 正确。</p><p>法向分量为 \[a_n=\frac{v^2}{R}.\]运动中 \(v\) 增大而 \(R\) 减小，因此 \(a_n\) 增大，B 正确。</p><p><strong>判断方向：</strong>切线和法线方向都随位置改变，且 \(a_n/a_t\) 也改变，合加速度方向不可能保持不变，C 错误；加速度矢量不恒定，所以不是匀变速运动，D 正确。答案为 \(\boxed{\mathrm{A,B,D}}\)。</p>`
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
    explanation: String.raw`<p><strong>时间与位移：</strong>两物体水平初速度相同，故 \(x_B/x_A=t_B/t_A=2\)。斜面运动的时间与平抛时间满足 \[\frac{t_B}{t_A}=\frac1{\sin\theta}.\]因此 \(1/\sin\theta=2\)，得 \(\sin\theta=1/2\)，即 \(\theta=30^\circ\)，A、B 正确。</p><p><strong>末速度大小：</strong>两者初速度大小相同、下降高度均为 \(H\)，且过程无耗散，\[v_f^2=v_0^2+2gH,\]所以末速度大小相等，C 正确。</p><p>B 的末速度沿斜面，A 的末速度由水平、竖直分量合成，方向一般不同，D 错误。答案为 \(\boxed{\mathrm{A,B,C}}\)。</p>`
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
    explanation: String.raw`<p><strong>最高点临界：</strong>轻绳只能拉不能推，恰能通过最高点时 \(T_t=0\)，所以 \[mg=m\frac{v_t^2}{r}\Rightarrow v_t=\sqrt{gr}.\]A 正确。</p><p><strong>最低点临界速度：</strong>由最低点到最高点升高 \(2r\)，\[\frac12mv_b^2=\frac12mv_t^2+2mgr,\]代入 \(v_t^2=gr\)，得 \(v_b^2=5gr\)，即 \(v_b=\sqrt{5gr}\)，B 正确。</p><p><strong>最低点张力：</strong>\[T_b-mg=m\frac{v_b^2}{r}=5mg\Rightarrow T_b=6mg,\]故 C 错。半径变为 \(\lambda r\) 时两临界速度均乘 \(\sqrt\lambda\)，而张力结果仍为 \(6mg\)，D 正确。答案为 \(\boxed{\mathrm{A,B,D}}\)。</p>`
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
    explanation: String.raw`<p><strong>向心力：</strong>速率保持 \(v\) 不变，\[F_1=\frac{mv^2}{r},\qquad F_2=\frac{mv^2}{\lambda r},\]所以 \(F_2/F_1=1/\lambda\)，A 正确。</p><p><strong>周期与角速度：</strong>\[T_1=\frac{2\pi r}{v},\qquad T_2=\frac{2\pi\lambda r}{v}=\lambda T_1,\]故 B 正确；\(\omega=v/r\)，所以 \(\omega_2/\omega_1=1/\lambda\)，C 错。</p><p>径向作用可主要改变速度方向，不必使速率瞬间改变，D 错。答案为 \(\boxed{\mathrm{A,B}}\)。</p>`
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
    explanation: String.raw`<p><strong>速度比：</strong>近、远点速度均与径向垂直，由角动量守恒 \[mr_pv_p=mr_av_a\Rightarrow\frac{v_p}{v_a}=\frac{r_a}{r_p},\]A 正确。</p><p><strong>引力加速度比：</strong>\[g=\frac{GM}{r^2}\Rightarrow\frac{g_p}{g_a}=\left(\frac{r_a}{r_p}\right)^2,\]B 正确。</p><p>开普勒第三定律 \(T^2\propto a^3\)，半长轴 \(a\) 不变则周期不变，C 错。偏心率增大时 \(r_p=a(1-e)\) 减小、\(r_a=a(1+e)\) 增大，因此 \(r_a/r_p\) 增大，D 正确。答案为 \(\boxed{\mathrm{A,B,D}}\)。</p>`
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
    explanation: String.raw`<p><strong>转移轨道几何：</strong>近、远地点分别为 \(r_1,r_2\)，故椭圆半长轴 \[a_t=\frac{r_1+r_2}{2},\]A 正确。</p><p><strong>飞行时间：</strong>椭圆周期 \(T_t=2\pi\sqrt{a_t^3/(GM)}\)，转移只走半个周期，\[t=\frac{T_t}{2}=\pi\sqrt{\frac{a_t^3}{GM}},\]B 正确。</p><p>第一次点火必须顺向加速，故转移轨道近地点速度高于原圆轨道速度，C 错；远地点转移速度低于目标圆轨道速度，第二次仍需顺向加速，D 正确。答案为 \(\boxed{\mathrm{A,B,D}}\)。</p>`
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
    explanation: String.raw`<p><strong>牵引力：</strong>恒功率满足 \(P=Fv\)，所以 \[F=\frac Pv,\]A 正确。</p><p><strong>加速度：</strong>沿运动方向应用牛顿第二定律，\[F-f=ma\Rightarrow a(v)=\frac{P/v-f}{m},\]B 正确。</p><p><strong>极限速度：</strong>当 \(a=0\) 时 \(P/v_m=f\)，故 \[v_m=\frac Pf,\]C 正确。随着 \(v\) 接近 \(v_m\)，加速度趋近于零，达到过程是渐近的，不会在有限时间内严格达到，D 错误。答案为 \(\boxed{\mathrm{A,B,C}}\)。</p>`
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
    explanation: String.raw`<p><strong>加速度：</strong>摩擦力向右，\[a=\frac fm=\frac21=2\,\mathrm{m/s^2},\]故 A 正确。</p><p><strong>达到同速所需时间：</strong>\[t=\frac{v-v_0}{a}=\frac{1-(-3)}2=2\,\mathrm s,\]B 正确。</p><p><strong>相对滑动路程：</strong>初相对速度大小为 \(1-(-3)=4\,\mathrm{m/s}\)，末相对速度为零，因此 \[\Delta s_{\rm rel}=\frac{4+0}{2}\times2=4\,\mathrm m,\]C 正确。</p><p><strong>生热：</strong>\[Q=f\Delta s_{\rm rel}=2\times4=8\,\mathrm J,\]不是 \(4\,\mathrm J\)，D 错。答案为 \(\boxed{\mathrm{A,B,C}}\)。</p>`
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
    explanation: String.raw`<p><strong>任意压缩量：</strong>以释放点为初态，重力势能减少 \(mg(H+x)\)，转化为动能和弹性势能：\[mg(H+x)=\frac12mv^2+\frac12kx^2,\]A 正确。</p><p><strong>速度最大位置：</strong>速度最大时加速度为零，\[mg-kx=0\Rightarrow x=\frac{mg}{k},\]B 正确；这不是最大压缩位置，故 C 错。</p><p><strong>最大压缩量：</strong>令 \(v=0\)，得到 \(kx^2-2mgx-2mgH=0\)。取正根：\[x_{\max}=\frac{mg+\sqrt{m^2g^2+2kmgH}}{k},\]D 正确。答案为 \(\boxed{\mathrm{A,B,D}}\)。</p>`
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
    explanation: String.raw`<p><strong>运动时间：</strong>木块加速度 \[a=\mu g=0.30\times10=3.0\,\mathrm{m/s^2},\]达到 \(6\,\mathrm{m/s}\) 所需时间 \[t=\frac va=\frac63=2.0\,\mathrm s.\]</p><p><strong>相对路程：</strong>木块位移 \(x_b=at^2/2=6\,\mathrm m\)，传送带位移 \(x_c=vt=12\,\mathrm m\)，所以 \[\Delta s_{\rm rel}=x_c-x_b=6\,\mathrm m,\]A 正确。</p><p><strong>热量与电动机功：</strong>摩擦力 \(f=\mu mg=0.30\times1.5\times10=4.5\,\mathrm N\)，\[Q=f\Delta s_{\rm rel}=4.5\times6=27\,\mathrm J,\]B 正确。电动机额外做功 \[W_{\rm motor}=fx_c=4.5\times12=54\,\mathrm J,\]故 C 错；它等于木块动能增加量 \(27\,\mathrm J\) 与生热 \(27\,\mathrm J\) 之和，D 正确。答案为 \(\boxed{\mathrm{A,B,D}}\)。</p>`
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
  answer.innerHTML = "正确答案：\\(\\boxed{\\mathrm{" + question.answer.join(",") + "}}\\)";

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

function renderSummerExamMath(force) {
  renderSummerExam();
  if (summerExamMathRendered && !force) return;
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
  renderSummerExamMath(true);
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
