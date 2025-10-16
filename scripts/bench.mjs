import { writeFileSync } from 'node:fs';
import { performance }   from 'node:perf_hooks';

// --- Import targets explicitly to avoid discovery misses ---
import { minifyJS }     from '../is-minify/minify.js';
import { isUrlSafe }    from '../is-url-safe/url.js';
import { validatePhone }from '../is-phone-e164/phone.js';
import { isEmail }      from '../is-email-safe/email.js';
import { isIbanSafe }   from '../is-iban-safe/iban.js';
import { validateCard } from '../is-card-safe/card.js';
import { isJsonSafe }   from '../is-json-safe/json.js';
import { validateTIN } from '../is-us-tin-safe/tin.js';

function bench(fn, input, iters) {
  // warmup
  for (let i = 0; i < Math.min(100, iters); i++) fn(input);
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) fn(input);
  const ms = performance.now() - t0;
  const ops = Math.round(iters / (ms / 1000));
  return ops;
}

const targets = [
  { name: 'minify', fn: () => minifyJS('function x(){return 42}/*c*/'),         iters: 2000 },
  { name: 'url',    fn: () => isUrlSafe('https://example.com?q=1'),             iters: 20000 },
  { name: 'email',  fn: () => isEmail('user@example.com'),                      iters: 15000 },
  { name: 'iban',   fn: () => isIbanSafe('DE44500105175407324931'),             iters: 400 },
  { name: 'phone',  fn: () => validatePhone('+12025550123'),                    iters: 10000 },
  { name: 'card',   fn: () => validateCard('4111111111111111'),                 iters: 800 },
  { name: 'json',   fn: () => isJsonSafe('{"a":1,"b":{"c":[1,2,3],"d":true}}'), iters: 10000 },
  { name: 'tin',    fn: () => validateTIN('12-3456789'),                        iters: 10000 },
];

let wrote = 0;
for (const t of targets) {
  try {
    const ops = bench(t.fn, undefined, t.iters);
    const json = {
      schemaVersion: 1,
      label: 'throughput',
      message: `${ops.toLocaleString()} ops/s`,
      color: 'informational'
    };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
    wrote++;
  } catch (e) {
    const json = {
      schemaVersion: 1,
      label: 'throughput',
      message: 'error',
      color: 'red'
    };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
  }
}
if (!wrote) process.exit(1);
