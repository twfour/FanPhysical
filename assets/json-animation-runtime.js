// JSON animation inference, controls, timing, and renderer dispatch.

var jsonAnimationState = {};

function normalizeProblemAnimation(problem) {
  var animation = problem.animation || {};
  if (!animation || animation.type === "none") {
    return inferProblemAnimation(problem);
  }
  animation.enabled = animation.enabled === true;
  animation.params = animation.params || {};
  animation.timeline = animation.timeline || {};
  if (typeof animation.playable !== "boolean") {
    animation.playable = animation.level === "animated";
  }
  if (typeof animation.interactive !== "boolean") {
    animation.interactive = true;
  }
  if (!animation.level) {
    animation.level = animation.playable ? "animated" : "interactive_diagram";
  }
  return animation;
}

function isProblemAnimationEnabled(problem) {
  return Boolean(problem && problem.animation && problem.animation.enabled === true && problem.animation.type !== "none");
}

function shouldShowCanvas(sceneName) {
  if (sceneName === "home" || sceneName === "summerExam") {
    return false;
  }
  if (isJsonProblemScene(sceneName)) {
    return isJsonAnimationScene(sceneName);
  }
  return true;
}

function inferProblemAnimation(problem) {
  var text = [problem.id, problem.model, problem.title, problem.question, (problem.knowledge || []).join(" ")]
    .filter(Boolean)
    .join(" ");
  var circularAnimation = inferCircularProblemAnimation(problem, text);
  if (circularAnimation) {
    return circularAnimation;
  }
  if (/子弹.*(圆筒|纸筒)|弹孔|穿.*(圆筒|纸筒)|bullet.*cylinder/i.test(text)) {
    return {
      level: "animated",
      type: "codex_scene",
      key: "bulletCylinder",
      playable: true,
      interactive: true,
      confidence: 0.72,
      notes: "题目解析来自 JSON，动画与图表绑定 Codex 手写模型 bulletCylinder",
      params: {
        d: { label: "圆筒直径", value: 0.2, min: 0.05, max: 1, step: 0.01, unit: "m" },
        omega: { label: "圆筒角速度", value: 3, min: 0.5, max: 8, step: 0.1, unit: "rad/s" },
        phi: { label: "弹孔夹角", value: 65, min: 10, max: 160, step: 1, unit: "deg" }
      },
      timeline: { duration: 1, loop: false }
    };
  }
  if (/平抛|抛体|projectile/i.test(text)) {
    return {
      level: "animated",
      type: "projectile",
      playable: true,
      interactive: true,
      confidence: 0.7,
      notes: "根据题目关键词自动选择平抛模型",
      params: {
        vx: { label: "水平速度", value: 8, min: 1, max: 30, step: 0.5, unit: "m/s" },
        height: { label: "高度", value: 20, min: 1, max: 80, step: 1, unit: "m" },
        g: { label: "重力加速度", value: 9.8, min: 1, max: 15, step: 0.1, unit: "m/s²" }
      },
      timeline: { duration: 3, loop: false }
    };
  }
  if (/弹簧|胡克|劲度|伸长|spring/i.test(text)) {
    return {
      level: "animated",
      type: "spring_balance",
      playable: true,
      interactive: true,
      confidence: 0.65,
      notes: "根据题目关键词自动选择弹簧平衡模型",
      params: {
        k: { label: "劲度系数", value: 100, min: 20, max: 300, step: 10, unit: "N/m" },
        mass: { label: "质量", value: 0.5, min: 0.1, max: 2, step: 0.1, unit: "kg" },
        g: { label: "重力加速度", value: 9.8, min: 1, max: 15, step: 0.1, unit: "m/s²" }
      },
      timeline: { duration: 4, loop: true }
    };
  }
  if (/受力|弹力|摩擦|平衡|斜面|支持力|force|friction/i.test(text)) {
    return {
      level: "interactive_diagram",
      type: "force_diagram",
      playable: false,
      interactive: true,
      confidence: 0.6,
      notes: "根据题目关键词自动选择受力图",
      params: {
        angle: { label: "接触面角度", value: 25, min: 0, max: 60, step: 1, unit: "deg" }
      },
      forces: [
        { label: "G", direction: "down", color: "#dc2626" },
        { label: "N", direction: "normal", color: "#2563eb" },
        { label: "f", direction: "surface", color: "#f59e0b" }
      ]
    };
  }
  return { level: "none", type: "none", playable: false, interactive: false, params: {} };
}

