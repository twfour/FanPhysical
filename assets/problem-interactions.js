// Favorites, collapsible analysis, and multi-turn step questions.

var favoriteProblemStorageKey = "fanphysics:favoritedProblems";
var stepConversationStorageKey = "fanphysics:stepConversations:v1";
var stepConversationState = {};
var stepConversationStateLoaded = false;
var activeStepVoiceRecognition = null;
var activeStepVoiceButton = null;
var activeStepVoiceStatus = null;

function readFavoriteProblems() {
  try {
    return JSON.parse(localStorage.getItem(favoriteProblemStorageKey) || "{}") || {};
  } catch (error) {
    return {};
  }
}

function writeFavoriteProblems(favorites) {
  try {
    localStorage.setItem(favoriteProblemStorageKey, JSON.stringify(favorites || {}));
  } catch (error) {
    // localStorage can fail in private or file contexts; the button still works for the current render.
  }
}

function getFavoriteProblemKey(sceneName) {
  return "scene:" + String(sceneName || "unknown");
}

function isFavoriteProblem(sceneName) {
  var favorites = readFavoriteProblems();
  return Boolean(favorites[getFavoriteProblemKey(sceneName)]);
}

function setFavoriteProblem(sceneName, title, active) {
  var favorites = readFavoriteProblems();
  var key = getFavoriteProblemKey(sceneName);
  if (active) {
    var catalogItem = findSceneCatalogItem(sceneName);
    favorites[key] = {
      scene: sceneName,
      title: (catalogItem && catalogItem.title) || title || sceneName,
      path: (catalogItem && catalogItem.path) || "",
      savedAt: new Date().toISOString()
    };
  } else {
    delete favorites[key];
  }
  writeFavoriteProblems(favorites);
  renderFavoriteHome();
}

function updateFavoriteButton(button, active) {
  button.classList.toggle("is-favorite", active);
  button.setAttribute("aria-pressed", active ? "true" : "false");
  button.innerText = active ? "♥" : "♡";
  button.title = active ? "取消收藏这道题" : "收藏这道题";
}

function ensureFavoriteButton(block, sceneName) {
  if (!block || block.querySelector(".favorite-toggle")) {
    return;
  }
  var kicker = block.querySelector(".problem-note-kicker");
  if (!kicker) {
    return;
  }
  var titleEl = block.querySelector("h2");
  var title = titleEl ? titleEl.innerText.trim() : sceneName;
  var button = document.createElement("button");
  button.type = "button";
  button.className = "favorite-toggle";
  button.setAttribute("aria-label", "收藏题目");
  updateFavoriteButton(button, isFavoriteProblem(sceneName));
  button.onclick = function (event) {
    event.preventDefault();
    event.stopPropagation();
    var active = !button.classList.contains("is-favorite");
    setFavoriteProblem(sceneName, title, active);
    updateFavoriteButton(button, active);
  };
  block.classList.add("has-favorite");
  kicker.appendChild(button);
}

function getSceneFromElement(element) {
  if (!element) {
    return "";
  }
  if (element.dataset && element.dataset.scene) {
    return element.dataset.scene;
  }
  var onclick = element.getAttribute("onclick") || "";
  var match = onclick.match(/switchScene\('([^']+)'\)/);
  return match ? match[1] : "";
}

function getScenePathFromElement(element) {
  var parts = [];
  var parent = element ? element.parentElement : null;
  while (parent) {
    if (parent.tagName === "DETAILS") {
      var summary = getDirectSummary(parent);
      if (summary) {
        parts.unshift(summary.textContent.trim());
      }
    }
    parent = parent.parentElement;
  }
  return parts.join(" / ");
}

function getDirectSummary(detailsElement) {
  if (!detailsElement || !detailsElement.children) {
    return null;
  }
  for (var i = 0; i < detailsElement.children.length; i += 1) {
    if (detailsElement.children[i].tagName === "SUMMARY") {
      return detailsElement.children[i];
    }
  }
  return null;
}

