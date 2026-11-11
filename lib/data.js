/* Commons content. Edit here: every page reads from this file. */

const BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? '/';
export const img = slug => `${BASE}images/${slug}.jpg`;

export const EVENT = {
  no: 24,
  slug: '24',
  title: 'Commons #24: Design in the Age of AI',
  short: 'Design in the Age of AI',
  // Floating local time (no timezone tied to a place): countdown and calendar use the visitor's clock.
  start: [2026, 12, 4, 18, 0],
  end: [2026, 12, 4, 21, 30],
  dateLong: 'Thursday 4 December',
  dateShort: 'Thu 4 Dec',
  dateMono: 'Thu 04.12.26',
  time: '6:00–9:30 PM',
  doors: '6:00 PM',
  venue: 'The Warehouse',
  address: '12 Harbour Road',
  capacity: 200,
  taken: 158, // seats already claimed before this site went live
};
export const toDate = a => new Date(a[0], a[1] - 1, a[2], a[3], a[4]);

// Priya and Tobi use stand-in photos until their own portraits arrive.
export const SPEAKERS = [
  { slug: 'amara-okafor', photo: 'amara-okafor', name: 'Amara Okafor', role: 'Product Designer', ini: 'AO', slot: '6:45 · Talk 1', talk: 'Designing with the machine, not for it' },
  { slug: 'daniel-reyes', photo: 'daniel-reyes', name: 'Daniel Reyes', role: 'Frontend Engineer', ini: 'DR', slot: '7:20 · Talk 2', talk: 'Interfaces that explain themselves' },
  { slug: 'priya-nair', photo: 'kemi-alade', name: 'Priya Nair', role: 'Founder, Studio Nine', ini: 'PN', slot: '8:00 · Panel', talk: 'Taste in the age of AI: who decides what’s good?' },
  { slug: 'tobi-adeyemi', photo: 'marcus-lee', name: 'Tobi Adeyemi', role: 'Creative Director', ini: 'TA', slot: '8:00 · Panel', talk: 'Taste in the age of AI: who decides what’s good?' },
];

export const AGENDA = [
  { t: '6:00', title: 'Doors and drinks', kind: 'Find your people. Hosts make introductions.', long: 'Grab a drink and find your people. Hosts at the door make introductions.', who: [] },
  { t: '6:45', title: 'Designing with the machine, not for it', kind: 'Talk 1', long: 'Talk 1 · How product teams fold AI into the design process without handing over their judgement.', who: [0], key: true },
  { t: '7:20', title: 'Interfaces that explain themselves', kind: 'Talk 2', long: 'Talk 2 · Patterns for AI features people trust: showing reasoning, handling uncertainty and failing gracefully.', who: [1] },
  { t: '8:00', title: 'Taste in the age of AI: who decides what’s good?', kind: 'Panel', long: 'Panel · Craft, originality and what changes when anyone can generate anything.', who: [2, 3, 0, 1] },
  { t: '8:40', title: 'Networking', kind: 'Stay till 9:30. Meet the speakers.', long: 'The best part. Stay till 9:30, meet the speakers, swap numbers.', who: [] },
];

export const GALLERY = [
  { src: 'gallery-6', cls: 'vd-g1', cap: '#23 · Q&A with the founders', alt: 'A woman standing in the audience asking a question into a microphone' },
  { src: 'gallery-7', cls: 'vd-g2', cap: '#23 · Doors at 6', alt: 'Hosts welcoming people at the check-in table outside the venue' },
  { src: 'gallery-1', cls: 'vd-g3', cap: '#19 · Pitch clinic', alt: 'Four people laughing around a laptop at a wooden table' },
  { src: 'gallery-4', cls: 'vd-g4', cap: '#18 · Makers’ night', alt: 'A woman laughing with friends over food at a long table' },
  { src: 'gallery-5', cls: 'vd-g5', cap: '#21 · Rooftop social', alt: 'A rooftop social with string lights at golden hour' },
];

export const QUOTES = [
  { r: 'Product designer', q: 'I came for the talk and stayed three hours. Left with a co-founder’s number and a reading list. That never happens at conferences.' },
  { r: 'Frontend developer', q: 'It’s the one night a month where designers and developers actually talk to each other instead of about each other.' },
  { r: 'Design student', q: 'I was nervous coming alone. Someone saved me a seat within five minutes. Now I’m the one saving seats.' },
];

