// Compact homepage summary derived from the saved exploration and transfer records.
var learningProgressCatalog = [];
var learningProgressLoadPromise = null;
var learningProgressLoadError = "";

function learningProgressRatio(done, total) {
  if (total <= 0 || done <= 0) {
    return 0;
  }
  return Math.max(1, Math.round(done * 100 / total));
}

function learningProgressValue(done, total) {
  return done + " / " + total;
}

function learningProgressHasResponse(store, responseKey) {
  var record = store[responseKey];
  return Boolean(record && !record.deleted && String(record.value || "").trim());
}

function calculateLearningProgress() {
  var explorationStore = normalizeLearningStore(
    studentExplorationStorageKey,
    readLearningResponseStore(studentExplorationStorageKey)
  );
  var transferStore = normalizeLearningStore(
    realLifeResponseStorageKey,
    readLearningResponseStore(realLifeResponseStorageKey)
  );
  var rubricStore = normalizeLearningStore(
    realLifeRubricStorageKey,
    readLearningResponseStore(realLifeRubricStorageKey)
  );
  var practiceStore = normalizeLearningStore(
    practiceMasteryStorageKey,
    readLearningResponseStore(practiceMasteryStorageKey)
  );
  var cycleStore = normalizeLearningStore(
    learningCycleStorageKey,
    readLearningResponseStore(learningCycleStorageKey)
  );
  var totals = {
    completed: 0,
    available: 0,
    explorationDone: 0,
    explorationTotal: 0,
    transferDone: 0,
    transferTotal: 0,
    rubricDone: 0,
    rubricTotal: 0
  };
  var evidence = {
    predictionAttempts: 0,
    predictionCorrect: 0,
    animationCorrections: 0,
    postJudgments: 0,
    postCorrect: 0,
    practiceAttempts: 0,
    practiceIndependent: 0,
    reviewAttempts: 0,
    reviewCorrect: 0
  };
  var chapters = {};
  var weakKnowledge = {};
  var familySignals = {};
  var misconceptionTags = {};

  learningProgressCatalog.forEach(function (problem) {
    var chapterName = problem.chapter || "未分类";
    var chapter = chapters[chapterName];
    if (!chapter) {
      chapter = {
        name: chapterName,
        completed: 0,
        available: 0,
        explorationDone: 0,
        explorationTotal: 0,
        transferDone: 0,
        transferTotal: 0,
        rubricDone: 0,
        rubricTotal: 0
      };
      chapters[chapterName] = chapter;
    }

    var explorationTotal = Math.max(0, Number(problem.explorationStages) || 0);
    var explorationDone = 0;
    for (var index = 0; index < explorationTotal; index += 1) {
      if (learningProgressHasResponse(explorationStore, problem.id + ":stage:" + index)) {
        explorationDone += 1;
      }
    }

    var transferTotal = problem.hasTransfer ? 1 : 0;
    var responseKey = problem.id + ":real-life";
    var transferDone = transferTotal && learningProgressHasResponse(transferStore, responseKey) ? 1 : 0;
    var rubricTotal = Math.max(0, Number(problem.rubricPoints) || 0);
    var rubricRecord = rubricStore[responseKey];
    var rubricChecks = rubricRecord && !rubricRecord.deleted && Array.isArray(rubricRecord.value)
      ? rubricRecord.value
      : [];
    var rubricDone = rubricChecks.filter(function (item) {
      return item >= 0 && item < rubricTotal;
    }).length;
    var problemCompleted = explorationDone + transferDone + rubricDone;
    var problemAvailable = explorationTotal + transferTotal + rubricTotal;

    totals.completed += problemCompleted;
    totals.available += problemAvailable;
    totals.explorationDone += explorationDone;
    totals.explorationTotal += explorationTotal;
    totals.transferDone += transferDone;
    totals.transferTotal += transferTotal;
    totals.rubricDone += rubricDone;
    totals.rubricTotal += rubricTotal;

    chapter.completed += problemCompleted;
    chapter.available += problemAvailable;
    chapter.explorationDone += explorationDone;
    chapter.explorationTotal += explorationTotal;
    chapter.transferDone += transferDone;
    chapter.transferTotal += transferTotal;
    chapter.rubricDone += rubricDone;
    chapter.rubricTotal += rubricTotal;

    var familyId = problem.familyId || problem.id;
    if (!familySignals[familyId]) {
      familySignals[familyId] = {
        id: familyId,
        name: problem.familyName || familyId,
        attempts: 0,
        gaps: 0,
        misconceptions: 0
      };
    }
    var family = familySignals[familyId];
    var cycleRecord = cycleStore[problem.id + ":cycle"];
    var cycle = cycleRecord && !cycleRecord.deleted
      ? parseLearningCycleValue(cycleRecord.value)
      : {};
    if (cycle.prediction && cycle.prediction.answer) {
      evidence.predictionAttempts += 1;
      family.attempts += 1;
      if (cycle.prediction.correct === true) {
        evidence.predictionCorrect += 1;
      } else if (cycle.prediction.correct === false) {
        family.gaps += 2;
      }
      if (cycle.prediction.postAnswer) {
        evidence.postJudgments += 1;
        if (cycle.prediction.postCorrect === true) evidence.postCorrect += 1;
      }
    }
    if (cycle.misconceptionResponse) evidence.animationCorrections += 1;
    if (cycle.misconceptionTag) {
      misconceptionTags[cycle.misconceptionTag] = (misconceptionTags[cycle.misconceptionTag] || 0) + 1;
      family.misconceptions += 1;
    }
    var reviewHistory = cycle.review && Array.isArray(cycle.review.history) ? cycle.review.history : [];
    reviewHistory.forEach(function (item) {
      evidence.reviewAttempts += 1;
      family.attempts += 1;
      if (item.correct === true) {
        evidence.reviewCorrect += 1;
      } else {
        family.gaps += 1;
      }
    });
    var practiceRecord = practiceStore[problem.id + ":practice"];
    var practiceValue = practiceRecord && !practiceRecord.deleted ? practiceRecord.value : "";
    if (practiceValue) {
      evidence.practiceAttempts += 1;
      family.attempts += 1;
      if (practiceValue === "independent") {
        evidence.practiceIndependent += 1;
      } else {
        family.gaps += practiceValue === "incorrect" ? 2 : 1;
      }
    }

    var hasLearningEvidence = problemCompleted > 0;
    var gap = problemAvailable - problemCompleted;
    if (hasLearningEvidence && gap > 0) {
      (problem.knowledge || []).forEach(function (knowledge) {
        if (!weakKnowledge[knowledge]) {
          weakKnowledge[knowledge] = { name: knowledge, weight: 0, problems: 0 };
        }
        weakKnowledge[knowledge].weight += gap;
        weakKnowledge[knowledge].problems += 1;
      });
    }
  });

  return {
    totals: totals,
    chapters: Object.keys(chapters).map(function (name) {
      return chapters[name];
    }).sort(function (a, b) {
      return a.name.localeCompare(b.name, "zh-CN");
    }),
    weakKnowledge: Object.keys(weakKnowledge).map(function (name) {
      return weakKnowledge[name];
    }).sort(function (a, b) {
      return b.weight - a.weight || b.problems - a.problems || a.name.localeCompare(b.name, "zh-CN");
    }).slice(0, 6),
    evidence: evidence,
    weakFamilies: Object.keys(familySignals).map(function (id) {
      return familySignals[id];
    }).filter(function (item) {
      return item.attempts > 0 && item.gaps > 0;
    }).sort(function (a, b) {
      return b.gaps - a.gaps || b.misconceptions - a.misconceptions || a.name.localeCompare(b.name, "zh-CN");
    }).slice(0, 3),
    misconceptions: Object.keys(misconceptionTags).map(function (tag) {
      return { name: tag, count: misconceptionTags[tag] };
    }).sort(function (a, b) {
      return b.count - a.count || a.name.localeCompare(b.name, "zh-CN");
    }).slice(0, 5)
  };
}

