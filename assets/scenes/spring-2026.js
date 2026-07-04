function togglePipeDropPlay() {
  pipePlaying = !pipePlaying;
  updateLabels();
}


function pipeLandTime() {
  return 2 * pipeV0 / pipeG;
}

function pipeBottomAt(t) {
  return pipeV0 * t - 0.5 * pipeG * t * t;
}

function pipeTopAt(t) {
  return pipeBottomAt(t) + pipeL;
}

function ballYAt(t) {
  return pipeH - 0.5 * pipeG * t * t;
}

function pipeVelocityAt(t) {
  return pipeV0 - pipeG * t;
}

function isBallInsidePipe(t) {
  var bottomY = pipeBottomAt(t);
  var topY = bottomY + pipeL;
  var ballY = ballYAt(t);
  return t <= pipeLandTime() && bottomY <= ballY && ballY <= topY;
}

function getPipePassIntervals() {
  var startT = (pipeH - pipeL) / pipeV0;
  var endT = pipeH / pipeV0;
  var landT = pipeLandTime();

  startT = Math.max(0, startT);
  endT = Math.min(endT, landT);

  if (startT <= endT && endT >= 0 && startT <= landT) {
    return [{ start: startT, end: endT }];
  }
  return [];
}

function updatePipeDrop(dt) {
  if (pipePlaying) {
    pipeT += dt;
    if (pipeT >= pipeMaxT || pipeT >= pipeLandTime()) {
      pipeT = 0;
      pipePlaying = false;
    }
    updateLabels();
  }
}

function drawPipeDropScene() {
  var groundY = 430;
  var axisX = 95;
  var pipeX = 330;
  var ballX = 330;
  var landT = pipeLandTime();
  var drawT = Math.min(pipeT, landT);
  var bottomY = pipeBottomAt(drawT);
  var topY = pipeTopAt(drawT);
  var ballY = ballYAt(pipeT);
  var maxY = Math.max(pipeH + 50, pipeTopAt(Math.min(pipeV0 / pipeG, landT)) + 40, pipeL + 80);
  var bottomScreen = map(Math.max(0, bottomY), 0, maxY, groundY, 58);
  var topScreen = map(Math.max(0, topY), 0, maxY, groundY, 58);
  var ballScreen = map(Math.max(0, ballY), 0, maxY, groundY, 58);
  var pipeW = 64;
  var insideNow = isBallInsidePipe(pipeT);
  var vPipe = pipeVelocityAt(pipeT);
  var phaseText = "金属管上升阶段";
  var phaseColor = "#2563eb";
  var intervals = getPipePassIntervals();
  var passText = "金属管落地前未穿过";

  if (Math.abs(vPipe) < 0.15) {
    phaseText = "金属管到达最高点";
    phaseColor = "#d97706";
  } else if (vPipe < 0) {
    phaseText = "金属管下降阶段";
    phaseColor = "#dc2626";
  }

  if (intervals.length > 0) {
    var midT = (intervals[0].start + intervals[0].end) / 2;
    var midV = pipeVelocityAt(midT);
    var passPhase = midV >= 0 ? "上升阶段穿过" : "下降阶段穿过";
    passText = passPhase + "：" + intervals[0].start.toFixed(2) + "s ~ " + intervals[0].end.toFixed(2) + "s";
  }
  if (insideNow) {
    passText = "正在穿过金属管";
  }

  stroke("#111827");
  strokeWeight(3);
  line(55, groundY, 545, groundY);

  stroke("#94a3b8");
  strokeWeight(2);
  line(axisX, groundY, axisX, 58);
  drawArrow(axisX, groundY, axisX, 62, "#64748b");

  noStroke();
  fill("#5b6472");
  textAlign(LEFT, TOP);
  textSize(12);
  text("y/m", axisX + 10, 60);
  text("地面 y = 0", 60, groundY + 10);

  noStroke();
  fill("#dbeafe");
  rect(pipeX - pipeW / 2, topScreen, pipeW, bottomScreen - topScreen, 10);

  stroke(insideNow ? "#f97316" : "#0891b2");
  strokeWeight(5);
  noFill();
  rect(pipeX - pipeW / 2, topScreen, pipeW, bottomScreen - topScreen, 8);

  stroke(insideNow ? "#f97316" : "#0891b2");
  strokeWeight(4);
  line(pipeX - pipeW / 2 - 12, topScreen, pipeX + pipeW / 2 + 12, topScreen);
  line(pipeX - pipeW / 2 - 12, bottomScreen, pipeX + pipeW / 2 + 12, bottomScreen);

  noStroke();
  fill(insideNow ? "#f97316" : "#dc2626");
  circle(ballX, ballScreen, 24);

  noStroke();
  fill("#7c2d12");
  circle(ballX - 5, ballScreen - 5, 6);

  if (insideNow) {
    noStroke();
    fill(255, 247, 237);
    rect(185, 258, 292, 34, 8);
    noStroke();
    fill("#c2410c");
    textAlign(CENTER, CENTER);
    textSize(16);
    text("正在穿过金属管", 331, 275);
  }

}

function drawPipeDropGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var landT = pipeLandTime();
  var tMax = Math.max(1, Math.min(pipeMaxT, landT));
  var yMin = 0;
  var yMax = pipeH;
  var i;
  var intervals = getPipePassIntervals();

  for (i = 0; i <= 160; i++) {
    var sampleT = i * tMax / 160;
    var sampleBottom = Math.max(0, pipeBottomAt(sampleT));
    var sampleTop = Math.max(0, pipeTopAt(sampleT));
    var sampleBall = Math.max(0, ballYAt(sampleT));
    yMax = Math.max(yMax, sampleBottom, sampleTop, sampleBall);
  }
  yMax += Math.max(20, yMax * 0.12);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("高度-时间图像 y(t)", graphLeft + 24, 20);

  noStroke();
  fill("#5b6472");
  textSize(12);
  text("横轴：绝对时间 t / s；纵轴：高度 y / m", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);

  if (intervals.length > 0) {
    var passStartX = map(intervals[0].start, 0, tMax, gx, gx + gw);
    var passEndX = map(intervals[0].end, 0, tMax, gx, gx + gw);
    noStroke();
    fill(255, 237, 213);
    rect(passStartX, gy, passEndX - passStartX, gh);
  }

  stroke("#e5e7eb");
  strokeWeight(1);
  for (i = 0; i <= 4; i++) {
    var gridY = gy + i * gh / 4;
    line(gx, gridY, gx + gw, gridY);
  }
  for (i = 0; i <= 4; i++) {
    var gridX = gx + i * gw / 4;
    line(gridX, gy, gridX, gy + gh);
  }

  noStroke();
  fill("#5b6472");
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (i = 0; i <= 4; i++) {
    var tickY = gy + i * gh / 4;
    var valY = map(i, 0, 4, yMax, yMin);
    text(valY.toFixed(0), gx - 8, tickY);
  }

  textAlign(CENTER, TOP);
  for (i = 0; i <= 4; i++) {
    var tickX = gx + i * gw / 4;
    var valT = i * tMax / 4;
    text(valT.toFixed(1) + "s", tickX, gy + gh + 10);
  }

  drawPipeCurve(gx, gy, gw, gh, tMax, yMin, yMax, "bottom");
  drawPipeCurve(gx, gy, gw, gh, tMax, yMin, yMax, "top");
  drawPipeCurve(gx, gy, gw, gh, tMax, yMin, yMax, "ball");

  var currentT = Math.min(pipeT, tMax);
  var currentX = map(currentT, 0, tMax, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#0891b2");
  textAlign(LEFT, TOP);
  textSize(12);
  text("管顶", gx + 10, gy + 10);
  fill("#2563eb");
  text("管底", gx + 10, gy + 28);
  fill("#dc2626");
  text("小球", gx + 10, gy + 46);

  noStroke();
  fill("#111827");
  textAlign(RIGHT, TOP);
  text("落地时刻 " + landT.toFixed(2) + "s", gx + gw, gy - 22);
}

