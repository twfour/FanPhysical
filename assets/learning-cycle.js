// Prediction, misconception diagnosis, and spaced-review learning loop.
var learningCycleStorageKey = "fanphysics:learningCycle:v1";
var learningCycleDefaultIntervals = [1, 3, 7, 14, 30];
var learningCycleDayMilliseconds = 24 * 60 * 60 * 1000;

function getLearningCycleRecordKey(sceneName) {
  return String(sceneName || "") + ":cycle";
}

function parseLearningCycleValue(value) {
  try {
    var parsed = JSON.parse(String(value || "{}"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function getLearningCycleState(sceneName) {
  var value = getLearningResponse(learningCycleStorageKey, getLearningCycleRecordKey(sceneName));
  return parseLearningCycleValue(value);
}

function saveLearningCycleState(problem, state) {
  if (!problem || !problem.id) return;
  state.version = 1;
  state.problemId = problem.id;
  state.title = problem.title || problem.id;
  state.chapter = problem.chapter || "未分类";
  state.updatedAt = Date.now();
  writeLearningResponse(
    learningCycleStorageKey,
    getLearningCycleRecordKey(problem.id),
    JSON.stringify(state)
  );
  renderLearningReviewHome();
}

function hasLearningCyclePrediction(problem) {
  return Boolean(
    problem &&
    problem.learningCycle &&
    problem.learningCycle.prediction &&
    Array.isArray(problem.learningCycle.prediction.options) &&
    problem.learningCycle.prediction.options.length
  );
}

function isLearningCyclePredictionComplete(sceneName) {
  var problem = problemDataMap[sceneName];
  if (!hasLearningCyclePrediction(problem)) return true;
  var state = getLearningCycleState(sceneName);
  return Boolean(state.prediction && state.prediction.answer);
}

function findLearningCycleOption(definition, value) {
  var options = definition && Array.isArray(definition.options) ? definition.options : [];
  for (var index = 0; index < options.length; index += 1) {
    if (String(options[index].value) === String(value)) return options[index];
  }
  return null;
}

function learningCycleAnswerIsCorrect(definition, value) {
  return String(value || "") === String((definition && definition.answer) || "");
}

function formatLearningCycleDate(timestamp) {
  var date = new Date(Number(timestamp || 0));
  if (!Number.isFinite(date.getTime())) return "待安排";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric"
  }).format(date);
}

function createLearningCycleChoiceList(definition, name, selectedValue) {
  var fieldset = document.createElement("fieldset");
  fieldset.className = "learning-cycle-choices";
  fieldset.setAttribute("aria-label", definition.prompt || definition.title || "选择你的判断");
  (definition.options || []).forEach(function (option) {
    var label = document.createElement("label");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = option.value;
    input.checked = String(selectedValue || "") === String(option.value);
    var marker = document.createElement("strong");
    marker.innerText = String(option.value) + ".";
    var text = document.createElement("span");
    text.innerHTML = markdownLiteInlineToHtml(option.text || "");
    label.appendChild(input);
    label.appendChild(marker);
    label.appendChild(text);
    fieldset.appendChild(label);
  });
  return fieldset;
}

function setLearningCycleChoicesDisabled(fieldset, disabled) {
  if (!fieldset) return;
  fieldset.querySelectorAll("input").forEach(function (input) {
    input.disabled = Boolean(disabled);
  });
}

function selectedLearningCycleChoice(fieldset) {
  var input = fieldset && fieldset.querySelector('input[type="radio"]:checked');
  return input ? input.value : "";
}

function renderLearningCyclePredictionFeedback(problem, block) {
  var definition = problem.learningCycle.prediction;
  var state = getLearningCycleState(problem.id);
  var feedback = block && block.querySelector(".learning-cycle-prediction-feedback");
  if (!feedback) return;
  feedback.replaceChildren();
  feedback.hidden = !state.animationCompletedAt;
  if (!state.animationCompletedAt || !state.prediction) return;

  var selected = findLearningCycleOption(definition, state.prediction.answer);
  var correct = learningCycleAnswerIsCorrect(definition, state.prediction.answer);
  feedback.className = "learning-cycle-prediction-feedback " + (correct ? "is-correct" : "is-misconception");
  var heading = document.createElement("div");
  heading.className = "learning-cycle-feedback-heading";
  var title = document.createElement("strong");
  title.innerText = correct ? "预测正确" : "发现一个可修正的误区";
  heading.appendChild(title);
  if (!correct && selected && selected.diagnosis && selected.diagnosis.tag) {
    var tag = document.createElement("span");
    tag.innerText = selected.diagnosis.tag;
    heading.appendChild(tag);
  }
  feedback.appendChild(heading);

  var comparison = document.createElement("p");
  comparison.className = "learning-cycle-comparison";
  comparison.innerText = "你原先选择了 " + state.prediction.answer + "，动画已经完整播放。";
  feedback.appendChild(comparison);

  var explanation = correct
    ? definition.explanation
    : selected && selected.diagnosis && selected.diagnosis.feedback;
  if (explanation) appendMarkdownChildren(feedback, explanation);

  if (!correct && selected && selected.diagnosis && selected.diagnosis.prompt) {
    var repair = document.createElement("section");
    repair.className = "learning-cycle-repair";
    var repairTitle = document.createElement("strong");
    repairTitle.innerText = "修正说明";
    var repairPrompt = document.createElement("p");
    repairPrompt.innerText = selected.diagnosis.prompt;
    var textarea = createLearningTextarea("误区修正说明", state.misconceptionResponse || "");
    textarea.placeholder = "不用重复完整计算，写清关键物理量或公式关系。";
    var save = document.createElement("button");
    save.type = "button";
    save.className = "learning-primary-action";
    save.innerText = state.misconceptionResponse ? "更新修正说明" : "保存修正说明";
    save.disabled = !textarea.value.trim();
    var status = document.createElement("span");
    status.className = "learning-save-status";
    if (state.misconceptionResponse) status.innerText = "已记录";
    textarea.oninput = function () {
      save.disabled = !textarea.value.trim();
      status.innerText = "";
    };
    save.onclick = function () {
      var nextState = getLearningCycleState(problem.id);
      nextState.misconceptionResponse = textarea.value.trim();
      nextState.misconceptionTag = selected.diagnosis.tag || "";
      nextState.misconceptionUpdatedAt = Date.now();
      saveLearningCycleState(problem, nextState);
      save.innerText = "更新修正说明";
      status.innerText = learningSyncAuthenticated ? "已保存并加入同步队列" : "已保存在当前浏览器";
    };
    var actions = document.createElement("div");
    actions.className = "learning-response-actions";
    actions.appendChild(save);
    actions.appendChild(status);
    repair.appendChild(repairTitle);
    repair.appendChild(repairPrompt);
    repair.appendChild(textarea);
    repair.appendChild(actions);
    feedback.appendChild(repair);
  }
  renderMath(feedback);
}

function createLearningCyclePredictionBlock(problem) {
  if (!hasLearningCyclePrediction(problem)) return null;
  var definition = problem.learningCycle.prediction;
  var state = getLearningCycleState(problem.id);
  var savedPrediction = state.prediction || {};
  var block = createProblemNoteBlock(
    "先预测",
    definition.title || "播放动画前先作判断",
    definition.prompt || "先写下判断，再用动画检验。"
  );
  block.classList.add("learning-cycle-prediction-block");
  block.dataset.keepExpanded = "1";
  block.dataset.scene = problem.id;

  var hint = document.createElement("p");
  hint.className = "learning-cycle-hint";
  hint.innerText = "提交后解锁动画；完整播放一次后再显示对照与误区诊断。";
  block.appendChild(hint);

  var choices = createLearningCycleChoiceList(
    definition,
    "learning-cycle-prediction-" + problem.id,
    savedPrediction.answer
  );
  block.appendChild(choices);

  var confidence = document.createElement("fieldset");
  confidence.className = "learning-cycle-confidence";
  var confidenceLegend = document.createElement("legend");
  confidenceLegend.innerText = "作答信心";
  confidence.appendChild(confidenceLegend);
  ["不确定", "比较确定", "很确定"].forEach(function (labelText, index) {
    var label = document.createElement("label");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "learning-cycle-confidence-" + problem.id;
    input.value = String(index + 1);
    input.checked = Number(savedPrediction.confidence || 0) === index + 1;
    var text = document.createElement("span");
    text.innerText = labelText;
    label.appendChild(input);
    label.appendChild(text);
    confidence.appendChild(label);
  });
  block.appendChild(confidence);

  var actions = document.createElement("div");
  actions.className = "learning-response-actions";
  var submit = document.createElement("button");
  submit.type = "button";
  submit.className = "learning-primary-action";
  submit.innerText = "提交预测并解锁动画";
  var retry = document.createElement("button");
  retry.type = "button";
  retry.className = "learning-secondary-action";
  retry.innerText = "重新预测";
  var status = document.createElement("span");
  status.className = "learning-cycle-status";
  status.setAttribute("aria-live", "polite");
  actions.appendChild(submit);
  actions.appendChild(retry);
  actions.appendChild(status);
  block.appendChild(actions);

  var feedback = document.createElement("div");
  feedback.className = "learning-cycle-prediction-feedback";
  feedback.hidden = true;
  block.appendChild(feedback);

  function syncPredictionControls() {
    var latest = getLearningCycleState(problem.id);
    var submitted = Boolean(latest.prediction && latest.prediction.answer);
    setLearningCycleChoicesDisabled(choices, submitted);
    confidence.querySelectorAll("input").forEach(function (input) {
      input.disabled = submitted;
    });
    submit.hidden = submitted;
    retry.hidden = !submitted;
    status.innerText = submitted
      ? (latest.animationCompletedAt ? "已完成动画检验" : "预测已记录，请回到上方播放动画")
      : "";
    renderLearningCyclePredictionFeedback(problem, block);
  }

  choices.addEventListener("change", function () {
    submit.disabled = !selectedLearningCycleChoice(choices);
  });
  submit.disabled = !selectedLearningCycleChoice(choices);
  submit.onclick = function () {
    var answer = selectedLearningCycleChoice(choices);
    if (!answer) return;
    var confidenceInput = confidence.querySelector('input[type="radio"]:checked');
    var nextState = getLearningCycleState(problem.id);
    nextState.prediction = {
      answer: answer,
      confidence: confidenceInput ? Number(confidenceInput.value) : 0,
      submittedAt: Date.now()
    };
    delete nextState.animationCompletedAt;
    delete nextState.misconceptionResponse;
    delete nextState.misconceptionTag;
    saveLearningCycleState(problem, nextState);
    var animationState = getJsonAnimationState(problem.id);
    animationState.time = 0;
    animationState.playing = false;
    renderJsonAnimationControls(problem.id);
    syncCanvasLoop();
    syncPredictionControls();
    var controls = document.getElementById("jsonAnimationControls");
    if (controls && controls.scrollIntoView) controls.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  retry.onclick = function () {
    var nextState = getLearningCycleState(problem.id);
    delete nextState.prediction;
    delete nextState.animationCompletedAt;
    delete nextState.misconceptionResponse;
    delete nextState.misconceptionTag;
    saveLearningCycleState(problem, nextState);
    choices.querySelectorAll("input").forEach(function (input) { input.checked = false; });
    confidence.querySelectorAll("input").forEach(function (input) { input.checked = false; });
    submit.disabled = true;
    renderJsonAnimationControls(problem.id);
    syncCanvasLoop();
    syncPredictionControls();
  };
  syncPredictionControls();
  return block;
}

function ensureLearningCycleCanvasOverlay() {
  var holder = document.getElementById("canvas-holder");
  if (!holder) return null;
  var overlay = document.getElementById("learningCycleCanvasGate");
  if (overlay) return overlay;
  overlay = document.createElement("div");
  overlay.id = "learningCycleCanvasGate";
  overlay.className = "learning-cycle-canvas-gate";
  overlay.setAttribute("role", "status");
  var eyebrow = document.createElement("span");
  eyebrow.innerText = "先预测，再观察";
  var title = document.createElement("strong");
  title.innerText = "提交下方预测后解锁动画与图表";
  var copy = document.createElement("p");
  copy.innerText = "先用已有知识作判断，不要求第一次就答对。";
  var action = document.createElement("button");
  action.type = "button";
  action.className = "learning-primary-action";
  action.innerText = "前往预测";
  action.onclick = function () {
    var block = document.querySelector(".learning-cycle-prediction-block");
    if (block && block.scrollIntoView) block.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  overlay.appendChild(eyebrow);
  overlay.appendChild(title);
  overlay.appendChild(copy);
  overlay.appendChild(action);
  holder.appendChild(overlay);
  return overlay;
}

function applyAnimationPredictionGate(sceneName) {
  var holder = document.getElementById("canvas-holder");
  var controls = document.getElementById("jsonAnimationControls");
  if (!holder) return;
  var problem = problemDataMap[sceneName];
  var locked = Boolean(hasLearningCyclePrediction(problem) && !isLearningCyclePredictionComplete(sceneName));
  var overlay = ensureLearningCycleCanvasOverlay();
  holder.classList.toggle("is-prediction-locked", locked);
  if (overlay) overlay.hidden = !locked;
  if (controls) {
    controls.classList.toggle("is-prediction-locked", locked);
    controls.querySelectorAll("input, select").forEach(function (input) {
      input.disabled = locked;
    });
    var play = controls.querySelector("#jsonAnimPlayBtn");
    if (play) {
      play.disabled = locked;
      play.innerText = locked ? "先完成预测" : (getJsonAnimationState(sceneName).playing ? "暂停" : "播放");
    }
  }
}

function scheduleInitialLearningCycleReview(problem, state) {
  if (!problem.learningCycle || !problem.learningCycle.review || state.review) return;
  var intervals = learningCycleReviewIntervals(problem);
  state.review = {
    intervalIndex: 0,
    dueAt: Date.now() + intervals[0] * learningCycleDayMilliseconds,
    history: []
  };
}

function completeLearningCycleAnimation(sceneName) {
  var problem = problemDataMap[sceneName];
  if (!hasLearningCyclePrediction(problem)) return;
  var state = getLearningCycleState(sceneName);
  if (!state.prediction || !state.prediction.answer) return;
  if (!state.animationCompletedAt) {
    state.animationCompletedAt = Date.now();
    state.prediction.correct = learningCycleAnswerIsCorrect(problem.learningCycle.prediction, state.prediction.answer);
    scheduleInitialLearningCycleReview(problem, state);
    saveLearningCycleState(problem, state);
  }
  var block = document.querySelector('.learning-cycle-prediction-block[data-scene="' + sceneName + '"]');
  if (block) renderLearningCyclePredictionFeedback(problem, block);
  var status = block && block.querySelector(".learning-cycle-status");
  if (status) status.innerText = "已完成动画检验";
  refreshLearningCycleReviewBlock(problem);
}

function learningCycleReviewIntervals(problem) {
  var configured = problem && problem.learningCycle && problem.learningCycle.intervalDays;
  var intervals = Array.isArray(configured) ? configured : learningCycleDefaultIntervals;
  return intervals.map(function (item) {
    return Math.max(1, Number(item) || 1);
  });
}

function renderLearningCycleReviewBody(problem, block) {
  var definition = problem.learningCycle.review;
  var state = getLearningCycleState(problem.id);
  var host = block.querySelector(".learning-cycle-review-body");
  if (!host) return;
  host.replaceChildren();
  if (!state.animationCompletedAt || !state.review) {
    var locked = document.createElement("p");
    locked.className = "learning-cycle-review-locked";
    locked.innerText = "完成播放前预测和一次完整动画观察后，将自动安排第一次复习。";
    host.appendChild(locked);
    return;
  }

  var due = Number(state.review.dueAt || 0) <= Date.now();
  var schedule = document.createElement("p");
  schedule.className = "learning-cycle-review-schedule";
  schedule.innerText = due
    ? "本题已到复习时间。请先独立判断，再查看反馈。"
    : "下次复习：" + formatLearningCycleDate(state.review.dueAt) + "。现在也可以提前检索一次。";
  host.appendChild(schedule);
  var prompt = document.createElement("div");
  prompt.className = "learning-cycle-review-prompt";
  appendMarkdownChildren(prompt, definition.prompt || "请选择正确判断。");
  host.appendChild(prompt);

  var choices = createLearningCycleChoiceList(
    definition,
    "learning-cycle-review-" + problem.id + "-" + Date.now(),
    ""
  );
  host.appendChild(choices);
  var actions = document.createElement("div");
  actions.className = "learning-response-actions";
  var submit = document.createElement("button");
  submit.type = "button";
  submit.className = "learning-primary-action";
  submit.innerText = due ? "提交本次复习" : "提前复习";
  submit.disabled = true;
  actions.appendChild(submit);
  host.appendChild(actions);
  var feedback = document.createElement("div");
  feedback.className = "learning-cycle-review-feedback";
  feedback.hidden = true;
  host.appendChild(feedback);
  choices.addEventListener("change", function () {
    submit.disabled = !selectedLearningCycleChoice(choices);
  });
  submit.onclick = function () {
    var answer = selectedLearningCycleChoice(choices);
    if (!answer) return;
    var correct = learningCycleAnswerIsCorrect(definition, answer);
    var selected = findLearningCycleOption(definition, answer);
    var nextState = getLearningCycleState(problem.id);
    var review = nextState.review || { intervalIndex: 0, history: [] };
    var intervals = learningCycleReviewIntervals(problem);
    var nextIndex = correct
      ? Math.min(intervals.length - 1, Number(review.intervalIndex || 0) + 1)
      : 0;
    review.history = Array.isArray(review.history) ? review.history.slice(-9) : [];
    review.history.push({ answer: answer, correct: correct, reviewedAt: Date.now() });
    review.intervalIndex = nextIndex;
    review.lastAnswer = answer;
    review.lastCorrect = correct;
    review.lastReviewedAt = Date.now();
    review.dueAt = Date.now() + intervals[nextIndex] * learningCycleDayMilliseconds;
    nextState.review = review;
    saveLearningCycleState(problem, nextState);
    setLearningCycleChoicesDisabled(choices, true);
    submit.disabled = true;
    feedback.hidden = false;
    feedback.className = "learning-cycle-review-feedback " + (correct ? "is-correct" : "is-misconception");
    var content = correct
      ? "**回答正确**\n\n" + (definition.explanation || "已经正确调用本题物理关系。")
      : "**需要再辨析**\n\n" + (
        selected && selected.diagnosis && selected.diagnosis.feedback
          ? selected.diagnosis.feedback
          : definition.explanation || "请重新检查所用物理关系。"
      );
    appendMarkdownChildren(feedback, content + "\n\n下一次复习安排在 " + formatLearningCycleDate(review.dueAt) + "。");
    renderMath(feedback);
  };
}

function createLearningCycleReviewBlock(problem) {
  if (!problem || !problem.learningCycle || !problem.learningCycle.review) return null;
  var definition = problem.learningCycle.review;
  var block = createProblemNoteBlock(
    "延时复习",
    definition.title || "换一种表达再判断",
    ""
  );
  block.classList.add("learning-cycle-review-block");
  block.dataset.scene = problem.id;
  var body = document.createElement("div");
  body.className = "learning-cycle-review-body";
  block.appendChild(body);
  renderLearningCycleReviewBody(problem, block);
  return block;
}

function refreshLearningCycleReviewBlock(problem) {
  if (!problem) return;
  var block = document.querySelector('.learning-cycle-review-block[data-scene="' + problem.id + '"]');
  if (block) renderLearningCycleReviewBody(problem, block);
}

function readAllLearningCycleStates() {
  var store = normalizeLearningStore(
    learningCycleStorageKey,
    readLearningResponseStore(learningCycleStorageKey)
  );
  return Object.keys(store).map(function (key) {
    var record = store[key];
    return record && !record.deleted ? parseLearningCycleValue(record.value) : null;
  }).filter(Boolean);
}

function openLearningCycleReview(sceneName) {
  switchScene(sceneName).then(function () {
    var problem = problemDataMap[sceneName];
    if (problem) refreshLearningCycleReviewBlock(problem);
    var block = document.querySelector('.learning-cycle-review-block[data-scene="' + sceneName + '"]');
    if (block && block.scrollIntoView) block.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderLearningReviewHome() {
  var host = document.getElementById("learningReviewGrid");
  var count = document.getElementById("learningReviewCount");
  if (!host) return;
  host.replaceChildren();
  var states = readAllLearningCycleStates().filter(function (state) {
    return Boolean(state.problemId && state.review && state.review.dueAt);
  }).sort(function (a, b) {
    return Number(a.review.dueAt) - Number(b.review.dueAt);
  });
  var dueStates = states.filter(function (state) {
    return Number(state.review.dueAt) <= Date.now();
  });
  if (count) count.innerText = dueStates.length ? dueStates.length + " 项到期" : "今天无到期任务";
  if (!dueStates.length) {
    var empty = document.createElement("p");
    empty.className = "learning-review-empty";
    empty.innerText = states.length
      ? "下一次复习在 " + formatLearningCycleDate(states[0].review.dueAt) + "。间隔后再回忆，比连续重看更能检验是否真正掌握。"
      : "完成机械能守恒定律课1或课2的预测与动画后，这里会自动生成复习任务。";
    host.appendChild(empty);
    return;
  }
  dueStates.slice(0, 6).forEach(function (state) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "home-card learning-review-card";
    card.onclick = function () {
      openLearningCycleReview(state.problemId);
    };
    var badge = document.createElement("span");
    badge.className = "learning-review-badge";
    badge.innerText = "到期复习";
    var title = document.createElement("strong");
    title.innerText = state.title || "复习模型题";
    var meta = document.createElement("span");
    meta.innerText = (state.chapter || "物理") + " · 上次复习 " + (
      state.review.lastReviewedAt ? formatLearningCycleDate(state.review.lastReviewedAt) : "尚未开始"
    );
    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(meta);
    host.appendChild(card);
  });
}
