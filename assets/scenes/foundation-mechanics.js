// Problem-specific scenes for legacy force-equilibrium and spring exercises.

function getFoundationMechanicsValues() {
  var animation = (problemDataMap[currentScene] || {}).animation || {};
  var state = getJsonAnimationState(currentScene);
  var duration = getJsonDuration(currentScene);
  var progress = constrain(state.time / Math.max(0.01, duration), 0, 1);
  return {
    variant: animation.variant || "force_equilibrium",
    load: Math.max(0.1, getJsonParam(currentScene, "load", 1)),
    angle: getJsonParam(currentScene, "angle", 35) * Math.PI / 180,
    stiffness: Math.max(0.1, getJsonParam(currentScene, "stiffness", 1)),
    progress: progress,
    eased: 0.5 - 0.5 * Math.cos(Math.PI * progress)
  };
}

function drawFoundationSpring(x, y1, y2, width, turns, colorHex) {
  var i;
  var step = (y2 - y1) / (turns * 2 + 2);
  stroke(colorHex || "#2563eb");
  strokeWeight(2.4);
  noFill();
  beginShape();
  vertex(x, y1);
  vertex(x, y1 + step);
  for (i = 0; i < turns * 2; i++) {
    vertex(x + (i % 2 === 0 ? -width : width), y1 + step * (i + 2));
  }
  vertex(x, y2 - step);
  vertex(x, y2);
  endShape();
}

function drawFoundationLabel(textValue, x, y, colorHex, size) {
  noStroke();
  fill(colorHex || "#334155");
  textAlign(LEFT, TOP);
  textSize(size || 14);
  text(textValue, x, y);
}

function drawFoundationBlock(x, y, width, height, label, colorHex) {
  fill(colorHex || "#dbeafe");
  stroke("#1e3a8a");
  strokeWeight(2);
  rect(x, y, width, height, 6);
  noStroke();
  fill("#0f172a");
  textAlign(CENTER, CENTER);
  textSize(15);
  text(label || "", x + width / 2, y + height / 2);
}

function drawFoundationForceArrow(x, y, dx, dy, colorHex, label) {
  drawVectorArrow(x, y, dx, dy, colorHex, label);
}

function drawFoundationSceneHeader(title, subtitle) {
  noStroke();
  fill("#0f172a");
  textAlign(LEFT, TOP);
  textSize(20);
  text(title, 24, 22);
  fill("#475569");
  textSize(14);
  text(subtitle, 24, 50);
}

function drawFoundationSpringArrangement(values) {
  drawFoundationSceneHeader("两弹簧、两物块的排列比较", "载荷越大、劲度越小，伸长量越大");
  var columns = [
    { x: 155, title: "软簧承受较大载荷", topK: 0.72, topMass: "m₁", bottomMass: "m₂" },
    { x: 410, title: "硬簧承受较大载荷", topK: 1.35, topMass: "m₁", bottomMass: "m₂" }
  ];
  columns.forEach(function (item, index) {
    var extension = 54 * values.load / (item.topK * values.stiffness);
    stroke("#334155");
    strokeWeight(4);
    line(item.x - 55, 88, item.x + 55, 88);
    drawFoundationSpring(item.x, 88, 155 + extension, 14, 7, index === 0 ? "#dc2626" : "#2563eb");
    drawFoundationBlock(item.x - 28, 155 + extension, 56, 38, item.topMass, "#fef3c7");
    drawFoundationSpring(item.x, 193 + extension, 280 + extension * 0.55, 13, 6, "#0ea5e9");
    drawFoundationBlock(item.x - 28, 280 + extension * 0.55, 56, 38, item.bottomMass, "#dcfce7");
    drawFoundationLabel(item.title, item.x - 92, 390, index === 0 ? "#b91c1c" : "#1d4ed8", 14);
  });
  drawFoundationLabel("总伸长由每根弹簧的 F/k 相加", 148, 440, "#0f172a", 15);
}

