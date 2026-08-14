---
layout: page
title: Configuration
description: Configure an5 ORM for your environment
---

# Configuration

an5 ORM uses environment variables, schema configuration files, and runtime adapters to customize behavior.

## an5Orm.config.js

Create `an5Orm.config.js` in your project root to configure code generation and schema options:

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
    golang: {
      outputDir: 'an5Client/golang',
    },
  },

  // Database pull options
  pull: {
    exclude: ['^__', '^sys\\.'],  // Exclude system tables
    preserveRelations: true,
  },
};
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `schemaDir` | `string` | `'an5Schema'` | Path to schema files |
| `outputs.typescript.outputDir` | `string` | `'an5Client/typescript'` | TypeScript output directory |
| `outputs.typescript.metadataFile` | `string` | `'an5Client/typescript/an5Metadata.ts'` | Metadata file path for the generated client |
| `outputs.python.metadataFile` | `string` | `'an5Client/python/an5_metadata.py'` | Python metadata path |
| `outputs.dotnet.outputDir` | `string` | `'an5Client/dotnet'` | .NET output directory |
| `outputs.golang.outputDir` | `string` | `'an5Client/golang'` | Go output directory |
| `pull.exclude` | `string[]` | `['^__', '^sys\\.']` | Tables to exclude from pull |
| `pull.preserveRelations` | `boolean` | `true` | Keep relations in schema |

## Environment Variables

### Database (`DATABASE_URL`)

```ini
# SQL Server
DATABASE_URL=sqlserver://localhost:1433;database=mydb;user=sa;password=yourpassword

# PostgreSQL
DATABASE_URL=postgres://user:password@localhost:5432/mydb

# MySQL
DATABASE_URL=mysql://user:password@localhost:3306/mydb

# SQLite
DATABASE_URL=sqlite:///path/to/database.db

# Google Sheets
DATABASE_URL=googlesheets://spreadsheetId;clientEmail=sa@project.iam.gserviceaccount.com;privateKey=your-url-encoded-key
```

### LLM Configuration (for an5-cli release notes & agent features)

```ini
LLM_PROVIDER=openai  # openai, gemini, custom
LLM_API_KEY=sk-your-api-key
LLM_MODEL=gpt-4o-mini
```

## Runtime Adapter Setup (via `@an5/adapters`)

```typescript
import { createAn5Adapter } from '@an5/adapters';

const db = createAn5Adapter({
  connectionString: process.env.DATABASE_URL!,
});

await db.$connect();
```

## LLM & Embedding Runtime Config

At runtime you can read and update the active LLM/Embedding config using the config API exported from `@an5/adapters`:

```typescript
import {
  getLlmConfig,
  setLlmConfig,
  getEmbeddingConfig,
  setEmbeddingConfig,
  resetAdapter
} from '@an5/adapters';

const current = getLlmConfig();
setLlmConfig({ provider: 'openai', model: 'gpt-4o-mini', apiKey: '...' });
setEmbeddingConfig({ provider: 'openai', model: 'text-embedding-3-small', apiKey: '...' });
resetAdapter();
```

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
