---
layout: page
title: Getting Started
description: Install and set up an5 ORM in your project
---

# Getting Started

This guide will help you set up an5 ORM in your project in under 5 minutes.

## Prerequisites

- Node.js 18+ (Node 24 recommended)
- SQL Server instance (local or remote)
- npm or yarn package manager

## Installation

```bash
npm install @an5/orm
```

This installs the ORM runtime, the `an5` CLI, and the required `@an5/adapters` package.

## Configuration

### 1. Set up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:

```ini
# Database connection string
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

```bash
npx an5 generate
```

This generates type-safe client code in `an5Client/`.

### 4. Push Schema to Database

```bash
npx an5 db:push
```

This creates the tables in your database.

## Your First Query

```typescript
import { An5ORM } from '@an5/orm';

// Initialize the ORM
const db = new An5ORM({
  connectionString: process.env.DATABASE_URL
});

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
├── node_modules/@an5/orm      # Core ORM runtime and CLI
├── node_modules/@an5/adapters # Database adapters
├── an5Client/                # Generated client code
└── .env                 # Configuration
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npx an5 generate` | Generate client code from schema |
| `npx an5 db:push` | Push schema to database |
| `npx an5 db:pull` | Pull schema from database |
| `npx an5 db:seed` | Seed database with sample data |
| `npx an5 db:migrate diff` | Compare schema with database |
| `npm run build` | Build all packages |
| `npm test` | Run all tests |

## Next Steps

- [Schema Definition]({{ '/guides/schema/' | relative_url }}) - Learn how to define your data models
- [CRUD Operations]({{ '/guides/crud/' | relative_url }}) - Create, read, update, and delete data
- [Relations]({{ '/guides/relations/' | relative_url }}) - Define relationships between models
