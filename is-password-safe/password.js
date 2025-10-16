// is-password-safe/password.js
// O(n) scans. No innerHTML anywhere in demos.

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
};

export function validatePassword(password, opts = {}) {
  const cfg = { ...DEFAULTS, ...opts };
  if (typeof password !== 'string') return fail('not a string');

  const reasons = [];
  const suggestions = [];
  const sets = {
    lower: LOWER.test(password),
    upper: UPPER.test(password),
    digit: DIGIT.test(password),
    symbol: SYMBOL.test(password)
  };

  const length = [...password].length; // unicode-aware
  if (length < cfg.minLength) reasons.push(`length < ${cfg.minLength}`);
  if (length > cfg.maxLength) reasons.push(`length > ${cfg.maxLength}`);

  for (const need of cfg.requireSets) if (!sets[need]) reasons.push(`missing ${need}`);

  const dictHit = isDictionaryLike(password, cfg.dictionaries);
  if (dictHit) reasons.push(`dictionary-like: ${dictHit}`);

  if (hasSequentialRun(password, 4)) reasons.push('sequential characters');
  if (hasRepeatedBlock(password, 3)) reasons.push('repeated block');

  const entropyBits = estimateEntropyBits(password, sets);
  if (entropyBits < cfg.minEntropy) reasons.push(`entropy < ${cfg.minEntropy}b`);

  if (reasons.length) {
    if (length < cfg.minLength) suggestions.push(`use ≥${cfg.minLength} chars`);
    for (const s of ['lower','upper','digit','symbol']) if (!sets[s]) suggestions.push(`add ${s}`);
    if (dictHit) suggestions.push('avoid common words and keyboard patterns');
    suggestions.push('avoid sequences and repeats');
  }

  const score =
    entropyBits >= 100 ? 4 :
    entropyBits >= 80  ? 3 :
    entropyBits >= 60  ? 2 :
    entropyBits >= 40  ? 1 : 0;

  return {
    ok: reasons.length === 0,
    score,
    entropyBits: Math.round(entropyBits),
    length,
    sets,
    reasons,
    suggestions
  };
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
  for (let i = 0; i <= s.length - 4; i++) {
    for (let j = i + 4; j <= s.length; j++) {
      if (dict.has(s.slice(i, j))) return s.slice(i, j);
    }
  }
  return null;
}

function hasSequentialRun(pw, runLen = 4) {
  const codes = [...pw].map(ch => ch.codePointAt(0));
  let up = 1, down = 1;
  for (let i = 1; i < codes.length; i++) {
    if (codes[i] === codes[i-1] + 1) { up++; down = 1; }
    else if (codes[i] === codes[i-1] - 1) { down++; up = 1; }
    else { up = 1; down = 1; }
    if (up >= runLen || down >= runLen) return true;
  }
  const rows = ['abcdefghijklmnopqrstuvwxyz','qwertyuiop','asdfghjkl','zxcvbnm','0123456789'];
  const lower = pw.toLowerCase();
  for (const row of rows) {
    if (hasRunInRow(lower, row, runLen) || hasRunInRow(lower, [...row].reverse().join(''), runLen)) return true;
  }
  return false;
}
function hasRunInRow(s, row, n) {
  for (let i = 0; i <= row.length - n; i++) if (s.includes(row.slice(i, i+n))) return true;
  return false;
}

function hasRepeatedBlock(pw, minBlock = 3) {
  const s = [...pw].join('');
  for (let i = 2; i < s.length; i++) if (s[i] === s[i-1] && s[i-1] === s[i-2]) return true;
  for (let k = 2; k <= 4; k++) {
    for (let i = 0; i + 2*k <= s.length; i++) {
      const a = s.slice(i, i+k), b = s.slice(i+k, i+2*k);
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
  if (sets.symbol) pool += 33;
  if (!pool) return 0;

  let bits = [...pw].length * Math.log2(pool);
  if (hasSequentialRun(pw, 4)) bits -= 10;
  if (hasRepeatedBlock(pw, 3)) bits -= 10;
  const trimmed = pw.replace(/[^A-Za-z]/g,'').toLowerCase();
  if (trimmed && DEFAULT_DICT.has(trimmed)) bits -= 12;
  return Math.max(0, bits);
}