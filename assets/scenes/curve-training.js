function curveTrainingAnimation() {
  return ((problemDataMap[currentScene] || {}).animation || {});
}

function curveTrainingVariant() {
  return curveTrainingAnimation().variant || "";
}

function curveTrainingProgress() {
  var state = getJsonAnimationState(currentScene);
  var duration = Math.max(0.001, getJsonDuration(currentScene));
  return constrain(state.time / duration, 0, 1);
}

function curveTrainingGraphBegin(title, subtitle) {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(graphLeft, 0, graphRight - graphLeft, canvasH);
  drawingContext.clip();
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(title, graphLeft + 24, 20);
  fill("#475569");
  textSize(13);
  text(subtitle, graphLeft + 24, 49);
  var frame = {
    x: graphLeft + 54,
    y: 88,
    w: graphRight - graphLeft - 92,
    h: 320
  };
  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(frame.x, frame.y, frame.w, frame.h);
  stroke("#e5e7eb");
  for (var i = 1; i < 4; i += 1) {
    line(frame.x, frame.y + frame.h * i / 4, frame.x + frame.w, frame.y + frame.h * i / 4);
    line(frame.x + frame.w * i / 4, frame.y, frame.x + frame.w * i / 4, frame.y + frame.h);
  }
  return frame;
}

function curveTrainingGraphEnd() {
  drawingContext.restore();
  pop();
}

function curveTrainingPlot(frame, xMin, xMax, yMin, yMax, colorHex, fn) {
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 120; i += 1) {
    var x = lerp(xMin, xMax, i / 120);
    var y = fn(x);
    if (isFinite(y)) {
      vertex(
        constrain(map(x, xMin, xMax, frame.x, frame.x + frame.w), frame.x, frame.x + frame.w),
        constrain(map(y, yMin, yMax, frame.y + frame.h, frame.y), frame.y, frame.y + frame.h)
      );
    }
  }
  endShape();
}

function curveTrainingMarker(frame, x, y, xMin, xMax, yMin, yMax, colorHex) {
  var px = constrain(map(x, xMin, xMax, frame.x, frame.x + frame.w), frame.x, frame.x + frame.w);
  var py = constrain(map(y, yMin, yMax, frame.y + frame.h, frame.y), frame.y, frame.y + frame.h);
  noStroke();
  fill(colorHex);
  circle(px, py, 9);
}

function curveTrainingGraphLabels(frame, xLabel, yLabel) {
  noStroke();
  fill("#334155");
  textSize(12);
  textAlign(CENTER, TOP);
  text(xLabel, frame.x + frame.w / 2, frame.y + frame.h + 28);
  push();
  translate(frame.x - 38, frame.y + frame.h / 2);
  rotate(-Math.PI / 2);
  textAlign(CENTER, CENTER);
  text(yLabel, 0, 0);
  pop();
}

function curveTrainingLegend(x, y, colorHex, label) {
  stroke(colorHex);
  strokeWeight(3);
  line(x, y, x + 24, y);
  noStroke();
  fill("#334155");
  textAlign(LEFT, CENTER);
  textSize(12);
  text(label, x + 31, y);
}

function curveTrainingDashedLine(x1, y1, x2, y2, colorHex) {
  stroke(colorHex);
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(x1, y1, x2, y2);
  drawingContext.setLineDash([]);
}

function curveTrainingTitle(title, subtitle) {
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text(title, 24, 20);
  fill("#475569");
  textSize(13);
  text(subtitle, 24, 49);
}

function drawCurveTrainingModelScene() {
  var variant = curveTrainingVariant();
  if (variant === "curve_training_01_concepts") {
    drawCurveTraining01Scene();
  } else if (variant === "curve_training_02_nonuniform_river") {
    drawCurveTraining02Scene();
  } else if (variant === "curve_training_03_accelerating_bomber") {
    drawCurveTraining03Scene();
  } else if (variant === "curve_training_04_formation_turn") {
    drawCurveTraining04Scene();
  } else if (variant === "curve_training_05_velocity_graphs") {
    drawCurveTraining05Scene();
  } else if (variant === "curve_training_06_projectile_incline_scale") {
    drawCurveTraining06Scene();
  } else if (variant === "curve_training_07_projectile_wall_angles") {
    drawCurveTraining07Scene();
  } else if (variant === "curve_training_08_bombs_on_slope") {
    drawCurveTraining08Scene();
  } else if (variant === "curve_training_09_wind_tunnel_force") {
    drawCurveTraining09Scene();
  } else if (variant === "curve_training_10_tangent_rope_circle") {
    drawCurveTraining10Scene();
  } else if (variant === "curve_training_11_two_boats") {
    drawCurveTraining11Scene();
  } else if (variant === "curve_training_12_pulley_linkage") {
    drawCurveTraining12Scene();
  } else if (variant === "curve_training_13_banked_railway") {
    drawCurveTraining13Scene();
  } else if (variant === "curve_training_14_valve_light") {
    drawCurveTraining14Scene();
  } else if (variant === "curve_training_15_two_blocks_disk") {
    drawCurveTraining15Scene();
  } else if (variant === "curve_training_16_rope_wrap_prism") {
    drawCurveTraining16Scene();
  }
}

function drawCurveTrainingModelGraph() {
  var variant = curveTrainingVariant();
  if (variant === "curve_training_01_concepts") {
    drawCurveTraining01Graph();
  } else if (variant === "curve_training_02_nonuniform_river") {
    drawCurveTraining02Graph();
  } else if (variant === "curve_training_03_accelerating_bomber") {
    drawCurveTraining03Graph();
  } else if (variant === "curve_training_04_formation_turn") {
    drawCurveTraining04Graph();
  } else if (variant === "curve_training_05_velocity_graphs") {
    drawCurveTraining05Graph();
  } else if (variant === "curve_training_06_projectile_incline_scale") {
    drawCurveTraining06Graph();
  } else if (variant === "curve_training_07_projectile_wall_angles") {
    drawCurveTraining07Graph();
  } else if (variant === "curve_training_08_bombs_on_slope") {
    drawCurveTraining08Graph();
  } else if (variant === "curve_training_09_wind_tunnel_force") {
    drawCurveTraining09Graph();
  } else if (variant === "curve_training_10_tangent_rope_circle") {
    drawCurveTraining10Graph();
  } else if (variant === "curve_training_11_two_boats") {
    drawCurveTraining11Graph();
  } else if (variant === "curve_training_12_pulley_linkage") {
    drawCurveTraining12Graph();
  } else if (variant === "curve_training_13_banked_railway") {
    drawCurveTraining13Graph();
  } else if (variant === "curve_training_14_valve_light") {
    drawCurveTraining14Graph();
  } else if (variant === "curve_training_15_two_blocks_disk") {
    drawCurveTraining15Graph();
  } else if (variant === "curve_training_16_rope_wrap_prism") {
    drawCurveTraining16Graph();
  }
}

