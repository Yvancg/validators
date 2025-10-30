# is-phone-e164

[![phone gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/phone.js.json)](./metrics/phone.js.json)
  [![phone ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/phone.json)](./bench/phone.json)

**Tiny, dependency-free E.164 phone validator and normalizer.**  
Lightweight, auditable, and safe to embed directly in web or backend code.

---

## 🚀 Why

Most phone validation libraries are heavy or depend on outdated regex sets.  
`phone-e164` is a single file — zero dependencies, zero runtime risk.

## 🌟 Features

- ✅ Validates and normalizes international phone numbers in E.164 format  
- ✅ Removes spaces, dashes, parentheses, and other common formatting  
- ✅ Detects invalid or incomplete country codes  
- ✅ Works in browsers, Node.js, and edge runtimes  
- ✅ Zero dependencies — pure ES module  

## 📦 Usage

```bash
normalizePhone(' (415) 555-0123 '); // "+4155550123"
isE164('+4155550123'); // true
validatePhone('415-555-0123'); // true (normalizes to +4155550123)
```

---

## 🧩 Validation rules

- Total length ≤ 254  
- Local part ≤ 64  
- ASCII-only (no UTF-8 emoji or accents)  
- No consecutive dots or leading/trailing dots  
- Domain has ≥ 2 labels  
- TLD = letters only, 2–63 chars  

## API

### `isE164(raw: string): boolean`

Returns true only if the given string is a valid E.164 phone number, starting with + and containing only digits.

### `normalizePhone(raw: string): string`

Returns a cleaned and normalized E.164-like string (e.g. +14155550123).
Removes spaces, parentheses, dots, and dashes.

### `validatePhone(raw: string): boolean`

Accepts loose input (with or without +) and attempts normalization before validating.
Returns true only if the normalized result passes isE164.

## Example (test.html)

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module">
      import { normalizePhone, isE164, validatePhone } from './phone.js';

      const numbers = [
        '(415) 555-0123',
        '+1 415 555 0123',
        '00441555550123',
        '14155550123',
        'abc+4155550123',
        '+9999999999999999'
      ];

      for (const n of numbers) {
        console.log(n, '→', {
          normalized: normalizePhone(n),
          valid: validatePhone(n),
          strict: isE164(n)
        });
      }
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Clone the repo, open `phone-test.html` — interactive test in your browser  
or click 👉🏻 [Phone Validator Test](https://yvancg.github.io/validators/is-phone-e164/phone-test.html)

---

## 🛠 Development

This module is standalone. You can copy `phone.js` into your own project.  
No `npm install` or build step required.

---

## 🪪 License

MIT License  

Copyright (c) 2025 **Y Consulting LLC**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

## ❤️ Support the project

If this library helped you, consider sponsoring its maintenance.

### GitHub Sponsors

[👉 Sponsor me on GitHub](https://github.com/sponsors/yvancg)

### Buy Me a Coffee

[☕ Support via BuyMeACoffee](https://buymeacoffee.com/yconsulting)

### Direct Contribution

[💸 Direct Contribution via Paypal](https://www.paypal.com/ncp/payment/4HT7CA3E7HYBA)
