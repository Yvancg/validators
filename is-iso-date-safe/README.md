# is-iso-date-safe

A tiny, dependency-free validator for exact Gregorian ISO calendar dates (YYYY-MM-DD).

## Usage

~~~js
import { isIsoDateSafe } from './date.js';

isIsoDateSafe('2024-02-29'); // true
isIsoDateSafe('1900-02-29'); // false
isIsoDateSafe('2026-02-30'); // false
isIsoDateSafe('2026-10-12T00:00:00Z'); // false
~~~

Returns a boolean. Checks month lengths and leap years with the Gregorian rules, including the 100-year and 400-year exceptions. Accepts years 0001–9999 only. Rejects timezone offsets, timestamps, whitespace, non-string inputs and invalid dates. No parsing ambiguity, date object or dependencies.

Run tests with: node --experimental-default-type=module --test tests/*.test.mjs
