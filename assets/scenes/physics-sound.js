var fanPhysicsModelSoundProfiles = {
  doubleThrow: { mode: "air", description: "双球飞行风声随速度变化，最高点与落地分别提示", startEvent: "launch", startIntensity: 0.7, endEvent: "impact", endIntensity: 0.8, cues: [{ at: 0.28, event: "apex", intensity: 0.3 }] },
  pipeDrop: { mode: "air", description: "管与小球运动时生成风声，穿管和落地分别提示", endEvent: "impact", endIntensity: 0.75, cues: [{ at: 0.36, event: "contact", intensity: 0.45 }] },
  threeCar: { mode: "engine", description: "三车发动机声随车速降低，制动阶段和停车时提示", endEvent: "brake", endIntensity: 0.65, cues: [{ at: 0.48, event: "brake", intensity: 0.38 }] },
  inclineSlot: { mode: "slide", description: "小球沿斜槽下滑时生成滑动声，到达内圆时停止", endEvent: "stop", endIntensity: 0.5, cues: [] },
  riverCrossing: { mode: "water", description: "水流声贯穿渡河过程，到达对岸时提示", endEvent: "marker", endIntensity: 0.45, cues: [] },
  waterfallCrossing: { mode: "water", description: "水流声随渡河推进，到达安全边界时提示", endEvent: "marker", endIntensity: 0.5, cues: [] },
  projectileBasic: { mode: "air", description: "平抛风声随竖直速度增强，落地时触发撞击声", startEvent: "launch", startIntensity: 0.55, endEvent: "impact", endIntensity: 0.75, cues: [] },
  projectileSlope: { mode: "air", description: "三球平抛风声随下落速度增强，落到斜面时提示", startEvent: "launch", startIntensity: 0.55, endEvent: "impact", endIntensity: 0.7, cues: [] },
  projectileWindow: { mode: "air", description: "小球飞行风声随下落速度增强，穿窗结束时提示", startEvent: "launch", startIntensity: 0.55, endEvent: "marker", endIntensity: 0.5, cues: [{ at: 0.62, event: "contact", intensity: 0.35 }] },
  volleyballServe: { mode: "air", description: "发球声后接飞行风声，越网与落地分别提示", startEvent: "kick", startIntensity: 0.75, endEvent: "impact", endIntensity: 0.65, cues: [{ at: 0.58, event: "marker", intensity: 0.32 }] },
  dartTarget: { mode: "air", description: "飞镖出手后生成风声，到达靶点时触发命中声", startEvent: "launch", startIntensity: 0.55, endEvent: "impact", endIntensity: 0.72, cues: [] },
  projectileNormal: { mode: "air", description: "双球飞行风声随速度变化，到达两个落点时提示", startEvent: "launch", startIntensity: 0.55, endEvent: "impact", endIntensity: 0.72, cues: [] },
  projectileBounce: { mode: "air", description: "两球飞行时生成风声，球 1 反弹与最终落地分别触发撞击声", startEvent: "launch", startIntensity: 0.55, endEvent: "impact", endIntensity: 0.8, cues: [{ at: 1 / 3, event: "collision", intensity: 0.85 }] },
  motionCompose: { mode: "air", description: "合运动速度变化映射为风声，轨迹结束时提示", endEvent: "marker", endIntensity: 0.45, cues: [] },
  riverAdvanced: { mode: "water", description: "水流声贯穿进阶渡河过程，到达对岸时提示", endEvent: "marker", endIntensity: 0.45, cues: [] },
  dualConstraintCircle: { mode: "rotor", description: "双约束圆周运动使用转动音色，完成一周时提示", endEvent: "marker", endIntensity: 0.4, cues: [{ at: 0.5, event: "turn", intensity: 0.3 }] },
  handRopeBreak: { mode: "rotor", description: "断绳前为圆周转动声，断绳后切换飞行风声并触发绳断声", endEvent: "impact", endIntensity: 0.7, cues: [] },
  bulletCylinder: { mode: "bullet", description: "子弹穿筒风声与圆筒转动音色同步，穿出时提示", startEvent: "launch", startIntensity: 0.65, endEvent: "impact", endIntensity: 0.6, cues: [] },
  bikeGear: { mode: "rotor", description: "车轮、链轮转速映射为转动音色，链传动中点触发齿轮声", endEvent: "stop", endIntensity: 0.4, cues: [{ at: 0.5, event: "gear", intensity: 0.45 }] },
  pileDriver: { mode: "rotor", description: "夯锤转动声随角位置变化，两次击打分别触发撞击声", endEvent: "impact", endIntensity: 0.75, cues: [{ at: 0.25, event: "impact", intensity: 0.65 }, { at: 0.75, event: "impact", intensity: 0.65 }] },
  bowlDoubleBall: { mode: "rotor", description: "双球角速度映射为转动音色，再次相距最近时提示", endEvent: "marker", endIntensity: 0.45, cues: [{ at: 0.5, event: "turn", intensity: 0.3 }] }
};

