import { integer, shuffle } from '../random.js';
import { session, heading, checkbox, button, element } from './shared.js';

const options = [
  { label: 'Make my profile public', privateValue: false },
  { label: 'Hide my activity', privateValue: true },
  { label: 'Share my location', privateValue: false },
  { label: 'Keep my posts private', privateValue: true },
  { label: 'Let partners track me', privateValue: false },
  { label: 'Block ad personalisation', privateValue: true },
];
export function create(rng, difficulty) {
  const rows = shuffle(rng, options).slice(0, integer(rng, 4, Math.min(6, difficulty + 3))).map(option => ({ ...option, initial: rng() < 0.5 }));
  // Guarantee an actual choice remains, even for a lucky set of defaults.
  rows[0].initial = !rows[0].privateValue;
  return rows;
}
export const isCorrect = (rows, values) => rows.every((row, index) => values[index] === row.privateValue);
export default {
  id: 'private', command: 'PRIVATE!', patternId: 'private', baseDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const rows = create(rng, difficulty);
    const game = session(root, rng, 'Quiet Trellis');
    heading(game.content, 'A little less public, please.', 'Set every choice for maximum privacy.');
    const options = element('div', '', 'option-grid'); game.content.append(options);
    const fields = rows.map((row, index) => checkbox(game, options, row.label, row.initial, `privacy-${index}`));
    button(game, game.content, 'Save privacy', () => finish(isCorrect(rows, fields.map(field => field.checked))), 'site-primary', 'save');
    return game;
  },
};
