// Planetary motion and orbital-transfer scene implementations.
function drawLesson9SatelliteComparisonScene() {
  var nearPeriod = getJsonParam(currentScene, "nearPeriod", 1.4);
  var highPeriod = getJsonParam(currentScene, "highPeriod", 36);
  var timeHours = 4 * getGravitationProgress();
  var cx = 275;
  var cy = 255;
  var radii = [54, 78, 132, 184];
  var periods = [24, nearPeriod, 24, highPeriod];
  var labels = ["a", "b", "c", "d"];
  var colors = ["#0f766e", "#2563eb", "#f97316", "#7c3aed"];

  gravSceneHeading("四类地球卫星", "同一段 4h 内比较角位置与实际路程");
  gravBody(cx, cy, 104, "#60a5fa", "地");
  for (var i = 1; i < radii.length; i++) gravOrbit(cx, cy, radii[i], "#cbd5e1", i === 3);
  for (i = 0; i < radii.length; i++) {
    var angle = -Math.PI / 2 + Math.PI * 2 * timeHours / periods[i];
    var x = cx + radii[i] * Math.cos(angle);
    var y = cy + radii[i] * Math.sin(angle);
    gravBody(x, y, i === 0 ? 18 : 22, colors[i], labels[i]);
  }
  stroke("#f97316");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(cx, cy, cx + radii[2] * Math.cos(-Math.PI / 2 + Math.PI * 2 * timeHours / 24), cy + radii[2] * Math.sin(-Math.PI / 2 + Math.PI * 2 * timeHours / 24));
  drawingContext.setLineDash([]);
  gravText("a 与 c 始终同角位置", 28, 404, "#0f172a", 14, LEFT);
  gravText("t = " + timeHours.toFixed(2) + " h", 28, 430, "#334155", 14, LEFT);
  gravText("b 在相同时间内走过的弧长最长", 260, 430, "#2563eb", 14, LEFT);
}

