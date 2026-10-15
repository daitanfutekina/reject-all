import { pick } from '../random.js';

export function session(root, rng, title, difficulty = 1) {
  const controller = new AbortController();
  const cancellations = [];
  const cancelInput = () => cancellations.forEach(cancel => cancel());
  root.replaceChildren();
  root.style.setProperty('--site-accent', pick(rng, ['#3459ad', '#795087', '#286960', '#97532c']));
  const bar = document.createElement('div');
  bar.className = 'browser-bar';
  bar.textContent = `${title.toLowerCase().replaceAll(' ', '-')}.example`;
  const content = document.createElement('div');
  content.className = 'site-content';
  content.dataset.skin = pick(rng, ['paper', 'ledger', 'catalogue']);
  content.dataset.layout = pick(rng, difficulty < 3 ? ['left', 'center'] : ['left', 'center', 'inset']);
  root.append(bar, content);
  return {
    content,
    cancelInput,
    onCancel(callback) { cancellations.push(callback); },
    on(node, event, callback) { node.addEventListener(event, callback, { signal: controller.signal }); },
    cleanup() { controller.abort(); cancelInput(); root.replaceChildren(); },
  };
}

// Synthetic events do not own an active browser pointer and cannot capture it.
export function drag(game, node, move, end = () => {}) {
  let start = null;
  game.onCancel(() => {
    if (!start) return;
    const origin = start; start = null;
    end(0, 0, { clientX: origin.x, clientY: origin.y, pointerId: origin.id }, true);
    if (node.hasPointerCapture?.(origin.id)) node.releasePointerCapture(origin.id);
  });
  game.on(node, 'pointerdown', event => {
    if (start || (event.button !== undefined && event.button !== 0)) return;
    if (event.target !== node && event.target.closest?.('button, input, a')) return;
    event.preventDefault(); start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    if (event.isTrusted) node.setPointerCapture(event.pointerId);
  });
  game.on(node, 'pointermove', event => {
    if (start && event.pointerId === start.id) move(event.clientX - start.x, event.clientY - start.y, event);
  });
  const stop = (event, cancelled) => {
    if (!start || event.pointerId !== start.id) return;
    const origin = start; start = null;
    end(event.clientX - origin.x, event.clientY - origin.y, event, cancelled);
    if (node.hasPointerCapture?.(event.pointerId)) node.releasePointerCapture(event.pointerId);
  };
  game.on(node, 'pointerup', event => stop(event, false));
  game.on(node, 'pointercancel', event => stop(event, true));
  game.on(node, 'lostpointercapture', event => stop(event, true));
}

export function element(tag, text, className = '') {
  const node = document.createElement(tag);
  node.textContent = text;
  node.className = className;
  return node;
}

export function button(game, parent, text, action, className = '', id = '') {
  const node = element('button', text, className);
  node.type = 'button';
  if (id) node.dataset.action = id;
  game.on(node, 'click', action);
  parent.append(node);
  return node;
}

export function heading(parent, title, text) {
  parent.append(element('h2', title));
  if (text) parent.append(element('p', text));
}

export function checkbox(game, parent, label, checked, id) {
  const row = element('label', '', 'check-row');
  const input = document.createElement('input');
  input.type = 'checkbox'; input.checked = checked; input.dataset.option = id;
  row.append(input, element('span', label)); parent.append(row);
  return input;
}
