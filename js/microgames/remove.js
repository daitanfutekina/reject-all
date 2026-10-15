import { pick, integer } from '../random.js';
import { session, heading, button, element, drag } from './shared.js';

export function create(rng) {
  return { product: pick(rng, ['Desk lamp', 'Blue notebook', 'Travel mug', 'Tea tin', 'Canvas pouch', 'Pencil tray']), extra: pick(rng, ['Parcel insurance', 'Extended warranty', 'Checkout donation', 'Priority packing', 'Care subscription', 'Gift wrapping']), price: integer(rng, 18, 35), fee: integer(rng, 3, 9), extraFirst: rng() < 0.5 };
}
export default {
  id: 'remove', command: 'REMOVE!', patternId: 'remove', baseDuration: 4000, minDuration: 3000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng);
    const draggable = rng() < (difficulty < 3 ? 0.4 : 0.65);
    const game = session(root, rng, 'Trestle Parcel', difficulty);
    heading(game.content, 'Your basket', `You only ordered: ${config.product}.`);
    const bin = element('div', 'Drop unwanted extra here', 'cart-bin'); bin.dataset.action = 'bin';
    if (draggable) game.content.append(element('p', 'Drag the unwanted item into the bin.', 'smallprint'));
    const items = [{ label: config.product, price: config.price, extra: false }, { label: config.extra, price: config.fee, extra: true }];
    if (config.extraFirst) items.reverse();
    for (const item of items) {
      const row = element('div', '', 'cart-row');
      row.append(element('span', `${item.label} — $${item.price}`));
      if (draggable) {
        row.className += ' draggable-item'; row.dataset.action = item.extra ? 'drag-extra' : 'drag-product';
        row.append(element('span', '↕ Drag', 'smallprint'));
        drag(game, row, (dx, dy) => { row.style.transform = `translate(${dx}px, ${dy}px)`; }, (dx, dy, event, cancelled) => {
          row.style.transform = '';
          const rect = bin.getBoundingClientRect();
          if (!cancelled && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) finish(item.extra);
        });
      } else button(game, row, 'Remove', () => finish(item.extra), 'small-button', item.extra ? 'remove-extra' : 'remove-product');
      game.content.append(row);
    }
    if (draggable) game.content.append(bin);
    button(game, game.content, `Pay $${config.price + config.fee}`, () => finish(false), 'site-primary', 'pay');
    return game;
  },
};
