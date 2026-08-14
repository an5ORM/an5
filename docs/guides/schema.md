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
  published BOOLEAN        @default(false)
  authorId  NVARCHAR(1000)
}
```

### Field Types

| Type | Description | Example | TypeScript |
|------|-------------|---------|------------|
| `NVARCHAR(n)` | Variable-length Unicode string | `NVARCHAR(255)` | `string` |
| `VARCHAR(n)` | Variable-length ASCII string | `VARCHAR(100)` | `string` |
| `CHAR(n)` | Fixed-length string | `CHAR(10)` | `string` |
| `TEXT` | Large text field | `TEXT` | `string` |
| `INT` | 32-bit integer | `INT` | `number` |
| `BIGINT` | 64-bit integer | `BIGINT` | `number \| bigint` |
| `SMALLINT` | 16-bit integer | `SMALLINT` | `number` |
| `TINYINT` | 8-bit integer | `TINYINT` | `number` |
| `FLOAT` | Floating point | `FLOAT` | `number` |
| `REAL` | Single-precision float | `REAL` | `number` |
| `DECIMAL(p,s)` | Fixed precision | `DECIMAL(10,2)` | `number` |
| `NUMERIC(p,s)` | Fixed precision | `NUMERIC(10,2)` | `number` |
| `BIT` | Boolean | `BIT` | `boolean` |
| `DATETIME` | Date and time | `DATETIME` | `Date` |
| `DATETIME2` | High precision datetime | `DATETIME2` | `Date` |
| `DATE` | Date only | `DATE` | `Date` |
| `TIME` | Time only | `TIME` | `Date` |
| `UNIQUEIDENTIFIER` | UUID/GUID | `UNIQUEIDENTIFIER` | `string` |
| `VARBINARY(n)` | Binary data | `VARBINARY(255)` | `Buffer` |
| `BINARY(n)` | Fixed binary data | `BINARY(16)` | `Buffer` |
| `IMAGE` | Large binary data | `IMAGE` | `Buffer` |

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

| Option | Description | Example |
|--------|-------------|---------|
| `map` | Custom index/constraint name | `map: "idx_orders_user"` |
| `include` | Included (non-key) columns | `include: [total, status]` |
| `filter` | Filtered index predicate | `filter: "[status] <> 'cancelled'"` |
| `options` | Raw index options | `options: "fillfactor=80"` |

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
