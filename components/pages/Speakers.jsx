import { SPEAKERS, PAST_TALKS, img } from '@/lib/data';
import { SpeakerCard } from '../Sections';
import { PitchForm } from '../Forms';
import { Arrow } from '../Icons';

export default function Speakers() {
  return (
    <main id="main">
      <section className="page-head"><div className="wrap">
        <span className="eyebrow">85 speakers and counting</span>
        <h1>Speakers</h1>
        <p className="lead">People doing the work, sharing what they actually learned. About a third of our speakers were first-timers.</p>
        <a className="btn" href="#speak" style={{ marginTop: 'var(--space-6)' }}>Become a speaker <Arrow /></a>
      </div></section>
      <section style={{ paddingBottom: 'var(--space-9)' }}><div className="wrap">
        <h2 className="h2" style={{ fontSize: 'var(--fs-h3)', marginBottom: 'var(--space-5)' }}>At the table on 4 December</h2>
        <div className="vb-speakers">{SPEAKERS.map((s, i) => <SpeakerCard key={s.slug} s={s} i={i} slot={`#24 · ${s.slot.split(' · ')[1]}`} />)}</div>
        <h2 className="h2" style={{ fontSize: 'var(--fs-h3)', margin: 'var(--space-9) 0 var(--space-5)' }}>Recent talks <small style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--fs-14)', color: 'var(--muted)', letterSpacing: 0 }}>Sample names until the archive is imported</small></h2>
        <div className="sp-talks">{PAST_TALKS.map((t, i) => (
          <article key={t.name} className="sp-talk m-wipe" style={{ '--i': i % 3 }}>
            <img src={img(t.img)} alt="" loading="lazy" />
            <div><p className="mono">Spoke at {t.ev}</p><h3>{t.talk}</h3><p>{t.name} · {t.role}</p></div>
          </article>
        ))}</div>
      </div></section>
      <section className="section" id="speak" style={{ background: 'var(--surface-2)' }} aria-labelledby="speak-title"><div className="wrap two-col">
        <div>
          <span className="eyebrow">Become a speaker</span>
          <h2 id="speak-title" className="h2" style={{ marginTop: 'var(--space-4)' }}>Got something worth twenty minutes?</h2>
          <p className="lead" style={{ marginTop: 'var(--space-4)' }}>A project, a lesson, a strong opinion. If it would help the room, we want it. First-timers very welcome.</p>
          <ul className="perks"><li>A rehearsal call and feedback on your outline</li><li>A friendly, curious audience of 150–200</li><li>Pro photos and a recording of your talk</li><li>Dinner with the other speakers and organisers</li><li>Travel help if you’re coming from out of town</li></ul>
        </div>
        <PitchForm />
      </div></section>
    </main>
  );
}
