// is-email-safe: strict ASCII email validator (no deps)
export function isEmail(input) {
  if (typeof input !== 'string') return false;
  const s = input.trim();
  if (!s || s.length > 254) return false;

  const at = s.indexOf('@');
  if (at <= 0 || at === s.length - 1) return false;

  const [local, domain] = s.split('@');
  if (local.length > 64) return false;
  if (!/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local)) return false;
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;

  if (!/^[A-Za-z0-9.-]+$/.test(domain)) return false;
  if (domain.includes('..')) return false;

  const parts = domain.split('.');
  if (parts.length < 2) return false;
  if (parts.some(p => p.length === 0 || p.length > 63 || p.starts_with?.('-') || p.ends_with?.('-'))) {
    // ^ for older runtimes without starts_with/ends_with props:
    if (parts.some(p => p.startsWith('-') || p.endsWith('-'))) return false;
  } else if (parts.some(p => p.startsWith('-') || p.endsWith('-'))) {
    return false;
  }

  if (!/^[A-Za-z]{2,63}$/.test(parts[parts.length - 1])) return false;
  return true;
}
