import { icsText } from '@/lib/calendar';
import { EVENT } from '@/lib/data';

export function GET(req) {
  const url = `${process.env.COMMONS_SITE_URL || new URL(req.url).origin}/events/${EVENT.slug}`;
  return new Response(icsText(url), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="commons-${EVENT.no}.ics"`,
    },
  });
}
