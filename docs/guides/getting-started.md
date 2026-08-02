---
layout: page
title: Getting Started
description: Install and set up an5 ORM in your project
---

# Getting Started

This guide will help you set up an5 ORM in your project in under 5 minutes.

For the current implementation and package maturity overview, see [Feature Status]({{ '/guides/feature-status/' | relative_url }}).

## Prerequisites

- Node.js 18+ (Node 24 recommended)
- SQL Server instance (local or remote)
- npm or yarn package manager

## Installation

```bash
npm install @an5/orm
```

This installs the ORM runtime and the required `@an5/adapters` package. The
adapters package is what actually talks to your database (SQL Server, PostgreSQL,
MySQL, SQLite, or Google Sheets). You can also use it standalone — see
[`@an5/adapters`](/guides/api-reference/#an5-adapters) for `createAn5Adapter`,
`An5SheetsAdapter`, and `SheetsTableClient`.

## Configuration

### 1. Set up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:

```ini
# Database connection string (SQL Server shown; the adapter also auto-detects
# googlesheets:// for spreadsheet-backed connections)
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword

# Optional: LLM configuration for AI features
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-api-key
LLM_MODEL=gpt-4o-mini
```

### 2. Define Your Schema

Create `.an5` files in the `an5Schema/` directory:

```an5
// an5Schema/User.an5
model User {
  id        NVARCHAR(1000) @id @default(uuid())
  email     NVARCHAR(255)  @unique
  name      NVARCHAR(255)?
  createdAt DATETIME2      @default(now())
  
  @@map("users")
}
```

### 3. Generate Client Code

Run from the `an5Orm/` repository directory:

```bash
npm run generate
```

This generates type-safe client code in `an5Client/`.

### 4. Push Schema to Database

```bash
npm run db:push
```

This creates the tables in your database.

## Your First Query

```typescript
import { An5ORM } from '@an5/orm';

// Initialize the ORM (uses DATABASE_URL from the environment;
// schema metadata auto-loads from the ORM's generated an5Metadata.ts)
const db = new An5ORM();

async function main() {
  // Create a user
  const user = await db.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe'
    }
  });
  
  console.log('Created user:', user);
  
  // Find all users
  const users = await db.user.findMany();
  console.log('All users:', users);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
```

## Project Structure

```
an5/
├── an5Schema/           # Schema definitions (.an5 files)
├── node_modules/@an5/orm      # Core ORM runtime
├── node_modules/@an5/adapters # Database adapters
├── an5Client/                # Generated client code
└── .env                 # Configuration
```

## Available Commands

Schema/database commands run from the `an5Orm/` repository directory (no standalone `an5` CLI binary is shipped):

| Command | Where | Description |
|---------|-------|-------------|
| `npm run generate` | `an5Orm/` | Generate client code from schema |
| `npm run db:push` | `an5Orm/` | Push schema to database |
| `npm run db:pull` | `an5Orm/` | Pull schema from database |
| `npm run db:seed` | `an5Orm/` | Seed database with sample data |
| `npm run db:migrate diff` | `an5Orm/` | Compare schema with database |
| `npm run build` | workspace root | Build all workspace packages |
| `npm test` | `an5Orm/` or workspace root | Run tests (an5Orm) or the full workspace suite |

## Next Steps

- [Schema Definition]({{ '/guides/schema/' | relative_url }}) - Learn how to define your data models
- [CRUD Operations]({{ '/guides/crud/' | relative_url }}) - Create, read, update, and delete data
- [Relations]({{ '/guides/relations/' | relative_url }}) - Define relationships between models
