# is-minify

[![minify gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/minify.js.json)](./metrics/minify.js.json)
[![minify ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/minify.json)](./bench/minify.json)

**Tiny, dependency-free minifier for JavaScript and CSS.**  
One file. ESM. Works in browser and Node.

---

## 🚀 Overview

`is-minify` removes comments and unnecessary whitespace while preserving semantics.  
It safely handles strings, template literals, and regex literals in JS, and preserves CSS structure.

- 🟢 JS: Keeps strings, template literals, and regex literals intact  
- 🟣 CSS: Strips comments and tightens spaces around tokens  

---

## 🌟 Features

- ✅ JS and CSS modes in one module  
- ✅ Safe comment stripping and whitespace collapse  
- ✅ No AST, no build step, no dependencies  
- ✅ Works in browser, Node.js, and edge runtimes  

---

## 📦 Usage

```js
import { minify, minifyJS, minifyCSS } from './minify.js';

// JavaScript
const js = `
function greet (name) {
  const msg = \`Hello, \${name}!\`; // inline
  return msg;
}
`;
console.log(minifyJS(js));

// CSS
const css = `
/* button */
.btn {
  color: #fff !important ;
  background : #111827 ;
}
`;
console.log(minifyCSS(css));

// Generic entry point
console.log(minify(js, 'js'));
console.log(minify(css, 'css'));
```

---

## 🧠 API

### `minify(source: string, kind: 'js' | 'css'): string`

Unified entry. Routes to the right minifier.

### `minifyJS(source: string): string`

Conservative JS minifier.  
Handles `//` and `/*...*/` comments, strings, template literals, and regex literals.

### `minifyCSS(source: string): string`

Conservative CSS minifier.  
Strips `/*...*/` comments, collapses whitespace, and tightens `: ; { } , > + ~ =`.

---

## 🧪 Example (test.html)

```html
<!doctype html>
<html>
  <body>
    <script type="module">
      import { minifyJS, minifyCSS } from './minify.js';
      console.log(minifyJS(`function x () { // hi
        return 1 + 2 ;
      }`));
      console.log(minifyCSS(`body { color : red ; } /* c */`));
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Clone the repo, open `minify-test.html` — interactive test in your browser  
or click 👉🏻 [Minification Test](https://yvancg.github.io/validators/is-minify/minify-test.html)

---

## 🛠 Development

This module is standalone. You can copy `minify.js` into your own project.  
No `npm install` or build step required.

### Node one-liners

```bash
node is-minify/minify.js js < app.js > app.min.js
node is-minify/minify.js css < styles.css > styles.min.css
```

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
