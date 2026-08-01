// Problem content rendering for JSON-backed exercises.

function renderProblemDataNotes(problem) {
    if (!problem || !problem.id) {
      return null;
    }
    clearProblemNotesHost();
    var host = document.getElementById("problemNotesHost");
    if (!host) {
      return null;
    }
    var note = document.createElement("div");
    note.id = problem.id + "Notes";
    note.className = "problem-notes";
    host.appendChild(note);
    note.dataset.problemJson = "1";
    note.innerHTML = "";
    var grid = document.createElement("div");
    grid.className = "problem-notes-grid";
    note.appendChild(grid);

    var coreOnly = Boolean(problem.presentation && problem.presentation.coreOnly === true);
    if (problem.analysisPresentation && problem.analysisPresentation.hideStepConversation === true) {
      note.dataset.disableStepConversation = "1";
    }
    if (coreOnly) {
      grid.appendChild(createProblemQuestionBlock(problem));
      var coreAnalysisBlock = createProblemAnalysisBlock(problem);
      coreAnalysisBlock.dataset.analysisBlock = "1";
      if (problem.analysisPresentation && problem.analysisPresentation.defaultExpanded === true) {
        coreAnalysisBlock.dataset.defaultExpanded = "1";
      }
      grid.appendChild(coreAnalysisBlock);
      return note;
    }

    var authoritativeResourcesBlock = createAuthoritativeResourcesBlock(problem);
    var experimentBlock = typeof createVirtualExperimentBlock === "function"
      ? createVirtualExperimentBlock(problem)
      : null;
    var explorationBlock = createStudentExplorationBlock(problem);
    var realLifeBlock = createRealLifeCaseBlock(problem);
    var practiceBlock = createProblemPracticeBlock(problem);
    var notebookLmBlock = createProblemNotebookLmBlock(problem);
    if (explorationBlock || realLifeBlock || authoritativeResourcesBlock) {
      grid.appendChild(createProblemLearningStatusBar(problem));
    }
    grid.appendChild(createProblemQuestionBlock(problem));
    if (experimentBlock) {
      grid.appendChild(experimentBlock);
    }
    var taxonomyBlock = createProblemTaxonomyBlock(problem);
    if (taxonomyBlock) {
      grid.appendChild(taxonomyBlock);
    }
    var learningPathBlock = createProblemLearningPathBlock(problem);
    if (learningPathBlock) {
      grid.appendChild(learningPathBlock);
    }
    if (explorationBlock) {
      grid.appendChild(explorationBlock);
    }
    var analysisBlock = createProblemAnalysisBlock(problem);
    analysisBlock.dataset.analysisBlock = "1";
    grid.appendChild(analysisBlock);
    if (practiceBlock) {
      grid.appendChild(practiceBlock);
    }
    if (notebookLmBlock) {
      grid.appendChild(notebookLmBlock);
    }
    if (realLifeBlock) {
      grid.appendChild(realLifeBlock);
    }
    if (authoritativeResourcesBlock) {
      grid.appendChild(authoritativeResourcesBlock);
    }
    var examConnectionsBlock = createProblemExamConnectionsBlock(problem);
    if (examConnectionsBlock) {
      grid.appendChild(examConnectionsBlock);
    }
    var reviewBlock = createLearningCycleReviewBlock(problem);
    if (reviewBlock) {
      grid.appendChild(reviewBlock);
    }
    applyAdaptiveProblemLayout(problem, note);
    return note;
}

function createProblemQuestionBlock(problem) {
  var options = Array.isArray(problem.options) ? problem.options : [];
  var block = createProblemNoteBlock("题目", problem.title, problem.question || "");
  appendProblemOptions(block, options);
  appendProblemImages(block, problem.images);
  return block;
}

