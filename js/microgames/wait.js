import { integer, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng) { return { stock: integer(rng, 1, 3), item: pick(rng, ['Premium air', 'Executive paperclip', 'Luxury cable tie']), price: integer(rng, 29, 89) }; }
export default {
  id: 'wait', command: 'WAIT!', patternId: 'wait', baseDuration: 4000, timeoutWin: true,
  setup(root, rng, difficulty, finish) {
    const config = create(rng);
    const game = session(root, rng, 'Hurry Thimble');
    heading(game.content, `ONLY ${config.stock} LEFT!`, `${config.item}. A life-changing $${config.price}. Probably.`);
    const count = element('div', '00:04', 'urgency-clock');
    game.content.append(count, element('p', 'Offer ends any second. Again.'));
    button(game, game.content, 'BUY NOW', () => finish(false), 'site-primary jumbo', 'buy');
    // Even a tap outside the tempting button means the player did not wait.
    game.on(root, 'pointerdown', () => finish(false));
    return { ...game, update(remaining) { count.textContent = `00:${String(Math.ceil(remaining / 1000)).padStart(2, '0')}`; } };
  },
};
