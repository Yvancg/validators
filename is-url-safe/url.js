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
  if (typeof raw !== 'string') return '';
  try {
    const u = new URL(raw.trim());
    // Native serialization preserves non-default ports, credentials, path,
    // query and fragment. Never rebuild a URL from selected components.
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : '';
  } catch {
    return '';
  }
}
