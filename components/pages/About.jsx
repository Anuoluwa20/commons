import { TEAM, img } from '@/lib/data';
import { ScrollGrow } from '../Motion';

const VALUES = [
  ['Everyone gets a seat', 'Free to attend, always. Students sit next to CTOs, and first-timers are introduced, not left at the edges.', 'var(--brand-soft)'],
  ['Show the work', 'Real projects, real numbers, real mistakes. We prefer a messy truth to a polished pitch.', 'var(--surface)'],
  ['Cross the aisle', 'Design, code, business and craft are better together. Every event mixes disciplines on purpose.', 'var(--brand-soft)'],
  ['Leave it better', 'Share what you learn, help someone newer, and take care of the room and the people in it.', 'var(--surface)'],
];

export default function About() {
  return (
    <main id="main">
      <section className="page-head"><div className="wrap">
        <span className="eyebrow">About Commons</span>
        <h1>A bigger table,<br />every month</h1>
        <p className="lead">Commons started because the people building the city’s products rarely ended up in the same room. So we made one.</p>
      </div></section>
      <section style={{ paddingBottom: 'var(--section)' }}><div className="wrap story">
        <div className="story__text"><p>The first Commons was twelve people, one projector and a lot of takeout in a borrowed studio. A designer, two developers, a founder and a few curious friends talking about the things they were making.</p><p>Twenty-three nights later the table seats two hundred, but the idea hasn’t changed: put people who make things side by side, keep it free, keep it kind, and let the conversations do the rest.</p><p style={{ color: 'var(--muted)', fontSize: 'var(--fs-16)' }}>Placeholder story: replace with Commons’ real origin.</p></div>
        <ol className="timeline">
          <li><b>#1</b><span>12 people in a borrowed studio</span></li>
          <li><b>#6</b><span>First workshop. Sold out in a day</span></li>
          <li><b>#12</b><span>One year, 1,000 people on the list</span></li>
          <li><b>#20</b><span>The Warehouse becomes home</span></li>
          <li><b>#24</b><span>3,200 members, 85 speakers</span></li>
        </ol>
      </div></section>
      <ScrollGrow label="At the door" style={{ margin: '0 0 var(--section)' }} src={img('gallery-7')} alt="Hosts welcoming people at the check-in table before a Commons night" caption="Every night starts at the door" />
      <section style={{ paddingBottom: 'var(--section)' }} aria-labelledby="val-title"><div className="wrap">
        <div className="section-head"><span className="eyebrow">What we care about</span><h2 id="val-title" className="h2">Values</h2></div>
        <div className="values">{VALUES.map(([h, p, c], i) => <article key={h} className="value reveal" style={{ '--c': c, '--i': i }}><b>{String(i + 1).padStart(2, '0')}</b><h3>{h}</h3><p>{p}</p></article>)}</div>
      </div></section>
      <section style={{ paddingBottom: 'var(--section)' }} aria-labelledby="team-title"><div className="wrap">
        <div className="section-head"><span className="eyebrow">The hosts</span><h2 id="team-title" className="h2">Team</h2><p className="lead">Volunteers who do this because they love it. Names are placeholders.</p></div>
        <div className="team">{TEAM.map((t, i) => <article key={t.name} className="reveal" style={{ '--i': i }}><div className="photo"><img src={img(t.photo)} alt={`Portrait of ${t.name}`} loading="lazy" /></div><h3>{t.name}</h3><p>{t.role}</p></article>)}</div>
      </div></section>
      <section id="conduct" aria-labelledby="coc-title"><div className="wrap"><div className="conduct">
        <span className="eyebrow">Code of conduct</span>
        <h2 id="coc-title" className="h2" style={{ marginTop: 'var(--space-4)' }}>Be the reason someone comes back</h2>
        <p className="lead" style={{ marginTop: 'var(--space-4)' }}>Commons is for everyone. This applies to attendees, speakers, sponsors, volunteers and hosts, at events and in our online spaces.</p>
        <div className="conduct-grid">
          <div><h3>We expect</h3><ul><li>Respect for every person, whatever their background, identity, experience or discipline</li><li>Generous listening and good-faith questions</li><li>Making room for people who are new or quiet</li><li>Asking before photographing or recording someone up close</li></ul></div>
          <div><h3>Not OK, ever</h3><ul><li>Harassment, intimidation or discrimination in any form</li><li>Unwelcome physical contact or sexual attention</li><li>Disrupting talks, or hard selling to attendees</li><li>Offensive comments or imagery, in person or online</li></ul></div>
        </div>
        <div className="report"><strong>If something happens:</strong> find any host (look for the orange name badges) or message the safety line listed on your ticket. We’ll listen, act quickly and keep it confidential. Breaking this code can mean removal from the event and future events.</div>
      </div></div></section>
    </main>
  );
}
