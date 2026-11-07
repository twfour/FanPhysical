#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data/problems'
CHAPTER = '带电粒子在电场中的运动和示波器原理'

ITEMS = [
('course_01_plate_holes_return','例1：平行板小孔往返','multiple-choice','ACD','plate_holes_return','course-01-plate-holes',
'A、B 为相距 \(d\) 的水平平行金属板，中央分别有小孔 M、N。一带电质点从 A 板上方距 A 为 \(h\) 的 P 点静止下落，穿过 M 后到 N 孔速度恰为零并原路返回。保持极板接电源，判断移动极板后的结论。',
['A. A 板上移少许，质点仍能返回','B. A 板下移少许，质点将穿过 N 孔','C. B 板上移 \(d/2\)，质点返回后的最高点在 A 板下方 \(h/3\)','D. B 板下移少许，质点将穿过 N 孔'],
'由初态得 \(qU=-2mgd\)。移动 A 板不改变极板电压及 P 到 N 的总重力势能差，故 A 对、B 错；B 板上移后由能量方程求得返回转折点，C 对；B 板下移使重力做功增加而电场功不变，D 对。'),
('course_02_crt_deflection','例2：示波管加速与偏转','calculation','\(v_0=\sqrt{2eU_1/m}\)，\(y_1=U_2L_1^2/(4dU_1)\)，\(y_P=U_2L_1(L_1+2L_2)/(4dU_1)\)','crt_deflection','course-02-crt',
'真空示波管中电子由静止经加速电压 \(U_1\) 后，垂直进入板长 \(L_1\)、间距 \(d\)、电压 \(U_2\) 的偏转电场，板端到荧光屏距离为 \(L_2\)。求入射速度、离开偏转场的侧移量和屏上偏移量。',None,
'加速区用 \(eU_1=mv_0^2/2\)。偏转区横向匀速、纵向匀加速，飞出后沿切线匀速运动；把板内侧移和板外侧移相加即可。'),
('course_03_projectile_energy','例3：复合场抛体能量','multiple-choice','ABD','projectile_energy','course-03-projectile-energy',
'带电小球从竖直平行板间 M 点竖直上抛，M、N 等高，O 为最高点。M 点动能为 \(9\,\mathrm J\)，M 到 O 电场力做功 \(16\,\mathrm J\)，忽略阻力，判断能量结论。',
['A. M 点机械能比 O 点少 \(16\,\mathrm J\)','B. 到 N 点动能为 \(73\,\mathrm J\)','C. 上升和下降过程电场力功之比为 \(1:4\)','D. M 到 N 过程中最小动能为 \(5.76\,\mathrm J\)'],
'电场力只改变水平分速度，重力只改变竖直分速度。设到最高点的时间比例为 \(\tau\)，有 \(E_k=16\tau^2+9(1-\tau)^2\)，最小值为 \(144/25=5.76\,\mathrm J\)；由水平位移的时间平方关系可得 N 点电场功 \(64\,\mathrm J\)。'),
('hw_01_liquid_capacitor','单1：液体电容器','single-choice','C','liquid_capacitor','homework-01-liquid-capacitor','绝缘塑料桶外有导电涂层，桶内装导电溶液，二者接恒压电源构成电容器。判断液面高度或涂层面积变化时的电容、电压与电荷量变化。',['A. 液面升高，电容减小','B. 液面降低，电压减小','C. 刮去部分涂层，电荷量减小','D. 刮去部分涂层，电压增大'],'恒压连接使 \(U\) 不变；有效正对面积减小时 \(C\) 减小，由 \(Q=CU\) 得电荷量减小。'),
('hw_02_crt_quadrant','单2：示波器亮斑象限','single-choice','B','crt_quadrant','homework-02-crt-quadrant','示波管电子束原来打在中心 O。给 XX\' 加 \(U_{XX\'}=-U_0\)，给 YY\' 加 \(U_{YY\'}=U_0\)，\(U_0>0\)，亮斑位于哪个象限？',['A. I','B. II','C. III','D. IV'],'电子带负电，受力方向与电场方向相反。分别判断水平和竖直偏转：亮斑向左、向上，位于第二象限。'),
('hw_03_oscilloscope_waveform','单3：示波器扫描波形','single-choice','C','oscilloscope_waveform','homework-03-oscilloscope-waveform','示波管的竖直偏转电压为周期交变信号，水平偏转电压为周期性锯齿扫描电压。判断荧光屏上的稳定图形。',['A. 图 A','B. 图 B','C. 图 C','D. 图 D'],'锯齿电压每周期使光点从左向右匀速扫描，竖直电压决定同期纵坐标；按同一时刻配对 \(x(t),y(t)\)，得到 C。'),
('hw_04_ion_deflection','单4：氢氦离子偏转','single-choice','C','ion_deflection','homework-04-ion-deflection','氢核和 \(^4\mathrm{He}\) 核分别从静止经同一加速电压，再进入同一偏转电场。比较离开加速场速度和板内竖直位移。',['A. 速度比 \(1:1\)','B. 速度比 \(1:2\)','C. 竖直位移比 \(1:1\)','D. 竖直位移比 \(1:2\)'],'由 \(v^2=2qU_1/m\) 可知速度不同；但 \(y=\frac12(qU_2/md)(L/v)^2=U_2L^2/(4dU_1)\)，质量和电荷量消去，位移比为 \(1:1\)。'),
('hw_05_linear_accelerator','单5：直线加速器漂移管','single-choice','C','linear_accelerator','homework-05-linear-accelerator','质子以初速度 \(v_0\) 进入直线加速器，在各漂移管内匀速且时间均为 \(T\)，每次跨越缝隙均由相同电压 \(U\) 加速。选出不正确说法。',['A. 电源极性应周期性变化','B. 漂移管长度与进入时速度成正比','C. A、B 管长度比恒为 \(1:\sqrt2\)','D. 从 B 管射出速度为 \(\sqrt{v_0^2+2eU/m}\)'],'同步加速要求极性周期反转且 \(L_n=v_nT\)。由于存在初速度，长度比不能固定写成 \(1:\sqrt2\)，C 错；跨过一次缝隙后满足动能定理，D 对。'),
('hw_06_atmosphere_field','单6：大气电场电势图','single-choice','D','atmosphere_field','homework-06-atmosphere-field','地球表面与大气电离层构成大电容器，大地电势为零，给出高度 \(h\) 与电势 \(\varphi\) 的关系图。判断电场方向、电荷量、电容和场强变化。',['A. 大气电场竖直向上','B. 地面带电量约为 \(2.5\times10^5\,\mathrm C\)','C. 电容约为 \(0.6\,\mathrm F\)','D. 高度越大，场强越小'],'横轴为电势、纵轴为高度，\(E=|d\varphi/dh|\) 是图线斜率的倒数。随高度增加，倒数减小，故场强减小。'),
('hw_07_effective_gravity_loop','单7：电场中的竖直圆周','single-choice','A','effective_gravity_loop','homework-07-effective-gravity-loop','带负电小球从光滑斜面静止释放，经相切点 A 进入光滑竖直圆轨道。水平电场使电场力与重力合成为恒定有效重力，若恰好完成圆周运动，求释放点到 A 的斜面距离。',['A. \(1.2\,\mathrm m\)','B. \(2.2\,\mathrm m\)','C. \(2.0\,\mathrm m\)','D. \(2.1\,\mathrm m\)'],'合力方向恰沿斜面，大小对应 \(g\'=5g/4\)。临界圆周由有效重力最高点条件得 \(v_A^2=3g\'R\)，再用 \(2g\'s=v_A^2\)，得 \(s=3R/2=1.2\,\mathrm m\)。'),
('hw_08_electric_circle_energy','单8：匀强场圆轨道能量','single-choice','C','electric_circle_energy','homework-08-electric-circle-energy','带电小球在竖直圆轨道内运动，匀强电场平行于直径 GC。由 A 点静止释放恰能到 C；再给 A 点水平向右冲量使其完成圆周，判断动能、电势能和机械能的极值位置。',['A. E 点动能最小','B. B 点电势能最大','C. C 点机械能最大','D. E 点机械能最小'],'机械能的变化只由电场力功决定。沿电场力方向机械能增大，故在电场方向坐标最大的 C 点机械能最大。'),
('hw_09_crt_multiple','多9：示波管偏转计算','multiple-choice','ABCD','crt_multiple','homework-09-crt-multiple','电子由静止经加速电压 \(10U\)，进入长 \(l\)、间距 \(d\)、电压 \(U\) 的 XX\' 偏转板，板端至屏距离为 \(s\)。判断入射速度、出射速度、屏上偏移和总时间。',['A. 入射速度 \(v_0=\sqrt{20eU/m}\)','B. 离开偏转板速度 \(v=\sqrt{22eU/m}\)','C. 屏上偏移 \(x=l^2/(40d)+sl/(20d)\)','D. 从进入偏转板到屏的时间 \(t=(l+s)\sqrt{m/(20eU)}\)'],'加速区先求 \(v_0\)。偏转方向加速度为 \(eU/(md)\)，板内时间 \(l/v_0\)，板后水平速度不变；逐项代入可得四项均成立。'),
('hw_10_charge_plane','多10：异号电荷与竖直粗糙面','multiple-choice','AD','charge_plane','homework-10-charge-plane','两异号点电荷关于绝缘竖直平面对称。带电小物块沿平面由 A 经 O 滑到 B，A、B 关于 O 对称，到 B 恰停，判断电性、势能、A 点加速度和 O 点速度。',['A. 物块带负电','B. A 到 O 电势能不断减小','C. A 点加速度大小为题给表达式','D. 通过 O 点速度为 \(\sqrt2v_0/2\)'],'平面上电势处处为零，故势能不变，B 错。电场水平向左，要把物块压在平面上必须带负电，A 对。上下两段摩擦功关于 O 对称，结合到 B 停止可得 \(v_O=v_0/\sqrt2\)，D 对；C 的式子未保证为正却称“大小”，不成立。'),
('hw_11_alternating_field','多11：交变电场粒子源','multiple-choice','A','alternating_field','homework-11-alternating-field','长 \(8d\)、间距 \(d\) 的水平平行板间存在周期反向的匀强电场。O 点粒子源持续以水平速度 \(v_0\) 发射正粒子，忽略重力及碰板后的运动，判断最短飞行时间、最大动能及不同时刻发射粒子的去向。',['A. 最短运动时间为 \(\sqrt2d/v_0\)','B. 最大动能为 \(5mv_0^2/4\)','C. \(t=d/(2v_0)\) 发射者从 O\' 射出','D. \(t=3d/(2v_0)\) 发射者从 O\' 射出'],'按电场每段恒定分段积分纵向位移和速度。最短碰板时间为 \(\sqrt2d/v_0\)；最大动能为 \(3mv_0^2/4\)。C、D 两个相位发射的粒子都会先碰板，因此只有 A。'),
('hw_12_velocity_turn','多12：匀强场速度转向','multiple-choice','BC','velocity_turn','homework-12-velocity-turn','带电粒子仅受匀强电场力，从 O 到 A：初速度沿 \(+y\) 大小 \(v_0\)，末速度沿 \(+x\) 大小 \(2v_0\)。判断电荷符号、势能、最小动能和场力方向。',['A. 粒子带正电','B. A 点电势能比 O 点小','C. 最小动能为 \(2mv_0^2/5\)','D. 电场力方向与 x 正方向夹角正切为 2'],'匀强电场使速度矢量沿恒定加速度方向线性变化，\(\Delta\vec v=(2,-1)v_0\)。总动能增大故电势能降低；求速度线段到原点的最短距离，得 \(v_{min}^2=4v_0^2/5\)，即 \(E_{k,min}=2mv_0^2/5\)。'),
('hw_13_proton_field','多13：质子速度矢量变化','multiple-choice','ABC','proton_field','homework-13-proton-field','质子在匀强电场中先后经过同一水平线上的 A、B，速度分别为 \(\sqrt3v\)、\(v\)，方向与 AB 成 \(30^\circ\) 斜向上、\(60^\circ\) 斜向下，且 \(AB=L\)。判断电场方向、场强、时间和最小速度。',['A. 电场方向与水平线成 \(60^\circ\) 斜向左下','B. \(E=2mv^2/(qL)\)','C. 运动时间为 \(L/v\)','D. 最小速度为 \(v/2\)'],'分解两端速度，水平平均速度为 \(v\)，故 \(t=L/v\)。由 \(\Delta\vec v/t\) 得加速度方向和大小，进而得到 A、B；速度矢量线段到原点的最短距离为 \(\sqrt3v/2\)，D 错。'),
('hw_14_rotating_cylinder','多14：旋转圆筒记录波形','multiple-choice','AC','rotating_cylinder','homework-14-rotating-cylinder','电子经 \(U_0=200\,\mathrm V\) 加速后通过长、间距均为 \(10\,\mathrm{cm}\) 的偏转板，板电压 \(u=200\sin(2\pi t)\,\mathrm V\)。记录纸圆筒以 \(2\,\mathrm{r/s}\) 转动，沿不同轴线剪开后判断展开图。',['A. 图 A','B. 图 B','C. 图 C','D. 图 D'],'最大偏转为 \(7.5\,\mathrm{cm}\)。圆筒一周 \(0.5\,\mathrm s\)，恰为电压半周期，因此相邻两周留下互为相反相位的轨迹；不同剪开相位可得到 A 或 C。'),
]

