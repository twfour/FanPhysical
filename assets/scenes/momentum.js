function mpProblem() {
  return problemDataMap[currentScene] || {};
}

function mpAnimation() {
  return mpProblem().animation || {};
}

function mpVariant() {
  return mpAnimation().variant || "";
}

function mpParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function mpProgress() {
  var state = getJsonAnimationState(currentScene);
  return constrain(state.time / Math.max(0.001, getJsonDuration(currentScene)), 0, 1);
}

function mpText(value, x, y, colorValue, size, alignValue) {
  noStroke();
  fill(colorValue || "#334155");
  textSize(size || 14);
  textAlign(alignValue || LEFT, CENTER);
  text(value, x, y);
}

function mpArrow(x1, y1, x2, y2, colorValue, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  push();
  stroke(colorValue || "#dc2626");
  strokeWeight(2.4);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - 9 * Math.cos(angle - Math.PI / 6), y2 - 9 * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - 9 * Math.cos(angle + Math.PI / 6), y2 - 9 * Math.sin(angle + Math.PI / 6));
  pop();
  if (label) mpText(label, x2 + 8, y2 - 10, colorValue, 13, LEFT);
}

function mpGround(y) {
  stroke("#64748b");
  strokeWeight(2);
  line(28, y, 542, y);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var x = 36; x < 542; x += 20) line(x, y, x - 8, y + 8);
}

function mpBall(x, y, colorValue, label, radius) {
  fill(colorValue);
  stroke("#334155");
  strokeWeight(1.5);
  circle(x, y, radius || 24);
  if (label) mpText(label, x, y, "#ffffff", 12, CENTER);
}

function mpSpring(x1, x2, y, phase) {
  noFill();
  stroke("#0f766e");
  strokeWeight(2.2);
  beginShape();
  vertex(x1, y);
  var coils = 12;
  for (var i = 1; i < coils; i += 1) {
    vertex(map(i, 0, coils, x1, x2), y + (i % 2 ? -10 : 10) * (0.8 + phase * 0.2));
  }
  vertex(x2, y);
  endShape();
}

function mpTitle(subtitle) {
  mpText(mpProblem().title || "动量模型", 28, 28, "#0f172a", 18, LEFT);
  mpText(subtitle, 28, 53, "#475569", 13, LEFT);
}

function mpDrawProjectile(p, rebound) {
  mpTitle(rebound ? "碰撞前后：方向变化决定冲量" : "抛体过程：水平动量不变，竖直动量线性变化");
  mpGround(405);
  var q = rebound ? (p < 0.52 ? p / 0.52 : (p - 0.52) / 0.48) : p;
  var x = rebound ? 110 + (p < 0.52 ? 310 * q : 310 - 245 * q) : 80 + 410 * p;
  var y = rebound ? 370 - (p < 0.52 ? 170 * q - 150 * q * q : 150 * q - 145 * q * q) : 130 + 255 * p * p;
  if (mpVariant().indexOf("steel_ball") >= 0) {
    stroke("#475569"); strokeWeight(5); line(430, 105, 430, 405);
    x = p < 0.5 ? 100 + 620 * p : 410 - 590 * (p - 0.5);
    y = 285;
  }
  mpBall(x, min(390, y), "#2563eb", "m", 27);
  mpArrow(x, min(390, y) - 24, x + (p < 0.52 || !rebound ? 55 : -55), min(390, y) - 24, "#dc2626", "v");
}

function mpDrawFlow(p) {
  var variant = mpVariant();
  var hall = variant.indexOf("hall_thruster") >= 0;
  var river = variant.indexOf("river_bend") >= 0;
  var wind = variant.indexOf("wind_tunnel") >= 0;
  mpTitle(hall ? "离子动量流产生反推力" : river ? "水流转弯需要持续侧向冲量" : wind ? "空气动量流率托住人体" : "单位时间动量变化产生冲击力");
  if (river) {
    noFill(); stroke("#2563eb"); strokeWeight(34); arc(285, 280, 310, 260, PI, TWO_PI);
    for (var i = 0; i < 7; i += 1) {
      var a = PI + ((i / 7 + p) % 1) * PI;
      mpBall(285 + 155 * cos(a), 280 + 130 * sin(a), "#7dd3fc", "", 10);
    }
    mpArrow(285, 125, 285, 185, "#dc2626", "向心力");
    return;
  }
  if (wind) {
    for (var j = 0; j < 18; j += 1) {
      var py = 415 - ((j * 27 + p * 180) % 330);
      mpBall(170 + (j % 4) * 45, py, "#bae6fd", "", 8);
    }
    fill("#f59e0b"); stroke("#92400e"); rect(290, 190, 52, 118, 12);
    mpArrow(316, 355, 316, 260, "#2563eb", "F风");
    return;
  }
  fill(hall ? "#334155" : "#94a3b8"); stroke("#0f172a"); rect(70, 195, 185, 120, 8);
  for (var k = 0; k < 16; k += 1) {
    var px = 270 + ((k * 31 + p * 250) % 250);
    mpBall(px, 225 + (k % 5) * 16, hall ? "#a78bfa" : "#38bdf8", "", 8);
  }
  mpArrow(255, 255, 500, 255, "#2563eb", hall ? "离子流" : "水流");
  mpArrow(185, 335, 95, 335, "#dc2626", "反作用力");
}

