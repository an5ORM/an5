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

const db = new An5ORM(options?: An5ORMOptions);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `connectionString` | `string` | - | Database connection string |
| `pool` | `PoolOptions` | `{ min: 5, max: 20 }` | Connection pool settings |
| `logging` | `boolean \| LogOptions` | `false` | Enable query logging |
| `queryTimeout` | `number` | `30000` | Query timeout in ms |
| `schemaPath` | `string` | `./an5Schema` | Schema files location |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `$connect()` | `Promise<void>` | Establish connection |
| `$disconnect()` | `Promise<void>` | Close connection |
| `$transaction(fn)` | `Promise<T>` | Execute transaction |
| `$queryRaw` | `TemplateTag` | Raw SQL query |
| `$executeRaw` | `TemplateTag` | Raw SQL execute |
| `$begin()` | `Promise<Transaction>` | Begin interactive transaction |

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
  take?: number,
  cursor?: CursorInput
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
  field: string,
  threshold?: number,
  distanceMetric?: 'cosine' | 'euclidean' | 'dotproduct',
  where?: WhereInput,
  include?: IncludeInput,
  select?: SelectInput,
  take?: number
}
```

## Where Input

### Basic Operators

```typescript
{
  // Equality
  field: 'value',
  field: { equals: 'value' },
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
  
  // With filtering
  posts: {
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 5
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

// Relation field
{ posts: { _count: 'desc' } }
```

## Transaction

### $transaction

```typescript
await db.$transaction(async (tx) => {
  // Operations using tx instead of db
  const user = await tx.user.create({...});
  const order = await tx.order.create({...});
});
```

### $begin (Interactive)

```typescript
const tx = await db.$begin();

try {
  const user = await tx.user.create({...});
  await tx.$commit();
} catch (error) {
  await tx.$rollback();
  throw error;
}
```

## Raw Queries

### $queryRaw

```typescript
// Template tag
const users = await db.$queryRaw`
  SELECT * FROM users 
  WHERE email LIKE ${'%@example.com'}
`;

// Typed
const users = await db.$queryRaw<User[]`
  SELECT * FROM users
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
import { An5ORMError } from '@an5/orm';

try {
  await db.user.create({
    data: { email: 'john@example.com' }
  });
} catch (error) {
  if (error instanceof An5ORMError) {
    console.log('Code:', error.code);
    console.log('Message:', error.message);
  }
}
```

## Common Error Codes

| Code | Description |
|------|-------------|
| P2000 | Bad request |
| P2001 | Record not found |
| P2002 | Unique constraint violation |
| P2003 | Foreign key constraint |
| P2004 | Database error |
| P2005 | Connection error |
| P2006 | Transaction error |
| P2007 | Timeout error |

---

## An5Agent Class

### Constructor

```typescript
import { An5Agent } from 'an5-agent';

const agent = new An5Agent(options?: An5AgentOptions);
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `workspaceDir` | `string` | `process.cwd()` | Workspace root directory |
| `llmProvider` | `'openai' \| 'gemini' \| 'custom'` | `'openai'` | LLM provider |
| `llmModel` | `string` | `'gpt-4o-mini'` | LLM model name |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `process(query)` | `Promise<AgentResult>` | Process natural language query |
| `executeTool(name, params)` | `Promise<any>` | Execute a specific tool |
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

### Schema Management

| Command | Description |
|---------|-------------|
| `npx an5 generate` | Generate client code from schema |
| `npx an5 db:push` | Push schema to database |
| `npx an5 db:pull` | Pull schema from database |
| `npx an5 db:seed` | Seed database with sample data |
| `npx an5 db:migrate diff` | Compare schema with database |

### Development

| Command | Description |
|---------|-------------|
| `npm run build` | Build all packages |
| `npm test` | Run all tests |
| `npm run ui` | Start local UI |

### Release

| Command | Description |
|---------|-------------|
| `npm run status` | Check status across all submodules |
| `npm run dryrun` | Preview release changes |
| `npm run release:all` | Release all submodules |

For more CLI commands, see [CLI Commands]({{ '/guides/cli/' | relative_url }}).
