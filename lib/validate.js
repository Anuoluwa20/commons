/* Shared by the browser forms and the API routes, so both enforce the same rules. */
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const ROLES = ['design', 'code', 'found', 'create', 'study'];

export function checkEmail(v) {
  const e = str(v, 254).toLowerCase();
  if (!e) return { error: 'Add your email so we can send your ticket.' };
  if (!EMAIL.test(e)) return { error: 'That email looks incomplete. Check for a typo.' };
  return { value: e };
}

export function parseRSVP(body = {}) {
  const errors = {};
  const name = str(body.name, 80);
  if (!name) errors.name = 'Add your name so we can make your badge.';
  const em = checkEmail(body.email);
  if (em.error) errors.email = em.error;
  const role = ROLES.includes(body.role) ? body.role : null;
  const yes = v => v === true || v === 'yes' || v === 'on';
  return { errors, data: { name, email: em.value, role, first: yes(body.first), list: yes(body.list) } };
}

export function parseSubscribe(body = {}) {
  const em = checkEmail(body.email);
  return em.error ? { errors: { email: 'Add a valid email to join.' } } : { errors: {}, data: { email: em.value } };
}

export function parseContact(body = {}) {
  const kind = body.kind === 'pitch' ? 'pitch' : 'sponsor';
  const errors = {};
  const name = str(body.name, 80); if (!name) errors.name = 'Add your name.';
  const em = checkEmail(body.email); if (em.error) errors.email = 'Add your email so we can reply.';
  const data = { kind, name, email: em.value };
  if (kind === 'pitch') {
    data.role = str(body.role, 120);
    data.title = str(body.title, 160); if (!data.title) errors.title = 'Give your talk a working title. It can change.';
    data.pitch = str(body.pitch, 2000); if (!data.pitch) errors.pitch = 'A few sentences is plenty.';
    data.format = ['talk', 'workshop', 'panel'].includes(body.format) ? body.format : 'talk';
  } else {
    data.company = str(body.company, 120); if (!data.company) errors.company = 'Add your company name.';
    data.tier = ['community', 'partner', 'headline', 'unsure'].includes(body.tier) ? body.tier : 'unsure';
    data.message = str(body.message, 2000);
  }
  return { errors, data };
}
