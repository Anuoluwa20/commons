'use client';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { UPCOMING, PAST_EVENTS } from '@/lib/data';
import { EventCard } from '../Sections';
import { useMotion } from '../Motion';

const FILTERS = [['all', 'All'], ['Talk', 'Talks', 'var(--talk)'], ['Workshop', 'Workshops', 'var(--workshop)'], ['Social', 'Socials', 'var(--social)']];

export default function Events() {
  const [f, setF] = useState('all');
  const { on } = useMotion();
  const pick = v => {
    const apply = () => flushSync(() => setF(v));
    if (document.startViewTransition && on) { const vt = document.startViewTransition(apply); vt.ready.catch(() => {}); vt.finished.catch(() => {}); } else apply();
  };
  const show = e => f === 'all' || e.type === f;
  const up = UPCOMING.filter(show), past = PAST_EVENTS.filter(show);
  const n = up.length + past.length;
  return (
    <main id="main">
      <section className="page-head"><div className="wrap">
        <span className="eyebrow">23 nights and counting</span>
        <h1>Events</h1>
        <p className="lead">Talks to sharpen your thinking, workshops to get your hands dirty, socials to meet the people behind the work. All free.</p>
      </div></section>
      <section style={{ paddingBottom: 'var(--section)' }}><div className="wrap">
        <div className="filters" role="group" aria-label="Filter events by type">
          {FILTERS.map(([v, l, c]) => <button key={v} type="button" aria-pressed={f === v} style={c ? { '--c': c } : undefined} onClick={() => pick(v)}>{c && <i></i>}{l}</button>)}
        </div>
        <p className="filter-status" role="status">Showing {f === 'all' ? `all ${n}` : n} {f === 'all' ? '' : f.toLowerCase() + ' '}event{n === 1 ? '' : 's'}</p>
        {up.length > 0 && <div className="group"><h2>Upcoming <small>RSVP opens about 5 weeks before</small></h2><div className="events">{up.map((e, i) => <EventCard key={e.no} e={e} i={i} />)}</div></div>}
        {past.length > 0 && <div className="group"><h2>Past <small>Recaps, photos and slides</small></h2><div className="events">{past.map((e, i) => <EventCard key={e.no} e={e} i={i % 3} past />)}</div></div>}
      </div></section>
    </main>
  );
}
