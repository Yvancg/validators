/**
 * E.164 helpers
 * - normalizePhone: strip punctuation and spaces, ensure leading '+'
 * - isE164: strict E.164 check: '+' then 7–15 digits, first digit 1–9
 * - validatePhone: loose input → normalize → strict check
 * - validateOptionalE164: allow empty string or valid E.164
 */

/** @param {string} input */
export function normalizePhone(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return '';
  const cleaned = raw.replace(/[()\-\s._]/g, '');
  const s = cleaned.startsWith('00') ? '+' + cleaned.slice(2) : cleaned;
  // Preserve invalid embedded '+' or other characters so validation rejects them.
  return s.startsWith('+') ? s : '+' + s;
}

/** @param {string} input */
export function isE164(input) {
  const v = String(input ?? '').trim();
  // '+' then 7–15 digits; no leading zero after '+'
  return /^\+[1-9]\d{6,14}$/.test(v);
}

/** @param {string} input */
export function validatePhone(input) {
  const v = normalizePhone(input);
  return isE164(v);
}

/** @param {string} input */
export function validateOptionalE164(input) {
  const v = normalizePhone(input);
  return v === '' || isE164(v);
}

/** @param {string} raw */
export function isPhoneE164(raw) {
  return isE164(normalizePhone(String(raw)));
}

// Default export kept for convenience
export default isPhoneE164;
