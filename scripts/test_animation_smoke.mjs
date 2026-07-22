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
var tempDirectory = mkdtempSync(path.join(os.tmpdir(), "fanphysics-animation-smoke-"));
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
  if (!port) throw new Error("Unable to reserve an animation-test port");
  return port;
}

async function waitForServer(baseUrl) {
  var deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      var response = await fetch(baseUrl + "/api/health", { cache: "no-store" });
      if (response.ok) return;
    } catch (error) {
      // The isolated server may still be starting.
    }
    await delay(80);
  }
  throw new Error("Timed out waiting for the animation-test server");
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

function readAnimatedProblems() {
  var index = JSON.parse(readFileSync(path.join(ROOT, "data/problems/index.json"), "utf8"));
  return index.problems.map(function (item) {
    var problem = JSON.parse(readFileSync(path.join(ROOT, "data/problems", item.file), "utf8"));
    return problem;
  }).filter(function (problem) {
    return Boolean(problem.animation && problem.animation.enabled === true && problem.animation.type !== "none");
  });
}

function groupProblemsByType(problems) {
  return problems.reduce(function (groups, problem) {
    var type = problem.animation.type;
    groups[type] = groups[type] || [];
    groups[type].push(problem);
    return groups;
  }, {});
}

async function installExternalStubs(context) {
  await context.route("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js", async function (route) {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "window.MathJax=window.MathJax||{};window.MathJax.startup={promise:Promise.resolve()};window.MathJax.typesetPromise=function(){return Promise.resolve();};"
    });
  });
}

async function openAnimatedProblem(page, problem) {
  var result = await page.evaluate(async function (sceneName) {
    var loaded = await window.switchScene(sceneName);
    if (typeof window.redraw === "function") window.redraw();
    return Boolean(loaded);
  }, problem.id);
  assert.equal(result, true, problem.id + " should load its JSON and runtime");
  await page.locator("#canvas-holder canvas").waitFor({ state: "visible", timeout: 10000 });
  await page.waitForTimeout(35);

  var metrics = await page.evaluate(function (target) {
    var sceneName = target.sceneName;
    var animationType = target.animationType;
    var canvas = document.querySelector("#canvas-holder canvas");
    var context = canvas.getContext("2d");
    var pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    var splitX = Math.floor(canvas.width * 0.574);
    var xStep = Math.max(4, Math.floor(canvas.width / 160));
    var yStep = Math.max(4, Math.floor(canvas.height / 90));
    var leftInk = 0;
    var rightInk = 0;
    for (var y = 0; y < canvas.height; y += yStep) {
      for (var x = 0; x < canvas.width; x += xStep) {
        var offset = (y * canvas.width + x) * 4;
        var hasInk = pixels[offset + 3] > 0 && (
          pixels[offset] < 244 || pixels[offset + 1] < 244 || pixels[offset + 2] < 244
        );
        if (hasInk) {
          if (x < splitX) leftInk += 1;
          else rightInk += 1;
        }
      }
    }
    var renderer = window.getSceneRenderer && getSceneRenderer(animationType);
    var fanRenderer = animationType === "fanphysics_model"
      ? window.getFanPhysicsRenderer && getFanPhysicsRenderer(sceneName)
      : true;
    return {
      canvasCount: document.querySelectorAll("#canvas-holder canvas").length,
      leftInk: leftInk,
      rightInk: rightInk,
      rendererRegistered: Boolean(renderer),
      fanRendererRegistered: Boolean(fanRenderer),
      graphCacheSize: Object.keys(window.graphFrameCacheMap || {}).length,
      noteCacheSize: Object.keys(window.problemNoteCacheMap || {}).length
    };
  }, { sceneName: problem.id, animationType: problem.animation.type });
  assert.equal(metrics.canvasCount, 1, problem.id + " should keep one p5 canvas");
  assert.equal(metrics.rendererRegistered, true, problem.id + " should register its animation type");
  assert.equal(metrics.fanRendererRegistered, true, problem.id + " should register its FanPhysics variant");
  assert.equal(metrics.leftInk > 12, true, problem.id + " animation region should not be blank");
  assert.equal(metrics.rightInk > 8, true, problem.id + " graph region should not be blank");
  assert.equal(metrics.graphCacheSize <= 6, true, "graph cache should stay bounded");
  assert.equal(metrics.noteCacheSize <= 8, true, "problem-note cache should stay bounded");
}