function getSceneCatalog() {
  var catalog = [];
  var seen = {};
  document.querySelectorAll(".sidebar .tree-item").forEach(function (item) {
    var sceneName = getSceneFromElement(item);
    if (!sceneName || sceneName === "home" || seen[sceneName]) {
      return;
    }
    seen[sceneName] = true;
    catalog.push({
      scene: sceneName,
      title: item.textContent.trim(),
      path: getScenePathFromElement(item)
    });
  });
  return catalog;
}

function findSceneCatalogItem(sceneName) {
  var catalog = getSceneCatalog();
  for (var i = 0; i < catalog.length; i += 1) {
    if (catalog[i].scene === sceneName) {
      return catalog[i];
    }
  }
  return null;
}

function stripProblemTitlePrefix(title) {
  return String(title || "").replace(/^(例|课上|第|补充|A|B|C|单)?\d+[：:-]\s*/, "").trim();
}

function getFavoriteSceneTitle(sceneName, catalogItem, favorite) {
  if (catalogItem && catalogItem.title) {
    return catalogItem.title;
  }
  var problem = problemDataMap[sceneName] || {};
  if (problem.title) {
    return stripProblemTitlePrefix(problem.title) || problem.title;
  }
  var note = document.getElementById(sceneName + "Notes");
  var heading = note ? note.querySelector(".problem-note-block h2") : null;
  if (heading && heading.innerText.trim()) {
    return stripProblemTitlePrefix(heading.innerText.trim()) || heading.innerText.trim();
  }
  if (favorite && favorite.title && !/^([a-z]+_|\w*[A-Z]\w*)/.test(favorite.title)) {
    return favorite.title;
  }
  return "收藏模型题";
}

function getFavoriteScenePath(sceneName, catalogItem, favorite) {
  if (catalogItem && catalogItem.path) {
    return catalogItem.path;
  }
  var problem = problemDataMap[sceneName] || {};
  if (problem.chapter === "圆周运动") {
    return "2026暑假班 / 圆周运动";
  }
  if (problem.chapter) {
    return problem.chapter;
  }
  if (modelSourceMap[sceneName] && modelSourceMap[sceneName].title) {
    return modelSourceMap[sceneName].title;
  }
  return (favorite && favorite.path) || "收藏模型题";
}

function renderFavoriteHome() {
  var grid = document.getElementById("favoriteHomeGrid");
  if (!grid) {
    return;
  }
  grid.innerHTML = "";
  var favorites = readFavoriteProblems();
  var catalog = getSceneCatalog();
  var catalogMap = {};
  var didUpgradeFavorites = false;
  catalog.forEach(function (item) {
    catalogMap[item.scene] = item;
    var key = getFavoriteProblemKey(item.scene);
    if (favorites[key] && (favorites[key].title !== item.title || favorites[key].path !== item.path)) {
      favorites[key].scene = item.scene;
      favorites[key].title = item.title;
      favorites[key].path = item.path;
      didUpgradeFavorites = true;
    }
  });
  if (didUpgradeFavorites) {
    writeFavoriteProblems(favorites);
  }
  function appendFavoriteCard(key) {
    var favorite = favorites[key] || {};
    var sceneName = favorite.scene || String(key).replace(/^scene:/, "");
    var item = catalogMap[sceneName] || {};
    var titleText = getFavoriteSceneTitle(sceneName, item, favorite);
    var pathText = getFavoriteScenePath(sceneName, item, favorite);
    if (!sceneName) {
      return;
    }
    var card = document.createElement("button");
    card.type = "button";
    card.className = "home-card favorite-home-card";
    card.onclick = function () {
      switchScene(sceneName);
    };
    var mark = document.createElement("span");
    mark.className = "favorite-home-mark";
    mark.innerText = "♥";
    var title = document.createElement("strong");
    title.innerText = titleText;
    var meta = document.createElement("span");
    meta.innerText = pathText;
    card.appendChild(mark);
    card.appendChild(title);
    card.appendChild(meta);
    grid.appendChild(card);
  }
  catalog.forEach(function (item) {
    var key = getFavoriteProblemKey(item.scene);
    if (favorites[key]) {
      appendFavoriteCard(key);
    }
  });
  Object.keys(favorites).forEach(function (key) {
    var favorite = favorites[key] || {};
    var sceneName = favorite.scene || String(key).replace(/^scene:/, "");
    if (!catalogMap[sceneName]) {
      appendFavoriteCard(key);
    }
  });
}

