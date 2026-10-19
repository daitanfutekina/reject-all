import { tierFor } from '../engine.js';
import { shuffle, pick, integer } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { verdict } from './evidence.js';

export function create(rng, difficulty) {
  const account = `reader-${integer(rng, 10, 99)}`, quote = pick(rng, ['Fits my shelf perfectly.', 'The handle feels solid.']);
  const rows = [
    { title: 'Original review', quote, record: `Original record R1 · account ${account}. Published once.`, remove: false },
    { title: 'Another happy buyer', quote, record: `Duplicate copy of R1 · same account ${account}, same exact wording, counted again as a different buyer.`, remove: true },
    { title: 'Independent opinion', quote: 'Five stars!', record: 'Campaign terms: payment requires a five-star rating. Card claims no incentive.', remove: true },
    { title: 'Disclosed sample review', quote: 'Useful, but the lid is stiff.', record: 'Free sample disclosed on card. No rating requirement. Independent account, one original review.', remove: false },
    { title: 'Unpaid customer', quote: 'Excellent in every way.', record: 'Campaign terms: reward requires a positive review. Card claims no incentive.', remove: true },
    { title: 'Verified purchase', quote: 'It arrived yesterday; I am still trying it.', record: 'Distinct account, original wording, no campaign payment recorded.', remove: false },
  ];
  return shuffle(rng, rows.slice(0, tierFor(difficulty) * 2));
}
export default {
  id: 'authentic', command: 'AUTHENTIC!', patternId: 'authentic', baseDuration: 32000, minDuration: 28000,
  setup(root, rng, difficulty, finish) {
    const reviews = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Review Reed', difficulty);
    heading(game.content, 'Audit the review feed', 'Inspect each record. Remove duplicate copies and falsely independent paid praise. Keep originals and honestly disclosed samples with no rating condition.');
    let remaining = reviews.length;
    reviews.forEach((review, index) => {
      const card = element('section', '', 'evidence-card');
      card.append(element('h3', review.title), element('p', `“${review.quote}”`));
      const record = element('p', review.record, 'evidence-record'); record.hidden = true; card.append(record);
      const controls = element('div', '', 'evidence-columns'); controls.hidden = true;
      button(game, card, 'Inspect record', () => { record.hidden = false; controls.hidden = false; }, '', `inspect-${index}`);
      let handled = false;
      const choose = remove => {
        if (record.hidden || handled) return; handled = true;
        if (remove !== review.remove) { end(false); return; }
        card.classList.toggle('completed', true); controls.hidden = true;
        card.append(element('small', remove ? 'Removed from feed' : 'Kept in feed'));
        if (--remaining === 0) end(true);
      };
      button(game, controls, 'Keep', () => choose(false), '', `keep-${index}`);
      button(game, controls, 'Remove', () => choose(true), '', `remove-${index}`);
      card.append(controls); game.content.append(card);
    });
    return game;
  },
};
