#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

var ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
var PROBLEM_ID = "required2_single_01_history";
var LEARNING_SYNC_TEST_PASSWORD = "fanphysics-learning-browser-test";
var NOTEBOOKLM_TEST_PASSWORD = "fanphysics-notebook-browser-test";
var EXPLORATION_ANSWER = "轨道数据只能确定规律，测量引力常量还需要独立实验。";
var REAL_LIFE_ANSWER = "轨道观测得到 GM，只有独立测得 G 后才能求出地球质量。";
var tempDirectory = mkdtempSync(path.join(os.tmpdir(), "fanphysics-browser-"));
var serverProcess = null;
var browser = null;
var serverOutput = "";

function delay(milliseconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, milliseconds);
  });
}

async function findAvailablePort() {
  var probe = net.createServer();
  await new Promise(function (resolve, reject) {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });
  var address = probe.address();
  var port = address && typeof address === "object" ? address.port : 0;
  await new Promise(function (resolve) {
    probe.close(resolve);
  });
  if (!port) throw new Error("Unable to reserve a browser-test port");
  return port;
}

async function waitUntil(check, label, timeoutMilliseconds) {
  var deadline = Date.now() + (timeoutMilliseconds || 10000);
  var lastError = null;
  while (Date.now() < deadline) {
    try {
      if (await check()) return;
    } catch (error) {
      lastError = error;
    }
    await delay(80);
  }
  var message = "Timed out waiting for " + label;
  if (lastError) message += ": " + lastError.message;
  throw new Error(message);
}

async function waitForServer(baseUrl) {
  await waitUntil(async function () {
    try {
      var response = await fetch(baseUrl + "/api/health", { cache: "no-store" });
      return response.ok;
    } catch (error) {
      return false;
    }
  }, "the isolated FanPhysics server", 15000);
}

async function stopServer() {
  if (!serverProcess || serverProcess.exitCode !== null || serverProcess.signalCode !== null) return;
  serverProcess.kill("SIGTERM");
  await Promise.race([once(serverProcess, "exit"), delay(2000)]);
  if (serverProcess.exitCode === null && serverProcess.signalCode === null) {
    var forcedExit = once(serverProcess, "exit");
    serverProcess.kill("SIGKILL");
    await Promise.race([forcedExit, delay(2000)]);
  }
}

async function requireOne(locator, label) {
  var count = await locator.count();
  assert.equal(count, 1, label + " should resolve to one element");
  return locator;
}

async function ensureTreeBranchOpen(page, label) {
  var summary = page.locator(".sidebar summary.tree-subfolder").filter({ hasText: label });
  await requireOne(summary, label + " tree branch");
  var isOpen = await summary.evaluate(function (element) {
    return Boolean(element.parentElement && element.parentElement.open);
  });
  if (!isOpen) await summary.click();
}

async function expandNoteBlock(block, label) {
  var isCollapsed = await block.evaluate(function (element) {
    return element.classList.contains("is-collapsed");
  });
  if (isCollapsed) {
    var toggle = block.locator(":scope > button.note-toggle");
    await requireOne(toggle, label + " expand button");
    await toggle.click();
  }
  await block.locator(":scope > .note-body").waitFor({ state: "visible", timeout: 10000 });
}

async function expandLearningBlocks(page) {
  await expandNoteBlock(page.locator(".student-exploration-block"), "student exploration");
  await expandNoteBlock(page.locator(".real-life-case-block"), "real-life case");
}

async function openRegressionProblem(page) {
  await page.locator("#canvas-holder canvas").waitFor({ state: "attached", timeout: 10000 });
  await ensureTreeBranchOpen(page, "2026暑假班");
  await ensureTreeBranchOpen(page, "必修二结业测试");
  var item = page.locator('button[data-scene="' + PROBLEM_ID + '"]');
  await requireOne(item, "regression problem tree item");
  await item.click();
  await page.locator("#" + PROBLEM_ID + "Notes").waitFor({ state: "visible", timeout: 10000 });
  await page.locator(".student-exploration-block").waitFor({ state: "visible", timeout: 10000 });
  await page.locator(".real-life-case-block").waitFor({ state: "visible", timeout: 10000 });
  await expandLearningBlocks(page);
}

async function waitForSyncedPanel(page) {
  var status = page.locator(".learning-sync-copy span");
  await requireOne(status, "learning sync status");
  await waitUntil(async function () {
    return (await status.innerText()).includes("已开启跨设备同步");
  }, "the authenticated learning-sync status", 10000);
}

function readLearningState(statePath) {
  try {
    return JSON.parse(readFileSync(statePath, "utf8"));
  } catch (error) {
    return null;
  }
}

async function runCheck(name, check) {
  var startedAt = Date.now();
  await check();
  var duration = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log("PASS " + name + " (" + duration + "s)");
}

