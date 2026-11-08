#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROBLEM_DIR = ROOT / 'data/problems'
PREFIXES = (
    'momentum_lesson1_', 'collision_lesson2_', 'momentum_practice_lesson3_',
    'coulomb_lesson4_', 'electric_lesson5_', 'electric_potential_lesson78_',
)

CURATED_ANALYSIS = {
    'electric_lesson5_course_01_field_definition': {
        'process': '先固定产生电场的场源和所考查的空间位置，再改变放入该点的试探电荷。这样可以区分“该点原有的电场”与“试探电荷受到的电场力”。',
        'formula': r'\[\vec E=\frac{\vec F}{q},\qquad \vec F=q\vec E\]',
        'derivation': (
            r'电场强度 \(\vec E\) 描述场源在某一位置产生的电场，是由场源电荷、空间位置和周围介质共同决定的，与是否放入试探电荷无关。' '\n\n'
            r'定义式 \(\vec E=\vec F/q\) 是比值定义式，不表示 \(\vec E\) 随 \(\vec F\) 增大或随 \(q\) 减小。若试探电荷由 \(q\) 变为 \(4q\)，由 \(\vec F=q\vec E\) 可知其受力也变为原来的 4 倍，因此 \(\vec F/q\) 仍不变。' '\n\n'
            r'场强方向规定为正试探电荷在该点的受力方向。若换成负试探电荷，电场力方向与 \(\vec E\) 相反，但该点场强的大小和方向均不改变；移去试探电荷，该点电场仍然存在。'
        ),
    },
}

CHAPTER_REVIEW = {
    '动量定理与动量守恒定律': '复核所选系统和正方向，确认对应方向上的外力冲量；再检查动量的矢量方向、单位以及末状态是否可达。',
    '碰撞与反冲': '先用总动量检查计算，再按碰撞类型核对动能是否可能增加，并确认碰后速度满足分离或共同运动条件。',
    '动量守恒定律习题课': '把各阶段连接处的速度和系统质量逐一核对；动量守恒只适用于外力冲量可忽略的方向，机械能条件需另行判断。',
    '电荷守恒定律与库仑定律': '检查电荷代数和、库仑力方向及距离平方关系；再用极限情况检验距离增大时库仑力应减小。',
    '电场强度与电势能': '检查场强的矢量方向、叠加方式和单位；带电粒子受力方向还必须结合电荷正负判断。',
    '电势、电势差与等势面': '检查电势与电势能的区别、电场力功的正负以及能量变化；沿电场线方向电势应降低。',
}

CHAPTER_FORMULA = {
    '动量定理与动量守恒定律': r'\[\vec I_{\mathrm{ext}}=\Delta\vec p,\qquad \vec I_{\mathrm{ext}}=0\Rightarrow\sum\vec p_i=\sum\vec p_f\]',
    '碰撞与反冲': r'\[\sum\vec p_i=\sum\vec p_f,\qquad E_{k,f}\le E_{k,i}\]',
    '动量守恒定律习题课': r'\[\vec I_{\mathrm{ext}}=\Delta\vec p,\qquad \sum\vec p_i=\sum\vec p_f\]',
    '电荷守恒定律与库仑定律': r'\[\sum q_{\mathrm{before}}=\sum q_{\mathrm{after}},\qquad F=k\frac{|q_1q_2|}{r^2}\]',
    '电场强度与电势能': r'\[\vec F=q\vec E,\qquad \vec E=\sum_i\vec E_i\]',
    '电势、电势差与等势面': r'\[W_{AB}=q(\varphi_A-\varphi_B)=-\Delta E_p,\qquad E_x=-\frac{d\varphi}{dx}\]',
}

def text(value):
    return value.strip() if isinstance(value, str) else ''

def unique(parts):
    result = []
    for part in parts:
        part = text(part)
        if part and part not in result:
            result.append(part)
    return result

def answer_letters(problem):
    answer = text(problem.get('answer')).upper()
    return set(re.findall(r'[A-H]', answer))

def option_letter(option, index):
    value = option.get('label') if isinstance(option, dict) else option
    match = re.match(r'\s*([A-H])[.．、:：]?\s*', str(value or ''), re.I)
    return match.group(1).upper() if match else chr(65 + index)

