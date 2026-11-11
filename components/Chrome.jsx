'use client';
/* Site chrome: header (hides on scroll down), mobile menu, sticky RSVP bar, footer with motion toggle. */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EVENT } from '@/lib/data';
import { RSVPLink, Spots } from './RSVP';
import { useMotion } from './Motion';
import { Logo, Arrow, Close, Menu, Pause, Play } from './Icons';

export const NAV = [['/', 'Home'], ['/events', 'Events'], ['/speakers', 'Speakers'], ['/about', 'About'], ['/sponsors', 'Sponsors']];
const current = (path, href) => href === '/' ? path === '/' : path === href || (href === '/events' && path.startsWith('/events'));

function NavList({ path, onPick }) {
  return <ul>{NAV.map(([h, t]) => <li key={h}><Link href={h} onClick={onPick} aria-current={current(path, h) ? 'page' : undefined}>{t}</Link></li>)}</ul>;
}

export function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef(null), closeBtn = useRef(null);
  useEffect(() => {
    let last = scrollY, tick = false;
    const run = () => { const y = scrollY; setScrolled(y > 8); setHidden(y > 320 && y > last); last = y; tick = false; };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(run); } };
    addEventListener('scroll', on, { passive: true }); run();
    return () => removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.current?.focus();
  }, [open]);
  useEffect(() => setOpen(false), [path]);
  const close = (focus = true) => { setOpen(false); if (focus) menuBtn.current?.focus(); };

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
        <div className="wrap">
          <Link className="brand" href="/" aria-label="Commons home"><Logo /><span>commons</span></Link>
          <nav className="nav" aria-label="Main"><NavList path={path} /></nav>
          <div className="header-actions">
            <RSVPLink className="btn btn--sm">RSVP <span className="sr-only">to Commons #{EVENT.no}</span></RSVPLink>
            <button ref={menuBtn} className="menu-btn" type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button>
          </div>
        </div>
      </header>
      <div className={`mobile-nav${open ? ' is-open' : ''}`} id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" inert={!open ? true : undefined} onKeyDown={e => e.key === 'Escape' && close()}>
        <div className="mobile-nav__top"><Link className="brand" href="/" onClick={() => close(false)}><Logo /><span>commons</span></Link><button ref={closeBtn} className="menu-btn" type="button" aria-label="Close menu" onClick={() => close()}><Close /></button></div>
        <nav aria-label="Mobile"><NavList path={path} onPick={() => close(false)} /></nav>
        <RSVPLink className="btn btn--block" onClickCapture={() => close(false)}>Save my seat at #{EVENT.no} <Arrow /></RSVPLink>
      </div>
    </>
  );
}

export function StickyRSVP() {
  const [show, setShow] = useState(false);
  const path = usePathname();
  useEffect(() => {
    let tick = false;
    const run = () => {
      tick = false;
      const hero = document.querySelector('.hero');
      const past = hero ? hero.getBoundingClientRect().bottom < 80 : scrollY > 500;
      const join = document.querySelector('#join')?.getBoundingClientRect();
      const footer = document.querySelector('.site-footer')?.getBoundingClientRect().top < innerHeight;
      setShow(past && !footer && !(join && join.top < innerHeight && join.bottom > 0));
    };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(run); } };
    addEventListener('scroll', on, { passive: true }); run();
    return () => removeEventListener('scroll', on);
  }, [path]);
  return (
    <aside className={`sticky-rsvp${show ? ' is-visible' : ''}`} aria-label="Quick RSVP">
      <div className="sticky-rsvp__text"><b>#{EVENT.no} · {EVENT.short}</b><span>{EVENT.dateShort} · <Spots /></span></div>
      <RSVPLink className="btn btn--sm">RSVP</RSVPLink>
    </aside>
  );
}

export function Footer() {
  const { paused, toggle } = useMotion();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div><Link className="brand" href="/"><Logo /><span>commons</span></Link><p>Where the city’s builders meet. A monthly night of talks, workshops and good company for designers, developers, founders and creatives.</p></div>
          <div><h2 className="fh">Show up</h2><ul><li><Link href="/events/24">Next event</Link></li><li><Link href="/events">All events</Link></li><li><Link href="/#join">Join the list</Link></li></ul></div>
          <div><h2 className="fh">Get involved</h2><ul><li><Link href="/speakers#speak">Become a speaker</Link></li><li><Link href="/sponsors">Sponsor Commons</Link></li><li><Link href="/about">Our story</Link></li></ul></div>
          <div><h2 className="fh">Elsewhere</h2><ul><li><a href="#" rel="noopener">Instagram</a></li><li><a href="#" rel="noopener">X</a></li><li><a href="#" rel="noopener">LinkedIn</a></li><li><a href="#" rel="noopener">WhatsApp community</a></li></ul></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Commons · <Link href="/about#conduct">Code of conduct</Link></span>
          <button className="motion-toggle" type="button" aria-pressed={paused} onClick={toggle}>{paused ? <Play /> : <Pause />}<span>{paused ? 'Play motion' : 'Pause motion'}</span></button>
        </div>
      </div>
    </footer>
  );
}
