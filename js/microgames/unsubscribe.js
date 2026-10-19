import { pick, shuffle } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element } from './shared.js';

export default {
  id: 'unsubscribe', command: 'UNSUBSCRIBE!', patternId: 'unsubscribe', baseDuration: 6000, minDuration: 5500,
  setup(root, rng, difficulty, finish) {
    const tier = tierFor(difficulty);
    const game = session(root, rng, pick(rng, ['Post Orchard', 'Letter Lagoon', 'Inbox Quarry']), difficulty);
    const names = shuffle(rng, ['Daily deals', 'Partner news', 'Weekend picks', 'Product updates', 'Local offers', 'Member stories', 'Seasonal savings']).slice(0, 1 + tier * 2);
    const orders = Array.from({ length: tier }, () => shuffle(rng, ['reduce', 'pause', 'unsubscribe']));
    let step = 0;
    function render() {
      game.content.replaceChildren();
      game.step(step + 1, tier);
      heading(game.content, 'Email preferences', 'Stop ALL newsletters permanently.');
      const list = element('div', '', 'newsletter-list');
      names.forEach(name => list.append(element('span', `${name}: subscribed`))); game.content.append(list);
      for (const action of orders[step]) {
        if (action === 'reduce') button(game, game.content, 'Just reduce frequency', () => finish(false), 'site-primary', 'reduce');
        else if (action === 'pause') button(game, game.content, 'Pause for 30 days', () => finish(false), 'fine-link', 'pause-mail');
        else button(game, game.content, step < tier - 1 ? ['More email options', 'Permanent changes'][step] : 'Unsubscribe from all', () => {
          if (step < tier - 1) { step++; render(); }
          else { game.content.replaceChildren(element('h2', 'Unsubscribed from all newsletters')); finish(true); }
        }, 'fine-link', 'unsubscribe');
      }
    }
    render(); return game;
  },
};
