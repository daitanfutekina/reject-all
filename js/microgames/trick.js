import { pick } from '../random.js';
import { session, heading, checkbox, button, element } from './shared.js';

export const questions = [
  { wording: 'Do not disable promotional offers.', privateValue: false },
  { wording: 'Do not send me promotional offers.', privateValue: true },
  { wording: 'Do not stop sending me offers.', privateValue: false },
  { wording: 'Keep me opted out of offers.', privateValue: true },
  { wording: 'Uncheck to not opt out of receiving offers.', privateValue: true },
  { wording: 'Opt out of not receiving offers.', privateValue: false },
];
export function create(rng) { return { ...pick(rng, questions), initial: rng() < 0.5 }; }
export default {
  id: 'trick', command: 'SET IT!', patternId: 'trick', baseDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng);
    const game = session(root, rng, 'Syntax Attic');
    heading(game.content, 'Your communication preferences', 'Your goal: receive NO offers.');
    const input = checkbox(game, game.content, config.wording, config.initial, 'offers');
    game.content.append(element('p', 'Checked = statement enabled.', 'smallprint'));
    button(game, game.content, 'Save preference', () => finish(input.checked === config.privateValue), 'site-primary', 'save');
    return game;
  },
};
