'use client';
/* Commons motion layer as React. Content is fully visible at rest; motion arms only when
   the visitor allows it (no reduced-motion setting, not paused from the footer toggle). */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const MotionCtx = createContext({ on: false, paused: false, toggle: () => {} });
export const useMotion = () => useContext(MotionCtx);

export function MotionProvider({ children }) {
  const [reduce, setReduce] = useState(true);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    try { setPaused(localStorage.getItem('commons-motion') === 'paused'); } catch {}
    const fn = () => setReduce(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  const on = !reduce && !paused;
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('js-off');
    root.classList.toggle('motion-paused', paused);
    root.classList.toggle('m-on', on);
    root.classList.toggle('intro-anim', on);
  }, [on, paused]);
  const toggle = useCallback(() => setPaused(p => {
    try { localStorage.setItem('commons-motion', p ? 'on' : 'paused'); } catch {}
    return !p;
  }), []);
  return <MotionCtx.Provider value={{ on, paused, toggle }}>{children}</MotionCtx.Provider>;
}

/* One observer per page: adds .in when entrance elements scroll into view. */
const ENTER = '.h2, .m-seats, .m-agenda, .vb-sp, .m-wipe, .reveal, .vd-finale';
export function MotionRoot() {
  const { on } = useMotion();
  const path = usePathname();
  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    const els = [...main.querySelectorAll(ENTER)];
    main.querySelectorAll('.h2').forEach(h => h.classList.add('m-mask'));
    if (!on || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    els.forEach(e => e.classList.remove('in'));
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
    }), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [on, path]);
  return null;
}

/* Shared scroll/resize frame loop. */
const subs = new Set();
let ticking = false;
const runAll = () => { ticking = false; subs.forEach(fn => fn()); };
const kick = () => { if (!ticking) { ticking = true; requestAnimationFrame(runAll); } };
export function useScrollFrame(fn, on) {
  const ref = useRef(fn); ref.current = fn;
  useEffect(() => {
    const f = () => ref.current();
    subs.add(f);
    if (subs.size === 1) { addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick); }
    f();
    return () => { subs.delete(f); if (!subs.size) { removeEventListener('scroll', kick); removeEventListener('resize', kick); } };
  }, [on]);
}
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* Hero photo: slow parallax. */
export function HeroPhoto({ src, className = '' }) {
  const { on } = useMotion();
  const img = useRef(null);
  useScrollFrame(() => {
    const el = img.current; if (!el) return;
    if (!on) { el.style.translate = ''; return; }
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom > 0) el.style.translate = `0 ${Math.round(-r.top * 0.22)}px`;
  }, on);
  return <div className={`vd-hero__photo photo ${className}`}><img ref={img} src={src} alt="" fetchPriority="high" /></div>;
}

/* "The room grows": a photo that opens to full bleed as you scroll. */
export function ScrollGrow({ src, alt, caption, style, label }) {
  const { on } = useMotion();
  const fig = useRef(null);
  useScrollFrame(() => {
    const f = fig.current; if (!f) return;
    const im = f.querySelector('img');
    if (!on) { f.style.clipPath = ''; im.style.transform = ''; return; }
    const vh = innerHeight, r = f.getBoundingClientRect();
    const p = clamp((vh - r.top) / (vh * 0.9));
    const g = Math.min(48, Math.max(16, innerWidth * 0.04)); // matches --gutter
    const content = Math.min(innerWidth - 2 * g, 1200 - 2 * g); // matches .wrap
    const side = ((innerWidth - content) / 2) * (1 - p);
    f.style.clipPath = `inset(${Math.round(28 * (1 - p))}px ${Math.round(side)}px round ${Math.round(28 * (1 - p))}px)`;
    im.style.transform = `scale(${(1.14 - 0.14 * p).toFixed(3)})`;
  }, on);
  return (
    <section className="vd-grow" style={style} aria-label={label}>
      <figure className="vd-grow__fig" ref={fig}>
        <img src={src} alt={alt} loading="lazy" />
        <figcaption className="mono">{caption}</figcaption>
      </figure>
    </section>
  );
}

