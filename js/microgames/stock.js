import { tierFor } from '../engine.js';
import { shuffle, integer } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { verdict } from './evidence.js';

export function create(rng, difficulty) {
  const tier = tierFor(difficulty);
  return shuffle(rng, ['Lamp', 'Mug', 'Clock', 'Tray'].slice(0, tier + 1).map((name, index) => {
    const available = index === 1 ? 2 : integer(rng, 8, 20);
    const sold = tier >= 2 ? integer(rng, 2, 6) : 0, reserved = tier === 3 ? integer(rng, 1, 4) : 0;
    return { name, received: available + sold + reserved, sold, reserved, displayed: index % 2 === 0 ? 1 : available };
  }));
}
export default {
  id: 'stock', command: 'STOCK!', patternId: 'stock', baseDuration: 24000, minDuration: 20000,
  setup(root, rng, difficulty, finish) {
    const rows = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Stock Sprout', difficulty);
    heading(game.content, 'Check every stock claim', 'All records are for the same product and snapshot, 10:00. Available = received − sold − reserved. Flag a count that understates availability; keep matching counts.');
    let remaining = rows.length;
    rows.forEach((row, index) => {
      const card = element('section', '', 'evidence-card');
      card.append(element('h3', `${row.name}: Only ${row.displayed} left!`), element('p', `10:00 inventory: received ${row.received} · sold ${row.sold} · reserved ${row.reserved}`));
      let handled = false;
      const choose = flag => {
        if (handled) return; handled = true;
        if (flag !== (row.displayed < row.received - row.sold - row.reserved)) { end(false); return; }
        card.classList.toggle('completed', true); card.append(element('small', flag ? 'False scarcity flagged' : 'Count verified'));
        if (--remaining === 0) end(true);
      };
      button(game, card, 'Flag false scarcity', () => choose(true), '', `flag-${index}`);
      button(game, card, 'Keep accurate count', () => choose(false), '', `keep-${index}`);
      game.content.append(card);
    });
    return game;
  },
};
