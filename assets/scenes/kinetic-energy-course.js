// Course scenes for the kinetic-energy theorem.
function drawLesson11JetScene() {
  var q = keProgress();
  var travel = q * q;
  var distance = keParam("distance", 530);
  var speed = keParam("speed", 60) * q;
  var x = 70 + 420 * travel;
  keText("喷气式飞机起飞滑跑", 28, 30, "#0f172a", 18, LEFT);
  fill("#e2e8f0");
  noStroke();
  rect(28, 330, 514, 92);
  stroke("#ffffff");
  strokeWeight(3);
  for (var mark = 48; mark < 530; mark += 54) line(mark, 376, mark + 28, 376);
  push();
  translate(x, 326);
  noStroke();
  fill("#2563eb");
  ellipse(0, 0, 86, 22);
  triangle(-8, -5, -38, -34, 13, -7);
  triangle(-8, 5, -38, 34, 13, 7);
  triangle(-33, -2, -51, -18, -24, -3);
  fill("#0f172a");
  circle(20, 13, 10);
  circle(-24, 13, 10);
  pop();
  keArrow(x - 40, 286, x + 35, 286, "#dc2626", "F");
  keArrow(x + 34, 306, x - 28, 306, "#64748b", "f");
  keText("s = " + (distance * travel).toFixed(0) + " m", 34, 456, "#334155", 14, LEFT);
  keText("v = " + speed.toFixed(1) + " m/s", 300, 456, "#2563eb", 14, LEFT);
}

function drawLesson11JetGraph() {
  var m = keParam("mass", 5000);
  var s = keParam("distance", 530);
  var v = keParam("speed", 60);
  var ratio = keParam("resistanceRatio", 0.02);
  var g = keParam("g", 10);
  var f = ratio * m * g;
  var force = m * v * v / (2 * s) + f;
  var maxWork = force * s / 1000000;
  var frame = keAxes("功与动能增量", "滑跑距离 x / m", "功 / MJ", 0, s, -Math.max(1, f * s / 1000000 * 1.3), maxWork * 1.12);
  kePlot(frame, "#dc2626", function (x) { return force * x / 1000000; });
  kePlot(frame, "#64748b", function (x) { return -f * x / 1000000; });
  kePlot(frame, "#2563eb", function (x) { return 0.5 * m * v * v * x / s / 1000000; });
  var xNow = s * keProgress() * keProgress();
  keMarker(frame, xNow, 0.5 * m * v * v * xNow / s / 1000000, "#2563eb");
  keLegend([
    { color: "#dc2626", label: "牵引力功" },
    { color: "#64748b", label: "阻力功" },
    { color: "#2563eb", label: "ΔEₖ" }
  ], 742, 104);
}

function drawLesson11SpringInclineScene() {
  var q = 1 - Math.pow(1 - keProgress(), 2);
  var contact = 0.68;
  var a = { x: 82, y: 410 };
  var c0 = { x: 350, y: 237 };
  var c1 = { x: 414, y: 196 };
  var anchor = { x: 506, y: 137 };
  var ballX;
  var ballY;
  stroke("#475569");
  strokeWeight(4);
  line(62, 424, 510, 136);
  line(510, 136, 530, 167);
  if (q < contact) {
    ballX = lerp(a.x, c0.x, q / contact);
    ballY = lerp(a.y, c0.y, q / contact);
    keSpring(c0.x + 14, c0.y - 8, anchor.x, anchor.y, "#2563eb", 9);
  } else {
    var compression = (q - contact) / (1 - contact);
    ballX = lerp(c0.x, c1.x, compression);
    ballY = lerp(c0.y, c1.y, compression);
    keSpring(ballX + 14, ballY - 8, anchor.x, anchor.y, "#2563eb", 9);
  }
  keBall(ballX, ballY - 15, "#f97316", "m");
  keArrow(ballX, ballY + 10, ballX, ballY + 64, "#dc2626", "mg");
  keText("光滑斜面压缩弹簧", 28, 30, "#0f172a", 18, LEFT);
  keText("A", a.x - 12, a.y + 8, "#0f172a", 14, CENTER);
  keText("C", c1.x - 12, c1.y - 16, "#0f172a", 14, CENTER);
}

