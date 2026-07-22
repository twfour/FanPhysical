function projectileTrainingAnimation() {
  return ((problemDataMap[currentScene] || {}).animation || {});
}

function projectileTrainingVariant() {
  return projectileTrainingAnimation().variant || "";
}

function projectileTrainingProgress() {
  var state = getJsonAnimationState(currentScene);
  var duration = Math.max(0.001, getJsonDuration(currentScene));
  return constrain(state.time / duration, 0, 1);
}

function projectileTrainingTitle(title, subtitle) {
  curveTrainingTitle(title, subtitle);
}

function projectileTrainingPath(startX, startY, tEnd, xScale, yScale, colorHex, xFn, yFn) {
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 100; i += 1) {
    var t = tEnd * i / 100;
    vertex(startX + xFn(t) * xScale, startY + yFn(t) * yScale);
  }
  endShape();
}

function projectileTrainingBall(x, y, colorHex, label) {
  noStroke();
  fill(colorHex);
  circle(x, y, 18);
  if (label) {
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textSize(11);
    text(label, x, y);
  }
}

function projectileTrainingGraphLine(frame, xMin, xMax, yMin, yMax, colorHex, fn) {
  curveTrainingPlot(frame, xMin, xMax, yMin, yMax, colorHex, fn);
}

function drawProjectileTrainingModelScene() {
  var variant = projectileTrainingVariant();
  if (variant === "projectile_lesson_04_wall_marks") {
    drawProjectileLesson04Scene();
  } else if (variant === "projectile_lesson_09_plane_comparison") {
    drawProjectileLesson09Scene();
  } else if (variant === "projectile_a_01_dart_wall") {
    drawProjectileA01Scene();
  } else if (variant === "projectile_a_02_dam_slope") {
    drawProjectileA02Scene();
  } else if (variant === "projectile_a_03_fountain") {
    drawProjectileA03Scene();
  } else if (variant === "projectile_a_04_fire_hose") {
    drawProjectileA04Scene();
  } else if (variant === "projectile_a_06_bottle_holes") {
    drawProjectileA06Scene();
  } else if (variant === "projectile_a_07_semicircle_incline") {
    drawProjectileA07Scene();
  } else if (variant === "projectile_a_08_two_balls_incline") {
    drawProjectileA08Scene();
  } else if (variant === "projectile_b_09_conveyor") {
    drawProjectileB09Scene();
  } else if (variant === "projectile_b_10_arc_game") {
    drawProjectileB10Scene();
  } else if (variant === "projectile_b_11_ski_slope") {
    drawProjectileB11Scene();
  }
}

function drawProjectileTrainingModelGraph() {
  var variant = projectileTrainingVariant();
  if (variant === "projectile_lesson_04_wall_marks") {
    drawProjectileLesson04Graph();
  } else if (variant === "projectile_lesson_09_plane_comparison") {
    drawProjectileLesson09Graph();
  } else if (variant === "projectile_a_01_dart_wall") {
    drawProjectileA01Graph();
  } else if (variant === "projectile_a_02_dam_slope") {
    drawProjectileA02Graph();
  } else if (variant === "projectile_a_03_fountain") {
    drawProjectileA03Graph();
  } else if (variant === "projectile_a_04_fire_hose") {
    drawProjectileA04Graph();
  } else if (variant === "projectile_a_06_bottle_holes") {
    drawProjectileA06Graph();
  } else if (variant === "projectile_a_07_semicircle_incline") {
    drawProjectileA07Graph();
  } else if (variant === "projectile_a_08_two_balls_incline") {
    drawProjectileA08Graph();
  } else if (variant === "projectile_b_09_conveyor") {
    drawProjectileB09Graph();
  } else if (variant === "projectile_b_10_arc_game") {
    drawProjectileB10Graph();
  } else if (variant === "projectile_b_11_ski_slope") {
    drawProjectileB11Graph();
  }
}

function projectileWallCase(index, gap, wallDistance, g) {
  var drop = index * gap;
  var time = Math.sqrt(2 * drop / g);
  return { drop: drop, time: time, speed: wallDistance / time };
}

function drawProjectileLesson04Scene() {
  var wallDistance = getJsonParam(currentScene, "wallDistance", 12);
  var gap = getJsonParam(currentScene, "markGap", 2);
  var g = getJsonParam(currentScene, "g", 10);
  var cases = [projectileWallCase(1, gap, wallDistance, g), projectileWallCase(2, gap, wallDistance, g), projectileWallCase(3, gap, wallDistance, g)];
  var colors = ["#2563eb", "#0f766e", "#dc2626"];
  var labels = ["a", "b", "c"];
  var startX = 72;
  var startY = 104;
  var wallX = 500;
  var gapPx = 92;
  var time = projectileTrainingProgress() * cases[2].time;
  projectileTrainingTitle("等距弹痕的时间与初速度", "墙距相同；下落高度为 d、2d、3d");
  stroke("#334155");
  strokeWeight(4);
  line(wallX, 78, wallX, 430);
  noStroke();
  fill("#111827");
  textAlign(LEFT, CENTER);
  textSize(13);
  text("O", wallX + 9, startY);
  for (var i = 0; i < 3; i += 1) {
    var item = cases[i];
    var markY = startY + (i + 1) * gapPx;
    stroke(colors[i]);
    strokeWeight(2.5);
    noFill();
    beginShape();
    for (var j = 0; j <= 90; j += 1) {
      var xPhysical = wallDistance * j / 90;
      var tPath = xPhysical / item.speed;
      vertex(startX + (wallX - startX) * j / 90, startY + 0.5 * g * tPath * tPath * gapPx / gap);
    }
    endShape();
    var drawT = Math.min(time, item.time);
    var ballX = startX + (wallX - startX) * item.speed * drawT / wallDistance;
    var ballY = startY + 0.5 * g * drawT * drawT * gapPx / gap;
    projectileTrainingBall(ballX, ballY, colors[i], labels[i]);
    noStroke();
    fill(colors[i]);
    textAlign(LEFT, CENTER);
    textSize(13);
    text(labels[i], wallX + 12, markY);
  }
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("v₀ 比：√6 : √3 : √2", 44, 410);
  text("Δv 比：1 : √2 : √3", 298, 410);
}