var fanPhysicsSoundModeDescriptions = {
  air: "飞行风声会跟随动画中的速度变化，关键位置另有提示音",
  water: "水流音色会跟随动画进程变化，入水或到岸时另有提示音",
  rotor: "转动音色会跟随角速度和动画进程变化",
  orbit: "低频轨道音色会跟随公转、变轨或引力过程变化",
  engine: "发动机音色会跟随车速、推力或功率阶段变化",
  spring: "弹簧音色会跟随形变量和运动速度变化",
  pulley: "绳与滑轮音色会跟随系统速度变化",
  slide: "接触面的滑动音色会跟随相对速度变化",
  track: "沿轨道运动的音色会跟随速度和位置变化",
  bullet: "高速穿越风声会与旋转部件的音色同步"
};
var fanPhysicsSoundTextCache = {};
var fanPhysicsSoundModeCache = {};

function fanPhysicsSoundClamp(value) {
  return Math.max(0, Math.min(1, Number(value || 0)));
}

function fanPhysicsAnimation(sceneName) {
  return ((problemDataMap[sceneName] || {}).animation || {});
}

function fanPhysicsProblemText(sceneName) {
  if (Object.prototype.hasOwnProperty.call(fanPhysicsSoundTextCache, sceneName)) {
    return fanPhysicsSoundTextCache[sceneName];
  }
  var problem = problemDataMap[sceneName] || {};
  var animation = problem.animation || {};
  var text = [sceneName, problem.chapter, problem.model, problem.title, problem.question, animation.type, animation.variant, animation.notes]
    .filter(Boolean)
    .join(" ");
  fanPhysicsSoundTextCache[sceneName] = text;
  return text;
}

function hasFanPhysicsSoundScene(sceneName) {
  if (fanPhysicsModelSoundProfiles[sceneName]) {
    return true;
  }
  var problem = problemDataMap[sceneName];
  var animation = (problem || {}).animation || {};
  return Boolean(problem && animation.enabled === true && animation.playable !== false && animation.type !== "none");
}

function fanPhysicsSoundMode(sceneName) {
  var modelProfile = fanPhysicsModelSoundProfiles[sceneName];
  if (modelProfile) {
    return modelProfile.mode;
  }
  if (Object.prototype.hasOwnProperty.call(fanPhysicsSoundModeCache, sceneName)) {
    return fanPhysicsSoundModeCache[sceneName];
  }
  var animation = fanPhysicsAnimation(sceneName);
  var type = animation.type || "";
  var text = fanPhysicsProblemText(sceneName);
  var mode = "track";
  if (/gravitation/i.test(type) || /万有引力|卫星|行星|恒星|变轨|公转|航天|月球|地球隧道/i.test(text)) mode = "orbit";
  else if (/circular|圆周|转盘|圆盘|齿轮|链轮|圆锥|盘旋|转弯|自转/i.test(type + " " + text)) mode = "rotor";
  else if (/projectile|平抛|抛体|投弹|飞镖|水柱|射流|喷泉/i.test(type + " " + text)) mode = "air";
  else if (/河|渡河|水流|水柱|液体|水管|木块入水|水中|submerged|浸没|浸入|压入水|漂浮|浮力|U形管/i.test(text)) mode = "water";
  else if (/火箭|喷气式|飞机起飞|汽车|货车|警车|新能源车|氢能源|发动机|牵引力|额定功率/i.test(text)) mode = "engine";
  else if (/弹簧|弹性势能|弹射/i.test(text)) mode = "spring";
  else if (/滑轮|轻绳|绳拉|绳端|缆车/i.test(text)) mode = "pulley";
  else if (/传送带|摩擦|滑动|斜面|刹车|制动|下滑|滑块/i.test(text)) mode = "slide";
  else if (/下落|下降|上抛|起跳|跳伞|飞行|抛出/i.test(text)) mode = "air";
  fanPhysicsSoundModeCache[sceneName] = mode;
  return mode;
}

