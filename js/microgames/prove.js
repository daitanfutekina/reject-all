import { tierFor } from '../engine.js';
import { shuffle, integer, pick } from '../random.js';
import { session, heading, button, element } from './shared.js';
import { flick, contains, verdict } from './evidence.js';

export function create(rng, difficulty) {
  const price = integer(rng, 20, 40), product = pick(rng, ['Lamp', 'Kettle', 'Clock']);
  const pairs = [
    { key: 'sale', claim: `${product}: "50% off our price yesterday!" Today $${price}.`, record: `${product} price history: yesterday $${price}; today $${price}.` },
    { key: 'delivery', claim: 'Delivery: "Free delivery on this order!"', record: `Delivery invoice for this order: mandatory delivery charge $${integer(rng, 4, 9)}.` },
    { key: 'cancel', claim: 'Membership: "Cancel immediately online!"', record: 'Membership terms: cancellation requires a posted letter and 30 days notice.' },
  ].slice(0, tierFor(difficulty));
  return { claims: shuffle(rng, pairs), records: shuffle(rng, [...pairs, { key: 'other', record: `${product} colour record: green. No pricing or policy information.` }]) };
}
export default {
  id: 'prove', command: 'PROVE IT!', patternId: 'prove', baseDuration: 26000, minDuration: 22000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty), end = verdict(finish);
    const game = session(root, rng, 'Receipt Review', difficulty);
    heading(game.content, 'Challenge every misleading claim', 'Drag a contradicting record onto its claim. Or tap a record, then its claim. Unrelated evidence does not prove a claim false.');
    const status = element('p', 'No record selected.', 'evidence-status'); status.setAttribute('aria-live', 'polite'); game.content.append(status);
    let selected = null;
    const solved = new Set(), targets = [];
    const submit = (record, claim, node) => {
      if (solved.has(claim.key)) return;
      if (record.key !== claim.key) { end(false); return; }
      solved.add(claim.key); node.classList.toggle('completed', true); node.textContent = `Refuted: ${claim.claim}`;
      selected = null; status.textContent = 'Claim refuted. Select another record.';
      if (solved.size === config.claims.length) end(true);
    };
    const claims = element('div', '', 'evidence-list'); game.content.append(claims);
    config.claims.forEach((claim, index) => {
      const node = button(game, claims, claim.claim, () => {
        if (selected) submit(selected, claim, node); else status.textContent = 'Select a record first.';
      }, 'evidence-card', `claim-${index}`);
      targets.push({ claim, node });
    });
    const records = element('div', '', 'evidence-list'); game.content.append(records);
    config.records.forEach((record, index) => {
      const node = button(game, records, record.record, () => { selected = record; status.textContent = `Selected: ${record.record}`; }, 'evidence-card gesture-card', `record-${index}`);
      flick(game, node, (dx, dy, event) => {
        if (Math.hypot(dx, dy) < 20) return;
        const target = targets.find(target => contains(target.node, event));
        if (target) submit(record, target.claim, target.node);
      });
    });
    game.onCancel(() => { selected = null; status.textContent = 'No record selected.'; });
    return game;
  },
};
