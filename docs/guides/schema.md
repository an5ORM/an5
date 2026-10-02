---
layout: page
title: Schema Definition
description: Define your data models with an5 schema syntax
---

# Schema Definition

an5 uses a declarative schema syntax to define your data models. Schema files use the `.an5` extension.

## Basic Syntax

```an5
model User {
  id        NVARCHAR(1000) @id @default(uuid())
  email     NVARCHAR(255)  @unique
  name      NVARCHAR(255)?
  createdAt DATETIME2      @default(now())

  @@map("users")
}
```

## Model Definition

### Fields

Each field has a name, type, and optional attributes:

```an5
model Post {
  id        NVARCHAR(1000) @id @default(uuid())
  title     NVARCHAR(255)  @description("The post title")
  content   TEXT?
  published BIT            @default(false)
  authorId  NVARCHAR(1000)
}
```

### Field Types

Valid types depend on the database you are generating for. The provider is read from
the connection string (`sqlserver://`, `postgres://`, `mysql://`, `sqlite://`,
`googlesheets://`, or a path ending in `.sqlite`/`.sqlite3`/`.db`); with no connection
string it is SQL Server. A type the provider does not have stops generation with the
field that used it, instead of producing SQL the database rejects later.

This is stricter than before, and deliberately: one shared list used to accept
`INTEGER` for SQL Server and `BIT` for SQLite, so a schema only failed once the
database rejected it. Migrating means replacing each type with the provider's own —
`BOOLEAN` → `BIT` on SQL Server, `DATETIME2` → `DATETIME` or `DATETIME2` kept on SQL
Server but `DATETIME` on SQLite, and so on. The error names the provider and the
field, so a run over the schema lists everything to change at once.

Types only some providers have:

