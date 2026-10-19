import { tierFor } from '../engine.js';
import { pick, shuffle } from '../random.js';
import { session, heading, button, element } from './shared.js';

export function create(rng, difficulty) {
  const service = pick(rng, ['Luma', 'Sprig', 'Pebble']), name = service.toLowerCase();
  const domain = `${name}.example`;
  const outside = pick(rng, [`${name}-login.example`, `${name}.support.example`, `${name}mail.example`, `${domain}.mail.example`]);
  const subjects = shuffle(rng, ['Your weekly recap', 'A new sign-in', 'Your receipt', 'Account update', 'New features', 'Your saved items']);
  const senders = shuffle(rng, ['Team', 'Support', 'Updates', 'Account']);
  const messages = Array.from({ length: tierFor(difficulty) + 1 }, (_, index) => ({
    sender: `${service} ${senders[index]}`, subject: subjects[index],
    domain: index === 0 ? outside : domain, isPhish: index === 0,
  }));
  return { service, domain, messages: shuffle(rng, messages) };
}

export default {
  id: 'phish', command: 'PHISH!', patternId: 'phish', baseDuration: 6000, minDuration: 5000,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    root.dataset.game = 'phish';
    const game = session(root, rng, 'Inbox', difficulty);
    heading(game.content, 'Catch the fake sender', 'Tap the message from a different domain.');
    const official = element('div', 'Official domain: ', 'phish-official');
    official.append(element('strong', config.domain));
    const inbox = element('div', '', 'quick-game-grid');
    let done = false;
    config.messages.forEach((message, index) => {
      const card = button(game, inbox, '', () => {
        if (done) return;
        done = true; finish(message.isPhish);
      }, 'quick-game-card phish-message', `message-${index}`);
      card.append(element('span', message.sender, 'phish-sender'), element('span', message.domain, 'phish-domain'), element('strong', message.subject, 'phish-subject'));
    });
    game.content.append(official, inbox);
    return game;
  },
};
