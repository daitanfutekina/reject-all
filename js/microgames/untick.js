import { integer, shuffle } from '../random.js';
import { session, heading, checkbox, button, element } from './shared.js';

export function create(rng, difficulty) {
  const labels = shuffle(rng, ['Partner offers', 'Product emails', 'Share usage data', 'Personalised ads', 'SMS promotions', 'Weekly newsletter', 'Share purchase history', 'Research invitations']);
  return { labels: labels.slice(0, integer(rng, 4, Math.min(8, 4 + difficulty))), terms: rng() < 0.65 };
}
export const isCorrect = (optional, required = true) => optional.every(value => !value) && required;
export default {
  id: 'untick', command: 'UNTICK!', patternId: 'untick', baseDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Post Pebble');
    heading(game.content, 'A few little extras', 'Untick marketing and sharing. Keep required Terms.');
    const options = element('div', '', 'option-grid'); game.content.append(options);
    const fields = config.labels.map((label, index) => checkbox(game, options, label, true, `optional-${index}`));
    const terms = config.terms ? checkbox(game, game.content, 'I agree to Terms (required)', true, 'terms') : null;
    button(game, game.content, 'Save choices', () => finish(isCorrect(fields.map(field => field.checked), terms?.checked ?? true)), 'site-primary', 'save');
    return game;
  },
};
