import { integer, pick, shuffle } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element } from './shared.js';

export function create(rng, difficulty) {
  const tier = tierFor(difficulty), day = integer(rng, 10, 20);
  const dates = [{ label: 'Full-price auto-renewal', date: `April ${day}`, renewal: true },
    { label: 'Signup opens', date: `April ${day - 7}` }, { label: 'Reminder email', date: `April ${day - 2}` },
    { label: 'Bonus expires', date: `April ${day + 2}` }, { label: 'Receipt archive', date: `April ${day + 5}` }];
  return { tier, price: pick(rng, [19, 29, 39]), dates: shuffle(rng, dates.slice(0, tier + 2)) };
}
export default {
  id: 'trial', command: 'TRIAL?', patternId: 'trial', baseDuration: 6500, minDuration: 6000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Sample Harbor', difficulty);
    heading(game.content, 'Start your free trial', 'Tap the date you will auto-renew at full price.');
    const terms = element('div', '', 'trial-terms');
    const renderTerms = () => {
      terms.replaceChildren(element('p', `Subscription terms: $${config.price}/month after the trial.`, 'smallprint'));
      for (const [index, item] of config.dates.entries()) {
        const row = element('div', '', 'date-row');
        row.append(element('span', item.label, 'smallprint'));
        button(game, row, item.date, () => finish(Boolean(item.renewal)), config.tier > 1 ? 'fine-link' : '', `date-${index}`);
        terms.append(row);
      }
    };
    game.content.append(terms);
    if (config.tier === 3) button(game, terms, 'Billing details and renewal terms', renderTerms, 'fine-link', 'terms');
    else renderTerms();
    button(game, game.content, 'Start free trial', () => finish(false), 'site-primary', 'signup');
    return game;
  },
};
