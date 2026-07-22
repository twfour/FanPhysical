// Circular-motion daily scene and graph renderers.

function dailyParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function drawDailyRoad(x1, y1, x2, y2, colorHex) {
  stroke(colorHex || "#111827");
  strokeWeight(5);
  line(x1, y1, x2, y2);
  stroke("#cbd5e1");
  strokeWeight(1.5);
  for (var i = 0; i <= 8; i++) {
    var x = lerp(x1, x2, i / 8);
    var y = lerp(y1, y2, i / 8);
    line(x - 12, y + 18, x + 12, y - 18);
  }
}

function drawDailyCar(x, y, angle, colorHex, labelText) {
  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  fill(colorHex || "#2563eb");
  rect(-28, -14, 56, 28, 7);
  fill("#dbeafe");
  rect(-10, -11, 20, 22, 4);
  fill("#111827");
  circle(-18, 16, 9);
  circle(18, 16, 9);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(11);
  text(labelText || "", 0, 0);
  pop();
}

function drawDailyBankedCurveScene() {
  var values = getJsonCircularValues();
  var theta = constrain(dailyParam("theta", 18), 0, 45) * Math.PI / 180;
  var mu = dailyParam("mu", 0.35);
  var speed = dailyParam("speed", 18);
  var radius = dailyParam("radius", 60);
  var isPlane = currentScene === "circular_daily_a2_airplane_turn";
  var ideal = Math.sqrt(values.g * radius * Math.tan(theta));
  var need = speed * speed / Math.max(1, radius);
  var idealAcc = values.g * Math.tan(theta);
  var diff = need - idealAcc;
  var period = Math.max(1.6, getJsonDuration(currentScene));
  var travel = (values.time % period) / period;
  var carX = lerp(122, 460, travel);
  var carY = lerp(318, 202, travel);
  var orbitCx = 282;
  var orbitCy = 354;
  var orbitR = 76;
  var orbitAngle = -Math.PI * 0.8 + travel * Math.PI * 1.45;
  drawDailyRoad(108, 324, 476, 198, "#334155");
  stroke("#cbd5e1");
  strokeWeight(1.5);
  noFill();
  arc(orbitCx, orbitCy, 2 * orbitR, 2 * orbitR, -Math.PI * 0.95, Math.PI * 0.55);
  noStroke();
  fill(isPlane ? "#0ea5e9" : "#f97316");
  circle(orbitCx + orbitR * Math.cos(orbitAngle), orbitCy + orbitR * Math.sin(orbitAngle), 14);
  drawDailyCar(carX, carY, -theta, isPlane ? "#0ea5e9" : "#2563eb", isPlane ? "机" : "车");
  drawVectorArrow(carX, carY - 8, 0, 82, "#64748b", "G");
  drawVectorArrow(carX, carY, -74 * Math.sin(theta), -74 * Math.cos(theta), "#2563eb", isPlane ? "L" : "N");
  drawVectorArrow(carX, carY, -72, 0, "#dc2626", "向心");
  drawVectorArrow(carX, carY + 18, diff >= 0 ? -70 : 70, diff >= 0 ? -18 : 18, "#f97316", "f");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(isPlane ? "飞机水平盘旋升力" : "弯道侧滑临界", 28, 28);
  fill("#334155");
  textSize(14);
  text(isPlane ? "升力竖直分量平衡重力，水平分量提供向心力" : "理想速度 v₀=√(rg tanθ)，摩擦只负责偏离 v₀ 的部分", 28, 54);
  text("v=" + speed.toFixed(1) + "，v₀=" + ideal.toFixed(1) + "，" + (isPlane ? "倾角=" + (theta * 180 / Math.PI).toFixed(0) + "°" : "μ=" + mu.toFixed(2)), 28, 78);
}

function drawDailyBankedCurveGraph() {
  var values = getJsonCircularValues();
  var theta = constrain(dailyParam("theta", 18), 0, 45) * Math.PI / 180;
  var mu = dailyParam("mu", 0.35);
  var radius = dailyParam("radius", 60);
  var speed = dailyParam("speed", 18);
  var vmax = Math.max(12, speed * 1.6);
  var idealAcc = values.g * Math.tan(theta);
  drawGraphFrame("侧向摩擦需求-速度", "蓝线：|v²/r-g tanθ|；红线：μg");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = Math.max(mu * values.g, vmax * vmax / radius) * 1.1;
  drawSimpleCurve(gx, gy, gw, gh, vmax, yMax, "#2563eb", function (v) { return Math.abs(v * v / radius - idealAcc); });
  stroke("#dc2626");
  strokeWeight(2);
  var limitY = map(mu * values.g, 0, yMax, gy + gh, gy);
  line(gx, limitY, gx + gw, limitY);
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, vmax), vmax);
}