function makeCircularAnimation(variant, notes, params) {
  return {
    enabled: true,
    level: "animated",
    type: "circular_concept",
    variant: variant,
    playable: true,
    interactive: true,
    confidence: 0.8,
    notes: notes || "圆周运动动态图：按题意展示运动、受力和图像关系",
    params: params || {
      omega: { label: "角速度", value: 2.4, min: 0.5, max: 6, step: 0.1, unit: "rad/s" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" }
    },
    timeline: { duration: 6, loop: false }
  };
}

function inferCircularProblemAnimation(problem, text) {
  if (!problem || problem.chapter !== "圆周运动") {
    return null;
  }
  var id = problem.id || "";
  if (/bullet|子弹|纸筒|圆筒|弹孔/i.test(text)) {
    return {
      enabled: true,
      level: "animated",
      type: "bullet_cylinder",
      playable: true,
      interactive: true,
      confidence: 0.86,
      notes: "子弹穿旋转筒：用同一段时间连接子弹直线运动和圆筒转角",
      params: {
        d: { label: "圆筒直径", value: 0.30, min: 0.10, max: 1.00, step: 0.01, unit: "m" },
        omega: { label: "角速度", value: 6.0, min: 1.0, max: 12.0, step: 0.1, unit: "rad/s" },
        phi: { label: "弹孔夹角", value: 60, min: 10, max: 160, step: 1, unit: "deg" }
      },
      timeline: { duration: 1, loop: false }
    };
  }
  if (/飞镖|击中|转盘游戏/i.test(text)) {
    return makeCircularAnimation("dart_disk", "飞镖与转盘：飞镖飞行时间与圆盘转角条件同时满足", {
      omega: { label: "圆盘角速度", value: 3.14, min: 0.5, max: 8, step: 0.01, unit: "rad/s" },
      radius: { label: "圆盘半径", value: 1.0, min: 0.4, max: 2.0, step: 0.1, unit: "m" },
      flight: { label: "飞行时间", value: 1.0, min: 0.4, max: 2.5, step: 0.05, unit: "s" }
    });
  }
  if (/gear|belt|pulley|皮带|齿轮|传动|链轮|飞轮|自行车/i.test(text)) {
    return makeCircularAnimation("transmission", "传动模型：同轴角速度相等，接触/皮带/啮合处线速度相等", {
      omega: { label: "主动角速度", value: 2.4, min: 0.5, max: 6, step: 0.1, unit: "rad/s" },
      ratio: { label: "半径比", value: 2.0, min: 1.0, max: 5.0, step: 0.1, unit: "" }
    });
  }
  if (/cake|奶油|泼水|水珠|圆盘点|圆盘绕中心/i.test(text)) {
    return makeCircularAnimation("rotating_disk", "圆盘匀速转动：速度沿切线，向心加速度指向圆心", {
      omega: { label: "角速度", value: 1.57, min: 0.3, max: 5, step: 0.01, unit: "rad/s" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" }
    });
  }
  if (/圆锥摆|飞椅|漏斗|圆锥面|同高|双绳|转盘连接小球|水平圆周运动/i.test(text)) {
    var variant = /双绳|圆锥面/.test(text) ? "rope_cone_limit" : "conical_pendulum";
    if (/漏斗/.test(text)) {
      variant = "funnel_balls";
    }
    return makeCircularAnimation(variant, "圆锥摆/漏斗模型：重力与约束力合成提供水平向心力", {
      theta: { label: "夹角", value: 37, min: 10, max: 65, step: 1, unit: "deg" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" },
      g: { label: "重力加速度", value: 10, min: 5, max: 15, step: 0.1, unit: "m/s²" }
    });
  }
  if (/碰钉|突然停止|绕钉|拉力图像|竖直平面|竖直圆周|打夯机/i.test(text)) {
    return makeCircularAnimation("vertical_circle", "竖直圆模型：速度方向瞬时不变，半径改变会改变角速度、向心加速度和拉力", {
      omega: { label: "角速度", value: 2.8, min: 0.5, max: 7, step: 0.1, unit: "rad/s" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" },
      g: { label: "重力加速度", value: 10, min: 5, max: 15, step: 0.1, unit: "m/s²" }
    });
  }
  if (/摩擦|临界|侧滑|转台|木块|滑动/i.test(text)) {
    return makeCircularAnimation("friction_limit", "摩擦临界模型：所需向心力随 \\(\\omega^2r\\) 增大，先到临界者先滑", {
      omega: { label: "角速度", value: 2.0, min: 0.5, max: 6.0, step: 0.1, unit: "rad/s" },
      mu: { label: "摩擦因数", value: 0.40, min: 0.10, max: 1.00, step: 0.01, unit: "" },
      radius: { label: "半径", value: 1.0, min: 0.3, max: 2.0, step: 0.1, unit: "m" }
    });
  }
  if (/双人|溜冰|弹簧秤|面对面/i.test(text)) {
    return makeCircularAnimation("two_body_orbit", "双人圆周运动：内力相等、角速度相同，半径按质量反比分配", {
      omega: { label: "角速度", value: 0.62, min: 0.2, max: 2.0, step: 0.01, unit: "rad/s" },
      massRatio: { label: "质量比", value: 2.0, min: 0.5, max: 4.0, step: 0.1, unit: "" }
    });
  }
  return makeCircularAnimation("uniform_circle", "匀速圆周运动：速度沿切线，向心加速度指向圆心");
}

function isJsonAnimationScene(sceneName) {
  var problem = problemDataMap[sceneName];
  return Boolean(problem && isProblemAnimationEnabled(problem));
}

function isJsonProblemScene(sceneName) {
  return Boolean(problemDataMap[sceneName]);
}

function getJsonAnimationState(sceneName) {
  if (!jsonAnimationState[sceneName]) {
    jsonAnimationState[sceneName] = { time: 0, playing: false, values: {} };
  }
  var state = jsonAnimationState[sceneName];
  var animation = (problemDataMap[sceneName] || {}).animation || {};
  Object.keys(animation.params || {}).forEach(function (key) {
    if (typeof state.values[key] !== "number") {
      state.values[key] = Number(animation.params[key].value || 0);
    }
  });
  return state;
}

function getJsonParam(sceneName, key, fallback) {
  var state = getJsonAnimationState(sceneName);
  var value = state.values[key];
  return typeof value === "number" ? value : fallback;
}

function getCodexAnimationKey(sceneName) {
  var animation = (problemDataMap[sceneName] || {}).animation || {};
  return animation.key || animation.animationKey || "";
}

function renderJsonAnimationControls(sceneName) {
  var container = document.getElementById("jsonAnimationControls");
  if (!container) {
    return;
  }
  container.innerHTML = "";
  if (!isJsonAnimationScene(sceneName)) {
    container.style.display = "none";
    if (typeof applyAnimationPredictionGate === "function") {
      applyAnimationPredictionGate(sceneName);
    }
    return;
  }
  var problem = problemDataMap[sceneName];
  var animation = problem.animation;
  var state = getJsonAnimationState(sceneName);
  var params = animation.params || {};
  Object.keys(params).forEach(function (key) {
    var param = params[key] || {};
    var control = document.createElement("div");
    control.className = "control";
    var label = document.createElement("label");
    label.innerText = param.label || key;
    var hasOptions = Array.isArray(param.options) && param.options.length > 0;
    var input = document.createElement(hasOptions ? "select" : "input");
    if (hasOptions) {
      param.options.forEach(function (optionValue) {
        var option = document.createElement("option");
        option.value = Number(optionValue);
        option.innerText = String(optionValue);
        input.appendChild(option);
      });
    } else {
      input.type = "range";
      input.min = param.min;
      input.max = param.max;
      input.step = param.step || 1;
    }
    input.value = getJsonParam(sceneName, key, Number(param.value || 0));
    var value = document.createElement("span");
    value.className = "value";
    value.innerText = formatParamValue(Number(input.value), param.unit, param.step);
    var updateParam = function () {
      state.values[key] = Number(input.value);
      state.playing = false;
      pausePhysicsSoundPlayback();
      value.innerText = formatParamValue(state.values[key], param.unit, param.step);
      syncJsonTimeControl(sceneName);
      syncCanvasLoop();
    };
    if (hasOptions) {
      input.onchange = updateParam;
    } else {
      input.oninput = updateParam;
    }
    control.appendChild(label);
    control.appendChild(input);
    control.appendChild(value);
    container.appendChild(control);
  });
  if (animation.playable) {
    var duration = getJsonDuration(sceneName);
    var timeControl = document.createElement("div");
    timeControl.className = "control";
    var timeLabel = document.createElement("label");
    timeLabel.innerText = "观察时间";
    var timeInput = document.createElement("input");
    timeInput.id = "jsonAnimTime";
    timeInput.type = "range";
    timeInput.min = 0;
    timeInput.max = duration;
    timeInput.step = 0.02;
    timeInput.value = Math.min(state.time, duration);
    var timeValue = document.createElement("span");
    timeValue.id = "jsonAnimTimeVal";
    timeValue.className = "value";
    timeValue.innerText = Number(timeInput.value).toFixed(2) + "s";
    timeInput.oninput = function () {
      state.time = timeInput.valueAsNumber;
      state.playing = false;
      pausePhysicsSoundPlayback();
      syncJsonTimeControl(sceneName);
      syncCanvasLoop();
    };
    timeControl.appendChild(timeLabel);
    timeControl.appendChild(timeInput);
    timeControl.appendChild(timeValue);
    container.appendChild(timeControl);

    var play = document.createElement("button");
    play.id = "jsonAnimPlayBtn";
    play.type = "button";
    play.className = "action";
    play.innerText = state.playing ? "暂停" : "播放";
    play.onclick = function () {
      state.playing = !state.playing;
      if (state.playing) {
        if (isPhysicsSoundScene(sceneName) && physicsSoundEnabled) {
          beginPhysicsSoundPlayback(sceneName, duration > 0 ? state.time / duration : 0);
        }
      } else if (isPhysicsSoundScene(sceneName)) {
        pausePhysicsSoundPlayback();
      }
      syncJsonTimeControl(sceneName);
      syncCanvasLoop();
    };
    container.appendChild(play);

    if (isPhysicsSoundScene(sceneName)) {
      var sound = document.createElement("button");
      sound.id = "jsonAnimSoundBtn";
      sound.type = "button";
      sound.className = "action sound-action";
      sound.onclick = function () {
        setPhysicsSoundEnabled(!physicsSoundEnabled);
      };
      container.appendChild(sound);
      syncPhysicsSoundButton();
    }
  }
  if (animation.notes) {
    var meta = document.createElement("div");
    meta.className = "json-animation-meta";
    meta.innerText = animation.notes;
    container.appendChild(meta);
  }
  container.style.display = "grid";
  if (typeof applyAnimationPredictionGate === "function") {
    applyAnimationPredictionGate(sceneName);
  }
}

function formatParamValue(value, unit, step) {
  var absolute = Math.abs(value);
  var numericStep = Math.abs(Number(step || 0));
  var digits = numericStep > 0 && numericStep < 1
    ? Math.min(3, Math.ceil(-Math.log10(numericStep)))
    : (absolute >= 10 ? 0 : 1);
  var fixed = value.toFixed(digits);
  var cleanUnit = formatPhysicsUnit(unit);
  if (cleanUnit === "deg" || cleanUnit === "°") {
    return fixed + "°";
  }
  return cleanUnit ? fixed + cleanUnit : fixed;
}

function formatPhysicsUnit(unit) {
  return String(unit || "")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/m\/s2/g, "m/s²")
    .replace(/m\/s²²/g, "m/s²");
}

function getJsonDuration(sceneName) {
  var animation = (problemDataMap[sceneName] || {}).animation || {};
  if (animation.type === "fanphysics_model" && typeof getFanPhysicsModelDuration === "function") {
    return Math.max(0.5, getFanPhysicsModelDuration(sceneName));
  }
  if (animation.type === "gravitation_lunar_throw") {
    var lunarV0 = Math.max(0.1, getJsonParam(sceneName, "v0", 8));
    var lunarHeight = Math.max(0.1, getJsonParam(sceneName, "height", 20));
    return 4 * lunarHeight / lunarV0;
  }
  if (animation.type === "projectile") {
    var height = getJsonParam(sceneName, "height", 20);
    var g = Math.max(0.1, getJsonParam(sceneName, "g", 9.8));
    return Math.sqrt(2 * height / g);
  }
  if (animation.type === "bullet_cylinder") {
    var omega = Math.max(0.1, getJsonParam(sceneName, "omega", 3));
    var phi = getJsonBulletPhi(sceneName);
    return Math.max(0.2, (Math.PI - phi) / omega);
  }
  if (getCodexAnimationKey(sceneName) === "bulletCylinder") {
    var codexOmega = Math.max(0.1, getJsonParam(sceneName, "omega", 3));
    var codexPhi = getJsonBulletPhi(sceneName);
    return Math.max(0.2, (Math.PI - codexPhi) / codexOmega);
  }
  if (animation.type === "circular_concept" && animation.variant === "dart_disk") {
    return Math.max(0.2, getJsonParam(sceneName, "flight", 1.0));
  }
  if (animation.type === "work_power_model" && animation.variant === "lesson10_conveyor_work") {
    var beltSpeed = Math.max(0.1, getJsonParam(sceneName, "beltSpeed", 2));
    var conveyorMu = Math.max(0.01, getJsonParam(sceneName, "mu", 0.2));
    var conveyorG = Math.max(0.1, getJsonParam(sceneName, "g", 10));
    return beltSpeed / (conveyorMu * conveyorG);
  }
  if (animation.type === "work_power_model" && animation.variant === "lesson10_gravity_power") {
    var throwHeight = Math.max(0.1, getJsonParam(sceneName, "height", 20));
    var throwSpeed = Math.max(0, getJsonParam(sceneName, "speed", 10));
    var throwG = Math.max(0.1, getJsonParam(sceneName, "g", 10));
    return (throwSpeed + Math.sqrt(throwSpeed * throwSpeed + 2 * throwG * throwHeight)) / throwG;
  }
  return Math.max(0.5, Number((animation.timeline || {}).duration || 4));
}

function syncJsonTimeControl(sceneName) {
  var state = getJsonAnimationState(sceneName);
  var duration = getJsonDuration(sceneName);
  state.time = Math.min(state.time, duration);
  var input = document.getElementById("jsonAnimTime");
  var value = document.getElementById("jsonAnimTimeVal");
  var play = document.getElementById("jsonAnimPlayBtn");
  if (input) {
    input.max = duration.toFixed(2);
    input.value = state.time.toFixed(2);
  }
  if (value) {
    value.innerText = state.time.toFixed(2) + "s";
  }
  if (play) {
    var predictionLocked = typeof isLearningCyclePredictionComplete === "function" &&
      !isLearningCyclePredictionComplete(sceneName);
    play.disabled = predictionLocked;
    play.innerText = predictionLocked ? "先完成预测" : (state.playing ? "暂停" : "播放");
  }
  if (isPhysicsSoundScene(sceneName)) {
    syncPhysicsSoundButton();
  }
}

function updateJsonAnimation(dt) {
  if (!isJsonAnimationScene(currentScene)) {
    return;
  }
  var state = getJsonAnimationState(currentScene);
  var animation = problemDataMap[currentScene].animation;
  if (!state.playing || !animation.playable) {
    return;
  }
  var duration = getJsonDuration(currentScene);
  state.time += dt;
  var reachedEnd = state.time >= duration;
  if (isPhysicsSoundScene(currentScene)) {
    updatePhysicsSoundPlayback(currentScene, duration > 0 ? Math.min(state.time, duration) / duration : 0, true, reachedEnd);
  }
  if (reachedEnd) {
    if (typeof completeLearningCycleAnimation === "function") {
      completeLearningCycleAnimation(currentScene);
    }
    if ((animation.timeline || {}).loop) {
      state.time = 0;
      resetPhysicsSoundPlayback();
    } else {
      state.time = 0;
      state.playing = false;
      resetPhysicsSoundPlayback();
    }
  }
  syncJsonTimeControl(currentScene);
}

function drawJsonAnimationScene() {
  var animation = problemDataMap[currentScene].animation;
  var codexKey = getCodexAnimationKey(currentScene);
  var renderer = getSceneRenderer(animation.type);
  var sceneDrawer;
  var graphDrawer;
  if (codexKey === "bulletCylinder") {
    syncCodexBulletCylinderScene(currentScene);
    var codexRenderer = getFanPhysicsRenderer(codexKey);
    sceneDrawer = codexRenderer && codexRenderer.scene;
    graphDrawer = codexRenderer && codexRenderer.graph;
  } else if (renderer) {
    sceneDrawer = renderer.scene;
    graphDrawer = renderer.graph;
  }
  if (!sceneDrawer || !graphDrawer) {
    sceneDrawer = drawJsonPlaceholderScene;
    graphDrawer = drawJsonPlaceholderGraph;
  }
  drawAnimScene(sceneDrawer);
  drawGraphWithFrameCache(graphDrawer);
  if (codexKey === "bulletCylinder") {
    drawCodexSceneBadge("Codex 动画模型：bulletCylinder");
  }
}
