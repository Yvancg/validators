# Validators

A collection of minimal, dependency-free, security-focused input validation helpers for modern web and edge environments.

## Overview

**Validators** provides safe standalone, auditable modules designed to replace overcomplicated or vulnerable validation libraries. Each module focuses on a single responsibility and avoids risky features such as `eval`, regex backtracking, or URL parsing ambiguities.

Available modules:

- **is-card-safe** — Credit card validator with Luhn check and brand detection (Visa, Mastercard, Amex, etc.).  
  [![card gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/card.js.json)](./metrics/card.js.json)
  [![card ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/card.json)](./bench/card.json)

- **is-email-safe** — Strict RFC-like ASCII email validation, no external dependencies.  
  [![email gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/email.js.json)](./metrics/email.js.json)
  [![email ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/email.json)](./bench/email.json)

- **is-iban-safe** — ISO 13616 / ISO 7064 IBAN validator powered by the official SWIFT registry.  
  [![iban gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/iban.js.json)](./metrics/iban.js.json)
  [![iban ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/iban.json)](./bench/iban.json)

- **is-ip-safe** — IPv4 and IPv6 address validator with normalization and compression-safe parsing.  
  [![ip gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/ip.js.json)](./metrics/ip.js.json)
  [![ip ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/ip.json)](./bench/ip.json)

- **is-json-safe** — JSON structure validator and sanitizer that enforces depth, size, and key limits.  
  [![json gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/json.js.json)](./metrics/json.js.json)
  [![json ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/json.json)](./bench/json.json)

- **is-password-safe** — Password strength and safety validator (entropy, sequences, dictionary words, and repetition checks).  
  [![password gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/password.js.json)](./metrics/password.js.json)
  [![password ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/password.json)](./bench/password.json)

- **is-phone-e164** — E.164 international phone number validator with normalization.  
  [![phone gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/phone.js.json)](./metrics/phone.js.json)
  [![phone ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/phone.json)](./bench/phone.json)

- **is-url-safe** — Conservative `http(s)`-only URL validator resistant to bypass attacks.  
  [![url gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/url.js.json)](./metrics/url.js.json)
  [![url ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/url.json)](./bench/url.json)

- **is-us-tin-safe** — Validates U.S. Taxpayer Identification Numbers (EIN, SSN, ITIN).   
  [![tin gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/tin.js.json)](./metrics/tin.js.json)
  [![tin ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/tin.json)](./bench/tin.json)

- **is-vat-safe** — EU VAT ID pattern validator for all member states (format-only, no checksum).  
  [![vat gzip](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/metrics/vat.js.json)](./metrics/vat.js.json)
  [![vat ops/s](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/yvancg/validators/main/bench/vat.json)](./bench/vat.json)

All helpers are designed for use in:
- Browsers (ESM)
- Node.js / Deno / Bun (import)
- Edge runtimes (Cloudflare Workers, Vercel Edge, etc.)

Each module has its own `README.md`, tests, and can be imported individually.

## 🔗 Live Demos (GitHub Pages)

You can try each validator interactively in your browser:

- [Card Validator Test](https://yvancg.github.io/validators/is-card-safe/card-test.html)
- [Email Validator Test](https://yvancg.github.io/validators/is-email-safe/email-test.html)
- [IBAN Validator Test](https://yvancg.github.io/validators/is-iban-safe/iban-test.html)
- [IP Validator Test](https://yvancg.github.io/validators/is-ip-safe/ip-test.html)
- [JSON Validator Test](https://yvancg.github.io/validators/is-json-safe/json-test.html)
- [Password Validator Test](https://yvancg.github.io/validators/is-password-safe/password-test.html)
- [Phone Validator Test](https://yvancg.github.io/validators/is-phone-e164/phone-test.html)
- [URL Validator Test](https://yvancg.github.io/validators/is-url-safe/url-test.html)
- [US TIN Validator Test](https://yvancg.github.io/validators/is-us-tin-safe/tin-test.html)
- [EU VAT Validator Test](https://yvancg.github.io/validators/is-vat-safe/vat-test.html)

Each page loads its respective module and allows interactive validation.

## Install

npm i @yvancg/validators  # or per-module packages when published

## API Guarantees

- No eval or dynamic code.
- Regexes fuzz-tested for catastrophic backtracking.

## Design Principles

1. **Safety first:** Reject malformed or ambiguous inputs by default.
2. **No dependencies:** Avoids third-party packages that may introduce vulnerabilities.
3. **Auditable simplicity:** Clear logic under 150 lines per module.
4. **Portability:** Works across environments without build tools.
5. **Transparency:** Open source with no hidden telemetry or build steps.

## Example Usage

```js
import { validateCard } from './is-card-safe/card.js';
import { isEmailSafe } from './is-email-safe/email.js';
import { isIbanSafe } from './is-iban-safe/iban.js';
import { isIpSafe } from './is-ip-safe/ip.js';
import { isJsonSafe } from './is-json-safe/json.js';
import { validatePassword } from './is-password-safe/password.js';
import { isPhoneE164 } from './is-phone-e164/phone.js';
import { isUrlSafe } from './is-url-safe/url.js';
import { validateITIN } from './is-us-tin-safe/tin.js';
import { isVatSafe } from './is-vat-safe/vat.js';

console.log(validateCard('4111111111111111'));              // { ok: true, brand: 'visa', ... }
console.log(isEmailSafe('user@example.com'));               // true
console.log(isIbanSafe('DE44500105175407324931'))           // { ok: true, ... }
console.log(isIpSafe('192.168.0.1'));                       // true
console.log(isJsonSafe('{"user":"alice","id":123}'));       // true
console.log(validatePassword('Aj4?mX9^kL3!yZ'));						 // { ok: true, score: 3, entropyBits: 88, ... }
console.log(isPhoneE164('+12025550123'));                   // true
console.log(isUrlSafe('https://example.com'));              // true
console.log(validateITIN('12-3456789'));                    // { ok: true, type: 'ein', ... }
console.log(isVatSafe('DE123456789'));                      // { ok: true, country: 'DE', ... }
```

## Folder Structure

```
validators/
  ├─ .github/
  │   └─ FUNDING.yml
  ├─ LICENSE
  ├─ README.md
  ├─ SECURITY.md
  ├─ is-card-safe/
  ├─ is-email-safe/
  ├─ is-iban-safe/
  ├─ is-ip-safe/
  ├─ is-json-safe/
  ├─ is-password-safe/
  ├─ is-phone-e164/
  ├─ is-url-safe/
  ├─ is-us-tin-safe/
  └─ is-vat-safe/
```

## Security Notes

- All regexes are tested for ReDoS safety.
- No dynamic code execution or eval-like patterns are used.
- URLs are normalized before validation and restricted to `http` and `https` schemes.
- Emails and phones are validated according to conservative subsets of relevant RFCs and ITU standards.

## Contributing

Pull requests for additional safe validators (e.g., IBAN, domain names, etc.) are welcome. Please maintain the following rules:

- Pure functions only (no side effects)
- No external dependencies
- 100% test coverage for new logic
- TypeScript or plain ESM JavaScript

## License

Licensed under the **MIT License** — see [LICENSE](./LICENSE).

## Funding

If you find this project useful, please consider sponsoring its continued maintenance and security audits.

You can sponsor this project through:

- GitHub Sponsors: [https://github.com/sponsors/yvancg](https://github.com/sponsors/yvancg)
- Or any link listed in `.github/FUNDING.yml`

---

© 2025 Y Consulting LLC / Validators Project
