import { integer, pick, shuffle } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element } from './shared.js';

export function create(rng, difficulty) {
  const tier = tierFor(difficulty), day = integer(rng, 10, 20);
  const month = pick(rng, ['April', 'June', 'September', 'November']);
  // Disjoint offsets keep every displayed date distinct while varying the
  // renewal's chronological rank. The labelled billing event is authoritative.
  const dates = [{ label: 'Full-price auto-renewal', date: `${month} ${day}`, renewal: true },
    { label: 'Signup opens', date: `${month} ${day - integer(rng, 7, 9)}` },
    { label: 'Reminder email', date: `${month} ${day + pick(rng, [-4, -2, 1, 3])}` },
    { label: 'Bonus expires', date: `${month} ${day + pick(rng, [-5, -1, 2, 5])}` },
    { label: 'Receipt archive', date: `${month} ${day + pick(rng, [-6, -3, 4, 7])}` }];
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
