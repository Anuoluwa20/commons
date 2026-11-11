import Link from 'next/link';
import { SPEAKERS, EVENT, img } from '@/lib/data';
import { START } from '@/lib/calendar';
import { HeroPhoto, ScrollGrow, SplitStrip, WordsReveal, Relative, DaysSince } from '../Motion';
import { HeroTicket } from '../Ticket';
import { RSVPLink } from '../RSVP';
import { Eyebrow, Face, Speakers, Agenda, RoundTable, Gallery, Quotes, Faq, SponsorBanner, Finale } from '../Sections';
import { Arrow } from '../Icons';

const TICKER = ['Talks', 'Workshops', 'Socials', '3,200 members', '23 nights', '85 speakers', 'Free, always'];

export default function Home() {
  const [A, D] = SPEAKERS;
  return (
    <main id="main" className="vd">
      <section className="vd-hero hero" aria-labelledby="vd-title">
        <HeroPhoto src={img('gallery-4')} />
        <div className="wrap vd-hero__grid">
          <div className="vd-hero__text">
            <Eyebrow>Commons #{EVENT.no} · <Relative start={START} /></Eyebrow>
            <h1 id="vd-title">
              <span className="line" style={{ '--l': 0 }}><span>Design <Face s={A} /> in the</span></span>
              <span className="line" style={{ '--l': 1 }}><span>age <Face s={D} /> of <em>AI</em></span></span>
            </h1>
            <dl className="vb-facts">
              <div><dt>When</dt><dd>{EVENT.dateLong}<br /><span>{EVENT.time}</span></dd></div>
              <div><dt>Where</dt><dd>{EVENT.venue}<br /><span>{EVENT.address}</span></dd></div>
            </dl>
          </div>
          <HeroTicket id="vd-ticket-title" className="vd-ticket" />
        </div>
      </section>


      <section className="section vd-table-sec" aria-labelledby="vd-tbl">
        <div className="wrap vd-table-grid">
          <div className="section-head" style={{ margin: 0 }}>
            <Eyebrow>What is Commons</Eyebrow>
            <WordsReveal id="vd-tbl" parts={['Where the city’s ', { rotate: ['builders', 'designers', 'developers', 'founders', 'creatives'] }, ' meet. ', { dim: 'One night a month, one big table.' }]} />
            <p className="lead">Designers, developers, founders and creatives in the same room for sharp talks, hands-on workshops and the conversations that start side projects. There’s a seat with your name on it.</p>
            <RSVPLink className="btn btn--ghost" style={{ justifySelf: 'start' }}>Take your seat <Arrow /></RSVPLink>
          </div>
          <RoundTable />
        </div>
      </section>

      <ScrollGrow label="Commons #20" src={img('gallery-2')} alt="A packed room of about 160 people watching a three-person panel at Commons #20" caption="#20 · 160 people, one panel, a lot of good questions" />

      <section className="section" aria-labelledby="vd-ag">
        <div className="wrap">
          <div className="section-head split"><div style={{ display: 'grid', gap: 'var(--space-4)' }}><Eyebrow>{EVENT.dateLong}</Eyebrow><h2 id="vd-ag" className="h2">The evening, <span className="dim">to scale</span></h2></div><Link className="link" href="/events/24">Full event page →</Link></div>
          <Agenda />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="vd-sp">
        <div className="wrap">
          <div className="section-head split"><div style={{ display: 'grid', gap: 'var(--space-4)' }}><Eyebrow>At the table</Eyebrow><h2 id="vd-sp" className="h2">Speakers <span className="dim">this month</span></h2></div><Link className="link" href="/speakers">All 85 speakers →</Link></div>
          <Speakers />
        </div>
      </section>

      <SplitStrip src={img('gallery-5')} />

      <section className="section" style={{ paddingTop: 'var(--space-7)' }} aria-labelledby="vd-fmt">
        <div className="wrap">
          <div className="section-head"><Eyebrow>Every month, one of three</Eyebrow><h2 id="vd-fmt" className="h2">Talks. Workshops. <span className="dim">Socials.</span></h2></div>
          <div className="vc-grid">
            <article><span className="mono">Talks</span><h3>Two talks and a panel</h3><p>People doing the work, sharing what they actually learned.</p></article>
            <article><span className="mono">Workshops</span><h3>Leave with something made</h3><p>Small groups, real tools, a prototype by the end of the night.</p></article>
            <article><span className="mono">Socials</span><h3>Meet your next collaborator</h3><p>Hosts introduce you. Coming alone is normal here.</p></article>
            <article className="vc-live"><span className="mono">Since the first Commons</span><DaysSince from={new Date(2025, 0, 9)} /><p>days of builders meeting. 3,200 members, 23 nights, 85 speakers.</p></article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="vd-gal">
        <div className="wrap">
          <div className="section-head"><Eyebrow>Past highlights</Eyebrow><h2 id="vd-gal" className="h2">Twenty-three nights so far</h2></div>
          <Gallery />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="vd-q">
        <div className="wrap"><div className="section-head"><Eyebrow>Overheard at Commons</Eyebrow><h2 id="vd-q" className="h2">Why people come back</h2></div><Quotes /></div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="vd-spn">
        <div className="wrap">
          <div className="section-head split"><div style={{ display: 'grid', gap: 'var(--space-4)' }}><Eyebrow>Kept free by</Eyebrow><h2 id="vd-spn" className="h2">Sponsors <span className="dim">and speakers</span></h2></div><Link className="link" href="/sponsors">Sponsor packages →</Link></div>
          <SponsorBanner />
          <div className="duo">
            <div className="duo__card reveal"><h3>Got something worth twenty minutes?</h3><p>First-timers welcome. We help you shape the talk and rehearse it.</p><Link className="btn btn--ghost" href="/speakers#speak" style={{ justifySelf: 'start' }}>Pitch a talk <Arrow /></Link></div>
            <div className="duo__card reveal" style={{ '--i': 1 }}><h3>Want to reach 3,200 builders?</h3><p>Real conversations with the people you want to hire, sell to and learn from.</p><Link className="btn btn--ghost" href="/sponsors" style={{ justifySelf: 'start' }}>See packages <Arrow /></Link></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="vd-faq">
        <div className="wrap faq-grid"><div className="section-head" style={{ margin: 0, alignContent: 'start' }}><Eyebrow>Good to know</Eyebrow><h2 id="vd-faq" className="h2">Questions, answered</h2></div><Faq /></div>
      </section>

      <Finale />
    </main>
  );
}
