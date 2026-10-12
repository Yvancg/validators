/**
 * Validate canonical RFC 9562 UUIDs (versions 1–8, RFC variant).
 * Excludes nil/max UUIDs, URNs, braces and noncanonical strings.
 */
export function isUuidSafe(value, { version } = {}) {
  if (typeof value !== 'string') return false;
  if (version !== undefined && (!Number.isInteger(version) || version < 1 || version > 8)) return false;
  const match = /^[\da-f]{8}-[\da-f]{4}-([1-8])[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.exec(value);
  return !!match && (version === undefined || Number(match[1]) === version);
}
