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
| `@an5/orm` | npm | `1.0.3` | Published | Core ORM runtime plus `an5` / `an5-orm` CLI bins |
| `@an5/adapters` | npm | `0.1.2` | Published | Runtime database adapters for TypeScript apps |
| `@an5/agent` | npm | `0.1.1` | Published | AI database agent with 7 consolidated tools |
| `an5-adapters` | PyPI | `0.1.2` target | Build-ready | Wheel/sdist pass `twine check`; upload requires PyPI token |

PyPI does not use npm-style scopes like `@an5/adapters`. The Python package name remains `an5-adapters`.

## Core ORM

| Area | Status | Details |
|------|--------|---------|
| Proxy model client | Implemented | `db.user.findMany()`, `db.user.create()`, dynamic model access |
| CRUD operations | Implemented | `findMany`, `findFirst`, `findUnique`, `count`, `create`, `createMany`, `update`, `updateMany`, `delete`, `deleteMany`, `upsert` |
| Query filters | Implemented | Equality, null, `in`, `notIn`, string filters, comparison filters, `AND`, `OR` |
| Relations | Implemented, evolving | Relation includes and relation-aware query helpers exist; complex nested relation coverage is still expanding |
| Transactions | Implemented | `$transaction` with commit/rollback support |
| Raw SQL | Implemented | `$queryRaw`, `$queryRawUnsafe`, `$executeRaw`, `$executeRawUnsafe` |
| Vector search | Implemented, environment-dependent | SQL Server vector support when available, in-memory fallback for development |
| Middleware | Implemented | `$use` pipeline for cross-cutting behavior |
| Error normalization | Implemented | Prisma-style error code mapping for common failures |

## CLI and Schema Workflow

| Command | Status | Purpose |
|---------|--------|---------|
| `npx an5 generate` | Implemented | Generate TypeScript, Python, and .NET client artifacts from `an5Schema/` |
| `npx an5 db:generate` | Implemented | Alias for `generate` |
| `npx an5 db:push` | Implemented | Safe additive push: create tables and add missing columns from schema |
| `npx an5 db:pull` | Implemented | Introspect database tables into `.an5` files |
| `npx an5 db:migrate diff` | Implemented, evolving | Compare schema with database |
| `npx an5 db:migrate generate` | Implemented, evolving | Generate SQL migration file |
| `npx an5 db:seed` | Implemented | Seed default app/config data |
| `npx an5 db:cleanup` | Implemented, destructive | Detect/drop tables not represented in schema |

The `an5` CLI runs from the consumer project root (`process.cwd()`), so projects should use `npx an5 ...` instead of calling files inside `node_modules/@an5/orm`.

## Adapters

| Adapter | Status | Notes |
|---------|--------|-------|
| SQL Server | Implemented | Primary target, connection pooling and raw execution |
| PostgreSQL | Implemented | Dialect-aware quoting and SQL helpers |
| MySQL | Implemented | Dialect engine exists in TypeScript adapter package |
| SQLite | Implemented | Dialect engine exists in TypeScript adapter package |
| Google Sheets | Implemented | Spreadsheet-backed CRUD API with sheet auto-create and retry helpers |
| Python adapter | Build-ready | Source included and PyPI package configured |
| .NET adapter | Source included | C# adapter/entity sources included for generated clients and manual use |

## Generated Clients

| Language | Status | Output |
|----------|--------|--------|
| TypeScript | Implemented | Model files, metadata, base types |
| Python | Implemented | Metadata module for model/table mapping |
| .NET | Implemented | Entity classes, config, DB context/table client sources |

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
| Auto bump npm versions | Implemented | `npm run version:bump` |
| Preview version bump | Implemented | `npm run version:bump:dry` |
| Workspace dry run | Implemented | `npm run dryrun` |
| Workspace release | Implemented | `npm run release:all` |
| GitHub Pages deploy | Implemented | `.github/workflows/pages.yml` |

The default auto-bump package set is `@an5/adapters` and `@an5/orm`. The script reads npm latest versions and bumps local versions only when needed.

## Known Gaps

| Area | Current Gap | Recommended Next Step |
|------|-------------|-----------------------|
| PyPI organization | PyPI orgs are managed through PyPI web UI, not CLI | Create `an5` organization manually and add package owner/manager |
| PyPI upload | Build artifacts are ready, credentials are not configured | Set `TWINE_USERNAME=__token__` and `TWINE_PASSWORD=<pypi-token>`, then run `python -m twine upload dist/*` |
| Migration diff | Basic table/column/index diff exists, but full rollback/up/down workflow is not complete | Add migration apply/rollback tracking table |
| Test coverage | Smoke/unit tests exist, but DB integration coverage is limited | Add containerized SQL Server integration tests |
| Relation edge cases | Common relation flows exist, deeper nested writes need more verification | Add relation integration tests and examples |
| Package build pipeline | Published packages include build artifacts; full monorepo `tsc` still has areas to tighten | Split build configs per package and enforce CI builds |

## Recommended Install

For a normal application project:

```bash
npm install @an5/orm
npx an5 generate
npx an5 db:push
```

For adapter-only TypeScript usage:

```bash
npm install @an5/adapters
```

For Python adapter usage after PyPI publication:

```bash
pip install an5-adapters
```
