// Interactive virtual experiment workflow for instrument choice, sampling, and fitting.
var virtualExperimentStorageKey = "fanphysics:virtualExperiments:v1";

function defaultVirtualExperimentState(experiment) {
  return {
    instruments: [],
    calibrated: false,
    mass: Number(experiment.defaults.mass),
    radius: Number(experiment.defaults.radius),
    period: Number(experiment.defaults.period),
    samples: [],
    fitX: "period",
    conclusion: ""
  };
}

function getVirtualExperimentState(problem) {
  var saved = getLearningResponse(virtualExperimentStorageKey, problem.id + ":experiment");
  if (!saved) return defaultVirtualExperimentState(problem.experiment);
  try {
    var parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object"
      ? Object.assign(defaultVirtualExperimentState(problem.experiment), parsed)
      : defaultVirtualExperimentState(problem.experiment);
  } catch (error) {
    return defaultVirtualExperimentState(problem.experiment);
  }
}

function saveVirtualExperimentState(problem, state) {
  writeLearningResponse(
    virtualExperimentStorageKey,
    problem.id + ":experiment",
    JSON.stringify(state)
  );
}

function virtualExperimentNoise(problemId, sampleIndex, period) {
  var seed = 0;
  for (var index = 0; index < problemId.length; index += 1) {
    seed = (seed * 31 + problemId.charCodeAt(index)) % 10007;
  }
  var value = Math.sin(seed + sampleIndex * 12.9898 + period * 78.233) * 43758.5453;
  return (value - Math.floor(value) - 0.5) * 2;
}

function virtualExperimentFit(samples, fitX) {
  if (!Array.isArray(samples) || samples.length < 3) return null;
  var points = samples.map(function (sample) {
    var period = Number(sample.period);
    var x = fitX === "inversePeriodSquared"
      ? 1 / (period * period)
      : (fitX === "periodSquared" ? period * period : period);
    return { x: x, y: Number(sample.force) };
  });
  var count = points.length;
  var meanX = points.reduce(function (sum, point) { return sum + point.x; }, 0) / count;
  var meanY = points.reduce(function (sum, point) { return sum + point.y; }, 0) / count;
  var covariance = 0;
  var varianceX = 0;
  var varianceY = 0;
  points.forEach(function (point) {
    covariance += (point.x - meanX) * (point.y - meanY);
    varianceX += Math.pow(point.x - meanX, 2);
    varianceY += Math.pow(point.y - meanY, 2);
  });
  var slope = varianceX ? covariance / varianceX : 0;
  var intercept = meanY - slope * meanX;
  var residual = points.reduce(function (sum, point) {
    return sum + Math.pow(point.y - (slope * point.x + intercept), 2);
  }, 0);
  var rSquared = varianceY ? 1 - residual / varianceY : 1;
  return {
    points: points,
    slope: slope,
    intercept: intercept,
    rSquared: Math.max(-1, Math.min(1, rSquared))
  };
}

function drawVirtualExperimentFit(canvas, fit) {
  if (!canvas || !fit) return;
  var context = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var pad = { left: 54, right: 18, top: 20, bottom: 42 };
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  var xs = fit.points.map(function (point) { return point.x; });
  var ys = fit.points.map(function (point) { return point.y; });
  var minX = Math.min.apply(null, xs);
  var maxX = Math.max.apply(null, xs);
  var minY = Math.min.apply(null, ys.concat([0]));
  var maxY = Math.max.apply(null, ys);
  var xRange = maxX - minX || 1;
  var yRange = maxY - minY || 1;
  minX -= xRange * 0.08;
  maxX += xRange * 0.08;
  minY -= yRange * 0.08;
  maxY += yRange * 0.12;
  function px(value) {
    return pad.left + (value - minX) / (maxX - minX) * (width - pad.left - pad.right);
  }
  function py(value) {
    return height - pad.bottom - (value - minY) / (maxY - minY) * (height - pad.top - pad.bottom);
  }
  context.strokeStyle = "#738092";
  context.lineWidth = 1.4;
  context.beginPath();
  context.moveTo(pad.left, pad.top);
  context.lineTo(pad.left, height - pad.bottom);
  context.lineTo(width - pad.right, height - pad.bottom);
  context.stroke();
  context.strokeStyle = "#b7263d";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(px(minX), py(fit.slope * minX + fit.intercept));
  context.lineTo(px(maxX), py(fit.slope * maxX + fit.intercept));
  context.stroke();
  fit.points.forEach(function (point) {
    context.fillStyle = "#1d5f99";
    context.beginPath();
    context.arc(px(point.x), py(point.y), 4, 0, Math.PI * 2);
    context.fill();
  });
  context.fillStyle = "#394554";
  context.font = "14px sans-serif";
  context.fillText("F / N", 8, 18);
  context.fillText("所选横坐标", width - 92, height - 10);
}

