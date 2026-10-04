import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const script of ['scripts/git-reset-history.js', 'scripts/git-cleanup-branches.js', 'scripts/auto-bump-version.js', 'an5Orm/scripts/release.js']) {
  test(`${script} previews without writes and rejects unknown flags before mutations`, () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'an5-preview-options-'));
    try {
      const extra = script.includes('auto-bump') ? ['--packages', ','] : [];
      const preview = spawnSync(process.execPath, [path.join(root, script), '--preview', ...extra], {cwd, encoding:'utf8', timeout:10000});
      assert.equal(preview.status, 0, preview.stderr);
      for (const flag of ['--dry-run', '--unknown-option']) {
        const result = spawnSync(process.execPath, [path.join(root, script), flag], {cwd, encoding:'utf8', timeout:10000});
        assert.notEqual(result.status, 0); assert.match(result.stderr, /Unknown option/);
      }
      assert.deepEqual(fs.readdirSync(cwd), []);
    } finally { fs.rmSync(cwd, {recursive:true,force:true}); }
  });
}