function drawPipeCurve(gx, gy, gw, gh, tMax, yMin, yMax, kind) {
  var i;
  var colorHex = "#2563eb";

  if (kind === "top") {
    colorHex = "#0891b2";
  }
  if (kind === "ball") {
    colorHex = "#dc2626";
  }

  noFill();
  stroke(colorHex);
  strokeWeight(2.4);
  beginShape();
  for (i = 0; i <= 160; i++) {
    var t = i * tMax / 160;
    var y = pipeBottomAt(t);
    if (kind === "top") {
      y = pipeTopAt(t);
    }
    if (kind === "ball") {
      y = ballYAt(t);
    }
    y = Math.max(0, y);
    var px = map(t, 0, tMax, gx, gx + gw);
    var py = map(y, yMin, yMax, gy + gh, gy);
    vertex(px, py);
  }
  endShape();
}

function toggleThreeCarPlay() {
  carPlaying = !carPlaying;
  updateLabels();
}


function carStopTime(v0, a) {
  return v0 / a;
}

function carPosition(v0, a, t, x0) {
  var stopT = carStopTime(v0, a);
  if (t <= stopT) {
    return x0 + v0 * t - 0.5 * a * t * t;
  }
  return x0 + v0 * v0 / (2 * a);
}

function carVelocity(v0, a, t) {
  return Math.max(0, v0 - a * t);
}

function threeCarPositions(t) {
  return {
    a: carPosition(carVa0, carAa, t, 0),
    b: carPosition(carVb0, carAb, t, -carGap0),
    c: carPosition(carVc0, carAc, t, -2 * carGap0)
  };
}

function threeCarGaps(t) {
  var pos = threeCarPositions(t);
  return {
    ab: pos.a - pos.b,
    bc: pos.b - pos.c
  };
}

function updateThreeCar(dt) {
  if (carPlaying) {
    carT += dt;
    if (carT >= carMaxT) {
      carT = 0;
      carPlaying = false;
    }
    updateLabels();
  }
}

function drawCarShape(x, y, colorHex, name, speedText) {
  noStroke();
  fill(colorHex);
  rect(x - 24, y - 18, 48, 20, 7);
  fill("#111827");
  circle(x - 14, y + 2, 10);
  circle(x + 14, y + 2, 10);

  noStroke();
  fill("#fff");
  textAlign(CENTER, CENTER);
  textSize(14);
  text(name, x, y - 8);

  noStroke();
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(12);
  text(speedText, x, y + 16);
}

function drawThreeCarScene() {
  var axisY = 366;
  var laneA = 278;
  var laneB = 330;
  var laneC = 382;
  var leftX = 80;
  var rightX = 540;
  var posNow = threeCarPositions(carT);
  var gapsNow = threeCarGaps(carT);
  var stopA = carPosition(carVa0, carAa, carMaxT, 0);
  var stopB = carPosition(carVb0, carAb, carMaxT, -carGap0);
  var stopC = carPosition(carVc0, carAc, carMaxT, -2 * carGap0);
  var minX = -2 * carGap0 - 2;
  var maxX = Math.max(stopA, stopB, stopC) + 2;
  var screenA = map(posNow.a, minX, maxX, leftX, rightX);
  var screenB = map(posNow.b, minX, maxX, leftX, rightX);
  var screenC = map(posNow.c, minX, maxX, leftX, rightX);
  var stopScreenA = map(stopA, minX, maxX, leftX, rightX);
  var stopScreenB = map(stopB, minX, maxX, leftX, rightX);
  var stopScreenC = map(stopC, minX, maxX, leftX, rightX);
  var criticalAB = Math.abs(gapsNow.ab) < 0.08;
  var criticalBC = Math.abs(gapsNow.bc) < 0.08;

  stroke("#111827");
  strokeWeight(3);
  line(leftX, axisY, rightX, axisY);

  stroke("#e5e7eb");
  strokeWeight(1);
  line(leftX, laneA + 2, rightX, laneA + 2);
  line(leftX, laneB + 2, rightX, laneB + 2);
  line(leftX, laneC + 2, rightX, laneC + 2);

  stroke("#cbd5e1");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(stopScreenA, laneA - 42, stopScreenA, axisY + 22);
  line(stopScreenB, laneB - 42, stopScreenB, axisY + 22);
  line(stopScreenC, laneC - 42, stopScreenC, axisY + 22);
  line(screenA, laneA + 6, screenA, axisY);
  line(screenB, laneB + 6, screenB, axisY);
  line(screenC, laneC + 6, screenC, axisY);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#5b6472");
  textAlign(CENTER, TOP);
  textSize(11);
  text("甲停车点", stopScreenA, axisY + 28);
  text("乙/丙停车点", stopScreenB, axisY + 44);

  stroke(criticalAB ? "#f97316" : "#94a3b8");
  strokeWeight(2);
  line(screenB, axisY - 24, screenA, axisY - 24);
  stroke(criticalBC ? "#f97316" : "#94a3b8");
  line(screenC, axisY - 50, screenB, axisY - 50);

  noStroke();
  fill(criticalAB ? "#c2410c" : "#5b6472");
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text("s_AB = " + Math.max(0, gapsNow.ab).toFixed(2) + "m", (screenA + screenB) / 2, axisY - 28);

  noStroke();
  fill(criticalBC ? "#c2410c" : "#5b6472");
  text("s_BC = " + Math.max(0, gapsNow.bc).toFixed(2) + "m", (screenB + screenC) / 2, axisY - 54);

  drawCarShape(screenA, laneA, "#dc2626", "甲", carVelocity(carVa0, carAa, carT).toFixed(1) + "m/s");
  drawCarShape(screenB, laneB, "#2563eb", "乙", carVelocity(carVb0, carAb, carT).toFixed(1) + "m/s");
  drawCarShape(screenC, laneC, "#0f766e", "丙", carVelocity(carVc0, carAc, carT).toFixed(1) + "m/s");

  if (criticalAB || criticalBC || carT >= carStopTime(carVc0, carAc)) {
    noStroke();
    fill(255, 247, 237);
    rect(178, 240, 286, 34, 8);
    noStroke();
    fill("#c2410c");
    textAlign(CENTER, CENTER);
    textSize(16);
    text("刚好不追尾", 321, 257);
  }

}

function drawThreeCarGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var yMin = 0;
  var yMax = 5;
  var i;

  for (i = 0; i <= 160; i++) {
    var sampleT = i * carMaxT / 160;
    var sampleGaps = threeCarGaps(sampleT);
    yMax = Math.max(yMax, sampleGaps.ab, sampleGaps.bc);
  }
  yMax += Math.max(1, yMax * 0.14);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("间距-时间图像 s(t)", graphLeft + 24, 20);

  noStroke();
  fill("#5b6472");
  textSize(12);
  text("横轴：绝对时间 t / s；纵轴：车距 s / m", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);

  stroke("#e5e7eb");
  strokeWeight(1);
  for (i = 0; i <= 4; i++) {
    var gridY = gy + i * gh / 4;
    line(gx, gridY, gx + gw, gridY);
  }
  for (i = 0; i <= 4; i++) {
    var gridX = gx + i * gw / 4;
    line(gridX, gy, gridX, gy + gh);
  }

  var zeroY = map(0, yMin, yMax, gy + gh, gy);
  stroke("#ef4444");
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 4]);
  line(gx, zeroY, gx + gw, zeroY);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#5b6472");
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (i = 0; i <= 4; i++) {
    var tickY = gy + i * gh / 4;
    var valY = map(i, 0, 4, yMax, yMin);
    text(valY.toFixed(1), gx - 8, tickY);
  }

  textAlign(CENTER, TOP);
  for (i = 0; i <= 4; i++) {
    var tickX = gx + i * gw / 4;
    var valT = i * carMaxT / 4;
    text(valT.toFixed(0) + "s", tickX, gy + gh + 10);
  }

  drawThreeCarGapCurve(gx, gy, gw, gh, yMin, yMax, "ab");
  drawThreeCarGapCurve(gx, gy, gw, gh, yMin, yMax, "bc");

  var currentT = Math.min(carT, carMaxT);
  var currentX = map(currentT, 0, carMaxT, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#2563eb");
  textAlign(LEFT, TOP);
  textSize(12);
  text("甲乙间距 s_AB", gx + 10, gy + 10);
  fill("#0f766e");
  text("乙丙间距 s_BC", gx + 10, gy + 28);
  fill("#ef4444");
  text("0m 安全边界", gx + 10, gy + 46);

}