function drawCurveTraining01Scene() {
  var speed = getJsonParam(currentScene, "speed", 5);
  var radius = getJsonParam(currentScene, "radius", 4);
  var progress = curveTrainingProgress();
  var cx = 275;
  var cy = 285;
  var rr = 128;
  var angle = lerp(-2.55, 0.35, progress);
  curveTrainingTitle("速度沿切线，加速度指向凹侧", "速率不变时，速度方向仍持续改变");
  noFill();
  stroke("#cbd5e1");
  strokeWeight(18);
  arc(cx, cy, rr * 2, rr * 2, -2.7, 0.5);
  stroke("#2563eb");
  strokeWeight(4);
  arc(cx, cy, rr * 2, rr * 2, -2.7, angle);
  var x = cx + rr * Math.cos(angle);
  var y = cy + rr * Math.sin(angle);
  noStroke();
  fill("#dc2626");
  circle(x, y, 22);
  var tangent = angle + Math.PI / 2;
  drawArrow(x, y, x + 72 * Math.cos(tangent), y + 72 * Math.sin(tangent), "#2563eb");
  drawArrow(x, y, x + 72 * Math.cos(angle + Math.PI), y + 72 * Math.sin(angle + Math.PI), "#dc2626");
  noStroke();
  fill("#1d4ed8");
  textSize(14);
  textAlign(LEFT, CENTER);
  text("速度 v", x + 78 * Math.cos(tangent), y + 78 * Math.sin(tangent));
  fill("#b91c1c");
  text("法向加速度", x + 76 * Math.cos(angle + Math.PI), y + 76 * Math.sin(angle + Math.PI));
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("v = " + speed.toFixed(1) + " m/s", 32, 420);
  text("aₙ = v²/R = " + (speed * speed / radius).toFixed(2) + " m/s²", 32, 444);
}

function drawCurveTraining01Graph() {
  var speed = getJsonParam(currentScene, "speed", 5);
  var radius = Math.max(0.1, getJsonParam(currentScene, "radius", 4));
  var duration = getJsonDuration(currentScene);
  var tNow = curveTrainingProgress() * duration;
  var a = speed * speed / radius;
  var frame = curveTrainingGraphBegin("速度方向与法向加速度", "蓝线：速度方向角；红线：法向加速度（归一化）");
  curveTrainingPlot(frame, 0, duration, 0, 1.1, "#2563eb", function (t) { return t / duration; });
  curveTrainingPlot(frame, 0, duration, 0, 1.1, "#dc2626", function () { return 0.72; });
  curveTrainingMarker(frame, tNow, tNow / duration, 0, duration, 0, 1.1, "#2563eb");
  curveTrainingGraphLabels(frame, "时间 t", "归一化量");
  curveTrainingLegend(frame.x + 10, frame.y + 18, "#2563eb", "方向持续变化");
  curveTrainingLegend(frame.x + 180, frame.y + 18, "#dc2626", "aₙ=" + a.toFixed(2));
  curveTrainingGraphEnd();
}

function curveTrainingRiverDrift(yNorm, base, peak, boatSpeed) {
  var integral = base * yNorm + peak * (yNorm / 2 - Math.sin(2 * Math.PI * yNorm) / (4 * Math.PI));
  return integral / Math.max(0.1, boatSpeed);
}

function drawCurveTraining02Scene() {
  var boatSpeed = getJsonParam(currentScene, "boatSpeed", 4);
  var base = getJsonParam(currentScene, "flowBase", 1);
  var peak = getJsonParam(currentScene, "flowPeak", 4);
  var pNow = curveTrainingProgress();
  var left = 72;
  var right = 500;
  var top = 82;
  var bottom = 420;
  curveTrainingTitle("非均匀水流渡河", "轨迹局部斜率 = 水速 / 静水船速");
  noStroke();
  fill("#eff6ff");
  rect(left, top, right - left, bottom - top);
  stroke("#64748b");
  strokeWeight(3);
  line(left, top, right, top);
  line(left, bottom, right, bottom);
  for (var i = 0; i <= 6; i += 1) {
    var yn = i / 6;
    var yy = lerp(bottom - 18, top + 18, yn);
    var u = base + peak * Math.pow(Math.sin(Math.PI * yn), 2);
    drawArrow(left + 18, yy, left + 18 + u * 23, yy, "#60a5fa");
  }
  noFill();
  stroke("#2563eb");
  strokeWeight(3);
  beginShape();
  for (i = 0; i <= 100; i += 1) {
    yn = i / 100;
    var drift = curveTrainingRiverDrift(yn, base, peak, boatSpeed);
    vertex(left + 82 + drift * 105, lerp(bottom - 12, top + 12, yn));
  }
  endShape();
  var bx = left + 82 + curveTrainingRiverDrift(pNow, base, peak, boatSpeed) * 105;
  var by = lerp(bottom - 12, top + 12, pNow);
  push();
  translate(bx, by);
  rotate(-Math.PI / 2);
  noStroke();
  fill("#f59e0b");
  triangle(15, 0, -12, -10, -12, 10);
  pop();
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("M", left + 54, bottom - 2);
  text("N", right - 28, top + 5);
}

function drawCurveTraining02Graph() {
  var base = getJsonParam(currentScene, "flowBase", 1);
  var peak = getJsonParam(currentScene, "flowPeak", 4);
  var pNow = curveTrainingProgress();
  var yMax = base + peak + 0.5;
  var frame = curveTrainingGraphBegin("横向位置—水速图", "水速在河道中部达到最大值");
  curveTrainingPlot(frame, 0, 1, 0, yMax, "#2563eb", function (y) {
    return base + peak * Math.pow(Math.sin(Math.PI * y), 2);
  });
  curveTrainingMarker(frame, pNow, base + peak * Math.pow(Math.sin(Math.PI * pNow), 2), 0, 1, 0, yMax, "#dc2626");
  curveTrainingGraphLabels(frame, "M → N 的归一化位置", "水速 u");
  curveTrainingGraphEnd();
}

function drawCurveTraining03Scene() {
  var a = getJsonParam(currentScene, "planeA", 3);
  var interval = getJsonParam(currentScene, "interval", 0.7);
  var g = getJsonParam(currentScene, "g", 10);
  var duration = getJsonDuration(currentScene);
  var time = curveTrainingProgress() * duration;
  var planeX = 492;
  var planeY = 84;
  var scale = 13;
  curveTrainingTitle("加速飞机连续投弹", "同一时刻：水平落后量和竖直下落量都正比于释放时长平方");
  noStroke();
  fill("#dbeafe");
  ellipse(planeX - 20, planeY, 58, 20);
  fill("#2563eb");
  triangle(planeX - 2, planeY, planeX - 40, planeY - 20, planeX - 34, planeY + 2);
  for (var i = 1; i <= 5; i += 1) {
    var age = time - i * interval;
    if (age < 0) {
      continue;
    }
    var dx = 0.5 * a * age * age * scale;
    var dy = 0.5 * g * age * age * scale;
    var x = planeX - dx;
    var y = planeY + dy;
    if (x < 38 || y > 445) {
      continue;
    }
    noStroke();
    fill("#dc2626");
    circle(x, y, 14);
  }
  curveTrainingDashedLine(planeX, planeY, planeX - 230, planeY + 230 * g / Math.max(0.1, a), "#64748b");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("Δx = ½aτ²", 44, 400);
  text("y = ½gτ²", 44, 426);
}

function drawCurveTraining03Graph() {
  var a = getJsonParam(currentScene, "planeA", 3);
  var g = getJsonParam(currentScene, "g", 10);
  var duration = getJsonDuration(currentScene);
  var tau = curveTrainingProgress() * duration * 0.75;
  var maxX = Math.max(1, 0.5 * a * Math.pow(duration * 0.75, 2));
  var maxY = Math.max(1, 0.5 * g * Math.pow(duration * 0.75, 2));
  var frame = curveTrainingGraphBegin("炸弹相对飞机的位置", "消去释放时长后得到直线 y=(g/a)Δx");
  curveTrainingPlot(frame, 0, maxX, 0, maxY, "#2563eb", function (x) { return g * x / Math.max(0.1, a); });
  curveTrainingMarker(frame, 0.5 * a * tau * tau, 0.5 * g * tau * tau, 0, maxX, 0, maxY, "#dc2626");
  curveTrainingGraphLabels(frame, "水平落后量 Δx", "竖直下落量 y");
  curveTrainingGraphEnd();
}

