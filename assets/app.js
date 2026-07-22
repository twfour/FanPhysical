var currentScene = "home";
var mathRenderedSceneMap = {};
var mathRenderingSceneMap = {};
var modelSourceMap = {
  doubleThrow: {
    title: "2026春季班 / 竖直上抛运动",
    text: "第7题"
  },
  pipeDrop: {
    title: "2026春季班 / 竖直上抛运动",
    text: "第10题"
  },
  threeCar: {
    title: "2026春季班 / 竖直上抛运动",
    text: "第11题"
  },
  inclineSlot: {
    title: "2026春季班 / 必修一结业测试",
    text: "第3题"
  },
  curveForce: {
    title: "暑期课时1曲线运动课上内容",
    text: "第5题"
  },
  motionCompose: {
    title: "暑期课时1曲线运动课上内容",
    text: "第4题"
  },
  riverCrossing: {
    title: "暑期课时1曲线运动课上内容 / 曲线运动课后作业",
    text: "课上第8题；课后作业 A组第3题"
  },
  riverAdvanced: {
    title: "暑期课时1曲线运动课上内容",
    text: "第9题"
  },
  rainWindow: {
    title: "曲线运动课后作业",
    text: "B组第10题"
  },
  rodConstraint: {
    title: "暑期课时1曲线运动课上内容",
    text: "第13题"
  },
  dualConstraintCircle: {
    title: "暑假课时5 曲线运动习题训练",
    text: "第17题"
  },
  handRopeBreak: {
    title: "暑假课时5 曲线运动习题训练",
    text: "第18题"
  },
  projectileBasic: {
    title: "平抛运动课上内容",
    text: "第1题、第2题基础模型"
  },
  projectileSlope: {
    title: "平抛运动课上内容",
    text: "第2题"
  },
  projectileWindow: {
    title: "平抛运动课上内容",
    text: "第6题"
  },
  volleyballServe: {
    title: "平抛运动课上内容",
    text: "第7题"
  },
  dartTarget: {
    title: "平抛运动课上内容",
    text: "第8题"
  },
  projectileNormal: {
    title: "平抛运动课上内容 / 平抛运动课后作业",
    text: "课上第3题；课后作业第8题"
  },
  projectileBounce: {
    title: "平抛运动课后作业",
    text: "第12题"
  },
  semiCircleThrow: {
    title: "平抛运动课上内容",
    text: "第5题"
  },
  bulletCylinder: {
    title: "2026暑假班 / 圆周运动",
    text: "课上第2题"
  },
  bikeGear: {
    title: "2026暑假班 / 圆周运动",
    text: "课上第3题"
  },
  pileDriver: {
    title: "2026暑假班 / 圆周运动",
    text: "第9题"
  }
};

var knowledgePointMap = {
  doubleThrow: ["竖直上抛", "相对运动", "相遇条件"],
  pipeDrop: ["相对运动", "自由落体", "同加速度模型"],
  threeCar: ["匀减速", "追及相遇", "临界条件"],
  inclineSlot: ["斜面运动", "圆几何", "等时性"],
  curveForce: ["曲线运动", "受力分析", "切向与法向"],
  motionCompose: ["运动合成", "图像读取", "牛顿第二定律"],
  riverCrossing: ["速度合成", "渡河模型", "分运动"],
  waterfallCrossing: ["速度合成", "临界轨迹", "最小船速"],
  riverAdvanced: ["速度圆", "最短位移", "矢量合成"],
  rainWindow: ["相对速度", "参考系", "速度分解"],
  rodConstraint: ["杆约束", "速度投影", "关联速度"],
  dualConstraintCircle: ["圆周运动", "双约束", "向心力"],
  handRopeBreak: ["圆锥摆", "断绳抛体", "最值"],
  projectileBasic: ["平抛运动", "分解运动", "运动学公式"],
  projectileSlope: ["平抛运动", "斜面几何", "末速度方向"],
  projectileWindow: ["平抛运动", "区间判断", "厚墙模型"],
  volleyballServe: ["平抛运动", "临界过网", "落点判断"],
  dartTarget: ["斜抛运动", "命中条件", "速度方向"],
  projectileNormal: ["平抛运动", "垂直斜面", "速度分解"],
  projectileBounce: ["平抛运动", "碰撞反弹", "分段运动"],
  semiCircleThrow: ["平抛运动", "圆弧坐标", "速度比"],
  bulletCylinder: ["圆周运动", "角速度", "穿筒时间"],
  bikeGear: ["圆周运动", "链传动", "角速度"],
  pileDriver: ["圆周运动", "向心力", "超重与失重"],
  bowlDoubleBall: ["圆周运动", "圆锥摆", "半球碗约束"]
};

