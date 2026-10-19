import { tierFor } from '../engine.js';
import { shuffle, pick, integer } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { flick, verdict } from './evidence.js';

export function create(rng, difficulty) {
  const tier = tierFor(difficulty);
  return shuffle(rng, [
    ...[{ label: 'Name', value: pick(rng, ['Alex Reed', 'Sam Birch']) }, { label: 'Email', value: 'reader@example.test' }, { label: 'Phone', value: '202-555-0142' }].slice(0, tier).map(field => ({ ...field, sensitive: true })),
    ...[{ label: 'Report total', value: `${integer(rng, 40, 95)} responses` }, { label: 'Topic', value: 'Bus reliability' }, { label: 'Survey month', value: 'April' }, { label: 'Average rating', value: '4 / 5' }].slice(0, tier + 1).map(field => ({ ...field, sensitive: false })),
  ]);
}
export default {
  id: 'mask', command: 'MASK!', patternId: 'mask', baseDuration: 16000, minDuration: 12000,
  setup(root, rng, difficulty, finish) {
    const fields = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Privacy Press', difficulty);
    heading(game.content, 'Publish an anonymous report', 'Redact Name, Email and Phone only. Keep report facts readable. Paint across a field or tap Redact.');
    let remaining = fields.filter(field => field.sensitive).length;
    fields.forEach((field, index) => {
      const row = element('div', '', 'evidence-card');
      const value = element('span', `${field.label}: ${field.value}`); row.append(value);
      let masked = false;
      const redact = () => {
        if (masked) return;
        if (!field.sensitive) { end(false); return; }
        masked = true; value.textContent = `${field.label}: ████████`;
        row.classList.toggle('completed', true); if (--remaining === 0) end(true);
      };
      const brush = button(game, row, 'Redact', redact, 'gesture-card', `field-${index}`);
      row.dataset.action = `paint-${index}`;
      flick(game, row, dx => { if (Math.abs(dx) >= 28) redact(); });
      // The button is also a generous paint handle on small touch screens.
      flick(game, brush, dx => { if (Math.abs(dx) >= 28) redact(); });
      row.className += ' gesture-card'; game.content.append(row);
    });
    return game;
  },
};
