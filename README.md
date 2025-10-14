# is-email-safe

Zero-dependency email normalizer + validator.

- Conservative ASCII subset of RFC 5322  
- No UTF-8 local parts  
- No dependencies  
- MIT license

## Usage
```js
import { isEmail, normalizeEmail } from './email.js';

normalizeEmail('  Example@Domain.COM ');
// → "example@domain.com"

isEmail('user.name+tag@example.co');
// → true