var problemDataMap = {};
var problemDataList = [];
var problemIndexMap = {};
var problemLoadPromiseMap = {};
var problemCatalogReadyPromise = null;
var sceneSwitchRequestId = 0;
var runtimeScriptPromiseMap = {};
var mathJaxLoadPromise = null;
var runtimeAssetVersion = "20260722-runtime-split";
var promotedProblemChapterMap = {
  "必修一结业测试": true,
  "必修二结业测试": true,
  "曲线运动": true,
  "平抛运动": true,
  "圆周运动": true,
  "圆周运动日常": true,
  "万有引力与宇宙航行": true,
  "行星运动与变轨等问题": true,
  "功和功率": true,
  "动能定理": true,
  "机械能守恒定律": true,
  "功能关系": true
};
var canvasW = 1000;
var canvasH = 500;
var animRight = 570;
var graphLeft = 574;
var graphRight = 1000;
var originX = 400;
var originY = 250;

var simTime = 0;
var lastMillis = 0;
var canvasVisibilityListenerReady = false;

function shouldRunCanvasLoop(sceneName) {
  if (document.hidden || !isJsonAnimationScene(sceneName)) {
    return false;
  }
  var problem = problemDataMap[sceneName] || {};
  var animation = problem.animation || {};
  var state = getJsonAnimationState(sceneName);
  return animation.playable !== false && state.playing === true;
}

function syncCanvasLoop() {
  if (typeof noLoop !== "function" || typeof redraw !== "function") {
    return;
  }
  if (shouldRunCanvasLoop(currentScene)) {
    lastMillis = millis();
    loop();
    return;
  }
  noLoop();
  redraw();
}

function handleCanvasVisibilityChange() {
  if (document.hidden) {
    noLoop();
    silencePhysicsAudio();
    return;
  }
  syncCanvasLoop();
}

function setup() {
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  var cnv = createCanvas(canvasW, canvasH);
  cnv.parent("canvas-holder");
  textFont('"Noto Sans SC", "Microsoft YaHei", sans-serif');
  loadStepConversationState();
  physicsSoundEnabled = readPhysicsSoundPreference();
  if (drawingContext) {
    drawingContext.fontKerning = "normal";
    drawingContext.textRendering = "geometricPrecision";
  }
  if (!canvasVisibilityListenerReady) {
    document.addEventListener("visibilitychange", handleCanvasVisibilityChange);
    canvasVisibilityListenerReady = true;
  }
  noLoop();
  initializeLearningProgressOverview();
  problemCatalogReadyPromise = loadProblemData();
  problemCatalogReadyPromise.then(function () {
    renderFavoriteHome();
    switchScene(currentScene);
  });
  renderFavoriteHome();
  switchScene(currentScene);
  lastMillis = millis();
}

function draw() {
  var now = millis();
  var dt = Math.min((now - lastMillis) / 1000, 0.033);
  lastMillis = now;
  simTime += dt;

  background(255);
  drawLayout();

  if (isJsonProblemScene(currentScene)) {
    updateJsonAnimation(dt);
    drawJsonAnimationScene();
  }
  if (!shouldRunCanvasLoop(currentScene)) {
    noLoop();
  }
}

function drawAnimScene(sceneDrawer) {
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, animRight, canvasH);
  drawingContext.clip();
  sceneDrawer();
  drawingContext.restore();
  pop();
}

function updateSceneTreeSelection(sceneName) {
  document.getElementById("treeHome").className = sceneName === "home" ? "tree-item active" : "tree-item";
  document.querySelectorAll(".tree-item[data-scene]").forEach(function (item) {
    item.className = item.dataset.scene === sceneName ? "tree-item indent active" : "tree-item indent";
  });
}

