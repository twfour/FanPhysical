function meVariant() {
  return ((problemDataMap[currentScene] || {}).animation || {}).variant || "";
}

function meParam(key, fallback) {
  return getJsonParam(currentScene, key, fallback);
}

function meTime() {
  return getJsonAnimationState(currentScene).time;
}

function meDuration() {
  return getJsonDuration(currentScene);
}

function meProgress() {
  return constrain(meTime() / Math.max(0.001, meDuration()), 0, 1);
}

var mechanicalEnergySoundProfiles = {
  lesson12_reference_plane: {
    description: "下落风声随速度增强，落地时触发撞击声",
    startEvent: "",
    endEvent: "impact",
    endIntensity: 1
  },
  lesson12_well_throw: {
    description: "上抛风声随速度减弱，最高点以轻提示音标记",
    startEvent: "launch",
    startIntensity: 0.7,
    endEvent: "apex",
    endIntensity: 0.55
  },
  lesson12_conservation_condition: {
    description: "斜抛风声按瞬时速度变化，最高点与落地分别提示",
    startEvent: "launch",
    startIntensity: 0.7,
    endEvent: "impact",
    endIntensity: 0.85
  },
  lesson12_football_reference: {
    description: "踢球声后接随速度变化的飞行风声，到达 B 点时提示",
    startEvent: "kick",
    startIntensity: 0.85,
    endEvent: "marker",
    endIntensity: 0.45
  },
  lesson12_arc_max_height: {
    description: "沿轨道运动时生成滚动声，离轨后切换为风声",
    startEvent: "",
    endEvent: "apex",
    endIntensity: 0.45
  },
  lesson12_ball_spring_platform: {
    description: "自由下落使用风声，接触平台后切换为弹簧压缩声",
    startEvent: "",
    endEvent: "stop",
    endIntensity: 0.65
  },
  lesson12_rod_two_balls: {
    description: "转轴声随双球转动速度增强，末位置轻缓停止",
    startEvent: "",
    endEvent: "stop",
    endIntensity: 0.45
  },
  lesson12_u_tube_water: {
    description: "阀门开启后水流声先增强再减弱，等高时停止",
    startEvent: "valve",
    startIntensity: 0.65,
    endEvent: "settle",
    endIntensity: 0.45
  },
  lesson12_accelerated_descent: {
    description: "下降风声随速度增强，抵达底部时触发撞击声",
    startEvent: "",
    endEvent: "impact",
    endIntensity: 0.9
  },
  lesson12_spring_ek_height: {
    description: "先播放弹簧释放声，分离后切换为上抛风声",
    startEvent: "release",
    startIntensity: 0.65,
    endEvent: "apex",
    endIntensity: 0.5
  },
  lesson12_rope_spring_linkage: {
    description: "滑轮与弹簧声随系统速度变化，末态轻缓停止",
    startEvent: "",
    endEvent: "settle",
    endIntensity: 0.45
  },
  lesson12_projectile_sea: {
    description: "抛体风声按瞬时速度变化，落海时触发水花声",
    startEvent: "launch",
    startIntensity: 0.7,
    endEvent: "splash",
    endIntensity: 0.9
  },
  lesson12_pirate_spring: {
    description: "弹簧释放音色随压缩量和小球速度同步变化",
    startEvent: "release",
    startIntensity: 0.8,
    endEvent: "marker",
    endIntensity: 0.45
  },
  lesson12_track_deformation: {
    description: "三条路径使用轨道运动声，达到各自最高点时提示",
    startEvent: "",
    endEvent: "apex",
    endIntensity: 0.45
  },
  lesson12_incline_pull: {
    description: "沿斜面滑动声随速度增强，终点时停止",
    startEvent: "",
    endEvent: "stop",
    endIntensity: 0.5
  },
  lesson12_car_two_roads: {
    description: "发动机声贯穿两路段，进入坡道时有换挡提示",
    startEvent: "",
    endEvent: "stop",
    endIntensity: 0.55
  },
  lesson12_pulley_slider: {
    description: "滑轮运转声持续播放，A 改变运动方向时提示",
    startEvent: "",
    endEvent: "settle",
    endIntensity: 0.45
  },
  lesson12_buffer_device: {
    description: "撞击后先播放弹簧压缩声，轻杆启动后切换为摩擦声",
    startEvent: "impact",
    startIntensity: 0.65,
    endEvent: "stop",
    endIntensity: 0.7
  },
  lesson12_sliding_rope: {
    description: "柔绳滑动声随下滑速度增强，完全滑离时触发落绳声",
    startEvent: "",
    endEvent: "rope",
    endIntensity: 0.75
  },
  lesson12_rod_end_balls: {
    description: "转轴声按角速度变化，从最高点转至最低点后停止",
    startEvent: "",
    endEvent: "stop",
    endIntensity: 0.55
  },
  lesson12_linked_sliders: {
    description: "滑块与刚杆运动声随速度变化，a 落地时触发撞击声",
    startEvent: "",
    endEvent: "impact",
    endIntensity: 0.85
  }
};

function meSoundClamp(value) {
  return Math.max(0, Math.min(1, Number(value || 0)));
}

function meSoundFrame(mode, speed, amount) {
  var v = meSoundClamp(speed);
  var x = meSoundClamp(amount);
  var frame = {
    noiseType: "bandpass",
    noiseGain: 0,
    noiseFrequency: 420,
    noiseQ: 0.72,
    toneType: "sine",
    toneGain: 0,
    toneFrequency: 100
  };
  if (mode === "air") {
    frame.noiseGain = 0.082 * Math.pow(v, 1.2);
    frame.noiseFrequency = 420 + 1500 * v;
  } else if (mode === "track") {
    frame.noiseType = "lowpass";
    frame.noiseGain = 0.043 * v;
    frame.noiseFrequency = 620 + 1450 * v;
    frame.noiseQ = 0.42;
    frame.toneType = "triangle";
    frame.toneGain = 0.016 * v;
    frame.toneFrequency = 78 + 105 * v;
  } else if (mode === "slide") {
    frame.noiseType = "highpass";
    frame.noiseGain = 0.045 * v;
    frame.noiseFrequency = 420 + 920 * v;
    frame.noiseQ = 0.36;
    frame.toneType = "triangle";
    frame.toneGain = 0.01 * v;
    frame.toneFrequency = 72 + 58 * v;
  } else if (mode === "spring") {
    frame.noiseType = "lowpass";
    frame.noiseGain = 0.015 * v;
    frame.noiseFrequency = 680 + 620 * v;
    frame.noiseQ = 0.5;
    frame.toneType = "triangle";
    frame.toneGain = 0.038 * v * (0.35 + 0.65 * x);
    frame.toneFrequency = 175 + 280 * x;
  } else if (mode === "water") {
    frame.noiseGain = 0.058 * v;
    frame.noiseFrequency = 280 + 760 * v;
    frame.noiseQ = 0.55;
    frame.toneGain = 0.012 * v;
    frame.toneFrequency = 68 + 42 * v;
  } else if (mode === "engine") {
    frame.noiseType = "lowpass";
    frame.noiseGain = 0.024 + 0.018 * v;
    frame.noiseFrequency = 720 + 620 * v + 180 * x;
    frame.noiseQ = 0.4;
    frame.toneType = "sawtooth";
    frame.toneGain = 0.017 + 0.01 * x;
    frame.toneFrequency = 72 + 34 * v + 18 * x;
  } else if (mode === "pulley") {
    frame.noiseGain = 0.02 * v;
    frame.noiseFrequency = 720 + 860 * v;
    frame.noiseQ = 0.85;
    frame.toneGain = 0.022 * v;
    frame.toneFrequency = 96 + 92 * v + 36 * x;
  } else if (mode === "rotor") {
    frame.noiseGain = 0.021 * v;
    frame.noiseFrequency = 620 + 780 * v;
    frame.noiseQ = 0.9;
    frame.toneGain = 0.025 * v;
    frame.toneFrequency = 84 + 142 * v;
  }
  return frame;
}

function getMechanicalEnergySoundProfile(sceneName) {
  var variant = (((problemDataMap[sceneName] || {}).animation || {}).variant || "");
  return mechanicalEnergySoundProfiles[variant] || {
    description: "音效会跟随动画速度和关键物理事件变化",
    startEvent: "",
    endEvent: "stop",
    endIntensity: 0.5
  };
}

function meSoundProjectileData(sceneName, progress, kind) {
  var speed = getJsonParam(sceneName, "speed", kind === "football" ? 20 : (kind === "sea" ? 12 : 16));
  var g = Math.max(0.1, getJsonParam(sceneName, "g", 10));
  var angleDegree = kind === "football" ? 55 : (kind === "sea" ? 35 : getJsonParam(sceneName, "angle", 55));
  var angle = angleDegree * Math.PI / 180;
  var vx = speed * Math.cos(angle);
  var vy = speed * Math.sin(angle);
  var totalTime;
  if (kind === "sea") {
    var depth = getJsonParam(sceneName, "depth", 8);
    totalTime = (vy + Math.sqrt(vy * vy + 2 * g * depth)) / g;
  } else if (kind === "football") {
    var height = getJsonParam(sceneName, "height", 8);
    var discriminant = Math.max(0, vy * vy - 2 * g * height);
    totalTime = (vy - Math.sqrt(discriminant)) / g;
    if (totalTime <= 0.01) {
      totalTime = vy / g;
    }
  } else {
    totalTime = 2 * vy / g;
  }
  var currentVy = vy - g * totalTime * meSoundClamp(progress);
  var currentSpeed = Math.sqrt(vx * vx + currentVy * currentVy);
  var endVy = vy - g * totalTime;
  var maxSpeed = Math.max(speed, Math.sqrt(vx * vx + endVy * endVy));
  return {
    speedLevel: meSoundClamp(currentSpeed / Math.max(0.1, maxSpeed)),
    apexProgress: meSoundClamp((vy / g) / Math.max(0.001, totalTime))
  };
}

function meSpringEkSoundReleaseProgress(sceneName) {
  var m = getJsonParam(sceneName, "mass", 0.2);
  var k = getJsonParam(sceneName, "k", 100);
  var h0 = getJsonParam(sceneName, "startHeight", 0.1);
  var hn = Math.max(h0 + 0.01, getJsonParam(sceneName, "naturalHeight", 0.2));
  var g = getJsonParam(sceneName, "g", 10);
  var total = m * g * h0 + 0.5 * k * Math.pow(hn - h0, 2);
  var hmax = total / Math.max(0.001, m * g);
  var ratio = meSoundClamp((hn - h0) / Math.max(0.001, hmax - h0));
  return meSoundClamp(1 - Math.sqrt(Math.max(0, 1 - ratio)));
}