async function runAllAnimationChecks(baseUrl, problems) {
  var context = await browser.newContext({ locale: "zh-CN", viewport: { width: 1440, height: 1000 } });
  await installExternalStubs(context);
  var groups = groupProblemsByType(problems);
  var checked = 0;
  for (var type of Object.keys(groups).sort()) {
    var page = await context.newPage();
    var errors = [];
    page.on("pageerror", function (error) {
      errors.push(error.message);
    });
    await page.goto(baseUrl + "/classical-mechanics-demo.html", { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("#canvas-holder canvas").count(), 0, "home should stay canvas-free");
    for (var problem of groups[type]) {
      await openAnimatedProblem(page, problem);
      assert.deepEqual(errors, [], problem.id + " produced page errors: " + errors.join(" | "));
      checked += 1;
    }
    console.log("PASS animation type " + type + " (" + groups[type].length + ")");
    await page.close();
  }
  await context.close();
  assert.equal(checked, problems.length, "every animated problem should be checked");
  return checked;
}

async function runResponsiveCheck(baseUrl, viewport, label) {
  var context = await browser.newContext({ locale: "zh-CN", viewport: viewport, deviceScaleFactor: 1 });
  await installExternalStubs(context);
  var page = await context.newPage();
  var pageErrors = [];
  page.on("pageerror", function (error) {
    pageErrors.push(error.message);
  });
  await page.goto(baseUrl + "/classical-mechanics-demo.html", { waitUntil: "domcontentloaded" });
  var opened = await page.evaluate(async function () {
    return Boolean(await window.switchScene("lesson12_course_01_reference_plane"));
  });
  assert.equal(opened, true, label + " scene should load");
  await page.locator("#canvas-holder canvas").waitFor({ state: "visible", timeout: 10000 });
  var layout = await page.evaluate(function () {
    var holder = document.getElementById("canvas-holder").getBoundingClientRect();
    var canvas = document.querySelector("#canvas-holder canvas");
    var notes = document.getElementById("problemNotesHost").getBoundingClientRect();
    return {
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      holderLeft: holder.left,
      holderRight: holder.right,
      holderWidth: holder.width,
      holderHeight: holder.height,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      notesRight: notes.right
    };
  });
  assert.equal(layout.scrollWidth <= layout.viewportWidth + 1, true, label + " should not scroll horizontally");
  assert.equal(layout.holderLeft >= 0 && layout.holderRight <= layout.viewportWidth + 1, true, label + " canvas should fit the viewport");
  assert.equal(layout.notesRight <= layout.viewportWidth + 1, true, label + " notes should fit the viewport");
  assert.equal(Math.abs(layout.holderWidth / layout.holderHeight - 2) < 0.03, true, label + " canvas should preserve 2:1 framing");
  assert.equal(layout.canvasWidth >= 1000 && layout.canvasHeight >= 500, true, label + " canvas should retain drawing resolution");
  var screenshot = await page.locator("#canvas-holder").screenshot();
  assert.equal(screenshot.byteLength > 10000, true, label + " canvas screenshot should contain rendered detail");
  assert.deepEqual(pageErrors, [], label + " produced page errors: " + pageErrors.join(" | "));
  await context.close();
  console.log("PASS responsive layout " + label);
}

async function main() {
  var problems = readAnimatedProblems();
  assert.equal(problems.length > 0, true, "the catalog should contain animated problems");
  var port = await findAvailablePort();
  var baseUrl = "http://127.0.0.1:" + port;
  serverProcess = spawn(process.env.PYTHON || "python3", ["-B", "server.py"], {
    cwd: ROOT,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(port),
      FANPHYSICS_ENV: "development",
      LEARNING_STATE_PATH: path.join(tempDirectory, "learning-state.json"),
      NOTEBOOKLM_LINKS_PATH: path.join(tempDirectory, "notebooklm-links.json"),
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
  var checked = await runAllAnimationChecks(baseUrl, problems);
  await runResponsiveCheck(baseUrl, { width: 1440, height: 1000 }, "desktop");
  await runResponsiveCheck(baseUrl, { width: 1024, height: 768 }, "iPad landscape");
  console.log("Animation smoke passed: " + checked + "/" + problems.length + " animated problems");
}

try {
  await main();
} catch (error) {
  console.error("Animation smoke failed: " + error.stack);
  if (serverOutput.trim()) console.error("\nServer output:\n" + serverOutput.trim());
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await stopServer();
  rmSync(tempDirectory, { recursive: true, force: true });
}
