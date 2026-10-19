import { tierFor } from '../engine.js';
import { shuffle, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { flick, verdict } from './evidence.js';

export function create(rng, difficulty) {
  const task = pick(rng, [
    { name: 'Record and save a voice note', required: ['Microphone', 'Chosen save folder', 'Audio encoding'], optional: ['Contacts upload', 'Ad tracking', 'Precise location'] },
    { name: 'Scan and save a paper receipt', required: ['Camera', 'Chosen save folder', 'On-device text recognition'], optional: ['Contacts upload', 'Ad tracking', 'Microphone'] },
  ]);
  const tier = tierFor(difficulty);
  return { ...task, requests: shuffle(rng, [...task.required.slice(0, tier).map(name => ({ name, necessary: true })), ...task.optional.slice(0, tier).map(name => ({ name, necessary: false }))]) };
}
export default {
  id: 'sort', command: 'SORT!', patternId: 'sort', baseDuration: 16000, minDuration: 12000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Permission Parcel', difficulty);
    heading(game.content, config.name, `This task needs ONLY: ${config.required.join(', ')}. Swipe left for unnecessary, right for necessary. Or tap a tray.`);
    let index = 0;
    const area = element('div', '', 'evidence-workspace'); game.content.append(area);
    function render() {
      area.replaceChildren(); const request = config.requests[index]; let handled = false;
      const choose = necessary => {
        if (handled) return; handled = true;
        if (necessary !== request.necessary) { end(false); return; }
        if (++index === config.requests.length) end(true); else render();
      };
      const card = element('div', '', 'evidence-card gesture-card'); card.dataset.action = 'request';
      card.append(element('small', `Request ${index + 1}/${config.requests.length}`), element('h3', request.name)); area.append(card);
      const trays = element('div', '', 'evidence-columns'); area.append(trays);
      button(game, trays, '← Unnecessary', () => choose(false), 'evidence-tray', 'unnecessary');
      button(game, trays, 'Necessary →', () => choose(true), 'evidence-tray', 'necessary');
      flick(game, card, (dx, dy) => { if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy)) choose(dx > 0); });
    }
    render(); return game;
  },
};
