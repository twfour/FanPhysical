function riverVX() {
  return riverWaterSpeed + riverBoatSpeed * Math.cos(riverTheta * Math.PI / 180);
}

function riverVY() {
  return riverBoatSpeed * Math.sin(riverTheta * Math.PI / 180);
}

function riverArriveTime() {
  var vy = Math.max(0.25, riverVY());
  return riverWidth / vy;
}

function riverDrift() {
  return riverVX() * riverArriveTime();
}

function riverMinDisplacementAngle() {
  if (riverBoatSpeed <= riverWaterSpeed) {
    return null;
  }
  return Math.acos(-riverWaterSpeed / riverBoatSpeed) * 180 / Math.PI;
}

function toggleRiverPlay() {
  if (!riverPlaying && riverT >= riverArriveTime() - 0.02) {
    riverT = 0;
  }
  riverPlaying = !riverPlaying;
  updateLabels();
}


function updateRiver(dt) {
  if (riverPlaying) {
    riverT += dt * 4;
    if (riverT >= riverArriveTime()) {
      riverT = 0;
      riverPlaying = false;
    }
    updateLabels();
  }
}

function drawRiverScene() {
  var bankLeft = 82;
  var bankRight = 530;
  var nearY = 388;
  var farY = 92;
  var startX = 170;
  var scale = (nearY - farY) / riverWidth;
  var tNow = Math.min(riverT, riverArriveTime());
  var vx = riverVX();
  var vy = riverVY();
  var boatX = startX + vx * tNow * scale;
  var boatY = nearY - vy * tNow * scale;
  var endX = startX + riverDrift() * scale;
  var minTheta = riverMinDisplacementAngle();
  var bestText = minTheta === null ? "船速小于等于水速，无法垂直到岸" : "最小位移角 θ≈" + minTheta.toFixed(0) + "°";

  noStroke();
  fill("#e0f2fe");
  rect(bankLeft, farY, bankRight - bankLeft, nearY - farY, 10);

  stroke("#111827");
  strokeWeight(3);
  line(bankLeft, nearY, bankRight, nearY);
  line(bankLeft, farY, bankRight, farY);

  stroke("#bae6fd");
  strokeWeight(1);
  for (var i = 0; i < 7; i++) {
    var streamY = farY + 35 + i * 36;
    line(bankLeft + 22, streamY, bankRight - 28, streamY);
    drawArrow(bankRight - 46, streamY, bankRight - 24, streamY, "#38bdf8");
  }

  stroke("#2563eb");
  strokeWeight(3);
  noFill();
  beginShape();
  for (i = 0; i <= 80; i++) {
    var t = i * riverArriveTime() / 80;
    var px = startX + vx * t * scale;
    var py = nearY - vy * t * scale;
    vertex(px, py);
  }
  endShape();

  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(startX, nearY, startX, farY);
  line(endX, farY, endX, nearY);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#111827");
  circle(startX, nearY, 8);
  fill("#f97316");
  circle(endX, farY, 8);

  push();
  translate(boatX, boatY);
  rotate(Math.atan2(-vy, vx));
  noStroke();
  fill("#0f766e");
  triangle(18, 0, -16, -10, -16, 10);
  fill("#ccfbf1");
  ellipse(-4, 0, 16, 10);
  pop();

  drawVectorArrow(boatX, boatY, riverBoatSpeed * Math.cos(riverTheta * Math.PI / 180) * 11, -riverBoatSpeed * Math.sin(riverTheta * Math.PI / 180) * 11, "#0f766e", "v船");
  drawVectorArrow(boatX, boatY, riverWaterSpeed * 11, 0, "#0284c7", "v水");
  drawVectorArrow(boatX, boatY, vx * 11, -vy * 11, "#f97316", "v合");

}

function drawVectorArrow(x, y, dx, dy, colorHex, labelText) {
  var len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) {
    return;
  }
  stroke(colorHex);
  strokeWeight(2.5);
  line(x, y, x + dx, y + dy);
  drawArrow(x + dx * 0.72, y + dy * 0.72, x + dx, y + dy, colorHex);
  noStroke();
  fill(colorHex);
  textAlign(LEFT, CENTER);
  textSize(12);
  text(labelText, x + dx + 6, y + dy);
}

function drawRiverGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var tMax = Math.max(1, riverArriveTime());
  var driftAbs = Math.abs(riverDrift());
  var xMin = Math.min(0, riverDrift()) - Math.max(15, driftAbs * 0.15);
  var xMax = Math.max(0, riverDrift()) + Math.max(15, driftAbs * 0.15);
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("下游偏移-时间图像 x(t)", graphLeft + 24, 20);
  fill("#5b6472");
  textSize(12);
  text("横轴：时间 t / s；纵轴：下游偏移 x / m", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);
  stroke("#e5e7eb");
  for (i = 0; i <= 4; i++) {
    line(gx, gy + i * gh / 4, gx + gw, gy + i * gh / 4);
    line(gx + i * gw / 4, gy, gx + i * gw / 4, gy + gh);
  }

  noStroke();
  fill("#5b6472");
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (i = 0; i <= 4; i++) {
    var valX = map(i, 0, 4, xMax, xMin);
    text(valX.toFixed(0), gx - 8, gy + i * gh / 4);
  }
  textAlign(CENTER, TOP);
  for (i = 0; i <= 4; i++) {
    text((i * tMax / 4).toFixed(1) + "s", gx + i * gw / 4, gy + gh + 10);
  }

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var t = i * tMax / 120;
    var x = riverVX() * t;
    vertex(map(t, 0, tMax, gx, gx + gw), map(x, xMin, xMax, gy + gh, gy));
  }
  endShape();

  var currentX = map(Math.min(riverT, tMax), 0, tMax, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(12);
  text("过河进度", gx + 10, gy + 10);
  text("下游偏移", gx + 10, gy + 28);
}


function rainAngle() {
  return Math.atan2(rainTrainV, rainDropV) * 180 / Math.PI;
}

function drawRainScene() {
  var winX = 90;
  var winY = 70;
  var winW = 390;
  var winHLocal = 310;
  var relX = -rainTrainV;
  var relY = rainDropV;
  var len = Math.sqrt(relX * relX + relY * relY);
  var ux = relX / Math.max(1, len);
  var uy = relY / Math.max(1, len);
  var i;

  noStroke();
  fill("#e0f2fe");
  rect(winX, winY, winW, winHLocal, 10);
  fill("#f8fafc");
  rect(winX + 18, winY + 18, winW - 36, winHLocal - 36, 8);

  stroke("#111827");
  strokeWeight(4);
  noFill();
  rect(winX, winY, winW, winHLocal, 10);
  line(winX + winW / 2, winY, winX + winW / 2, winY + winHLocal);

  stroke("#38bdf8");
  strokeWeight(2);
  for (i = 0; i < rainDensity * 3; i++) {
    var baseX = winX + 35 + ((i * 73 + simTime * rainTrainV * 16) % (winW - 70));
    var baseY = winY + 28 + ((i * 47 + simTime * rainDropV * 18) % (winHLocal - 56));
    line(baseX, baseY, baseX - ux * 38, baseY - uy * 38);
  }

  drawVectorArrow(305, 420, rainTrainV * 3, 0, "#2563eb", "v车");
  drawVectorArrow(305, 420, 0, rainDropV * 3, "#0f766e", "v雨");
  drawVectorArrow(305, 420, -rainTrainV * 3, rainDropV * 3, "#f97316", "v相");

  noStroke();
  fill("#5b6472");
  textAlign(LEFT, TOP);
  textSize(12);
  text("车窗视角", winX + 16, winY + 14);
  text("θ=" + rainAngle().toFixed(1) + "°", 342, 394);
}