function getMechanicalEnergySoundFrame(sceneName, progress) {
  var variant = (((problemDataMap[sceneName] || {}).animation || {}).variant || "");
  var q = meSoundClamp(progress);
  if (variant === "lesson12_reference_plane") {
    return meSoundFrame("air", q, 0);
  }
  if (variant === "lesson12_well_throw") {
    return meSoundFrame("air", 1 - q, 0);
  }
  if (variant === "lesson12_conservation_condition") {
    return meSoundFrame("air", meSoundProjectileData(sceneName, q, "conservation").speedLevel, 0);
  }
  if (variant === "lesson12_football_reference") {
    return meSoundFrame("air", meSoundProjectileData(sceneName, q, "football").speedLevel, 0);
  }
  if (variant === "lesson12_arc_max_height") {
    if (q < 0.68) {
      return meSoundFrame("track", Math.sqrt(q / 0.68), 0);
    }
    return meSoundFrame("air", 1 - (q - 0.68) / 0.32, 0);
  }
  if (variant === "lesson12_ball_spring_platform") {
    if (q < 0.34) {
      return meSoundFrame("air", q / 0.34, 0);
    }
    var compressionProgress = (q - 0.34) / 0.66;
    return meSoundFrame("spring", 1 - compressionProgress, compressionProgress);
  }
  if (variant === "lesson12_rod_two_balls") {
    return meSoundFrame("rotor", Math.sqrt(Math.sin(q * Math.PI / 2)), q);
  }
  if (variant === "lesson12_u_tube_water") {
    return meSoundFrame("water", Math.sin(q * Math.PI), 1 - q);
  }
  if (variant === "lesson12_accelerated_descent") {
    return meSoundFrame("air", q, 0);
  }
  if (variant === "lesson12_spring_ek_height") {
    var releaseProgress = meSpringEkSoundReleaseProgress(sceneName);
    if (q < releaseProgress) {
      return meSoundFrame("spring", Math.sin((q / Math.max(0.001, releaseProgress)) * Math.PI / 2), 1 - q / Math.max(0.001, releaseProgress));
    }
    return meSoundFrame("air", 1 - (q - releaseProgress) / Math.max(0.001, 1 - releaseProgress), 0);
  }
  if (variant === "lesson12_rope_spring_linkage") {
    return meSoundFrame("pulley", Math.sin(q * Math.PI), Math.abs(2 * q - 1));
  }
  if (variant === "lesson12_projectile_sea") {
    return meSoundFrame("air", meSoundProjectileData(sceneName, q, "sea").speedLevel, 0);
  }
  if (variant === "lesson12_pirate_spring") {
    return meSoundFrame("spring", Math.sin(q * Math.PI), 1 - q);
  }
  if (variant === "lesson12_track_deformation") {
    return meSoundFrame("track", 1 - 0.72 * q, q);
  }
  if (variant === "lesson12_incline_pull") {
    return meSoundFrame("slide", q, 0);
  }
  if (variant === "lesson12_car_two_roads") {
    return meSoundFrame("engine", 0.72, q >= 0.45 ? 1 : 0);
  }
  if (variant === "lesson12_pulley_slider") {
    return meSoundFrame("pulley", 0.58 + 0.22 * Math.abs(q - 0.64), q);
  }
  if (variant === "lesson12_buffer_device") {
    if (q < 0.36) {
      return meSoundFrame("spring", 0.8, q / 0.36);
    }
    return meSoundFrame("slide", 0.62, (q - 0.36) / 0.64);
  }
  if (variant === "lesson12_sliding_rope") {
    return meSoundFrame("slide", Math.sqrt(q), q);
  }
  if (variant === "lesson12_rod_end_balls") {
    return meSoundFrame("rotor", Math.sqrt((9 - 4 * Math.cos(Math.PI * q)) / 13), q);
  }
  if (variant === "lesson12_linked_sliders") {
    return meSoundFrame("slide", Math.sqrt(q), q);
  }
  return meSoundFrame("track", Math.sin(q * Math.PI), q);
}

function getMechanicalEnergySoundCues(sceneName) {
  var variant = (((problemDataMap[sceneName] || {}).animation || {}).variant || "");
  if (variant === "lesson12_conservation_condition") {
    return [{ at: 0.5, event: "apex", intensity: 0.35 }];
  }
  if (variant === "lesson12_arc_max_height") {
    return [{ at: 0.68, event: "release", intensity: 0.45 }];
  }
  if (variant === "lesson12_ball_spring_platform") {
    return [{ at: 0.34, event: "contact", intensity: 0.7 }];
  }
  if (variant === "lesson12_spring_ek_height") {
    return [{ at: meSpringEkSoundReleaseProgress(sceneName), event: "release", intensity: 0.45 }];
  }
  if (variant === "lesson12_projectile_sea") {
    return [{ at: meSoundProjectileData(sceneName, 0, "sea").apexProgress, event: "apex", intensity: 0.3 }];
  }
  if (variant === "lesson12_car_two_roads") {
    return [{ at: 0.45, event: "shift", intensity: 0.55 }];
  }
  if (variant === "lesson12_pulley_slider") {
    return [{ at: 16 / 25, event: "turn", intensity: 0.45 }];
  }
  if (variant === "lesson12_buffer_device") {
    return [{ at: 0.36, event: "contact", intensity: 0.65 }];
  }
  return [];
}

function meText(label, x, y, colorHex, size, alignMode) {
  noStroke();
  fill(colorHex || "#334155");
  textSize(size || 14);
  textAlign(alignMode || LEFT, CENTER);
  text(label, x, y);
}