/* "No. [photo] 24": the strip opens from a pill as it scrolls in. */
export function SplitStrip({ src, left = 'No.', right = '24' }) {
  const { on } = useMotion();
  const strip = useRef(null);
  useScrollFrame(() => {
    const s = strip.current; if (!s) return;
    const im = s.querySelector('img');
    if (!on) { s.style.clipPath = ''; im.style.transform = ''; return; }
    const vh = innerHeight, r = s.getBoundingClientRect();
    const p = clamp((vh - r.top) / (vh * 0.75));
    s.style.clipPath = `inset(0 ${(48 * (1 - p)).toFixed(1)}% round 999px)`;
    im.style.transform = `translateX(${(-6 + 12 * p).toFixed(2)}%) scale(1.15)`;
  }, on);
  return (
    <section className="vc-split" aria-hidden="true" style={{ paddingTop: 0 }}>
      <div className="wrap vc-split__row"><span>{left}</span><div className="photo vc-split__strip" ref={strip}><img src={src} alt="" loading="lazy" /></div><span>{right}</span></div>
    </section>
  );
}

/* Rotating word inside a heading. Screen readers get the first word only. */
export function RotatingWord({ words }) {
  const { on } = useMotion();
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (!on) { setI(0); return; }
    let t;
    const id = setInterval(() => { setOut(true); t = setTimeout(() => { setI(n => (n + 1) % words.length); setOut(false); }, 250); }, 2200);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [on, words.length]);
  return <><span className={`rot${out ? ' out' : ''}`} aria-hidden="true">{words[i]}</span><span className="sr-only">{words[0]}</span></>;
}

/* Statement whose words light up as it scrolls through the viewport.
   parts: strings, { dim: string }, or { rotate: [...] } */
export function WordsReveal({ parts, id, className = '' }) {
  const { on } = useMotion();
  const ref = useRef(null);
  const [lit, setLit] = useState(Infinity);
  const tokens = [];
  parts.forEach((p, pi) => {
    if (typeof p === 'object' && p.rotate) { tokens.push({ rotate: p.rotate, key: `r${pi}` }); return; }
    const text = typeof p === 'string' ? p : p.dim;
    text.split(/(\s+)/).filter(Boolean).forEach((w, wi) => tokens.push({ w, dim: typeof p === 'object', key: `${pi}-${wi}` }));
  });
  const words = tokens.filter(t => t.rotate || !/^\s+$/.test(t.w)).length;
  useScrollFrame(() => {
    const h = ref.current; if (!h) return;
    if (!on) { setLit(Infinity); return; }
    const vh = innerHeight, r = h.getBoundingClientRect();
    setLit(Math.round(clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3)) * words));
  }, on);
  let n = 0;
  const render = list => list.map(t => {
    if (!t.rotate && /^\s+$/.test(t.w)) return t.w;
    const cls = `w${n++ < lit ? ' lit' : ''}`;
    return t.rotate ? <span key={t.key} className={cls}><RotatingWord words={t.rotate} /></span> : <span key={t.key} className={cls}>{t.w}</span>;
  });
  const main = tokens.filter(t => !t.dim), dim = tokens.filter(t => t.dim);
  return <h2 id={id} ref={ref} className={`intro__statement m-words ${className}`}>{render(main)}{dim.length > 0 && <span className="dim">{render(dim)}</span>}</h2>;
}

/* Number that counts up when seen. Server and no-motion render the final value. */
export function CountUp({ value, className = '' }) {
  const { on } = useMotion();
  const ref = useRef(null);
  const [n, setN] = useState(value);
  useEffect(() => {
    setN(value);
    if (!on || !ref.current) return;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = t => { const p = Math.min(1, (t - t0) / 1400); setN(Math.round(value * (1 - Math.pow(1 - p, 4)))); if (p < 1) raf = requestAnimationFrame(tick); };
      setN(0); raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [on, value]);
  return <b ref={ref} className={`tnum ${className}`}>{n.toLocaleString('en-GB')}</b>;
}

/* Text that depends on today's date, filled after hydration so server HTML stays stable. */
export function useNow(every = 0) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    if (!every) return;
    const id = setInterval(() => setNow(new Date()), every);
    return () => clearInterval(id);
  }, [every]);
  return now;
}
export function Relative({ start, fallback = 'In 23 days' }) {
  const now = useNow();
  if (!now) return fallback;
  const d = Math.floor((start - now) / 864e5);
  return d > 1 ? `In ${d} days` : d === 1 ? 'Tomorrow' : start > now ? 'Tonight' : 'Past event';
}
export function DaysSince({ from }) {
  const now = useNow();
  const n = now ? Math.floor((now - from) / 864e5) : 670;
  return <CountUp value={n} className="m-count" />;
}

/* True after hydration: use for values that differ between server and browser (full URLs). */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