function drawFoundationMagneticBox(values) {
  drawFoundationSceneHeader("磁性盒子受力变化", "放入笔后重力与静摩擦同步增大，磁力不由此自动改变");
  var wallX = 360;
  var boxY = 205 + 14 * Math.sin(values.progress * Math.PI * 2);
  stroke("#64748b");
  strokeWeight(8);
  line(wallX, 90, wallX, 430);
  for (var i = 0; i < 12; i++) {
    stroke("#cbd5e1");
    strokeWeight(1);
    line(wallX + 4, 100 + i * 27, wallX + 28, 88 + i * 27);
  }
  drawFoundationBlock(wallX - 122, boxY, 112, 92, "磁性盒", "#e0f2fe");
  var penY = 126 + values.eased * 88;
  stroke("#b45309");
  strokeWeight(7);
  line(wallX - 64, penY, wallX - 44, penY + 66);
  drawFoundationForceArrow(wallX - 66, boxY + 90, 0, 84 * values.load, "#dc2626", "G");
  drawFoundationForceArrow(wallX - 42, boxY + 4, 0, -84 * values.load, "#16a34a", "f");
  drawFoundationForceArrow(wallX - 12, boxY + 46, -72, 0, "#2563eb", "磁力");
  drawFoundationForceArrow(wallX - 118, boxY + 46, 72, 0, "#7c3aed", "N");
  drawFoundationLabel("笔进入盒中", 76, 145, "#92400e", 15);
}

function drawFoundationBrushPen(values) {
  drawFoundationSceneHeader("毛笔与笔架的静力平衡", "笔架支持力垂直笔杆，桌面摩擦平衡其水平分量");
  var baseX = 130;
  var baseY = 390;
  var tipX = 392;
  var tipY = 150;
  stroke("#111827");
  strokeWeight(4);
  line(42, baseY, 530, baseY);
  stroke("#7c3aed");
  strokeWeight(12);
  line(baseX, baseY - 4, tipX, tipY);
  var supportX = 300;
  var supportY = 235;
  stroke("#64748b");
  strokeWeight(5);
  line(supportX, baseY, supportX, supportY + 24);
  line(supportX - 32, supportY + 24, supportX + 32, supportY + 24);
  drawFoundationForceArrow(248, 278, 0, 92 * values.load, "#dc2626", "G");
  drawFoundationForceArrow(baseX, baseY - 4, 0, -82, "#2563eb", "N桌");
  drawFoundationForceArrow(baseX, baseY - 4, 72, 0, "#f59e0b", "f");
  drawFoundationForceArrow(supportX, supportY, -55, -60, "#16a34a", "N架");
}

function drawFoundationSpringBalance(values) {
  drawFoundationSceneHeader("弹簧测力计两种固定方式", "读数取决于弹簧传递的力，不一定等于外加拉力");
  [165, 405].forEach(function (x, index) {
    stroke("#334155");
    strokeWeight(4);
    line(x - 52, 92, x + 52, 92);
    drawFoundationSpring(x, 92, 240 + 24 * values.eased, 14, 8, "#2563eb");
    fill("#f8fafc");
    stroke("#64748b");
    strokeWeight(2);
    rect(x - 42, 128, 84, 148, 10);
    drawFoundationForceArrow(x, 272, 0, -75 * values.load, "#16a34a", "F₀");
    drawFoundationForceArrow(x + 32, 200, 0, 64, "#dc2626", "G");
    drawFoundationLabel(index === 0 ? "外壳固定" : "圆环固定", x - 46, 320, "#0f172a", 15);
    drawFoundationLabel(index === 0 ? "示数 F₀-G" : "示数 F₀+G", x - 53, 350, index === 0 ? "#1d4ed8" : "#b45309", 15);
  });
}

function drawFoundationElasticDirections(values) {
  drawFoundationSceneHeader("四种接触中的弹力方向", "先确认接触与形变，再沿接触面法线或绳方向判断");
  var labels = ["车厢与小球", "斜面与小球", "双绳结点", "两球接触"];
  for (var i = 0; i < 4; i++) {
    var x = 38 + (i % 2) * 260;
    var y = 92 + Math.floor(i / 2) * 170;
    fill(i === Math.floor(values.progress * 4) % 4 ? "#eff6ff" : "#f8fafc");
    stroke("#cbd5e1");
    strokeWeight(2);
    rect(x, y, 232, 140, 8);
    noStroke();
    fill("#0f172a");
    circle(x + 112, y + 74, 34);
    if (i === 0) drawFoundationForceArrow(x + 112, y + 74, 0, -54, "#2563eb", "N");
    if (i === 1) drawFoundationForceArrow(x + 112, y + 74, -38, -38, "#2563eb", "N");
    if (i === 2) {
      line(x + 112, y + 74, x + 52, y + 26);
      line(x + 112, y + 74, x + 190, y + 42);
      drawFoundationForceArrow(x + 112, y + 74, 48, -32, "#16a34a", "T");
    }
    if (i === 3) {
      circle(x + 152, y + 74, 34);
      drawFoundationForceArrow(x + 112, y + 74, -52, 0, "#f59e0b", "N");
    }
    drawFoundationLabel(labels[i], x + 12, y + 108, "#334155", 14);
  }
}