function drawProjectileLesson04Graph() {
  var frame = curveTrainingGraphBegin("弹痕序号—比值图", "蓝线：飞行时间；红线：初速度（均归一化）");
  projectileTrainingGraphLine(frame, 1, 3, 0, 1.85, "#2563eb", function (n) { return Math.sqrt(n / 3); });
  projectileTrainingGraphLine(frame, 1, 3, 0, 1.85, "#dc2626", function (n) { return Math.sqrt(3 / n); });
  curveTrainingGraphLabels(frame, "弹痕序号 n", "归一化量");
  curveTrainingLegend(frame.x + 12, frame.y + 18, "#2563eb", "t ∝ √n");
  curveTrainingLegend(frame.x + 170, frame.y + 18, "#dc2626", "v₀ ∝ 1/√n");
  curveTrainingGraphEnd();
}

registerSceneRenderer("projectile_training_model", drawProjectileTrainingModelScene, drawProjectileTrainingModelGraph);

function drawProjectileLesson09Scene() {
  var height = getJsonParam(currentScene, "height", 8);
  var angle = getJsonParam(currentScene, "angle", 35) * Math.PI / 180;
  var v0 = getJsonParam(currentScene, "v0", 5);
  var g = 10;
  var tA = Math.sqrt(2 * height / g);
  var tB = tA / Math.max(0.12, Math.sin(angle));
  var time = projectileTrainingProgress() * tB;
  var scaleYA = 120 / height;
  var scaleYB = 120 / height;
  var scaleX = 178 / Math.max(v0 * tB, 1);
  projectileTrainingTitle("平抛与光滑斜面运动", "同初速度、同下降高度：时间不同，末速率相同");
  noStroke();
  fill("#f8fafc");
  rect(40, 78, 238, 168, 4);
  rect(294, 78, 238, 168, 4);
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("A：竖直平面内平抛", 52, 88);
  text("B：沿光滑斜面运动", 306, 88);
  stroke("#475569");
  strokeWeight(2);
  line(52, 222, 266, 222);
  line(306, 222, 520, 222);
  projectileTrainingPath(58, 112, tA, scaleX, scaleYA, "#2563eb", function (t) { return v0 * t; }, function (t) { return 0.5 * g * t * t; });
  projectileTrainingPath(312, 112, tB, scaleX, scaleYB, "#dc2626", function (t) { return v0 * t; }, function (t) { return 0.5 * g * Math.sin(angle) * Math.sin(angle) * t * t; });
  var drawTA = Math.min(time, tA);
  var drawTB = Math.min(time, tB);
  projectileTrainingBall(58 + v0 * drawTA * scaleX, 112 + 0.5 * g * drawTA * drawTA * scaleYA, "#2563eb", "A");
  projectileTrainingBall(312 + v0 * drawTB * scaleX, 112 + 0.5 * g * Math.sin(angle) * Math.sin(angle) * drawTB * drawTB * scaleYB, "#dc2626", "B");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("tA = " + tA.toFixed(2) + " s", 54, 276);
  text("tB = " + tB.toFixed(2) + " s", 54, 302);
  text("aA = g", 306, 276);
  text("aB = g sinθ", 306, 302);
  text("vA = vB = " + Math.sqrt(v0 * v0 + 2 * g * height).toFixed(2) + " m/s", 54, 356);
}

function drawProjectileLesson09Graph() {
  var angle = getJsonParam(currentScene, "angle", 35) * Math.PI / 180;
  var height = getJsonParam(currentScene, "height", 8);
  var g = 10;
  var tA = Math.sqrt(2 * height / g);
  var tB = tA / Math.max(0.12, Math.sin(angle));
  var time = projectileTrainingProgress() * tB;
  var frame = curveTrainingGraphBegin("竖直下降进度—时间", "A 先落地；B 的竖直加速度为 g sin²θ");
  projectileTrainingGraphLine(frame, 0, tB, 0, 1.05, "#2563eb", function (t) { return Math.min(1, 0.5 * g * t * t / height); });
  projectileTrainingGraphLine(frame, 0, tB, 0, 1.05, "#dc2626", function (t) { return Math.min(1, 0.5 * g * Math.sin(angle) * Math.sin(angle) * t * t / height); });
  curveTrainingMarker(frame, time, Math.min(1, 0.5 * g * time * time / height), 0, tB, 0, 1.05, "#2563eb");
  curveTrainingGraphLabels(frame, "时间 t / s", "下降高度 / H");
  curveTrainingLegend(frame.x + 12, frame.y + 18, "#2563eb", "A 平抛");
  curveTrainingLegend(frame.x + 150, frame.y + 18, "#dc2626", "B 斜面");
  curveTrainingGraphEnd();
}

function projectileDartGeometry(separation, g) {
  var wallDistance = 24 * separation / 7;
  var tanA = 3 / 4;
  var tanB = 4 / 3;
  var dropA = wallDistance * tanA / 2;
  var dropB = wallDistance * tanB / 2;
  var tA = Math.sqrt(2 * dropA / g);
  var tB = Math.sqrt(2 * dropB / g);
  return { wallDistance: wallDistance, dropA: dropA, dropB: dropB, tA: tA, tB: tB, vA: wallDistance / tA, vB: wallDistance / tB };
}

