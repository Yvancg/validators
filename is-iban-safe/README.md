# is-iban-safe

**Tiny, dependency-free IBAN validator and normalizer (ISO 13616 + ISO 7064).**  
Lightweight, auditable, and backed by the official SWIFT IBAN Registry.

---

## 🚀 Why
Most IBAN libraries depend on legacy regex sets or outdated country lists.  
`is-iban-valid` is a single-file validator that loads an up-to-date registry snapshot from SWIFT and verifies every rule natively — checksum, country length, and BBAN structure.

---

## 📦 Usage
```bash
import { isIbanSafe } from './is-iban-safe/iban.js';

isIbanSafe('DE44500105175407324931');
// → { ok: true, normalized: 'DE44500105175407324931', issues: [] }

isIbanSafe('DE00500105175407324931');
// → { ok: false, issues: ['checksum_failed'] }

isIbanSafe('IR062960000000100324200001', { blockCountries: ['IR'] });
// → { ok: false, issues: ['country_blocked'] }
```

---

## 🧩 Validation rules
-	Country must exist in the SWIFT IBAN Registry
-	Total length matches registry entry
- Check digits pass ISO 7064 Mod-97 checksum
- Structure follows country-specific BBAN pattern
- Optional allowlist / blocklist filters by country code
- Optional strict casing (reject lowercase input)

---

## 🧪 Browser test
Clone the repo, open `iban-test.html` — interactive test in your browser.

---

## 🛠 Development
This module is standalone. You can copy `iban.js` and `iban_registry_full.json` into your own project.  
No `npm install` or build step required.

To refresh the registry:
	1.	Download the latest SWIFT IBAN Registry from
https://www.swift.com/swift-resource/11971/download
	2.	Run the parser script to rebuild `iban_registry_full.json`
	3.	Verify all examples pass Mod-97 and length checks

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
