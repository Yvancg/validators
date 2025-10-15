// iban.js
// Zero dependencies. Uses SWIFT-derived JSON for IBAN validation (ISO 13616 + ISO 7064).
// Source: https://www.swift.com/swift-resource/11971/download
// Generated: 2025-10-15
// To update: download the latest registry, rebuild the JSON with the parser, and replace iban_registry_full.json.

import ibanRegistry from "./iban_registry_full.json" assert { type: "json" };

const REG = ibanRegistry;
const COUNTRY_LENGTHS = REG.maps.iban_length_by_code || {};
const BBAN_MAP = REG.maps.bban_by_code || {};

export function isIbanSafe(input, opts = {}) {
  const o = Object.assign(
    {
      allowCountries: undefined,
      blockCountries: undefined,
      strictCase: false,
      maxLength: 34,
      minLength: 15,
      strictStructure: true,
    },
    opts
  );

  const issues = [];
  const raw = (input ?? "").trim();

  if (!raw) return { ok: false, issues: ["empty"] };
  if (o.strictCase && /[a-z]/.test(raw)) issues.push("lowercase_disallowed");
  if (!/^[A-Za-z0-9\s]+$/.test(raw)) issues.push("non_alphanumeric");

  const normalized = raw.replace(/\s+/g, "").toUpperCase();

  if (normalized.length < o.minLength) issues.push("too_short");
  if (normalized.length > o.maxLength) issues.push("too_long");
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(normalized)) issues.push("bad_basic_format");

  const cc = normalized.slice(0, 2);
  const cd = normalized.slice(2, 4);

  if (!COUNTRY_LENGTHS[cc]) issues.push("country_not_in_registry");
  else if (normalized.length !== COUNTRY_LENGTHS[cc]) issues.push("bad_length_for_country");

  if (!/^\d{2}$/.test(cd)) issues.push("bad_check_digits");

  if (o.allowCountries && !o.allowCountries.includes(cc)) issues.push("country_not_allowed");
  if (o.blockCountries && o.blockCountries.includes(cc)) issues.push("country_blocked");

  if (!mod97Check(normalized)) issues.push("checksum_failed");

  if (o.strictStructure && COUNTRY_LENGTHS[cc] && BBAN_MAP[cc]?.structure) {
    const bban = normalized.slice(4);
    const spec = BBAN_MAP[cc];
    if (spec.length && bban.length !== spec.length) issues.push("bban_length_mismatch");
    const re = bbanRegex(spec.structure);
    if (re && !re.test(bban)) issues.push("bban_structure_mismatch");
  }

  const ok = issues.length === 0;
  return { ok, normalized: ok ? normalized : undefined, issues: Array.from(new Set(issues)) };
}

// Helpers
function mod97Check(iban) {
  const s = iban.slice(4) + iban.slice(0, 4);
  let rem = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 48 && c <= 57) {
      rem = (rem * 10 + (c - 48)) % 97;
    } else {
      const v = String(c - 55); // A->10
      for (let j = 0; j < v.length; j++) rem = (rem * 10 + (v.charCodeAt(j) - 48)) % 97;
    }
  }
  return rem === 1;
}

function bbanRegex(struct) {
  if (!struct) return null;
  const parts = struct.trim().replace(/\s+/g, "").split(/(?=\d+!)/);
  let pattern = "^";
  for (const t of parts) {
    const m = t.match(/^(\d+)!([anc])$/i);
    if (!m) return null;
    const count = Number(m[1]);
    const kind = m[2].toLowerCase();
    if (kind === "a") pattern += `[A-Z]{${count}}`;
    else if (kind === "n") pattern += `[0-9]{${count}}`;
    else pattern += `[A-Z0-9]{${count}}`;
  }
  pattern += "$";
  try {
    return new RegExp(pattern);
  } catch {
    return null;
  }
}
