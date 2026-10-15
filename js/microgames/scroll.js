import { tierFor } from '../engine.js';
import { integer, pick } from '../random.js';
import { session, heading, element, button } from './shared.js';

export default {
  id: 'scroll', command: 'SCROLL!', patternId: 'scroll', baseDuration: 6500, minDuration: 6000,
  setup(root, rng, difficulty, finish) {
    const game = session(root, rng, pick(rng, ['Clause Cove', 'Footnote Ferry', 'Margin Mill']), difficulty);
    heading(game.content, 'A tiny agreement', 'Scroll the terms. Find the opt-out.');
    const box = element('div', '', 'terms-box'); box.dataset.action = 'terms';
    box.setAttribute('tabindex', '0'); box.setAttribute('aria-label', 'Scrollable terms');
    const count = 4 + 4 * tierFor(difficulty) + integer(rng, 0, 1);
    const buried = count - integer(rng, 1, 3);
    const clauses = ['Partners may use activity to tailor suggestions.', 'Optional messages may arrive at a convenient time for us.', 'Recommendations reflect our commercial relationships.', 'Service announcements are described in another appendix.', 'Your preferences may be reviewed in the account centre.', 'This section refers to the preceding and following sections.'];
    for (let i = 0; i < count; i++) {
      box.append(element('p', `${i + 1}. ${pick(rng, clauses)}`));
      if (i === 2) button(game, box, 'Learn more', () => finish(false), 'fine-link', 'decoy');
      if (i === buried) button(game, box, 'Opt out of optional sharing', () => finish(true), 'fine-link', 'opt-out');
    }
    game.content.append(box);
    button(game, game.content, 'Accept and continue', () => finish(false), 'site-primary', 'accept');
    return game;
  },
};
