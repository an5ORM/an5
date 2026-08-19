# an5 ORM

<p align="center">
  <img src="an5OrmVScode/icons/an5-128x128.png" width="96" height="96" alt="AN5 ORM Logo" />
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)

> A modern, type-safe ORM ecosystem with multi-database adapters, schema code generation, and AI-agent database capabilities.

**[Documentation](https://an5orm.github.io/an5/)** | **[GitHub](https://github.com/an5ORM/an5)** | **[NPM](https://www.npmjs.com/package/@an5/orm)**

---

## Features

| Feature                    | Description                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| **Multi-Database Runtime** | Native support for MSSQL, PostgreSQL, MySQL, SQLite, and Google Sheets via `@an5/adapters`   |
| **Type-Safe Queries**      | Full TypeScript, Python, .NET, and Golang support with autocompletion and type checking      |
| **Model & Table Access**   | `db.user` or `adapter.table('User')` for fluent CRUD, aggregates, groupBy, and vector search |
| **Schema-First**           | Define models in `.an5` files, generate multi-language clients                               |
| **Automated Migrations**   | Diff schema against database, generate up/down SQL, apply and rollback migrations            |
| **AI Agent**               | 7 intelligent tools for natural language database queries                                    |
| **Vector Search**          | Built-in semantic search for AI/ML applications                                              |
| **Relations**              | One-to-one and one-to-many with nested queries                                               |
| **Transactions**           | Atomic operations with rollback support                                                      |
| **VS Code Extension**      | Syntax highlighting and formatting for `.an5` files                                          |

## Published Packages

| Registry | Package                                                        | Description                                | Install                     |
| -------- | -------------------------------------------------------------- | ------------------------------------------ | --------------------------- |
| npm      | [`@an5/adapters`](https://www.npmjs.com/package/@an5/adapters) | Multi-database runtime & query engine      | `npm install @an5/adapters` |
| npm      | [`@an5/orm`](https://www.npmjs.com/package/@an5/orm)           | Schema parser, code generator & migrations | `npm install @an5/orm`      |
| npm      | [`@an5/agent`](https://www.npmjs.com/package/@an5/agent)       | AI database tools & agent                  | `npm install @an5/agent`    |
| PyPI     | `an5-adapters`                                                 | Python multi-database adapter runtime      | `pip install an5-adapters`  |
| PyPI     | `an5-orm`                                                      | Python ORM & schema utilities              | `pip install an5-orm`       |

See [Feature Status](https://an5orm.github.io/an5/guides/feature-status/) for the current maturity level of each module.

---

## Quick Start

### 1. Install

```bash
npm install @an5/adapters @an5/orm
```

### 2. Configure Database

```bash
cp .env.example .env
```

Edit `.env`:

```ini
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword
```

### 3. Define Schema

Create `an5Schema/User.an5`:

```an5
model User {
  id        NVARCHAR(1000) @id @default(uuid())
  email     NVARCHAR(255)  @unique
  name      NVARCHAR(255)?
  createdAt DATETIME2      @default(now())

  @@map("users")
}
```

### 4. Generate & Push

Schema/database commands run as npm scripts from the `an5Orm/` repo:

```bash
npm run generate    # Generate client code (in an5Orm/)
npm run db:push     # Push schema to database (in an5Orm/)
```

### 5. Use in Code

**TypeScript (via `@an5/adapters`)**

```typescript
import { createAn5Adapter } from "@an5/adapters";

// Connect using DATABASE_URL
const db = createAn5Adapter({
  connectionString: process.env.DATABASE_URL!,
});
await db.$connect();

// Create
const user = await db.user.create({
  data: { email: "john@example.com", name: "John" },
});

// Read
const users = await db.user.findMany({
  where: { email: { contains: "@example.com" } },
  orderBy: { createdAt: "desc" },
  take: 10,
});

// Update
await db.user.update({
  where: { id: user.id },
  data: { name: "John Updated" },
});

// Delete
await db.user.delete({ where: { id: user.id } });

// Disconnect
await db.$disconnect();
```

**Python (via `an5-adapters`)**

```python
import os
from an5_adapters import create_an5_adapter

adapter = create_an5_adapter(os.environ['DATABASE_URL'])

users = adapter.user.find_many(where={'isActive': True})
print(users)
```

**Golang**

```go
package main

import (
	"context"
	"database/sql"
	"log"

	an5 "an5client"
	_ "github.com/denisenkom/go-mssqldb"
)

func main() {
	connStr := an5.GetDefaultConnectionString() // reads DATABASE_URL
	db, err := sql.Open("sqlserver", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	ctx := context.Background()
	orm := an5.NewAn5DbContext(db)

	// Create
	user, err := orm.User.Create(ctx, &an5.User{
		Email: "john@example.com",
		Name:  an5.StringPtr("John"),
	})

	// Read
	users, err := orm.User.FindMany(ctx, &an5.UserFindManyArgs{
		Where: &an5.UserWhereInput{
			Email: &an5.StringFilter{Contains: an5.StringPtr("@example.com")},
		},
		OrderBy: &an5.UserOrderByInput{
			CreatedAt: an5.SortOrderPtr(an5.SortOrderDesc),
		},
		Take: an5.IntPtr(10),
	})

	// Update
	user.Name = an5.StringPtr("John Updated")
	orm.User.Update(ctx, user)

	// Delete
	orm.User.Delete(ctx, user.ID)
}
```

---

## Packages

| Package                                           | Description                     | Key Features                                                                                       |
| ------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------- |
| **[an5Adapters](an5Adapters/)** (`@an5/adapters`) | Runtime Query Engine & Adapters | MSSQL, PostgreSQL, MySQL, SQLite, Google Sheets, Dynamic Table Client, Query Builder, Transactions |
| **[an5Orm](an5Orm/)** (`@an5/orm`)                | Schema, Generator & Migrations  | Multi-language code generator, `db:push`, `db:pull`, `db:migrate`, `db:seed`, `db:cleanup`         |
| **[an5Client](an5Client/)**                       | Generated client code           | Type-safe models for TypeScript, Python, .NET (C#), and Golang                                     |
| **[an5Agent](an5Agent/)** (`@an5/agent`)          | AI Database Agent               | 7 tools: schema, query, database, generateClientCode, analyzeSchema, retrieve, task                |
| **[an5Cli](an5Cli/)**                             | CLI & Local UI                  | Release automation, LLM commits, documentation                                                     |
| **[an5Schema](an5Schema/)**                       | Schema definitions              | `.an5` files with types, relations, indexes                                                        |
| **[an5OrmVScode](an5OrmVScode/)**                 | VS Code extension               | Syntax highlighting, snippets, formatting                                                          |
| **[an5Tasks](an5Tasks/)**                         | Task management                 | Genkit flows for LLM review parsing                                                                |
| **[an5example](an5example/)**                     | Example repo                    | Multi-dialect CRUD suite, browser (sql.js) support, TS/Go/.NET/Python examples                     |

---

## AI Agent Tools

7 consolidated tools for database operations:

| Tool                 | Actions                      | Description           |
| -------------------- | ---------------------------- | --------------------- |
| `schema`             | list, describe, relations    | Explore data models   |
| `query`              | generate, explain, validate  | Work with SQL queries |
| `database`           | execute, describe, health    | Database operations   |
| `generateClientCode` | -                            | Generate client code  |
| `analyzeSchema`      | -                            | Analyze schema issues |
| `retrieve`           | schema, queries              | Semantic search       |
| `task`               | create, list, update, delete | Manage tasks          |

```typescript
import { An5Agent } from "@an5/agent";

// Registers the 7 default tools
const agent = new An5Agent();

// Natural language query
const result = await agent.process({
  userQuestion: "Show me all users with their orders",
  toolContext: { connectionString: process.env.DATABASE_URL },
});

console.log(result.toolCalls);
```

---

## Schema Syntax

```an5
model User {
  id        NVARCHAR(1000) @id @default(uuid()) @description("Primary key")
  email     NVARCHAR(255)  @unique @description("User email")
  name      NVARCHAR(255)? @description("Display name")
  role      NVARCHAR(50)   @default("user") @description("User role")
  isActive  BIT            @default(1) @description("Account status")
  createdAt DATETIME2      @default(now()) @description("Creation date")

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
  authorId  NVARCHAR(1000) @description("Author reference")

  // Relations
  author    User           @relation(fields: [authorId], references: [id])
  tags      Tag[]

  @@map("posts")
}
```

### Field Types

| Type           | Description    | Example         |
| -------------- | -------------- | --------------- |
| `NVARCHAR(n)`  | Unicode string | `NVARCHAR(255)` |
| `INT`          | Integer        | `INT`           |
| `BIGINT`       | Large integer  | `BIGINT`        |
| `BIT`          | Boolean        | `BIT`           |
| `DATETIME2`    | DateTime       | `DATETIME2`     |
| `DECIMAL(p,s)` | Decimal        | `DECIMAL(10,2)` |
| `TEXT`         | Large text     | `TEXT`          |

### Attributes

| Attribute                       | Description                                               |
| ------------------------------- | --------------------------------------------------------- |
| `@id`                           | Primary key                                               |
| `@unique`                       | Unique constraint                                         |
| `@default(value)`               | Default value                                             |
| `@description("...")`           | Field description                                         |
| `@relation(fields, references)` | Foreign key                                               |
| `@@map("table")`                | Table name mapping                                        |
| `@@description("...")`          | Model description                                         |
| `@@unique([...])`               | Compound unique constraint                                |
| `@@index([...])`                | Index; supports `map`, `include`, `filter`, and `options` |

---

## Schema & Database Commands

These run as npm scripts from the `an5Orm/` repository:

| Command                       | Description                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run generate`            | Generate client code from schema                                                         |
| `npm run db:push`             | Push schema to database                                                                  |
| `npm run db:pull`             | Pull schema from database                                                                |
| `npm run db:seed`             | Seed database with sample data                                                           |
| `npm run db:migrate diff`     | Compare schema with database                                                             |
| `npm run db:migrate:generate` | Generate migration SQL                                                                   |
| `npm run db:migrate:apply`    | Apply pending migration files; pass `-- --dry-run` to preview SQL                        |
| `npm run db:migrate:rollback` | Roll back the latest applied migration; pass `-- --dry-run`, `-- 3`, or `-- --to <file>` |
| `npm run db:migrate:status`   | Show migration status                                                                    |

### Development

| Command                         | Description                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `npm run build`                 | Build all packages                                                                  |
| `npm test`                      | Run all tests                                                                       |
| `npm run test:full`             | Run workspace tests plus generator, package smoke, and Python/.NET/Go compile gates |
| `npm run test:integration:live` | Run live adapter Postgres/SQL Server checks                                         |
| `npm run generate`              | Generate client code (`-w an5Orm`)                                                  |
| `npm run dryrun`                | Preview workspace release changes                                                   |
| `npm run release`               | Release across the workspace                                                        |

---

## Configuration

### an5Orm.config.js

```javascript
module.exports = {
  schemaDir: "an5Schema",
  outputs: {
    typescript: {
      outputDir: "an5Client/typescript",
      metadataFile: "an5Client/typescript/an5Metadata.ts",
    },
    python: {
      metadataFile: "an5Client/python/an5_metadata.py",
    },
    dotnet: {
      outputDir: "an5Client/dotnet",
    },
    golang: {
      outputDir: "an5Client/golang",
    },
  },
};
```

### Environment Variables

```ini
# Database (required)
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword

# LLM (optional - for an5-cli release notes / AI features)
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-api-key
LLM_MODEL=gpt-4o-mini
```

---

## Documentation

| Document                                                                | Description                              |
| ----------------------------------------------------------------------- | ---------------------------------------- |
| [Getting Started](https://an5orm.github.io/an5/guides/getting-started/) | Installation and setup                   |
| [Feature Status](https://an5orm.github.io/an5/guides/feature-status/)   | Published packages, maturity, known gaps |
| [Schema](https://an5orm.github.io/an5/guides/schema/)                   | Define your data models                  |
| [CRUD Operations](https://an5orm.github.io/an5/guides/crud/)            | Create, read, update, delete             |
| [Relations](https://an5orm.github.io/an5/guides/relations/)             | Define relationships                     |
| [Queries](https://an5orm.github.io/an5/guides/queries/)                 | Advanced query patterns                  |
| [AI Agent Tools](https://an5orm.github.io/an5/guides/agent-tools/)      | 7 intelligent tools                      |
| [API Reference](https://an5orm.github.io/an5/guides/api-reference/)     | Complete API docs                        |
| [Configuration](https://an5orm.github.io/an5/guides/configuration/)     | Setup and config                         |
| [CLI Commands](https://an5orm.github.io/an5/guides/cli/)                | Command reference                        |
| [Deployment](https://an5orm.github.io/an5/guides/deployment/)           | Production deploy                        |
| [Troubleshooting](https://an5orm.github.io/an5/guides/troubleshooting/) | Common issues                            |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      an5 ORM Ecosystem                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│  │an5Schema │───▶│an5Orm    │───▶│an5Client │               │
│  │(.an5)    │    │Generator │    │(TS/Py/.NET/Go)│           │
│  └──────────┘    └──────────┘    └──────────┘               │
│       │                                    │                  │
│       │                                    ▼                  │
│       │                             ┌──────────┐             │
│       │                             │an5Adapters│             │
│       │                             │(DB/Sheets)│             │
│       │                             └──────────┘             │
│       │                                    │                  │
│       ▼                                    ▼                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│  │an5Agent  │◀───│an5Tasks  │    │an5Cli    │               │
│  │(7 tools) │    │(Genkit)  │    │(UI/CLI)  │               │
│  └──────────┘    └──────────┘    └──────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## License

MIT
