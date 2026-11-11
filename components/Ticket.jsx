'use client';
/* The hero ticket is a printed seat map. All 200 seats ring the card: filled dots are
   taken, open circles are free, and the orange one is the next free seat (or yours, once
   you've RSVP'd). A tear-off stub runs down the left edge. */
import { EVENT } from '@/lib/data';
import { START, icsHref, gcalHref, eventUrl, shareLinks, shareText } from '@/lib/calendar';
import { useRSVP, RSVPLink } from './RSVP';
import { useNow, useMounted } from './Motion';
import { useToast, copyText } from './Toast';
import { Arrow } from './Icons';

const p2 = n => String(n).padStart(2, '0');

export function CountdownLine({ className = 'pt__cd' }) {
  const now = useNow(1000);
  let txt = '23d 20h 30m 00s', label = 'Doors in';
  if (now) {
    const diff = Math.max(0, START - now);
    const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    txt = diff > 0 ? `${d}d ${p2(h)}h ${p2(m)}m ${p2(s)}s` : 'Now';
    if (!diff) label = 'Doors are open';
  }
  return (
    <p className={className} role="timer" aria-label={now ? `${label} ${txt}` : undefined}>
      <span>{label}</span><span className="tnum" aria-hidden="true">{txt}</span>
    </p>
  );
}

/* A round table seen from above, with 12 chairs. Each chair stands for about 17 of the
   200 seats: people sit in the taken ones, the orange chair is the next free seat
   (or yours, once you've RSVP'd). */
const CHAIRS = 12;
const OPEN_ORDER = [7, 2, 10, 4, 0, 9, 5, 11, 1, 6, 3, 8]; // which chairs free up first, for a natural scatter
const R = 90;

function Chair({ state, i, label }) {
  const a = (360 / CHAIRS) * i;
  return (
    <g transform={`translate(120 120) rotate(${a}) translate(0 ${-R})`}>
      <g className={`ch ch--${state}`} style={{ '--k': i }}>
        <path className="ch__back" d="M-12 -12 Q0 -19 12 -12" />
        <rect className="ch__seat" x="-11" y="-9" width="22" height="19" rx="5" />
        {state === 'taken' && <g className="ch__person"><rect x="-13.5" y="-10" width="27" height="11" rx="5.5" /><circle cx="0" cy="2.5" r="6" /></g>}
        {state === 'mine' && label && <text className="ch__label" transform={`rotate(${-a})`} y="3.5" textAnchor="middle">{label}</text>}
        {state === 'next' && <rect className="ch__pulse" x="-11" y="-9" width="22" height="19" rx="5" />}
      </g>
    </g>
  );
}

function SeatMap({ taken, capacity, mine, spotsLeft, initials }) {
  const free = Math.max(mine || spotsLeft > 0 ? 1 : 0, Math.round((spotsLeft / capacity) * CHAIRS));
  const open = new Set(OPEN_ORDER.slice(0, free));
  const special = OPEN_ORDER[0];
  const state = i => i === special && (mine || spotsLeft > 0) ? (mine ? 'mine' : 'next') : open.has(i) ? 'open' : 'taken';
  return (
    <div className="pt__map">
      <svg viewBox="0 0 240 240" role="img" aria-label={`A round table: ${taken} of ${capacity} seats taken, ${spotsLeft} open${mine ? `. Yours is seat ${mine}` : ''}`}>
        <circle className="pt__table" cx="120" cy="120" r="58" />
        <circle className="pt__table-rim" cx="120" cy="120" r="51" />
        {Array.from({ length: CHAIRS }, (_, i) => <Chair key={i} i={i} state={state(i)} label={initials} />)}
      </svg>
      <div className="pt__center" aria-hidden="true"><b className="tnum">{spotsLeft}</b><span>seats left<br />of {capacity}</span></div>
    </div>
  );
}

export function HeroTicket({ id, className = '', extras = false }) {
  const { counts, mySeat } = useRSVP();
  const toast = useToast();
  const mounted = useMounted();
  const mine = mySeat?.seat;
  const next = counts.taken + 1;
  const full = counts.spotsLeft <= 0;
  const first = mySeat?.name?.split(/\s+/)[0];

  const share = async () => {
    const data = { title: EVENT.title, text: shareText(), url: eventUrl() };
    if (navigator.share) { try { await navigator.share(data); return; } catch (e) { if (e.name === 'AbortError') return; } }
    copyText(eventUrl(), toast);
  };
  const links = extras && mounted ? shareLinks() : { wa: '#', x: '#', li: '#' };

  const title = mine ? `Seat ${mine} is yours, ${first}.` : full ? 'Every seat is taken.' : `Seat ${next} is still open.`;
  const cta = mine ? 'Save one for a friend' : full ? 'Join the waitlist' : `Take seat ${next}`;

  return (
    <aside className={`pt ${className}`} aria-labelledby={id}>
      <div className="pt__paper">
      <div className="pt__stub" aria-hidden="true">
        <span>Admit one · Commons No. {EVENT.no} · {EVENT.dateMono} · Free entry</span>
      </div>
      <div className="pt__main">
        <div className="pt__top"><span>Commons</span><span>No. {EVENT.no}</span></div>
        <SeatMap taken={counts.taken} capacity={counts.capacity} spotsLeft={counts.spotsLeft} mine={mine} initials={mySeat ? mySeat.name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() : ''} />
        <ul className="pt__key" aria-hidden="true"><li><i className="is-taken" />Taken</li><li><i />Open</li><li><i className="is-mine" />{mine ? 'Yours' : 'Next free'}</li></ul>
        <h2 id={id} className="pt__title">{title}</h2>
        <p className="pt__meta">{EVENT.dateShort} · doors {EVENT.doors}<br />{EVENT.venue}, {EVENT.address}</p>
        <RSVPLink className="pt__btn">{cta} <Arrow /></RSVPLink>
        {extras && (
          <div className="pt__links">
            <p><span>Add to</span><a href={mounted ? icsHref() : '#'} download={`commons-${EVENT.no}.ics`}>Calendar</a><a href={mounted ? gcalHref() : '#'} target="_blank" rel="noopener">Google</a></p>
            <p><span>Share</span>{mounted && typeof navigator !== 'undefined' && navigator.share && <button type="button" onClick={share}>Share</button>}<a href={links.wa} target="_blank" rel="noopener">WhatsApp</a><a href={links.x} target="_blank" rel="noopener">X</a><a href={links.li} target="_blank" rel="noopener">LinkedIn</a><button type="button" onClick={() => copyText(eventUrl(), toast)}>Copy link</button></p>
          </div>
        )}
        <CountdownLine />
      </div>
      </div>
    </aside>
  );
}