function mpDrawPendulum(p) {
  mpTitle("系统水平动量与摆球冲量的阶段变化");
  var angle = -1.2 * cos(TWO_PI * p);
  var ox = 280;
  var oy = 105;
  var length = 215;
  var bx = ox + length * sin(angle);
  var by = oy + length * cos(angle);
  stroke("#334155"); strokeWeight(3); line(ox, oy, bx, by);
  fill("#64748b"); noStroke(); rect(145, 350, 270, 58, 6);
  mpBall(bx, by, "#f97316", "C", 30);
  mpArrow(bx, by, bx + 62 * cos(angle), by - 62 * sin(angle), "#2563eb", "v");
}

function mpDrawSpring(p) {
  mpTitle("内力交换动量，外冲量决定系统总动量");
  mpGround(365);
  var oscillation = sin(TWO_PI * p);
  var xA = 165 - 45 * oscillation;
  var xB = 390 + 45 * oscillation;
  if (mpVariant().indexOf("spring_wall") >= 0) {
    stroke("#475569"); strokeWeight(5); line(75, 155, 75, 365);
  }
  mpSpring(xA + 58, xB, 320, oscillation);
  fill("#f97316"); stroke("#9a3412"); rect(xA, 270, 58, 50, 5);
  fill("#2563eb"); stroke("#1e3a8a"); rect(xB, 270, 58, 50, 5);
  mpText("A", xA + 29, 295, "#ffffff", 14, CENTER);
  mpText("B", xB + 29, 295, "#ffffff", 14, CENTER);
  mpArrow(xA + 29, 250, xA + 29 - 48 * cos(TWO_PI * p), 250, "#f97316", "pA");
  mpArrow(xB + 29, 225, xB + 29 + 48 * cos(TWO_PI * p), 225, "#2563eb", "pB");
}

function mpDrawCollision(p) {
  mpTitle("碰撞前后：系统总动量保持不变");
  mpGround(365);
  var before = p < 0.5;
  var q = before ? p / 0.5 : (p - 0.5) / 0.5;
  var x1 = before ? 90 + 250 * q : 340 - 115 * q;
  var x2 = before ? 455 - 105 * q : 350 + 150 * q;
  mpBall(x1, 338, "#f97316", "1", 38);
  mpBall(x2, 338, "#2563eb", "2", 38);
  mpArrow(x1, 285, x1 + (before ? 65 : -34), 285, "#f97316", "v1");
  mpArrow(x2, 245, x2 + (before ? -28 : 55), 245, "#2563eb", "v2");
}

function mpDrawTrack(p) {
  mpTitle("分阶段选择系统：水平动量与机械能联合");
  mpGround(405);
  noFill(); stroke("#475569"); strokeWeight(5);
  beginShape(); vertex(45, 385); vertex(165, 385); bezierVertex(255, 380, 275, 170, 390, 150); vertex(520, 150); endShape();
  var x;
  var y;
  if (p < 0.55) {
    var q = p / 0.55;
    x = 70 + 300 * q;
    y = 365 - 205 * q * q;
  } else {
    var r = (p - 0.55) / 0.45;
    x = 370 - 265 * r;
    y = 160 + 205 * r * r;
  }
  mpBall(x, y, "#f97316", "m", 28);
  fill("#dbeafe"); stroke("#2563eb"); rect(145 + 35 * sin(PI * p), 390, 295, 40, 5);
  mpArrow(x, y - 25, x + (p < 0.55 ? 52 : -52), y - 25, "#dc2626", "v");
}