function createProblemTaxonomyBlock(problem) {
  if (problem && problem.presentation && problem.presentation.coreOnly === true) {
    return null;
  }
  var taxonomy = problem && problem.taxonomy;
  if (!taxonomy || !taxonomy.modelId || !taxonomy.familyId) {
    return null;
  }
  var block = createProblemNoteBlock(
    "学习定位",
    taxonomy.modelName || "物理模型",
    ""
  );
  block.classList.add("problem-taxonomy-block");
  block.dataset.keepExpanded = "1";

  var family = document.createElement("p");
  family.className = "problem-taxonomy-family";
  family.innerText = "题族：" + (taxonomy.familyName || taxonomy.familyId);
  block.appendChild(family);

  var tags = document.createElement("div");
  tags.className = "problem-taxonomy-tags";
  [
    taxonomy.role,
    taxonomy.variantLevel,
    taxonomy.difficulty ? "难度 " + taxonomy.difficulty + "/5" : ""
  ].filter(Boolean).forEach(function (label) {
    var tag = document.createElement("span");
    tag.innerText = label;
    tags.appendChild(tag);
  });
  block.appendChild(tags);

  var skills = Array.isArray(taxonomy.skills) ? taxonomy.skills : [];
  if (skills.length) {
    var skillText = document.createElement("p");
    skillText.className = "problem-taxonomy-copy";
    skillText.innerText = "训练能力：" + skills.join("、");
    block.appendChild(skillText);
  }

  var link = document.createElement("a");
  link.className = "problem-taxonomy-link";
  link.href = "/models/" + encodeURIComponent(taxonomy.modelId) +
    "#family-" + encodeURIComponent(taxonomy.familyId);
  link.innerText = "查看该模型的完整题族链";
  block.appendChild(link);
  return block;
}

function createProblemLearningPathBlock(problem) {
  if (problem && problem.presentation && problem.presentation.coreOnly === true) {
    return null;
  }
  var path = problem && problem.learningPath;
  if (!path || typeof path !== "object") {
    return null;
  }
  var relations = [
    { key: "foundation", label: "回到基础", description: "先补稳前置关系" },
    { key: "peer", label: "同级巩固", description: "换情境检验迁移" },
    { key: "challenge", label: "进入挑战", description: "增加条件与综合度" }
  ];
  var targets = relations.filter(function (relation) {
    return path[relation.key] && path[relation.key].id;
  });
  if (!targets.length) {
    return null;
  }
  var block = createProblemNoteBlock(
    "学习路径",
    path.familyName || "同题族进阶",
    "当前：" + (path.currentLevel || "") + " · 难度 " + (path.currentDifficulty || "") + "/5"
  );
  block.classList.add("problem-learning-path-block");
  block.dataset.keepExpanded = "1";
  if (path.mother && path.mother.title) {
    var mother = document.createElement("p");
    mother.className = "problem-family-mother";
    mother.innerText = "题族母题：" + path.mother.title + "；本题沿用母题的建模顺序，再处理当前变式条件。";
    block.appendChild(mother);
  }
  var grid = document.createElement("div");
  grid.className = "problem-learning-path-grid";
  targets.forEach(function (relation) {
    var target = path[relation.key];
    var link = document.createElement("a");
    link.className = "problem-learning-path-link is-" + relation.key;
    link.href = "/classical-mechanics-demo.html?scene=" + encodeURIComponent(target.id);
    link.onclick = function (event) {
      if (typeof switchScene !== "function") return;
      event.preventDefault();
      switchScene(target.id);
    };
    var heading = document.createElement("span");
    heading.className = "problem-learning-path-heading";
    heading.innerText = relation.label;
    var title = document.createElement("strong");
    title.innerText = target.title;
    var meta = document.createElement("small");
    meta.innerText = relation.description + " · " + target.variantLevel +
      " · 难度 " + target.difficulty + "/5";
    link.appendChild(heading);
    link.appendChild(title);
    link.appendChild(meta);
    grid.appendChild(link);
  });
  block.appendChild(grid);
  var levels = Array.isArray(path.levels) ? path.levels : [];
  if (levels.length) {
    var routeTitle = document.createElement("h3");
    routeTitle.className = "problem-family-route-title";
    routeTitle.innerText = "题族四级训练";
    block.appendChild(routeTitle);
    var route = document.createElement("div");
    route.className = "problem-family-route";
    levels.forEach(function (level) {
      var item = level.id ? document.createElement("a") : document.createElement("article");
      item.className = "problem-family-route-item";
      item.dataset.level = level.variantLevel || "";
      if (level.id) {
        item.href = "/classical-mechanics-demo.html?scene=" + encodeURIComponent(level.id);
        item.onclick = function (event) {
          if (typeof switchScene !== "function") return;
          event.preventDefault();
          switchScene(level.id);
        };
      }
      var badge = document.createElement("span");
      badge.innerText = (level.variantLevel || "") + " · " + (level.label || "");
      var title = document.createElement("strong");
      title.innerText = level.title || level.goal || "题族训练任务";
      var copy = document.createElement("p");
      copy.innerText = level.virtual ? level.task : ("实体题 · 难度 " + level.difficulty + "/5");
      item.appendChild(badge);
      item.appendChild(title);
      item.appendChild(copy);
      if (level.virtual && level.check) {
        var check = document.createElement("small");
        check.innerText = "自检：" + level.check;
        item.appendChild(check);
      }
      route.appendChild(item);
    });
    block.appendChild(route);
  }
  return block;
}

