#!/usr/bin/env node
/**
 * Auto bump npm package versions for AN5 packages.
 *
 * Defaults to the two public packages:
 *   - an5Adapters (@an5/adapters)
 *   - an5Orm (@an5/orm)
 *
 * Usage:
 *   node scripts/auto-bump-version.js                 # patch bump if needed
 *   node scripts/auto-bump-version.js minor
 *   node scripts/auto-bump-version.js major
 *   node scripts/auto-bump-version.js --dry-run
 *   node scripts/auto-bump-version.js --packages an5Adapters,an5Orm
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const args = process.argv.slice(2);
const bumpType = args.find((arg) => ['patch', 'minor', 'major'].includes(arg)) || 'patch';
const dryRun = args.includes('--dry-run');
const packageArgIndex = args.indexOf('--packages');
const packagePaths = packageArgIndex >= 0 && args[packageArgIndex + 1]
  ? args[packageArgIndex + 1].split(',').map((value) => value.trim()).filter(Boolean)
  : ['an5Adapters', 'an5Orm'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function compareVersions(a, b) {
  const left = String(a).split('.').map((part) => Number(part));
  const right = String(b).split('.').map((part) => Number(part));
  for (let index = 0; index < 3; index += 1) {
    const diff = (left[index] || 0) - (right[index] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function bumpVersion(version, type) {
  const parts = String(version).split('.').map((part) => Number(part));
  while (parts.length < 3) parts.push(0);
  if (type === 'major') {
    parts[0] += 1;
    parts[1] = 0;
    parts[2] = 0;
  } else if (type === 'minor') {
    parts[1] += 1;
    parts[2] = 0;
  } else {
    parts[2] += 1;
  }
  return parts.join('.');
}

function npmLatest(packageName) {
  try {
    return execSync(`npm view "${packageName}" version --registry=https://registry.npmjs.org/`, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error) {
    const output = `${error.stdout || ''}${error.stderr || ''}`;
    if (output.includes('E404') || output.includes('Not Found')) return null;
    throw error;
  }
}

function collectPackages(paths) {
  return paths.map((packagePath) => {
    const fullPath = path.resolve(ROOT, packagePath);
    const packageJsonPath = path.join(fullPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`Missing package.json: ${packageJsonPath}`);
    }
    const packageJson = readJson(packageJsonPath);
    if (!packageJson.name || !packageJson.version) {
      throw new Error(`Package must include name and version: ${packageJsonPath}`);
    }
    return { packagePath, fullPath, packageJsonPath, packageJson };
  });
}

function updateDependencyRange(packageJson, dependencyName, version) {
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    if (packageJson[field]?.[dependencyName]) {
      packageJson[field][dependencyName] = `^${version}`;
    }
  }
}

const packages = collectPackages(packagePaths);
const versionMap = new Map();

console.log(`\nAN5 auto version bump (${bumpType})${dryRun ? ' [dry-run]' : ''}\n`);

for (const entry of packages) {
  const { name, version } = entry.packageJson;
  const latest = npmLatest(name);
  const base = latest && compareVersions(latest, version) >= 0 ? latest : version;
  const next = latest && compareVersions(version, latest) > 0 ? version : bumpVersion(base, bumpType);
  versionMap.set(name, next);

  const latestLabel = latest || 'not published';
  console.log(`${name}: local ${version}, npm ${latestLabel} -> ${next}`);

  if (!dryRun) {
    entry.packageJson.version = next;
  }
}

for (const entry of packages) {
  for (const [dependencyName, version] of versionMap.entries()) {
    if (dependencyName !== entry.packageJson.name) {
      updateDependencyRange(entry.packageJson, dependencyName, version);
    }
  }
  if (!dryRun) {
    writeJson(entry.packageJsonPath, entry.packageJson);

    const pyprojectPath = path.join(entry.fullPath, 'pyproject.toml');
    if (fs.existsSync(pyprojectPath)) {
      let pyContent = fs.readFileSync(pyprojectPath, 'utf8');
      const nextVersion = entry.packageJson.version;
      pyContent = pyContent.replace(/version\s*=\s*"[^"]+"/, `version = "${nextVersion}"`);
      fs.writeFileSync(pyprojectPath, pyContent);
    }
  }
}

if (dryRun) {
  console.log('\nNo files changed.');
} else {
  console.log('\nUpdated package.json & pyproject.toml files:');
  for (const entry of packages) {
    console.log(`- ${path.relative(ROOT, entry.packageJsonPath)}`);
  }
}