function drawLesson11SpringInclineGraph() {
  var m = keParam("mass", 1);
  var v = keParam("speed", 10);
  var h = keParam("height", 3);
  var g = keParam("g", 10);
  var total = 0.5 * m * v * v;
  var gravity = Math.min(total, m * g * h);
  var spring = Math.max(0, total - gravity);
  var frame = keAxes("能量转化", "过程进度 λ", "能量 / J", 0, 1, 0, total * 1.12);
  kePlot(frame, "#2563eb", function (x) { return total * (1 - x); });
  kePlot(frame, "#16a34a", function (x) { return gravity * x; });
  kePlot(frame, "#dc2626", function (x) { return spring * x; });
  var q = 1 - Math.pow(1 - keProgress(), 2);
  keMarker(frame, q, total * (1 - q), "#2563eb");
  keLegend([
    { color: "#2563eb", label: "动能 Eₖ" },
    { color: "#16a34a", label: "重力势能" },
    { color: "#dc2626", label: "弹性势能" }
  ], 752, 104);
}

function drawLesson11RoundTripScene() {
  var p = keProgress();
  var outbound = p <= 0.5;
  var q = outbound ? p * 2 : (1 - p) * 2;
  var points = [{ x: 90, y: 150 }, { x: 286, y: 366 }, { x: 508, y: 366 }];
  var point = kePolylinePoint(points, q);
  stroke("#475569");
  strokeWeight(4);
  line(70, 171, 286, 386);
  keGround(386, 270, 542);
  keBlock(point.x, point.y - 18, outbound ? "#f97316" : "#2563eb", outbound ? "下滑" : "返回", point.angle);
  keText("A", 82, 126, "#0f172a", 14, CENTER);
  keText("B", 508, 340, "#0f172a", 14, CENTER);
  keText("斜面—水平面往返", 28, 30, "#0f172a", 18, LEFT);
  keText(outbound ? "重力势能克服摩擦" : "外力同时增加势能并克服摩擦", 28, 462, outbound ? "#f97316" : "#2563eb", 14, LEFT);
}

function drawLesson11RoundTripGraph() {
  var m = keParam("mass", 2);
  var g = keParam("g", 10);
  var h = keParam("height", 4);
  var energy = m * g * h;
  var frame = keAxes("往返能量账", "阶段进度", "能量 / J", 0, 2, 0, 2.2 * energy);
  kePlot(frame, "#16a34a", function (x) {
    return x <= 1 ? energy * (1 - x) : energy * (x - 1);
  });
  kePlot(frame, "#64748b", function (x) { return energy * x; });
  kePlot(frame, "#2563eb", function (x) { return x <= 1 ? 0 : 2 * energy * (x - 1); });
  var phase = 2 * keProgress();
  keMarker(frame, phase, energy * phase, "#64748b");
  keLegend([
    { color: "#16a34a", label: "重力势能" },
    { color: "#64748b", label: "累计摩擦耗能" },
    { color: "#2563eb", label: "累计外力功" }
  ], 744, 104);
}

function drawLesson11KineticGraphScene() {
  var q = keProgress();
  var xFraction = 2 * q - q * q;
  var distance = keParam("stopDistance", 10);
  var energy0 = keParam("initialEnergy", 100);
  keGround(376);
  var x = 78 + 412 * xFraction;
  keBlock(x, 355, "#f97316", "m", 0);
  if (q < 0.98) keArrow(x + 26, 334, x - 42, 334, "#dc2626", "f");
  keText("粗糙水平面减速", 28, 30, "#0f172a", 18, LEFT);
  keText("x = " + (distance * xFraction).toFixed(2) + " m", 34, 452, "#334155", 14, LEFT);
  keText("Eₖ = " + (energy0 * (1 - xFraction)).toFixed(1) + " J", 286, 452, "#2563eb", 14, LEFT);
}

