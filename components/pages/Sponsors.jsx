import { img } from '@/lib/data';
import { ScrollGrow, CountUp } from '../Motion';
import { SponsorForm } from '../Forms';
import { Arrow, Users, Mic, Cup } from '../Icons';

const TIERS = [
  { name: 'Community', c: '#B8B8B3', price: 'From one event', note: 'Great for first-time sponsors', items: ['Logo on the event page and venue screens', 'Thank-you from the stage', 'Space for one rep and a small table', 'Mention in the monthly email'] },
  { name: 'Partner', c: 'var(--ink)', price: '3 events', note: 'Most popular for hiring teams', items: ['Everything in Community', 'Logo on the homepage for the season', 'Two-minute intro on stage', 'Post-event list of opted-in job seekers', 'Four team spots, reserved'] },
  { name: 'Headline', c: 'var(--brand)', price: 'Season', note: 'Only one headline sponsor per event', feature: true, items: ['Everything in Partner', '“Presented by” on all event materials', 'A co-designed workshop or demo slot', 'Feature in the recap and photo gallery', 'Recap report with attendance and engagement'] },
];

export default function Sponsors() {
  return (
    <main id="main">
      <section className="page-head"><div className="wrap">
        <span className="eyebrow">Sponsor Commons</span>
        <h1>Back the people<br />building what’s next</h1>
        <p className="lead">Sponsors keep Commons free. In return you get something rarer than impressions: real conversations with the builders you want to hire, sell to or learn from.</p>
        <a className="btn" href="#contact" style={{ marginTop: 'var(--space-6)' }}>Talk to us <Arrow /></a>
      </div></section>
      <ScrollGrow label="The room" style={{ margin: 0 }} src={img('gallery-6')} alt="An engaged audience during a Q&A at Commons" caption="#23 · The room sponsors get to meet" />
      <section style={{ paddingBlock: 'var(--space-8) var(--section)' }} aria-labelledby="why-title"><div className="wrap">
        <div className="section-head"><span className="eyebrow">Why sponsor</span><h2 id="why-title" className="h2">More than a logo</h2></div>
        <div className="why">
          <article className="format reveal"><span className="format__icon" style={{ '--c': 'var(--brand)' }}><Users /></span><h3>Hire from the room</h3><p>Meet designers and engineers before they’re on a job board. Many sponsors fill roles from a single night.</p></article>
          <article className="format reveal" style={{ '--i': 1 }}><span className="format__icon" style={{ '--c': 'var(--ink)', color: '#fff' }}><Mic /></span><h3>Show, don’t pitch</h3><p>Headline sponsors host a demo or workshop slot built with us, so it lands as value, not an ad break.</p></article>
          <article className="format reveal" style={{ '--i': 2 }}><span className="format__icon" style={{ '--c': 'var(--surface-3)' }}><Cup /></span><h3>Be part of the scene</h3><p>Put your name behind the community your team already belongs to, every month, all year.</p></article>
        </div>
      </div></section>
      <section aria-labelledby="aud-title"><div className="stats-band"><div className="wrap" style={{ padding: 0 }}>
        <span className="eyebrow" style={{ color: 'var(--on-night-muted)' }}>Audience</span>
        <h2 id="aud-title" className="h2" style={{ marginTop: 'var(--space-4)' }}>Who’s at the table</h2>
        <div className="aud tnum" style={{ marginTop: 'var(--space-7)' }}>
          <div><CountUp value={3200} /><span>members on the list</span></div><div><b>180</b><span>average attendance</span></div><div><b>68%</b><span>open rate on our monthly email</span></div><div><b>21–40</b><span>core age range</span></div>
        </div>
        <ul className="bar-list tnum" aria-label="Member disciplines">
          <li><span>Design</span><i style={{ '--w': '34%', '--c': 'var(--brand)' }}></i><span>34%</span></li>
          <li><span>Engineering</span><i style={{ '--w': '30%', '--c': '#FFFFFF' }}></i><span>30%</span></li>
          <li><span>Founders and product</span><i style={{ '--w': '21%', '--c': '#B8B8B3' }}></i><span>21%</span></li>
          <li><span>Creatives and students</span><i style={{ '--w': '15%', '--c': '#6E6E6A' }}></i><span>15%</span></li>
        </ul>
        <p style={{ marginTop: 'var(--space-5)', fontSize: 'var(--fs-14)', color: 'var(--on-night-muted)' }}>Attendance, open rate and discipline split are sample figures until real data is added.</p>
      </div></div></section>
      <section className="section" aria-labelledby="tier-title"><div className="wrap">
        <div className="section-head"><span className="eyebrow">Packages</span><h2 id="tier-title" className="h2">Sponsor tiers</h2><p className="lead">Monthly or for the season. Prices on request so we can shape the right fit.</p></div>
        <div className="tiers">{TIERS.map((t, i) => (
          <article key={t.name} className={`tier${t.feature ? ' tier--feature' : ''} reveal`} style={{ '--c': t.c, '--i': i }}>
            {t.feature && <span className="tier__badge">1 per month</span>}
            <h3><i></i>{t.name}</h3>
            <p className="tier__price">{t.price}<small>{t.note}</small></p>
            <ul>{t.items.map(x => <li key={x}>{x}</li>)}</ul>
            <a className={`btn${t.feature ? '' : ' btn--ghost'} btn--block`} href="#contact">Ask about {t.name}</a>
          </article>
        ))}</div>
      </div></section>
      <section className="section" id="contact" style={{ paddingTop: 0 }} aria-labelledby="ct-title"><div className="wrap two-col">
        <div><span className="eyebrow">Get in touch</span><h2 id="ct-title" className="h2" style={{ marginTop: 'var(--space-4)' }}>Let’s build something for the room</h2><p className="lead" style={{ marginTop: 'var(--space-4)' }}>Tell us what you’re hoping for. We’ll reply within three working days with dates, options and a deck.</p></div>
        <SponsorForm />
      </div></section>
    </main>
  );
}