function drawDailyConicalCylinderScene() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 53) * Math.PI / 180;
  var omega = values.omega;
  var t = values.time;
  var axisX = 286;
  var topY = 98;
  var bottomY = 386;
  var topR = 148;
  var blockR = 76;
  var blockY = 250;
  var spin = omega * t;
  var blockX = axisX + blockR * Math.cos(spin);
  stroke("#111827");
  strokeWeight(3);
  line(axisX, topY - 20, axisX, bottomY + 20);
  line(axisX - topR, topY, axisX, bottomY);
  line(axisX + topR, topY, axisX, bottomY);
  stroke("#94a3b8");
  strokeWeight(1.5);
  noFill();
  ellipse(axisX, blockY, 2 * blockR, 26);
  ellipse(axisX, topY, 2 * topR, 36);
  noStroke();
  fill("#f97316");
  rect(blockX - 18, blockY - 18, 36, 36, 7);
  drawVectorArrow(blockX, blockY, axisX > blockX ? 64 : -64, 0, "#dc2626", "向心");
  drawVectorArrow(blockX, blockY, -48 * Math.cos(theta), -48 * Math.sin(theta), "#2563eb", "N");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("粗糙圆锥筒中物块", 28, 28);
  fill("#334155");
  textSize(14);
  text("A 点半径 R/2；摩擦为零时由支持力分量供向心力", 28, 54);
  text("ω=" + omega.toFixed(1) + "，θ≈" + (theta * 180 / Math.PI).toFixed(0) + "°", 28, 78);
}

function drawDailyConicalCylinderGraph() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 53) * Math.PI / 180;
  var radius = Math.max(0.1, dailyParam("radius", 0.5));
  var omega0 = Math.sqrt(values.g / radius / Math.tan(theta));
  drawGraphFrame("摩擦方向-角速度", "蓝线：所需向心加速度；红线：无摩擦临界");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var wMax = 6;
  var yMax = wMax * wMax * radius;
  drawSimpleCurve(gx, gy, gw, gh, wMax, yMax, "#2563eb", function (w) { return w * w * radius; });
  stroke("#dc2626");
  strokeWeight(2);
  var x0 = constrain(map(omega0, 0, wMax, gx, gx + gw), gx, gx + gw);
  line(x0, gy, x0, gy + gh);
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.omega, wMax), wMax);
}

function drawDailyHillyRoadScene() {
  var values = getJsonCircularValues();
  var speed = dailyParam("speed", 20);
  var radius = dailyParam("radius", 80);
  var phase = (values.omega * values.time) % (2 * Math.PI);
  var x = 88 + 396 * (phase / (2 * Math.PI));
  var y = 300 + 72 * Math.sin(phase);
  stroke("#111827");
  strokeWeight(5);
  noFill();
  beginShape();
  for (var i = 0; i <= 160; i++) {
    var p = i / 160;
    vertex(80 + 410 * p, 300 + 72 * Math.sin(p * 2 * Math.PI));
  }
  endShape();
  drawDailyCar(x, y - 20, 0, "#f97316", "车");
  drawVectorArrow(x, y - 24, 0, 72, "#64748b", "G");
  drawVectorArrow(x + 34, y - 12, 0, phase < Math.PI ? -80 : 92, "#16a34a", "N");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("丘陵路面爆胎位置", 28, 28);
  fill("#334155");
  textSize(14);
  text("谷底：N=mg+mv²/r 最大；桥顶：N=mg-mv²/r", 28, 54);
  text("谷底更容易爆胎", 28, 78);
}

function drawDailyHillyRoadGraph() {
  var values = getJsonCircularValues();
  var speed = dailyParam("speed", 20);
  var radius = dailyParam("radius", 80);
  var maxV = Math.max(25, speed * 1.5);
  drawGraphFrame("支持力-速度", "橙线谷底更大，蓝线桥顶更小");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = values.g + maxV * maxV / radius;
  drawSimpleCurve(gx, gy, gw, gh, maxV, yMax, "#f97316", function (v) { return values.g + v * v / radius; });
  drawSimpleCurve(gx, gy, gw, gh, maxV, yMax, "#2563eb", function (v) { return Math.max(0, values.g - v * v / radius); });
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, maxV), maxV);
}

