# is-password-safe

[![password gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/password.js.json)](../metrics/password.js.json)
[![password ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/password.json)](../bench/password.json)

**Lightweight, dependency-free password validator.**  
Password strength and safety validator.  
No catastrophic regex. Runs in O(n) time.

---

## 🚀 Why

Common password validators only check length or character mix.  
This module focuses on *actual security* — entropy, structure, and predictability.  
`is-password-safe` rejects passwords that look random but follow obvious keyboard or  
dictionary patterns, while staying fast, dependency-free, and safe for browser use.

---

## 🌟 Features

- ✅ Detects short, weak, or repetitive passwords  
- ✅ Detects sequences like `abcd` or `1234`  
- ✅ Flags dictionary-like passwords (`password123`, `qwerty`, etc.)  
- ✅ Estimates entropy in bits  
- ✅ Reports missing character sets (lower, upper, digit, symbol)  
- ✅ No external dependencies  
- ✅ Browser and Node compatible  

---

## 📦 Usage

```js
import { validatePassword } from './is-password-safe/password.js';

const result = validatePassword('Aj4?mX9^kL3!yZ');

console.log(result);
/*
{
  ok: true,
  score: 3,
  entropyBits: 88,
  length: 14,
  sets: { lower: true, upper: true, digit: true, symbol: true },
  reasons: [],
  suggestions: []
}
*/
```

---

## 🧩 Validation rules

A password is considered **safe** (`ok: true`) only if:

- Its length ≥ **12** characters (default)  
- Estimated entropy ≥ **60 bits**  
- Contains at least one **lowercase**, **uppercase**, **digit**, and **symbol**  
- Does **not** contain dictionary words from the internal weak-word list  
- Does **not** include **sequential runs** like `abcd`, `1234`, or `qwerty`  
- Does **not** include **repeated blocks** like `abcabc` or `xxx`  
- Contains no catastrophic regex or unsafe characters (checked O(n))

Any failed rule adds a `reason` and suggested fix in the result.

---

## 🧠 API

**Options**
```ts
validatePassword(password: string, opts?: {
  minLength?: number;
  maxLength?: number;
  minEntropy?: number;
  requireSets?: Array<'lower'|'upper'|'digit'|'symbol'>;
  dictionaries?: string[];
}): {
  ok: boolean;
  score: 0|1|2|3|4;
  entropyBits: number;
  length: number;
  sets: { lower:boolean; upper:boolean; digit:boolean; symbol:boolean };
  reasons: string[];
  suggestions: string[];
}
```

**Scoring**
| Score | Meaning       |
|:------|:--------------|
| 0     | Very weak     |
| 1     | Weak          |
| 2     | Moderate      |
| 3     | Strong        |
| 4     | Very strong   |

---

## 🧪 Example (`test.html`)

```html
<!doctype html>
<html>
  <body>
    <main>
      <input id="pw" type="password" placeholder="Type a password" />
      <button id="btn">Validate</button>
      <pre id="out">…</pre>
    </main>
    <script type="module">
      import { validatePassword } from './password.js';
      const $ = (id) => document.getElementById(id);
      $('btn').addEventListener('click', () => {
        const res = validatePassword($('pw').value);
        $('out').textContent = JSON.stringify(res, null, 2);
      });
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Open `password-test.html` in your browser  
or try the hosted demo 👉🏻 
[Password Validator Test](https://yvancg.github.io/validators/is-password-safe/password-test.html)

---

## 🛠 Development

This module is standalone. Copy `password.js` into your project.  
No `npm install` or build step required.

---

## 🔒 Notes

- Default minimum length: 12
- Default minimum entropy: 60 bits
- Extend dictionaries to block additional weak words.
- Use only local logic; no network calls by default.
  
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