function getProblemAdaptiveState(problem) {
  var cycle = typeof getLearningCycleState === "function" ? getLearningCycleState(problem.id) : {};
  var prediction = cycle.prediction || {};
  var review = cycle.review || {};
  var history = Array.isArray(review.history) ? review.history : [];
  var recentCorrect = history.slice(-2).length === 2 && history.slice(-2).every(function (item) {
    return item.correct === true;
  });
  var predictionCorrect = prediction.correct === true;
  var predictionWrong = prediction.answer && prediction.correct === false;
  return {
    firstVisit: !prediction.answer,
    needsRepair: Boolean(predictionWrong || review.lastCorrect === false),
    mastered: Boolean(predictionCorrect && recentCorrect)
  };
}

function applyAdaptiveProblemLayout(problem, note) {
  if (!problem || !note) return;
  var state = getProblemAdaptiveState(problem);
  note.dataset.learningMode = state.mastered ? "mastered" : (state.needsRepair ? "repair" : "learning");
  note.querySelectorAll(".student-exploration-block, [data-analysis-block='1']").forEach(function (block) {
    if (state.mastered) {
      block.dataset.adaptiveCollapsed = "1";
      block.dataset.defaultExpanded = "0";
    } else if (state.needsRepair && block.dataset.analysisBlock === "1") {
      block.dataset.adaptiveExpanded = "1";
      block.dataset.defaultExpanded = "1";
    }
  });
  var path = problem.learningPath;
  if (state.needsRepair && path && path.foundation && path.foundation.id) {
    note.dataset.recommendedScene = path.foundation.id;
  } else if (state.mastered && path && path.challenge && path.challenge.id) {
    note.dataset.recommendedScene = path.challenge.id;
  }
}

function refreshAdaptiveProblemLayout(problem) {
  var note = problem && document.getElementById(problem.id + "Notes");
  if (!note) return;
  applyAdaptiveProblemLayout(problem, note);
  var state = getProblemAdaptiveState(problem);
  var exploration = note.querySelector(".student-exploration-block");
  if (exploration && state.mastered) {
    exploration.classList.add("is-collapsed");
    var explorationToggle = exploration.querySelector(":scope > .note-toggle");
    if (explorationToggle) explorationToggle.innerText = "展开";
  }
  var firstStep = note.querySelector("[data-analysis-block='1'] details.analysis-step");
  if (firstStep && state.needsRepair) firstStep.open = true;
}

