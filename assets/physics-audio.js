// Web Audio playback state and event synthesis for physics animations.

var physicsSoundStorageKey = "fanphysics:soundEnabled:v2";
var physicsPreviousSoundStorageKeys = [
  "fanphysics:mechanicalEnergySound:v1",
  "fanphysics:referencePlaneSound:v1"
];
var physicsSoundEnabled = false;
var physicsAudioContext = null;
var physicsAudioMaster = null;
var physicsAudioCompressor = null;
var physicsNoiseSource = null;
var physicsNoiseFilter = null;
var physicsNoiseGain = null;
var physicsToneSource = null;
var physicsToneGain = null;
var physicsSoundActiveScene = "";
var physicsSoundPreviousProgress = 0;
var physicsSoundCueState = {};

function readPhysicsSoundPreference() {
  try {
    var stored = window.localStorage.getItem(physicsSoundStorageKey);
    var index;
    for (index = 0; stored === null && index < physicsPreviousSoundStorageKeys.length; index += 1) {
      stored = window.localStorage.getItem(physicsPreviousSoundStorageKeys[index]);
    }
    return stored === "1";
  } catch (error) {
    return false;
  }
}

function writePhysicsSoundPreference() {
  try {
    window.localStorage.setItem(physicsSoundStorageKey, physicsSoundEnabled ? "1" : "0");
  } catch (error) {
    return;
  }
}

function isMechanicalEnergySoundScene(sceneName) {
  var animation = ((problemDataMap[sceneName] || {}).animation || {});
  return animation.type === "mechanical_energy_model" && animation.playable !== false;
}

function isPhysicsSoundScene(sceneName) {
  if (typeof hasFanPhysicsSoundScene === "function") {
    return hasFanPhysicsSoundScene(sceneName);
  }
  var animation = ((problemDataMap[sceneName] || {}).animation || {});
  return isJsonAnimationScene(sceneName) && animation.playable !== false;
}

function supportsPhysicsSound() {
  return Boolean(window.AudioContext || window.webkitAudioContext);
}

function setPhysicsMasterGain(value, immediate) {
  if (!physicsAudioContext || !physicsAudioMaster) {
    return;
  }
  var now = physicsAudioContext.currentTime;
  physicsAudioMaster.gain.cancelScheduledValues(now);
  if (immediate) {
    physicsAudioMaster.gain.setValueAtTime(value, now);
  } else {
    physicsAudioMaster.gain.setTargetAtTime(value, now, 0.015);
  }
}

function ensurePhysicsAudio(sceneName) {
  var targetScene = sceneName || currentScene;
  if (!physicsSoundEnabled || !isPhysicsSoundScene(targetScene) || !supportsPhysicsSound()) {
    return null;
  }
  if (physicsAudioContext && physicsAudioContext.state === "closed") {
    physicsAudioContext = null;
    physicsAudioMaster = null;
    physicsAudioCompressor = null;
    physicsNoiseSource = null;
    physicsNoiseFilter = null;
    physicsNoiseGain = null;
    physicsToneSource = null;
    physicsToneGain = null;
  }
  if (!physicsAudioContext) {
    var AudioContextType = window.AudioContext || window.webkitAudioContext;
    physicsAudioContext = new AudioContextType();
    physicsAudioMaster = physicsAudioContext.createGain();
    physicsAudioCompressor = physicsAudioContext.createDynamicsCompressor();
    physicsAudioMaster.gain.value = 0;
    physicsAudioCompressor.threshold.value = -22;
    physicsAudioCompressor.knee.value = 18;
    physicsAudioCompressor.ratio.value = 4;
    physicsAudioCompressor.attack.value = 0.003;
    physicsAudioCompressor.release.value = 0.22;
    physicsAudioMaster.connect(physicsAudioCompressor);
    physicsAudioCompressor.connect(physicsAudioContext.destination);
  }
  if (physicsAudioContext.state === "suspended") {
    var resumeResult = physicsAudioContext.resume();
    if (resumeResult && typeof resumeResult.catch === "function") {
      resumeResult.catch(function () {
        return;
      });
    }
  }
  setPhysicsMasterGain(0.52, false);
  return physicsAudioContext;
}

