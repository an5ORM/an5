import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
const guard = fs.readFileSync(path.join(root, 'scripts/security/braces-depth-guard.cjs'), 'utf8');
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