function drawRainGraph() {
  var cx = graphLeft + 210;
  var cy = 258;
  var scale = 6;
  var maxLen = Math.max(1, Math.sqrt(rainTrainV * rainTrainV + rainDropV * rainDropV));
  if (maxLen * scale > 160) {
    scale = 160 / maxLen;
  }

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("相对速度矢量图", graphLeft + 24, 20);
  fill("#5b6472");
  textSize(12);
  text("橙色：乘客看到的雨滴速度", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  line(cx - 170, cy, cx + 170, cy);
  line(cx, cy - 170, cx, cy + 170);

  drawVectorArrow(cx, cy, rainTrainV * scale, 0, "#2563eb", "v车");
  drawVectorArrow(cx, cy, 0, rainDropV * scale, "#0f766e", "v雨");
  drawVectorArrow(cx, cy, -rainTrainV * scale, rainDropV * scale, "#f97316", "v相");

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(12);
  text("夹角 θ=" + rainAngle().toFixed(1) + "°", graphLeft + 30, 420);
}


function curveForcePoint() {
  var u = forcePoint;
  var x = 85 + 430 * u;
  var y = 360 - 210 * Math.sin(u * Math.PI * 0.92);
  var dx = 430;
  var dy = -210 * Math.PI * 0.92 * Math.cos(u * Math.PI * 0.92);
  var len = Math.sqrt(dx * dx + dy * dy);
  var tx = dx / len;
  var ty = dy / len;
  var nx = -ty;
  var ny = tx;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  return { x: x, y: y, tx: tx, ty: ty, nx: nx, ny: ny };
}

function drawCurveForceScene() {
  var p = curveForcePoint();
  var i;

  stroke("#2563eb");
  strokeWeight(3);
  noFill();
  beginShape();
  for (i = 0; i <= 120; i++) {
    var u = i / 120;
    vertex(85 + 430 * u, 360 - 210 * Math.sin(u * Math.PI * 0.92));
  }
  endShape();

  noStroke();
  fill("#f97316");
  circle(p.x, p.y, 24);
  fill("#ffedd5");
  circle(p.x - 5, p.y - 5, 7);

  drawVectorArrow(p.x, p.y, p.tx * 78, p.ty * 78, "#2563eb", "v");
  drawVectorArrow(p.x, p.y, p.nx * forceNormal, p.ny * forceNormal, "#dc2626", "Fn");
  drawVectorArrow(p.x, p.y, p.tx * forceTangential, p.ty * forceTangential, "#0f766e", "Ft");
  drawVectorArrow(p.x, p.y, p.nx * forceNormal + p.tx * forceTangential, p.ny * forceNormal + p.ty * forceTangential, "#111827", "F");

  noStroke();
  fill("#5b6472");
  textAlign(LEFT, TOP);
  textSize(12);
  text(forceTangential >= 0 ? "加速" : "减速", p.x + 36, p.y + 28);
}

function drawCurveForceGraph() {
  var cx = graphLeft + 210;
  var cy = 260;
  var p = curveForcePoint();
  var scale = 1.35;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("力的分解示意", graphLeft + 24, 20);
  fill("#5b6472");
  textSize(12);
  text("红：法向；绿：切向；黑：合力", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  line(cx - 165, cy, cx + 165, cy);
  line(cx, cy - 165, cx, cy + 165);

  drawVectorArrow(cx, cy, p.nx * forceNormal * scale, p.ny * forceNormal * scale, "#dc2626", "Fn");
  drawVectorArrow(cx, cy, p.tx * forceTangential * scale, p.ty * forceTangential * scale, "#0f766e", "Ft");
  drawVectorArrow(cx, cy, (p.nx * forceNormal + p.tx * forceTangential) * scale, (p.ny * forceNormal + p.ty * forceTangential) * scale, "#111827", "F");
}

function composeX(t) {
  return composeVx0 * t + 0.5 * composeAx * t * t;
}

function composeY(t) {
  return composeVy0 * t + 0.5 * composeAy * t * t;
}

function toggleComposePlay() {
  if (!composePlaying && composeT >= composeMaxT - 0.02) {
    composeT = 0;
  }
  composePlaying = !composePlaying;
  updateLabels();
}


function updateCompose(dt) {
  if (composePlaying) {
    composeT += dt;
    if (composeT >= composeMaxT) {
      composeT = 0;
      composePlaying = false;
    }
    updateLabels();
  }
}

function drawComposeScene() {
  var minX = 0;
  var maxX = 1;
  var minY = 0;
  var maxY = 1;
  var i;
  for (i = 0; i <= 120; i++) {
    var tScan = i * composeMaxT / 120;
    minX = Math.min(minX, composeX(tScan));
    maxX = Math.max(maxX, composeX(tScan));
    minY = Math.min(minY, composeY(tScan));
    maxY = Math.max(maxY, composeY(tScan));
  }
  var sx = 430 / Math.max(1, maxX - minX);
  var sy = 320 / Math.max(1, maxY - minY);
  var scale = Math.min(sx, sy);
  var baseX = 92 - minX * scale;
  var baseY = 405 + minY * scale;
  var tNow = Math.min(composeT, composeMaxT);
  var ballX = baseX + composeX(tNow) * scale;
  var ballY = baseY - composeY(tNow) * scale;

  stroke("#cbd5e1");
  strokeWeight(1);
  line(60, baseY, 540, baseY);
  line(baseX, 58, baseX, 430);

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 160; i++) {
    var t = i * composeMaxT / 160;
    vertex(baseX + composeX(t) * scale, baseY - composeY(t) * scale);
  }
  endShape();

  noStroke();
  fill("#f97316");
  circle(ballX, ballY, 24);
  fill("#ffedd5");
  circle(ballX - 5, ballY - 5, 7);

  drawVectorArrow(ballX, ballY, (composeVx0 + composeAx * tNow) * 2.2, -(composeVy0 + composeAy * tNow) * 2.2, "#2563eb", "v");
  drawVectorArrow(ballX, ballY, composeAx * 8, -composeAy * 8, "#dc2626", "a");
}

function drawComposeGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var maxAbs = 1;
  var i;
  for (i = 0; i <= 120; i++) {
    var tScan = i * composeMaxT / 120;
    maxAbs = Math.max(maxAbs, Math.abs(composeX(tScan)), Math.abs(composeY(tScan)));
  }

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("分运动位移图像", graphLeft + 24, 20);
  fill("#5b6472");
  textSize(12);
  text("蓝线：x 分运动；红线：y 分运动", graphLeft + 24, 44);

  drawBasicGrid(gx, gy, gw, gh);
  stroke("#94a3b8");
  strokeWeight(1);
  line(gx, map(0, -maxAbs, maxAbs, gy + gh, gy), gx + gw, map(0, -maxAbs, maxAbs, gy + gh, gy));

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 160; i++) {
    var tx = i * composeMaxT / 160;
    vertex(map(tx, 0, composeMaxT, gx, gx + gw), map(composeX(tx), -maxAbs, maxAbs, gy + gh, gy));
  }
  endShape();

  stroke("#dc2626");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 160; i++) {
    var ty = i * composeMaxT / 160;
    vertex(map(ty, 0, composeMaxT, gx, gx + gw), map(composeY(ty), -maxAbs, maxAbs, gy + gh, gy));
  }
  endShape();

  drawTimeMarker(gx, gy, gw, gh, composeT, composeMaxT);
}

