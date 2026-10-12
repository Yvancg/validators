# is-ip-safe

[![ip gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/ip.js.json)](../metrics/ip.js.json)
[![ip ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/ip.json)](../bench/ip.json)

**Tiny, dependency-free IP address validator (IPv4 + IPv6).**  
Safe from ReDoS, works in browsers, Node.js, and edge runtimes.

---

## 🚀 Why

Most IP validators rely on complex regexes vulnerable to catastrophic backtracking.  
`is-ip-safe` performs structural validation in a simple structural checks without a large parsing library.

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
// → { ok: false, version: 4, issues: ['invalid_address'] }

isIPv4('192.168.0.1'); // → true
isIPv6('fe80::1');     // → true
```

---

## Validation rules
- IPv4: exactly four decimal octets, each from 0 to 255, with no leading zeros.
- IPv6: exactly eight 16-bit groups, or one `::` replacing at least one group. IPv4-embedded forms are supported.
- Whitespace is trimmed at the ends; malformed compression and invalid characters are rejected.
- Validation checks address syntax, not whether the address is routable or publicly reachable.

## API
`isIpSafe(input)` returns `{ ok, version, issues }`, where `version` is `4`, `6`, or `null`. Known malformed versions report `['invalid_address']`; an empty input reports `['empty']`.

`isIPv4(input)` and `isIPv6(input)` return booleans. There is no `normalizeIp` export.

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
[IP Validator Test](https://yvancg.github.io/validators/is-ip-safe/ip-test.html)

---

## 🛠 Development

This module is standalone. Copy `ip.js` into your project.  
No `npm install` or build step required.

---

## 🔒 Notes

Use syntax validation only. This utility does not check routing, ownership, or network accessibility.

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
