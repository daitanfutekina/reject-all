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
import trial from './trial.js';
import unsubscribe from './unsubscribe.js';
import contacts from './contacts.js';
import deleteAccount from './delete.js';
import price from './price.js';

export const microgames = [cookies, untick, decline, remove, cheaper, wait, download, trick, close, privacy, scroll, slide, hold, whack, odds, trial, unsubscribe, contacts, deleteAccount, price];
export const games = [...microgames, gym];
export const byId = Object.fromEntries(games.map(game => [game.id, game]));

const hints = {
  cookies: 'Find the option that rejects optional cookies.', untick: 'Clear optional boxes; keep required Terms.',
  decline: 'Choose the refusal, even if it insults you.', remove: 'Remove ALL extras; drag them into the bin if shown.',
  cheaper: 'Add the fees before choosing a price.', wait: 'Touch nothing until the timer ends.',
  download: 'Match the file, version and size. Refuse installer extras.', trick: 'Set every statement to receive no offers.',
  close: 'Close each nag; drag bottom sheets down.', private: 'Choose privacy in every row, then save.',
  scroll: 'Scroll the terms to find the opt-out.', slide: 'Drag every slider fully left to zero.',
  hold: 'Hold Cancel without releasing; ignore offers.', whack: 'Keep every toggle OFF until time runs out.',
  odds: 'Swipe the cards, then open drop-rate details.', gym: 'Keep choosing cancellation through every offer.',
  trial: 'Find the full-price auto-renewal date in billing terms.', unsubscribe: 'Keep going until ALL newsletters are unsubscribed.',
  contacts: 'Deny every request, including one-time uploads.', delete: 'Follow Settings, Account, Privacy and Data to deletion.',
  price: 'Compare a full year of payments, including setup fees.',
};
for (const game of games) game.hint = hints[game.id];
