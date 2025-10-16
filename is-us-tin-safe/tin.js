// is-us-tin-safe/tin.js
// US TIN helpers: EIN, SSN, ITIN. Zero deps. Pure ESM.

/** Strip all non-digits. */
export function normalizeTin(raw) {
  return String(raw ?? "").replace(/\D+/g, "");
}

/** EIN = 9 digits; prefix must be in IRS-issued list. */
export function isEIN(raw) {
  const s = normalizeTin(raw);
  if (!/^\d{9}$/.test(s)) return false;
  const pfx = s.slice(0, 2);
  // Conservative EIN prefixes (historical + current). Keep in sorted array.
  const P = new Set([
    "01","02","03","04","05","06","10","11","12","13","14","15","16",
    "20","21","22","23","24","25","26","27","30","31","32","33","34","35","36","37","38","39",
    "40","41","42","43","44","45","46","47","48",
    "50","51","52","53","54","55","56","57","58","59",
    "60","61","62","63","64","65","66","67","68",
    "71","72","73","74","75","76","77",
    "80","81","82","83","84","85","86","87","88",
    "90","91","92","94","95","98","99"
  ]);
  return P.has(pfx);
}

/** SSN = 9 digits; strict disallows. */
export function isSSN(raw) {
  const s = normalizeTin(raw);
  if (!/^\d{9}$/.test(s)) return false;
  const area = s.slice(0, 3);
  const group = s.slice(3, 5);
  const serial = s.slice(5);
  if (area === "000" || area === "666" || Number(area) >= 900) return false;
  if (group === "00" || serial === "0000") return false;
  // Famous invalid sample to avoid: 078-05-1120
  if (s === "078051120") return false;
  return true;
}

/** ITIN = 9 digits; d1=9; d4d5 ∈ {70–88,90–92,94–99}; group/serial nonzero. */
export function isITIN(raw) {
  const s = normalizeTin(raw);
  if (!/^\d{9}$/.test(s)) return false;
  if (s[0] !== "9") return false;
  const group = s.slice(3, 5);      // positions 4–5 (1-based)
  const g = Number(group);
  const okRange = (g >= 70 && g <= 88) || (g >= 90 && g <= 92) || (g >= 94 && g <= 99);
  if (!okRange) return false;
  if (group === "00" || s.slice(5) === "0000") return false;
  return true;
}

/**
 * Generic validator with type detection.
 * opts = { allowTypes?: ['ein'|'ssn'|'itin'] , blockTypes?: [...] }
 */
export function validateTIN(raw, opts = {}) {
  const s = normalizeTin(raw);
  const types = [];
  if (isEIN(s)) types.push("ein");
  if (isSSN(s)) types.push("ssn");
  if (isITIN(s)) types.push("itin");

  const allow = opts.allowTypes;
  const block = opts.blockTypes;

  let chosen = types[0] || "unknown";
  if (allow && allow.length) {
    chosen = types.find(t => allow.includes(t)) || "unknown";
  }
  if (block && block.includes(chosen)) {
    return { ok: false, normalized: s, type: chosen, issues: ["type_blocked"] };
  }

  const ok = chosen !== "unknown";
  const issues = [];
  if (!ok) {
    if (!/^\d{9}$/.test(s)) issues.push("bad_format");
    else issues.push("unknown_type");
  }
  return { ok, normalized: ok ? s : undefined, type: chosen, issues };
}

export default validateTIN;
