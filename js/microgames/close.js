import { tierFor } from '../engine.js';
import { integer, shuffle, pick } from '../random.js';
import { session, heading, button, element, drag } from './shared.js';

export function create(rng, difficulty) {
  return { count: 1 + tierFor(difficulty), positions: shuffle(rng, ['top-left', 'bottom-right', 'top-right', 'bottom-left']), pitch: pick(rng, ['Let us send notifications!', 'Please join our newsletter!', 'One more offer before you go!', 'Unlock our daily deals!', 'Join the early access list!', 'Get alerts for every update!']), sheet: rng() < 0.5 };
}
export default {
  id: 'close', command: 'CLOSE!', patternId: 'close', baseDuration: 4500, minDuration: 4500,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Nudge Cabinet', difficulty);
    heading(game.content, 'Just trying to read.', config.sheet ? 'Drag every bottom sheet down to dismiss.' : 'Close every pop-up. Yes, every one.');
    const zone = element('div', '', 'nag-zone'); game.content.append(zone);
    let closed = 0;
    function render() {
      zone.replaceChildren();
      const popup = element('section', '', `nag-popup ${config.sheet ? 'bottom-sheet' : config.positions[closed]}`);
      const dismiss = () => { closed++; if (closed === config.count) finish(true); else render(); };
      if (config.sheet) {
        const handle = element('div', '━━  Drag down', 'sheet-handle'); handle.dataset.action = 'swipe-close'; popup.append(handle);
        drag(game, handle, (dx, dy) => { popup.style.transform = `translateY(${Math.max(0, Math.min(70, dy))}px)`; }, (dx, dy, event, cancelled) => {
          popup.style.transform = ''; if (!cancelled && dy >= 55) dismiss();
        });
      } else {
        const close = button(game, popup, '×', dismiss, 'close-x', 'close');
        close.setAttribute('aria-label', 'Close pop-up');
      }
      popup.append(element('h3', config.pitch), element('p', closed ? 'You seem to have clicked the wrong button.' : 'This will only take forever.'));
      button(game, popup, 'Fine, sign me up', () => finish(false), 'site-primary', 'accept');
      zone.append(popup);
    }
    render(); return game;
  },
};
