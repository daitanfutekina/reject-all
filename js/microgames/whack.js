import { tierFor } from '../engine.js';
import { integer, shuffle } from '../random.js';
import { session, heading, button, element } from './shared.js';

export default {
  id: 'whack', command: 'WHACK!', patternId: 'whack', baseDuration: 5500, minDuration: 4000,
  setup(root, rng, difficulty, finish, options = {}) {
    const game = session(root, rng, 'Reset Orchard', difficulty);
    heading(game.content, 'A helpful privacy update', 'Turn everything OFF. Watch for resets until time ends.');
    const status = element('p', 'Your settings have been updated.', 'smallprint'); game.content.append(status);
    const names = shuffle(rng, ['Ad tracking', 'Location sharing', 'Partner profiling', 'Usage sharing']).slice(0, 1 + tierFor(difficulty));
    const enabled = names.map(() => true);
    let remaining = options.duration ?? 7700, elapsed = 0, previous = null;
    const interval = Math.max(850, 1450 - difficulty * 50) * (options.relaxed ? 1.75 : 1);
    let nextReset = interval;
    const row = element('div', '', 'toggle-row'); game.content.append(row);
    const controls = names.map((name, index) => button(game, row, '', () => {
      enabled[index] = !enabled[index]; paint();
    }, 'privacy-toggle', `toggle-${index}`));
    function paint() {
      controls.forEach((control, index) => {
        control.textContent = `${names[index]}: ${enabled[index] ? 'ON' : 'OFF'}`;
        control.setAttribute('aria-pressed', String(enabled[index]));
      });
    }
    paint();
    return { ...game,
      timeoutResult: () => enabled.every(value => !value),
      update(value) {
        if (previous !== null) elapsed += Math.max(0, previous - value);
        remaining = value; previous = value;
        // Leave a final reaction window; never reset on the expiry frame.
        if (elapsed >= nextReset && remaining > 900) {
          enabled[integer(rng, 0, enabled.length - 1)] = true;
          nextReset = elapsed + interval;
          status.textContent = 'Update applied. A preference was reset to ON.'; paint();
        }
      },
    };
  },
};