function createProblemNotebookLmBlock(problem) {
  var media = problem && Array.isArray(problem.notebooklm) ? problem.notebooklm : [];
  var validMedia = media.filter(function (item) {
    return Boolean(
      item &&
      (item.type === "audio" || item.type === "video") &&
      /^https:\/\/notebooklm\.google\.com\//i.test(String(item.url || ""))
    );
  });
  if (!validMedia.length) {
    return null;
  }

  var block = createProblemNoteBlock("NotebookLM", "音视频讲解", "");
  block.classList.add("problem-notebooklm-block");
  block.dataset.keepExpanded = "1";
  var links = document.createElement("div");
  links.className = "notebooklm-links";

  validMedia.forEach(function (item) {
    var typeLabel = item.type === "video" ? "视频" : "音频";
    var link = document.createElement("a");
    link.className = "notebooklm-link is-" + item.type;
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", (item.title || typeLabel + "讲解") + "，在 NotebookLM 中打开");

    var badge = document.createElement("span");
    badge.className = "notebooklm-link-kind";
    badge.innerText = typeLabel;

    var copy = document.createElement("span");
    copy.className = "notebooklm-link-copy";
    var title = document.createElement("strong");
    title.innerText = item.title || typeLabel + "讲解";
    var hint = document.createElement("small");
    hint.innerText = "使用 Google 账号在 NotebookLM 中打开";
    copy.appendChild(title);
    copy.appendChild(hint);

    var action = document.createElement("span");
    action.className = "notebooklm-link-action";
    action.innerText = "打开";
    action.setAttribute("aria-hidden", "true");

    link.appendChild(badge);
    link.appendChild(copy);
    link.appendChild(action);
    links.appendChild(link);
  });

  block.appendChild(links);
  return block;
}

function formatProblemOption(option) {
  if (typeof option === "string") {
    return option.replace(/^\s*[-*]\s*/, "").replace(/^\s*([A-D])[．、]\s*/, "$1. ");
  }
  if (option && typeof option === "object") {
    var label = option.label ? String(option.label).replace(/[．、.：:]+$/, "") : "";
    var text = option.text || option.content || "";
    return (label ? label + ". " : "") + text;
  }
  return String(option || "");
}

function appendProblemOptions(block, options) {
  if (!block || !Array.isArray(options) || !options.length) {
    return;
  }
  var optionWrap = document.createElement("div");
  optionWrap.className = "problem-options";
  options.forEach(function (option) {
    var optionLine = document.createElement("p");
    optionLine.className = "problem-option";
    optionLine.innerHTML = markdownLiteInlineToHtml(formatProblemOption(option));
    optionWrap.appendChild(optionLine);
  });
  block.appendChild(optionWrap);
}

function appendProblemImages(block, images) {
  if (!block || !Array.isArray(images) || !images.length) {
    return;
  }
  var gallery = document.createElement("div");
  gallery.className = "problem-image-gallery";
  images.forEach(function (image) {
    if (!image || !image.src) {
      return;
    }
    var figure = document.createElement("figure");
    figure.className = "problem-image-figure";
    var img = document.createElement("img");
    img.src = "/" + String(image.src).replace(/^\/+/, "");
    img.alt = image.alt || image.caption || "题图";
    img.loading = "lazy";
    figure.appendChild(img);
    if (image.caption) {
      var caption = document.createElement("figcaption");
      caption.innerText = image.caption;
      figure.appendChild(caption);
    }
    gallery.appendChild(figure);
  });
  if (gallery.children.length) {
    block.appendChild(gallery);
  }
}

function getProblemOptionText(option) {
  if (option && typeof option === "object") {
    return String(option.text || option.label || option.title || "");
  }
  return String(option || "");
}

function getProblemOptionAnalysisMode(problem) {
  var presentation = (problem && problem.analysisPresentation) || {};
  var explicitMode = presentation.optionMode || presentation.optionAnalysisMode || "";
  if (explicitMode === "shared-solution" || explicitMode === "independent-statements") {
    return explicitMode;
  }
  var optionAnalyses = problem && Array.isArray(problem.optionAnalyses) ? problem.optionAnalyses : [];
  if (!optionAnalyses.length) {
    return "shared-solution";
  }
  var question = String(problem.question || "");
  var independentStem = /下列(?:说法|叙述|判断|选项)|(?:说法|叙述)中|关于[^。；]{0,40}(?:说法|叙述)|判断下列/i;
  if (independentStem.test(question)) {
    return "independent-statements";
  }
  var options = Array.isArray(problem.options) ? problem.options : [];
  var compactAnswerCount = options.filter(function (option) {
    var text = getProblemOptionText(option).replace(/^\s*[A-H][.．、:：]?\s*/i, "");
    var chineseCount = (text.match(/[\u3400-\u9fff]/g) || []).length;
    return chineseCount <= 6;
  }).length;
  if (options.length && compactAnswerCount / options.length >= 0.75) {
    return "shared-solution";
  }
  var directAnswerStem = /(?:求|计算|确定)[^。；]{0,80}(?:值|大小|比值|范围|表达式|速度|时间|高度|距离|功率|功|加速度|角速度)|(?:判断|确定)[^。；]{0,100}(?:之间的关系|方向及关系)|(?:分别为|关系为|关系是)\s*[？?]?\s*$|(?:为|是|等于|不能超过|至少为|至多为|可能为)\s*[（(][^）)]*[）)]/i;
  if (directAnswerStem.test(question)) {
    return "shared-solution";
  }
  return "independent-statements";
}

