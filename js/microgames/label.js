import { tierFor } from '../engine.js';
import { shuffle, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { verdict } from './evidence.js';

export function create(rng, difficulty) {
  return shuffle(rng, Array.from({ length: tierFor(difficulty) }, (_, index) => [
    { title: ['A calmer morning', 'The weekend edit', 'Our desk essentials'][index], disclosure: `Paid placement by ${pick(rng, ['Cedar Co', 'Moss Works'])}. Sponsor approved this card.`, sponsored: true },
    { title: ['A walk by the river', 'How we test mugs', 'A guide to mending'][index], disclosure: 'Editorial: independently assigned and edited. No payment, gifts or sponsor approval.', sponsored: false },
  ]).flat());
}
export default {
  id: 'label', command: 'LABEL!', patternId: 'label', baseDuration: 28000, minDuration: 24000,
  setup(root, rng, difficulty, finish) {
    const cards = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Daily Fern', difficulty);
    heading(game.content, 'Separate ads from editorial', 'Headlines are not evidence. Reveal each disclosure, then label paid placement Sponsored and independently funded content Editorial.');
    let remaining = cards.length;
    cards.forEach((card, index) => {
      const row = element('section', '', 'evidence-card'); row.append(element('h3', card.title));
      const disclosure = element('p', card.disclosure, 'evidence-record'); disclosure.hidden = true; row.append(disclosure);
      const choices = element('div', '', 'evidence-columns'); choices.hidden = true;
      button(game, row, 'Reveal disclosure', () => { disclosure.hidden = false; choices.hidden = false; }, '', `reveal-${index}`);
      let handled = false;
      const choose = sponsored => {
        if (disclosure.hidden || handled) return; handled = true;
        if (sponsored !== card.sponsored) { end(false); return; }
        row.classList.toggle('completed', true); choices.hidden = true;
        row.append(element('small', sponsored ? 'Labelled Sponsored' : 'Labelled Editorial'));
        if (--remaining === 0) end(true);
      };
      button(game, choices, 'Sponsored', () => choose(true), '', `sponsored-${index}`);
      button(game, choices, 'Editorial', () => choose(false), '', `editorial-${index}`);
      row.append(choices); game.content.append(row);
    });
    return game;
  },
};
