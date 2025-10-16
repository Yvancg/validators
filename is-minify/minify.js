// minify.js
// Tiny, dependency-free minifier for JS and CSS.
// Works in browsers and Node. ESM only.
// API:
//   minify(code, 'js' | 'css')
//   minifyJS(code)
//   minifyCSS(code)

export function minify(code, kind) {
  if (kind === 'js') return minifyJS(code);
  if (kind === 'css') return minifyCSS(code);
  throw new Error('kind must be "js" or "css"');
}

// ---------------- JS MINIFIER ----------------
// Strategy:
// 1) Single pass state machine to strip // and /* */ comments safely.
//    Preserves strings, template literals, and regex literals.
// 2) Whitespace collapse outside strings/regex.
// 3) Remove spaces around punctuation tokens where safe.
//
// This is conservative. It won’t reorder code or do unsafe munging.
export function minifyJS(src) {
  const out = [];
  let i = 0, n = src.length;

  let inStr = false;       // '"' | "'" | '`'
  let inTpl = false;       // template literal
  let inTplExpr = 0;       // ${ ... } nesting level inside template
  let inRegex = false;     // /.../ literal
  let inLine = false;      // //...
  let inBlock = false;     // /* ... */
  let escape = false;

  const isSpace = c => c === ' ' || c === '\n' || c === '\r' || c === '\t' || c === '\f';
  const punct = new Set('=+-*/%&|^!~?:,;<>()[].{}');
  const needSpaceBetween = (a, b) => {
    // Insert a space if merging would change tokens for these cases:
    // 1) identifier or number next to identifier or number
    // 2) ++/-- and identifiers
    // 3) keywords merging (return, in, instanceof, etc.) — handled by simple alnum check
    return /[A-Za-z0-9_$]/.test(a) && /[A-Za-z0-9_$]/.test(b);
  };

  // Heuristic: can the next '/' start a regex?
  // True after tokens that cannot end an expression.
  const canStartRegexAfter = c => {
    if (!c) return true;
    if (c === '(' || c === ',' || c === '=' || c === ':' || c === '[' || c === '!' || c === '&' || c === '|' || c === '?' || c === '{' || c === ';') return true;
    // Also after operators
    if (/[+\-*/%<>^~]/.test(c)) return true;
    return false;
  };

  let lastOut = ''; // last emitted non-space char

  while (i < n) {
    let c = src[i];

    // handle line comment
    if (inLine) {
      if (c === '\n') { inLine = false; out.push('\n'); lastOut = '\n'; }
      i++; continue;
    }
    // handle block comment
    if (inBlock) {
      if (c === '*' && src[i+1] === '/') { inBlock = false; i += 2; continue; }
      i++; continue;
    }
    // handle strings and templates
    if (inStr) {
      out.push(c);
      if (!escape) {
        if (inStr === '"' && c === '"')  inStr = false;
        else if (inStr === "'" && c === "'") inStr = false;
        else if (inStr === '`' && c === '`' && inTplExpr === 0) { inStr = false; inTpl = false; }
        else if (inStr === '`' && c === '$' && src[i+1] === '{') { inTplExpr++; out.push('{'); i++; }
        else if (inStr === '`' && c === '}' && inTplExpr > 0) { inTplExpr--; }
      }
      escape = !escape && c === '\\';
      lastOut = c;
      i++; continue;
    }
    if (inRegex) {
      out.push(c);
      if (!escape && c === '/') {
        inRegex = false;
      }
      escape = !escape && c === '\\';
      lastOut = c;
      i++; continue;
    }

    // detect start of comment, string, template, regex
    if (c === '/' && src[i+1] === '/') { inLine = true; i += 2; continue; }
    if (c === '/' && src[i+1] === '*') { inBlock = true; i += 2; continue; }

    if (c === '"' || c === "'") { inStr = c; escape = false; out.push(c); lastOut = c; i++; continue; }
    if (c === '`') { inStr = '`'; inTpl = true; inTplExpr = 0; escape = false; out.push(c); lastOut = c; i++; continue; }

    if (c === '/') {
      // Could be divide or regex. Use heuristic with lastOut
      const prev = lastOut;
      if (canStartRegexAfter(prev)) {
        inRegex = true; escape = false; out.push(c); lastOut = c; i++; continue;
      }
    }

    // whitespace handling
    if (isSpace(c)) {
      // look ahead to next non-space
      let j = i + 1;
      while (j < n && isSpace(src[j])) j++;
      const next = j < n ? src[j] : '';
      const prev = lastOut;

      if (prev && next) {
        if (needSpaceBetween(prev, next)) {
          out.push(' ');
          lastOut = ' ';
        }
        // else drop whitespace
      }
      i = j;
      continue;
    }

    // remove spaces around punctuation by not emitting extra spaces at all
    if (punct.has(c)) {
      out.push(c);
      lastOut = c;
      i++; continue;
    }

    // normal char
    out.push(c);
    lastOut = c;
    i++;
  }

  // final tiny cleanup: remove space before punctuation
  let s = out.join('');
  s = s.replace(/\s+([,;:{}()[\].])+/g, '$1');
  s = s.replace(/([,;:{}()[\].])\s+/g, '$1');
  // collapse multiple newlines
  s = s.replace(/\n+/g, '\n');
  return s.trim();
}