function fanPhysicsSoundFrameForMode(mode, speed, amount) {
  var v = fanPhysicsSoundClamp(speed);
  var x = fanPhysicsSoundClamp(amount);
  if (mode !== "orbit" && mode !== "bullet" && typeof meSoundFrame === "function") {
    return meSoundFrame(mode, v, x);
  }
  var frame = {
    noiseType: "bandpass",
    noiseGain: 0,
    noiseFrequency: 420,
    noiseQ: 0.72,
    toneType: "sine",
    toneGain: 0,
    toneFrequency: 100
  };
  if (mode === "orbit") {
    frame.toneType = "triangle";
    frame.toneGain = 0.016 + 0.014 * v;
    frame.toneFrequency = 58 + 92 * v + 28 * x;
    return frame;
  }
  if (mode === "bullet") {
    frame.noiseGain = 0.06 + 0.035 * v;
    frame.noiseFrequency = 1050 + 1500 * v;
    frame.noiseQ = 0.82;
    frame.toneType = "triangle";
    frame.toneGain = 0.018 + 0.012 * x;
    frame.toneFrequency = 92 + 150 * x;
    return frame;
  }
  return frame;
}

function fanPhysicsSoundSpeed(sceneName, progress, mode) {
  var q = fanPhysicsSoundClamp(progress);
  var text = fanPhysicsProblemText(sceneName);
  if (mode === "orbit") return 0.62 + 0.22 * Math.sin(Math.PI * q) + 0.08 * Math.sin(4 * Math.PI * q);
  if (mode === "rotor" || mode === "bullet") return 0.68 + 0.18 * Math.sin(2 * Math.PI * q) * Math.sin(2 * Math.PI * q);
  if (mode === "water") return 0.55 + 0.3 * Math.sin(Math.PI * q);
  if (mode === "engine") {
    if (/刹车|制动|减速|停车/i.test(text)) return 1 - 0.78 * q;
    return 0.32 + 0.68 * Math.sqrt(q);
  }
  if (mode === "spring" || mode === "pulley") return 0.18 + 0.82 * Math.sin(Math.PI * q);
  if (mode === "slide" || mode === "track") {
    if (/刹车|制动|减速/i.test(text)) return 1 - 0.82 * q;
    return 0.18 + 0.82 * Math.sqrt(q);
  }
  if (/上抛|竖直抛|斜抛|投射|抛石/i.test(text)) return 0.22 + 0.78 * Math.abs(1 - 2 * q);
  return 0.28 + 0.72 * Math.sqrt(q);
}