function drawFoundationInclineBall(values, withWall) {
  drawFoundationSceneHeader(
    withWall ? "斜面、墙与小球平衡" : "斜面上悬挂小球",
    withWall ? "墙面支持力只能推，临界时恰好为零" : "拉力沿绳，支持力垂直斜面"
  );
  var angle = values.angle;
  var cx = 310;
  var cy = 300;
  stroke("#111827");
  strokeWeight(4);
  line(70, 410, 500, 410 - Math.tan(angle) * 260);
  if (withWall) {
    line(500, 90, 500, 410);
  }
  noStroke();
  fill("#f97316");
  circle(cx, cy, 54);
  if (!withWall) {
    stroke("#7c3aed");
    strokeWeight(3);
    line(cx, cy, 430, 100);
    drawFoundationForceArrow(cx, cy, 46, -76, "#7c3aed", "T");
  } else {
    drawFoundationForceArrow(cx, cy, 88 * values.load, 0, "#16a34a", "F");
    drawFoundationForceArrow(cx, cy, -62, 0, "#7c3aed", "N墙");
  }
  drawFoundationForceArrow(cx, cy, 0, 90, "#dc2626", "G");
  drawFoundationForceArrow(cx, cy, -58 * Math.sin(angle), -58 * Math.cos(angle), "#2563eb", "N斜");
}

function drawFoundationTwoBodySpring(values, displacementMode) {
  drawFoundationSceneHeader(
    displacementMode ? "缓慢上提两弹簧连接体" : "压缩弹簧连接两物体",
    displacementMode ? "比较初、末形变量并累加几何位移" : "隔离 A、B 后分别列竖直平衡方程"
  );
  var shift = displacementMode ? 80 * values.eased : 0;
  stroke("#334155");
  strokeWeight(4);
  line(170, 74, 400, 74);
  drawFoundationSpring(285, 74, 170 - shift, 14, 6, "#2563eb");
  drawFoundationBlock(242, 170 - shift, 86, 48, "A", "#dbeafe");
  drawFoundationSpring(285, 218 - shift, 316 - shift * 0.45, 14, 6, "#f59e0b");
  drawFoundationBlock(242, 316 - shift * 0.45, 86, 48, "B", "#dcfce7");
  stroke("#111827");
  strokeWeight(4);
  line(130, 400, 440, 400);
  drawFoundationForceArrow(242, 194 - shift, 0, 68 * values.load, "#dc2626", "G_A");
  drawFoundationForceArrow(328, 340 - shift * 0.45, 0, 74 * values.load, "#dc2626", "G_B");
  if (displacementMode) {
    drawFoundationForceArrow(385, 300, 0, -95 * values.eased, "#16a34a", "上提");
  }
}

function drawFoundationDesk(values) {
  drawFoundationSceneHeader("光点放大桌面的微小形变", "微小转角经过长光路后转化为明显光点位移");
  var bend = 10 + 18 * values.eased * values.load;
  noFill();
  stroke("#475569");
  strokeWeight(8);
  beginShape();
  vertex(70, 310);
  bezierVertex(210, 310 + bend, 360, 310 + bend, 500, 310);
  endShape();
  line(120, 310, 120, 430);
  line(450, 310, 450, 430);
  var mirrorX = 285;
  var mirrorY = 310 + bend;
  stroke("#0ea5e9");
  strokeWeight(5);
  line(mirrorX - 24, mirrorY + 4, mirrorX + 24, mirrorY - 4);
  stroke("#f59e0b");
  strokeWeight(2.5);
  line(80, 155, mirrorX, mirrorY);
  var spotX = 390 + 90 * values.eased;
  line(mirrorX, mirrorY, spotX, 86);
  noStroke();
  fill("#dc2626");
  circle(spotX, 86, 15);
  drawFoundationForceArrow(mirrorX, 120, 0, 90 * values.load, "#7c3aed", "手按");
}

