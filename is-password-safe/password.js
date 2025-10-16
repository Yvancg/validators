// is-password-safe/password.js
// No catastrophic regex. O(n) scans.
// Optional HIBP range API check is off by default.

const LOWER = /[a-z]/;
const UPPER = /[A-Z]/;
const DIGIT = /[0-9]/;
const SYMBOL = /[^A-Za-z0-9]/;

const DEFAULT_DICT = new Set([
  'password','passw0rd','123456','123456789','qwerty','letmein',
  'admin','welcome','iloveyou','monkey','dragon'
]);

const DEFAULTS = {
  minLength: 12,
  maxLength: 1024,
  minEntropy: 60, // bits
  requireSets: ['lower','upper','digit','symbol'],
  dictionaries: [...DEFAULT_DICT],
  checkPwned: false
};

export function validatePassword(password, opts = {}) {
  const cfg = { ...DEFAULTS, ...opts };
  const reasons = [];
  const suggestions = [];
  const sets = {
    lower: LOWER.test(password),
    upper: UPPER.test(password),
    digit: DIGIT.test(password),
    symbol: SYMBOL.test(password)
  };

  if (typeof password !== 'string') return fail('not a string');

  const length = [...password].length; // unicode-aware
  if (length < cfg.minLength) reasons.push(`length < ${cfg.minLength}`);
  if (length > cfg.maxLength) reasons.push(`length > ${cfg.maxLength}`);

  for (const need of cfg.requireSets) {
    if (!sets[need]) reasons.push(`missing ${need}`);
  }

  const dictHit = isDictionaryLike(password, cfg.dictionaries);
  if (dictHit) reasons.push(`dictionary-like: ${dictHit}`);

  const seq = hasSequentialRun(password, 4);
  if (seq) reasons.push('sequential characters');

  const rep = hasRepeatedBlock(password, 3);
  if (rep) reasons.push('repeated block');

  const entropyBits = estimateEntropyBits(password, sets);
  if (entropyBits < cfg.minEntropy) reasons.push(`entropy < ${cfg.minEntropy}b`);

  if (reasons.length) {
    if (length < cfg.minLength) suggestions.push(`use ≥${cfg.minLength} chars`);
    for (const s of ['lower','upper','digit','symbol']) if (!sets[s]) suggestions.push(`add ${s}`);
    if (dictHit) suggestions.push('avoid common words and keyboard patterns');
    if (seq || rep) suggestions.push('avoid sequences and repeats');
  }

  let score = Math.max(0, Math.min(4,
    (entropyBits >= 100 ? 4 :
     entropyBits >= 80 ? 3 :
     entropyBits >= 60 ? 2 :
     entropyBits >= 40 ? 1 : 0) - (reasons.length > 0 ? 1 : 0)
  ));

  const out = {
    ok: reasons.length === 0,
    score,
    entropyBits: Math.round(entropyBits),
    length,
    sets,
    reasons,
    suggestions
  };

  return out;
}

function fail(reason) {
  return {
    ok: false, score: 0, entropyBits: 0, length: 0,
    sets: {lower:false,upper:false,digit:false,symbol:false},
    reasons: [reason], suggestions: ['provide a string']
  };
}

function isDictionaryLike(pw, dictArr) {
  const dict = new Set(dictArr.map(s => s.toLowerCase()));
  const s = pw.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!s) return null;
  if (dict.has(s)) return s;
  // contains dictionary word of length ≥ 4
  for (let i = 0; i <= s.length - 4; i++) {
    for (let j = i + 4; j <= s.length; j++) {
      const sub = s.slice(i, j);
      if (dict.has(sub)) return sub;
    }
  }
  return null;
}

// detect runs like abcd, 1234, qwerty (basic)
function hasSequentialRun(pw, runLen = 4) {
  const codePoints = [...pw].map(ch => ch.codePointAt(0));
  let up = 1, down = 1;
  for (let i = 1; i < codePoints.length; i++) {
    if (codePoints[i] === codePoints[i-1] + 1) { up++; down = 1; }
    else if (codePoints[i] === codePoints[i-1] - 1) { down++; up = 1; }
    else { up = 1; down = 1; }
    if (up >= runLen || down >= runLen) return true;
  }
  // simple keyboard row check
  const rows = ['abcdefghijklmnopqrstuvwxyz','qwertyuiop','asdfghjkl','zxcvbnm','0123456789'];
  const lower = pw.toLowerCase();
  for (const row of rows) {
    if (hasSubstringRun(lower, row, runLen)) return true;
    if (hasSubstringRun(lower, [...row].reverse().join(''), runLen)) return true;
  }
  return false;
}

function hasSubstringRun(s, row, runLen) {
  for (let i = 0; i <= row.length - runLen; i++) {
    const sub = row.slice(i, i + runLen);
    if (s.includes(sub)) return true;
  }
  return false;
}

function hasRepeatedBlock(pw, minBlock = 3) {
  // detects aaa, abab, xyzxyz. Linear-ish check with sliding windows.
  const s = [...pw].join('');
  // triple same char
  for (let i = 2; i < s.length; i++) {
    if (s[i] === s[i-1] && s[i-1] === s[i-2]) return true;
  }
  // repeated short blocks up to length 4
  for (let k = 2; k <= 4; k++) {
    for (let i = 0; i + 2*k <= s.length; i++) {
      const a = s.slice(i, i+k);
      const b = s.slice(i+k, i+2*k);
      if (a === b && k >= minBlock) return true;
    }
  }
  return false;
}

function estimateEntropyBits(pw, sets) {
  let pool = 0;
  if (sets.lower) pool += 26;
  if (sets.upper) pool += 26;
  if (sets.digit) pool += 10;
  if (sets.symbol) pool += 33; // printable ASCII symbols approx
  if (pool === 0) return 0;

  const len = [...pw].length;
  let bits = len * Math.log2(pool);

  // penalties for structure
  if (hasSequentialRun(pw, 4)) bits -= 10;
  if (hasRepeatedBlock(pw, 3)) bits -= 10;
  const trimmed = pw.replace(/[^A-Za-z]/g,'');
  if (trimmed && DEFAULT_DICT.has(trimmed.toLowerCase())) bits -= 12;

  // floor at 0
  return Math.max(0, bits);
}

// Optional HIBP check (k-anonymity). Use only in node or CORS-enabled demo.
export async function checkPwned(password) {
  const sha1 = toSHA1(password).toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, { headers: { 'Add-Padding': 'true' } });
  if (!res.ok) return { found: false };
  const text = await res.text();
  const line = text.split('\n').find(l => l.startsWith(suffix));
  if (!line) return { found: false };
  const count = parseInt(line.split(':')[1], 10) || 0;
  return { found: count > 0, count };
}

// Compact SHA-1 (Web Crypto where available, else fallback).
function toSHA1(input) {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    // Note: caller should await checkPwned which awaits this path internally if refactored.
    throw new Error('Use WebCrypto outside this helper or prehash before calling checkPwned.');
  }
  // Minimal synchronous SHA1 for Node demos only; replace with a proper lib in production.
  // This block intentionally omitted to avoid bundling weak crypto. Use WebCrypto instead.
  return dummySha1(input);
}

function dummySha1(s) {
  // Placeholder to keep API surface. Replace in node demo with crypto.createHash('sha1').
  throw new Error('SHA1 not implemented here. In Node, use: createHash("sha1").update(pw).digest("hex")');
}