function enhanceProblemNotes(root) {
  var notes = root ? [root] : document.querySelectorAll(".problem-notes");
  notes.forEach(function (note) {
    var sceneName = note.id.replace("Notes", "");
    var grid = note.querySelector(".problem-notes-grid");
    if (!grid) {
      return;
    }

    var blocks = grid.querySelectorAll(".problem-note-block");
    blocks.forEach(function (block, index) {
      var kicker = block.querySelector(".problem-note-kicker");
      var kickerText = kicker ? kicker.innerText.trim() : "";
      if (kickerText === "题目") {
        ensureFavoriteButton(block, sceneName);
      }
      var existingBody = block.querySelector(".note-body");
      if (existingBody) {
        var existingToggle = block.querySelector(":scope > .note-toggle");
        if (existingToggle && existingToggle.dataset.toggleEnhanced !== "1") {
          existingToggle.dataset.toggleEnhanced = "1";
          existingToggle.onclick = function () {
            var collapsed = block.classList.toggle("is-collapsed");
            existingToggle.innerText = collapsed ? "展开" : "收起";
            if (!collapsed && isAnalysisNoteBlock(block)) {
              addStepAiButtons(existingBody, sceneName);
            }
            renderMath(block);
          };
        }
        wireCollapsedAnalysisSteps(existingBody, sceneName);
        return;
      }
      var body = document.createElement("div");
      body.className = "note-body";
      var children = Array.prototype.slice.call(block.children);
      children.forEach(function (child) {
        if (child.classList && child.classList.contains("problem-note-kicker")) {
          return;
        }
        if (child.classList && child.classList.contains("favorite-toggle")) {
          return;
        }
        body.appendChild(child);
      });
      var hasCollapsibleSteps = body.querySelector('details.analysis-step[data-collapsible-step="1"]');
      if (hasCollapsibleSteps && isAnalysisNoteBlock(block)) {
        wireCollapsedAnalysisSteps(body, sceneName);
      } else if (index > 0 && kickerText !== "近似题" && block.dataset.keepExpanded !== "1") {
        block.classList.add("is-collapsed");
        var toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "note-toggle";
        toggle.innerText = "展开";
        toggle.onclick = function () {
          var collapsed = block.classList.toggle("is-collapsed");
          toggle.innerText = collapsed ? "展开" : "收起";
          if (!collapsed && isAnalysisNoteBlock(block)) {
            addStepAiButtons(body, sceneName);
          }
          renderMath(block);
        };
        block.appendChild(toggle);
      }
      block.appendChild(body);
    });

  });
}

function wireCollapsedAnalysisSteps(body, sceneName) {
  var steps = body.querySelectorAll('details.analysis-step[data-collapsible-step="1"]');
  steps.forEach(function (step) {
    step.open = false;
    if (step.dataset.collapseEnhanced === "1") {
      return;
    }
    step.dataset.collapseEnhanced = "1";
    step.addEventListener("toggle", function () {
      if (step.open) {
        addStepConversationPanels(step, sceneName);
        renderMath(step);
      }
    });
  });
}

function isAnalysisNoteBlock(block) {
  if (!block) {
    return false;
  }
  if (block.dataset.analysisBlock === "1") {
    return true;
  }
  var kicker = block.querySelector(".problem-note-kicker");
  return kicker && kicker.innerText.trim() === "解析";
}

function addStepAiButtons(body, sceneName) {
  addStepConversationPanels(body, sceneName);
}

