import { pick } from '../random.js';
import { session, heading, button } from './shared.js';

export function create(rng) {
  return { insult: pick(rng, ['No thanks, I hate saving money', 'No, I enjoy paying too much', 'I would rather miss out']), offer: pick(rng, [10, 15, 20, 25]), reverse: rng() < 0.5 };
}
export default {
  id: 'decline', command: 'DECLINE!', patternId: 'decline', baseDuration: 3500,
  setup(root, rng, difficulty, finish) {
    const config = create(rng);
    const game = session(root, rng, 'Ribbon Quarry');
    heading(game.content, `${config.offer}% off. Your dignity included.`, 'Join our email list. We have so much to say.');
    const actions = [
      () => button(game, game.content, 'Yes! Send me everything', () => finish(false), 'site-primary jumbo', 'accept'),
      () => button(game, game.content, config.insult, () => finish(true), 'fine-link', 'decline'),
    ];
    if (config.reverse) actions.reverse();
    actions.forEach(action => action()); return game;
  },
};
