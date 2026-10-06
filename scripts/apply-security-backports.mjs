import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
const guard = fs.readFileSync(path.join(root, 'scripts/security/braces-depth-guard.cjs'), 'utf8');
const precisionGuard = fs.readFileSync(path.join(root, 'scripts/security/sprintf-precision-guard.cjs'), 'utf8');
let patched = 0;
for (const [location, entry] of Object.entries(lock.packages)) {
  if (!location.endsWith('/braces')) continue;
  const dir = path.join(root, location, 'lib');
  if (!fs.existsSync(dir)) continue;
  if (entry.version !== '3.0.3') throw new Error(`Review the braces backport for version ${entry.version}`);
  fs.writeFileSync(path.join(dir, 'an5-depth-guard.js'), guard);
  for (const [file, anchor] of [
    ['compile.js', 'const compile = (ast, options = {}) => {'],
    ['expand.js', 'const expand = (ast, options = {}) => {'],
    ['stringify.js', 'module.exports = (ast, options = {}) => {'],
  ]) {
    const target = path.join(dir, file);
    const source = fs.readFileSync(target, 'utf8');
    if (source.includes("require('./an5-depth-guard')(ast)")) continue;
    if (!source.includes(anchor)) throw new Error(`Unsupported braces source: ${target}`);
    fs.writeFileSync(target, source.replace(anchor, `${anchor}\n  require('./an5-depth-guard')(ast);`));
  }
  const parser = path.join(dir, 'parse.js');
  const source = fs.readFileSync(parser, 'utf8');
  if (!source.includes('Brace pattern exceeds safe nesting limit')) {
    if (!source.includes('stack.push(block);')) throw new Error(`Unsupported braces parser: ${parser}`);
    fs.writeFileSync(parser, source.replaceAll('stack.push(block);', "stack.push(block);\n      if (stack.length > 64) throw new SyntaxError('Brace pattern exceeds safe nesting limit');"));
  }
  patched++;
}
console.log(`Security backport: protected ${patched} braces installation(s) against GHSA-vfj7-8cjw-p6xm`);

// sprintf-js passes precision digits to the numeric conversions unchecked, so a precision
// past the ECMAScript limit aborts the call with an uncaught RangeError
// (GHSA-hp3w-g68c-fv3c). Every use of the parsed precision is routed through the guard,
// which clamps it instead of letting the conversion throw. The minified bundle is not
// patched: the package entry point is src/sprintf.js and nothing in the workspace imports
// the bundle.
let precisionPatched = 0;
for (const [location, entry] of Object.entries(lock.packages)) {
  if (!location.endsWith('/sprintf-js')) continue;
  const dir = path.join(root, location, 'src');
  const target = path.join(dir, 'sprintf.js');
  if (!fs.existsSync(target)) continue;
  if (entry.version !== '1.1.3') throw new Error(`Review the sprintf-js backport for version ${entry.version}`);
  fs.writeFileSync(path.join(dir, 'an5-precision-guard.js'), precisionGuard);
  const source = fs.readFileSync(target, 'utf8');
  if (source.includes("require('./an5-precision-guard')")) {
    precisionPatched++;
    continue;
  }
  if (!source.includes('switch (ph.type) {')) throw new Error(`Unsupported sprintf-js source: ${target}`);
  // The precision is replaced everywhere it is read, argument included — clamping only the
  // condition would leave the unbounded digits in the conversion, which is the advisory.
  const replaced = source.replaceAll('ph.precision', 'an5_precision');
  fs.writeFileSync(
    target,
    replaced.replace(
      'switch (ph.type) {',
      "var an5_precision = require('./an5-precision-guard')(ph.precision, ph.type)\n                switch (ph.type) {"
    )
  );
  precisionPatched++;
}
console.log(`Security backport: bounded precision in ${precisionPatched} sprintf-js installation(s) against GHSA-hp3w-g68c-fv3c`);
