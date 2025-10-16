# is-ip-safe

[![ip gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/ip.js.json)](../metrics/ip.js.json)
[![ip ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/ip.json)](../bench/ip.json)

**Tiny, dependency-free IP address validator (IPv4 + IPv6).**  
Safe from ReDoS, works in browsers, Node.js, and edge runtimes.

---

## 🚀 Why

Most IP validators rely on complex regexes vulnerable to catastrophic backtracking.  
`is-ip-safe` performs structural validation in a predictable, constant-time way.

---

## 🌟 Features

- ✅ Validates both IPv4 and IPv6  
- ✅ Rejects malformed octets, out-of-range numbers, and invalid hex groups  
- ✅ Detects compression in IPv6 (`::`) safely  
- ✅ No regex backtracking  
- ✅ Works everywhere — browser, Node.js, edge runtimes

---

## 📦 Usage

```js
import { isIpSafe, isIPv4, isIPv6 } from './ip.js';

isIpSafe('192.168.1.1');
// → { ok: true, version: 4, issues: [] }

isIpSafe('2001:0db8:85a3::8a2e:0370:7334');
// → { ok: true, version: 6, issues: [] }

isIpSafe('999.1.1.1');
// → { ok: false, version: 4, issues: ['out_of_range'] }

isIPv4('192.168.0.1'); // → true
isIPv6('fe80::1');     // → true
```

---

## 🧩 Validation rules

- Digits-only after normalization  
- Length 12–19 digits  
- Luhn checksum must pass  
- Brand recognized or reported as `unknown`  
- Optional `allowBrands` / `blockBrands` policy checks

---

## 🧠 API

### `validateCard(raw: string, opts?: ValidateOpts): Result`

**Options**
```ts
type ValidateOpts = {
  allowBrands?: string[]; // e.g. ['visa','mastercard']
  blockBrands?: string[]; // e.g. ['unionpay']
};
```

**Result**
```ts
type Result = {
  ok: boolean;
  brand?: string;         // 'visa' | 'mastercard' | 'amex' | ...
  normalized?: string;    // digits-only PAN if ok
  last4?: string;         // last 4 digits if ok
  issues: string[];       // e.g. ['too_short','luhn_failed','unknown_brand','brand_not_allowed']
};
```

---

## 🧪 Example (`test.html`)

```html
<!doctype html>
<html>
  <body>
    <main>
      <input id="ip" placeholder="192.168.1.1" />
      <button id="btn">Validate</button>
      <pre id="out">…</pre>
    </main>
    <script type="module">
      import { isIpSafe } from './ip.js';
      const $ = (id) => document.getElementById(id);
      $('btn').addEventListener('click', () => {
        const res = isIpSafe($('ip').value);
        $('out').textContent = JSON.stringify(res, null, 2);
      });
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Open `ip-test.html` in your browser  
or try the hosted demo 👉🏻 
[Card Validator Test](https://yvancg.github.io/validators/is-ip-safe/ip-test.html)

---

## 🛠 Development

This module is standalone. Copy `ip.js` into your project.  
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

### Custom link
[💸 Direct contribution](https://wise.com/pay/me/yvanc7)
