---
layout: page
title: API Reference
description: Complete API reference for an5 ORM
---

# API Reference

Complete API documentation for an5 ORM.

## An5ORM Class

### Constructor

```typescript
import { An5ORM } from '@an5/orm';

const db = new An5ORM(customExecutor?, metadata?);
```

### Parameters

| Param | Type | Default | Description |
|--------|------|---------|-------------|
| `customExecutor` | `(queryText: string, params?: Record<string, any>) => Promise<any[]>` | - | Custom query executor; defaults to a database adapter built from the `DATABASE_URL` environment variable. The scheme is auto-detected — `sqlserver://` yields SQL Server, `googlesheets://` yields a Google Sheets adapter, and so on |
| `metadata` | `An5Metadata` | Auto-loaded from the ORM's generated `an5Metadata.ts` | Schema metadata: `{ modelToTable, relationMap, modelFields }`. Pass explicitly to provide schema models out of the box |

```typescript
// Auto-loaded metadata (from the ORM's generated an5Metadata.ts)
const db = new An5ORM();

// Explicit metadata
import { modelToTable, relationMap, modelFields } from './an5Metadata';
const db = new An5ORM(undefined, { modelToTable, relationMap, modelFields });
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `$connect()` | `Promise<void>` | Establish connection (no-op for default adapter; connection is lazy) |
| `$disconnect()` | `Promise<void>` | Close connection |
| `$transaction(fn, options?)` | `Promise<T>` | Execute callback-style transaction |
| `$queryRaw(template)` | `Promise<any[]>` | Raw SQL query (template tag or string) |
| `$queryRawUnsafe(query, ...values)` | `Promise<any[]>` | Raw SQL query with positional params |
| `$executeRaw(template)` | `Promise<number>` | Raw SQL execute, returns rows affected |
| `$executeRawUnsafe(query, ...values)` | `Promise<number>` | Raw SQL execute with positional params |
| `$use(middleware)` | `void` | Register a middleware hook |

## Model Methods

### findUnique

```typescript
db.model.findUnique(params: FindUniqueArgs): Promise<Model | null>
```

**Params:**
```typescript
{
  where: { id: 'string' } | { uniqueField: 'value' }
}
```

### findFirst

```typescript
db.model.findFirst(params: FindFirstArgs): Promise<Model | null>
```

**Params:**
```typescript
{
  where?: WhereInput,
  orderBy?: OrderByInput,
  include?: IncludeInput,
  select?: SelectInput
}
```

### findMany

```typescript
db.model.findMany(params: FindManyArgs): Promise<Model[]>
```

**Params:**
```typescript
{
  where?: WhereInput,
  orderBy?: OrderByInput | OrderByInput[],
  include?: IncludeInput,
  select?: SelectInput,
  skip?: number,
  take?: number
}
```

### create

```typescript
db.model.create(params: CreateArgs): Promise<Model>
```

**Params:**
```typescript
{
  data: CreateInput,
  include?: IncludeInput,
  select?: SelectInput
}
```

### createMany

```typescript
db.model.createMany(params: CreateManyArgs): Promise<BatchPayload>
```

**Params:**
```typescript
{
  data: CreateInput[],
  skipDuplicates?: boolean
}
```

### update

```typescript
db.model.update(params: UpdateArgs): Promise<Model>
```

**Params:**
```typescript
{
  where: WhereInput,
  data: UpdateInput,
  include?: IncludeInput,
  select?: SelectInput
}
```

### updateMany

```typescript
db.model.updateMany(params: UpdateManyArgs): Promise<BatchPayload>
```

**Params:**
```typescript
{
  where?: WhereInput,
  data: UpdateInput
}
```

### upsert

```typescript
db.model.upsert(params: UpsertArgs): Promise<Model>
```

**Params:**
```typescript
{
  where: WhereInput,
  create: CreateInput,
  update: UpdateInput
}
```

### delete

```typescript
db.model.delete(params: DeleteArgs): Promise<Model>
```

**Params:**
```typescript
{
  where: WhereInput
}
```

### deleteMany

```typescript
db.model.deleteMany(params: DeleteManyArgs): Promise<BatchPayload>
```

**Params:**
```typescript
{
  where?: WhereInput
}
```

### count

```typescript
db.model.count(params?: CountArgs): Promise<number>
```

### aggregate

```typescript
db.model.aggregate(params: AggregateArgs): Promise<AggregateResult>
```

**Params:**
```typescript
{
  _count?: boolean,
  _sum?: { field: boolean },
  _avg?: { field: boolean },
  _min?: { field: boolean },
  _max?: { field: boolean }
}
```

### groupBy

```typescript
db.model.groupBy(params: GroupByArgs): Promise<GroupByResult[]>
```

### vectorSearch

```typescript
db.model.vectorSearch(params: VectorSearchArgs): Promise<Model[]>
```

**Params:**
```typescript
{
  vector: number[],
  vectorField?: string,
  take?: number,
  distanceMetric?: 'cosine' | 'euclidean' | 'dot',
  vectorElementType?: 'float32' | 'float16' | 'uint8',
  where?: WhereInput,
  include?: IncludeInput
}
```

Returns `(Model & { distance: number })[]`. Native `VECTOR_DISTANCE` is used when
supported by the SQL Server instance; otherwise a cosine-distance fallback runs
in memory.

## Where Input

### Basic Operators

```typescript
{
  // Equality
  field: 'value',
  field: { not: 'value' },
  
  // Comparison
  field: { gt: 10 },
  field: { gte: 10 },
  field: { lt: 10 },
  field: { lte: 10 },
  
  // String
  field: { contains: 'text' },
  field: { startsWith: 'text' },
  field: { endsWith: 'text' },
  
  // List
  field: { in: ['a', 'b'] },
  field: { notIn: ['a', 'b'] }
}
```

### Logical Operators

```typescript
{
  AND: [{ field: 'value' }, { field2: 'value' }],
  OR: [{ field: 'value' }, { field2: 'value' }],
  NOT: { field: 'value' }
}
```

### Relation Filters

```typescript
{
  posts: { some: { title: 'Hello' } },
  posts: { none: {} },
  posts: { every: { published: true } }
}
```

## Include Input

```typescript
{
  // Simple include
  posts: true,
  
  // With ordering / projection
  posts: {
    select: { id: true, title: true },
    orderBy: { createdAt: 'desc' }
  },
  
  // Nested
  posts: {
    include: {
      comments: true,
      author: true
    }
  },
  
  // Count
  _count: {
    select: { posts: true }
  }
}
```

## Select Input

```typescript
{
  id: true,
  email: true,
  name: true,
  posts: {
    select: {
      id: true,
      title: true
    }
  }
}
```

## Order By Input

```typescript
// Single field
{ createdAt: 'desc' }

