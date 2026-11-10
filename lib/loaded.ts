// One-shot "preloader finished" signal that is safe under React StrictMode
// (effects run twice in dev) and fast-refresh. Late subscribers fire immediately.
let loaded = false;
const subs = new Set<() => void>();

export function markLoaded() {
  if (loaded) return;
  loaded = true;
  subs.forEach((f) => f());
  subs.clear();
}

export function isLoaded() {
  return loaded;
}

/** Subscribe; returns an unsubscribe function (use it as effect cleanup). */
export function onLoaded(cb: () => void) {
  if (loaded) {
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}
