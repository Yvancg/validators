# phone-e164

**Tiny, dependency-free E.164 phone validator and normalizer.**  
Lightweight, auditable, and safe to embed directly in web or backend code.

---

## 🚀 Why
Most phone validation libraries are heavy or depend on outdated regex sets.  
`phone-e164` is a single file — zero dependencies, zero runtime risk.

Install (optional):
```bash
npm i phone-e164

Or copy phone.js directly into your project.

## 📦 Usage
normalizePhone(' (415) 555-0123 '); // "+4155550123"
isE164('+4155550123'); // true
validatePhone('415-555-0123'); // true (normalizes to +4155550123)


---

## 🧩 Validation rules
- Total length ≤ 254  
- Local part ≤ 64  
- ASCII-only (no UTF-8 emoji or accents)  
- No consecutive dots or leading/trailing dots  
- Domain has ≥ 2 labels  
- TLD = letters only, 2–63 chars  

---

## 🧪 Browser test
Clone the repo, open `test.html` — interactive test in your browser.

---

## 🛠 Development
This module is standalone. You can copy `email.js` into your own project.  
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
