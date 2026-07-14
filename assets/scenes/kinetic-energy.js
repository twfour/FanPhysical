function keVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function keParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function keTime() {
  return getJsonAnimationState(currentScene).time;
}

function keDuration() {
  return getJsonDuration(currentScene);
}

function keProgress() {
  return constrain(keTime() / Math.max(0.001, keDuration()), 0, 1);
}

function keText(label, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#334155");
  textSize(size || 14);
  textAlign(alignMode || LEFT, CENTER);
  text(label, x, y);
}

function keArrow(x1, y1, x2, y2, colorHex, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var head = 8;
  stroke(colorHex || "#dc2626");
  strokeWeight(2.2);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  if (label) {
    keText(label, x2 + 7, y2 - 9, colorHex || "#dc2626", 13, LEFT);
  }
}

function keGround(y, x1, x2) {
  var left = x1 === undefined ? 28 : x1;
  var right = x2 === undefined ? 542 : x2;
  stroke("#64748b");
  strokeWeight(2);
  line(left, y, right, y);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var x = left + 7; x < right; x += 18) {
    line(x, y, x - 8, y + 9);
  }
}

function keBall(x, y, colorHex, label) {
  stroke("#ffffff");
  strokeWeight(2);
  fill(colorHex || "#2563eb");
  circle(x, y, 22);
  if (label) {
    keText(label, x, y - 20, "#0f172a", 13, CENTER);
  }
}

function keBlock(x, y, colorHex, label, angle) {
  push();
  translate(x, y);
  rotate(angle || 0);
  fill(colorHex || "#f97316");
  stroke("#9a3412");
  strokeWeight(1.5);
  rect(-17, -14, 34, 28, 4);
  pop();
  if (label) {
    keText(label, x, y - 25, "#0f172a", 13, CENTER);
  }
}

function keSpring(x1, y1, x2, y2, colorHex, coils) {
  var turns = coils || 9;
  var dx = x2 - x1;
  var dy = y2 - y1;
  var length = Math.sqrt(dx * dx + dy * dy);
  var nx = length ? -dy / length : 0;
  var ny = length ? dx / length : 0;
  noFill();
  stroke(colorHex || "#2563eb");
  strokeWeight(2);
  beginShape();
  vertex(x1, y1);
  for (var i = 1; i < turns * 2; i += 1) {
    var ratio = i / (turns * 2);
    var offset = (i % 2 ? 1 : -1) * 7;
    vertex(x1 + dx * ratio + nx * offset, y1 + dy * ratio + ny * offset);
  }
  vertex(x2, y2);
  endShape();
}

function kePolylinePoint(points, progress) {
  var lengths = [];
  var total = 0;
  var i;
  for (i = 0; i < points.length - 1; i += 1) {
    var dx = points[i + 1].x - points[i].x;
    var dy = points[i + 1].y - points[i].y;
    var segment = Math.sqrt(dx * dx + dy * dy);
    lengths.push(segment);
    total += segment;
  }
  var target = constrain(progress, 0, 1) * total;
  var walked = 0;
  for (i = 0; i < lengths.length; i += 1) {
    if (target <= walked + lengths[i] || i === lengths.length - 1) {
      var local = lengths[i] ? (target - walked) / lengths[i] : 0;
      return {
        x: lerp(points[i].x, points[i + 1].x, local),
        y: lerp(points[i].y, points[i + 1].y, local),
        angle: Math.atan2(points[i + 1].y - points[i].y, points[i + 1].x - points[i].x)
      };
    }
    walked += lengths[i];
  }
  return { x: points[0].x, y: points[0].y, angle: 0 };
}

function keAxes(title, xLabel, yLabel, xMin, xMax, yMin, yMax) {
  var frame = { left: 620, right: 970, top: 82, bottom: 430 };
  fill("#ffffff");
  stroke("#cbd5e1");
  strokeWeight(1.2);
  rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  keText(title, 795, 36, "#0f172a", 17, CENTER);
  keText(yLabel, 592, 64, "#475569", 13, CENTER);
  keText(xLabel, 795, 468, "#475569", 13, CENTER);
  for (var i = 0; i <= 4; i += 1) {
    var px = map(i, 0, 4, frame.left, frame.right);
    var py = map(i, 0, 4, frame.bottom, frame.top);
    stroke("#e2e8f0");
    strokeWeight(1);
    line(px, frame.top, px, frame.bottom);
    line(frame.left, py, frame.right, py);
    keText(keNumber(map(i, 0, 4, xMin, xMax)), px, frame.bottom + 18, "#64748b", 11, CENTER);
    keText(keNumber(map(i, 0, 4, yMin, yMax)), frame.left - 10, py, "#64748b", 11, RIGHT);
  }
  frame.xMin = xMin;
  frame.xMax = xMax;
  frame.yMin = yMin;
  frame.yMax = yMax;
  return frame;
}

