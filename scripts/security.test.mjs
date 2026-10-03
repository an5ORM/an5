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

test('dependency audit contains no unmitigated advisory', () => {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['audit', '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  if (result.error) throw result.error;
  const audit = JSON.parse(result.stdout);
  assert.ok(audit.metadata && !audit.error, `npm audit failed: ${JSON.stringify(audit.error)}`);
  const vulnerabilities = audit.vulnerabilities || {};
  const checked = new Set();
  function verify(name, visiting = new Set()) {
    if (checked.has(name)) return;
    assert.ok(!visiting.has(name), `Unexpected advisory cycle at ${name}`);
    visiting.add(name);
    const item = vulnerabilities[name];
    assert.ok(item, `Missing audit dependency ${name}`);
    for (const advisory of item.via) {
      if (typeof advisory === 'string') verify(advisory, new Set(visiting));
      else assert.equal(advisory.url, 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm', `Unmitigated advisory: ${name}: ${advisory.title}`);
    }
    if (name === 'braces') for (const location of item.nodes) {
      const parser = fs.readFileSync(new URL(location + '/lib/parse.js', root), 'utf8');
      assert.ok(parser.includes('Brace pattern exceeds safe nesting limit'), `Missing mitigation: ${location}`);
    }
    checked.add(name);
  }
  for (const name of Object.keys(vulnerabilities)) verify(name);
  console.log(`Audit: ${Object.keys(vulnerabilities).length} affected entries, all covered by the tested braces backport`);
});
