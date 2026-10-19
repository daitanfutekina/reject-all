import { tierFor } from '../engine.js';
import { pick, shuffle } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng, difficulty) {
  const posts = shuffle(rng, [
    { author: 'Moss Studio', title: 'A little desk refresh', color: 'mint' },
    { author: 'Weekend Club', title: 'Take the scenic route', color: 'peach' },
    { author: 'Juniper Notes', title: 'Your next good read', color: 'lilac' },
    { author: 'Morning Works', title: 'Make room for coffee', color: 'sand' },
    { author: 'Little Orbit', title: 'One bright idea', color: 'mint' },
  ]);
  const decoys = shuffle(rng, ['Following', 'Community', 'Suggested']);
  return shuffle(rng, posts.slice(0, tierFor(difficulty) + 1).map((post, index) => ({
    ...post, sponsored: index === 0,
    disclosure: index === 0 ? pick(rng, ['Sponsored', 'Ad', 'Paid partnership']) : decoys[index - 1],
    location: pick(rng, ['top', 'middle', 'bottom']),
  })));
}

export default {
  id: 'adspot', command: 'SPOT AD!', patternId: 'adspot', baseDuration: 5500, minDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const cards = create(rng, difficulty);
    root.dataset.game = 'adspot';
    const game = session(root, rng, 'Your feed', difficulty);
    heading(game.content, 'Find the paid post', 'Tap the card labelled Sponsored, Ad or Paid partnership.');
    const feed = element('div', '', 'quick-game-grid');
    let done = false;
    cards.forEach((post, index) => {
      const card = button(game, feed, '', () => {
        if (done) return;
        done = true; finish(post.sponsored);
      }, 'quick-game-card adspot-post', `post-${index}`);
      const thumbnail = element('span', post.author[0], `adspot-thumb ${post.color}`);
      thumbnail.setAttribute('aria-hidden', 'true');
      const author = element('span', post.author, 'adspot-author');
      const title = element('strong', post.title, 'adspot-title');
      const disclosure = element('span', post.disclosure, 'adspot-disclosure');
      card.append(thumbnail);
      if (post.location === 'top') card.append(disclosure, author, title);
      else if (post.location === 'middle') card.append(author, disclosure, title);
      else card.append(author, title, disclosure);
    });
    game.content.append(feed);
    return game;
  },
};
