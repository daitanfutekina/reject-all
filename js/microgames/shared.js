import { pick } from '../random.js';

export function session(root, rng, title) {
  const controller = new AbortController();
  root.replaceChildren();
  root.style.setProperty('--site-accent', pick(rng, ['#3459ad', '#795087', '#286960', '#97532c']));
  const bar = document.createElement('div');
  bar.className = 'browser-bar';
  bar.textContent = `${title.toLowerCase().replaceAll(' ', '-')}.example`;
  const content = document.createElement('div');
  content.className = 'site-content';
  root.append(bar, content);
  return {
    content,
    on(node, event, callback) { node.addEventListener(event, callback, { signal: controller.signal }); },
    cleanup() { controller.abort(); root.replaceChildren(); },
  };
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
