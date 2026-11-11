'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useMotion, useScrollFrame } from './Motion';
import { SPEAKERS, AGENDA, GALLERY, QUOTES, FAQ, FACES, EVENT, img } from '@/lib/data';
import { useRSVP, RSVPLink, Spots } from './RSVP';
import { JoinForm } from './Forms';
import { Arrow, Plus } from './Icons';

export const Eyebrow = ({ children }) => <p className="eyebrow">{children}</p>;

export const Face = ({ s }) => <span className="chip-face"><img src={img(s.photo)} alt="" /></span>;

export function SpeakerCard({ s, i, slot }) {
  return (
    <article className="vb-sp" style={{ '--i': i % 4 }}>
      <div className="vb-sp__img"><div className="vb-sp__photo"><img src={img(s.photo)} alt={`Portrait of ${s.name}`} loading="lazy" /></div></div>
      <p className="mono vb-sp__slot">{slot ?? `${String(i + 1).padStart(2, '0')} · ${s.slot}`}</p>
      <h3>{s.name}</h3>
      <p className="vb-sp__role">{s.role}</p>
      <p className="vd-talk">{s.talk}</p>
    </article>
  );
}
export const Speakers = () => <div className="vb-speakers">{SPEAKERS.map((s, i) => <SpeakerCard key={s.slug} s={s} i={i} />)}</div>;

/* The evening drawn to scale: every block is as long as the session really is.
   As you scroll, a playhead runs from doors to home time and fills each block. */
const toMin = t => { const [h, m] = t.split(':').map(Number); return (h - 6) * 60 + m; };
const END = '9:30';
const KIND = ['doors', 'talk', 'talk', 'panel', 'social'];
const LABEL = ['Doors', 'Talk 1', 'Talk 2', 'Panel', 'Networking'];