function drawProjectileA01Scene() {
  var separation = getJsonParam(currentScene, "separation", 1.4);
  var g = getJsonParam(currentScene, "g", 10);
  var data = projectileDartGeometry(separation, g);
  var startX = 70;
  var wallX = 500;
  var startY = 112;
  var yScale = 250 / data.dropB;
  var xScale = (wallX - startX) / data.wallDistance;
  var time = projectileTrainingProgress() * data.tB;
  projectileTrainingTitle("双飞镖撞墙", "插入墙面的姿态就是撞墙瞬间速度方向");
  stroke("#334155");
  strokeWeight(4);
  line(wallX, 78, wallX, 430);
  var items = [
    { label: "A", color: "#2563eb", time: data.tA, speed: data.vA, drop: data.dropA, angle: "37°" },
    { label: "B", color: "#dc2626", time: data.tB, speed: data.vB, drop: data.dropB, angle: "53°" }
  ];
  for (var i = 0; i < items.length; i += 1) {
    var item = items[i];
    projectileTrainingPath(startX, startY, item.time, xScale, yScale, item.color, function (t) { return item.speed * t; }, function (t) { return 0.5 * g * t * t; });
    var drawT = Math.min(time, item.time);
    var bx = startX + item.speed * drawT * xScale;
    var by = startY + 0.5 * g * drawT * drawT * yScale;
    projectileTrainingBall(bx, by, item.color, item.label);
    noStroke();
    fill(item.color);
    textAlign(LEFT, CENTER);
    textSize(13);
    text(item.label + "  " + item.angle, wallX + 12, startY + item.drop * yScale);
  }
  var yA = startY + data.dropA * yScale;
  var yB = startY + data.dropB * yScale;
  stroke("#f59e0b");
  strokeWeight(2);
  line(wallX + 42, yA, wallX + 42, yB);
  line(wallX + 35, yA, wallX + 49, yA);
  line(wallX + 35, yB, wallX + 49, yB);
  noStroke();
  fill("#92400e");
  textAlign(CENTER, CENTER);
  text("d", wallX + 55, (yA + yB) / 2);
  fill("#334155");
  textAlign(LEFT, TOP);
  text("L = 24d/7 = " + data.wallDistance.toFixed(2) + " m", 56, 414);
}

function drawProjectileA01Graph() {
  var separation = getJsonParam(currentScene, "separation", 1.4);
  var frame = curveTrainingGraphBegin("末速度角—下落高度", "相同墙距下，y = (L/2)tanβ");
  projectileTrainingGraphLine(frame, 25, 65, 0, 3.2 * separation, "#2563eb", function (beta) {
    var L = 24 * separation / 7;
    return 0.5 * L * Math.tan(beta * Math.PI / 180);
  });
  curveTrainingMarker(frame, 37, 9 * separation / 7, 25, 65, 0, 3.2 * separation, "#2563eb");
  curveTrainingMarker(frame, 53, 16 * separation / 7, 25, 65, 0, 3.2 * separation, "#dc2626");
  curveTrainingGraphLabels(frame, "末速度与水平夹角 β", "下落高度 y / m");
  curveTrainingGraphEnd();
}

function projectileDamData(v0, slopeLength, g) {
  var theta = Math.PI / 6;
  var xO = slopeLength * Math.cos(theta);
  var yO = slopeLength * Math.sin(theta);
  var critical = Math.sqrt(g * xO * xO / (2 * yO));
  var hitsSlope = v0 < critical;
  var xEnd = hitsSlope ? 2 * v0 * v0 * Math.tan(theta) / g : v0 * Math.sqrt(2 * yO / g);
  var yEnd = hitsSlope ? xEnd * Math.tan(theta) : yO;
  return { theta: theta, xO: xO, yO: yO, critical: critical, hitsSlope: hitsSlope, xEnd: xEnd, yEnd: yEnd, tEnd: xEnd / v0 };
}

function drawProjectileA02Scene() {
  var v0 = getJsonParam(currentScene, "v0", 19);
  var slopeLength = getJsonParam(currentScene, "slopeLength", 40);
  var g = getJsonParam(currentScene, "g", 10);
  var data = projectileDamData(v0, slopeLength, g);
  var startX = 64;
  var startY = 98;
  var scale = Math.min(390 / Math.max(data.xO, data.xEnd), 260 / data.yO);
  var time = projectileTrainingProgress() * data.tEnd;
  projectileTrainingTitle("斜坡抛石：撞坝或入水", "临界轨迹恰好经过坝脚 O");
  stroke("#475569");
  strokeWeight(5);
  line(startX, startY, startX + data.xO * scale, startY + data.yO * scale);
  stroke("#0ea5e9");
  strokeWeight(3);
  line(startX + data.xO * scale, startY + data.yO * scale, 536, startY + data.yO * scale);
  noStroke();
  fill("#dbeafe");
  rect(startX + data.xO * scale, startY + data.yO * scale + 3, 536 - startX - data.xO * scale, 50);
  projectileTrainingPath(startX, startY, data.tEnd, scale, scale, "#dc2626", function (t) { return v0 * t; }, function (t) { return 0.5 * g * t * t; });
  projectileTrainingBall(startX + v0 * time * scale, startY + 0.5 * g * time * time * scale, "#dc2626", "");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("A", startX - 20, startY - 4);
  text("O", startX + data.xO * scale - 6, startY + data.yO * scale + 10);
  fill(data.hitsSlope ? "#b91c1c" : "#0369a1");
  textSize(15);
  text(data.hitsSlope ? "结果：先撞到坝面" : "结果：越过坝脚后入水", 62, 405);
  fill("#334155");
  textSize(13);
  text("临界速度 " + data.critical.toFixed(2) + " m/s", 318, 407);
}

