// Homework scenes for mechanical energy.
function meSeaProjectileValues(progress) {
  var speed = meParam("speed", 12);
  var depth = meParam("depth", 8);
  var g = meParam("g", 10);
  var angle = 35 * Math.PI / 180;
  var vx = speed * Math.cos(angle);
  var vy = speed * Math.sin(angle);
  var totalTime = (vy + Math.sqrt(vy * vy + 2 * g * depth)) / g;
  var time = progress * totalTime;
  return {
    x: vx * time,
    y: vy * time - 0.5 * g * time * time,
    vx: vx,
    vy: vy - g * time,
    totalTime: totalTime,
    range: vx * totalTime,
    maxHeight: vy * vy / (2 * g)
  };
}

function drawLesson12ProjectileSeaScene() {
  var p = meSeaProjectileValues(meProgress());
  var depth = meParam("depth", 8);
  var x = map(p.x, 0, p.range, 108, 512);
  var y = map(p.y, -depth, Math.max(0.1, p.maxHeight), 398, 112);
  var groundY = map(0, -depth, p.maxHeight, 398, 112);
  meText("以地面为零势能面，海面势能为负", 28, 30, "#0f172a", 18, LEFT);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(30, groundY, 86, 398 - groundY);
  meGround(groundY, 30, 116);
  stroke("#2563eb");
  strokeWeight(3);
  line(116, 398, 542, 398);
  fill("#dbeafe");
  noStroke();
  rect(116, 399, 426, 28);
  meText("海平面", 444, 380, "#2563eb", 13, LEFT);
  noFill();
  stroke("#94a3b8");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  beginShape();
  for (var i = 0; i <= 60; i += 1) {
    var s = meSeaProjectileValues(i / 60);
    vertex(map(s.x, 0, p.range, 108, 512), map(s.y, -depth, p.maxHeight, 398, 112));
  }
  endShape();
  drawingContext.setLineDash([]);
  meBall(x, y, "#f97316", "");
  meText("y = " + p.y.toFixed(2) + " m", 30, 458, "#334155", 14, LEFT);
  meText(p.y < 0 ? "Eₚ < 0" : "Eₚ ≥ 0", 350, 458, p.y < 0 ? "#dc2626" : "#2563eb", 14, LEFT);
}

function drawLesson12ProjectileSeaGraph() {
  var m = meParam("mass", 1);
  var speed = meParam("speed", 12);
  var depth = meParam("depth", 8);
  var g = meParam("g", 10);
  var p = meSeaProjectileValues(meProgress());
  var total = 0.5 * m * speed * speed;
  var minEnergy = -m * g * depth * 1.12;
  var maxEnergy = (total + m * g * depth) * 1.12;
  var frame = meAxes("落到海平面时的能量", "相对地面高度 y / m", "能量 / J", -depth, Math.max(1, p.maxHeight), minEnergy, maxEnergy);
  mePlot(frame, "#2563eb", function (y) { return m * g * y; });
  mePlot(frame, "#f97316", function (y) { return total - m * g * y; });
  mePlot(frame, "#0f766e", function () { return total; }, 20, true);
  meMarker(frame, p.y, m * g * p.y, "#2563eb");
  meLegend([
    { color: "#2563eb", label: "重力势能 Eₚ" },
    { color: "#f97316", label: "动能 Eₖ" },
    { color: "#0f766e", label: "机械能 E" }
  ], 690, 110);
}

function mePirateValues() {
  var m = meParam("mass", 0.2);
  var k = meParam("k", 80);
  var x0 = meParam("compression", 0.12);
  var g = meParam("g", 10);
  var total = 0.5 * k * x0 * x0;
  return { m: m, k: k, x0: x0, g: g, total: total, equilibrium: m * g / k };
}

