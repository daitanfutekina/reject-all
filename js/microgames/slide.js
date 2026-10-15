import { tierFor } from '../engine.js';
import { integer, shuffle, pick } from '../random.js';
import { session, heading, element, drag } from './shared.js';

export default {
  id: 'slide', command: 'SLIDE!', patternId: 'slide', baseDuration: 6500, minDuration: 5500,
  setup(root, rng, difficulty, finish) {
    const game = session(root, rng, 'Partner Pantry', difficulty);
    heading(game.content, pick(rng, ['Consent dashboard', 'Your partner choices', 'Personalisation controls']), 'Drag every partner slider fully left to zero.');
    const names = shuffle(rng, ['Amber Analytics', 'Paper Metrics', 'Cobalt Offers', 'Moss Signals', 'Brass Research', 'Cloud Coupons']);
    const values = Array.from({ length: 2 + tierFor(difficulty) }, () => integer(rng, 65, 100));
    values.forEach((value, index) => {
      const row = element('div', '', 'slider-row');
      const label = element('p', '', 'slider-label');
      const track = element('div', '', `consent-slider ${rng() < 0.5 ? 'muted-slider' : ''}`);
      track.dataset.action = `slider-${index}`; track.setAttribute('role', 'slider');
      track.setAttribute('aria-label', names[index]); track.setAttribute('aria-valuemin', '0'); track.setAttribute('aria-valuemax', '100');
      const thumb = element('span', '', 'slider-thumb'); track.append(thumb);
      const paint = () => {
        label.textContent = `${names[index]}: ${values[index]}%`;
        thumb.style.left = `${values[index]}%`; track.setAttribute('aria-valuenow', String(values[index]));
      };
      const set = event => {
        const rect = track.getBoundingClientRect();
        values[index] = Math.max(0, Math.min(100, Math.round((event.clientX - rect.left) / rect.width * 100)));
        paint();
      };
      drag(game, track, (dx, dy, event) => set(event), (dx, dy, event, cancelled) => {
        if (cancelled) return;
        set(event); if (values.every(amount => amount === 0)) finish(true);
      });
      paint(); row.append(label, track); game.content.append(row);
    });
    return game;
  },
};
