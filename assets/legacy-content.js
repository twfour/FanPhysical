var legacyChoiceAnalysisMap = {
  projectileWindow: {
    thinking: "先把厚墙前、后两个截面分别当作轨迹边界，写出小球到达两截面时的下落量，再同时检查上沿和下沿约束。",
    formula: String.raw`\[y(x)=\frac{gx^2}{2v^2},\qquad h\le y(L),\qquad y(L+d)\le h+H\]`,
    judgments: {
      A: "速度过小，飞到墙面时下落量过大，会碰到窗口下沿，因此 A 错误。",
      B: "前、后表面的下落量都落在窗口允许区间内，因此 B 正确。",
      C: "速度过大，飞到墙面时下落不足，会碰到窗口上沿，因此 C 错误。",
      D: "速度进一步增大只会使下落量更小，仍不能通过窗口，因此 D 错误。"
    }
  },
  volleyballServe: {
    thinking: "先用同一个水平初速度连接过网点和落地点，再把‘能过网’与‘落在界内’分别写成不等式，不能只检查其中一处。",
    formula: String.raw`\[h_1=\frac12g\left(\frac{3s}{2v_0}\right)^2,\qquad h_1-h_2=\frac12g\left(\frac{s}{v_0}\right)^2\]`,
    judgments: {
      A: String.raw`两式相除得 \(h_2=\frac59h_1\)，即 \(h_1=1.8h_2\)，因此 A 正确。`,
      B: "速度太小时球会落在网前，速度太大时又会越过底线；只有上限没有下限的说法不成立，因此 B 错误。",
      C: String.raw`降低击球高度后，界内落点所能达到的最大网口高度可能低于 \(h_2\)，并非一定存在合适初速度，因此 C 错误。`,
      D: "增加击球高度会扩大既能过网又能落在界内的可行区间，可以选取合适初速度，因此 D 正确。",
      E: "改变发射方向后轨迹条件随之改变，落到底线不能推出必然擦网，因此 E 错误。"
    }
  },
  rainWindow: {
    thinking: "先确定无风时雨滴对地速度竖直向下，再用速度相减得到雨滴对车速度；观察到的雨线方向属于相对速度。",
    formula: String.raw`\[\vec v_{雨/车}=\vec v_{雨/地}-\vec v_{车/地},\qquad \tan\theta=\frac{v_1}{v_2}\]`,
    judgments: {
      A: "速度大小关系正确，但车速方向应与观察到的雨线水平偏向相反，因此 A 错误。",
      B: String.raw`雨滴对地竖直下落，车速与雨线水平偏向相反，且 \(v_1=v_2\tan\theta\)，因此 B 正确。`,
      C: "无风条件下雨滴对地速度不是斜向下，且余弦关系不符合速度三角形，因此 C 错误。",
      D: "车速方向虽符合相对速度判断，但雨滴对地速度方向和大小关系均错误，因此 D 错误。"
    }
  },
  projectileNormal: {
    thinking: String.raw`对落到 \(C\) 的球先用末速度垂直斜面确定分速度关系；两球落点等高，再用竖直分运动判断时间是否相同。`,
    formula: String.raw`\[v_y=gt,\qquad \frac{v_y}{v_x}=\tan45^\circ,\qquad y=\frac12gt^2\]`,
    judgments: {
      A: "两球竖直下落高度相同，竖直初速度又都为零，所以飞行时间相同，A 正确。",
      B: String.raw`由 \(45^\circ\) 斜面位置关系应得 \(v_2=\frac12gt\)，不是 \(gt\)，因此 B 错误。`,
      C: String.raw`垂直命中 \(45^\circ\) 斜面给出 \(v_1=gt\)，故水平位移 \(x_C=v_1t=gt^2\)，C 正确。`,
      D: String.raw`结合两条 \(45^\circ\) 斜面的几何关系可得题设高度为 \(\frac34gt^2\)，D 正确。`
    }
  },
  projectileBounce: {
    thinking: "把球 1 的运动分为首次平抛、碰地反弹和再次落地三段，再用两球到同一挡板顶端、同一落点的条件联立。",
    formula: String.raw`\[H=\frac12gT^2,\qquad y_1=H(2u-u^2),\qquad y_2=H\left[1-\frac{(1+u)^2}{9}\right]\]`,
    judgments: {
      A: String.raw`联立两球在挡板处的高度条件后，挡板高度不是 \(3.5\,\mathrm m\)，因此 A 错误。`,
      B: String.raw`由两球同高条件得 \(u=\frac12\)，从而 \(h=\frac34H=3\,\mathrm m\)，因此 B 正确。`,
      C: "该高度不满足两球同时恰好越过挡板的轨迹方程，因此 C 错误。",
      D: "该高度同样不满足共同挡板点与共同落点的双重约束，因此 D 错误。"
    }
  },
  motionCompose: {
    thinking: String.raw`分别从 \(v_x-t\) 图和 \(y-t\) 图读取两个方向的速度与加速度，再合成矢量；运动类型由初速度与加速度是否共线判断。`,
    formula: String.raw`\[\vec v=(v_x,v_y),\qquad \vec a=\left(\frac{dv_x}{dt},\frac{d^2y}{dt^2}\right),\qquad \vec F=m\vec a\]`,
    judgments: {
      A: "初速度与恒加速度不共线，质点做匀变速曲线运动而非直线运动，因此 A 错误。",
      B: String.raw`合外力应由 \(m|\vec a|\) 计算，与选项给出的数值不符，因此 B 错误。`,
      C: String.raw`该时刻的 \(6\,\mathrm{m/s}\) 只是水平分速度，合速度还含竖直分量，因此 C 错误。`,
      D: String.raw`零时刻两分速度构成直角三角形，合速度大小为 \(5\,\mathrm{m/s}\)，因此 D 正确。`
    }
  },
  semiCircleThrow: {
    thinking: "先把圆弧上的两个落点写成相对圆心的坐标，再分别用竖直位移求时间、用水平位移求初速度。",
    formula: String.raw`\[t_i=\sqrt{\frac{2y_i}{g}},\qquad v_i=\frac{|x_i|}{t_i},\qquad \frac{v_1}{v_2}=\frac{|x_1|}{|x_2|}\sqrt{\frac{y_2}{y_1}}\]`,
    judgments: {
      A: "只取水平位移之比，漏掉两个落点飞行时间不同，因此 A 错误。",
      B: "该关系没有同时包含水平位移和竖直下落时间的影响，因此 B 错误。",
      C: String.raw`代入互相垂直的两条半径所对应坐标后，得到 \(\tan\alpha\sqrt{\tan\alpha}\)，因此 C 正确。`,
      D: "余弦形式与两点坐标及飞行时间比不符，因此 D 错误。"
    }
  },
  bikeGear: {
    thinking: "先由车速求后轮角速度；后轮与飞轮同轴，链条接触处线速度相等。最后在可选齿数组合中寻找踏板角速度的最小值。",
    formula: String.raw`\[\omega_{轮}=\frac{v}{r},\qquad \omega_{踏}N_{链}=\omega_{轮}N_{飞}\]`,
    judgments: {
      A: "该值低于由最大链轮与最小飞轮组合得到的可实现下限，因此 A 错误。",
      B: String.raw`取最大链轮和最小飞轮后得到最小踏板角速度约为 \(3.8\,\mathrm{rad/s}\)，因此 B 正确。`,
      C: "该组合不是踏板角速度的最小值，因此 C 错误。",
      D: "该值对应更不利的传动比，不满足求最小值的要求，因此 D 错误。"
    }
  },
  pileDriver: {
    thinking: "先区分速度矢量与速率，再对支架和铁球整体列竖直方向动力学方程；最低点与最高点分别给出压力极值和离地临界。",
    formula: String.raw`\[v=\omega l,\qquad a_c=\omega^2l,\qquad N=(M+m)g+m\omega^2l\cos\theta\]`,
    judgments: {
      A: "匀速圆周运动中速率不变，但速度方向持续改变，所以线速度并非不变，A 错误。",
      B: String.raw`向心加速度大小只有 \(\omega^2l\)，重力属于受力而不是额外的向心加速度，B 错误。`,
      C: "最低点整体质心具有向上的竖直加速度，地面支持力达到最大，因此 C 正确。",
      D: "令最高点地面支持力为零可得题给角速度关系，因此 D 正确。"
    }
  },
  bowlDoubleBall: {
    thinking: "对每个球分别把碗的支持力分解为竖直平衡分量和水平向心分量，再由各自轨道半径比较角速度、线速度及相对相位。",
    formula: String.raw`\[N\cos\theta=mg,\qquad \omega^2=\frac{g}{R\cos\theta},\qquad v=\omega R\sin\theta\]`,
    judgments: {
      A: String.raw`按 \(v=\omega R\sin\theta\) 计算得到的线速度比与该选项不符，因此 A 错误。`,
      B: String.raw`由 \(\omega^2=g/(R\cos\theta)\) 得到选项所给角速度比，因此 B 正确。`,
      C: "相邻两次最近应由相对角速度求周期，选项给出的时间与该关系不符，因此 C 错误。",
      D: "两球对碗的水平作用一般不能始终抵消，地面需要提供静摩擦维持碗静止，因此 D 正确。"
    }
  }
};