function mpDrawForce(p) {
  mpTitle("合冲量等于动量变化");
  mpGround(365);
  var x = 75 + 390 * p * p;
  fill("#f97316"); stroke("#9a3412"); rect(x, 305, 70, 60, 6);
  var length = 35 + 80 * sin(PI * p);
  mpArrow(x + 35, 285, x + 35 + length, 285, "#2563eb", "F(t)");
  mpText("阴影面积 = 合冲量 = Δp", 120, 430, "#475569", 15, LEFT);
}

function drawMomentumModelScene() {
  var variant = mpVariant();
  var p = mpProgress();
  if (/water_jet|river_bend|wind_tunnel|hall_thruster/.test(variant)) mpDrawFlow(p);
  else if (/pendulum/.test(variant)) mpDrawPendulum(p);
  else if (/spring|blocks_cart/.test(variant)) mpDrawSpring(p);
  else if (/charged_collision|collision_xt|box_slider/.test(variant)) mpDrawCollision(p);
  else if (/track|groove|plank_arc|game_track|arc_fall|chord_slide/.test(variant)) mpDrawTrack(p);
  else if (/force_time|ring_friction/.test(variant)) mpDrawForce(p);
  else mpDrawProjectile(p, /rebound|basketball/.test(variant));
}

function mpAxes(title, yLabel, yMin, yMax) {
  var frame = { left: 624, right: 970, top: 82, bottom: 430, xMin: 0, xMax: 1, yMin: yMin, yMax: yMax };
  fill("#ffffff"); stroke("#cbd5e1"); strokeWeight(1.2); rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  mpText(title, 797, 35, "#0f172a", 17, CENTER);
  mpText(yLabel, 595, 62, "#475569", 12, CENTER);
  mpText("过程进度", 797, 468, "#475569", 12, CENTER);
  stroke("#e2e8f0"); strokeWeight(1);
  for (var i = 0; i <= 4; i += 1) {
    var x = map(i, 0, 4, frame.left, frame.right);
    var y = map(i, 0, 4, frame.bottom, frame.top);
    line(x, frame.top, x, frame.bottom); line(frame.left, y, frame.right, y);
    mpText((i / 4).toFixed(2), x, frame.bottom + 18, "#64748b", 11, CENTER);
    mpText(map(i, 0, 4, yMin, yMax).toFixed(1), frame.left - 10, y, "#64748b", 11, RIGHT);
  }
  return frame;
}

function mpPlot(frame, colorValue, valueAt) {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  drawingContext.clip();
  noFill(); stroke(colorValue); strokeWeight(2.6); beginShape();
  for (var i = 0; i <= 150; i += 1) {
    var q = i / 150;
    vertex(map(q, 0, 1, frame.left, frame.right), map(valueAt(q), frame.yMin, frame.yMax, frame.bottom, frame.top));
  }
  endShape();
  drawingContext.restore();
  pop();
}

function drawMomentumModelGraph() {
  var variant = mpVariant();
  var mass = mpParam("mass", 1);
  var speed = mpParam("speed", 6);
  var base = mass * speed;
  var frame;
  if (/water_jet|river_bend|wind_tunnel|hall_thruster/.test(variant)) {
    frame = mpAxes("动量流率与速度", "F", 0, base * 1.3);
    mpPlot(frame, "#2563eb", function (q) { return base * q * q; });
    mpText("F ∝ v²", 920, 108, "#2563eb", 13, RIGHT);
  } else if (/force_time|ring_friction/.test(variant)) {
    frame = mpAxes("冲量累积与动量", "p", 0, base * 1.2);
    mpPlot(frame, "#f97316", function (q) { return base * (q < 0.65 ? q * q / 0.65 : 0.65 + 0.35 * q); });
  } else {
    frame = mpAxes("系统与分量动量", "p", -base * 1.25, base * 1.25);
    mpPlot(frame, "#0f766e", function () { return base * 0.45; });
    mpPlot(frame, "#f97316", function (q) { return base * 0.75 * cos(PI * q); });
    mpPlot(frame, "#2563eb", function (q) { return base * 0.45 - base * 0.75 * cos(PI * q); });
    mpText("系统总动量", 944, 108, "#0f766e", 12, RIGHT);
    mpText("物体1", 944, 129, "#f97316", 12, RIGHT);
    mpText("物体2", 944, 150, "#2563eb", 12, RIGHT);
  }
  var x = map(mpProgress(), 0, 1, frame.left, frame.right);
  stroke("#dc2626"); strokeWeight(1); drawingContext.setLineDash([4, 4]); line(x, frame.top, x, frame.bottom); drawingContext.setLineDash([]);
}

registerSceneRenderer("momentum_model", drawMomentumModelScene, drawMomentumModelGraph);
