# is-card-safe

[![card gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/card.js.json)](../metrics/card.js.json)
[![card ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/card.json)](../bench/card.json)

**Lightweight, dependency-free credit card validator and brand detector.**  
Performs Luhn checksum, detects brand (Visa, Mastercard, Amex, etc.), and normalizes safely.

---

## 🚀 Why

Most card libraries are heavy or outdated.  
`is-card-safe` is a single auditable file that validates format and checksum locally. No network calls. No logging.

---

## 🌟 Features

- ✅ Luhn (mod-10) checksum  
- ✅ Brand detection: Visa, Mastercard, Amex, Discover, JCB, Diners, UnionPay, Maestro, MIR  
- ✅ Normalizes input to digits-only and exposes `last4`  
- ✅ Optional allow/block brand policies  
- ✅ Works in browsers, Node.js, and edge runtimes  
- ✅ Zero dependencies — pure ES module

---

## 📦 Usage

```js
import { validateCard } from './card.js';

validateCard('4111 1111 1111 1111');
// → { ok: true, normalized: '4111111111111111', brand: 'visa', last4: '1111', issues: [] }

validateCard('5555 5555 5555 4444');
// → { ok: true, normalized: '5555555555554444', brand: 'mastercard', last4: '4444', issues: [] }

validateCard('1234 5678 9012 3456');
// → { ok: false, brand: 'unknown', issues: ['luhn_failed','unknown_brand'] }

validateCard('4111 1111 1111 1111', { allowBrands: ['mastercard'] });
// → { ok: false, brand: 'visa', issues: ['brand_not_allowed'] }
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
      <input id="pan" placeholder="4111 1111 1111 1111" />
      <button id="btn">Validate</button>
      <pre id="out">…</pre>
    </main>
    <script type="module">
      import { validateCard } from './card.js';
      const $ = (id) => document.getElementById(id);
      $('btn').addEventListener('click', () => {
        const res = validateCard($('pan').value);
        $('out').textContent = JSON.stringify(res, null, 2);
      });
    </script>
  </body>
</html>
```

---

## 🧪 Browser test

Open `card-test.html` in your browser  
or try the hosted demo 👉🏻 
[Card Validator Test](https://yvancg.github.io/validators/is-card-safe/card-test.html)

---

## 🛠 Development

This module is standalone. Copy `card.js` into your project.  
No `npm install` or build step required.

---

## 🔒 Notes

Do not log full PANs in production. Mask when necessary (e.g. `**** **** **** 1111`).

---

## 🪪 License

MIT License  

Copyright (c) 2025 **Y Consulting LLC**