function shouldUseProblemOptionAnalyses(problem) {
  return Boolean(
    problem &&
    Array.isArray(problem.optionAnalyses) &&
    problem.optionAnalyses.length &&
    getProblemOptionAnalysisMode(problem) === "independent-statements"
  );
}

function getProblemAnalysisItems(problem) {
  if (!problem) {
    return [];
  }
  if (shouldUseProblemOptionAnalyses(problem)) {
    var optionItems = problem.optionAnalyses.map(function (item, index) {
      return normalizeProblemOptionAnalysis(item, index, false);
    });
    var sharedMethod = getProblemOptionSharedMethod(problem);
    return sharedMethod ? [sharedMethod].concat(optionItems) : optionItems;
  }
  return Array.isArray(problem.steps) ? problem.steps : [];
}

function getProblemOptionSharedMethod(problem) {
  var analysis = (problem && problem.analysis) || {};
  var presentation = (problem && problem.analysisPresentation) || {};
  var optionAnalyses = problem && Array.isArray(problem.optionAnalyses) ? problem.optionAnalyses : [];
  var firstThinking = optionAnalyses.find(function (item) {
    return item && item.thinking;
  });
  var firstFormula = optionAnalyses.find(function (item) {
    return item && item.formula;
  });
  var thinking = analysis.sharedThinking || presentation.sharedThinking || (firstThinking && firstThinking.thinking) || "";
  var formula = analysis.sharedFormula || presentation.sharedFormula || (firstFormula && firstFormula.formula) || "";
  var contentParts = [];
  if (thinking) {
    contentParts.push("**解题思路**", thinking);
  }
  if (formula) {
    contentParts.push("**对应公式**", formula);
  }
  if (!contentParts.length) {
    return null;
  }
  return {
    title: "解题思路与对应公式",
    content: contentParts.join("\n\n"),
    knowledge: problem.knowledge || [],
    commonMistakes: [],
    isSharedMethod: true
  };
}

function getProblemAnalysisTitle(problem) {
  var title = (problem.analysis && problem.analysis.title) || "分步解析";
  if (!shouldUseProblemOptionAnalyses(problem)) {
    title = title.replace(/分选项解析|逐选项解析|逐项解析|分项解析/g, "分步解析");
  }
  return title;
}

