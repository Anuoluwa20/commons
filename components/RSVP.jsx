'use client';
/* RSVP: 2 short steps, then a ticket. Talks to /api/rsvp (or the preview store). */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { EVENT } from '@/lib/data';
import { submitRSVP, getCounts } from '@/lib/client-api';
import { icsHref, gcalHref, eventUrl, shareText } from '@/lib/calendar';
import { useToast, copyText } from './Toast';
import { useMotion, useMounted } from './Motion';
import { Field, checkAll, Honeypot } from './Field';
import { Arrow, Close, Cal, Share } from './Icons';

const Ctx = createContext(null);
export const useRSVP = () => useContext(Ctx);

const SEAT_KEY = 'commons-seat';

export function RSVPProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState({ capacity: EVENT.capacity, taken: EVENT.taken, spotsLeft: EVENT.capacity - EVENT.taken });
  const [mySeat, setMySeat] = useState(null); // { name, seat }
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(SEAT_KEY) || 'null'); if (s?.name) setMySeat(s); } catch {
      try { const n = localStorage.getItem(SEAT_KEY); if (n) setMySeat({ name: n }); } catch {}
    }
    getCounts().then(c => c && setCounts(c));
    if (location.hash === '#rsvp') setTimeout(() => setOpen(true), 300);
  }, []);
  const openRSVP = useCallback(e => { e?.preventDefault?.(); setOpen(true); }, []);
  const claim = useCallback(r => {
    setCounts({ capacity: r.capacity, taken: r.taken, spotsLeft: r.spotsLeft });
    if (r.seat) { const s = { name: r.name, seat: r.seat }; setMySeat(s); try { localStorage.setItem(SEAT_KEY, JSON.stringify(s)); } catch {} }
  }, []);
  return (
    <Ctx.Provider value={{ open, setOpen, openRSVP, counts, mySeat, claim }}>
      {children}
      <RSVPDialog />
    </Ctx.Provider>
  );
}

export function RSVPLink({ children, className = 'btn', ...rest }) {
  const { openRSVP } = useRSVP();
  return <a className={className} href="#rsvp" onClick={openRSVP} {...rest}>{children}</a>;
}

export const Spots = () => { const { counts } = useRSVP(); return counts.spotsLeft > 0 ? `${counts.spotsLeft} spots left` : 'Waitlist open'; };

function confetti() {
  const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
  const colors = ['#FF5B1F', '#F2F2EF', '#FF8A5C', '#6E6E69', '#FF5B1F'];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('i');
    p.style.cssText = `--x:${Math.random() * 100}vw;--dx:${(Math.random() - 0.5) * 160}px;--rot:${Math.random() * 720 - 360}deg;--d:${1100 + Math.random() * 900}ms;--delay:${Math.random() * 200}ms;--c:${colors[i % colors.length]}`;
    if (i % 3 === 0) p.style.borderRadius = '50%';
    box.append(p);
  }
  document.body.append(box); setTimeout(() => box.remove(), 2600);
}

const ROLES = [['design', 'Design'], ['code', 'Code'], ['found', 'Build a company'], ['create', 'Make creative work'], ['study', 'Study']];

