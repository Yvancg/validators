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
  if (!/^[0-9a-fA-F:.]+$/.test(s) || s.includes(':::')) return false;
  // IPv4-embedded addresses use two 16-bit groups.
  if (s.includes('.')) {
    const at = s.lastIndexOf(':');
    if (at < 0 || !isIPv4Address(s.slice(at + 1))) return false;
    s = s.slice(0, at + 1) + '0:0';
  }
  const pieces = s.split('::');
  if (pieces.length > 2) return false;
  const parse = part => part ? part.split(':') : [];
  const groups = parse(pieces[0]).concat(parse(pieces[1] ?? ''));
  if (!groups.every(g => /^[0-9a-fA-F]{1,4}$/.test(g))) return false;
  return pieces.length === 2 ? groups.length < 8 : groups.length === 8;
}

export function isIPv4(raw) { const r = isIpSafe(raw); return r.version === 4 && r.ok; }
export function isIPv6(raw) { const r = isIpSafe(raw); return r.version === 6 && r.ok; }
export default isIpSafe;
