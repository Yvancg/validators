/**
 * Dependency-free IPv4/IPv6 validation. No DNS lookup or external parser.
 */
export function isIpSafe(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return { ok: false, version: null, issues: ['empty'] };
  if (raw.includes(':')) return result(isIPv6Address(raw), 6);
  if (raw.includes('.')) return result(isIPv4Address(raw), 4);
  return { ok: false, version: null, issues: ['unknown_format'] };
}

function result(ok, version) {
  return { ok, version, issues: ok ? [] : ['invalid_address'] };
}

function isIPv4Address(s) {
  const parts = s.split('.');
  return parts.length === 4 && parts.every(p =>
    /^(0|[1-9]\d{0,2})$/.test(p) && Number(p) <= 255
  );
}

function isIPv6Address(s) {
  if (!/^[0-9a-fA-F:.]+$/.test(s)) return false;
  if (s.includes(':::')) return false;
  const compressed = s.includes('::');
  if (compressed && s.indexOf('::') !== s.lastIndexOf('::')) return false;
  if (!compressed && (s.startsWith(':') || s.endsWith(':'))) return false;

  let groups = s.split(':');
  // IPv4-embedded forms count as two 16-bit groups.
  const last = groups[groups.length - 1];
  if (last.includes('.')) {
    if (!isIPv4Address(last)) return false;
    groups = groups.slice(0, -1).concat(['0', '0']);
  }
  if (compressed) {
    // split() creates two empty entries for :: (one at each side).
    const emptyCount = groups.filter(g => g === '').length;
    if (emptyCount !== 2) return false;
    const nonEmpty = groups.filter(Boolean);
    return nonEmpty.length < 8 && nonEmpty.every(g => /^[\da-fA-F]{1,4}$/.test(g));
  }
  return groups.length === 8 && groups.every(g => /^[\da-fA-F]{1,4}$/.test(g));
}

export function isIPv4(raw) { const r = isIpSafe(raw); return r.version === 4 && r.ok; }
export function isIPv6(raw) { const r = isIpSafe(raw); return r.version === 6 && r.ok; }
export default isIpSafe;
