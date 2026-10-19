import { drag } from './shared.js';

// A round may receive an extra click after pointerup; resolve it only once.
export function verdict(finish) {
  let done = false;
  return won => { if (!done) { done = true; finish(won); } };
}

export function contains(node, event) {
  const rect = node.getBoundingClientRect();
  return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
}

// Commit gestures on release, never while a finger is still touching the screen.
export function flick(game, node, commit) {
  drag(game, node, (dx, dy) => { node.style.transform = `translate(${dx}px, ${dy}px)`; }, (dx, dy, event, cancelled) => {
    node.style.transform = '';
    if (!cancelled) commit(dx, dy, event);
  });
}
