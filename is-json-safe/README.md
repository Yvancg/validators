# is-json-safe

[![json gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/json.js.json)](../metrics/json.js.json)
[![json speed](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/json.json)](../bench/json.json)

**Lightweight, dependency-free JSON validator and normalizer.**  
Performs deep structure checks, detects unsafe keys, and enforces configurable limits.  
Works in browser, Node.js, and edge runtimes.

---

## 🚀 Why

Most JSON parsers assume trusted input.  
`is-json-safe` guards against untrusted or malicious JSON by validating structure, depth, and key count — before using or storing the data.

---

## 🌟 Features

- ✅ Detects syntax errors safely (via native `JSON.parse`)  
- ✅ Enforces size, depth, and key count limits  
- ✅ Blocks dangerous keys like `__proto__`, `constructor`, and `prototype`  
- ✅ Detects overly long strings  
- ✅ Works with nested structures  
- ✅ Exposes normalized JSON via `normalizeJson()`  
- ✅ Zero dependencies — pure ES module  

---

## 📦 Usage

```js
import { isJsonSafe, normalizeJson } from './json.js';

const input = '{"user":{"name":"Ada","roles":["admin","ops"]}}';

isJsonSafe(input);
// → { ok: true, bytes: 55, depth: 2, keys: 3, issues: [] }

isJsonSafe('{"__proto__":{}}');
// → { ok: false, issues: ["blocked_key:__proto__"] }

normalizeJson(' { "x": 1, "y": 2 } ');
// → '{"x":1,"y":2}'
```

---

## 🧩 Validation rules

- Rejects empty or oversized input
- Rejects invalid JSON syntax
- Rejects unsafe keys (__proto__, constructor, prototype)
- Enforces:
  - Maximum bytes (maxBytes)
  - Maximum nesting depth (maxDepth)
  - Maximum total keys (maxKeys)
  - Maximum string length (maxStringLength)
- Supports strict or relaxed validation modes via options

---

## 🧠 API

### `isJsonSafe(raw: string, opts?: Options): Result`

**Options**
```ts
type Options = {
  maxBytes?: number;         // default 1_000_000
  maxDepth?: number;         // default 32
  maxKeys?: number;          // default 50_000
  maxStringLength?: number;  // default 100_000
  blockKeys?: string[];      // default ["__proto__","constructor","prototype"]
  returnValue?: boolean;     // include parsed value when ok (default true)
};
```

**Result**
```ts
type Result = {
  ok: boolean;
  issues: string[];   // e.g. ["too_large","too_deep","blocked_key:__proto__"]
  bytes: number;
  depth: number;
  keys: number;
  value?: any;        // only if ok and returnValue=true
};
```

**normalizeJson(raw: string): string**
Returns a minified, normalized JSON string (or "" if invalid).

---

## 🧪 Example (`test.html`)

```html
<!doctype html>
<html>
  <body>
    <textarea id="input">{ "a": 1, "b": { "c": [1,2,3] } }</textarea>
    <button id="btn">Validate</button>
    <pre id="out">…</pre>
    <script type="module">
      import { isJsonSafe } from './json.js';
      document.getElementById('btn').onclick = () => {
        const raw = document.getElementById('input').value;
        const res = isJsonSafe(raw);
        document.getElementById('out').textContent = JSON.stringify(res, null, 2);
      };
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Open `json-test.html` in your browser  
or try the hosted demo 👉🏻 
[JSON Validator Test](https://yvancg.github.io/validators/is-json-safe/json-test.html)

---

## 🛠 Development

This module is standalone. Copy `json.js` into your project.  
No `npm install` or build step required.

---

## 🔒 Notes

Avoid parsing untrusted JSON directly.
Use isJsonSafe to enforce limits and detect tampering before parsing.

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