function createProblemAnalysisBlock(problem) {
  var useOptionAnalyses = shouldUseProblemOptionAnalyses(problem);
  var block = createProblemNoteBlock("解析", getProblemAnalysisTitle(problem), "");
  var steps = Array.isArray(problem.steps) ? problem.steps : [];
  var presentation = problem.analysisPresentation || {};
  var content = problem.analysis && problem.analysis.content ? problem.analysis.content.trim() : "";
  var analysisItems = useOptionAnalyses ? getProblemAnalysisItems(problem) : steps;
  var collapseEachStep = presentation.collapseEachStep === true || useOptionAnalyses;
  if (content && !analysisItems.length) {
    appendMarkdownChildren(block, content);
    return block;
  }
  if (analysisItems.length) {
    analysisItems.forEach(function (step, index) {
      var isSharedMethod = step.isSharedMethod === true;
      var shouldCollapseStep = collapseEachStep && !isSharedMethod;
      var stepWrap = document.createElement(shouldCollapseStep ? "details" : "div");
      stepWrap.className = "analysis-step";
      if (isSharedMethod) {
        stepWrap.classList.add("analysis-shared-method");
      }
      stepWrap.dataset.stepIndex = String(index);
      if (shouldCollapseStep) {
        stepWrap.dataset.collapsibleStep = "1";
        var summary = document.createElement("summary");
        summary.className = "analysis-step-summary";
        summary.innerText = useOptionAnalyses
          ? (step.title || "选项 " + (index + 1))
          : "步骤 " + (index + 1) + "：" + (step.title || "分析");
        stepWrap.appendChild(summary);
        var stepBody = document.createElement("div");
        stepBody.className = "analysis-step-content";
        appendMarkdownChildren(stepBody, step.content || "");
        stepWrap.appendChild(stepBody);
      } else if (isSharedMethod) {
        appendMarkdownChildren(stepWrap, step.content || "");
      } else {
        var title = document.createElement("h3");
        title.innerText = "步骤 " + (index + 1) + "：" + (step.title || "分析");
        stepWrap.appendChild(title);
        appendMarkdownChildren(stepWrap, step.content || "");
      }
      block.appendChild(stepWrap);
    });
    return block;
  }
  appendMarkdownChildren(block, content || "这道题的解析还需要补充。");
  return block;
}

function normalizeProblemOptionAnalysis(item, index, includeMethod) {
  var optionLabel = String(item.option || item.label || index + 1).replace(/[．、.：:]+$/, "");
  var contentParts = [];
  if (includeMethod !== false) {
    contentParts.push(
      "**解题思路**",
      item.thinking || "先判断该选项对应的物理过程与守恒条件。",
      "**对应公式**",
      item.formula || "根据题意选择相应的物理关系式。"
    );
  }
  var judgment = item.judgment || item.content || "";
  if (judgment) {
    contentParts.push("**选项判断**", judgment);
  }
  return {
    title: "选项 " + optionLabel + (item.title ? "：" + item.title : ""),
    content: contentParts.join("\n\n"),
    knowledge: item.knowledge || [],
    commonMistakes: item.commonMistakes || []
  };
}

function createProblemPracticeBlock(problem) {
  var practice = problem.practice || problem.similarProblem || null;
  if (!practice) {
    return null;
  }
  var block = createProblemNoteBlock("近似题", practice.title || "同模型练习", practice.question || "");
  if (practice.answer) {
    var answerDetails = document.createElement("details");
    var answerSummary = document.createElement("summary");
    answerSummary.innerText = "近似题答案";
    answerDetails.appendChild(answerSummary);
    appendMarkdownChildren(answerDetails, practice.answer);
    block.appendChild(answerDetails);
  }
  if (practice.thinking || practice.solutionIdea) {
    var thinkingDetails = document.createElement("details");
    var thinkingSummary = document.createElement("summary");
    thinkingSummary.innerText = "近似题解题思路";
    thinkingDetails.appendChild(thinkingSummary);
    appendMarkdownChildren(thinkingDetails, practice.thinking || practice.solutionIdea);
    block.appendChild(thinkingDetails);
  }
  var mastery = document.createElement("div");
  mastery.className = "practice-mastery";
  var masteryTitle = document.createElement("strong");
  masteryTitle.innerText = "完成情况";
  mastery.appendChild(masteryTitle);
  var saved = typeof getLearningResponse === "function"
    ? getLearningResponse(practiceMasteryStorageKey, problem.id + ":practice")
    : "";
  [
    { value: "independent", label: "独立完成" },
    { value: "hinted", label: "提示后完成" },
    { value: "incorrect", label: "暂未掌握" }
  ].forEach(function (choice) {
    var button = document.createElement("button");
    button.type = "button";
    button.innerText = choice.label;
    button.className = "practice-mastery-action";
    button.classList.toggle("is-selected", saved === choice.value);
    button.onclick = function () {
      writeLearningResponse(practiceMasteryStorageKey, problem.id + ":practice", choice.value);
      mastery.querySelectorAll(".practice-mastery-action").forEach(function (item) {
        item.classList.toggle("is-selected", item === button);
      });
    };
    mastery.appendChild(button);
  });
  block.appendChild(mastery);
  return block;
}