function drawFoundationTightrope(values) {
  drawFoundationSceneHeader("走钢丝的重心与稳定", "长杆降低并调节整体重心，使重力作用线更容易通过支承区域");
  var sway = (values.eased - 0.5) * 80;
  stroke("#111827");
  strokeWeight(3);
  line(38, 390, 532, 390);
  stroke("#7c3aed");
  strokeWeight(7);
  line(100 + sway, 245, 470 + sway, 275);
  noStroke();
  fill("#0f172a");
  circle(285 + sway, 188, 38);
  stroke("#0f172a");
  strokeWeight(8);
  line(285 + sway, 208, 285 + sway, 318);
  line(285 + sway, 318, 265, 390);
  line(285 + sway, 318, 305, 390);
  noStroke();
  fill("#dc2626");
  circle(285 + sway * 0.25, 285, 15);
  drawFoundationLabel("重心", 300 + sway * 0.25, 276, "#b91c1c", 14);
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(285 + sway * 0.25, 285, 285 + sway * 0.25, 390);
  drawingContext.setLineDash([]);
}

function drawFoundationStacked(values) {
  drawFoundationSceneHeader("叠放物体中的接触力", "支持力来自接触面的形变，只存在于直接接触的物体之间");
  stroke("#111827");
  strokeWeight(4);
  line(100, 420, 470, 420);
  var widths = [190, 150, 110];
  var labels = ["C", "B", "A"];
  for (var i = 0; i < 3; i++) {
    var y = 350 - i * 68 - values.eased * (2 - i) * 4;
    drawFoundationBlock(285 - widths[i] / 2, y, widths[i], 58, labels[i], ["#dbeafe", "#dcfce7", "#fef3c7"][i]);
    drawFoundationForceArrow(285, y + 56, 0, 38 + i * 10, "#dc2626", "G" + labels[i]);
  }
}

function drawFoundationExperimentMethods(values) {
  drawFoundationSceneHeader("四种力学实验方法", "动画依次突出：规范表示、悬挂定位、理想化、微小量放大");
  var names = ["力的示意", "悬挂定重心", "理想斜面", "光点放大形变"];
  var active = Math.min(3, Math.floor(values.progress * 4));
  for (var i = 0; i < 4; i++) {
    var x = 34 + (i % 2) * 260;
    var y = 92 + Math.floor(i / 2) * 170;
    fill(i === active ? "#eff6ff" : "#f8fafc");
    stroke(i === active ? "#2563eb" : "#cbd5e1");
    strokeWeight(i === active ? 3 : 1.5);
    rect(x, y, 232, 140, 8);
    drawFoundationLabel(names[i], x + 16, y + 14, "#0f172a", 15);
    if (i === 0) drawFoundationForceArrow(x + 60, y + 88, 92, -36, "#dc2626", "F");
    if (i === 1) {
      line(x + 116, y + 44, x + 116, y + 110);
      circle(x + 116, y + 84, 46);
    }
    if (i === 2) {
      line(x + 36, y + 108, x + 190, y + 54);
      circle(x + 68 + values.eased * 90, y + 96 - values.eased * 31, 18);
    }
    if (i === 3) {
      line(x + 40, y + 104, x + 190, y + 104);
      line(x + 110, y + 104, x + 175, y + 46);
      fill("#dc2626");
      noStroke();
      circle(x + 175 + 24 * values.eased, y + 46, 10);
    }
  }
}