function drawLesson9SatelliteComparisonGraph() {
  var nearPeriod = getJsonParam(currentScene, "nearPeriod", 1.4);
  var highPeriod = getJsonParam(currentScene, "highPeriod", 36);
  var timeHours = 4 * getGravitationProgress();
  var physicalRadii = [1, 1.06, 6.6, 6.6 * Math.pow(highPeriod / 24, 2 / 3)];
  var periods = [24, nearPeriod, 24, highPeriod];
  var colors = ["#0f766e", "#2563eb", "#f97316", "#7c3aed"];
  var speeds = [];
  for (var i = 0; i < 4; i++) speeds.push(2 * Math.PI * physicalRadii[i] / periods[i]);
  var yMax = Math.max.apply(null, speeds) * 4 * 1.08;
  var frame = gravGraphFrame("相同时间内的路程", "纵轴为路程 s/R；直线斜率就是线速度");
  for (i = 0; i < 4; i++) {
    (function (index) {
      gravPlot(frame, 4, 0, yMax, colors[index], function (t) { return speeds[index] * t; });
    })(i);
  }
  gravGraphMarker(frame, timeHours, 4, speeds[1] * timeHours, 0, yMax, "#2563eb");
  gravLegendItem(frame.x + 8, frame.y + 8, colors[0], "a");
  gravLegendItem(frame.x + 52, frame.y + 8, colors[1], "b");
  gravLegendItem(frame.x + 96, frame.y + 8, colors[2], "c");
  gravLegendItem(frame.x + 140, frame.y + 8, colors[3], "d");
  gravText("4h", frame.x + frame.w - 12, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function lesson9ExoplanetMassRatio() {
  var period = Math.max(0.2, getJsonParam(currentScene, "periodDays", 4));
  var radiusRatio = Math.max(0.001, getJsonParam(currentScene, "radiusRatio", 0.05));
  return Math.pow(radiusRatio, 3) * Math.pow(365 / period, 2);
}

function drawLesson9ExoplanetMassScene() {
  var period = getJsonParam(currentScene, "periodDays", 4);
  var timeDays = 20 * getGravitationProgress();
  var leftX = 150;
  var rightX = 410;
  var cy = 252;
  var orbit = 90;
  var earthAngle = -Math.PI / 2 + Math.PI * 2 * timeDays / 365;
  var pegAngle = -Math.PI / 2 + Math.PI * 2 * timeDays / period;
  gravSceneHeading("两套行星系统对照", "相同的轨道方程可反推中心恒星质量");
  gravOrbit(leftX, cy, orbit, "#cbd5e1", false);
  gravBody(leftX, cy, 42, "#f59e0b", "日");
  gravBody(leftX + orbit * Math.cos(earthAngle), cy + orbit * Math.sin(earthAngle), 18, "#2563eb", "地");
  gravOrbit(rightX, cy, orbit, "#cbd5e1", false);
  gravBody(rightX, cy, 42, "#f97316", "星");
  gravBody(rightX + orbit * Math.cos(pegAngle), cy + orbit * Math.sin(pegAngle), 18, "#7c3aed", "b");
  gravText("太阳—地球", leftX, 362, "#0f172a", 14, CENTER);
  gravText("51 peg—51 peg b", rightX, 362, "#0f172a", 14, CENTER);
  gravText("r* / r地 = " + getJsonParam(currentScene, "radiusRatio", 0.05).toFixed(3), 28, 410, "#334155", 14, LEFT);
  gravText("T* = " + period.toFixed(1) + " d", 28, 434, "#334155", 14, LEFT);
  gravText("M* / M日 ≈ " + lesson9ExoplanetMassRatio().toFixed(3), 300, 422, "#7c3aed", 15, LEFT);
}

function drawLesson9ExoplanetMassGraph() {
  var period = getJsonParam(currentScene, "periodDays", 4);
  var radiusRatio = getJsonParam(currentScene, "radiusRatio", 0.05);
  var yAtTwo = Math.pow(radiusRatio, 3) * Math.pow(365 / 2, 2);
  var yMax = Math.max(1.4, yAtTwo * 1.08);
  var frame = gravGraphFrame("反演恒星质量", "M*/M日=(r*/r地)³(365/T*)²");
  gravPlot(frame, 8, 0, yMax, "#7c3aed", function (x) {
    var t = 2 + x;
    return Math.pow(radiusRatio, 3) * Math.pow(365 / t, 2);
  });
  gravGraphMarker(frame, constrain(period - 2, 0, 8), 8, lesson9ExoplanetMassRatio(), 0, yMax, "#dc2626");
  gravText("2d", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("10d", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
  gravText("原题值约 81/80", frame.x + 10, frame.y + 10, "#0f172a", 12, LEFT);
}

function drawLesson9ThreeOrbitScene() {
  var ratio = getJsonParam(currentScene, "nearOmegaRatio", 12);
  var p = getGravitationProgress();
  var cx = 275;
  var cy = 255;
  var angleEarth = -Math.PI / 2 + Math.PI * 2 * p;
  var angleNear = -Math.PI / 2 + Math.PI * 2 * ratio * p;
  gravSceneHeading("赤道物体、近地卫星、同步卫星", "a 与 c 同角速度；b 的角速度最大");
  gravBody(cx, cy, 108, "#60a5fa", "地");
  gravOrbit(cx, cy, 80, "#cbd5e1", false);
  gravOrbit(cx, cy, 176, "#cbd5e1", true);
  gravBody(cx + 54 * Math.cos(angleEarth), cy + 54 * Math.sin(angleEarth), 18, "#0f766e", "a");
  gravBody(cx + 80 * Math.cos(angleNear), cy + 80 * Math.sin(angleNear), 21, "#2563eb", "b");
  gravBody(cx + 176 * Math.cos(angleEarth), cy + 176 * Math.sin(angleEarth), 22, "#f97316", "c");
  stroke("#f97316");
  drawingContext.setLineDash([4, 4]);
  line(cx, cy, cx + 176 * Math.cos(angleEarth), cy + 176 * Math.sin(angleEarth));
  drawingContext.setLineDash([]);
  gravText("ωa = ωc", 28, 414, "#0f766e", 15, LEFT);
  gravText("ωb = " + ratio.toFixed(0) + "ωa", 192, 414, "#2563eb", 15, LEFT);
  gravText("近地卫星不断超越二者", 360, 414, "#334155", 13, LEFT);
}

function drawLesson9ThreeOrbitGraph() {
  var ratio = getJsonParam(currentScene, "nearOmegaRatio", 12);
  var frame = gravGraphFrame("角速度相对值", "以地球自转角速度 ω地 为 1");
  gravBarChart(frame, ["a 赤道", "b 近地", "c 同步"], [1, ratio, 1], ["#0f766e", "#2563eb", "#f97316"], ratio * 1.12, "");
  gravText("a 与 c 等高柱：同步条件", frame.x + 10, frame.y + 10, "#334155", 12, LEFT);
}

function drawLesson9SaturnRingScene() {
  var ratio = getJsonParam(currentScene, "radiusRatio", 2.2);
  var p = getGravitationProgress();
  var leftX = 160;
  var rightX = 410;
  var cy = 248;
  var inner = 60;
  var outer = Math.min(100, inner * ratio / 1.5);
  var rigidAngle = Math.PI * 2 * p;
  var satelliteOuter = Math.PI * 2 * p / Math.pow(ratio, 1.5);
  gravSceneHeading("土星环的两种模型", "刚体部分同角速度；卫星群外层转得更慢");
  gravBody(leftX, cy, 52, "#f59e0b", "土");
  gravOrbit(leftX, cy, inner, "#94a3b8", false);
  gravOrbit(leftX, cy, outer, "#94a3b8", false);
  gravBody(leftX + inner * Math.cos(rigidAngle), cy + inner * Math.sin(rigidAngle), 14, "#2563eb", "");
  gravBody(leftX + outer * Math.cos(rigidAngle), cy + outer * Math.sin(rigidAngle), 14, "#f97316", "");
  stroke("#64748b");
  line(leftX, cy, leftX + outer * Math.cos(rigidAngle), cy + outer * Math.sin(rigidAngle));
  gravBody(rightX, cy, 52, "#f59e0b", "土");
  gravOrbit(rightX, cy, inner, "#94a3b8", false);
  gravOrbit(rightX, cy, outer, "#94a3b8", false);
  gravBody(rightX + inner * Math.cos(rigidAngle), cy + inner * Math.sin(rigidAngle), 14, "#2563eb", "");
  gravBody(rightX + outer * Math.cos(satelliteOuter), cy + outer * Math.sin(satelliteOuter), 14, "#f97316", "");
  gravText("土星本体：ω内=ω外", leftX, 370, "#0f172a", 14, CENTER);
  gravText("卫星群：ω外<ω内", rightX, 370, "#0f172a", 14, CENTER);
  gravText("蓝：内层", 150, 420, "#2563eb", 13, LEFT);
  gravText("橙：外层", 320, 420, "#f97316", 13, LEFT);
}

function drawLesson9SaturnRingGraph() {
  var ratio = getJsonParam(currentScene, "radiusRatio", 2.2);
  var frame = gravGraphFrame("线速度—半径关系", "蓝：刚体 v∝R；橙：卫星群 v∝1/√R");
  gravPlot(frame, ratio - 1, 0, ratio * 1.08, "#2563eb", function (x) { return 1 + x; });
  gravPlot(frame, ratio - 1, 0, ratio * 1.08, "#f97316", function (x) { return 1 / Math.sqrt(1 + x); });
  gravGraphMarker(frame, ratio - 1, ratio - 1, ratio, 0, ratio * 1.08, "#2563eb");
  gravGraphMarker(frame, ratio - 1, ratio - 1, 1 / Math.sqrt(ratio), 0, ratio * 1.08, "#f97316");
  gravText("R内", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("R外", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function drawLesson9SyncMinPeriodScene() {
  var startRatio = Math.max(2.1, getJsonParam(currentScene, "startRadiusRatio", 6.6));
  var p = getGravitationProgress();
  var ratio = startRatio - (startRatio - 2) * p;
  var cx = 275;
  var cy = 255;
  var earthR = 58;
  var orbitR = map(ratio, 2, startRatio, 116, 190);
  gravSceneHeading("三颗同步卫星缩轨", "临界时相邻卫星连线恰与地球相切");
  gravBody(cx, cy, earthR * 2, "#60a5fa", "地");
  gravOrbit(cx, cy, orbitR, "#cbd5e1", true);
  var points = [];
  for (var i = 0; i < 3; i++) {
    var angle = -Math.PI / 2 + i * Math.PI * 2 / 3 + p * 0.7;
    points.push({ x: cx + orbitR * Math.cos(angle), y: cy + orbitR * Math.sin(angle) });
    gravBody(points[i].x, points[i].y, 23, "#2563eb", String(i + 1));
  }
  stroke(p > 0.96 ? "#dc2626" : "#94a3b8");
  strokeWeight(2);
  for (i = 0; i < 3; i++) line(points[i].x, points[i].y, points[(i + 1) % 3].x, points[(i + 1) % 3].y);
  gravText("r = " + ratio.toFixed(2) + "R", 28, 408, "#0f172a", 15, LEFT);
  gravText("T = " + (24 * Math.pow(ratio / startRatio, 1.5)).toFixed(2) + " h", 190, 408, "#0f172a", 15, LEFT);
  gravText(p > 0.96 ? "临界：r=2R，T≈4h" : "通信线仍在地球外侧", 360, 408, p > 0.96 ? "#dc2626" : "#15803d", 13, LEFT);
}

function drawLesson9SyncMinPeriodGraph() {
  var startRatio = Math.max(2.1, getJsonParam(currentScene, "startRadiusRatio", 6.6));
  var p = getGravitationProgress();
  var ratio = startRatio - (startRatio - 2) * p;
  var frame = gravGraphFrame("同步周期—轨道半径", "T=24(r/" + startRatio.toFixed(1) + "R)³ᐟ²");
  gravPlot(frame, startRatio - 2, 0, 24, "#2563eb", function (x) {
    var r = 2 + x;
    return 24 * Math.pow(r / startRatio, 1.5);
  });
  var period = 24 * Math.pow(ratio / startRatio, 1.5);
  gravGraphMarker(frame, ratio - 2, startRatio - 2, period, 0, 24, "#dc2626");
  gravText("2R", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText(startRatio.toFixed(1) + "R", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function lesson9EclipseValues() {
  var alphaDeg = getJsonParam(currentScene, "alpha", 60);
  var alpha = alphaDeg * Math.PI / 180;
  var ratio = 1 / Math.max(0.05, Math.sin(alpha / 2));
  return { alphaDeg: alphaDeg, alpha: alpha, radiusRatio: ratio };
}

function drawLesson9EclipseGeometryScene() {
  var values = lesson9EclipseValues();
  var p = getGravitationProgress();
  var cx = 260;
  var cy = 260;
  var earthR = 68;
  var orbitR = Math.min(190, earthR * values.radiusRatio);
  var angle = -values.alpha / 2 + values.alpha * p;
  var x = cx + orbitR * Math.cos(angle);
  var y = cy + orbitR * Math.sin(angle);
  gravSceneHeading("飞船穿过地球阴影", "太阳光从左向右；阴影对应轨道圆心角 α");
  for (var i = 0; i < 5; i++) gravArrow(20, 145 + i * 58, 105, 145 + i * 58, "#f59e0b", "");
  noStroke();
  fill(15, 23, 42, 32);
  rect(cx, cy - earthR, 285, earthR * 2);
  gravOrbit(cx, cy, orbitR, "#94a3b8", false);
  gravBody(cx, cy, earthR * 2, "#60a5fa", "地");
  gravBody(x, y, 22, p > 0.03 && p < 0.97 ? "#475569" : "#f97316", "A");
  stroke("#64748b");
  line(cx, cy, x, y);
  gravDrawAngleArc(cx, cy, 42, -values.alpha / 2, values.alpha / 2, "#dc2626", "α");
  gravText("r/R = 1/sin(α/2) = " + values.radiusRatio.toFixed(2), 28, 410, "#0f172a", 14, LEFT);
  gravText("阴影进度 " + (p * 100).toFixed(0) + "%", 344, 410, "#475569", 14, LEFT);
}

function drawLesson9EclipseGeometryGraph() {
  var values = lesson9EclipseValues();
  var angleDeg = -values.alphaDeg / 2 + values.alphaDeg * getGravitationProgress();
  var frame = gravGraphFrame("轨道光照状态—圆心角", "阴影时长占一周比例 α/360°");
  noStroke();
  fill(71, 85, 105, 45);
  var shadeX1 = map(-values.alphaDeg / 2, -180, 180, frame.x, frame.x + frame.w);
  var shadeX2 = map(values.alphaDeg / 2, -180, 180, frame.x, frame.x + frame.w);
  rect(shadeX1, frame.y, shadeX2 - shadeX1, frame.h);
  gravPlot(frame, 360, 0, 1.1, "#f59e0b", function (x) {
    var deg = x - 180;
    return Math.abs(deg) <= values.alphaDeg / 2 ? 0.12 : 1;
  });
  var stateValue = Math.abs(angleDeg) <= values.alphaDeg / 2 ? 0.12 : 1;
  gravGraphMarker(frame, angleDeg + 180, 360, stateValue, 0, 1.1, "#dc2626");
  gravText("−180°", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("0°", frame.x + frame.w / 2, frame.y + frame.h + 10, "#334155", 11, CENTER);
  gravText("180°", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function drawLesson9HorizonFlashScene() {
  var elapsed = getJsonParam(currentScene, "elapsedHours", 8);
  var p = getGravitationProgress();
  var cx = 260;
  var cy = 260;
  var R = 82;
  var observerFinal = -Math.PI / 2;
  var observerStart = observerFinal - elapsed * Math.PI / 12;
  var observerAngle = observerStart + (observerFinal - observerStart) * p;
  var satelliteAngle = -Math.PI * 2 / 3 + p * Math.PI / 2;
  var ox = cx + R * Math.cos(observerAngle);
  var oy = cy + R * Math.sin(observerAngle);
  var sx = cx + 2 * R * Math.cos(satelliteAngle);
  var sy = cy + 2 * R * Math.sin(satelliteAngle);
  gravSceneHeading("日落后 8h 的地平线闪光", "终点同时满足视线切地球与太阳光切地球");
  for (var i = 0; i < 5; i++) gravArrow(20, 145 + i * 58, 95, 145 + i * 58, "#f59e0b", "");
  noStroke();
  fill(15, 23, 42, 30);
  rect(cx, cy - R, 285, R * 2);
  gravOrbit(cx, cy, 2 * R, "#cbd5e1", true);
  gravBody(cx, cy, 2 * R, "#60a5fa", "地");
  gravBody(ox, oy, 18, "#0f766e", "人");
  gravBody(sx, sy, 20, p > 0.94 ? "#fbbf24" : "#f97316", "卫");
  stroke("#0f766e");
  strokeWeight(1.6);
  line(ox, oy, sx, sy);
  if (p > 0.94) {
    stroke("#f59e0b");
    drawingContext.setLineDash([4, 4]);
    line(20, sy, sx, sy);
    drawingContext.setLineDash([]);
  }
  gravText("地球自转角 = " + (elapsed * 15 * p).toFixed(0) + "°", 28, 414, "#334155", 14, LEFT);
  gravText(p > 0.94 ? "闪光后进入阴影：r=2R" : "观察者与卫星接近临界位置", 300, 414, p > 0.94 ? "#dc2626" : "#475569", 14, LEFT);
}

function drawLesson9HorizonFlashGraph() {
  var g = getJsonParam(currentScene, "surfaceGravity", 9.8);
  var p = getGravitationProgress();
  var radiusRatio = 1 + p;
  var frame = gravGraphFrame("轨道周期—半径比", "T/[2π√(R/g)] = (r/R)³ᐟ²");
  gravPlot(frame, 2, 0, Math.pow(3, 1.5), "#2563eb", function (x) {
    return Math.pow(1 + x, 1.5);
  });
  gravGraphMarker(frame, radiusRatio - 1, 2, Math.pow(radiusRatio, 1.5), 0, Math.pow(3, 1.5), "#dc2626");
  gravText("r=R", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("r=2R", map(1, 0, 2, frame.x, frame.x + frame.w), frame.y + frame.h + 10, "#dc2626", 11, CENTER);
  gravText("原题 T=4π√(2R/g)，g=" + g.toFixed(1) + "m/s²", frame.x + 10, frame.y + 10, "#0f172a", 12, LEFT);
}

function drawLesson9SyncTransferScene() {
  var ratio = getJsonParam(currentScene, "outerRadiusRatio", 3.2);
  var p = getGravitationProgress();
  var cx = 280;
  var cy = 255;
  var r1 = 45;
  var r3 = r1 * ratio;
  var a = (r1 + r3) / 2;
  var e = (r3 - r1) / (r3 + r1);
  var pos = gravEllipsePoint(cx, cy, a, e, Math.PI * p, false);
  gravSceneHeading("同步卫星的两次加速变轨", "P 点进入转移椭圆，Q 点圆化到同步轨道");
  gravBody(cx, cy, 60, "#60a5fa", "地");
  gravOrbit(cx, cy, r1, "#2563eb", false);
  gravOrbit(cx, cy, r3, "#f97316", false);
  gravDrawEllipse(cx, cy, a, e, false, "#7c3aed");
  gravBody(cx + r1, cy, 18, "#2563eb", "P");
  gravBody(cx - r3, cy, 18, "#f97316", "Q");
  gravBody(pos.x, pos.y, 20, "#7c3aed", "卫");
  gravArrow(pos.x, pos.y, pos.x - 42 * Math.sin(Math.PI * p), pos.y + 42 * Math.cos(Math.PI * p), "#16a34a", "v");
  gravText("r₃/r₁ = " + ratio.toFixed(1), 28, 408, "#334155", 14, LEFT);
  gravText("P、Q 同一点的 a=GM/r² 与轨道形状无关", 220, 408, "#0f172a", 13, LEFT);
  gravText(p < 0.08 ? "P点加速" : p > 0.92 ? "Q点再次加速圆化" : "沿椭圆轨道2飞行", 28, 434, "#7c3aed", 14, LEFT);
}

function drawLesson9SyncTransferGraph() {
  var ratio = getJsonParam(currentScene, "outerRadiusRatio", 3.2);
  var values = [1, 1 / Math.sqrt(ratio), 1, 1 / Math.pow(ratio, 1.5), 1, 1];
  var frame = gravGraphFrame("两圆轨道与同点加速度", "相对值：v₁、v₃、ω₁、ω₃、aP(1)、aP(2)");
  gravBarChart(frame, ["v₁", "v₃", "ω₁", "ω₃", "aP₁", "aP₂"], values, ["#2563eb", "#f97316", "#2563eb", "#f97316", "#16a34a", "#7c3aed"], 1.12, "");
  gravText("aP₁=aP₂；Q 点同理", frame.x + 10, frame.y + 10, "#334155", 12, LEFT);
}

function drawLesson9Change3Scene() {
  var ratio = getJsonParam(currentScene, "orbitRatio", 1.8);
  var p = getGravitationProgress();
  var earthX = 85;
  var moonX = 395;
  var cy = 255;
  var outer = 116;
  var inner = outer / ratio;
  var phase;
  var x;
  var y;
  var label;
  gravSceneHeading("嫦娥三号：地月转移到动力下降", "同一 P 点引力加速度相同，内轨周期更短");
  gravBody(earthX, cy, 62, "#2563eb", "地");
  gravBody(moonX, cy, 92, "#94a3b8", "月");
  gravOrbit(moonX, cy, outer, "#f97316", false);
  gravOrbit(moonX, cy, inner, "#7c3aed", false);
  noFill();
  stroke("#cbd5e1");
  drawingContext.setLineDash([4, 4]);
  bezier(earthX + 32, cy, 210, 82, 332, 100, moonX, cy + outer);
  drawingContext.setLineDash([]);
  if (p < 0.25) {
    phase = p / 0.25;
    x = bezierPoint(earthX + 32, 210, 332, moonX, phase);
    y = bezierPoint(cy, 82, 100, cy + outer, phase);
    label = "地月转移";
  } else if (p < 0.55) {
    phase = (p - 0.25) / 0.30;
    x = moonX + outer * Math.cos(Math.PI / 2 - Math.PI * 2 * phase);
    y = cy + outer * Math.sin(Math.PI / 2 - Math.PI * 2 * phase);
    label = "环月轨道1";
  } else if (p < 0.82) {
    phase = (p - 0.55) / 0.27;
    x = moonX + inner * Math.cos(Math.PI / 2 - Math.PI * 2 * phase);
    y = cy + inner * Math.sin(Math.PI / 2 - Math.PI * 2 * phase);
    label = "环月轨道2";
  } else {
    phase = (p - 0.82) / 0.18;
    x = moonX;
    y = cy + inner - phase * (inner - 48);
    label = "动力下降";
    gravArrow(x + 18, y, x + 18, y + 44, "#dc2626", "推力");
  }
  gravBody(x, y, 20, "#f97316", "嫦");
  gravText(label, 28, 408, "#0f172a", 15, LEFT);
  gravText("T₁/T₂ = " + Math.pow(ratio, 1.5).toFixed(2), 220, 408, "#334155", 14, LEFT);
  gravText(p >= 0.82 ? "发动机工作：不是完全失重" : "轨道飞行：只受引力", 370, 408, p >= 0.82 ? "#dc2626" : "#15803d", 13, LEFT);
}

function drawLesson9Change3Graph() {
  var ratio = getJsonParam(currentScene, "orbitRatio", 1.8);
  var values = [Math.pow(ratio, 1.5), 1, 1, 1, 0.72];
  var frame = gravGraphFrame("环月轨道关键量", "T₁>T₂；同 P 点加速度相等；下降段有推力");
  gravBarChart(frame, ["T₁", "T₂", "aP₁", "aP₂", "失重度"], values, ["#f97316", "#7c3aed", "#16a34a", "#16a34a", "#dc2626"], Math.max(2.8, values[0] * 1.1), "");
  gravText("“失重度”低于1表示存在发动机推力", frame.x + 10, frame.y + 10, "#334155", 11, LEFT);
}

function lesson9EarthMarsValues() {
  var radiusRatio = getJsonParam(currentScene, "marsRadiusRatio", 1.5);
  var initialLead = getJsonParam(currentScene, "initialLead", 60);
  var marsPeriod = 365 * Math.pow(radiusRatio, 1.5);
  var transferAxis = (1 + radiusRatio) / 2;
  var transferTime = 0.5 * 365 * Math.pow(transferAxis, 1.5);
  var marsTravel = 360 * transferTime / marsPeriod;
  var requiredLead = 180 - marsTravel;
  var relativeRate = 360 / 365 - 360 / marsPeriod;
  var waitDays = relativeRate > 0 ? Math.max(0, (initialLead - requiredLead) / relativeRate) : 0;
  return {
    radiusRatio: radiusRatio,
    initialLead: initialLead,
    marsPeriod: marsPeriod,
    transferTime: transferTime,
    marsTravel: marsTravel,
    requiredLead: requiredLead,
    relativeRate: relativeRate,
    waitDays: waitDays
  };
}

function drawLesson9EarthMarsScene() {
  var values = lesson9EarthMarsValues();
  var p = getGravitationProgress();
  var cx = 275;
  var cy = 255;
  var earthR = 102;
  var marsR = earthR * values.radiusRatio;
  var transferA = (earthR + marsR) / 2;
  var transferE = (marsR - earthR) / (marsR + earthR);
  var earthX = cx + earthR;
  var earthY = cy;
  var marsAngle;
  var probe;
  var stage;
  gravSceneHeading("地球到火星的霍曼转移", "先等待发射窗口，再飞过半个转移椭圆");
  gravBody(cx, cy, 42, "#f59e0b", "日");
  gravOrbit(cx, cy, earthR, "#2563eb", false);
  gravOrbit(cx, cy, marsR, "#f97316", false);
  gravDrawEllipse(cx, cy, transferA, transferE, false, "#7c3aed");
  if (p < 0.25) {
    var waitProgress = p / 0.25;
    var leadNow = values.initialLead - (values.initialLead - values.requiredLead) * waitProgress;
    marsAngle = -leadNow * Math.PI / 180;
    probe = { x: earthX, y: earthY };
    stage = "等待窗口 " + (values.waitDays * waitProgress).toFixed(0) + " d";
  } else {
    var q = (p - 0.25) / 0.75;
    probe = gravEllipsePoint(cx, cy, transferA, transferE, -Math.PI * q, false);
    marsAngle = -(values.requiredLead + values.marsTravel * q) * Math.PI / 180;
    stage = "转移飞行 " + (values.transferTime * q).toFixed(0) + " d";
  }
  gravBody(earthX, earthY, 20, "#2563eb", "地");
  gravBody(cx + marsR * Math.cos(marsAngle), cy + marsR * Math.sin(marsAngle), 22, "#f97316", "火");
  gravBody(probe.x, probe.y, 16, "#7c3aed", "探");
  gravText(stage, 28, 408, "#0f172a", 15, LEFT);
  gravText("所需领先角 " + values.requiredLead.toFixed(1) + "°", 250, 408, "#7c3aed", 14, LEFT);
  gravText("转移时间 " + values.transferTime.toFixed(0) + " d", 424, 408, "#334155", 13, LEFT);
}

function drawLesson9EarthMarsGraph() {
  var values = lesson9EarthMarsValues();
  var p = getGravitationProgress();
  var progress = Math.min(1, p / 0.25);
  var day = values.waitDays * progress;
  var lead = values.initialLead - values.relativeRate * day;
  var yMin = Math.min(values.requiredLead, values.initialLead) - 6;
  var yMax = Math.max(values.requiredLead, values.initialLead) + 6;
  var xMax = Math.max(1, values.waitDays);
  var frame = gravGraphFrame("火星领先角—等待日期", "下降到所需相位角时立即点火");
  gravPlot(frame, xMax, yMin, yMax, "#2563eb", function (x) {
    return values.initialLead - values.relativeRate * x;
  });
  stroke("#dc2626");
  drawingContext.setLineDash([4, 4]);
  var targetY = map(values.requiredLead, yMin, yMax, frame.y + frame.h, frame.y);
  line(frame.x, targetY, frame.x + frame.w, targetY);
  drawingContext.setLineDash([]);
  gravGraphMarker(frame, day, xMax, lead, yMin, yMax, "#f97316");
  gravText("3月1日", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("约4月8日", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function lesson9BinaryValues() {
  var m1 = Math.max(0.1, getJsonParam(currentScene, "mass1", 2));
  var m2 = Math.max(0.1, getJsonParam(currentScene, "mass2", 1));
  var sum = m1 + m2;
  return { m1: m1, m2: m2, r1: m2 / sum, r2: m1 / sum };
}

function drawLesson9BinaryStarScene() {
  var values = lesson9BinaryValues();
  var p = getGravitationProgress();
  var cx = 285;
  var cy = 250;
  var separation = 260;
  var angle = -Math.PI / 2 + Math.PI * 2 * p;
  var r1 = separation * values.r1;
  var r2 = separation * values.r2;
  var x1 = cx + r1 * Math.cos(angle);
  var y1 = cy + r1 * Math.sin(angle);
  var x2 = cx - r2 * Math.cos(angle);
  var y2 = cy - r2 * Math.sin(angle);
  gravSceneHeading("双星绕共同质心", "质量越大，分得的轨道半径和线速度越小");
  gravOrbit(cx, cy, r1, "#2563eb", true);
  gravOrbit(cx, cy, r2, "#f97316", true);
  gravBody(cx, cy, 14, "#0f172a", "O");
  stroke("#94a3b8");
  line(x1, y1, x2, y2);
  gravBody(x1, y1, 28 + 8 * Math.sqrt(values.m1), "#2563eb", "1");
  gravBody(x2, y2, 28 + 8 * Math.sqrt(values.m2), "#f97316", "2");
  gravText("m₁r₁ = m₂r₂", 28, 408, "#0f172a", 15, LEFT);
  gravText("r₁:r₂ = v₁:v₂ = " + values.m2.toFixed(1) + ":" + values.m1.toFixed(1), 225, 408, "#334155", 14, LEFT);
}

function drawLesson9BinaryStarGraph() {
  var values = lesson9BinaryValues();
  var frame = gravGraphFrame("轨道半径与线速度分配", "同角速度下 v∝r；两组柱形完全同比分配");
  gravBarChart(frame, ["r₁/L", "r₂/L", "v₁/ωL", "v₂/ωL"], [values.r1, values.r2, values.r1, values.r2], ["#2563eb", "#f97316", "#2563eb", "#f97316"], 1, "");
  gravText("共同周期由总质量与星距决定", frame.x + 10, frame.y + 10, "#334155", 12, LEFT);
}

function lesson9BinaryTransferValues(progress) {
  var ratio = Math.max(1.1, getJsonParam(currentScene, "initialMassRatio", 3));
  var growth = getJsonParam(currentScene, "separationGrowth", 35) / 100;
  var big0 = ratio;
  var small0 = 1;
  var delta = (ratio - 1) * 0.35 * progress;
  var big = big0 - delta;
  var small = small0 + delta;
  var separation = 1 + growth * progress;
  var total = big + small;
  return {
    ratio: ratio,
    growth: growth,
    big: big,
    small: small,
    separation: separation,
    rBig: small / total * separation,
    rSmall: big / total * separation,
    omega: Math.pow(separation, -1.5),
    rBig0: small0 / (big0 + small0)
  };
}

function drawLesson9BinaryTransferScene() {
  var p = getGravitationProgress();
  var values = lesson9BinaryTransferValues(p);
  var cx = 285;
  var cy = 250;
  var displayL = 190 * values.separation;
  var angle = -Math.PI / 2 + Math.PI * 2 * p * values.omega;
  var rBig = displayL * values.small / (values.big + values.small);
  var rSmall = displayL * values.big / (values.big + values.small);
  var bx = cx + rBig * Math.cos(angle);
  var by = cy + rBig * Math.sin(angle);
  var sx = cx - rSmall * Math.cos(angle);
  var sy = cy - rSmall * Math.sin(angle);
  gravSceneHeading("双星质量转移与星距增长", "物质由大星流向小星，系统总质量保持不变");
  gravOrbit(cx, cy, rBig, "#2563eb", true);
  gravOrbit(cx, cy, rSmall, "#f97316", true);
  gravBody(cx, cy, 12, "#0f172a", "O");
  stroke("#94a3b8");
  line(bx, by, sx, sy);
  gravBody(bx, by, 25 + 10 * Math.sqrt(values.big), "#2563eb", "大");
  gravBody(sx, sy, 25 + 10 * Math.sqrt(values.small), "#f97316", "小");
  for (var i = 1; i <= 4; i++) {
    var f = (i / 5 + p * 1.7) % 1;
    gravBody(lerp(bx, sx, f), lerp(by, sy, f), 7, "#dc2626", "");
  }
  gravText("L/L₀ = " + values.separation.toFixed(2), 28, 408, "#334155", 14, LEFT);
  gravText("ω/ω₀ = " + values.omega.toFixed(2), 210, 408, "#2563eb", 14, LEFT);
  gravText("r大/r大,0 = " + (values.rBig / values.rBig0).toFixed(2), 385, 408, "#f97316", 14, LEFT);
}

function drawLesson9BinaryTransferGraph() {
  var p = getGravitationProgress();
  var values = lesson9BinaryTransferValues(p);
  var end = lesson9BinaryTransferValues(1);
  var yMax = Math.max(1.5, end.rBig / end.rBig0 * 1.1);
  var frame = gravGraphFrame("质量转移过程的相对变化", "蓝：ω/ω₀ 下降；橙：大星轨道半径上升");
  gravPlot(frame, 1, 0, yMax, "#2563eb", function (x) { return lesson9BinaryTransferValues(x).omega; });
  gravPlot(frame, 1, 0, yMax, "#f97316", function (x) {
    var item = lesson9BinaryTransferValues(x);
    return item.rBig / item.rBig0;
  });
  gravGraphMarker(frame, p, 1, values.omega, 0, yMax, "#2563eb");
  gravGraphMarker(frame, p, 1, values.rBig / values.rBig0, 0, yMax, "#f97316");
  gravLegendItem(frame.x + 8, frame.y + 8, "#2563eb", "角速度");
  gravLegendItem(frame.x + 90, frame.y + 8, "#f97316", "大星半径");
}

function drawLesson9TripleStarScene() {
  var mass = getJsonParam(currentScene, "massScale", 1);
  var p = getGravitationProgress();
  var angle = Math.PI * 2 * p;
  var lineX = 170;
  var lineY = 180;
  var L = 76;
  var triX = 390;
  var triY = 315;
  var triR = 66;
  gravSceneHeading("两种稳定三星系统", "上：直线三星；下：等边三角形三星");
  gravOrbit(lineX, lineY, L, "#cbd5e1", true);
  stroke("#94a3b8");
  line(lineX - L * Math.cos(angle), lineY - L * Math.sin(angle), lineX + L * Math.cos(angle), lineY + L * Math.sin(angle));
  gravBody(lineX, lineY, 30 + 5 * mass, "#f59e0b", "中");
  gravBody(lineX + L * Math.cos(angle), lineY + L * Math.sin(angle), 28 + 5 * mass, "#2563eb", "1");
  gravBody(lineX - L * Math.cos(angle), lineY - L * Math.sin(angle), 28 + 5 * mass, "#2563eb", "2");
  gravOrbit(triX, triY, triR, "#cbd5e1", true);
  var pts = [];
  for (var i = 0; i < 3; i++) {
    var a = angle + i * Math.PI * 2 / 3;
    pts.push({ x: triX + triR * Math.cos(a), y: triY + triR * Math.sin(a) });
  }
  stroke("#94a3b8");
  for (i = 0; i < 3; i++) line(pts[i].x, pts[i].y, pts[(i + 1) % 3].x, pts[(i + 1) % 3].y);
  for (i = 0; i < 3; i++) gravBody(pts[i].x, pts[i].y, 28 + 5 * mass, "#f97316", String(i + 1));
  gravText("直线：外星所受合力 = 5Gm²/(4L²)", 28, 408, "#2563eb", 13, LEFT);
  gravText("三角形：合力 = √3Gm²/L²", 310, 408, "#f97316", 13, LEFT);
}

function drawLesson9TripleStarGraph() {
  gravDrawOptionRows(
    "四个选项的模型核验",
    "横条到虚线表示与正确表达式吻合",
    ["A 直线速度", "B 直线周期", "C 三角角速度", "D 三角加速度"],
    [Math.sqrt(5) / 2, 1, 0.36, 1],
    [false, true, false, true]
  );
}

function lesson9Change4Values() {
  var K = Math.max(0.1, getJsonParam(currentScene, "K", 2));
  var P = Math.max(0.1, getJsonParam(currentScene, "P", 81));
  var Q = Math.max(0.1, getJsonParam(currentScene, "Q", 4));
  var earthRadius = 6.4e6;
  var gravity = 9.8;
  var speed = Math.sqrt(earthRadius * Q * gravity / (K * P));
  return { K: K, P: P, Q: Q, earthRadius: earthRadius, gravity: gravity, speed: speed };
}

function drawLesson9Change4SpeedScene() {
  var values = lesson9Change4Values();
  var p = getGravitationProgress();
  var earthX = 145;
  var moonX = 410;
  var cy = 252;
  var moonR = 46;
  var orbitR = Math.min(112, moonR * Math.max(1.25, values.K));
  var angle = -Math.PI / 2 + Math.PI * 2 * p;
  gravSceneHeading("由地球参数换算绕月速度", "M月=M地/P，R月=R/Q，轨道半径=KR月");
  gravBody(earthX, cy, 126, "#2563eb", "地");
  gravBody(moonX, cy, moonR * 2, "#94a3b8", "月");
  gravOrbit(moonX, cy, orbitR, "#cbd5e1", false);
  gravBody(moonX + orbitR * Math.cos(angle), cy + orbitR * Math.sin(angle), 19, "#f97316", "嫦");
  gravArrow(moonX + orbitR * Math.cos(angle), cy + orbitR * Math.sin(angle), moonX + orbitR * Math.cos(angle) - 42 * Math.sin(angle), cy + orbitR * Math.sin(angle) + 42 * Math.cos(angle), "#16a34a", "v");
  gravText("地球：R，M，g", earthX, 342, "#2563eb", 14, CENTER);
  gravText("月球：R/Q，M/P", moonX, 342, "#475569", 14, CENTER);
  gravText("K=" + values.K.toFixed(1) + "，P=" + values.P.toFixed(0) + "，Q=" + values.Q.toFixed(1), 28, 408, "#334155", 14, LEFT);
  gravText("v = " + (values.speed / 1000).toFixed(2) + " km/s", 360, 408, "#f97316", 15, LEFT);
}

function drawLesson9Change4SpeedGraph() {
  var values = lesson9Change4Values();
  var kMin = 1.1;
  var kMax = 5;
  var yMax = Math.sqrt(values.earthRadius * values.Q * values.gravity / (kMin * values.P)) / 1000 * 1.08;
  var frame = gravGraphFrame("绕月速率—轨道倍数 K", "v=√[RQg/(KP)]，轨道越高速度越小");
  gravPlot(frame, kMax - kMin, 0, yMax, "#2563eb", function (x) {
    return Math.sqrt(values.earthRadius * values.Q * values.gravity / ((kMin + x) * values.P)) / 1000;
  });
  gravGraphMarker(frame, values.K - kMin, kMax - kMin, values.speed / 1000, 0, yMax, "#dc2626");
  gravText("K=1.1", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("K=5", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function lesson9SpaceElevatorValues() {
  var radius = Math.max(1.1, getJsonParam(currentScene, "altitudeRatio", 3));
  var sync = Math.max(radius + 0.2, getJsonParam(currentScene, "syncRadiusRatio", 6.6));
  var omegaRatio = Math.pow(sync / radius, 1.5);
  return { radius: radius, sync: sync, omegaRatio: omegaRatio, accelerationRatio: 1 / (omegaRatio * omegaRatio) };
}

function drawLesson9SpaceElevatorScene() {
  var values = lesson9SpaceElevatorValues();
  var p = getGravitationProgress();
  var cx = 275;
  var cy = 255;
  var earthR = 58;
  var qR = 132;
  var syncR = 190;
  var qAngle = -Math.PI / 2 + Math.PI * 2 * p;
  var pAngle = -Math.PI / 2 + Math.PI * 2 * values.omegaRatio * p;
  var qx = cx + qR * Math.cos(qAngle);
  var qy = cy + qR * Math.sin(qAngle);
  gravSceneHeading("太空电梯 Q 与自由卫星 P", "同高度但角速度不同：低于同步轨道时 P 更快");
  gravBody(cx, cy, earthR * 2, "#60a5fa", "地");
  gravOrbit(cx, cy, qR, "#cbd5e1", false);
  gravOrbit(cx, cy, syncR, "#cbd5e1", true);
  stroke("#64748b");
  strokeWeight(3);
  line(cx, cy, cx + syncR * Math.cos(qAngle), cy + syncR * Math.sin(qAngle));
  gravBody(cx + syncR * Math.cos(qAngle), cy + syncR * Math.sin(qAngle), 21, "#0f766e", "站");
  gravBody(qx, qy, 21, "#f97316", "Q");
  gravBody(cx + qR * Math.cos(pAngle), cy + qR * Math.sin(pAngle), 21, "#2563eb", "P");
  gravText("ωP/ωQ = " + values.omegaRatio.toFixed(2), 28, 408, "#2563eb", 15, LEFT);
  gravText("aQ/aP = " + values.accelerationRatio.toFixed(2), 220, 408, "#f97316", 15, LEFT);
  gravText("Q 受缆绳约束，不是完全失重", 390, 408, "#334155", 13, LEFT);
}

function drawLesson9SpaceElevatorGraph() {
  var values = lesson9SpaceElevatorValues();
  var p = getGravitationProgress();
  var yMax = values.omegaRatio * 360 * 1.05;
  var frame = gravGraphFrame("P、Q 角位置—同一时间", "蓝：自由卫星 P；橙：随地球转动的 Q");
  gravPlot(frame, 1, 0, yMax, "#2563eb", function (x) { return 360 * values.omegaRatio * x; });
  gravPlot(frame, 1, 0, yMax, "#f97316", function (x) { return 360 * x; });
  gravGraphMarker(frame, p, 1, 360 * values.omegaRatio * p, 0, yMax, "#2563eb");
  gravGraphMarker(frame, p, 1, 360 * p, 0, yMax, "#f97316");
  gravLegendItem(frame.x + 8, frame.y + 8, "#2563eb", "P");
  gravLegendItem(frame.x + 54, frame.y + 8, "#f97316", "Q");
}

function lesson9MonitorValues() {
  var alpha = getJsonParam(currentScene, "coverageAngle", 60);
  var nearPeriod = getJsonParam(currentScene, "nearPeriod", 1.4);
  var orbitRatio = 1 / Math.max(0.05, Math.sin(alpha * Math.PI / 360));
  var satellitePeriod = nearPeriod * Math.pow(orbitRatio, 1.5);
  var relativePeriod = 1 / Math.max(0.0001, 1 / satellitePeriod - 1 / 24);
  var beta = 90 - alpha / 2;
  var windowTime = relativePeriod * 2 * beta / 360;
  return { alpha: alpha, orbitRatio: orbitRatio, satellitePeriod: satellitePeriod, relativePeriod: relativePeriod, beta: beta, windowTime: windowTime };
}

function drawLesson9MonitorWindowScene() {
  var values = lesson9MonitorValues();
  var p = getGravitationProgress();
  var cx = 275;
  var cy = 270;
  var earthR = 78;
  var orbitR = Math.min(180, earthR * values.orbitRatio);
  var stationAngle = -Math.PI / 2;
  var relative = (-values.beta + 2 * values.beta * p) * Math.PI / 180;
  var satelliteAngle = stationAngle + relative;
  var stationX = cx + earthR * Math.cos(stationAngle);
  var stationY = cy + earthR * Math.sin(stationAngle);
  var satelliteX = cx + orbitR * Math.cos(satelliteAngle);
  var satelliteY = cy + orbitR * Math.sin(satelliteAngle);
  gravSceneHeading("监测站连续可见窗口", "卫星相对监测站从 −β 移到 +β");
  gravBody(cx, cy, earthR * 2, "#60a5fa", "地");
  gravOrbit(cx, cy, orbitR, "#cbd5e1", false);
  gravBody(stationX, stationY, 18, "#0f766e", "B");
  gravBody(satelliteX, satelliteY, 22, "#f97316", "A");
  stroke("#0f766e");
  line(stationX, stationY, satelliteX, satelliteY);
  stroke("#cbd5e1");
  drawingContext.setLineDash([4, 4]);
  line(cx, cy, satelliteX, satelliteY);
  drawingContext.setLineDash([]);
  gravDrawAngleArc(cx, cy, 48, stationAngle, satelliteAngle, "#7c3aed", Math.abs(relative * 180 / Math.PI).toFixed(0) + "°");
  gravText("β = " + values.beta.toFixed(1) + "°", 28, 408, "#334155", 14, LEFT);
  gravText("T相 = " + values.relativePeriod.toFixed(2) + " h", 170, 408, "#334155", 14, LEFT);
  gravText("最长连续监测 " + values.windowTime.toFixed(2) + " h", 350, 408, "#dc2626", 14, LEFT);
}

function drawLesson9MonitorWindowGraph() {
  var values = lesson9MonitorValues();
  var p = getGravitationProgress();
  var time = values.windowTime * p;
  var separation = -values.beta + 2 * values.beta * p;
  var frame = gravGraphFrame("相对角—监测时间", "位于 ±β 之间时卫星可见");
  gravPlot(frame, values.windowTime, -values.beta * 1.2, values.beta * 1.2, "#2563eb", function (t) {
    return -values.beta + 2 * values.beta * t / values.windowTime;
  });
  stroke("#dc2626");
  drawingContext.setLineDash([4, 4]);
  var y1 = map(values.beta, -values.beta * 1.2, values.beta * 1.2, frame.y + frame.h, frame.y);
  var y2 = map(-values.beta, -values.beta * 1.2, values.beta * 1.2, frame.y + frame.h, frame.y);
  line(frame.x, y1, frame.x + frame.w, y1);
  line(frame.x, y2, frame.x + frame.w, y2);
  drawingContext.setLineDash([]);
  gravGraphMarker(frame, time, values.windowTime, separation, -values.beta * 1.2, values.beta * 1.2, "#f97316");
  gravText("0h", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText(values.windowTime.toFixed(2) + "h", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function lesson9SatelliteDistanceValues(progress) {
  var inner = getJsonParam(currentScene, "innerRadius", 1);
  var ratio = getJsonParam(currentScene, "outerRatio", 4);
  var omegaRatio = Math.pow(ratio, 1.5);
  var outerAngle = Math.PI * 2 * progress / Math.max(0.1, omegaRatio - 1);
  var innerAngle = outerAngle + Math.PI * 2 * progress;
  var distance = inner * Math.sqrt(1 + ratio * ratio - 2 * ratio * Math.cos(innerAngle - outerAngle));
  return { inner: inner, ratio: ratio, omegaRatio: omegaRatio, outerAngle: outerAngle, innerAngle: innerAngle, distance: distance };
}

function drawLesson9SatelliteDistanceScene() {
  var p = getGravitationProgress();
  var values = lesson9SatelliteDistanceValues(p);
  var cx = 275;
  var cy = 255;
  var innerR = 45;
  var outerR = innerR * values.ratio;
  var ax = cx + innerR * Math.cos(values.innerAngle);
  var ay = cy + innerR * Math.sin(values.innerAngle);
  var bx = cx + outerR * Math.cos(values.outerAngle);
  var by = cy + outerR * Math.sin(values.outerAngle);
  gravSceneHeading("双卫星距离随相对角变化", "内轨 A 比外轨 B 快，相邻同侧位置间隔一个会合周期");
  gravBody(cx, cy, 52, "#60a5fa", "地");
  gravOrbit(cx, cy, innerR, "#2563eb", false);
  gravOrbit(cx, cy, outerR, "#f97316", false);
  gravBody(ax, ay, 22, "#2563eb", "A");
  gravBody(bx, by, 22, "#f97316", "B");
  stroke("#7c3aed");
  strokeWeight(2);
  line(ax, ay, bx, by);
  gravText("Δr = " + values.distance.toFixed(2) + "r", 28, 408, "#7c3aed", 15, LEFT);
  gravText("最小 " + Math.abs(values.ratio - 1).toFixed(1) + "r", 220, 408, "#334155", 14, LEFT);
  gravText("最大 " + (values.ratio + 1).toFixed(1) + "r", 380, 408, "#334155", 14, LEFT);
}

function drawLesson9SatelliteDistanceGraph() {
  var p = getGravitationProgress();
  var values = lesson9SatelliteDistanceValues(p);
  var minD = values.inner * Math.abs(values.ratio - 1);
  var maxD = values.inner * (values.ratio + 1);
  var frame = gravGraphFrame("卫星间距 Δr—会合周期", "原题曲线在 3r 与 5r 之间周期变化");
  gravPlot(frame, 1, minD * 0.92, maxD * 1.04, "#7c3aed", function (x) {
    return values.inner * Math.sqrt(1 + values.ratio * values.ratio - 2 * values.ratio * Math.cos(Math.PI * 2 * x));
  });
  gravGraphMarker(frame, p, 1, values.distance, minD * 0.92, maxD * 1.04, "#dc2626");
  stroke("#64748b");
  drawingContext.setLineDash([4, 4]);
  var minY = map(minD, minD * 0.92, maxD * 1.04, frame.y + frame.h, frame.y);
  var maxY = map(maxD, minD * 0.92, maxD * 1.04, frame.y + frame.h, frame.y);
  line(frame.x, minY, frame.x + frame.w, minY);
  line(frame.x, maxY, frame.x + frame.w, maxY);
  drawingContext.setLineDash([]);
  gravText("0", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("T", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function lesson9TianzhouRadius(progress) {
  var r3 = getJsonParam(currentScene, "orbit3Ratio", 1.5);
  var target = Math.max(r3 + 0.05, getJsonParam(currentScene, "targetRatio", 1.8));
  if (progress < 0.25) return 1;
  if (progress < 0.55) return lerp(1, r3, 0.5 - 0.5 * Math.cos(Math.PI * (progress - 0.25) / 0.30));
  if (progress < 0.70) return r3;
  if (progress < 0.92) return lerp(r3, target, 0.5 - 0.5 * Math.cos(Math.PI * (progress - 0.70) / 0.22));
  return target;
}

function drawLesson9TianzhouScene() {
  var p = getGravitationProgress();
  var r3Ratio = getJsonParam(currentScene, "orbit3Ratio", 1.5);
  var targetRatio = Math.max(r3Ratio + 0.05, getJsonParam(currentScene, "targetRatio", 1.8));
  var cx = 280;
  var cy = 255;
  var baseR = 82;
  var r3 = baseR * r3Ratio;
  var targetR = baseR * targetRatio;
  var currentR = baseR * lesson9TianzhouRadius(p);
  var angle = Math.PI * 2 * (1.65 * p + 0.08);
  var x = cx + currentR * Math.cos(angle);
  var y = cy + currentR * Math.sin(angle);
  var stage = p < 0.25 ? "轨道1" : p < 0.55 ? "椭圆轨道2升轨" : p < 0.70 ? "圆轨道3" : p < 0.92 ? "再次加速追赶" : "完成对接";
  gravSceneHeading("天舟八号多次变轨与对接", "每次抬高远地点都从沿速度方向加速开始");
  gravBody(cx, cy, 76, "#60a5fa", "地");
  gravOrbit(cx, cy, baseR, "#2563eb", false);
  gravOrbit(cx, cy, r3, "#7c3aed", false);
  gravOrbit(cx, cy, targetR, "#f97316", true);
  gravBody(x, y, 20, "#7c3aed", "舟");
  var targetAngle = angle + 0.28 * (1 - p);
  gravBody(cx + targetR * Math.cos(targetAngle), cy + targetR * Math.sin(targetAngle), 22, "#f97316", "宫");
  if ((p > 0.22 && p < 0.30) || (p > 0.68 && p < 0.76)) {
    gravArrow(x, y, x - 42 * Math.sin(angle), y + 42 * Math.cos(angle), "#dc2626", "加速");
  }
  gravText(stage, 28, 408, "#0f172a", 15, LEFT);
  gravText("当前 r/r₁ = " + lesson9TianzhouRadius(p).toFixed(2), 260, 408, "#334155", 14, LEFT);
  gravText(p > 0.70 ? "目标在更高轨道" : "Q点同位置加速度相同", 430, 408, "#f97316", 13, LEFT);
}

function drawLesson9TianzhouGraph() {
  var p = getGravitationProgress();
  var r3 = getJsonParam(currentScene, "orbit3Ratio", 1.5);
  var target = Math.max(r3 + 0.05, getJsonParam(currentScene, "targetRatio", 1.8));
  var frame = gravGraphFrame("轨道半径—任务阶段", "红色虚线标出两次升轨点火");
  gravPlot(frame, 1, 0.9, target * 1.08, "#7c3aed", function (x) { return lesson9TianzhouRadius(x); });
  gravGraphMarker(frame, p, 1, lesson9TianzhouRadius(p), 0.9, target * 1.08, "#dc2626");
  stroke("#dc2626");
  drawingContext.setLineDash([4, 4]);
  var x1 = map(0.25, 0, 1, frame.x, frame.x + frame.w);
  var x2 = map(0.70, 0, 1, frame.x, frame.x + frame.w);
  line(x1, frame.y, x1, frame.y + frame.h);
  line(x2, frame.y, x2, frame.y + frame.h);
  drawingContext.setLineDash([]);
  gravText("P点火", x1, frame.y + 8, "#dc2626", 11, CENTER);
  gravText("再次加速", x2, frame.y + 8, "#dc2626", 11, CENTER);
}

function lesson9ProjectedOrbitPoint(cx, cy, u) {
  var longR = 172;
  var shortR = 70;
  var tilt = -0.34;
  var x0 = longR * Math.cos(u);
  var y0 = shortR * Math.sin(u);
  return {
    x: cx + x0 * Math.cos(tilt) - y0 * Math.sin(tilt),
    y: cy + x0 * Math.sin(tilt) + y0 * Math.cos(tilt)
  };
}

function drawLesson9GroundTrackScene() {
  var inclination = getJsonParam(currentScene, "inclination", 30);
  var p = getGravitationProgress();
  var cx = 280;
  var cy = 255;
  var earthR = 88;
  var u = Math.PI * 2 * p;
  var sat = lesson9ProjectedOrbitPoint(cx, cy, u);
  var dx = sat.x - cx;
  var dy = sat.y - cy;
  var length = Math.sqrt(dx * dx + dy * dy);
  var subX = cx + earthR * dx / length;
  var subY = cy + earthR * dy / length;
  var latitude = inclination * Math.sin(3 * Math.PI * p);
  gravSceneHeading("倾斜轨道与星下点", "星下点最高纬度等于轨道倾角");
  gravBody(cx, cy, earthR * 2, "#60a5fa", "地");
  noFill();
  stroke("#2563eb");
  strokeWeight(2);
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var point = lesson9ProjectedOrbitPoint(cx, cy, Math.PI * 2 * i / 120);
    vertex(point.x, point.y);
  }
  endShape();
  gravBody(sat.x, sat.y, 21, "#f97316", "F");
  gravBody(subX, subY, 12, "#dc2626", "");
  stroke("#64748b");
  drawingContext.setLineDash([4, 4]);
  line(sat.x, sat.y, subX, subY);
  drawingContext.setLineDash([]);
  stroke("#e2e8f0");
  line(cx - earthR, cy, cx + earthR, cy);
  gravText("当前星下点纬度 " + latitude.toFixed(1) + "°", 28, 408, "#dc2626", 15, LEFT);
  gravText("最大纬度 ±" + inclination.toFixed(0) + "°，不能覆盖两极", 315, 408, "#334155", 14, LEFT);
}

function drawLesson9GroundTrackGraph() {
  var inclination = getJsonParam(currentScene, "inclination", 30);
  var p = getGravitationProgress();
  var longitude = 360 * p;
  var latitude = inclination * Math.sin(3 * Math.PI * p);
  var frame = gravGraphFrame("星下点纬度—经度", "三波瓣轨迹；蓝、橙为相邻航次");
  gravPlot(frame, 360, -inclination * 1.15, inclination * 1.15, "#2563eb", function (x) {
    return inclination * Math.sin(3 * Math.PI * x / 360);
  });
  gravPlot(frame, 360, -inclination * 1.15, inclination * 1.15, "#f97316", function (x) {
    return -inclination * Math.sin(3 * Math.PI * x / 360);
  });
  gravGraphMarker(frame, longitude, 360, latitude, -inclination * 1.15, inclination * 1.15, "#dc2626");
  stroke("#64748b");
  line(frame.x, map(0, -inclination * 1.15, inclination * 1.15, frame.y + frame.h, frame.y), frame.x + frame.w, map(0, -inclination * 1.15, inclination * 1.15, frame.y + frame.h, frame.y));
  gravText("0°", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("360°", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function drawLesson9BlackHoleScene() {
  var mass = getJsonParam(currentScene, "massScale", 1);
  var p = getGravitationProgress();
  var cx = 280;
  var cy = 255;
  var horizon = 62 + 12 * Math.sqrt(mass);
  var angle = Math.PI * 2 * p;
  gravSceneHeading("黑洞事件视界的临界自转", "最大半径 R=2GM/c²，表面临界速度由引力提供");
  for (var i = 0; i < 18; i++) {
    var sx = 35 + (i * 83) % 500;
    var sy = 95 + (i * 47) % 300;
    gravBody(sx, sy, i % 3 === 0 ? 4 : 2, "#cbd5e1", "");
  }
  noFill();
  stroke("#7c3aed");
  strokeWeight(9);
  ellipse(cx, cy, horizon * 3.2, horizon * 0.72);
  gravBody(cx, cy, horizon * 2, "#020617", "");
  noFill();
  stroke("#f97316");
  strokeWeight(2);
  circle(cx, cy, horizon * 2);
  var px = cx + horizon * Math.cos(angle);
  var py = cy + horizon * Math.sin(angle);
  gravBody(px, py, 13, "#fbbf24", "");
  gravArrow(px, py, px - 48 * Math.sin(angle), py + 48 * Math.cos(angle), "#fbbf24", "c/√2");
  gravText("M = " + mass.toFixed(1) + "M₀", 28, 408, "#e2e8f0", 14, LEFT);
  gravText("R ∝ M", 210, 408, "#f97316", 15, LEFT);
  gravText("Tmin = 4√2πGM/c³", 355, 408, "#0f172a", 15, LEFT);
}

function drawLesson9BlackHoleGraph() {
  var mass = getJsonParam(currentScene, "massScale", 1);
  var frame = gravGraphFrame("最小自转周期—黑洞质量", "以 M₀ 对应周期为 1；Tmin 与 M 成正比");
  gravPlot(frame, 4.5, 0, 5.4, "#7c3aed", function (x) { return 0.5 + x; });
  gravGraphMarker(frame, mass - 0.5, 4.5, mass, 0, 5.4, "#dc2626");
  gravText("0.5M₀", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("5M₀", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
  gravText("斜率 = 4√2πG/c³", frame.x + 10, frame.y + 10, "#334155", 12, LEFT);
}

function lesson9RodGraphValues() {
  var R = Math.max(0.1, getJsonParam(currentScene, "rodRadius", 1));
  var g = Math.max(0.1, getJsonParam(currentScene, "gravity", 10));
  var mass = Math.max(0.1, getJsonParam(currentScene, "mass", 1));
  var p = getGravitationProgress();
  var b = g * R;
  var v2 = 1.4 * b * p;
  var force = mass * g - mass * v2 / R;
  return { R: R, g: g, mass: mass, b: b, a: mass * g, v2: v2, force: force };
}

function drawLesson9RodGraphScene() {
  var values = lesson9RodGraphValues();
  var cx = 280;
  var cy = 285;
  var radius = 118;
  var bx = cx;
  var by = cy - radius;
  gravSceneHeading("最高点弹力随速度改变", "重复实验改变最高点速度，读取 F-v² 直线");
  gravOrbit(cx, cy, radius, "#cbd5e1", false);
  stroke("#64748b");
  strokeWeight(5);
  line(cx, cy, bx, by);
  gravBody(cx, cy, 22, "#0f172a", "O");
  gravBody(bx, by, 26, "#f97316", "m");
  var velocityLength = map(Math.sqrt(values.v2), 0, Math.sqrt(1.4 * values.b), 16, 88);
  gravArrow(bx, by, bx + velocityLength, by, "#2563eb", "v");
  gravArrow(bx - 12, by, bx - 12, by + 62, "#dc2626", "mg");
  var fLength = map(Math.abs(values.force), 0, values.a, 0, 62);
  if (fLength > 3) {
    gravArrow(bx + 12, by, bx + 12, by + (values.force >= 0 ? -fLength : fLength), "#16a34a", "F");
  }
  gravText("v² = " + values.v2.toFixed(2) + " m²/s²", 28, 408, "#2563eb", 14, LEFT);
  gravText("F = " + values.force.toFixed(2) + " N", 250, 408, values.force >= 0 ? "#15803d" : "#dc2626", 15, LEFT);
  gravText("横截距 b=gR=" + values.b.toFixed(2), 385, 408, "#334155", 13, LEFT);
}

function drawLesson9RodGraphGraph() {
  var values = lesson9RodGraphValues();
  var xMax = 1.4 * values.b;
  var yMin = -0.45 * values.a;
  var yMax = 1.08 * values.a;
  var frame = gravGraphFrame("原题 F—v² 图像", "F=mg−(m/R)v²；横截距 b=gR");
  gravPlot(frame, xMax, yMin, yMax, "#2563eb", function (x) {
    return values.a - values.mass * x / values.R;
  });
  gravGraphMarker(frame, values.v2, xMax, values.force, yMin, yMax, "#dc2626");
  stroke("#64748b");
  var zeroY = map(0, yMin, yMax, frame.y + frame.h, frame.y);
  line(frame.x, zeroY, frame.x + frame.w, zeroY);
  var bX = map(values.b, 0, xMax, frame.x, frame.x + frame.w);
  drawingContext.setLineDash([4, 4]);
  line(bX, frame.y, bX, frame.y + frame.h);
  drawingContext.setLineDash([]);
  gravText("b", bX, frame.y + frame.h + 10, "#dc2626", 12, CENTER);
}

function lesson9PulsarValues() {
  var T0 = Math.max(0.5, getJsonParam(currentScene, "binaryPeriod", 12));
  var T = Math.min(T0 - 0.2, Math.max(0.2, getJsonParam(currentScene, "satellitePeriod", 3)));
  var interval = T * T0 / (2 * (T0 - T));
  return { T0: T0, T: T, interval: interval };
}

function drawLesson9PulsarScene() {
  var values = lesson9PulsarValues();
  var p = getGravitationProgress();
  var time = values.T0 * p;
  var cx = 270;
  var cy = 255;
  var binaryR = 105;
  var satelliteR = 42;
  var binaryAngle = -Math.PI / 2 + Math.PI * 2 * time / values.T0;
  var cAngle = -Math.PI / 2 + Math.PI * 2 * time / values.T;
  var ax = cx - binaryR * Math.cos(binaryAngle);
  var ay = cy - binaryR * Math.sin(binaryAngle);
  var bx = cx + binaryR * Math.cos(binaryAngle);
  var by = cy + binaryR * Math.sin(binaryAngle);
  var cxSat = bx + satelliteR * Math.cos(cAngle);
  var cySat = by + satelliteR * Math.sin(cAngle);
  gravSceneHeading("脉冲双星与 b 的卫星 c", "双星慢转，c 绕 b 快速转动；相对半周就再次共线");
  gravOrbit(cx, cy, binaryR, "#cbd5e1", true);
  stroke("#94a3b8");
  line(ax, ay, bx, by);
  gravBody(cx, cy, 13, "#0f172a", "O");
  gravBody(ax, ay, 31, "#2563eb", "a");
  gravBody(bx, by, 31, "#f97316", "b");
  noFill();
  stroke("#cbd5e1");
  circle(bx, by, satelliteR * 2);
  gravBody(cxSat, cySat, 18, "#7c3aed", "c");
  gravText("t = " + time.toFixed(2) + " h", 28, 408, "#334155", 14, LEFT);
  gravText("共线间隔 Δt = " + values.interval.toFixed(2) + " h", 220, 408, "#7c3aed", 15, LEFT);
  gravText("T<T₀", 490, 408, "#dc2626", 14, LEFT);
}

function drawLesson9PulsarGraph() {
  var values = lesson9PulsarValues();
  var p = getGravitationProgress();
  var time = values.T0 * p;
  var phaseUnits = 2 * time * (1 / values.T - 1 / values.T0);
  var maxPhase = 2 * values.T0 * (1 / values.T - 1 / values.T0);
  var frame = gravGraphFrame("相对相位/π—时间", "相对相位每增加 1 就再次共线");
  gravPlot(frame, values.T0, 0, Math.max(1.1, maxPhase), "#7c3aed", function (t) {
    return 2 * t * (1 / values.T - 1 / values.T0);
  });
  stroke("#94a3b8");
  drawingContext.setLineDash([4, 4]);
  for (var i = 1; i <= Math.floor(maxPhase); i++) {
    var y = map(i, 0, Math.max(1.1, maxPhase), frame.y + frame.h, frame.y);
    line(frame.x, y, frame.x + frame.w, y);
  }
  drawingContext.setLineDash([]);
  gravGraphMarker(frame, time, values.T0, phaseUnits, 0, Math.max(1.1, maxPhase), "#dc2626");
  gravText("0", frame.x, frame.y + frame.h + 10, "#334155", 11, LEFT);
  gravText("T₀", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}

function lesson9EllipseEnergyAt(progress) {
  var a = Math.max(0.2, getJsonParam(currentScene, "semiMajor", 5));
  var e = constrain(getJsonParam(currentScene, "eccentricity", 0.5), 0.01, 0.9);
  var M = Math.PI * 2 * progress;
  var E = M;
  for (var i = 0; i < 7; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  var r = a * (1 - e * Math.cos(E));
  var total = -1 / (2 * a);
  var potential = -1 / r;
  var kinetic = total - potential;
  return { a: a, e: e, E: E, r: r, total: total, potential: potential, kinetic: kinetic };
}

function drawLesson9EllipseEnergyScene() {
  var p = getGravitationProgress();
  var values = lesson9EllipseEnergyAt(p);
  var cx = 300;
  var cy = 252;
  var displayA = 170;
  var pos = gravEllipsePoint(cx, cy, displayA, values.e, Math.PI * 2 * p, true);
  var next = gravEllipsePoint(cx, cy, displayA, values.e, Math.PI * 2 * ((p + 0.002) % 1), true);
  var dx = next.x - pos.x;
  var dy = next.y - pos.y;
  var mag = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
  var speedScale = 58 * Math.sqrt(values.kinetic / Math.max(0.001, lesson9EllipseEnergyAt(0).kinetic));
  gravSceneHeading("椭圆轨道上的能量交换", "近日点快、远日点慢；总机械能只由半长轴决定");
  gravDrawEllipse(cx, cy, displayA, values.e, true, "#94a3b8");
  gravBody(cx, cy, 38, "#f59e0b", "F");
  gravBody(pos.x, pos.y, 22, "#2563eb", "P");
  stroke("#cbd5e1");
  line(cx, cy, pos.x, pos.y);
  gravArrow(pos.x, pos.y, pos.x + speedScale * dx / mag, pos.y + speedScale * dy / mag, "#16a34a", "v");
  gravText("A 近点", cx - displayA * (1 - values.e) - 56, cy + 8, "#dc2626", 12, LEFT);
  gravText("B 远点", cx + displayA * (1 + values.e) + 8, cy + 8, "#7c3aed", 12, LEFT);
  gravText("r = " + values.r.toFixed(2) + "R", 28, 408, "#334155", 14, LEFT);
  gravText("K = " + values.kinetic.toFixed(3), 210, 408, "#16a34a", 14, LEFT);
  gravText("U = " + values.potential.toFixed(3), 350, 408, "#f97316", 14, LEFT);
  gravText("E = " + values.total.toFixed(3), 485, 408, "#7c3aed", 14, LEFT);
}

function drawLesson9EllipseEnergyGraph() {
  var p = getGravitationProgress();
  var values = lesson9EllipseEnergyAt(p);
  var peri = lesson9EllipseEnergyAt(0);
  var yMin = peri.potential * 1.12;
  var yMax = peri.kinetic * 1.18;
  var frame = gravGraphFrame("动能、势能与总机械能", "蓝：K；橙：U；紫：E=−GMm/(2a)");
  gravPlot(frame, 1, yMin, yMax, "#2563eb", function (x) { return lesson9EllipseEnergyAt(x).kinetic; });
  gravPlot(frame, 1, yMin, yMax, "#f97316", function (x) { return lesson9EllipseEnergyAt(x).potential; });
  gravPlot(frame, 1, yMin, yMax, "#7c3aed", function () { return values.total; });
  gravGraphMarker(frame, p, 1, values.kinetic, yMin, yMax, "#2563eb");
  gravGraphMarker(frame, p, 1, values.potential, yMin, yMax, "#f97316");
  gravLegendItem(frame.x + 8, frame.y + 8, "#2563eb", "K");
  gravLegendItem(frame.x + 54, frame.y + 8, "#f97316", "U");
  gravLegendItem(frame.x + 100, frame.y + 8, "#7c3aed", "E");
  gravText("一周", frame.x + frame.w, frame.y + frame.h + 10, "#334155", 11, RIGHT);
}
