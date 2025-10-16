// scripts/bench.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

const ROOT = process.cwd();

function listJsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsFiles(p));
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(p);
  }
  return out;
}

const files = listJsFiles(ROOT).filter(f => /\/is-[^/]+\/.+\.js$/.test(f));

// sample inputs per known export; default for unknown
const SAMPLE = {
  minifyJS:    { input: 'function x () { return 1 + 2 ; }', iters: 2000 },
  minifyCSS:   { input: 'body { color : red ; margin : 0 ; }', iters: 2000 },
  isUrlSafe:   { input: 'https://example.com/path?q=1', iters: 15000 },
  isEmailSafe: { input: 'user.name+tag@example.co', iters: 15000 },
  isIbanSafe:  { input: 'DE44500105175407324931', iters: 400 },
  isPhoneE164: { input: '+12025550123', iters: 8000 },
  validateCard:{ input: '4111111111111111', iters: 1200 },
};
const DEFAULT = { input: 'example', iters: 5000 };

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

fs.mkdirSync(path.join(ROOT, 'bench'), { recursive: true });

for (const file of files) {
  let mod;
  try {
    mod = await import(pathToFileURL(file).href);
  } catch (e) {
    console.error(`Import failed for ${file}: ${e?.message || e}`);
    continue;
  }
  const fnEntries = Object.entries(mod).filter(([, v]) => typeof v === 'function');
  if (fnEntries.length === 0) continue;

  const rel = path.relative(ROOT, file);
  const baseTag = rel
    .replace(/^is-/, '')     // drop leading "is-"
    .replace(/\//g, '__')    // folder → "__"
    .replace(/\.js$/, '');   // drop .js

  for (const [name, fn] of fnEntries) {
    const cfg = SAMPLE[name] || DEFAULT;
    const ops = await bench(fn, cfg.input, cfg.iters);
    const badge = {
      schemaVersion: 1,
      label: name,
      message: `${ops} ops/s`,
      color: 'informational',
    };
    const out = path.join(ROOT, 'bench', `${baseTag}__${name}.json`);
    fs.writeFileSync(out, JSON.stringify(badge, null, 2));
    console.log(`wrote ${path.relative(ROOT, out)}`);
  }
}

console.log('bench complete');
