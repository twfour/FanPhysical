function physYToScreen(y) {
  return originY - y;
}

function kickSpring() {
  springY = springInitialY;
  springV = 0;
  springData = [];
  springStable = false;
}

function updateSpring(dt) {
  if (springStable) {
    return;
  }

  var accel = (-springK * springY - springC * springV) / springM;
  springV += accel * dt;
  springY += springV * dt;

  if (Math.abs(springV) < 0.5 && Math.abs(springY) < 2) {
    springY = 0;
    springV = 0;
    springStable = true;
  }

  springData.push({ t: simTime, v: springY });
  trimData(springData);
}

function drawSpringScene() {
  var anchorX = originX;
  var anchorY = 70;
  var ballX = originX;
  var ballY = physYToScreen(springY);
  var coils = 12;
  var springAmp = 24;
  var i;

  stroke("#111827");
  strokeWeight(4);
  line(anchorX - 70, anchorY, anchorX + 70, anchorY);

  stroke("#64748b");
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(anchorX, anchorY);
  for (i = 0; i <= coils; i++) {
    var p = i / coils;
    var x = anchorX + (i % 2 === 0 ? -springAmp : springAmp);
    var y = anchorY + p * (ballY - anchorY - 34);
    vertex(x, y);
  }
  vertex(ballX, ballY - 34);
  endShape();

  stroke("#cbd5e1");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(originX - 110, originY, originX + 110, originY);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#dc2626");
  circle(ballX, ballY, 56);

  noStroke();
  fill("#991b1b");
  circle(ballX - 12, ballY - 12, 12);

  noStroke();
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(15);
  text("竖直弹簧振子", 285, 430);

  noStroke();
  fill("#334155");
  textSize(15);
  text("红球相对平衡点的位移 y = " + springY.toFixed(1), 285, 454);
}

function resetPendulum() {
  pendulumTheta = pendulumTheta0 * Math.PI / 180;
  pendulumOmega = 0;
  pendulumData = [];
  pendulumStable = false;
  updateLabels();
}

function updatePendulum(dt) {
  if (pendulumStable) {
    return;
  }

  var accel = -(pendulumG * 55 / pendulumL) * Math.sin(pendulumTheta) - pendulumDamping * pendulumOmega;
  pendulumOmega += accel * dt;
  pendulumTheta += pendulumOmega * dt;

  if (Math.abs(pendulumOmega) < 0.02 && Math.abs(pendulumTheta) < 0.02) {
    pendulumTheta = 0;
    pendulumOmega = 0;
    pendulumStable = true;
  }

  pendulumData.push({ t: simTime, v: pendulumTheta });
  trimData(pendulumData);
}

function drawPendulumScene() {
  var pivotX = originX;
  var pivotY = originY;
  var bobX = pivotX + pendulumL * Math.sin(pendulumTheta);
  var bobY = pivotY + pendulumL * Math.cos(pendulumTheta);

  stroke("#111827");
  strokeWeight(4);
  line(pivotX - 75, pivotY - 16, pivotX + 75, pivotY - 16);

  stroke("#475569");
  strokeWeight(3);
  line(pivotX, pivotY, bobX, bobY);

  stroke("#cbd5e1");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(pivotX, pivotY, pivotX, pivotY + Math.min(250, pendulumL + 28));
  drawingContext.setLineDash([]);

  noStroke();
  fill("#2563eb");
  circle(bobX, bobY, 46);

  noStroke();
  fill("#bfdbfe");
  circle(bobX - 9, bobY - 9, 10);

  noStroke();
  fill("#111827");
  circle(pivotX, pivotY, 12);

  noFill();
  stroke("#d97706");
  strokeWeight(2);
  arc(pivotX, pivotY, 80, 80, Math.PI / 2 - Math.abs(pendulumTheta), Math.PI / 2 + Math.abs(pendulumTheta));

  noStroke();
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(15);
  text("单摆", 285, 430);

  noStroke();
  fill("#334155");
  textSize(15);
  text("当前角度 θ = " + (pendulumTheta * 180 / Math.PI).toFixed(1) + "°", 285, 454);
}

function resetBrownian() {
  particles = [];
  trackedTrail = [];
  brownianData = [];
  trackedIndex = Math.min(trackedIndex, brownianN - 1);

  var i;
  for (i = 0; i < brownianN; i++) {
    particles.push({
      x: random(80, 520),
      y: random(80, 420)
    });
  }
  updateLabels();
}

function switchTrackedParticle() {
  if (particles.length === 0) {
    return;
  }
  trackedIndex = (trackedIndex + 1) % particles.length;
  trackedTrail = [];
  brownianData = [];
}

function updateBrownian(dt) {
  var i;
  var stepScale = Math.sqrt(brownianT) * 48;

  for (i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.x += randomGaussian() * stepScale * dt;
    p.y += randomGaussian() * stepScale * dt;

    if (p.x < 55) {
      p.x = 55;
    }
    if (p.x > 535) {
      p.x = 535;
    }
    if (p.y < 55) {
      p.y = 55;
    }
    if (p.y > 445) {
      p.y = 445;
    }
  }

  var tp = particles[trackedIndex];
  if (tp) {
    trackedTrail.push({ x: tp.x, y: tp.y });
    if (trackedTrail.length > 260) {
      trackedTrail.shift();
    }
    brownianData.push({ t: simTime, v: tp.x - originX });
    trimData(brownianData);
  }
}

function drawBrownianScene() {
  var i;

  noFill();
  stroke("#111827");
  strokeWeight(3);
  rect(50, 50, 490, 400, 4);

  noStroke();
  for (i = 0; i < particles.length; i++) {
    if (i !== trackedIndex) {
      fill("#64748b");
      circle(particles[i].x, particles[i].y, 6);
    }
  }

  noFill();
  stroke("#0f766e");
  strokeWeight(2);
  beginShape();
  for (i = 0; i < trackedTrail.length; i++) {
    vertex(trackedTrail[i].x, trackedTrail[i].y);
  }
  endShape();

  var tp = particles[trackedIndex];
  if (tp) {
    noStroke();
    fill("#f97316");
    circle(tp.x, tp.y, 18);

    noStroke();
    fill("#7c2d12");
    circle(tp.x - 4, tp.y - 4, 5);
  }

  noStroke();
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(15);
  text("布朗运动", 285, 430);

  noStroke();
  fill("#334155");
  textSize(15);
  text("橙色粒子被追踪，轨迹实时保留", 285, 454);
}