// Multiple fields
[
  { role: 'asc' },
  { createdAt: 'desc' }
]
```

Only scalar columns are supported in `orderBy` (relations/aggregates are not).

## Transaction

### $transaction

```typescript
await db.$transaction(async (tx) => {
  // Operations using tx instead of db
  const user = await tx.user.create({...});
  const order = await tx.order.create({...});
});
```

`$transaction` is callback-based only; interactive `$begin()` / `tx.$commit()` /
`tx.$rollback()` are not implemented.

## Raw Queries

### $queryRaw

```typescript
// Template tag
const users = await db.$queryRaw`
  SELECT * FROM users 
  WHERE email LIKE ${'%@example.com'}
`;
```

### $executeRaw

```typescript
const result = await db.$executeRaw`
  UPDATE users SET active = 0 
  WHERE last_login < ${dateThreshold}
`;
```

## Batch Payload

```typescript
{
  count: number  // Number of affected rows
}
```

## Error Handling

```typescript
import { An5ClientKnownRequestError } from '@an5/orm';

try {
  await db.user.create({
    data: { email: 'john@example.com' }
  });
} catch (error) {
  if (error instanceof An5ClientKnownRequestError) {
    console.log('Code:', error.code);
    console.log('Message:', error.message);
  }
}
```

## Known Error Codes

| Code | Description |
|------|-------------|
| P2002 | Unique constraint violation |
| P2003 | Foreign key constraint |
| P2025 | Record not found |

Other failures surface as the underlying driver error.

---

## @an5/adapters

The `@an5/adapters` package provides database and spreadsheet execution for the ORM
and can also be used standalone. The full public API is exported from the package root.

### Factory functions

| Function | Description |
|----------|-------------|
| `createAn5Adapter(config)` | Create an adapter from `An5AdapterConfig`. Detects the dialect from the config `type` or from a `connectionString` scheme (`sqlserver://`, `postgres://`, `mysql://`, `sqlite://`, `googlesheets://`) |
| `createAn5SheetsAdapter(config)` | Create a Google Sheets adapter from `An5SheetsAdapterConfig` |
| `parseSheetsConnectionString(url)` | Parse a `googlesheets://` connection string into `An5SheetsAdapterConfig` |

```typescript
import {
  createAn5Adapter,
  createAn5SheetsAdapter,
  parseSheetsConnectionString,
} from '@an5/adapters';

// Dialect auto-detection from connection string
const db = createAn5Adapter({
  connectionString: 'googlesheets://spreadsheetId;clientEmail=...;privateKey=...',
});

// Direct Sheets configuration
const sheets = createAn5SheetsAdapter({
  spreadsheetId: 'spreadsheetId',
  clientEmail: 'sa@project.iam.gserviceaccount.com',
  privateKey: '...',
  sheetMapping: { users: 'Users' },
});

// Parse a connection string
const cfg = parseSheetsConnectionString('googlesheets://spreadsheetId;apiKey=...');
```

