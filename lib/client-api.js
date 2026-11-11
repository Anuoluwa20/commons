/* Browser side of the forms. Real app: calls the Next.js API routes.
   Preview build (NEXT_PUBLIC_DEMO=1): runs the same rules against a store kept in this browser. */
import { emptyDB, addRSVP, addSubscriber, addMessage, counts } from './rsvp-core';
import { parseRSVP, parseSubscribe, parseContact } from './validate';

const DEMO = process.env.NEXT_PUBLIC_DEMO === '1';
const KEY = 'commons-demo-db';
const load = () => { try { return { ...emptyDB(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return emptyDB(); } };
const save = db => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} };
const wait = ms => new Promise(r => setTimeout(r, ms));

async function demo(parse, act) {
  await wait(500);
  return input => {
    const { errors, data } = parse(input);
    if (Object.keys(errors).length) return { ok: false, error: 'Check the highlighted fields.', fields: errors };
    const db = load(); const out = act(db, data); save(db);
    return { ok: true, ...out };
  };
}

async function call(path, input) {
  try {
    const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(input) });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, ...data };
  } catch {
    return { ok: false, error: 'You look offline. Try again in a moment.' };
  }
}

export const submitRSVP = async input => DEMO ? (await demo(parseRSVP, addRSVP))(input) : call('/api/rsvp', input);
export const subscribe = async input => DEMO ? (await demo(parseSubscribe, addSubscriber))(input) : call('/api/subscribe', input);
export const contact = async input => DEMO ? (await demo(parseContact, addMessage))(input) : call('/api/contact', input);

export async function getCounts() {
  if (DEMO) return counts(load());
  try { const r = await fetch('/api/rsvp', { cache: 'no-store' }); return r.ok ? r.json() : null; } catch { return null; }
}
