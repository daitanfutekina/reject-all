import { pick } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element } from './shared.js';

export default {
  id: 'contacts', command: 'CONTACTS?', patternId: 'contacts', baseDuration: 6000, minDuration: 5500,
  setup(root, rng, difficulty, finish) {
    const tier = tierFor(difficulty);
    const game = session(root, rng, pick(rng, ['Circle Sprig', 'Friend Fern', 'Social Silt']), difficulty);
    const requests = ['contacts and address book', 'email address book', 'ongoing contact sync'];
    const refusal = pick(rng, ['Continue without friends', 'Keep my address book private', 'Skip finding friends']);
    let step = 0;
    function render() {
      game.content.replaceChildren();
      heading(game.content, 'Find your friends!', `Allow access to your ${requests[step]}?`);
      button(game, game.content, 'Allow and find everyone', () => finish(false), 'site-primary jumbo', 'allow');
      if (tier >= 2) button(game, game.content, 'Only upload once', () => finish(false), '', 'upload-once');
      if (tier === 3) game.content.append(element('p', 'Continue without sharing to keep this access denied.', 'smallprint'));
      button(game, game.content, tier === 1 ? 'Deny access' : refusal, () => {
        if (++step === tier) { game.content.replaceChildren(element('h2', 'All contact access denied')); finish(true); }
        else render();
      }, 'fine-link', 'deny');
    }
    render(); return game;
  },
};
