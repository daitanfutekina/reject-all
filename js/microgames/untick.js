import { tierFor } from '../engine.js';
import { integer, shuffle, pick } from '../random.js';
import { session, heading, checkbox, button, element } from './shared.js';

export function create(rng, difficulty) {
  const labels = shuffle(rng, ['Partner offers', 'Product emails', 'Share usage data', 'Personalised ads', 'SMS promotions', 'Weekly newsletter', 'Share purchase history', 'Research invitations', 'Birthday deals', 'Share browsing habits', 'App notifications', 'Daily recommendations', 'Sponsor messages', 'Loyalty reminders']);
  return { labels: labels.slice(0, 2 + 2 * tierFor(difficulty)), terms: rng() < 0.65 };
}
export const isCorrect = (optional, required = true) => optional.every(value => !value) && required;
export default {
  id: 'untick', command: 'UNTICK!', patternId: 'untick', baseDuration: 5000, minDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Post Pebble', difficulty);
    heading(game.content, pick(rng, ['A few little extras', 'Make the most of your account', 'Stay in the loop', 'Your welcome package', 'Almost ready', 'A more connected checkout']), 'Untick marketing and sharing. Keep required Terms.');
    const options = element('div', '', 'option-grid'); game.content.append(options);
    const fields = config.labels.map((label, index) => checkbox(game, options, label, true, `optional-${index}`));
    const terms = config.terms ? checkbox(game, game.content, 'I agree to Terms (required)', true, 'terms') : null;
    button(game, game.content, 'Save choices', () => finish(isCorrect(fields.map(field => field.checked), terms?.checked ?? true)), 'site-primary', 'save');
    return game;
  },
};
