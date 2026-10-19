import { tierFor } from '../engine.js';
import { shuffle, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { verdict } from './evidence.js';

export function create(rng, difficulty) {
  const gates = shuffle(rng, [
    ['How would you like to pay?', 'Guest checkout is under More checkout options.', 'More checkout options', 'Create account to pay'],
    ['Keep your receipt?', 'A downloadable receipt does not require an account.', 'Download receipt without account', 'Register to save receipt'],
    ['Join the rewards club?', 'Membership is optional for this purchase.', 'Decline membership', 'Join and create account'],
  ]).slice(0, tierFor(difficulty));
  return { product: pick(rng, ['Tea tin', 'Pencil case', 'Canvas bag']), screens: [...gates, ['Ready to order', 'Complete this purchase as a guest. No registration needed.', 'Place order as guest', 'Register and place order']].map(screen => ({ screen, reverse: rng() < 0.5 })) };
}
export default {
  id: 'guest', command: 'GUEST!', patternId: 'guest', baseDuration: 16000, minDuration: 12000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Guest Grove', difficulty);
    let step = 0;
    function render() {
      game.content.replaceChildren();
      const { screen, reverse } = config.screens[step];
      game.content.append(element('p', `Your task: buy one ${config.product} without creating an account. Step ${step + 1}/${config.screens.length}.`, 'smallprint'));
      heading(game.content, screen[0], screen[1]);
      let handled = false;
      const choices = [
        () => button(game, game.content, screen[2], () => {
          if (handled) return; handled = true;
          if (++step === config.screens.length) {
            game.content.replaceChildren(); heading(game.content, 'Guest order complete', 'Your receipt is ready. No account created.'); end(true);
          } else render();
        }, '', 'guest-path'),
        () => button(game, game.content, screen[3], () => { if (!handled) { handled = true; end(false); } }, 'site-primary', 'register'),
      ];
      if (reverse) choices.reverse(); choices.forEach(choice => choice());
    }
    render(); return game;
  },
};
