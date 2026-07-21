// Local persistence and authenticated cross-device synchronization for learning responses.
var studentExplorationStorageKey = "fanphysics:studentExploration:v1";
var realLifeResponseStorageKey = "fanphysics:realLifeResponses:v1";
var realLifeRubricStorageKey = "fanphysics:realLifeRubric:v1";
var learningSyncStatus = "unknown";
var learningSyncAuthenticated = false;
var learningSyncError = "";
var learningSyncCheckPromise = null;
var learningSyncSaveTimer = null;
var learningSyncPanels = [];

function readLearningResponseStore(storageKey) {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
  } catch (error) {
    return {};
  }
}

function isLearningCheckStore(storageKey) {
  return storageKey === realLifeRubricStorageKey;
}

function normalizeLearningRecord(storageKey, record) {
  var checksStore = isLearningCheckStore(storageKey);
  if (!checksStore && typeof record === "string") {
    return { value: record, updatedAt: 0, deleted: !record };
  }
  if (checksStore && Array.isArray(record)) {
    return { value: record, updatedAt: 0, deleted: !record.length };
  }
  if (!record || typeof record !== "object") {
    return null;
  }
  var updatedAt = Number(record.updatedAt);
  if (!Number.isFinite(updatedAt) || updatedAt < 0) updatedAt = 0;
  if (checksStore) {
    var rawChecks = Array.isArray(record.value) ? record.value : [];
    var checks = rawChecks.filter(function (index, position) {
      return Number.isInteger(index) && index >= 0 && index < 20 && rawChecks.indexOf(index) === position;
    }).sort(function (a, b) {
      return a - b;
    });
    return { value: checks, updatedAt: updatedAt, deleted: Boolean(record.deleted) || !checks.length };
  }
  var value = typeof record.value === "string" ? record.value : "";
  return { value: value, updatedAt: updatedAt, deleted: Boolean(record.deleted) || !value };
}

function normalizeLearningStore(storageKey, store) {
  var normalized = {};
  if (!store || typeof store !== "object") return normalized;
  Object.keys(store).forEach(function (key) {
    var record = normalizeLearningRecord(storageKey, store[key]);
    if (record) normalized[key] = record;
  });
  return normalized;
}

function persistLearningStore(storageKey, store) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(store));
  } catch (error) {
    // Private browsing can reject storage; the current answer still remains on screen.
  }
}

function writeLearningValue(storageKey, responseKey, value) {
  var responses = normalizeLearningStore(storageKey, readLearningResponseStore(storageKey));
  var deleted = isLearningCheckStore(storageKey) ? !value.length : !value;
  responses[responseKey] = {
    value: value,
    updatedAt: Date.now(),
    deleted: deleted
  };
  persistLearningStore(storageKey, responses);
  scheduleLearningStateSync();
}

function writeLearningResponse(storageKey, responseKey, value) {
  writeLearningValue(storageKey, responseKey, String(value || ""));
}

function getLearningResponse(storageKey, responseKey) {
  var record = normalizeLearningRecord(storageKey, readLearningResponseStore(storageKey)[responseKey]);
  return record && !record.deleted ? String(record.value || "") : "";
}

function writeLearningChecks(responseKey, checks) {
  writeLearningValue(realLifeRubricStorageKey, responseKey, checks.slice());
}

function getLearningChecks(responseKey) {
  var record = normalizeLearningRecord(
    realLifeRubricStorageKey,
    readLearningResponseStore(realLifeRubricStorageKey)[responseKey]
  );
  return record && !record.deleted && Array.isArray(record.value) ? record.value.slice() : [];
}

function getLearningSyncStoreDefinitions() {
  return [
    { name: "exploration", storageKey: studentExplorationStorageKey },
    { name: "realLife", storageKey: realLifeResponseStorageKey },
    { name: "realLifeChecks", storageKey: realLifeRubricStorageKey }
  ];
}

function collectLearningSyncState() {
  var stores = {};
  getLearningSyncStoreDefinitions().forEach(function (definition) {
    stores[definition.name] = normalizeLearningStore(
      definition.storageKey,
      readLearningResponseStore(definition.storageKey)
    );
  });
  return { version: 1, updatedAt: Date.now(), stores: stores };
}

