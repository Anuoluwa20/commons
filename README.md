# Commons

Website for Commons, a monthly meetup for designers, developers, founders and creatives.
It is built with Next.js 15 (App Router) and React 19.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## The flow

- **Landing page:** the hero ticket opens the RSVP form.
- **RSVP:** two steps, then a ticket with a seat number, calendar links and "Bring a friend".
- **Your seat:** after you RSVP, your seat fills in at the round table on the home page.
- **List signup:** in the closing section.
- **Speaker pitch:** on `/speakers`.
- **Sponsor enquiry:** on `/sponsors`.

| Route | What it does |
|---|---|
| `GET /api/rsvp` | Seats: capacity, taken, spots left, waitlist |
| `POST /api/rsvp` | `{name, email, role?, first?, list?}`. Validates the fields and dedupes by email. Assigns the next seat, or a waitlist place once the event is full. Can email the ticket. |
| `POST /api/subscribe` | `{email}` |
| `POST /api/contact` | `{kind: "pitch" \| "sponsor", ...}` |
| `GET /api/ics` | Calendar file for the event |

Every form has a honeypot field and a per-IP rate limit. The same validation rules in `lib/validate.js` run in the browser and on the server.

## Edit content

All copy, speakers, agenda, events and photos live in `lib/data.js`. Photos are in `public/images`.

These items are placeholders until you replace them:
- **Priya Nair and Tobi Adeyemi:** they use stand-in photos (`kemi-alade`, `marcus-lee`). Add `priya-nair.jpg` and `tobi-adeyemi.jpg` and update the `photo` fields.
- **Story, team names, testimonials and recent-talk names:** all are marked as samples.

## Deploying on Vercel

Vercel can't save files, so connect a free Redis database for RSVPs:

1. In the Vercel project, open **Storage → Create Database → Upstash for Redis** (Marketplace) and connect it to this project. This adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL` / `KV_REST_API_TOKEN`) automatically.
2. In **Settings → Environment Variables**, add `COMMONS_SITE_URL` (your live address) and, optionally, `RESEND_API_KEY` and `COMMONS_FROM_EMAIL` for ticket emails.
3. Redeploy.

Without Redis the site still works, but RSVPs are kept in temporary storage and are lost whenever Vercel restarts the server. On a normal server (VPS, Railway, Render, Fly), RSVPs go to `./.data/db.json` with no setup.

## Preview build

`npm run preview:build` compiles the same components into a single-page app in `preview-dist/`. It uses hash routes, and its forms run against a store in the browser. It exists only for sharing a preview. The real site is the Next.js app.

## Motion

Motion turns off when the visitor has reduced motion set, or when they use "Pause motion" in the footer. All content is visible with motion off.
