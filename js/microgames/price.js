import { integer, shuffle, pick } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element } from './shared.js';

export const yearlyCost = plan => plan.cents * plan.periods + plan.fee;
export function create(rng, difficulty) {
  const tier = tierFor(difficulty);
  const plans = [
    { name: 'Flex', cents: pick(rng, [99, 149, 199]), period: 'week', periods: 52, fee: 0 },
    { name: 'Monthly', cents: integer(rng, 5, 10) * 100, period: 'month', periods: 12, fee: 0 },
    { name: 'Annual', cents: integer(rng, 48, 109) * 100 + 50, period: 'year', periods: 1, fee: 0 },
    { name: 'Quarterly', cents: integer(rng, 12, 25) * 100, period: 'quarter', periods: 4, fee: integer(rng, 0, 24) * 100 + 25 },
  ];
  // Distinct cent endings make ties impossible without rerolling a seeded puzzle.
  if (tier === 3) {
    plans[1].fee = integer(rng, 0, 12) * 100;
    plans[2].fee = pick(rng, [0, 1200, 2400, 4000]);
  }
  return shuffle(rng, plans.slice(0, tier + 1));
}
export default {
  id: 'price', command: 'PRICE?', patternId: 'price', baseDuration: 8000, minDuration: 8000,
  setup(root, rng, difficulty, finish) {
    const plans = create(rng, difficulty);
    const best = Math.min(...plans.map(yearlyCost));
    const game = session(root, rng, 'Budget Birch', difficulty);
    heading(game.content, game.identity === 'travel' ? 'Compare Traveller membership plans' : 'Small payments. Bigger picture.', 'Pick the lowest cost for your first full year.');
    game.content.append(element('p', 'Compare 52 weeks = 12 months = 4 quarters = 1 year. Include one-time setup fees.', 'smallprint'));
    const grid = element('div', '', 'plan-grid'); game.content.append(grid);
    plans.forEach((plan, index) => {
      const card = element('section', '', 'plan-card');
      card.append(element('h3', plan.name), element('p', `$${(plan.cents / 100).toFixed(2)}/${plan.period}`, 'plan-rate'));
      if (tierFor(difficulty) === 3) card.append(element('p', `One-time setup: $${(plan.fee / 100).toFixed(2)}`, 'smallprint'));
      button(game, card, 'Choose plan', () => finish(yearlyCost(plan) === best), '', `plan-${index}`);
      grid.append(card);
    });
    return game;
  },
};