function drawDailyCentrifugeScene() {
  var values = getJsonCircularValues();
  var omega = values.omega;
  var t = values.time;
  var cx = 250;
  var cy = 250;
  var tubeAngle = omega * t - Math.PI / 5;
  stroke("#111827");
  strokeWeight(3);
  line(cx, cy, cx + 175 * Math.cos(tubeAngle), cy + 175 * Math.sin(tubeAngle));
  noStroke();
  fill("#111827");
  circle(cx, cy, 18);
  push();
  translate(cx + 118 * Math.cos(tubeAngle), cy + 118 * Math.sin(tubeAngle));
  rotate(tubeAngle);
  fill("#e0f2fe");
  stroke("#0284c7");
  strokeWeight(2);
  rect(-20, -42, 180, 84, 18);
  noStroke();
  fill("#2563eb");
  circle(22 - 18 * Math.sin(t), -15, 18);
  fill("#dc2626");
  circle(104 + 24 * Math.sin(t), 18, 18);
  fill("#111827");
  textAlign(CENTER, CENTER);
  textSize(11);
  text("a", 22 - 18 * Math.sin(t), -15);
  text("b", 104 + 24 * Math.sin(t), 18);
  pop();
  drawVectorArrow(cx + 230, cy, 76, 0, "#dc2626", "模拟重力");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("离心分离血液", 28, 28);
  fill("#334155");
  textSize(14);
  text("等效加速度 a=ω²r，向外且随半径增大", 28, 54);
  text("轻细胞向内，重细胞向外", 28, 78);
}

function drawDailyCentrifugeGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("模拟重力加速度-半径", "a=ω²r，越远离转轴越大");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var rMax = 2;
  var yMax = values.omega * values.omega * rMax * 1.2;
  drawSimpleCurve(gx, gy, gw, gh, rMax, yMax, "#dc2626", function (r) { return values.omega * values.omega * r; });
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.radius, rMax), rMax);
}

function drawDailyAirplaneTurnScene() {
  var values = getJsonCircularValues();
  var speed = dailyParam("speed", 20);
  var radius = dailyParam("radius", 80);
  var theta = Math.atan(speed * speed / Math.max(1, values.g * radius));
  var t = values.time;
  var cx = 292;
  var cy = 265;
  var r = 124;
  var a = values.omega * t - Math.PI / 2;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a) * 0.42;
  stroke("#cbd5e1");
  strokeWeight(2);
  noFill();
  ellipse(cx, cy, 2 * r, r * 0.84);
  push();
  translate(x, y);
  rotate(a + Math.PI / 2);
  noStroke();
  fill("#0ea5e9");
  triangle(0, -32, -18, 22, 18, 22);
  fill("#bae6fd");
  triangle(0, -8, -56, 16, 56, 16);
  pop();
  drawVectorArrow(x, y, 0, 78, "#64748b", "G");
  drawVectorArrow(x, y, -82 * Math.sin(theta), -82 * Math.cos(theta), "#2563eb", "L");
  drawVectorArrow(x, y, cx > x ? 74 : -74, 0, "#dc2626", "向心");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("飞机水平盘旋升力", 28, 28);
  fill("#334155");
  textSize(14);
  text("升力竖直分量平衡重力，水平分量提供向心力", 28, 54);
  text("L/mg=" + Math.sqrt(1 + Math.pow(speed * speed / values.g / radius, 2)).toFixed(2), 28, 78);
}

function drawDailyAirplaneTurnGraph() {
  var values = getJsonCircularValues();
  var radius = dailyParam("radius", 80);
  var speed = dailyParam("speed", 20);
  var vmax = Math.max(30, speed * 1.5);
  drawGraphFrame("升力倍数-速度", "L/mg=√(1+(v²/rg)²)");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = 3;
  drawSimpleCurve(gx, gy, gw, gh, vmax, yMax, "#2563eb", function (v) {
    return Math.sqrt(1 + Math.pow(v * v / Math.max(1, radius * values.g), 2));
  });
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, vmax), vmax);
}

function drawDailyBicycleTurnScene() {
  var values = getJsonCircularValues();
  var speed = dailyParam("speed", 9);
  var radius = dailyParam("radius", 30);
  var lean = Math.atan(speed * speed / Math.max(1, values.g * radius));
  var baseX = 280;
  var baseY = 332;
  stroke("#111827");
  strokeWeight(3);
  line(60, baseY + 36, 510, baseY + 36);
  push();
  translate(baseX, baseY);
  rotate(-lean);
  stroke("#2563eb");
  strokeWeight(4);
  line(0, 0, 0, -140);
  noStroke();
  fill("#f97316");
  circle(0, -154, 28);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(-34, 24, 52);
  circle(34, 24, 52);
  pop();
  drawVectorArrow(baseX, baseY - 90, 0, 82, "#64748b", "G");
  drawVectorArrow(baseX, baseY - 90, -82, 0, "#dc2626", "f");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("自行车转弯侧倾", 28, 28);
  fill("#334155");
  textSize(14);
  text("tanα=v²/(Rg)，速度越大车身越向内倾", 28, 54);
  text("v=" + speed.toFixed(1) + "，α=" + (lean * 180 / Math.PI).toFixed(1) + "°", 28, 78);
}

