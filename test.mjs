import { isEmail } from './index.js';

const ok = [
  'a@b.co', 'user.name+tag@sub.example.com', 'UPPER_lower.1+2@exa-mple.org'
];
const bad = [
  '', 'a', 'a@', '@b', 'a..b@c.com', '.a@b.co', 'a.@b.co',
  'a@b', 'a@-b.co', 'a@b-.co', 'a@b..co', 'a@b.c', 'a@b.' + 'c'.repeat(64)
];

console.log('ok:', ok.every(isEmail), 'bad:', bad.every(x => !isEmail(x)));
if (!ok.every(isEmail) || !bad.every(x => !isEmail(x))) process.exit(1);
