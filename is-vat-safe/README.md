# is-vat-safe

[![vat gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/vat.js.json)](../metrics/vat.js.json)
[![vat ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/vat.json)](../bench/vat.json)

**Lightweight, dependency-free EU VAT ID validator.**  
Performs format and prefix validation for all EU member states and select extra jurisdictions (GB, NO, CH).  
Zero dependencies. No network lookup. No checksum evaluation.

---

## 🚀 Why

Most VAT validators rely on web services (VIES) or incomplete regex lists.  
`is-vat-safe` is a self-contained, auditable file that checks VAT prefixes, syntax, and length purely offline.

---

## 🌟 Features

- ✅ Validates VAT prefix (country code) and pattern for each EU member state  
- ✅ Supports `EL` prefix for Greece and `GB` post-Brexit legacy format  
- ✅ Normalizes input (removes spaces, dots, dashes, and slashes)  
- ✅ Optional allow/block country filtering  
- ✅ Browser, Node, and Edge-compatible  
- ✅ Zero dependencies — pure ES module 

---

## 📦 Usage

```js
import { isVatSafe } from './vat.js';

isVatSafe('DE123456789');
// → { ok: true, country: 'DE', normalized: 'DE123456789', issues: [] }

isVatSafe('FRAB123456789');
// → { ok: true, country: 'FR', normalized: 'FRAB123456789', issues: [] }

isVatSafe('GB999999973');
// → { ok: true, country: 'GB', normalized: 'GB999999973', issues: [] }

isVatSafe('XX12345');
// → { ok: false, issues: ['country_unsupported'] }
```

---

## 🧩 Validation rules

- VAT number must start with a valid EU member state prefix (e.g., DE, FR, IT, ES, EL, etc.)
- Must match each country’s specific structure (digit or alphanumeric pattern)
- Automatically ignores spaces, dots, and dashes
- Optional filters via allowed or blocked arrays
- No external API or checksum required

---

## 🧠 API

### `isVatSafe(raw: string, opts?: ValidateOpts): Result`

**Options**
```ts
type ValidateOpts = {
  allowed?: string[]; // restrict to certain prefixes (e.g. ['DE','FR'])
  blocked?: string[]; // exclude certain prefixes
};
```

**Result**
```ts
type Result = {
  ok: boolean;
  country?: string;
  normalized?: string;
  issues: string[]; // e.g. ['empty','missing_prefix','country_blocked','bad_pattern']
};
```

**normalizeVat(raw: string): string**
Removes spaces, dots, slashes, and dashes, converts to uppercase.
```js
normalizeVat(' fr 123 456 789 ');
// → 'FR123456789'
```

**detectCountry(raw: string): string**
Returns the 2-letter country prefix if valid, else an empty string.
```js
detectCountry('DE123456789'); // 'DE'
detectCountry('123456789');   // ''
```

---

## 🧪 Example (`test.html`)

```html
<!doctype html>
<html>
  <body>
    <input id="vat" placeholder="DE123456789" />
    <button id="btn">Validate</button>
    <pre id="out">…</pre>

    <script type="module">
      import { isVatSafe } from './vat.js';
      const $ = id => document.getElementById(id);
      $('btn').addEventListener('click', () => {
        const res = isVatSafe($('vat').value);
        $('out').textContent = JSON.stringify(res, null, 2);
      });
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Open `vat-test.html` in your browser  
or try the hosted demo 👉🏻 
[VAT Validator Test](https://yvancg.github.io/validators/is-vat-safe/vat-test.html)

---

## 🛠 Development

This module is standalone. Copy `vat.js` into your project.  
No `npm install` or build step required.

---

## 🔒 Notes

Do not log full PANs in production. Mask when necessary (e.g. `**** **** **** 1111`).

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

[💸 Direct Contribution via Paypal](https://paypal.me/ComicStylePortrait)
