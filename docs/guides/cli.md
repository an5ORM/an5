---
layout: page
title: CLI Commands
description: Command-line interface for schema management and development
---

# CLI Commands

an5 ORM provides two CLIs: `an5` for project-level ORM/database work, and `an5-cli` for monorepo release/workspace automation.

Use [Feature Status]({{ '/guides/feature-status/' | relative_url }}) to see which commands are stable and which migration workflows are still evolving.

## Installation

For application projects, install the published ORM package:

```bash
npm install @an5/orm
```

This exposes two equivalent binaries:

```bash
npx an5 --help
npx an5-orm --help
```

For this monorepo workspace, npm scripts are also available:

```bash
npm run <command>

# Workspace/release CLI
npx an5-cli <command>
```

## Schema Commands

### Generate Client Code

Generate type-safe client code from your schema files.

```bash
# Generate all clients (TypeScript, Python, .NET)
npx an5 generate

# Alias
npx an5 db:generate
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
npx an5 db:push
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
npx an5 db:pull
```

**Output:** Creates `.an5` files in `an5Schema/` directory.

### Seed Database

Populate database with sample data.

```bash
# Run seed script
npx an5 db:seed
```

### Migrations

```bash
# Compare schema with database
npx an5 db:migrate diff

# Generate migration SQL
npx an5 db:migrate generate

# Show migration status
npx an5 db:migrate status
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
# 1. Install package
npm install @an5/orm

# 2. Configure database
# Create .env and set DATABASE_URL
# Edit .env with your DATABASE_URL

# 3. Generate code
npx an5 generate

# 4. Push schema
npx an5 db:push
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

### Auto Version Bump

For maintainers publishing npm packages under the `@an5` organization:

```bash
# Preview next versions
npm run version:bump:dry

# Apply patch bumps based on latest npm versions
npm run version:bump

# Bump minor or major
node scripts/auto-bump-version.js minor
node scripts/auto-bump-version.js major
```

The default package set is `@an5/adapters` and `@an5/orm`. The script also updates internal dependency ranges, for example `@an5/orm` depending on the new `@an5/adapters` version.

## Tips

- Use `npm run ui` for visual feedback during development
- Run `npm run status` before commits to check everything
- Use `npx an5-cli format` to keep schema files consistent
- Use `npx an5 generate` in application projects instead of calling files under `node_modules/@an5/orm`
- Check `npm run dryrun` before releases