function addStepConversationPanels(body, sceneName) {
  var isCollapsedStep = body && body.matches
    ? body.matches('details.analysis-step[data-collapsible-step="1"]')
    : false;
  if (isCollapsedStep && body.querySelector(".step-conversation")) {
    return;
  }
  var paragraphs = getStepAiParagraphs(body).filter(function (paragraph) {
    return !paragraph.closest(".step-conversation");
  });
  if (isCollapsedStep && paragraphs.length) {
    paragraphs = [paragraphs[paragraphs.length - 1]];
  }
  paragraphs.forEach(function (paragraph, paragraphIndex) {
    if (paragraph.nextElementSibling && paragraph.nextElementSibling.classList.contains("step-conversation")) {
      return;
    }
    var analysisStep = paragraph.closest(".analysis-step");
    var stepIndex = analysisStep && analysisStep.dataset.stepIndex !== undefined
      ? Number(analysisStep.dataset.stepIndex)
      : paragraphIndex;
    var conversationId = sceneName + ":" + String(stepIndex + 1);
    var panel = document.createElement("section");
    panel.className = "step-ai-tools step-conversation";
    panel.dataset.conversationId = conversationId;

    var header = document.createElement("div");
    header.className = "step-conversation-header";
    var title = document.createElement("strong");
    title.innerText = "针对本步骤提问";
    var clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "step-conversation-clear";
    clearButton.innerText = "清空对话";
    header.appendChild(title);
    header.appendChild(clearButton);
    panel.appendChild(header);

    var history = document.createElement("div");
    history.className = "step-conversation-history";
    history.setAttribute("aria-live", "polite");
    panel.appendChild(history);

    var composer = document.createElement("div");
    composer.className = "step-conversation-composer";
    var input = document.createElement("textarea");
    input.className = "step-conversation-input";
    input.rows = 2;
    input.maxLength = 1200;
    input.placeholder = "口述或输入对这一步的疑问";
    input.setAttribute("aria-label", "本步骤的问题");
    var voiceButton = document.createElement("button");
    voiceButton.type = "button";
    voiceButton.className = "step-conversation-voice";
    voiceButton.innerText = "口述提问";
    voiceButton.title = "使用麦克风输入问题";
    var sendButton = document.createElement("button");
    sendButton.type = "button";
    sendButton.className = "step-conversation-send";
    sendButton.innerText = "发送";
    composer.appendChild(input);
    composer.appendChild(voiceButton);
    composer.appendChild(sendButton);
    panel.appendChild(composer);

    var status = document.createElement("p");
    status.className = "step-conversation-status";
    status.setAttribute("aria-live", "polite");
    status.innerText = getSpeechRecognitionConstructor()
      ? "口述内容会先填入输入框，可修改后发送"
      : "当前浏览器不支持口述，可直接输入问题";
    panel.appendChild(status);

    voiceButton.disabled = !getSpeechRecognitionConstructor();
    voiceButton.onclick = function () {
      if (activeStepVoiceButton === voiceButton) {
        stopStepVoiceRecognition(false);
        return;
      }
      startStepVoiceRecognition(input, voiceButton, status);
    };
    sendButton.onclick = function () {
      askStepConversation(paragraph, panel, input, paragraphIndex, sceneName);
    };
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        askStepConversation(paragraph, panel, input, paragraphIndex, sceneName);
      }
    });
    clearButton.onclick = function () {
      if (panel.dataset.pending === "1") {
        return;
      }
      stepConversationState[conversationId] = [];
      saveStepConversationState();
      renderStepConversation(history, conversationId);
      status.classList.remove("is-error");
      status.innerText = "对话已清空，可以重新提问";
    };

    panel._historyElement = history;
    panel._voiceButton = voiceButton;
    panel._sendButton = sendButton;
    panel._clearButton = clearButton;
    panel._statusElement = status;
    renderStepConversation(history, conversationId);
    paragraph.insertAdjacentElement("afterend", panel);
  });
}

function loadStepConversationState() {
  if (stepConversationStateLoaded) {
    return;
  }
  stepConversationStateLoaded = true;
  try {
    var saved = window.sessionStorage.getItem(stepConversationStorageKey);
    var parsed = saved ? JSON.parse(saved) : {};
    stepConversationState = parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    stepConversationState = {};
  }
}

