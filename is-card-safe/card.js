// card.js 
// Dependency-free credit card validator + brand detector.
// Normalizes to digits-only. Runs Luhn. Identifies major brands by IIN ranges.

export function validateCard(input, opts = {}) {
  const o = Object.assign(
    {
      allowBrands: undefined,   // e.g. ['visa','mastercard']
      blockBrands: undefined,   // e.g. ['unionpay']
      minLength: 12,
      maxLength: 19
    },
    opts
  );

  const issues = [];
  const raw = String(input ?? "").trim();
  if (!raw) return res(false, null, null, ['empty']);

  // keep digits only
  const digits = raw.replace(/\D+/g, "");
  if (!/^\d+$/.test(digits)) issues.push('non_digit_chars');
  if (digits.length < o.minLength) issues.push('too_short');
  if (digits.length > o.maxLength) issues.push('too_long');

  const brand = detectBrand(digits);
  if (!brand) issues.push('unknown_brand');

  const BRAND_LENGTHS = {
    visa: [13,16,19],
    mastercard: [16],
    amex: [15],
    discover: [16,17,18,19],
    jcb: [16,17,18,19],
    diners: [14,15,16],
    unionpay: [16,17,18,19],
    maestro: [12,13,14,15,16,17,18,19],
    mir: [16,17,18,19],
  };
  if (brand && BRAND_LENGTHS[brand] && !BRAND_LENGTHS[brand].includes(digits.length)) {
    issues.push('length_not_allowed_for_brand');
  }

  if (o.allowBrands && brand && !o.allowBrands.includes(brand)) issues.push('brand_not_allowed');
  if (o.blockBrands && brand && o.blockBrands.includes(brand)) issues.push('brand_blocked');

  if (!luhnOk(digits)) issues.push('luhn_failed');

  const ok = issues.length === 0;
  return res(ok, digits, brand, issues);
}

export function detectBrand(d) {
  // d = digits-only string
  // Order matters. Check more specific first.
  if (/^4\d{12}(\d{3})?(\d{3})?$/.test(d)) return 'visa'; // 13,16,19
  // MasterCard: 51–55 or 2221–2720
  if (/^(5[1-5]\d{14}|2(2[2-9]\d{2}|[3-6]\d{3}|7([01]\d{2}|20\d))\d{12})$/.test(d)) return 'mastercard';
  // American Express: 34, 37 length 15
  if (/^3[47]\d{13}$/.test(d)) return 'amex';
  // Discover: 6011, 622126–622925, 644–649, 65; length 16–19
  if (/^(6011\d{12}|65\d{14}|64[4-9]\d{13}|622(12[6-9]|1[3-9]\d|[2-8]\d{2}|9([01]\d|2[0-5]))\d{10,12})$/.test(d))
    return 'discover';
  // JCB: 3528–3589, length 16–19
  if (/^35(2[89]|[3-8]\d)\d{12,15}$/.test(d)) return 'jcb';
  // Diners Club: 300–305, 3095, 36, 38–39; classic length 14 (allow 14–16 seen in practice)
  if (/^(3(0[0-5]\d{11}|095\d{10}|6\d{12}|[89]\d{12}))\d{0,2}$/.test(d)) return 'diners';
  // UnionPay: 62…, length 16–19
  if (/^62\d{14,17}$/.test(d)) return 'unionpay';
  // Maestro: 50, 56–58, 63, 67; length 12–19
  if (/^(50|56|57|58|63|67)\d{10,17}$/.test(d)) return 'maestro';
  // MIR: 2200–2204; length 16–19
  if (/^220[0-4]\d{12,15}$/.test(d)) return 'mir';
  return null;
}

export function luhnOk(d) {
  let sum = 0, alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d.charCodeAt(i) - 48;
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

function res(ok, normalized, brand, issues) {
  return {
    ok,
    normalized: ok ? normalized : undefined, // digits only
    brand: brand || undefined,
    last4: normalized ? normalized.slice(-4) : undefined,
    issues: Array.from(new Set(issues))
  };
}

// Example:
// validateCard('4111 1111 1111 1111') -> { ok:true, normalized:'4111111111111111', brand:'visa', last4:'1111', issues:[] }
