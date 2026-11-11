import Link from 'next/link';
import { SPEAKERS, EVENT, img } from '@/lib/data';
import { START } from '@/lib/calendar';
import { HeroPhoto, Relative } from '../Motion';
import { HeroTicket } from '../Ticket';
import { Eyebrow, Face, Speakers, Agenda, Finale } from '../Sections';
import { Arrow } from '../Icons';

const MAP = (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="800" height="500" fill="#121213" />
    <path d="M0 380 C 160 360 260 420 420 400 S 700 340 800 360 V500 H0z" fill="#0F1A1F" />
    <g fill="#1C1C1E"><rect x="40" y="40" width="150" height="110" rx="14" /><rect x="220" y="40" width="190" height="110" rx="14" /><rect x="40" y="180" width="150" height="140" rx="14" /><rect x="220" y="180" width="110" height="140" rx="14" /><rect x="520" y="40" width="240" height="100" rx="14" /><rect x="520" y="170" width="110" height="120" rx="14" /><rect x="660" y="170" width="100" height="150" rx="14" /></g>
    <rect x="360" y="180" width="130" height="150" rx="14" fill="#3A1A0D" />
    <g stroke="#2A2A2D" strokeWidth="18" fill="none" strokeLinecap="round"><path d="M0 165 H800" /><path d="M205 0 V360" /><path d="M505 0 V340" /><path d="M345 165 V340" /></g>
    <text x="600" y="430" fontFamily="Geist, sans-serif" fontSize="20" fontWeight="600" fill="#5E7F8A">Harbour</text>
    <text x="214" y="158" fontFamily="Geist Mono, monospace" fontSize="13" fontWeight="500" fill="#6E6E69">HARBOUR ROAD</text>
  </svg>
);

export default function Event() {
  const [A, D] = SPEAKERS;
  return (
    <main id="main" className="vd">
      <section className="vd-hero ev-hero hero" aria-labelledby="ev-title">
        <HeroPhoto src={img('gallery-2')} className="ev-hero__photo" />
        <div className="wrap vd-hero__grid">
          <div className="vd-hero__text">
            <nav className="mono ev-crumb" aria-label="Breadcrumb"><Link href="/events">Events</Link> / Commons #{EVENT.no}</nav>
            <Eyebrow>Talks and a panel · <Relative start={START} /></Eyebrow>
            <h1 id="ev-title">
              <span className="line" style={{ '--l': 0 }}><span>Design <Face s={A} /> in the</span></span>
              <span className="line" style={{ '--l': 1 }}><span>age <Face s={D} /> of <em>AI</em></span></span>
            </h1>
            <p className="lead ev-lead">Two talks, one panel and a room full of people working out what good design means when the tools can design too. Bring questions, leave with new friends.</p>
            <dl className="vb-facts">
              <div><dt>When</dt><dd>{EVENT.dateLong}<br /><span>{EVENT.time}</span></dd></div>
              <div><dt>Where</dt><dd>{EVENT.venue}<br /><span>{EVENT.address}</span><a className="mono ev-there" href="#venue">Getting there ↓</a></dd></div>
            </dl>
          </div>
          <HeroTicket id="ev-ticket-title" className="ev-ticket" extras />
        </div>
      </section>

      <section className="section" aria-labelledby="ev-doors">
        <div className="wrap ev-doors">
          <figure className="m-wipe ev-doors__img"><img src={img('gallery-7')} alt="Hosts welcoming people at the check-in table outside the venue" loading="lazy" /><figcaption className="mono">Doors at 6</figcaption></figure>
          <div className="section-head" style={{ margin: 0 }}>
            <Eyebrow>When you arrive</Eyebrow>
            <h2 id="ev-doors" className="h2">Coming alone? <span className="dim">Most people do.</span></h2>
            <p className="lead">Give your name at the door and a host will walk you in, get you a drink and introduce you to someone. No badges, no awkward standing at the back.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="ev-ag">
        <div className="wrap">
          <div className="section-head"><Eyebrow>{EVENT.dateLong}</Eyebrow><h2 id="ev-ag" className="h2">The evening, <span className="dim">to scale</span></h2></div>
          <Agenda long />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="ev-sp">
        <div className="wrap">
          <div className="section-head"><Eyebrow>At the table</Eyebrow><h2 id="ev-sp" className="h2">Speakers</h2></div>
          <Speakers />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} id="venue" aria-labelledby="venue-title">
        <div className="wrap venue">
          <div className="map m-wipe">{MAP}<div className="map__pin"><b>{EVENT.venue}</b><i></i></div></div>
          <div>
            <Eyebrow>Venue</Eyebrow>
            <h2 id="venue-title" className="h2" style={{ marginTop: 'var(--space-4)' }}>{EVENT.venue}</h2>
            <p className="lead" style={{ marginTop: 'var(--space-3)' }}>{EVENT.address}. Look for the orange door on the harbour side.</p>
            <ul><li>Step-free entrance and accessible toilet</li><li>Bike racks out front</li><li>Food, drinks and non-alcoholic options all evening</li></ul>
            <a className="btn btn--ghost" style={{ marginTop: 'var(--space-5)' }} href="https://www.google.com/maps/search/?api=1&query=The+Warehouse+12+Harbour+Road" target="_blank" rel="noopener">Open in maps <Arrow /></a>
          </div>
        </div>
      </section>

      <Finale title={<>See you<br />at <em>the&nbsp;table?</em></>} />
    </main>
  );
}
