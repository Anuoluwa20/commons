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

## Before deploying

RSVPs are saved to a JSON file (`lib/store.js`). That works on one server, such as a VPS, Railway, Render or Fly with a volume. Serverless hosts like Vercel or Netlify have no writable disk. On those, replace `read` and `write` in `lib/store.js` with a database such as Postgres, Supabase, Upstash or Airtable. The rest of the app stays the same.

To send ticket emails, set the variables in `.env.example`.

## Preview build

`npm run preview:build` compiles the same components into a single-page app in `preview-dist/`. It uses hash routes, and its forms run against a store in the browser. It exists only for sharing a preview. The real site is the Next.js app.

## Motion

Motion turns off when the visitor has reduced motion set, or when they use "Pause motion" in the footer. All content is visible with motion off.