var legacyPracticeExtensionMap = {
  doubleThrow: {
    title: "进阶近似题：双球延迟上抛的参数域",
    question: String.raw`甲、乙从同一点先后竖直上抛，初速度分别为 \(kv_0\) 与 \(v_0\)，乙延迟 \(\Delta t\) 抛出，其中 \(k>1\)。（1）推导乙抛出后的相遇时间；（2）求能在空中相遇的 \(\Delta t\) 参数范围；（3）写出相遇高度；（4）讨论相遇高度随 \(\Delta t\) 的极值。`,
    answer: String.raw`乙抛出后计时 \(\tau\)，令两球高度相等：

\[kv_0(\Delta t+\tau)-\frac12g(\Delta t+\tau)^2=v_0\tau-\frac12g\tau^2.\]

整理得

\[\tau=\frac{\Delta t(2kv_0-g\Delta t)}{2[g\Delta t-(k-1)v_0]}.\]

再联立 \(\tau>0\)、甲乙相遇时高度 \(y>0\) 和两球均未落地，即可得到 \(\Delta t\) 的可行域。把 \(\tau(\Delta t)\) 代回 \(y=v_0\tau-g\tau^2/2\)，再对 \(\Delta t\) 求导可讨论最高相遇点。`,
    thinking: "先用相对加速度为零化简相遇，再把时间正值、空中相遇和落地时刻作为三个独立约束；参数题不能只解高度相等方程。"
  },
  pipeDrop: {
    title: "进阶近似题：不同加速度下的穿管条件",
    question: String.raw`金属管初速度为 \(v\)、长度为 \(L\)，上抛后以向下加速度 \(a\) 运动；小球从管口上方 \(h\) 处静止释放，加速度为 \(g\)。（1）写出小球相对管顶的位移函数；（2）求进入与穿出时刻；（3）讨论判别式对应的“穿过、相切、未进入”三种状态；（4）说明 \(a=g\) 时为何退化为相对匀速。`,
    answer: String.raw`取向上为正，小球与管顶的相对位移可写为

\[\Delta y(t)=h-L-vt-\frac12(g-a)t^2.\]

令 \(\Delta y=0\) 得进入时刻；相对管底再把常量项换为 \(h\)，可求穿出时刻。二次方程判别式大于、等于、小于零分别对应相交、临界相切和无实交点。若 \(a=g\)，二次项消失，相对速度恒为 \(-v\)，穿过一个管长仍需 \(L/v\)。`,
    thinking: "把同加速度结论推广后，相对运动由匀速变为匀变速；根的个数和正负直接对应真实接触过程。"
  },
  threeCar: {
    title: "进阶近似题：含反应时间的防追尾",
    question: String.raw`前车初速度为 \(v_A\)，立即以减速度 \(a_A\) 制动；后车初速度为 \(v_B>v_A\)，初距为 \(d\)，驾驶员经过反应时间 \(\tau\) 后才以减速度 \(a_B\) 制动。（1）写出反应阶段和共同制动阶段的间距函数；（2）求不追尾的临界条件；（3）反求 \(a_B\) 的最小值；（4）比较“速度相等”和“间距为零”两个临界的角色。`,
    answer: String.raw`反应阶段后车仍匀速，先算

\[s(\tau)=d+v_A\tau-\frac12a_A\tau^2-v_B\tau.\]

此后令 \(u=t-\tau\)，间距为

\[s(u)=s(\tau)+(v_A-a_A\tau-v_B)u+\frac12(a_B-a_A)u^2.\]

要求全过程 \(s\ge0\)。若最低点落在制动阶段，临界满足 \(ds/du=0\) 且 \(s=0\)，由这两式反求 \(a_{B,\min}\)；若最低点在端点，还需分别检查反应结束或停车时刻。`,
    thinking: "反应时间会新增一个分段和一段未制动路程；先定位间距最低点，再决定使用内部极值还是端点条件。"
  },
  inclineSlot: {
    title: "进阶近似题：粗糙斜槽的等时性破缺",
    question: String.raw`同心圆之间的斜槽与竖直方向夹角为 \(\theta\)，外、内半径差为 \(\Delta R\)，物体与槽间动摩擦因数为 \(\mu\)。（1）求沿槽加速度；（2）写出从外圆到内圆的时间；（3）判断光滑时角度为何抵消；（4）求可下滑的角度条件并讨论 \(t(\theta)\) 的最小值。`,
    answer: String.raw`槽长 \(s=2\Delta R\cos\theta\)。重力沿槽分量为 \(mg\cos\theta\)，支持力为 \(mg\sin\theta\)，故

\[a=g(\cos\theta-\mu\sin\theta),\qquad t=\sqrt{\frac{4\Delta R\cos\theta}{g(\cos\theta-\mu\sin\theta)}}.\]

当 \(\mu=0\) 时角度因子抵消；粗糙时不再等时。能由静止下滑要求 \(\cos\theta>\mu\sin\theta\)，即 \(\tan\theta<1/\mu\)。`,
    thinking: "圆几何给路程，受力分解给加速度；粗糙后两个角度因子不同，原来的等时结论自然失效。"
  },
  riverCrossing: {
    title: "进阶近似题：非均匀水流中的渡河轨迹",
    question: String.raw`河宽为 \(d\)，船对水速度大小恒为 \(v_b\) 且始终垂直河岸；水速随离岸距离 \(y\) 变化为 \(u(y)=u_0+ky\)。（1）求渡河时间；（2）推导轨迹 \(x(y)\)；（3）求到岸漂移量；（4）若允许调节船头方向，说明怎样建立正对岸到达的控制方程。`,
    answer: String.raw`垂直分速度恒为 \(v_b\)，所以 \(t=d/v_b\)。又

\[\frac{dx}{dy}=\frac{u(y)}{v_b}=\frac{u_0+ky}{v_b},\]

积分得

\[x(y)=\frac{u_0y+ky^2/2}{v_b},\qquad x(d)=\frac{u_0d+kd^2/2}{v_b}.\]

若船头可调，应令船速沿岸分量与 \(u(y)\) 的合速度积分满足总漂移为零，同时保证垂直分量为正。`,
    thinking: "水速随位置变时不能再用一个平均速度直接乘时间；把轨迹微分写成两个分速度之比后积分。"
  },
  waterfallCrossing: {
    title: "进阶近似题：危险边界与最小船速",
    question: String.raw`河宽为 \(d\)，匀速水流为 \(u\)，对岸危险边界位于出发点下游 \(L\) 处。（1）用矢量几何推导安全渡河所需最小船速；（2）求最优船头方向；（3）若船启动前随水漂流时间 \(\tau\)，重新写出最小速度；（4）讨论当可用船速低于该临界值时的最短安全距离。`,
    answer: String.raw`临界合速度沿 \((L,d)\) 方向，最小船速是水速对该方向法线的分量：

\[v_{b,\min}=u\frac{d}{\sqrt{L^2+d^2}}.\]

船速矢量应垂直临界合速度。若先漂流 \(\tau\)，剩余下游裕量变为 \(L-u\tau\)，在其为正时将 \(L\) 替换为 \(L-u\tau\)。若可用船速更小，速度圆与安全方向域无交点，必须改变出发点或接受更大的下游落点。`,
    thinking: "把安全要求画成允许的合速度方向扇区；最小船速对应水速矢量端点到边界射线的最短距离。"
  },
  curveForce: {
    title: "进阶近似题：由曲率与速率变化求合力",
    question: String.raw`质点沿曲线运动，某点曲率半径为 \(R\)，速率是弧长的函数 \(v(s)\)。（1）求切向、法向加速度；（2）写出合力大小及其相对切线的方向；（3）求速率不变和曲率趋于零时的极限；（4）由已知合力方向反求 \(dv/ds\)。`,
    answer: String.raw`切向、法向加速度为

\[a_t=\frac{dv}{dt}=v\frac{dv}{ds},\qquad a_n=\frac{v^2}{R}.\]

所以

\[F=m\sqrt{a_t^2+a_n^2},\qquad \tan\phi=\frac{a_n}{a_t}.\]

速率不变时 \(a_t=0\)，合力指向曲率中心；\(R\to\infty\) 时 \(a_n\to0\)。由力方向得到 \(a_t=a_n/\tan\phi\)，再反求 \(dv/ds=a_t/v\)。`,
    thinking: "把‘减速’和‘转弯’分别量化为切向与法向分量，再进行矢量合成，能从定性判断升级到反问题。"
  },
  motionCompose: {
    title: "进阶近似题：二维分运动的轨迹反演",
    question: String.raw`质点满足 \(v_x=v_0+at\)、\(y=y_0-ut\)，且 \(x(0)=0\)。（1）写出 \(x(t)\)；（2）消去 \(t\) 得轨迹方程 \(x(y)\)；（3）求速度最小时刻；（4）由观测到的轨迹二次项系数反求 \(a/u^2\)。`,
    answer: String.raw`积分得 \(x=v_0t+at^2/2\)，而 \(t=(y_0-y)/u\)，所以

\[x(y)=\frac{v_0}{u}(y_0-y)+\frac{a}{2u^2}(y_0-y)^2.\]

速度平方 \(v^2=(v_0+at)^2+u^2\)，在允许时间内由 \(v_0+at=0\) 给出极小值候选。轨迹二次项系数就是 \(a/(2u^2)\)，可据此反演参数比。`,
    thinking: "先分轴积分，再消去时间；轨迹形状、速度极值和受力参数可以由同一组分运动方程互相反推。"
  },
  riverAdvanced: {
    title: "进阶近似题：船速小于水速时的最短航程",
    question: String.raw`河宽为 \(d\)，船速 \(v_b<u\)。（1）用速度圆切线推导最短航程时的船头方向；（2）求合速度与垂直河岸方向的夹角；（3）求最短实际航程；（4）讨论 \(v_b/u\to1^-\) 与 \(v_b/u\to0^+\) 两个极限。`,
    answer: String.raw`速度圆切线给出船头与上游河岸方向夹角 \(\alpha\) 满足

\[\cos\alpha=\frac{v_b}{u}.\]

临界合速度方向与水流方向夹角 \(\beta\) 满足 \(\sin\beta=v_b/u\)。实际航程

\[S_{\min}=\frac{d}{\sin\beta}=\frac{du}{v_b}.\]

当 \(v_b/u\to1^-\) 时 \(S_{\min}\to d\)；当比值趋零时最短航程发散。`,
    thinking: "船速不足以抵消水流时，目标从‘正对岸’切换为‘位移方向最靠近法线’，切线条件直接给出极值。"
  },
  rodConstraint: {
    title: "进阶近似题：杆约束的速度与加速度关系",
    question: String.raw`长为 \(L\) 的杆两端坐标为 \((x,0)\)、\((0,y)\)，满足 \(x^2+y^2=L^2\)。（1）推导两端速度关系；（2）继续求导得到加速度关系；（3）解释为什么加速度不能只把速度公式中的 \(v\) 换成 \(a\)；（4）讨论一端接近墙角时另一端速度和加速度的变化。`,
    answer: String.raw`一次求导得

\[x\dot x+y\dot y=0.\]

二次求导得

\[\dot x^2+x\ddot x+\dot y^2+y\ddot y=0.\]

加速度关系比速度关系多出 \(\dot x^2+\dot y^2\) 项，来源是杆方向本身在转动。端点接近墙角时几何投影因子可能趋零，另一端的速度或加速度会迅速增大，必须检查理想刚杆模型的适用性。`,
    thinking: "杆长不变是原始约束；速度、加速度关系都应从同一个几何方程逐次求导，而不是类比替换。"
  },
  dualConstraintCircle: {
    title: "进阶近似题：双约束力的参数域",
    question: String.raw`把轻绳、轻杆与竖直方向的夹角推广为 \(\theta_1,\theta_2\)，小球水平圆周半径为 \(r\)。（1）用 \(\omega\) 表示绳张力与杆力；（2）由绳只能拉求角速度范围；（3）求杆力换向的临界角速度；（4）若小球脱离后从高度 \(h\) 切向飞出，写出不碰半径 \(R\) 圆盘的判据。`,
    answer: String.raw`设绳力 \(T\)、杆沿假定方向的力 \(F\)，联立

\[T\sin\theta_1+F\sin\theta_2=m\omega^2r,\qquad T\cos\theta_1+F\cos\theta_2=mg.\]

解出 \(T(\omega),F(\omega)\) 后，\(T\ge0\) 给绳保持拉直的范围，\(F=0\) 给杆由拉变压或由压变拉的临界。脱离后下落时间 \(t=\sqrt{2h/g}\)，切向位移 \(\omega rt\) 应不小于从当前半径到圆盘边缘所需的几何弦长。`,
    thinking: "先保留两种约束力的符号，负号只表示杆力换向；绳张力非负才是真正限制模型存在的单向条件。"
  },
  handRopeBreak: {
    title: "进阶近似题：一般最大拉力下的断绳最值",
    question: String.raw`轻绳最大拉力为 \(\kappa mg\)，手离地高度为 \(H\)。（1）求圆锥摆断绳时的夹角和速度；（2）求断后落地速度；（3）若改为长 \(L\) 的绳在竖直圆周最低点断裂，求水平射程 \(x(L)\)；（4）优化 \(L\) 并求最大射程。`,
    answer: String.raw`圆锥摆断绳时

\[\cos\alpha=\frac1\kappa,\qquad v_1^2=gl\left(\kappa-\frac1\kappa\right).\]

断点高度为 \(H-l/\kappa\)，故 \(v_2^2=v_1^2+2g(H-l/\kappa)\)。最低点断绳时 \(v^2=(\kappa-1)gL\)，射程

\[x(L)=\sqrt{2(\kappa-1)L(H-L)}.\]

乘积在 \(L=H/2\) 时最大，得到

\[x_{\max}=H\sqrt{\frac{\kappa-1}{2}}.\]`,
    thinking: "先把最大拉力写成无量纲参数 \(\kappa\)，再把断绳临界、平抛射程和二次函数最值串成同一条推导链。"
  },
  projectileSlope: {
    title: "进阶近似题：任意倾角斜面上的平抛缩放",
    question: String.raw`小球从斜面顶端水平抛出，斜面与水平夹角为 \(\theta\)。（1）推导落回斜面的时间和沿水平、竖直方向位移；（2）求末速度方向；（3）若初速度乘 \(\lambda\)，比较时间、落点距离和末速度各怎样缩放；（4）由一次落点测量反求 \(v_0\)。`,
    answer: String.raw`落点满足 \(y=x\tan\theta\)。联立 \(x=v_0t\)、\(y=gt^2/2\)，得

\[t=\frac{2v_0\tan\theta}{g},\qquad x=\frac{2v_0^2\tan\theta}{g}.\]

末速度满足 \(v_y/v_x=gt/v_0=2\tan\theta\)。当 \(v_0\) 乘 \(\lambda\) 时，时间乘 \(\lambda\)，位移乘 \(\lambda^2\)，末速度各分量均乘 \(\lambda\)。`,
    thinking: "斜面方程与平抛分轴方程联立后，时间、位移和速度方向都能统一推出；缩放关系不是另记公式。"
  },
  projectileWindow: {
    title: "进阶近似题：厚墙窗口的速度可行域",
    question: String.raw`抛出点距墙前表面 \(L\)，墙厚 \(d\)，窗口相对抛出点允许下落区间为 \([h_1,h_2]\)。（1）推导能穿过窗口的初速度区间；（2）加入安全余量 \(\delta\) 后重新作答；（3）判断哪一个截面控制速度下限、哪一个控制上限；（4）讨论窗口无厚度时的退化结果。`,
    answer: String.raw`前、后表面下落量分别为 \(gL^2/(2v^2)\)、\(g(L+d)^2/(2v^2)\)。单调性给出最紧约束

\[\sqrt{\frac{g(L+d)^2}{2h_2}}\le v\le\sqrt{\frac{gL^2}{2h_1}}.\]

有安全余量时把允许区间改为 \([h_1+\delta,h_2-\delta]\)。后表面控制下限，前表面控制上限；令 \(d=0\) 即退化为薄墙窗口。`,
    thinking: "不逐个试速度，直接利用下落量随 \(x\) 增大、随 \(v\) 减小的单调性建立速度可行区间。"
  },
  volleyballServe: {
    title: "进阶近似题：过网与界内落点的可行域",
    question: String.raw`击球点高 \(h\)，网高 \(h_n\)，球网距击球点 \(s\)，对方底线距击球点 \(S>s\)。（1）求水平击球能够过网且落在 \([s,S]\) 内的初速度区间；（2）求该区间非空的高度条件；（3）找出恰好擦网又落底线的临界；（4）讨论提高击球点对可行域的影响。`,
    answer: String.raw`落地射程 \(R=v_0\sqrt{2h/g}\)，界内要求 \(s<R\le S\)。过网要求

\[h-\frac{gs^2}{2v_0^2}\ge h_n.\]

因此速度下限取“过网下限”和“落过网后下限”的较大者，上限由底线给出。恰好擦网且落底线时

\[h-h_n=\frac{gs^2}{2v_0^2},\qquad h=\frac{gS^2}{2v_0^2},\]

故 \((h-h_n)/h=s^2/S^2\)。`,
    thinking: "把过网和落点写成同一变量 \(v_0\) 的不等式，再求交集；可行域非空本身就是新的临界条件。"
  },
  dartTarget: {
    title: "进阶近似题：最高点命中的最小出手速度",
    question: String.raw`飞镖从靶心下方水平距离 \(L\)、竖直距离 \(H\) 处斜向上抛出，并在轨迹最高点垂直击中竖直靶面。（1）写出初速度关于 \(L,H\) 的表达式；（2）在 \(L\) 固定时优化 \(H\)，求最小初速度；（3）求最优发射角；（4）说明偏离最优高度时速度为何增大。`,
    answer: String.raw`最高点条件给出

\[v_0^2=\frac{gL^2}{2H}+2gH.\]

对 \(H\) 求极值或用均值不等式，得 \(H=L/2\) 时

\[v_{0,\min}=\sqrt{2gL}.\]

此时 \(v_{0x}=v_{0y}=\sqrt{gL}\)，发射角为 \(45^\circ\)。高度过小会要求更大的水平分速度，高度过大又要求更大的竖直分速度。`,
    thinking: "先把‘垂直命中’翻译成最高点，再把水平、竖直分速度合成为关于高度的函数并做优化。"
  },
  rainWindow: {
    title: "进阶近似题：含侧风的雨速反演",
    question: String.raw`雨滴对空气竖直下落速度为 \(v_r\)，水平风速为 \(u\)。汽车以已知速度 \(v_c\) 行驶，车内观察到雨线与竖直夹角为 \(\theta\)。（1）写出相对速度；（2）由一次观测得到 \(u-v_c\)；（3）用两种不同车速的观测反求 \(u,v_r\)；（4）说明方向符号怎样由雨线偏向确定。`,
    answer: String.raw`取车行方向为正，雨滴对车的水平分速度为 \(u-v_c\)，竖直分速度为 \(-v_r\)，故

\[\tan\theta=\frac{|u-v_c|}{v_r}.\]

两次观测给出两条带方向符号的线性方程 \(u-v_{c,i}=\sigma_i v_r\tan\theta_i\)，联立即可反求 \(u,v_r\)。\(\sigma_i\) 由雨线向车前还是车后倾确定。`,
    thinking: "一次观测只给速度差，第二种车速提供独立方程；先保留方向符号，避免只用绝对值造成多解。"
  },
  projectileNormal: {
    title: "进阶近似题：任意斜面角的垂直命中",
    question: String.raw`小球水平抛出，经过时间 \(t\) 垂直撞上与水平夹角为 \(\theta\) 的斜面。（1）求水平初速度；（2）求撞击点的水平、竖直位移；（3）若另一球落到同一高度的另一斜面，证明两球飞行时间关系；（4）讨论 \(\theta\to0\) 与 \(\theta\to90^\circ\) 的极限。`,
    answer: String.raw`垂直斜面意味着速度方向与水平夹角为 \(90^\circ-\theta\)，所以

\[\frac{gt}{v_0}=\cot\theta,\qquad v_0=gt\tan\theta.\]

位移为 \(x=v_0t=gt^2\tan\theta\)、\(y=gt^2/2\)。水平抛出的两球只要竖直下落高度相同，飞行时间就相同，与水平运动无关。`,
    thinking: "把法线方向先转成速度分量比，再用竖直分运动锁定时间；等高条件只由竖直方向决定。"
  },
  projectileBounce: {
    title: "进阶近似题：一般恢复系数下的共同挡板",
    question: String.raw`球 1 从高度 \(H\) 水平抛出，落地后水平速度不变、竖直速度按恢复系数 \(e\) 反向；球 2 直接飞到与球 1 相同的落点。设球 1 反弹后经过 \(uT\) 到挡板，\(T=\sqrt{2H/g}\)。（1）求共同落点距离比；（2）写出两球在挡板处的高度；（3）建立求 \(u\) 的方程；（4）由此求挡板高度并检验 \(0<u<2e\)。`,
    answer: String.raw`球 1 反弹后的滞空时间为 \(2eT\)，故总水平距离为首次距离的 \(1+2e\) 倍，球 2 水平速度也为球 1 的 \(1+2e\) 倍。挡板处

\[\frac{h_1}{H}=2eu-u^2,\qquad \frac{h_2}{H}=1-\left(\frac{1+u}{1+2e}\right)^2.\]

令两式相等可求 \(u\)，再代回 \(h/H=2eu-u^2\)。只保留满足 \(0<u<2e\) 且挡板位于反弹段内的根。`,
    thinking: "恢复系数改变反弹后的竖直滞空时间，从而同时改变共同落点速度比和挡板方程；最后必须筛选物理解。"
  },
  semiCircleThrow: {
    title: "进阶近似题：圆弧任意两点的平抛速度比",
    question: String.raw`从圆心水平抛出两球，分别落在圆弧上坐标为 \((x_1,y_1)\)、\((x_2,y_2)\) 的两点，取竖直向下为正。（1）推导初速度比的一般式；（2）把坐标改写成圆心角参数；（3）讨论两半径互相垂直时的化简；（4）由测得的速度比反求角度。`,
    answer: String.raw`每个落点满足

\[t_i=\sqrt{\frac{2y_i}{g}},\qquad v_i=\frac{|x_i|}{t_i}.\]

因此

\[\frac{v_1}{v_2}=\frac{|x_1|}{|x_2|}\sqrt{\frac{y_2}{y_1}}.\]

再用 \(x_i=R\sin\theta_i\)、\(y_i=R\cos\theta_i\) 代入即可得到角度式；互相垂直时加入 \(\theta_1+\theta_2=90^\circ\) 化简。`,
    thinking: "先保留一般坐标公式，再施加圆几何约束；这样同一方法能覆盖任意角距，而不是只记一个特殊比值。"
  },
  bulletCylinder: {
    title: "进阶近似题：多圈转动下的弹孔相位",
    question: String.raw`子弹以速度 \(v\) 沿直径 \(d\) 穿过角速度为 \(\omega\) 的圆筒，出入孔半径夹角的锐角为 \(\varphi\)。（1）考虑圆筒可能多转若干圈，写出全部速度分支；（2）说明如何由速度范围确定整数圈数；（3）讨论 \(\varphi=0\) 时一个孔与两个孔的条件；（4）分析测角误差对速度的影响。`,
    answer: String.raw`穿筒时间 \(t=d/v\)。按题图转向，实际相位可写成

\[\omega t=\pi-\varphi+2n\pi,\qquad n=0,1,2,\ldots\]

所以

\[v_n=\frac{\omega d}{\pi-\varphi+2n\pi}.\]

由已知速度上下限筛选唯一 \(n\)。\(\varphi=0\) 时还要区分出孔是否与入孔对应同一材料点；误差满足 \(|\delta v/v|\approx|\delta\varphi|/(\pi-\varphi+2n\pi)\)。`,
    thinking: "观测到的锐角只给模 \(2\pi\) 的相位，必须显式加入整数圈数，再用额外物理范围消除多解。"
  },
  bikeGear: {
    title: "进阶近似题：复合变速系统的最优齿比",
    question: String.raw`自行车后轮半径为 \(R\)，车速为 \(v\)，前链轮齿数可在集合 \(\{N_i\}\) 中选择，后飞轮齿数可在 \(\{n_j\}\) 中选择。（1）推导踏频角速度；（2）求所有组合中的最小与最大值；（3）加入踏频舒适区间 \([\omega_1,\omega_2]\)，筛选可用档位；（4）讨论车速连续变化时的换挡边界。`,
    answer: String.raw`后轮与飞轮同轴，链条无滑动，故

\[\omega_{踏}=\frac{v}{R}\frac{n_j}{N_i}.\]

最小值取最小飞轮齿数与最大链轮齿数，最大值反之。舒适档位满足

\[\omega_1\le\frac{v}{R}\frac{n_j}{N_i}\le\omega_2.\]

对每个齿数组合把不等式反解成车速区间，其交界就是换挡边界。`,
    thinking: "先得到离散档位的统一符号式，再做组合极值和可行区间筛选，比只算一个最小值更接近真实变速问题。"
  },
  pileDriver: {
    title: "进阶近似题：打夯机地面压力的全过程",
    question: String.raw`铁球以角速度 \(\omega\) 在竖直平面内做半径 \(l\) 的匀速圆周运动，令 \(\theta\) 从最低点量起。（1）写出地面对整机支持力 \(N(\theta)\)；（2）求最大、最小值及平均值；（3）求不离地的角速度条件；（4）若角速度缓慢变化，说明临界最先出现在哪一位置。`,
    answer: String.raw`整体竖直方向有

\[N(\theta)=(M+m)g+m\omega^2l\cos\theta.\]

因此 \(N_{\max}=(M+m)g+m\omega^2l\) 在最低点，\(N_{\min}=(M+m)g-m\omega^2l\) 在最高点；一周平均值为 \((M+m)g\)。不离地要求 \(N_{\min}\ge0\)，即

\[\omega^2\le\frac{(M+m)g}{ml}.\]

角速度增大时最高点最先达到零压力临界。`,
    thinking: "把最低点、最高点两个特例统一成角度函数，再从函数直接读极值、平均值和接触条件。"
  },
  bowlDoubleBall: {
    title: "进阶近似题：半球碗双球的相对周期",
    question: String.raw`两球在同一光滑半球碗内，半径为 \(R\)，各自半径与竖直方向夹角为 \(\theta_a,\theta_b\)。（1）推导两球角速度和线速度；（2）求同向运动时相邻两次角位置重合的时间；（3）改为反向运动重新作答；（4）写出碗所需地面水平摩擦的矢量表达式并讨论何时瞬时为零。`,
    answer: String.raw`单球满足

\[\omega_i=\sqrt{\frac{g}{R\cos\theta_i}},\qquad v_i=\omega_iR\sin\theta_i.\]

同向时相对周期

\[T_{rel}=\frac{2\pi}{|\omega_a-\omega_b|},\]

反向时把分母改为 \(\omega_a+\omega_b\)。碗受到两球水平作用力的矢量和，地面摩擦为其反向；只有两水平作用力等大且方向相反的瞬间才可能为零。`,
    thinking: "先独立求每个球的角速度，再转入相对相位；碗的摩擦需要做矢量合成，不能只比较两个力的大小。"
  }
};

