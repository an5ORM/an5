---
layout: page
title: Examples
description: Run the an5example repository across all languages, dialects, and the browser
---

# Examples

The [`an5example`](https://github.com/an5ORM/an5example) repository is the reference
example for the an5 ORM ecosystem. It contains the full CRUD + relations integration
suite, runnable examples for every generated client language, browser support, and a
live database harness.

```
an5example/
├── schema/                  # .an5 model definitions
├── generated/               # Generated clients: typescript/ python/ golang/ dotnet/
├── scripts/                 # SQLite setup + per-dialect DDL for the live harness
├── test/
│   ├── crud-suite.js        # Shared, dialect-parameterized CRUD + relations suite
│   ├── crud.sqlite.test.js  # Suite against SQLite (better-sqlite3)
│   ├── crud.live.test.js    # Suite against a live DB via AN5_DATABASE_URL
│   ├── crud.browser.test.js # Suite against in-browser SQLite (sql.js WASM)
│   ├── browser-bundle.test.js # esbuild verify @an5/adapters/browser is bundler-safe
│   ├── go-example-build.js  # go build + vet of the generated Go client
│   └── dotnet-compile-check.js # dotnet build of the generated C# client
└── examples/
    ├── typescript/crud.ts   # TS runtime example (SQLite, offline-runnable)
    ├── golang/               # Generated Go client CRUD against SQLite
    ├── dotnet/               # Generated C# client against SQL Server
    └── python/crud.py        # Generated Python client (postgres/mssql)
```

## Running the Full Test Matrix

```bash
cd an5example
npm install
npm test
```

`npm test` runs the complete offline matrix:

| Script | Covers |
|--------|--------|
| `test:suite` | Shared CRUD + relations suite on SQLite (better-sqlite3) |
| `test:browser` | CRUD suite on `sql.js` in-memory SQLite + esbuild bundle check |
| `test:example:ts` | TypeScript runtime example |
| `test:go` | `go build` + `go vet` of the generated Go client |
| `test:dotnet` | `dotnet build` of the generated C# client |
| `test:example:dotnet` | .NET example run (skips gracefully when SQL Server is unreachable) |
| `test:python` | Python example import/syntax check |

## Live Database Harness

The same suite runs against any database supported by `@an5/adapters` (SQL Server,
PostgreSQL, MySQL, SQLite) by pointing `AN5_DATABASE_URL` at a reachable instance.
Tables are created automatically from `scripts/ddl.cjs` and removed afterwards.

```bash
AN5_DATABASE_URL="postgres://user:pass@localhost:5432/db" npm run test:live
```

The harness skips gracefully when the database is unreachable, so `npm test` stays green offline.

## Browser Support

`@an5/adapters/browser` is a Node-builtin-free entrypoint. The example proves it in
two ways: the CRUD suite runs against `sql.js` (WASM) in memory, and an esbuild
bundle check verifies the browser build contains no Node built-ins and exposes
`createBrowserSqliteAdapter`, `SqliteBrowserEngine`, and the sheets adapters.

## Language Examples

Each `examples/` language mirrors the generated client for that language:

- **TypeScript** (`examples/typescript/crud.ts`) — uses `@an5/adapters` with generated
  types against an in-memory SQLite database. Offline-runnable after `npm run build`.
- **Go** (`examples/golang/`) — standalone Go module that runs the generated
  `an5client` against SQLite via `modernc.org/sqlite`. First run needs
  `go mod download` (network).
- **.NET** (`examples/dotnet/`) — console app using the generated `An5DbContext`
  against SQL Server. Builds offline; skips the live run when no SQL Server is reachable.
- **Python** (`examples/python/crud.py`) — generated Python client; runs a live CRUD
  smoke when `AN5_DATABASE_URL` points at a postgres/mssql database, otherwise an
  import check.

## Next Steps

- [Getting Started]({{ '/guides/getting-started/' | relative_url }}) - Set up an5 in your project
- [Feature Status]({{ '/guides/feature-status/' | relative_url }}) - Current implementation maturity