function clearProblemNotesHost() {
  var host = document.getElementById("problemNotesHost");
  if (!host) {
    return;
  }
  var note = host.querySelector(".problem-notes");
  if (note) {
    var sceneName = note.id.replace(/Notes$/, "");
    if (window.MathJax && window.MathJax.typesetClear) {
      window.MathJax.typesetClear([note]);
    }
    delete mathRenderedSceneMap[sceneName];
    delete mathRenderingSceneMap[sceneName];
  }
  host.innerHTML = "";
}

function showProblemLoadStatus(message, isError) {
  clearProblemNotesHost();
  var host = document.getElementById("problemNotesHost");
  if (!host) {
    return;
  }
  var status = document.createElement("div");
  status.className = isError ? "problem-load-status is-error" : "problem-load-status";
  status.innerText = message;
  host.appendChild(status);
}

function applySceneView(sceneName) {
  document.getElementById("homePanel").style.display = sceneName === "home" ? "block" : "none";
  if (sceneName === "home") {
    renderFavoriteHome();
    renderLearningProgressOverview();
  }
  var summerExamPanel = document.getElementById("summerExamPanel");
  if (summerExamPanel) {
    summerExamPanel.style.display = sceneName === "summerExam" ? "block" : "none";
  }
  if (sceneName === "summerExam" && typeof renderSummerExamMath === "function") {
    renderSummerExamMath();
    ensureMathJaxReady().then(function () {
      if (currentScene === "summerExam" && typeof renderSummerExamMath === "function") {
        renderSummerExamMath();
      }
    }).catch(function (error) {
      console.warn("Summer exam MathJax load failed", error);
    });
  }
  document.getElementById("canvas-holder").style.display = shouldShowCanvas(sceneName) ? "block" : "none";
  renderJsonAnimationControls(sceneName);
  var note = document.getElementById(sceneName + "Notes");
  if (note) {
    note.style.display = "block";
  }
  updateModelSource(sceneName);
  scheduleSceneMath(sceneName);
  syncCanvasLoop();
}

function switchScene(sceneName) {
  var requestId = ++sceneSwitchRequestId;
  if (currentScene !== sceneName) {
    if (isJsonAnimationScene(currentScene)) {
      getJsonAnimationState(currentScene).playing = false;
    }
    stopStepVoiceRecognition(true);
    silencePhysicsAudio();
  }
  currentScene = sceneName;
  updateSceneTreeSelection(sceneName);

  if (sceneName === "home" || sceneName === "summerExam") {
    clearProblemNotesHost();
    applySceneView(sceneName);
    return Promise.resolve(null);
  }

  document.getElementById("homePanel").style.display = "none";
  var summerExamPanel = document.getElementById("summerExamPanel");
  if (summerExamPanel) {
    summerExamPanel.style.display = "none";
  }
  document.getElementById("canvas-holder").style.display = "none";
  renderJsonAnimationControls("");
  updateModelSource("");
  showProblemLoadStatus("正在加载题目…", false);
  syncCanvasLoop();

  return ensureProblemLoaded(sceneName).then(function (problem) {
    if (requestId !== sceneSwitchRequestId) {
      return null;
    }
    if (!problem) {
      showProblemLoadStatus("题目加载失败，请稍后重试。", true);
      return null;
    }
    return ensureProblemRuntime(problem).then(function () {
      if (requestId !== sceneSwitchRequestId) {
        return null;
      }
      var note = renderProblemDataNotes(problem);
      enhanceProblemNotes(note);
      applySceneView(sceneName);
      return problem;
    });
  }).catch(function (error) {
    if (requestId === sceneSwitchRequestId) {
      console.warn("Problem runtime load failed", sceneName, error);
      showProblemLoadStatus("动画组件加载失败，请刷新后重试。", true);
    }
    return null;
  });
}

function waitForProblemLoad(ms) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, ms);
  });
}

