# is-email-safe
Strict, dependency-free email validator. ASCII local-part only. No regex DoS. MIT.

## Usage
```js
import { isEmail } from 'is-email-safe';
isEmail('user+tag@example.com'); // true
