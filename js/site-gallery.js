import { BASES, SITE_CONTEXTS } from './sites.js';
import { byId } from './microgames/index.js';
import { seededRandom } from './random.js';

const defaults = { market: 'remove', studio: 'gym', harvest: 'decline', social: 'contacts', astral: 'odds', software: 'download', stream: 'trial', fitness: 'gym', travel: 'wait', arcade: 'odds', filehost: 'download', freevideo: 'close', tickets: 'remove', recipes: 'decline', qa: 'close', mail: 'phish' };
const situations = Object.fromEntries(Object.keys(BASES).map(base => {
  const compatible = Object.keys(SITE_CONTEXTS).filter(id => SITE_CONTEXTS[id].includes(base));
  return [base, [defaults[base], ...compatible.filter(id => id !== defaults[base])]];
}));
const params = new URLSearchParams(location.search);
let identity = BASES[params.get('site')] ? params.get('site') : SITE_CONTEXTS[params.get('game')]?.[0] || 'market';
let seed = 1, active, previousTime = null, remaining = 120000;
let observation = false;
const site = document.querySelector('#preview-site');
const select = document.querySelector('#scenario');
const result = document.querySelector('#preview-result');
const navigation = document.querySelector('#identities');
const startObservation = document.querySelector('#practice-start');
document.querySelector('#collection-lab').hidden = params.get('debug') !== '1';
function complete(won) {
  result.textContent = won ? 'You kept control. Nice choice.' : 'That choice gave the service what it wanted. Try again.';
  result.dataset.outcome = won ? 'win' : 'lose'; site.inert = true;
}

for (const [id, base] of Object.entries(BASES)) {
  const button = document.createElement('button'); button.type = 'button'; button.dataset.base = id;
  const swatch = document.createElement('span'); swatch.className = 'identity-swatch swatch-' + id; swatch.textContent = base.name.slice(0, 1);
  const label = document.createElement('span');
  const name = document.createElement('strong'); name.textContent = base.name;
  const category = document.createElement('small'); category.textContent = base.label;
  label.append(name, category); button.append(swatch, label);
  button.addEventListener('click', () => choose(id)); navigation.append(button);
}
function choose(id, gameId = '') {
  identity = id;
  for (const button of navigation.children) button.setAttribute('aria-pressed', String(button.dataset.base === id));
  document.querySelector('#identity-name').textContent = BASES[id].name;
  document.querySelector('#identity-description').textContent = BASES[id].caption;
  select.replaceChildren();
  for (const gameId of situations[id]) {
    const option = document.createElement('option'); option.value = gameId; option.textContent = byId[gameId].command; select.append(option);
  }
  if (situations[id].includes(gameId)) select.value = gameId;
  render();
}
function render() {
  active?.cleanup();
  const game = byId[select.value];
  observation = game.id === 'wait' || game.id === 'whack';
  remaining = observation ? game.baseDuration : 120000; previousTime = null;
  site.dataset.previewIdentity = identity; site.dataset.game = select.value;
  site.dataset.previewVariant = String(seed - 1);
  result.textContent = observation ? `Begin a ${remaining / 1000}-second observation. No lives are at stake.` : 'Explore the controls. No timer.'; result.dataset.outcome = '';
  site.inert = observation; startObservation.hidden = !observation; startObservation.disabled = false;
  active = game.setup(site, seededRandom('gallery-' + seed), 3, complete, { duration: remaining, relaxed: true, reduced: true });
  active.update?.(remaining);
  document.querySelector('#play-situation').href = `index.html?practice=${select.value}&site=${identity}&visual=${seed - 1}&seed=gallery-${seed}&difficulty=3`;
}
select.addEventListener('change', render);
startObservation.addEventListener('click', () => {
  site.inert = false; previousTime = null; startObservation.disabled = true;
  document.querySelector('#preview-frame').scrollIntoView({ block: 'start' });
  result.textContent = `Observe for ${remaining / 1000} seconds. No lives are at stake.`;
});
document.querySelector('#restart-preview').addEventListener('click', render);
document.querySelector('#shuffle-site').addEventListener('click', () => { seed++; render(); });
for (const mode of ['desktop', 'phone']) document.querySelector('#' + mode + '-width').addEventListener('click', () => {
  document.querySelector('#preview-frame').classList.toggle('phone-preview', mode === 'phone');
  for (const other of ['desktop', 'phone']) document.querySelector('#' + other + '-width').setAttribute('aria-pressed', String(other === mode));
});
choose(identity, params.get('game'));
// Ordinary practice has no deadline. Waiting/resetting patterns have an explicit
// short observation started by the player, never a two-minute or endless wait.
function tick(now) {
  if (!document.hidden && !site.inert) {
    remaining -= previousTime === null ? 0 : Math.min(100, now - previousTime);
    // Untimed controls still need an advancing elapsed clock after two minutes.
    if (observation) remaining = Math.max(0, remaining);
    active?.update?.(remaining);
    if (observation && remaining === 0 && !site.inert) complete(active.timeoutResult?.() ?? Boolean(byId[select.value].timeoutWin));
  }
  previousTime = now; requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange', () => { previousTime = null; active?.cancelInput?.(); });
requestAnimationFrame(tick);
