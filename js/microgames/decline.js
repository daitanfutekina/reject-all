import { tierFor } from '../engine.js';
import { pick } from '../random.js';
import { session, heading, button } from './shared.js';

export function create(rng) {
  return { insult: pick(rng, ['No thanks, I hate saving money', 'No, I enjoy paying too much', 'I would rather miss out', 'No, bargains are not for me', 'I prefer a boring inbox', 'No, keep the good stuff']), offer: pick(rng, [10, 15, 20, 25, 30, 35]), reverse: rng() < 0.5 };
}
export default {
  id: 'decline', command: 'DECLINE!', patternId: 'decline', baseDuration: 3500, minDuration: 3500,
  setup(root, rng, difficulty, finish, options = {}) {
    const config = create(rng);
    let dodges = tierFor(difficulty) === 3 ? (options.reduced ? 1 : 2) : 0;
    const game = session(root, rng, 'Ribbon Quarry', difficulty);
    const answerWall = game.identity === 'qa';
    heading(game.content, answerWall ? 'Keep reading. Keep learning.' : `${config.offer}% off. Your dignity included.`, answerWall ? 'Create a free account for more answers and email recommendations.' : 'Join our email list. We have so much to say.');
    const actions = [
      () => button(game, game.content, answerWall ? 'Create my account' : 'Yes! Send me everything', () => finish(false), 'site-primary jumbo', 'accept'),
      () => {
        const decline = button(game, game.content, answerWall ? 'No thanks, I prefer guessing' : config.insult, () => finish(true), 'fine-link evasive-link', 'decline');
        game.on(decline, 'pointerenter', event => {
          if (event.pointerType !== 'mouse' || dodges === 0) return;
          dodges--;
          decline.style.transform = `translateY(${dodges % 2 ? 28 : 0}px)`;
          if (options.reduced) decline.style.transform = 'translateY(8px)';
        });
      },
    ];
    if (config.reverse) actions.reverse();
    actions.forEach(action => action());
    for (let i = 0; i < tierFor(difficulty) - 1; i++) button(game, game.content, ['Only weekly deals', 'Send deals to my phone'][i], () => finish(false), 'small-button', `decoy-${i}`);
    return game;
  },
};