function drawCurveTraining04Scene() {
  var omega = getJsonParam(currentScene, "omega", 0.8);
  var innerR = getJsonParam(currentScene, "innerR", 2.5);
  var spacing = getJsonParam(currentScene, "spacing", 0.7);
  var time = curveTrainingProgress() * getJsonDuration(currentScene);
  var cx = 155;
  var cy = 380;
  var scale = 48;
  var angle = -1.25 + omega * time * 0.35;
  curveTrainingTitle("方阵保持整齐通过圆弧", "所有同学角速度相同，外侧线速度更大");
  noFill();
  stroke("#d1d5db");
  strokeWeight(2);
  for (var row = 0; row < 4; row += 1) {
    var r = (innerR + row * spacing) * scale;
    arc(cx, cy, 2 * r, 2 * r, -1.85, -0.05);
  }
  for (row = 0; row < 4; row += 1) {
    r = (innerR + row * spacing) * scale;
    for (var col = 0; col < 4; col += 1) {
      var aa = angle + (col - 1.5) * 0.11;
      var x = cx + r * Math.cos(aa);
      var y = cy + r * Math.sin(aa);
      noStroke();
      fill(row === 3 ? "#dc2626" : "#2563eb");
      circle(x, y, 12);
    }
  }
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("共同角位移 Δθ", 34, 420);
  text("v = ωr，aₙ = ω²r", 34, 445);
}

function drawCurveTraining04Graph() {
  var omega = getJsonParam(currentScene, "omega", 0.8);
  var innerR = getJsonParam(currentScene, "innerR", 2.5);
  var spacing = getJsonParam(currentScene, "spacing", 0.7);
  var maxR = innerR + 3 * spacing;
  var maxY = Math.max(1, Math.max(omega * maxR, omega * omega * maxR) * 1.18);
  var frame = curveTrainingGraphBegin("半径决定线速度与向心加速度", "同一方阵内 ω 相同，v 与 aₙ 都随 r 线性增加");
  curveTrainingPlot(frame, 0, maxR, 0, maxY, "#2563eb", function (r) { return omega * r; });
  curveTrainingPlot(frame, 0, maxR, 0, maxY, "#dc2626", function (r) { return omega * omega * r; });
  curveTrainingGraphLabels(frame, "半径 r", "v / aₙ");
  curveTrainingLegend(frame.x + 12, frame.y + 18, "#2563eb", "v=ωr");
  curveTrainingLegend(frame.x + 150, frame.y + 18, "#dc2626", "aₙ=ω²r");
  curveTrainingGraphEnd();
}

function curveTraining05Velocity(t, switchT, vx0) {
  var total = 2 * switchT;
  if (t <= switchT) {
    return {
      vx: vx0 + (1 - vx0) * t / switchT,
      vy: 4 * t / switchT
    };
  }
  return {
    vx: 1,
    vy: 4 * (total - t) / switchT
  };
}

function curveTraining05Position(t, switchT, vx0) {
  if (t <= switchT) {
    return {
      x: vx0 * t + 0.5 * (1 - vx0) * t * t / switchT,
      y: 2 * t * t / switchT
    };
  }
  var dt = t - switchT;
  var xSwitch = 0.5 * (vx0 + 1) * switchT;
  var ySwitch = 2 * switchT;
  return {
    x: xSwitch + dt,
    y: ySwitch + 4 * dt - 2 * dt * dt / switchT
  };
}

function drawCurveTraining05Scene() {
  var vx0 = getJsonParam(currentScene, "vx0", 3);
  var switchT = getJsonParam(currentScene, "switchT", 4);
  var total = 2 * switchT;
  var tNow = curveTrainingProgress() * total;
  var finalPos = curveTraining05Position(total, switchT, vx0);
  var scaleX = 390 / Math.max(1, finalPos.x);
  var maxY = curveTraining05Position(1.5 * switchT, switchT, vx0).y;
  var scaleY = 260 / Math.max(1, maxY);
  curveTrainingTitle("由 vₓ-t、vᵧ-t 图像重建轨迹", "速度分量分段线性，轨迹由积分得到");
  noFill();
  stroke("#2563eb");
  strokeWeight(3);
  beginShape();
  for (var i = 0; i <= 150; i += 1) {
    var t = total * i / 150;
    var pos = curveTraining05Position(t, switchT, vx0);
    vertex(80 + pos.x * scaleX, 390 - pos.y * scaleY);
  }
  endShape();
  var now = curveTraining05Position(tNow, switchT, vx0);
  var vel = curveTraining05Velocity(tNow, switchT, vx0);
  var x = 80 + now.x * scaleX;
  var y = 390 - now.y * scaleY;
  noStroke();
  fill("#dc2626");
  circle(x, y, 18);
  drawArrow(x, y, x + vel.vx * 18, y - vel.vy * 18, "#0f766e");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("t = " + tNow.toFixed(2) + " s", 32, 430);
  text("v = (" + vel.vx.toFixed(2) + ", " + vel.vy.toFixed(2) + ") m/s", 180, 430);
}

function drawCurveTraining05Graph() {
  var vx0 = getJsonParam(currentScene, "vx0", 3);
  var switchT = getJsonParam(currentScene, "switchT", 4);
  var total = 2 * switchT;
  var tNow = curveTrainingProgress() * total;
  var frame = curveTrainingGraphBegin("分速度—时间图", "蓝线 vₓ；红线 vᵧ");
  curveTrainingPlot(frame, 0, total, 0, Math.max(4.5, vx0 + 0.5), "#2563eb", function (t) {
    return curveTraining05Velocity(t, switchT, vx0).vx;
  });
  curveTrainingPlot(frame, 0, total, 0, Math.max(4.5, vx0 + 0.5), "#dc2626", function (t) {
    return curveTraining05Velocity(t, switchT, vx0).vy;
  });
  var vel = curveTraining05Velocity(tNow, switchT, vx0);
  curveTrainingMarker(frame, tNow, vel.vx, 0, total, 0, Math.max(4.5, vx0 + 0.5), "#2563eb");
  curveTrainingMarker(frame, tNow, vel.vy, 0, total, 0, Math.max(4.5, vx0 + 0.5), "#dc2626");
  curveTrainingGraphLabels(frame, "时间 t / s", "速度 / (m·s⁻¹)");
  curveTrainingGraphEnd();
}

function curveTraining06Flight(v, theta, g) {
  return 2 * v * Math.tan(theta) / Math.max(0.1, g);
}

