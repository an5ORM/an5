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
      ormMetadataFile: 'an5Orm/an5Metadata.ts',
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
| `outputs.typescript.ormMetadataFile` | `string` | `'an5Orm/an5Metadata.ts'` | ORM-local metadata path (owned by `@an5/orm`, so the core never imports from the generated client) |
| `outputs.python.metadataFile` | `string` | `'an5Client/python/an5_metadata.py'` | Python metadata path |
| `outputs.dotnet.outputDir` | `string` | `'an5Client/dotnet'` | .NET output directory |
| `outputs.golang.outputDir` | `string` | `'an5Client/golang'` | Go output directory |
| `pull.exclude` | `string[]` | `['^__', '^sys\\.']` | Tables to exclude from pull |
| `pull.preserveRelations` | `boolean` | `true` | Keep relations in schema |

> `generation.*` keys are reserved in `an5Orm.config.js` but are **not read** by the
> generator; all outputs are driven by `schemaDir` and `outputs.*`.

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

# LLM Configuration (for the an5-cli release-note generator and AI features)
# Provider: "openai", "gemini", or "custom"
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-api-key
LLM_MODEL=gpt-4o-mini
LLM_ENDPOINT=  # Custom endpoint URL (only when LLM_PROVIDER=custom)
```

> Embedding settings for RAG/vector features are **not** read from `EMBEDDING_*`
> environment variables. They are stored in the `EmbeddingConfig` model/table and
> read at runtime via `getEmbeddingConfig()`.

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

**Google Sheets:**

Spreadsheet-backed connections are auto-detected from the `googlesheets://` scheme. The
first segment is the spreadsheet id; remaining segments are semicolon-separated options.
Use URL-encoded values (`encodeURIComponent`) for keys containing special characters.

```ini
# OAuth service account
DATABASE_URL=googlesheets://spreadsheetId;clientEmail=sa@project.iam.gserviceaccount.com;privateKey=your-url-encoded-private-key

# API key
DATABASE_URL=googlesheets://spreadsheetId;apiKey=your-api-key

# Sheet mapping (model:sheetName pairs, comma-separated)
DATABASE_URL=googlesheets://spreadsheetId;clientEmail=sa@project.iam.gserviceaccount.com;privateKey=...;sheetMapping=users:Users,orders:Orders
```

The same connection string can also be passed programmatically:

```typescript
import { createAn5Adapter } from '@an5/adapters';

// Auto-detects googlesheets:// and returns a Sheets-backed adapter
const db = createAn5Adapter({
  connectionString: 'googlesheets://spreadsheetId;clientEmail=...;privateKey=...',
});

// Or configure directly via the Sheets adapter
import { createAn5SheetsAdapter } from '@an5/adapters';

const sheets = createAn5SheetsAdapter({
  spreadsheetId: 'spreadsheetId',
  clientEmail: 'sa@project.iam.gserviceaccount.com',
  privateKey: 'your-private-key',
  sheetMapping: { users: 'Users', orders: 'Orders' },
});
```

### Connection Pooling

Pooling is handled by the database adapter. The ORM reads the `DATABASE_URL` environment variable:

```typescript
import { An5ORM } from '@an5/orm';

// Uses DATABASE_URL from the environment; pool sizing is configured on the adapter
const db = new An5ORM();
```

## ORM Configuration

### Basic Setup

```typescript
import { An5ORM } from '@an5/orm';

// Uses DATABASE_URL from the environment; set LOG_LEVEL=debug for query logging
const db = new An5ORM();
```

### Custom Executor

Pass a custom query executor to bypass the default SQL Server adapter:

```typescript
import { An5ORM } from '@an5/orm';

const db = new An5ORM(async (queryText, params) => {
  // custom execution (e.g. test double, another database driver)
  return [];
});
```

### Schema Metadata

Schema metadata (model→table mapping, relations, field types) is auto-loaded from the
ORM's own generated metadata file `an5Metadata.ts` (written by `npm run generate`). The
ORM owns this metadata locally and never imports from the generated client — the client
is generated *from* the ORM. To pass metadata explicitly instead:

```typescript
import { An5ORM } from '@an5/orm';
import { modelToTable, relationMap, modelFields } from './an5Metadata';

const db = new An5ORM(undefined, { modelToTable, relationMap, modelFields });
```

## LLM Configuration

LLM settings are read from `LLM_*` environment variables by default. At runtime you can
read and update the active config (persisted to the `LlmConfig` model/table) through the
config API exported from `@an5/adapters`:

```typescript
import { getLlmConfig, setLlmConfig, getEmbeddingConfig, setEmbeddingConfig } from '@an5/adapters';
import { resetAdapter } from '@an5/adapters';

const current = getLlmConfig();          // read active LLM config
setLlmConfig({ provider: 'openai', model: 'gpt-4o-mini', apiKey: '...' });
setEmbeddingConfig({ provider: 'openai', model: 'text-embedding-3-small', apiKey: '...' });
resetAdapter();                          // clear cached adapter/config state
```

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
LLM_ENDPOINT=http://localhost:11434/api/chat
LLM_MODEL=llama3
```

### Azure OpenAI

`LLM_PROVIDER=azure` is **not supported**. Use the OpenAI-compatible `custom`
provider with your Azure endpoint instead.

## Embedding Configuration

Embedding settings are stored in the `EmbeddingConfig` model/table (fields:
`provider`, `apiKey`, `model`, `endpoint`, `isActive`) and read at runtime via
`getEmbeddingConfig()` / updated via `setEmbeddingConfig()` (both exported from
`@an5/adapters`). The an5 agent's `rag/embedder` uses those values to call
your embedding endpoint.

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

The schema path is a generator setting, not an ORM constructor option. Configure it in `an5Orm.config.js` (see [above](#an5ormconfigjs)), then generate:

```bash
npm run generate   # from an5Orm/
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

The `config` command runs an interactive prompt to set API keys.

## VS Code Extension

The `an5-orm-vscode` extension provides syntax highlighting, formatting and
snippets for `.an5` schema files, plus these commands (no extension settings are
exposed):

| Command | Action |
|---------|--------|
| `AN5: Generate Client Code` | Run schema generation |
| `AN5: Push Database Schema` | Push schema to the database |
| `AN5: Pull Database Schema` | Pull schema from the database |
| `AN5: Open an5Orm Configuration File` | Open `an5Orm.config.js` |

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
