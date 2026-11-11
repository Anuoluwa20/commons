import 'server-only';
export const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function body(req) {
  const type = req.headers.get('content-type') || '';
  if (type.includes('application/json')) { try { return await req.json(); } catch { return null; } }
  if (type.includes('form')) return Object.fromEntries(await req.formData());
  return null;
}
// Tiny in-memory rate limit per IP: 20 posts per 10 minutes.
const hits = new Map();
export function limited(req) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
  const now = Date.now(), win = 10 * 60e3;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  list.push(now); hits.set(ip, list);
  return list.length > 20;
}
// Honeypot: real people never fill the hidden "website" field.
export const isBot = b => typeof b?.website === 'string' && b.website.trim() !== '';