async function fetchProblemJson(path, attempts) {
  var maxAttempts = Math.max(1, Number(attempts || 1));
  var attempt;
  var lastError = null;
  for (attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      var response = await fetch(path, { cache: "default" });
      if (response.ok) {
        return await response.json();
      }
      lastError = new Error("HTTP " + response.status);
    } catch (error) {
      lastError = error;
    }
    if (attempt + 1 < maxAttempts) {
      await waitForProblemLoad(140 * (attempt + 1));
    }
  }
  console.warn("Problem JSON load failed", path, lastError);
  return null;
}

function loadRuntimeScript(path) {
  if (runtimeScriptPromiseMap[path]) {
    return runtimeScriptPromiseMap[path];
  }
  runtimeScriptPromiseMap[path] = new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.src = path + (path.indexOf("?") >= 0 ? "&" : "?") + "v=" + runtimeAssetVersion;
    script.async = true;
    script.dataset.runtimeScript = path;
    script.onload = function () {
      resolve(path);
    };
    script.onerror = function () {
      delete runtimeScriptPromiseMap[path];
      reject(new Error("Unable to load " + path));
    };
    document.head.appendChild(script);
  });
  return runtimeScriptPromiseMap[path];
}

function fanPhysicsSceneScript(variant) {
  var springScenes = {
    doubleThrow: true,
    pipeDrop: true,
    threeCar: true,
    inclineSlot: true
  };
  var curveScenes = {
    motionCompose: true,
    curveForce: true,
    riverCrossing: true,
    riverAdvanced: true,
    waterfallCrossing: true,
    rodConstraint: true,
    dualConstraintCircle: true,
    handRopeBreak: true,
    rainWindow: true
  };
  var projectileScenes = {
    projectileBasic: true,
    projectileSlope: true,
    projectileNormal: true,
    semiCircleThrow: true,
    projectileWindow: true,
    volleyballServe: true,
    dartTarget: true,
    projectileBounce: true
  };
  if (springScenes[variant]) {
    return "/assets/scenes/spring-2026.js";
  }
  if (curveScenes[variant]) {
    return "/assets/scenes/curve-motion.js";
  }
  if (projectileScenes[variant]) {
    return "/assets/scenes/projectile-motion.js";
  }
  return "/assets/scenes/circular-motion.js";
}

var problemRuntimeScriptMap = {
  curve_training_model: ["/assets/scenes/curve-training.js"],
  projectile_training_model: ["/assets/scenes/projectile-training.js"],
  gravitation_model: ["/assets/scenes/gravitation.js"],
  gravitation_lunar_throw: ["/assets/scenes/projectile-motion.js"],
  gravitation_eclipse: ["/assets/scenes/circular-motion.js"],
  work_power_model: ["/assets/scenes/work-power.js"],
  kinetic_energy_model: ["/assets/scenes/kinetic-energy.js"],
  mechanical_energy_model: ["/assets/scenes/mechanical-energy.js"],
  functional_relation_model: ["/assets/scenes/functional-relations.js"],
  required_one_test_model: ["/assets/scenes/required-one-test.js"],
  required_two_test_model: ["/assets/scenes/required-two-test.js"]
};

function getProblemRuntimeScripts(problem) {
  var animation = (problem && problem.animation) || {};
  var type = animation.type || "";
  var scripts = (problemRuntimeScriptMap[type] || []).slice();
  if (type === "fanphysics_model") {
    scripts.push(fanPhysicsSceneScript(animation.variant || problem.id));
    scripts.push("/assets/scenes/fanphysics-models.js");
  }
  if (getCodexAnimationKey(problem.id) === "bulletCylinder" && scripts.indexOf("/assets/scenes/circular-motion.js") < 0) {
    scripts.unshift("/assets/scenes/circular-motion.js");
  }
  return scripts;
}

function ensureProblemRuntime(problem) {
  var scripts = getProblemRuntimeScripts(problem);
  return scripts.reduce(function (promise, path) {
    return promise.then(function () {
      return loadRuntimeScript(path);
    });
  }, Promise.resolve());
}