function drawDailyBicycleTurnGraph() {
  var values = getJsonCircularValues();
  var mu = dailyParam("mu", 0.6);
  var radius = dailyParam("radius", 30);
  var speed = dailyParam("speed", 9);
  var vmax = Math.sqrt(mu * values.g * radius);
  drawGraphFrame("侧滑临界", "蓝线：v²/R；红线：μg");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = Math.max(vmax * 1.25, speed * 1.35);
  var yMax = Math.max(mu * values.g, xMax * xMax / radius) * 1.15;
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", function (v) { return v * v / radius; });
  stroke("#dc2626");
  strokeWeight(2);
  line(gx, map(mu * values.g, 0, yMax, gy + gh, gy), gx + gw, map(mu * values.g, 0, yMax, gy + gh, gy));
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, xMax), xMax);
}

function drawDailyTubeProjectileScene() {
  var values = getJsonCircularValues();
  var t = Math.min(values.time, getJsonDuration(currentScene));
  var vx = dailyParam("vx", 3);
  var g = values.g;
  var pipeX = 170;
  var pipeY = 245;
  var pipeR = 92;
  var startX = pipeX;
  var startY = pipeY - pipeR;
  var ballX = startX + vx * 58 * t;
  var ballY = startY + 0.5 * g * 38 * t * t;
  stroke("#111827");
  strokeWeight(3);
  noFill();
  arc(pipeX, pipeY, 2 * pipeR, 2 * pipeR, Math.PI, 0);
  stroke("#cbd5e1");
  line(pipeX, pipeY, pipeX, pipeY - pipeR);
  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (var i = 0; i <= 80; i++) {
    var p = i / 80 * getJsonDuration(currentScene);
    vertex(startX + vx * 58 * p, startY + 0.5 * g * 38 * p * p);
  }
  endShape();
  noStroke();
  fill("#f97316");
  circle(ballX, ballY, 22);
  drawVectorArrow(ballX, ballY, 62, 0, "#2563eb", "vx");
  drawVectorArrow(ballX, ballY, 0, Math.min(82, g * t * 12), "#dc2626", "vy");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("半圆管道脱离平抛", 28, 28);
  fill("#334155");
  textSize(14);
  text("离开 B 点后做平抛，垂直斜面用速度方向判断", 28, 54);
  text("vx=" + vx.toFixed(1) + "，vy=gt=" + (g * t).toFixed(1), 28, 78);
}

function drawDailyTubeProjectileGraph() {
  var values = getJsonCircularValues();
  var vx = dailyParam("vx", 3);
  var duration = getJsonDuration(currentScene);
  drawGraphFrame("速度分量-时间", "平抛：vx 恒定，vy=gt");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = Math.max(vx, values.g * duration) * 1.2;
  drawSimpleCurve(gx, gy, gw, gh, duration, yMax, "#2563eb", function () { return vx; });
  drawSimpleCurve(gx, gy, gw, gh, duration, yMax, "#dc2626", function (t) { return values.g * t; });
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.time, duration), duration);
}

function drawDailyHorizontalBarScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 218;
  var r = 124;
  var a = values.omega * values.time - Math.PI / 2;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a);
  stroke("#111827");
  strokeWeight(6);
  line(cx - 170, cy, cx + 170, cy);
  noStroke();
  fill("#111827");
  circle(cx, cy, 16);
  stroke("#cbd5e1");
  strokeWeight(1.5);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#2563eb");
  strokeWeight(5);
  line(cx, cy, x, y);
  noStroke();
  fill("#f97316");
  ellipse(x, y, 30, 46);
  drawVectorArrow(x, y, (cx - x) * 0.46, (cy - y) * 0.46, "#dc2626", "向心");
  drawVectorArrow(x, y, 0, 66, "#64748b", "G");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("单杠最高点弹力图像", 28, 28);
  fill("#334155");
  textSize(14);
  text("最高点弹力方向由 v² 与 gr 比较决定", 28, 54);
  text("零弹力条件：v²=gr", 28, 78);
}

function drawDailyHorizontalBarGraph() {
  var values = getJsonCircularValues();
  var radius = Math.max(0.1, values.radius);
  drawGraphFrame("最高点弹力 F-v²", "零点 v²=gr；右侧弹力向下");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = 25;
  var yMax = 20;
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", function (v2) {
    return Math.abs(v2 / radius - values.g);
  });
  stroke("#dc2626");
  strokeWeight(2);
  var zeroX = constrain(map(values.g * radius, 0, xMax, gx, gx + gw), gx, gx + gw);
  line(zeroX, gy, zeroX, gy + gh);
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.omega * values.omega * radius * radius, xMax), xMax);
}

function drawDailyRodTwoBallsScene() {
  var values = getJsonCircularValues();
  var angle = values.omega * values.time - Math.PI / 2;
  var ox = 285;
  var oy = 250;
  var rA = 68;
  var rB = 136;
  var ax = ox - rA * Math.cos(angle);
  var ay = oy - rA * Math.sin(angle);
  var bx = ox + rB * Math.cos(angle);
  var by = oy + rB * Math.sin(angle);
  stroke("#111827");
  strokeWeight(5);
  line(ax, ay, bx, by);
  noStroke();
  fill("#111827");
  circle(ox, oy, 16);
  fill("#2563eb");
  circle(ax, ay, 26);
  fill("#f97316");
  circle(bx, by, 26);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("A", ax, ay);
  text("B", bx, by);
  drawVectorArrow(bx, by, (ox - bx) * 0.38, (oy - by) * 0.38, "#dc2626", "向心");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("轻杆双球最高点", 28, 28);
  fill("#334155");
  textSize(14);
  text("同杆同角速度，线速度与到轴距离成正比", 28, 54);
  text("rB:rA=2:1，所以 vB:vA=2:1", 28, 78);
}

function drawDailyRodTwoBallsGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("杆上两球速度比较", "同角速度：v=ωr，向心加速度 a=ω²r");
  var gx = graphLeft + 78;
  var base = 390;
  drawBar(gx, base, 56, values.omega * 1 * 80, "#2563eb", "vA");
  drawBar(gx + 96, base, 56, values.omega * 2 * 80, "#f97316", "vB");
  drawBar(gx + 220, base, 56, values.omega * values.omega * 1 * 36, "#93c5fd", "aA");
  drawBar(gx + 316, base, 56, values.omega * values.omega * 2 * 36, "#fdba74", "aB");
}

function drawDailyRattleDrumScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 190;
  var angle = values.omega * values.time;
  var leftAnchor = { x: cx - 62, y: cy };
  var rightAnchor = { x: cx + 62, y: cy };
  var aLen = 132;
  var bLen = 92;
  var ax = leftAnchor.x - aLen * Math.sin(0.72) * Math.cos(angle);
  var ay = leftAnchor.y + aLen * Math.cos(0.72);
  var bx = rightAnchor.x + bLen * Math.sin(0.46) * Math.cos(angle + 0.4);
  var by = rightAnchor.y + bLen * Math.cos(0.46);
  stroke("#111827");
  strokeWeight(5);
  line(cx, 88, cx, 360);
  noFill();
  strokeWeight(3);
  circle(cx, cy, 128);
  stroke("#2563eb");
  line(leftAnchor.x, leftAnchor.y, ax, ay);
  stroke("#f97316");
  line(rightAnchor.x, rightAnchor.y, bx, by);
  noStroke();
  fill("#2563eb");
  circle(ax, ay, 26);
  fill("#f97316");
  circle(bx, by, 26);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("A", ax, ay);
  text("B", bx, by);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("拨浪鼓双球圆周", 28, 28);
  fill("#334155");
  textSize(14);
  text("同周期同角速度，长绳对应更大夹角和更大半径", 28, 54);
}

function drawDailyRattleDrumGraph() {
  drawGraphFrame("长绳 A 与短绳 B 比较", "同角速度：l cosθ 相同，长绳半径更大");
  var gx = graphLeft + 78;
  var base = 390;
  drawBar(gx, base, 56, 170, "#2563eb", "θA");
  drawBar(gx + 92, base, 56, 120, "#f97316", "θB");
  drawBar(gx + 210, base, 56, 190, "#93c5fd", "vA");
  drawBar(gx + 302, base, 56, 130, "#fdba74", "vB");
}

function drawDailyTurntableSensorScene() {
  var values = getJsonCircularValues();
  var w2 = values.omega * values.omega;
  var cx = 285;
  var cy = 250;
  var r = 136;
  var angle = values.omega * values.time;
  var x = cx + r * Math.cos(angle);
  var y = cy + r * Math.sin(angle);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#2563eb");
  line(cx, cy, x, y);
  noStroke();
  fill("#f97316");
  rect(x - 28, y - 20, 56, 40, 7);
  fill("#2563eb");
  rect(x - 20, y - 52, 40, 30, 7);
  fill("#111827");
  circle(cx, cy, 14);
  drawVectorArrow(x, y, (cx - x) * 0.46, (cy - y) * 0.46, "#dc2626", "F");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("转盘叠块传感器", 28, 28);
  fill("#334155");
  textSize(14);
  text("F 随 ω² 分段变化；A 开始滑动后斜率改变", 28, 54);
  text("ω²=" + w2.toFixed(1) + "，F=" + dailyTurntableForce(w2).toFixed(1) + "N", 28, 78);
}

function dailyTurntableForce(w2) {
  if (w2 <= 4) {
    return 0;
  }
  if (w2 <= 16) {
    return 0.5 * w2 - 2;
  }
  return 0.25 * w2 + 2;
}

function drawDailyTurntableSensorGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("传感器读数 F-ω²", "分段：0、0.5ω²-2、0.25ω²+2");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = 24;
  var yMax = 9;
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", dailyTurntableForce);
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.omega * values.omega, xMax), xMax);
}

