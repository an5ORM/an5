---
layout: page
title: CLI Commands
description: Command-line interface for schema management and development
---

# CLI Commands

an5 ORM provides a powerful CLI for managing your schema, database, and development workflow.

## Installation

The CLI is included in the an5 workspace. No separate installation needed.

```bash
# Run CLI commands via npm
npm run <command>

# Or use an5-cli directly
npx an5-cli <command>
```

## Schema Commands

### Generate Client Code

Generate type-safe client code from your schema files.

```bash
# Generate all clients (TypeScript, Python, .NET)
npm run generate

# Generate for specific module
npm run generate -w an5Orm
```

**Output:**
```
an5Client/
├── typescript/     # TypeScript interfaces and metadata
├── python/         # Python dataclasses
└── dotnet/         # .NET entity classes
```

### Push Schema to Database

Create or update database tables based on your schema.

```bash
# Push schema to database
npm run db:push
```

**What it does:**
- Compares schema with existing database
- Creates new tables
- Adds missing columns
- Preserves existing data

### Pull Schema from Database

Reverse-engineer schema from existing database.

```bash
# Pull schema from database
npm run db:pull
```

**Output:** Creates `.an5` files in `an5Schema/` directory.

### Seed Database

Populate database with sample data.

```bash
# Run seed script
npm run db:seed
```

## Development Commands

### Build All Packages

```bash
npm run build
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific module tests
npm run test -w an5Orm
npm run test -w an5Agent
```

### Start Local UI

Launch the local development UI.

```bash
# Start UI on port 5070
npm run ui

# Start with tunnel for mobile access
npm run ui:tunnel
```

**Features:**
- Repository status dashboard
- Git diff viewer
- Build and test buttons
- Commit and release workflow
- LLM configuration

## Release Commands

### Check Status

```bash
# Check status across all submodules
npm run status
```

### Dry Run Release

Preview release changes without committing.

```bash
npm run dryrun
```

### Release All

Compile, test, tag, commit, and push all submodules.

```bash
npm run release:all
```

## an5-cli Commands

### Impact Analysis

Analyze cross-repo impact from changes.

```bash
npx an5-cli impact [repo]
```

### Documentation

Auto-update docs based on changed files.

```bash
npx an5-cli doc:diff [repo]
```

### Format Schema Files

Auto-format `.an5` files.

```bash
npx an5-cli format [path]
```

### Task Management

```bash
# List tasks
npx an5-cli tasks list

# Update task
npx an5-cli tasks update

# Delete task
npx an5-cli tasks delete
```

## Environment Configuration

### Interactive Setup

```bash
npx an5-cli config
```

### Direct Configuration

Edit `.env` file:

```ini
# Database (required)
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword

# Optional
LOG_LEVEL=info
```

### LLM Configuration

```bash
# Configure via CLI
npx an5-cli config

# Or set environment variables
export LLM_PROVIDER=openai
export LLM_API_KEY=sk-your-api-key
export LLM_MODEL=gpt-4o-mini
```

## Common Workflows

### New Project Setup

```bash
# 1. Clone repository
git clone https://github.com/an5ORM/an5.git
cd an5

# 2. Install dependencies
npm install

# 3. Configure database
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Generate code
npm run generate

# 5. Push schema
npm run db:push

# 6. Start development
npm run ui
```

### Daily Development

```bash
# Pull latest changes
git pull

# Build
npm run build

# Run tests
npm test

# Start UI
npm run ui
```

### Release Process

```bash
# 1. Check status
npm run status

# 2. Dry run
npm run dryrun

# 3. Release
npm run release:all
```

## Tips

- Use `npm run ui` for visual feedback during development
- Run `npm run status` before commits to check everything
- Use `npx an5-cli format` to keep schema files consistent
- Check `npm run dryrun` before releases
