import { tierFor } from '../engine.js';
import { pick, integer } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng, difficulty) {
  return { offer: pick(rng, ['A free towel!', 'Half-price Tuesdays!', 'A complimentary locker!']), checks: tierFor(difficulty), reverse: rng() < 0.5, price: integer(rng, 25, 65) };
}
export default {
  id: 'gym', command: 'CANCEL THE GYM', patternId: 'gym', baseDuration: 19000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Rep Quarry Club', difficulty);
    let step = 0;
    function render() {
      game.content.replaceChildren();
      game.content.append(element('span', `Membership: active · $${config.price}/month`, 'membership'));
      const screens = [
        ['Your membership', 'Leaving us? We have hidden that feeling in a submenu.', 'Manage membership', 'Book a class'],
        ['Let’s keep this going.', config.offer, 'Continue to cancellation', 'Claim offer and stay'],
        ['How about a little break?', 'Pause today. Automatically resume payments later.', 'Cancel instead', 'Pause membership'],
      ];
      const screen = screens[step] || ['Are you sure?', step > 3 ? 'We already asked. We thought we would ask again.' : 'Your locker will miss you. Your bank account will recover.', step === 3 + config.checks - 1 ? 'Confirm cancellation' : 'Yes, continue cancelling', 'Keep membership'];
      heading(game.content, screen[0], screen[1]);
      const choices = [
        () => button(game, game.content, screen[3], () => finish(false), 'site-primary jumbo', 'retain'),
        () => button(game, game.content, screen[2], () => {
          step++;
          if (step === 3 + config.checks) {
            game.content.replaceChildren();
            heading(game.content, 'Membership cancelled', 'No more payments. Enjoy your free time.');
            finish(true);
          } else render();
        }, 'fine-link', 'cancel-path'),
      ];
      if (config.reverse) choices.reverse();
      choices.forEach(choice => choice());
      if (step > 0) button(game, game.content, 'Back to membership', () => { step = 0; render(); }, 'fine-link', 'back');
    }
    render(); return game;
  },
};
