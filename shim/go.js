import { flushSync } from 'react-dom';
import { ROUTES, NAMES, setPath, getPath } from './routes';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('motion-paused');
const scrollToAnchor = a => {
  const el = a && document.getElementById(a);
  if (!el) return false;
  el.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' });
  if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return true;
};

/** Navigate to a Next.js-style path (and optional in-page anchor), with a view transition. */
export function go(path, anchor, { push = true } = {}) {
  if (path === getPath()) { if (anchor) scrollToAnchor(anchor); else scrollTo({ top: 0, behavior: reduce() ? 'auto' : 'smooth' }); return; }
  const swap = () => { flushSync(() => setPath(path)); scrollTo(0, 0); if (anchor) requestAnimationFrame(() => scrollToAnchor(anchor)); };
  if (push) history.pushState(null, '', '#' + ROUTES[path]);
  if (document.startViewTransition && !reduce()) { const vt = document.startViewTransition(swap); vt.ready.catch(() => {}); vt.finished.catch(() => {}); } else swap();
  const main = document.getElementById('main'); main?.setAttribute('tabindex', '-1');
  setTimeout(() => !anchor && document.getElementById('main')?.focus({ preventScroll: true }), 50);
}

/** Read location.hash: a route name, "rsvp", or an in-page anchor. */
export function fromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (!h) return go('/', null, { push: false });
  if (NAMES[h]) return go(NAMES[h], null, { push: false });
  if (h === 'rsvp') return; // the RSVP provider opens the dialog
  scrollToAnchor(h);
}