function drawDailyCarPassengersScene() {
  var values = getJsonCircularValues();
  var cx = 120;
  var cy = 395;
  var angle = -0.95 + values.omega * values.time * 0.35;
  var rA = 150;
  var rB = 230;
  var ax = cx + rA * Math.cos(angle);
  var ay = cy + rA * Math.sin(angle);
  var bx = cx + rB * Math.cos(angle);
  var by = cy + rB * Math.sin(angle);
  stroke("#cbd5e1");
  strokeWeight(18);
  noFill();
  arc(cx, cy, 2 * rB, 2 * rB, -1.25, -0.15);
  stroke("#94a3b8");
  strokeWeight(2);
  arc(cx, cy, 2 * rA, 2 * rA, -1.25, -0.15);
  noStroke();
  fill("#2563eb");
  circle(ax, ay, 28);
  fill("#f97316");
  circle(bx, by, 28);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text("A", ax, ay);
  text("B", bx, by);
  drawVectorArrow(ax, ay, cx - ax, cy - ay, "#2563eb", "aA");
  drawVectorArrow(bx, by, (cx - bx) * 0.7, (cy - by) * 0.7, "#dc2626", "aB");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("汽车转弯乘员比较", 28, 28);
  fill("#334155");
  textSize(14);
  text("同车转弯角速度相同；外侧乘客半径更大", 28, 54);
}

function drawDailyCarPassengersGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("同角速度下的半径效应", "B 在外侧：v 和 a 都更大");
  var gx = graphLeft + 80;
  var base = 390;
  drawBar(gx, base, 58, 110, "#2563eb", "vA");
  drawBar(gx + 92, base, 58, 174, "#f97316", "vB");
  drawBar(gx + 218, base, 58, 105, "#93c5fd", "aA");
  drawBar(gx + 310, base, 58, 170, "#fdba74", "aB");
}

function drawDailyBicycleMudScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 250;
  var r = 132;
  var angle = values.omega * values.time - Math.PI / 2;
  var x = cx + r * Math.cos(angle);
  var y = cy + r * Math.sin(angle);
  stroke("#111827");
  strokeWeight(4);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var i = 0; i < 12; i++) {
    var a = i * Math.PI / 6 + angle;
    line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  noStroke();
  fill("#a16207");
  ellipse(x, y, 28, 20);
  drawVectorArrow(x, y, (cx - x) * 0.42, (cy - y) * 0.42, "#dc2626", "向心");
  drawVectorArrow(x, y, 0, 66, "#64748b", "G");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("车轮泥巴脱落", 28, 28);
  fill("#334155");
  textSize(14);
  text("最高点重力帮忙提供向心力，附着力需求最小", 28, 54);
}

function drawDailyBicycleMudGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("附着力需求-位置", "最高点最小，最容易被甩下");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = values.omega * values.omega * values.radius + values.g;
  drawSimpleCurve(gx, gy, gw, gh, 2 * Math.PI, yMax, "#a16207", function (a) {
    return Math.max(0, values.omega * values.omega * values.radius - values.g * Math.cos(a));
  });
  drawTimeMarker(gx, gy, gw, gh, (values.omega * values.time) % (2 * Math.PI), 2 * Math.PI);
}

function drawDailyBoxVerticalCircleScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 250;
  var r = 126;
  var a = values.omega * values.time - Math.PI / 2;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a);
  stroke("#cbd5e1");
  strokeWeight(2);
  noFill();
  circle(cx, cy, 2 * r);
  push();
  translate(x, y);
  noFill();
  stroke("#111827");
  strokeWeight(3);
  rect(-36, -36, 72, 72, 8);
  noStroke();
  fill("#f97316");
  circle(0, 0, 25);
  pop();
  drawVectorArrow(x, y, (cx - x) * 0.44, (cy - y) * 0.44, "#dc2626", "向心");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("盒内小球竖直圆", 28, 28);
  fill("#334155");
  textSize(14);
  text("最高点无作用力定速度；最低点压力为 2mg", 28, 54);
}

function drawDailyBoxVerticalCircleGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("盒壁作用力-位置", "最高点 0，最低点 2mg");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  drawSimpleCurve(gx, gy, gw, gh, 2 * Math.PI, 2.2, "#2563eb", function (a) {
    return 1 - Math.cos(a);
  });
  drawTimeMarker(gx, gy, gw, gh, (values.omega * values.time) % (2 * Math.PI), 2 * Math.PI);
}

function drawDailyStringTensionScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 250;
  var r = 128;
  var a = values.omega * values.time - Math.PI / 2;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#2563eb");
  strokeWeight(4);
  line(cx, cy, x, y);
  noStroke();
  fill("#f97316");
  circle(x, y, 28);
  drawVectorArrow(x, y, (cx - x) * 0.46, (cy - y) * 0.46, "#2563eb", "T");
  drawVectorArrow(x, y, 0, 66, "#64748b", "G");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("最高点绳拉力图像", 28, 28);
  fill("#334155");
  textSize(14);
  text("最高点：T=m v²/L-mg，图像斜率为 m/L", 28, 54);
}

function drawDailyStringTensionGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("最高点 T-v² 图像", "横轴交点 b 对应 T=0");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var xMax = 25;
  var yMax = 18;
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", function (v2) {
    return Math.max(0, v2 / Math.max(0.1, values.radius) - values.g);
  });
  drawTimeMarker(gx, gy, gw, gh, Math.min(values.g * values.radius, xMax), xMax);
}

function drawDailyStackedTurntableScene() {
  var values = getJsonCircularValues();
  var cx = 286;
  var cy = 250;
  var r = 128;
  var a = values.omega * values.time;
  var x = cx + r * Math.cos(a);
  var y = cy + r * Math.sin(a);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  noStroke();
  fill("#f97316");
  rect(x - 34, y - 21, 68, 42, 7);
  fill("#2563eb");
  rect(x - 24, y - 55, 48, 30, 7);
  drawVectorArrow(x, y, (cx - x) * 0.46, (cy - y) * 0.46, "#16a34a", "盘摩擦");
  drawVectorArrow(x, y - 40, (cx - x) * 0.34, (cy - y) * 0.34, "#dc2626", "甲乙摩擦");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("叠放物块转盘临界", 28, 28);
  fill("#334155");
  textSize(14);
  text("甲靠乙摩擦，整体靠盘面摩擦；较小 μ 决定临界", 28, 54);
}

function drawDailyStackedTurntableGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("两处静摩擦临界", "比较甲乙面与盘面的最大允许角速度");
  var gx = graphLeft + 96;
  var base = 390;
  var mu2 = values.mu;
  var mu1 = values.mu + 0.25;
  drawBar(gx, base, 72, Math.sqrt(mu1 * values.g / values.radius) * 62, "#2563eb", "甲乙");
  drawBar(gx + 130, base, 72, Math.sqrt(mu2 * values.g / values.radius) * 62, "#f97316", "盘面");
  drawBar(gx + 276, base, 72, values.omega * 62, "#16a34a", "当前");
}

function drawDailyInclinedSandScene() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 20) * Math.PI / 180;
  var mu = dailyParam("mu", 0.65);
  var cx = 285;
  var cy = 250;
  var angle = values.omega * values.time;
  var remain = 90;
  push();
  translate(cx, cy);
  rotate(-theta);
  fill("#f8fafc");
  stroke("#111827");
  strokeWeight(3);
  ellipse(0, 0, 280, 112);
  noStroke();
  fill("#facc15");
  ellipse(0, 0, 2 * remain, 36);
  fill("#eab308");
  for (var i = 0; i < 24; i++) {
    var a = angle + i * 0.7;
    var rr = 62 + (i % 5) * 16;
    circle(rr * Math.cos(a), 18 * Math.sin(a), 5);
  }
  pop();
  drawVectorArrow(cx + 126, cy, 72, 0, "#dc2626", "甩出");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("倾斜圆盘细沙脱落", 28, 28);
  fill("#334155");
  textSize(14);
  text("剩余面积 1/9 ⇒ 剩余半径 R/3", 28, 54);
  text("临界：ω²r+g sinθ=μg cosθ，μ=" + mu.toFixed(2), 28, 78);
}

function drawDailyInclinedSandGraph() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 20) * Math.PI / 180;
  var mu = dailyParam("mu", 0.65);
  drawGraphFrame("沿下坡方向临界", "蓝线：ω²r+g sinθ；红线：μg cosθ");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var rMax = 1;
  var limit = mu * values.g * Math.cos(theta);
  var yMax = Math.max(limit, values.omega * values.omega * rMax + values.g * Math.sin(theta)) * 1.2;
  drawSimpleCurve(gx, gy, gw, gh, rMax, yMax, "#2563eb", function (r) { return values.omega * values.omega * r + values.g * Math.sin(theta); });
  stroke("#dc2626");
  strokeWeight(2);
  line(gx, map(limit, 0, yMax, gy + gh, gy), gx + gw, map(limit, 0, yMax, gy + gh, gy));
  drawTimeMarker(gx, gy, gw, gh, 1 / 3, rMax);
}

function drawDailyValveLightScene() {
  var values = getJsonCircularValues();
  var cx = 285;
  var cy = 250;
  var r = 128;
  var angle = values.omega * values.time + Math.PI / 2;
  var x = cx + r * Math.cos(angle);
  var y = cy + r * Math.sin(angle);
  stroke("#111827");
  strokeWeight(3);
  noFill();
  circle(cx, cy, 2 * r);
  stroke("#cbd5e1");
  line(cx, cy, x, y);
  noStroke();
  fill("#f97316");
  rect(x - 18, y - 42, 36, 84, 12);
  fill(y > cy ? "#ef4444" : "#94a3b8");
  circle(x, y + 28, 18);
  drawVectorArrow(x, y, (x - cx) * 0.5, (y - cy) * 0.5, "#dc2626", "向外");
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("自行车气嘴灯", 28, 28);
  fill("#334155");
  textSize(14);
  text("最低点重力帮忙触发，最高点重力阻碍触发", 28, 54);
  text(y > cy ? "当前更容易发光" : "当前不易发光", 28, 78);
}

