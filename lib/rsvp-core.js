/* RSVP rules, shared by the API route (server store) and the preview build (browser store). */
import { EVENT } from './data';

export const emptyDB = () => ({ rsvps: [], waitlist: [], subscribers: [], messages: [] });

export const counts = db => {
  const taken = Math.min(EVENT.capacity, EVENT.taken + db.rsvps.length);
  return { capacity: EVENT.capacity, taken, spotsLeft: EVENT.capacity - taken, waitlist: db.waitlist.length };
};

const token = () => Array.from({ length: 12 }, () => 'abcdefghjkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 31)]).join('');

/** Mutates db. Returns the public result for the guest. */
export function addRSVP(db, data) {
  const existing = db.rsvps.find(r => r.email === data.email);
  if (existing) return { status: 'existing', name: existing.name, seat: existing.seat, ...counts(db) };
  const onList = db.waitlist.find(r => r.email === data.email);
  if (onList) return { status: 'waitlist', name: onList.name, position: db.waitlist.indexOf(onList) + 1, ...counts(db) };

  const { spotsLeft } = counts(db);
  const now = new Date().toISOString();
  if (spotsLeft <= 0) {
    db.waitlist.push({ ...data, event: EVENT.no, at: now });
    return { status: 'waitlist', name: data.name, position: db.waitlist.length, ...counts(db) };
  }
  const seat = EVENT.taken + db.rsvps.length + 1;
  db.rsvps.push({ ...data, event: EVENT.no, seat, id: token(), at: now });
  if (data.list && !db.subscribers.some(s => s.email === data.email)) db.subscribers.push({ email: data.email, source: 'rsvp', at: now });
  return { status: 'confirmed', name: data.name, seat, ...counts(db) };
}

export function addSubscriber(db, { email }) {
  if (db.subscribers.some(s => s.email === email)) return { status: 'existing' };
  db.subscribers.push({ email, source: 'list', at: new Date().toISOString() });
  return { status: 'subscribed' };
}

export function addMessage(db, data) {
  db.messages.push({ ...data, at: new Date().toISOString() });
  return { status: 'received' };
}
