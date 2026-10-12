import test from 'node:test';
import assert from 'node:assert/strict';
import { isIsoDateSafe } from '../is-iso-date-safe/date.js';
import { isUuidSafe } from '../is-uuid-safe/uuid.js';

test('ISO dates enforce Gregorian leap years and month lengths', () => {
  for (const value of ['2024-02-29', '2000-02-29', '2026-10-12', '0001-01-01', '9999-12-31']) {
    assert.equal(isIsoDateSafe(value), true, value);
  }
  for (const value of ['2026-02-29', '1900-02-29', '2100-02-29', '2026-04-31', '2026-13-01', '2026-00-01', '2026-01-00', '0000-01-01']) {
    assert.equal(isIsoDateSafe(value), false, value);
  }
});

test('ISO dates require the exact YYYY-MM-DD shape', () => {
  for (const value of ['2026-1-02', '26-01-02', '2026-01-02Z', '2026-01-02T00:00:00Z', ' 2026-01-02', '2026-01-02 ', '', null, undefined, 20260102, new Date()]) {
    assert.equal(isIsoDateSafe(value), false, String(value));
  }
});

const v4 = '550e8400-e29b-41d4-a716-446655440000';
const v7 = '01890f5a-6c5d-7b72-9fc0-61a7aab1976a';
test('UUIDs validate version, variant, and canonical layout', () => {
  assert.equal(isUuidSafe(v4), true);
  assert.equal(isUuidSafe(v7), true);
  assert.equal(isUuidSafe(v4.toUpperCase()), true);
  assert.equal(isUuidSafe(v4, { version: 4 }), true);
  assert.equal(isUuidSafe(v7, { version: 7 }), true);
  assert.equal(isUuidSafe(v4, { version: 7 }), false);
  assert.equal(isUuidSafe(v7, { version: 4 }), false);
});
test('UUIDs reject bad variants, malformed forms, and invalid filters', () => {
  for (const value of [v4.replace('-a716-', '-7716-'), v4.replace('-41d4-', '-91d4-'), '00000000-0000-0000-0000-000000000000', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '{' + v4 + '}', 'urn:uuid:' + v4, v4.replace(/-/g, ''), v4 + ' ', '', 42, null]) {
    assert.equal(isUuidSafe(value), false, String(value));
  }
  for (const version of [0, 9, 4.5, '4', null]) assert.equal(isUuidSafe(v4, { version }), false);
});