function legacyProblemBlockByKicker(note, kickerText) {
  var blocks = note ? note.querySelectorAll(".problem-note-block") : [];
  for (var index = 0; index < blocks.length; index += 1) {
    var kicker = blocks[index].querySelector(".problem-note-kicker");
    if (kicker && kicker.innerText.trim() === kickerText) return blocks[index];
  }
  return null;
}

function extractLegacyOptionTitles(note) {
  var questionBlock = legacyProblemBlockByKicker(note, "题目");
  var titles = {};
  if (!questionBlock) return titles;
  var paragraphs = questionBlock.querySelectorAll("p");
  paragraphs.forEach(function (paragraph) {
    var text = paragraph.innerText.replace(/　/g, "  ").trim();
    var pattern = /([A-E])[.．、]\s*([\s\S]*?)(?=\s+[A-E][.．、]\s*|$)/g;
    var match;
    while ((match = pattern.exec(text)) !== null) {
      titles[match[1]] = match[2].trim();
    }
  });
  return titles;
}

function upgradeLegacyChoiceAnalysis(note, sceneName) {
  var profile = legacyChoiceAnalysisMap[sceneName];
  if (!profile || note.dataset.legacyChoiceUpgraded === "1") return;
  var oldBlock = legacyProblemBlockByKicker(note, "解析");
  if (!oldBlock || !oldBlock.parentNode) return;

  var optionTitles = extractLegacyOptionTitles(note);
  var labels = Object.keys(profile.judgments);
  var analyses = labels.map(function (label) {
    return {
      option: label,
      title: optionTitles[label] || "",
      thinking: profile.thinking,
      formula: profile.formula,
      judgment: profile.judgments[label],
      knowledge: [],
      commonMistakes: []
    };
  });
  var replacement = createProblemAnalysisBlock({
    analysis: { title: "分选项解析" },
    optionAnalyses: analyses,
    analysisPresentation: { collapseEachStep: true }
  });
  replacement.dataset.analysisBlock = "1";

  var fullDetails = document.createElement("details");
  fullDetails.className = "analysis-step";
  fullDetails.dataset.collapsibleStep = "1";
  var fullSummary = document.createElement("summary");
  fullSummary.className = "analysis-step-summary";
  fullSummary.innerText = "完整推导";
  fullDetails.appendChild(fullSummary);
  var fullBody = document.createElement("div");
  fullBody.className = "analysis-step-content";
  Array.prototype.slice.call(oldBlock.children).forEach(function (child) {
    if (child.classList && child.classList.contains("problem-note-kicker")) return;
    fullBody.appendChild(child.cloneNode(true));
  });
  fullDetails.appendChild(fullBody);
  replacement.appendChild(fullDetails);
  oldBlock.parentNode.replaceChild(replacement, oldBlock);
  note.dataset.legacyChoiceUpgraded = "1";
}

