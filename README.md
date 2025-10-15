# Validators

A collection of minimal, dependency-free, security-focused input validation helpers for modern web and edge environments.

## Overview

**Validators** provides safe standalone, auditable modules designed to replace overcomplicated or vulnerable validation libraries. Each module focuses on a single responsibility and avoids risky features such as `eval`, regex backtracking, or URL parsing ambiguities.

Available modules:

- **is-email-safe** — Strict RFC-like ASCII email validation, no external dependencies.
- **is-iban-valid** — ISO 13616 / ISO 7064 IBAN validator powered by the official SWIFT registry.
- **is-phone-e164** — E.164 international phone number validator with normalization.
- **is-url-safe** — Conservative `http(s)`-only URL validator resistant to bypass attacks.

All helpers are designed for use in:
- Browsers (ESM)
- Node.js / Deno / Bun (import)
- Edge runtimes (Cloudflare Workers, Vercel Edge, etc.)

Each module has its own `README.md`, tests, and can be imported individually.

## Design Principles

1. **Safety first:** Reject malformed or ambiguous inputs by default.
2. **No dependencies:** Avoids third-party packages that may introduce vulnerabilities.
3. **Auditable simplicity:** Clear logic under 150 lines per module.
4. **Portability:** Works across environments without build tools.
5. **Transparency:** Open source with no hidden telemetry or build steps.

## Example Usage

```js
import { isEmailSafe } from './is-email-safe/email.js';
import { isIbanSafe } from './is-iban-valid/iban.js';
import { isPhoneE164 } from './is-phone-e164/phone.js';
import { isUrlSafe } from './is-url-safe/url.js';

console.log(isEmailSafe('user@example.com'));     // true
console.log(isIbanSafe('DE44500105175407324931')) // { ok: true, ... }
console.log(isPhoneE164('+12025550123'));         // true
console.log(isUrlSafe('https://example.com'));    // true
```

## Folder Structure

```
validators/
  ├─ .github/
  │   └─ FUNDING.yml
  ├─ LICENSE
  ├─ README.md
  ├─ is-email-safe/
  ├─ is-iban-valid/
  ├─ is-phone-e164/
  └─ is-url-safe/
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