function fanPhysicsModelSoundFrame(sceneName, progress) {
  var q = fanPhysicsSoundClamp(progress);
  var profile = fanPhysicsModelSoundProfiles[sceneName] || { mode: "track" };
  var speed = 0.55 + 0.3 * Math.sin(Math.PI * q);
  var amount = Math.abs(2 * q - 1);
  if (sceneName === "doubleThrow" || sceneName === "pipeDrop") {
    speed = 0.25 + 0.75 * Math.abs(1 - 2 * q);
  } else if (sceneName === "threeCar") {
    speed = 1 - 0.82 * q;
    amount = q;
  } else if (sceneName === "inclineSlot" || sceneName === "motionCompose") {
    speed = 0.18 + 0.82 * Math.sqrt(q);
    amount = q;
  } else if (sceneName === "projectileBasic" || sceneName === "projectileSlope" || sceneName === "projectileWindow" || sceneName === "projectileNormal") {
    speed = 0.28 + 0.72 * Math.sqrt(q);
    amount = q;
  } else if (sceneName === "volleyballServe") {
    speed = 0.35 + 0.65 * Math.sqrt(q);
    amount = q;
  } else if (sceneName === "dartTarget") {
    speed = 1 - 0.72 * q;
    amount = 1 - q;
  } else if (sceneName === "projectileBounce") {
    if (q <= 1 / 3) {
      speed = 0.28 + 0.72 * q * 3;
    } else {
      speed = 0.25 + 0.75 * Math.abs(1 - 2 * (q - 1 / 3) / (2 / 3));
    }
    amount = q;
  } else if (sceneName === "dualConstraintCircle" || sceneName === "bikeGear" || sceneName === "pileDriver" || sceneName === "bowlDoubleBall") {
    speed = 0.72 + 0.18 * Math.sin(2 * Math.PI * q) * Math.sin(2 * Math.PI * q);
    amount = q;
  } else if (sceneName === "bulletCylinder") {
    speed = 0.82;
    amount = q;
  }
  return fanPhysicsSoundFrameForMode(profile.mode, speed, amount);
}

function fanPhysicsGenericSoundProfile(sceneName) {
  var mode = fanPhysicsSoundMode(sceneName);
  var text = fanPhysicsProblemText(sceneName);
  var profile = {
    mode: mode,
    description: fanPhysicsSoundModeDescriptions[mode] || "音效会跟随动画速度和关键物理事件变化",
    startEvent: "",
    startIntensity: 0.55,
    endEvent: "stop",
    endIntensity: 0.5
  };
  if (/火箭|喷气式|航天器发射/i.test(text)) profile.startEvent = "thrust";
  else if (/踢|发球/i.test(text)) profile.startEvent = "kick";
  else if (/上抛|平抛|斜抛|抛出|投弹|飞镖|射流|喷泉|起飞/i.test(text)) profile.startEvent = "launch";
  else if (mode === "spring") profile.startEvent = "release";
  else if (/阀|水管|水柱/i.test(text)) profile.startEvent = "valve";

  if (/入水|落海|水中|喷泉|射流|水柱.*墙|消防水|submerged|浸没|浸入|压入水/i.test(text)) {
    profile.endEvent = "splash";
    profile.endIntensity = 0.75;
  } else if (/碰撞|相撞|撞击/i.test(text)) {
    profile.endEvent = "collision";
    profile.endIntensity = 0.8;
  } else if (/落地|着地|击中|撞墙|弹痕|落到|砸/i.test(text)) {
    profile.endEvent = "impact";
    profile.endIntensity = 0.72;
  } else if (/刹车|制动|停车/i.test(text)) {
    profile.endEvent = "brake";
    profile.endIntensity = 0.62;
  } else if (/渡河|到岸|变轨|卫星|行星|恒星|公转|圆周/i.test(text)) {
    profile.endEvent = "marker";
    profile.endIntensity = 0.4;
  } else if (mode === "spring" || mode === "pulley") {
    profile.endEvent = "settle";
  }
  return profile;
}

function getFanPhysicsSoundProfile(sceneName) {
  if (fanPhysicsModelSoundProfiles[sceneName]) {
    return fanPhysicsModelSoundProfiles[sceneName];
  }
  if (isMechanicalEnergySoundScene(sceneName) && typeof getMechanicalEnergySoundProfile === "function") {
    return getMechanicalEnergySoundProfile(sceneName);
  }
  return fanPhysicsGenericSoundProfile(sceneName);
}

