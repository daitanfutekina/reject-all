import { pick, shuffle } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element } from './shared.js';

export default {
  id: 'delete', command: 'DELETE!', patternId: 'delete', baseDuration: 7500, minDuration: 7000,
  setup(root, rng, difficulty, finish) {
    const tier = tierFor(difficulty);
    const game = session(root, rng, pick(rng, ['Archive Acorn', 'Profile Pebble', 'Account Cove']), difficulty);
    const path = pick(rng, [
      ['Settings', 'Account', 'Privacy', 'Data', 'Account ownership', 'Deletion options'],
      ['Preferences', 'Account settings', 'Privacy controls', 'Your data', 'Account management', 'Deletion options'],
      ['Settings', 'Your account', 'Your information', 'Data rights', 'Account ownership', 'Delete or deactivate'],
    ]).slice(0, tier * 2);
    const decoys = ['Appearance', 'Notifications', 'Visibility', 'Download archive', 'Transfer account', 'Export preferences'];
    const orders = Array.from({ length: path.length + 1 }, () => shuffle(rng, ['deactivate', 'break', 'detour', 'next']));
    let step = 0;
    function render() {
      game.content.replaceChildren();
      game.step(step + 1, path.length + 1);
      heading(game.content, step ? path[step - 1] : 'Your profile', 'Permanently delete this fictional account.');
      game.content.append(element('p', step ? path.slice(0, step).join(' › ') : `Account controls are in ${path[0]}.`, 'smallprint'));
      for (const action of orders[step]) {
        if (action === 'deactivate') button(game, game.content, 'Deactivate account', () => finish(false), 'site-primary', 'deactivate');
        else if (action === 'break') button(game, game.content, 'Take a break', () => finish(false), 'fine-link', 'break');
        else if (step < path.length && action === 'detour') button(game, game.content, decoys[step], () => { step = 0; render(); }, '', 'detour');
        else if (action === 'next') {
          if (step < path.length) button(game, game.content, path[step], () => { step++; render(); }, 'fine-link', 'next');
          else button(game, game.content, 'Permanently delete account', () => {
            game.content.replaceChildren(element('h2', 'Account deleted')); finish(true);
          }, 'fine-link', 'delete');
        }
      }
    }
    render(); return game;
  },
};
