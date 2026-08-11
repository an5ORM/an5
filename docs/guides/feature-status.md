---
layout: page
title: Feature Status
description: Current implementation status and maturity of the an5 ORM ecosystem
---

# Feature Status

This page summarizes what is currently implemented, published, and still maturing in the an5 ORM ecosystem.

## Published Packages

| Package | Registry | Latest | Status | Notes |
|---------|----------|--------|--------|-------|
| `@an5/orm` | npm | `1.0.8` | Published | Core ORM runtime (no CLI binary) |
| `@an5/adapters` | npm | `0.2.5` | Published | Runtime database adapters for TypeScript plus packaged Python/.NET/Go sources |
| `@an5/agent` | npm | `0.1.1` | Published | AI database agent with 7 consolidated tools |
| `an5-adapters` | PyPI | `0.2.5` target | Build-ready | Wheel/sdist pass `twine check`; PyPI token / trusted publisher setup |
| `an5-orm` | PyPI | `1.0.8` target | Build-ready | Wheel/sdist pass `twine check`; PyPI token / trusted publisher setup |

PyPI does not use npm-style scopes like `@an5/orm`. The Python package names are `an5-adapters` and `an5-orm`.

## Core ORM

| Area | Status | Details |
|------|--------|---------|
| Proxy model client | Implemented | `db.user.findMany()`, `db.user.create()`, dynamic model access |
| CRUD operations | Implemented | `findMany`, `findFirst`, `findUnique`, `count`, `create`, `createMany`, `update`, `updateMany`, `delete`, `deleteMany`, `upsert` |
| Query filters | Implemented | Equality, null, `in`, `notIn`, string filters, comparison filters, nested `not`, `AND`, `OR`, `NOT`, and aggregate `having` filters for `groupBy` |
| Relations | Implemented, evolving | Relation includes with nested `where`/`orderBy` and per-parent `skip`/`take`, relation `some`/`none`/`every`, multi-level relation selects, `_count`, and common nested writes exist; deeper DB integration coverage is still expanding |
| Transactions | Implemented | `$transaction` with automatic commit/rollback, nested callback reuse, and interactive `$begin()` / `tx.$commit()` / `tx.$rollback()` for supported adapters |
| Raw SQL | Implemented | `$queryRaw`, `$queryRawUnsafe`, `$executeRaw`, `$executeRawUnsafe` |
| Vector search | Implemented, environment-dependent | SQL Server vector support when available, in-memory fallback for development |
| Middleware | Implemented | `$use` pipeline for cross-cutting behavior |
| Error normalization | Implemented | Standardized error code mapping for common failures |

## Schema Workflow

Schema/database commands run as npm scripts from the `an5Orm/` repository directory (no standalone `an5` CLI binary is shipped).

