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

### IPv4 ###

- Must contain exactly 4 numeric segments, separated by dots (.)
- Each segment must be an integer between 0 and 255
- No leading zeros (e.g. 01 is invalid)
- Only digits allowed — no letters or special characters

### IPv6 ###

- Must contain 3–8 groups separated by colons (:)
- Each group must contain 1–4 hexadecimal characters (0-9, a-f, A-F)
- Supports compressed notation (::) exactly once per address
- Rejects invalid characters or too many segments
- Handles mixed uppercase/lowercase safely

### Common rules ###

- Input is trimmed before validation
- Empty or whitespace-only strings are invalid
- No regular-expression backtracking (safe for untrusted input)

---

## 🧠 API

### `isIpSafe(raw: string): boolean`  

Returns `true` if the given string is a valid IPv4 **or** IPv6 address.

### `isIPv4(raw: string): boolean`  

Returns `true` only if the input is a valid IPv4 address in the form `A.B.C.D`,  
where each segment is an integer between `0` and `255` and has **no leading zeros**.

### `isIPv6(raw: string): boolean`  

Returns `true` only if the input is a valid IPv6 address, supporting a single `::` compression,  
with each group containing 1–4 hexadecimal characters (`0–9`, `a–f`, `A–F`).

### `normalizeIp(raw: string): string`  

Returns a normalized IP string or an empty string if invalid.  
- IPv4: removes extra spaces and leading zeros  
- IPv6: converts to lowercase and applies minimal compression rules

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
[IP Validator Test](https://yvancg.github.io/validators/is-ip-safe/ip-test.html)

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

### Direct Contribution

[💸 Direct Contribution via Paypal](https://paypal.me/ComicStylePortrait)
