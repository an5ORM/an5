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

| Type | Description | Example |
|------|-------------|---------|
| `NVARCHAR(n)` | Variable-length Unicode string | `NVARCHAR(255)` |
| `VARCHAR(n)` | Variable-length ASCII string | `VARCHAR(100)` |
| `TEXT` | Large text field | `TEXT` |
| `INT` | 32-bit integer | `INT` |
| `BIGINT` | 64-bit integer | `BIGINT` |
| `SMALLINT` | 16-bit integer | `SMALLINT` |
| `FLOAT` | Floating point | `FLOAT` |
| `DECIMAL(p,s)` | Fixed precision | `DECIMAL(10,2)` |
| `BIT` | Boolean | `BIT` |
| `DATETIME` | Date and time | `DATETIME` |
| `DATETIME2` | High precision datetime | `DATETIME2` |
| `DATE` | Date only | `DATE` |
| `UNIQUEIDENTIFIER` | UUID/GUID | `UNIQUEIDENTIFIER` |
| `VARBINARY(n)` | Binary data | `VARBINARY(255)` |

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

## Table Mapping

Use `@@map()` to map a model to a different table name:

```an5
model User {
  id    NVARCHAR(1000) @id @default(uuid())
  email NVARCHAR(255)
  
  @@map("app_users")
}
```

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