function drawCurveTraining06Scene() {
  var v0 = getJsonParam(currentScene, "v0", 8);
  var theta = getJsonParam(currentScene, "theta", 30) * Math.PI / 180;
  var g = getJsonParam(currentScene, "g", 10);
  var t1 = curveTraining06Flight(v0, theta, g);
  var t2 = curveTraining06Flight(2 * v0, theta, g);
  var maxX = 2 * v0 * t2;
  var scale = Math.min(390 / Math.max(1, maxX), 250 / Math.max(1, maxX * Math.tan(theta)));
  var ox = 500;
  var oy = 92;
  var pNow = curveTrainingProgress();
  curveTrainingTitle("同一斜面上的两次平抛", "初速度加倍：时间 ×2，沿斜面距离 ×4，末速度夹角不变");
  stroke("#64748b");
  strokeWeight(4);
  line(ox, oy, ox - maxX * scale, oy + maxX * Math.tan(theta) * scale);
  var speeds = [v0, 2 * v0];
  var colors = ["#2563eb", "#dc2626"];
  for (var k = 0; k < 2; k += 1) {
    var vf = speeds[k];
    var tf = curveTraining06Flight(vf, theta, g);
    noFill();
    stroke(colors[k]);
    strokeWeight(3);
    beginShape();
    for (var i = 0; i <= 80; i += 1) {
      var t = tf * i / 80;
      var xx = vf * t;
      var yy = 0.5 * g * t * t;
      vertex(ox - xx * scale, oy + yy * scale);
    }
    endShape();
    t = tf * pNow;
    xx = vf * t;
    yy = 0.5 * g * t * t;
    noStroke();
    fill(colors[k]);
    circle(ox - xx * scale, oy + yy * scale, 15);
  }
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("蓝：v₀", 38, 410);
  text("红：2v₀", 138, 410);
  text("vᵧ/vₓ = 2tanθ", 270, 410);
}

function drawCurveTraining06Graph() {
  var theta = getJsonParam(currentScene, "theta", 30) * Math.PI / 180;
  var frame = curveTrainingGraphBegin("速度倍率—结果倍率", "蓝线：沿斜面距离倍率 λ²；红线：末速度方向比 2tanθ");
  var alphaValue = Math.min(4, 2 * Math.tan(theta));
  curveTrainingPlot(frame, 0, 2.2, 0, 5, "#2563eb", function (lambda) { return lambda * lambda; });
  curveTrainingPlot(frame, 0, 2.2, 0, 5, "#dc2626", function () { return alphaValue; });
  curveTrainingMarker(frame, 2, 4, 0, 2.2, 0, 5, "#2563eb");
  curveTrainingGraphLabels(frame, "初速度倍率 λ", "结果量");
  curveTrainingGraphEnd();
}

function curveTraining07Data(beta, wallDistance, g) {
  var radians = beta * Math.PI / 180;
  var v0 = Math.sqrt(g * wallDistance * Math.tan(radians));
  var time = wallDistance / v0;
  var y = 0.5 * g * time * time;
  var impact = Math.sqrt(v0 * v0 + Math.pow(g * time, 2));
  return { beta: beta, v0: v0, time: time, y: y, impact: impact };
}

function drawCurveTraining07Scene() {
  var wallDistance = getJsonParam(currentScene, "wallDistance", 12);
  var g = getJsonParam(currentScene, "g", 10);
  var betas = [60, 45, 30];
  var colors = ["#2563eb", "#0f766e", "#dc2626"];
  var labels = ["a", "b", "c"];
  var originX = 78;
  var originY = 106;
  var wallX = 492;
  var scaleX = (wallX - originX) / wallDistance;
  var maxY = curveTraining07Data(30, wallDistance, g).y;
  var scaleY = 300 / Math.max(1, maxY);
  var pNow = curveTrainingProgress();
  curveTrainingTitle("三球平抛撞同一竖直墙", "末速度反向延长线共过发射点与墙之间的水平中点");
  stroke("#475569");
  strokeWeight(5);
  line(wallX, 74, wallX, 440);
  for (var k = 0; k < 3; k += 1) {
    var data = curveTraining07Data(betas[k], wallDistance, g);
    noFill();
    stroke(colors[k]);
    strokeWeight(2.5);
    beginShape();
    for (var i = 0; i <= 80; i += 1) {
      var t = data.time * i / 80;
      vertex(originX + data.v0 * t * scaleX, originY + 0.5 * g * t * t * scaleY);
    }
    endShape();
    t = data.time * pNow;
    var x = originX + data.v0 * t * scaleX;
    var y = originY + 0.5 * g * t * t * scaleY;
    noStroke();
    fill(colors[k]);
    circle(x, y, 13);
    var impactY = originY + data.y * scaleY;
    noStroke();
    fill("#111827");
    textAlign(LEFT, CENTER);
    textSize(13);
    text(labels[k], wallX + 9, impactY);
    if (pNow > 0.96) {
      curveTrainingDashedLine(wallX, impactY, (originX + wallX) / 2, originY, colors[k]);
    }
  }
  noStroke();
  fill("#f59e0b");
  circle((originX + wallX) / 2, originY, 12);
  fill("#334155");
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text("公共点", (originX + wallX) / 2, originY - 10);
}

function drawCurveTraining07Graph() {
  var wallDistance = getJsonParam(currentScene, "wallDistance", 12);
  var g = getJsonParam(currentScene, "g", 10);
  var yMax = curveTraining07Data(25, wallDistance, g).impact * 1.2;
  var frame = curveTrainingGraphBegin("撞墙角—末速度图", "在 β=45° 时末速度最小，30° 与60°速度相等");
  curveTrainingPlot(frame, 25, 65, 0, yMax, "#2563eb", function (beta) {
    return curveTraining07Data(beta, wallDistance, g).impact;
  });
  [30, 45, 60].forEach(function (beta) {
    curveTrainingMarker(frame, beta, curveTraining07Data(beta, wallDistance, g).impact, 25, 65, 0, yMax, beta === 45 ? "#0f766e" : "#dc2626");
  });
  curveTrainingGraphLabels(frame, "速度与竖直墙夹角 β", "撞墙速度 v");
  curveTrainingGraphEnd();
}

function drawCurveTraining08Scene() {
  var slope = getJsonParam(currentScene, "slope", 24) * Math.PI / 180;
  var pNow = curveTrainingProgress();
  var startX = 110;
  var baseY = 424;
  var span = 360;
  var rise = span * Math.tan(slope);
  curveTrainingTitle("匀速飞机投弹落斜坡", "B 是 AC 中点，因此三次落地事件等时间间隔");
  stroke("#64748b");
  strokeWeight(5);
  line(startX, baseY, startX + span, baseY - rise);
  var fractions = [0.18, 0.5, 0.82];
  var colors = ["#2563eb", "#0f766e", "#dc2626"];
  var labels = ["A", "B", "C"];
  for (var i = 0; i < 3; i += 1) {
    var landX = startX + fractions[i] * span;
    var landY = baseY - fractions[i] * rise;
    var launchY = 104;
    var event = 0.42 + i * 0.2;
    var local = constrain((pNow - (event - 0.38)) / 0.38, 0, 1);
    var launchX = landX - 150;
    var x = lerp(launchX, landX, local);
    var y = launchY + (landY - launchY) * local * local;
    noFill();
    stroke(colors[i]);
    strokeWeight(2);
    beginShape();
    for (var j = 0; j <= 50; j += 1) {
      var q = j / 50;
      vertex(lerp(launchX, landX, q), launchY + (landY - launchY) * q * q);
    }
    endShape();
    noStroke();
    fill(colors[i]);
    circle(x, y, 14);
    fill("#111827");
    textAlign(CENTER, TOP);
    textSize(13);
    text(labels[i], landX, landY + 8);
  }
  var planeX = 90 + pNow * 410;
  noStroke();
  fill("#dbeafe");
  ellipse(planeX, 82, 52, 18);
  fill("#2563eb");
  triangle(planeX + 18, 82, planeX - 18, 66, planeX - 10, 84);
}

