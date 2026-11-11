import { transact, snapshot } from '@/lib/store';
import { addRSVP, counts } from '@/lib/rsvp-core';
import { parseRSVP } from '@/lib/validate';
import { sendTicket } from '@/lib/mail';
import { json, body, limited, isBot } from '@/lib/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  return json(counts(await snapshot()));
}

export async function POST(req) {
  if (limited(req)) return json({ error: 'Too many tries. Give it a few minutes.' }, 429);
  const b = await body(req);
  if (!b) return json({ error: 'Send JSON or form data.' }, 400);
  if (isBot(b)) return json({ status: 'confirmed' });
  const { errors, data } = parseRSVP(b);
  if (Object.keys(errors).length) return json({ error: 'Check the highlighted fields.', fields: errors }, 422);
  const result = await transact(db => addRSVP(db, data));
  if (result.status === 'confirmed') {
    const site = process.env.COMMONS_SITE_URL || new URL(req.url).origin;
    sendTicket({ ...data, seat: result.seat }, site).catch(err => console.error('ticket email failed', err));
  }
  return json(result, result.status === 'confirmed' ? 201 : 200);
}