function RSVPDialog() {
  const { open, setOpen, claim } = useRSVP();
  const { on } = useMotion();
  const toast = useToast();
  const mounted = useMounted();
  const dlg = useRef(null), form = useRef(null), opener = useRef(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const setError = (k, m) => setErrors(e => ({ ...e, [k]: m }));

  useEffect(() => {
    const d = dlg.current; if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement;
      d.showModal ? d.showModal() : d.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
      setStep(0); setErrors({});
      setTimeout(() => d.querySelector('#rsvp-name')?.focus(), 60);
    } else if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = dlg.current?.querySelectorAll('.step')[step]?.querySelector('h2');
    if (step > 0) h?.focus({ preventScroll: true });
    dlg.current?.querySelector('.rsvp__panel')?.scrollTo?.(0, 0);
  }, [step, open]);

  const onClose = () => {
    document.body.style.overflow = '';
    if (step === 2) { form.current?.reset(); setResult(null); setStep(0); }
    setOpen(false);
    opener.current?.focus?.();
    if (location.hash === '#rsvp') history.replaceState(null, '', location.pathname + location.search);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const steps = form.current.querySelectorAll('.step');
    if (step === 0) {
      const { ok, errors: errs } = checkAll(steps[0]);
      setErrors(errs);
      if (ok) setStep(1);
      return;
    }
    if (step !== 1) return;
    const fd = Object.fromEntries(new FormData(form.current));
    setBusy(true);
    const r = await submitRSVP({ ...fd, event: EVENT.no });
    setBusy(false);
    if (!r.ok) {
      if (r.fields) { setErrors(r.fields); setStep(0); }
      toast(r.error || 'That didn’t go through. Try again.');
      return;
    }
    claim(r);
    setResult(r);
    setStep(2);
    if (on) confetti();
  };

  const first = (result?.name || '').trim().split(/\s+/)[0] || 'friend';
  const shareGoing = async () => {
    const data = { title: EVENT.title, text: shareText(first), url: eventUrl() };
    if (navigator.share) { try { await navigator.share(data); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copyText(eventUrl(), toast);
  };
  const waitlist = result?.status === 'waitlist';
  const title = !result ? 'You’re in.' : waitlist ? `You’re on the waitlist, ${first}.` : result.status === 'existing' ? `You already have a seat, ${first}.` : `You’re in, ${first}.`;
  const sub = waitlist
    ? `You’re number ${result.position} in line. If a seat frees up we’ll email you straight away.`
    : result?.status === 'existing' ? 'Same email, same seat. We’ve kept it for you.' : 'Your ticket is on its way to your inbox. Bring yourself, we’ll bring the drinks.';

  return (
    <dialog className="rsvp" id="rsvp" aria-labelledby="rsvp-title" ref={dlg} onClose={onClose} onClick={e => { if (e.target === dlg.current) setOpen(false); }}>
      <div className="rsvp__panel">
        <button className="rsvp__close" type="button" onClick={() => setOpen(false)} aria-label="Close RSVP"><Close /></button>
        <div className="rsvp__event"><span className="mini" aria-hidden="true">#{EVENT.no}</span><div><b>{EVENT.short}</b><span>{EVENT.dateShort} · {EVENT.time} · {EVENT.venue}</span></div></div>
        <div className="progress" aria-hidden="true">{[0, 1, 2].map(n => <i key={n} className={n <= step ? 'is-done' : ''} />)}</div>
        <form noValidate ref={form} onSubmit={onSubmit}>
          <Honeypot />
          <section className={`step${step === 0 ? ' is-active' : ''}`} aria-labelledby="rsvp-title">
            <h2 id="rsvp-title" tabIndex={-1}>Save your seat</h2>
            <p className="step__sub">Free. Takes about 20 seconds. Step 1 of 2.</p>
            <Field id="rsvp-name" name="name" label="Your name" autoComplete="name" autoCapitalize="words" spellCheck="false" required data-req="Add your name so we can make your badge." error={errors.name} setError={setError} />
            <Field id="rsvp-email" name="email" type="email" inputMode="email" label="Email" autoComplete="email" spellCheck="false" required data-req="Add your email so we can send your ticket." hint="Your ticket and a reminder go here. Nothing else unless you ask." error={errors.email} setError={setError} />
            <div className="step__actions"><button className="btn" type="submit">Continue <Arrow /></button></div>
          </section>
          <section className={`step${step === 1 ? ' is-active' : ''}`} aria-labelledby="rsvp-step2">
            <h2 id="rsvp-step2" tabIndex={-1}>One quick thing</h2>
            <p className="step__sub">Helps us mix the room. Step 2 of 2.</p>
            <fieldset className="field"><legend>I mostly…</legend><div className="pills">
              {ROLES.map(([v, l]) => <label key={v}><input type="radio" name="role" value={v} /><span>{l}</span></label>)}
            </div><span className="hint">Optional</span></fieldset>
            <label className="check"><input type="checkbox" name="first" value="yes" /><span>This is my first Commons</span></label>
            <label className="check"><input type="checkbox" name="list" value="yes" defaultChecked /><span>Tell me about future events (monthly, unsubscribe anytime)</span></label>
            <div className="step__actions"><button className="btn btn--ghost" type="button" onClick={() => setStep(0)}>Back</button><button className="btn" type="submit" disabled={busy}>{busy ? 'Saving your seat…' : 'Confirm my seat'}</button></div>
          </section>
          <section className={`step${step === 2 ? ' is-active' : ''}`} aria-labelledby="rsvp-done" aria-live="polite">
            <h2 id="rsvp-done" tabIndex={-1}>{title}</h2>
            <p className="step__sub">{sub}</p>
            <div className="ticket-slot"><div className="ticket">
              <div className="ticket__head"><div><small>{waitlist ? 'Waitlist' : 'Admit one'}</small><b>{EVENT.short}</b></div><span className="ticket__no">#{EVENT.no}</span></div>
              <div className="ticket__perf" aria-hidden="true"></div>
              <div className="ticket__body">
                <div className="full"><small>Guest</small><b>{result?.name || 'Guest'}</b></div>
                <div><small>When</small><b>{EVENT.dateShort}<br />Doors {EVENT.doors}</b></div>
                <div><small>Where</small><b>{EVENT.venue}<br />{EVENT.address}</b></div>
                <div className="full"><small>{waitlist ? 'Place in line' : 'Seat'}</small><b>{waitlist ? `No. ${result.position}` : `Seat ${String(result?.seat || 0).padStart(3, '0')}`}</b></div>
              </div>
            </div></div>
            <div className="success-actions">
              <div className="row"><a className="btn btn--dark btn--sm" href={mounted ? icsHref() : '#'} download={`commons-${EVENT.no}.ics`}><Cal /> Add to calendar</a><a className="btn btn--dark btn--sm" href={mounted ? gcalHref() : '#'} target="_blank" rel="noopener"><Cal /> Google</a></div>
              <button className="btn btn--block" type="button" onClick={shareGoing}><Share /> Bring a friend</button>
              <button className="btn btn--ghost btn--block" type="button" onClick={() => setOpen(false)}>Done</button>
            </div>
          </section>
        </form>
      </div>
    </dialog>
  );
}
