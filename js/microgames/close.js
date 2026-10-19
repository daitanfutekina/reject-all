import { tierFor } from '../engine.js';
import { integer, shuffle, pick } from '../random.js';
import { session, heading, button, element, drag } from './shared.js';

export const POPUP_ADS = [
  { id: 'singles', visual: 'dating', brand: 'Spark', title: 'Hot singles near you', copy: 'Someone nearby wants to say hello.', cta: 'See who is online' },
  { id: 'houses', visual: 'magic', brand: 'Quiz Owl', title: 'Which Hogwarts house are you?', copy: 'The sorting quiz is waiting.', cta: 'Find my house' },
  { id: 'visitor', visual: 'prize', brand: 'Lucky Visitor', title: "You're our 1,000,000th visitor!", copy: 'A free phone has your name on it.', cta: 'Claim my prize' },
  { id: 'virus', visual: 'warning', brand: 'PC Shield', title: 'Your computer has 13 viruses!', copy: 'Critical threats detected. Act now.', cta: 'Remove threats' },
  { id: 'player', visual: 'download', brand: 'HD Player', title: 'Your Flash Player is out of date', copy: 'Update your player to keep watching.', cta: 'Install update' },
  { id: 'message', visual: 'chat', brand: 'Chat Now', title: 'You have (1) new message', copy: 'Your inbox has been waiting for you.', cta: 'Read message' },
  { id: 'profile', visual: 'chat', brand: 'Profile Peek', title: 'Someone nearby viewed your profile', copy: 'Find out who has been looking.', cta: 'Reveal my visitor' },
  { id: 'trick', visual: 'article', brand: 'Daily Discoveries', title: 'Local mom finds ONE WEIRD TRICK', copy: 'The secret everybody is talking about.', cta: 'Show me the trick' },
  { id: 'doctors', visual: 'article', brand: 'Trending Today', title: 'Doctors HATE this simple trick!', copy: "The secret they don't want you to know.", cta: 'Find out why' },
  { id: 'next', visual: 'article', brand: 'The Daily Scroll', title: "You won't believe what happened next", copy: 'The answer is always one more click away.', cta: 'See what happened' },
  { id: 'puzzle', visual: 'puzzle', brand: 'Brain Break', title: 'Only 1% can solve this puzzle!', copy: "Think you're smarter? Prove it.", cta: 'Try the challenge' },
  { id: 'level', visual: 'puzzle', brand: 'Block Quest', title: 'Can you reach level 10?', copy: 'Can you do better than this?', cta: 'Play now' },
  { id: 'soulmate', visual: 'quiz', brand: 'Quiz Crush', title: 'Which celebrity is your soulmate?', copy: 'Five questions. One very confident answer.', cta: 'Take the quiz' },
  { id: 'future', visual: 'quiz', brand: 'Future Face', title: 'What will you look like in 30 years?', copy: 'Your future face is ready to be revealed.', cta: 'See future me' },
  { id: 'mental', visual: 'quiz', brand: 'Brain Age', title: 'Your mental age will SHOCK you', copy: 'Your real birthday has nothing to do with it.', cta: 'Find my brain age' },
  { id: 'wheel', visual: 'prize', brand: 'Spin & Win', title: 'Spin for your FREE prize!', copy: 'Your lucky spin is waiting.', cta: 'Spin the wheel' },
  { id: 'money', visual: 'cash', brand: 'Laptop Lifestyle', title: 'Earn $500 a day from home!', copy: 'All you need is a laptop.', cta: 'Start earning today' },
  { id: 'download', visual: 'download', brand: 'Download Express', title: 'Your download is ready', copy: 'The biggest button must be the right one.', cta: 'DOWNLOAD NOW' },
];