function mergeLearningSyncState(remoteState) {
  var remoteStores = remoteState && remoteState.stores && typeof remoteState.stores === "object"
    ? remoteState.stores
    : {};
  var changed = false;
  getLearningSyncStoreDefinitions().forEach(function (definition) {
    var localStore = normalizeLearningStore(
      definition.storageKey,
      readLearningResponseStore(definition.storageKey)
    );
    var remoteStore = normalizeLearningStore(definition.storageKey, remoteStores[definition.name]);
    Object.keys(remoteStore).forEach(function (key) {
      var localRecord = localStore[key];
      var remoteRecord = remoteStore[key];
      if (!localRecord || remoteRecord.updatedAt > localRecord.updatedAt) {
        localStore[key] = remoteRecord;
        changed = true;
      }
    });
    persistLearningStore(definition.storageKey, localStore);
  });
  return changed;
}

function refreshCurrentLearningNotes() {
  var problem = problemDataMap[currentScene];
  if (!problem || !problem.studentExploration && !problem.realLifeCase) return;
  var note = renderProblemDataNotes(problem);
  if (note) {
    enhanceProblemNotes(note);
    renderMath(note);
  }
}

function learningSyncStatusText() {
  if (learningSyncStatus === "checking") return "正在检查服务器同步状态…";
  if (learningSyncStatus === "syncing" || learningSyncStatus === "pending") return "本机已保存，正在同步到服务器…";
  if (learningSyncStatus === "synced") return "已开启跨设备同步，学习记录已保存到服务器。";
  if (learningSyncStatus === "error") return learningSyncError || "服务器暂时无法连接，记录仍已保存在本机。";
  return "当前仅保存在这台设备；登录后可跨设备同步。";
}

function updateLearningSyncPanels() {
  learningSyncPanels = learningSyncPanels.filter(function (panel) {
    return panel && panel.isConnected;
  });
  learningSyncPanels.forEach(function (panel) {
    var refs = panel.learningSyncRefs;
    if (!refs) return;
    refs.status.innerText = learningSyncStatusText();
    refs.form.hidden = learningSyncAuthenticated;
    refs.connectedActions.hidden = !learningSyncAuthenticated;
    refs.password.disabled = learningSyncStatus === "checking" || learningSyncStatus === "syncing";
    refs.login.disabled = refs.password.disabled;
    refs.sync.disabled = learningSyncStatus === "syncing";
    refs.logout.disabled = learningSyncStatus === "syncing";
  });
  document.querySelectorAll(".real-life-case-block .learning-save-status").forEach(function (status) {
    var block = status.closest(".real-life-case-block");
    var textarea = block ? block.querySelector("textarea") : null;
    if (textarea && textarea.value.trim()) {
      if (!learningSyncAuthenticated) {
        status.innerText = "已保存在当前浏览器";
      } else if (learningSyncStatus === "pending" || learningSyncStatus === "syncing") {
        status.innerText = "已保存在本机，正在同步";
      } else {
        status.innerText = "已保存并同步到服务器";
      }
    }
  });
}

async function checkLearningSyncSession() {
  if (learningSyncStatus !== "unknown" || learningSyncCheckPromise) return learningSyncCheckPromise;
  learningSyncStatus = "checking";
  updateLearningSyncPanels();
  learningSyncCheckPromise = fetch("/api/learning-state", {
    credentials: "same-origin",
    cache: "no-store"
  }).then(function (response) {
    if (response.status === 401 || response.status === 503) {
      learningSyncAuthenticated = false;
      learningSyncStatus = "local";
      return null;
    }
    if (!response.ok) throw new Error("sync_status_" + response.status);
    return response.json();
  }).then(function (result) {
    if (!result || !result.ok) return;
    learningSyncAuthenticated = true;
    var changed = mergeLearningSyncState(result.state);
    learningSyncStatus = "synced";
    if (changed) refreshCurrentLearningNotes();
  }).catch(function () {
    learningSyncAuthenticated = false;
    learningSyncStatus = "error";
    learningSyncError = "服务器暂时无法连接，记录仍已保存在本机。";
  }).finally(function () {
    learningSyncCheckPromise = null;
    updateLearningSyncPanels();
  });
  return learningSyncCheckPromise;
}

async function authenticateLearningSync(password) {
  learningSyncStatus = "checking";
  learningSyncError = "";
  updateLearningSyncPanels();
  try {
    var response = await fetch("/api/learning-auth", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: password })
    });
    var result = await response.json();
    if (!response.ok || !result.ok) {
      learningSyncAuthenticated = false;
      learningSyncStatus = "local";
      if (response.status === 401) throw new Error("同步密码不正确。");
      if (response.status === 429) throw new Error("尝试次数过多，请稍后再试。");
      if (response.status === 503) throw new Error("服务器尚未配置学习记录同步。");
      throw new Error("无法启用跨设备同步。");
    }
    learningSyncAuthenticated = true;
    var changed = mergeLearningSyncState(result.state);
    learningSyncStatus = "synced";
    if (changed) refreshCurrentLearningNotes();
    await syncLearningStateNow();
    return true;
  } catch (error) {
    learningSyncError = error && error.message ? error.message : "无法连接服务器，记录仍已保存在本机。";
    learningSyncStatus = "error";
    updateLearningSyncPanels();
    return false;
  }
}