function drawCurveTraining08Graph() {
  var frame = curveTrainingGraphBegin("落地点水平位置—落地时刻", "A、B、C 水平投影等距，落地时刻在线性关系上等距");
  curveTrainingPlot(frame, 0, 1, 0, 1, "#2563eb", function (x) { return 0.1 + 0.8 * x; });
  [0.18, 0.5, 0.82].forEach(function (x, index) {
    curveTrainingMarker(frame, x, 0.1 + 0.8 * x, 0, 1, 0, 1, ["#2563eb", "#0f766e", "#dc2626"][index]);
  });
  curveTrainingGraphLabels(frame, "落地点水平坐标 x", "落地时刻 t");
  curveTrainingGraphEnd();
}

function curveTraining09Motion() {
  var speed = getJsonParam(currentScene, "speed", 8.66);
  var angle = getJsonParam(currentScene, "angle", 30) * Math.PI / 180;
  var distance = getJsonParam(currentScene, "distance", 7.5);
  var time = distance / Math.max(0.1, speed * Math.cos(angle));
  var vA = { x: speed, y: 0 };
  var vB = { x: speed * Math.cos(2 * angle), y: -speed * Math.sin(2 * angle) };
  return {
    speed: speed,
    angle: angle,
    distance: distance,
    time: time,
    vA: vA,
    vB: vB,
    ax: (vB.x - vA.x) / time,
    ay: (vB.y - vA.y) / time
  };
}

function drawCurveTraining09Scene() {
  var motion = curveTraining09Motion();
  var pNow = curveTrainingProgress();
  var tNow = motion.time * pNow;
  var scale = 390 / Math.max(1, motion.distance * Math.cos(motion.angle));
  var ax = 72;
  var ay = 102;
  curveTrainingTitle("风洞恒力曲线运动", "先用速度的和求时间，再用速度的差求合加速度");
  noFill();
  stroke("#2563eb");
  strokeWeight(3);
  beginShape();
  for (var i = 0; i <= 100; i += 1) {
    var t = motion.time * i / 100;
    var px = motion.vA.x * t + 0.5 * motion.ax * t * t;
    var py = motion.vA.y * t + 0.5 * motion.ay * t * t;
    vertex(ax + px * scale, ay - py * scale);
  }
  endShape();
  var xNow = motion.vA.x * tNow + 0.5 * motion.ax * tNow * tNow;
  var yNow = motion.vA.y * tNow + 0.5 * motion.ay * tNow * tNow;
  noStroke();
  fill("#dc2626");
  circle(ax + xNow * scale, ay - yNow * scale, 17);
  var bx = ax + motion.distance * Math.cos(motion.angle) * scale;
  var by = ay + motion.distance * Math.sin(motion.angle) * scale;
  noStroke();
  fill("#111827");
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text("A", ax, ay - 10);
  textAlign(CENTER, TOP);
  text("B", bx, by + 8);
  drawArrow(ax, ay, ax + 92, ay, "#0f766e");
  drawArrow(bx, by, bx + 92 * Math.cos(2 * motion.angle), by + 92 * Math.sin(2 * motion.angle), "#0f766e");
  var windAx = motion.ax;
  var windAy = motion.ay + 10;
  var windMag = Math.max(0.1, Math.sqrt(windAx * windAx + windAy * windAy));
  drawArrow(272, 410, 272 + 72 * windAx / windMag, 410 - 72 * windAy / windMag, "#dc2626");
  noStroke();
  fill("#b91c1c");
  textAlign(LEFT, CENTER);
  textSize(14);
  text("风力 F", 282 + 72 * windAx / windMag, 410 - 72 * windAy / windMag);
}

function drawCurveTraining09Graph() {
  var motion = curveTraining09Motion();
  var tNow = curveTrainingProgress() * motion.time;
  var yMin = Math.min(motion.vB.y, 0) - 1;
  var yMax = Math.max(motion.vA.x, motion.vB.x) + 1;
  var frame = curveTrainingGraphBegin("速度分量—时间图", "蓝线 vₓ；红线 vᵧ，恒力使两分量线性变化");
  curveTrainingPlot(frame, 0, motion.time, yMin, yMax, "#2563eb", function (t) { return motion.vA.x + motion.ax * t; });
  curveTrainingPlot(frame, 0, motion.time, yMin, yMax, "#dc2626", function (t) { return motion.ay * t; });
  curveTrainingMarker(frame, tNow, motion.vA.x + motion.ax * tNow, 0, motion.time, yMin, yMax, "#2563eb");
  curveTrainingMarker(frame, tNow, motion.ay * tNow, 0, motion.time, yMin, yMax, "#dc2626");
  curveTrainingGraphLabels(frame, "时间 t", "速度分量");
  curveTrainingGraphEnd();
}

function drawCurveTraining10Scene() {
  var omega = getJsonParam(currentScene, "omega", 1.8);
  var r = getJsonParam(currentScene, "r", 1.2);
  var rope = getJsonParam(currentScene, "rope", 2);
  var time = curveTrainingProgress() * getJsonDuration(currentScene);
  var totalR = Math.sqrt(r * r + rope * rope);
  var scale = 150 / Math.max(0.1, totalR);
  var cx = 275;
  var cy = 270;
  var angle = -1.2 + omega * time * 0.45;
  var handX = cx + r * scale * Math.cos(angle);
  var handY = cy + r * scale * Math.sin(angle);
  var sliderAngle = angle + Math.atan2(rope, r);
  var sliderX = cx + totalR * scale * Math.cos(sliderAngle);
  var sliderY = cy + totalR * scale * Math.sin(sliderAngle);
  curveTrainingTitle("切线轻绳双圆运动", "固定直角三角形整体转动，手端与滑块角速度相同");
  noFill();
  stroke("#cbd5e1");
  strokeWeight(2);
  circle(cx, cy, 2 * r * scale);
  circle(cx, cy, 2 * totalR * scale);
  stroke("#f59e0b");
  strokeWeight(4);
  line(handX, handY, sliderX, sliderY);
  noStroke();
  fill("#2563eb");
  circle(handX, handY, 18);
  fill("#dc2626");
  rectMode(CENTER);
  rect(sliderX, sliderY, 24, 20, 4);
  rectMode(CORNER);
  fill("#111827");
  circle(cx, cy, 8);
  drawArrow(sliderX, sliderY, lerp(sliderX, handX, 0.42), lerp(sliderY, handY, 0.42), "#f59e0b");
  var tangentAngle = sliderAngle + Math.PI / 2;
  drawArrow(sliderX, sliderY, sliderX - 58 * Math.cos(tangentAngle), sliderY - 58 * Math.sin(tangentAngle), "#0f766e");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("R = √(r²+L²) = " + totalR.toFixed(2) + " m", 34, 425);
  text("v滑 = ωR = " + (omega * totalR).toFixed(2) + " m/s", 34, 450);
}

function drawCurveTraining10Graph() {
  var omega = getJsonParam(currentScene, "omega", 1.8);
  var r = getJsonParam(currentScene, "r", 1.2);
  var rope = Math.max(0.1, getJsonParam(currentScene, "rope", 2));
  var g = 10;
  var omegaMax = Math.max(3.5, omega * 1.25);
  var factor = r * Math.sqrt(r * r + rope * rope) / (g * rope);
  var yMax = factor * omegaMax * omegaMax * 1.15;
  var frame = curveTrainingGraphBegin("角速度—所需动摩擦因数", "μ 与 ω² 成正比；几何因子由 r、L 决定");
  curveTrainingPlot(frame, 0, omegaMax, 0, yMax, "#dc2626", function (w) { return factor * w * w; });
  curveTrainingMarker(frame, omega, factor * omega * omega, 0, omegaMax, 0, yMax, "#2563eb");
  curveTrainingGraphLabels(frame, "角速度 ω", "动摩擦因数 μ");
  curveTrainingGraphEnd();
}

