#!/usr/bin/env node
/**
 * English-only guard for the whole workspace.
 *
 * Every language in this repo — TypeScript, Python, C#, Go, Rust, Markdown —
 * speaks English in its comments, its error messages and its docs, and English is
 * the only language the docs site and the CLI print. That is a convention nothing
 * else enforces: a Vietnamese comment in `pyproject.toml` or a translated error
 * string in a generator passes every other suite, because tests assert behaviour,
 * not prose. This script is the gate for the prose.
 *
 * What counts as a violation, in the order a line is judged:
 *
 *   1. Vietnamese letters — đ ơ ư ă and the Latin Extended Additional block. an5:allow-non-english
 *      (U+1EA0–U+1EF9). English needs none of them.
 *   2. Combining marks (U+0300–U+036F). Vietnamese typed as decomposed input
 *      arrives as combining marks, so this catches the text the precomposed
 *      ranges miss.
 *   3. Letters outside the Latin script — CJK, Cyrillic, Arabic, Hebrew, Greek,
 *      Devanagari, Thai, Hangul.
 *   4. Latin letters outside the Western and Central European repertoire, which
 *      catches what is left: pinyin carons, Belarusian and Ukrainian letters.
 *
 * Two false-positive sources are handled rather than fought: a contributor's name
 * may carry accents, and symbols such as µ and Ω are classified as letters. Both
 * have allowlists, and both exemptions are printed in the summary so an allowlist
 * entry cannot quietly rot.
 *
 * What the gate cannot see, stated plainly. It reads orthography, not language:
 *
 *   - Tone-stripped Vietnamese (`toi yeu ban`) is plain ASCII and reads as English.
 *   - So are `â ê ô` outside a tone-marked word, because French, Portuguese and
 *     Romanian share them and allowlisting those would let real French through.
 *     Every actual Vietnamese sentence still trips rule 1, since tone-marked vowels,
 *     đ, ơ, ư and ă are what the orthography is made of. an5:allow-non-english
 *   - Non-English prose written in English words is out of scope by definition.
 *
 * Two pragmas exempt intentional non-English content:
 *
 *   an5:allow-non-english        the line it appears on
 *   an5:allow-non-english-file   the whole file, but only from its header
 *
 * The file pragma is for fixtures whose purpose *is* the non-English text — the
 * UTF-8 round-trip tests in an5Adapters write Vietnamese on purpose — and it
 * belongs in the file header next to the sentence explaining why. Header-only is the
 * point: a document that merely quotes the token to describe it must not be able to
 * exempt itself, and TESTING.md does exactly that. Exempt files are also listed in
 * the summary, so an exemption cannot accumulate unnoticed. This file is the one
 * further exception to the file pragma: it names the pragma tokens in its own
 * documentation, so exempting itself would exempt the rule that checks everything
 * else. Its own lines can still be exempted individually.
 *
 * Run with `npm run test:lang`. Exits 1 on the first violating line of each file.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

// Build output, dependency trees and site output are copies of files that are
// themselves checked, so scanning them would report every violation twice.
const SKIP_DIRS = new Set([
  '.git', '.idea', '.vscode', '.github-cache', '.next', '.pytest_cache', '.mypy_cache',
  '.tox', '.venv', '__pycache__', '.jekyll-cache', '.jekyll-metadata', '_site',
  'node_modules', 'dist', 'build', 'coverage', 'out', 'target', 'bin', 'obj', 'vendor',
]);

// Generated or aggregated files: lockfiles pin thousands of upstream names, maps
// embed the sources already checked, and minified bundles have no line structure.
const SKIP_FILES = /(?:^|[\\/])(?:package-lock\.json|go\.sum|Cargo\.lock|.*\.lock|.*\.map|.*\.min\.(?:js|css))$/;
const SKIP_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.bmp', '.webp', '.pdf', '.zip', '.gz', '.tgz',
  '.woff', '.woff2', '.ttf', '.eot', '.dll', '.so', '.dylib', '.exe', '.wasm', '.jar',
  '.class', '.pyc', '.bin', '.db', '.sqlite',
]);

const TEXT_EXT = new Set([
  '.ts', '.tsx', '.js', '.mjs', '.cjs', '.jsx', '.json', '.jsonc', '.md', '.mdx', '.txt',
  '.py', '.pyi', '.cs', '.fs', '.fsx', '.vb', '.go', '.rs', '.java', '.kt', '.kts',
  '.swift', '.rb', '.php', '.c', '.h', '.cc', '.cpp', '.hpp', '.m', '.mm', '.sql',
  '.sh', '.bash', '.zsh', '.ps1', '.bat', '.cmd', '.html', '.htm', '.xml', '.css',
  '.scss', '.less', '.yml', '.yaml', '.toml', '.ini', '.cfg', '.conf', '.csv', '.an5',
]);
// Extensionless files that are still text. A dotfile has no extension as far as
// path.extname is concerned, so `.editorconfig` and friends belong here, not above.
// The workspace `.env` is deliberately absent: it is local, uncommitted, and the
// report quotes the offending line back to the terminal.
const TEXT_NAMES = new Set([
  'makefile', 'dockerfile', 'license', 'licence', 'notice', 'readme', 'codeowners',
  'gemfile', 'rakefile', '.editorconfig', '.gitattributes', '.gitignore', '.npmrc',
  '.nvmrc', '.env.example', '.env.sample',
]);

const LINE_PRAGMA = /an5:allow-non-english(?!-file)/i;
const FILE_PRAGMA = /an5:allow-non-english-file/i;
// A shebang, a licence banner and a docstring sit above the header, so the window is
// wider than one line; it stays narrow enough that a mention halfway down a document
// cannot exempt the whole file.
const FILE_PRAGMA_HEADER_LINES = 20;

const VIETNAMESE = /[\u0102\u0103\u0110\u0111\u01A0\u01A1\u01AF\u01B0\u01B1\u1EA0-\u1EF9]/;
const COMBINING = /[\u0300-\u036F]/;
// Letters that Unicode classifies as letters but that are used as units and icons
// in this repo rather than as language.
const SYMBOL_LETTERS = new Set(['\u00B5', '\u03A9', '\u03C9', '\u2126', '\u2113', '\u2139', '\u2118']);
// Letters English uses, or that a contributor's name from a Western or Central
// European language may carry. The Vietnamese block letters are deliberately absent:
// rule 1 rejects them before the allowlist is consulted, and the name reading of the
// stroked D is too rare to trade for that coverage.
const LATIN_ALLOWLIST = new Set(
  ('àáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝ' +
    'ŒœŠšŸŽżĆćČčĎďĘęĚěĞğİıŁłŃńŇňŐőŘřŚśŞşŤťŮůŰűŹźŻż' +
    'ĀāĒēĪīŌōŪūȘșȚț').split(''),
);

const isLetter = (ch) => /\p{L}/u.test(ch);
const isLatin = (ch) => /\p{Script=Latin}/u.test(ch);

/**
 * Classifies one line. Returns null when the line is English-only or exempt.
 */
