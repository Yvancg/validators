// is-iban-valid.ts
// Zero deps. Complies with ISO 13616 structure + ISO 7064 Mod-97.
// Source of country lengths: SWIFT IBAN Registry (update as it changes).

export type SafeResult<T> = {
  ok: boolean;
  normalized?: T;
  issues: string[];
};

export type IbanSafeOptions = {
  allowCountries?: string[];  // e.g. ["DE","FR","NL"]
  blockCountries?: string[];  // e.g. ["IR"]
  strictCase?: boolean;       // if true, reject lowercase before normalization
  maxLength?: number;         // default 34 per ISO 13616
  minLength?: number;         // default 15 is practical lower bound
};

const DEFAULTS: IbanSafeOptions = {
  allowCountries: undefined,
  blockCountries: undefined,
  strictCase: false,
  maxLength: 34,
  minLength: 15,
};

export function isIbanSafe(input: string, opts: IbanSafeOptions = {}): SafeResult<string> {
  const o = { ...DEFAULTS, ...opts };
  const issues: string[] = [];
  const raw = (input ?? "").trim();

  if (!raw) return { ok: false, issues: ["empty"] };
  if (o.strictCase && /[a-z]/.test(raw)) issues.push("lowercase_disallowed");
  if (!/^[A-Za-z0-9\s]+$/.test(raw)) issues.push("non_alphanumeric");

  // Normalize to electronic format: uppercase, no spaces
  const normalized = raw.replace(/\s+/g, "").toUpperCase();

  // Basic structure checks
  if (normalized.length < o.minLength) issues.push("too_short");
  if (normalized.length > o.maxLength) issues.push("too_long");
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) issues.push("bad_basic_format");

  const cc = normalized.slice(0, 2);
  const cd = normalized.slice(2, 4);

  if (!COUNTRY_LENGTHS[cc]) issues.push("country_not_in_registry");
  else if (normalized.length !== COUNTRY_LENGTHS[cc]) issues.push("bad_length_for_country");

  if (!/^\d{2}$/.test(cd)) issues.push("bad_check_digits");

  // Country policy
  if (o.allowCountries && !o.allowCountries.includes(cc)) issues.push("country_not_allowed");
  if (o.blockCountries && o.blockCountries.includes(cc)) issues.push("country_blocked");

  // ISO 7064 Mod-97 check
  if (!mod97Check(normalized)) issues.push("checksum_failed");

  const ok = issues.length === 0;
  return { ok, normalized: ok ? normalized : undefined, issues: uniq(issues) };
}

// -------- Helpers --------

function mod97Check(iban: string): boolean {
  // Move first 4 chars to end, convert letters A=10..Z=35, compute big-int mod 97
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    const ch = rearranged.charCodeAt(i);
    const value = ch >= 65 && ch <= 90 ? String(ch - 55) : String.fromCharCode(ch); // A->10 ... Z->35
    for (let j = 0; j < value.length; j++) {
      remainder = (remainder * 10 + (value.charCodeAt(j) - 48)) % 97;
    }
  }
  return remainder === 1;
}

const uniq = (xs: string[]) => Array.from(new Set(xs));

// -------- Country lengths (fill from SWIFT registry) --------
// Update when SWIFT releases change. Values are IBAN total length for country code.
// Release 99 (Dec 2024) reference.  [oai_citation:1‡Swift](https://www.swift.com/sites/default/files/files/iban-registry_3.pdf)
const COUNTRY_LENGTHS: Record<string, number> = {
  // Sample entries. Paste full table from the SWIFT PDF for complete coverage.
  // EU core
  AT: 20, BE: 16, BG: 22, HR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, EE: 20,
  ES: 24, FI: 18, FR: 27, GI: 23, GR: 27, HU: 28, IE: 22, IS: 26, IT: 27,
  LT: 20, LU: 20, LV: 21, MT: 31, NL: 18, NO: 15, PL: 28, PT: 25, RO: 24,
  SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, MC: 27, VA: 22, AD: 24, MC: 27,
  // UK + related
  GB: 22, GG: 22, JE: 22, IM: 22, GI: 23,
  // Middle East
  AE: 23, BH: 22, IL: 23, JO: 30, KW: 30, LB: 28, OM: 23, QA: 29, PS: 29,
  // Africa
  EG: 29, MR: 27, BI: 27, BF: 27, BJ: 28, CI: 28, CM: 27, CG: 27, GA: 27,
  GW: 25, MG: 27, ML: 28, MZ: 25, NE: 28, SN: 28, TG: 28, TD: 27, KM: 27,
  // Americas
  BR: 29, DO: 28, SV: 28, GT: 28, CR: 22, FO: 18, GL: 18,
  // Asia
  AZ: 28, GE: 22, KZ: 20, PK: 24, RU: 33, TL: 23, TR: 26, IR: 26, IQ: 23, XK: 20,
  // Oceania
  // none currently using IBAN
};
