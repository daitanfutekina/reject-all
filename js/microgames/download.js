import { pick, shuffle } from '../random.js';
import { tierFor } from '../engine.js';
import { session, heading, button, element, checkbox } from './shared.js';

export function create(rng, difficulty = 1) {
  const tier = tierFor(difficulty);
  return { tier, file: pick(rng, ['pebble-zip.exe', 'paper-driver.exe', 'copper-player.exe']), version: pick(rng, ['2.4', '3.1', '4.2']), size: pick(rng, [12, 18, 24]), mirror: rng() < 0.5,
    ads: shuffle(rng, [
      { label: 'DOWNLOAD NOW', style: 'green', domain: 'bonus-barge.example' },
      { label: 'Start Download', style: 'blue', domain: 'click-cabbage.example' },
      { label: 'Fast Download (Recommended)', style: 'orange', domain: 'turbo-turnip.example' },
      { label: '\u25b6 Play & download', style: 'play', domain: 'video-vine.example' },
      { label: 'Your download is ready', style: 'ready', domain: 'ready-radish.example' },
      { label: '99% complete - finish download', style: 'progress', domain: 'loader-leek.example' },
    ].slice(0, tier * 2)) };
}
export default {
  id: 'download', command: 'DOWNLOAD!', patternId: 'download', baseDuration: 6500, minDuration: 6500,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Folio Crate', difficulty);
    const page = element('div', '', 'mirror-page'); game.content.append(page);
    const metadata = `${config.file} / v${config.version} / ${config.size} MB`;
    heading(page, config.file, `Version ${config.version} / ${config.size} MB / Freeware`);
    const install = () => {
      if (config.tier < 3) { finish(true); return; }
      page.replaceChildren();
      heading(page, 'Custom installation', metadata);
      page.append(element('p', 'Install only the requested file. Optional extras are selected for you.'));
      const toolbar = checkbox(game, page, 'Add the Sprout Search toolbar (optional)', true, 'toolbar');
      button(game, page, 'Install selected components', () => finish(!toolbar.checked), 'site-primary', 'install');
    };
    const original = element('div', '', 'original-download');
    original.append(element('span', config.mirror ? 'Mirror 2 / Original file' : 'Original file', 'smallprint'));
    button(game, original, metadata, install, 'fine-link', 'original');
    original.append(element('span', 'folio-crate.example', 'domain'));
    if (!config.mirror) page.append(original);
    const ads = element('div', '', 'mirror-ads');
    for (const [index, ad] of config.ads.entries()) {
      const card = element('aside', '', `mirror-ad ad-${ad.style}`);
      card.append(element('span', `Ad / ${ad.domain}`, 'ad-label'));
      button(game, card, ad.label, () => finish(false), '', `ad-${index}`);
      ads.append(card);
    }
    page.append(ads);
    if (config.tier >= 2) {
      const noise = element('div', '', 'mirror-noise');
      noise.append(element('span', 'Scan complete: 0 threats'), element('span', 'Your download will begin in 5...'));
      checkbox(game, noise, 'Recommended: install DriverSprout too (Ad)', true, 'driver');
      page.append(noise);
    }
    if (config.mirror) page.append(original);
    return game;
  },
};
