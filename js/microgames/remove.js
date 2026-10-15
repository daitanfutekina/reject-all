import { pick, integer } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng) {
  return { product: pick(rng, ['Desk lamp', 'Blue notebook', 'Travel mug']), extra: pick(rng, ['Parcel insurance', 'Extended warranty', 'Checkout donation']), price: integer(rng, 18, 35), fee: integer(rng, 3, 9), extraFirst: rng() < 0.5 };
}
export default {
  id: 'remove', command: 'REMOVE!', patternId: 'remove', baseDuration: 4000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng);
    const game = session(root, rng, 'Trestle Parcel');
    heading(game.content, 'Your basket', `You only ordered: ${config.product}.`);
    const items = [{ label: config.product, price: config.price, extra: false }, { label: config.extra, price: config.fee, extra: true }];
    if (config.extraFirst) items.reverse();
    for (const item of items) {
      const row = element('div', '', 'cart-row');
      row.append(element('span', `${item.label} — $${item.price}`));
      button(game, row, 'Remove', () => finish(item.extra), 'small-button', item.extra ? 'remove-extra' : 'remove-product');
      game.content.append(row);
    }
    button(game, game.content, `Pay $${config.price + config.fee}`, () => finish(false), 'site-primary', 'pay');
    return game;
  },
};
