# is-card-safe

**Lightweight, dependency-free credit card validator and brand detector.**  
Performs Luhn checksum, detects brand (Visa, Mastercard, Amex, etc.), and normalizes safely.  
No dependencies. No runtime risk.

---

## 🚀 Why
Most credit card libraries are heavy, outdated, or expose data risk.  
`is-card-safe` is a single auditable file that performs format and checksum validation without sending or logging card numbers.

---

## 📦 Usage
```js
import { validateCard } from './is-card-safe/card.js';

validateCard('4111 1111 1111 1111');
// → { ok: true, normalized: '4111111111111111', brand: 'visa', last4: '1111', issues: [] }

validateCard('5555 5555 5555 4444');
// → { ok: true, normalized: '5555555555554444', brand: 'mastercard', last4: '4444', issues: [] }

validateCard('1234 5678 9012 3456');
// → { ok: false, brand: 'unknown', issues: ['luhn_failed', 'unknown_brand'] }
```

---

## 🧩 Validation rules
- Digits-only after normalization
- Luhn (mod-10) checksum required
- Length 12–19 digits
- Brand recognition (Visa, Mastercard, Amex, Discover, JCB, Diners, UnionPay, Maestro, MIR)
- Optional country or brand policy filters via allowBrands / blockBrands
- No external API or BIN lookup required

---

## 🧪 Browser test
Clone the repo, open `card-test.html` — interactive test in your browser
or click 👉🏻 [Card Validator Test](https://yvancg.github.io/validators/is-card-safe/card-test.html)

You can test Visa, Mastercard, Amex, Discover, JCB, UnionPay, and more directly in here.

---

## 🛠 Development
This module is standalone. You can copy `card.js` into your own project.  
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