function findViolation(line) {
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (SYMBOL_LETTERS.has(ch)) continue;

    if (VIETNAMESE.test(ch)) return { kind: 'vietnamese', column: i + 1, char: ch };
    if (COMBINING.test(ch)) return { kind: 'combining', column: i + 1, char: ch };

    // A plain ASCII letter is English; anything else has to justify itself.
    if (ch < '\x80' || !isLetter(ch)) continue;
    if (!isLatin(ch)) return { kind: 'non-latin', column: i + 1, char: ch };
    if (!LATIN_ALLOWLIST.has(ch)) return { kind: 'latin-extended', column: i + 1, char: ch };
  }
  return null;
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (SKIP_EXT.has(ext)) return false;
  if (TEXT_EXT.has(ext)) return true;
  if (ext === '') return TEXT_NAMES.has(path.basename(filePath).toLowerCase());
  return false;
}

/**
 * Reads a file as prose, or null when it is not prose. A NUL byte marks a binary
 * file; a U+FFFD means the bytes are not valid UTF-8, which is data rather than
 * something to read comments out of.
 */
function readText(filePath) {
  let raw;
  try {
    raw = fs.readFileSync(filePath);
  } catch {
    return null;
  }
  if (raw.includes(0)) return null;
  const text = raw.toString('utf8');
  return text.includes('\uFFFD') ? null : text;
}

function collectFiles(dir, found = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      collectFiles(full, found);
    } else if (entry.isFile() && isTextFile(full) && !SKIP_FILES.test(full)) {
      found.push(full);
    }
  }
  return found;
}

function main() {
  const files = collectFiles(ROOT);
  const failures = [];
  let scanned = 0;
  let exemptedFiles = 0;
  let inlineExemptions = 0;
  const exemptedNames = [];

  for (const file of files) {
    const text = readText(file);
    if (text === null) continue;
    scanned += 1;

    const lines = text.split('\n');
    const relative = path.relative(ROOT, file);
    // Self-exempting would defeat the gate: this file names the pragma tokens in
    // its own header, so it is scanned even though it carries the marker.
    const self = file === fileURLToPath(import.meta.url);

    if (!self && lines.slice(0, FILE_PRAGMA_HEADER_LINES).some((line) => FILE_PRAGMA.test(line))) {
      exemptedFiles += 1;
      exemptedNames.push(relative);
      continue;
    }

    for (const [index, line] of lines.entries()) {
      const violation = findViolation(line);
      if (!violation) continue;

      if (LINE_PRAGMA.test(line)) {
        inlineExemptions += 1;
        continue;
      }
      failures.push({ relative, line: index + 1, text: line.trim(), ...violation });
      // One report per file is enough to point at it; a whole Vietnamese paragraph
      // would otherwise bury the rest of the workspace.
      break;
    }
  }

  console.log(`english-only: ${scanned} file(s) scanned across the workspace`);
  if (exemptedFiles) {
    console.log(`  ${exemptedFiles} file(s) exempt by file pragma:`);
    exemptedNames.forEach((name) => console.log(`    ${name}`));
  }
  if (inlineExemptions) console.log(`  ${inlineExemptions} line(s) exempt by inline pragma`);

  if (failures.length === 0) {
    console.log('  every comment, message and document is English-only');
    return;
  }

  console.error(`  ${failures.length} violation(s):`);
  for (const failure of failures) {
    const char = `U+${failure.char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
    const excerpt = failure.text.length > 90 ? `${failure.text.slice(0, 90)}…` : failure.text;
    console.error(
      `  FAIL ${failure.relative}:${failure.line}:${failure.column} ` +
      `[${failure.kind}] ${char} "${failure.char}" — ${excerpt}`,
    );
  }
  console.error('  translate the text, or mark it an5:allow-non-english if it is deliberate');
  process.exit(1);
}

main();