function drawCurveTraining11Scene() {
  var alpha = getJsonParam(currentScene, "alpha", 55) * Math.PI / 180;
  var pNow = curveTrainingProgress();
  var left = 62;
  var right = 514;
  var top = 84;
  var bottom = 422;
  var widthPx = bottom - top;
  var sep = Math.min(180, widthPx / Math.tan(alpha));
  var mx = 150;
  var nx = mx + sep;
  var y = lerp(bottom, top, pNow);
  var boat1X = mx + 2 * sep * pNow;
  var boat2X = nx;
  curveTrainingTitle("两船渡河相遇", "垂直分速度相同；甲的沿岸合速度是乙的两倍偏航分量");
  noStroke();
  fill("#eff6ff");
  rect(left, top, right - left, bottom - top);
  stroke("#64748b");
  strokeWeight(3);
  line(left, top, right, top);
  line(left, bottom, right, bottom);
  curveTrainingDashedLine(nx, bottom, nx, top, "#64748b");
  curveTrainingDashedLine(mx, bottom, nx, top, "#94a3b8");
  noStroke();
  fill("#2563eb");
  triangle(boat1X, y - 14, boat1X - 12, y + 12, boat1X + 12, y + 12);
  fill("#dc2626");
  triangle(boat2X, y - 14, boat2X - 12, y + 12, boat2X + 12, y + 12);
  fill("#334155");
  textAlign(CENTER, TOP);
  textSize(13);
  text("M", mx, bottom + 8);
  text("N", nx, bottom + 8);
  textAlign(CENTER, BOTTOM);
  text("P", nx, top - 7);
  if (Math.abs(pNow - 0.5) < 0.035) {
    noFill();
    stroke("#f59e0b");
    strokeWeight(4);
    circle(nx, (top + bottom) / 2, 38);
  }
}

function drawCurveTraining11Graph() {
  var frame = curveTrainingGraphBegin("渡河进度—沿岸位置", "甲、乙位置曲线在半程相交");
  curveTrainingPlot(frame, 0, 1, 0, 2.1, "#2563eb", function (q) { return 2 * q; });
  curveTrainingPlot(frame, 0, 1, 0, 2.1, "#dc2626", function () { return 1; });
  var pNow = curveTrainingProgress();
  curveTrainingMarker(frame, pNow, 2 * pNow, 0, 1, 0, 2.1, "#2563eb");
  curveTrainingMarker(frame, pNow, 1, 0, 1, 0, 2.1, "#dc2626");
  curveTrainingGraphLabels(frame, "渡河进度 y/d", "沿岸位置 / MN");
  curveTrainingLegend(frame.x + 12, frame.y + 18, "#2563eb", "甲船");
  curveTrainingLegend(frame.x + 130, frame.y + 18, "#dc2626", "乙船");
  curveTrainingGraphEnd();
}

function drawCurveTraining12Scene() {
  var alphaTarget = getJsonParam(currentScene, "alpha", 53) * Math.PI / 180;
  var speedA = getJsonParam(currentScene, "speedA", 3);
  var mu = getJsonParam(currentScene, "mu", 0.2);
  var pNow = curveTrainingProgress();
  var alpha = alphaTarget + (1 - pNow) * 8 * Math.PI / 180;
  var pulleyX = 172;
  var pulleyY = 104;
  var floorY = 390;
  var blockY = floorY - 26;
  var vertical = blockY - pulleyY;
  var blockX = pulleyX + vertical / Math.tan(alpha);
  var massAY = 210 - pNow * 70;
  curveTrainingTitle("滑轮连接体关联速度", "不可伸长绳：B 沿斜绳方向的速度分量等于 A 端速度");
  stroke("#475569");
  strokeWeight(4);
  line(46, floorY, 520, floorY);
  noFill();
  stroke("#64748b");
  circle(pulleyX, pulleyY, 42);
  stroke("#f59e0b");
  strokeWeight(3);
  line(pulleyX - 21, pulleyY, pulleyX - 21, massAY);
  line(pulleyX + 18, pulleyY + 10, blockX, blockY);
  noStroke();
  fill("#2563eb");
  rect(pulleyX - 42, massAY, 42, 48, 5);
  fill("#dc2626");
  rect(blockX - 34, blockY, 68, 52, 6);
  drawArrow(blockX, blockY + 26, blockX + 62, blockY + 26, "#2563eb");
  drawArrow(pulleyX - 21, massAY + 24, pulleyX - 21, massAY - 35, "#0f766e");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("vB = vA/cosα = " + (speedA / Math.cos(alpha)).toFixed(2) + " m/s", 32, 425);
  text("f = μ(30−20sinα) = " + (mu * (30 - 20 * Math.sin(alpha))).toFixed(2) + " N", 32, 450);
}

function drawCurveTraining12Graph() {
  var speedA = getJsonParam(currentScene, "speedA", 3);
  var alpha = getJsonParam(currentScene, "alpha", 53);
  var yMax = speedA / Math.cos(70 * Math.PI / 180) * 1.1;
  var frame = curveTrainingGraphBegin("斜绳角度—B 速度", "A 端匀速时，α 越大，B 的速度越大");
  curveTrainingPlot(frame, 30, 72, 0, yMax, "#2563eb", function (degree) {
    return speedA / Math.cos(degree * Math.PI / 180);
  });
  curveTrainingMarker(frame, alpha, speedA / Math.cos(alpha * Math.PI / 180), 30, 72, 0, yMax, "#dc2626");
  curveTrainingGraphLabels(frame, "斜绳角度 α", "B 速度 vB");
  curveTrainingGraphEnd();
}

function drawCurveTraining13Scene() {
  var design = getJsonParam(currentScene, "designSpeed", 20);
  var speed = getJsonParam(currentScene, "speed", 24);
  var theta = getJsonParam(currentScene, "theta", 12) * Math.PI / 180;
  var cx = 285;
  var cy = 320;
  var half = 190;
  var dx = half * Math.cos(theta);
  var dy = half * Math.sin(theta);
  var carX = cx;
  var carY = cy - 28;
  curveTrainingTitle("铁路倾斜弯道受力", "设计速度时无侧向压力；实际速度偏大时外轨补充向内作用");
  stroke("#64748b");
  strokeWeight(7);
  line(cx - dx, cy + dy, cx + dx, cy - dy);
  push();
  translate(carX, carY);
  rotate(-theta);
  noStroke();
  fill("#2563eb");
  rectMode(CENTER);
  rect(0, 0, 98, 48, 8);
  fill("#dbeafe");
  rect(0, -8, 54, 20, 5);
  rectMode(CORNER);
  pop();
  drawArrow(carX, carY, carX, carY + 95, "#dc2626");
  drawArrow(carX, carY, carX - 85 * Math.sin(theta), carY - 85 * Math.cos(theta), "#2563eb");
  if (Math.abs(speed - design) > 0.2) {
    var direction = speed > design ? -1 : 1;
    drawArrow(carX, carY, carX + direction * 94 * Math.cos(theta), carY - direction * 94 * Math.sin(theta), "#f59e0b");
  }
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("设计速度 v₀ = " + design.toFixed(0) + " m/s", 34, 420);
  text("实际速度 v = " + speed.toFixed(0) + " m/s", 34, 445);
}