function createProblemExamConnectionsBlock(problem) {
  var items = problem && Array.isArray(problem.examConnections) ? problem.examConnections : [];
  if (!items.length) {
    return null;
  }
  var tracks = problem.studyTracks;

  var block = createProblemNoteBlock(
    tracks ? "升学分轨" : "真题拓展",
    tracks ? "高考轨与竞赛衔接轨" : "高考迁移与竞赛挑战",
    tracks
      ? "两条路径目标不同。高考轨训练课内模型的稳定迁移；竞赛轨训练模型升级、近似与数学准备。"
      : "先判断模型是否相同，再比较题目增加了哪些条件。竞赛题仅在考点确实衔接时提供。"
  );
  block.classList.add("exam-connections-block");
  var groups = [
    {
      type: "gaokao",
      title: "高考迁移",
      description: "同一考点在真实高考试卷中的设问方式"
    },
    {
      type: "competition",
      title: "竞赛挑战",
      description: "在当前模型上继续增加约束或推理层次"
    }
  ];

  var trackPanels = {};
  if (tracks) {
    var tabs = document.createElement("div");
    tabs.className = "study-track-tabs";
    tabs.setAttribute("role", "tablist");
    [
      { key: "gaokao", label: "高考轨" },
      { key: "competition", label: "竞赛衔接轨" }
    ].forEach(function (definition, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "study-track-tab";
      button.dataset.track = definition.key;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", index === 0 ? "true" : "false");
      button.innerText = definition.label;
      button.onclick = function () {
        tabs.querySelectorAll(".study-track-tab").forEach(function (tab) {
          tab.setAttribute("aria-selected", tab === button ? "true" : "false");
        });
        Object.keys(trackPanels).forEach(function (key) {
          trackPanels[key].hidden = key !== definition.key;
        });
        renderMath(block);
      };
      tabs.appendChild(button);
    });
    block.appendChild(tabs);
  }

  groups.forEach(function (group, groupIndex) {
    var groupItems = items.filter(function (item) {
      return item && item.type === group.type;
    });
    var track = tracks && tracks[group.type];
    if (!groupItems.length && !track) {
      return;
    }
    var section = document.createElement("section");
    section.className = "exam-connection-group is-" + group.type;
    if (tracks) {
      section.classList.add("study-track-panel");
      section.hidden = groupIndex !== 0;
      trackPanels[group.type] = section;
      appendProblemStudyTrackOverview(section, track, group.type);
    }
    var heading = document.createElement("div");
    heading.className = "exam-connection-heading";
    var headingTitle = document.createElement("h3");
    headingTitle.innerText = group.title;
    var headingText = document.createElement("p");
    headingText.innerText = group.description;
    heading.appendChild(headingTitle);
    heading.appendChild(headingText);
    section.appendChild(heading);

    if (groupItems.length) {
      var grid = document.createElement("div");
      grid.className = "exam-connection-grid";
      groupItems.forEach(function (item) {
        grid.appendChild(createProblemExamConnectionCard(item));
      });
      section.appendChild(grid);
    } else if (group.type === "competition") {
      var empty = document.createElement("p");
      empty.className = "study-track-resource-empty";
      empty.innerText = "当前题暂未关联可核验竞赛原题。先完成上方能力准备；找到官方题源后再加入真题。";
      section.appendChild(empty);
    }
    block.appendChild(section);
  });
  return block;
}