function drawLesson12PirateSpringScene() {
  var values = mePirateValues();
  var q = meProgress();
  var compression = values.x0 * (1 - q);
  var ballY = lerp(338, 164, q);
  meText("海盗桶：小球速度先增大后减小", 28, 30, "#0f172a", 18, LEFT);
  fill("#f59e0b");
  stroke("#92400e");
  strokeWeight(3);
  rect(132, 100, 276, 328, 8);
  fill("#fff7ed");
  noStroke();
  rect(160, 116, 220, 286);
  meGround(414, 95, 445);
  meSpring(270, 400, 270, ballY + 16, "#a855f7", 10);
  meBall(270, ballY, "#ef4444", "");
  stroke("#2563eb");
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(165, 164, 375, 164);
  drawingContext.setLineDash([]);
  meText("A：弹簧原长", 382, 164, "#2563eb", 13, LEFT);
  meText("B", 298, 338, "#0f172a", 13, LEFT);
  meText("压缩量 x = " + compression.toFixed(3) + " m", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12PirateSpringGraph() {
  var values = mePirateValues();
  var frame = meAxes("弹射过程的势能和与动能", "小球上移 y / m", "能量 / J", 0, values.x0, 0, Math.max(0.1, values.total * 1.15));
  mePlot(frame, "#a855f7", function (y) {
    return values.m * values.g * y + 0.5 * values.k * Math.pow(values.x0 - y, 2);
  });
  mePlot(frame, "#f97316", function (y) {
    return Math.max(0, values.total - values.m * values.g * y - 0.5 * values.k * Math.pow(values.x0 - y, 2));
  });
  var yNow = values.x0 * meProgress();
  meMarker(frame, yNow, values.m * values.g * yNow + 0.5 * values.k * Math.pow(values.x0 - yNow, 2), "#a855f7");
  meLegend([
    { color: "#a855f7", label: "Epg + Epe" },
    { color: "#f97316", label: "小球动能 Eₖ" }
  ], 700, 110);
  var yAtMax = values.x0 - values.equilibrium;
  meText("势能和最小：kx = mg", 795, 166, "#2563eb", 12, CENTER);
  if (yAtMax > 0 && yAtMax < values.x0) {
    stroke("#2563eb");
    drawingContext.setLineDash([4, 4]);
    line(meGX(frame, yAtMax), frame.top, meGX(frame, yAtMax), frame.bottom);
    drawingContext.setLineDash([]);
  }
}

function meTrackHeightRatios() {
  var cut = meParam("cutRatio", 0.6);
  var angle = meParam("angle", 35) * Math.PI / 180;
  return {
    cut: cut + (1 - cut) * Math.sin(angle) * Math.sin(angle),
    loop: 25 / 27,
    smooth: 1
  };
}

function drawLesson12TrackDeformationScene() {
  var q = meProgress();
  var ratios = meTrackHeightRatios();
  var lanes = [
    { y: 150, label: "C点截断", color: "#f97316", ratio: ratios.cut },
    { y: 275, label: "圆弧脱轨", color: "#a855f7", ratio: ratios.loop },
    { y: 400, label: "连续曲面", color: "#2563eb", ratio: ratios.smooth }
  ];
  meText("约束是否持续，决定能否真正到达 h", 28, 30, "#0f172a", 18, LEFT);
  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(40, 70, 540, 70);
  drawingContext.setLineDash([]);
  meText("目标高度 h", 38, 54, "#475569", 12, LEFT);
  for (var i = 0; i < lanes.length; i += 1) {
    var lane = lanes[i];
    noFill();
    stroke(lane.color);
    strokeWeight(3);
    if (i === 0) {
      line(60, lane.y, 280, lane.y - 78);
      drawingContext.setLineDash([4, 4]);
      beginShape();
      for (var j = 0; j <= 24; j += 1) {
        var u = j / 24;
        vertex(280 + 150 * u, lane.y - 78 - 54 * u + 50 * u * u);
      }
      endShape();
      drawingContext.setLineDash([]);
    } else if (i === 1) {
      arc(255, lane.y - 55, 110, 110, -Math.PI / 2, Math.PI * 1.5);
    } else {
      beginShape();
      for (var k = 0; k <= 30; k += 1) {
        var w = k / 30;
        vertex(60 + 400 * w, lane.y - 205 * w * w);
      }
      endShape();
    }
    var ballX = lerp(70, i === 2 ? 455 : 390, q);
    var startY = lane.y - 8;
    var targetY = 430 - lane.ratio * 335;
    var ballY = lerp(startY, targetY, 2 * q - q * q);
    meBall(ballX, ballY, lane.color, "", 17);
    meText(lane.label, 470, lane.y - 4, lane.color, 13, LEFT);
  }
}

function drawLesson12TrackDeformationGraph() {
  var ratios = meTrackHeightRatios();
  var frame = meAxes("不同轨道的实际最大高度", "", "Hmax / h", 0, 3, 0, 1.08);
  meBar(frame, 0, 3, ratios.cut, "#f97316", "截断", ratios.cut.toFixed(3));
  meBar(frame, 1, 3, ratios.loop, "#a855f7", "圆弧", ratios.loop.toFixed(3));
  meBar(frame, 2, 3, ratios.smooth, "#2563eb", "光滑曲面", "1.000");
  stroke("#dc2626");
  drawingContext.setLineDash([5, 4]);
  line(frame.left, meGY(frame, 1), frame.right, meGY(frame, 1));
  drawingContext.setLineDash([]);
}

function drawLesson12InclinePullScene() {
  var q = meProgress();
  var angle = meParam("angle", 30) * Math.PI / 180;
  var start = { x: 82, y: 394 };
  var lengthPx = 430;
  var end = { x: start.x + lengthPx * Math.cos(angle), y: start.y - lengthPx * Math.sin(angle) };
  var x = lerp(start.x, end.x, q * q);
  var y = lerp(start.y, end.y, q * q);
  meText("斜面上升：动能和势能同时增加", 28, 30, "#0f172a", 18, LEFT);
  meGround(412, 42, 542);
  stroke("#475569");
  strokeWeight(5);
  line(start.x, start.y, end.x, end.y);
  meBlock(x, y - 16, "#f97316", "", -angle);
  meArrow(x, y - 48, x + 76 * Math.cos(angle), y - 48 - 76 * Math.sin(angle), "#dc2626", "F");
  meArrow(x - 24, y - 20, x - 24, y + 55, "#2563eb", "mg");
  meText("a = " + meParam("accelRatio", 0.5).toFixed(2) + "g", 32, 458, "#334155", 14, LEFT);
  meText("s = " + (meParam("distance", 4) * q * q).toFixed(2) + " m", 330, 458, "#2563eb", 14, LEFT);
}

function drawLesson12InclinePullGraph() {
  var m = meParam("mass", 2);
  var distance = meParam("distance", 4);
  var angle = meParam("angle", 30) * Math.PI / 180;
  var ratio = meParam("accelRatio", 0.5);
  var g = meParam("g", 10);
  var maxEnergy = m * g * distance * (ratio + Math.sin(angle));
  var frame = meAxes("沿斜面位移对应的能量增量", "位移 s / m", "能量增量 / J", 0, distance, 0, maxEnergy * 1.12);
  mePlot(frame, "#f97316", function (s) { return m * ratio * g * s; });
  mePlot(frame, "#2563eb", function (s) { return m * g * s * Math.sin(angle); });
  mePlot(frame, "#0f766e", function (s) { return m * g * s * (ratio + Math.sin(angle)); });
  var sNow = distance * meProgress() * meProgress();
  meMarker(frame, sNow, m * g * sNow * (ratio + Math.sin(angle)), "#0f766e");
  meLegend([
    { color: "#f97316", label: "ΔEₖ" },
    { color: "#2563eb", label: "ΔEₚ" },
    { color: "#0f766e", label: "ΔE机械" }
  ], 710, 110);
}

function drawLesson12CarRoadsScene() {
  var q = meProgress();
  var angle = meParam("angle", 30) * Math.PI / 180;
  var groundY = 390;
  var slopeStart = { x: 300, y: groundY };
  var slopeEnd = { x: 510, y: groundY - 210 * Math.tan(angle) };
  meText("水平匀速后，再以另一恒功率匀速爬坡", 28, 30, "#0f172a", 18, LEFT);
  meGround(groundY + 18, 28, 542);
  stroke("#475569");
  strokeWeight(5);
  line(52, groundY, slopeStart.x, groundY);
  line(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
  var carX;
  var carY;
  var carAngle;
  if (q < 0.45) {
    var u = q / 0.45;
    carX = lerp(70, 275, u);
    carY = groundY - 18;
    carAngle = 0;
  } else {
    var v = (q - 0.45) / 0.55;
    carX = lerp(slopeStart.x + 20, slopeEnd.x - 20, v);
    carY = lerp(slopeStart.y - 18, slopeEnd.y - 18, v);
    carAngle = -angle;
  }
  meCar(carX, carY, carAngle);
  meText("M", 52, groundY + 38, "#0f172a", 13, CENTER);
  meText("N / P", slopeStart.x, groundY + 38, "#0f172a", 13, CENTER);
  meText("Q", slopeEnd.x, slopeEnd.y - 28, "#0f172a", 13, CENTER);
  var f1 = meParam("power1", 48) * 1000 / meParam("speed1", 16);
  var f2 = meParam("power2", 96) * 1000 / meParam("speed2", 8);
  meText("水平牵引力 " + meNumber(f1) + " N", 28, 458, "#334155", 14, LEFT);
  meText("坡道牵引力 " + meNumber(f2) + " N", 300, 458, "#2563eb", 14, LEFT);
}

function drawLesson12CarRoadsGraph() {
  var m = meParam("mass", 1600);
  var length = meParam("length", 200);
  var angle = meParam("angle", 30) * Math.PI / 180;
  var g = meParam("g", 10);
  var maxEnergy = m * g * length * Math.sin(angle);
  var frame = meAxes("汽车机械能沿两路段变化", "累计路程 s / m", "ΔE机械 / J", 0, 2 * length, 0, maxEnergy * 1.12);
  mePlot(frame, "#2563eb", function (s) {
    return s <= length ? 0 : m * g * (s - length) * Math.sin(angle);
  });
  var q = meProgress();
  var distance = q < 0.45 ? length * q / 0.45 : length + length * (q - 0.45) / 0.55;
  var energy = distance <= length ? 0 : m * g * (distance - length) * Math.sin(angle);
  meMarker(frame, distance, energy, "#dc2626");
  meText("MN：动能、势能均不变", 790, 112, "#334155", 12, CENTER);
  meText("PQ：匀速但势能增加", 790, 133, "#2563eb", 12, CENTER);
}

function mePulleySliderValues(progress) {
  var yRatio = lerp(-4 / 3, 3 / 4, progress);
  var ropeRatio = Math.sqrt(1 + yRatio * yRatio);
  return {
    yRatio: yRatio,
    aDownRatio: 5 / 3 - ropeRatio
  };
}

function drawLesson12PulleySliderScene() {
  var q = meProgress();
  var values = mePulleySliderValues(q);
  var dPx = 130;
  var pulley = { x: 390, y: 152 };
  var rodX = pulley.x - dPx;
  var bY = pulley.y - values.yRatio * dPx;
  var aY = 224 + values.aDownRatio * dPx;
  meText("B 单调上升，A 先下降后上升", 28, 30, "#0f172a", 18, LEFT);
  stroke("#475569");
  strokeWeight(5);
  line(rodX, 44, rodX, 424);
  fill("#e2e8f0");
  stroke("#64748b");
  circle(pulley.x, pulley.y, 34);
  stroke("#334155");
  strokeWeight(2);
  line(rodX, bY, pulley.x, pulley.y);
  line(pulley.x + 17, pulley.y, pulley.x + 17, aY);
  meBall(rodX, bY, "#2563eb", "B");
  meBlock(pulley.x + 17, aY, "#f97316", "A");
  meText("P", rodX - 27, pulley.y + 4 * dPx / 3, "#475569", 13, CENTER);
  meText("Q", rodX - 27, pulley.y, "#475569", 13, CENTER);
  meText("M", rodX - 27, pulley.y - 3 * dPx / 4, "#475569", 13, CENTER);
  meText("A 向下位移 / d = " + values.aDownRatio.toFixed(3), 28, 458, "#334155", 14, LEFT);
}

function drawLesson12PulleySliderGraph() {
  var frame = meAxes("绳长约束下的两物体位置", "过程进度", "位移 / d", 0, 1, -1.5, 0.9);
  mePlot(frame, "#2563eb", function (u) { return mePulleySliderValues(u).yRatio; });
  mePlot(frame, "#f97316", function (u) { return mePulleySliderValues(u).aDownRatio; });
  var current = meProgress();
  meMarker(frame, current, mePulleySliderValues(current).aDownRatio, "#f97316");
  meLegend([
    { color: "#2563eb", label: "B 高度 yB/d" },
    { color: "#f97316", label: "A 向下位移 zA/d" }
  ], 690, 110);
  meText("Q 点：A速度为0，但加速度不为0", 795, 166, "#334155", 12, CENTER);
}

function meBufferSpeed(displacement) {
  var m = meParam("mass", 2);
  var k = meParam("k", 400);
  var friction = meParam("friction", 40);
  return Math.sqrt(Math.max(0, friction * friction / (k * m) + 2 * friction * displacement / m));
}

function drawLesson12BufferScene() {
  var q = meProgress();
  var limit = meParam("limit", 0.8);
  var friction = meParam("friction", 40);
  var k = meParam("k", 400);
  var compression = friction / k;
  var rodTravel = q < 0.36 ? 0 : limit * 0.25 * (q - 0.36) / 0.64;
  var rodX = 360 + 150 * rodTravel / Math.max(0.01, limit);
  var carX = q < 0.36 ? lerp(86, 250, q / 0.36) : 250 + 150 * rodTravel / Math.max(0.01, limit);
  meText("先压簧至 kx=f，再推动轻杆滑动", 28, 30, "#0f172a", 18, LEFT);
  meGround(380, 32, 542);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(350, 258, 180, 86, 4);
  fill("#ffffff");
  rect(364, 274, 152, 52);
  stroke("#334155");
  strokeWeight(8);
  line(rodX, 300, rodX + 112, 300);
  meSpring(carX + 42, 300, rodX, 300, "#2563eb", 8);
  meCar(carX, 350, 0);
  meArrow(rodX + 28, 252, rodX + 90, 252, "#dc2626", "杆位移");
  meArrow(rodX + 70, 332, rodX + 16, 332, "#f97316", "f");
  meText("临界压缩量 f/k = " + compression.toFixed(3) + " m", 28, 458, "#334155", 14, LEFT);
  meText("杆已移动 " + rodTravel.toFixed(3) + " m", 320, 458, "#2563eb", 14, LEFT);
}

function drawLesson12BufferGraph() {
  var limit = meParam("limit", 0.8);
  var maxSpeed = meBufferSpeed(limit);
  var frame = meAxes("停止时杆位移对应的撞击速度", "轻杆位移 s / m", "撞击速度 u / (m/s)", 0, limit, 0, maxSpeed * 1.16);
  mePlot(frame, "#2563eb", function (s) { return meBufferSpeed(s); });
  var baseline = limit / 4;
  meMarker(frame, baseline, meBufferSpeed(baseline), "#dc2626");
  meMarker(frame, limit, meBufferSpeed(limit), "#f97316");
  meText("s=l/4 对应 v₀", 795, 112, "#dc2626", 12, CENTER);
  meText("s=l 对应安全最大速度", 795, 133, "#f97316", 12, CENTER);
}

function drawLesson12SlidingRopeScene() {
  var q = Math.max(0.015, meProgress());
  var tableY = 220;
  var edgeX = 420;
  var horizontal = 320 * (1 - q);
  var vertical = 210 * q;
  meText("整根柔绳速度相同，悬垂段提供驱动力", 28, 30, "#0f172a", 18, LEFT);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(48, tableY, edgeX - 48, 36);
  rect(edgeX - 12, tableY, 36, 218);
  noFill();
  stroke("#f97316");
  strokeWeight(9);
  line(edgeX - horizontal, tableY - 6, edgeX, tableY - 6);
  line(edgeX, tableY - 6, edgeX, tableY - 6 + vertical);
  meArrow(edgeX + 45, tableY + 10, edgeX + 45, tableY + 80, "#dc2626", "运动方向");
  meText("O", edgeX + 15, tableY - 28, "#0f172a", 14, LEFT);
  meText("x/L = " + q.toFixed(3), 28, 458, "#334155", 14, LEFT);
  meText("a/g = x/L", 350, 458, "#2563eb", 14, LEFT);
}

function drawLesson12SlidingRopeGraph() {
  var frame = meAxes("归一化物理量随 x/L 变化", "x / L", "归一化值", 0, 1, 0, 1.12);
  mePlot(frame, "#f97316", function (u) { return 4 * u * (1 - u); });
  mePlot(frame, "#0f766e", function (u) { return 4 * u * (1 - u); }, 140, true);
  mePlot(frame, "#2563eb", function (u) { return 27 * u * u * (1 - u) / 4; });
  mePlot(frame, "#a855f7", function (u) { return u; }, 80, true);
  var current = meProgress();
  meMarker(frame, current, 27 * current * current * (1 - current) / 4, "#2563eb");
  meLegend([
    { color: "#f97316", label: "张力 T（最大于 1/2）" },
    { color: "#0f766e", label: "桌面段动量 p（最大于 1/2）" },
    { color: "#2563eb", label: "桌面段动能 Eₖ（最大于 2/3）" },
    { color: "#a855f7", label: "加速度 a/g" }
  ], 670, 106);
}

function meRodEndValues(progress) {
  var theta = Math.PI * progress;
  var length = meParam("length", 1);
  var g = meParam("g", 10);
  var cosine = Math.cos(theta);
  var omegaSquared = g * (9 - 4 * cosine) / (10 * length);
  return {
    theta: theta,
    omega: Math.sqrt(Math.max(0, omegaSquared)),
    vA: length * Math.sqrt(Math.max(0, omegaSquared)),
    vB: 2 * length * Math.sqrt(Math.max(0, omegaSquared)),
    rodWorkB: -6 * (1 - cosine) / 5
  };
}

function drawLesson12RodEndBallsScene() {
  var values = meRodEndValues(meProgress());
  var pivot = { x: 270, y: 250 };
  var scale = 78;
  var bx = pivot.x + 2 * scale * Math.sin(values.theta);
  var by = pivot.y - 2 * scale * Math.cos(values.theta);
  var ax = pivot.x - scale * Math.sin(values.theta);
  var ay = pivot.y + scale * Math.cos(values.theta);
  meText("偏心轻杆：A、B同角速度但半径不同", 28, 30, "#0f172a", 18, LEFT);
  stroke("#334155");
  strokeWeight(8);
  line(ax, ay, bx, by);
  fill("#64748b");
  stroke("#475569");
  triangle(pivot.x - 28, pivot.y + 90, pivot.x + 28, pivot.y + 90, pivot.x, pivot.y + 8);
  meBall(ax, ay, "#22c55e", "A");
  meBall(bx, by, "#f97316", "B");
  meBall(pivot.x, pivot.y, "#0f172a", "O", 13);
  meArrow(bx, by, bx + 55 * Math.cos(values.theta), by + 55 * Math.sin(values.theta), "#2563eb", "vB");
  meText("vB = " + values.vB.toFixed(2) + " m/s", 28, 458, "#334155", 14, LEFT);
  meText("θ = " + (values.theta * 180 / Math.PI).toFixed(0) + "°", 350, 458, "#2563eb", 14, LEFT);
}

function drawLesson12RodEndBallsGraph() {
  var frame = meAxes("B球速度与杆对B做功", "转角 θ / °", "归一化量", 0, 180, 0, 5.6);
  mePlot(frame, "#2563eb", function (degree) {
    return 2 * (9 - 4 * Math.cos(degree * Math.PI / 180)) / 5;
  });
  mePlot(frame, "#dc2626", function (degree) {
    return 6 * (1 - Math.cos(degree * Math.PI / 180)) / 5;
  }, 140, true);
  var currentDegree = 180 * meProgress();
  var currentCos = Math.cos(currentDegree * Math.PI / 180);
  meMarker(frame, currentDegree, 2 * (9 - 4 * currentCos) / 5, "#2563eb");
  meLegend([
    { color: "#2563eb", label: "vB² / (gL)" },
    { color: "#dc2626", label: "-W杆→B / (mgL)" }
  ], 690, 110);
  meText("最低点：-W杆→B/(mgL)=12/5", 795, 166, "#334155", 12, CENTER);
}

function meLinkedSliderValues(progress) {
  var height = meParam("height", 1.2);
  var rodLength = Math.max(height + 0.05, meParam("rodLength", 2));
  var y = height * (1 - progress);
  var x = Math.sqrt(Math.max(0, rodLength * rodLength - y * y));
  var accelRatio = 1 + 2 * height * y / (rodLength * rodLength) - 3 * y * y / (rodLength * rodLength);
  var energyRatio = 1 - y * y * (height - y) / (height * rodLength * rodLength);
  return {
    height: height,
    rodLength: rodLength,
    y: y,
    x: x,
    accelRatio: accelRatio,
    energyRatio: energyRatio
  };
}

function drawLesson12LinkedSlidersScene() {
  var q = meProgress();
  var values = meLinkedSliderValues(q);
  var groundY = 410;
  var rodX = 152;
  var verticalScale = 240 / values.height;
  var horizontalScale = 300 / values.rodLength;
  var aY = groundY - values.y * verticalScale;
  var bX = rodX + values.x * horizontalScale;
  meText("刚杆连接：a下降，b先加速后减速", 28, 30, "#0f172a", 18, LEFT);
  meGround(groundY + 14, 32, 542);
  stroke("#475569");
  strokeWeight(5);
  line(rodX, 54, rodX, groundY);
  stroke("#334155");
  strokeWeight(7);
  line(rodX, aY, bX, groundY - 14);
  meBlock(rodX, aY, "#f97316", "a");
  meBlock(bX, groundY - 14, "#2563eb", "b");
  meArrow(rodX - 42, aY, rodX - 42, aY + 62, "#dc2626", "mg");
  meText("向下加速度 = " + values.accelRatio.toFixed(3) + "g", 28, 458, values.accelRatio > 1 ? "#dc2626" : "#334155", 14, LEFT);
}

function drawLesson12LinkedSlidersGraph() {
  var maxRatio = 1.35;
  var frame = meAxes("a的加速度与机械能", "下落进度", "归一化值", 0, 1, 0.7, maxRatio);
  mePlot(frame, "#dc2626", function (u) { return meLinkedSliderValues(u).accelRatio; });
  mePlot(frame, "#2563eb", function (u) { return meLinkedSliderValues(u).energyRatio; });
  mePlot(frame, "#64748b", function () { return 1; }, 20, true);
  var current = meProgress();
  meMarker(frame, current, meLinkedSliderValues(current).accelRatio, "#dc2626");
  meLegend([
    { color: "#dc2626", label: "|aᵧ| / g" },
    { color: "#2563eb", label: "Ea / (mgh)" },
    { color: "#64748b", label: "基准值 1" }
  ], 700, 110);
  meText("Ea最小时杆力为0，地面对b支持力为mg", 795, 166, "#334155", 12, CENTER);
}
