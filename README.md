# an5 ORM

<p align="center">
  <img src="an5OrmVScode/icons/an5-128x128.png" width="96" height="96" alt="AN5 ORM Logo" />
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://www.typescriptlang.org/)

> A modern, type-safe ORM for SQL Server with AI-agent database capabilities, multi-language code generation, and Prisma-like API.

**[Documentation](https://an5orm.github.io/an5/)** | **[GitHub](https://github.com/an5ORM/an5)** | **[NPM](https://www.npmjs.com/package/@an5/orm)**

---

## Features

| Feature | Description |
|---------|-------------|
| **Type-Safe Queries** | Full TypeScript support with autocompletion and type checking |
| **Prisma-like API** | Intuitive syntax: `db.user.findMany()`, `db.user.create()` |
| **Schema-First** | Define models in `.an5` files, generate type-safe clients |
| **Multi-Language** | Generate clients for TypeScript, Python, and .NET |
| **AI Agent** | 7 intelligent tools for natural language database queries |
| **Vector Search** | Built-in semantic search for AI/ML applications |
| **Relations** | One-to-one and one-to-many with nested queries |
| **Transactions** | Atomic operations with rollback support |
| **VS Code Extension** | Syntax highlighting and formatting for `.an5` files |

## Published Packages

| Registry | Package | Status | Install |
|----------|---------|--------|---------|
| npm | [`@an5/orm`](https://www.npmjs.com/package/@an5/orm) | Published | `npm install @an5/orm` |
| npm | [`@an5/adapters`](https://www.npmjs.com/package/@an5/adapters) | Published | `npm install @an5/adapters` |
| npm | [`@an5/agent`](https://www.npmjs.com/package/@an5/agent) | Published | `npm install @an5/agent` |
| PyPI | `an5-adapters` | Package configured; PyPI token / trusted publisher setup | `pip install an5-adapters` |
| PyPI | `an5-orm` | Package configured; PyPI token / trusted publisher setup | `pip install an5-orm` |

See [Feature Status](https://an5orm.github.io/an5/guides/feature-status/) for the current maturity level of each module.

---

## Quick Start

### 1. Install

```bash
npm install @an5/orm
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

Schema/database commands run as npm scripts from the `an5Orm/` repo (no standalone CLI binary is shipped):

```bash
npm run generate    # Generate client code (in an5Orm/)
npm run db:push     # Push schema to database (in an5Orm/)
```

### 5. Use in Code

```typescript
import { An5ORM } from '@an5/orm';

// Uses DATABASE_URL from the environment; metadata auto-loads from the ORM's generated copy
const db = new An5ORM();

// Create
const user = await db.user.create({
  data: { email: 'john@example.com', name: 'John' }
});

// Read
const users = await db.user.findMany({
  where: { email: { contains: '@example.com' } },
  include: { orders: true },
  orderBy: { createdAt: 'desc' },
  take: 10
});

// Update
await db.user.update({
  where: { id: user.id },
  data: { name: 'John Updated' }
});

// Delete
await db.user.delete({ where: { id: user.id } });
```

---

## Packages

| Package | Description | Key Features |
|---------|-------------|--------------|
| **[an5Orm](an5Orm/)** (`@an5/orm`) | Core ORM runtime | Proxy client, CRUD, vector search, middleware, transactions |
| **[an5Client](an5Client/)** | Generated client code | Type-safe models for TypeScript, Python, .NET |
| **[an5Adapters](an5Adapters/)** (`@an5/adapters`) | Database adapters | SQL Server/Postgres/MySQL/SQLite engines, Google Sheets, Python/.NET sources |
| **[an5Agent](an5Agent/)** (`@an5/agent`) | AI Database Agent | 7 tools: schema, query, database, generateClientCode, analyzeSchema, retrieve, task |
| **[an5Cli](an5Cli/)** | CLI & Local UI | Release automation, LLM commits, documentation |
| **[an5Schema](an5Schema/)** | Schema definitions | `.an5` files with types, relations, indexes |
| **[an5OrmVScode](an5OrmVScode/)** | VS Code extension | Syntax highlighting, snippets, formatting |
| **[an5Tasks](an5Tasks/)** | Task management | Genkit flows for LLM review parsing |

---

## AI Agent Tools

7 consolidated tools for database operations:

| Tool | Actions | Description |
|------|---------|-------------|
| `schema` | list, describe, relations | Explore data models |
| `query` | generate, explain, validate | Work with SQL queries |
| `database` | execute, describe, health | Database operations |
| `generateClientCode` | - | Generate client code |
| `analyzeSchema` | - | Analyze schema issues |
| `retrieve` | schema, queries | Semantic search |
| `task` | create, list, update, delete | Manage tasks |

```typescript
import { An5Agent } from '@an5/agent';

// Registers the 7 default tools
const agent = new An5Agent();

// Natural language query
const result = await agent.process({
  userQuestion: 'Show me all users with their orders',
  toolContext: { connectionString: process.env.DATABASE_URL }
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

| Type | Description | Example |
|------|-------------|---------|
| `NVARCHAR(n)` | Unicode string | `NVARCHAR(255)` |
| `INT` | Integer | `INT` |
| `BIGINT` | Large integer | `BIGINT` |
| `BIT` | Boolean | `BIT` |
| `DATETIME2` | DateTime | `DATETIME2` |
| `DECIMAL(p,s)` | Decimal | `DECIMAL(10,2)` |
| `TEXT` | Large text | `TEXT` |

### Attributes

| Attribute | Description |
|-----------|-------------|
| `@id` | Primary key |
| `@unique` | Unique constraint |
| `@default(value)` | Default value |
| `@description("...")` | Field description |
| `@relation(fields, references)` | Foreign key |
| `@@map("table")` | Table name mapping |
| `@@description("...")` | Model description |

---

## Schema & Database Commands

These run as npm scripts from the `an5Orm/` repository (no standalone `an5` CLI binary is shipped):

| Command | Description |
|---------|-------------|
| `npm run generate` | Generate client code from schema |
| `npm run db:push` | Push schema to database |
| `npm run db:pull` | Pull schema from database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:migrate diff` | Compare schema with database |
| `npm run db:migrate:generate` | Generate migration SQL |
| `npm run db:migrate:status` | Show migration status |

### Development

| Command | Description |
|---------|-------------|
| `npm run build` | Build all packages |
| `npm test` | Run all tests |
| `npm run generate` | Generate client code (`-w an5Orm`) |
| `npm run dryrun` | Preview workspace release changes |
| `npm run release` | Release across the workspace |

---

## Configuration

### an5Orm.config.js

```javascript
module.exports = {
  schemaDir: 'an5Schema',
  outputs: {
    typescript: {
      outputDir: 'an5Client/typescript',
      metadataFile: 'an5Client/typescript/an5Metadata.ts',
      ormMetadataFile: 'an5Orm/an5Metadata.ts',
    },
    python: {
      metadataFile: 'an5Client/python/an5_metadata.py',
    },
    dotnet: {
      outputDir: 'an5Client/dotnet',
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

> Embedding settings for vector/RAG features are stored in the `EmbeddingConfig`
> model/table (not environment variables) and read at runtime via
> `getEmbeddingConfig()`.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](https://an5orm.github.io/an5/guides/getting-started/) | Installation and setup |
| [Feature Status](https://an5orm.github.io/an5/guides/feature-status/) | Published packages, maturity, known gaps |
| [Schema](https://an5orm.github.io/an5/guides/schema/) | Define your data models |
| [CRUD Operations](https://an5orm.github.io/an5/guides/crud/) | Create, read, update, delete |
| [Relations](https://an5orm.github.io/an5/guides/relations/) | Define relationships |
| [Queries](https://an5orm.github.io/an5/guides/queries/) | Advanced query patterns |
| [AI Agent Tools](https://an5orm.github.io/an5/guides/agent-tools/) | 7 intelligent tools |
| [API Reference](https://an5orm.github.io/an5/guides/api-reference/) | Complete API docs |
| [Configuration](https://an5orm.github.io/an5/guides/configuration/) | Setup and config |
| [CLI Commands](https://an5orm.github.io/an5/guides/cli/) | Command reference |
| [Deployment](https://an5orm.github.io/an5/guides/deployment/) | Production deploy |
| [Troubleshooting](https://an5orm.github.io/an5/guides/troubleshooting/) | Common issues |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      an5 ORM Ecosystem                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│  │an5Schema │───▶│an5Orm    │───▶│an5Client │               │
│  │(.an5)    │    │Generator │    │(TS/Py/.NET)│              │
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

## Comparison with Other ORMs

| Feature | an5 ORM | Prisma | TypeORM | Sequelize |
|---------|---------|--------|---------|-----------|
| Type Safety | ✅ Full | ✅ Full | ⚠️ Partial | ⚠️ Partial |
| Schema-first | ✅ | ✅ | ❌ | ❌ |
| SQL Server | ✅ Native | ✅ | ✅ | ✅ |
| Vector Search | ✅ Built-in | ❌ | ❌ | ❌ |
| AI Agent | ✅ 7 tools | ❌ | ❌ | ❌ |
| Multi-language | ✅ TS/Py/.NET | ⚠️ TS only | ⚠️ TS only | ⚠️ TS only |
| Transactions | ✅ | ✅ | ✅ | ✅ |
| Raw Queries | ✅ | ✅ | ✅ | ✅ |

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- [Documentation](https://an5orm.github.io/an5/)
- [GitHub Issues](https://github.com/an5ORM/an5/issues)
- [Discord Community](https://discord.gg/an5)
