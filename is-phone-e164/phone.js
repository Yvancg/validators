/**
 * E.164 helpers
 * - normalizePhone: strip punctuation and spaces, ensure leading '+'
 * - isE164: strict E.164 check: '+' then 7–15 digits, first digit 1–9
 * - validateOptionalE164: allow empty string or valid E.164
 */

/** @param {string} input */
export function normalizePhone(input) {
  const s = String(input ?? '').trim();
  if (!s) return '';
  // Remove common separators and parentheses
  const digits = s.replace(/[()\-\s._]/g, '').replace(/^00/, '+'); // 00 -> +
  // Ensure single leading '+'
  if (digits.startsWith('+')) return '+' + digits.slice(1).replace(/\+/g, '');
  return '+' + digits.replace(/\+/g, '');
}

/** @param {string} input */
export function isE164(input) {
  const v = String(input ?? '').trim();
  // '+' then 7–15 digits; no leading zero after '+'
  return /^\+[1-9]\d{6,14}$/.test(v);
}

/** @param {string} input */
export function validateOptionalE164(input) {
  const v = normalizePhone(input);
  return v === '' || isE164(v);
}
