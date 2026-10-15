import { integer, pick, shuffle } from '../random.js';
import { session, heading, button } from './shared.js';

export function create(rng, difficulty) {
  return { depth: integer(rng, 0, Math.min(2, Math.floor(difficulty / 2))), brand: pick(rng, ['Crumbquay', 'Velvet Ledger', 'Tin Orchard', 'Crust Atlas', 'Biscuit Bay', 'Crisp Index']), reverse: rng() < 0.5, wording: shuffle(rng, ['Manage options', 'Privacy preferences', 'Customise consent', 'Review partners', 'Cookie controls', 'More choices']), partners: integer(rng, 120, 980), pitch: pick(rng, ['We value your privacy.', 'A better browsing experience.', 'Your data, our opportunity.', 'Make yourself at home.', 'One little choice.', 'Help keep this site free.']) };
}
export default {
  id: 'cookies', command: 'REJECT!', patternId: 'cookies', baseDuration: 4200,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, config.brand, difficulty);
    let step = 0;
    function render() {
      game.content.replaceChildren();
      heading(game.content, step ? 'Your choices matter*' : config.pitch, step ? '*Especially the profitable ones.' : `All ${config.partners} of our partners would love a little piece of it.`);
      const options = [
        () => button(game, game.content, 'Accept all', () => finish(false), 'site-primary jumbo', 'accept'),
        () => button(game, game.content, step < config.depth ? config.wording[step] : 'Reject optional cookies', () => { if (step < config.depth) { step++; render(); } else finish(true); }, 'fine-link', 'reject'),
      ];
      if (config.reverse) options.reverse();
      options.forEach(renderOption => renderOption());
    }
    render(); return game;
  },
};