function drawLesson11KineticGraphGraph() {
  var distance = keParam("stopDistance", 10);
  var energy0 = keParam("initialEnergy", 100);
  var frame = keAxes("原题 Eₖ-x 图像", "位移 x / m", "Eₖ / J", 0, distance, 0, energy0 * 1.12);
  kePlot(frame, "#2563eb", function (x) { return energy0 * Math.max(0, 1 - x / distance); });
  var xNow = distance * (2 * keProgress() - keProgress() * keProgress());
  keMarker(frame, xNow, energy0 * Math.max(0, 1 - xNow / distance), "#dc2626");
  keText("斜率 = -f", 782, 122, "#475569", 13, CENTER);
}

function drawLesson11InclineLoopScene() {
  var p = keProgress();
  var a = { x: 90, y: 170 };
  var b = { x: 360, y: 390 };
  var o = { x: 360, y: 280 };
  var radius = 110;
  var x;
  var y;
  stroke("#475569");
  strokeWeight(4);
  line(a.x, a.y, b.x, b.y);
  noFill();
  arc(o.x, o.y, radius * 2, radius * 2, -Math.PI / 2, Math.PI / 2);
  keGround(410, 32, 542);
  if (p < 0.4) {
    var q1 = p / 0.4;
    x = lerp(a.x, b.x, q1);
    y = lerp(a.y, b.y, q1);
  } else if (p < 0.75) {
    var q2 = (p - 0.4) / 0.35;
    var phi = q2 * Math.PI;
    x = o.x + radius * Math.sin(phi);
    y = o.y + radius * Math.cos(phi);
  } else {
    var q3 = (p - 0.75) / 0.25;
    x = 360 - 130 * q3;
    y = 170 + 114 * q3 * q3;
    stroke("#94a3b8");
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    noFill();
    beginShape();
    for (var i = 0; i <= 30; i += 1) {
      var u = i / 30;
      vertex(360 - 130 * u, 170 + 114 * u * u);
    }
    endShape();
    drawingContext.setLineDash([]);
  }
  keBall(x, y, "#f97316", "");
  keText("A", a.x - 14, a.y - 14, "#0f172a", 14, CENTER);
  keText("B", b.x - 18, b.y + 2, "#0f172a", 14, CENTER);
  keText("C", 360, 151, "#0f172a", 14, CENTER);
  keText("D", 487, 280, "#0f172a", 14, CENTER);
  keText("斜面—半圆轨道—平抛", 28, 30, "#0f172a", 18, LEFT);
}

function drawLesson11InclineLoopGraph() {
  var r = keParam("radius", 0.4);
  var g = keParam("g", 10);
  var critical = g * r;
  var frame = keAxes("临界过圆轨道", "圆弧角位置 φ / π", "v² / (m²·s⁻²)", 0, 1, 0, critical * 5.6);
  kePlot(frame, "#2563eb", function (x) { return critical * (3 + 2 * Math.cos(Math.PI * x)); });
  kePlot(frame, "#dc2626", function () { return critical; }, 80, true);
  var arcProgress = constrain((keProgress() - 0.4) / 0.35, 0, 1);
  keMarker(frame, arcProgress, critical * (3 + 2 * Math.cos(Math.PI * arcProgress)), "#2563eb");
  keLegend([
    { color: "#2563eb", label: "临界轨迹 v²" },
    { color: "#dc2626", label: "最高点下限 gR" }
  ], 742, 104);
}