function advRiverVX() {
  return advWaterSpeed + advBoatSpeed * Math.cos(advRiverTheta * Math.PI / 180);
}

function advRiverVY() {
  return advBoatSpeed * Math.sin(advRiverTheta * Math.PI / 180);
}

function advRiverArriveTime() {
  return advRiverWidth / Math.max(0.25, advRiverVY());
}

function advRiverBestTheta() {
  if (advBoatSpeed >= advWaterSpeed) {
    return Math.acos(-advWaterSpeed / advBoatSpeed) * 180 / Math.PI;
  }
  return Math.acos(-advBoatSpeed / advWaterSpeed) * 180 / Math.PI;
}

function toggleAdvRiverPlay() {
  if (!advRiverPlaying && advRiverT >= advRiverArriveTime() - 0.02) {
    advRiverT = 0;
  }
  advRiverPlaying = !advRiverPlaying;
  updateLabels();
}


function updateAdvRiver(dt) {
  if (advRiverPlaying) {
    advRiverT += dt * 4;
    if (advRiverT >= advRiverArriveTime()) {
      advRiverT = 0;
      advRiverPlaying = false;
    }
    updateLabels();
  }
}

function drawAdvRiverScene() {
  var bankLeft = 82;
  var bankRight = 530;
  var nearY = 388;
  var farY = 92;
  var startX = 170;
  var scale = (nearY - farY) / advRiverWidth;
  var tNow = Math.min(advRiverT, advRiverArriveTime());
  var vx = advRiverVX();
  var vy = advRiverVY();
  var boatX = startX + vx * tNow * scale;
  var boatY = nearY - vy * tNow * scale;
  var i;

  noStroke();
  fill("#e0f2fe");
  rect(bankLeft, farY, bankRight - bankLeft, nearY - farY, 10);

  stroke("#111827");
  strokeWeight(3);
  line(bankLeft, nearY, bankRight, nearY);
  line(bankLeft, farY, bankRight, farY);

  stroke("#bae6fd");
  strokeWeight(1);
  for (i = 0; i < 7; i++) {
    var streamY = farY + 35 + i * 36;
    line(bankLeft + 22, streamY, bankRight - 28, streamY);
    drawArrow(bankRight - 46, streamY, bankRight - 24, streamY, "#38bdf8");
  }

  stroke("#2563eb");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (i = 0; i <= 90; i++) {
    var t = i * advRiverArriveTime() / 90;
    vertex(startX + vx * t * scale, nearY - vy * t * scale);
  }
  endShape();

  push();
  translate(boatX, boatY);
  rotate(Math.atan2(-vy, vx));
  noStroke();
  fill("#0f766e");
  triangle(18, 0, -16, -10, -16, 10);
  fill("#ccfbf1");
  ellipse(-4, 0, 16, 10);
  pop();

  drawVectorArrow(boatX, boatY, advBoatSpeed * Math.cos(advRiverTheta * Math.PI / 180) * 13, -advBoatSpeed * Math.sin(advRiverTheta * Math.PI / 180) * 13, "#0f766e", "v船");
  drawVectorArrow(boatX, boatY, advWaterSpeed * 13, 0, "#0284c7", "v水");
  drawVectorArrow(boatX, boatY, vx * 13, -vy * 13, "#f97316", "v合");
}