function drawThreeCarGapCurve(gx, gy, gw, gh, yMin, yMax, kind) {
  var i;
  var colorHex = kind === "ab" ? "#2563eb" : "#0f766e";

  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (i = 0; i <= 160; i++) {
    var t = i * carMaxT / 160;
    var gaps = threeCarGaps(t);
    var gap = kind === "ab" ? gaps.ab : gaps.bc;
    gap = Math.max(0, gap);
    var px = map(t, 0, carMaxT, gx, gx + gw);
    var py = map(gap, yMin, yMax, gy + gh, gy);
    vertex(px, py);
  }
  endShape();
}

function toggleDoubleThrowPlay() {
  throwPlaying = !throwPlaying;
  updateLabels();
}


function updateDoubleThrow(dt) {
  if (throwPlaying) {
    throwT += dt;
    if (throwT >= throwMaxT) {
      throwT = 0;
      throwPlaying = false;
    }
    updateLabels();
  }
}

function throwYA(t) {
  return 2 * throwV0 * t - 0.5 * throwG * t * t;
}

function throwYB(t) {
  if (t < throwDelay) {
    return 0;
  }
  var s = t - throwDelay;
  return throwV0 * s - 0.5 * throwG * s * s;
}

function getDoubleThrowMeet() {
  var low = 2 * throwV0 / throwG;
  var high = 4 * throwV0 / throwG;
  if (throwDelay <= low || throwDelay >= high) {
    return { canMeet: false, low: low, high: high, t: 0, y: 0, s: 0 };
  }

  var s = (2 * throwV0 * throwDelay - 0.5 * throwG * throwDelay * throwDelay) / (throwG * throwDelay - throwV0);
  var tMeet = throwDelay + s;
  var yMeet = throwV0 * s - 0.5 * throwG * s * s;
  if (s <= 0 || yMeet <= 0) {
    return { canMeet: false, low: low, high: high, t: tMeet, y: yMeet, s: s };
  }
  return { canMeet: true, low: low, high: high, t: tMeet, y: yMeet, s: s };
}

function drawDoubleThrowScene() {
  var groundY = 430;
  var axisX = 95;
  var ballAX = 300;
  var ballBX = 360;
  var meet = getDoubleThrowMeet();
  var maxY = Math.max(120, 2 * throwV0 * throwV0 / (2 * throwG), throwV0 * throwV0 / (2 * throwG), meet.y + 30);
  var yA = Math.max(0, throwYA(throwT));
  var yB = Math.max(0, throwYB(throwT));
  var aScreen = map(yA, 0, maxY, groundY, 58);
  var bScreen = map(yB, 0, maxY, groundY, 58);
  var meetScreen = map(Math.max(0, meet.y), 0, maxY, groundY, 58);
  var statusText = meet.canMeet ? "能在空中相遇" : "不能在空中相遇";
  var statusColor = meet.canMeet ? "#0f766e" : "#dc2626";

  stroke("#111827");
  strokeWeight(3);
  line(55, groundY, 545, groundY);

  stroke("#94a3b8");
  strokeWeight(2);
  line(axisX, groundY, axisX, 58);
  drawArrow(axisX, groundY, axisX, 62, "#64748b");

  noStroke();
  fill("#5b6472");
  textAlign(LEFT, TOP);
  textSize(12);
  text("y/m", axisX + 10, 60);
  text("地面 y = 0", 60, groundY + 10);

  stroke("#cbd5e1");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(ballAX, 58, ballAX, groundY);
  line(ballBX, 58, ballBX, groundY);
  if (meet.canMeet) {
    line(250, meetScreen, 410, meetScreen);
  }
  drawingContext.setLineDash([]);

  noStroke();
  fill("#2563eb");
  circle(ballAX, aScreen, 28);
  fill("#bfdbfe");
  circle(ballAX - 6, aScreen - 6, 8);

  noStroke();
  fill(throwT < throwDelay ? "#94a3b8" : "#dc2626");
  circle(ballBX, bScreen, 28);
  fill(throwT < throwDelay ? "#e2e8f0" : "#fecaca");
  circle(ballBX - 6, bScreen - 6, 8);

  noStroke();
  fill("#111827");
  textAlign(CENTER, TOP);
  textSize(13);
  text("A：2v₀", ballAX, groundY + 28);
  text(throwT < throwDelay ? "B：待抛" : "B：v₀", ballBX, groundY + 28);

  if (meet.canMeet) {
    noStroke();
    fill("#f97316");
    circle((ballAX + ballBX) / 2, meetScreen, 10);
    noStroke();
    fill("#c2410c");
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text("相遇点 " + meet.y.toFixed(1) + "m，t=" + meet.t.toFixed(2) + "s", (ballAX + ballBX) / 2, meetScreen - 8);
  }

  if (meet.canMeet && Math.abs(throwT - meet.t) < 0.08) {
    noStroke();
    fill(255, 247, 237);
    rect(190, 258, 250, 34, 8);
    noStroke();
    fill("#c2410c");
    textAlign(CENTER, CENTER);
    textSize(16);
    text("此刻两球在空中相遇", 315, 275);
  }

}

function drawDoubleThrowGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var meet = getDoubleThrowMeet();
  var yMin = 0;
  var yMax = 1;
  var i;

  for (i = 0; i <= 180; i++) {
    var sampleT = i * throwMaxT / 180;
    yMax = Math.max(yMax, Math.max(0, throwYA(sampleT)), Math.max(0, throwYB(sampleT)));
  }
  yMax = Math.max(yMax, meet.y + 20);
  yMax += Math.max(10, yMax * 0.12);

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("高度-时间图像 y(t)", graphLeft + 24, 20);

  noStroke();
  fill("#5b6472");
  textSize(12);
  text("横轴：绝对时间 t / s；纵轴：高度 y / m", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);

  stroke("#e5e7eb");
  strokeWeight(1);
  for (i = 0; i <= 4; i++) {
    var gridY = gy + i * gh / 4;
    line(gx, gridY, gx + gw, gridY);
  }
  for (i = 0; i <= 4; i++) {
    var gridX = gx + i * gw / 4;
    line(gridX, gy, gridX, gy + gh);
  }

  noStroke();
  fill("#5b6472");
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (i = 0; i <= 4; i++) {
    var tickY = gy + i * gh / 4;
    var valY = map(i, 0, 4, yMax, yMin);
    text(valY.toFixed(0), gx - 8, tickY);
  }

  textAlign(CENTER, TOP);
  for (i = 0; i <= 4; i++) {
    var tickX = gx + i * gw / 4;
    var valT = i * throwMaxT / 4;
    text(valT.toFixed(1) + "s", tickX, gy + gh + 10);
  }

  drawThrowCurve(gx, gy, gw, gh, yMin, yMax, "a");
  drawThrowCurve(gx, gy, gw, gh, yMin, yMax, "b");

  if (meet.canMeet) {
    var meetX = map(meet.t, 0, throwMaxT, gx, gx + gw);
    var meetY = map(meet.y, yMin, yMax, gy + gh, gy);
    noStroke();
    fill("#f97316");
    circle(meetX, meetY, 10);
  }

  var currentX = map(Math.min(throwT, throwMaxT), 0, throwMaxT, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#2563eb");
  textAlign(LEFT, TOP);
  textSize(12);
  text("A：初速度 2v₀", gx + 10, gy + 10);
  fill("#dc2626");
  text("B：延迟 Δt 后初速度 v₀", gx + 10, gy + 28);
  fill("#f97316");
  text("橙点：空中相遇", gx + 10, gy + 46);

}

function drawThrowCurve(gx, gy, gw, gh, yMin, yMax, kind) {
  var i;
  var colorHex = kind === "a" ? "#2563eb" : "#dc2626";

  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (i = 0; i <= 180; i++) {
    var t = i * throwMaxT / 180;
    var y = kind === "a" ? throwYA(t) : throwYB(t);
    y = Math.max(0, y);
    var px = map(t, 0, throwMaxT, gx, gx + gw);
    var py = map(y, yMin, yMax, gy + gh, gy);
    vertex(px, py);
  }
  endShape();
}

function toggleInclineSlotPlay() {
  slotPlaying = !slotPlaying;
  updateLabels();
}


function updateInclineSlot(dt) {
  if (slotPlaying) {
    slotT += dt;
    if (slotT >= slotMaxT) {
      slotT = 0;
      slotPlaying = false;
    }
    updateLabels();
  }
}

function slotAccel(thetaDeg) {
  return slotG * Math.cos(thetaDeg * Math.PI / 180);
}