function appendProblemStudyTrackOverview(section, track, type) {
  if (!section || !track) return;
  var overview = document.createElement("div");
  overview.className = "study-track-overview is-" + type;
  var heading = document.createElement("div");
  heading.className = "study-track-overview-heading";
  var title = document.createElement("strong");
  title.innerText = track.title || (type === "competition" ? "竞赛衔接轨" : "高考轨");
  var badge = document.createElement("span");
  badge.innerText = track.badge || "";
  heading.appendChild(title);
  heading.appendChild(badge);
  overview.appendChild(heading);
  [
    ["目标", track.goal],
    ["训练方法", track.method],
    ["完成标准", track.completion]
  ].forEach(function (item) {
    if (!item[1]) return;
    var row = document.createElement("p");
    var label = document.createElement("b");
    label.innerText = item[0] + "：";
    row.appendChild(label);
    row.appendChild(document.createTextNode(item[1]));
    overview.appendChild(row);
  });
  var list = type === "competition" ? track.mathTools : track.focus;
  if (Array.isArray(list) && list.length) {
    var tools = document.createElement("p");
    var toolsLabel = document.createElement("b");
    toolsLabel.innerText = type === "competition" ? "数学准备：" : "高考重点：";
    tools.appendChild(toolsLabel);
    tools.appendChild(document.createTextNode(list.join("、")));
    overview.appendChild(tools);
  }
  if (track.boundary) {
    var boundary = document.createElement("p");
    boundary.className = "study-track-boundary";
    boundary.innerText = "范围边界：" + track.boundary;
    overview.appendChild(boundary);
  }
  if (track.resourceStatus) {
    var status = document.createElement("p");
    status.className = "study-track-resource-status";
    status.innerText = track.resourceStatus;
    overview.appendChild(status);
  }
  section.appendChild(overview);
}

function createProblemExamConnectionCard(item) {
  var card = document.createElement("a");
  card.className = "exam-connection-card is-" + item.type;
  card.href = item.url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  var meta = document.createElement("div");
  meta.className = "exam-connection-meta";
  var sourceType = document.createElement("span");
  sourceType.className = "exam-connection-kind";
  sourceType.innerText = item.type === "competition"
    ? "竞赛真题 · " + item.tier
    : "高考真题";
  var matchLevel = document.createElement("span");
  matchLevel.className = "exam-connection-level";
  matchLevel.innerText = item.matchLevel;
  meta.appendChild(sourceType);
  if (item.relation) {
    var relation = document.createElement("span");
    relation.className = "exam-connection-relation";
    relation.innerText = item.relation;
    meta.appendChild(relation);
  }
  meta.appendChild(matchLevel);
  card.appendChild(meta);

  var title = document.createElement("h4");
  title.className = "exam-connection-title";
  title.innerText = item.title;
  card.appendChild(title);

  var source = document.createElement("p");
  source.className = "exam-connection-source";
  source.innerText = item.year + " · " + item.source + " · " + item.number;
  card.appendChild(source);

  var reason = document.createElement("div");
  reason.className = "exam-connection-reason";
  reason.innerHTML = markdownLiteToHtml("**为什么匹配：** " + item.matchReason);
  card.appendChild(reason);

  if (Array.isArray(item.prerequisites) && item.prerequisites.length) {
    var prerequisites = document.createElement("p");
    prerequisites.className = "exam-connection-prerequisites";
    prerequisites.innerText = "先修知识：" + item.prerequisites.join("、");
    card.appendChild(prerequisites);
  }

  var action = document.createElement("span");
  action.className = "exam-connection-action";
  action.innerText = "查看可核验题源";
  card.appendChild(action);
  return card;
}

function appendMarkdownChildren(parent, content) {
  var contentWrap = document.createElement("div");
  contentWrap.innerHTML = markdownLiteToHtml(content || "");
  Array.prototype.slice.call(contentWrap.children).forEach(function (child) {
    parent.appendChild(child);
  });
}

function toPascalId(value) {
  return String(value || "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

function createProblemNoteBlock(kicker, title, content) {
  var section = document.createElement("section");
  section.className = "problem-note-block";
  var kickerEl = document.createElement("p");
  kickerEl.className = "problem-note-kicker";
  kickerEl.innerText = kicker;
  var titleEl = document.createElement("h2");
  titleEl.innerText = title || "";
  section.appendChild(kickerEl);
  section.appendChild(titleEl);
  var contentWrap = document.createElement("div");
  contentWrap.innerHTML = markdownLiteToHtml(content || "");
  Array.prototype.slice.call(contentWrap.children).forEach(function (child) {
    section.appendChild(child);
  });
  return section;
}