function drawDailyValveLightGraph() {
  var values = getJsonCircularValues();
  drawGraphFrame("触发趋势-转角", "最低点最大，最高点最小");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = values.omega * values.omega * values.radius + values.g;
  drawSimpleCurve(gx, gy, gw, gh, 2 * Math.PI, yMax, "#f97316", function (a) {
    return Math.max(0, values.omega * values.omega * values.radius + values.g * Math.sin(a));
  });
  drawTimeMarker(gx, gy, gw, gh, (values.omega * values.time + Math.PI / 2) % (2 * Math.PI), 2 * Math.PI);
}

function drawDailyCarrierTurnScene() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 12) * Math.PI / 180;
  var speed = dailyParam("speed", 14);
  var radius = dailyParam("radius", 120);
  var mu = dailyParam("mu", 0.45);
  var turnCx = 168;
  var turnCy = 248;
  var turnR = 92;
  var angle = -Math.PI / 5 + values.omega * values.time;
  var shipX = turnCx + turnR * Math.cos(angle);
  var shipY = turnCy + turnR * Math.sin(angle);
  var deckCx = 386;
  var deckCy = 290;
  var deckLen = 216;
  var inwardX = -1;
  var aNeed = speed * speed / Math.max(1, radius);
  var k = (aNeed / values.g + Math.tan(theta)) / Math.max(0.05, 1 - aNeed * Math.tan(theta) / values.g);
  var safe = k <= mu;

  stroke("#cbd5e1");
  strokeWeight(2);
  noFill();
  circle(turnCx, turnCy, 2 * turnR);
  stroke("#111827");
  strokeWeight(2);
  line(turnCx, turnCy, shipX, shipY);
  push();
  translate(shipX, shipY);
  rotate(angle + Math.PI / 2);
  noStroke();
  fill("#0f766e");
  rect(-18, -34, 36, 68, 7);
  fill("#99f6e4");
  rect(-11, -18, 22, 36, 4);
  pop();
  drawVectorArrow(shipX, shipY, (turnCx - shipX) * 0.48, (turnCy - shipY) * 0.48, "#dc2626", "向心");

  stroke("#334155");
  strokeWeight(5);
  line(deckCx - deckLen / 2, deckCy - deckLen * Math.tan(theta) / 2, deckCx + deckLen / 2, deckCy + deckLen * Math.tan(theta) / 2);
  noStroke();
  fill("#2563eb");
  circle(deckCx, deckCy, 24);
  drawVectorArrow(deckCx, deckCy, 0, 76, "#64748b", "G");
  drawVectorArrow(deckCx, deckCy, 70 * Math.sin(theta), -70 * Math.cos(theta), "#2563eb", "N");
  drawVectorArrow(deckCx, deckCy, inwardX * 82 * Math.cos(theta), -82 * Math.sin(theta), safe ? "#16a34a" : "#dc2626", "f");
  drawVectorArrow(deckCx, deckCy + 38, -78, 0, "#dc2626", "向心");

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("航母外倾转弯", 28, 28);
  fill("#334155");
  textSize(14);
  text("俯视看航母顺时针转弯；截面看甲板外倾", 28, 54);
  text("摩擦需沿甲板指向圆心，f/N=" + k.toFixed(2) + "，μ=" + mu.toFixed(2), 28, 78);
}

function drawDailyCarrierTurnGraph() {
  var values = getJsonCircularValues();
  var theta = dailyParam("theta", 12) * Math.PI / 180;
  var mu = dailyParam("mu", 0.45);
  var radius = dailyParam("radius", 120);
  var speed = dailyParam("speed", 14);
  var top = Math.max(24, speed * 1.4);
  drawGraphFrame("摩擦需求-航速", "外倾时：f/N=(v²/Rg+tanθ)/(1-v²tanθ/Rg)");
  var gx = graphLeft + 50;
  var gy = 82;
  var gw = graphRight - graphLeft - 90;
  var gh = 330;
  var yMax = Math.max(1, mu * 1.45);
  drawSimpleCurve(gx, gy, gw, gh, top, yMax, "#2563eb", function (v) {
    var q = v * v / Math.max(1, radius) / values.g;
    return Math.max(0, Math.min(yMax, (q + Math.tan(theta)) / Math.max(0.05, 1 - q * Math.tan(theta))));
  });
  stroke("#dc2626");
  strokeWeight(2);
  line(gx, map(mu, 0, yMax, gy + gh, gy), gx + gw, map(mu, 0, yMax, gy + gh, gy));
  drawTimeMarker(gx, gy, gw, gh, Math.min(speed, top), top);
}
