// Original score: "Panic Button", E minor / 4/4. Durations are in quarter-note beats.
// Two-bar arcade vignettes: brass jabs, pulse answers, octave hops and stop-time fills.
export const AUDIO_DEFAULTS = Object.freeze({ musicVolume: 0.55, effectsVolume: 0.75 });
export const tempoFor = (scene, level = 1) => scene === 'run' ? Math.min(202, 152 + (Math.max(1, level) - 1) * 5) : scene === 'results' ? 144 : 156;
export const midiHz = note => 440 * 2 ** ((note - 69) / 12);

const roots = [40, 40, 43, 47, 45, 45, 48, 47];
const hooks = [
  [[0, 76], [2, 83], [3, 79], [6, 78], [8, 76], [11, 79], [14, 83]],
  [[0, 86], [3, 83], [5, 78], [8, 79], [10, 78], [12, 76]],
  [[1, 79], [4, 74], [6, 79], [7, 81], [10, 82], [12, 81], [15, 79]],
  [[0, 78], [2, 83], [5, 78], [7, 75], [10, 78], [12, 71]],
  [[0, 81], [1, 69], [4, 84], [5, 72], [8, 83], [9, 71], [12, 81]],
  [[2, 76], [3, 81], [6, 84], [8, 83], [11, 81], [14, 76]],
  [[0, 84], [3, 83], [6, 79], [8, 76], [10, 79], [13, 78]],
  [[0, 78], [2, 75], [4, 71], [7, 78], [8, 83], [10, 82]],
];
const bassSteps = [[0, 3, 6, 8, 11, 14], [0, 2, 7, 10, 12, 15], [0, 3, 6, 9, 12], [0, 2, 6, 8, 11]];
const kickSteps = [[0, 4, 8, 12], [0, 3, 8, 10, 14], [0, 4, 8, 12], [0, 6, 8, 11]];

export function scoreStep(step, scene = 'run', level = 1) {
  const beat = step % 16, bar = Math.floor(step / 16) % 16;
  const phrase = bar % 8, motif = Math.floor(phrase / 2), answer = bar >= 8;
  const busy = scene === 'run', intensity = Math.min(3, Math.max(0, Math.floor((level - 1) / 2)));
  const events = [], root = roots[phrase];
  const add = (voice, note, length, velocity, pan = 0) => events.push({ voice, note, length, velocity, pan });
  // Leave a breath before each two-bar handoff; percussion supplies the surprise.
  const fill = bar % 2 === 1 && beat >= 13;
  if (!fill) {
    const bassIndex = bassSteps[motif].indexOf(beat);
    if (bassIndex >= 0) add('bass', root + [0, 12, 7, 0, 10, 12][bassIndex], 0.32, busy ? 0.66 : 0.55);
    const hook = hooks[phrase].find(([position]) => position === beat);
    if (hook) add(motif % 2 === 0 ? 'brass' : 'pulse', hook[1] - (answer ? 12 : 0), beat % 4 === 0 ? 0.48 : 0.28, busy ? 0.49 : 0.4, answer ? -0.16 : 0.16);
    if ([2, 10].includes(beat) && motif !== 2 && scene !== 'results') add('brass', root + 19, 0.22, 0.2, -0.2);
    if (busy && intensity >= 2 && [5, 15].includes(beat)) add('chip', root + 36 + (beat === 5 ? 7 : 0), 0.18, 0.19, beat === 5 ? -0.4 : 0.4);
  }
  if (kickSteps[motif].includes(beat) && !fill) add('kick', 36, 0.25, beat % 4 === 0 ? 0.86 : 0.63);
  if ([4, 12].includes(beat)) {
    add('snare', 38, 0.2, busy ? 0.64 : 0.5);
    if (motif === 0) add('clap', 39, 0.15, 0.17, 0.12);
  }
  if (beat % 2 === 0 && !(fill && motif === 3)) add('hat', 42, 0.1, beat % 4 === 2 ? 0.3 : 0.17, beat % 4 === 2 ? 0.25 : -0.25);
  if (busy && intensity >= 1 && [3, 7, 11].includes(beat)) add('shaker', 42, 0.1, 0.13, -0.3);
  if (busy && intensity >= 3 && [3, 10].includes(beat)) add('rim', 37, 0.12, 0.2, 0.3);
  if (fill) {
    if (motif === 0) add(beat === 15 ? 'snare' : 'tom', 52 - (beat - 13) * 5, 0.18, 0.38 + (beat - 13) * 0.09, (beat - 14) * 0.25);
    if (motif === 1 && beat !== 14) add('snare', 38, 0.15, beat === 15 ? 0.58 : 0.28);
    if (motif === 2) add('chip', 88 - (beat - 13) * 5, 0.18, 0.28, (14 - beat) * 0.25);
    if (motif === 3 && beat === 15) { add('zap', 71, 0.25, 0.36); add('kick', 36, 0.25, 0.72); }
  }
  return events;
}