function createLearningProgressMetric(labelText, valueText, detailText, valueId) {
  var metric = document.createElement("article");
  metric.className = "learning-progress-metric";
  var label = document.createElement("span");
  label.innerText = labelText;
  var value = document.createElement("strong");
  value.innerText = valueText;
  if (valueId) value.id = valueId;
  var detail = document.createElement("small");
  detail.innerText = detailText;
  metric.appendChild(label);
  metric.appendChild(value);
  metric.appendChild(detail);
  return metric;
}

function learningProgressSyncText() {
  if (learningSyncStatus === "synced") return "跨设备已同步";
  if (learningSyncStatus === "checking" || learningSyncStatus === "syncing" || learningSyncStatus === "pending") {
    return "正在同步";
  }
  if (learningSyncStatus === "error") return "服务器暂不可用，本机记录仍有效";
  return "当前设备记录";
}

function renderLearningProgressOverview() {
  var summaryHost = document.getElementById("learningProgressSummary");
  var chapterHost = document.getElementById("learningProgressChapters");
  var weakHost = document.getElementById("learningProgressWeak");
  var status = document.getElementById("learningProgressSyncStatus");
  if (!summaryHost || !chapterHost || !weakHost) return;
  if (status) status.innerText = learningProgressSyncText();
  summaryHost.innerHTML = "";
  chapterHost.innerHTML = "";
  weakHost.innerHTML = "";

  if (learningProgressLoadError) {
    var error = document.createElement("p");
    error.className = "learning-progress-empty";
    error.innerText = "学习进度暂时无法读取，请刷新后重试。";
    summaryHost.appendChild(error);
    return;
  }
  if (!learningProgressCatalog.length) {
    var loading = document.createElement("p");
    loading.className = "learning-progress-empty";
    loading.innerText = "正在汇总学习记录…";
    summaryHost.appendChild(loading);
    return;
  }

  var progress = calculateLearningProgress();
  var totals = progress.totals;
  var evidence = progress.evidence;
  summaryHost.appendChild(createLearningProgressMetric(
    "首次预测",
    learningProgressRatio(evidence.predictionCorrect, evidence.predictionAttempts) + "%",
    learningProgressValue(evidence.predictionCorrect, evidence.predictionAttempts) + " 次独立判断正确",
    "learningProgressOverallValue"
  ));
  summaryHost.appendChild(createLearningProgressMetric(
    "动画后修正",
    learningProgressRatio(evidence.postCorrect, evidence.postJudgments) + "%",
    learningProgressValue(evidence.postCorrect, evidence.postJudgments) + " 次二次判断正确",
    "learningProgressExplorationValue"
  ));
  summaryHost.appendChild(createLearningProgressMetric(
    "近似题迁移",
    learningProgressRatio(evidence.practiceIndependent, evidence.practiceAttempts) + "%",
    learningProgressValue(evidence.practiceIndependent, evidence.practiceAttempts) + " 次独立完成",
    "learningProgressTransferValue"
  ));
  summaryHost.appendChild(createLearningProgressMetric(
    "复习保持率",
    learningProgressRatio(evidence.reviewCorrect, evidence.reviewAttempts) + "%",
    learningProgressValue(evidence.reviewCorrect, evidence.reviewAttempts) + " 次延时复习正确",
    "learningProgressScoreValue"
  ));

  progress.chapters.forEach(function (chapter) {
    var row = document.createElement("article");
    row.className = "learning-progress-chapter";
    row.dataset.chapter = chapter.name;
    var heading = document.createElement("div");
    heading.className = "learning-progress-chapter-heading";
    var title = document.createElement("strong");
    title.innerText = chapter.name;
    var ratio = document.createElement("span");
    ratio.innerText = learningProgressRatio(chapter.completed, chapter.available) + "%";
    heading.appendChild(title);
    heading.appendChild(ratio);
    var track = document.createElement("div");
    track.className = "learning-progress-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", chapter.name + "学习完成度");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(learningProgressRatio(chapter.completed, chapter.available)));
    var fill = document.createElement("span");
    fill.style.width = learningProgressRatio(chapter.completed, chapter.available) + "%";
    track.appendChild(fill);
    var detail = document.createElement("p");
    detail.innerText = "探索 " + learningProgressValue(chapter.explorationDone, chapter.explorationTotal) +
      " · 迁移 " + learningProgressValue(chapter.transferDone, chapter.transferTotal) +
      " · 自评 " + learningProgressValue(chapter.rubricDone, chapter.rubricTotal);
    row.appendChild(heading);
    row.appendChild(track);
    row.appendChild(detail);
    chapterHost.appendChild(row);
  });

  var weakTitle = document.createElement("strong");
  weakTitle.className = "learning-progress-weak-title";
  weakTitle.innerText = "最需要补的题族";
  weakHost.appendChild(weakTitle);
  if (!progress.weakFamilies.length) {
    var empty = document.createElement("p");
    empty.className = "learning-progress-empty";
    empty.innerText = evidence.predictionAttempts || evidence.practiceAttempts
      ? "当前作答尚未形成明显薄弱题族。"
      : "完成预测、近似题或复习后，这里会显示最需要补的三个题族。";
    weakHost.appendChild(empty);
    return;
  }
  var list = document.createElement("div");
  list.className = "learning-progress-weak-list";
  progress.weakFamilies.forEach(function (item) {
    var chip = document.createElement("span");
    chip.innerText = item.name;
    chip.title = item.gaps + " 个薄弱信号，来自预测、近似题或延时复习";
    list.appendChild(chip);
  });
  weakHost.appendChild(list);
  if (progress.misconceptions.length) {
    var misconceptionTitle = document.createElement("strong");
    misconceptionTitle.className = "learning-progress-weak-title";
    misconceptionTitle.innerText = "高频误区";
    weakHost.appendChild(misconceptionTitle);
    var misconceptionList = document.createElement("div");
    misconceptionList.className = "learning-progress-weak-list";
    progress.misconceptions.forEach(function (item) {
      var chip = document.createElement("span");
      chip.innerText = item.name + " · " + item.count;
      misconceptionList.appendChild(chip);
    });
    weakHost.appendChild(misconceptionList);
  }
}

function loadLearningProgressCatalog() {
  if (learningProgressLoadPromise) return learningProgressLoadPromise;
  learningProgressLoadPromise = fetch("/data/learning-progress.json", {
    cache: "no-store"
  }).then(function (response) {
    if (!response.ok) throw new Error("progress_catalog_" + response.status);
    return response.json();
  }).then(function (payload) {
    learningProgressCatalog = Array.isArray(payload.problems) ? payload.problems : [];
    learningProgressLoadError = "";
    renderLearningProgressOverview();
    return learningProgressCatalog;
  }).catch(function (error) {
    learningProgressLoadError = error && error.message ? error.message : "progress_catalog_error";
    renderLearningProgressOverview();
    return [];
  });
  return learningProgressLoadPromise;
}

function initializeLearningProgressOverview() {
  if (typeof initializeLearningSyncHome === "function") initializeLearningSyncHome();
  renderLearningProgressOverview();
  loadLearningProgressCatalog();
  checkLearningSyncSession();
}