def restore_latex(value):
    if isinstance(value, str):
        return (value.replace('\x0bec', r'\vec')
                     .replace('\x0barphi', r'\varphi')
                     .replace('\x0crac', r'\frac')
                     .replace('\tau', r'\tau')
                     .replace('\tfrac', r'\tfrac')
                     .replace('\times', r'\times')
                     .replace('\rmathrm', r'\mathrm'))
    if isinstance(value, list):
        return [restore_latex(item) for item in value]
    if isinstance(value, dict):
        return {key: restore_latex(item) for key, item in value.items()}
    return value

def problem(row):
    slug,title,kind,answer,variant,image,question,options,reason=row
    pid='autumn9_'+slug
    thinking='先辨认电场中的受力方向和不变量，再按运动阶段分别使用动能定理、分运动或速度矢量关系。'
    formula=r'\[qU=\Delta E_k,\qquad \vec v=\vec v_0+\vec a t,\qquad \vec r=\vec v_0t+\tfrac12\vec a t^2\]'
    return restore_latex({
      'id':pid,'chapter':CHAPTER,'title':title,'type':kind,'question':question,'options':options,'answer':answer,
      'analysis':{'title':'解析','sharedThinking':thinking,'sharedFormula':formula},
      'analysisPresentation':{'collapseEachStep':True,'optionMode':'shared-solution'},
      'steps':[
        {'stepId':1,'title':'条件提取','content':thinking},
        {'stepId':2,'title':'对应公式','content':formula},
        {'stepId':3,'title':'推导过程','content':reason},
        {'stepId':4,'title':'结论','content':f'答案为 **{answer}**。'}],
      'knowledge':['带电粒子在电场中的运动','示波器原理',title.split('：')[-1]],
      'practice':{'title':'进阶近似题：同考点迁移','question':f'保持“{title.split("：")[-1]}”的核心模型，改变电场方向、初始速度或几何尺度后，重新求解并说明临界条件。','answer':'先画受力与速度矢量图，分阶段列式；最终答案由改变后的参数确定。','thinking':'不只替换数字：先判断哪些量保持不变，再检查运动是否仍能到达原题所述边界。','difficulty':'equal-or-higher','upgradeType':'same-concept-structural-transfer'},
      'animation':{'enabled':True,'level':'animated','type':'electric_particle_model','variant':variant,'playable':True,'interactive':True,'notes':'按原题独立建模。','params':{'field':{'label':'场强系数','value':1,'min':0.5,'max':1.8,'step':0.1,'unit':'E'},'speed':{'label':'初速度系数','value':1,'min':0.5,'max':1.8,'step':0.1,'unit':'v'}},'timeline':{'duration':8,'loop':False}},
      'images':[{'src':f'assets/problem-images/autumn-lesson9/{image}.webp','alt':title+'原题印刷配图'}],
      'taxonomy':{'module':'电磁学','topic':CHAPTER,'modelId':'charged-particle-electric-field','modelName':'带电粒子电场运动','familyId':'autumn9-'+variant.replace('_','-'),'familyName':title.split('：')[-1],'role':'母题' if slug.startswith('course') else '条件变式','difficulty':3 if slug.startswith('course') else 4,'variantLevel':'L2','skills':['受力与运动分解','功与能量关系'],'prerequisites':['匀强电场','运动学','动能定理']}
    })

index_path=OUT/'index.json'
index=json.loads(index_path.read_text(encoding='utf-8'))
existing={item['id'] for item in index['problems']}
for row in ITEMS:
    data=problem(row)
    (OUT/f"{data['id']}.json").write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if data['id'] not in existing:
        index['problems'].append({'id':data['id'],'file':f"{data['id']}.json"})
index_path.write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('wrote',len(ITEMS),'problems')