function drawLesson11RoughSemicircleScene() {
  var p = keProgress();
  var cx = 285;
  var cy = 168;
  var radius = 145;
  var xHigh;
  var yHigh;
  var xLow;
  var yLow;
  noFill();
  stroke("#475569");
  strokeWeight(5);
  arc(cx, cy, 2 * radius, 2 * radius, 0, Math.PI);
  if (p < 0.2) {
    var d = p / 0.2;
    xHigh = cx + radius + 7;
    yHigh = lerp(62, cy, d);
    xLow = cx + radius - 7;
    yLow = lerp(108, cy, d);
  } else if (p < 0.8) {
    var q = (p - 0.2) / 0.6;
    var angle = q * Math.PI;
    xHigh = cx + (radius - 7) * Math.cos(angle);
    yHigh = cy + (radius - 7) * Math.sin(angle);
    xLow = cx + (radius + 7) * Math.cos(angle);
    yLow = cy + (radius + 7) * Math.sin(angle);
  } else {
    var rise = (p - 0.8) / 0.2;
    var lossFactor = keParam("lossFactor", 0.55);
    xHigh = cx - radius - 7;
    yHigh = lerp(cy, 108, rise);
    xLow = cx - radius + 7;
    yLow = lerp(cy, cy - 60 * (1 - lossFactor), rise);
  }
  keBall(xHigh, yHigh, "#2563eb", "");
  keBall(xLow, yLow, "#f97316", "");
  keText("2x 释放", 454, 62, "#2563eb", 13, LEFT);
  keText("x 释放", 454, 108, "#f97316", 13, LEFT);
  keText("A", 118, 168, "#0f172a", 14, CENTER);
  keText("B", 452, 168, "#0f172a", 14, CENTER);
  keText("粗糙半圆槽：两次释放比较", 28, 30, "#0f172a", 18, LEFT);
  keText("高能轨迹损耗更多，但出口动能仍更大", 28, 462, "#475569", 14, LEFT);
}

function drawLesson11RoughSemicircleGraph() {
  var lossFactor = keParam("lossFactor", 0.55);
  var frame = keAxes("圆槽内的动能比较", "沿圆槽进度 λ", "Eₖ / (mgx)", 0, 1, 0, 4.5);
  kePlot(frame, "#2563eb", function (x) { return 2 - x + 2 * Math.sin(Math.PI * x); });
  kePlot(frame, "#f97316", function (x) {
    var high = 2 - x + 2 * Math.sin(Math.PI * x);
    var gap = 1 - (1 - lossFactor) * x;
    return high - gap;
  });
  var q = constrain((keProgress() - 0.2) / 0.6, 0, 1);
  keMarker(frame, q, 2 - q + 2 * Math.sin(Math.PI * q), "#2563eb");
  keLegend([
    { color: "#2563eb", label: "从 2x 高度释放" },
    { color: "#f97316", label: "从 x 高度释放" }
  ], 744, 104);
}

function keHydrogenSpeedAt(timeValue) {
  if (timeValue <= 10) return 2 * timeValue;
  if (timeValue <= 50) {
    var q = (timeValue - 10) / 40;
    return 20 + 20 * (1 - Math.pow(1 - q, 2.2));
  }
  if (timeValue <= 70) return 40;
  return Math.max(0, 40 - 2 * (timeValue - 70));
}

function drawLesson11HydrogenCarScene() {
  var t = keTime();
  var stage;
  if (t < 10) stage = "恒牵引力匀加速";
  else if (t < 50) stage = "额定功率变加速";
  else if (t < 70) stage = "最大速度匀速";
  else stage = "关闭动力匀减速";
  keGround(380);
  var x = 70 + 420 * ((t % 18) / 18);
  fill("#2563eb");
  stroke("#1d4ed8");
  rect(x - 35, 338, 76, 30, 7);
  rect(x - 15, 322, 42, 22, 7);
  fill("#0f172a");
  circle(x - 20, 371, 15);
  circle(x + 27, 371, 15);
  keText("氢能源汽车分段启动", 28, 30, "#0f172a", 18, LEFT);
  keText(stage, 28, 74, "#dc2626", 15, LEFT);
  keText("t = " + t.toFixed(1) + " s", 34, 456, "#334155", 14, LEFT);
  keText("v = " + keHydrogenSpeedAt(t).toFixed(1) + " m/s", 300, 456, "#2563eb", 14, LEFT);
}

function drawLesson11HydrogenCarGraph() {
  var frame = keAxes("原题 v-t 图像", "时间 t / s", "速度 / (m·s⁻¹)", 0, 90, 0, 45);
  kePlot(frame, "#e11d48", function (t) { return keHydrogenSpeedAt(t); }, 180);
  var tNow = keTime();
  keMarker(frame, tNow, keHydrogenSpeedAt(tNow), "#2563eb");
  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(keGX(frame, 10), frame.top, keGX(frame, 10), frame.bottom);
  line(keGX(frame, 50), frame.top, keGX(frame, 50), frame.bottom);
  line(keGX(frame, 70), frame.top, keGX(frame, 70), frame.bottom);
  drawingContext.setLineDash([]);
}

