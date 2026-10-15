import { pick } from '../random.js';
import { session, heading, button, element } from './shared.js';

export default {
  id: 'hold', command: 'HOLD!', patternId: 'hold', baseDuration: 6000, minDuration: 4200,
  setup(root, rng, difficulty, finish, options = {}) {
    const game = session(root, rng, pick(rng, ['Latch Club', 'Velvet Subscription', 'Monthly Marble']), difficulty);
    const required = Math.max(1400, 2100 - (difficulty - 1) * 60) * (options.relaxed ? 1.75 : 1);
    heading(game.content, 'Leaving so soon?', 'Keep holding Cancel. Releasing starts over.');
    const hold = button(game, game.content, 'Hold to cancel', () => {}, 'site-primary hold-button', 'hold');
    const meter = element('progress', '', 'hold-progress'); meter.max = required; meter.value = 0;
    const status = element('p', 'Press and keep holding.', 'smallprint');
    const offer = element('div', '', 'retention-offer'); offer.hidden = true;
    offer.append(element('strong', pick(rng, ['Wait! Half price for a month.', 'A free upgrade, just for you.', 'Stay and collect bonus credits.'])));
    button(game, offer, 'Take the offer', () => finish(false), '', 'retain');
    game.content.append(meter, status, offer);
    let pointer = null, held = 0, previous = null, done = false;
    const reset = () => { pointer = null; held = 0; meter.value = 0; offer.hidden = true; status.textContent = 'Released. Hold again to cancel.'; };
    game.onCancel(reset);
    game.on(hold, 'pointerdown', event => {
      if (pointer !== null || done || event.button !== 0) return;
      event.preventDefault(); pointer = event.pointerId;
      if (event.isTrusted) hold.setPointerCapture(pointer);
      status.textContent = 'Keep holding…';
    });
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) game.on(hold, name, event => {
      if (event.pointerId === pointer && !done) reset();
    });
    return { ...game, update(remaining) {
      const elapsed = previous === null ? 0 : Math.max(0, previous - remaining); previous = remaining;
      if (pointer === null || done) return;
      held += elapsed; meter.value = held; offer.hidden = held < required * 0.4;
      if (held >= required) { done = true; status.textContent = 'Subscription cancelled.'; finish(true); }
    } };
  },
};