function insertLegacyMarkdownBefore(parent, beforeNode, markdown) {
  var holder = document.createElement("div");
  appendMarkdownChildren(holder, markdown);
  Array.prototype.slice.call(holder.children).forEach(function (child) {
    parent.insertBefore(child, beforeNode);
  });
}

function upgradeLegacyPractice(note, sceneName) {
  var extension = legacyPracticeExtensionMap[sceneName];
  if (!extension || note.dataset.legacyPracticeUpgraded === "1") return;
  var block = legacyProblemBlockByKicker(note, "近似题");
  if (!block) return;
  var title = block.querySelector("h2");
  if (title) title.innerText = extension.title;

  var details = block.querySelectorAll(":scope > details");
  var firstDetails = details.length ? details[0] : null;
  var baseLabel = document.createElement("h3");
  baseLabel.innerText = "基础设问";
  var firstQuestion = block.querySelector(":scope > p:not(.problem-note-kicker)");
  block.insertBefore(baseLabel, firstQuestion || firstDetails);

  var advancedLabel = document.createElement("h3");
  advancedLabel.innerText = "综合提升";
  block.insertBefore(advancedLabel, firstDetails);
  insertLegacyMarkdownBefore(block, firstDetails, extension.question);

  if (details[0]) {
    var baseAnswerHeading = document.createElement("h3");
    baseAnswerHeading.innerText = "1. 基础设问";
    details[0].insertBefore(baseAnswerHeading, details[0].children[1] || null);
    var answerHeading = document.createElement("h3");
    answerHeading.innerText = "2. 综合提升";
    details[0].appendChild(answerHeading);
    appendMarkdownChildren(details[0], extension.answer);
  }
  if (details[1]) {
    var baseThinkingHeading = document.createElement("h3");
    baseThinkingHeading.innerText = "1. 基础思路";
    details[1].insertBefore(baseThinkingHeading, details[1].children[1] || null);
    var thinkingHeading = document.createElement("h3");
    thinkingHeading.innerText = "2. 进阶思路";
    details[1].appendChild(thinkingHeading);
    appendMarkdownChildren(details[1], extension.thinking);
  }
  note.dataset.legacyPracticeUpgraded = "1";
}

function enhanceLegacyProblemNote(note, sceneName) {
  if (!note || note.dataset.problemJson === "1") return;
  upgradeLegacyChoiceAnalysis(note, sceneName);
  upgradeLegacyPractice(note, sceneName);
}
