import { tierFor } from '../engine.js';
import { shuffle, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { flick, verdict } from './evidence.js';

export function create(rng, difficulty) {
  const tier = tierFor(difficulty);
  return shuffle(rng, [
    ...shuffle(rng, ['Ad targeting', 'Cross-site advertising', 'Ad auction profile']).slice(0, tier).map(name => ({ name, essential: false })),
    ...shuffle(rng, ['Secure checkout', 'Login session', 'Shopping basket']).slice(0, tier).map(name => ({ name, essential: true })),
  ]);
}
export default {
  id: 'disconnect', command: 'DISCONNECT!', patternId: 'disconnect', baseDuration: 14000, minDuration: 11000,
  setup(root, rng, difficulty, finish) {
    const wires = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, pick(rng, ['Signal Spruce', 'Cable Cove']), difficulty);
    heading(game.content, 'Unplug advertising', 'Pull each advertising plug away from its socket. Keep every essential connection. Or tap Disconnect.');
    let remaining = wires.filter(wire => !wire.essential).length;
    wires.forEach((wire, index) => {
      const row = element('div', '', 'evidence-card wire-row');
      row.append(element('p', `${wire.name} · ${wire.essential ? 'Essential' : 'Advertising'}`));
      let removed = false;
      const unplug = () => {
        if (removed) return;
        if (wire.essential) { end(false); return; }
        removed = true; row.classList.toggle('completed', true); plug.textContent = 'Disconnected';
        if (--remaining === 0) end(true);
      };
      const plug = button(game, row, '━━● Disconnect', unplug, 'wire-plug gesture-card', `wire-${index}`);
      flick(game, plug, (dx, dy) => { if (Math.hypot(dx, dy) >= 45) unplug(); });
      game.content.append(row);
    });
    return game;
  },
};
