function drawArrow(x1, y1, x2, y2, colorHex) {
  var angle = Math.atan2(y2 - y1, x2 - x1);

  stroke(colorHex);
  strokeWeight(4);
  line(x1, y1, x2, y2);

  push();
  translate(x2, y2);
  rotate(angle);
  noStroke();
  fill(colorHex);
  triangle(0, 0, -12, -6, -12, 6);
  pop();
}


function drawBasicGrid(gx, gy, gw, gh) {
  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);
  stroke("#e5e7eb");
  for (var i = 0; i <= 4; i++) {
    line(gx, gy + i * gh / 4, gx + gw, gy + i * gh / 4);
    line(gx + i * gw / 4, gy, gx + i * gw / 4, gy + gh);
  }
}

function drawGraphTicks(gx, gy, gw, gh, xMax, yMax, xUnit) {
  noStroke();
  fill("#5b6472");
  textSize(11);
  textAlign(RIGHT, CENTER);
  for (var i = 0; i <= 4; i++) {
    var valY = map(i, 0, 4, yMax, 0);
    text(valY.toFixed(1), gx - 8, gy + i * gh / 4);
  }
  textAlign(CENTER, TOP);
  for (i = 0; i <= 4; i++) {
    text((i * xMax / 4).toFixed(1) + xUnit, gx + i * gw / 4, gy + gh + 10);
  }
}

function drawTimeMarker(gx, gy, gw, gh, tNow, tMax) {
  var currentX = map(tNow, 0, tMax, gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);
}


function trimData(arr) {
  while (arr.length > 2 && arr[0].t < simTime - graphWindow) {
    arr.shift();
  }
}

function drawGraph(data, title, yLabel, colorHex, frozen) {
  var gx = graphLeft + 48;
  var gy = 62;
  var gw = graphRight - graphLeft - 78;
  var gh = 360;
  var i;
  var tMin;
  var tMax;
  var yMin = -1;
  var yMax = 1;

  noStroke();
  fill("#111827");
  textAlign(LEFT, TOP);
  textSize(18);
  text(title, graphLeft + 24, 20);

  noStroke();
  fill("#5b6472");
  textSize(12);
  text("横轴：绝对时间 t / s；纵轴：" + yLabel, graphLeft + 24, 44);

  if (data.length > 0) {
    tMax = Math.max(graphWindow, data[data.length - 1].t);
  } else {
    tMax = Math.max(graphWindow, simTime);
  }
  tMin = Math.max(0, tMax - graphWindow);

  if (data.length > 0) {
    yMin = data[0].v;
    yMax = data[0].v;
    for (i = 0; i < data.length; i++) {
      if (data[i].v < yMin) {
        yMin = data[i].v;
      }
      if (data[i].v > yMax) {
        yMax = data[i].v;
      }
    }
  }

  var pad = Math.max(1, (yMax - yMin) * 0.18);
  if (Math.abs(yMax - yMin) < 0.001) {
    pad = Math.max(1, Math.abs(yMax) * 0.2);
  }
  yMin -= pad;
  yMax += pad;

  stroke("#cbd5e1");
  strokeWeight(1);
  noFill();
  rect(gx, gy, gw, gh);

  stroke("#e5e7eb");
  strokeWeight(1);
  for (i = 0; i <= 4; i++) {
    var yy = gy + i * gh / 4;
    line(gx, yy, gx + gw, yy);
  }

  for (i = 0; i <= 4; i++) {
    var xx = gx + i * gw / 4;
    line(xx, gy, xx, gy + gh);
  }

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
    var valT = tMin + i * (tMax - tMin) / 4;
    text(valT.toFixed(0) + "s", tickX, gy + gh + 10);
  }

  if (data.length > 1) {
    noFill();
    stroke(colorHex);
    strokeWeight(2.5);
    beginShape();
    for (i = 0; i < data.length; i++) {
      var px = map(data[i].t, tMin, tMax, gx, gx + gw);
      var py = map(data[i].v, yMin, yMax, gy + gh, gy);
      vertex(px, py);
    }
    endShape();
  }

  if (frozen) {
    noStroke();
    fill("#111827");
    textAlign(RIGHT, TOP);
    textSize(12);
    text("图表已冻结", gx + gw, gy - 22);
  }
}

