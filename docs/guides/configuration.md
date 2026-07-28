---
layout: page
title: Configuration
description: Configure an5 ORM for your environment
---

# Configuration

an5 ORM uses environment variables and configuration files to customize behavior.

## an5Orm.config.js

Create `an5Orm.config.js` in your project root to configure the ORM:

```javascript
module.exports = {
  // Schema directory (default: 'an5Schema')
  schemaDir: 'an5Schema',

  // Output configuration
  outputs: {
    typescript: {
      outputDir: 'an5Client/typescript',
      metadataFile: 'an5Client/typescript/an5Metadata.ts',
    },
    python: {
      metadataFile: 'an5Client/python/an5_metadata.py',
    },
    dotnet: {
      outputDir: 'an5Client/dotnet',
    },
  },

  // Database pull options
  pull: {
    exclude: ['^__', '^sys\\.'],  // Exclude system tables
    preserveRelations: true,
  },

  // Code generation options
  generation: {
    generateComments: true,
    generateMetadata: true,
  },
};
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `schemaDir` | `string` | `'an5Schema'` | Path to schema files |
| `outputs.typescript.outputDir` | `string` | `'an5Client/typescript'` | TypeScript output directory |
| `outputs.typescript.metadataFile` | `string` | `'an5Client/typescript/an5Metadata.ts'` | Metadata file path |
| `outputs.python.metadataFile` | `string` | `'an5Client/python/an5_metadata.py'` | Python metadata path |
| `outputs.dotnet.outputDir` | `string` | `'an5Client/dotnet'` | .NET output directory |
| `pull.exclude` | `string[]` | `['^__', '^sys\\.']` | Tables to exclude from pull |
| `pull.preserveRelations` | `boolean` | `true` | Keep relations in schema |
| `generation.generateComments` | `boolean` | `true` | Generate JSDoc comments |
| `generation.generateMetadata` | `boolean` | `true` | Generate metadata files |

## Environment Variables

### Required

```ini
# Database connection string
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword
```

### Optional

```ini
# Logging
LOG_LEVEL=info  # debug, info, warn, error

# LLM Configuration (for AI features)
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-api-key
LLM_MODEL=gpt-4o-mini
LLM_ENDPOINT=  # Custom endpoint URL

# Embedding (for vector search)
EMBEDDING_ENDPOINT=https://api.openai.com/v1
EMBEDDING_API_KEY=sk-your-api-key
EMBEDDING_MODEL=text-embedding-3-small
```

## Database Configuration

### Connection String Formats

**SQL Server:**
```ini
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword
```

**With Options:**
```ini
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword;encrypt=true;trustServerCertificate=true
```

**Remote Server:**
```ini
DATABASE_URL=sqlserver://your-server.database.windows.net:1433;database=mydb;user=admin@server;password=yourpassword;encrypt=true
```

### Connection Pooling

Configure in your code:

```typescript
import { An5ORM } from '@an5/orm';

const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  pool: {
    min: 5,
    max: 20,
    idleTimeoutMillis: 30000
  }
});
```

## ORM Configuration

### Basic Setup

```typescript
import { An5ORM } from '@an5/orm';

const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  logging: true,           // Log queries
  logQueries: true,        // Log individual queries
  logSlowQueries: true,    // Log slow queries
  slowQueryThreshold: 1000 // ms threshold
});
```

### Advanced Options

```typescript
const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  
  // Pool settings
  pool: {
    min: 5,
    max: 20,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000
  },
  
  // Query settings
  queryTimeout: 30000,
  maxRetries: 3,
  
  // Logging
  logging: {
    queries: true,
    errors: true,
    slow: true,
    slowThreshold: 1000
  }
});
```

## LLM Configuration

### OpenAI

```ini
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-api-key
LLM_MODEL=gpt-4o-mini
```

### Google Gemini

```ini
LLM_PROVIDER=gemini
LLM_API_KEY=your-gemini-api-key
LLM_MODEL=gemini-2.5-flash
```

### Custom Endpoint

```ini
LLM_PROVIDER=custom
LLM_ENDPOINT=http://localhost:11434/api/generate
LLM_MODEL=llama3
```

### Azure OpenAI

```ini
LLM_PROVIDER=azure
LLM_API_KEY=your-azure-api-key
LLM_ENDPOINT=https://your-resource.openai.azure.com/
LLM_MODEL=gpt-4o
```

## Embedding Configuration

For vector search features:

```ini
EMBEDDING_ENDPOINT=https://api.openai.com/v1
EMBEDDING_API_KEY=sk-your-api-key
EMBEDDING_MODEL=text-embedding-3-small
```

### Supported Embedding Models

| Provider | Model | Dimensions |
|----------|-------|------------|
| OpenAI | text-embedding-3-small | 1536 |
| OpenAI | text-embedding-3-large | 3072 |
| Cohere | embed-english-v3 | 1024 |
| Custom | any | varies |

## Schema Configuration

### Schema Location

Default: `an5Schema/` directory

```bash
an5Schema/
├── User.an5
├── Post.an5
└── Order.an5
```

### Custom Schema Path

```typescript
const db = new An5ORM({
  connectionString: process.env.DATABASE_URL,
  schemaPath: './my-schemas'
});
```

## CLI Configuration

### Login

```bash
npx an5-cli login
```

### Set API Keys

```bash
npx an5-cli config
```

### Interactive Setup

```bash
npx an5-cli config --interactive
```

## VS Code Extension

### Settings

```json
{
  "an5Orm.schemaPath": "an5Schema/",
  "an5Orm.autoFormat": true,
  "an5Orm.validateOnSave": true
}
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift+Alt+F` | Format document |
| `Ctrl+Space` | Trigger suggestions |

## Docker Configuration

### docker-compose.yml

```yaml
version: '3.8'
services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=yourpassword
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - mssql-data:/var/opt/mssql

  app:
    build: .
    environment:
      - DATABASE_URL=sqlserver://db:1433;database=mydb;user=sa;password=yourpassword
    depends_on:
      - db

volumes:
  mssql-data:
```

## Configuration Files

### .env.example

```ini
# Database (required)
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword

# Optional
LOG_LEVEL=info

# LLM (optional)
LLM_PROVIDER=openai
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini
```

### .gitignore

Ensure `.env` is in your `.gitignore`:

```gitignore
# Environment
.env
.env.local
.env.*.local
```

## Best Practices

1. **Never commit secrets** - Keep `.env` out of version control
2. **Use environment variables** - For all sensitive configuration
3. **Document required vars** - Update `.env.example` when adding new vars
4. **Use connection pooling** - For production environments
5. **Enable logging in dev** - Disable in production for performance
