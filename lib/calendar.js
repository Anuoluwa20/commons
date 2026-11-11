import { EVENT, toDate } from './data';

const p2 = n => String(n).padStart(2, '0');
export const fmtICS = d => `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}T${p2(d.getHours())}${p2(d.getMinutes())}00`;
export const START = toDate(EVENT.start);
export const END = toDate(EVENT.end);

export const eventUrl = () => {
  if (typeof window === 'undefined') return '/events/24';
  if (process.env.NEXT_PUBLIC_DEMO === '1') return location.href.split('#')[0] + '#event';
  return `${location.origin}/events/${EVENT.slug}`;
};

const details = () => `Talks, a panel and good people. Doors and drinks at ${EVENT.doors}. ${eventUrl()}`;

export function icsText(url = eventUrl()) {
  const esc = s => s.replace(/,/g, '\\,');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Commons//Events//EN', 'BEGIN:VEVENT',
    `UID:commons-${EVENT.no}@commons`, `DTSTAMP:${fmtICS(new Date())}`, `DTSTART:${fmtICS(START)}`, `DTEND:${fmtICS(END)}`,
    `SUMMARY:${EVENT.title}`, `LOCATION:${esc(`${EVENT.venue}, ${EVENT.address}`)}`,
    `DESCRIPTION:${esc(`Talks, a panel and good people. Doors and drinks at ${EVENT.doors}. ${url}`)}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

// Real app: a server route that sends the file. Preview: an inline data URI.
export const icsHref = () => process.env.NEXT_PUBLIC_DEMO === '1'
  ? 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsText())
  : `/api/ics?event=${EVENT.slug}`;

export const gcalHref = () => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT.title)}&dates=${fmtICS(START)}/${fmtICS(END)}&location=${encodeURIComponent(`${EVENT.venue}, ${EVENT.address}`)}&details=${encodeURIComponent(details())}`;

export const shareText = first => first
  ? `I’m going to ${EVENT.title} on ${EVENT.dateShort}. Come with me:`
  : `${EVENT.title}, ${EVENT.dateShort}, ${EVENT.doors}. Free, RSVP here:`;

export const shareLinks = () => {
  const u = eventUrl(), t = shareText();
  return {
    wa: `https://wa.me/?text=${encodeURIComponent(t + ' ' + u)}`,
    x: `https://x.com/intent/post?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    li: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
  };
};
