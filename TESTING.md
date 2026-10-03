# Test Guide

This document describes how to run tests for each repository in the MSSQL ORM ecosystem.

## Prerequisites

- **Node.js 18+** — required for TypeScript/JavaScript repos
- **Python 3.10+** — required for Python code validation
- **.NET SDK 8.0+** — required for C# code compilation (optional)
- **SQL Server** — required for integration tests (unit tests run without DB)

## Quick Start

```bash
# Clone workspace with submodules
git clone --recurse-submodules https://github.com/an5ORM/an5.git
cd an5
git submodule update --init --recursive

# Build required repos
cd an5Agent && npm install && npm run build && cd ..
cd an5Cli && npm install && npm run build && cd ..

# Run all tests
cd an5Orm && npm test && cd ..
cd an5Client && npm test && cd ..
cd an5Adapters && npm test && cd ..
cd an5Agent && npm test && cd ..
cd an5Cli && npm test && cd ..
cd an5OrmVScode && npm test && cd ..
cd an5Schema && npm test && cd ..
```

---

## 1. an5Orm

**Location:** `an5Orm/`
**Language:** TypeScript
**Test command:** `npm test`
**Test files:**
| File | Description |
|------|-------------|
| `test/smoke.test.js` | Package structure, file existence, generator entry point |
| `test/unit.test.js` | Unit tests: `parseWhere()`, `buildOrderBy()`, package validation (18 tests) |

**What is tested:**
- `parseWhere()`: simple equality, null, contains, gte/lte, IN, NOT IN, startsWith/endsWith, NOT, OR, AND, empty IN edge case
- `buildOrderBy()`: single field, multiple fields, null/undefined
- Package scripts and required source files

**Run:** `cd an5Orm && npm test`

---

## 2. an5Client

**Location:** `an5Client/`
**Languages:** TypeScript, Python, C#
**Test command:** `npm test`
**Test files:**
| File | Description |
|------|-------------|
| `test/smoke.py` | Directory existence check (Python) |
| `test/test.js` | Package verification, language-specific file checks (7 tests) |

**What is tested:**
- Package structure (name, scripts)
- Python client directory and files
- Python syntax validation (`python -m compileall`)
- TypeScript client directory (if generated)
- .NET client directory and files
- `pyproject.toml` and `.gitignore` existence

**Run:** `cd an5Client && npm test`

---

## 3. an5Adapters

**Location:** `an5Adapters/`
**Languages:** TypeScript, Python, C#
**Test command:** `npm test`
**Test files:**
| File | Description |
|------|-------------|
| `test/smoke.py` | Directory existence check (Python) |
| `test/test.js` | Package verification, adapter source validation (8 tests) |

**What is tested:**
- Package structure (name, scripts)
- TypeScript adapter: class exports (`MssqlAdapter`, `AdapterTableClient`, `createMssqlAdapter`)
- Python adapter directory and files
- Python syntax validation (`python -m compileall`)
- .NET adapter directory and files
- `pyproject.toml` and `.gitignore` existence

**Run:** `cd an5Adapters && npm test`

---

## 4. an5Agent

**Location:** `an5Agent/`
**Language:** TypeScript
**Test command:** `npm test` (builds first: `npm run build`)
**Test files:**
| File | Description |
|------|-------------|
| `test/smoke.test.js` | Smoke tests: instantiation, 7 consolidated tools, NL processing, mock queries |

**What is tested:**
- Agent instantiation with 7 tools
- `listModels` — returns schema models
- `describeModel` — returns model fields
- `generateQuery` — generates SQL from description
- `validateQuery` — validates SQL syntax
- `analyzeSchema` — analyzes schema for issues
- `agent.process()` — natural language processing
- Static tool exports (`listModels.execute`, `generateQuery.execute`)
- Mock query execution via `executeQuery`
- SQL explanation via `agent.process()`

**Build first:** `npm install && npm run build`
**Run:** `npm test`

---

## 5. an5Cli

**Location:** `an5Cli/`
**Language:** TypeScript
**Test command:** `npm test` (builds first: `npm run build`)
**Test files:**
| File | Description |
|------|-------------|
| `test/smoke.test.js` | 6 smoke tests: package, CLI help, dry-run, LLM module, config |

**What is tested:**
- Package structure (`bin` entry, source files, dist files)
- CLI help output (commands: `release`, `ws`)
- CLI dry-run execution on default target
- LLM module exports (`generateCommitMessage`, `getGitDiff`, `getGitLog`)
- WS command documentation in help text
- `.an5Cli.json` config file

**Build first:** `npm install && npm run build`
**Run:** `npm test`

---

## 6. an5OrmVScode

**Location:** `an5OrmVScode/`
**Language:** TypeScript (VS Code extension)
**Test command:** `npm test`
**Test files:**
| File | Description |
|------|-------------|
| `test/smoke.test.js` | Package structure, language contribution, grammar/snippet files |
| `test/grammar.test.js` | Type coverage in the TextMate grammar for every provider |
| `test/snippets.test.js` | Snippet contribution validation |
| `test/mcp.test.js` | MCP protocol, the 13 tools, the schema fallback parser, the spawned server, and the config merge (42 tests) |

**What is tested:**
- Extension package.json contributions (languages, snippets, MCP provider)
- Grammar file exists and covers the types of every provider (mssql, postgres, mysql, sqlite, googlesheets)
- Snippet file exists and is properly configured
- MCP: JSON-RPC framing, `initialize`/`ping`/`tools/list`/`tools/call`, notifications, error responses, `readOnlyHint` and `confirm` on the tools, argument validation
- The schema reader used when `@an5/orm` is not installed in the workspace
- The server as a real child process over stdio, and how it degrades when the project has no schema
- The stdio server definition VS Code is given: resolved entry path, absolute node binary,
  `cwd`, and the version taken from the manifest — the shape is asserted because an
  options object here silently produced a server that never started
