'use client';
import { EMAIL } from '@/lib/validate';

export function checkField(el) {
  const v = el.value.trim();
  if (el.required && !v) return el.dataset.req || 'This one’s needed.';
  if (el.type === 'email' && v && !EMAIL.test(v)) return 'That email looks incomplete. Check for a typo.';
  return '';
}

/** Validate every required field in a container; returns { ok, errors } and focuses the first bad one. */
export function checkAll(root) {
  const errors = {};
  root.querySelectorAll('input[required], textarea[required]').forEach(el => { const m = checkField(el); if (m) errors[el.name] = m; });
  const first = Object.keys(errors)[0];
  if (first) root.querySelector(`[name="${first}"]`)?.focus();
  return { ok: !first, errors };
}

export function Field({ id, label, name, error, hint, setError, textarea, optional, ...rest }) {
  const Tag = textarea ? 'textarea' : 'input';
  const describedBy = [hint && `${id}-hint`, `${id}-err`].filter(Boolean).join(' ');
  const onBlur = e => { if (e.target.value) setError?.(name, checkField(e.target)); };
  const onInput = e => { if (error) setError?.(name, checkField(e.target)); };
  return (
    <div className="field">
      <label htmlFor={id}>{label}{optional && <span style={{ fontWeight: 500, color: 'var(--muted)' }}> Optional</span>}</label>
      <Tag id={id} name={name} aria-invalid={error ? 'true' : 'false'} aria-describedby={describedBy} onBlur={onBlur} onInput={onInput} {...rest} />
      {hint && <span className="hint" id={`${id}-hint`}>{hint}</span>}
      <span className="error" id={`${id}-err`} aria-live="polite">{error || ''}</span>
    </div>
  );
}

/* Hidden honeypot field: bots fill it, people never see it. */
export const Honeypot = () => (
  <div aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}>
    <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
  </div>
);
