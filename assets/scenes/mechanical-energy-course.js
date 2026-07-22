// Course scenes for mechanical energy.
function drawLesson12ReferencePlaneScene() {
  var q = meProgress();
  var h1 = meParam("h1", 1.2);
  var h2 = meParam("h2", 0.8);
  var groundY = 410;
  var topY = 82;
  var tableY = map(h2, 0, h1 + h2, groundY, topY);
  var ballY = lerp(topY, groundY, q * q);
  meText("同一位置，不同零势能参考面", 28, 30, "#0f172a", 18, LEFT);
  meGround(groundY, 32, 542);
  fill("#94a3b8");
  stroke("#475569");
  rect(70, tableY, 320, 14);
  rect(92, tableY + 14, 12, groundY - tableY - 14);
  rect(356, tableY + 14, 12, groundY - tableY - 14);
  meBall(230, ballY, "#22c55e", "");
  meText("A", 257, topY, "#0f172a", 14, LEFT);
  meText("B", 257, groundY - 8, "#0f172a", 14, LEFT);
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(405, tableY, 534, tableY);
  stroke("#2563eb");
  line(405, groundY, 534, groundY);
  drawingContext.setLineDash([]);
  meText("桌面参考面", 408, tableY - 14, "#dc2626", 13, LEFT);
  meText("地面参考面", 408, groundY - 15, "#2563eb", 13, LEFT);
  meText("下落高度 = " + (q * (h1 + h2)).toFixed(2) + " m", 28, 466, "#334155", 14, LEFT);
}

function drawLesson12ReferencePlaneGraph() {
  var m = meParam("mass", 0.5);
  var h1 = meParam("h1", 1.2);
  var h2 = meParam("h2", 0.8);
  var g = meParam("g", 10);
  var minE = -m * g * h2 * 1.15;
  var maxE = m * g * (h1 + h2) * 1.12;
  var frame = meAxes("重力势能只差一个常量", "相对桌面的高度 y / m", "Eₚ / J", -h2, h1, minE, maxE);
  mePlot(frame, "#dc2626", function (y) { return m * g * y; });
  mePlot(frame, "#2563eb", function (y) { return m * g * (y + h2); }, 140, true);
  var currentY = h1 - (h1 + h2) * meProgress();
  meMarker(frame, currentY, m * g * currentY, "#dc2626");
  meLegend([
    { color: "#dc2626", label: "以桌面为零势能面" },
    { color: "#2563eb", label: "以地面为零势能面" }
  ], 690, 110);
}

function meWellMaximum(mass) {
  var energy = meParam("initialEnergy", 300);
  var depth = meParam("depth", 10);
  var g = meParam("g", 10);
  return {
    height: energy / (mass * g) - depth,
    potential: energy - mass * g * depth
  };
}

function drawLesson12WellThrowScene() {
  var q = meProgress();
  var light = meParam("lightMass", 1);
  var heavy = Math.max(light + 0.1, meParam("heavyMass", 2));
  var depth = meParam("depth", 10);
  var lightMax = meWellMaximum(light).height;
  var heavyMax = meWellMaximum(heavy).height;
  var upper = Math.max(1, lightMax, heavyMax);
  var lower = -depth;
  meText("同初动能：质量越小，最高点势能越大", 28, 30, "#0f172a", 18, LEFT);
  fill("#e2e8f0");
  noStroke();
  rect(82, 126, 380, 310);
  fill("#ffffff");
  rect(145, 126, 105, 310);
  rect(315, 126, 105, 310);
  stroke("#475569");
  strokeWeight(3);
  line(72, 126, 472, 126);
  meText("地面 Eₚ=0", 84, 106, "#475569", 13, LEFT);
  var ease = 2 * q - q * q;
  var lightYValue = -depth + (lightMax + depth) * ease;
  var heavyYValue = -depth + (heavyMax + depth) * ease;
  var lightY = map(lightYValue, lower, upper, 414, 74);
  var heavyY = map(heavyYValue, lower, upper, 414, 74);
  meBall(198, lightY, "#2563eb", "m₁");
  meBall(368, heavyY, "#f97316", "m₂");
  meArrow(198, 402, 198, lightY + 18, "#2563eb", "");
  meArrow(368, 402, 368, heavyY + 18, "#f97316", "");
  meText("m₁ = " + light.toFixed(1) + " kg", 145, 458, "#2563eb", 13, LEFT);
  meText("m₂ = " + heavy.toFixed(1) + " kg", 315, 458, "#f97316", 13, LEFT);
}