### Adapter classes

| Class | Description |
|-------|-------------|
| `An5Adapter` | Dialect-agnostic adapter (`exec`, `executeRaw`, `table`, `$transaction`, `$connect`, `$disconnect`) |
| `An5SheetsAdapter` | Spreadsheet adapter. Adds `readRange`, `writeRange`, `appendRange`, `listSheets`, `deleteSheet` |
| `SheetsTableClient<T>` | Typed table client over a sheet (`findMany`, `findFirst`, `create`, `update`, `delete`, `clear`, `deleteAll`, …) |

### Config functions

| Function | Description |
|----------|-------------|
| `getLlmConfig()` / `setLlmConfig(config)` | Read/update the active LLM configuration |
| `getEmbeddingConfig()` / `setEmbeddingConfig(config)` | Read/update the active embedding configuration |
| `resetAdapter()` | Clear cached adapter/config state |
| `setAdapterMetadata(metadata)` | Pass schema metadata explicitly to the adapter |

### Subpaths

The package also exposes scoped entry points:

| Subpath | Contents |
|---------|----------|
| `@an5/adapters/browser` | Browser-safe bundle (Sheets via fetch + metadata helpers, no SQL engines) |
| `@an5/adapters/googlesheets` | Google Sheets adapter only |
| `@an5/adapters/config` | `LlmConfigData` / `EmbeddingConfigData` types and helpers |
| `@an5/adapters/mssql` | SQL Server engine |
| `@an5/adapters/postgres` | PostgreSQL engine |
| `@an5/adapters/mysql` | MySQL engine |
| `@an5/adapters/sqlite` | SQLite engine |
| `@an5/adapters/base` | Base types and metadata helpers |

### Sheets config (`An5SheetsAdapterConfig`)

| Field | Type | Description |
|-------|------|-------------|
| `spreadsheetId` | `string` | Google Sheets spreadsheet id |
| `clientEmail?` | `string` | OAuth service-account email (use with `privateKey`) |
| `privateKey?` | `string` | Service-account private key |
| `credentials?` | `object` | Alternative: full service-account JSON credentials |
| `accessToken?` | `string` | OAuth access token (browser mode) |
| `apiKey?` | `string` | Google API key (browser mode) |
| `sheetMapping?` | `Record<string, string>` | Model → sheet name mapping (defaults to model name) |

---

## An5Agent Class

### Constructor

```typescript
import { An5Agent } from '@an5/agent';

const agent = new An5Agent(tools?: Tool[]);
```

Registers the 7 default tools unless overridden; custom tools can be appended.

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `process(context)` | `Promise<AgentResponse>` | Process `AgentContext` (`{ userQuestion, database?, toolContext? }`) |
| `executeTool(name, input, context?)` | `Promise<unknown>` | Execute a specific tool |
| `getTools()` | `Tool[]` | Get all registered tools |
| `getTool(name)` | `Tool \| undefined` | Get tool by name |
| `addTool(tool)` | `void` | Register a new tool |

### Tools (7 consolidated)

| Tool | Actions | Description |
|------|---------|-------------|
| `schema` | list, describe, relations | Explore data models |
| `query` | generate, explain, validate | Work with SQL queries |
| `database` | execute, describe, health | Database operations |
| `generateClientCode` | - | Generate client code |
| `analyzeSchema` | - | Analyze schema issues |
| `retrieve` | schema, queries | Semantic search |
| `task` | create, list, update, delete | Manage tasks |

For detailed tool documentation, see [AI Agent Tools]({{ '/guides/agent-tools/' | relative_url }}).

---

## CLI Commands

Schema/database commands run as npm scripts from the `an5Orm/` repository directory (no standalone `an5` CLI binary is shipped).

### Schema Management

| Command | Description |
|---------|-------------|
| `npm run generate` | Generate client code from schema |
| `npm run db:push` | Push schema to database |
| `npm run db:pull` | Pull schema from database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:migrate diff` | Compare schema with database |

### Development

The following are workspace-root scripts (run from the repository root, not from `an5Orm/`):

| Command | Where | Description |
|---------|-------|-------------|
| `npm run build` | workspace root | Build all workspace packages |
| `npm test` | `an5Orm/` or workspace root | Run tests (an5Orm) or the full workspace suite |
| `npm run ui` | workspace root | Start local UI |

### Release

| Command | Description |
|---------|-------------|
| `npm run dryrun` | Preview release changes |
| `npm run release` | Release across the workspace |

For more CLI commands, see [CLI Commands]({{ '/guides/cli/' | relative_url }}).
