import { minifyJS, minifyCSS } from '../is-minify/minify.js';
import { isUrlSafe } from '../is-url-safe/url.js';
import { isEmailSafe } from '../is-email-safe/email.js';
import { isIbanSafe } from '../is-iban-safe/iban.js';
import { isPhoneE164 } from '../is-phone-e164/phone.js';
import { validateCard } from '../is-card-safe/card.js';
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

function bench(fn, input, iters = 1000) {
  for (let i = 0; i < 100; i++) fn(input); // warmup
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) fn(input);
  const ms = performance.now() - t0;
  const ops = Math.round(iters / (ms / 1000));
  return { ops };
}

function badge(label, message) {
  return { schemaVersion: 1, label, message, color: 'informational' };
}

const results = {
  minify: badge('minify', `${bench(minifyJS, "function x(){return 1}", 1000).ops} ops/s`),
  url: badge('url', `${bench(isUrlSafe, "https://example.com", 10000).ops} ops/s`),
  email: badge('email', `${bench(isEmailSafe, "user@example.com", 10000).ops} ops/s`),
  iban: badge('iban', `${bench(isIbanSafe, "DE44500105175407324931", 200).ops} ops/s`),
  phone: badge('phone', `${bench(isPhoneE164, "+12025550123", 5000).ops} ops/s`),
  card: badge('card', `${bench(validateCard, "4111111111111111", 500).ops} ops/s`)
};

for (const [name, data] of Object.entries(results)) {
  writeFileSync(`bench/${name}.json`, JSON.stringify(data, null, 2));
}
console.log('✅ Benchmarks done:', results);