def build_option_lines(problem):
    analyses = problem.get('optionAnalyses') or []
    if analyses:
        lines = []
        for index, item in enumerate(analyses):
            letter = text(item.get('option')) or chr(65 + index)
            judgment = text(item.get('judgment')) or text(item.get('content'))
            title = text(item.get('title'))
            lines.append(f'{letter}：{judgment or title}')
        return lines
    options = problem.get('options') or []
    correct = answer_letters(problem)
    return [
        f'{option_letter(option, index)}：' + ('与上述推导结果一致，正确。' if option_letter(option, index) in correct else '与上述方程或物理约束不符，错误。')
        for index, option in enumerate(options)
    ]

def existing_parts(problem):
    steps = problem.get('steps') or []
    process = text((problem.get('analysis') or {}).get('sharedThinking'))
    formula = text((problem.get('analysis') or {}).get('sharedFormula'))
    derivation = []
    for step in steps:
        title = text(step.get('title'))
        content = text(step.get('content'))
        if not content:
            continue
        if not process and re.search('条件|思路|过程', title):
            process = content
        if not formula and re.search('公式|方程', title):
            formula = content
        if re.search('计算|推导|建模|判断|系统|方程', title) and content not in {process, formula}:
            derivation.append(content)
    if not derivation:
        derivation = [text(step.get('content')) for step in steps[1:-1]]
    return process, formula, '\n\n'.join(unique(derivation))

def upgrade(problem):
    chapter = problem.get('chapter', '')
    process, formula, derivation = existing_parts(problem)
    curated = CURATED_ANALYSIS.get(problem.get('id'), {})
    process = curated.get('process', process)
    formula = curated.get('formula', formula)
    derivation = curated.get('derivation', derivation)
    process = process or '先明确研究对象、过程边界和正方向，再根据受力、运动阶段及守恒条件建立方程。'
    formula = formula or CHAPTER_FORMULA[chapter]
    derivation = derivation or '将题设量代入上述方程，按运动或相互作用阶段依次求解，并在阶段连接处保持状态量连续。'
    option_lines = build_option_lines(problem)
    review = CHAPTER_REVIEW[chapter]
    animation = problem.get('animation') or {}
    notes = text(animation.get('notes'))
    skills = ((problem.get('taxonomy') or {}).get('skills') or [])
    focus = '、'.join(str(item) for item in skills[:2]) or '关键状态和图像变化'
    observation = (notes + ' ') if notes else ''
    observation += f'播放时重点观察“{focus}”；对照右侧图像检查转折点、碰撞/平衡时刻或能量与动量变化是否和推导一致。'
    conclusion = f"答案为 **{text(problem.get('answer'))}**。"
    common = [
        {'stepId': 1, 'title': '物理过程与条件', 'content': process},
        {'stepId': 2, 'title': '建模与专用公式', 'content': formula},
        {'stepId': 3, 'title': '完整分析与推导', 'content': derivation},
    ]
    presentation = problem.setdefault('analysisPresentation', {})
    presentation['collapseEachStep'] = True
    mode = presentation.get('optionMode', 'shared-solution')
    if mode == 'independent-statements' and problem.get('options'):
        problem['analysisLeadSteps'] = common
        problem['analysisSupplementSteps'] = [
            {'stepId': 5, 'title': '答案复核', 'content': review},
            {'stepId': 6, 'title': '动画观察点', 'content': observation},
            {'stepId': 7, 'title': '结论', 'content': conclusion},
        ]
        if not problem.get('optionAnalyses'):
            problem['optionAnalyses'] = [
                {'option': option_letter(option, index), 'title': str(option), 'judgment': option_lines[index].split('：', 1)[-1]}
                for index, option in enumerate(problem.get('options') or [])
            ]
    else:
        steps = list(common)
        if option_lines:
            steps.append({'stepId': 4, 'title': '逐项判断', 'content': '\n\n'.join(option_lines)})
        steps.extend([
            {'stepId': 5, 'title': '答案复核', 'content': review},
            {'stepId': 6, 'title': '动画观察点', 'content': observation},
            {'stepId': 7, 'title': '结论', 'content': conclusion},
        ])
        problem['steps'] = steps
        problem.pop('analysisLeadSteps', None)
        problem.pop('analysisSupplementSteps', None)
    analysis = problem.setdefault('analysis', {'title': '解析'})
    analysis['title'] = '解析'
    analysis['sharedThinking'] = process
    analysis['sharedFormula'] = formula
    return problem

updated = []
for path in sorted(PROBLEM_DIR.glob('*.json')):
    data = json.loads(path.read_text(encoding='utf-8'))
    if not data.get('id', '').startswith(PREFIXES):
        continue
    path.write_text(json.dumps(upgrade(data), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    updated.append(data['id'])
print(f'upgraded {len(updated)} autumn lesson 1-8 problems')
