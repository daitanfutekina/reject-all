import { tierFor } from '../engine.js';
import { integer, pick } from '../random.js';
import { session, heading, button, element, drag } from './shared.js';

export default {
  id: 'odds', command: 'ODDS?', patternId: 'odds', baseDuration: 6000, minDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const game = session(root, rng, 'Prism Crate', difficulty);
    heading(game.content, pick(rng, ['Aurora crate', 'Quartz cache', 'Opal box', 'Velvet vault']), 'Find and open the drop rates before buying.');
    const count = 2 + tierFor(difficulty);
    const oddsPage = integer(rng, 1, count - 1);
    const rare = pick(rng, [1, 2, 3, 5]);
    const carousel = element('div', '', 'odds-carousel'); carousel.dataset.action = 'carousel';
    const card = element('div', '', 'crate-card'); const position = element('p', '', 'smallprint');
    carousel.append(card, position); game.content.append(carousel);
    let page = 0, opened = false;
    function render() {
      card.replaceChildren(); position.textContent = `${page + 1} / ${count} · Swipe left or right`;
      const artwork = element('img', '', 'crate-icon');
      artwork.src = new URL(game.identity === 'arcade' ? '../../assets/arcade-item-cutout.webp' : '../../assets/astral-item-cutout.webp', import.meta.url).href;
      artwork.alt = game.identity === 'arcade' ? 'Complete collectible star capsules' : 'Complete celestial star astrolabe';
      card.append(artwork);
      if (page === oddsPage) {
        const reveal = () => {
          if (opened) return;
          opened = true;
          card.replaceChildren(element('h3', 'Drop rates'), element('p', `Common ${100 - rare - 15}% · Uncommon 15% · Rare ${rare}%`));
          finish(true);
        };
        const details = button(game, card, 'ⓘ Drop-rate details', reveal, 'fine-link', 'odds');
        // A native compatibility click can be swallowed after a touch swipe.
        // Accept a deliberate touch release as well; never activate a drag or cancellation.
        let touch = null;
        game.on(details, 'pointerdown', event => {
          if (event.pointerType === 'touch' && touch === null) touch = { id: event.pointerId, x: event.clientX, y: event.clientY };
        });
        game.on(details, 'pointermove', event => {
          if (touch?.id === event.pointerId && Math.hypot(event.clientX - touch.x, event.clientY - touch.y) > 10) touch = null;
        });
        game.on(details, 'pointerup', event => {
          if (!touch || touch.id !== event.pointerId) return;
          const origin = touch; touch = null;
          const rect = details.getBoundingClientRect();
          if (Math.hypot(event.clientX - origin.x, event.clientY - origin.y) <= 10 && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) reveal();
        });
        game.on(details, 'pointercancel', event => { if (touch?.id === event.pointerId) touch = null; });
        game.on(details, 'lostpointercapture', event => { if (touch?.id === event.pointerId) touch = null; });
        game.onCancel(() => { touch = null; });
      }
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
