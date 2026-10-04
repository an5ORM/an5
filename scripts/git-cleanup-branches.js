#!/usr/bin/env node
/**
 * git-cleanup-branches.js
 *
 * Deletes all remote branches except `main` from the main repo
 * and every git submodule defined in .gitmodules.
 *
 * Usage:
 *   node scripts/git-cleanup-branches.js
 *   node scripts/git-cleanup-branches.js --preview   # preview only
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
for (const arg of process.argv.slice(2)) {
  if (arg.startsWith('--') && !['--preview'].includes(arg)) throw new Error(`Unknown option: ${arg}; use --preview to inspect without changes`);
}
const PREVIEW = process.argv.includes("--preview");
const KEEP = new Set(["main", "HEAD"]);

function run(cmd, opts = {}) {
  const cwd = opts.cwd || ROOT;
  console.log(`  $ ${cmd}`);
  if (PREVIEW) return "";
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch (e) {
    console.error(`  ✖ Error: ${e.stderr?.trim() || e.message}`);
    return "";
  }
}

function getRemoteBranches(cwd) {
  const output = run("git branch -r", { cwd });
  if (!output) return [];
  return output
    .split("\n")
    .map((b) => b.trim())
    .filter((b) => b && !b.includes("->"))
    .map((b) => b.replace(/^origin\//, ""))
    .filter((b) => !KEEP.has(b));
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

// ── Main ──────────────────────────────────────────────────────────────────────

const submodules = getSubmodules();
const allRepos = [{ name: path.basename(ROOT) + " (main)", cwd: ROOT }];
for (const sm of submodules) {
  const smPath = path.join(ROOT, sm);
  if (fs.existsSync(smPath)) {
    allRepos.push({ name: sm, cwd: smPath });
  }
}

console.log(PREVIEW ? "🔍 PREVIEW — no changes will be made\n" : "🗑️  Cleaning up branches across all repos\n");
console.log(`Found ${allRepos.length} repo(s) to process\n`);

let totalDeleted = 0;

for (const repo of allRepos) {
  const branches = getRemoteBranches(repo.cwd);
  if (branches.length === 0) {
    console.log(`  ${repo.name}: no extra branches`);
    continue;
  }

  console.log(`  ${repo.name}: deleting ${branches.length} branch(es): ${branches.join(", ")}`);
  for (const branch of branches) {
    run(`git push origin --delete ${branch}`, { cwd: repo.cwd });
    totalDeleted++;
  }
}

console.log(`\n✅ Done. Deleted ${totalDeleted} branch(es) total.`);
if (PREVIEW) console.log("   (preview — nothing was actually deleted)");
