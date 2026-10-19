import cookies from './cookies.js';
import untick from './untick.js';
import decline from './decline.js';
import remove from './remove.js';
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
import phish from './phish.js';
import adspot from './adspot.js';

import disconnect from './disconnect.js';
import mask from './mask.js';
import shred from './shred.js';
import sort from './sort.js';
import prove from './prove.js';
import authentic from './authentic.js';
import stock from './stock.js';
import basket from './basket.js';
import label from './label.js';
import guest from './guest.js';

// Long-form v4 experiments remain available in the debug lab, outside normal runs.
export const microgames = [cookies, untick, decline, remove, wait, download, trick, close, privacy, scroll, slide, hold, whack, odds, trial, unsubscribe, contacts, deleteAccount, price, gym, phish, adspot];
export const games = [...microgames, disconnect, mask, shred, sort, prove, authentic, stock, basket, label, guest];
export const byId = Object.fromEntries(games.map(game => [game.id, game]));

const hints = {
  cookies: 'Find the option that rejects optional cookies.', untick: 'Clear optional boxes; keep required Terms.',
  decline: 'Choose the refusal, even if it insults you.', remove: 'Remove ALL extras; drag them into the bin if shown.',
  wait: 'Touch nothing until the timer ends.',
  download: 'Match the file, version and size. Refuse installer extras.', trick: 'Set every statement to receive no offers.',
  close: 'Close each nag; drag bottom sheets down.', private: 'Choose privacy in every row, then save.',
  scroll: 'Scroll the terms to find the opt-out.', slide: 'Drag every slider fully left to zero.',
  hold: 'Hold Cancel without releasing; ignore offers.', whack: 'Keep every toggle OFF until time runs out.',
  odds: 'Swipe the cards, then open drop-rate details.', gym: 'Keep choosing cancellation through every offer.',
  trial: 'Find the full-price auto-renewal date in billing terms.', unsubscribe: 'Keep going until ALL newsletters are unsubscribed.',
  contacts: 'Deny every request, including one-time uploads.', delete: 'Follow account controls to permanent deletion, not deactivation.',
  disconnect: 'Pull advertising plugs away; keep essential connections.',
  mask: 'Redact only personal fields. Keep report facts readable.',
  shred: 'Flick identifying documents down; archive anonymous reports up.',
  sort: 'Swipe left for unnecessary, right for necessary to the stated task.',
  prove: 'Match each misleading claim to the record that contradicts it.',
  authentic: 'Inspect records; remove duplicate copies and false independence claims.',
  stock: 'Compare counts with the same-time inventory records.',
  basket: 'Compare receipt and checkout; restore changed products or quantities.',
  label: 'Reveal disclosures, then label each card Sponsored or Editorial.',
  guest: 'Find the guest route and complete checkout without creating an account.',
  price: 'Compare a full year of payments, including setup fees.',
  phish: 'Compare sender domains with the official domain. Tap the impostor.',
  adspot: 'Find the paid post by its advertising disclosure.',
};
for (const game of games) game.hint = hints[game.id];