function drawLesson11ArcPlankScene() {
  var p = keProgress();
  var o = { x: 276, y: 150 };
  var radius = 150;
  var b = { x: o.x - 0.6 * radius, y: o.y + 0.8 * radius };
  var c = { x: o.x, y: o.y + radius };
  var x;
  var y;
  stroke("#475569");
  strokeWeight(4);
  noFill();
  arc(o.x, o.y, radius * 2, radius * 2, Math.PI / 2, Math.atan2(0.8, -0.6));
  fill("#dbeafe");
  stroke("#64748b");
  rect(c.x, c.y, 250, 42, 3);
  keGround(c.y + 44, 250, 542);
  if (p < 0.25) {
    var q1 = p / 0.25;
    x = lerp(70, b.x, q1);
    y = lerp(168, b.y, q1) + 64 * q1 * (1 - q1);
  } else if (p < 0.45) {
    var q2 = (p - 0.25) / 0.2;
    var angle = lerp(Math.atan2(0.8, -0.6), Math.PI / 2, q2);
    x = o.x + radius * Math.cos(angle);
    y = o.y + radius * Math.sin(angle);
  } else {
    var q3 = (p - 0.45) / 0.55;
    var boardShift = q3 < 0.64 ? 22 * q3 / 0.64 : 22 + 36 * (q3 - 0.64);
    var blockShift = q3 < 0.64 ? 142 * q3 / 0.64 : 142 + 36 * (q3 - 0.64);
    fill("#dbeafe");
    stroke("#64748b");
    rect(c.x + boardShift, c.y, 250, 42, 3);
    x = c.x + 28 + blockShift;
    y = c.y - 16;
  }
  keBall(x, y, "#f97316", "m");
  keText("A", 58, 150, "#0f172a", 14, CENTER);
  keText("B", b.x - 15, b.y + 7, "#0f172a", 14, CENTER);
  keText("C", c.x - 15, c.y + 5, "#0f172a", 14, CENTER);
  keText("平抛—圆弧—长木板", 28, 30, "#0f172a", 18, LEFT);
}

function drawLesson11ArcPlankGraph() {
  var frame = keAxes("滑上木板后的动能", "时间 t / s", "动能 / J", 0, 2, -17, 20);
  kePlot(frame, "#2563eb", function (t) {
    var v = t <= 1 ? 6 - 5 * t : Math.max(0, 2 - t);
    return 0.5 * v * v;
  });
  kePlot(frame, "#16a34a", function (t) {
    var v = t <= 1 ? t : Math.max(0, 2 - t);
    return v * v;
  });
  kePlot(frame, "#dc2626", function (t) { return -15 * Math.min(1, t); });
  var local = constrain((keProgress() - 0.45) / 0.55 * 2, 0, 2);
  var blockV = local <= 1 ? 6 - 5 * local : Math.max(0, 2 - local);
  keMarker(frame, local, 0.5 * blockV * blockV, "#2563eb");
  keLegend([
    { color: "#2563eb", label: "物块动能" },
    { color: "#16a34a", label: "木板动能" },
    { color: "#dc2626", label: "内摩擦功之和" }
  ], 744, 104);
}

function drawLesson11ConveyorReturnScene() {
  var t = keTime();
  var position;
  var path;
  if (t <= 2) {
    position = -(4 * t - t * t);
    path = 4 * t - t * t;
  } else if (t <= 3) {
    var q = t - 2;
    position = -4 + q * q;
    path = 4 + q * q;
  } else {
    position = -3 + 2 * (t - 3);
    path = 5 + 2 * (t - 3);
  }
  fill("#dbeafe");
  stroke("#64748b");
  rect(52, 330, 440, 56, 3);
  for (var i = 0; i < 13; i += 1) {
    var stripe = 64 + ((i * 42 + keTime() * 34) % 440);
    stroke("#93c5fd");
    line(stripe, 334, stripe - 18, 382);
  }
  keGround(390, 36, 530);
  var x = 470 + position * 75;
  keBlock(x, 308, "#f97316", "m", 0);
  keArrow(170, 278, 260, 278, "#2563eb", "v₁");
  keText("A", 470, 405, "#0f172a", 14, CENTER);
  keText("传送带上减速、反向并返回", 28, 30, "#0f172a", 18, LEFT);
  keText("路程 x = " + path.toFixed(2) + " m", 34, 456, "#334155", 14, LEFT);
}

