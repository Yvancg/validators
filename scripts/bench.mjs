// scripts/bench.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

const ROOT = process.cwd();
const OUTDIR = path.join(ROOT, 'bench');
fs.mkdirSync(OUTDIR, { recursive: true });

// 1) Fixed mapping to preserve file names
const TARGETS = [
  { file: 'is-card-safe/card.js',   export: 'validateCard', out: 'card.json',   sample: '4111111111111111', iters: 1200 },
  { file: 'is-email-safe/email.js', export: 'isEmailSafe',  out: 'email.json',  sample: 'user.name+tag@example.co', iters: 15000 },
  { file: 'is-iban-safe/iban.js',   export: 'isIbanSafe',   out: 'iban.json',   sample: 'DE44500105175407324931', iters: 400 },
  { file: 'is-minify/minify.js',    export: 'minifyJS',     out: 'minify.json', sample: 'function x () { return 1 + 2 ; }', iters: 2000 },
  { file: 'is-phone-e164/phone.js', export: 'isPhoneE164',  out: 'phone.json',  sample: '+12025550123', iters: 8000 },
  { file: 'is-url-safe/url.js',     export: 'isUrlSafe',    out: 'url.json',    sample: 'https://example.com/path?q=1', iters: 15000 },
];

function badge(label, message) {
  return { schemaVersion: 1, label, message, color: 'informational' };
}

async function bench(fn, input, iters) {
  const warm = Math.min(100, Math.max(10, Math.floor(iters / 20)));
  for (let i = 0; i < warm; i++) {
    const r = fn(input);
    if (r && typeof r.then === 'function') await r;
  }
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) {
    const r = fn(input);
    if (r && typeof r.then === 'function') await r;
  }
  const ms = performance.now() - t0;
  return Math.max(1, Math.round(iters / (ms / 1000)));
}

for (const t of TARGETS) {
  const abs = path.join(ROOT, t.file);
  if (!fs.existsSync(abs)) {
    console.warn(`skip: ${t.file} not found`);
    continue;
  }
  let mod;
  try {
    mod = await import(pathToFileURL(abs).href);
  } catch (e) {
    console.error(`import failed: ${t.file} → ${e?.message || e}`);
    continue;
  }
  const fn = mod[t.export];
  if (typeof fn !== 'function') {
    console.warn(`skip: ${t.file} missing export ${t.export}`);
    continue;
  }

  const ops = await bench(fn, t.sample, t.iters);
  const data = badge(t.export, `${ops} ops/s`);
  const outPath = path.join(OUTDIR, t.out);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`wrote bench/${t.out} (${data.message})`);
}

console.log('bench complete');
