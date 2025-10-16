// bench/bench.mjs
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { performance } from 'node:perf_hooks';
import process from 'node:process';

const ROOT = process.cwd();

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function badge(label, message) {
  return { schemaVersion: 1, label, message, color: 'informational' };
}

function bench(fn, input, iters = 1000, warmup = 100) {
  for (let i = 0; i < warmup; i++) fn(input);
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) fn(input);
  const ms = performance.now() - t0;
  const ops = Math.round(iters / (ms / 1000));
  return { ops };
}

// Heuristic samples if module does not provide __bench__
function defaultSample(fnName, fileBase) {
  const k = (fnName || fileBase).toLowerCase();
  if (k.includes('url'))   return { input: 'https://example.com/path?q=1', iters: 10000 };
  if (k.includes('email')) return { input: 'user.name+tag@example.co', iters: 10000 };
  if (k.includes('iban'))  return { input: 'DE44500105175407324931', iters: 300 };
  if (k.includes('phone') || k.includes('e164')) return { input: '+12025550123', iters: 5000 };
  if (k.includes('card'))  return { input: '4111111111111111', iters: 1000 };
  if (k.includes('minify') && fileBase === 'minify') return { input: 'function x(){return 1+2}', iters: 1000 };
  return { input: 'abc', iters: 20000 };
}

// Decide which export to bench
function pickExport(mod, fileBase) {
  if (mod.__bench__ && typeof mod.__bench__ === 'object') {
    // Expected shape: { fn: 'exportName', input: '...', iters: 1234, label?: '...' }
    const meta = mod.__bench__;
    const fn = typeof meta.fn === 'function'
      ? meta.fn
      : (mod[meta.fn] || mod.default);
    if (typeof fn === 'function') {
      return {
        label: meta.label || fileBase,
        fn,
        iters: meta.iters ?? defaultSample(meta.fn, fileBase).iters,
        input: meta.input ?? defaultSample(meta.fn, fileBase).input,
      };
    }
  }

  // Heuristics by common names
  const candidates = [
    'isUrlSafe','normalizeUrl',
    'isEmailSafe','normalizeEmail',
    'isIbanSafe',
    'isPhoneE164','normalizePhone',
    'validateCard',
    'minifyJS','minifyCSS'
  ];
  for (const name of candidates) {
    if (typeof mod[name] === 'function') {
      const s = defaultSample(name, fileBase);
      return { label: fileBase, fn: mod[name], iters: s.iters, input: s.input };
    }
  }
  // Fallback: first function export
  for (const [k, v] of Object.entries(mod)) {
    if (typeof v === 'function') {
      const s = defaultSample(k, fileBase);
      return { label: fileBase, fn: v, iters: s.iters, input: s.input };
    }
  }
  // Final fallback: default export if function
  if (typeof mod.default === 'function') {
    const s = defaultSample('default', fileBase);
    return { label: fileBase, fn: mod.default, iters: s.iters, input: s.input };
  }
  return null;
}

async function main() {
  const benchDir = join(ROOT, 'bench');
  try { await stat(benchDir); } catch { /* created by workflow’s checkout */ }

  const files = [];
  for await (const p of walk(ROOT)) {
    if (!/is-[^/]+\/[^/]+\.js$/.test(p)) continue;      // only our module files
    if (p.includes('/bench/')) continue;                // skip bench scripts
    if (p.includes('/node_modules/')) continue;
    files.push(p);
  }

  const results = {};
  for (const abs of files) {
    const rel = abs.replace(ROOT + '/', '');
    const fileBase = basename(rel, '.js'); // e.g. email, url, iban, phone, card, minify
    try {
      const mod = await import('file://' + abs);
      const picked = pickExport(mod, fileBase);
      if (!picked) {
        console.warn(`No function to bench in ${rel}`);
        continue;
      }
      const { label, fn, iters, input } = picked;
      const { ops } = bench(fn, input, iters);
      const data = badge(`${label} ops/s`, `${ops}`);
      const outPath = join('bench', `${fileBase}.json`);     // e.g. bench/email.json
      await writeFile(outPath, JSON.stringify(data, null, 2), 'utf8');
      results[fileBase] = data;
      console.log(`✔ ${rel} → ${ops} ops/s`);
    } catch (e) {
      console.error(`✖ Failed: ${rel}`, e?.message || e);
    }
  }

  console.log('Done.', results);
}

main().catch(e => { console.error(e); process.exit(1); });
