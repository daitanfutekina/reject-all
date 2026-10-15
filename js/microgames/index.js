import cookies from './cookies.js';
import untick from './untick.js';
import decline from './decline.js';
import remove from './remove.js';
import cheaper from './cheaper.js';
import wait from './wait.js';
import download from './download.js';
import trick from './trick.js';
import close from './close.js';
import privacy from './private.js';
import gym from './gym.js';
import scroll from './scroll.js';
import slide from './slide.js';
import hold from './hold.js';
import whack from './whack.js';
import odds from './odds.js';

export const microgames = [cookies, untick, decline, remove, cheaper, wait, download, trick, close, privacy, scroll, slide, hold, whack, odds];
export const games = [...microgames, gym];
export const byId = Object.fromEntries(games.map(game => [game.id, game]));

const hints = {
  cookies: 'Find the option that rejects optional cookies.', untick: 'Clear optional boxes; keep required Terms.',
  decline: 'Choose the refusal, even if it insults you.', remove: 'Remove the extra; drag it into the bin if shown.',
  cheaper: 'Add the fees before choosing a price.', wait: 'Touch nothing until the timer ends.',
  download: 'Find the original file, not an advertisement.', trick: 'Set the statement to receive no offers.',
  close: 'Close each nag; drag bottom sheets down.', private: 'Choose privacy in every row, then save.',
  scroll: 'Scroll the terms to find the opt-out.', slide: 'Drag every slider fully left to zero.',
  hold: 'Hold Cancel without releasing; ignore offers.', whack: 'Keep every toggle OFF until time runs out.',
  odds: 'Swipe the cards, then open drop-rate details.', gym: 'Keep choosing cancellation through every offer.',
};
for (const game of games) game.hint = hints[game.id];