function drawCurveTraining13Graph() {
  var design = Math.max(0.1, getJsonParam(currentScene, "designSpeed", 20));
  var speed = getJsonParam(currentScene, "speed", 24);
  var theta = getJsonParam(currentScene, "theta", 12) * Math.PI / 180;
  var ratio = speed / design;
  var frame = curveTrainingGraphBegin("实际速度—支持力比值", "N/N₀ = cos²θ + (v/v₀)²sin²θ");
  curveTrainingPlot(frame, 0.4, 1.7, 0.7, 1.55, "#2563eb", function (q) {
    return Math.cos(theta) * Math.cos(theta) + q * q * Math.sin(theta) * Math.sin(theta);
  });
  curveTrainingMarker(frame, ratio, Math.cos(theta) * Math.cos(theta) + ratio * ratio * Math.sin(theta) * Math.sin(theta), 0.4, 1.7, 0.7, 1.55, "#dc2626");
  curveTrainingGraphLabels(frame, "速度比 v/v₀", "支持力比 N/N₀");
  curveTrainingGraphEnd();
}

function curveTraining14Threshold(phi, radius, kdOverM) {
  return Math.sqrt(Math.max(0, (kdOverM + 10 * (1 - Math.cos(phi))) / Math.max(0.05, radius)));
}

function drawCurveTraining14Scene() {
  var omega = getJsonParam(currentScene, "omega", 4);
  var radius = getJsonParam(currentScene, "radius", 0.35);
  var kdOverM = getJsonParam(currentScene, "kdOverM", 4);
  var phi = curveTrainingProgress() * Math.PI * 2;
  var cx = 276;
  var cy = 260;
  var rr = 158;
  var x = cx + rr * Math.sin(phi);
  var y = cy + rr * Math.cos(phi);
  var threshold = curveTraining14Threshold(phi, radius, kdOverM);
  var active = omega >= threshold;
  curveTrainingTitle("自行车气嘴灯触发", "最低点阈值最小，最高点阈值最大");
  noFill();
  stroke("#475569");
  strokeWeight(8);
  circle(cx, cy, rr * 2);
  stroke("#94a3b8");
  strokeWeight(2);
  line(cx - rr, cy, cx + rr, cy);
  line(cx, cy - rr, cx, cy + rr);
  noStroke();
  fill(active ? "#dc2626" : "#94a3b8");
  circle(x, y, 28);
  if (active) {
    noFill();
    stroke("#fecaca");
    strokeWeight(5);
    circle(x, y, 44);
  }
  drawArrow(x, y, x, y + 68, "#0f766e");
  noStroke();
  fill("#334155");
  textAlign(CENTER, TOP);
  textSize(13);
  text("最高点", cx, cy - rr - 28);
  textAlign(CENTER, BOTTOM);
  text("最低点", cx, cy + rr + 27);
  textAlign(LEFT, TOP);
  text("当前阈值 ωc = " + threshold.toFixed(2) + " rad/s", 32, 432);
  fill(active ? "#b91c1c" : "#475569");
  text(active ? "触点闭合：发光" : "触点未闭合", 310, 432);
}

function drawCurveTraining14Graph() {
  var omega = getJsonParam(currentScene, "omega", 4);
  var radius = getJsonParam(currentScene, "radius", 0.35);
  var kdOverM = getJsonParam(currentScene, "kdOverM", 4);
  var phiNow = curveTrainingProgress() * 360;
  var maxThreshold = curveTraining14Threshold(Math.PI, radius, kdOverM) * 1.15;
  var frame = curveTrainingGraphBegin("轮位角—临界角速度", "0°为最低点，180°为最高点；水平线为当前 ω");
  curveTrainingPlot(frame, 0, 360, 0, maxThreshold, "#2563eb", function (degree) {
    return curveTraining14Threshold(degree * Math.PI / 180, radius, kdOverM);
  });
  curveTrainingPlot(frame, 0, 360, 0, maxThreshold, "#dc2626", function () { return omega; });
  curveTrainingMarker(frame, phiNow, curveTraining14Threshold(phiNow * Math.PI / 180, radius, kdOverM), 0, 360, 0, maxThreshold, "#0f766e");
  curveTrainingGraphLabels(frame, "轮位角 φ", "临界角速度 ωc");
  curveTrainingGraphEnd();
}

function drawCurveTraining15Scene() {
  var omegaMax = getJsonParam(currentScene, "omega", 1.8);
  var innerR = getJsonParam(currentScene, "innerR", 1);
  var ropeRatio = getJsonParam(currentScene, "ropeRatio", 2);
  var outerR = innerR * (1 + ropeRatio);
  var pNow = curveTrainingProgress();
  var omega = omegaMax * pNow;
  var angle = pNow * Math.PI * 3.2;
  var scale = 150 / Math.max(outerR, 0.2);
  var cx = 275;
  var cy = 260;
  var ax = cx + innerR * scale * Math.cos(angle);
  var ay = cy + innerR * scale * Math.sin(angle);
  var bx = cx + outerR * scale * Math.cos(angle);
  var by = cy + outerR * scale * Math.sin(angle);
  curveTrainingTitle("圆盘双木块摩擦与张力", "外块先达到最大静摩擦，随后轻绳开始分担向心力");
  noStroke();
  fill("#f8fafc");
  circle(cx, cy, 340);
  noFill();
  stroke("#cbd5e1");
  strokeWeight(2);
  circle(cx, cy, 2 * innerR * scale);
  circle(cx, cy, 2 * outerR * scale);
  stroke("#f59e0b");
  strokeWeight(4);
  line(ax, ay, bx, by);
  noStroke();
  fill("#2563eb");
  rectMode(CENTER);
  rect(ax, ay, 24, 24, 4);
  fill("#dc2626");
  rect(bx, by, 24, 24, 4);
  rectMode(CORNER);
  drawArrow(ax, ay, lerp(ax, cx, 0.38), lerp(ay, cy, 0.38), "#2563eb");
  drawArrow(bx, by, lerp(bx, cx, 0.30), lerp(by, cy, 0.30), "#dc2626");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("ω = " + omega.toFixed(2) + " rad/s", 34, 426);
  text("外块半径 / 内块半径 = " + (1 + ropeRatio).toFixed(1), 230, 426);
}

function curveTraining15Curves(x, k) {
  var x2 = 2 * k / (k + 1);
  var outer = x <= 1 ? k * x : k;
  var inner;
  if (x <= 1) {
    inner = x;
  } else {
    inner = 1 + (k - 1) * (x - 1) / Math.max(0.001, x2 - 1);
  }
  return { outer: Math.min(k, outer), inner: Math.min(k, inner), x2: x2 };
}

function drawCurveTraining15Graph() {
  var k = 1 + getJsonParam(currentScene, "ropeRatio", 2);
  var pNow = curveTrainingProgress();
  var x2 = 2 * k / (k + 1);
  var xNow = x2 * pNow * pNow;
  var values = curveTraining15Curves(xNow, k);
  var frame = curveTrainingGraphBegin("摩擦力—ω² 图像", "归一化后：外块先到平台，内块在张力出现后斜率增大");
  curveTrainingPlot(frame, 0, x2 * 1.08, 0, k * 1.12, "#dc2626", function (x) { return curveTraining15Curves(x, k).outer; });
  curveTrainingPlot(frame, 0, x2 * 1.08, 0, k * 1.12, "#2563eb", function (x) { return curveTraining15Curves(x, k).inner; });
  curveTrainingMarker(frame, xNow, values.outer, 0, x2 * 1.08, 0, k * 1.12, "#dc2626");
  curveTrainingMarker(frame, xNow, values.inner, 0, x2 * 1.08, 0, k * 1.12, "#2563eb");
  curveTrainingGraphLabels(frame, "归一化 ω²", "摩擦力 f / f₁");
  curveTrainingLegend(frame.x + 12, frame.y + 18, "#dc2626", "外块 b");
  curveTrainingLegend(frame.x + 135, frame.y + 18, "#2563eb", "内块 a");
  curveTrainingGraphEnd();
}

