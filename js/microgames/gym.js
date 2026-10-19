import { tierFor } from '../engine.js';
import { pick, integer, shuffle } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng, difficulty) {
  const entry = pick(rng, [
    ['Your membership', 'Cancellation is under membership controls.', 'Manage membership', 'Book a class'],
    ['Account overview', 'Billing contains your cancellation options.', 'Billing and cancellation', 'Training schedule'],
    ['Club dashboard', 'Open your contract to end recurring payments.', 'Contract options', 'Member rewards'],
  ]);
  const gates = shuffle(rng, [
    ['Keep your perks?', 'A free towel if you stay. Cancellation remains available.', 'Decline offer and cancel', 'Claim offer and stay'],
    ['Take a break?', 'Pausing resumes payments later. You want to end payments.', 'Cancel instead', 'Pause membership'],
    ['Choose an end date', 'End at the paid-through date with no further renewal.', 'End renewal', 'Renew for another month'],
  ]).slice(0, tierFor(difficulty) === 3 ? 1 : 0);
  const confirm = pick(rng, [
    ['Review cancellation', 'End recurring billing; keep access until your paid-through date.', 'Confirm cancellation', 'Keep membership'],
    ['Final membership choice', 'No further charges after cancellation.', 'Finish cancelling', 'Restart membership'],
  ]);
  const screens = tierFor(difficulty) === 1 ? [confirm] : [entry, ...gates, confirm];
  return { price: integer(rng, 25, 65), screens: screens.map(screen => ({ screen, order: shuffle(rng, ['cancel-path', 'retain', 'back']), layout: pick(rng, ['stack', 'split', 'inset']) })) };
}
export default {
  id: 'gym', command: 'CANCEL!', patternId: 'gym', baseDuration: 6000, minDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Rep Quarry Club', difficulty);
    const copy = text => {
      const replacements = game.identity === 'studio'
        ? { 'Book a class': 'Explore creative apps', 'Training schedule': 'Browse tutorials', 'Club dashboard': 'Creative Suite dashboard', 'A free towel if you stay. Cancellation remains available.': 'A free month of Creative Suite if you stay. Cancellation remains available.', 'Your membership': 'Your Creative Suite plan', 'Member rewards': 'Creative resources', 'Final membership choice': 'Final plan choice', 'Keep your perks?': 'Keep your creative tools?' }
        : game.identity === 'harvest'
          ? { 'Book a class': 'Choose next week’s meals', 'Training schedule': 'Browse recipes', 'Club dashboard': 'Your meal plan', 'A free towel if you stay. Cancellation remains available.': 'A free dessert box if you stay. Cancellation remains available.', 'Your membership': 'Your meal subscription', 'Member rewards': 'Recipe rewards' }
          : game.identity === 'stream'
            ? { 'Book a class': 'Browse films', 'Training schedule': 'Open your watchlist', 'Club dashboard': 'Your streaming account', 'A free towel if you stay. Cancellation remains available.': 'A free month of streaming if you stay. Cancellation remains available.', 'Your membership': 'Your streaming plan', 'Member rewards': 'New releases' }
            : game.identity === 'fitness' ? {}
              : { 'Book a class': 'Explore member deals', 'Training schedule': 'Member benefits', 'Club dashboard': 'Your membership', 'A free towel if you stay. Cancellation remains available.': 'A free month of delivery if you stay. Cancellation remains available.' };
      return replacements[text] || text;
    };
    let step = 0, done = false;
    function render() {
      game.content.replaceChildren();
      const { screen, order, layout } = config.screens[step];
      game.content.append(element('span', `Membership: active · $${config.price}/month · Step ${step + 1}/${config.screens.length}`, 'membership'));
      heading(game.content, copy(screen[0]), copy(screen[1]));
      const choices = element('div', '', `route-choices route-${layout}`); game.content.append(choices);
      const renderedStep = step;
      order.forEach(id => {
        if (id === 'back' && step === 0) return;
        const label = copy(id === 'cancel-path' ? screen[2] : id === 'retain' ? screen[3] : 'Back to membership');
        button(game, choices, label, () => {
          if (done || step !== renderedStep) return;
          if (id === 'retain') { done = true; finish(false); return; }
          step = id === 'back' ? 0 : step + 1;
          if (step === config.screens.length) {
            done = true; game.content.replaceChildren();
            heading(game.content, 'Membership cancelled', 'No more recurring payments.'); finish(true);
          } else render();
        }, id === 'retain' ? 'site-primary' : '', id);
      });
    }
    render(); return game;
  },
};
