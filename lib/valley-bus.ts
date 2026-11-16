/** Tiny channel between the WebGL valley and the rest of the page. */
type Listener = (on: boolean) => void;

let ready = false;
let gatherListener: Listener | null = null;
const readyListeners = new Set<() => void>();

export function markValleyReady() {
  if (ready) return;
  ready = true;
  readyListeners.forEach((fn) => fn());
  readyListeners.clear();
}

export function onValleyReady(fn: () => void) {
  if (ready) fn();
  else readyListeners.add(fn);
  return () => { readyListeners.delete(fn); };
}

export function setGatherListener(fn: Listener | null) {
  gatherListener = fn;
}

export function gatherValley(on: boolean) {
  gatherListener?.(on);
}