async function main() {
  var port = await findAvailablePort();
  var baseUrl = "http://127.0.0.1:" + port;
  var learningStatePath = path.join(tempDirectory, "learning-state.json");
  var notebookLinksPath = path.join(tempDirectory, "notebooklm-links.json");
  serverProcess = spawn(process.env.PYTHON || "python3", ["-B", "server.py"], {
    cwd: ROOT,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(port),
      FANPHYSICS_ENV: "development",
      NOTEBOOKLM_EDIT_PASSWORD: NOTEBOOKLM_TEST_PASSWORD,
      LEARNING_SYNC_PASSWORD: LEARNING_SYNC_TEST_PASSWORD,
      LEARNING_STATE_PATH: learningStatePath,
      NOTEBOOKLM_LINKS_PATH: notebookLinksPath,
      PYTHONUNBUFFERED: "1"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  serverProcess.stdout.on("data", function (chunk) {
    serverOutput += chunk.toString();
  });
  serverProcess.stderr.on("data", function (chunk) {
    serverOutput += chunk.toString();
  });
  await waitForServer(baseUrl);

  browser = await chromium.launch({ headless: true });
  var context = await browser.newContext({ locale: "zh-CN" });
  await context.route("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js", async function (route) {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "window.MathJax=window.MathJax||{};window.MathJax.startup={promise:Promise.resolve()};window.MathJax.typesetPromise=function(){return Promise.resolve();};"
    });
  });
  var page = await context.newPage();
  var pageErrors = [];
  page.on("pageerror", function (error) {
    pageErrors.push(error.message);
  });
  await page.goto(baseUrl + "/classical-mechanics-demo.html", { waitUntil: "domcontentloaded" });

  await runCheck("独立同步密码与登录恢复", async function () {
    await openRegressionProblem(page);
    var wrongCredentialStatus = await page.evaluate(async function (password) {
      var response = await fetch("/api/learning-auth", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password })
      });
      return response.status;
    }, NOTEBOOKLM_TEST_PASSWORD);
    assert.equal(wrongCredentialStatus, 401, "NotebookLM password must not unlock learning sync");
    var password = page.getByLabel("学习记录同步密码");
    await requireOne(password, "learning sync password");
    await waitUntil(function () {
      return password.isEnabled();
    }, "the learning-sync form");
    await password.fill(LEARNING_SYNC_TEST_PASSWORD);
    var login = page.getByRole("button", { name: "启用跨设备同步", exact: true });
    await requireOne(login, "learning sync login button");
    await login.click();
    await waitForSyncedPanel(page);

    await page.reload({ waitUntil: "domcontentloaded" });
    await openRegressionProblem(page);
    await waitForSyncedPanel(page);
    assert.equal(await page.getByRole("button", { name: "立即同步", exact: true }).isVisible(), true);
  });

  await runCheck("先作答再揭示", async function () {
    var stage = page.locator(".student-exploration-block .exploration-stage-card").first();
    var textarea = stage.locator("textarea");
    var feedback = stage.locator(".exploration-feedback");
    var reveal = stage.locator("button.learning-primary-action");
    await requireOne(reveal, "answer-and-reveal button");
    assert.equal(await feedback.isHidden(), true, "feedback must start hidden");
    assert.equal(await reveal.isDisabled(), true, "reveal must start disabled");
    await textarea.fill(EXPLORATION_ANSWER);
    assert.equal(await reveal.isEnabled(), true, "answer should enable reveal");
    await reveal.click();
    assert.equal(await feedback.isVisible(), true, "feedback should appear after answering");
  });

  await runCheck("动画验证", async function () {
    var stage = page.locator(".student-exploration-block .exploration-stage-card").first();
    var verify = stage.getByRole("button", { name: "在动画中验证", exact: true });
    await requireOne(verify, "animation verification button");
    await verify.click();
    var status = stage.locator(".animation-verify-status");
    await waitUntil(async function () {
      return (await status.innerText()).includes("轨道偏心率调高");
    }, "the animation verification message");
    var parameter = page.locator("#jsonAnimationControls .control").filter({ hasText: "轨道离心率" });
    await requireOne(parameter, "orbit eccentricity control");
    assert.equal(await parameter.locator("input").inputValue(), "0.7");
    var timeInput = page.locator("#jsonAnimTime");
    await waitUntil(async function () {
      return Number(await timeInput.inputValue()) > 0;
    }, "the verified animation to advance");
    assert.equal(await page.locator("#jsonAnimPlayBtn").innerText(), "暂停");
  });

  await runCheck("三点评分保存", async function () {
    var transfer = page.locator(".real-life-case-block .real-life-transfer");
    var textarea = transfer.locator("textarea");
    await textarea.fill(REAL_LIFE_ANSWER);
    var save = transfer.getByRole("button", { name: "保存我的回答", exact: true });
    await requireOne(save, "real-life answer save button");
    await save.click();
    var selfCheck = transfer.locator(".real-life-self-check");
    assert.equal(await selfCheck.isVisible(), true);
    var checks = selfCheck.locator('input[type="checkbox"]');
    assert.equal(await checks.count(), 3);
    await checks.nth(0).check();
    await checks.nth(1).check();
    assert.equal(await selfCheck.locator(".real-life-self-check-heading span").innerText(), "掌握 2 / 3");

    await waitUntil(function () {
      var state = readLearningState(learningStatePath);
      if (!state || !state.stores) return false;
      var exploration = state.stores.exploration[PROBLEM_ID + ":stage:0"];
      var realLife = state.stores.realLife[PROBLEM_ID + ":real-life"];
      var score = state.stores.realLifeChecks[PROBLEM_ID + ":real-life"];
      return Boolean(
        exploration && exploration.value === EXPLORATION_ANSWER &&
        realLife && realLife.value === REAL_LIFE_ANSWER &&
        score && JSON.stringify(score.value) === "[0,1]"
      );
    }, "answers and rubric score to reach the server", 12000);
  });

  await runCheck("首页学习进度总览", async function () {
    await page.locator("#treeHome").click();
    await page.locator("#learningProgressOverallValue").waitFor({ state: "visible", timeout: 10000 });
    assert.match(await page.locator("#learningProgressOverallValue").innerText(), /^[1-9]\d*%$/);
    assert.match(await page.locator("#learningProgressExplorationValue").innerText(), /^1 \/ \d+$/);
    assert.match(await page.locator("#learningProgressTransferValue").innerText(), /^1 \/ \d+$/);
    assert.match(await page.locator("#learningProgressScoreValue").innerText(), /^2 \/ \d+$/);
    var chapter = page.locator(".learning-progress-chapter").filter({ hasText: "必修二结业测试" });
    await requireOne(chapter, "required-two chapter progress");
    assert.equal(await page.locator(".learning-progress-weak-list span").count() > 0, true);
    assert.equal(await page.locator("#learningProgressSyncStatus").innerText(), "跨设备已同步");
  });

  await runCheck("刷新与服务器恢复", async function () {
    await page.reload({ waitUntil: "domcontentloaded" });
    await openRegressionProblem(page);
    await waitForSyncedPanel(page);
    assert.equal(
      await page.locator(".student-exploration-block .exploration-stage-card").first().locator("textarea").inputValue(),
      EXPLORATION_ANSWER
    );
    assert.equal(await page.locator(".real-life-case-block .real-life-transfer textarea").inputValue(), REAL_LIFE_ANSWER);
    assert.equal(await page.locator(".real-life-self-check input:checked").count(), 2);

    await page.evaluate(function () {
      localStorage.removeItem("fanphysics:studentExploration:v1");
      localStorage.removeItem("fanphysics:realLifeResponses:v1");
      localStorage.removeItem("fanphysics:realLifeRubric:v1");
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await openRegressionProblem(page);
    await waitForSyncedPanel(page);
    await expandLearningBlocks(page);
    await waitUntil(async function () {
      var restoredExploration = await page
        .locator(".student-exploration-block .exploration-stage-card")
        .first()
        .locator("textarea")
        .inputValue();
      var restoredRealLife = await page.locator(".real-life-case-block .real-life-transfer textarea").inputValue();
      return restoredExploration === EXPLORATION_ANSWER && restoredRealLife === REAL_LIFE_ANSWER;
    }, "server-backed answers to restore after local storage is cleared", 10000);
    assert.equal(await page.locator(".real-life-self-check input:checked").count(), 2);
    assert.equal(await page.locator(".real-life-self-check-heading span").innerText(), "掌握 2 / 3");
    await page.locator("#treeHome").click();
    await page.locator("#learningProgressOverallValue").waitFor({ state: "visible", timeout: 10000 });
    assert.match(await page.locator("#learningProgressExplorationValue").innerText(), /^1 \/ \d+$/);
    assert.match(await page.locator("#learningProgressTransferValue").innerText(), /^1 \/ \d+$/);
    assert.match(await page.locator("#learningProgressScoreValue").innerText(), /^2 \/ \d+$/);
  });

  assert.deepEqual(pageErrors, [], "uncaught page errors: " + pageErrors.join(" | "));
  console.log("Browser regression passed: 6/6 checks");
}

try {
  await main();
} catch (error) {
  console.error("Browser regression failed: " + error.stack);
  if (serverOutput.trim()) console.error("\nServer output:\n" + serverOutput.trim());
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await stopServer();
  rmSync(tempDirectory, { recursive: true, force: true });
}
