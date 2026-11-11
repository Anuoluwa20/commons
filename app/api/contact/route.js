import { transact } from '@/lib/store';
import { addMessage } from '@/lib/rsvp-core';
import { parseContact } from '@/lib/validate';
import { json, body, limited, isBot } from '@/lib/http';

// Speaker pitches (kind: "pitch") and sponsor enquiries (kind: "sponsor").
export async function POST(req) {
  if (limited(req)) return json({ error: 'Too many tries. Give it a few minutes.' }, 429);
  const b = await body(req);
  if (!b) return json({ error: 'Send JSON or form data.' }, 400);
  if (isBot(b)) return json({ status: 'received' });
  const { errors, data } = parseContact(b);
  if (Object.keys(errors).length) return json({ error: 'Check the highlighted fields.', fields: errors }, 422);
  return json(await transact(db => addMessage(db, data)), 201);
}
