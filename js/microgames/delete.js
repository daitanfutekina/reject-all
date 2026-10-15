import { pick } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element } from './shared.js';

export default {
  id: 'delete', command: 'DELETE!', patternId: 'delete', baseDuration: 7500, minDuration: 7000,
  setup(root, rng, difficulty, finish) {
    const tier = tierFor(difficulty);
    const game = session(root, rng, pick(rng, ['Archive Acorn', 'Profile Pebble', 'Account Cove']), difficulty);
    const path = ['Settings', 'Account', 'Privacy', 'Data', 'Account ownership', 'Deletion options'].slice(0, tier * 2);
    const decoys = ['Appearance', 'Notifications', 'Visibility', 'Download archive', 'Transfer account', 'Export preferences'];
    let step = 0;
    function render() {
      game.content.replaceChildren();
      heading(game.content, step ? path[step - 1] : 'Your profile', 'Permanently delete this fictional account.');
      game.content.append(element('p', step ? path.slice(0, step).join(' › ') : 'Account controls are in Settings.', 'smallprint'));
      button(game, game.content, 'Deactivate account', () => finish(false), 'site-primary', 'deactivate');
      button(game, game.content, 'Take a break', () => finish(false), '', 'break');
      if (step < path.length) {
        button(game, game.content, decoys[step], () => { step = 0; render(); }, '', 'detour');
        button(game, game.content, path[step], () => { step++; render(); }, 'fine-link', 'next');
      } else button(game, game.content, 'Permanently delete account', () => {
        game.content.replaceChildren(element('h2', 'Account deleted')); finish(true);
      }, 'fine-link', 'delete');
    }
    render(); return game;
  },
};
