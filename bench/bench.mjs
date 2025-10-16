// scripts/bench.mjs
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const ROOT = process.cwd();
const benchDir = path.join(ROOT, 'bench');
fs.mkdirSync(benchDir, { recursive: true });

function bench(fn, input, iters = 1000) {
  for (let i = 0; i < 50; i++) fn(input); // warmup
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) fn(input);
  const ms = performance.now() - t0;
  const ops = Math.round(iters / (ms / 1000));
  return { ops };
}

function badge(label, message) {
  return { schemaVersion: 1, label, message, color: 'informational' };
}

const modules = fs
  .readdirSync(ROOT)
  .filter(d => d.startsWith('is-') && fs.statSync(d).isDirectory());

for (const dir of modules) {
  const jsFile = fs.readdirSync(dir).find(f => f.endsWith('.js'));
  if (!jsFile) continue;

  const name = path.basename(jsFile, '.js');
  const fullPath = `./${dir}/${jsFile}`;

  try {
    const mod = await import(fullPath);
    const fn = Object.values(mod).find(v => typeof v === 'function');
    if (!fn) continue;

    const sample =
      name.includes('email') ? 'user@example.com'
      : name.includes('phone') ? '+12025550123'
      : name.includes('iban') ? 'DE44500105175407324931'
      : name.includes('url') ? 'https://example.com'
      : name.includes('card') ? '4111111111111111'
      : name.includes('minify') ? 'function x(){return 1+2;}'
      : 'test';

    const { ops } = bench(fn, sample, 500);
    const data = badge('throughput', `${ops.toLocaleString()} ops/s`);
    const out = path.join(benchDir, `${name}.json`);
    fs.writeFileSync(out, JSON.stringify(data, null, 2));
    console.log(`✅ ${dir}/${jsFile} → ${ops} ops/s`);
  } catch (err) {
    console.warn(`⚠️ Skipped ${dir}/${jsFile}: ${err.message}`);
  }
}

console.log('🏁 Benchmarks complete.');
