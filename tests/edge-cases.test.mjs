import test from 'node:test';
import assert from 'node:assert/strict';
import { isUrlSafe, normalizeUrl } from '../is-url-safe/url.js';
import { isEmail, normalizeEmail } from '../is-email-safe/email.js';
import { isEIN, isSSN, isITIN, validateTIN } from '../is-us-tin-safe/tin.js';
import { isE164, isPhoneE164 } from '../is-phone-e164/phone.js';

test('URL normalization preserves ports, userinfo, path, query and fragment', () => {
  const url = 'https://user:pass@example.com:8443/path?q=1#fragment';
  assert.equal(normalizeUrl(url), url);
  assert.equal(normalizeUrl('https://example.com:8443/path'), 'https://example.com:8443/path');
  assert.equal(normalizeUrl('http://example.com/'), 'http://example.com/');
  assert.equal(normalizeUrl('javascript:alert(1)'), '');
  assert.equal(normalizeUrl('ftp://example.com/a'), '');
  assert.equal(normalizeUrl('broken'), '');
  assert.equal(isUrlSafe('javascript:alert(1)'), false);
  assert.equal(isUrlSafe(url), true); // syntax validation, NOT SSRF protection
});

test('email ASCII rules reject malformed labels', () => {
  assert.equal(isEmail('User.Name+test@example.com'), true);
  assert.equal(normalizeEmail('  User@Example.COM '), 'user@example.com');
  for (const bad of ['a..b@example.com', '.a@example.com', 'a@example..com', 'a@-example.com', 'a@example.c']) {
    assert.equal(isEmail(bad), false, bad);
  }
});

test('TIN checks reject obviously invalid segments', () => {
  assert.equal(isEIN('12-3456789'), true);
  assert.equal(isSSN('000-12-3456'), false);
  assert.equal(isSSN('666-12-3456'), false);
  assert.equal(isSSN('123-00-4567'), false);
  assert.equal(isITIN('900-70-0001'), true);
  assert.equal(isITIN('900-60-0001'), false);
  assert.equal(validateTIN('12-3456789').ok, true);
});

test('E.164 rejects extra signs and invalid country prefixes', () => {
  assert.equal(isE164('+12025550123'), true);
  assert.equal(isPhoneE164('00 1 (202) 555-0123'), true);
  assert.equal(isE164('+01234567890'), false);
  assert.equal(isPhoneE164('+1+2025550123'), false);
});
