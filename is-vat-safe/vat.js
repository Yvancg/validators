// is-vat-safe/vat.js
// EU VAT ID pattern validator (no checksums). ESM. No deps.

const RX = {
  AT: /^ATU\d{8}$/,
  BE: /^BE0?\d{9}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,9,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  EL: /^EL\d{9}$/,        // Greece uses EL
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/,
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE\d{7}[A-W][A-I]?$/, // simplified
  IT: /^IT\d{11}$/,
  LT: /^LT(\d{9}|\d{12})$/,
  LU: /^LU\d{8}$/,
  LV: /^LV\d{11}$/,
  MT: /^MT\d{8}$/,
  NL: /^NL\d{9}B\d{2}$/,
  PL: /^PL\d{10}$/,
  PT: /^PT\d{9}$/,
  RO: /^RO\d{2,10}$/,
  SE: /^SE\d{12}$/,
  SI: /^SI\d{8}$/,
  SK: /^SK\d{10}$/,
  // Optional non-EU common:
  GB: /^GB(\d{9}|\d{12}|GD\d{3}|HA\d{3})$/
};

const SUPPORTED = new Set(Object.keys(RX));

/** Remove spaces, dots, dashes. Uppercase. */
export function normalizeVat(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  return s.replace(/[\s.\-_/]/g, "").toUpperCase();
}

/** Return 2-letter prefix if present and alphabetic, else "" */
export function detectCountry(s) {
  const n = normalizeVat(s);
  return /^[A-Z]{2}/.test(n) ? n.slice(0, 2) : "";
}

/**
 * Validate VAT format against country patterns only.
 * @param {string} raw
 * @param {{allowed?: string[], blocked?: string[]}} [opts]
 * @returns {{ok:boolean, country?:string, normalized?:string, issues:string[]}}
 */
export function isVatSafe(raw, opts = {}) {
  const issues = [];
  const normalized = normalizeVat(raw);
  if (!normalized) return { ok: false, issues: ["empty"] };

  const cc = detectCountry(normalized);
  if (!cc) issues.push("missing_prefix");
  if (cc && opts.allowed && !opts.allowed.includes(cc)) issues.push("country_not_allowed");
  if (cc && opts.blocked && opts.blocked.includes(cc)) issues.push("country_blocked");

  if (!cc || !SUPPORTED.has(cc)) {
    issues.push("country_unsupported");
    return { ok: false, issues: uniq(issues) };
  }

  const re = RX[cc];
  if (!re.test(normalized)) issues.push("bad_pattern");

  const ok = issues.length === 0;
  return { ok, country: cc, normalized: ok ? normalized : undefined, issues: uniq(issues) };
}

function uniq(arr) { return Array.from(new Set(arr)); }

export default isVatSafe;