function keNumber(value) {
  var absolute = Math.abs(value);
  if (absolute >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (absolute >= 1000) return (value / 1000).toFixed(1) + "k";
  if (absolute >= 10) return value.toFixed(0);
  if (absolute >= 1) return value.toFixed(1);
  return value.toFixed(2);
}

function keGX(frame, value) {
  return map(value, frame.xMin, frame.xMax, frame.left, frame.right);
}

function keGY(frame, value) {
  return map(value, frame.yMin, frame.yMax, frame.bottom, frame.top);
}

function kePlot(frame, colorHex, valueAt, segments, dashed) {
  var count = segments || 140;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  drawingContext.clip();
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  drawingContext.setLineDash(dashed ? [6, 5] : []);
  beginShape();
  for (var i = 0; i <= count; i += 1) {
    var xValue = map(i, 0, count, frame.xMin, frame.xMax);
    var yValue = valueAt(xValue);
    if (Number.isFinite(yValue)) {
      vertex(keGX(frame, xValue), keGY(frame, yValue));
    }
  }
  endShape();
  drawingContext.setLineDash([]);
  drawingContext.restore();
  pop();
}

function keMarker(frame, xValue, yValue, colorHex) {
  var x = keGX(frame, constrain(xValue, frame.xMin, frame.xMax));
  var y = keGY(frame, constrain(yValue, frame.yMin, frame.yMax));
  push();
  stroke(colorHex || "#dc2626");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(x, frame.bottom, x, y);
  line(frame.left, y, x, y);
  drawingContext.setLineDash([]);
  noStroke();
  fill(colorHex || "#dc2626");
  circle(x, y, 9);
  pop();
}

function keLegend(items, x, y) {
  for (var i = 0; i < items.length; i += 1) {
    noStroke();
    fill(items[i].color);
    circle(x, y + i * 21, 8);
    keText(items[i].label, x + 10, y + i * 21, "#475569", 12, LEFT);
  }
}

function drawKineticEnergyModelScene() {
  var variant = keVariant();
  if (variant === "lesson11_jet_takeoff") drawLesson11JetScene();
  else if (variant === "lesson11_spring_incline") drawLesson11SpringInclineScene();
  else if (variant === "lesson11_round_trip_incline") drawLesson11RoundTripScene();
  else if (variant === "lesson11_kinetic_graph") drawLesson11KineticGraphScene();
  else if (variant === "lesson11_incline_loop") drawLesson11InclineLoopScene();
  else if (variant === "lesson11_rough_semicircle") drawLesson11RoughSemicircleScene();
  else if (variant === "lesson11_hydrogen_car") drawLesson11HydrogenCarScene();
  else if (variant === "lesson11_arc_plank") drawLesson11ArcPlankScene();
  else if (variant === "lesson11_conveyor_return") drawLesson11ConveyorReturnScene();
  else if (variant === "lesson11_arc_projectile") drawLesson11ArcProjectileScene();
  else if (variant === "lesson11_spring_compression") drawLesson11SpringCompressionScene();
  else if (variant === "lesson11_incline_conveyor") drawLesson11InclineConveyorScene();
  else if (variant === "lesson11_incline_round_trip") drawLesson11InclineRoundTripScene();
  else if (variant === "lesson11_vertical_drag_force") drawLesson11VerticalDragScene();
  else if (variant === "lesson11_cross_conveyor") drawLesson11CrossConveyorScene();
  else if (variant === "lesson11_hoist_shortest_time") drawLesson11HoistScene();
  else if (variant === "lesson11_car_rope_spring") drawLesson11CarRopeSpringScene();
  else if (variant === "lesson11_pendulum_tension") drawLesson11PendulumTensionScene();
  else if (variant === "lesson11_linear_drag_throw") drawLesson11LinearDragScene();
  else if (variant === "lesson11_trebuchet") drawLesson11TrebuchetScene();
}

function drawKineticEnergyModelGraph() {
  var variant = keVariant();
  if (variant === "lesson11_jet_takeoff") drawLesson11JetGraph();
  else if (variant === "lesson11_spring_incline") drawLesson11SpringInclineGraph();
  else if (variant === "lesson11_round_trip_incline") drawLesson11RoundTripGraph();
  else if (variant === "lesson11_kinetic_graph") drawLesson11KineticGraphGraph();
  else if (variant === "lesson11_incline_loop") drawLesson11InclineLoopGraph();
  else if (variant === "lesson11_rough_semicircle") drawLesson11RoughSemicircleGraph();
  else if (variant === "lesson11_hydrogen_car") drawLesson11HydrogenCarGraph();
  else if (variant === "lesson11_arc_plank") drawLesson11ArcPlankGraph();
  else if (variant === "lesson11_conveyor_return") drawLesson11ConveyorReturnGraph();
  else if (variant === "lesson11_arc_projectile") drawLesson11ArcProjectileGraph();
  else if (variant === "lesson11_spring_compression") drawLesson11SpringCompressionGraph();
  else if (variant === "lesson11_incline_conveyor") drawLesson11InclineConveyorGraph();
  else if (variant === "lesson11_incline_round_trip") drawLesson11InclineRoundTripGraph();
  else if (variant === "lesson11_vertical_drag_force") drawLesson11VerticalDragGraph();
  else if (variant === "lesson11_cross_conveyor") drawLesson11CrossConveyorGraph();
  else if (variant === "lesson11_hoist_shortest_time") drawLesson11HoistGraph();
  else if (variant === "lesson11_car_rope_spring") drawLesson11CarRopeSpringGraph();
  else if (variant === "lesson11_pendulum_tension") drawLesson11PendulumTensionGraph();
  else if (variant === "lesson11_linear_drag_throw") drawLesson11LinearDragGraph();
  else if (variant === "lesson11_trebuchet") drawLesson11TrebuchetGraph();
}

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

function drawLesson11SpringCompressionScene() {
  var p = keProgress();
  var s = keParam("distance", 2);
  var compression = keParam("compression", 0.8);
  var contactRatio = s / (s + compression);
  var blockX;
  var springEnd;
  keGround(378);
  if (p <= contactRatio) {
    blockX = lerp(500, 274, p / contactRatio);
    springEnd = 254;
  } else {
    var q = (p - contactRatio) / (1 - contactRatio);
    blockX = lerp(274, 194, q);
    springEnd = lerp(254, 174, q);
  }
  stroke("#475569");
  strokeWeight(6);
  line(58, 286, 58, 378);
  keSpring(58, 348, springEnd, 348, "#2563eb", 10);
  keBlock(blockX, 328, "#f97316", "m", 0);
  if (p < 0.99) keArrow(blockX + 8, 298, blockX - 55, 298, "#dc2626", "v");
  keText("A", 500, 397, "#0f172a", 14, CENTER);
  keText("O", 254, 397, "#0f172a", 14, CENTER);
  keText("先滑行 s，再压缩弹簧 x", 28, 30, "#0f172a", 18, LEFT);
  keText(p <= contactRatio ? "尚未接触弹簧" : "弹簧正在压缩", 28, 76, p <= contactRatio ? "#64748b" : "#2563eb", 14, LEFT);
}

function drawLesson11SpringCompressionGraph() {
  var m = keParam("mass", 1);
  var v = keParam("speed", 8);
  var s = keParam("distance", 2);
  var x = keParam("compression", 0.8);
  var mu = keParam("mu", 0.2);
  var g = keParam("g", 10);
  var totalDistance = s + x;
  var initial = 0.5 * m * v * v;
  var friction = mu * m * g;
  var springFinal = Math.max(0, initial - friction * totalDistance);
  var frame = keAxes("能量随路程分配", "累计路程 l / m", "能量 / J", 0, totalDistance, 0, initial * 1.12);
  kePlot(frame, "#2563eb", function (distance) {
    var springEnergy = distance <= s ? 0 : springFinal * Math.pow((distance - s) / x, 2);
    return Math.max(0, initial - friction * distance - springEnergy);
  });
  kePlot(frame, "#64748b", function (distance) { return friction * distance; });
  kePlot(frame, "#dc2626", function (distance) {
    return distance <= s ? 0 : springFinal * Math.pow((distance - s) / x, 2);
  });
  var distanceNow = totalDistance * keProgress();
  var springNow = distanceNow <= s ? 0 : springFinal * Math.pow((distanceNow - s) / x, 2);
  keMarker(frame, distanceNow, Math.max(0, initial - friction * distanceNow - springNow), "#2563eb");
  keLegend([
    { color: "#2563eb", label: "物体动能" },
    { color: "#64748b", label: "摩擦耗能" },
    { color: "#dc2626", label: "弹簧储能" }
  ], 744, 104);
}

function keInclineConveyorState(progress) {
  var length = keParam("length", 8);
  var beltSpeed = keParam("beltSpeed", 2);
  var angle = radians(keParam("angle", 37));
  var mu = keParam("mu", 0.8);
  var mass = keParam("mass", 1);
  var g = 10;
  var friction = mu * mass * g * Math.cos(angle);
  var accel = Math.max(0.05, friction / mass - g * Math.sin(angle));
  var matchTime = beltSpeed / accel;
  var matchDistance = 0.5 * accel * matchTime * matchTime;
  var endTime = matchTime + Math.max(0, length - matchDistance) / beltSpeed;
  var t = progress * endTime;
  var position;
  var velocity;
  if (t <= matchTime) {
    position = 0.5 * accel * t * t;
    velocity = accel * t;
  } else {
    position = matchDistance + beltSpeed * (t - matchTime);
    velocity = beltSpeed;
  }
  return {
    t: t,
    endTime: endTime,
    position: Math.min(length, position),
    velocity: velocity,
    friction: friction,
    accel: accel,
    matchTime: matchTime,
    matchDistance: matchDistance,
    length: length,
    beltSpeed: beltSpeed,
    angle: angle,
    mass: mass,
    g: g
  };
}

function drawLesson11InclineConveyorScene() {
  var state = keInclineConveyorState(keProgress());
  var a = { x: 80, y: 398 };
  var b = { x: 500, y: 150 };
  stroke("#64748b");
  strokeWeight(16);
  line(a.x, a.y, b.x, b.y);
  stroke("#93c5fd");
  strokeWeight(3);
  for (var i = 0; i < 13; i += 1) {
    var q = ((i / 12) + keTime() * 0.08) % 1;
    var sx = lerp(a.x, b.x, q);
    var sy = lerp(a.y, b.y, q);
    line(sx - 7, sy - 12, sx + 7, sy + 12);
  }
  var ratio = state.position / state.length;
  var x = lerp(a.x, b.x, ratio);
  var y = lerp(a.y, b.y, ratio);
  keBlock(x, y - 22, "#f97316", "m", Math.atan2(b.y - a.y, b.x - a.x));
  keArrow(x - 4, y - 52, x + 58, y - 88, "#2563eb", "f");
  keText("倾斜传送带：先滑动后同速", 28, 30, "#0f172a", 18, LEFT);
  keText("s = " + state.position.toFixed(2) + " m", 28, 462, "#334155", 14, LEFT);
  keText("v = " + state.velocity.toFixed(2) + " m/s", 290, 462, "#2563eb", 14, LEFT);
}

function drawLesson11InclineConveyorGraph() {
  var state = keInclineConveyorState(keProgress());
  var maxWork = state.mass * state.g * state.length * Math.sin(state.angle) + 0.5 * state.mass * state.beltSpeed * state.beltSpeed;
  var frame = keAxes("摩擦功与摩擦热", "时间 t / s", "能量 / J", 0, state.endTime, 0, maxWork * 1.12);
  kePlot(frame, "#2563eb", function (t) {
    var position = t <= state.matchTime ? 0.5 * state.accel * t * t : state.matchDistance + state.beltSpeed * (t - state.matchTime);
    if (t <= state.matchTime) return state.friction * position;
    return state.friction * state.matchDistance + state.mass * state.g * Math.sin(state.angle) * (position - state.matchDistance);
  });
  kePlot(frame, "#dc2626", function (t) {
    var limited = Math.min(t, state.matchTime);
    var position = 0.5 * state.accel * limited * limited;
    return state.friction * Math.max(0, state.beltSpeed * limited - position);
  });
  var workNow = state.t <= state.matchTime
    ? state.friction * state.position
    : state.friction * state.matchDistance + state.mass * state.g * Math.sin(state.angle) * (state.position - state.matchDistance);
  keMarker(frame, state.t, workNow, "#2563eb");
  keLegend([
    { color: "#2563eb", label: "摩擦力对包裹做功" },
    { color: "#dc2626", label: "摩擦生热" }
  ], 736, 104);
}

function drawLesson11InclineRoundTripScene() {
  var p = keProgress();
  var bottom = { x: 86, y: 395 };
  var top = { x: 478, y: 156 };
  var positionRatio;
  var upward = p <= 0.5;
  if (upward) {
    var q1 = p * 2;
    positionRatio = 2 * q1 - q1 * q1;
  } else {
    var q2 = (p - 0.5) * 2;
    positionRatio = 1 - q2 * q2;
  }
  stroke("#475569");
  strokeWeight(5);
  line(bottom.x - 20, bottom.y + 14, top.x + 20, top.y - 12);
  var x = lerp(bottom.x, top.x, positionRatio);
  var y = lerp(bottom.y, top.y, positionRatio);
  keBlock(x, y - 18, upward ? "#2563eb" : "#f97316", upward ? "上滑" : "下滑", Math.atan2(top.y - bottom.y, top.x - bottom.x));
  keArrow(x, y + 8, x - 55, y + 42, "#dc2626", "f");
  keText("粗糙斜面往返", 28, 30, "#0f172a", 18, LEFT);
  keText(upward ? "摩擦力与重力分力同向减速" : "摩擦力与重力分力反向", 28, 462, "#475569", 14, LEFT);
}

function drawLesson11InclineRoundTripGraph() {
  var m = keParam("mass", 1);
  var v0 = keParam("speed", 8);
  var angle = radians(keParam("angle", 37));
  var g = keParam("g", 10);
  var maxDistance = 5 * v0 * v0 / (16 * g * Math.sin(angle));
  var initial = 0.5 * m * v0 * v0;
  var returned = initial / 4;
  var frame = keAxes("同一位置的上、下行动能", "距出发点 s / m", "Eₖ / J", 0, maxDistance, 0, initial * 1.12);
  kePlot(frame, "#2563eb", function (s) { return initial * (1 - s / maxDistance); });
  kePlot(frame, "#f97316", function (s) { return returned * (1 - s / maxDistance); });
  var p = keProgress();
  var ratio = p <= 0.5 ? 2 * (p * 2) - (p * 2) * (p * 2) : 1 - Math.pow((p - 0.5) * 2, 2);
  var energy = p <= 0.5 ? initial * (1 - ratio) : returned * (1 - ratio);
  keMarker(frame, maxDistance * ratio, energy, p <= 0.5 ? "#2563eb" : "#f97316");
  keLegend([
    { color: "#2563eb", label: "上滑动能" },
    { color: "#f97316", label: "下滑动能" }
  ], 754, 104);
}

function keVerticalDragState(progress) {
  var energy0 = keParam("initialEnergy", 72);
  var weight = keParam("weight", 10);
  var resistance = keParam("resistance", 2);
  var g = 10;
  var mass = weight / g;
  var v0 = Math.sqrt(2 * energy0 / mass);
  var accelUp = (weight + resistance) / mass;
  var height = energy0 / (weight + resistance);
  var timeUp = v0 / accelUp;
  var accelDown = (weight - resistance) / mass;
  var timeDown = Math.sqrt(2 * height / accelDown);
  var totalTime = timeUp + timeDown;
  var t = progress * totalTime;
  var y;
  var velocity;
  var rising = t <= timeUp;
  if (rising) {
    y = v0 * t - 0.5 * accelUp * t * t;
    velocity = v0 - accelUp * t;
  } else {
    var downTime = t - timeUp;
    y = height - 0.5 * accelDown * downTime * downTime;
    velocity = -accelDown * downTime;
  }
  return {
    t: t,
    y: Math.max(0, y),
    velocity: velocity,
    rising: rising,
    height: height,
    energy0: energy0,
    weight: weight,
    resistance: resistance,
    mass: mass,
    totalTime: totalTime
  };
}

function drawLesson11VerticalDragScene() {
  var state = keVerticalDragState(keProgress());
  keGround(420, 70, 500);
  stroke("#cbd5e1");
  strokeWeight(2);
  line(275, 92, 275, 420);
  var y = map(state.y, 0, state.height, 402, 112);
  keBall(275, y, "#f97316", "m");
  keArrow(275, y + 15, 275, y + 68, "#dc2626", "mg");
  if (state.rising) keArrow(305, y + 4, 305, y + 51, "#64748b", "F");
  else keArrow(305, y - 4, 305, y - 51, "#64748b", "F");
  keText("恒阻力竖直上抛", 28, 30, "#0f172a", 18, LEFT);
  keText(state.rising ? "上升：mg 与 F 同向" : "下落：mg 与 F 反向", 28, 76, state.rising ? "#dc2626" : "#2563eb", 14, LEFT);
  keText("h = " + state.y.toFixed(2) + " m", 30, 468, "#334155", 14, LEFT);
}

function drawLesson11VerticalDragGraph() {
  var state = keVerticalDragState(keProgress());
  var frame = keAxes("原题 Eₖ-h 图像", "高度 h / m", "Eₖ / J", 0, state.height, 0, state.energy0 * 1.12);
  kePlot(frame, "#e11d48", function (h) { return state.energy0 - (state.weight + state.resistance) * h; });
  kePlot(frame, "#2563eb", function (h) { return (state.weight - state.resistance) * (state.height - h); });
  var energy = state.rising
    ? state.energy0 - (state.weight + state.resistance) * state.y
    : (state.weight - state.resistance) * (state.height - state.y);
  keMarker(frame, state.y, energy, state.rising ? "#e11d48" : "#2563eb");
  keLegend([
    { color: "#e11d48", label: "上升" },
    { color: "#2563eb", label: "下落" }
  ], 792, 104);
}

function drawLesson11CrossConveyorScene() {
  var q = keProgress();
  fill("#dbeafe");
  stroke("#64748b");
  strokeWeight(2);
  rect(120, 70, 390, 370, 4);
  for (var i = 0; i < 8; i += 1) {
    var stripeY = 100 + ((i * 54 - keTime() * 55 + 430) % 370);
    stroke("#93c5fd");
    line(128, stripeY, 502, stripeY);
  }
  keArrow(92, 390, 92, 285, "#2563eb", "传送带 v");
  stroke("#f97316");
  strokeWeight(3);
  noFill();
  beginShape();
  for (i = 0; i <= 40; i += 1) {
    var u = i / 40 * q;
    vertex(145 + 310 * u, 390 - 245 * u * u);
  }
  endShape();
  stroke("#2563eb");
  drawingContext.setLineDash([5, 4]);
  beginShape();
  for (i = 0; i <= 40; i += 1) {
    var r = i / 40 * q;
    vertex(145 + 310 * r, 390 + 48 * (2 * r - r * r));
  }
  endShape();
  drawingContext.setLineDash([]);
  keBlock(145 + 310 * q, 390 - 245 * q * q, "#f97316", "货物", 0);
  keText("橙色：对地轨迹", 330, 92, "#f97316", 13, LEFT);
  keText("蓝色虚线：传送带上的划痕", 286, 424, "#2563eb", 13, LEFT);
  keText("垂直冲上传送带", 28, 30, "#0f172a", 18, LEFT);
}

function drawLesson11CrossConveyorGraph() {
  var v = keParam("speed", 4);
  var frame = keAxes("速度分量与相对速度", "归一化时间 t/T", "速度 / (m·s⁻¹)", 0, 1, 0, 1.55 * v);
  kePlot(frame, "#64748b", function () { return v; });
  kePlot(frame, "#2563eb", function (x) { return v * x; });
  kePlot(frame, "#dc2626", function (x) { return v * Math.sqrt(1 + Math.pow(1 - x, 2)); });
  var q = keProgress();
  keMarker(frame, q, v * q, "#2563eb");
  keLegend([
    { color: "#64748b", label: "vₓ" },
    { color: "#2563eb", label: "vᵧ" },
    { color: "#dc2626", label: "相对传送带速率" }
  ], 744, 104);
}

function keHoistSpeedAt(t) {
  if (t <= 0.8) return 5 * t;
  if (t <= 2) return 4 + 2 * (1 - Math.pow(1 - (t - 0.8) / 1.2, 2));
  if (t <= 14.3) return 6;
  return Math.max(0, 6 - 5 * (t - 14.3));
}

function drawLesson11HoistScene() {
  var t = keTime();
  var height;
  if (t <= 0.8) height = 0.5 * 5 * t * t;
  else if (t <= 14.3) height = 1.6 + 80 * (t - 0.8) / 13.5;
  else {
    var dt = t - 14.3;
    height = 81.6 + 6 * dt - 2.5 * dt * dt;
  }
  stroke("#475569");
  strokeWeight(7);
  line(120, 438, 120, 72);
  line(120, 72, 380, 72);
  fill("#475569");
  noStroke();
  rect(350, 54, 62, 38, 4);
  var y = map(height, 0, 85.2, 405, 110);
  stroke("#0f172a");
  strokeWeight(2);
  line(382, 92, 382, y - 28);
  keBlock(382, y, "#f97316", "20 kg", 0);
  keArrow(382, y - 12, 382, y - 76, "#2563eb", "T");
  keText("受拉力与功率限制的提升", 28, 30, "#0f172a", 18, LEFT);
  keText("h = " + height.toFixed(1) + " m", 28, 464, "#334155", 14, LEFT);
  keText("v = " + keHoistSpeedAt(t).toFixed(2) + " m/s", 290, 464, "#2563eb", 14, LEFT);
}

function drawLesson11HoistGraph() {
  var frame = keAxes("最短时间速度图", "时间 t / s", "速度 / (m·s⁻¹)", 0, 15.5, 0, 6.8);
  kePlot(frame, "#2563eb", function (t) { return keHoistSpeedAt(t); }, 180);
  var tNow = keTime();
  keMarker(frame, tNow, keHoistSpeedAt(tNow), "#dc2626");
  stroke("#94a3b8");
  drawingContext.setLineDash([4, 4]);
  line(keGX(frame, 0.8), frame.top, keGX(frame, 0.8), frame.bottom);
  line(keGX(frame, 14.3), frame.top, keGX(frame, 14.3), frame.bottom);
  drawingContext.setLineDash([]);
  keText("最大拉力", 646, 104, "#475569", 12, LEFT);
  keText("额定功率", 768, 104, "#475569", 12, LEFT);
  keText("最大减速", 895, 104, "#475569", 12, LEFT);
}

function drawLesson11CarRopeSpringScene() {
  var q = keProgress();
  var inclineA = { x: 88, y: 404 };
  var inclineTop = { x: 406, y: 136 };
  var pulley = { x: 420, y: 126 };
  var carStart = { x: 420, y: 404 };
  var carX = carStart.x + 102 * q;
  var blockA = { x: 124, y: 374 };
  var blockBStart = { x: 248, y: 270 };
  var blockB = {
    x: blockBStart.x + 44 * q,
    y: blockBStart.y - 37 * q
  };
  stroke("#475569");
  strokeWeight(5);
  line(inclineA.x, inclineA.y, inclineTop.x, inclineTop.y);
  keGround(424, 40, 542);
  fill("#cbd5e1");
  stroke("#64748b");
  circle(pulley.x, pulley.y, 30);
  stroke("#0f172a");
  strokeWeight(2);
  line(blockB.x, blockB.y, pulley.x, pulley.y);
  line(pulley.x, pulley.y, carX, 386);
  keSpring(blockA.x + 18, blockA.y - 16, blockB.x - 18, blockB.y + 8, "#2563eb", 9);
  keBlock(blockA.x, blockA.y - 18, "#94a3b8", "A", -0.7);
  keBlock(blockB.x, blockB.y - 18, "#f97316", "B", -0.7);
  fill("#2563eb");
  stroke("#1d4ed8");
  rect(carX - 27, 382, 58, 25, 6);
  fill("#0f172a");
  circle(carX - 15, 410, 12);
  circle(carX + 20, 410, 12);
  keText("小车—绳—弹簧几何联动", 28, 30, "#0f172a", 18, LEFT);
  keText("小车位移 = " + (0.75 * q).toFixed(2) + " L", 28, 466, "#334155", 14, LEFT);
  keText("B 位移 = " + (Math.sqrt(1 + Math.pow(0.75 * q, 2)) - 1).toFixed(2) + " L", 280, 466, "#2563eb", 14, LEFT);
}

function drawLesson11CarRopeSpringGraph() {
  var frame = keAxes("几何约束关系", "小车位移 x / L", "无量纲比值", 0, 0.75, 0, 0.68);
  kePlot(frame, "#2563eb", function (x) { return Math.sqrt(1 + x * x) - 1; });
  kePlot(frame, "#dc2626", function (x) { return x / Math.sqrt(1 + x * x); });
  var xNow = 0.75 * keProgress();
  keMarker(frame, xNow, Math.sqrt(1 + xNow * xNow) - 1, "#2563eb");
  keLegend([
    { color: "#2563eb", label: "B 位移 s_B/L" },
    { color: "#dc2626", label: "速度比 v_B/v_车" }
  ], 740, 104);
}

function drawLesson11PendulumTensionScene() {
  var p = keProgress();
  var o = { x: 220, y: 174 };
  var radius = 170;
  var a = { x: o.x + radius * Math.cos(Math.PI / 6), y: o.y - radius * Math.sin(Math.PI / 6) };
  var b = { x: o.x + radius * Math.cos(Math.PI / 6), y: o.y + radius * Math.sin(Math.PI / 6) };
  var x;
  var y;
  stroke("#475569");
  strokeWeight(5);
  point(o.x, o.y);
  if (p < 0.45) {
    var q1 = p / 0.45;
    x = a.x;
    y = lerp(a.y, b.y, q1 * q1);
    noFill();
    stroke("#64748b");
    strokeWeight(2);
    bezier(o.x, o.y, o.x + 66, o.y + 30, x - 70, y - 15, x, y);
    keText("绳松弛：自由落体", 28, 76, "#dc2626", 14, LEFT);
  } else {
    var q2 = (p - 0.45) / 0.55;
    var angle = lerp(Math.PI / 6, Math.PI / 2, q2);
    x = o.x + radius * Math.cos(angle);
    y = o.y + radius * Math.sin(angle);
    stroke("#334155");
    strokeWeight(2);
    line(o.x, o.y, x, y);
    keText(q2 < 0.08 ? "绳绷紧：径向速度被消去" : "绳绷紧：沿圆弧摆动", 28, 76, "#2563eb", 14, LEFT);
  }
  keBall(x, y, "#f97316", "m");
  keText("O", o.x - 14, o.y - 5, "#0f172a", 14, CENTER);
  keText("松绳—绷紧—摆动", 28, 30, "#0f172a", 18, LEFT);
}

function drawLesson11PendulumTensionGraph() {
  var frame = keAxes("绳绷紧前后的速度突变", "过程阶段", "v² / (gL)", 0, 2, 0, 2.8);
  kePlot(frame, "#f97316", function (x) { return x <= 1 ? 2 * x : NaN; }, 80);
  kePlot(frame, "#2563eb", function (x) {
    if (x < 1) return NaN;
    var angle = lerp(Math.PI / 6, Math.PI / 2, x - 1);
    return 0.5 + 2 * Math.sin(angle);
  }, 80);
  stroke("#dc2626");
  strokeWeight(2);
  drawingContext.setLineDash([4, 4]);
  line(keGX(frame, 1), keGY(frame, 2), keGX(frame, 1), keGY(frame, 1.5));
  drawingContext.setLineDash([]);
  var stage = keProgress() < 0.45 ? keProgress() / 0.45 : 1 + (keProgress() - 0.45) / 0.55;
  var value;
  if (stage < 1) value = 2 * stage;
  else {
    var angleNow = lerp(Math.PI / 6, Math.PI / 2, stage - 1);
    value = 0.5 + 2 * Math.sin(angleNow);
  }
  keMarker(frame, stage, value, stage < 1 ? "#f97316" : "#2563eb");
  keLegend([
    { color: "#f97316", label: "自由落体" },
    { color: "#2563eb", label: "绷紧后摆动" }
  ], 754, 104);
}

function keLinearDragSpeed(timeValue, initialSpeed, terminalSpeed, g) {
  var tau = terminalSpeed / g;
  var peakTime = tau * Math.log(1 + initialSpeed / terminalSpeed);
  if (timeValue <= peakTime) {
    return (initialSpeed + terminalSpeed) * Math.exp(-timeValue / tau) - terminalSpeed;
  }
  return terminalSpeed * (1 - Math.exp(-(timeValue - peakTime) / tau));
}

function drawLesson11LinearDragScene() {
  var p = keProgress();
  var v0 = keParam("initialSpeed", 15);
  var vt = keParam("terminalSpeed", 8);
  var g = keParam("g", 10);
  var tau = vt / g;
  var peakTime = tau * Math.log(1 + v0 / vt);
  var peakRatio = Math.min(0.42, peakTime / Math.max(0.001, keDuration()));
  var y;
  var rising = p <= peakRatio;
  if (rising) {
    var q1 = p / peakRatio;
    y = lerp(408, 130, 2 * q1 - q1 * q1);
  } else {
    var q2 = (p - peakRatio) / (1 - peakRatio);
    y = lerp(130, 408, q2 * q2);
  }
  keGround(426, 70, 500);
  stroke("#cbd5e1");
  strokeWeight(2);
  line(278, 90, 278, 426);
  keBall(278, y, "#f97316", "m");
  keArrow(278, y + 14, 278, y + 66, "#dc2626", "mg");
  if (rising) keArrow(310, y + 8, 310, y + 52, "#64748b", "kv");
  else keArrow(310, y - 8, 310, y - 52, "#64748b", "kv");
  keText("线性空气阻力下的竖直上抛", 28, 30, "#0f172a", 18, LEFT);
  keText(rising ? "上升：阻力向下" : "下落：阻力向上，速率趋近 v₁", 28, 76, rising ? "#dc2626" : "#2563eb", 14, LEFT);
}

function drawLesson11LinearDragGraph() {
  var v0 = keParam("initialSpeed", 15);
  var vt = keParam("terminalSpeed", 8);
  var g = keParam("g", 10);
  var duration = keDuration();
  var frame = keAxes("速率—时间图像", "时间 t / s", "速率 / (m·s⁻¹)", 0, duration, 0, v0 * 1.12);
  kePlot(frame, "#2563eb", function (t) { return keLinearDragSpeed(t, v0, vt, g); }, 180);
  kePlot(frame, "#dc2626", function () { return vt; }, 80, true);
  var tNow = keTime();
  keMarker(frame, tNow, keLinearDragSpeed(tNow, v0, vt, g), "#2563eb");
  keLegend([
    { color: "#2563eb", label: "小球速率" },
    { color: "#dc2626", label: "终端速率 v₁" }
  ], 758, 104);
}

function keTrebuchetValues(radius) {
  var arm = keParam("armLength", 4);
  var angle = radians(keParam("angle", 30));
  var mass = keParam("mass", 10);
  var target = keParam("target", 12);
  var g = 10;
  var pivotHeight = arm * Math.sin(angle);
  var originalHeight = pivotHeight + arm;
  var originalSpeedSquared = target * target * g / (2 * originalHeight);
  var work = 0.5 * mass * originalSpeedSquared + mass * g * originalHeight;
  var speedSquared = Math.max(0, 2 * work / mass - 2 * g * radius * (1 + Math.sin(angle)));
  var releaseHeight = pivotHeight + radius;
  var range = Math.sqrt(Math.max(0, speedSquared * 2 * releaseHeight / g));
  return {
    arm: arm,
    angle: angle,
    mass: mass,
    target: target,
    pivotHeight: pivotHeight,
    work: work,
    speedSquared: speedSquared,
    releaseHeight: releaseHeight,
    range: range
  };
}

function drawLesson11TrebuchetScene() {
  var p = keProgress();
  var radiusValue = keParam("mountRadius", 3);
  var values = keTrebuchetValues(radiusValue);
  var o = { x: 238, y: 286 };
  var scale = 42;
  var radiusPixels = radiusValue * scale;
  var angle;
  var x;
  var y;
  keGround(418, 32, 542);
  fill("#64748b");
  stroke("#475569");
  triangle(o.x - 24, 418, o.x + 24, 418, o.x, o.y + 10);
  if (p < 0.45) {
    var q1 = p / 0.45;
    angle = lerp(5 * Math.PI / 6, 3 * Math.PI / 2, q1);
    x = o.x + radiusPixels * Math.cos(angle);
    y = o.y + radiusPixels * Math.sin(angle);
    stroke("#334155");
    strokeWeight(8);
    line(o.x - 58 * Math.cos(angle), o.y - 58 * Math.sin(angle), o.x + values.arm * scale * Math.cos(angle), o.y + values.arm * scale * Math.sin(angle));
  } else {
    var q2 = (p - 0.45) / 0.55;
    stroke("#334155");
    strokeWeight(8);
    line(o.x, o.y + 58, o.x, o.y - values.arm * scale);
    x = o.x + 282 * q2;
    y = o.y - radiusPixels + (418 - (o.y - radiusPixels)) * q2 * q2;
    stroke("#94a3b8");
    strokeWeight(1.5);
    drawingContext.setLineDash([4, 4]);
    noFill();
    beginShape();
    for (var i = 0; i <= 30; i += 1) {
      var u = i / 30;
      vertex(o.x + 282 * u, o.y - radiusPixels + (418 - (o.y - radiusPixels)) * u * u);
    }
    endShape();
    drawingContext.setLineDash([]);
  }
  keBall(x, y, "#f97316", "");
  keText("O", o.x + 15, o.y + 4, "#0f172a", 14, LEFT);
  keText("可调安装位置的抛石机", 28, 30, "#0f172a", 18, LEFT);
  keText("r = " + radiusValue.toFixed(1) + " m", 28, 466, "#334155", 14, LEFT);
  keText("预测射程 = " + values.range.toFixed(2) + " m", 278, 466, "#2563eb", 14, LEFT);
}

function drawLesson11TrebuchetGraph() {
  var arm = keParam("armLength", 4);
  var minRadius = arm / 2;
  var maxRadius = arm;
  var selected = keParam("mountRadius", 3);
  var maxRange = 0;
  for (var i = 0; i <= 80; i += 1) {
    var radius = lerp(minRadius, maxRadius, i / 80);
    maxRange = Math.max(maxRange, keTrebuchetValues(radius).range);
  }
  var frame = keAxes("落点距离随安装半径变化", "安装半径 r / m", "水平射程 X / m", minRadius, maxRadius, 0, maxRange * 1.12);
  kePlot(frame, "#2563eb", function (r) { return keTrebuchetValues(r).range; });
  keMarker(frame, selected, keTrebuchetValues(selected).range, "#dc2626");
  keText("原题最优：r = 3.0 m", 790, 112, "#dc2626", 13, CENTER);
}