function saveStepConversationState() {
  try {
    window.sessionStorage.setItem(stepConversationStorageKey, JSON.stringify(stepConversationState));
  } catch (error) {
    return;
  }
}

function getStepConversation(conversationId) {
  loadStepConversationState();
  var history = stepConversationState[conversationId];
  return Array.isArray(history) ? history : [];
}

function trimStepConversation(history) {
  var trimmed = history.slice(-12);
  while (trimmed.length && trimmed[0].role !== "user") {
    trimmed.shift();
  }
  return trimmed;
}

function appendStepConversationMessage(conversationId, role, content) {
  var history = getStepConversation(conversationId).slice();
  history.push({ role: role, content: content });
  stepConversationState[conversationId] = trimStepConversation(history);
  saveStepConversationState();
}

function removeLastStepConversationMessage(conversationId, role, content) {
  var history = getStepConversation(conversationId).slice();
  var last = history[history.length - 1];
  if (last && last.role === role && last.content === content) {
    history.pop();
  }
  stepConversationState[conversationId] = history;
  saveStepConversationState();
}

function renderStepConversation(target, conversationId) {
  if (!target) {
    return;
  }
  var history = getStepConversation(conversationId);
  target.innerHTML = "";
  if (!history.length) {
    var empty = document.createElement("p");
    empty.className = "step-conversation-empty";
    empty.innerText = "还没有提问。你可以围绕这一小步连续追问。";
    target.appendChild(empty);
    return;
  }
  history.forEach(function (message) {
    var item = document.createElement("div");
    item.className = "step-conversation-message is-" + message.role;
    var role = document.createElement("span");
    role.className = "step-conversation-role";
    role.innerText = message.role === "user" ? "你" : "AI";
    var content = document.createElement("div");
    content.className = "step-conversation-content";
    if (message.role === "assistant") {
      content.innerHTML = markdownLiteToHtml(message.content);
    } else {
      content.innerText = message.content;
    }
    item.appendChild(role);
    item.appendChild(content);
    target.appendChild(item);
  });
  target.scrollTop = target.scrollHeight;
  renderMath(target);
}

function setStepConversationPending(panel, pending) {
  panel.dataset.pending = pending ? "1" : "0";
  panel._sendButton.disabled = pending;
  panel._clearButton.disabled = pending;
  panel._voiceButton.disabled = pending || !getSpeechRecognitionConstructor();
}

async function askStepConversation(paragraph, panel, input, fallbackStepIndex, sceneName) {
  if (!paragraph || !panel || panel.dataset.pending === "1") {
    return;
  }
  var question = input.value.trim();
  var status = panel._statusElement;
  if (!question) {
    status.classList.add("is-error");
    status.innerText = "请先口述或输入问题";
    input.focus();
    return;
  }
  stopStepVoiceRecognition(true);
  var conversationId = panel.dataset.conversationId;
  var previousHistory = getStepConversation(conversationId).map(function (message) {
    return { role: message.role, content: message.content };
  });
  var context = getStepContext(paragraph, question, "conversation", fallbackStepIndex);
  context.conversationHistory = previousHistory;
  appendStepConversationMessage(conversationId, "user", question);
  input.value = "";
  renderStepConversation(panel._historyElement, conversationId);
  setStepConversationPending(panel, true);
  status.classList.remove("is-error");
  status.innerText = "AI 正在结合当前步骤回答...";

  try {
    var response = await fetch("/api/step-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context)
    });
    var data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "请求失败");
    }
    appendStepConversationMessage(conversationId, "assistant", data.answer);
    incrementStudentState(sceneName, context.stepId);
    renderStepConversation(panel._historyElement, conversationId);
    status.innerText = "可以继续口述或输入追问";
  } catch (error) {
    removeLastStepConversationMessage(conversationId, "user", question);
    renderStepConversation(panel._historyElement, conversationId);
    input.value = question;
    status.classList.add("is-error");
    status.innerText = "暂时无法回答，问题已保留。错误：" + error.message;
  } finally {
    setStepConversationPending(panel, false);
  }
}

