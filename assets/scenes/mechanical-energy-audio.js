// Sound profiles and event timing for mechanical-energy scenes.
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
