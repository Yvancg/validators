# is-url-safe

Strict, dependency-free HTTP(S) URL validator for browser and Node.

## Overview

`is-url-safe` rejects non-HTTP schemes like `javascript:`, `data:`, and `mailto:`.
It performs structural validation using the built-in `URL` constructor, then enforces
a restricted protocol and a clean ASCII hostname.

This helper is designed for client-side form validation, link sanitization, and
lightweight content moderation.

## Features

- ✅ Only `http` and `https` schemes allowed
- 🚫 Blocks `javascript:`, `data:`, `file:`, `ftp:`, and similar schemes
- ✅ Verifies hostname presence and rejects invalid characters (`<`, `>`, space)
- ✅ Browser and Node.js compatible
- ✅ No dependencies
- 🪶 <1 KB

## Usage

```js
import { isUrlSafe, normalizeUrl } from './url.js';

isUrlSafe('https://example.com');         // true
isUrlSafe('javascript:alert(1)');         // false
isUrlSafe('ftp://server.com');            // false
isUrlSafe('https://good.com/<bad>');      // false

normalizeUrl('https://example.com/path?q=1');
// -> 'https://example.com/path?q=1'
```

## API

### `isUrlSafe(raw: string): boolean`

Returns `true` only if the given string is a valid `http(s)` URL with a
non-empty hostname and without control characters.

### `normalizeUrl(raw: string): string`

Returns a normalized absolute URL (protocol, hostname, path, query, hash).
Returns an empty string if invalid.

## Example (test.html)

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

### Custom link
[💸 Direct contribution](https://wise.com/pay/me/yvanc7)