function registerProblemData(problem) {
  if (!problem || !problem.id) {
    return null;
  }
  var isNew = !problemDataMap[problem.id];
  problem.animation = normalizeProblemAnimation(problem);
  problemDataMap[problem.id] = problem;
  if (isNew) {
    problemDataList.push(problem);
  }
  if (problem.knowledge) {
    knowledgePointMap[problem.id] = problem.knowledge;
  }
  if (!isPromotedProblem(problem)) {
    modelSourceMap[problem.id] = normalizeProblemSource(problem);
  }
  return problem;
}

function ensureProblemLoaded(sceneName) {
  if (problemDataMap[sceneName]) {
    return Promise.resolve(problemDataMap[sceneName]);
  }
  if (problemLoadPromiseMap[sceneName]) {
    return problemLoadPromiseMap[sceneName];
  }
  var catalogReady = problemCatalogReadyPromise || Promise.resolve();
  problemLoadPromiseMap[sceneName] = catalogReady.then(function () {
    var item = problemIndexMap[sceneName];
    if (!item || !item.file) {
      return null;
    }
    return fetchProblemJson("/data/problems/" + item.file, 3).then(registerProblemData);
  }).finally(function () {
    delete problemLoadPromiseMap[sceneName];
  });
  return problemLoadPromiseMap[sceneName];
}

async function loadProblemData() {
  try {
    var index = await fetchProblemJson("/data/problems/index.json", 3);
    if (!index) {
      return;
    }
    var items = Array.isArray(index.problems) ? index.problems : [];
    items.forEach(function (item) {
      if (item && item.id && item.file) {
        problemIndexMap[item.id] = item;
      }
    });
  } catch (error) {
    console.warn("Problem JSON load failed", error);
  }
}

function getStudentState(sceneName, stepId) {
  var key = "fanphysics_step_ai_" + sceneName + "_" + stepId;
  var count = Number(localStorage.getItem(key) || "0");
  return {
    currentStepQuestionCount: count,
    status: count > 0 ? "提问中" : "未提问"
  };
}

function incrementStudentState(sceneName, stepId) {
  var key = "fanphysics_step_ai_" + sceneName + "_" + stepId;
  var count = Number(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, String(count));
}

function getAnimationState(sceneName) {
  var state = { scene: sceneName };
  if (isJsonAnimationScene(sceneName)) {
    var animation = (problemDataMap[sceneName] || {}).animation || {};
    var jsonState = getJsonAnimationState(sceneName);
    return {
      scene: sceneName,
      type: animation.type,
      level: animation.level,
      time: jsonState.time,
      playing: jsonState.playing,
      params: jsonState.values
    };
  }
  if (sceneName === "projectileBasic") {
    state.time = projT;
    state.x = projV0 * projT;
    state.y = projHeight - 0.5 * projG * projT * projT;
    state.vx = projV0;
    state.vy = -projG * projT;
    return state;
  }
  if (sceneName === "projectileSlope") {
    state.time = slopeT;
    state.vx = slopeV0;
    state.vy = -slopeG * slopeT;
    state.slopeAngle = slopeAngle;
    return state;
  }
  if (sceneName === "riverCrossing") {
    state.time = riverT;
    state.boatSpeed = riverBoatSpeed;
    state.waterSpeed = riverWaterSpeed;
    state.theta = riverTheta;
    return state;
  }
  if (sceneName === "curveForce") {
    state.forceNormal = forceNormal;
    state.forceTangential = forceTangential;
    state.forcePoint = forcePoint;
    return state;
  }
  if (sceneName === "rodConstraint") {
    state.alpha = rodAlpha;
    state.vB = rodVB;
    return state;
  }
  if (sceneName === "dualConstraintCircle") {
    state.omega = dualOmega;
    state.time = dualT;
    return state;
  }
  if (sceneName === "handRopeBreak") {
    state.alpha = handAlpha;
    state.lengthRatio = handLengthRatio;
    state.time = handT;
    return state;
  }
  state.time = typeof simTime === "number" ? Number(simTime.toFixed(2)) : null;
  return state;
}