function ensurePhysicsContinuousChannels(sceneName) {
  var context = ensurePhysicsAudio(sceneName);
  if (!context) {
    return context;
  }
  if (!physicsNoiseSource) {
    var duration = 2;
    var sampleCount = Math.floor(context.sampleRate * duration);
    var buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    var samples = buffer.getChannelData(0);
    var index;
    for (index = 0; index < sampleCount; index += 1) {
      samples[index] = Math.random() * 2 - 1;
    }
    physicsNoiseSource = context.createBufferSource();
    physicsNoiseFilter = context.createBiquadFilter();
    physicsNoiseGain = context.createGain();
    physicsNoiseSource.buffer = buffer;
    physicsNoiseSource.loop = true;
    physicsNoiseFilter.type = "bandpass";
    physicsNoiseFilter.frequency.value = 420;
    physicsNoiseFilter.Q.value = 0.72;
    physicsNoiseGain.gain.value = 0;
    physicsNoiseSource.connect(physicsNoiseFilter);
    physicsNoiseFilter.connect(physicsNoiseGain);
    physicsNoiseGain.connect(physicsAudioMaster);
    physicsNoiseSource.start();
  }
  if (!physicsToneSource) {
    physicsToneSource = context.createOscillator();
    physicsToneGain = context.createGain();
    physicsToneSource.type = "sine";
    physicsToneSource.frequency.value = 100;
    physicsToneGain.gain.value = 0;
    physicsToneSource.connect(physicsToneGain);
    physicsToneGain.connect(physicsAudioMaster);
    physicsToneSource.start();
  }
  return context;
}

function getPhysicsSoundProfile(sceneName) {
  if (typeof getFanPhysicsSoundProfile === "function") {
    return getFanPhysicsSoundProfile(sceneName);
  }
  if (typeof getMechanicalEnergySoundProfile === "function") {
    return getMechanicalEnergySoundProfile(sceneName);
  }
  return {
    description: "音效会跟随动画速度和关键物理事件变化",
    startEvent: "",
    endEvent: "stop"
  };
}

function getPhysicsSoundFrame(sceneName, progress) {
  if (typeof getFanPhysicsSoundFrame === "function") {
    return getFanPhysicsSoundFrame(sceneName, progress);
  }
  if (typeof getMechanicalEnergySoundFrame === "function") {
    return getMechanicalEnergySoundFrame(sceneName, progress);
  }
  return {
    noiseType: "bandpass",
    noiseGain: 0,
    noiseFrequency: 420,
    noiseQ: 0.72,
    toneType: "sine",
    toneGain: 0,
    toneFrequency: 100
  };
}

function getPhysicsSoundCues(sceneName) {
  if (typeof getFanPhysicsSoundCues === "function") {
    return getFanPhysicsSoundCues(sceneName);
  }
  if (typeof getMechanicalEnergySoundCues === "function") {
    return getMechanicalEnergySoundCues(sceneName);
  }
  return [];
}

