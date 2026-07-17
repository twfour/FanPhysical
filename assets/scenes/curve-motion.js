var riverWidth = 220;
var riverBoatSpeed = 6;
var riverWaterSpeed = 3;
var riverTheta = 90;
var riverT = 0;

var waterfallWidth = 30;
var waterfallDownstream = 40;
var waterfallWaterSpeed = 10;
var waterfallBoatSpeed = 6;
var waterfallTheta = 126.9;
var waterfallT = 0;

var rainTrainV = 18;
var rainDropV = 24;
var rainDensity = 10;

var forceNormal = 55;
var forceTangential = 28;
var forcePoint = 0.45;

var composeVx0 = 24;
var composeVy0 = 12;
var composeAx = 3;
var composeAy = -8;
var composeT = 0;
var composeMaxT = 8;

var advRiverWidth = 200;
var advBoatSpeed = 2;
var advWaterSpeed = 4;
var advRiverTheta = 120;
var advRiverT = 0;

var rodAlpha = 38;
var rodVB = 24;

var dualOmega = 1;
var dualT = 0;

var handAlpha = 45;
var handLengthRatio = 3;
var handT = 0;

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
  textSize(14);
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
  textSize(20);
  text("下游偏移-时间图像 x(t)", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
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
  fill("#334155");
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
  textSize(14);
  text("过河进度", gx + 10, gy + 10);
  text("下游偏移", gx + 10, gy + 28);
}

function waterfallThetaRad() {
  return waterfallTheta * Math.PI / 180;
}

function waterfallBoatVX() {
  return waterfallBoatSpeed * Math.cos(waterfallThetaRad());
}

function waterfallBoatVY() {
  return waterfallBoatSpeed * Math.sin(waterfallThetaRad());
}

function waterfallVX() {
  return waterfallWaterSpeed + waterfallBoatVX();
}

function waterfallVY() {
  return waterfallBoatVY();
}

function waterfallArriveTime() {
  return waterfallWidth / Math.max(0.25, waterfallVY());
}

function waterfallDrift() {
  return waterfallVX() * waterfallArriveTime();
}

function waterfallSafe() {
  return waterfallDrift() <= waterfallDownstream + 0.05;
}

function waterfallBoundaryAngle() {
  return Math.atan2(waterfallWidth, waterfallDownstream);
}

function waterfallMinBoatSpeed() {
  return waterfallWaterSpeed * Math.sin(waterfallBoundaryAngle());
}

function waterfallBestTheta() {
  return (waterfallBoundaryAngle() + Math.PI / 2) * 180 / Math.PI;
}