function drawProjectileA02Graph() {
  var slopeLength = getJsonParam(currentScene, "slopeLength", 40);
  var g = getJsonParam(currentScene, "g", 10);
  var v0 = getJsonParam(currentScene, "v0", 19);
  var critical = projectileDamData(v0, slopeLength, g).critical;
  var theta = Math.PI / 6;
  var yO = slopeLength * Math.sin(theta);
  var frame = curveTrainingGraphBegin("初速度—碰撞速度角", "临界速度左侧撞坝角不变；右侧落水角减小");
  projectileTrainingGraphLine(frame, 8, 28, 0, 55, "#2563eb", function (speed) {
    return speed < critical ? Math.atan(2 * Math.tan(theta)) * 180 / Math.PI : Math.atan(Math.sqrt(2 * g * yO) / speed) * 180 / Math.PI;
  });
  var currentAngle = v0 < critical ? Math.atan(2 * Math.tan(theta)) * 180 / Math.PI : Math.atan(Math.sqrt(2 * g * yO) / v0) * 180 / Math.PI;
  curveTrainingMarker(frame, v0, currentAngle, 8, 28, 0, 55, "#dc2626");
  curveTrainingDashedLine(map(critical, 8, 28, frame.x, frame.x + frame.w), frame.y, map(critical, 8, 28, frame.x, frame.x + frame.w), frame.y + frame.h, "#f59e0b");
  curveTrainingGraphLabels(frame, "水平初速度 v₀ / (m/s)", "速度与水平夹角 / °");
  curveTrainingGraphEnd();
}

function drawProjectileA03Scene() {
  var speed = getJsonParam(currentScene, "speed", 12);
  var angle = getJsonParam(currentScene, "angle", 55) * Math.PI / 180;
  var g = getJsonParam(currentScene, "g", 10);
  var flight = 2 * speed * Math.sin(angle) / g;
  var range = speed * speed * Math.sin(2 * angle) / g;
  var time = projectileTrainingProgress() * flight;
  var scaleX = 185 / Math.max(range, 1);
  var scaleY = 210 / Math.max(speed * speed * Math.sin(angle) * Math.sin(angle) / (2 * g), 1);
  var centerX = 286;
  var waterY = 390;
  projectileTrainingTitle("音乐喷泉的对称抛体", "同速率、同仰角：飞行时间相同，射程关于喷口对称");
  stroke("#0284c7");
  strokeWeight(3);
  line(40, waterY, 532, waterY);
  var directions = [-1, 1];
  for (var k = 0; k < directions.length; k += 1) {
    var direction = directions[k];
    noFill();
    stroke("#38bdf8");
    strokeWeight(3);
    beginShape();
    for (var i = 0; i <= 100; i += 1) {
      var t = flight * i / 100;
      var x = speed * Math.cos(angle) * t;
      var rise = speed * Math.sin(angle) * t - 0.5 * g * t * t;
      vertex(centerX + direction * x * scaleX, waterY - rise * scaleY);
    }
    endShape();
    var bx = centerX + direction * speed * Math.cos(angle) * time * scaleX;
    var by = waterY - (speed * Math.sin(angle) * time - 0.5 * g * time * time) * scaleY;
    projectileTrainingBall(bx, by, "#0ea5e9", "");
  }
  noStroke();
  fill("#0369a1");
  ellipse(centerX, waterY + 8, 68, 18);
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("T = " + flight.toFixed(2) + " s", 54, 418);
  text("R = " + range.toFixed(2) + " m", 284, 418);
}

function drawProjectileA03Graph() {
  var speed = getJsonParam(currentScene, "speed", 12);
  var angle = getJsonParam(currentScene, "angle", 55) * Math.PI / 180;
  var frame = curveTrainingGraphBegin("初速度—时间/射程", "归一化后仍可看出：T∝v₀，R∝v₀²");
  projectileTrainingGraphLine(frame, 7, 18, 0, 1.1, "#2563eb", function (v) { return v / 18; });
  projectileTrainingGraphLine(frame, 7, 18, 0, 1.1, "#dc2626", function (v) { return v * v / (18 * 18); });
  curveTrainingMarker(frame, speed, speed / 18, 7, 18, 0, 1.1, "#2563eb");
  curveTrainingMarker(frame, speed, speed * speed / (18 * 18), 7, 18, 0, 1.1, "#dc2626");
  curveTrainingGraphLabels(frame, "喷水初速度 v₀", "归一化量");
  curveTrainingLegend(frame.x + 12, frame.y + 18, "#2563eb", "飞行时间");
  curveTrainingLegend(frame.x + 160, frame.y + 18, "#dc2626", "水平射程");
  noStroke();
  fill("#475569");
  textAlign(LEFT, TOP);
  textSize(12);
  text("当前角度 " + (angle * 180 / Math.PI).toFixed(0) + "°", frame.x + 12, frame.y + frame.h - 24);
  curveTrainingGraphEnd();
}

function projectileApexData(speed, angle, g) {
  var theta = angle * Math.PI / 180;
  var time = speed * Math.sin(theta) / g;
  return { theta: theta, time: time, x: speed * Math.cos(theta) * time, height: speed * Math.sin(theta) * time - 0.5 * g * time * time };
}

function drawProjectileA04Scene() {
  var speed = getJsonParam(currentScene, "speed", 18);
  var angle = getJsonParam(currentScene, "angle", 60);
  var g = getJsonParam(currentScene, "g", 10);
  var data = projectileApexData(speed, angle, g);
  var startX = 66;
  var groundY = 404;
  var scaleX = 390 / Math.max(data.x, 1);
  var scaleY = 250 / Math.max(data.height, 1);
  var time = projectileTrainingProgress() * data.time;
  var wallX = startX + data.x * scaleX;
  var wallTop = groundY - data.height * scaleY - 62;
  projectileTrainingTitle("水柱在最高点垂直击墙", "末速度水平 ⇔ 墙面位于轨迹最高点");
  stroke("#475569");
  strokeWeight(4);
  line(40, groundY, 535, groundY);
  line(wallX, wallTop, wallX, groundY);
  projectileTrainingPath(startX, groundY, data.time, scaleX, -scaleY, "#0ea5e9", function (t) { return speed * Math.cos(data.theta) * t; }, function (t) { return speed * Math.sin(data.theta) * t - 0.5 * g * t * t; });
  var bx = startX + speed * Math.cos(data.theta) * time * scaleX;
  var by = groundY - (speed * Math.sin(data.theta) * time - 0.5 * g * time * time) * scaleY;
  projectileTrainingBall(bx, by, "#0284c7", "");
  drawArrow(startX, groundY, startX + 64 * Math.cos(data.theta), groundY - 64 * Math.sin(data.theta), "#2563eb");
  drawArrow(wallX - 58, groundY - data.height * scaleY, wallX - 4, groundY - data.height * scaleY, "#dc2626");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("θ = " + angle.toFixed(0) + "°", startX + 32, groundY - 32);
  text("墙距 Xm = " + data.x.toFixed(2) + " m", 56, 430);
}

