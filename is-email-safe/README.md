# is-email-safe

[![email gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/email.js.json)](./metrics/email.js.json)
[![email ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/email.json)](./bench/email.json)

**Lightweight RFC-like email validator and normalizer.**  
No dependencies. Zero runtime risk from `eval` or regex DoS. MIT licensed.

---

## 🚀 Why

[validator.js](https://www.npmjs.com/package/validator) is large and has had multiple vulnerabilities.  
`is-email-safe` is 100 lines of auditable JS — simple, strict, and secure.  
It is designed for browser, Node.js, and edge runtimes, where dependency safety and payload size matter most.

---

## 🌟 Features

- ✅ Strict RFC-like syntax checks  
- ✅ No Unicode or emoji addresses  
- ✅ Rejects consecutive dots and invalid domains  
- ✅ Normalizes case and trims spaces  
- ✅ Works offline, in browser, and edge runtimes  
- ✅ 0 dependencies  

---

## 📦 Usage

```js
import { isEmail, normalizeEmail } from './email.js';

normalizeEmail('  Example@Domain.COM ');
// → "example@domain.com"

isEmail('user.name+tag@example.co');
// → true

isEmail('user@@domain');
// → false
```

---

## 🧩 Validation rules

- Total length ≤ 254  
- Local part ≤ 64  
- ASCII-only (no UTF-8 emoji or accents)  
- No consecutive dots or leading/trailing dots  
- Domain has ≥ 2 labels  
- TLD = letters only, 2–63 chars  

---

## 🧠 API

### `isEmail(raw: string): boolean`

Validates the syntax and domain structure of an email.  
Returns `true` if the address is valid and ASCII-compliant.

### `normalizeEmail(raw: string): string`

Returns a trimmed, lowercased version of the email.  
If invalid, returns an empty string.

---

## 🧪 Example (test.html)

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module">
      import { isEmail, normalizeEmail } from './email.js';

      const emails = [
        'user@example.com',
        '  USER+tag@Example.COM  ',
        'foo@bar',
        'bad@@domain.com',
        'john..doe@example.com'
      ];

      for (const e of emails) {
        console.log(e, '→', {
          normalized: normalizeEmail(e),
          valid: isEmail(e)
        });
      }
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Clone the repo, open `email-test.html` — interactive test in your browser  
or click 👉🏻 [Email Validator Test](https://yvancg.github.io/validators/is-email-safe/email-test.html)

---

## 🛠 Development

This module is standalone. You can copy `email.js` into your own project.  
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