function drawWaterfallScene() {
  var bankLeft = 76;
  var bankRight = 535;
  var nearY = 390;
  var farY = 92;
  var startX = 150;
  var maxDownstream = Math.max(waterfallDownstream, Math.abs(waterfallDrift()), 45);
  var scale = Math.min((nearY - farY) / waterfallWidth, (bankRight - startX - 35) / maxDownstream);
  var tNow = Math.min(waterfallT, waterfallArriveTime());
  var vx = waterfallVX();
  var vy = waterfallVY();
  var boatX = startX + vx * tNow * scale;
  var boatY = nearY - vy * tNow * scale;
  var fallX = startX + waterfallDownstream * scale;
  var endX = startX + waterfallDrift() * scale;
  var boundaryX = fallX;
  var boundaryY = farY;
  var statusColor = waterfallSafe() ? "#0f766e" : "#dc2626";
  var i;

  noStroke();
  fill("#e0f2fe");
  rect(bankLeft, farY, bankRight - bankLeft, nearY - farY, 10);
  fill("#fee2e2");
  rect(Math.min(fallX, bankRight - 28), farY, Math.max(18, bankRight - fallX), nearY - farY, 0, 10, 10, 0);

  stroke("#111827");
  strokeWeight(3);
  line(bankLeft, nearY, bankRight, nearY);
  line(bankLeft, farY, bankRight, farY);

  stroke("#bae6fd");
  strokeWeight(1);
  for (i = 0; i < 7; i++) {
    var streamY = farY + 34 + i * 36;
    line(bankLeft + 22, streamY, bankRight - 30, streamY);
    drawArrow(bankRight - 48, streamY, bankRight - 26, streamY, "#38bdf8");
  }

  stroke("#dc2626");
  strokeWeight(3);
  line(fallX, farY - 8, fallX, nearY + 8);
  noStroke();
  fill("#dc2626");
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text("瀑布线 L=" + waterfallDownstream.toFixed(0) + "m", fallX, farY - 12);

  stroke("#94a3b8");
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  line(startX, nearY, boundaryX, boundaryY);
  line(endX, farY, endX, nearY);
  drawingContext.setLineDash([]);

  stroke(statusColor);
  strokeWeight(3);
  noFill();
  beginShape();
  for (i = 0; i <= 90; i++) {
    var t = i * waterfallArriveTime() / 90;
    var px = startX + vx * t * scale;
    var py = nearY - vy * t * scale;
    vertex(px, py);
  }
  endShape();

  noStroke();
  fill("#111827");
  circle(startX, nearY, 9);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(11);
  text("A", startX, nearY - 16);

  fill(statusColor);
  circle(endX, farY, 10);
  textAlign(CENTER, TOP);
  text(waterfallSafe() ? "安全靠岸" : "冲入瀑布", endX, farY + 12);

  push();
  translate(boatX, boatY);
  rotate(Math.atan2(-vy, vx));
  noStroke();
  fill("#0f766e");
  triangle(18, 0, -16, -10, -16, 10);
  fill("#ccfbf1");
  ellipse(-4, 0, 16, 10);
  pop();

  drawVectorArrow(boatX, boatY, waterfallBoatVX() * 11, -waterfallBoatVY() * 11, "#0f766e", "v船");
  drawVectorArrow(boatX, boatY, waterfallWaterSpeed * 11, 0, "#0284c7", "v水");
  drawVectorArrow(boatX, boatY, vx * 11, -vy * 11, "#f97316", "v合");

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(15);
  text("漂移=" + waterfallDrift().toFixed(1) + "m，临界=" + waterfallDownstream.toFixed(0) + "m", 88, 28);
  fill(statusColor);
  text("当前：" + (waterfallSafe() ? "能靠岸且不进瀑布" : "会被冲进瀑布"), 88, 48);
}