// Dry, short arcade punctuation. Quiet mid-register ticks avoid a piercing alarm bed.
export const CUES = Object.freeze({
  tap: [['chip', 83, 0, 0.035, 0.2]],
  toggle: [['pulse', 76, 0, 0.045, 0.25], ['chip', 88, 0.045, 0.035, 0.2]],
  grab: [['zap', 59, 0, 0.055, 0.25]],
  drop: [['brass', 64, 0, 0.07, 0.33], ['kick', 36, 0, 0.1, 0.28]],
  release: [['pulse', 59, 0, 0.045, 0.16]],
  progress: [['chip', 81, 0, 0.045, 0.19]],
  start: [['snare', 38, 0, 0.08, 0.38], ['brass', 64, 0, 0.08, 0.48], ['brass', 71, 0.085, 0.07, 0.48], ['pulse', 88, 0.17, 0.13, 0.42], ['kick', 36, 0.17, 0.1, 0.48]],
  round: [['brass', 71, 0, 0.055, 0.42], ['pulse', 76, 0.055, 0.075, 0.38], ['snare', 38, 0.055, 0.08, 0.3]],
  win: [['brass', 76, 0, 0.07, 0.52], ['brass', 80, 0.065, 0.07, 0.48], ['pulse', 83, 0.13, 0.08, 0.48], ['brass', 88, 0.22, 0.16, 0.5], ['kick', 36, 0.22, 0.1, 0.4]],
  loss: [['zap', 59, 0, 0.12, 0.5], ['brass', 58, 0.1, 0.09, 0.43], ['bass', 40, 0.2, 0.16, 0.54]],
  timeout: [['rim', 37, 0, 0.04, 0.26], ['rim', 37, 0.075, 0.04, 0.22], ['zap', 52, 0.15, 0.16, 0.45]],
  unlock: [['chip', 76, 0, 0.06, 0.3], ['pulse', 83, 0.06, 0.06, 0.32], ['chip', 88, 0.12, 0.08, 0.3], ['brass', 83, 0.23, 0.13, 0.42]],
  speedup: [['pulse', 64, 0, 0.055, 0.4], ['pulse', 71, 0.055, 0.055, 0.4], ['pulse', 76, 0.11, 0.055, 0.4], ['brass', 83, 0.165, 0.11, 0.48], ['snare', 38, 0.165, 0.08, 0.38]],
  over: [['brass', 76, 0, 0.11, 0.45], ['brass', 71, 0.15, 0.09, 0.43], ['pulse', 70, 0.28, 0.08, 0.4], ['zap', 52, 0.42, 0.17, 0.45], ['kick', 36, 0.42, 0.1, 0.45]],
  record: [['brass', 76, 0, 0.08, 0.44], ['pulse', 83, 0.09, 0.07, 0.4], ['brass', 88, 0.18, 0.08, 0.44], ['pulse', 83, 0.3, 0.06, 0.38], ['brass', 88, 0.4, 0.2, 0.48], ['snare', 38, 0.4, 0.08, 0.35]],
  pause: [['pulse', 71, 0, 0.04, 0.2], ['pulse', 64, 0.05, 0.04, 0.18]],
  resume: [['pulse', 64, 0, 0.04, 0.2], ['pulse', 71, 0.05, 0.04, 0.2]],
  tick: [['wood', 71, 0, 0.035, 0.15]],
});
