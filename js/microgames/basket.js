import { tierFor } from '../engine.js';
import { shuffle, integer, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { verdict } from './evidence.js';

export function create(rng, difficulty) {
  const tier = tierFor(difficulty), substituteFirst = rng() < 0.5;
  return shuffle(rng, ['Mug', 'Notebook', 'Lamp', 'Towel'].slice(0, tier + 1).map((name, index) => {
    const quantity = integer(rng, 1, 3), sku = `${pick(rng, ['BLUE', 'GREEN'])}-${index + 1}`;
    const changed = index < tier, substitute = (index % 2 === 0) === substituteFirst;
    return { name, sku, quantity, checkoutSku: changed && substitute ? `PREMIUM-${index + 1}` : sku, checkoutQuantity: changed && !substitute ? quantity + 1 : quantity };
  }));
}
export default {
  id: 'basket', command: 'CHECK BASKET!', patternId: 'basket', baseDuration: 18000, minDuration: 15000,
  setup(root, rng, difficulty, finish) {
    const rows = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Basket Birch', difficulty);
    heading(game.content, 'Did checkout change your order?', 'Compare the selection receipt with checkout. Restore ONLY changed product codes or quantities, then verify. There are no extra line items.');
    let remaining = rows.filter(row => row.sku !== row.checkoutSku || row.quantity !== row.checkoutQuantity).length;
    rows.forEach((row, index) => {
      const card = element('section', '', 'evidence-card');
      card.append(element('h3', row.name), element('p', `Selection receipt: ${row.sku} · quantity ${row.quantity}`));
      const checkout = element('p', `Checkout: ${row.checkoutSku} · quantity ${row.checkoutQuantity}`); card.append(checkout);
      let restored = false;
      button(game, card, 'Restore selection', () => {
        if (restored) return;
        if (row.sku === row.checkoutSku && row.quantity === row.checkoutQuantity) { end(false); return; }
        restored = true; remaining--; checkout.textContent = `Checkout restored: ${row.sku} · quantity ${row.quantity}`;
        card.classList.toggle('completed', true);
      }, '', `restore-${index}`);
      game.content.append(card);
    });
    button(game, game.content, 'Verify basket', () => end(remaining === 0), 'site-primary', 'verify');
    return game;
  },
};