function drawLesson11ConveyorReturnGraph() {
  var frame = keAxes("原题 Eₖ-x 折线", "路程 x / m", "Eₖ / J", 0, 8, 0, 18);
  kePlot(frame, "#e11d48", function (x) {
    if (x <= 4) return 16 - 4 * x;
    if (x <= 5) return 4 * (x - 4);
    return 4;
  });
  var t = keTime();
  var path = t <= 2 ? 4 * t - t * t : (t <= 3 ? 4 + (t - 2) * (t - 2) : 5 + 2 * (t - 3));
  var energy = path <= 4 ? 16 - 4 * path : (path <= 5 ? 4 * (path - 4) : 4);
  keMarker(frame, path, energy, "#2563eb");
}

function drawLesson11ArcProjectileScene() {
  var p = keProgress();
  var length = keParam("trackLength", 3.36);
  var trackPixels = map(length, 0, 3.9, 0, 190);
  var a = { x: 92, y: 180 };
  var b = { x: 252, y: 340 };
  var c = { x: b.x + trackPixels, y: b.y };
  var x;
  var y;
  noFill();
  stroke("#475569");
  strokeWeight(4);
  arc(252, 180, 320, 320, Math.PI / 2, Math.PI);
  line(b.x, b.y, c.x, c.y);
  keGround(456, 44, 542);
  if (p < 0.3) {
    var q1 = p / 0.3;
    var angle = lerp(Math.PI, Math.PI / 2, q1);
    x = 252 + 160 * Math.cos(angle);
    y = 180 + 160 * Math.sin(angle);
  } else if (p < 0.62) {
    var q2 = (p - 0.3) / 0.32;
    x = lerp(b.x, c.x, q2);
    y = b.y;
  } else {
    var q3 = (p - 0.62) / 0.38;
    var range = 90;
    x = c.x + range * q3;
    y = c.y + 116 * q3 * q3;
    stroke("#94a3b8");
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    noFill();
    beginShape();
    for (var i = 0; i <= 30; i += 1) {
      var u = i / 30;
      vertex(c.x + range * u, c.y + 116 * u * u);
    }
    endShape();
    drawingContext.setLineDash([]);
  }
  keBall(x, y, "#f97316", "");
  keText("A", a.x - 16, a.y, "#0f172a", 14, CENTER);
  keText("B", b.x - 15, b.y + 8, "#0f172a", 14, CENTER);
  keText("C", c.x, c.y - 20, "#0f172a", 14, CENTER);
  keText("可调 BC 后平抛", 28, 30, "#0f172a", 18, LEFT);
  keText("L = " + length.toFixed(2) + " m", 32, 474, "#2563eb", 14, LEFT);
}

function drawLesson11ArcProjectileGraph() {
  var h = keParam("dropHeight", 3.2);
  var tFall = Math.sqrt(2 * h / 10);
  var maxL = 4;
  var frame = keAxes("落点到 B 的水平距离", "BC 长度 L / m", "X / m", 0, maxL, 0, 5.2);
  kePlot(frame, "#2563eb", function (length) {
    var speedSquared = 16 - 4 * length;
    return speedSquared >= 0 ? length + tFall * Math.sqrt(speedSquared) : NaN;
  });
  var lengthNow = keParam("trackLength", 3.36);
  var xNow = lengthNow + tFall * Math.sqrt(Math.max(0, 16 - 4 * lengthNow));
  keMarker(frame, lengthNow, xNow, "#dc2626");
  keText("最大值：L = 3.36 m", 785, 112, "#dc2626", 13, CENTER);
}