function drawWaterfallGraph() {
  var cx = graphLeft + 205;
  var cy = 258;
  var scale = 22;
  var boundaryAngle = waterfallBoundaryAngle();
  var bestTheta = waterfallBestTheta();
  var minSpeed = waterfallMinBoatSpeed();
  var lineLen = 160;
  var bx = Math.cos(boundaryAngle);
  var by = Math.sin(boundaryAngle);
  var currentVX = waterfallVX();
  var currentVY = waterfallVY();
  var maxV = Math.max(waterfallWaterSpeed, waterfallBoatSpeed, Math.sqrt(currentVX * currentVX + currentVY * currentVY), minSpeed);

  if (maxV * scale > 150) {
    scale = 150 / maxV;
  }

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(20);
  text("速度合成与最小船速", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
  text("临界：合速度方向刚好指向对岸瀑布前边界", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  line(cx - 170, cy, cx + 170, cy);
  line(cx, cy - 170, cx, cy + 170);

  stroke("#94a3b8");
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]);
  line(cx - bx * 35, cy + by * 35, cx + bx * lineLen, cy - by * lineLen);
  drawingContext.setLineDash([]);

  drawVectorArrow(cx, cy, waterfallWaterSpeed * scale, 0, "#0284c7", "v水");
  drawVectorArrow(cx, cy, waterfallBoatVX() * scale, -waterfallBoatVY() * scale, "#0f766e", "v船");
  drawVectorArrow(cx, cy, currentVX * scale, -currentVY * scale, "#f97316", "v合");
  drawVectorArrow(cx + waterfallWaterSpeed * scale, cy, minSpeed * Math.cos(bestTheta * Math.PI / 180) * scale, -minSpeed * Math.sin(bestTheta * Math.PI / 180) * scale, "#7c3aed", "vmin");

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(15);
  text("vmin = v水 · d / √(d²+L²)", graphLeft + 32, 390);
  text("= " + waterfallWaterSpeed.toFixed(1) + " × " + waterfallWidth.toFixed(0) + " / " + Math.sqrt(waterfallWidth * waterfallWidth + waterfallDownstream * waterfallDownstream).toFixed(1) + " = " + minSpeed.toFixed(1) + " m/s", graphLeft + 32, 412);
  fill(waterfallBoatSpeed + 0.001 >= minSpeed ? "#0f766e" : "#dc2626");
  text("当前船速 " + waterfallBoatSpeed.toFixed(1) + " m/s，最佳船头角≈" + bestTheta.toFixed(1) + "°", graphLeft + 32, 434);
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
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
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
  textSize(20);
  text("相对速度矢量图", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
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
  textSize(14);
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
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
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
  textSize(20);
  text("力的分解示意", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
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
  textSize(20);
  text("分运动位移图像", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
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
  textSize(20);
  text("速度圆与临界方向", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
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
  textSize(15);
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
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
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
  textSize(20);
  text("速度投影图", graphLeft + 24, 20);
  fill("#334155");
  textSize(14);
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

function dualCycleTime() {
  return 2 * Math.PI / Math.max(0.18, dualOmega);
}

function dualConstraintForces(omegaRatio) {
  var s1 = Math.sin(Math.PI / 6);
  var c1 = Math.cos(Math.PI / 6);
  var s2 = Math.sin(Math.PI / 4);
  var c2 = Math.cos(Math.PI / 4);
  var radial = 0.5 * omegaRatio * omegaRatio;
  var det = s1 * c2 - s2 * c1;
  var tension = (radial * c2 - s2) / det;
  var rodForce = (s1 - c1 * radial) / det;
  return { tension: tension, rodForce: rodForce, radial: radial };
}

function drawDualConstraintScene() {
  var cx = 285;
  var rodX = 292;
  var baseY = 390;
  var scale = 170;
  var r = 0.5 * scale;
  var topY = baseY - 1.95 * scale;
  var pointAY = baseY - 1.85 * scale;
  var pointBY = baseY - 1.5 * scale;
  var theta = dualOmega * dualT;
  var sideOffset = r * Math.cos(theta);
  var cX = rodX - sideOffset;
  var cY = baseY - scale;
  var topCx = 140;
  var topCy = 130;
  var topR = 64;
  var topBallX = topCx + topR * Math.cos(theta);
  var topBallY = topCy + topR * Math.sin(theta);
  var forces = dualConstraintForces(dualOmega);

  stroke("#111827");
  strokeWeight(4);
  line(rodX, topY, rodX, baseY + 16);
  noFill();
  stroke("#cbd5e1");
  strokeWeight(2);
  ellipse(rodX, baseY, 230, 54);
  fill("#f8fafc");
  ellipse(rodX, baseY, 190, 38);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(15);
  text("侧视：轻绳 AC 与轻杆 BC 共同约束小球", 30, 26);

  drawPointLabel(rodX, pointAY, "A", "#2563eb");
  drawPointLabel(rodX, pointBY, "B", "#0f766e");
  drawPointLabel(cX, cY, "C", "#f97316");

  stroke("#2563eb");
  strokeWeight(3);
  line(rodX, pointAY, cX, cY);
  stroke("#0f766e");
  strokeWeight(5);
  line(rodX, pointBY, cX, cY);
  drawVectorArrow(cX, cY, (rodX - cX) * 0.32, (pointAY - cY) * 0.32, "#2563eb", "T");
  drawVectorArrow(cX, cY, (rodX - cX) * 0.30 * Math.sign(forces.rodForce || 1), (pointBY - cY) * 0.30 * Math.sign(forces.rodForce || 1), "#0f766e", "F杆");
  drawVectorArrow(cX, cY, 0, 58, "#dc2626", "mg");
  drawVectorArrow(cX, cY, rodX > cX ? 68 : -68, 0, "#f59e0b", "mω²r");

  stroke("#e5e7eb");
  strokeWeight(2);
  line(topCx - 92, topCy, topCx + 92, topCy);
  line(topCx, topCy - 92, topCx, topCy + 92);
  noFill();
  stroke("#94a3b8");
  circle(topCx, topCy, topR * 2);
  stroke("#f97316");
  strokeWeight(3);
  line(topCx, topCy, topBallX, topBallY);
  noStroke();
  fill("#f97316");
  circle(topBallX, topBallY, 16);
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(14);
  text("俯视：r = l/2", topCx, topCy + topR + 16);

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("ω = " + dualOmega.toFixed(2) + "√(g/l)", 30, 56);
  text("T/mg = " + forces.tension.toFixed(2) + "，杆力方向" + (forces.rodForce >= 0 ? "沿 CB" : "反向"), 30, 78);
}

function drawDualConstraintGraph() {
  var gx = graphLeft + 48;
  var gy = 78;
  var gw = graphRight - graphLeft - 86;
  var gh = 318;
  var xMax = Math.sqrt(2.05);
  var yMax = 2.2;
  var current = dualConstraintForces(dualOmega);

  drawGraphFrame("约束力-角速度图像", "蓝线：T/mg；绿线：|F杆|/mg；红线：轻绳临界");
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#2563eb", function (w) {
    return Math.max(0, Math.min(yMax, dualConstraintForces(w).tension));
  });
  drawSimpleCurve(gx, gy, gw, gh, xMax, yMax, "#0f766e", function (w) {
    return Math.max(0, Math.min(yMax, Math.abs(dualConstraintForces(w).rodForce)));
  });

  var tautX = map(Math.sqrt(2), 0, xMax, gx, gx + gw);
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(tautX, gy, tautX, gy + gh);
  drawingContext.setLineDash([]);

  drawTimeMarker(gx, gy, gw, gh, dualOmega, xMax);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("当前 T/mg=" + current.tension.toFixed(2), gx + 12, gy + 14);
  text("轻绳拉直：ω ≤ √(2g/l)", gx + 12, gy + 36);
  text("不碰盘：ω ≥ √(3g/2l)", gx + 12, gy + 58);
}

function handConeCycleTime() {
  return 2 * Math.PI * Math.sqrt(Math.cos(handAlpha * Math.PI / 180));
}

function handBreakFallTime() {
  return Math.sqrt(11);
}

function handSceneDuration() {
  return handConeCycleTime() + handBreakFallTime();
}

function drawHandRopeScene() {
  var handX = 170;
  var handY = 82;
  var groundY = 430;
  var lPx = 58;
  var alpha = handAlpha * Math.PI / 180;
  var cycle = handConeCycleTime();
  var isProjectile = handT > cycle;
  var theta = 2 * Math.PI * Math.min(handT, cycle) / Math.max(0.1, cycle);
  var r = lPx * Math.sin(alpha);
  var drop = lPx * Math.cos(alpha);
  var ballX = handX + r * Math.cos(theta);
  var ballY = handY + drop + 18 * Math.sin(theta);
  var breakV = Math.sqrt(1.5);
  var fallTime = handBreakFallTime();
  var after = Math.max(0, handT - cycle);
  var pxScale = 52;

  if (isProjectile) {
    ballX = handX + lPx * Math.sin(Math.PI / 3) + breakV * after * pxScale;
    ballY = handY + lPx * 0.5 + 0.5 * after * after * pxScale;
    ballY = Math.min(ballY, groundY);
  }

  stroke("#111827");
  strokeWeight(3);
  line(50, groundY, 545, groundY);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(15);
  text("图1：水平圆锥摆，断绳后平抛", 28, 24);

  fill("#334155");
  rect(handX - 18, handY - 12, 36, 18, 8);
  fill("#111827");
  circle(handX, handY, 8);

  stroke("#2563eb");
  strokeWeight(3);
  line(handX, handY, ballX, isProjectile ? handY + lPx * 0.5 : ballY);
  if (isProjectile) {
    stroke("#94a3b8");
    strokeWeight(2);
    drawingContext.setLineDash([4, 4]);
    var bx = handX + lPx * Math.sin(Math.PI / 3);
    var by = handY + lPx * 0.5;
    line(bx, by, ballX, ballY);
    drawingContext.setLineDash([]);
  }

  noStroke();
  fill(isProjectile ? "#dc2626" : "#f97316");
  circle(ballX, ballY, 22);
  fill("#ffedd5");
  circle(ballX - 5, ballY - 5, 7);

  if (!isProjectile) {
    drawVectorArrow(ballX, ballY, 0, 58, "#dc2626", "mg");
    drawVectorArrow(ballX, ballY, (handX - ballX) * 0.38, (handY - ballY) * 0.38, "#2563eb", "T");
  } else {
    drawVectorArrow(ballX, ballY, 58, 0, "#2563eb", "vx");
    drawVectorArrow(ballX, ballY, 0, after * 44, "#dc2626", "vy");
  }

  stroke("#cbd5e1");
  strokeWeight(1.5);
  noFill();
  ellipse(handX, handY + drop, r * 2, 36);

  noStroke();
  fill("#334155");
  textAlign(LEFT, TOP);
  textSize(14);
  text("T = mg/cosα，α=" + handAlpha.toFixed(0) + "°", 28, 52);
  text(isProjectile ? "断绳后按平抛：v₂² = v₁² + 2gh" : "周期 T₀ = 2π√(l cosα/g)", 28, 74);

  var rightX = 418;
  var rightHandY = 110;
  var lengthPx = handLengthRatio * 42;
  var lowY = Math.min(groundY - 12, rightHandY + lengthPx);
  stroke("#0f766e");
  strokeWeight(3);
  line(rightX, rightHandY, rightX, lowY);
  noStroke();
  fill("#0f766e");
  circle(rightX, lowY, 18);
  fill("#334155");
  textAlign(CENTER, TOP);
  textSize(14);
  text("图2：最低点断绳", rightX, lowY + 18);
}

function drawHandRopeGraph() {
  var gx = graphLeft + 48;
  var gy = 72;
  var gw = graphRight - graphLeft - 86;
  var gh = 160;
  var gx2 = gx;
  var gy2 = 298;
  var gh2 = 130;
  var alphaRad = handAlpha * Math.PI / 180;
  var tensionRatio = 1 / Math.cos(alphaRad);
  var rangeNow = Math.sqrt(Math.max(0, 2 * handLengthRatio * (6 - handLengthRatio)));

  drawGraphFrame("断绳条件与射程最值", "上图：T/mg；下图：x/l");
  drawSimpleCurve(gx, gy, gw, gh, 60, 2.2, "#2563eb", function (a) {
    return 1 / Math.cos(a * Math.PI / 180);
  });
  drawTimeMarker(gx, gy, gw, gh, handAlpha, 60);
  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(14);
  text("当前 T/mg=" + tensionRatio.toFixed(2) + "，断绳临界在 α=60°", gx + 10, gy + 12);

  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx2, gy2, gw, gh2);
  stroke("#0f766e");
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (var i = 0; i <= 120; i++) {
    var L = 0.05 + i * 5.9 / 120;
    var y = Math.sqrt(Math.max(0, 2 * L * (6 - L)));
    vertex(map(L, 0, 6, gx2, gx2 + gw), map(y, 0, 4.5, gy2 + gh2, gy2));
  }
  endShape();
  var px = map(handLengthRatio, 0, 6, gx2, gx2 + gw);
  var py = map(rangeNow, 0, 4.5, gy2 + gh2, gy2);
  noStroke();
  fill("#f97316");
  circle(px, py, 12);
  fill("#111827");
  textSize(14);
  textAlign(LEFT, TOP);
  text("x/l=" + rangeNow.toFixed(2) + "，最大 3√2 出现在 L=3l", gx2 + 10, gy2 + 10);
}

function drawPointLabel(x, y, label, colorHex) {
  noStroke();
  fill(colorHex);
  circle(x, y, 12);
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text(label, x, y);
}
