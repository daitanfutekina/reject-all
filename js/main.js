import { Run, PhaseClock, durationFor } from './engine.js';
import { seededRandom } from './random.js';
import { createProgress, entries, sources } from './fieldguide.js';
import { microgames, games, byId } from './microgames/index.js';
import { element } from './microgames/shared.js';
import { VERSION } from './version.js';
import { createAudio } from './audio.js';
import { AUDIO_DEFAULTS } from './audio-score.js';
import { BASES, SITE_CONTEXTS } from './sites.js';
import { attachStageFit } from './stage-fit.js';

const app = document.querySelector('#app');
const muteButton = document.querySelector('#mute');
const progress = createProgress();
const activeEntries = entries.filter(entry => microgames.some(game => game.patternId === entry.id));
const activeUnlockCount = () => activeEntries.filter(entry => progress.unlocked.includes(entry.id)).length;
const media = matchMedia('(prefers-reduced-motion: reduce)');
let settings = { mute: false, relaxed: false, reduced: media.matches, ...AUDIO_DEFAULTS, ...progress.settings };
const audio = createAudio();
let run, current, active, runBest = 0;
let phase = 'menu';
let newlyUnlocked = [];
let mistakes = [];
let direct = false;
let directDifficulty = 1;
let lastSeed = '';
let frame = 0;
let duration = 0;
let pausedFocus;
let prepared = null;
let stageFit;
const clock = new PhaseClock();
const params = new URLSearchParams(location.search);
const practiceMode = params.get('debug') !== '1' && microgames.some(game => game.id === params.get('practice'));
const versionLabel = document.querySelector('#build-version');
if (versionLabel) versionLabel.textContent = `v${VERSION}`;

function applySettings() {
  document.body.classList.toggle('reduced-motion', settings.reduced);
  muteButton.textContent = `Sound: ${settings.mute ? 'off' : 'on'}`;
  muteButton.setAttribute('aria-pressed', String(settings.mute));
  const muteSetting = app.querySelector('#setting-mute');
  if (muteSetting) muteSetting.checked = settings.mute;
  audio.configure(settings);
}
function wakeAudio() {
  return audio.wake();
}
muteButton.addEventListener('click', () => {
  settings.mute = !settings.mute; progress.configure(settings); applySettings(); wakeAudio();
});
media.addEventListener('change', event => {
  if (progress.settings.reduced === undefined) { settings.reduced = event.matches; applySettings(); }
});
applySettings();

// Unlock within a real gesture (including keyboard menus), as required by mobile browsers.
document.addEventListener('pointerdown', wakeAudio, { capture: true });
document.addEventListener('keydown', wakeAudio, { capture: true });
document.addEventListener('click', event => {
  if (phase === 'menu' && event.target.closest?.('button, summary')) wakeAudio().then(() => audio.cue('tap'));
});
window.addEventListener?.('pagehide', () => { if (phase !== 'menu' && !clock.paused) togglePause(); audio.hidden(true); });
window.addEventListener?.('pageshow', () => audio.hidden(document.hidden));

function menu(markup, soundtrack = 'menu') {
  stageFit?.disconnect(); stageFit = null;
  cancelAnimationFrame(frame);
  active?.cleanup(); active = null;
  prepared = null;
  phase = 'menu'; clock.paused = false;
  document.body.classList.toggle('is-playing', false);
  audio.pause(false); audio.scene(soundtrack);
  app.innerHTML = markup;
  const heading = app.querySelector('h1');
  heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true });
  window.scrollTo?.(0, 0);
}
function on(id, handler) { app.querySelector(`#${id}`).addEventListener('click', handler); }
function freshSeed() { return Math.random().toString(36).slice(2, 10); }