| Command | Status | Purpose |
|---------|--------|---------|
| `npm run generate` | Implemented | Generate TypeScript, Python, .NET (C#), and Golang client artifacts from `an5Schema/` |
| `npm run db:push` | Implemented | Safe additive push: create tables and add missing columns from schema |
| `npm run db:pull` | Implemented | Introspect database tables into `.an5` files |
| `npm run db:migrate diff` | Implemented, evolving | Compare schema with database for tables, columns, indexes, field-level unique constraints, and compound unique constraints; mapped `@unique`/`@@unique`/`@@index` artifact names plus `@@index(..., include: [...], filter: "...", options: "...")` covering/filtered/options metadata are honored; `dbo.`-qualified schema tables match unqualified SQL Server introspection names; stale an5-managed indexes/unique constraints are reported as commented drops |
| `npm run db:migrate:generate` | Implemented, evolving | Generate SQL migration file with `-- migrate:up` plus generated rollback SQL for additive operations |
| `npm run db:migrate:apply` | Implemented, evolving | Apply pending SQL files, record checksums in `_an5_migrations`, or preview with `--dry-run` |
| `npm run db:migrate:rollback` | Implemented, evolving | Roll back latest, N steps, or through a named applied migration; supports `--dry-run` SQL preview |
| `npm run db:migrate:status` | Implemented | Show schema/database/migration status with the same default `dbo.` table-name normalization used by migration diff |
| `npm run db:seed` | Implemented | Seed default app/config data |
| `npm run db:cleanup` | Implemented, destructive | Detect/drop tables not represented in schema |

These commands run from the `an5Orm/` repository root, so use `npm run <command>` there instead of calling files inside `node_modules/@an5/orm`.

## Adapters

| Adapter | Status | Notes |
|---------|--------|-------|
| SQL Server | Implemented | Primary target, connection pooling and raw execution |
| PostgreSQL | Implemented | Dialect-aware quoting and SQL helpers |
| MySQL | Implemented | Dialect engine exists in TypeScript adapter package |
| SQLite | Implemented | Dialect engine exists in TypeScript adapter package |
| Google Sheets | Implemented | Spreadsheet-backed CRUD API with sheet auto-create and retry helpers; auto-detected via `googlesheets://` connection strings |
| Python adapter | Implemented, packaged source | Source included in `@an5/adapters`; `npm run test:python -w an5Adapters` compile-checks it |
| .NET adapter | Implemented, packaged source | C# source included; `npm run test:dotnet -w an5Adapters` compile-checks SQL Server/Postgres providers with `Microsoft.Data.SqlClient`/Npgsql |
| Go adapter | Implemented, packaged source | Go source included under `golang/`; `npm run test:go -w an5Adapters` runs `go test ./...` |

The `@an5/adapters` package exposes the full public API from the package root (`createAn5Adapter`, `An5SheetsAdapter`, `SheetsTableClient`, `createAn5SheetsAdapter`, `parseSheetsConnectionString`) as well as through subpaths (`/browser`, `/googlesheets`, `/config`, `/mssql`, `/postgres`, `/mysql`, `/sqlite`, `/base`, `/python`, `/dotnet`, `/golang`). The runtime config API (`getLlmConfig`/`setLlmConfig`, `getEmbeddingConfig`/`setEmbeddingConfig`, `resetAdapter`) is also exported from the package root.

## Generated Clients

| Language | Status | Output |
|----------|--------|--------|
| TypeScript | Implemented | Model files, metadata, base types, flexible model property casing (`db.User`, `db.user`, `db.Users`, `db.users`) |
| Python | Implemented | Metadata module, `@dataclass` models (`an5_models.py`), typed `An5Client` (`an5_client.py`) |
| .NET (C#) | Implemented | Entity classes, config, `An5DbContext` with complete CRUD (`Count`, `CreateMany`, `UpdateMany`, `DeleteMany`, `Upsert`, `ExecuteRaw`, `QueryRaw`); `npm run test:dotnet -w an5Client` compile-checks generated sources |
| Golang | Implemented | Go structs with tags (`models.go`), generic `TableClient[T]` and `An5DbContext` (`client.go`); `npm run test:go -w an5Client` compile-checks generated sources |

## AI Agent

| Tool | Actions | Status |
|------|---------|--------|
| `schema` | `list`, `describe`, `relations` | Implemented |
| `query` | `generate`, `explain`, `validate` | Implemented |
| `database` | `execute`, `describe`, `health` | Implemented |
| `retrieve` | `schema`, `queries` | Implemented; depends on indexed vector store |
| `task` | `create`, `list`, `update`, `delete` | Implemented; depends on `an5Tasks` build/runtime |
| `generateClientCode` | - | Implemented |
| `analyzeSchema` | - | Implemented |

## Release and Versioning

| Workflow | Status | Command |
|----------|--------|---------|
| Auto bump npm versions | Implemented | `node scripts/auto-bump-version.js` |
| Workspace dry run | Implemented | `npm run dryrun` |
| Workspace release | Implemented | `npm run release` / `npx an5-cli ws . --push` |
| GitHub Pages deploy | Implemented | `.github/workflows/pages.yml` |

The default auto-bump package set is `@an5/adapters` and `@an5/orm`. The script reads npm latest versions and bumps local versions only when needed.

## Known Gaps

| Area | Current Gap | Recommended Next Step |
|------|-------------|-----------------------|
| PyPI organization | PyPI orgs are managed through PyPI web UI, not CLI | Create `an5` organization manually and add package owner/manager |
| PyPI upload | Build artifacts are ready, credentials are not configured | Set `TWINE_USERNAME=__token__` and `TWINE_PASSWORD=<pypi-token>`, then run `python -m twine upload dist-py/*` |
| Migration workflow | Diff/generate/apply/rollback tracking exists for SQL files; dry-run previews and generated preflight checks are available for risky column changes, required additive columns, field-level unique constraints, new unique columns, and compound unique constraints; mapped index/unique artifact names, index include/filter/options metadata, and default `dbo.` schema table names are normalized during diff/status; stale an5-managed indexes/unique constraints are surfaced as commented drops; generated rollback covers additive operations and column type/nullability reversal | Add live generated migration apply/rollback scenarios for mapped and advanced index metadata |
| Test coverage | Smoke/unit/compile/package-smoke tests exist; unit coverage includes generated diff SQL for mapped advanced index metadata; live DB integration covers adapter Postgres/SQL Server CRUD/filter/update/groupBy/transaction/vector fallback plus ORM SQL Server nested relation/select/include/count/aggregate/groupBy/transaction/vector fallback and migration apply/rollback flows in CI | Add broader live generated migration apply/rollback scenarios |
| Relation edge cases | Common relation flows, multi-level relation selects, and nested writes exist, deeper live-DB combinations need more verification | Add broader relation integration tests and examples |
| Package build pipeline | Published packages include build artifacts and language sources; `npm run test:full` runs cross-language compile/package-smoke gates, and CI also runs containerized live DB integration | Extend publish gates if live DB checks are desired before release |

## Recommended Install

For a normal application project:

```bash
npm install @an5/orm
npm run generate   # from an5Orm/
npm run db:push    # from an5Orm/
```

For adapter-only TypeScript usage:

```bash
npm install @an5/adapters
```

For Python usage after PyPI publication:

```bash
pip install an5-orm an5-adapters
```
