# is-uuid-safe

A small, dependency-free UUID syntax validator for canonical RFC 9562 UUIDs.

## Usage

~~~js
import { isUuidSafe } from './uuid.js';

isUuidSafe('550e8400-e29b-41d4-a716-446655440000'); // true
isUuidSafe('550e8400-e29b-41d4-a716-446655440000', { version: 4 }); // true
isUuidSafe('01890f5a-6c5d-7b72-9fc0-61a7aab1976a', { version: 7 }); // true
isUuidSafe('550e8400-e29b-41d4-a716-446655440000', { version: 7 }); // false
~~~

Returns a boolean. Accepts versions 1–8 with the RFC variant (8, 9, a, or b), with uppercase or lowercase hex. The optional numeric version requires an exact match.

Rejects UUIDs with braces, URN prefixes, omitted hyphens, malformed versions/variants, and special nil/max values. This is syntax validation only; it does not establish that a UUID was randomly generated or is unique.
