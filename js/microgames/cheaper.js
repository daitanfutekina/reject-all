import { integer, shuffle, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng) {
  const base = integer(rng, 9, 24);
  const gap = integer(rng, 3, 6);
  const fee = integer(rng, 1, 3);
  return shuffle(rng, [
    { name: 'Parcel A', headline: base, fee: gap + fee + integer(rng, 2, 5) },
    { name: 'Parcel B', headline: base + gap, fee },
  ]);
}
export const cheaperIndex = offers => offers[0].headline + offers[0].fee < offers[1].headline + offers[1].fee ? 0 : 1;
export default {
  id: 'cheaper', command: 'CHEAPER?', patternId: 'cheaper', baseDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const offers = create(rng);
    const game = session(root, rng, 'Copper Ticket', difficulty);
    heading(game.content, pick(rng, ['Same thing. Two checkouts.', 'Two ways to pay.', 'Find your best fare.', 'Choose a delivery.', 'The price is almost right.', 'One item. Two offers.']), 'Pick the lower final price, including fees.');
    const columns = element('div', '', 'price-columns');
    offers.forEach((offer, index) => {
      const card = element('section', '', 'price-card');
      const fee = element('p', `Plus $${offer.fee} ${pick(rng, ['handling', 'service', 'booking', 'processing', 'platform', 'delivery'])} fee`, 'smallprint');
      card.append(element('h3', offer.name));
      if (difficulty >= 3 && rng() < 0.5) card.append(fee, element('p', `$${offer.headline}`, 'price'));
      else card.append(element('p', `$${offer.headline}`, 'price'), fee);
      button(game, card, 'Choose', () => finish(index === cheaperIndex(offers)), 'site-primary', `choose-${index}`);
      columns.append(card);
    });
    game.content.append(columns); return game;
  },
};
