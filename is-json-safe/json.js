// is-json-safe/json.js
// Tiny, dependency-free JSON validator with basic safety limits.

// Options:
// - maxBytes: reject if raw length exceeds this
// - maxDepth: maximum nesting depth
// - maxKeys: maximum total object keys
// - maxStringLength: maximum length of any string value
// - blockKeys: array of disallowed key names (e.g. ["__proto__","constructor","prototype"])
// - returnValue: include parsed value in result when ok (default true)
const DEFAULTS = {
  maxBytes: 1_000_000,        // 1 MB
  maxDepth: 32,
  maxKeys: 50_000,
  maxStringLength: 100_000,
  blockKeys: ["__proto__", "constructor", "prototype"],
  returnValue: true,
};

/**
 * Validate JSON string and enforce limits.
 * @param {string} raw
 * @param {Partial<typeof DEFAULTS>} opts
 * @returns {{ok:boolean, issues:string[], value?:any, bytes:number, depth:number, keys:number}}
 */
export function isJsonSafe(raw, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const issues = [];
  const s = String(raw ?? "");
  const bytes = s.length;

  if (!s.trim()) return { ok: false, issues: ["empty"], bytes, depth: 0, keys: 0 };
  if (bytes > o.maxBytes) issues.push("too_large");

  let value;
  try {
    // JSON.parse is safe; reviver used to catch bad keys early
    value = JSON.parse(s, (k, v) => {
      if (o.blockKeys && o.blockKeys.includes(k)) {
        // Mark but still return value so full walk can proceed
        __markBadKey(issues, k);
      }
      return v;
    });
  } catch (e) {
    issues.push("parse_error");
    return { ok: false, issues, bytes, depth: 0, keys: 0 };
  }

  // Walk to measure depth/keys and enforce limits
  const { depth, keys } = analyze(value, o, issues);

  const ok = issues.length === 0;
  const out = { ok, issues: Array.from(new Set(issues)), bytes, depth, keys };
  if (ok && o.returnValue) out.value = value;
  return out;
}

function __markBadKey(issues, key) {
  issues.push(`blocked_key:${key}`);
}

function isPlainObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}

function analyze(root, o, issues) {
  let maxDepth = 0;
  let keyCount = 0;

  const stack = [{ v: root, d: 0 }];
  while (stack.length) {
    const { v, d } = stack.pop();
    if (d > maxDepth) maxDepth = d;
    if (d > o.maxDepth) { issues.push("too_deep"); break; }

    if (typeof v === "string") {
      if (v.length > o.maxStringLength) { issues.push("string_too_long"); break; }
      continue;
    }
    if (v == null || typeof v !== "object") continue;

    if (Array.isArray(v)) {
      for (let i = 0; i < v.length; i++) stack.push({ v: v[i], d: d + 1 });
    } else if (isPlainObject(v)) {
      const keys = Object.keys(v);
      keyCount += keys.length;
      if (keyCount > o.maxKeys) { issues.push("too_many_keys"); break; }
      for (const k of keys) {
        if (o.blockKeys && o.blockKeys.includes(k)) __markBadKey(issues, k);
        stack.push({ v: v[k], d: d + 1 });
      }
    }
  }
  return { depth: maxDepth, keys: keyCount };
}

/**
 * Minify JSON by re-stringifying. Returns "" on parse error.
 * @param {string} raw
 */
export function normalizeJson(raw) {
  try { return JSON.stringify(JSON.parse(String(raw ?? ""))); }
  catch { return ""; }
}

// Backwards-friendly alias
export const safeParseJson = isJsonSafe;
export default isJsonSafe;
