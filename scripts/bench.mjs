import { writeFileSync, mkdirSync } from 'node:fs';
import { performance }              from 'node:perf_hooks';

// --- Import targets explicitly to avoid discovery misses ---
import { isUrlSafe }    			from '../is-url-safe/url.js';
import { validatePhone }			from '../is-phone-e164/phone.js';
import { isEmail }      			from '../is-email-safe/email.js';
import { isIbanSafe }   			from '../is-iban-safe/iban.js';
import { validateCard } 			from '../is-card-safe/card.js';
import { isJsonSafe }   			from '../is-json-safe/json.js';
import { validateTIN }  			from '../is-us-tin-safe/tin.js';
import { isIpSafe }     			from '../is-ip-safe/ip.js';
import { isVatSafe }    			from '../is-vat-safe/vat.js';
import { validatePassword } 	from '../is-password-safe/password.js';

function bench(fn, iters) {
  for (let i = 0; i < Math.min(100, iters); i++) fn();
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) fn();
  const ms = performance.now() - t0;
  return Math.round(iters / (ms / 1000)); // ops/s
}

const targets = [
  { name: 'url',    fn: () => isUrlSafe('https://example.com?q=1'),             iters: 20000 },
  { name: 'email',  fn: () => isEmail('user@example.com'),                      iters: 15000 },
  { name: 'iban',   fn: () => isIbanSafe('DE44500105175407324931'),             iters: 400 },
  { name: 'phone',  fn: () => validatePhone('+12025550123'),                    iters: 10000 },
  { name: 'card',   fn: () => validateCard('4111111111111111'),                 iters: 800 },
  { name: 'json',   fn: () => isJsonSafe('{"a":1,"b":{"c":[1,2,3],"d":true}}'), iters: 10000 },
  { name: 'tin',    fn: () => validateTIN('12-3456789'),                        iters: 10000 },
  { name: 'ip',     fn: () => isIpSafe('192.168.0.1'),                          iters: 20000 },
  { name: 'vat',    fn: () => isVatSafe('DE123456789'),                         iters: 12000 },
  { name: 'password', fn: () => validatePassword('Aj4?mX9^kL3!yZ'), 						iters: 8000 },
];

let wrote = 0;
for (const t of targets) {
  try {
    const ops = bench(t.fn, t.iters);
    const color = ops > 1_000_000 ? 'brightgreen'
                : ops >   300_000 ? 'green'
                : ops >   100_000 ? 'blue'
                : 'lightgrey';
    const json = {
      schemaVersion: 1,
      label: 'speed',
      message: `${ops.toLocaleString()} ops/s`,
      color
    };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
    wrote++;
  } catch {
    const json = { schemaVersion: 1, label: 'speed', message: 'error', color: 'red' };
    writeFileSync(`bench/${t.name}.json`, JSON.stringify(json, null, 2));
  }
}
if (!wrote) process.exit(1);
