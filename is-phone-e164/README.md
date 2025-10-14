# phone-e164

Tiny, dependency-free E.164 phone validator and normalizer.

## Install
npm i phone-e164

## Use
```ts
import { normalizePhone, isE164, validatePhone } from 'phone-e164';

normalizePhone(' (415) 555-0123 '); // "+4155550123"
isE164('+4155550123'); // true
validatePhone('415-555-0123'); // true (normalizes to +4155550123)