export const FAQ = [
  ['Is it free?', 'Yes. Commons is free to attend. Sponsors cover the venue, drinks and snacks so the door stays open to everyone.'],
  ['I’m not a designer or developer. Can I come?', 'Please do. Founders, product people, writers, students, illustrators, the curious: if you make things or want to, you’ll fit in.'],
  ['I don’t know anyone. Will it be awkward?', 'Lots of people come alone. Hosts make introductions at the door, and the last hour is built for conversation, not standing at the back.'],
  ['What happens if I can’t make it?', 'Use the link in your ticket email to free up your seat. Someone on the waitlist will thank you.'],
  ['Is the venue accessible?', 'The Warehouse has step-free access and an accessible toilet. Tell us about anything else you need in your RSVP email reply and we’ll sort it.'],
  ['Can I speak or sponsor?', 'Yes to both. Pitch a talk on the speakers page, or see sponsor packages on the sponsors page.'],
];

export const UPCOMING = [
  { no: 24, day: '04', mon: 'Dec', title: 'Design in the Age of AI', type: 'Talk', meta: 'Thu 4 Dec · 6:00–9:30 PM · The Warehouse', foot: ['live', 'RSVP open'], href: '/events/24', img: 'gallery-2' },
  { no: 25, day: '15', mon: 'Jan', title: 'Prototype Night: ship a tiny tool in two hours', type: 'Workshop', meta: 'Thu 15 Jan · 6:00–9:00 PM · Venue TBA', foot: ['RSVP opens 1 Jan', 'Details soon'], img: 'gallery-1' },
  { no: 26, day: '12', mon: 'Feb', title: 'The Big Table: new-year social', type: 'Social', meta: 'Thu 12 Feb · 7:00–10:00 PM · Venue TBA', foot: ['RSVP opens 29 Jan', 'Details soon'], img: 'gallery-4' },
];
export const PAST_EVENTS = [
  { no: 23, day: '06', mon: 'Nov', title: 'Shipping solo: founders who design and code', type: 'Talk', meta: 'Thu 6 Nov 2026 · 180 attended', foot: ['Recap and photos', 'Past'], img: 'gallery-6' },
  { no: 22, day: '09', mon: 'Oct', title: 'Type in motion: a hands-on kinetic type lab', type: 'Workshop', meta: 'Thu 9 Oct 2026 · 40 attended', foot: ['Recap and photos', 'Past'], img: 'gallery-7' },
  { no: 21, day: '11', mon: 'Sep', title: 'Back-to-work rooftop social', type: 'Social', meta: 'Thu 11 Sep 2026 · 220 attended', foot: ['Photos', 'Past'], img: 'gallery-5' },
  { no: 20, day: '07', mon: 'Aug', title: 'Design systems that survive the second year', type: 'Talk', meta: 'Thu 7 Aug 2026 · 160 attended', foot: ['Recap and photos', 'Past'], img: 'gallery-2' },
  { no: 19, day: '10', mon: 'Jul', title: 'Pitch clinic: ten minutes to sound fundable', type: 'Workshop', meta: 'Thu 10 Jul 2026 · 36 attended', foot: ['Recap', 'Past'], img: 'gallery-1' },
  { no: 18, day: '12', mon: 'Jun', title: 'Midsummer makers’ night', type: 'Social', meta: 'Thu 12 Jun 2026 · 240 attended', foot: ['Photos', 'Past'], img: 'gallery-4' },
];

// Recent talks, shown with photos from the night (sample names until the archive is imported).
export const PAST_TALKS = [
  { name: 'Sade Okoro', role: 'Type designer', ev: '#22', talk: 'Letters that move', img: 'gallery-7' },
  { name: 'Jon Park', role: 'Staff Engineer', ev: '#20', talk: 'The second year of a design system', img: 'gallery-2' },
  { name: 'Nneka Eze', role: 'Founder, climate startup', ev: '#19', talk: 'How I learned to pitch in ten minutes', img: 'gallery-1' },
  { name: 'Aisha Bello', role: 'UX Researcher', ev: '#23', talk: 'Research on a shoestring', img: 'gallery-6' },
];

export const TEAM = [
  { photo: 'team-ngozi', name: 'Ngozi A.', role: 'Founder and host' },
  { photo: 'team-sam', name: 'Sam K.', role: 'Programme lead' },
  { photo: 'team-lina', name: 'Lina O.', role: 'Community and partnerships' },
  { photo: 'team-dayo', name: 'Dayo F.', role: 'Design and production' },
];

export const FACES = ['amara-okafor', 'daniel-reyes', 'kemi-alade', 'team-lina', 'marcus-lee'];