function slotLength(thetaDeg) {
  return 2 * (slotR - slotr) * Math.cos(thetaDeg * Math.PI / 180);
}

function slotArriveTime() {
  return 2 * Math.sqrt((slotR - slotr) / slotG);
}

function slotDisplacement(thetaDeg, t) {
  var a = slotAccel(thetaDeg);
  var sMax = slotLength(thetaDeg);
  var s = 0.5 * a * t * t;
  return Math.min(s, sMax);
}

function slotEndpoints(pX, pY, scale, thetaDeg, side) {
  var theta = thetaDeg * Math.PI / 180;
  var direction = side === "left" ? -1 : 1;
  var outerLen = 2 * slotR * scale * Math.cos(theta);
  var innerLen = 2 * slotr * scale * Math.cos(theta);
  var startX = pX + direction * outerLen * Math.sin(theta);
  var startY = pY - outerLen * Math.cos(theta);
  var endX = pX + direction * innerLen * Math.sin(theta);
  var endY = pY - innerLen * Math.cos(theta);
  return {
    startX: startX,
    startY: startY,
    endX: endX,
    endY: endY
  };
}

function drawInclineSlotScene() {
  var pX = 330;
  var pY = 388;
  var axisX = 88;
  var scale = 0.78;
  var drawR = slotR * scale;
  var drawr = slotr * scale;
  var endpoints1 = slotEndpoints(pX, pY, scale, slotTheta1, "left");
  var endpoints2 = slotEndpoints(pX, pY, scale, slotTheta2, "right");
  var s1 = slotDisplacement(slotTheta1, slotT);
  var s2 = slotDisplacement(slotTheta2, slotT);
  var progress1 = s1 / slotLength(slotTheta1);
  var progress2 = s2 / slotLength(slotTheta2);
  var ball1X = endpoints1.startX + (endpoints1.endX - endpoints1.startX) * progress1;
  var ball1Y = endpoints1.startY + (endpoints1.endY - endpoints1.startY) * progress1;
  var ball2X = endpoints2.startX + (endpoints2.endX - endpoints2.startX) * progress2;
  var ball2Y = endpoints2.startY + (endpoints2.endY - endpoints2.startY) * progress2;
  var t1 = slotArriveTime();
  var t2 = slotArriveTime();
  var relation = "t₁ = t₂";

  if (Math.abs(t1 - t2) > 0.02) {
    relation = t1 > t2 ? "t₁ > t₂" : "t₁ < t₂";
  }

  stroke("#111827");
  strokeWeight(3);
  line(55, pY, 545, pY);

  stroke("#94a3b8");
  strokeWeight(2);
  line(axisX, pY, axisX, 58);
  drawArrow(axisX, pY, axisX, 62, "#64748b");

  noStroke();
  fill("#5b6472");
  textAlign(LEFT, TOP);
  textSize(12);
  text("高度示意", axisX + 10, 60);
  text("P 为最低点", pX + 10, pY + 10);

  stroke("#cbd5e1");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  noFill();
  circle(pX, pY - drawR, drawR * 2);
  circle(pX, pY - drawr, drawr * 2);
  line(pX, pY, pX, 82);
  drawingContext.setLineDash([]);

  stroke("#111827");
  strokeWeight(5);
  line(endpoints1.startX, endpoints1.startY, endpoints1.endX, endpoints1.endY);
  line(endpoints2.startX, endpoints2.startY, endpoints2.endX, endpoints2.endY);

  stroke("#2563eb");
  strokeWeight(3);
  line(endpoints1.startX, endpoints1.startY, ball1X, ball1Y);
  stroke("#dc2626");
  line(endpoints2.startX, endpoints2.startY, ball2X, ball2Y);

  noStroke();
  fill("#2563eb");
  circle(ball1X, ball1Y, 24);
  fill("#bfdbfe");
  circle(ball1X - 5, ball1Y - 5, 7);

  noStroke();
  fill("#dc2626");
  circle(ball2X, ball2Y, 24);
  fill("#fecaca");
  circle(ball2X - 5, ball2Y - 5, 7);

  noStroke();
  fill("#111827");
  circle(pX, pY, 8);
  fill("#2563eb");
  circle(endpoints1.endX, endpoints1.endY, 8);
  fill("#dc2626");
  circle(endpoints2.endX, endpoints2.endY, 8);

  noStroke();
  fill("#5b6472");
  textAlign(CENTER, TOP);
  textSize(12);
  text("A→B 槽 θ₁=" + slotTheta1.toFixed(0) + "°", endpoints1.startX, endpoints1.startY - 28);
  text("C→D 槽 θ₂=" + slotTheta2.toFixed(0) + "°", endpoints2.startX, endpoints2.startY - 28);
  text("R=" + slotR.toFixed(0), pX - drawR - 22, pY - drawR - 8);
  text("r=" + slotr.toFixed(0), pX + drawr + 22, pY - drawr - 8);

  noStroke();
}

