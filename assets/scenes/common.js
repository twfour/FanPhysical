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
  fill("#334155");
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
  var currentX = constrain(map(tNow, 0, Math.max(0.0001, tMax), gx, gx + gw), gx, gx + gw);
  stroke("#111827");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(currentX, gy, currentX, gy + gh);
  drawingContext.setLineDash([]);
}
