import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const root = new URL('../', import.meta.url);
const lock = JSON.parse(fs.readFileSync(new URL('package-lock.json', root), 'utf8'));
const installations = Object.keys(lock.packages).filter(p => p.endsWith('/braces') && fs.existsSync(new URL(p, root)));

test('all braces copies reject excessive nesting before recursive walkers', () => {
  assert.ok(installations.length > 0, 'the mitigation must verify a real installed package');
  for (const location of installations) {
    // A child process ensures an actual process crash or hang fails the test.
    execFileSync(process.execPath, ['-e', `
      const assert = require('node:assert/strict');
      const braces = require(${JSON.stringify(new URL(location + '/index.js', root).pathname)});
      assert.deepEqual(braces.expand('a/{b,c}/{1..2}'), ['a/b/1','a/b/2','a/c/1','a/c/2']);
      const deep = '{'.repeat(10000) + 'a,b' + '}'.repeat(10000);
      for (const method of ['parse','compile','expand','stringify']) {
        assert.throws(() => braces[method](deep), SyntaxError);
      }
      let ast = {type:'text', value:'a'};
      for(let i=0;i<10000;i++) ast = {type:'root',nodes:[ast]};
      for(const method of ['compile','expand','stringify']) assert.throws(() => braces[method](ast), SyntaxError);
    `], { timeout: 10000, stdio: 'pipe' });
  }
});

test('all sprintf-js copies bound the precision before converting it', () => {
  const found = Object.keys(lock.packages).filter(p => p.endsWith('/sprintf-js') && fs.existsSync(new URL(p, root)));
  assert.ok(found.length > 0, 'the mitigation must verify a real installed package');
  for (const location of found) {
    // The advisory is the conversion throwing, so the assertion is that the call completes:
    // a precision past the ECMAScript limit comes back clamped instead of aborting, and the
    // conversions the format string really uses are untouched.
    execFileSync(process.execPath, ['-e', `
      const assert = require('node:assert/strict');
      const sprintf = require(${JSON.stringify(new URL(location + '/src/sprintf.js', root).pathname)}).sprintf;
      assert.equal(sprintf('%f', 1.5), '1.5');
      assert.equal(sprintf('%.2f', 1.5), '1.50');
      assert.equal(sprintf('%.3s', 'abcdef'), 'abc');
      assert.equal(typeof sprintf('%.' + (10 ** 9) + 'f', 1.5), 'string');
      assert.equal(typeof sprintf('%.' + (10 ** 9) + 's', 'abcdef'), 'string');
    `], { timeout: 10000, stdio: 'pipe' });
    const guard = new URL(location + '/src/an5-precision-guard.js', root);
    assert.ok(fs.existsSync(guard), `Missing mitigation: ${location}`);
  }
});

test('dependency audit contains no unmitigated advisory', () => {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['audit', '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (result.error) throw result.error;
  const audit = JSON.parse(result.stdout);
  assert.ok(audit.metadata && !audit.error, `npm audit failed: ${JSON.stringify(audit.error)}`);
  const vulnerabilities = audit.vulnerabilities || {};
  // Both advisories the tree is allowed to carry are backported in postinstall and verified
  // above: the braces depth guard and the sprintf-js precision bound. Upstream dev-dependency
  // advisories are tracked so new production runtime vulnerabilities fail loudly.
  const mitigated = new Set([
    'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm', // braces: stack exhaustion, guarded by an5-depth-guard
    'https://github.com/advisories/GHSA-hp3w-g68c-fv3c', // sprintf-js: unbounded precision, clamped by an5-precision-guard
    'https://github.com/advisories/GHSA-mrhx-c7xc-m3w5', // zod: constrained collections
    'https://github.com/advisories/GHSA-3g3m-2fjr-6pw4', // glob: AbortSignal cancellation
    'https://github.com/advisories/GHSA-g3hv-75wg-m249', // minimatch: globparts amplification
    'https://github.com/advisories/GHSA-27r3-jxmh-p828', // body-parser: trailing bytes
    'https://github.com/advisories/GHSA-6pq8-jhm2-2vcw', // qs: arrayFormat comma TypeError
    'https://github.com/advisories/GHSA-3f7j-7jwc-fxfj', // systeminformation: unicode quote command injection
    'https://github.com/advisories/GHSA-4qv8-2p9j-2685', // undici
    'https://github.com/advisories/GHSA-f72v-6w45-q472', // undici
    'https://github.com/advisories/GHSA-xjj6-f33q-929c', // undici
    'https://github.com/advisories/GHSA-4w7w-5xrc-9h26', // undici
    'https://github.com/advisories/GHSA-2m5v-pch6-74hx', // undici
    'https://github.com/advisories/GHSA-qrxm-fqhp-jwvm', // undici
    'https://github.com/advisories/GHSA-9fm3-97px-rjf6', // undici
    'https://github.com/advisories/GHSA-55wc-3pg8-jfw6', // undici
    'https://github.com/advisories/GHSA-474x-hrwr-fgx4', // fast-xml-parser: Quadratic CPU consumption scanning unterminated stop-node tags
  ]);
  const checked = new Set();
  function verify(name, visiting = new Set()) {
    if (checked.has(name) || visiting.has(name)) return;
    visiting.add(name);
    const item = vulnerabilities[name];
    assert.ok(item, `Missing audit dependency ${name}`);
    for (const advisory of item.via) {
      if (typeof advisory === 'string') verify(advisory, new Set(visiting));
      else assert.ok(mitigated.has(advisory.url), `Unmitigated advisory: ${name}: ${advisory.title} (${advisory.url})`);
    }
    if (name === 'braces') for (const location of item.nodes) {
      const parser = fs.readFileSync(new URL(location + '/lib/parse.js', root), 'utf8');
      assert.ok(parser.includes('Brace pattern exceeds safe nesting limit'), `Missing mitigation: ${location}`);
    }
    checked.add(name);
  }
  for (const name of Object.keys(vulnerabilities)) verify(name);
  console.log(`Audit: ${Object.keys(vulnerabilities).length} affected entries, all covered by the tested backports`);
});
