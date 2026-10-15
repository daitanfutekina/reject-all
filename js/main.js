import { Run, PhaseClock, durationFor } from './engine.js';
import { seededRandom } from './random.js';
import { createProgress, entries, sources } from './fieldguide.js';
import { microgames, games, byId } from './microgames/index.js';
import { element } from './microgames/shared.js';

const app = document.querySelector('#app');
const muteButton = document.querySelector('#mute');
const progress = createProgress();
const media = matchMedia('(prefers-reduced-motion: reduce)');
let settings = { mute: false, relaxed: false, reduced: media.matches, ...progress.settings };
let run, current, active, audio;
let phase = 'menu';
let newlyUnlocked = [];
let direct = false;
let lastSeed = '';
let frame = 0;
let duration = 0;
let pausedFocus;
const clock = new PhaseClock();
const params = new URLSearchParams(location.search);

function applySettings() {
  document.body.classList.toggle('reduced-motion', settings.reduced);
  muteButton.textContent = `Sound: ${settings.mute ? 'off' : 'on'}`;
  muteButton.setAttribute('aria-pressed', String(settings.mute));
  if (settings.mute && audio?.state === 'running') audio.suspend().catch(() => {});
}
function wakeAudio() {
  if (settings.mute) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
  } catch { /* Audio is optional; the arcade also works silently. */ }
}
function beep(won) {
  if (settings.mute || !audio || audio.state !== 'running') return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = won ? 'sine' : 'triangle';
  oscillator.frequency.setValueAtTime(won ? 660 : 160, audio.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(won ? 990 : 80, audio.currentTime + 0.12);
  gain.gain.setValueAtTime(0.07, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.16);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start(); oscillator.stop(audio.currentTime + 0.17);
}
muteButton.addEventListener('click', () => {
  settings.mute = !settings.mute; progress.configure(settings); applySettings(); wakeAudio();
});
media.addEventListener('change', event => {
  if (progress.settings.reduced === undefined) { settings.reduced = event.matches; applySettings(); }
});
applySettings();

function menu(markup) {
  cancelAnimationFrame(frame);
  active?.cleanup(); active = null;
  phase = 'menu'; clock.paused = false;
  app.innerHTML = markup;
}
function on(id, handler) { app.querySelector(`#${id}`).addEventListener('click', handler); }
function freshSeed() { return Math.random().toString(36).slice(2, 10); }

function title() {
  menu(`<section class="title-screen">
    <div class="title-copy"><p class="edition">The dark pattern arcade</p><h1>REJECT<br>ALL<span class="title-cross" aria-hidden="true">×</span></h1>
    <p class="tagline">The internet wants your consent.<br>Make it work for it.</p>
    <div class="title-actions"><button id="play" class="primary">Play</button><button id="guide">Field Guide <span>${progress.unlocked.length}/11</span></button><button id="settings">Settings</button></div>
    <details class="seed-options"><summary>Play a specific seed</summary><label>Run seed <input id="seed" maxlength="80" placeholder="Any word or number" autocomplete="off"></label></details></div>
    <aside class="title-demo" aria-label="How to play"><div class="fake-tab">Definitely a normal website</div><div class="demo-content"><div class="demo-stamp">NOPE.</div><h2>We need absolutely<br>all of your data.</h2><div class="fake-accept">Sounds reasonable</div><div class="fake-reject">Actually, no thanks.</div></div><div class="how-to"><strong>Read the command. Outsmart the screen.</strong><p>Tap or click. Four lives. A few seconds to say no.<br>Every win adds a pattern to your Field Guide.</p><p class="smallprint">Esc / P to pause · More time in Settings</p></div></aside>
  </section>`);
  on('play', () => start(app.querySelector('#seed').value.trim() || freshSeed()));
  on('guide', () => guide(title));
  on('settings', showSettings);
  if (params.has('debug')) {
    const link = element('a', 'Open microgame smoke lab', 'debug-link'); link.href = 'tests/smoke.html'; app.append(link);
  }
}

function showSettings() {
  menu(`<section class="menu-page"><button id="back" class="back">Back</button><h1>Settings</h1><p>Play on your own terms. Radical, we know.</p>
    <label class="setting"><span><strong>Mute sound</strong><small>Short synthesised beeps only.</small></span><input type="checkbox" id="setting-mute" ${settings.mute ? 'checked' : ''}></label>
    <label class="setting"><span><strong>Relaxed timers</strong><small>1.75× as much time, including the boss.</small></span><input type="checkbox" id="setting-relaxed" ${settings.relaxed ? 'checked' : ''}></label>
    <label class="setting"><span><strong>Reduced motion</strong><small>Stops shaking and animated transitions. Defaults to your device preference.</small></span><input type="checkbox" id="setting-reduced" ${settings.reduced ? 'checked' : ''}></label>
    <div class="reset-area"><button id="reset" class="danger">Reset saved progress</button><p id="reset-message" class="smallprint">Erases the Field Guide, best score and settings on this device.</p><div id="reset-confirm" hidden><button id="confirm-reset" class="danger">Yes, erase progress</button> <button id="keep-progress">Keep progress</button></div></div></section>`);
  on('back', title);
  for (const key of ['mute', 'relaxed', 'reduced']) {
    app.querySelector(`#setting-${key}`).addEventListener('change', event => {
      settings[key] = event.target.checked; progress.configure(settings); applySettings(); if (key === 'mute') wakeAudio();
    });
  }
  on('reset', () => { app.querySelector('#reset-confirm').hidden = false; });
  on('keep-progress', () => { app.querySelector('#reset-confirm').hidden = true; });
  on('confirm-reset', () => {
    progress.reset(); settings = { mute: false, relaxed: false, reduced: media.matches }; applySettings(); showSettings();
    app.querySelector('#reset-message').textContent = 'Progress reset. Clean slate, same suspicious buttons.';
  });
}

function guide(back) {
  menu(`<section class="menu-page guide-page"><button id="back" class="back">Back</button><h1>Field Guide</h1><p>Know the trick. Keep the receipt.</p><p class="guide-count">${progress.unlocked.length} of 11 patterns collected</p><div class="guide-grid" id="entries"></div><p class="disclaimer">Simplified for a game. Not legal advice.</p></section>`);
  const list = app.querySelector('#entries');
  for (const entry of entries) {
    const unlocked = progress.unlocked.includes(entry.id);
    const card = element('article', '', `guide-entry ${unlocked ? '' : 'locked'}`);
    if (unlocked) {
      card.append(element('h2', entry.name), element('p', entry.description), element('p', `In the wild: ${entry.example}`, 'example'), element('p', entry.law, 'law'));
      const source = sources[entry.source];
      const link = element('a', source.title, 'source'); link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; card.append(link);
    } else card.append(element('div', '???', 'silhouette'), element('h2', 'Unidentified pattern'), element('p', `Win ${byId[entry.id].command} to collect this entry.`));
    list.append(card);
  }
  on('back', back);
}

function stage() {
  app.innerHTML = `<section class="arena"><div class="hud"><span id="lives"></span><span id="score"></span><span id="speed"></span><button id="pause" class="quiet">Pause</button></div>
    <div class="command-row"><h1 id="command"></h1><span id="seconds"></span></div><div id="timer" class="timer" role="progressbar" aria-label="Time remaining" aria-valuemin="0" aria-valuemax="100"><div id="timer-fill"></div></div>
    <div class="play-zone"><div id="site" class="fake-site"></div><div id="transition" class="transition" aria-live="polite"></div></div><p class="run-note" id="run-note"></p>
    <div id="pause-overlay" class="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title" hidden><div><h2 id="pause-title">Paused.</h2><p>Even the fake urgency can wait.</p><button id="resume" class="primary">Resume</button><button id="quit">End run</button></div></div></section>`;
  on('pause', togglePause); on('resume', togglePause); on('quit', () => { clock.paused = false; gameOver(); });
  app.querySelector('#run-note').textContent = `Seed: ${lastSeed} · ${settings.relaxed ? 'Relaxed timers' : 'Standard timers'} · Esc / P to pause`;
  app.querySelector('#site').addEventListener('keydown', event => {
    if (['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
  });
  updateHud();
}
function updateHud() {
  app.querySelector('#lives').textContent = `Lives ${'◆'.repeat(run.lives)}${'◇'.repeat(4 - run.lives)}`;
  app.querySelector('#lives').setAttribute('aria-label', `${run.lives} lives remaining`);
  app.querySelector('#score').textContent = `Score ${run.score}`;
  app.querySelector('#speed').textContent = `Speed ${run.level}`;
}
function start(seed, gameId = null, difficulty = 1) {
  wakeAudio();
  active?.cleanup(); active = null;
  cancelAnimationFrame(frame);
  lastSeed = seed; direct = Boolean(gameId); newlyUnlocked = [];
  run = new Run(seed, microgames.map(game => game.id));
  clock.paused = false;
  stage();
  if (direct) {
    run.current = { id: gameId, seed, difficulty };
    current = byId[gameId]; beginGame();
  } else nextRound();
  frame = requestAnimationFrame(tick);
}
function nextRound() {
  active?.cleanup(); active = null;
  const next = run.next();
  if (!next) { gameOver(); return; }
  current = byId[next.id]; phase = 'intro';
  const site = app.querySelector('#site'); site.inert = true;
  app.querySelector('#command').textContent = current.command;
  app.querySelector('#command').classList.toggle('boss-command', current.id === 'gym');
  const transition = app.querySelector('#transition'); transition.hidden = false;
  transition.className = 'transition';
  transition.replaceChildren(element('p', current.id === 'gym' ? 'Boss · win back one life' : `Round ${run.played + 1}`, 'round-label'), element('strong', current.command, 'next-command'), element('p', `Score ${run.score} · ${run.lives} lives · Speed ${run.level}`));
  app.querySelector('#seconds').textContent = 'Get ready';
  duration = Math.max(550, 1000 - (run.level - 1) * 70);
  clock.start(duration, performance.now()); updateHud();
}
function beginGame() {
  phase = 'active';
  const site = app.querySelector('#site'); site.inert = false;
  app.querySelector('#transition').hidden = true;
  app.querySelector('#command').textContent = current.command;
  app.querySelector('#command').classList.toggle('boss-command', current.id === 'gym');
  duration = durationFor(current.baseDuration, run.current.difficulty, settings.relaxed, current.id === 'gym');
  clock.start(duration, performance.now());
  active = current.setup(site, seededRandom(run.current.seed), run.current.difficulty, finish);
  active.update?.(duration);
}
function finish(won) {
  if (phase !== 'active' || clock.paused) return;
  if (clock.advance(performance.now()) <= 0) won = Boolean(current.timeoutWin);
  phase = 'feedback';
  app.querySelector('#site').inert = true;
  run.resolve(won);
  const unlocked = won && !direct && progress.unlock(current.patternId);
  if (unlocked) newlyUnlocked.push(current.patternId);
  if (!direct) progress.record(run.score);
  beep(won); updateHud();
  const transition = app.querySelector('#transition'); transition.hidden = false;
  transition.className = `transition feedback ${won ? 'win' : 'lose'}`;
  transition.replaceChildren(element('strong', won ? '✓ WIN' : '× LOSE', 'result-stamp'), element('p', won ? current.id === 'gym' ? 'Membership cancelled. +1 life (max 4).' : 'Your choice. For once.' : 'The website got its way.'), element('p', unlocked ? `Collected: ${entries.find(entry => entry.id === current.patternId).name}` : '', 'unlock-note'));
  app.querySelector('#seconds').textContent = won ? 'Cleared' : 'Lost a life';
  clock.start(1000, performance.now());
}
function tick(now) {
  if (phase === 'menu') return;
  const remaining = clock.advance(now);
  if (!clock.paused) {
    const fraction = phase === 'active' ? remaining / duration : phase === 'intro' ? 1 : 0;
    app.querySelector('#timer-fill').style.transform = `scaleX(${fraction})`;
    app.querySelector('#timer').setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
    if (phase === 'active') {
      app.querySelector('#seconds').textContent = `${(remaining / 1000).toFixed(1)}s`;
      active?.update?.(remaining);
    }
    if (remaining === 0) {
      if (phase === 'intro') beginGame();
      else if (phase === 'active') finish(Boolean(current.timeoutWin));
      else if (direct) debugResult();
      else if (run.over) gameOver();
      else nextRound();
    }
  }
  if (phase !== 'menu') frame = requestAnimationFrame(tick);
}
function togglePause() {
  if (phase === 'menu') return;
  const paused = !clock.paused;
  clock.setPaused(paused, performance.now());
  const overlay = app.querySelector('#pause-overlay'); overlay.hidden = !paused;
  for (const selector of ['#site', '#pause']) app.querySelector(selector).inert = paused || (selector === '#site' && phase !== 'active');
  if (paused) { pausedFocus = document.activeElement; app.querySelector('#resume').focus(); }
  else { pausedFocus?.focus(); wakeAudio(); }
}
document.addEventListener('keydown', event => {
  if (phase === 'menu') return;
  if (event.key === 'Escape' || event.key.toLowerCase() === 'p') { event.preventDefault(); if (!event.repeat) togglePause(); }
  if (clock.paused && event.key === 'Tab') {
    event.preventDefault();
    const resume = app.querySelector('#resume'); const quit = app.querySelector('#quit');
    (document.activeElement === resume ? quit : resume).focus();
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden && phase !== 'menu' && !clock.paused) togglePause(); });

function gameOver() {
  if (!direct) progress.record(run.score);
  menu(`<section class="menu-page game-over"><p class="edition">Run complete</p><h1>REJECTED.</h1><p class="final-score">Score <strong>${run.score}</strong><span>Best ${progress.best}</span></p><p>${run.over ? 'Out of lives. Still entitled to your privacy.' : 'You ended this run. A perfectly valid choice.'}</p><div id="new-patterns"></div><div class="end-actions"><button id="retry" class="primary">Retry seed</button><button id="new-run">New run</button><button id="guide">Field Guide</button><button id="home">Title screen</button></div><p id="result-seed" class="smallprint"></p></section>`);
  app.querySelector('#result-seed').textContent = `Seed: ${lastSeed}`;
  const collected = app.querySelector('#new-patterns'); collected.append(element('h2', 'New patterns collected'));
  if (newlyUnlocked.length) {
    const list = element('ul', '');
    newlyUnlocked.forEach(id => list.append(element('li', entries.find(entry => entry.id === id).name))); collected.append(list);
  } else collected.append(element('p', 'None this run. A first win unlocks each entry.'));
  on('retry', () => start(lastSeed)); on('new-run', () => start(freshSeed())); on('guide', () => guide(gameOver)); on('home', title);
}
function debugResult() {
  const id = current.id;
  const difficulty = Math.max(1, Math.min(20, Number(params.get('difficulty')) || 1));
  menu(`<section class="menu-page"><h1>Smoke round complete</h1><p>${run.score > 0 ? 'WIN' : 'LOSE'} · ${current.command}</p><button id="again" class="primary">Run it again</button> <a href="tests/smoke.html">Smoke lab</a> <button id="home">Title screen</button><p>Smoke rounds do not change saved progress.</p></section>`);
  on('again', () => start(lastSeed, id, difficulty)); on('home', title);
}

if (params.get('debug') === '1' && byId[params.get('game')]) start(params.get('seed') || 'smoke', params.get('game'), Math.max(1, Math.min(20, Number(params.get('difficulty')) || 1)));
else title();