function curveTrainingArcPolyline(cx, cy, radius, startAngle, endAngle, colorHex) {
  noFill();
  stroke(colorHex);
  strokeWeight(3);
  beginShape();
  for (var i = 0; i <= 60; i += 1) {
    var angle = lerp(startAngle, endAngle, i / 60);
    vertex(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
  }
  endShape();
}

function curveTraining16State(progress, rope, side, scale, aPoint, bPoint, cPoint) {
  var radii = [rope, rope - side, rope - 2 * side];
  var total = Math.max(0.01, radii[0] + radii[1] + radii[2]);
  var q = progress * total;
  var stage = 0;
  var local = 0;
  if (q <= radii[0]) {
    local = q / Math.max(0.01, radii[0]);
  } else if (q <= radii[0] + radii[1]) {
    stage = 1;
    local = (q - radii[0]) / Math.max(0.01, radii[1]);
  } else {
    stage = 2;
    local = (q - radii[0] - radii[1]) / Math.max(0.01, radii[2]);
  }
  var centers = [aPoint, bPoint, cPoint];
  var starts = [Math.PI, 5 * Math.PI / 3, 7 * Math.PI / 3];
  var ends = [5 * Math.PI / 3, 7 * Math.PI / 3, 3 * Math.PI];
  var center = centers[stage];
  var angle = lerp(starts[stage], ends[stage], local);
  return {
    stage: stage,
    local: local,
    angle: angle,
    radius: Math.max(0.01, radii[stage]) * scale,
    x: center.x + Math.max(0.01, radii[stage]) * scale * Math.cos(angle),
    y: center.y + Math.max(0.01, radii[stage]) * scale * Math.sin(angle),
    radii: radii,
    starts: starts,
    ends: ends,
    centers: centers
  };
}

function drawCurveTraining16Scene() {
  var rope = getJsonParam(currentScene, "rope", 1);
  var side = getJsonParam(currentScene, "side", 0.3);
  var speed = getJsonParam(currentScene, "speed", 2);
  var scale = 260 / Math.max(rope, 0.2);
  var aPoint = { x: 300, y: 320 };
  var bPoint = { x: aPoint.x + side * scale * 0.5, y: aPoint.y - side * scale * Math.sqrt(3) / 2 };
  var cPoint = { x: aPoint.x + side * scale, y: aPoint.y };
  var state = curveTraining16State(curveTrainingProgress(), rope, side, scale, aPoint, bPoint, cPoint);
  curveTrainingTitle("细绳依次缠绕正三棱柱", "每跨过一条边，自由绳长减少 0.3 m，张力随 1/r 阶跃增大");
  noStroke();
  fill("#e2e8f0");
  triangle(aPoint.x, aPoint.y, bPoint.x, bPoint.y, cPoint.x, cPoint.y);
  stroke("#64748b");
  strokeWeight(2);
  noFill();
  line(aPoint.x, aPoint.y, bPoint.x, bPoint.y);
  line(bPoint.x, bPoint.y, cPoint.x, cPoint.y);
  line(cPoint.x, cPoint.y, aPoint.x, aPoint.y);
  curveTrainingArcPolyline(aPoint.x, aPoint.y, rope * scale, Math.PI, state.stage === 0 ? state.angle : 5 * Math.PI / 3, "#bfdbfe");
  if (state.stage >= 1) {
    curveTrainingArcPolyline(bPoint.x, bPoint.y, Math.max(0.01, rope - side) * scale, 5 * Math.PI / 3, state.stage === 1 ? state.angle : 7 * Math.PI / 3, "#93c5fd");
  }
  if (state.stage >= 2) {
    curveTrainingArcPolyline(cPoint.x, cPoint.y, Math.max(0.01, rope - 2 * side) * scale, 7 * Math.PI / 3, state.angle, "#2563eb");
  }
  stroke("#f59e0b");
  strokeWeight(4);
  if (state.stage === 0) {
    line(aPoint.x, aPoint.y, state.x, state.y);
  } else if (state.stage === 1) {
    line(aPoint.x, aPoint.y, bPoint.x, bPoint.y);
    line(bPoint.x, bPoint.y, state.x, state.y);
  } else {
    line(aPoint.x, aPoint.y, bPoint.x, bPoint.y);
    line(bPoint.x, bPoint.y, cPoint.x, cPoint.y);
    line(cPoint.x, cPoint.y, state.x, state.y);
  }
  noStroke();
  fill("#dc2626");
  circle(state.x, state.y, 19);
  var tangent = state.angle + Math.PI / 2;
  drawArrow(state.x, state.y, state.x + 54 * Math.cos(tangent), state.y + 54 * Math.sin(tangent), "#0f766e");
  var tension = 0.5 * speed * speed / Math.max(0.01, state.radii[state.stage]);
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("当前绕点：" + ["a", "b", "c"][state.stage], 34, 424);
  text("自由绳长 r = " + state.radii[state.stage].toFixed(2) + " m", 170, 424);
  text("张力 T = " + tension.toFixed(2) + " N", 374, 424);
}

function drawCurveTraining16Graph() {
  var rope = getJsonParam(currentScene, "rope", 1);
  var side = getJsonParam(currentScene, "side", 0.3);
  var speed = getJsonParam(currentScene, "speed", 2);
  var radii = [rope, rope - side, rope - 2 * side, rope - 3 * side];
  var tensions = radii.map(function (r) { return 0.5 * speed * speed / Math.max(0.01, r); });
  var yMax = Math.max(8, tensions[3] * 1.12);
  var frame = curveTrainingGraphBegin("分段张力—运动进程", "蓝色阶梯为 mv²/r；红线为最大承受拉力 7 N");
  var weights = [Math.max(0.01, radii[0]), Math.max(0.01, radii[1]), Math.max(0.01, radii[2])];
  var sum = weights[0] + weights[1] + weights[2];
  var boundaries = [0, weights[0] / sum, (weights[0] + weights[1]) / sum, 1];
  stroke("#2563eb");
  strokeWeight(3);
  for (var i = 0; i < 3; i += 1) {
    var x1 = map(boundaries[i], 0, 1, frame.x, frame.x + frame.w);
    var x2 = map(boundaries[i + 1], 0, 1, frame.x, frame.x + frame.w);
    var y = map(tensions[i], 0, yMax, frame.y + frame.h, frame.y);
    line(x1, y, x2, y);
    if (i < 2) {
      var nextY = map(tensions[i + 1], 0, yMax, frame.y + frame.h, frame.y);
      line(x2, y, x2, nextY);
    }
  }
  var breakY = map(tensions[3], 0, yMax, frame.y + frame.h, frame.y);
  curveTrainingDashedLine(frame.x + frame.w - 2, map(tensions[2], 0, yMax, frame.y + frame.h, frame.y), frame.x + frame.w - 2, breakY, "#2563eb");
  var limitY = map(7, 0, yMax, frame.y + frame.h, frame.y);
  stroke("#dc2626");
  strokeWeight(2);
  line(frame.x, limitY, frame.x + frame.w, limitY);
  var pNow = curveTrainingProgress();
  var state = curveTraining16State(pNow, rope, side, 1, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 });
  curveTrainingMarker(frame, pNow, tensions[state.stage], 0, 1, 0, yMax, "#0f766e");
  curveTrainingGraphLabels(frame, "归一化运动进程", "张力 T / N");
  curveTrainingGraphEnd();
}