| Provider       | Types                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| `mssql`        | `NVARCHAR`, `NTEXT`, `DATETIME2`, `SMALLDATETIME`, `DATETIMEOFFSET`, `BIT`, `MONEY`, `UNIQUEIDENTIFIER`, `SQL_VARIANT`, `ROWVERSION`, `HIERARCHYID`, `GEOGRAPHY`, `GEOMETRY`, `VECTOR` |
| `postgres`     | `INTEGER`, `INT4`, `SERIAL`, `BIGSERIAL`, `BOOLEAN`, `JSONB`, `BYTEA`, `TIMESTAMPTZ`, `INTERVAL`, `TIMESTAMP WITH TIME ZONE`, `DOUBLE PRECISION`, `INET` (PostGIS for `GEOMETRY`/`GEOGRAPHY`, pgvector for `VECTOR`) |
| `mysql`        | `MEDIUMINT`, `TINYTEXT`, `LONGBLOB`, `ENUM`, `SET`, `JSON`, `YEAR`, `TINYBLOB` (`SERIAL` is an alias for `BIGINT UNSIGNED AUTO_INCREMENT`; no `UUID` type) |
| `sqlite`       | `INTEGER`, `BOOLEAN`, `BLOB`, `CLOB`, `JSON`, `UUID` (SQLite never enforces the declared name — it derives an affinity from it — so this is the names in common use with a defined affinity, not the engine's five storage classes) |
| `googlesheets` | The portable subset only (`STRING`, `TEXT`, `VARCHAR`, `INT`, `BIGINT`, `FLOAT`, `BOOLEAN`, `DATE`, `DATETIME`, `BYTES`, …) — Sheets has no column types, so every cell is coerced from the generated TypeScript type and a type the adapter cannot place has nothing to fall back on |

Names that would read as a relation are never types: `USER` and `NAME` are real
PostgreSQL types but are left out on purpose, so `user User @relation(...)` stays a
relation.

Table names follow the provider too. SQL Server is generated as `[dbo].[table]`, as
before; every other provider gets the bare `table`, because the brackets are SQL Server
syntax — `[dbo].[users]` is invalid in PostgreSQL and fails on SQLite with "no such
table: dbo.users". The adapter quotes the name for whichever dialect it is connected
to. A model that declares `@@schema("main")` keeps that prefix everywhere.

#### SQL Server

| Type               | Description                    | Example            | TypeScript         |
| ------------------ | ------------------------------ | ------------------ | ------------------ |
| `NVARCHAR(n)`      | Variable-length Unicode string | `NVARCHAR(255)`    | `string`           |
| `VARCHAR(n)`       | Variable-length ASCII string   | `VARCHAR(100)`     | `string`           |
| `CHAR(n)`          | Fixed-length string            | `CHAR(10)`         | `string`           |
| `TEXT`             | Large text field               | `TEXT`             | `string`           |
| `INT`              | 32-bit integer                 | `INT`              | `number`           |
| `BIGINT`           | 64-bit integer                 | `BIGINT`           | `number \| bigint` |
| `SMALLINT`         | 16-bit integer                 | `SMALLINT`         | `number`           |
| `TINYINT`          | 8-bit integer                  | `TINYINT`          | `number`           |
| `FLOAT`            | Floating point                 | `FLOAT`            | `number`           |
| `REAL`             | Single-precision float         | `REAL`             | `number`           |
| `DECIMAL(p,s)`     | Fixed precision                | `DECIMAL(10,2)`    | `number`           |
| `NUMERIC(p,s)`     | Fixed precision                | `NUMERIC(10,2)`    | `number`           |
| `BIT`              | Boolean                        | `BIT`              | `boolean`          |
| `DATETIME`         | Date and time                  | `DATETIME`         | `Date`             |
| `DATETIME2`        | High precision datetime        | `DATETIME2`        | `Date`             |
| `DATE`             | Date only                      | `DATE`             | `Date`             |
| `TIME`             | Time only                      | `TIME`             | `Date`             |
| `UNIQUEIDENTIFIER` | UUID/GUID                      | `UNIQUEIDENTIFIER` | `string`           |
| `VARBINARY(n)`     | Binary data                    | `VARBINARY(255)`   | `Buffer`           |
| `BINARY(n)`        | Fixed binary data              | `BINARY(16)`       | `Buffer`           |
| `IMAGE`            | Large binary data              | `IMAGE`            | `Buffer`           |

### Optional Fields

Add `?` to make a field optional:

```an5
model User {
  id    NVARCHAR(1000) @id @default(uuid())
  name  NVARCHAR(255)?  // Optional field
  email NVARCHAR(255)   // Required field
}
```

## Attributes

### Primary Key

```an5
model User {
  id NVARCHAR(1000) @id @default(uuid())
}
```

### Unique Constraint

```an5
model User {
  email NVARCHAR(255) @unique
}
```

### Default Values

```an5
model Post {
  id        NVARCHAR(1000) @id @default(uuid())
  status    NVARCHAR(50)   @default("draft")
  views     INT            @default(0)
  createdAt DATETIME2      @default(now())
}
```

### Description

```an5
model User {
  id NVARCHAR(1000) @id @default(uuid()) @description("Primary key")
}
```

## Model Directives

Directives are declared at the model level and control table mapping, constraints, and indexes.

### Table Mapping

Use `@@map()` to map a model to a different table name:

```an5
model User {
  id    NVARCHAR(1000) @id @default(uuid())
  email NVARCHAR(255)

  @@map("app_users")
}
```

### Model Description

```an5
model User {
  id NVARCHAR(1000) @id @default(uuid())

  @@description("User account")
}
```

### Unique Constraints

`@@unique()` declares a unique constraint across one or more fields. Compound
unique constraints are supported:

```an5
model Membership {
  id     NVARCHAR(1000) @id @default(uuid())
  userId NVARCHAR(1000)
  orgId  NVARCHAR(1000)

  @@unique([userId, orgId])
}
```

### Indexes

`@@index()` declares a database index. Advanced options are supported:

```an5
model Order {
  id        NVARCHAR(1000) @id @default(uuid())
  userId    NVARCHAR(1000)
  total     DECIMAL(10,2)
  status    NVARCHAR(50)
  createdAt DATETIME2

  // Simple index
  @@index([userId])

  // Named index (honored in migration diff/generate)
  @@index([userId, createdAt], map: "idx_orders_user_created")

  // Include columns
  @@index([userId], include: [total, status])

  // Filtered index
  @@index([status], filter: "[status] <> 'cancelled'")

  // Index options (e.g. fillfactor)
  @@index([userId], options: "fillfactor=80")
}
```

Supported index options:

| Option    | Description                  | Example                             |
| --------- | ---------------------------- | ----------------------------------- |
| `map`     | Custom index/constraint name | `map: "idx_orders_user"`            |
| `include` | Included (non-key) columns   | `include: [total, status]`          |
| `filter`  | Filtered index predicate     | `filter: "[status] <> 'cancelled'"` |
| `options` | Raw index options            | `options: "fillfactor=80"`          |

Migrations honor mapped index/unique names, include/filter/options metadata,
and `dbo.`-qualified table names when comparing schema with the database.

## Complete Example

```an5
model User {
  id        NVARCHAR(1000) @id @default(uuid()) @description("Primary key")
  email     NVARCHAR(255)  @unique @description("User email")
  name      NVARCHAR(255)? @description("Display name")
  avatar    NVARCHAR(500)? @description("Avatar URL")
  role      NVARCHAR(50)   @default("user") @description("User role")
  isActive  BIT            @default(1) @description("Account status")
  createdAt DATETIME2      @default(now()) @description("Creation date")
  updatedAt DATETIME2      @default(now()) @description("Last update")

  // Relations
  posts     Post[]
  profile   Profile?

  @@description("User account")
  @@map("users")
}

model Post {
  id        NVARCHAR(1000) @id @default(uuid())
  title     NVARCHAR(255)  @description("Post title")
  content   TEXT?          @description("Post content")
  published BIT            @default(0) @description("Published status")
  authorId  NVARCHAR(1000) @description("Author reference")

  // Relations
  author    User           @relation(fields: [authorId], references: [id])
  tags      Tag[]

  @@index([authorId])
  @@map("posts")
}

model Tag {
  id    NVARCHAR(1000) @id @default(uuid())
  name  NVARCHAR(100)  @unique

  posts Post[]

  @@map("tags")
}
```

## Next Steps

- [CRUD Operations]({{ '/guides/crud/' | relative_url }}) - Learn how to query your data
- [Relations]({{ '/guides/relations/' | relative_url }}) - Define relationships between models
- [Advanced Queries]({{ '/guides/queries/' | relative_url }}) - Complex query patterns