function drawLesson12WellThrowGraph() {
  var light = meParam("lightMass", 1);
  var heavy = Math.max(light + 0.1, meParam("heavyMass", 2));
  var energy = meParam("initialEnergy", 300);
  var depth = meParam("depth", 10);
  var g = meParam("g", 10);
  var xMax = Math.max(4, heavy * 1.3);
  var yAtMax = energy - 0.5 * g * depth;
  var yAtEnd = energy - xMax * g * depth;
  var frame = meAxes("最高点势能随质量变化", "质量 m / kg", "Eₚ,max / J", 0.5, xMax, Math.min(0, yAtEnd) * 1.1, Math.max(10, yAtMax) * 1.1);
  mePlot(frame, "#2563eb", function (mass) { return energy - mass * g * depth; });
  meMarker(frame, light, energy - light * g * depth, "#2563eb");
  meMarker(frame, heavy, energy - heavy * g * depth, "#f97316");
  meText("斜率 = -gH", 790, 112, "#334155", 13, CENTER);
}

function meProjectileValues(progress) {
  var speed = meParam("speed", 16);
  var angle = meParam("angle", 55) * Math.PI / 180;
  var g = meParam("g", 10);
  var totalTime = 2 * speed * Math.sin(angle) / g;
  var time = progress * totalTime;
  return {
    x: speed * Math.cos(angle) * time,
    y: speed * Math.sin(angle) * time - 0.5 * g * time * time,
    vx: speed * Math.cos(angle),
    vy: speed * Math.sin(angle) - g * time,
    totalTime: totalTime
  };
}

function drawLesson12ConservationScene() {
  var p = meProjectileValues(meProgress());
  var speed = meParam("speed", 16);
  var angle = meParam("angle", 55) * Math.PI / 180;
  var g = meParam("g", 10);
  var range = speed * speed * Math.sin(2 * angle) / g;
  var maxH = speed * speed * Math.sin(angle) * Math.sin(angle) / (2 * g);
  var x = map(p.x, 0, Math.max(0.1, range), 58, 518);
  var y = map(p.y, 0, Math.max(0.1, maxH), 398, 110);
  meText("曲线运动也可以机械能守恒", 28, 30, "#0f172a", 18, LEFT);
  meGround(410, 32, 542);
  noFill();
  stroke("#94a3b8");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  beginShape();
  for (var i = 0; i <= 60; i += 1) {
    var sample = meProjectileValues(i / 60);
    vertex(map(sample.x, 0, range, 58, 518), map(sample.y, 0, maxH, 398, 110));
  }
  endShape();
  drawingContext.setLineDash([]);
  meBall(x, y, "#2563eb", "");
  meArrow(x, y, x + p.vx * 3.2, y - p.vy * 3.2, "#dc2626", "v");
  meArrow(x, y, x, y + 62, "#f97316", "mg");
  meText("只有重力做功", 31, 458, "#334155", 14, LEFT);
}

function drawLesson12ConservationGraph() {
  var m = meParam("mass", 1);
  var speed = meParam("speed", 16);
  var angle = meParam("angle", 55) * Math.PI / 180;
  var g = meParam("g", 10);
  var total = 0.5 * m * speed * speed;
  var frame = meAxes("斜抛过程的能量转化", "归一化时间 t/T", "能量 / J", 0, 1, 0, total * 1.12);
  mePlot(frame, "#2563eb", function (u) {
    var t = 2 * speed * Math.sin(angle) * u / g;
    var y = speed * Math.sin(angle) * t - 0.5 * g * t * t;
    return m * g * Math.max(0, y);
  });
  mePlot(frame, "#f97316", function (u) {
    var t = 2 * speed * Math.sin(angle) * u / g;
    var y = speed * Math.sin(angle) * t - 0.5 * g * t * t;
    return total - m * g * Math.max(0, y);
  });
  mePlot(frame, "#0f766e", function () { return total; }, 30, true);
  var current = meProgress();
  var currentValue = meProjectileValues(current);
  meMarker(frame, current, m * g * Math.max(0, currentValue.y), "#2563eb");
  meLegend([
    { color: "#2563eb", label: "重力势能 Eₚ" },
    { color: "#f97316", label: "动能 Eₖ" },
    { color: "#0f766e", label: "机械能 E" }
  ], 690, 110);
}

