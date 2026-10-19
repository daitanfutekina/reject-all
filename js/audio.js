import { AUDIO_DEFAULTS, scoreStep, tempoFor } from './audio-score.js';
import { createRack } from './audio-synth.js';

export function createAudio({ contextFactory = () => new (window.AudioContext || window.webkitAudioContext)(), timers = globalThis } = {}) {
  let context, rack, interval, pauseTimer, scene = 'menu', level = 1, step = 0, nextTime = 0;
  let paused = false, hidden = false, muted = false, disposed = false;
  let musicVolume = AUDIO_DEFAULTS.musicVolume, effectsVolume = AUDIO_DEFAULTS.effectsVolume;
  let lastCue = '', lastCueTime = -1, warningSecond = -1;
  let holdStep = -1;
  const retiring = new Map();
  const blocked = () => disposed || paused || hidden || muted || (musicVolume === 0 && effectsVolume === 0);
  const mix = () => rack?.volumes(blocked() ? 0 : musicVolume, muted || hidden ? 0 : effectsVolume);
  const clearSchedule = () => { if (interval !== undefined) timers.clearInterval(interval); interval = undefined; };
  function pump() {
    if (blocked() || context?.state !== 'running') return;
    // The audio clock, not animation frames, places notes precisely. Never catch up a stalled tab.
    if (nextTime < context.currentTime - 0.05) nextTime = context.currentTime + 0.03;
    while (nextTime < context.currentTime + 0.1) {
      const beat = 60 / tempoFor(scene, level);
      if (musicVolume > 0) for (const event of scoreStep(step, scene, level)) {
        rack.note(event.voice, event.note, nextTime, event.length * beat, event.velocity, event.pan);
      }
      step++; nextTime += beat / 4;
    }
  }
  function schedule() {
    if (blocked() || musicVolume === 0 || !context || context.state !== 'running' || interval !== undefined) return;
    nextTime = context.currentTime + 0.035; pump(); interval = timers.setInterval(pump, 25);
  }
  function silence() {
    clearSchedule();
    for (const [oldRack, timer] of retiring) { timers.clearTimeout(timer); oldRack.stop(); }
    retiring.clear();
    if (rack) { rack.stop(); rack = null; }
    context?.suspend().catch(() => {});
  }
  async function wake() {
    if (blocked()) return;
    try {
      if (!context) context = contextFactory();
      if (!rack) { rack = createRack(context); mix(); }
      if (context.state !== 'running') await context.resume();
      if (blocked()) { if (context.state === 'running') silence(); return; }
      schedule();
    } catch { /* Playback is optional when a device denies or lacks Web Audio. */ }
  }
  function cue(name, transpose = 0) {
    if (blocked() || context?.state !== 'running' || effectsVolume === 0) return;
    const now = context.currentTime;
    if (name === lastCue && now - lastCueTime < 0.055) return;
    lastCue = name; lastCueTime = now;
    rack.cue(name, now + 0.005, transpose);
    if (['win', 'loss', 'timeout', 'start', 'speedup', 'over', 'record'].includes(name)) rack.duck(0.4, name === 'over' ? 1.2 : 0.32);
  }
  return {
    wake, cue,
    configure(settings) {
      muted = Boolean(settings.mute);
      for (const key of ['musicVolume', 'effectsVolume']) {
        if (Number.isFinite(settings[key])) {
          const value = Math.max(0, Math.min(1, settings[key]));
          if (key === 'musicVolume') musicVolume = value; else effectsVolume = value;
        }
      }
      mix();
      if (blocked()) silence();
      else if (musicVolume === 0) clearSchedule();
      else schedule();
    },
    scene(value, speed = 1) {
      const changed = scene !== value; scene = value; level = Math.max(1, speed);
      warningSecond = -1; holdStep = -1;
      if (changed) {
        step = 0;
        // Fade the old arrangement before replacing its rack; no stacked run loops on retries.
        if (rack) {
          const oldRack = rack; oldRack.volumes(0, 0);
          retiring.set(oldRack, timers.setTimeout(() => { oldRack.stop(); retiring.delete(oldRack); }, 160));
          rack = createRack(context); mix();
        }
        if (context) nextTime = context.currentTime + 0.035;
      }
    },
    round(speed) {
      const faster = speed > level; level = Math.max(1, speed); warningSecond = -1;
      cue(faster ? 'speedup' : 'round');
    },
    remaining(milliseconds) {
      const second = Math.ceil(milliseconds / 1000);
      if (second >= 1 && second <= 3 && warningSecond !== second) { warningSecond = second; cue('tick', 3 - second); }
    },
    hold(fraction = null) {
      if (fraction === null) { holdStep = -1; return; }
      const position = Math.floor(Math.max(0, Math.min(0.99, fraction)) * 8);
      if (position > holdStep) { holdStep = position; cue('progress', position - 7); }
    },
    pause(value) {
      if (paused === value) return;
      if (pauseTimer !== undefined) timers.clearTimeout(pauseTimer);
      if (value) {
        cue('pause'); paused = true; holdStep = -1; clearSchedule(); mix();
        pauseTimer = timers.setTimeout(() => { pauseTimer = undefined; if (paused) silence(); }, 140);
      } else {
        paused = false; mix(); wake().then(() => cue('resume'));
      }
    },
    hidden(value) {
      hidden = value;
      if (hidden) { holdStep = -1; silence(); } else if (context) wake();
    },
    dispose() {
      disposed = true; clearSchedule(); if (pauseTimer !== undefined) timers.clearTimeout(pauseTimer);
      for (const [oldRack, timer] of retiring) { timers.clearTimeout(timer); oldRack.stop(); }
      retiring.clear();
      rack?.stop(); context?.close().catch(() => {});
    },
    get status() { return { ready: context?.state === 'running', scene, tempo: tempoFor(scene, level), steps: step, voices: rack?.activeSources || 0, paused, hidden, muted }; },
  };
}
