/* Preview-only routing: Next.js paths <-> plain #names (the artifact viewer only passes #name). */
export const ROUTES = { '/': 'home', '/events': 'events', '/events/24': 'event', '/speakers': 'speakers', '/about': 'about', '/sponsors': 'sponsors' };
export const NAMES = Object.fromEntries(Object.entries(ROUTES).map(([p, n]) => [n, p]));

let path = '/';
const subs = new Set();
export const getPath = () => path;
export const subscribe = fn => { subs.add(fn); return () => subs.delete(fn); };
export function setPath(p) { if (p !== path) { path = p; subs.forEach(f => f()); } }

/** href "/events#x" -> { path: "/events", anchor: "x" } */
export const split = href => { const [p, a] = href.split('#'); return { path: p || null, anchor: a || null }; };
export const hashFor = p => '#' + (ROUTES[p] || 'home');