function updatePhysicsContinuousSound(sceneName, progress, playing) {
  if (!physicsSoundEnabled || !playing || !isPhysicsSoundScene(sceneName) || currentScene !== sceneName) {
    stopPhysicsContinuousSound(true);
    return;
  }
  var context = ensurePhysicsContinuousChannels(sceneName);
  if (!context || !physicsNoiseGain || !physicsNoiseFilter || !physicsToneGain || !physicsToneSource) {
    return;
  }
  var frame = getPhysicsSoundFrame(sceneName, progress);
  var now = context.currentTime;
  var validNoiseTypes = { lowpass: true, highpass: true, bandpass: true };
  var validToneTypes = { sine: true, square: true, sawtooth: true, triangle: true };
  physicsNoiseFilter.type = validNoiseTypes[frame.noiseType] ? frame.noiseType : "bandpass";
  physicsToneSource.type = validToneTypes[frame.toneType] ? frame.toneType : "sine";
  physicsNoiseGain.gain.cancelScheduledValues(now);
  physicsNoiseGain.gain.setTargetAtTime(Math.max(0, Math.min(0.14, Number(frame.noiseGain || 0))), now, 0.035);
  physicsNoiseFilter.frequency.cancelScheduledValues(now);
  physicsNoiseFilter.frequency.setTargetAtTime(Math.max(80, Number(frame.noiseFrequency || 420)), now, 0.045);
  physicsNoiseFilter.Q.cancelScheduledValues(now);
  physicsNoiseFilter.Q.setTargetAtTime(Math.max(0.1, Number(frame.noiseQ || 0.72)), now, 0.045);
  physicsToneGain.gain.cancelScheduledValues(now);
  physicsToneGain.gain.setTargetAtTime(Math.max(0, Math.min(0.08, Number(frame.toneGain || 0))), now, 0.035);
  physicsToneSource.frequency.cancelScheduledValues(now);
  physicsToneSource.frequency.setTargetAtTime(Math.max(35, Number(frame.toneFrequency || 100)), now, 0.045);
}

function stopPhysicsContinuousSound(immediate) {
  if (!physicsAudioContext) {
    return;
  }
  var now = physicsAudioContext.currentTime;
  var gains = [physicsNoiseGain, physicsToneGain];
  gains.forEach(function (gainNode) {
    if (!gainNode) {
      return;
    }
    gainNode.gain.cancelScheduledValues(now);
    if (immediate) {
      gainNode.gain.setValueAtTime(0, now);
    } else {
      gainNode.gain.setTargetAtTime(0, now, 0.018);
    }
  });
}

function resetPhysicsSoundPlayback() {
  physicsSoundActiveScene = "";
  physicsSoundPreviousProgress = 0;
  physicsSoundCueState = {};
}

function silencePhysicsAudio() {
  stopPhysicsContinuousSound(true);
  setPhysicsMasterGain(0, true);
  resetPhysicsSoundPlayback();
}

function createPhysicsNoiseBurst(context, duration, gain, frequency, filterType, intensity) {
  var level = Math.max(0.1, Math.min(1.4, Number(intensity || 1)));
  var sampleCount = Math.floor(context.sampleRate * duration);
  var buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  var samples = buffer.getChannelData(0);
  var index;
  for (index = 0; index < sampleCount; index += 1) {
    var envelope = Math.pow(1 - index / sampleCount, 3);
    samples[index] = (Math.random() * 2 - 1) * envelope;
  }
  var source = context.createBufferSource();
  var filter = context.createBiquadFilter();
  var gainNode = context.createGain();
  var now = context.currentTime;
  source.buffer = buffer;
  filter.type = filterType || "lowpass";
  filter.frequency.value = frequency;
  filter.Q.value = 0.7;
  gainNode.gain.setValueAtTime(Math.max(0.001, gain * level), now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(physicsAudioMaster);
  source.start(now);
  source.stop(now + duration);
}

function createPhysicsToneBurst(context, startFrequency, endFrequency, duration, gain, toneType, intensity, delay) {
  var level = Math.max(0.1, Math.min(1.4, Number(intensity || 1)));
  var startAt = context.currentTime + Math.max(0, Number(delay || 0));
  var oscillator = context.createOscillator();
  var gainNode = context.createGain();
  oscillator.type = toneType || "sine";
  oscillator.frequency.setValueAtTime(Math.max(30, startFrequency), startAt);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), startAt + duration);
  gainNode.gain.setValueAtTime(Math.max(0.001, gain * level), startAt);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
  oscillator.connect(gainNode);
  gainNode.connect(physicsAudioMaster);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
}

