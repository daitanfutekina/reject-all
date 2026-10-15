import { tierFor } from '../engine.js';
import { pick, shuffle } from '../random.js';
import { session, heading, checkbox, button, element } from './shared.js';

export const questions = [
  { wording: 'Do not disable promotional offers.', privateValue: false },
  { wording: 'Do not send me promotional offers.', privateValue: true },
  { wording: 'Do not stop sending me offers.', privateValue: false },
  { wording: 'Keep me opted out of offers.', privateValue: true },
  { wording: 'Uncheck to not opt out of receiving offers.', privateValue: true },
  { wording: 'Opt out of not receiving offers.', privateValue: false },
  { wording: 'Do not include me in offer emails.', privateValue: true },
  { wording: 'Keep sending me promotional offers.', privateValue: false },
  { wording: 'Disable promotional messages.', privateValue: true },
  { wording: 'Do not prevent offer emails.', privateValue: false },
  { wording: 'Exclude me from marketing.', privateValue: true },
  { wording: 'Allow promotional messages.', privateValue: false },
];
export function create(rng) { return { ...pick(rng, questions), initial: rng() < 0.5 }; }
export default {
  id: 'trick', command: 'SET IT!', patternId: 'trick', baseDuration: 5000, minDuration: 5500,
  setup(root, rng, difficulty, finish) {
    const pool = tierFor(difficulty) === 1 ? [1, 6, 7, 8, 10, 11].map(index => questions[index]) : questions;
    const configs = shuffle(rng, pool).slice(0, tierFor(difficulty)).map(question => ({ ...question, initial: rng() < 0.5 }));
    const game = session(root, rng, 'Syntax Attic', difficulty);
    heading(game.content, pick(rng, ['Your communication preferences', 'A word about your choices', 'One final preference', 'Messages on your terms', 'Fine-tune your inbox', 'A simple yes or no']), 'Your goal: receive NO offers.');
    const inputs = configs.map((config, index) => checkbox(game, game.content, config.wording, config.initial, `offers-${index}`));
    game.content.append(element('p', 'Checked = statement enabled.', 'smallprint'));
    button(game, game.content, 'Save preference', () => finish(inputs.every((input, index) => input.checked === configs[index].privateValue)), 'site-primary', 'save');
    return game;
  },
};
