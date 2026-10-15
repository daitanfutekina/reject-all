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

export const microgames = [cookies, untick, decline, remove, cheaper, wait, download, trick, close, privacy];
export const games = [...microgames, gym];
export const byId = Object.fromEntries(games.map(game => [game.id, game]));
