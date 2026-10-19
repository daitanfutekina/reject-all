import { tierFor } from '../engine.js';
import { shuffle, integer } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { flick, verdict } from './evidence.js';

export function create(rng, difficulty) {
  return shuffle(rng, Array.from({ length: tierFor(difficulty) }, (_, index) => [
    { title: `Response ${integer(rng, 10, 99)}-${index}`, text: ['Name: Alex Reed', 'Email: sam@example.test', 'Phone: 202-555-0142'][index], identifying: true },
    { title: `Anonymous report ${index + 1}`, text: `Aggregate only: ${integer(rng, 25, 90)} responses. No names, emails or phone numbers.`, identifying: false },
  ]).flat());
}
export default {
  id: 'shred', command: 'SHRED!', patternId: 'shred', baseDuration: 16000, minDuration: 12000,
  setup(root, rng, difficulty, finish) {
    const docs = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Paper Pine', difficulty);
    heading(game.content, 'Keep anonymous reports', 'Flick documents with a name, email or phone DOWN into the shredder. Flick anonymous reports UP to archive. Taps work too.');
    let index = 0;
    const area = element('div', '', 'evidence-workspace'); game.content.append(area);
    function render() {
      area.replaceChildren(); const doc = docs[index]; let handled = false;
      const choose = shred => {
        if (handled) return; handled = true;
        if (shred !== doc.identifying) { end(false); return; }
        if (++index === docs.length) end(true); else render();
      };
      button(game, area, '↑ Archive anonymous report', () => choose(false), 'evidence-tray', 'archive');
      const card = element('div', '', 'evidence-card gesture-card'); card.dataset.action = 'document';
      card.append(element('small', `Document ${index + 1}/${docs.length}`), element('h3', doc.title), element('p', doc.text));
      area.append(card);
      button(game, area, '↓ Shred identifying document', () => choose(true), 'evidence-tray', 'shred');
      flick(game, card, (dx, dy) => { if (Math.abs(dy) >= 45 && Math.abs(dy) > Math.abs(dx)) choose(dy > 0); });
    }
    render(); return game;
  },
};
