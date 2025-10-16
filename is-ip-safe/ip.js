/**
 * Safe, dependency-free IP validator.
 * Supports IPv4 and IPv6 without regex backtracking risk.
 * Returns object form with issues list for transparency.
 */

export function isIpSafe(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return { ok: false, version: null, issues: ['empty'] };

  if (raw.includes(':')) return validateIPv6(raw);
  if (raw.includes('.')) return validateIPv4(raw);
  return { ok: false, version: null, issues: ['unknown_format'] };
}

function validateIPv4(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return { ok: false, version: 4, issues: ['bad_segment_count'] };

  const issues = [];
  for (const part of parts) {
    if (!/^\d+$/.test(part)) issues.push('non_numeric');
    else {
      const n = Number(part);
      if (n < 0 || n > 255) issues.push('out_of_range');
      if (part.length > 1 && part.startsWith('0')) issues.push('leading_zero');
    }
  }
  const ok = issues.length === 0;
  return { ok, version: 4, issues };
}

function validateIPv6(ip) {
  const parts = ip.split(':');
  if (parts.length < 3 || parts.length > 8)
    return { ok: false, version: 6, issues: ['bad_segment_count'] };

  const issues = [];
  for (const part of parts) {
    if (part === '') continue; // compressed ::
    if (!/^[0-9a-fA-F]{1,4}$/.test(part)) issues.push('invalid_hex_group');
  }
  const ok = issues.length === 0;
  return { ok, version: 6, issues };
}

export function isIPv4(raw) {
  return isIpSafe(raw).version === 4 && isIpSafe(raw).ok;
}

export function isIPv6(raw) {
  return isIpSafe(raw).version === 6 && isIpSafe(raw).ok;
}

export default isIpSafe;
