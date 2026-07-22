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

    grid.appendChild(createProblemQuestionBlock(problem));
    var authoritativeResourcesBlock = createAuthoritativeResourcesBlock(problem);
    var predictionBlock = createLearningCyclePredictionBlock(problem);
    if (predictionBlock) {
      grid.appendChild(predictionBlock);
    }
    var notebookLmBlock = createProblemNotebookLmBlock(problem);
    if (notebookLmBlock) {
      grid.appendChild(notebookLmBlock);
    }
    var analysisBlock = createProblemAnalysisBlock(problem);
    analysisBlock.dataset.analysisBlock = "1";
    grid.appendChild(analysisBlock);
    var explorationBlock = createStudentExplorationBlock(problem);
    var realLifeBlock = createRealLifeCaseBlock(problem);
    if (explorationBlock || realLifeBlock || authoritativeResourcesBlock || predictionBlock) {
      grid.appendChild(createLearningSyncPanel());
    }
    if (explorationBlock) {
      grid.appendChild(explorationBlock);
    }
    if (realLifeBlock) {
      grid.appendChild(realLifeBlock);
    }
    if (authoritativeResourcesBlock) {
      grid.appendChild(authoritativeResourcesBlock);
    }
    var practiceBlock = createProblemPracticeBlock(problem);
    if (practiceBlock) {
      grid.appendChild(practiceBlock);
    }
    var reviewBlock = createLearningCycleReviewBlock(problem);
    if (reviewBlock) {
      grid.appendChild(reviewBlock);
    }
    if (problem.summary && !problem.analysis) {
      grid.appendChild(createProblemNoteBlock("一句话总结", problem.summary.title || "总结", problem.summary.content || ""));
    }
    return note;
}

function createProblemQuestionBlock(problem) {
  var options = Array.isArray(problem.options) ? problem.options : [];
  var block = createProblemNoteBlock("题目", problem.title, problem.question || "");
  appendProblemOptions(block, options);
  appendProblemImages(block, problem.images);
  return block;
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
  appendMarkdownChildren(block, content || (problem.summary && problem.summary.content) || "这道题的解析还需要补充。");
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
  return block;
}

function appendMarkdownChildren(parent, content) {
  var contentWrap = document.createElement("div");
  contentWrap.innerHTML = markdownLiteToHtml(content || "");
  Array.prototype.slice.call(contentWrap.children).forEach(function (child) {
    parent.appendChild(child);
  });
}

function normalizeProblemSource(problem) {
  var source = problem.source || {};
  var title = source.title || problem.chapter || "题目来源";
  var text = source.text || source.page || "";
  var imageLike = /(^|\/)(IMG_|image|photo)|\.(jpg|jpeg|png|webp|bmp|gif)$/i.test(text);
  if (!title || title === "图片 OCR 导入" || title === "OCR 文本导入") {
    title = problem.chapter || "题目来源";
  }
  if (!text || imageLike) {
    text = source.page || "来源待校对";
  }
  return { title: title, text: text };
}

function isPromotedProblem(problem) {
  return Boolean(problem && promotedProblemChapterMap[problem.chapter || ""]);
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