function playPhysicsSoundEvent(kind, intensity, sceneName) {
  var targetScene = sceneName || currentScene;
  if (!physicsSoundEnabled || !isPhysicsSoundScene(targetScene) || currentScene !== targetScene) {
    return;
  }
  var context = ensurePhysicsAudio(targetScene);
  if (!context) {
    return;
  }
  setPhysicsMasterGain(0.52, false);
  if (kind === "impact" || kind === "rope" || kind === "collision") {
    createPhysicsNoiseBurst(context, 0.22, kind === "rope" ? 0.12 : 0.18, 950, "lowpass", intensity);
    createPhysicsToneBurst(context, kind === "collision" ? 82 : 105, 52, kind === "collision" ? 0.28 : 0.2, kind === "collision" ? 0.16 : 0.13, "sine", intensity, 0);
  } else if (kind === "splash") {
    createPhysicsNoiseBurst(context, 0.38, 0.16, 720, "bandpass", intensity);
    createPhysicsToneBurst(context, 145, 64, 0.28, 0.08, "sine", intensity, 0);
  } else if (kind === "launch") {
    createPhysicsNoiseBurst(context, 0.12, 0.06, 1450, "bandpass", intensity);
    createPhysicsToneBurst(context, 150, 430, 0.18, 0.075, "triangle", intensity, 0);
  } else if (kind === "kick") {
    createPhysicsNoiseBurst(context, 0.12, 0.12, 1100, "lowpass", intensity);
    createPhysicsToneBurst(context, 110, 58, 0.15, 0.09, "sine", intensity, 0);
  } else if (kind === "contact" || kind === "turn") {
    createPhysicsNoiseBurst(context, 0.09, 0.075, kind === "turn" ? 1250 : 1800, "bandpass", intensity);
    createPhysicsToneBurst(context, kind === "turn" ? 260 : 430, 190, 0.12, 0.055, "triangle", intensity, 0);
  } else if (kind === "release") {
    createPhysicsNoiseBurst(context, 0.1, 0.045, 1250, "bandpass", intensity);
    createPhysicsToneBurst(context, 430, 165, 0.24, 0.075, "triangle", intensity, 0);
  } else if (kind === "apex" || kind === "marker") {
    createPhysicsToneBurst(context, kind === "marker" ? 510 : 620, kind === "marker" ? 650 : 760, 0.22, 0.048, "sine", intensity, 0);
    createPhysicsToneBurst(context, kind === "marker" ? 760 : 930, kind === "marker" ? 880 : 1080, 0.18, 0.028, "sine", intensity, 0.055);
  } else if (kind === "shift" || kind === "valve") {
    createPhysicsNoiseBurst(context, 0.1, 0.055, kind === "valve" ? 1650 : 1100, "bandpass", intensity);
    createPhysicsToneBurst(context, kind === "valve" ? 230 : 145, kind === "valve" ? 135 : 92, 0.14, 0.05, "square", intensity, 0);
  } else if (kind === "snap") {
    createPhysicsNoiseBurst(context, 0.08, 0.13, 2450, "highpass", intensity);
    createPhysicsToneBurst(context, 760, 210, 0.12, 0.07, "triangle", intensity, 0);
  } else if (kind === "brake") {
    createPhysicsNoiseBurst(context, 0.32, 0.11, 1280, "highpass", intensity);
    createPhysicsToneBurst(context, 185, 72, 0.28, 0.06, "sawtooth", intensity, 0);
  } else if (kind === "gear") {
    createPhysicsNoiseBurst(context, 0.055, 0.055, 2100, "bandpass", intensity);
    createPhysicsToneBurst(context, 420, 250, 0.075, 0.045, "square", intensity, 0);
  } else if (kind === "thrust") {
    createPhysicsNoiseBurst(context, 0.3, 0.12, 620, "lowpass", intensity);
    createPhysicsToneBurst(context, 62, 145, 0.34, 0.09, "sawtooth", intensity, 0);
  } else {
    createPhysicsNoiseBurst(context, 0.14, 0.06, 780, "lowpass", intensity);
    createPhysicsToneBurst(context, 165, 82, 0.2, 0.055, "sine", intensity, 0);
  }
}

