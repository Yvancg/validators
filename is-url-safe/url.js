/**
 * is-url-safe
 * -------------
 * Strict HTTP(S)-only URL validator with zero dependencies.
 * Rejects JavaScript/data/mailto URLs and invalid hostnames.
 */

export function isUrlSafe(raw) {
  if (typeof raw !== 'string') return false;
  const s = raw.trim();
  if (!s) return false;

  let u;
  try {
    u = new URL(s);
  } catch {
    return false;
  }

  // Only http or https
  if (!/^https?:$/i.test(u.protocol)) return false;

  // Host must exist, no spaces, no control chars
  if (!u.hostname || /[\s<>]/.test(u.hostname)) return false;

  // Optional path and query allowed
  return true;
}

export function normalizeUrl(raw) {
  try {
    const u = new URL(raw.trim());
    return `${u.protocol}//${u.hostname}${u.pathname}${u.search}${u.hash}`;
  } catch {
    return '';
  }
}