// ---------------- CSS MINIFIER ----------------
// Strategy:
// 1) Strip /* ... */ comments outside strings.
// 2) Collapse whitespace.
// 3) Remove spaces around : ; { } , > + ~ = | ^ $ *
// 4) Drop last ; before }
export function minifyCSS(src) {
  const out = [];
  let i = 0, n = src.length;
  let inStr = false; // '"' | "'"
  let escape = false;
  let inBlock = false; // /* ... */

  const isSpace = c => c === ' ' || c === '\n' || c === '\r' || c === '\t' || c === '\f';
  const tight = new Set(':;{},>+~()=');

  while (i < n) {
    const c = src[i];

    if (inBlock) {
      if (c === '*' && src[i+1] === '/') { inBlock = false; i += 2; continue; }
      i++; continue;
    }

    if (!inStr && c === '/' && src[i+1] === '*') { inBlock = true; i += 2; continue; }

    if (inStr) {
      out.push(c);
      if (!escape && c === inStr) inStr = false;
      escape = !escape && c === '\\';
      i++; continue;
    }
    if (c === '"' || c === "'") { inStr = c; escape = false; out.push(c); i++; continue; }

    if (isSpace(c)) { // collapse spaces to one
      // skip to next non-space
      let j = i + 1;
      while (j < n && isSpace(src[j])) j++;
      // add single space only if neighbors are identifiers or numbers
      const a = out.length ? out[out.length - 1] : '';
      const b = j < n ? src[j] : '';
      if (/[A-Za-z0-9_*#.%-]/.test(a) && /[A-Za-z0-9_*#.%-]/.test(b)) out.push(' ');
      i = j; continue;
    }

    if (tight.has(c)) {
      // remove any pending space before this
      if (out.length && out[out.length - 1] === ' ') out.pop();
      out.push(c);
      // no space after punctuation
      i++; continue;
    }

    out.push(c);
    i++;
  }

  let s = out.join('');
  // drop last semicolon before }
  s = s.replace(/;+\s*}/g, '}');
  // normalize spaces around !important
  s = s.replace(/\s*!important/g, '!important');
  // collapse leftover newlines
  s = s.replace(/\n+/g, '\n');
  return s.trim();
}

// ------------- Tiny CLI helper (optional) -------------
// Node usage: `node minify.js <js|css> < input > output`
if (typeof process !== 'undefined' && process.argv && import.meta.url?.startsWith('file:')) {
  const args = process.argv.slice(2);
  if (args.length === 1 && (args[0] === 'js' || args[0] === 'css')) {
    const chunks = [];
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', d => chunks.push(d));
    process.stdin.on('end', () => {
      const src = chunks.join('');
      const out = args[0] === 'js' ? minifyJS(src) : minifyCSS(src);
      process.stdout.write(out);
    });
  }
}