import { createAudio } from './audio.js';
import { AUDIO_DEFAULTS } from './audio-score.js';

const audio = createAudio(), levels = { ...AUDIO_DEFAULTS };
let playing = false;
const status = document.querySelector('#audio-status');
const scenes = [...document.querySelectorAll('[data-scene]')];
const cues = {
  tap: 'Tap', toggle: 'Switch', grab: 'Grab', drop: 'Drop', release: 'Release', progress: 'Hold step',
  start: 'Launch fanfare', round: 'Round sting', tick: 'Countdown tick', win: 'Victory burst', loss: 'Mistake zap', timeout: 'Time up',
  unlock: 'Pattern collected', speedup: 'Speed burst', pause: 'Pause', resume: 'Resume', over: 'Run ended', record: 'Record fanfare',
};
audio.configure(levels);
function configure() { audio.configure({ ...levels, musicVolume: playing ? levels.musicVolume : 0 }); }
function update() {
  const state = audio.status;
  document.querySelector('#listen').textContent = playing ? 'Pause music' : 'Play music';
  status.textContent = state.ready ? `${playing ? 'Playing' : 'Music paused'} · ${state.tempo} BPM · ${state.scene === 'run' ? 'Run' : state.scene === 'menu' ? 'Title' : 'Results'} arrangement` : 'Audio is paused. Press Play music to listen.';
}
for (const button of scenes) button.addEventListener('click', async () => {
  scenes.forEach(node => node.setAttribute('aria-pressed', String(node === button)));
  audio.scene(button.dataset.scene, Number(button.dataset.level) || 1); playing = true;
  configure(); await audio.wake(); update();
});
document.querySelector('#listen').addEventListener('click', async () => {
  playing = !playing; configure(); await audio.wake(); update();
});
document.querySelector('#stop-audio').addEventListener('click', () => {
  playing = false; audio.configure({ ...levels, mute: true }); update();
});
for (const [name, label] of Object.entries(cues)) {
  const button = document.createElement('button'); button.textContent = label; button.dataset.cue = name;
  button.addEventListener('click', async () => { configure(); await audio.wake(); audio.cue(name); update(); });
  document.querySelector('#sound-cues').append(button);
}
for (const [id, key] of [['music', 'musicVolume'], ['effects', 'effectsVolume']]) {
  document.querySelector(`#${id}-level`).addEventListener('input', event => {
    levels[key] = Number(event.target.value) / 100;
    document.querySelector(`#${id}-value`).textContent = `${event.target.value}%`; configure();
  });
}
document.addEventListener('visibilitychange', () => { audio.hidden(document.hidden); });
window.addEventListener('pagehide', () => audio.hidden(true));
window.addEventListener('pageshow', () => audio.hidden(document.hidden));
