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
git clone --recurse-submodules https://github.com/an5/An5.git
cd mssql
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
| `test/smoke.test.js` | 10 smoke tests: instantiation, tools, NL processing, mock queries |

**What is tested:**
- Agent instantiation with 10+ tools
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
| `test/grammar.test.js` | SQL Server type coverage in TextMate grammar |
| `test/snippets.test.js` | Snippet contribution validation |

**What is tested:**
- Extension package.json contributions (languages, snippets)
- Grammar file exists and covers 30+ SQL Server types
- Snippet file exists and is properly configured

**Run:** `cd an5OrmVScode && npm test`

---

## 7. an5Schema

**Location:** `an5Schema/`
**Language:** `.mssql` schema files
**Test command:** `npm test`
**Test files:**
| File | Description |
|------|-------------|
| `test/validate.test.js` | Schema file format and syntax validation |

**What is tested:**
- `.mssql` file discovery and content validation
- Model declaration syntax (`model Name { ... }`)
- Field type validation (all SQL Server types)
- Attribute validation (`@id`, `@default()`, `@unique`, `@relation`)
- Brace matching and nesting
- Directive syntax (`@@map`, `@@unique`, `@@index`, `@@schema`)

**Run:** `cd an5Schema && npm test`

---

## 8. an5Tasks

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

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | For DB tests | SQL Server connection string |
| `LLM_PROVIDER` | For LLM tests | `openai`, `gemini`, or `custom` |
| `LLM_API_KEY` | For LLM tests | API key for LLM provider |

Unit and smoke tests run **without** any environment variables.

## CI Integration

All repos have `.github/workflows/` for GitHub Actions (where configured):

- **an5Orm**: CI release workflow
- **an5Agent**: (pending)
- **an5Cli**: (pending)

To set up CI for a repo, run:
```bash
cd <repo>
mkdir -p .github/workflows
```

Then configure the workflow to run `npm test` on push/PR.
