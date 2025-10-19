# is-us-tin-safe

[![tin gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/tin.js.json)](../metrics/tin.js.json)
[![tin ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/tin.json)](../bench/tin.json)

**Lightweight, dependency-free US Tax ID (TIN/EIN/SSN/ITIN) validator and normalizer.**  
Validates US Taxpayer Identification Numbers (EIN, SSN, ITIN) using IRS-issued format rules.

---

## 🚀 Why

Most TIN or SSN libraries are outdated, regex-only, or rely on external APIs.
`is-us-tin-safe` is a single auditable ES module that checks IRS formatting and known invalid patterns, locally, securely, and with zero dependencies.

---

## 🌟 Features

- ✅ Detects and validates EIN, SSN, and ITIN formats
- ✅ Normalizes input to digits-only (removes - and spaces)
- ✅ Blocks invalid SSNs (000, 666, ≥900 ranges, and 078-05-1120)
- ✅ EIN prefix validation using official IRS assignment list
- ✅ ITIN validation with proper range checks (70–88, 90–92, 94–99)
- ✅ Works in browsers, Node.js, and edge runtimes
- ✅ Zero dependencies — pure ES module

---

## 📦 Usage

```js
import validateTIN, { isEIN, isSSN, isITIN } from './tin.js';

validateTIN('12-3456789');
// → { ok: true, normalized: '123456789', type: 'ein', issues: [] }

validateTIN('123-45-6789');
// → { ok: true, normalized: '123456789', type: 'ssn', issues: [] }

validateTIN('900-70-1234');
// → { ok: true, normalized: '900701234', type: 'itin', issues: [] }

validateTIN('666-12-3456');
// → { ok: false, type: 'unknown', issues: ['unknown_type'] }
```

---

## 🧩 Validation rules

- Digits-only normalization
- Must be 9 digits
- EIN prefixes restricted to valid IRS-issued blocks
- SSN excludes 000, 666, and numbers ≥ 900
- SSN cannot include 078-05-1120 (known fake)
- ITIN must start with 9 and follow specific group ranges
- Optional allowTypes / blockTypes filters available

---

## 🧠 API

### `validateTIN(raw: string, opts?: ValidateOpts): Result`

**Options**
```ts
type ValidateOpts = {
  allowTypes?: string[]; // e.g. ['ein','ssn']
  blockTypes?: string[]; // e.g. ['itin']
};
```

**Result**
```ts
type Result = {
  ok: boolean;
  type: 'ein' | 'ssn' | 'itin' | 'unknown';
  normalized?: string;  // digits-only TIN if ok
  issues: string[];     // e.g. ['bad_format','unknown_type','type_blocked']
};
```

---

## 🧪 Example (`test.html`)

```html
<!doctype html>
<html>
  <body>
    <main>
      <input id="tin" placeholder="12-3456789 or 123-45-6789" />
      <button id="btn">Validate</button>
      <pre id="out">…</pre>
    </main>
    <script type="module">
      import validateTIN from './tin.js';
      const $ = (id) => document.getElementById(id);
      $('btn').addEventListener('click', () => {
        const res = validateTIN($('tin').value);
        $('out').textContent = JSON.stringify(res, null, 2);
      });
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Open `tin-test.html` in your browser  
or try the hosted demo 👉🏻 
[US TIN Validator Test](https://yvancg.github.io/validators/is-us-tin-safe/tin-test.html)

---

## 🛠 Development

This module is standalone. Copy `tin.js` into your project.  
No `npm install` or build step required.

---

## 🔒 Notes

TINs, SSNs, and EINs are sensitive data.
Never log or transmit them in plaintext outside secure environments.

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