function createVirtualExperimentBlock(problem) {
  var experiment = problem && problem.experiment;
  if (!experiment || experiment.enabled !== true) return null;
  var state = getVirtualExperimentState(problem);
  var block = createProblemNoteBlock("虚拟实验", experiment.title, experiment.goal);
  block.classList.add("virtual-experiment-block");
  block.dataset.keepExpanded = "1";

  var instrumentSection = document.createElement("section");
  instrumentSection.className = "virtual-lab-section";
  var instrumentTitle = document.createElement("h3");
  instrumentTitle.innerText = "1. 选择仪器";
  instrumentSection.appendChild(instrumentTitle);
  var instrumentGrid = document.createElement("div");
  instrumentGrid.className = "virtual-lab-instruments";
  experiment.instruments.forEach(function (instrument) {
    var label = document.createElement("label");
    var input = document.createElement("input");
    input.type = "checkbox";
    input.value = instrument.id;
    input.checked = state.instruments.indexOf(instrument.id) >= 0;
    var text = document.createElement("span");
    text.innerText = instrument.label;
    label.appendChild(input);
    label.appendChild(text);
    instrumentGrid.appendChild(label);
    input.onchange = function () {
      state.instruments = Array.from(instrumentGrid.querySelectorAll("input:checked")).map(function (item) {
        return item.value;
      });
      if (instrument.id === "forceSensor" && !input.checked) state.calibrated = false;
      saveVirtualExperimentState(problem, state);
      renderVirtualExperimentReadiness();
    };
  });
  instrumentSection.appendChild(instrumentGrid);
  var calibration = document.createElement("button");
  calibration.type = "button";
  calibration.className = "learning-secondary-action";
  calibration.innerText = state.calibrated ? "力传感器已调零" : "给力传感器调零";
  calibration.onclick = function () {
    if (state.instruments.indexOf("forceSensor") < 0) return;
    state.calibrated = true;
    calibration.innerText = "力传感器已调零";
    saveVirtualExperimentState(problem, state);
    renderVirtualExperimentReadiness();
  };
  instrumentSection.appendChild(calibration);
  var readiness = document.createElement("p");
  readiness.className = "virtual-lab-readiness";
  instrumentSection.appendChild(readiness);
  block.appendChild(instrumentSection);

  var controlSection = document.createElement("section");
  controlSection.className = "virtual-lab-section";
  var controlTitle = document.createElement("h3");
  controlTitle.innerText = "2. 设置参数并采样";
  controlSection.appendChild(controlTitle);
  var controls = document.createElement("div");
  controls.className = "virtual-lab-controls";
  function addRangeControl(key, definition) {
    var label = document.createElement("label");
    var name = document.createElement("span");
    var value = document.createElement("strong");
    var input = document.createElement("input");
    input.type = "range";
    input.min = definition.min;
    input.max = definition.max;
    input.step = definition.step;
    input.value = state[key];
    function updateLabel() {
      value.innerText = Number(input.value).toFixed(definition.decimals) + " " + definition.unit;
    }
    name.innerText = definition.label;
    label.appendChild(name);
    label.appendChild(input);
    label.appendChild(value);
    controls.appendChild(label);
    updateLabel();
    input.oninput = function () {
      state[key] = Number(input.value);
      updateLabel();
      if (key !== "period" && state.samples.length) {
        state.samples = [];
        state.fit = null;
        renderVirtualExperimentTable();
        renderVirtualExperimentFit();
      }
      saveVirtualExperimentState(problem, state);
    };
  }
  addRangeControl("mass", experiment.controls.mass);
  addRangeControl("radius", experiment.controls.radius);
  addRangeControl("period", experiment.controls.period);
  controlSection.appendChild(controls);
  var sampleAction = document.createElement("button");
  sampleAction.type = "button";
  sampleAction.className = "learning-primary-action";
  sampleAction.innerText = "采集一组数据";
  sampleAction.onclick = function () {
    if (!virtualExperimentReady(experiment, state)) return;
    var ideal = 4 * Math.PI * Math.PI * state.mass * state.radius / (state.period * state.period);
    var noise = virtualExperimentNoise(problem.id, state.samples.length, state.period);
    var measured = Math.max(0, ideal * (1 + noise * experiment.noise.relative));
    state.samples.push({
      period: state.period,
      inversePeriodSquared: 1 / (state.period * state.period),
      force: measured
    });
    state.fit = null;
    saveVirtualExperimentState(problem, state);
    renderVirtualExperimentTable();
    renderVirtualExperimentFit();
  };
  controlSection.appendChild(sampleAction);
  var tableWrap = document.createElement("div");
  tableWrap.className = "virtual-lab-table-wrap";
  controlSection.appendChild(tableWrap);
  block.appendChild(controlSection);

  var fitSection = document.createElement("section");
  fitSection.className = "virtual-lab-section";
  var fitTitle = document.createElement("h3");
  fitTitle.innerText = "3. 选择横坐标并拟合";
  fitSection.appendChild(fitTitle);
  var fitControls = document.createElement("div");
  fitControls.className = "virtual-lab-fit-controls";
  var fitSelect = document.createElement("select");
  [
    ["period", "T"],
    ["periodSquared", "T²"],
    ["inversePeriodSquared", "1/T²"]
  ].forEach(function (optionData) {
    var option = document.createElement("option");
    option.value = optionData[0];
    option.innerText = optionData[1];
    option.selected = state.fitX === optionData[0];
    fitSelect.appendChild(option);
  });
  var fitButton = document.createElement("button");
  fitButton.type = "button";
  fitButton.className = "learning-secondary-action";
  fitButton.innerText = "线性拟合";
  fitButton.onclick = function () {
    state.fitX = fitSelect.value;
    state.fit = virtualExperimentFit(state.samples, state.fitX);
    saveVirtualExperimentState(problem, state);
    renderVirtualExperimentFit();
  };
  fitControls.appendChild(fitSelect);
  fitControls.appendChild(fitButton);
  fitSection.appendChild(fitControls);
  var fitResult = document.createElement("p");
  fitResult.className = "virtual-lab-fit-result";
  fitSection.appendChild(fitResult);
  var canvas = document.createElement("canvas");
  canvas.className = "virtual-lab-fit-canvas";
  canvas.width = 680;
  canvas.height = 280;
  fitSection.appendChild(canvas);
  block.appendChild(fitSection);

  var conclusionSection = document.createElement("section");
  conclusionSection.className = "virtual-lab-section";
  var conclusionTitle = document.createElement("h3");
  conclusionTitle.innerText = "4. 写出结论";
  conclusionSection.appendChild(conclusionTitle);
  var conclusion = document.createElement("textarea");
  conclusion.rows = 4;
  conclusion.placeholder = "说明图线关系、斜率的物理意义、误差来源，以及数据是否支持理论关系。";
  conclusion.value = state.conclusion || "";
  conclusion.oninput = function () {
    state.conclusion = conclusion.value;
    saveVirtualExperimentState(problem, state);
    renderVirtualExperimentScore();
  };
  conclusionSection.appendChild(conclusion);
  var score = document.createElement("p");
  score.className = "virtual-lab-score";
  conclusionSection.appendChild(score);
  block.appendChild(conclusionSection);

  function virtualExperimentReady(definition, currentState) {
    return definition.requiredInstruments.every(function (id) {
      return currentState.instruments.indexOf(id) >= 0;
    }) && currentState.calibrated;
  }

  function renderVirtualExperimentReadiness() {
    var missing = experiment.requiredInstruments.filter(function (id) {
      return state.instruments.indexOf(id) < 0;
    });
    calibration.disabled = state.instruments.indexOf("forceSensor") < 0;
    sampleAction.disabled = !virtualExperimentReady(experiment, state);
    var extras = state.instruments.filter(function (id) {
      return experiment.requiredInstruments.indexOf(id) < 0;
    });
    readiness.innerText = missing.length
      ? "还缺少必要仪器：" + missing.map(function (id) {
        return experiment.instruments.find(function (item) { return item.id === id; }).label;
      }).join("、")
      : (
        state.calibrated
          ? "仪器与校准完成，可以采样。" + (extras.length ? " 注意：有无关仪器未排除。" : "")
          : "仪器已选好，请先给力传感器调零。"
      );
  }

  function renderVirtualExperimentTable() {
    tableWrap.replaceChildren();
    if (!state.samples.length) {
      var empty = document.createElement("p");
      empty.innerText = "至少改变周期并采集 5 组数据。改变质量或半径会开始一组新实验。";
      tableWrap.appendChild(empty);
      return;
    }
    var table = document.createElement("table");
    table.innerHTML = "<thead><tr><th>序号</th><th>T / s</th><th>1/T² / s⁻²</th><th>F / N</th></tr></thead>";
    var body = document.createElement("tbody");
    state.samples.forEach(function (sample, index) {
      var row = document.createElement("tr");
      [
        index + 1,
        Number(sample.period).toFixed(2),
        Number(sample.inversePeriodSquared).toFixed(3),
        Number(sample.force).toFixed(3)
      ].forEach(function (value) {
        var cell = document.createElement("td");
        cell.innerText = value;
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
    table.appendChild(body);
    tableWrap.appendChild(table);
  }

  function renderVirtualExperimentFit() {
    var fit = state.fit;
    if (!fit || !fit.points) {
      fitResult.innerText = state.samples.length < 3
        ? "至少采集 3 组数据后才能拟合。"
        : "请选择横坐标并进行线性拟合。";
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      renderVirtualExperimentScore();
      return;
    }
    fitResult.innerText = "F = " + Number(fit.slope).toFixed(3) + "x " +
      (fit.intercept >= 0 ? "+ " : "- ") + Math.abs(Number(fit.intercept)).toFixed(3) +
      "，R² = " + Number(fit.rSquared).toFixed(4);
    drawVirtualExperimentFit(canvas, fit);
    renderVirtualExperimentScore();
  }

  function renderVirtualExperimentScore() {
    var points = 0;
    var hasRequired = experiment.requiredInstruments.every(function (id) {
      return state.instruments.indexOf(id) >= 0;
    });
    var hasExtras = state.instruments.some(function (id) {
      return experiment.requiredInstruments.indexOf(id) < 0;
    });
    if (hasRequired) points += hasExtras ? 10 : 20;
    if (state.calibrated) points += 15;
    if (state.samples.length >= 5) points += 20;
    if (state.fitX === "inversePeriodSquared" && state.fit) points += 20;
    if (state.fit && Number(state.fit.rSquared) >= 0.98) points += 10;
    if ((state.conclusion || "").trim().length >= 30) points += 15;
    score.innerText = "实验完成度：" + points + " / 100";
  }

  renderVirtualExperimentReadiness();
  renderVirtualExperimentTable();
  renderVirtualExperimentFit();
  renderVirtualExperimentScore();
  return block;
}
