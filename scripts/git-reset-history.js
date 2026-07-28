#!/usr/bin/env node
/**
 * git-reset-history.js
 *
 * Resets ALL git history for the main repo and all submodules:
 *   1. Creates orphan commit (no history) for each submodule + force push
 *   2. Updates submodule pointers in the main repo
 *   3. Creates orphan commit for the main repo + force push
 *
 * Usage:
 *   node scripts/git-reset-history.js
 *   node scripts/git-reset-history.js --dry-run   # preview only
 *
 * WARNING: Destructive! All previous commits are permanently lost.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");
const BRANCH = "main";

function run(cmd, opts = {}) {
  const cwd = opts.cwd || ROOT;
  const label = cwd === ROOT ? "" : `[${path.basename(cwd)}] `;
  console.log(`  ${label}$ ${cmd}`);
  if (DRY_RUN) return "";
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch (e) {
    console.error(`  ${label}✖ Error: ${e.stderr?.trim() || e.message}`);
    return "";
  }
}

function getSubmodules() {
  const gitmodulesPath = path.join(ROOT, ".gitmodules");
  if (!fs.existsSync(gitmodulesPath)) return [];
  const content = fs.readFileSync(gitmodulesPath, "utf8");
  const paths = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*path\s*=\s*(.+)$/);
    if (m) paths.push(m[1].trim());
  }
  return paths;
}

function resetRepo(cwd, name) {
  console.log(`\n>>> ${name}`);
  const currentBranch = run("git rev-parse --abbrev-ref HEAD", { cwd }) || BRANCH;
  run("git checkout --orphan latest_branch", { cwd });
  run("git add -A", { cwd });
  run('git commit -m "Initial commit"', { cwd });
  run(`git branch -D ${currentBranch} || true`, { cwd });
  run(`git branch -m ${currentBranch}`, { cwd });
  run(`git push -f origin ${currentBranch}`, { cwd });
  console.log(`  ✅ ${name} — new commit: ${run("git rev-parse HEAD", { cwd })}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const submodules = getSubmodules();

console.log(DRY_RUN ? "🔍 DRY RUN — no changes will be made\n" : "⚠️  WARNING: This will PERMANENTLY delete ALL git history!\n");
console.log(`Root: ${ROOT}`);
console.log(`Submodules: ${submodules.length > 0 ? submodules.join(", ") : "(none)"}\n`);

if (!DRY_RUN) {
  console.log("Starting in 5 seconds... Press Ctrl+C to abort.\n");
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);
}

// 1. Process each submodule
for (const sm of submodules) {
  const smPath = path.join(ROOT, sm);
  if (fs.existsSync(smPath)) {
    resetRepo(smPath, sm);
  }
}

// 2. Update submodule pointers in parent
console.log(`\n>>> Updating submodule pointers`);
run(`git add ${submodules.join(" ")}`);

// 3. Process main repo
resetRepo(ROOT, path.basename(ROOT) + " (main)");

console.log(`\n✅ ALL DONE — ${submodules.length + 1} repos reset.`);
