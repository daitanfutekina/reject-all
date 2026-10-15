import { integer, shuffle } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element } from './shared.js';

export const yearlyCost = plan => plan.cents * plan.periods + plan.fee;
export function create(rng, difficulty) {
  const tier = tierFor(difficulty);
  const plans = [
    { name: 'Flex', cents: 199, period: 'week', periods: 52, fee: 0 },
    { name: 'Monthly', cents: integer(rng, 5, 7) * 100, period: 'month', periods: 12, fee: 0 },
    { name: 'Annual', cents: integer(rng, 54, 59) * 100, period: 'year', periods: 1, fee: 0 },
    { name: 'Quarterly', cents: 1200, period: 'quarter', periods: 4, fee: integer(rng, 20, 30) * 100 + 50 },
  ];
  if (tier === 3) plans[2].fee = 4000;
  return shuffle(rng, plans.slice(0, tier + 1));
}
export default {
  id: 'price', command: 'PRICE?', patternId: 'price', baseDuration: 8000, minDuration: 8000,
  setup(root, rng, difficulty, finish) {
    const plans = create(rng, difficulty);
    const best = Math.min(...plans.map(yearlyCost));
    const game = session(root, rng, 'Budget Birch', difficulty);
    heading(game.content, 'From just $1.99/week', 'Pick the lowest cost for your first full year.');
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
