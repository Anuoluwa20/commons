/* Server-only store for RSVPs, list signups and messages.
   - Upstash Redis when its env vars are set (works on Vercel: add "Upstash for Redis" from
     the Vercel Marketplace and the variables are filled in for you).
   - Otherwise a JSON file: ./.data locally, /tmp on Vercel (temporary, resets on redeploy). */
import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { emptyDB } from './rsvp-core';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const KEY = 'commons:db', LOCK = 'commons:lock';

async function redis(...cmd) {
  const r = await fetch(REDIS_URL, { method: 'POST', headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd), cache: 'no-store' });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(`Redis: ${j.error || r.status}`);
  return j.result;
}

const redisStore = {
  async read() { const v = await redis('GET', KEY); return { ...emptyDB(), ...(v ? JSON.parse(v) : {}) }; },
  async write(db) { await redis('SET', KEY, JSON.stringify(db)); },
  // A short lock so two RSVPs at the same moment, on different servers, can't take the same seat.
  async lock() {
    const id = Math.random().toString(36).slice(2);
    for (let i = 0; i < 50; i++) {
      if (await redis('SET', LOCK, id, 'NX', 'PX', '5000')) return async () => { if ((await redis('GET', LOCK)) === id) await redis('DEL', LOCK); };
      await new Promise(r => setTimeout(r, 100));
    }
    throw new Error('Store is busy, try again');
  },
};

const DIR = process.env.COMMONS_DATA_DIR || (process.env.VERCEL ? '/tmp/commons' : path.join(process.cwd(), '.data'));
const FILE = path.join(DIR, 'db.json');
const fileStore = {
  async read() {
    try { return { ...emptyDB(), ...JSON.parse(await fs.readFile(FILE, 'utf8')) }; }
    catch (e) { if (e.code === 'ENOENT') return emptyDB(); throw e; }
  },
  async write(db) {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(FILE + '.tmp', JSON.stringify(db, null, 2));
    await fs.rename(FILE + '.tmp', FILE);
  },
  async lock() { return async () => {}; },
};

const store = REDIS_URL && REDIS_TOKEN ? redisStore : fileStore;
if (process.env.VERCEL && store === fileStore) console.warn('[commons] No Upstash Redis configured: RSVPs are kept in /tmp and will be lost. Add Upstash for Redis in Vercel → Storage.');

// Serialise read-modify-write inside this server, plus the shared lock across servers.
let queue = Promise.resolve();
export function transact(fn) {
  const run = queue.then(async () => {
    const unlock = await store.lock();
    try { const db = await store.read(); const out = await fn(db); await store.write(db); return out; }
    finally { await unlock(); }
  });
  queue = run.catch(() => {});
  return run;
}
export const snapshot = () => queue.then(() => store.read());
