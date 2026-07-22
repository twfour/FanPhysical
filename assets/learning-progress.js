// Compact homepage summary derived from the saved exploration and transfer records.
var learningProgressCatalog = [];
var learningProgressLoadPromise = null;
var learningProgressLoadError = "";

function learningProgressRatio(done, total) {
  return total > 0 ? Math.round(done * 100 / total) : 0;
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
  var chapters = {};
  var weakKnowledge = {};

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
    }).slice(0, 6)
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
  var overallRatio = learningProgressRatio(totals.completed, totals.available);
  summaryHost.appendChild(createLearningProgressMetric(
    "学习完成度",
    overallRatio + "%",
    learningProgressValue(totals.completed, totals.available) + " 项学习任务",
    "learningProgressOverallValue"
  ));
  summaryHost.appendChild(createLearningProgressMetric(
    "探索完成",
    learningProgressValue(totals.explorationDone, totals.explorationTotal),
    "已提交的探索阶段",
    "learningProgressExplorationValue"
  ));
  summaryHost.appendChild(createLearningProgressMetric(
    "迁移完成",
    learningProgressValue(totals.transferDone, totals.transferTotal),
    "已作答的现实同构题",
    "learningProgressTransferValue"
  ));
  summaryHost.appendChild(createLearningProgressMetric(
    "迁移得分",
    learningProgressValue(totals.rubricDone, totals.rubricTotal),
    "已掌握的评分要点",
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
  weakTitle.innerText = "待巩固知识点";
  weakHost.appendChild(weakTitle);
  if (!progress.weakKnowledge.length) {
    var empty = document.createElement("p");
    empty.className = "learning-progress-empty";
    empty.innerText = totals.completed ? "当前已完成部分尚未出现待巩固信号。" : "完成探索和迁移自评后，这里会汇总待巩固知识点。";
    weakHost.appendChild(empty);
    return;
  }
  var list = document.createElement("div");
  list.className = "learning-progress-weak-list";
  progress.weakKnowledge.forEach(function (item) {
    var chip = document.createElement("span");
    chip.innerText = item.name;
    chip.title = "来自 " + item.problems + " 道已开始但尚未完成的题";
    list.appendChild(chip);
  });
  weakHost.appendChild(list);
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
  renderLearningProgressOverview();
  loadLearningProgressCatalog();
  checkLearningSyncSession();
}
