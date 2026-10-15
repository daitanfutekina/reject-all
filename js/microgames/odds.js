import { integer, pick } from '../random.js';
import { session, heading, button, element, drag } from './shared.js';

export default {
  id: 'odds', command: 'ODDS?', patternId: 'odds', baseDuration: 6000, minDuration: 4000,
  setup(root, rng, difficulty, finish) {
    const game = session(root, rng, 'Prism Crate', difficulty);
    heading(game.content, pick(rng, ['Aurora crate', 'Quartz cache', 'Opal box', 'Velvet vault']), 'Find and open the drop rates before buying.');
    const count = integer(rng, 3, Math.min(5, difficulty + 2));
    const oddsPage = integer(rng, 1, count - 1);
    const rare = pick(rng, [1, 2, 3, 5]);
    const carousel = element('div', '', 'odds-carousel'); carousel.dataset.action = 'carousel';
    const card = element('div', '', 'crate-card'); const position = element('p', '', 'smallprint');
    carousel.append(card, position); game.content.append(carousel);
    let page = 0;
    function render() {
      card.replaceChildren(); position.textContent = `${page + 1} / ${count} · Swipe left or right`;
      card.append(element('div', '◇', 'crate-icon'));
      if (page === oddsPage) button(game, card, 'ⓘ Drop-rate details', () => {
        card.replaceChildren(element('h3', 'Drop rates'), element('p', `Common ${100 - rare - 15}% · Uncommon 15% · Rare ${rare}%`));
        finish(true);
      }, 'fine-link', 'odds');
      else card.append(element('h3', ['A surprise in every box', 'Collect the collection', 'Exclusive colourways', 'One more could be rare', 'A little mystery'][page]));
    }
    drag(game, carousel, dx => { card.style.transform = `translateX(${Math.max(-30, Math.min(30, dx))}px)`; }, (dx, dy, event, cancelled) => {
      card.style.transform = '';
      if (!cancelled && Math.abs(dx) >= 45) { page = (page + (dx < 0 ? 1 : count - 1)) % count; render(); }
    });
    button(game, game.content, 'Buy a crate · 100 credits', () => finish(false), 'site-primary', 'buy');
    render(); return game;
  },
};
