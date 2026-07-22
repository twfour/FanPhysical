// Interactive exploration and real-life transfer blocks rendered below each problem.
function createLearningTextarea(label, value) {
  var textarea = document.createElement("textarea");
  textarea.className = "learning-response-input";
  textarea.rows = 3;
  textarea.value = value || "";
  textarea.placeholder = "先写下你的判断或理由，再查看检验。";
  textarea.setAttribute("aria-label", label);
  return textarea;
}

function canVerifyStudentStageWithAnimation(problem) {
  var animation = (problem && problem.animation) || {};
  return animation.enabled !== false && animation.type && animation.type !== "none";
}

function applyStudentExplorationAnimation(problem, stage, status) {
  if (!problem || currentScene !== problem.id || !canVerifyStudentStageWithAnimation(problem)) {
    return;
  }
  var animation = problem.animation || {};
  var preset = stage && stage.animationPreset && typeof stage.animationPreset === "object"
    ? stage.animationPreset
    : {};
  var values = preset.params && typeof preset.params === "object" ? preset.params : {};
  var state = getJsonAnimationState(problem.id);
  Object.keys(values).forEach(function (key) {
    var definition = (animation.params || {})[key];
    var nextValue = Number(values[key]);
    if (!definition || !Number.isFinite(nextValue)) {
      return;
    }
    var minValue = Number(definition.min);
    var maxValue = Number(definition.max);
    if (Number.isFinite(minValue)) nextValue = Math.max(minValue, nextValue);
    if (Number.isFinite(maxValue)) nextValue = Math.min(maxValue, nextValue);
    state.values[key] = nextValue;
  });
  var duration = getJsonDuration(problem.id);
  if (Number.isFinite(Number(preset.time))) {
    state.time = Math.max(0, Math.min(duration, Number(preset.time)));
  } else if (Number.isFinite(Number(preset.progress))) {
    state.time = Math.max(0, Math.min(duration, Number(preset.progress) * duration));
  } else {
    state.time = 0;
  }
  state.playing = animation.playable !== false && preset.play !== false;
  renderJsonAnimationControls(problem.id);
  syncJsonTimeControl(problem.id);
  if (isPhysicsSoundScene(problem.id)) {
    if (state.playing && physicsSoundEnabled) {
      beginPhysicsSoundPlayback(problem.id, duration > 0 ? state.time / duration : 0);
    } else {
      pausePhysicsSoundPlayback();
    }
  }
  syncCanvasLoop();
  var target = document.getElementById("jsonAnimationControls") || document.getElementById("canvas-holder");
  if (target && target.scrollIntoView) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (status) {
    status.innerText = preset.caption || "已切换到验证状态，请观察动画和右侧图表。";
  }
}

