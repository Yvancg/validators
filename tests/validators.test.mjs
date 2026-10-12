import test from 'node:test';
import assert from 'node:assert/strict';
import { isIpSafe, isIPv4, isIPv6 } from '../is-ip-safe/ip.js';
import { validateCard, detectBrand, luhnOk } from '../is-card-safe/card.js';
import { isVatSafe } from '../is-vat-safe/vat.js';
import { isJsonSafe } from '../is-json-safe/json.js';
import { validatePhone, normalizePhone } from '../is-phone-e164/phone.js';
import { validatePassword } from '../is-password-safe/password.js';
import { isIbanSafe } from '../is-iban-safe/iban.js';

test('IPv4 and IPv6 validity, compression and embedded IPv4', () => {
  for (const address of ['::', '::1', '2001:db8::1', '1:2:3:4:5:6:7:8', '::ffff:192.0.2.1']) {
    assert.equal(isIPv6(address), true, address);
  }
  for (const address of ['1:2:3', '::::', '1::2::3', '1:2:3:4:5:6:7:8:9', '1::2:3:4:5:6:7:8']) {
    assert.equal(isIPv6(address), false, address);
  }
  assert.equal(isIPv4('192.168.1.1'), true);
  assert.equal(isIPv4('192.168.01.1'), false);
  assert.equal(isIpSafe('bad').ok, false);
});

test('credit card brand detection, Luhn and invalid characters', () => {
  assert.equal(detectBrand('2221000000000000'), 'mastercard');
  assert.equal(detectBrand('2720000000000000'), 'mastercard');
  assert.equal(detectBrand('2721000000000000'), null);
  assert.equal(validateCard('4111-1111-1111-1111').ok, true);
  assert.equal(validateCard('4111111111111111xyz').ok, false);
  assert.equal(luhnOk(''), false);
});

test('VAT patterns accept 8, 9 and 10 digits for CZ', () => {
  for (const digits of ['12345678', '123456789', '1234567890']) {
    assert.equal(isVatSafe('CZ' + digits).ok, true);
  }
  assert.equal(isVatSafe('CZ1234567').ok, false);
});

test('JSON size limit is enforced before parsing', () => {
  const r = isJsonSafe('{', { maxBytes: 0 });
  assert.deepEqual(r.issues, ['too_large']);
  assert.equal(isJsonSafe('{"a":"é"}', { maxBytes: 9 }).ok, false);
  assert.equal(isJsonSafe('{"a":1}').ok, true);
});

test('telephone normalization never erases invalid plus signs', () => {
  assert.equal(normalizePhone('00 1 (202) 555-0123'), '+12025550123');
  assert.equal(validatePhone('00 1 (202) 555-0123'), true);
  assert.equal(validatePhone('+1+2025550123'), false);
  assert.equal(validatePhone('+1a2025550123'), false);
});

test('password dictionary screening is bounded by dictionary size', () => {
  const r = validatePassword('xxpasswordzz', { requireSets: [], minEntropy: 0 });
  assert.ok(r.reasons.some(x => x.includes('dictionary-like')));
});

test('IBAN registry resolves relative to module', async () => {
  assert.equal((await isIbanSafe('DE44500105175407324931')).ok, true);
  assert.equal((await isIbanSafe('DE44500105175407324932')).ok, false);
});