async function syncLearningStateNow() {
  if (!learningSyncAuthenticated) return false;
  if (learningSyncSaveTimer) {
    clearTimeout(learningSyncSaveTimer);
    learningSyncSaveTimer = null;
  }
  learningSyncStatus = "syncing";
  learningSyncError = "";
  updateLearningSyncPanels();
  try {
    var response = await fetch("/api/learning-state", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: collectLearningSyncState() })
    });
    var result = await response.json();
    if (response.status === 401) {
      learningSyncAuthenticated = false;
      throw new Error("同步会话已失效，请重新登录。");
    }
    if (!response.ok || !result.ok) throw new Error("服务器同步失败，记录仍已保存在本机。");
    var changed = mergeLearningSyncState(result.state);
    learningSyncStatus = "synced";
    if (changed) refreshCurrentLearningNotes();
    updateLearningSyncPanels();
    return true;
  } catch (error) {
    learningSyncError = error && error.message ? error.message : "服务器同步失败，记录仍已保存在本机。";
    learningSyncStatus = "error";
    updateLearningSyncPanels();
    return false;
  }
}

function scheduleLearningStateSync() {
  if (!learningSyncAuthenticated) {
    updateLearningSyncPanels();
    return;
  }
  if (learningSyncSaveTimer) clearTimeout(learningSyncSaveTimer);
  learningSyncStatus = "pending";
  updateLearningSyncPanels();
  learningSyncSaveTimer = setTimeout(function () {
    learningSyncSaveTimer = null;
    syncLearningStateNow();
  }, 600);
}

async function logoutLearningSync() {
  try {
    await fetch("/api/learning-logout", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    });
  } catch (error) {
    // Local mode remains available even if the server cannot be reached.
  }
  learningSyncAuthenticated = false;
  learningSyncStatus = "local";
  learningSyncError = "";
  updateLearningSyncPanels();
}

function createLearningSyncPanel() {
  var panel = document.createElement("section");
  panel.className = "learning-sync-panel";

  var copy = document.createElement("div");
  copy.className = "learning-sync-copy";
  var title = document.createElement("strong");
  title.innerText = "学习记录";
  var status = document.createElement("span");
  status.setAttribute("aria-live", "polite");
  copy.appendChild(title);
  copy.appendChild(status);

  var form = document.createElement("form");
  form.className = "learning-sync-form";
  var password = document.createElement("input");
  password.type = "password";
  password.autocomplete = "current-password";
  password.placeholder = "同步密码";
  password.setAttribute("aria-label", "学习记录同步密码");
  var login = document.createElement("button");
  login.type = "submit";
  login.className = "learning-primary-action";
  login.innerText = "启用跨设备同步";
  form.appendChild(password);
  form.appendChild(login);

  var connectedActions = document.createElement("div");
  connectedActions.className = "learning-sync-actions";
  var sync = document.createElement("button");
  sync.type = "button";
  sync.className = "learning-secondary-action";
  sync.innerText = "立即同步";
  var logout = document.createElement("button");
  logout.type = "button";
  logout.className = "learning-secondary-action";
  logout.innerText = "退出同步";
  connectedActions.appendChild(sync);
  connectedActions.appendChild(logout);

  form.onsubmit = async function (event) {
    event.preventDefault();
    if (!password.value) {
      password.focus();
      return;
    }
    var succeeded = await authenticateLearningSync(password.value);
    if (succeeded) password.value = "";
  };
  sync.onclick = function () {
    syncLearningStateNow();
  };
  logout.onclick = function () {
    logoutLearningSync();
  };

  panel.appendChild(copy);
  panel.appendChild(form);
  panel.appendChild(connectedActions);
  panel.learningSyncRefs = {
    status: status,
    form: form,
    password: password,
    login: login,
    connectedActions: connectedActions,
    sync: sync,
    logout: logout
  };
  status.innerText = learningSyncStatusText();
  form.hidden = learningSyncAuthenticated;
  connectedActions.hidden = !learningSyncAuthenticated;
  learningSyncPanels.push(panel);
  setTimeout(function () {
    updateLearningSyncPanels();
    checkLearningSyncSession();
  }, 0);
  return panel;
}