function meArrow(x1, y1, x2, y2, colorHex, label) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var head = 8;
  stroke(colorHex || "#dc2626");
  strokeWeight(2.2);
  line(x1, y1, x2, y2);
  line(x2, y2, x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  line(x2, y2, x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  if (label) {
    meText(label, x2 + 7, y2 - 9, colorHex || "#dc2626", 13, LEFT);
  }
}

function meBall(x, y, colorHex, label, radius) {
  stroke("#ffffff");
  strokeWeight(2);
  fill(colorHex || "#2563eb");
  circle(x, y, radius || 22);
  if (label) {
    meText(label, x, y - 20, "#0f172a", 13, CENTER);
  }
}

function meBlock(x, y, colorHex, label, angle) {
  push();
  translate(x, y);
  rotate(angle || 0);
  fill(colorHex || "#f97316");
  stroke("#9a3412");
  strokeWeight(1.5);
  rect(-18, -14, 36, 28, 4);
  pop();
  if (label) {
    meText(label, x, y - 25, "#0f172a", 13, CENTER);
  }
}

function meSpring(x1, y1, x2, y2, colorHex, coils) {
  var turns = coils || 9;
  var dx = x2 - x1;
  var dy = y2 - y1;
  var length = Math.sqrt(dx * dx + dy * dy);
  var nx = length ? -dy / length : 0;
  var ny = length ? dx / length : 0;
  noFill();
  stroke(colorHex || "#2563eb");
  strokeWeight(2);
  beginShape();
  vertex(x1, y1);
  for (var i = 1; i < turns * 2; i += 1) {
    var ratio = i / (turns * 2);
    var offset = (i % 2 ? 1 : -1) * 7;
    vertex(x1 + dx * ratio + nx * offset, y1 + dy * ratio + ny * offset);
  }
  vertex(x2, y2);
  endShape();
}

function meGround(y, x1, x2) {
  var left = x1 === undefined ? 28 : x1;
  var right = x2 === undefined ? 542 : x2;
  stroke("#64748b");
  strokeWeight(2);
  line(left, y, right, y);
  stroke("#cbd5e1");
  strokeWeight(1);
  for (var x = left + 7; x < right; x += 18) {
    line(x, y, x - 8, y + 9);
  }
}

function meAxes(title, xLabel, yLabel, xMin, xMax, yMin, yMax) {
  var frame = { left: 620, right: 970, top: 82, bottom: 430 };
  fill("#ffffff");
  stroke("#cbd5e1");
  strokeWeight(1.2);
  rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  meText(title, 795, 36, "#0f172a", 17, CENTER);
  meText(yLabel, 592, 64, "#334155", 13, CENTER);
  meText(xLabel, 795, 468, "#334155", 13, CENTER);
  for (var i = 0; i <= 4; i += 1) {
    var px = map(i, 0, 4, frame.left, frame.right);
    var py = map(i, 0, 4, frame.bottom, frame.top);
    stroke("#e2e8f0");
    strokeWeight(1);
    line(px, frame.top, px, frame.bottom);
    line(frame.left, py, frame.right, py);
    meText(meNumber(map(i, 0, 4, xMin, xMax)), px, frame.bottom + 18, "#475569", 11, CENTER);
    meText(meNumber(map(i, 0, 4, yMin, yMax)), frame.left - 10, py, "#475569", 11, RIGHT);
  }
  frame.xMin = xMin;
  frame.xMax = xMax;
  frame.yMin = yMin;
  frame.yMax = yMax;
  return frame;
}

function meNumber(value) {
  var absolute = Math.abs(value);
  if (absolute >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (absolute >= 1000) return (value / 1000).toFixed(1) + "k";
  if (absolute >= 10) return value.toFixed(0);
  if (absolute >= 1) return value.toFixed(1);
  return value.toFixed(2);
}

function meGX(frame, value) {
  return map(value, frame.xMin, frame.xMax, frame.left, frame.right);
}

function meGY(frame, value) {
  return map(value, frame.yMin, frame.yMax, frame.bottom, frame.top);
}

function mePlot(frame, colorHex, valueAt, segments, dashed) {
  var count = segments || 140;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(frame.left, frame.top, frame.right - frame.left, frame.bottom - frame.top);
  drawingContext.clip();
  noFill();
  stroke(colorHex);
  strokeWeight(2.5);
  drawingContext.setLineDash(dashed ? [6, 5] : []);
  beginShape();
  for (var i = 0; i <= count; i += 1) {
    var xValue = map(i, 0, count, frame.xMin, frame.xMax);
    var yValue = valueAt(xValue);
    if (Number.isFinite(yValue)) {
      vertex(meGX(frame, xValue), meGY(frame, yValue));
    }
  }
  endShape();
  drawingContext.setLineDash([]);
  drawingContext.restore();
  pop();
}

function meMarker(frame, xValue, yValue, colorHex) {
  var x = meGX(frame, constrain(xValue, frame.xMin, frame.xMax));
  var y = meGY(frame, constrain(yValue, frame.yMin, frame.yMax));
  push();
  stroke(colorHex || "#dc2626");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(x, frame.bottom, x, y);
  line(frame.left, y, x, y);
  drawingContext.setLineDash([]);
  noStroke();
  fill(colorHex || "#dc2626");
  circle(x, y, 9);
  pop();
}

function meLegend(items, x, y) {
  for (var i = 0; i < items.length; i += 1) {
    noStroke();
    fill(items[i].color);
    circle(x, y + i * 21, 8);
    meText(items[i].label, x + 10, y + i * 21, "#334155", 12, LEFT);
  }
}

function meBar(frame, index, count, value, colorHex, label, valueLabel) {
  var slot = (frame.right - frame.left) / count;
  var width = slot * 0.56;
  var x = frame.left + slot * index + (slot - width) / 2;
  var y = meGY(frame, constrain(value, frame.yMin, frame.yMax));
  noStroke();
  fill(colorHex);
  rect(x, y, width, frame.bottom - y, 4, 4, 0, 0);
  meText(label, x + width / 2, frame.bottom + 18, "#334155", 12, CENTER);
  meText(valueLabel || meNumber(value), x + width / 2, y - 12, colorHex, 12, CENTER);
}

function meArcPath(cx, cy, radius, startAngle, endAngle, colorHex, weight) {
  noFill();
  stroke(colorHex || "#64748b");
  strokeWeight(weight || 3);
  beginShape();
  for (var i = 0; i <= 50; i += 1) {
    var angle = lerp(startAngle, endAngle, i / 50);
    vertex(cx + radius * Math.sin(angle), cy + radius * Math.cos(angle));
  }
  endShape();
}

function meCar(x, y, angle) {
  push();
  translate(x, y);
  rotate(angle || 0);
  fill("#2563eb");
  stroke("#1e3a8a");
  strokeWeight(1.5);
  rect(-28, -15, 56, 24, 5);
  fill("#bfdbfe");
  quad(-16, -15, -7, -29, 16, -29, 25, -15);
  fill("#0f172a");
  circle(-17, 12, 12);
  circle(18, 12, 12);
  pop();
}

function drawMechanicalEnergyModelScene() {
  var variant = meVariant();
  if (variant === "lesson12_reference_plane") drawLesson12ReferencePlaneScene();
  else if (variant === "lesson12_well_throw") drawLesson12WellThrowScene();
  else if (variant === "lesson12_conservation_condition") drawLesson12ConservationScene();
  else if (variant === "lesson12_football_reference") drawLesson12FootballScene();
  else if (variant === "lesson12_arc_max_height") drawLesson12ArcHeightScene();
  else if (variant === "lesson12_ball_spring_platform") drawLesson12BallSpringScene();
  else if (variant === "lesson12_rod_two_balls") drawLesson12RodTwoBallsScene();
  else if (variant === "lesson12_u_tube_water") drawLesson12UTubeScene();
  else if (variant === "lesson12_accelerated_descent") drawLesson12AcceleratedDescentScene();
  else if (variant === "lesson12_spring_ek_height") drawLesson12SpringEkScene();
  else if (variant === "lesson12_rope_spring_linkage") drawLesson12RopeSpringScene();
  else if (variant === "lesson12_projectile_sea") drawLesson12ProjectileSeaScene();
  else if (variant === "lesson12_pirate_spring") drawLesson12PirateSpringScene();
  else if (variant === "lesson12_track_deformation") drawLesson12TrackDeformationScene();
  else if (variant === "lesson12_incline_pull") drawLesson12InclinePullScene();
  else if (variant === "lesson12_car_two_roads") drawLesson12CarRoadsScene();
  else if (variant === "lesson12_pulley_slider") drawLesson12PulleySliderScene();
  else if (variant === "lesson12_buffer_device") drawLesson12BufferScene();
  else if (variant === "lesson12_sliding_rope") drawLesson12SlidingRopeScene();
  else if (variant === "lesson12_rod_end_balls") drawLesson12RodEndBallsScene();
  else if (variant === "lesson12_linked_sliders") drawLesson12LinkedSlidersScene();
}

function drawMechanicalEnergyModelGraph() {
  var variant = meVariant();
  if (variant === "lesson12_reference_plane") drawLesson12ReferencePlaneGraph();
  else if (variant === "lesson12_well_throw") drawLesson12WellThrowGraph();
  else if (variant === "lesson12_conservation_condition") drawLesson12ConservationGraph();
  else if (variant === "lesson12_football_reference") drawLesson12FootballGraph();
  else if (variant === "lesson12_arc_max_height") drawLesson12ArcHeightGraph();
  else if (variant === "lesson12_ball_spring_platform") drawLesson12BallSpringGraph();
  else if (variant === "lesson12_rod_two_balls") drawLesson12RodTwoBallsGraph();
  else if (variant === "lesson12_u_tube_water") drawLesson12UTubeGraph();
  else if (variant === "lesson12_accelerated_descent") drawLesson12AcceleratedDescentGraph();
  else if (variant === "lesson12_spring_ek_height") drawLesson12SpringEkGraph();
  else if (variant === "lesson12_rope_spring_linkage") drawLesson12RopeSpringGraph();
  else if (variant === "lesson12_projectile_sea") drawLesson12ProjectileSeaGraph();
  else if (variant === "lesson12_pirate_spring") drawLesson12PirateSpringGraph();
  else if (variant === "lesson12_track_deformation") drawLesson12TrackDeformationGraph();
  else if (variant === "lesson12_incline_pull") drawLesson12InclinePullGraph();
  else if (variant === "lesson12_car_two_roads") drawLesson12CarRoadsGraph();
  else if (variant === "lesson12_pulley_slider") drawLesson12PulleySliderGraph();
  else if (variant === "lesson12_buffer_device") drawLesson12BufferGraph();
  else if (variant === "lesson12_sliding_rope") drawLesson12SlidingRopeGraph();
  else if (variant === "lesson12_rod_end_balls") drawLesson12RodEndBallsGraph();
  else if (variant === "lesson12_linked_sliders") drawLesson12LinkedSlidersGraph();
}

function drawLesson12ReferencePlaneScene() {
  var q = meProgress();
  var h1 = meParam("h1", 1.2);
  var h2 = meParam("h2", 0.8);
  var groundY = 410;
  var topY = 82;
  var tableY = map(h2, 0, h1 + h2, groundY, topY);
  var ballY = lerp(topY, groundY, q * q);
  meText("同一位置，不同零势能参考面", 28, 30, "#0f172a", 18, LEFT);
  meGround(groundY, 32, 542);
  fill("#94a3b8");
  stroke("#475569");
  rect(70, tableY, 320, 14);
  rect(92, tableY + 14, 12, groundY - tableY - 14);
  rect(356, tableY + 14, 12, groundY - tableY - 14);
  meBall(230, ballY, "#22c55e", "");
  meText("A", 257, topY, "#0f172a", 14, LEFT);
  meText("B", 257, groundY - 8, "#0f172a", 14, LEFT);
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(405, tableY, 534, tableY);
  stroke("#2563eb");
  line(405, groundY, 534, groundY);
  drawingContext.setLineDash([]);
  meText("桌面参考面", 408, tableY - 14, "#dc2626", 13, LEFT);
  meText("地面参考面", 408, groundY - 15, "#2563eb", 13, LEFT);
  meText("下落高度 = " + (q * (h1 + h2)).toFixed(2) + " m", 28, 466, "#334155", 14, LEFT);
}

function drawLesson12ReferencePlaneGraph() {
  var m = meParam("mass", 0.5);
  var h1 = meParam("h1", 1.2);
  var h2 = meParam("h2", 0.8);
  var g = meParam("g", 10);
  var minE = -m * g * h2 * 1.15;
  var maxE = m * g * (h1 + h2) * 1.12;
  var frame = meAxes("重力势能只差一个常量", "相对桌面的高度 y / m", "Eₚ / J", -h2, h1, minE, maxE);
  mePlot(frame, "#dc2626", function (y) { return m * g * y; });
  mePlot(frame, "#2563eb", function (y) { return m * g * (y + h2); }, 140, true);
  var currentY = h1 - (h1 + h2) * meProgress();
  meMarker(frame, currentY, m * g * currentY, "#dc2626");
  meLegend([
    { color: "#dc2626", label: "以桌面为零势能面" },
    { color: "#2563eb", label: "以地面为零势能面" }
  ], 690, 110);
}

function meWellMaximum(mass) {
  var energy = meParam("initialEnergy", 300);
  var depth = meParam("depth", 10);
  var g = meParam("g", 10);
  return {
    height: energy / (mass * g) - depth,
    potential: energy - mass * g * depth
  };
}

function drawLesson12WellThrowScene() {
  var q = meProgress();
  var light = meParam("lightMass", 1);
  var heavy = Math.max(light + 0.1, meParam("heavyMass", 2));
  var depth = meParam("depth", 10);
  var lightMax = meWellMaximum(light).height;
  var heavyMax = meWellMaximum(heavy).height;
  var upper = Math.max(1, lightMax, heavyMax);
  var lower = -depth;
  meText("同初动能：质量越小，最高点势能越大", 28, 30, "#0f172a", 18, LEFT);
  fill("#e2e8f0");
  noStroke();
  rect(82, 126, 380, 310);
  fill("#ffffff");
  rect(145, 126, 105, 310);
  rect(315, 126, 105, 310);
  stroke("#475569");
  strokeWeight(3);
  line(72, 126, 472, 126);
  meText("地面 Eₚ=0", 84, 106, "#475569", 13, LEFT);
  var ease = 2 * q - q * q;
  var lightYValue = -depth + (lightMax + depth) * ease;
  var heavyYValue = -depth + (heavyMax + depth) * ease;
  var lightY = map(lightYValue, lower, upper, 414, 74);
  var heavyY = map(heavyYValue, lower, upper, 414, 74);
  meBall(198, lightY, "#2563eb", "m₁");
  meBall(368, heavyY, "#f97316", "m₂");
  meArrow(198, 402, 198, lightY + 18, "#2563eb", "");
  meArrow(368, 402, 368, heavyY + 18, "#f97316", "");
  meText("m₁ = " + light.toFixed(1) + " kg", 145, 458, "#2563eb", 13, LEFT);
  meText("m₂ = " + heavy.toFixed(1) + " kg", 315, 458, "#f97316", 13, LEFT);
}

function drawLesson12WellThrowGraph() {
  var light = meParam("lightMass", 1);
  var heavy = Math.max(light + 0.1, meParam("heavyMass", 2));
  var energy = meParam("initialEnergy", 300);
  var depth = meParam("depth", 10);
  var g = meParam("g", 10);
  var xMax = Math.max(4, heavy * 1.3);
  var yAtMax = energy - 0.5 * g * depth;
  var yAtEnd = energy - xMax * g * depth;
  var frame = meAxes("最高点势能随质量变化", "质量 m / kg", "Eₚ,max / J", 0.5, xMax, Math.min(0, yAtEnd) * 1.1, Math.max(10, yAtMax) * 1.1);
  mePlot(frame, "#2563eb", function (mass) { return energy - mass * g * depth; });
  meMarker(frame, light, energy - light * g * depth, "#2563eb");
  meMarker(frame, heavy, energy - heavy * g * depth, "#f97316");
  meText("斜率 = -gH", 790, 112, "#334155", 13, CENTER);
}

function meProjectileValues(progress) {
  var speed = meParam("speed", 16);
  var angle = meParam("angle", 55) * Math.PI / 180;
  var g = meParam("g", 10);
  var totalTime = 2 * speed * Math.sin(angle) / g;
  var time = progress * totalTime;
  return {
    x: speed * Math.cos(angle) * time,
    y: speed * Math.sin(angle) * time - 0.5 * g * time * time,
    vx: speed * Math.cos(angle),
    vy: speed * Math.sin(angle) - g * time,
    totalTime: totalTime
  };
}

function drawLesson12ConservationScene() {
  var p = meProjectileValues(meProgress());
  var speed = meParam("speed", 16);
  var angle = meParam("angle", 55) * Math.PI / 180;
  var g = meParam("g", 10);
  var range = speed * speed * Math.sin(2 * angle) / g;
  var maxH = speed * speed * Math.sin(angle) * Math.sin(angle) / (2 * g);
  var x = map(p.x, 0, Math.max(0.1, range), 58, 518);
  var y = map(p.y, 0, Math.max(0.1, maxH), 398, 110);
  meText("曲线运动也可以机械能守恒", 28, 30, "#0f172a", 18, LEFT);
  meGround(410, 32, 542);
  noFill();
  stroke("#94a3b8");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  beginShape();
  for (var i = 0; i <= 60; i += 1) {
    var sample = meProjectileValues(i / 60);
    vertex(map(sample.x, 0, range, 58, 518), map(sample.y, 0, maxH, 398, 110));
  }
  endShape();
  drawingContext.setLineDash([]);
  meBall(x, y, "#2563eb", "");
  meArrow(x, y, x + p.vx * 3.2, y - p.vy * 3.2, "#dc2626", "v");
  meArrow(x, y, x, y + 62, "#f97316", "mg");
  meText("只有重力做功", 31, 458, "#334155", 14, LEFT);
}

function drawLesson12ConservationGraph() {
  var m = meParam("mass", 1);
  var speed = meParam("speed", 16);
  var angle = meParam("angle", 55) * Math.PI / 180;
  var g = meParam("g", 10);
  var total = 0.5 * m * speed * speed;
  var frame = meAxes("斜抛过程的能量转化", "归一化时间 t/T", "能量 / J", 0, 1, 0, total * 1.12);
  mePlot(frame, "#2563eb", function (u) {
    var t = 2 * speed * Math.sin(angle) * u / g;
    var y = speed * Math.sin(angle) * t - 0.5 * g * t * t;
    return m * g * Math.max(0, y);
  });
  mePlot(frame, "#f97316", function (u) {
    var t = 2 * speed * Math.sin(angle) * u / g;
    var y = speed * Math.sin(angle) * t - 0.5 * g * t * t;
    return total - m * g * Math.max(0, y);
  });
  mePlot(frame, "#0f766e", function () { return total; }, 30, true);
  var current = meProgress();
  var currentValue = meProjectileValues(current);
  meMarker(frame, current, m * g * Math.max(0, currentValue.y), "#2563eb");
  meLegend([
    { color: "#2563eb", label: "重力势能 Eₚ" },
    { color: "#f97316", label: "动能 Eₖ" },
    { color: "#0f766e", label: "机械能 E" }
  ], 690, 110);
}

function meFootballValues(progress) {
  var speed = meParam("speed", 20);
  var height = meParam("height", 8);
  var g = meParam("g", 10);
  var angle = 55 * Math.PI / 180;
  var vy = speed * Math.sin(angle);
  var discriminant = Math.max(0, vy * vy - 2 * g * height);
  var timeB = (vy - Math.sqrt(discriminant)) / g;
  if (timeB <= 0.01) timeB = vy / g;
  var time = progress * timeB;
  return {
    x: speed * Math.cos(angle) * time,
    y: speed * Math.sin(angle) * time - 0.5 * g * time * time,
    targetX: speed * Math.cos(angle) * timeB
  };
}

function drawLesson12FootballScene() {
  var p = meFootballValues(meProgress());
  var height = meParam("height", 8);
  var x = map(p.x, 0, Math.max(0.1, p.targetX), 72, 480);
  var y = map(p.y, 0, Math.max(0.1, height), 392, 116);
  meText("取 B 点为零势能面", 28, 30, "#0f172a", 18, LEFT);
  meGround(410, 32, 542);
  stroke("#2563eb");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(42, 116, 532, 116);
  drawingContext.setLineDash([]);
  meText("B：Eₚ=0", 430, 96, "#2563eb", 13, LEFT);
  noFill();
  stroke("#94a3b8");
  drawingContext.setLineDash([4, 4]);
  beginShape();
  for (var i = 0; i <= 50; i += 1) {
    var s = meFootballValues(i / 50);
    vertex(map(s.x, 0, p.targetX, 72, 480), map(s.y, 0, height, 392, 116));
  }
  endShape();
  drawingContext.setLineDash([]);
  meBall(x, y, "#f97316", "");
  meText("A", 53, 390, "#0f172a", 14, LEFT);
  meText("Eₚ(A) = -mgh", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12FootballGraph() {
  var m = meParam("mass", 0.5);
  var speed = meParam("speed", 20);
  var height = meParam("height", 8);
  var g = meParam("g", 10);
  var total = 0.5 * m * speed * speed - m * g * height;
  var minE = -m * g * height * 1.15;
  var maxE = Math.max(0.5 * m * speed * speed, total) * 1.12;
  var frame = meAxes("以 B 为零势能面的能量", "离地高度 y / m", "能量 / J", 0, height, minE, maxE);
  mePlot(frame, "#2563eb", function (y) { return m * g * (y - height); });
  mePlot(frame, "#f97316", function (y) { return total - m * g * (y - height); });
  mePlot(frame, "#0f766e", function () { return total; }, 30, true);
  var currentY = meFootballValues(meProgress()).y;
  meMarker(frame, currentY, m * g * (currentY - height), "#2563eb");
  meLegend([
    { color: "#2563eb", label: "Eₚ" },
    { color: "#f97316", label: "Eₖ" },
    { color: "#0f766e", label: "E" }
  ], 700, 110);
}

function meArcHeightRatios() {
  return [25 / 27, 15 / 16, 1, (1 - Math.cos(Math.PI / 6)) / 2 + (1 - (1 - Math.cos(Math.PI / 6)) / 2) * 0.25];
}

function drawLesson12ArcHeightScene() {
  var q = meProgress();
  var centers = [65, 195, 325, 455];
  var angles = [Math.PI, 2 * Math.PI / 3, Math.PI / 2, Math.PI / 6];
  var travelAngles = [Math.acos(-2 / 3), 2 * Math.PI / 3, Math.PI / 2, Math.PI / 6];
  var labels = ["2m", "3m", "4m", "5m"];
  var ratios = meArcHeightRatios();
  var radius = 50;
  var base = 350;
  meText("相同初速度，不同轨道末端方向", 28, 30, "#0f172a", 18, LEFT);
  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(28, 102, 542, 102);
  drawingContext.setLineDash([]);
  meText("目标高度 h", 32, 84, "#475569", 13, LEFT);
  for (var i = 0; i < centers.length; i += 1) {
    var cx = centers[i];
    var cy = base - radius;
    meArcPath(cx, cy, radius, 0, angles[i], i === 2 ? "#2563eb" : "#64748b", i === 2 ? 4 : 3);
    var endAngle = travelAngles[i];
    var ballX;
    var ballY;
    if (q < 0.68) {
      var phi = endAngle * q / 0.68;
      ballX = cx + radius * Math.sin(phi);
      ballY = cy + radius * Math.cos(phi);
    } else {
      var u = (q - 0.68) / 0.32;
      var endX = cx + radius * Math.sin(endAngle);
      var endY = cy + radius * Math.cos(endAngle);
      var targetY = base - ratios[i] * 248;
      ballX = endX + (i === 2 ? 0 : 20 * u);
      ballY = lerp(endY, targetY, 2 * u - u * u);
    }
    meBall(ballX, ballY, i === 2 ? "#2563eb" : "#f97316", "", 17);
    meText(labels[i], cx + 22, 380, i === 2 ? "#2563eb" : "#334155", 13, CENTER);
  }
  meGround(402, 28, 542);
  meText("90° 圆弧末端切线竖直，只有 4m 小球达到 h", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12ArcHeightGraph() {
  var ratios = meArcHeightRatios();
  var frame = meAxes("各轨道实际最大高度", "", "Hmax / h", 0, 4, 0, 1.1);
  meBar(frame, 0, 4, ratios[0], "#94a3b8", "2m", ratios[0].toFixed(3));
  meBar(frame, 1, 4, ratios[1], "#94a3b8", "3m", ratios[1].toFixed(3));
  meBar(frame, 2, 4, ratios[2], "#2563eb", "4m", "1.000");
  meBar(frame, 3, 4, ratios[3], "#94a3b8", "5m", ratios[3].toFixed(3));
  stroke("#dc2626");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(frame.left, meGY(frame, 1), frame.right, meGY(frame, 1));
  drawingContext.setLineDash([]);
}

function meBallSpringValues() {
  var m = meParam("mass", 1);
  var k = meParam("k", 100);
  var drop = meParam("drop", 0.8);
  var g = meParam("g", 10);
  var xmax = (m * g + Math.sqrt(m * m * g * g + 2 * k * m * g * drop)) / k;
  return { m: m, k: k, drop: drop, g: g, xmax: xmax, xeq: m * g / k };
}

function drawLesson12BallSpringScene() {
  var q = meProgress();
  var v = meBallSpringValues();
  var contactY = 226;
  var baseY = 416;
  var compression = q < 0.34 ? 0 : v.xmax * (2 * (q - 0.34) / 0.66 - Math.pow((q - 0.34) / 0.66, 2));
  compression = constrain(compression, 0, v.xmax);
  var compressionPx = map(compression, 0, v.xmax, 0, 112);
  var ballY = q < 0.34 ? lerp(72, contactY - 14, q / 0.34) : contactY + compressionPx;
  meText("接触后先加速，再减速", 28, 30, "#0f172a", 18, LEFT);
  meGround(baseY, 70, 486);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(150, ballY + 12, 220, 14, 3);
  meSpring(260, baseY, 260, ballY + 26, "#a855f7", 10);
  meBall(260, ballY, "#22c55e", "m");
  meArrow(310, ballY, 310, ballY + 60, "#dc2626", "mg");
  if (q >= 0.34) {
    meArrow(210, ballY + 4, 210, ballY + 4 - 80 * compression / Math.max(0.001, v.xmax), "#2563eb", "kx");
  }
  meText("x = " + compression.toFixed(3) + " m", 32, 458, "#334155", 14, LEFT);
  meText("kx = mg 处速度最大", 300, 458, "#2563eb", 14, LEFT);
}

function drawLesson12BallSpringGraph() {
  var v = meBallSpringValues();
  var initial = v.m * v.g * v.drop;
  var yMax = Math.max(initial + v.m * v.g * v.xeq, 0.5 * v.k * v.xmax * v.xmax) * 1.15;
  var frame = meAxes("接触后的能量分配", "弹簧压缩量 x / m", "能量 / J", 0, v.xmax, 0, yMax);
  mePlot(frame, "#f97316", function (x) { return Math.max(0, initial + v.m * v.g * x - 0.5 * v.k * x * x); });
  mePlot(frame, "#a855f7", function (x) { return 0.5 * v.k * x * x; });
  var q = meProgress();
  var x = q < 0.34 ? 0 : v.xmax * (2 * (q - 0.34) / 0.66 - Math.pow((q - 0.34) / 0.66, 2));
  meMarker(frame, x, Math.max(0, initial + v.m * v.g * x - 0.5 * v.k * x * x), "#f97316");
  meLegend([
    { color: "#f97316", label: "小球动能 Eₖ" },
    { color: "#a855f7", label: "弹性势能 Epe" }
  ], 700, 110);
  meText("动能最大：x = mg/k", 790, 166, "#2563eb", 12, CENTER);
}

function drawLesson12RodTwoBallsScene() {
  var theta = meProgress() * Math.PI / 2;
  var pivot = { x: 150, y: 142 };
  var longRadius = 250;
  var shortRadius = 125;
  var ax = pivot.x + longRadius * Math.cos(theta);
  var ay = pivot.y + longRadius * Math.sin(theta);
  var bx = pivot.x + shortRadius * Math.cos(theta);
  var by = pivot.y + shortRadius * Math.sin(theta);
  meText("同一刚性杆：角速度相同，线速度不同", 28, 30, "#0f172a", 18, LEFT);
  stroke("#334155");
  strokeWeight(8);
  line(pivot.x, pivot.y, ax, ay);
  fill("#64748b");
  stroke("#475569");
  triangle(pivot.x - 28, pivot.y + 78, pivot.x + 28, pivot.y + 78, pivot.x, pivot.y + 8);
  meBall(ax, ay, "#22c55e", "A");
  meBall(bx, by, "#dc2626", "B");
  meBall(pivot.x, pivot.y, "#0f172a", "O", 13);
  meArrow(ax, ay, ax - 55 * Math.sin(theta), ay + 55 * Math.cos(theta), "#2563eb", "vA");
  meArrow(bx, by, bx - 35 * Math.sin(theta), by + 35 * Math.cos(theta), "#f97316", "vB");
  meText("vA = 2vB", 32, 458, "#334155", 14, LEFT);
  meText("θ = " + (theta * 180 / Math.PI).toFixed(0) + "°", 360, 458, "#2563eb", 14, LEFT);
}

function drawLesson12RodTwoBallsGraph() {
  var m = meParam("mass", 1);
  var length = meParam("length", 2);
  var g = meParam("g", 10);
  var maxEnergy = 1.5 * m * g * length;
  var frame = meAxes("双球总动能及其分配", "杆转角 θ / °", "动能 / J", 0, 90, 0, maxEnergy * 1.12);
  mePlot(frame, "#0f766e", function (degree) {
    return maxEnergy * Math.sin(degree * Math.PI / 180);
  });
  mePlot(frame, "#2563eb", function (degree) {
    return 0.8 * maxEnergy * Math.sin(degree * Math.PI / 180);
  });
  mePlot(frame, "#f97316", function (degree) {
    return 0.2 * maxEnergy * Math.sin(degree * Math.PI / 180);
  });
  var degree = 90 * meProgress();
  meMarker(frame, degree, maxEnergy * Math.sin(degree * Math.PI / 180), "#0f766e");
  meLegend([
    { color: "#0f766e", label: "总动能" },
    { color: "#2563eb", label: "A 球动能" },
    { color: "#f97316", label: "B 球动能" }
  ], 700, 110);
}

function meUTubeValues(progress) {
  var h1 = meParam("h1", 1.6);
  var h2 = Math.min(h1 - 0.05, meParam("h2", 0.6));
  var ease = Math.sin(progress * Math.PI / 2);
  var average = (h1 + h2) / 2;
  var difference = (h1 - h2) * (1 - ease);
  return {
    h1: h1,
    h2: h2,
    average: average,
    difference: difference,
    left: average + difference / 2,
    right: average - difference / 2
  };
}

function drawLesson12UTubeScene() {
  var values = meUTubeValues(meProgress());
  var maxHeight = Math.max(values.h1, values.h2) * 1.1;
  var bottom = 392;
  var leftTop = map(values.left, 0, maxHeight, bottom, 84);
  var rightTop = map(values.right, 0, maxHeight, bottom, 84);
  meText("打开阀门：高液面下降，低液面上升", 28, 30, "#0f172a", 18, LEFT);
  noFill();
  stroke("#334155");
  strokeWeight(38);
  line(150, 82, 150, bottom);
  line(150, bottom, 410, bottom);
  line(410, bottom, 410, 82);
  stroke("#ffffff");
  strokeWeight(27);
  line(150, 82, 150, bottom);
  line(150, bottom, 410, bottom);
  line(410, bottom, 410, 82);
  stroke("#60a5fa");
  strokeWeight(23);
  line(150, leftTop, 150, bottom);
  line(150, bottom, 410, bottom);
  line(410, bottom, 410, rightTop);
  noStroke();
  fill("#1d4ed8");
  rect(265, bottom - 20, 30, 40, 4);
  meText("K", 280, bottom - 44, "#0f172a", 14, CENTER);
  meText("h₁ = " + values.left.toFixed(2) + " m", 76, leftTop, "#2563eb", 13, RIGHT);
  meText("h₂ = " + values.right.toFixed(2) + " m", 437, rightTop, "#2563eb", 13, LEFT);
  meText("水柱各处流速大小相同", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12UTubeGraph() {
  var h1 = meParam("h1", 1.6);
  var h2 = Math.min(h1 - 0.05, meParam("h2", 0.6));
  var rho = meParam("density", 1000);
  var area = meParam("area", 0.01);
  var g = meParam("g", 10);
  var initial = 0.25 * rho * area * g * Math.pow(h1 - h2, 2);
  var frame = meAxes("高低液面差对应的能量", "过程进度", "相对能量 / J", 0, 1, 0, Math.max(1, initial * 1.12));
  mePlot(frame, "#2563eb", function (u) {
    var delta = (h1 - h2) * (1 - Math.sin(u * Math.PI / 2));
    return 0.25 * rho * area * g * delta * delta;
  });
  mePlot(frame, "#f97316", function (u) {
    var delta = (h1 - h2) * (1 - Math.sin(u * Math.PI / 2));
    return initial - 0.25 * rho * area * g * delta * delta;
  });
  mePlot(frame, "#0f766e", function () { return initial; }, 20, true);
  var current = meProgress();
  var deltaNow = (h1 - h2) * (1 - Math.sin(current * Math.PI / 2));
  meMarker(frame, current, initial - 0.25 * rho * area * g * deltaNow * deltaNow, "#f97316");
  meLegend([
    { color: "#2563eb", label: "剩余重力势能差" },
    { color: "#f97316", label: "水柱动能" },
    { color: "#0f766e", label: "总量" }
  ], 690, 110);
}

function drawLesson12AcceleratedDescentScene() {
  var q = meProgress();
  var ratio = meParam("ratio", 0.75);
  var height = meParam("height", 4);
  var y = lerp(82, 404, q * q);
  meText("加速度小于 g：机械能正在减少", 28, 30, "#0f172a", 18, LEFT);
  stroke("#94a3b8");
  strokeWeight(3);
  line(270, 70, 270, 424);
  meBall(270, y, "#2563eb", "m");
  meArrow(310, y, 310, y + 70, "#dc2626", "mg");
  meArrow(230, y, 230, y - 70 * (1 - ratio), "#f97316", "阻力");
  meGround(426, 80, 460);
  meText("a = " + ratio.toFixed(2) + "g", 34, 458, "#334155", 14, LEFT);
  meText("已下降 " + (height * q * q).toFixed(2) + " m", 300, 458, "#2563eb", 14, LEFT);
}

function drawLesson12AcceleratedDescentGraph() {
  var m = meParam("mass", 2);
  var height = meParam("height", 4);
  var ratio = meParam("ratio", 0.75);
  var g = meParam("g", 10);
  var maxEnergy = m * g * height;
  var frame = meAxes("下降过程的能量变化量", "下降距离 s / m", "能量大小 / J", 0, height, 0, maxEnergy * 1.12);
  mePlot(frame, "#f97316", function (s) { return m * ratio * g * s; });
  mePlot(frame, "#2563eb", function (s) { return m * g * s; });
  mePlot(frame, "#dc2626", function (s) { return m * (1 - ratio) * g * s; }, 100, true);
  var sNow = height * meProgress() * meProgress();
  meMarker(frame, sNow, m * ratio * g * sNow, "#f97316");
  meLegend([
    { color: "#f97316", label: "动能增加量" },
    { color: "#2563eb", label: "势能减少量" },
    { color: "#dc2626", label: "机械能减少量" }
  ], 690, 110);
}

function meSpringEkValues() {
  var m = meParam("mass", 0.2);
  var k = meParam("k", 100);
  var h0 = meParam("startHeight", 0.1);
  var hn = Math.max(h0 + 0.01, meParam("naturalHeight", 0.2));
  var g = meParam("g", 10);
  var total = m * g * h0 + 0.5 * k * Math.pow(hn - h0, 2);
  var hmax = total / (m * g);
  return { m: m, k: k, h0: h0, hn: hn, g: g, total: total, hmax: hmax };
}

function meSpringEkAt(height, values) {
  var compression = Math.max(0, values.hn - height);
  return Math.max(0, values.total - values.m * values.g * height - 0.5 * values.k * compression * compression);
}

function drawLesson12SpringEkScene() {
  var values = meSpringEkValues();
  var q = meProgress();
  var height = lerp(values.h0, values.hmax, 2 * q - q * q);
  var blockY = map(height, values.h0, values.hmax, 372, 82);
  var naturalY = map(values.hn, values.h0, values.hmax, 372, 82);
  meText("先受弹簧作用，分离后只受重力", 28, 30, "#0f172a", 18, LEFT);
  meGround(424, 80, 470);
  stroke("#475569");
  strokeWeight(5);
  line(278, 56, 278, 422);
  meSpring(250, 420, 250, Math.max(blockY + 18, naturalY + 18), "#a855f7", 10);
  meBlock(250, blockY, "#f97316", "");
  stroke("#2563eb");
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(95, naturalY, 450, naturalY);
  drawingContext.setLineDash([]);
  meText("弹簧原长位置", 305, naturalY - 14, "#2563eb", 13, LEFT);
  meText("h = " + height.toFixed(3) + " m", 32, 458, "#334155", 14, LEFT);
  meText("Eₖ = " + meSpringEkAt(height, values).toFixed(3) + " J", 300, 458, "#f97316", 14, LEFT);
}

function drawLesson12SpringEkGraph() {
  var values = meSpringEkValues();
  var frame = meAxes("原题 Eₖ-h 曲线", "高度 h / m", "Eₖ / J", values.h0, values.hmax, 0, Math.max(0.1, values.total * 0.52));
  mePlot(frame, "#2563eb", function (height) { return meSpringEkAt(height, values); });
  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(meGX(frame, values.hn), frame.top, meGX(frame, values.hn), frame.bottom);
  drawingContext.setLineDash([]);
  var q = meProgress();
  var height = lerp(values.h0, values.hmax, 2 * q - q * q);
  meMarker(frame, height, meSpringEkAt(height, values), "#dc2626");
  meText("分离点 h = " + values.hn.toFixed(2) + " m", 795, 112, "#334155", 13, CENTER);
}

function drawLesson12RopeSpringScene() {
  var q = meProgress();
  var pulley = { x: 150, y: 92 };
  var rodX = 330;
  var aY = pulley.y + 240 * q;
  var bY = 338 - 120 * q;
  var cY = 404;
  meText("末态：A下降量是B上升量的2倍", 28, 30, "#0f172a", 18, LEFT);
  stroke("#475569");
  strokeWeight(5);
  line(rodX, 56, rodX, 420);
  fill("#e2e8f0");
  stroke("#64748b");
  circle(pulley.x, pulley.y, 34);
  stroke("#334155");
  strokeWeight(2);
  line(pulley.x, pulley.y, rodX, aY);
  line(pulley.x, pulley.y + 17, pulley.x, bY - 15);
  meBlock(rodX, aY, "#f97316", "A");
  meBlock(pulley.x, bY, "#2563eb", "B");
  meSpring(pulley.x, bY + 16, pulley.x, cY - 16, "#a855f7", 8);
  meBlock(pulley.x, cY, "#22c55e", "C");
  meGround(424, 55, 505);
  if (q > 0.92) {
    meArrow(pulley.x + 42, cY - 8, pulley.x + 42, cY - 66, "#a855f7", "F弹=mg");
  }
  meText("∠(绳,竖杆) = " + (Math.atan2(180, Math.max(1, aY - pulley.y)) * 180 / Math.PI).toFixed(1) + "°", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12RopeSpringGraph() {
  var m = meParam("mass", 1);
  var speed = meParam("speed", 4);
  var g = meParam("g", 10);
  var x = 11 * speed * speed / (16 * g);
  var aLoss = 4 * m * g * x;
  var bGain = m * g * x;
  var kinetic = aLoss - bGain;
  var frame = meAxes("初末态能量结算", "", "能量 / J", 0, 3, 0, aLoss * 1.15);
  meBar(frame, 0, 3, aLoss, "#2563eb", "A势能减少", meNumber(aLoss));
  meBar(frame, 1, 3, bGain, "#f97316", "B势能增加", meNumber(bGain));
  meBar(frame, 2, 3, kinetic, "#0f766e", "末总动能", meNumber(kinetic));
  meText("弹簧初末形变量等大，弹性势能变化为 0", 795, 112, "#334155", 12, CENTER);
}

function meSeaProjectileValues(progress) {
  var speed = meParam("speed", 12);
  var depth = meParam("depth", 8);
  var g = meParam("g", 10);
  var angle = 35 * Math.PI / 180;
  var vx = speed * Math.cos(angle);
  var vy = speed * Math.sin(angle);
  var totalTime = (vy + Math.sqrt(vy * vy + 2 * g * depth)) / g;
  var time = progress * totalTime;
  return {
    x: vx * time,
    y: vy * time - 0.5 * g * time * time,
    vx: vx,
    vy: vy - g * time,
    totalTime: totalTime,
    range: vx * totalTime,
    maxHeight: vy * vy / (2 * g)
  };
}

function drawLesson12ProjectileSeaScene() {
  var p = meSeaProjectileValues(meProgress());
  var depth = meParam("depth", 8);
  var x = map(p.x, 0, p.range, 108, 512);
  var y = map(p.y, -depth, Math.max(0.1, p.maxHeight), 398, 112);
  var groundY = map(0, -depth, p.maxHeight, 398, 112);
  meText("以地面为零势能面，海面势能为负", 28, 30, "#0f172a", 18, LEFT);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(30, groundY, 86, 398 - groundY);
  meGround(groundY, 30, 116);
  stroke("#2563eb");
  strokeWeight(3);
  line(116, 398, 542, 398);
  fill("#dbeafe");
  noStroke();
  rect(116, 399, 426, 28);
  meText("海平面", 444, 380, "#2563eb", 13, LEFT);
  noFill();
  stroke("#94a3b8");
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  beginShape();
  for (var i = 0; i <= 60; i += 1) {
    var s = meSeaProjectileValues(i / 60);
    vertex(map(s.x, 0, p.range, 108, 512), map(s.y, -depth, p.maxHeight, 398, 112));
  }
  endShape();
  drawingContext.setLineDash([]);
  meBall(x, y, "#f97316", "");
  meText("y = " + p.y.toFixed(2) + " m", 30, 458, "#334155", 14, LEFT);
  meText(p.y < 0 ? "Eₚ < 0" : "Eₚ ≥ 0", 350, 458, p.y < 0 ? "#dc2626" : "#2563eb", 14, LEFT);
}

function drawLesson12ProjectileSeaGraph() {
  var m = meParam("mass", 1);
  var speed = meParam("speed", 12);
  var depth = meParam("depth", 8);
  var g = meParam("g", 10);
  var p = meSeaProjectileValues(meProgress());
  var total = 0.5 * m * speed * speed;
  var minEnergy = -m * g * depth * 1.12;
  var maxEnergy = (total + m * g * depth) * 1.12;
  var frame = meAxes("落到海平面时的能量", "相对地面高度 y / m", "能量 / J", -depth, Math.max(1, p.maxHeight), minEnergy, maxEnergy);
  mePlot(frame, "#2563eb", function (y) { return m * g * y; });
  mePlot(frame, "#f97316", function (y) { return total - m * g * y; });
  mePlot(frame, "#0f766e", function () { return total; }, 20, true);
  meMarker(frame, p.y, m * g * p.y, "#2563eb");
  meLegend([
    { color: "#2563eb", label: "重力势能 Eₚ" },
    { color: "#f97316", label: "动能 Eₖ" },
    { color: "#0f766e", label: "机械能 E" }
  ], 690, 110);
}

function mePirateValues() {
  var m = meParam("mass", 0.2);
  var k = meParam("k", 80);
  var x0 = meParam("compression", 0.12);
  var g = meParam("g", 10);
  var total = 0.5 * k * x0 * x0;
  return { m: m, k: k, x0: x0, g: g, total: total, equilibrium: m * g / k };
}

function drawLesson12PirateSpringScene() {
  var values = mePirateValues();
  var q = meProgress();
  var compression = values.x0 * (1 - q);
  var ballY = lerp(338, 164, q);
  meText("海盗桶：小球速度先增大后减小", 28, 30, "#0f172a", 18, LEFT);
  fill("#f59e0b");
  stroke("#92400e");
  strokeWeight(3);
  rect(132, 100, 276, 328, 8);
  fill("#fff7ed");
  noStroke();
  rect(160, 116, 220, 286);
  meGround(414, 95, 445);
  meSpring(270, 400, 270, ballY + 16, "#a855f7", 10);
  meBall(270, ballY, "#ef4444", "");
  stroke("#2563eb");
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(165, 164, 375, 164);
  drawingContext.setLineDash([]);
  meText("A：弹簧原长", 382, 164, "#2563eb", 13, LEFT);
  meText("B", 298, 338, "#0f172a", 13, LEFT);
  meText("压缩量 x = " + compression.toFixed(3) + " m", 28, 458, "#334155", 14, LEFT);
}

function drawLesson12PirateSpringGraph() {
  var values = mePirateValues();
  var frame = meAxes("弹射过程的势能和与动能", "小球上移 y / m", "能量 / J", 0, values.x0, 0, Math.max(0.1, values.total * 1.15));
  mePlot(frame, "#a855f7", function (y) {
    return values.m * values.g * y + 0.5 * values.k * Math.pow(values.x0 - y, 2);
  });
  mePlot(frame, "#f97316", function (y) {
    return Math.max(0, values.total - values.m * values.g * y - 0.5 * values.k * Math.pow(values.x0 - y, 2));
  });
  var yNow = values.x0 * meProgress();
  meMarker(frame, yNow, values.m * values.g * yNow + 0.5 * values.k * Math.pow(values.x0 - yNow, 2), "#a855f7");
  meLegend([
    { color: "#a855f7", label: "Epg + Epe" },
    { color: "#f97316", label: "小球动能 Eₖ" }
  ], 700, 110);
  var yAtMax = values.x0 - values.equilibrium;
  meText("势能和最小：kx = mg", 795, 166, "#2563eb", 12, CENTER);
  if (yAtMax > 0 && yAtMax < values.x0) {
    stroke("#2563eb");
    drawingContext.setLineDash([4, 4]);
    line(meGX(frame, yAtMax), frame.top, meGX(frame, yAtMax), frame.bottom);
    drawingContext.setLineDash([]);
  }
}

function meTrackHeightRatios() {
  var cut = meParam("cutRatio", 0.6);
  var angle = meParam("angle", 35) * Math.PI / 180;
  return {
    cut: cut + (1 - cut) * Math.sin(angle) * Math.sin(angle),
    loop: 25 / 27,
    smooth: 1
  };
}

function drawLesson12TrackDeformationScene() {
  var q = meProgress();
  var ratios = meTrackHeightRatios();
  var lanes = [
    { y: 150, label: "C点截断", color: "#f97316", ratio: ratios.cut },
    { y: 275, label: "圆弧脱轨", color: "#a855f7", ratio: ratios.loop },
    { y: 400, label: "连续曲面", color: "#2563eb", ratio: ratios.smooth }
  ];
  meText("约束是否持续，决定能否真正到达 h", 28, 30, "#0f172a", 18, LEFT);
  stroke("#94a3b8");
  strokeWeight(1);
  drawingContext.setLineDash([5, 4]);
  line(40, 70, 540, 70);
  drawingContext.setLineDash([]);
  meText("目标高度 h", 38, 54, "#475569", 12, LEFT);
  for (var i = 0; i < lanes.length; i += 1) {
    var lane = lanes[i];
    noFill();
    stroke(lane.color);
    strokeWeight(3);
    if (i === 0) {
      line(60, lane.y, 280, lane.y - 78);
      drawingContext.setLineDash([4, 4]);
      beginShape();
      for (var j = 0; j <= 24; j += 1) {
        var u = j / 24;
        vertex(280 + 150 * u, lane.y - 78 - 54 * u + 50 * u * u);
      }
      endShape();
      drawingContext.setLineDash([]);
    } else if (i === 1) {
      arc(255, lane.y - 55, 110, 110, -Math.PI / 2, Math.PI * 1.5);
    } else {
      beginShape();
      for (var k = 0; k <= 30; k += 1) {
        var w = k / 30;
        vertex(60 + 400 * w, lane.y - 205 * w * w);
      }
      endShape();
    }
    var ballX = lerp(70, i === 2 ? 455 : 390, q);
    var startY = lane.y - 8;
    var targetY = 430 - lane.ratio * 335;
    var ballY = lerp(startY, targetY, 2 * q - q * q);
    meBall(ballX, ballY, lane.color, "", 17);
    meText(lane.label, 470, lane.y - 4, lane.color, 13, LEFT);
  }
}

function drawLesson12TrackDeformationGraph() {
  var ratios = meTrackHeightRatios();
  var frame = meAxes("不同轨道的实际最大高度", "", "Hmax / h", 0, 3, 0, 1.08);
  meBar(frame, 0, 3, ratios.cut, "#f97316", "截断", ratios.cut.toFixed(3));
  meBar(frame, 1, 3, ratios.loop, "#a855f7", "圆弧", ratios.loop.toFixed(3));
  meBar(frame, 2, 3, ratios.smooth, "#2563eb", "光滑曲面", "1.000");
  stroke("#dc2626");
  drawingContext.setLineDash([5, 4]);
  line(frame.left, meGY(frame, 1), frame.right, meGY(frame, 1));
  drawingContext.setLineDash([]);
}

function drawLesson12InclinePullScene() {
  var q = meProgress();
  var angle = meParam("angle", 30) * Math.PI / 180;
  var start = { x: 82, y: 394 };
  var lengthPx = 430;
  var end = { x: start.x + lengthPx * Math.cos(angle), y: start.y - lengthPx * Math.sin(angle) };
  var x = lerp(start.x, end.x, q * q);
  var y = lerp(start.y, end.y, q * q);
  meText("斜面上升：动能和势能同时增加", 28, 30, "#0f172a", 18, LEFT);
  meGround(412, 42, 542);
  stroke("#475569");
  strokeWeight(5);
  line(start.x, start.y, end.x, end.y);
  meBlock(x, y - 16, "#f97316", "", -angle);
  meArrow(x, y - 48, x + 76 * Math.cos(angle), y - 48 - 76 * Math.sin(angle), "#dc2626", "F");
  meArrow(x - 24, y - 20, x - 24, y + 55, "#2563eb", "mg");
  meText("a = " + meParam("accelRatio", 0.5).toFixed(2) + "g", 32, 458, "#334155", 14, LEFT);
  meText("s = " + (meParam("distance", 4) * q * q).toFixed(2) + " m", 330, 458, "#2563eb", 14, LEFT);
}

function drawLesson12InclinePullGraph() {
  var m = meParam("mass", 2);
  var distance = meParam("distance", 4);
  var angle = meParam("angle", 30) * Math.PI / 180;
  var ratio = meParam("accelRatio", 0.5);
  var g = meParam("g", 10);
  var maxEnergy = m * g * distance * (ratio + Math.sin(angle));
  var frame = meAxes("沿斜面位移对应的能量增量", "位移 s / m", "能量增量 / J", 0, distance, 0, maxEnergy * 1.12);
  mePlot(frame, "#f97316", function (s) { return m * ratio * g * s; });
  mePlot(frame, "#2563eb", function (s) { return m * g * s * Math.sin(angle); });
  mePlot(frame, "#0f766e", function (s) { return m * g * s * (ratio + Math.sin(angle)); });
  var sNow = distance * meProgress() * meProgress();
  meMarker(frame, sNow, m * g * sNow * (ratio + Math.sin(angle)), "#0f766e");
  meLegend([
    { color: "#f97316", label: "ΔEₖ" },
    { color: "#2563eb", label: "ΔEₚ" },
    { color: "#0f766e", label: "ΔE机械" }
  ], 710, 110);
}

function drawLesson12CarRoadsScene() {
  var q = meProgress();
  var angle = meParam("angle", 30) * Math.PI / 180;
  var groundY = 390;
  var slopeStart = { x: 300, y: groundY };
  var slopeEnd = { x: 510, y: groundY - 210 * Math.tan(angle) };
  meText("水平匀速后，再以另一恒功率匀速爬坡", 28, 30, "#0f172a", 18, LEFT);
  meGround(groundY + 18, 28, 542);
  stroke("#475569");
  strokeWeight(5);
  line(52, groundY, slopeStart.x, groundY);
  line(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
  var carX;
  var carY;
  var carAngle;
  if (q < 0.45) {
    var u = q / 0.45;
    carX = lerp(70, 275, u);
    carY = groundY - 18;
    carAngle = 0;
  } else {
    var v = (q - 0.45) / 0.55;
    carX = lerp(slopeStart.x + 20, slopeEnd.x - 20, v);
    carY = lerp(slopeStart.y - 18, slopeEnd.y - 18, v);
    carAngle = -angle;
  }
  meCar(carX, carY, carAngle);
  meText("M", 52, groundY + 38, "#0f172a", 13, CENTER);
  meText("N / P", slopeStart.x, groundY + 38, "#0f172a", 13, CENTER);
  meText("Q", slopeEnd.x, slopeEnd.y - 28, "#0f172a", 13, CENTER);
  var f1 = meParam("power1", 48) * 1000 / meParam("speed1", 16);
  var f2 = meParam("power2", 96) * 1000 / meParam("speed2", 8);
  meText("水平牵引力 " + meNumber(f1) + " N", 28, 458, "#334155", 14, LEFT);
  meText("坡道牵引力 " + meNumber(f2) + " N", 300, 458, "#2563eb", 14, LEFT);
}

function drawLesson12CarRoadsGraph() {
  var m = meParam("mass", 1600);
  var length = meParam("length", 200);
  var angle = meParam("angle", 30) * Math.PI / 180;
  var g = meParam("g", 10);
  var maxEnergy = m * g * length * Math.sin(angle);
  var frame = meAxes("汽车机械能沿两路段变化", "累计路程 s / m", "ΔE机械 / J", 0, 2 * length, 0, maxEnergy * 1.12);
  mePlot(frame, "#2563eb", function (s) {
    return s <= length ? 0 : m * g * (s - length) * Math.sin(angle);
  });
  var q = meProgress();
  var distance = q < 0.45 ? length * q / 0.45 : length + length * (q - 0.45) / 0.55;
  var energy = distance <= length ? 0 : m * g * (distance - length) * Math.sin(angle);
  meMarker(frame, distance, energy, "#dc2626");
  meText("MN：动能、势能均不变", 790, 112, "#334155", 12, CENTER);
  meText("PQ：匀速但势能增加", 790, 133, "#2563eb", 12, CENTER);
}

function mePulleySliderValues(progress) {
  var yRatio = lerp(-4 / 3, 3 / 4, progress);
  var ropeRatio = Math.sqrt(1 + yRatio * yRatio);
  return {
    yRatio: yRatio,
    aDownRatio: 5 / 3 - ropeRatio
  };
}

function drawLesson12PulleySliderScene() {
  var q = meProgress();
  var values = mePulleySliderValues(q);
  var dPx = 130;
  var pulley = { x: 390, y: 152 };
  var rodX = pulley.x - dPx;
  var bY = pulley.y - values.yRatio * dPx;
  var aY = 224 + values.aDownRatio * dPx;
  meText("B 单调上升，A 先下降后上升", 28, 30, "#0f172a", 18, LEFT);
  stroke("#475569");
  strokeWeight(5);
  line(rodX, 44, rodX, 424);
  fill("#e2e8f0");
  stroke("#64748b");
  circle(pulley.x, pulley.y, 34);
  stroke("#334155");
  strokeWeight(2);
  line(rodX, bY, pulley.x, pulley.y);
  line(pulley.x + 17, pulley.y, pulley.x + 17, aY);
  meBall(rodX, bY, "#2563eb", "B");
  meBlock(pulley.x + 17, aY, "#f97316", "A");
  meText("P", rodX - 27, pulley.y + 4 * dPx / 3, "#475569", 13, CENTER);
  meText("Q", rodX - 27, pulley.y, "#475569", 13, CENTER);
  meText("M", rodX - 27, pulley.y - 3 * dPx / 4, "#475569", 13, CENTER);
  meText("A 向下位移 / d = " + values.aDownRatio.toFixed(3), 28, 458, "#334155", 14, LEFT);
}

function drawLesson12PulleySliderGraph() {
  var frame = meAxes("绳长约束下的两物体位置", "过程进度", "位移 / d", 0, 1, -1.5, 0.9);
  mePlot(frame, "#2563eb", function (u) { return mePulleySliderValues(u).yRatio; });
  mePlot(frame, "#f97316", function (u) { return mePulleySliderValues(u).aDownRatio; });
  var current = meProgress();
  meMarker(frame, current, mePulleySliderValues(current).aDownRatio, "#f97316");
  meLegend([
    { color: "#2563eb", label: "B 高度 yB/d" },
    { color: "#f97316", label: "A 向下位移 zA/d" }
  ], 690, 110);
  meText("Q 点：A速度为0，但加速度不为0", 795, 166, "#334155", 12, CENTER);
}

function meBufferSpeed(displacement) {
  var m = meParam("mass", 2);
  var k = meParam("k", 400);
  var friction = meParam("friction", 40);
  return Math.sqrt(Math.max(0, friction * friction / (k * m) + 2 * friction * displacement / m));
}

function drawLesson12BufferScene() {
  var q = meProgress();
  var limit = meParam("limit", 0.8);
  var friction = meParam("friction", 40);
  var k = meParam("k", 400);
  var compression = friction / k;
  var rodTravel = q < 0.36 ? 0 : limit * 0.25 * (q - 0.36) / 0.64;
  var rodX = 360 + 150 * rodTravel / Math.max(0.01, limit);
  var carX = q < 0.36 ? lerp(86, 250, q / 0.36) : 250 + 150 * rodTravel / Math.max(0.01, limit);
  meText("先压簧至 kx=f，再推动轻杆滑动", 28, 30, "#0f172a", 18, LEFT);
  meGround(380, 32, 542);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(350, 258, 180, 86, 4);
  fill("#ffffff");
  rect(364, 274, 152, 52);
  stroke("#334155");
  strokeWeight(8);
  line(rodX, 300, rodX + 112, 300);
  meSpring(carX + 42, 300, rodX, 300, "#2563eb", 8);
  meCar(carX, 350, 0);
  meArrow(rodX + 28, 252, rodX + 90, 252, "#dc2626", "杆位移");
  meArrow(rodX + 70, 332, rodX + 16, 332, "#f97316", "f");
  meText("临界压缩量 f/k = " + compression.toFixed(3) + " m", 28, 458, "#334155", 14, LEFT);
  meText("杆已移动 " + rodTravel.toFixed(3) + " m", 320, 458, "#2563eb", 14, LEFT);
}

function drawLesson12BufferGraph() {
  var limit = meParam("limit", 0.8);
  var maxSpeed = meBufferSpeed(limit);
  var frame = meAxes("停止时杆位移对应的撞击速度", "轻杆位移 s / m", "撞击速度 u / (m/s)", 0, limit, 0, maxSpeed * 1.16);
  mePlot(frame, "#2563eb", function (s) { return meBufferSpeed(s); });
  var baseline = limit / 4;
  meMarker(frame, baseline, meBufferSpeed(baseline), "#dc2626");
  meMarker(frame, limit, meBufferSpeed(limit), "#f97316");
  meText("s=l/4 对应 v₀", 795, 112, "#dc2626", 12, CENTER);
  meText("s=l 对应安全最大速度", 795, 133, "#f97316", 12, CENTER);
}

function drawLesson12SlidingRopeScene() {
  var q = Math.max(0.015, meProgress());
  var tableY = 220;
  var edgeX = 420;
  var horizontal = 320 * (1 - q);
  var vertical = 210 * q;
  meText("整根柔绳速度相同，悬垂段提供驱动力", 28, 30, "#0f172a", 18, LEFT);
  fill("#e2e8f0");
  stroke("#64748b");
  rect(48, tableY, edgeX - 48, 36);
  rect(edgeX - 12, tableY, 36, 218);
  noFill();
  stroke("#f97316");
  strokeWeight(9);
  line(edgeX - horizontal, tableY - 6, edgeX, tableY - 6);
  line(edgeX, tableY - 6, edgeX, tableY - 6 + vertical);
  meArrow(edgeX + 45, tableY + 10, edgeX + 45, tableY + 80, "#dc2626", "运动方向");
  meText("O", edgeX + 15, tableY - 28, "#0f172a", 14, LEFT);
  meText("x/L = " + q.toFixed(3), 28, 458, "#334155", 14, LEFT);
  meText("a/g = x/L", 350, 458, "#2563eb", 14, LEFT);
}

function drawLesson12SlidingRopeGraph() {
  var frame = meAxes("归一化物理量随 x/L 变化", "x / L", "归一化值", 0, 1, 0, 1.12);
  mePlot(frame, "#f97316", function (u) { return 4 * u * (1 - u); });
  mePlot(frame, "#0f766e", function (u) { return 4 * u * (1 - u); }, 140, true);
  mePlot(frame, "#2563eb", function (u) { return 27 * u * u * (1 - u) / 4; });
  mePlot(frame, "#a855f7", function (u) { return u; }, 80, true);
  var current = meProgress();
  meMarker(frame, current, 27 * current * current * (1 - current) / 4, "#2563eb");
  meLegend([
    { color: "#f97316", label: "张力 T（最大于 1/2）" },
    { color: "#0f766e", label: "桌面段动量 p（最大于 1/2）" },
    { color: "#2563eb", label: "桌面段动能 Eₖ（最大于 2/3）" },
    { color: "#a855f7", label: "加速度 a/g" }
  ], 670, 106);
}

function meRodEndValues(progress) {
  var theta = Math.PI * progress;
  var length = meParam("length", 1);
  var g = meParam("g", 10);
  var cosine = Math.cos(theta);
  var omegaSquared = g * (9 - 4 * cosine) / (10 * length);
  return {
    theta: theta,
    omega: Math.sqrt(Math.max(0, omegaSquared)),
    vA: length * Math.sqrt(Math.max(0, omegaSquared)),
    vB: 2 * length * Math.sqrt(Math.max(0, omegaSquared)),
    rodWorkB: -6 * (1 - cosine) / 5
  };
}

function drawLesson12RodEndBallsScene() {
  var values = meRodEndValues(meProgress());
  var pivot = { x: 270, y: 250 };
  var scale = 78;
  var bx = pivot.x + 2 * scale * Math.sin(values.theta);
  var by = pivot.y - 2 * scale * Math.cos(values.theta);
  var ax = pivot.x - scale * Math.sin(values.theta);
  var ay = pivot.y + scale * Math.cos(values.theta);
  meText("偏心轻杆：A、B同角速度但半径不同", 28, 30, "#0f172a", 18, LEFT);
  stroke("#334155");
  strokeWeight(8);
  line(ax, ay, bx, by);
  fill("#64748b");
  stroke("#475569");
  triangle(pivot.x - 28, pivot.y + 90, pivot.x + 28, pivot.y + 90, pivot.x, pivot.y + 8);
  meBall(ax, ay, "#22c55e", "A");
  meBall(bx, by, "#f97316", "B");
  meBall(pivot.x, pivot.y, "#0f172a", "O", 13);
  meArrow(bx, by, bx + 55 * Math.cos(values.theta), by + 55 * Math.sin(values.theta), "#2563eb", "vB");
  meText("vB = " + values.vB.toFixed(2) + " m/s", 28, 458, "#334155", 14, LEFT);
  meText("θ = " + (values.theta * 180 / Math.PI).toFixed(0) + "°", 350, 458, "#2563eb", 14, LEFT);
}

function drawLesson12RodEndBallsGraph() {
  var frame = meAxes("B球速度与杆对B做功", "转角 θ / °", "归一化量", 0, 180, 0, 5.6);
  mePlot(frame, "#2563eb", function (degree) {
    return 2 * (9 - 4 * Math.cos(degree * Math.PI / 180)) / 5;
  });
  mePlot(frame, "#dc2626", function (degree) {
    return 6 * (1 - Math.cos(degree * Math.PI / 180)) / 5;
  }, 140, true);
  var currentDegree = 180 * meProgress();
  var currentCos = Math.cos(currentDegree * Math.PI / 180);
  meMarker(frame, currentDegree, 2 * (9 - 4 * currentCos) / 5, "#2563eb");
  meLegend([
    { color: "#2563eb", label: "vB² / (gL)" },
    { color: "#dc2626", label: "-W杆→B / (mgL)" }
  ], 690, 110);
  meText("最低点：-W杆→B/(mgL)=12/5", 795, 166, "#334155", 12, CENTER);
}

function meLinkedSliderValues(progress) {
  var height = meParam("height", 1.2);
  var rodLength = Math.max(height + 0.05, meParam("rodLength", 2));
  var y = height * (1 - progress);
  var x = Math.sqrt(Math.max(0, rodLength * rodLength - y * y));
  var accelRatio = 1 + 2 * height * y / (rodLength * rodLength) - 3 * y * y / (rodLength * rodLength);
  var energyRatio = 1 - y * y * (height - y) / (height * rodLength * rodLength);
  return {
    height: height,
    rodLength: rodLength,
    y: y,
    x: x,
    accelRatio: accelRatio,
    energyRatio: energyRatio
  };
}

function drawLesson12LinkedSlidersScene() {
  var q = meProgress();
  var values = meLinkedSliderValues(q);
  var groundY = 410;
  var rodX = 152;
  var verticalScale = 240 / values.height;
  var horizontalScale = 300 / values.rodLength;
  var aY = groundY - values.y * verticalScale;
  var bX = rodX + values.x * horizontalScale;
  meText("刚杆连接：a下降，b先加速后减速", 28, 30, "#0f172a", 18, LEFT);
  meGround(groundY + 14, 32, 542);
  stroke("#475569");
  strokeWeight(5);
  line(rodX, 54, rodX, groundY);
  stroke("#334155");
  strokeWeight(7);
  line(rodX, aY, bX, groundY - 14);
  meBlock(rodX, aY, "#f97316", "a");
  meBlock(bX, groundY - 14, "#2563eb", "b");
  meArrow(rodX - 42, aY, rodX - 42, aY + 62, "#dc2626", "mg");
  meText("向下加速度 = " + values.accelRatio.toFixed(3) + "g", 28, 458, values.accelRatio > 1 ? "#dc2626" : "#334155", 14, LEFT);
}

function drawLesson12LinkedSlidersGraph() {
  var maxRatio = 1.35;
  var frame = meAxes("a的加速度与机械能", "下落进度", "归一化值", 0, 1, 0.7, maxRatio);
  mePlot(frame, "#dc2626", function (u) { return meLinkedSliderValues(u).accelRatio; });
  mePlot(frame, "#2563eb", function (u) { return meLinkedSliderValues(u).energyRatio; });
  mePlot(frame, "#64748b", function () { return 1; }, 20, true);
  var current = meProgress();
  meMarker(frame, current, meLinkedSliderValues(current).accelRatio, "#dc2626");
  meLegend([
    { color: "#dc2626", label: "|aᵧ| / g" },
    { color: "#2563eb", label: "Ea / (mgh)" },
    { color: "#64748b", label: "基准值 1" }
  ], 700, 110);
  meText("Ea最小时杆力为0，地面对b支持力为mg", 795, 166, "#334155", 12, CENTER);
}