function title() {
  menu(`<section class="title-screen">
    <div class="title-copy"><p class="edition">The dark pattern arcade</p><h1>REJECT<br>ALL<span class="title-cross" aria-hidden="true">×</span></h1>
    <p class="tagline">The internet wants your consent.<br>Make it work for it.</p>
    <div class="title-actions"><button id="play" class="primary">Play</button><button id="guide">Field Guide <span>${activeUnlockCount()}/${activeEntries.length}</span></button><button id="settings">Settings</button></div>
    <details id="seed-options" class="seed-options"><summary>Play a specific seed</summary><label>Run seed <input id="seed" maxlength="80" placeholder="Any word or number" autocomplete="off"></label><p id="seed-message" hidden>Challenge loaded. Press Play to use this seed.</p></details><div class="build-links"><span>v${VERSION} · ${microgames.length} quick games</span><a href="sites.html">Explore ${Object.keys(BASES).length} websites</a><a href="audio.html">Sound Room</a></div></div>
    <aside class="title-demo" aria-label="How to play"><div class="fake-tab">Definitely a normal website</div><div class="demo-content"><div class="demo-stamp">NOPE.</div><h2>We need absolutely<br>all of your data.</h2><div class="fake-accept">Sounds reasonable</div><div class="fake-reject">Actually, no thanks.</div></div><div class="how-to"><strong>Read the command. Outsmart the screen.</strong><p>Tap, drag, scroll or hold. Four lives. A few seconds to say no.<br>Every win adds a pattern to your Field Guide.</p><p class="smallprint">Esc / P to pause · More time in Settings</p></div></aside>
  </section>`);
  on('play', () => start(app.querySelector('#seed').value.trim() || freshSeed()));
  on('guide', () => guide(title));
  on('settings', showSettings);
  if (params.get('seed') && params.get('debug') !== '1' && !practiceMode) {
    app.querySelector('#seed').value = params.get('seed').slice(0, 80);
    app.querySelector('#seed-options').open = true;
    app.querySelector('#seed-message').hidden = false;
  }
  if (params.get('debug') === '1') {
    const link = element('a', 'Open microgame smoke lab', 'debug-link'); link.href = 'tests/smoke.html'; app.append(link); // release-check: debug-only tests/smoke.html
  }
}

function showSettings() {
  menu(`<section class="menu-page"><button id="back" class="back">Back</button><h1>Settings</h1><p>Play on your own terms. Radical, we know.</p>
    <label class="setting"><span><strong>Mute all audio</strong><small>Music and effects. Also available in the top bar.</small></span><input type="checkbox" id="setting-mute" ${settings.mute ? 'checked' : ''}></label>
    <label class="setting"><span><strong>Music</strong><small>Original soundtrack. Builds as the speed rises.</small></span><span class="volume-control"><input type="range" id="setting-musicVolume" min="0" max="100" step="5" value="${Math.round(settings.musicVolume * 100)}" aria-label="Music volume"><output id="music-volume">${Math.round(settings.musicVolume * 100)}%</output></span></label>
    <label class="setting"><span><strong>Sound effects</strong><small>Actions, countdowns and results.</small></span><span class="volume-control"><input type="range" id="setting-effectsVolume" min="0" max="100" step="5" value="${Math.round(settings.effectsVolume * 100)}" aria-label="Sound effects volume"><output id="effects-volume">${Math.round(settings.effectsVolume * 100)}%</output></span></label>
    <p class="smallprint">Headphones optional. Every task and result is also shown on screen. <a href="audio.html">Listen to the soundtrack</a></p>
    <label class="setting"><span><strong>Relaxed timers</strong><small>1.75× as much time for every game.</small></span><input type="checkbox" id="setting-relaxed" ${settings.relaxed ? 'checked' : ''}></label>
    <label class="setting"><span><strong>Reduced motion</strong><small>Stops shaking and animated transitions. Defaults to your device preference.</small></span><input type="checkbox" id="setting-reduced" ${settings.reduced ? 'checked' : ''}></label>
    <div class="reset-area"><button id="reset" class="danger">Reset saved progress</button><p id="reset-message" class="smallprint">Erases the Field Guide, best score and settings on this device.</p><div id="reset-confirm" hidden><button id="confirm-reset" class="danger">Yes, erase progress</button> <button id="keep-progress">Keep progress</button></div></div></section>`);
  on('back', title);
  for (const key of ['mute', 'relaxed', 'reduced']) {
    app.querySelector(`#setting-${key}`).addEventListener('change', event => {
      settings[key] = event.target.checked; progress.configure(settings); applySettings(); if (key === 'mute') wakeAudio();
    });
  }
  for (const [key, label] of [['musicVolume', 'music-volume'], ['effectsVolume', 'effects-volume']]) {
    app.querySelector(`#setting-${key}`).addEventListener('input', event => {
      settings[key] = Math.max(0, Math.min(1, Number(event.target.value) / 100));
      app.querySelector(`#${label}`).textContent = `${Math.round(settings[key] * 100)}%`;
      progress.configure(settings); applySettings(); wakeAudio();
    });
    app.querySelector(`#setting-${key}`).addEventListener('change', () => audio.cue('toggle'));
  }
  on('reset', () => { app.querySelector('#reset-confirm').hidden = false; });
  on('keep-progress', () => { app.querySelector('#reset-confirm').hidden = true; });
  on('confirm-reset', () => {
    progress.reset(); settings = { mute: false, relaxed: false, reduced: media.matches, ...AUDIO_DEFAULTS }; applySettings(); showSettings();
    app.querySelector('#reset-message').textContent = 'Progress reset. Clean slate, same suspicious buttons.';
  });
}

