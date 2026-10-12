# is-url-safe

[![url gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/url.js.json)](./metrics/url.js.json)
[![url ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/url.json)](./bench/url.json)

**Strict, dependency-free HTTP(S) URL validator and normalizer.**  
Lightweight, auditable, and safe to use in browsers, Node.js, or edge runtimes.

---

## 🚀 Why

Most URL validators are too permissive or allow unsafe schemes like `javascript:` or `data:`.  
`is-url-safe` enforces strict `http(s)`-only rules with zero dependencies and predictable behavior.

## 🌟 Features

- ✅ Only allows `http` and `https` protocols  
- 🚫 Blocks `javascript:`, `data:`, `file:`, `ftp:` and similar schemes  
- ✅ Rejects invalid hostnames and disallowed characters (`<`, `>`, space)  
- ✅ Compatible with browsers, Node.js, and edge environments  
- ✅ Zero dependencies — pure ES module  

## 📦 Usage

```js
import { isUrlSafe, normalizeUrl } from './url.js';

isUrlSafe('https://example.com');        // true
isUrlSafe('javascript:alert(1)');        // false
normalizeUrl(' https://example.com/path?q=1 ');
// → "https://example.com/path?q=1"
```

---

## 🧩 Validation rules

- Must start with `http` or `https`  
- Hostname must be present and contain only valid ASCII characters  
- No spaces or control characters allowed  
- Optional path, query, and hash supported  

---

## 🧠 API

### `isUrlSafe(raw: string): boolean`

Returns `true` only if the given string is a valid HTTP(S) URL with a non-empty hostname and without control characters.

### `normalizeUrl(raw: string): string`

Returns a normalized absolute URL including protocol, hostname, path, query, and hash.  
Returns an empty string if invalid.

---

## 🧪 Example (test.html)

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module">
      import { isUrlSafe } from './url.js';

      const urls = [
        'https://example.com',
        'http://sub.domain.org/path?x=1',
        'ftp://server.com',
        'javascript:alert(1)',
        'data:text/plain,hi',
        'https://good.com/<bad>'
      ];

      for (const u of urls) {
        console.log(u, '=>', isUrlSafe(u));
      }
    </script>
  </body>
</html>
```

---

For URL serialization, `normalizeUrl()` preserves explicit ports, credentials, query strings, and fragments using native `URL.href`. It only accepts HTTP(S) URLs. Neither validation nor normalization is a network-access or SSRF safety check.

## 🧪 Browser test

Clone the repo, open `url-test.html` — interactive test in your browser  
or click 👉🏻 [URL Validator Test](https://yvancg.github.io/validators/is-url-safe/url-test.html)

---

## 🛠 Development

This module is standalone. You can copy `url.js` into your own project.  
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