function createStudentExplorationBlock(problem) {
  var exploration = problem && problem.studentExploration;
  var stages = exploration && Array.isArray(exploration.stages) ? exploration.stages : [];
  if (!stages.length) {
    return null;
  }
  var block = createProblemNoteBlock("初学者探索", exploration.title || "如果我第一次遇到这道题", exploration.opening || "");
  block.classList.add("student-exploration-block");
  block.dataset.defaultExpanded = "1";
  stages.forEach(function (stage, index) {
    var responseKey = problem.id + ":stage:" + index;
    var savedResponse = getLearningResponse(studentExplorationStorageKey, responseKey);
    var stageCard = document.createElement("section");
    stageCard.className = "exploration-stage-card";

    var heading = document.createElement("h3");
    heading.className = "exploration-stage-title";
    heading.innerText = (index + 1) + "．" + (stage.title || "继续探索");
    stageCard.appendChild(heading);

    var prompt = document.createElement("p");
    prompt.className = "exploration-stage-prompt";
    prompt.innerText = stage.prompt || "面对这个判断，先写下你的结论和理由。";
    stageCard.appendChild(prompt);

    var textarea = createLearningTextarea((stage.title || "探索阶段") + "的回答", savedResponse);
    stageCard.appendChild(textarea);

    var actions = document.createElement("div");
    actions.className = "learning-response-actions";
    var revealButton = document.createElement("button");
    revealButton.type = "button";
    revealButton.className = "learning-primary-action";
    revealButton.innerText = savedResponse ? "更新回答并查看检验" : "提交并查看检验";
    revealButton.disabled = !savedResponse.trim();
    var resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "learning-secondary-action";
    resetButton.innerText = "重新作答";
    resetButton.hidden = !savedResponse;
    actions.appendChild(revealButton);
    actions.appendChild(resetButton);
    stageCard.appendChild(actions);

    var feedback = document.createElement("div");
    feedback.className = "exploration-feedback";
    feedback.hidden = !savedResponse;
    var content = [];
    if (stage.thought) content.push("**典型初始想法**", stage.thought);
    if (stage.check) content.push("**检查这个想法**", stage.check);
    if (stage.correction) content.push("**修正之后**", stage.correction);
    if (stage.takeaway) content.push("**留下的方法**", stage.takeaway);
    appendMarkdownChildren(feedback, content.join("\n\n"));

    var verifyStatus = document.createElement("p");
    verifyStatus.className = "animation-verify-status";
    verifyStatus.setAttribute("aria-live", "polite");
    if (canVerifyStudentStageWithAnimation(problem)) {
      var verifyButton = document.createElement("button");
      verifyButton.type = "button";
      verifyButton.className = "animation-verify-action";
      verifyButton.innerText = "在动画中验证";
      verifyButton.onclick = function () {
        applyStudentExplorationAnimation(problem, stage, verifyStatus);
      };
      feedback.appendChild(verifyButton);
      feedback.appendChild(verifyStatus);
    }
    stageCard.appendChild(feedback);

    textarea.oninput = function () {
      revealButton.disabled = !textarea.value.trim();
    };
    revealButton.onclick = function () {
      var answer = textarea.value.trim();
      if (!answer) {
        textarea.focus();
        return;
      }
      writeLearningResponse(studentExplorationStorageKey, responseKey, answer);
      feedback.hidden = false;
      resetButton.hidden = false;
      revealButton.innerText = "更新回答并查看检验";
      renderMath(feedback);
    };
    resetButton.onclick = function () {
      writeLearningResponse(studentExplorationStorageKey, responseKey, "");
      textarea.value = "";
      feedback.hidden = true;
      resetButton.hidden = true;
      revealButton.disabled = true;
      revealButton.innerText = "提交并查看检验";
      textarea.focus();
    };
    block.appendChild(stageCard);
  });
  return block;
}

