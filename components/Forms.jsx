'use client';
/* List signup, speaker pitch and sponsor enquiry. Each posts to its API route. */
import { useRef, useState } from 'react';
import { subscribe, contact } from '@/lib/client-api';
import { useToast } from './Toast';
import { Field, checkAll, Honeypot } from './Field';
import { Arrow } from './Icons';

function useSimpleForm(send, { success, toastMsg }) {
  const ref = useRef(null);
  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const setError = (k, m) => setErrors(e => ({ ...e, [k]: m }));
  const onSubmit = async e => {
    e.preventDefault();
    const { ok, errors: errs } = checkAll(ref.current);
    setErrors(errs);
    if (!ok) return;
    setBusy(true); setMsg('');
    const r = await send(Object.fromEntries(new FormData(ref.current)));
    setBusy(false);
    if (r.ok) { ref.current.reset(); setMsg(typeof success === 'function' ? success(r) : success); toast(toastMsg); }
    else { if (r.fields) setErrors(r.fields); setMsg(r.error || 'That didn’t go through. Try again in a moment.'); }
  };
  return { ref, errors, setError, busy, msg, onSubmit };
}

export function JoinForm({ id = 'join-email', dark = true }) {
  const f = useSimpleForm(subscribe, { success: r => r.status === 'existing' ? 'You’re already on the list. See you at the table.' : 'You’re on the list. See you at the table.', toastMsg: 'Welcome to Commons' });
  return (
    <form className="inline-form" ref={f.ref} onSubmit={f.onSubmit} noValidate>
      <Honeypot />
      <label className="sr-only" htmlFor={id}>Email address</label>
      <div className="inline-form__row">
        <input id={id} name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" required data-req="Add your email to join." aria-invalid={f.errors.email ? 'true' : 'false'} aria-describedby={`${id}-err`} />
        <button className={`btn${dark ? ' btn--dark' : ''}`} type="submit" disabled={f.busy}>{f.busy ? 'Joining…' : 'Join the list'}</button>
      </div>
      <span className="error note" id={`${id}-err`} aria-live="polite">{f.errors.email || ''}</span>
      <p className="msg" role="status">{f.msg}</p>
    </form>
  );
}

export function PitchForm() {
  const f = useSimpleForm(d => contact({ ...d, kind: 'pitch' }), { success: 'Thanks! We read every pitch and reply within two weeks.', toastMsg: 'Pitch sent' });
  return (
    <form className="form-card" ref={f.ref} onSubmit={f.onSubmit} noValidate>
      <Honeypot />
      <h3 style={{ fontSize: 'var(--fs-h3)' }}>Pitch a talk</h3>
      <div className="row2">
        <Field id="sp-name" name="name" label="Your name" autoComplete="name" required data-req="Add your name." error={f.errors.name} setError={f.setError} />
        <Field id="sp-email" name="email" type="email" inputMode="email" label="Email" autoComplete="email" required data-req="Add your email so we can reply." error={f.errors.email} setError={f.setError} />
      </div>
      <Field id="sp-role" name="role" label="What you do" placeholder="Product designer at a fintech startup" autoComplete="organization-title" />
      <Field id="sp-title" name="title" label="Talk title" required data-req="Give your talk a working title. It can change." error={f.errors.title} setError={f.setError} />
      <Field id="sp-pitch" name="pitch" label="What’s it about?" textarea required data-req="A few sentences is plenty." hint="Two or three sentences. What will people leave knowing?" error={f.errors.pitch} setError={f.setError} />
      <fieldset className="field"><legend>Format</legend><div className="pills">
        {[['talk', 'Talk'], ['workshop', 'Workshop'], ['panel', 'Panel']].map(([v, l], i) => <label key={v}><input type="radio" name="format" value={v} defaultChecked={i === 0} /><span>{l}</span></label>)}
      </div></fieldset>
      <button className="btn" type="submit" disabled={f.busy}>{f.busy ? 'Sending…' : <>Send my pitch <Arrow /></>}</button>
      <p className="msg" role="status">{f.msg}</p>
    </form>
  );
}

export function SponsorForm() {
  const f = useSimpleForm(d => contact({ ...d, kind: 'sponsor' }), { success: 'Thanks! We’ll be in touch within three working days.', toastMsg: 'Message sent' });
  return (
    <form className="form-card" ref={f.ref} onSubmit={f.onSubmit} noValidate>
      <Honeypot />
      <div className="row2">
        <Field id="ct-name" name="name" label="Your name" autoComplete="name" required data-req="Add your name." error={f.errors.name} setError={f.setError} />
        <Field id="ct-email" name="email" type="email" inputMode="email" label="Work email" autoComplete="email" required data-req="Add your email so we can reply." error={f.errors.email} setError={f.setError} />
      </div>
      <Field id="ct-co" name="company" label="Company" autoComplete="organization" required data-req="Add your company name." error={f.errors.company} setError={f.setError} />
      <fieldset className="field"><legend>Interested in</legend><div className="pills">
        {[['community', 'Community'], ['partner', 'Partner'], ['headline', 'Headline'], ['unsure', 'Not sure yet']].map(([v, l]) => <label key={v}><input type="radio" name="tier" value={v} defaultChecked={v === 'partner'} /><span>{l}</span></label>)}
      </div></fieldset>
      <Field id="ct-msg" name="message" label="What are you hoping to get out of it?" optional textarea />
      <button className="btn" type="submit" disabled={f.busy}>{f.busy ? 'Sending…' : <>Send message <Arrow /></>}</button>
      <p className="msg" role="status">{f.msg}</p>
    </form>
  );
}
