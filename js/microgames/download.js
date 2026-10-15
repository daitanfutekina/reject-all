import { pick, shuffle } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng) {
  return { file: pick(rng, ['paper-grid.pdf', 'tiny-calendar.pdf', 'blank-checklist.pdf', 'meal-planner.pdf', 'gift-labels.pdf', 'reading-log.pdf', 'packing-list.pdf', 'weekly-budget.pdf']), cards: shuffle(rng, [
    { real: true, label: 'Original file', domain: 'folio-crate.example' },
    { real: false, label: pick(rng, ['Ad · speed helper', 'Ad · document viewer', 'Ad · premium reader', 'Ad · download manager']), domain: 'bonus-barge.example' },
    { real: false, label: pick(rng, ['Sponsored · file assistant', 'Sponsored · format converter', 'Sponsored · cloud organiser', 'Sponsored · print utility']), domain: 'click-cabbage.example' },
  ]) };
}
export default {
  id: 'download', command: 'DOWNLOAD!', patternId: 'download', baseDuration: 4500,
  setup(root, rng, difficulty, finish) {
    const config = create(rng);
    const game = session(root, rng, 'Folio Crate', difficulty);
    heading(game.content, config.file, 'Get the original file from Folio Crate.');
    config.cards.forEach((card, index) => {
      const row = element('div', '', `download-card ${card.real ? '' : 'sponsored'}`);
      row.append(element('span', card.label, 'smallprint'), element('span', card.domain, 'domain'));
      button(game, row, 'Download', () => finish(card.real), card.real ? '' : 'site-primary', `download-${index}`);
      game.content.append(row);
    });
    return game;
  },
};