function getFanPhysicsSoundFrame(sceneName, progress) {
  if (isMechanicalEnergySoundScene(sceneName) && typeof getMechanicalEnergySoundFrame === "function") {
    return getMechanicalEnergySoundFrame(sceneName, progress);
  }
  var q = fanPhysicsSoundClamp(progress);
  if (sceneName === "handRopeBreak") {
    var breakProgress = fanPhysicsSoundClamp(handConeCycleTime() / Math.max(0.001, handSceneDuration()));
    if (q < breakProgress) {
      return fanPhysicsSoundFrameForMode("rotor", 0.74, q / Math.max(0.001, breakProgress));
    }
    return fanPhysicsSoundFrameForMode("air", (q - breakProgress) / Math.max(0.001, 1 - breakProgress), 0);
  }
  if (fanPhysicsModelSoundProfiles[sceneName]) {
    return fanPhysicsModelSoundFrame(sceneName, q);
  }
  var mode = fanPhysicsSoundMode(sceneName);
  var speed = fanPhysicsSoundSpeed(sceneName, q, mode);
  return fanPhysicsSoundFrameForMode(mode, speed, Math.abs(2 * q - 1));
}

function fanPhysicsGenericSoundCues(sceneName) {
  var text = fanPhysicsProblemText(sceneName);
  var cues = [];
  if (/反弹|回弹/i.test(text)) cues.push({ at: 0.34, event: "collision", intensity: 0.75 });
  if (/断绳|绳断|脱离绳|绳子断/i.test(text)) cues.push({ at: 0.55, event: "snap", intensity: 0.78 });
  if (/碰撞|相撞/i.test(text)) cues.push({ at: 0.58, event: "collision", intensity: 0.72 });
  if (/变轨|两阶段|换挡|分段启动/i.test(text)) cues.push({ at: 0.5, event: "shift", intensity: 0.5 });
  if (/最高点|上抛|竖直抛|斜抛/i.test(text)) cues.push({ at: 0.5, event: "apex", intensity: 0.32 });
  if (/传送带|接触弹簧|压缩弹簧/i.test(text)) cues.push({ at: 0.42, event: "contact", intensity: 0.42 });
  if (/齿轮|链轮|链条|转盘/i.test(text)) cues.push({ at: 0.5, event: "gear", intensity: 0.35 });
  return cues;
}

function getFanPhysicsSoundCues(sceneName) {
  var modelProfile = fanPhysicsModelSoundProfiles[sceneName];
  if (modelProfile) {
    if (sceneName === "doubleThrow") {
      return [
        { at: fanPhysicsSoundClamp((2 * throwV0 / Math.max(0.1, throwG)) / Math.max(0.001, throwMaxT)), event: "apex", intensity: 0.3 },
        { at: fanPhysicsSoundClamp((throwDelay + throwV0 / Math.max(0.1, throwG)) / Math.max(0.001, throwMaxT)), event: "apex", intensity: 0.26 }
      ];
    }
    if (sceneName === "pipeDrop") {
      var intervals = getPipePassIntervals();
      return intervals.length ? [{ at: fanPhysicsSoundClamp(intervals[0].start / Math.max(0.001, pipeLandTime())), event: "contact", intensity: 0.45 }] : [];
    }
    if (sceneName === "projectileWindow") {
      return [{ at: fanPhysicsSoundClamp((winL / Math.max(0.1, winV0)) / Math.max(0.001, windowEndTime())), event: "contact", intensity: 0.35 }];
    }
    if (sceneName === "volleyballServe") {
      return [{ at: fanPhysicsSoundClamp((volleyS / Math.max(0.1, volleyV0)) / Math.max(0.001, volleyFlightTime())), event: "marker", intensity: 0.32 }];
    }
    if (sceneName === "handRopeBreak") {
      return [{ at: fanPhysicsSoundClamp(handConeCycleTime() / Math.max(0.001, handSceneDuration())), event: "snap", intensity: 0.82 }];
    }
    return modelProfile.cues || [];
  }
  if (isMechanicalEnergySoundScene(sceneName) && typeof getMechanicalEnergySoundCues === "function") {
    return getMechanicalEnergySoundCues(sceneName);
  }
  return fanPhysicsGenericSoundCues(sceneName);
}