function drawFoundationMechanicsScene() {
  var values = getFoundationMechanicsValues();
  if (values.variant === "spring_arrangement") drawFoundationSpringArrangement(values);
  else if (values.variant === "magnetic_box") drawFoundationMagneticBox(values);
  else if (values.variant === "brush_pen") drawFoundationBrushPen(values);
  else if (values.variant === "spring_balance_reading") drawFoundationSpringBalance(values);
  else if (values.variant === "elastic_direction") drawFoundationElasticDirections(values);
  else if (values.variant === "incline_suspended_ball") drawFoundationInclineBall(values, false);
  else if (values.variant === "two_body_spring") drawFoundationTwoBodySpring(values, false);
  else if (values.variant === "desk_deformation") drawFoundationDesk(values);
  else if (values.variant === "tightrope") drawFoundationTightrope(values);
  else if (values.variant === "series_springs") drawFoundationSpringArrangement(values);
  else if (values.variant === "spring_displacement") drawFoundationTwoBodySpring(values, true);
  else if (values.variant === "stacked_bodies") drawFoundationStacked(values);
  else if (values.variant === "ball_wall_incline") drawFoundationInclineBall(values, true);
  else drawFoundationExperimentMethods(values);
}

function drawFoundationRelationBars(title, subtitle, labels, values, colors) {
  drawGraphFrame(title, subtitle);
  var gx = graphLeft + 48;
  var gy = 112;
  var gw = graphRight - gx - 34;
  var rowHeight = 86;
  var maximum = Math.max.apply(null, values.concat([1]));
  for (var i = 0; i < labels.length; i++) {
    var y = gy + i * rowHeight;
    noStroke();
    fill(i % 2 === 0 ? "#f8fafc" : "#f1f5f9");
    rect(gx, y, gw, 62, 5);
    fill(colors[i] || "#2563eb");
    rect(gx, y + 31, gw * values[i] / maximum, 18, 4);
    fill("#0f172a");
    textAlign(LEFT, TOP);
    textSize(14);
    text(labels[i], gx + 8, y + 7);
    textAlign(RIGHT, TOP);
    text(values[i].toFixed(2), gx + gw - 8, y + 7);
  }
}

function drawFoundationSpringGraph(values) {
  drawGraphFrame("弹力-形变量关系", "斜率表示劲度系数；串联时总形变量相加");
  var gx = graphLeft + 54;
  var gy = 94;
  var gw = graphRight - gx - 38;
  var gh = 310;
  var k = values.stiffness;
  drawSimpleCurve(gx, gy, gw, gh, 2, 4, "#2563eb", function (x) { return k * x; });
  drawSimpleCurve(gx, gy, gw, gh, 2, 4, "#f59e0b", function (x) { return 0.65 * k * x; });
  drawFoundationLabel("蓝：较硬弹簧", graphLeft + 60, 420, "#1d4ed8", 14);
  drawFoundationLabel("橙：较软或串联等效弹簧", graphLeft + 205, 420, "#b45309", 14);
}

function drawFoundationMechanicsGraph() {
  var values = getFoundationMechanicsValues();
  if (
    values.variant === "spring_arrangement" ||
    values.variant === "spring_balance_reading" ||
    values.variant === "two_body_spring" ||
    values.variant === "series_springs" ||
    values.variant === "spring_displacement"
  ) {
    drawFoundationSpringGraph(values);
    return;
  }
  if (values.variant === "desk_deformation") {
    drawFoundationRelationBars(
      "放大关系",
      "光点位移随桌面微小形变增大",
      ["桌面形变量", "镜面转角", "光点位移"],
      [0.25 * values.load, 0.55 * values.load, 1.8 * values.load],
      ["#2563eb", "#0ea5e9", "#dc2626"]
    );
    return;
  }
  if (values.variant === "experiment_methods") {
    drawFoundationRelationBars(
      "实验信息层级",
      "观察量经过方法转换后变得可判别",
      ["原始微小量", "转换后的可见量", "可作出的物理判断"],
      [0.35, 1.1, 1.65],
      ["#64748b", "#0ea5e9", "#16a34a"]
    );
    return;
  }
  drawFoundationRelationBars(
    "平衡分量",
    "同一研究对象的各方向合力必须分别为零",
    ["重力或载荷", "支持/拉力分量", "摩擦或侧向分量"],
    [
      values.load,
      values.load / Math.max(0.25, Math.cos(values.angle)),
      values.load * Math.tan(values.angle)
    ],
    ["#dc2626", "#2563eb", "#f59e0b"]
  );
}

registerSceneRenderer(
  "foundation_mechanics_model",
  drawFoundationMechanicsScene,
  drawFoundationMechanicsGraph
);