function beginPhysicsSoundPlayback(sceneName, progress) {
  if (!physicsSoundEnabled || !isPhysicsSoundScene(sceneName)) {
    return;
  }
  var q = Math.max(0, Math.min(1, Number(progress || 0)));
  physicsSoundActiveScene = sceneName;
  physicsSoundPreviousProgress = q;
  physicsSoundCueState = {};
  ensurePhysicsAudio(sceneName);
  var profile = getPhysicsSoundProfile(sceneName);
  if (q <= 0.001 && profile.startEvent) {
    playPhysicsSoundEvent(profile.startEvent, profile.startIntensity || 1, sceneName);
    physicsSoundCueState.start = true;
  }
  updatePhysicsContinuousSound(sceneName, q, true);
}

function pausePhysicsSoundPlayback() {
  stopPhysicsContinuousSound(true);
  setPhysicsMasterGain(0, true);
  resetPhysicsSoundPlayback();
}

function updatePhysicsSoundPlayback(sceneName, progress, playing, reachedEnd) {
  if (!physicsSoundEnabled || !isPhysicsSoundScene(sceneName)) {
    return;
  }
  var q = Math.max(0, Math.min(1, Number(progress || 0)));
  if (physicsSoundActiveScene !== sceneName) {
    beginPhysicsSoundPlayback(sceneName, q);
  }
  updatePhysicsContinuousSound(sceneName, q, playing);
  var cues = getPhysicsSoundCues(sceneName);
  cues.forEach(function (cue, index) {
    var cueKey = "cue:" + index;
    if (!physicsSoundCueState[cueKey] && physicsSoundPreviousProgress < cue.at && q >= cue.at) {
      playPhysicsSoundEvent(cue.event, cue.intensity || 1, sceneName);
      physicsSoundCueState[cueKey] = true;
    }
  });
  if (reachedEnd) {
    var profile = getPhysicsSoundProfile(sceneName);
    if (!physicsSoundCueState.end && profile.endEvent) {
      playPhysicsSoundEvent(profile.endEvent, profile.endIntensity || 1, sceneName);
      physicsSoundCueState.end = true;
    }
    stopPhysicsContinuousSound(true);
  }
  physicsSoundPreviousProgress = q;
}

function syncPhysicsSoundButton() {
  var button = document.getElementById("jsonAnimSoundBtn");
  if (!button) {
    return;
  }
  var supported = supportsPhysicsSound();
  button.disabled = !supported;
  button.setAttribute("aria-pressed", physicsSoundEnabled && supported ? "true" : "false");
  button.innerText = supported ? (physicsSoundEnabled ? "音效：开" : "音效：关") : "音效不可用";
  button.title = supported ? getPhysicsSoundProfile(currentScene).description : "当前浏览器不支持 Web Audio";
}

function setPhysicsSoundEnabled(enabled) {
  physicsSoundEnabled = Boolean(enabled) && supportsPhysicsSound();
  writePhysicsSoundPreference();
  if (!physicsSoundEnabled) {
    silencePhysicsAudio();
  } else if (isPhysicsSoundScene(currentScene)) {
    ensurePhysicsAudio(currentScene);
    if (isJsonAnimationScene(currentScene)) {
      var state = getJsonAnimationState(currentScene);
      var duration = getJsonDuration(currentScene);
      if (state.playing) {
        beginPhysicsSoundPlayback(currentScene, duration > 0 ? state.time / duration : 0);
      }
    }
  }
  syncPhysicsSoundButton();
}
