// Lunar vertical-throw scene used by the gravitation chapter.
function getGravitationLunarThrowValues() {
  var v0 = Math.max(0.1, getJsonParam(currentScene, "v0", 8));
  var height = Math.max(0.1, getJsonParam(currentScene, "height", 20));
  var moonRadiusKm = Math.max(1, getJsonParam(currentScene, "moonRadius", 1737));
  var ropeLength = Math.max(0.1, getJsonParam(currentScene, "ropeLength", 5));
  var gravity = v0 * v0 / (2 * height);
  var duration = 2 * v0 / gravity;
  var peakTime = v0 / gravity;
  var radiusM = moonRadiusKm * 1000;
  var gravityConstant = 6.67e-11;
  var moonMass = gravity * radiusM * radiusM / gravityConstant;
  var density = 3 * gravity / (4 * Math.PI * gravityConstant * radiusM);
  var minCircleSpeed = Math.sqrt(gravity * ropeLength);
  return {
    v0: v0,
    height: height,
    moonRadiusKm: moonRadiusKm,
    ropeLength: ropeLength,
    gravity: gravity,
    duration: duration,
    peakTime: peakTime,
    moonMass: moonMass,
    density: density,
    minCircleSpeed: minCircleSpeed
  };
}

function getGravitationLunarThrowPosition(values, time) {
  var t = constrain(time, 0, values.duration);
  return {
    time: t,
    height: Math.max(0, values.v0 * t - 0.5 * values.gravity * t * t),
    velocity: values.v0 - values.gravity * t
  };
}

function drawGravitationLunarThrowScene() {
  var values = getGravitationLunarThrowValues();
  var state = getJsonAnimationState(currentScene);
  var motion = getGravitationLunarThrowPosition(values, state.time);
  var launchX = 218;
  var surfaceY = 388;
  var peakY = 152;
  var ballY = map(motion.height, 0, values.height, surfaceY, peakY);
  var circleX = 458;
  var circleY = 270;
  var circleR = 64;

  noStroke();
  fill("#f8fafc");
  rect(0, 0, 570, 500);

  noFill();
  stroke("#cbd5e1");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(launchX, surfaceY, launchX, peakY);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#e2e8f0");
  circle(255, 735, 700);
  fill("#cbd5e1");
  circle(154, 412, 28);
  circle(320, 430, 42);
  fill("#94a3b8");
  circle(154, 412, 12);
  circle(320, 430, 18);

  noStroke();
  fill("#2563eb");
  circle(launchX, ballY, 22);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(12);
  text("m", launchX, ballY);

  var velocityArrow = constrain(Math.abs(motion.velocity) * 8, 18, 72);
  if (Math.abs(motion.velocity) > 0.08) {
    drawArrow(
      launchX + 18,
      ballY,
      launchX + 18,
      ballY + (motion.velocity > 0 ? -velocityArrow : velocityArrow),
      motion.velocity > 0 ? "#16a34a" : "#dc2626"
    );
  }

  noStroke();
  fill("#0f172a");
  textAlign(LEFT, TOP);
  textSize(17);
  text("月面竖直上抛", 28, 24);
  fill("#334155");
  textSize(14);
  text("g = v₀² / (2h) = " + values.gravity.toFixed(2) + " m/s²", 28, 54);
  text("t = " + motion.time.toFixed(2) + " s", 28, 80);
  text("y = " + motion.height.toFixed(2) + " m", 28, 104);
  text("v = " + motion.velocity.toFixed(2) + " m/s", 28, 128);

  noFill();
  stroke("#64748b");
  strokeWeight(2);
  circle(circleX, circleY, circleR * 2);
  line(circleX, circleY, circleX, circleY - circleR);
  noStroke();
  fill("#f97316");
  circle(circleX, circleY - circleR, 20);
  drawArrow(circleX + 12, circleY - circleR, circleX + 66, circleY - circleR, "#f97316");
  noStroke();
  fill("#0f172a");
  textAlign(CENTER, TOP);
  textSize(14);
  text("最高点临界：T = 0", circleX, circleY + circleR + 12);
  text("vmin = √(gL) = " + values.minCircleSpeed.toFixed(2) + " m/s", circleX, circleY + circleR + 35);

  fill("#475569");
  textAlign(LEFT, TOP);
  textSize(13);
  text("蓝球：上抛与回落    橙球：竖直圆周最高点临界条件", 28, 458);
}

function drawGravitationLunarThrowGraph() {
  var values = getGravitationLunarThrowValues();
  var state = getJsonAnimationState(currentScene);
  var gx = graphLeft + 54;
  var gy = 84;
  var gw = graphRight - gx - 32;
  var gh = 292;
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("月面上抛高度—时间图", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("y = v₀t - 1/2 gt²；峰值为题给高度 h", graphLeft + 24, 48);

  drawBasicGrid(gx, gy, gw, gh);
  drawGraphTicks(gx, gy, gw, gh, values.duration, values.height, "s");

  noFill();
  stroke("#2563eb");
  strokeWeight(3);
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t = values.duration * i / 120;
    var point = getGravitationLunarThrowPosition(values, t);
    vertex(map(t, 0, values.duration, gx, gx + gw), map(point.height, 0, values.height, gy + gh, gy));
  }
  endShape();

  var current = getGravitationLunarThrowPosition(values, state.time);
  var currentX = map(current.time, 0, values.duration, gx, gx + gw);
  var currentY = map(current.height, 0, values.height, gy + gh, gy);
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);
  noStroke();
  fill("#dc2626");
  circle(currentX, currentY, 12);

  fill("#0f172a");
  textAlign(LEFT, TOP);
  textSize(12);
  text("最高点 (" + values.peakTime.toFixed(2) + " s, " + values.height.toFixed(1) + " m)", gx + 8, gy + 8);
  text("M月 = " + values.moonMass.toExponential(2) + " kg", gx + 8, gy + gh + 38);
  text("ρ月 = " + values.density.toFixed(0) + " kg/m³", gx + 190, gy + gh + 38);
}

registerSceneRenderer("gravitation_lunar_throw", drawGravitationLunarThrowScene, drawGravitationLunarThrowGraph);