function createRealLifeLinkSection(links, settings) {
  var config = settings || {};
  var items = Array.isArray(links) ? links.filter(function (item) {
    return Boolean(item && item.title && item.url && /^https:\/\//i.test(item.url));
  }).slice(0, config.limit || 3) : [];
  if (!items.length) {
    return null;
  }

  var section = document.createElement("section");
  section.className = "real-life-videos";
  if (config.sectionClass) {
    section.classList.add(config.sectionClass);
  }
  if (!config.hideHeading) {
    var heading = document.createElement("div");
    heading.className = "real-life-videos-heading";
    var headingTitle = document.createElement("h3");
    headingTitle.innerText = config.title || "延伸资源";
    var hint = document.createElement("p");
    hint.innerText = config.hint || "打开资源后，回到原题核对物理量与约束。";
    heading.appendChild(headingTitle);
    heading.appendChild(hint);
    section.appendChild(heading);
  }

  var grid = document.createElement("div");
  grid.className = "real-life-video-grid";
  items.forEach(function (item) {
    var link = document.createElement("a");
    link.className = "real-life-video-card";
    if (config.cardClass) {
      link.classList.add(config.cardClass);
    }
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    var platformName = String(item.platform || config.fallbackPlatform || "外部资源");
    if (/bilibili|哔哩/i.test(platformName)) {
      link.classList.add("is-bilibili");
    } else if (/youtube/i.test(platformName)) {
      link.classList.add("is-youtube");
    }
    link.setAttribute("aria-label", "打开" + platformName + "：" + item.title);

    var meta = document.createElement("div");
    meta.className = "real-life-video-meta";
    var platform = document.createElement("span");
    platform.className = "real-life-video-platform";
    platform.innerText = platformName;
    meta.appendChild(platform);
    var metaValue = config.metaField ? item[config.metaField] : item.duration;
    if (metaValue) {
      var metaDetail = document.createElement("span");
      metaDetail.className = "real-life-video-duration";
      metaDetail.innerText = String(metaValue);
      meta.appendChild(metaDetail);
    }
    link.appendChild(meta);

    var videoTitle = document.createElement("strong");
    videoTitle.className = "real-life-video-title";
    videoTitle.innerText = item.title;
    link.appendChild(videoTitle);

    var focusText = config.focusField ? item[config.focusField] : item.watchFor;
    if (focusText) {
      var watchFor = document.createElement("p");
      watchFor.className = "real-life-video-watch";
      var watchLabel = document.createElement("b");
      watchLabel.innerText = config.focusLabel || "观看重点";
      var watchText = document.createElement("span");
      watchText.innerText = focusText;
      watchFor.appendChild(watchLabel);
      watchFor.appendChild(watchText);
      link.appendChild(watchFor);
    }

    if (item.matchReason) {
      var match = document.createElement("p");
      match.className = "real-life-video-match";
      match.innerText = (config.matchLabel || "同构关系") + "：" + item.matchReason;
      link.appendChild(match);
    }

    var action = document.createElement("span");
    action.className = "real-life-video-action";
    action.innerText = config.actionLabel || "打开资源";
    link.appendChild(action);
    grid.appendChild(link);
  });
  section.appendChild(grid);
  return section;
}

function createRealLifeVideoSection(videos) {
  return createRealLifeLinkSection(videos, {
    title: "对应视频",
    hint: "带着观看重点观察现实过程，再回到原题核对物理量与约束。",
    fallbackPlatform: "视频",
    focusLabel: "观看重点",
    actionLabel: "打开视频"
  });
}

function createAuthoritativeResourceSection(resources, hideHeading) {
  return createRealLifeLinkSection(resources, {
    title: "权威解释与交互",
    hint: "优先用大学、教材与专业教学机构的内容校准概念，再用原题检验理解。",
    fallbackPlatform: "权威资源",
    focusField: "useFor",
    focusLabel: "使用方式",
    metaField: "kind",
    matchLabel: "对应考点",
    actionLabel: "打开资源",
    sectionClass: "real-life-authoritative-resources",
    cardClass: "is-authoritative",
    hideHeading: hideHeading === true
  });
}

function createAuthoritativeResourcesBlock(problem) {
  var realLifeCase = problem && problem.realLifeCase;
  var section = createAuthoritativeResourceSection(
    realLifeCase && realLifeCase.authoritativeResources,
    true
  );
  if (!section) {
    return null;
  }
  var block = createProblemNoteBlock("学习资源", "权威解释与交互", "");
  block.classList.add("authoritative-resources-block");
  block.dataset.keepExpanded = "1";
  var intro = document.createElement("p");
  intro.className = "authoritative-resources-intro";
  intro.innerText = "优先用大学、教材与专业教学机构的内容校准概念，再用原题检验理解。";
  block.appendChild(intro);
  block.appendChild(section);
  return block;
}

function createRealLifeCaseBlock(problem) {
  var item = problem && problem.realLifeCase;
  if (!item || typeof item !== "object") {
    return null;
  }
  var parts = [];
  if (item.scene) {
    parts.push("**现实场景**", item.scene);
  }
  if (item.mapping) {
    parts.push("**题目与现实如何对应**", item.mapping);
  }
  if (item.sharedModel) {
    parts.push("**不变的物理模型**", item.sharedModel);
  }
  if (Array.isArray(item.realityFactors) && item.realityFactors.length) {
    parts.push("**现实中还要补上的因素**", item.realityFactors.map(function (factor) {
      return "- " + factor;
    }).join("\n"));
  }
  var block = createProblemNoteBlock("现实同构案例", item.title || "现实中的同一物理模型", parts.join("\n\n"));
  block.classList.add("real-life-case-block");
  block.dataset.defaultExpanded = "1";
  var videoSection = createRealLifeVideoSection(item.videos);
  if (videoSection) {
    block.appendChild(videoSection);
  }
  if (!item.question) {
    return block;
  }

  var transfer = document.createElement("section");
  transfer.className = "real-life-transfer";
  var transferTitle = document.createElement("h3");
  transferTitle.innerText = "带回原题想一想";
  transfer.appendChild(transferTitle);
  var question = document.createElement("div");
  question.className = "real-life-transfer-question";
  appendMarkdownChildren(question, item.question);
  transfer.appendChild(question);

  var responseKey = problem.id + ":real-life";
  var savedResponse = getLearningResponse(realLifeResponseStorageKey, responseKey);
  var rubric = Array.isArray(item.rubric) ? item.rubric.slice(0, 3) : [];
  var savedChecks = getLearningChecks(responseKey);
  var textarea = createLearningTextarea("现实同构迁移题回答", savedResponse);
  textarea.placeholder = "用物理量、约束或公式解释你的判断。";
  transfer.appendChild(textarea);

  var actions = document.createElement("div");
  actions.className = "learning-response-actions";
  var saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "learning-primary-action";
  saveButton.innerText = savedResponse ? "更新我的回答" : "保存我的回答";
  saveButton.disabled = !savedResponse.trim();
  var clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.className = "learning-secondary-action";
  clearButton.innerText = "清除回答";
  clearButton.hidden = !savedResponse;
  var saveStatus = document.createElement("span");
  saveStatus.className = "learning-save-status";
  saveStatus.setAttribute("aria-live", "polite");
  if (savedResponse) saveStatus.innerText = learningSyncAuthenticated ? "已保存并加入同步队列" : "已保存在当前浏览器";
  actions.appendChild(saveButton);
  actions.appendChild(clearButton);
  actions.appendChild(saveStatus);
  transfer.appendChild(actions);

  var answerDetails = document.createElement("details");
  answerDetails.className = "real-life-answer";
  var answerSummary = document.createElement("summary");
  answerSummary.innerText = "查看参考答案与评分要点";
  answerDetails.appendChild(answerSummary);
  var answerBody = document.createElement("div");
  answerBody.className = "real-life-answer-body";
  if (item.answer) {
    appendMarkdownChildren(answerBody, "**参考答案**\n\n" + item.answer);
  }
  if (rubric.length) {
    appendMarkdownChildren(answerBody, "**评分要点**\n\n" + rubric.map(function (point) {
      return "- " + point;
    }).join("\n"));
  }
  answerDetails.appendChild(answerBody);
  answerDetails.addEventListener("toggle", function () {
    if (answerDetails.open) renderMath(answerDetails);
  });
  transfer.appendChild(answerDetails);

  var selfCheck = null;
  var selfCheckScore = null;
  var selfCheckInputs = [];
  function updateSelfCheckScore(saveChange) {
    var checked = [];
    selfCheckInputs.forEach(function (input, index) {
      if (input.checked) checked.push(index);
    });
    if (selfCheckScore) selfCheckScore.innerText = "掌握 " + checked.length + " / " + rubric.length;
    if (saveChange) writeLearningChecks(responseKey, checked);
  }
  if (rubric.length) {
    selfCheck = document.createElement("section");
    selfCheck.className = "real-life-self-check";
    selfCheck.hidden = !savedResponse;
    var selfCheckHeading = document.createElement("div");
    selfCheckHeading.className = "real-life-self-check-heading";
    var selfCheckTitle = document.createElement("strong");
    selfCheckTitle.innerText = "三点评分";
    selfCheckScore = document.createElement("span");
    selfCheckHeading.appendChild(selfCheckTitle);
    selfCheckHeading.appendChild(selfCheckScore);
    selfCheck.appendChild(selfCheckHeading);
    var selfCheckHint = document.createElement("p");
    selfCheckHint.innerText = "先完成回答，再按是否明确写出以下要点进行自评。";
    selfCheck.appendChild(selfCheckHint);
    var selfCheckList = document.createElement("div");
    selfCheckList.className = "real-life-self-check-list";
    rubric.forEach(function (point, index) {
      var label = document.createElement("label");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = savedChecks.indexOf(index) >= 0;
      input.onchange = function () {
        updateSelfCheckScore(true);
      };
      var pointText = document.createElement("span");
      appendMarkdownChildren(pointText, point);
      label.appendChild(input);
      label.appendChild(pointText);
      selfCheckList.appendChild(label);
      selfCheckInputs.push(input);
    });
    selfCheck.appendChild(selfCheckList);
    updateSelfCheckScore(false);
    transfer.appendChild(selfCheck);
  }

  textarea.oninput = function () {
    saveButton.disabled = !textarea.value.trim();
    saveStatus.innerText = "";
  };
  saveButton.onclick = function () {
    var answer = textarea.value.trim();
    if (!answer) {
      textarea.focus();
      return;
    }
    writeLearningResponse(realLifeResponseStorageKey, responseKey, answer);
    saveButton.innerText = "更新我的回答";
    clearButton.hidden = false;
    if (selfCheck) selfCheck.hidden = false;
    saveStatus.innerText = learningSyncAuthenticated ? "已保存并加入同步队列" : "已保存在当前浏览器";
  };
  clearButton.onclick = function () {
    writeLearningResponse(realLifeResponseStorageKey, responseKey, "");
    if (selfCheckInputs.length) {
      selfCheckInputs.forEach(function (input) {
        input.checked = false;
      });
      writeLearningChecks(responseKey, []);
      updateSelfCheckScore(false);
    }
    textarea.value = "";
    saveButton.disabled = true;
    saveButton.innerText = "保存我的回答";
    clearButton.hidden = true;
    saveStatus.innerText = "回答已清除";
    if (selfCheck) selfCheck.hidden = true;
    textarea.focus();
  };
  block.appendChild(transfer);
  return block;
}
