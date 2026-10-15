import { integer, shuffle, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng, difficulty) {
  return { count: integer(rng, 2, Math.min(4, difficulty + 2)), positions: shuffle(rng, ['top-left', 'bottom-right', 'top-right', 'bottom-left']), pitch: pick(rng, ['Let us send notifications!', 'Please join our newsletter!', 'One more offer before you go!']) };
}
export default {
  id: 'close', command: 'CLOSE!', patternId: 'close', baseDuration: 4500,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Nudge Cabinet');
    heading(game.content, 'Just trying to read.', 'Close every pop-up. Yes, every one.');
    const zone = element('div', '', 'nag-zone'); game.content.append(zone);
    let closed = 0;
    function render() {
      zone.replaceChildren();
      const popup = element('section', '', `nag-popup ${config.positions[closed]}`);
      const close = button(game, popup, '×', () => { closed++; if (closed === config.count) finish(true); else render(); }, 'close-x', 'close');
      close.setAttribute('aria-label', 'Close pop-up');
      popup.append(element('h3', config.pitch), element('p', closed ? 'You seem to have clicked the wrong button.' : 'This will only take forever.'));
      button(game, popup, 'Fine, sign me up', () => finish(false), 'site-primary', 'accept');
      zone.append(popup);
    }
    render(); return game;
  },
};