function guide(back) {
  menu(`<section class="menu-page guide-page"><button id="back" class="back">Back</button><h1>Field Guide</h1><p>Know the trick. Keep the receipt.</p><p class="guide-count">${activeUnlockCount()} of ${activeEntries.length} patterns collected</p><div class="guide-grid" id="entries"></div><p class="disclaimer">Simplified for a game. Not legal advice.</p></section>`);
  const list = app.querySelector('#entries');
  for (const entry of activeEntries) {
    const unlocked = progress.unlocked.includes(entry.id);
    const card = element('article', '', `guide-entry ${unlocked ? '' : 'locked'}`);
    if (unlocked) {
      card.append(element('h2', entry.name), element('p', entry.description), element('p', `In the wild: ${entry.example}`, 'example'), element('p', entry.law, 'law'));
      const source = sources[entry.source];
      const link = element('a', source.title, 'source'); link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; card.append(link);
    } else card.append(element('div', '???', 'silhouette'), element('h2', 'Unidentified pattern'), element('p', `Win ${byId[entry.id].command} to collect this entry.`));
    const practice = element('a', 'Practice this pattern', 'practice-link');
    practice.href = `sites.html?game=${entry.id}&site=${SITE_CONTEXTS[entry.id][0]}#preview-frame`;
    card.append(practice); list.append(card);
  }
  on('back', back);
}