export function create(rng, difficulty) {
  const config = { count: 1 + tierFor(difficulty), positions: shuffle(rng, ['top-left', 'bottom-right', 'top-right', 'bottom-left']), pitch: pick(rng, ['Let us send notifications!', 'Please join our newsletter!', 'One more offer before you go!', 'Unlock our daily deals!', 'Join the early access list!', 'Get alerts for every update!']), sheet: rng() < 0.5 };
  return { ...config, ads: shuffle(rng, [...POPUP_ADS, { id: 'newsletter', visual: 'chat', brand: 'One More Thing', title: config.pitch, copy: 'This will only take forever.', cta: 'Fine, sign me up' }]).slice(0, config.count) };
}
export default {
  id: 'close', command: 'CLOSE!', patternId: 'close', baseDuration: 4500, minDuration: 4500,
  setup(root, rng, difficulty, finish) {
    const config = create(rng, difficulty);
    const game = session(root, rng, 'Nudge Cabinet', difficulty);
    const video = game.identity === 'freevideo';
    heading(game.content, video ? 'Just trying to watch.' : 'Just trying to read.', config.sheet ? 'Drag every bottom sheet down to dismiss.' : 'Close every pop-up. Yes, every one.');
    const zone = element('div', '', 'nag-zone'); game.content.append(zone);
    let closed = 0, done = false;
    function render() {
      zone.replaceChildren();
      game.step(closed + 1, config.count);
      const ad = config.ads[closed], step = closed;
      const popup = element('section', '', `nag-popup clickbait popup-${ad.visual} ${config.sheet ? 'bottom-sheet' : config.positions[closed]}`);
      popup.dataset.ad = ad.id;
      const dismiss = () => { if (done || closed !== step) return; closed++; if (closed === config.count) {
        done = true;
        if (video) game.content.replaceChildren(element('h2', 'Playback ready'), element('p', 'The Last Departure · Episode 1. Enjoy the show.'));
        finish(true);
      } else render(); };
      if (config.sheet) {
        const handle = element('div', '━━  Drag down', 'sheet-handle'); handle.dataset.action = 'swipe-close'; popup.append(handle);
        drag(game, handle, (dx, dy) => { popup.style.transform = `translateY(${Math.max(0, Math.min(70, dy))}px)`; }, (dx, dy, event, cancelled) => {
          popup.style.transform = ''; if (!cancelled && dy >= 55) dismiss();
        });
      } else {
        const close = button(game, popup, '×', dismiss, 'close-x', 'close');
        close.setAttribute('aria-label', 'Close pop-up');
      }
      popup.append(element('span', `Ad · ${ad.brand}`, 'popup-ad-label'));
      const body = element('div', '', 'popup-ad-body'), art = element('div', '', 'popup-ad-art'); art.setAttribute('aria-hidden', 'true');
      if (ad.visual === 'dating') {
        const photo = element('img', '', 'popup-ad-portraits'); photo.alt = ''; photo.src = new URL('../../assets/clickbait-singles.webp', import.meta.url).href;
        art.append(photo, element('span', '● Online now', 'popup-online'));
      } else if (ad.visual === 'magic') {
        for (const house of ['G', 'S', 'R', 'H']) art.append(element('span', house, `popup-crest crest-${house.toLowerCase()}`));
      } else if (ad.visual === 'puzzle') {
        for (const tile of ['1', '2', '3', '4', '', '6', '7', '8', '?']) art.append(element('span', tile));
      } else if (ad.visual === 'article') {
        const photo = element('img'); photo.alt = ''; photo.src = new URL('../../assets/post-coffee.webp', import.meta.url).href;
        art.append(photo, element('span', '➜', 'popup-click-arrow'));
      } else art.append(element('strong', { prize: 'WIN', warning: '!', chat: '1', quiz: '?', cash: '$', download: '↓' }[ad.visual]));
      const copy = element('div', '', 'popup-ad-copy'); copy.append(element('h3', ad.title), element('p', ad.copy));
      body.append(art, copy); popup.append(body);
      button(game, popup, ad.cta, () => { if (!done && closed === step) { done = true; finish(false); } }, 'popup-ad-cta', 'accept');
      zone.append(popup);
    }
    render(); return game;
  },
};