- Merging the server into `mcp.json` and `.mcp.json`: keeps existing servers and other
  settings, is idempotent, rewrites a stale path, and refuses to overwrite a file it
  cannot parse

**Run:** `cd an5OrmVScode && npm test`

---

## 7. an5Schema

**Location:** `an5Schema/`
**Language:** `.an5` schema files
**Test command:** `npm test`
**Test files:**
| File | Description |
|------|-------------|
| `test/validate.test.js` | Schema file format and syntax validation |

**What is tested:**
- `.an5` file discovery and content validation
- Model declaration syntax (`model Name { ... }`)
- Field type validation (all SQL Server types)
- Attribute validation (`@id`, `@default()`, `@unique`, `@relation`)
- Brace matching and nesting
- Directive syntax (`@@map`, `@@unique`, `@@index`, `@@schema`)

**Run:** `cd an5Schema && npm test`

---

## 8. an5example

**Location:** `an5example/`
**Languages:** TypeScript, Python, C# (.NET 8 SDK), Go
**Test command:** `npm test` (builds first, then runs the full offline matrix)
**Test files:**
| File | Description |
|------|-------------|
| `test/crud.sqlite.test.js` | Shared CRUD + relations suite on SQLite |
| `test/crud.browser.test.js` | CRUD + relations suite on sql.js (browser, in-memory) |
| `test/browser-bundle.test.js` | esbuild bundle check: `@an5/adapters/browser` has no Node built-ins |
| `test/go-example-build.js` | Go client build + vet |
| `test/dotnet-compile-check.js` | .NET compile check (needs `dotnet` SDK; live example skips without SQL Server) |
| `examples/python/crud.py` | Python client import/CRUD smoke (live parts need `AN5_DATABASE_URL`) |

**What is tested:**
- `test:suite` — SQLite CRUD + relations integration
- `test:browser` — sql.js CRUD + relations integration and bundle check
- `test:example:ts` — runnable TypeScript (SQLite) example
- `test:go` — Go client build + vet
- `test:dotnet` / `test:example:dotnet` — .NET compile (live run skips without SQL Server)
- `test:python` — Python client import check, full CRUD when `AN5_DATABASE_URL` is set

npm `test:python` scripts accept either `python` or `python3` (tries `python` first).

**Run:** `cd an5example && npm test`

---

## 9. an5Tasks

**Location:** `an5Tasks/`
**Language:** TypeScript
**Test command:** `npm test` (builds first: `npm run build`)
**Test files:**
| File | Description |
|------|-------------|
| `test/smoke.test.js` | Package structure, source files, Genkit exports |

**What is tested:**
- Package structure (`main` entry, source files, test files)
- Source files existence (`index.ts`)
- Genkit exports (`parseReviewToTasksFlow`, `aiParseReviewToTasksFlow`, `getTasks`, `updateTask`, `createTaskTool`, `listTasksTool`, `updateTaskTool`)

**Build first:** `npm install && npm run build`
**Run:** `npm test`

---

## 10. Workspace-wide checks

Two checks span the whole workspace instead of one package. Both run from the repo root.

**Test command:** `npm run test:lang` (also first in `npm test` and therefore in `npm run test:full`)

| File | Description |
|------|-------------|
| `scripts/check-english-only.mjs` | English-only guard over every source, config and doc file |

**What is tested:**
- Every comment, error message, config value and document is English-only
- Reported per file: `path:line:column [kind] U+XXXX "char" — excerpt`
- Fails on Vietnamese letters (`đ ơ ư ă`, U+1EA0–U+1EF9), combining marks, letters outside the Latin script, and Latin letters outside the Western/Central European repertoire <!-- an5:allow-non-english -->
- Skips build output, dependency trees, lockfiles, minified files and the generated `_site`
- Reports the files it skipped via pragma, so an exemption stays visible

**Exempting intentional non-English text:**

| Marker | Scope |
|--------|-------|
| `an5:allow-non-english` | the line it appears on |
| `an5:allow-non-english-file` | the whole file, but only when it sits in the file header |

Two fixtures carry the file marker because non-English text is their subject: the .NET and Python UTF-8 round-trip tests in `an5Adapters`. The header restriction keeps this page honest — it quotes the marker to describe it, and a mention halfway down a document must not exempt the document.

**Limits:** the check reads orthography, not language. Tone-stripped Vietnamese (`toi yeu ban`) is ASCII and passes; real Vietnamese prose trips the rules because its tone-marked vowels, `đ ơ ư ă`, are unavoidable in it. <!-- an5:allow-non-english -->

**Other workspace checks:** `npm run test:docs` verifies the `.an5` Prism grammar against the schemas (runs in `pages.yml`).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | For DB tests | SQL Server connection string |
| `AN5_DATABASE_URL` | For example live tests | Postgres/SQL Server connection string for `an5example` live suites |
| `LLM_PROVIDER` | For LLM tests | `openai`, `gemini`, or `custom` |
| `LLM_API_KEY` | For LLM tests | API key for LLM provider |

Unit, smoke, browser (sql.js), SQLite, and compile-check tests run **without** any environment variables. Only live-DB suites need a connection string.

## CI Integration

Root workflows (`.github/workflows/`): `ci.yml`, `pages.yml` (GitHub Pages deploy), `publish.yml`.
Per-repo release workflows (`.github/workflows/ci-release.yml`): `an5Orm`, `an5Client`, `an5Adapters`, `an5OrmVScode`.
No dedicated workflows yet for `an5Agent`, `an5Cli`, `an5Schema`, `an5Tasks`, `an5example` — run their tests locally via `npm test`.