function meFootballValues(progress) {
  var speed = meParam("speed", 20);
  var height = meParam("height", 8);
  var g = meParam("g", 10);
  var angle = 55 * Math.PI / 180;
  var vy = speed * Math.sin(angle);
  var discriminant = Math.max(0, vy * vy - 2 * g * height);
  var timeB = (vy - Math.sqrt(discriminant)) / g;
  if (timeB <= 0.01) timeB = vy / g;
  var time = progress * timeB;
  return {
    x: speed * Math.cos(angle) * time,
    y: speed * Math.sin(angle) * time - 0.5 * g * time * time,
    targetX: speed * Math.cos(angle) * timeB
  };
}

function drawLesson12FootballScene() {
  var p = meFootballValues(meProgress());
  var height = meParam("height", 8);
  var x = map(p.x, 0, Math.max(0.1, p.targetX), 72, 480);
  var y = map(p.y, 0, Math.max(0.1, height), 392, 116);
  meText("取 B 点为零势能面", 28, 30, "#0f172a", 18, LEFT);
  meGround(410, 32, 542);
  stroke("#2563eb");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(42, 116, 532, 116);
  drawingContext.setLineDash([]);
  meText("B：Eₚ=0", 430, 96, "#2563eb", 13, LEFT);
  noFill();
  stroke("#94a3b8");
  drawingContext.setLineDash([4, 4]);
  beginShape();
  for (var i = 0; i <= 50; i += 1) {
    var s = meFootballValues(i / 50);
    vertex(map(s.x, 0, p.targetX, 72, 480), map(s.y, 0, height, 392, 116));
  }
  endShape();
  drawingContext.setLineDash([]);
  meBall(x, y, "#f97316", "");
  meText("A", 53, 390, "#0f172a", 14, LEFT);
  meText("Eₚ(A) = -mgh", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12FootballGraph() {
  var m = meParam("mass", 0.5);
  var speed = meParam("speed", 20);
  var height = meParam("height", 8);
  var g = meParam("g", 10);
  var total = 0.5 * m * speed * speed - m * g * height;
  var minE = -m * g * height * 1.15;
  var maxE = Math.max(0.5 * m * speed * speed, total) * 1.12;
  var frame = meAxes("以 B 为零势能面的能量", "离地高度 y / m", "能量 / J", 0, height, minE, maxE);
  mePlot(frame, "#2563eb", function (y) { return m * g * (y - height); });
  mePlot(frame, "#f97316", function (y) { return total - m * g * (y - height); });
  mePlot(frame, "#0f766e", function () { return total; }, 30, true);
  var currentY = meFootballValues(meProgress()).y;
  meMarker(frame, currentY, m * g * (currentY - height), "#2563eb");
  meLegend([
    { color: "#2563eb", label: "Eₚ" },
    { color: "#f97316", label: "Eₖ" },
    { color: "#0f766e", label: "E" }
  ], 700, 110);
}

function meArcHeightRatios() {
  return [25 / 27, 15 / 16, 1, (1 - Math.cos(Math.PI / 6)) / 2 + (1 - (1 - Math.cos(Math.PI / 6)) / 2) * 0.25];
}

function drawLesson12ArcHeightScene() {
  var q = meProgress();
  var centers = [65, 195, 325, 455];
  var angles = [Math.PI, 2 * Math.PI / 3, Math.PI / 2, Math.PI / 6];
  var travelAngles = [Math.acos(-2 / 3), 2 * Math.PI / 3, Math.PI / 2, Math.PI / 6];
  var labels = ["2m", "3m", "4m", "5m"];
  var ratios = meArcHeightRatios();
  var radius = 50;
  var base = 350;
  meText("相同初速度，不同轨道末端方向", 28, 30, "#0f172a", 18, LEFT);
  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(28, 102, 542, 102);
  drawingContext.setLineDash([]);
  meText("目标高度 h", 32, 84, "#475569", 13, LEFT);
  for (var i = 0; i < centers.length; i += 1) {
    var cx = centers[i];
    var cy = base - radius;
    meArcPath(cx, cy, radius, 0, angles[i], i === 2 ? "#2563eb" : "#64748b", i === 2 ? 4 : 3);
    var endAngle = travelAngles[i];
    var ballX;
    var ballY;
    if (q < 0.68) {
      var phi = endAngle * q / 0.68;
      ballX = cx + radius * Math.sin(phi);
      ballY = cy + radius * Math.cos(phi);
    } else {
      var u = (q - 0.68) / 0.32;
      var endX = cx + radius * Math.sin(endAngle);
      var endY = cy + radius * Math.cos(endAngle);
      var targetY = base - ratios[i] * 248;
      ballX = endX + (i === 2 ? 0 : 20 * u);
      ballY = lerp(endY, targetY, 2 * u - u * u);
    }
    meBall(ballX, ballY, i === 2 ? "#2563eb" : "#f97316", "", 17);
    meText(labels[i], cx + 22, 380, i === 2 ? "#2563eb" : "#334155", 13, CENTER);
  }
  meGround(402, 28, 542);
  meText("90° 圆弧末端切线竖直，只有 4m 小球达到 h", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12ArcHeightGraph() {
  var ratios = meArcHeightRatios();
  var frame = meAxes("各轨道实际最大高度", "", "Hmax / h", 0, 4, 0, 1.1);
  meBar(frame, 0, 4, ratios[0], "#94a3b8", "2m", ratios[0].toFixed(3));
  meBar(frame, 1, 4, ratios[1], "#94a3b8", "3m", ratios[1].toFixed(3));
  meBar(frame, 2, 4, ratios[2], "#2563eb", "4m", "1.000");
  meBar(frame, 3, 4, ratios[3], "#94a3b8", "5m", ratios[3].toFixed(3));
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(frame.left, meGY(frame, 1), frame.right, meGY(frame, 1));
  drawingContext.setLineDash([]);
}

function meBallSpringValues() {
  var m = meParam("mass", 1);
  var k = meParam("k", 100);
  var drop = meParam("drop", 0.8);
  var g = meParam("g", 10);
  var xmax = (m * g + Math.sqrt(m * m * g * g + 2 * k * m * g * drop)) / k;
  return { m: m, k: k, drop: drop, g: g, xmax: xmax, xeq: m * g / k };
}

function drawLesson12BallSpringScene() {
  var q = meProgress();
  var v = meBallSpringValues();
  var contactY = 226;
  var baseY = 416;
  var compression = q < 0.34 ? 0 : v.xmax * (2 * (q - 0.34) / 0.66 - Math.pow((q - 0.34) / 0.66, 2));
  compression = constrain(compression, 0, v.xmax);
  var compressionPx = map(compression, 0, v.xmax, 0, 112);
  var ballY = q < 0.34 ? lerp(72, contactY - 14, q / 0.34) : contactY + compressionPx;
  meText("接触后先加速，再减速", 28, 30, "#0f172a", 18, LEFT);
  meGround(baseY, 70, 486);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(150, ballY + 12, 220, 14, 3);
  meSpring(260, baseY, 260, ballY + 26, "#a855f7", 10);
  meBall(260, ballY, "#22c55e", "m");
  meArrow(310, ballY, 310, ballY + 60, "#dc2626", "mg");
  if (q >= 0.34) {
    meArrow(210, ballY + 4, 210, ballY + 4 - 80 * compression / Math.max(0.001, v.xmax), "#2563eb", "kx");
  }
  meText("x = " + compression.toFixed(3) + " m", 32, 458, "#334155", 14, LEFT);
  meText("kx = mg 处速度最大", 300, 458, "#2563eb", 14, LEFT);
}

function drawLesson12BallSpringGraph() {
  var v = meBallSpringValues();
  var initial = v.m * v.g * v.drop;
  var yMax = Math.max(initial + v.m * v.g * v.xeq, 0.5 * v.k * v.xmax * v.xmax) * 1.15;
  var frame = meAxes("接触后的能量分配", "弹簧压缩量 x / m", "能量 / J", 0, v.xmax, 0, yMax);
  mePlot(frame, "#f97316", function (x) { return Math.max(0, initial + v.m * v.g * x - 0.5 * v.k * x * x); });
  mePlot(frame, "#a855f7", function (x) { return 0.5 * v.k * x * x; });
  var q = meProgress();
  var x = q < 0.34 ? 0 : v.xmax * (2 * (q - 0.34) / 0.66 - Math.pow((q - 0.34) / 0.66, 2));
  meMarker(frame, x, Math.max(0, initial + v.m * v.g * x - 0.5 * v.k * x * x), "#f97316");
  meLegend([
    { color: "#f97316", label: "小球动能 Eₖ" },
    { color: "#a855f7", label: "弹性势能 Epe" }
  ], 700, 110);
  meText("动能最大：x = mg/k", 790, 166, "#2563eb", 12, CENTER);
}

function drawLesson12RodTwoBallsScene() {
  var theta = meProgress() * Math.PI / 2;
  var pivot = { x: 150, y: 142 };
  var longRadius = 250;
  var shortRadius = 125;
  var ax = pivot.x + longRadius * Math.cos(theta);
  var ay = pivot.y + longRadius * Math.sin(theta);
  var bx = pivot.x + shortRadius * Math.cos(theta);
  var by = pivot.y + shortRadius * Math.sin(theta);
  meText("同一刚性杆：角速度相同，线速度不同", 28, 30, "#0f172a", 18, LEFT);
  stroke("#334155");
  strokeWeight(8);
  line(pivot.x, pivot.y, ax, ay);
  fill("#64748b");
  stroke("#475569");
  triangle(pivot.x - 28, pivot.y + 78, pivot.x + 28, pivot.y + 78, pivot.x, pivot.y + 8);
  meBall(ax, ay, "#22c55e", "A");
  meBall(bx, by, "#dc2626", "B");
  meBall(pivot.x, pivot.y, "#0f172a", "O", 13);
  meArrow(ax, ay, ax - 55 * Math.sin(theta), ay + 55 * Math.cos(theta), "#2563eb", "vA");
  meArrow(bx, by, bx - 35 * Math.sin(theta), by + 35 * Math.cos(theta), "#f97316", "vB");
  meText("vA = 2vB", 32, 458, "#334155", 14, LEFT);
  meText("θ = " + (theta * 180 / Math.PI).toFixed(0) + "°", 360, 458, "#2563eb", 14, LEFT);
}

function drawLesson12RodTwoBallsGraph() {
  var m = meParam("mass", 1);
  var length = meParam("length", 2);
  var g = meParam("g", 10);
  var maxEnergy = 1.5 * m * g * length;
  var frame = meAxes("双球总动能及其分配", "杆转角 θ / °", "动能 / J", 0, 90, 0, maxEnergy * 1.12);
  mePlot(frame, "#0f766e", function (degree) {
    return maxEnergy * Math.sin(degree * Math.PI / 180);
  });
  mePlot(frame, "#2563eb", function (degree) {
    return 0.8 * maxEnergy * Math.sin(degree * Math.PI / 180);
  });
  mePlot(frame, "#f97316", function (degree) {
    return 0.2 * maxEnergy * Math.sin(degree * Math.PI / 180);
  });
  var degree = 90 * meProgress();
  meMarker(frame, degree, maxEnergy * Math.sin(degree * Math.PI / 180), "#0f766e");
  meLegend([
    { color: "#0f766e", label: "总动能" },
    { color: "#2563eb", label: "A 球动能" },
    { color: "#f97316", label: "B 球动能" }
  ], 700, 110);
}

function meUTubeValues(progress) {
  var h1 = meParam("h1", 1.6);
  var h2 = Math.min(h1 - 0.05, meParam("h2", 0.6));
  var ease = Math.sin(progress * Math.PI / 2);
  var average = (h1 + h2) / 2;
  var difference = (h1 - h2) * (1 - ease);
  return {
    h1: h1,
    h2: h2,
    average: average,
    difference: difference,
    left: average + difference / 2,
    right: average - difference / 2
  };
}

function drawLesson12UTubeScene() {
  var values = meUTubeValues(meProgress());
  var maxHeight = Math.max(values.h1, values.h2) * 1.1;
  var bottom = 392;
  var leftTop = map(values.left, 0, maxHeight, bottom, 84);
  var rightTop = map(values.right, 0, maxHeight, bottom, 84);
  meText("打开阀门：高液面下降，低液面上升", 28, 30, "#0f172a", 18, LEFT);
  noFill();
  stroke("#334155");
  strokeWeight(38);
  line(150, 82, 150, bottom);
  line(150, bottom, 410, bottom);
  line(410, bottom, 410, 82);
  stroke("#ffffff");
  strokeWeight(27);
  line(150, 82, 150, bottom);
  line(150, bottom, 410, bottom);
  line(410, bottom, 410, 82);
  stroke("#60a5fa");
  strokeWeight(23);
  line(150, leftTop, 150, bottom);
  line(150, bottom, 410, bottom);
  line(410, bottom, 410, rightTop);
  noStroke();
  fill("#1d4ed8");
  rect(265, bottom - 20, 30, 40, 4);
  meText("K", 280, bottom - 44, "#0f172a", 14, CENTER);
  meText("h₁ = " + values.left.toFixed(2) + " m", 76, leftTop, "#2563eb", 13, RIGHT);
  meText("h₂ = " + values.right.toFixed(2) + " m", 437, rightTop, "#2563eb", 13, LEFT);
  meText("水柱各处流速大小相同", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12UTubeGraph() {
  var h1 = meParam("h1", 1.6);
  var h2 = Math.min(h1 - 0.05, meParam("h2", 0.6));
  var rho = meParam("density", 1000);
  var area = meParam("area", 0.01);
  var g = meParam("g", 10);
  var initial = 0.25 * rho * area * g * Math.pow(h1 - h2, 2);
  var frame = meAxes("高低液面差对应的能量", "过程进度", "相对能量 / J", 0, 1, 0, Math.max(1, initial * 1.12));
  mePlot(frame, "#2563eb", function (u) {
    var delta = (h1 - h2) * (1 - Math.sin(u * Math.PI / 2));
    return 0.25 * rho * area * g * delta * delta;
  });
  mePlot(frame, "#f97316", function (u) {
    var delta = (h1 - h2) * (1 - Math.sin(u * Math.PI / 2));
    return initial - 0.25 * rho * area * g * delta * delta;
  });
  mePlot(frame, "#0f766e", function () { return initial; }, 20, true);
  var current = meProgress();
  var deltaNow = (h1 - h2) * (1 - Math.sin(current * Math.PI / 2));
  meMarker(frame, current, initial - 0.25 * rho * area * g * deltaNow * deltaNow, "#f97316");
  meLegend([
    { color: "#2563eb", label: "剩余重力势能差" },
    { color: "#f97316", label: "水柱动能" },
    { color: "#0f766e", label: "总量" }
  ], 690, 110);
}

function drawLesson12AcceleratedDescentScene() {
  var q = meProgress();
  var ratio = meParam("ratio", 0.75);
  var height = meParam("height", 4);
  var y = lerp(82, 404, q * q);
  meText("加速度小于 g：机械能正在减少", 28, 30, "#0f172a", 18, LEFT);
  stroke("#94a3b8");
  strokeWeight(3);
  line(270, 70, 270, 424);
  meBall(270, y, "#2563eb", "m");
  meArrow(310, y, 310, y + 70, "#dc2626", "mg");
  meArrow(230, y, 230, y - 70 * (1 - ratio), "#f97316", "阻力");
  meGround(426, 80, 460);
  meText("a = " + ratio.toFixed(2) + "g", 34, 458, "#334155", 14, LEFT);
  meText("已下降 " + (height * q * q).toFixed(2) + " m", 300, 458, "#2563eb", 14, LEFT);
}

function drawLesson12AcceleratedDescentGraph() {
  var m = meParam("mass", 2);
  var height = meParam("height", 4);
  var ratio = meParam("ratio", 0.75);
  var g = meParam("g", 10);
  var maxEnergy = m * g * height;
  var frame = meAxes("下降过程的能量变化量", "下降距离 s / m", "能量大小 / J", 0, height, 0, maxEnergy * 1.12);
  mePlot(frame, "#f97316", function (s) { return m * ratio * g * s; });
  mePlot(frame, "#2563eb", function (s) { return m * g * s; });
  mePlot(frame, "#dc2626", function (s) { return m * (1 - ratio) * g * s; }, 100, true);
  var sNow = height * meProgress() * meProgress();
  meMarker(frame, sNow, m * ratio * g * sNow, "#f97316");
  meLegend([
    { color: "#f97316", label: "动能增加量" },
    { color: "#2563eb", label: "势能减少量" },
    { color: "#dc2626", label: "机械能减少量" }
  ], 690, 110);
}

function meSpringEkValues() {
  var m = meParam("mass", 0.2);
  var k = meParam("k", 100);
  var h0 = meParam("startHeight", 0.1);
  var hn = Math.max(h0 + 0.01, meParam("naturalHeight", 0.2));
  var g = meParam("g", 10);
  var total = m * g * h0 + 0.5 * k * Math.pow(hn - h0, 2);
  var hmax = total / (m * g);
  return { m: m, k: k, h0: h0, hn: hn, g: g, total: total, hmax: hmax };
}

function meSpringEkAt(height, values) {
  var compression = Math.max(0, values.hn - height);
  return Math.max(0, values.total - values.m * values.g * height - 0.5 * values.k * compression * compression);
}

function drawLesson12SpringEkScene() {
  var values = meSpringEkValues();
  var q = meProgress();
  var height = lerp(values.h0, values.hmax, 2 * q - q * q);
  var blockY = map(height, values.h0, values.hmax, 372, 82);
  var naturalY = map(values.hn, values.h0, values.hmax, 372, 82);
  meText("先受弹簧作用，分离后只受重力", 28, 30, "#0f172a", 18, LEFT);
  meGround(424, 80, 470);
  stroke("#475569");
  strokeWeight(5);
  line(278, 56, 278, 422);
  meSpring(250, 420, 250, Math.max(blockY + 18, naturalY + 18), "#a855f7", 10);
  meBlock(250, blockY, "#f97316", "");
  stroke("#2563eb");
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(95, naturalY, 450, naturalY);
  drawingContext.setLineDash([]);
  meText("弹簧原长位置", 305, naturalY - 14, "#2563eb", 13, LEFT);
  meText("h = " + height.toFixed(3) + " m", 32, 458, "#334155", 14, LEFT);
  meText("Eₖ = " + meSpringEkAt(height, values).toFixed(3) + " J", 300, 458, "#f97316", 14, LEFT);
}

function drawLesson12SpringEkGraph() {
  var values = meSpringEkValues();
  var frame = meAxes("原题 Eₖ-h 曲线", "高度 h / m", "Eₖ / J", values.h0, values.hmax, 0, Math.max(0.1, values.total * 0.52));
  mePlot(frame, "#2563eb", function (height) { return meSpringEkAt(height, values); });
  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(meGX(frame, values.hn), frame.top, meGX(frame, values.hn), frame.bottom);
  drawingContext.setLineDash([]);
  var q = meProgress();
  var height = lerp(values.h0, values.hmax, 2 * q - q * q);
  meMarker(frame, height, meSpringEkAt(height, values), "#dc2626");
  meText("分离点 h = " + values.hn.toFixed(2) + " m", 795, 112, "#334155", 13, CENTER);
}

function drawLesson12RopeSpringScene() {
  var q = meProgress();
  var pulley = { x: 150, y: 92 };
  var rodX = 330;
  var aY = pulley.y + 240 * q;
  var bY = 338 - 120 * q;
  var cY = 404;
  meText("末态：A下降量是B上升量的2倍", 28, 30, "#0f172a", 18, LEFT);
  stroke("#475569");
  strokeWeight(5);
  line(rodX, 56, rodX, 420);
  fill("#e2e8f0");
  stroke("#64748b");
  circle(pulley.x, pulley.y, 34);
  stroke("#334155");
  strokeWeight(2);
  line(pulley.x, pulley.y, rodX, aY);
  line(pulley.x, pulley.y + 17, pulley.x, bY - 15);
  meBlock(rodX, aY, "#f97316", "A");
  meBlock(pulley.x, bY, "#2563eb", "B");
  meSpring(pulley.x, bY + 16, pulley.x, cY - 16, "#a855f7", 8);
  meBlock(pulley.x, cY, "#22c55e", "C");
  meGround(424, 55, 505);
  if (q > 0.92) {
    meArrow(pulley.x + 42, cY - 8, pulley.x + 42, cY - 66, "#a855f7", "F弹=mg");
  }
  meText("∠(绳,竖杆) = " + (Math.atan2(180, Math.max(1, aY - pulley.y)) * 180 / Math.PI).toFixed(1) + "°", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12RopeSpringGraph() {
  var m = meParam("mass", 1);
  var speed = meParam("speed", 4);
  var g = meParam("g", 10);
  var x = 11 * speed * speed / (16 * g);
  var aLoss = 4 * m * g * x;
  var bGain = m * g * x;
  var kinetic = aLoss - bGain;
  var frame = meAxes("初末态能量结算", "", "能量 / J", 0, 3, 0, aLoss * 1.15);
  meBar(frame, 0, 3, aLoss, "#2563eb", "A势能减少", meNumber(aLoss));
  meBar(frame, 1, 3, bGain, "#f97316", "B势能增加", meNumber(bGain));
  meBar(frame, 2, 3, kinetic, "#0f766e", "末总动能", meNumber(kinetic));
  meText("弹簧初末形变量等大，弹性势能变化为 0", 795, 112, "#334155", 12, CENTER);
}