export function Agenda({ long = false }) {
  const { on } = useMotion();
  const root = useRef(null);
  const [now, setNow] = useState(-1);
  const [clock, setClock] = useState('6:00');
  const total = toMin(END);
  const segs = AGENDA.map((a, i) => {
    const start = toMin(a.t), stop = i < AGENDA.length - 1 ? toMin(AGENDA[i + 1].t) : total;
    return { ...a, start, dur: stop - start, type: KIND[i], label: LABEL[i] };
  });
  useScrollFrame(() => {
    const el = root.current; if (!el) return;
    const items = el.querySelectorAll('.seg');
    if (!on) { el.style.removeProperty('--p'); items.forEach(li => li.style.removeProperty('--f')); setNow(-1); return; }
    const r = el.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.25)));
    const m = p * total;
    el.style.setProperty('--p', p.toFixed(4));
    let cur = -1;
    segs.forEach((sg, i) => {
      const f = Math.min(1, Math.max(0, (m - sg.start) / sg.dur));
      items[i]?.style.setProperty('--f', f.toFixed(3));
      if (m >= sg.start && m < sg.start + sg.dur) cur = i;
    });
    if (p >= 1) cur = segs.length - 1;
    setNow(p > 0 ? cur : -1);
    const mm = Math.round(m / 5) * 5, h = 6 + Math.floor(mm / 60);
    setClock(`${h}:${String(mm % 60).padStart(2, '0')}`);
  }, on);
  return (
    <div className={`run${on ? ' is-live' : ''}`} ref={root}>
      <div className="run__head" aria-hidden="true"><span className="tnum">{clock}</span></div>
      <ol className="run__track" style={{ gridTemplateColumns: segs.map(s => `${s.dur}fr`).join(' ') }}>
        {segs.map((a, i) => {
          const [h, m] = a.t.split(':');
          return (
            <li key={a.t} className={`seg seg--${a.type}${now === i ? ' is-now' : ''}`} style={{ '--d': a.dur }}>
              <p className="seg__t"><time dateTime={`2026-12-04T${+h + 12}:${m}`}>{a.t}</time><span>{a.dur} min</span></p>
              <div className="seg__bar" aria-hidden="true"><i /></div>
              <div className="seg__body">
                <p className="seg__kind">{a.label}</p>
                <h3>{a.title}</h3>
                {(long || !a.who.length) && <p className="seg__desc">{long ? a.long.replace(/^[^·]+· /, '') : a.kind}</p>}
                {a.who.length > 0 && (
                  <div className="seg__who">
                    <span className="seg__faces" aria-hidden="true">{a.who.map(j => <img key={j} src={img(SPEAKERS[j].photo)} alt="" loading="lazy" />)}</span>
                    <span>{a.who.map(j => SPEAKERS[j].name.split(' ')[0]).join(', ')}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="run__end"><time dateTime="2026-12-04T21:30">{END}</time> Home time</p>
    </div>
  );
}

const initials = n => { const p = n.trim().split(/\s+/); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase(); };

export function RoundTable() {
  const { mySeat, counts } = useRSVP();
  const angles = [-90, -30, 30, 90];
  const open = Math.max(0, counts.spotsLeft - (mySeat ? 0 : 1));
  return (
    <div className="vd-round m-seats" role="img" aria-label={`A round table with this month’s four speakers, ${mySeat ? `your seat, ${mySeat.name.split(' ')[0]}` : 'your seat'}, and ${open} more open seats`}>
      <div className="vd-round__ring"></div>
      <div className="vd-round__top"><b>#{EVENT.no}</b><span>{EVENT.dateShort}</span></div>
      <ul className="vd-round__seats">
        {SPEAKERS.map((s, i) => (
          <li key={s.slug} className="vd-seat" style={{ '--a': `${angles[i]}deg`, '--i': i }}><div className="vd-seat__in"><div className="vd-seat__img"><img src={img(s.photo)} alt="" loading="lazy" /></div><span>{s.name.split(' ')[0]}</span></div></li>
        ))}
        <li className={`vd-seat vd-seat--you${mySeat ? ' vd-seat--filled' : ''}`} style={{ '--a': '150deg', '--i': 4 }}>
          <div className="vd-seat__in"><div className="vd-seat__img vd-seat__img--you"><b>{mySeat ? initials(mySeat.name) : 'You'}</b></div><span>{mySeat ? mySeat.name.split(' ')[0] : 'Your seat'}</span></div>
        </li>
        <li className="vd-seat vd-seat--open" style={{ '--a': '210deg', '--i': 5 }} aria-hidden="true"><div className="vd-seat__in"><div className="vd-seat__img vd-seat__img--open">+{open}</div><span>more seats</span></div></li>
      </ul>
    </div>
  );
}

export function Gallery() {
  return <div className="vd-gallery">{GALLERY.map((g, i) => <figure key={g.src} className={`${g.cls} m-wipe`} style={{ '--i': i % 3 }}><img src={img(g.src)} alt={g.alt} loading="lazy" /><figcaption className="mono">{g.cap}</figcaption></figure>)}</div>;
}

export function Quotes() {
  return (
    <ol className="qlist">{QUOTES.map((q, i) => (
      <li key={i} className="reveal" style={{ '--i': i }}>
        <blockquote><p>{q.q}</p></blockquote>
        <p className="qlist__by">{q.r}, after #{23 - i} <span>Sample quote, to be replaced</span></p>
      </li>
    ))}</ol>
  );
}

export function Faq() {
  return <div className="faq">{FAQ.map(([q, a], i) => (
    <details key={q} name="faq" open={i === 0}><summary>{q}<span className="plus" aria-hidden="true"><Plus /></span></summary><div className="answer"><p>{a}</p></div></details>
  ))}</div>;
}

export function EventCard({ e, i, past }) {
  const title = `#${e.no} · ${e.title}`;
  return (
    <article className={`ecard reveal${past ? ' ecard--past' : ''}`} style={{ '--i': i }} data-type={e.type}>
      <div className="ecard__top ecard__top--img"><img src={img(e.img)} alt="" loading="lazy" /><span className="ecard__no" data-no={`#${e.no}`} aria-hidden="true"></span><div className="ecard__date"><b>{e.day}</b><small>{e.mon}</small></div></div>
      <div className="ecard__body">
        <span className={`chip chip--${e.type.toLowerCase()}`}><i></i>{e.type}</span>
        <h3>{e.href ? <Link href={e.href}>{title}</Link> : title}</h3>
        <p className="ecard__meta">{e.meta}</p>
        <div className="ecard__foot"><span>{e.foot[0] === 'live' ? <Spots /> : e.foot[0]}</span><span>{e.foot[1]}</span></div>
      </div>
    </article>
  );
}

/* Photo-backed sponsor call, in place of empty logo boxes. */
export function SponsorBanner() {
  return (
    <div className="vd-spb m-wipe">
      <img src={img('gallery-6')} alt="" loading="lazy" />
      <div className="vd-spb__in">
        <p className="mono">Headline sponsor · one per month</p>
        <h3>Put your name on the night 3,200 builders talk about.</h3>
        <Link className="btn btn--sm" href="/sponsors">See packages <Arrow /></Link>
      </div>
    </div>
  );
}

/* The closing scene: full-bleed photo, a big invitation, RSVP + list signup, faces at the table. */
export function Finale({ title = <>There’s a seat<br />with <em>your&nbsp;name</em> on&nbsp;it.</> }) {
  return (
    <section id="join" className="vd-finale" aria-labelledby="fin-title">
      <div className="vd-finale__photo"><img src={img('gallery-5')} alt="" loading="lazy" /></div>
      <div className="wrap vd-finale__inner">
        <Eyebrow>Commons #{EVENT.no} · {EVENT.dateShort} · {EVENT.doors}</Eyebrow>
        <h2 id="fin-title" className="vd-finale__title">{title}</h2>
        <div className="vd-finale__row">
          <div className="vd-finale__act">
            <RSVPLink className="btn vd-finale__btn">Save my seat <Arrow /></RSVPLink>
            <p className="mono"><Spots /> · free, always</p>
          </div>
          <div className="vd-finale__faces">
            <ul aria-hidden="true">{FACES.map((f, n) => <li key={f} style={{ '--n': n }}><img src={img(f)} alt="" loading="lazy" /></li>)}<li className="more" style={{ '--n': FACES.length }}>+3k</li></ul>
            <p><b>3,200 builders</b> already pull up a chair each month.</p>
          </div>
        </div>
        <div className="vd-finale__list">
          <div><h3>Not this month?</h3><p>One email a month: the next event, who’s speaking, and first dibs on seats.</p></div>
          <JoinForm id="fin-email" dark={false} />
        </div>
      </div>
    </section>
  );
}