function drawProjectileA04Graph() {
  var speed = getJsonParam(currentScene, "speed", 18);
  var angle = getJsonParam(currentScene, "angle", 60);
  var g = getJsonParam(currentScene, "g", 10);
  var yMax = speed * speed / (2 * g) * 1.08;
  var frame = curveTrainingGraphBegin("发射角—最高点墙距", "Xm=v₀²sin2θ/(2g)，45° 处最大");
  projectileTrainingGraphLine(frame, 30, 78, 0, yMax, "#2563eb", function (theta) { return speed * speed * Math.sin(2 * theta * Math.PI / 180) / (2 * g); });
  curveTrainingMarker(frame, angle, projectileApexData(speed, angle, g).x, 30, 78, 0, yMax, "#dc2626");
  curveTrainingGraphLabels(frame, "发射角 θ / °", "最高点水平距离 Xm / m");
  curveTrainingGraphEnd();
}

function projectileHoleData(height, depth, g) {
  var h = constrain(depth, 0.05, height - 0.05);
  var holeHeight = height - h;
  var speed = Math.sqrt(2 * g * h);
  var time = Math.sqrt(2 * holeHeight / g);
  return { depth: h, holeHeight: holeHeight, speed: speed, time: time, range: speed * time };
}

function drawProjectileA06Scene() {
  var height = getJsonParam(currentScene, "tankHeight", 4);
  var depth = getJsonParam(currentScene, "holeDepth", 2);
  var g = getJsonParam(currentScene, "g", 10);
  var data = projectileHoleData(height, depth, g);
  var tankX = 80;
  var tankTop = 88;
  var tankBottom = 406;
  var tankW = 120;
  var yScale = (tankBottom - tankTop) / height;
  var holeY = tankTop + data.depth * yScale;
  var xScale = 270 / Math.max(2 * Math.sqrt(height * height / 4), data.range);
  var time = projectileTrainingProgress() * data.time;
  projectileTrainingTitle("水瓶侧孔水平射流", "孔深决定流速；孔高决定下落时间");
  noStroke();
  fill("#dbeafe");
  rect(tankX, tankTop, tankW, tankBottom - tankTop);
  stroke("#475569");
  strokeWeight(3);
  noFill();
  rect(tankX, tankTop, tankW, tankBottom - tankTop);
  stroke("#0284c7");
  line(tankX, tankTop, tankX + tankW, tankTop);
  stroke("#334155");
  line(44, tankBottom, 540, tankBottom);
  noStroke();
  fill("#0ea5e9");
  circle(tankX + tankW, holeY, 9);
  projectileTrainingPath(tankX + tankW, holeY, data.time, xScale, yScale, "#38bdf8", function (t) { return data.speed * t; }, function (t) { return 0.5 * g * t * t; });
  projectileTrainingBall(tankX + tankW + data.speed * time * xScale, holeY + 0.5 * g * time * time * yScale, "#0284c7", "");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("液面", tankX + 8, tankTop + 8);
  text("孔深 h = " + data.depth.toFixed(2) + " m", 54, 428);
  text("射程 x = " + data.range.toFixed(2) + " m", 302, 428);
}

function drawProjectileA06Graph() {
  var height = getJsonParam(currentScene, "tankHeight", 4);
  var depth = constrain(getJsonParam(currentScene, "holeDepth", 2), 0.05, height - 0.05);
  var yMax = height * 1.08;
  var frame = curveTrainingGraphBegin("孔深—水平射程", "x=2√[h(H-h)]，中点孔最远");
  projectileTrainingGraphLine(frame, 0, height, 0, yMax, "#2563eb", function (h) { return 2 * Math.sqrt(Math.max(0, h * (height - h))); });
  curveTrainingMarker(frame, depth, 2 * Math.sqrt(depth * (height - depth)), 0, height, 0, yMax, "#dc2626");
  curveTrainingGraphLabels(frame, "孔距液面深度 h / m", "水平射程 x / m");
  curveTrainingGraphEnd();
}

