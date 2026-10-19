import { pick, integer } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element, drag } from './shared.js';

export function create(rng) {
  return { product: pick(rng, ['Desk lamp', 'Blue notebook', 'Travel mug', 'Tea tin', 'Canvas pouch', 'Pencil tray', 'Running shoes', 'Mini speaker', 'Desk succulent', 'Game controller', 'Cotton throw', 'USB-C charger']), extra: pick(rng, ['Parcel insurance', 'Extended warranty', 'Checkout donation', 'Priority packing', 'Care subscription', 'Gift wrapping']), price: integer(rng, 18, 35), fee: integer(rng, 3, 9), extraFirst: rng() < 0.5 };
}
export default {
  id: 'remove', command: 'REMOVE!', patternId: 'remove', baseDuration: 5000, minDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng);
    const draggable = rng() < (difficulty < 3 ? 0.4 : 0.65);
    const game = session(root, rng, 'Trestle Parcel', difficulty);
    if (game.identity === 'harvest') {
      config.product = 'Lemon & herb salmon meal kit';
      config.extra = ['Dessert subscription', 'Premium packaging', 'Weekly recipe booklet'][Math.min(2, tierFor(difficulty) - 1)];
    } else if (game.identity === 'travel') {
      config.product = 'Sea-view room reservation'; config.price = 159; config.extra = 'Breakfast add-on';
    } else if (game.identity === 'tickets') {
      config.product = 'Standard admission ticket'; config.price = 129; config.extra = 'Ticket protection';
    }
    heading(game.content, 'Your basket', `You only ordered: ${config.product}.`);
    const bin = element('div', 'Drop unwanted extra here', 'cart-bin'); bin.dataset.action = 'bin';
    if (draggable) game.content.append(element('p', 'Drag the unwanted item into the bin.', 'smallprint'));
    const items = [{ label: config.product, price: config.price, extra: false }, { label: config.extra, price: config.fee, extra: true }];
    const extras = game.identity === 'tickets' ? ['VIP upgrade', 'Parking pass'] : game.identity === 'travel' ? ['Airport transfer', 'Late checkout'] : game.identity === 'harvest' ? ['Extra protein pack', 'Recipe subscription'] : ['Gift note subscription', 'Express handling'];
    for (let i = 1; i < tierFor(difficulty); i++) items.push({ label: extras[i - 1], price: i + 2, extra: true });
    const total = items.reduce((sum, item) => sum + item.price, 0);
    let remaining = tierFor(difficulty);
    if (config.extraFirst) items.reverse();
    for (const item of items) {
      const row = element('div', '', 'cart-row');
      if (!item.extra && item.label !== 'Pencil tray') {
        const photo = element('img', '', 'cart-product-photo'); photo.alt = item.label;
        const index = { 'Desk lamp': 2, 'Blue notebook': 4, 'Travel mug': 1, 'Tea tin': 5, 'Canvas pouch': 3, 'Running shoes': 6, 'Mini speaker': 7, 'Desk succulent': 8, 'Game controller': 9, 'Cotton throw': 10, 'USB-C charger': 11 }[item.label];
        photo.src = new URL(game.identity === 'harvest' ? '../../assets/meal.webp' : game.identity === 'travel' ? '../../assets/travel.webp' : game.identity === 'tickets' ? '../../assets/tickets.webp' : `../../assets/products/${index}.webp`, import.meta.url).href;
        row.append(photo);
      }
      row.append(element('span', `${item.label} — $${item.price}`));
      let removed = false;
      const discard = () => {
        if (removed) return;
        if (!item.extra) { finish(false); return; }
        removed = true; row.hidden = true;
        if (--remaining === 0) finish(true);
      };
      if (draggable) {
        row.className += ' draggable-item'; row.dataset.action = item.extra ? 'drag-extra' : 'drag-product';
        row.append(element('span', '↕ Drag', 'smallprint'));
        drag(game, row, (dx, dy) => { row.style.transform = `translate(${dx}px, ${dy}px)`; }, (dx, dy, event, cancelled) => {
          row.style.transform = '';
          const rect = bin.getBoundingClientRect();
          if (!cancelled && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) discard();
        });
      } else button(game, row, 'Remove', discard, 'small-button', item.extra ? 'remove-extra' : 'remove-product');
      game.content.append(row);
    }
    if (draggable) game.content.append(bin);
    button(game, game.content, `Pay $${total}`, () => finish(false), 'site-primary', 'pay');
    return game;
  },
};