function markdownLiteInlineToHtml(text) {
  var placeholders = [];
  var protectedText = String(text || "").replace(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, function (match) {
    var token = "@@MATH" + placeholders.length + "@@";
    placeholders.push(match);
    return token;
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  return escapeHtml(protectedText)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/@@MATH(\d+)@@/g, function (_, index) {
      return placeholders[Number(index)] || "";
    });
}

function markdownLiteToHtml(text) {
  var placeholders = [];
  var protectedText = String(text || "").replace(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, function (match) {
    var token = "@@MATH" + placeholders.length + "@@";
    placeholders.push(match);
    return token;
  });

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function restoreMath(value) {
    return value.replace(/@@MATH(\d+)@@/g, function (_, index) {
      return placeholders[Number(index)] || "";
    });
  }

  function renderInline(value) {
    var escaped = escapeHtml(value);
    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return restoreMath(escaped);
  }

  return protectedText.split(/\n{2,}/).map(function (part) {
    var lines = part.split("\n");
    if (lines.length > 0 && /^#{1,4}\s+/.test(lines[0])) {
      var title = lines.shift().replace(/^#{1,4}\s+/, "");
      var rest = lines.join("\n").trim();
      return "<p class=\"step-ai-subtitle\">" + renderInline(title) + "</p>" +
        (rest ? markdownLiteToHtml(restoreMath(rest)) : "");
    }
    var isList = lines.every(function (line) {
      return /^\s*[-*]\s+/.test(line);
    });
    if (isList) {
      return "<ul>" + lines.map(function (line) {
        return "<li>" + renderInline(line.replace(/^\s*[-*]\s+/, "")) + "</li>";
      }).join("") + "</ul>";
    }
    return "<p>" + lines.map(renderInline).join("<br>") + "</p>";
  }).join("");
}

function ensureMathJaxReady() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    return Promise.resolve(window.MathJax);
  }
  if (mathJaxLoadPromise) {
    return mathJaxLoadPromise;
  }
  mathJaxLoadPromise = new Promise(function (resolve, reject) {
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    script.onload = function () {
      var startup = window.MathJax && window.MathJax.startup && window.MathJax.startup.promise;
      Promise.resolve(startup).then(function () {
        if (window.MathJax && window.MathJax.typesetPromise) {
          resolve(window.MathJax);
        } else {
          reject(new Error("MathJax loaded without typesetPromise"));
        }
      });
    };
    script.onerror = function () {
      mathJaxLoadPromise = null;
      reject(new Error("Unable to load MathJax"));
    };
    document.head.appendChild(script);
  });
  return mathJaxLoadPromise;
}

function renderMath(root) {
  return ensureMathJaxReady().then(function (mathJax) {
    if (root) {
      return mathJax.typesetPromise([root]);
    }
    return mathJax.typesetPromise();
  });
}

function scheduleSceneMath(sceneName) {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(function () {
      renderSceneMath(sceneName);
    });
  } else {
    setTimeout(function () {
      renderSceneMath(sceneName);
    }, 0);
  }
}

function renderSceneMath(sceneName) {
  if (sceneName === "home") {
    return;
  }
  if (mathRenderedSceneMap[sceneName] || mathRenderingSceneMap[sceneName]) {
    return;
  }
  var root = document.getElementById(sceneName + "Notes");
  if (!root) {
    return;
  }
  mathRenderingSceneMap[sceneName] = true;
  renderMath(root).then(function () {
    if (currentScene === sceneName && document.documentElement.contains(root)) {
      mathRenderedSceneMap[sceneName] = true;
    }
  }).catch(function (error) {
    console.warn("MathJax render failed", error);
  }).finally(function () {
    mathRenderingSceneMap[sceneName] = false;
  });
}

function updateModelSource(sceneName) {
  var source = modelSourceMap[sceneName];
  var sourceBox = document.getElementById("modelSource");
  if (!sourceBox) {
    return;
  }
  if (!source) {
    sourceBox.style.display = "none";
    return;
  }
  document.getElementById("modelSourceTitle").innerText = source.title;
  document.getElementById("modelSourceText").innerText = source.text;
  sourceBox.style.display = "block";
}

function drawLayout() {
  stroke("#d7dce5");
  strokeWeight(1);
  line(animRight, 0, animRight, canvasH);
  line(graphLeft, 0, graphLeft, canvasH);

  noStroke();
  fill("#f6f8fb");
  rect(graphLeft, 0, graphRight - graphLeft, canvasH);
}