function getSpeechRecognitionConstructor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function startStepVoiceRecognition(input, button, status) {
  var Recognition = getSpeechRecognitionConstructor();
  if (!Recognition) {
    status.classList.add("is-error");
    status.innerText = "当前浏览器不支持口述，请直接输入问题";
    return;
  }
  stopStepVoiceRecognition(true);
  var recognition = new Recognition();
  var initialText = input.value.trim();
  var finalTranscript = "";
  var recognitionError = "";
  recognition.lang = "zh-CN";
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  activeStepVoiceRecognition = recognition;
  activeStepVoiceButton = button;
  activeStepVoiceStatus = status;
  button.classList.add("is-listening");
  button.innerText = "停止录音";
  status.classList.remove("is-error");
  status.innerText = "正在聆听，请说出问题...";

  recognition.onresult = function (event) {
    var interimTranscript = "";
    for (var i = event.resultIndex; i < event.results.length; i += 1) {
      var transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    input.value = [initialText, finalTranscript + interimTranscript].filter(Boolean).join(" ");
  };
  recognition.onerror = function (event) {
    var messages = {
      "not-allowed": "没有获得麦克风权限",
      "audio-capture": "没有检测到可用麦克风",
      "no-speech": "没有听到清晰语音",
      network: "语音识别网络不可用",
      aborted: "录音已停止"
    };
    recognitionError = messages[event.error] || "语音识别失败";
    if (event.error !== "aborted") {
      status.classList.add("is-error");
    }
    status.innerText = recognitionError;
  };
  recognition.onend = function () {
    if (activeStepVoiceRecognition === recognition) {
      activeStepVoiceRecognition = null;
      activeStepVoiceButton = null;
      activeStepVoiceStatus = null;
    }
    button.classList.remove("is-listening");
    button.innerText = "口述提问";
    if (!recognitionError) {
      status.innerText = input.value.trim()
        ? "识别完成，可修改后发送"
        : "没有识别到内容，请再试一次";
    }
  };
  try {
    recognition.start();
  } catch (error) {
    stopStepVoiceRecognition(true);
    status.classList.add("is-error");
    status.innerText = "无法启动麦克风：" + error.message;
  }
}

function stopStepVoiceRecognition(abortRecognition) {
  var recognition = activeStepVoiceRecognition;
  var button = activeStepVoiceButton;
  var status = activeStepVoiceStatus;
  if (!recognition) {
    return;
  }
  activeStepVoiceRecognition = null;
  activeStepVoiceButton = null;
  activeStepVoiceStatus = null;
  try {
    if (abortRecognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    } else {
      recognition.stop();
    }
  } catch (error) {
    return;
  } finally {
    if (button) {
      button.classList.remove("is-listening");
      button.innerText = "口述提问";
    }
    if (status && !abortRecognition) {
      status.classList.remove("is-error");
      status.innerText = "录音已停止，可修改后发送";
    }
  }
}

function getStepAiParagraphs(body) {
  if (!body) {
    return [];
  }
  var jsonStepParagraphs = Array.prototype.slice.call(body.querySelectorAll(".analysis-step p"));
  if (jsonStepParagraphs.length) {
    return jsonStepParagraphs;
  }
  var directParagraphs = Array.prototype.slice.call(body.children).filter(function (child) {
    return child.tagName === "P";
  });
  var numberedParagraphs = directParagraphs.filter(function (paragraph) {
    var text = paragraph.innerText.trim();
    return /^\d+\s*[.、．]/.test(text);
  });
  if (numberedParagraphs.length) {
    return numberedParagraphs;
  }
  return directParagraphs.filter(function (paragraph) {
    return !/^答案[：:]/.test(paragraph.innerText.trim());
  });
}

function getStepContext(paragraph, prompt, intent, fallbackStepIndex) {
  var note = document.querySelector("#" + currentScene + "Notes");
  var block = paragraph ? paragraph.closest(".problem-note-block") : null;
  var analysisStep = paragraph ? paragraph.closest(".analysis-step") : null;
  var body = paragraph ? paragraph.closest(".note-body") : null;
  var paragraphs = body ? Array.prototype.slice.call(body.querySelectorAll("p")) : [];
  var noteBlocks = note ? Array.prototype.slice.call(note.querySelectorAll(".problem-note-block")) : [];
  var blockIndex = block ? noteBlocks.indexOf(block) : -1;
  var stepIndex = analysisStep && analysisStep.dataset.stepIndex
    ? Number(analysisStep.dataset.stepIndex)
    : block && block.dataset.stepIndex
    ? Number(block.dataset.stepIndex)
    : (blockIndex > 0 ? blockIndex - 1 : (paragraph ? paragraphs.indexOf(paragraph) : fallbackStepIndex));
  var source = modelSourceMap[currentScene] || {};
  var problemData = problemDataMap[currentScene];
  var problemAnalysisSteps = getProblemAnalysisItems(problemData);
  var heading = block ? block.querySelector("h2") : null;
  var kicker = block ? block.querySelector(".problem-note-kicker") : null;
  var isAnalysisOverview = problemData && problemData.analysis && block && block.dataset.analysisBlock === "1" && !analysisStep;
  var dataStep = !isAnalysisOverview ? problemAnalysisSteps[stepIndex] : null;
  var stepTitle = "";
  var strong = paragraph ? paragraph.querySelector("strong") : null;
  if (dataStep && dataStep.title) {
    stepTitle = dataStep.title;
  } else if (isAnalysisOverview && problemData.analysis.title) {
    stepTitle = problemData.analysis.title;
  } else if (strong) {
    stepTitle = strong.innerText.replace(/[：:。.\s]+$/, "");
  } else if (heading) {
    stepTitle = heading.innerText;
  }

  return {
    problemId: currentScene,
    problemTitle: (problemData && problemData.title) || source.title || currentScene,
    problemQuestion: (problemData && problemData.question) || "",
    referenceAnswer: (problemData && problemData.answer) || "",
    solutionSteps: problemAnalysisSteps.length
      ? problemAnalysisSteps.map(function (item) {
        return { title: item.title || "", content: item.content || "" };
      })
      : [],
    stepId: isAnalysisOverview ? "analysis" : stepIndex + 1,
    stepTitle: stepTitle || "当前步骤",
    stepContent: (dataStep && dataStep.content) || (isAnalysisOverview && problemData.analysis.content) || (paragraph ? paragraph.innerText : ""),
    previousSteps: !isAnalysisOverview && problemAnalysisSteps.length
      ? problemAnalysisSteps.slice(0, Math.max(stepIndex, 0)).map(function (item) {
        return item.title + "：" + item.content;
      })
      : paragraphs.slice(0, Math.max(stepIndex, 0)).map(function (item) {
        return item.innerText;
      }),
    knowledge: (dataStep && dataStep.knowledge) || (problemData && problemData.knowledge) || knowledgePointMap[currentScene] || [],
    commonMistakes: (dataStep && dataStep.commonMistakes) || getCommonMistakes(currentScene),
    animationState: getAnimationState(currentScene),
    studentState: getStudentState(currentScene, stepIndex + 1),
    intent: intent,
    userQuestion: prompt,
    noteTitle: note ? (note.querySelector(".problem-note-block h2") || {}).innerText : "",
    animationRange: dataStep ? dataStep.animationRange : null
  };
}

function getCommonMistakes(sceneName) {
  var defaults = {
    projectileBasic: ["误认为水平速度会变小", "混淆位移方向和速度方向"],
    projectileSlope: ["只看水平位移，不看斜面几何", "误认为末速度方向随落点改变"],
    riverCrossing: ["把船速直接当合速度", "忘记分解垂直河岸分量"],
    curveForce: ["把速度方向当成合力方向", "忽略切向分力对快慢的影响"],
    rodConstraint: ["没有把速度投影到杆方向", "误把两端速度大小看成相等"],
    bikeGear: ["混淆同轴角速度相等和链条线速度相等"]
  };
  return defaults[sceneName] || [];
}
