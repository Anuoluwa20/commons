/* Optional confirmation email through Resend. Without RESEND_API_KEY this does nothing. */
import 'server-only';
import { EVENT } from './data';
import { icsText } from './calendar';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function sendTicket({ name, email, seat }, siteUrl) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const from = process.env.COMMONS_FROM_EMAIL || 'Commons <tickets@example.com>';
  const first = name.split(/\s+/)[0];
  const url = `${siteUrl}/events/${EVENT.slug}`;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:auto;color:#111">
    <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#FF5B1F">Commons #${EVENT.no} · Admit one</p>
    <h1 style="font-size:28px;margin:8px 0">You’re in, ${esc(first)}.</h1>
    <p>${esc(EVENT.short)}<br>${EVENT.dateLong}, doors ${EVENT.doors}<br>${EVENT.venue}, ${EVENT.address}</p>
    <p style="font-family:ui-monospace,monospace;font-size:18px">Seat ${String(seat).padStart(3, '0')} · ${esc(name)}</p>
    <p>Coming alone? Most people do. Give your name at the door and a host will introduce you.</p>
    <p><a href="${url}">Event details</a></p></div>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from, to: [email], subject: `Your seat at Commons #${EVENT.no}`, html,
      attachments: [{ filename: `commons-${EVENT.no}.ics`, content: Buffer.from(icsText(url)).toString('base64') }],
    }),
  });
  return { sent: res.ok };
}
