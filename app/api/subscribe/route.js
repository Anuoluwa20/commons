import { transact } from '@/lib/store';
import { addSubscriber } from '@/lib/rsvp-core';
import { parseSubscribe } from '@/lib/validate';
import { json, body, limited, isBot } from '@/lib/http';

export async function POST(req) {
  if (limited(req)) return json({ error: 'Too many tries. Give it a few minutes.' }, 429);
  const b = await body(req);
  if (!b) return json({ error: 'Send JSON or form data.' }, 400);
  if (isBot(b)) return json({ status: 'subscribed' });
  const { errors, data } = parseSubscribe(b);
  if (Object.keys(errors).length) return json({ error: errors.email, fields: errors }, 422);
  return json(await transact(db => addSubscriber(db, data)));
}