function drawAdvRiverGraph() {
  var cx = graphLeft + 210;
  var cy = 260;
  var scale = 34;
  var best = advRiverBestTheta();
  var bx = advWaterSpeed + advBoatSpeed * Math.cos(best * Math.PI / 180);
  var by = advBoatSpeed * Math.sin(best * Math.PI / 180);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("速度圆与临界方向", graphLeft + 24, 20);
  fill("#5b6472");
  textSize(12);
  text(advBoatSpeed < advWaterSpeed ? "船速小于水速：切线方向最短" : "船速足够：可抵消水流", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  line(cx - 170, cy, cx + 170, cy);
  line(cx, cy - 170, cx, cy + 170);

  noFill();
  stroke("#0f766e");
  strokeWeight(2);
  circle(cx + advWaterSpeed * scale, cy, advBoatSpeed * scale * 2);

  drawVectorArrow(cx, cy, advWaterSpeed * scale, 0, "#0284c7", "v水");
  drawVectorArrow(cx, cy, bx * scale, -by * scale, "#f97316", "v最短");
  drawVectorArrow(cx, cy, advRiverVX() * scale, -advRiverVY() * scale, "#111827", "v当前");
}

function rodAlphaRad() {
  return rodAlpha * Math.PI / 180;
}

function rodVA() {
  return rodVB * Math.tan(rodAlphaRad());
}

function drawRodConstraintScene() {
  var wallX = 120;
  var floorY = 405;
  var rodLen = 260;
  var ax = wallX;
  var ay = floorY - rodLen * Math.cos(rodAlphaRad());
  var bx = wallX + rodLen * Math.sin(rodAlphaRad());
  var by = floorY;
  var rodUx = (bx - ax) / rodLen;
  var rodUy = (by - ay) / rodLen;
  var projA = rodVA() * Math.cos(rodAlphaRad());
  var projB = rodVB * Math.sin(rodAlphaRad());

  stroke("#111827");
  strokeWeight(4);
  line(wallX, 70, wallX, floorY + 18);
  line(65, floorY, 535, floorY);

  stroke("#0f766e");
  strokeWeight(8);
  line(ax, ay, bx, by);

  noStroke();
  fill("#2563eb");
  circle(ax, ay, 24);
  fill("#f97316");
  circle(bx, by, 24);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(13);
  text("A", ax, ay);
  text("B", bx, by);

  drawVectorArrow(ax, ay, 0, rodVA() * 2.2, "#2563eb", "vA");
  drawVectorArrow(bx, by, rodVB * 2.2, 0, "#f97316", "vB");

  stroke("#94a3b8");
  strokeWeight(2);
  drawingContext.setLineDash([4, 4]);
  line(ax, ay, ax + rodUx * projA * 3.4, ay + rodUy * projA * 3.4);
  line(bx, by, bx - rodUx * projB * 3.4, by - rodUy * projB * 3.4);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#5b6472");
  textAlign(LEFT, TOP);
  textSize(12);
  text("沿杆投影相等", 250, 84);
  text("α", wallX + 18, ay + 18);
}

function drawRodConstraintGraph() {
  var cx = graphLeft + 210;
  var cy = 260;
  var rodLen = 150;
  var rodUx = Math.sin(rodAlphaRad());
  var rodUy = Math.cos(rodAlphaRad());
  var proj = rodVB * Math.sin(rodAlphaRad()) * 3.4;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("速度投影图", graphLeft + 24, 20);
  fill("#5b6472");
  textSize(12);
  text("虚线投影到杆方向后等长", graphLeft + 24, 44);

  stroke("#0f766e");
  strokeWeight(5);
  line(cx - rodUx * rodLen / 2, cy - rodUy * rodLen / 2, cx + rodUx * rodLen / 2, cy + rodUy * rodLen / 2);

  drawVectorArrow(cx - 78, cy - 15, 0, rodVA() * 2.2, "#2563eb", "vA");
  drawVectorArrow(cx + 28, cy + 55, rodVB * 2.2, 0, "#f97316", "vB");

  stroke("#94a3b8");
  strokeWeight(2);
  drawingContext.setLineDash([4, 4]);
  line(cx - 78, cy - 15, cx - 78 + rodUx * proj, cy - 15 + rodUy * proj);
  line(cx + 28, cy + 55, cx + 28 - rodUx * proj, cy + 55 - rodUy * proj);
  drawingContext.setLineDash([]);
}