function stage() {
  stageFit?.disconnect();
  document.body.classList.toggle('is-playing', true);
  app.innerHTML = `<section class="arena"><div class="hud"><span id="lives"></span><span id="score"></span><span id="speed"></span><button id="pause" class="quiet">Pause</button></div>
    <div class="command-row"><h1 id="command"></h1><span id="seconds"></span></div><p id="hint" class="encounter-hint" hidden></p><div id="timer" class="timer" role="progressbar" aria-label="Time remaining" aria-valuemin="0" aria-valuemax="100"><div id="timer-fill"></div></div>
    <div class="play-zone"><div id="site" class="fake-site"></div><div id="transition" class="transition" aria-live="polite"></div></div><p class="run-note" id="run-note"></p>
    <div id="pause-overlay" class="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title" hidden><div><h2 id="pause-title">Paused.</h2><p>Even the fake urgency can wait.</p><p id="pause-hint" class="pause-hint"></p><button id="resume" class="primary">Resume</button><button id="quit">End run</button></div></div></section>`;
  on('pause', togglePause); on('resume', togglePause); on('quit', () => { clock.paused = false; if (direct && practiceMode) debugResult(); else gameOver(); });
  app.querySelector('#run-note').textContent = `Seed: ${lastSeed} · ${settings.relaxed ? 'Relaxed timers' : 'Standard timers'} · Esc / P to pause`;
  app.querySelector('#site').addEventListener('keydown', event => {
    if (['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) event.preventDefault();
  });
  updateHud();
  const site = app.querySelector('#site');
  stageFit = attachStageFit(app.querySelector('.play-zone'), site);
  let gesture = null;
  site.addEventListener('pointerdown', event => {
    if (phase !== 'active' || clock.paused || (event.button !== undefined && event.button !== 0)) return;
    const target = event.target.closest?.('[data-action], input, button');
    if (!target) return;
    gesture = { x: event.clientX, y: event.clientY, id: event.pointerId, moved: false, hold: target.dataset.action === 'hold' };
    if (gesture.hold) audio.hold(0);
    else if (target.matches?.('[role="slider"], [data-action="drag-extra"], [data-action="carousel"]')) audio.cue('grab');
  });
  site.addEventListener('pointermove', event => {
    if (gesture?.id === event.pointerId && Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y) > 14) gesture.moved = true;
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) site.addEventListener(name, event => {
    if (gesture?.id !== event.pointerId) return;
    if (phase === 'active' && !clock.paused) {
      if (gesture.hold) audio.cue('release'); else if (gesture.moved && name === 'pointerup') audio.cue('drop');
    }
    gesture = null; audio.hold();
  });
  site.addEventListener('click', event => {
    if (phase === 'active' && !clock.paused && event.target.closest?.('button, input, a')) audio.cue('tap');
  });
  site.addEventListener('change', () => { if (phase === 'active' && !clock.paused) audio.cue('toggle'); });
  site.addEventListener('input', () => { if (phase === 'active' && !clock.paused) audio.cue('progress'); });
}
function updateHud() {
  const practice = direct && practiceMode;
  app.querySelector('#lives').textContent = practice ? 'Practice' : `Lives ${'◆'.repeat(run.lives)}${'◇'.repeat(4 - run.lives)}`;
  app.querySelector('#lives').setAttribute('aria-label', practice ? 'Practice round; no run lives at stake' : `${run.lives} lives remaining`);
  app.querySelector('#lives').classList.toggle('practice-label', practice);
  app.querySelector('#score').textContent = `Score ${run.score}`;
  app.querySelector('#score').hidden = practice;
  app.querySelector('#speed').textContent = `${practice ? 'Level' : 'Speed'} ${direct ? directDifficulty : run.level}`;
}
function start(seed, gameId = null, difficulty = 1) {
  wakeAudio().then(() => audio.cue('start'));
  active?.cleanup(); active = null;
  cancelAnimationFrame(frame);
  lastSeed = seed; direct = Boolean(gameId); newlyUnlocked = []; mistakes = [];
  directDifficulty = difficulty;
  run = new Run(seed, microgames.map(game => game.id));
  runBest = progress.best;
  audio.pause(false); audio.scene('run', direct ? difficulty : run.level);
  clock.paused = false;
  stage();
  if (direct) {
    run.current = { id: gameId, seed, difficulty };
    current = byId[gameId]; phase = 'intro'; duration = 0; clock.start(0, performance.now());
    prepareGame(); beginGame();
  } else nextRound();
  frame = requestAnimationFrame(tick);
}
function nextRound() {
  active?.cleanup(); active = null;
  prepared = null;
  const next = run.next();
  if (!next) { gameOver(); return; }
  current = byId[next.id]; phase = 'intro';
  app.querySelector('.play-zone')?.scrollTo?.(0, 0);
  audio.round(run.level);
  const site = app.querySelector('#site'); site.inert = true;
  app.querySelector('#command').textContent = current.command;
  app.querySelector('#hint').hidden = true;
  app.querySelector('#command').classList.toggle('long-command', current.command.length > 10);
  const transition = app.querySelector('#transition'); transition.hidden = false;
  transition.className = 'transition';
  transition.replaceChildren(element('p', `Round ${run.played + 1}`, 'round-label'), element('strong', current.command, 'next-command'), element('p', `Score ${run.score} · ${run.lives} lives · Speed ${run.level}`));
  app.querySelector('#seconds').textContent = 'Get ready';
  duration = Math.max(550, 1000 - (run.level - 1) * 70);
  clock.start(duration, performance.now()); updateHud();
  prepareGame();
}
function prepareGame() {
  const site = app.querySelector('#site'); site.inert = true;
  const firstEncounter = !direct && !progress.seen.includes(current.id);
  const roundDuration = durationFor(current.baseDuration, run.current.difficulty, settings.relaxed, { firstEncounter, minDuration: current.minDuration });
  const snapshot = { ready: true, started: performance.now(), duration: roundDuration, loadingShown: false };
  prepared = snapshot;
  site.dataset.game = current.id;
  const requestedSite = params.get('site') || '';
  site.dataset.previewIdentity = direct && (!practiceMode || SITE_CONTEXTS[current.id].includes(requestedSite)) ? requestedSite : '';
  site.dataset.previewVariant = direct ? params.get('visual') || '' : '';
  active = current.setup(site, seededRandom(run.current.seed), run.current.difficulty, finish, { duration: roundDuration, relaxed: settings.relaxed, reduced: settings.reduced });
  stageFit?.refresh();
  const images = site.querySelectorAll ? [...site.querySelectorAll('img')] : [];
  const pending = images.filter(image => !image.complete && typeof image.decode === 'function').map(image => image.decode());
  if (pending.length) {
    snapshot.ready = false;
    Promise.allSettled(pending).then(() => { if (prepared === snapshot) snapshot.ready = true; });
  }
}
function beginGame() {
  // Generate under the ready screen, not after the player's clock starts.
  // Failed/stalled decorative images may not hold the arcade indefinitely.
  if (!prepared.ready && performance.now() - prepared.started < 2500) {
    app.querySelector('#seconds').textContent = 'Loading…';
    if (!prepared.loadingShown) {
      const transition = app.querySelector('#transition'); transition.hidden = false; transition.className = 'transition';
      transition.replaceChildren(element('strong', current.command, 'next-command'), element('p', 'Getting the page ready…'));
      prepared.loadingShown = true;
    }
    return;
  }
  phase = 'active';
  app.querySelector('.play-zone')?.scrollTo?.(0, 0);
  const site = app.querySelector('#site'); site.inert = false;
  app.querySelector('#transition').hidden = true;
  app.querySelector('#command').textContent = current.command;
  app.querySelector('#command').classList.toggle('long-command', current.command.length > 10);
  const firstEncounter = direct ? false : progress.encounter(current.id);
  app.querySelector('#hint').textContent = firstEncounter ? current.hint : '';
  app.querySelector('#hint').hidden = !firstEncounter;
  duration = prepared.duration;
  clock.start(duration, performance.now());
  app.querySelector('#seconds').textContent = `${(duration / 1000).toFixed(1)}s`;
  app.querySelector('#timer-fill').style.transform = 'scaleX(1)';
  app.querySelector('#timer').setAttribute('aria-valuenow', '100');
  app.querySelector('#timer').classList.toggle('urgent', false);
  app.querySelector('#hint').setAttribute('aria-live', 'polite');
  app.querySelector('#hint').setAttribute('role', 'status');
  stageFit?.refresh();
  active.update?.(duration);
}
function finish(won) {
  if (phase !== 'active' || clock.paused) return;
  const timedOut = clock.advance(performance.now()) <= 0;
  if (timedOut) won = timeoutResult();
  if (!won) mistakes.push({ id: current.id, base: active?.identity || SITE_CONTEXTS[current.id]?.[0] || 'market', timedOut });
  phase = 'feedback';
  app.querySelector('.play-zone')?.scrollTo?.(0, 0);
  app.querySelector('#site').inert = true;
  run.resolve(won);
  const unlocked = won && !direct && progress.unlock(current.patternId);
  if (unlocked) newlyUnlocked.push(current.patternId);
  if (!direct) progress.record(run.score);
  audio.hold(); audio.cue(won ? 'win' : timedOut ? 'timeout' : 'loss');
  if (unlocked) audio.cue('unlock');
  updateHud();
  const transition = app.querySelector('#transition'); transition.hidden = false;
  transition.className = `transition feedback ${won ? 'win' : 'lose'}`;
  transition.replaceChildren(element('strong', won ? '✓ WIN' : '× LOSE', 'result-stamp'), element('p', won ? run.streak >= 3 ? `${run.streak} in a row. Keep control.` : 'Your choice. For once.' : timedOut ? 'Out of time. The website got its way.' : 'The website got its way.'), element('p', unlocked ? `Collected: ${entries.find(entry => entry.id === current.patternId).name}` : '', 'unlock-note'));
  app.querySelector('#seconds').textContent = won ? 'Cleared' : 'Lost a life';
  clock.start(1000, performance.now());
}
function timeoutResult() { return active?.timeoutResult?.() ?? Boolean(current.timeoutWin); }
function tick(now) {
  if (phase === 'menu') return;
  const remaining = clock.advance(now);
  if (!clock.paused) {
    const fraction = phase === 'active' ? remaining / duration : phase === 'intro' ? 1 : 0;
    app.querySelector('#timer-fill').style.transform = `scaleX(${fraction})`;
    app.querySelector('#timer').setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
    app.querySelector('#timer').classList.toggle('urgent', phase === 'active' && remaining <= 3000);
    if (phase === 'active') {
      app.querySelector('#seconds').textContent = `${(remaining / 1000).toFixed(1)}s`;
      active?.update?.(remaining);
      if (phase === 'active') {
        audio.remaining(remaining);
        const meter = app.querySelector('#site').querySelector('.hold-progress');
        if (meter && Number(meter.value) > 0) audio.hold(Number(meter.value) / Number(meter.max));
      }
    }
    // update() may finish a game and start the feedback clock during this frame.
    // Its old zero must not also skip that newly started feedback phase.
    if (remaining === 0 && !(phase === 'feedback' && clock.remaining > 0)) {
      if (phase === 'intro') beginGame();
      else if (phase === 'active') finish(timeoutResult());
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
  audio.hold(); audio.pause(paused);
  if (paused) active?.cancelInput?.();
  const overlay = app.querySelector('#pause-overlay'); overlay.hidden = !paused;
  for (const selector of ['#site', '#pause']) app.querySelector(selector).inert = paused || (selector === '#site' && phase !== 'active');
  if (paused) { pausedFocus = document.activeElement; app.querySelector('#pause-hint').textContent = current.hint; app.querySelector('#resume').focus(); }
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
document.addEventListener('visibilitychange', () => {
  if (document.hidden && phase !== 'menu' && !clock.paused) togglePause();
  audio.hidden(document.hidden);
});
matchMedia('(orientation: portrait)').addEventListener('change', () => {
  if (phase !== 'menu' && !clock.paused) togglePause();
});

function gameOver() {
  if (!direct) progress.record(run.score);
  menu(`<section class="menu-page game-over"><p class="edition">Run complete</p><h1>REJECTED.</h1><p class="final-score">Score <strong>${run.score}</strong><span>Best ${progress.best}</span></p><p id="new-best" class="new-best" ${run.score > runBest ? '' : 'hidden'}>A new personal best.</p><div class="run-stats" id="run-stats"><div><strong>${run.cleared}/${run.played}</strong><span>Rounds cleared</span></div><div><strong>${run.bestStreak}</strong><span>Best streak</span></div><div><strong>${run.played ? Math.round(run.cleared / run.played * 100) + '%' : '—'}</strong><span>Accuracy</span></div></div><p>${run.over ? 'Out of lives. Still entitled to your privacy.' : 'You ended this run. A perfectly valid choice.'}</p><div class="end-actions"><button id="retry" class="primary">Retry seed</button><button id="new-run">New run</button><button id="guide">Field Guide</button><button id="home">Title screen</button></div><button id="copy-challenge" class="back">Copy challenge link</button><p id="share-status" class="smallprint" role="status"></p><input id="challenge-link" class="challenge-link" readonly aria-label="Challenge link" hidden><p id="result-seed" class="smallprint"></p><div id="mistake-review"></div><div id="new-patterns"></div></section>`, 'results');
  wakeAudio().then(() => audio.cue(run.score > runBest ? 'record' : 'over'));
  app.querySelector('#result-seed').textContent = `Seed: ${lastSeed}`;
  // Embedded hosts use temporary file URLs; a seed also works on the public game page.
  const embedded = window.self !== window.top;
  if (embedded) {
    app.querySelector('#copy-challenge').textContent = 'Copy challenge seed';
    app.querySelector('#challenge-link').setAttribute('aria-label', 'Challenge seed');
  }
  on('copy-challenge', async () => {
    const link = new URL('index.html', location.href); link.searchParams.set('seed', lastSeed);
    const challenge = embedded ? lastSeed : link.href;
    const field = app.querySelector('#challenge-link'); field.value = challenge;
    try {
      if (!navigator.clipboard) throw new Error('Manual copy');
      await navigator.clipboard.writeText(challenge);
      app.querySelector('#share-status').textContent = embedded ? 'Seed copied. Share it with a friend to enter under “Play a specific seed”.' : 'Challenge link copied. Same seed, same sequence.';
    } catch {
      field.hidden = false; field.focus(); field.select();
      app.querySelector('#share-status').textContent = embedded ? 'Copy this seed and enter it under “Play a specific seed” on the title screen.' : 'Copy this link to share the challenge.';
    }
  });
  if (mistakes.length) {
    const review = app.querySelector('#mistake-review'); review.append(element('h2', 'Next time'));
    for (const mistake of mistakes) {
      const game = byId[mistake.id], item = element('article', '', 'mistake-card');
      item.append(element('h3', game.command), element('p', `${mistake.timedOut ? 'Time ran out. ' : ''}${game.hint}`));
      const practice = element('a', 'Practice this pattern', 'practice-link'); practice.href = `sites.html?game=${game.id}&site=${mistake.base}#preview-frame`;
      item.append(practice); review.append(item);
    }
  }
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
  const base = active?.identity || SITE_CONTEXTS[id]?.[0] || 'market';
  const heading = practiceMode ? run.played === 0 ? 'Practice ended.' : run.score > 0 ? 'Practice cleared.' : 'Give it another try.' : 'Smoke round complete';
  const back = practiceMode ? `<a id="practice-back" href="sites.html?game=${id}&site=${base}#preview-frame">Back to practice</a>` : '<a id="smoke-lab" href="tests/smoke.html">Smoke lab</a>'; // release-check: debug-only tests/smoke.html
  menu(`<section class="menu-page"><h1 id="direct-result-title">${heading}</h1><p>${run.played === 0 ? 'Ended early' : run.score > 0 ? 'WIN' : 'LOSE'} · ${current.command}</p><div class="end-actions"><button id="again" class="primary">Run it again</button><button id="home">Title screen</button></div>${back}<p>${practiceMode ? 'Practice does' : 'Smoke rounds do'} not change saved progress.</p></section>`);
  on('again', () => start(lastSeed, id, difficulty)); on('home', title);
}

if (params.get('debug') === '1' && byId[params.get('game')]) start(params.get('seed') || 'smoke', params.get('game'), Math.max(1, Math.min(20, Number(params.get('difficulty')) || 1)));
else if (practiceMode) start(params.get('seed') || 'practice', params.get('practice'), Math.max(1, Math.min(20, Number(params.get('difficulty')) || 1)));
else title();