function drawInclineSlotGraph() {
  var gx = graphLeft + 50;
  var gy = 62;
  var gw = graphRight - graphLeft - 80;
  var gh = 360;
  var s1Max = slotLength(slotTheta1);
  var s2Max = slotLength(slotTheta2);
  var t1 = slotArriveTime();
  var t2 = slotArriveTime();
  var yMin = 0;
  var yMax = Math.max(s1Max, s2Max) * 1.14;
  var tMax = Math.max(slotMaxT, t1, t2);
  var i;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text("沿槽位移-时间图像 s(t)", graphLeft + 24, 20);

  noStroke();
  fill("#5b6472");
  textSize(12);
  text("横轴：绝对时间 t / s；纵轴：沿槽位移 s / m", graphLeft + 24, 44);

  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);

  stroke("#e5e7eb");
  strokeWeight(1);
  for (i = 0; i <= 4; i++) {
    var gridY = gy + i * gh / 4;
    line(gx, gridY, gx + gw, gridY);
  }
  for (i = 0; i <= 4; i++) {
    var gridX = gx + i * gw / 4;
    line(gridX, gy, gridX, gy + gh);
  }

  noStroke();
  fill("#5b6472");
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (i = 0; i <= 4; i++) {
    var tickY = gy + i * gh / 4;
    var valY = map(i, 0, 4, yMax, yMin);
    text(valY.toFixed(0), gx - 8, tickY);
  }

  textAlign(CENTER, TOP);
  for (i = 0; i <= 4; i++) {
    var tickX = gx + i * gw / 4;
    var valT = i * tMax / 4;
    text(valT.toFixed(1) + "s", tickX, gy + gh + 10);
  }

  drawInclineSlotCurve(gx, gy, gw, gh, tMax, yMin, yMax, "one");
  drawInclineSlotCurve(gx, gy, gw, gh, tMax, yMin, yMax, "two");

  var arriveX1 = map(t1, 0, tMax, gx, gx + gw);
  var arriveY1 = map(s1Max, yMin, yMax, gy + gh, gy);
  var arriveX2 = map(t2, 0, tMax, gx, gx + gw);
  var arriveY2 = map(s2Max, yMin, yMax, gy + gh, gy);

  noStroke();
  fill("#2563eb");
  circle(arriveX1, arriveY1, 9);
  fill("#dc2626");
  circle(arriveX2, arriveY2, 9);

  var currentX = map(Math.min(slotT, tMax), 0, tMax, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);

  noStroke();
  fill("#2563eb");
  textAlign(LEFT, TOP);
  textSize(12);
  text("A 槽：s₁(t)，t₁=" + t1.toFixed(2) + "s", gx + 10, gy + 10);
  fill("#dc2626");
  text("C 槽：s₂(t)，t₂=" + t2.toFixed(2) + "s", gx + 10, gy + 28);
}

function drawInclineSlotCurve(gx, gy, gw, gh, tMax, yMin, yMax, kind) {
  var i;
  var thetaDeg = kind === "one" ? slotTheta1 : slotTheta2;
  var colorHex = kind === "one" ? "#2563eb" : "#dc2626";

  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  beginShape();
  for (i = 0; i <= 180; i++) {
    var t = i * tMax / 180;
    var s = slotDisplacement(thetaDeg, t);
    var px = map(t, 0, tMax, gx, gx + gw);
    var py = map(s, yMin, yMax, gy + gh, gy);
    vertex(px, py);
  }
  endShape();
}