function projectileCircleHitX(radius, speed, g) {
  var k = g / (2 * speed * speed);
  var low = 0.0001;
  var high = 2 * radius;
  for (var i = 0; i < 70; i += 1) {
    var mid = (low + high) / 2;
    var value = k * k * Math.pow(mid, 4) + mid * mid - 2 * radius * mid;
    if (value > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return (low + high) / 2;
}

function drawProjectileA07Scene() {
  var radius = getJsonParam(currentScene, "radius", 4);
  var speed = getJsonParam(currentScene, "v0", 5.7);
  var g = getJsonParam(currentScene, "g", 10);
  var scale = 120 / Math.max(radius, 0.1);
  var startX = 286;
  var startY = 100;
  var circleX = projectileCircleHitX(radius, speed, g);
  var circleT = circleX / speed;
  var circleY = 0.5 * g * circleT * circleT;
  var slopeX = Math.min(2 * radius, speed * speed / g);
  var slopeY = slopeX / 2;
  var slopeT = slopeX / speed;
  var total = Math.max(circleT, slopeT);
  var time = projectileTrainingProgress() * total;
  projectileTrainingTitle("半圆轨道与斜面双边界", "两球同速反向平抛，分别与曲面和直面相交");
  noFill();
  stroke("#64748b");
  strokeWeight(4);
  arc(startX - radius * scale, startY, 2 * radius * scale, 2 * radius * scale, 0, Math.PI);
  line(startX, startY, startX + 2 * radius * scale, startY + radius * scale);
  noFill();
  stroke("#2563eb");
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 90; i += 1) {
    var ta = circleT * i / 90;
    vertex(startX - speed * ta * scale, startY + 0.5 * g * ta * ta * scale);
  }
  endShape();
  noFill();
  stroke("#dc2626");
  beginShape();
  for (i = 0; i <= 90; i += 1) {
    var tb = slopeT * i / 90;
    vertex(startX + speed * tb * scale, startY + 0.5 * g * tb * tb * scale);
  }
  endShape();
  var drawA = Math.min(time, circleT);
  var drawB = Math.min(time, slopeT);
  projectileTrainingBall(startX - speed * drawA * scale, startY + 0.5 * g * drawA * drawA * scale, "#2563eb", "a");
  projectileTrainingBall(startX + speed * drawB * scale, startY + 0.5 * g * drawB * drawB * scale, "#dc2626", "b");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("ta = " + circleT.toFixed(2) + " s", 52, 420);
  text("tb = " + slopeT.toFixed(2) + " s", 300, 420);
  text("b 球末速度方向恒为 45°", 166, 446);
}

function drawProjectileA07Graph() {
  var radius = getJsonParam(currentScene, "radius", 4);
  var speed = getJsonParam(currentScene, "v0", 5.7);
  var g = getJsonParam(currentScene, "g", 10);
  var vMin = 3;
  var vMax = Math.sqrt(2 * g * radius) * 0.98;
  var tMax = 2 * radius / vMin;
  var frame = curveTrainingGraphBegin("初速度—两边界碰撞时间", "蓝线：半圆轨道；红线：斜面");
  projectileTrainingGraphLine(frame, vMin, vMax, 0, tMax, "#2563eb", function (v) { return projectileCircleHitX(radius, v, g) / v; });
  projectileTrainingGraphLine(frame, vMin, vMax, 0, tMax, "#dc2626", function (v) { return Math.min(2 * radius, v * v / g) / v; });
  curveTrainingMarker(frame, speed, projectileCircleHitX(radius, speed, g) / speed, vMin, vMax, 0, tMax, "#2563eb");
  curveTrainingMarker(frame, speed, Math.min(2 * radius, speed * speed / g) / speed, vMin, vMax, 0, tMax, "#dc2626");
  curveTrainingGraphLabels(frame, "初速度 v₀ / (m/s)", "碰撞时间 t / s");
  curveTrainingGraphEnd();
}

function projectileA08Values(thetaDeg, time, g) {
  var tanTheta = Math.abs(thetaDeg - 37) < 0.001 ? 3 / 4 : Math.tan(thetaDeg * Math.PI / 180);
  var theta = Math.atan(tanTheta);
  var drop = 0.5 * g * time * time;
  var v1 = 0.5 * g * time / tanTheta;
  var v2 = g * time * tanTheta;
  return { theta: theta, drop: drop, v1: v1, v2: v2 };
}

function drawProjectileA08Scene() {
  var thetaDeg = getJsonParam(currentScene, "theta", 37);
  var originalTime = getJsonParam(currentScene, "time", 1.2);
  var speedScale = getJsonParam(currentScene, "speedScale", 1);
  var g = 10;
  var data = projectileA08Values(thetaDeg, originalTime, g);
  var x1 = data.v1 * originalTime;
  var x2 = data.v2 * originalTime;
  var scale = Math.min(360 / (x1 + x2), 230 / data.drop);
  var pointAX = 282;
  var launchY = 98;
  var pointAY = launchY + data.drop * scale;
  var mX = pointAX + x1 * scale;
  var nX = pointAX - x2 * scale;
  var endTime = originalTime / speedScale;
  var time = projectileTrainingProgress() * endTime;
  projectileTrainingTitle("双球同落斜面与加倍相遇", "M 受位移约束；N 受末速度垂直斜面约束");
  stroke("#64748b");
  strokeWeight(4);
  line(pointAX - 120, pointAY + 120 * Math.tan(data.theta), mX + 30, launchY - 30 * Math.tan(data.theta));
  curveTrainingDashedLine(nX, launchY, mX, launchY, "#94a3b8");
  noFill();
  stroke("#2563eb");
  strokeWeight(2.5);
  beginShape();
  for (var i = 0; i <= 80; i += 1) {
    var t = endTime * i / 80;
    vertex(mX - speedScale * data.v1 * t * scale, launchY + 0.5 * g * t * t * scale);
  }
  endShape();
  noFill();
  stroke("#dc2626");
  beginShape();
  for (i = 0; i <= 80; i += 1) {
    t = endTime * i / 80;
    vertex(nX + speedScale * data.v2 * t * scale, launchY + 0.5 * g * t * t * scale);
  }
  endShape();
  projectileTrainingBall(mX - speedScale * data.v1 * time * scale, launchY + 0.5 * g * time * time * scale, "#2563eb", "M");
  projectileTrainingBall(nX + speedScale * data.v2 * time * scale, launchY + 0.5 * g * time * time * scale, "#dc2626", "N");
  noStroke();
  fill("#f59e0b");
  circle(pointAX, pointAY, 10);
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("A", pointAX + 8, pointAY + 4);
  text("v₁ : v₂ = " + data.v1.toFixed(2) + " : " + data.v2.toFixed(2), 56, 418);
  text(speedScale > 1.5 ? "速度加倍：t/2 时在 A 正上方相遇" : "原速度：t 时共同到达 A", 56, 444);
}

function drawProjectileA08Graph() {
  var speedScale = getJsonParam(currentScene, "speedScale", 1);
  var originalTime = getJsonParam(currentScene, "time", 1.2);
  var currentTime = projectileTrainingProgress() * originalTime / speedScale;
  var frame = curveTrainingGraphBegin("时间—两球水平间距", "速度同乘 k 后，零点由 t 移到 t/k");
  projectileTrainingGraphLine(frame, 0, originalTime, -1.1, 1.1, "#2563eb", function (t) { return 1 - t / originalTime; });
  projectileTrainingGraphLine(frame, 0, originalTime, -1.1, 1.1, "#dc2626", function (t) { return 1 - 2 * t / originalTime; });
  curveTrainingMarker(frame, currentTime, 1 - speedScale * currentTime / originalTime, 0, originalTime, -1.1, 1.1, speedScale > 1.5 ? "#dc2626" : "#2563eb");
  curveTrainingGraphLabels(frame, "时间 τ / s", "有向水平间距 / 初始间距");
  curveTrainingLegend(frame.x + 12, frame.y + 18, "#2563eb", "原速度");
  curveTrainingLegend(frame.x + 150, frame.y + 18, "#dc2626", "速度加倍");
  curveTrainingGraphEnd();
}

function projectileConveyorData(beltSpeed, v0, mu) {
  var relative = Math.sqrt(beltSpeed * beltSpeed + v0 * v0);
  var acceleration = mu * 10;
  var ax = acceleration * beltSpeed / relative;
  var ay = -acceleration * v0 / relative;
  var endTime = relative / acceleration;
  return { relative: relative, ax: ax, ay: ay, endTime: endTime };
}

function drawProjectileB09Scene() {
  var beltSpeed = getJsonParam(currentScene, "beltSpeed", 4);
  var v0 = getJsonParam(currentScene, "v0", 5);
  var mu = getJsonParam(currentScene, "mu", 0.25);
  var data = projectileConveyorData(beltSpeed, v0, mu);
  var time = projectileTrainingProgress() * data.endTime;
  var xEnd = 0.5 * data.ax * data.endTime * data.endTime;
  var yEnd = v0 * data.endTime + 0.5 * data.ay * data.endTime * data.endTime;
  var scale = Math.min(310 / Math.max(xEnd, 0.1), 230 / Math.max(yEnd, 0.1));
  var startX = 100;
  var startY = 388;
  projectileTrainingTitle("粗糙传送带上的相对运动", "摩擦沿相对速度反方向，地面轨迹必为曲线");
  noStroke();
  fill("#e2e8f0");
  quad(62, 104, 500, 104, 536, 414, 62, 414);
  stroke("#64748b");
  strokeWeight(3);
  line(62, 104, 500, 104);
  line(62, 414, 536, 414);
  for (var a = 0; a < 5; a += 1) {
    drawArrow(120 + a * 82, 134, 168 + a * 82, 134, "#64748b");
  }
  noFill();
  stroke("#2563eb");
  strokeWeight(3);
  beginShape();
  for (var i = 0; i <= 100; i += 1) {
    var t = data.endTime * i / 100;
    vertex(startX + 0.5 * data.ax * t * t * scale, startY - (v0 * t + 0.5 * data.ay * t * t) * scale);
  }
  endShape();
  var bx = startX + 0.5 * data.ax * time * time * scale;
  var by = startY - (v0 * time + 0.5 * data.ay * time * time) * scale;
  noStroke();
  fill("#dc2626");
  rect(bx - 12, by - 12, 24, 24, 3);
  drawArrow(bx, by, bx + 54 * data.ax / Math.max(mu * 10, 0.1), by - 54 * data.ay / Math.max(mu * 10, 0.1), "#dc2626");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("传送带 v", 424, 112);
  text("共速时间 tc = " + data.endTime.toFixed(2) + " s", 58, 436);
  text("摩擦方向固定，速度方向持续转动", 282, 436);
}

function drawProjectileB09Graph() {
  var beltSpeed = getJsonParam(currentScene, "beltSpeed", 4);
  var v0 = getJsonParam(currentScene, "v0", 5);
  var mu = getJsonParam(currentScene, "mu", 0.25);
  var data = projectileConveyorData(beltSpeed, v0, mu);
  var currentTime = projectileTrainingProgress() * data.endTime;
  var yMax = Math.max(beltSpeed, v0) * 1.25;
  var frame = curveTrainingGraphBegin("时间—物块对地速率", "速率可先减小后增大，末值为传送带速度");
  projectileTrainingGraphLine(frame, 0, data.endTime, 0, yMax, "#2563eb", function (t) {
    var vx = data.ax * t;
    var vy = v0 + data.ay * t;
    return Math.sqrt(vx * vx + vy * vy);
  });
  var vxNow = data.ax * currentTime;
  var vyNow = v0 + data.ay * currentTime;
  curveTrainingMarker(frame, currentTime, Math.sqrt(vxNow * vxNow + vyNow * vyNow), 0, data.endTime, 0, yMax, "#dc2626");
  curveTrainingGraphLabels(frame, "时间 t / s", "对地速率 / (m/s)");
  curveTrainingGraphEnd();
}

function projectileArcGameData(height, angleDeg, g) {
  var sourceTrig = Math.abs(angleDeg - 37) < 0.001;
  var sinPhi = sourceTrig ? 0.6 : Math.sin(angleDeg * Math.PI / 180);
  var cosPhi = sourceTrig ? 0.8 : Math.cos(angleDeg * Math.PI / 180);
  var tanPhi = sinPhi / cosPhi;
  var phi = Math.atan2(sinPhi, cosPhi);
  var denominator = sinPhi * (1 - cosPhi);
  var radius = 2 * height * cosPhi / Math.max(0.001, denominator);
  var x = radius * (1 + cosPhi);
  var y = height + radius * sinPhi;
  var speed = Math.sqrt(g * x / Math.max(0.001, tanPhi));
  var time = x / speed;
  return { phi: phi, sinPhi: sinPhi, cosPhi: cosPhi, radius: radius, x: x, y: y, speed: speed, time: time };
}

function drawProjectileB10Scene() {
  var height = getJsonParam(currentScene, "launchHeight", 0.15);
  var angle = getJsonParam(currentScene, "angle", 37);
  var g = getJsonParam(currentScene, "g", 10);
  var data = projectileArcGameData(height, angle, g);
  var radiusPx = 128;
  var scale = radiusPx / data.radius;
  var bX = 116;
  var baseY = 142;
  var oX = bX + radiusPx;
  var pX = oX + radiusPx * data.cosPhi;
  var pY = baseY + radiusPx * data.sinPhi;
  var launchY = baseY - height * scale;
  var time = projectileTrainingProgress() * data.time;
  projectileTrainingTitle("半圆小孔径向通关", "速度沿 OP 时，弹丸垂直于 P 点圆弧切线");
  noFill();
  stroke("#64748b");
  strokeWeight(4);
  arc(oX, baseY, 2 * radiusPx, 2 * radiusPx, 0, Math.PI);
  stroke("#334155");
  line(bX, launchY - 58, bX, baseY);
  noStroke();
  fill("#334155");
  rect(bX - 16, launchY - 12, 28, 24, 3);
  projectileTrainingPath(bX, launchY, data.time, scale, scale, "#2563eb", function (t) { return data.speed * t; }, function (t) { return 0.5 * g * t * t; });
  projectileTrainingBall(bX + data.speed * time * scale, launchY + 0.5 * g * time * time * scale, "#dc2626", "");
  stroke("#f59e0b");
  strokeWeight(2);
  line(oX, baseY, pX, pY);
  var tangent = data.phi + Math.PI / 2;
  line(pX - 38 * Math.cos(tangent), pY - 38 * Math.sin(tangent), pX + 38 * Math.cos(tangent), pY + 38 * Math.sin(tangent));
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(13);
  text("B", bX - 24, baseY - 5);
  text("O", oX - 5, baseY - 24);
  text("P", pX + 8, pY + 2);
  text("R = " + data.radius.toFixed(2) + " m", 64, 414);
  text("v₀ = " + data.speed.toFixed(2) + " m/s", 306, 414);
}

function drawProjectileB10Graph() {
  var height = getJsonParam(currentScene, "launchHeight", 0.15);
  var angle = getJsonParam(currentScene, "angle", 37);
  var g = getJsonParam(currentScene, "g", 10);
  var yMax = projectileArcGameData(height, 25, g).radius * 1.05;
  var frame = curveTrainingGraphBegin("圆心角—所需半径", "射口高度固定时，角度越小所需圆弧越大");
  projectileTrainingGraphLine(frame, 25, 50, 0, yMax, "#2563eb", function (phi) { return projectileArcGameData(height, phi, g).radius; });
  curveTrainingMarker(frame, angle, projectileArcGameData(height, angle, g).radius, 25, 50, 0, yMax, "#dc2626");
  curveTrainingGraphLabels(frame, "OP 与水平夹角 φ / °", "圆弧半径 R / m");
  curveTrainingGraphEnd();
}

function projectileSkiData(angleDeg, speed, g) {
  var angle = angleDeg * Math.PI / 180;
  var time = 2 * speed * Math.tan(angle) / g;
  return { angle: angle, time: time, x: speed * time, y: 0.5 * g * time * time };
}

function drawProjectileB11Scene() {
  var angleDeg = getJsonParam(currentScene, "angle", 32);
  var speed = getJsonParam(currentScene, "v0", 10);
  var g = getJsonParam(currentScene, "g", 10);
  var data = projectileSkiData(angleDeg, speed, g);
  var startX = 72;
  var startY = 98;
  var scale = Math.min(410 / data.x, 280 / data.y);
  var time = projectileTrainingProgress() * data.time;
  var endX = startX + data.x * scale;
  var endY = startY + data.y * scale;
  projectileTrainingTitle("跳台滑雪落斜面", "到斜面的法向距离在飞行时间中点最大");
  stroke("#64748b");
  strokeWeight(5);
  line(startX - 20, startY - 20 * Math.tan(data.angle), endX + 35, endY + 35 * Math.tan(data.angle));
  projectileTrainingPath(startX, startY, data.time, scale, scale, "#2563eb", function (t) { return speed * t; }, function (t) { return 0.5 * g * t * t; });
  var bx = startX + speed * time * scale;
  var by = startY + 0.5 * g * time * time * scale;
  projectileTrainingBall(bx, by, "#dc2626", "");
  drawArrow(bx, by, bx + 52, by + 52 * g * time / Math.max(speed, 0.1), "#dc2626");
  var midT = data.time / 2;
  var midX = startX + speed * midT * scale;
  var midY = startY + 0.5 * g * midT * midT * scale;
  var slopeYAtMid = startY + speed * midT * Math.tan(data.angle) * scale;
  curveTrainingDashedLine(midX, midY, midX - (slopeYAtMid - midY) * Math.sin(data.angle) * Math.cos(data.angle), midY + (slopeYAtMid - midY) * Math.cos(data.angle) * Math.cos(data.angle), "#f59e0b");
  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(13);
  text("O", startX - 22, startY - 8);
  text("A", endX + 8, endY - 8);
  text("T = " + data.time.toFixed(2) + " s", 60, 420);
  text("dmax = " + (g * data.time * data.time * Math.cos(data.angle) / 8).toFixed(2) + " m", 286, 420);
}

function drawProjectileB11Graph() {
  var angleDeg = getJsonParam(currentScene, "angle", 32);
  var speed = getJsonParam(currentScene, "v0", 10);
  var g = getJsonParam(currentScene, "g", 10);
  var data = projectileSkiData(angleDeg, speed, g);
  var currentTime = projectileTrainingProgress() * data.time;
  var dMax = g * data.time * data.time * Math.cos(data.angle) / 8;
  var frame = curveTrainingGraphBegin("时间—距斜面法向距离", "零点为 0、T，顶点位于 T/2");
  projectileTrainingGraphLine(frame, 0, data.time, 0, dMax * 1.15, "#2563eb", function (t) {
    return speed * t * Math.sin(data.angle) - 0.5 * g * t * t * Math.cos(data.angle);
  });
  var currentD = speed * currentTime * Math.sin(data.angle) - 0.5 * g * currentTime * currentTime * Math.cos(data.angle);
  curveTrainingMarker(frame, currentTime, currentD, 0, data.time, 0, dMax * 1.15, "#dc2626");
  curveTrainingGraphLabels(frame, "时间 t / s", "法向距离 d / m");
  curveTrainingGraphEnd();
}
