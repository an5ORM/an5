---
layout: page
title: Advanced Queries
description: Complex query patterns with filtering, sorting, and aggregation
---

# Advanced Queries

`@an5/adapters` provides powerful query capabilities for complex data retrieval across SQL dialects (MSSQL, PostgreSQL, MySQL, SQLite) and Google Sheets.

## Setup

```typescript
import { createAn5Adapter } from '@an5/adapters';

const db = createAn5Adapter({
  connectionString: process.env.DATABASE_URL!,
});
```

## Filtering

### Comparison Operators

```typescript
const users = await db.user.findMany({
  where: {
    // Equal
    status: 'active',
    
    // Not equal
    status: { not: 'banned' },
    
    // Comparison
    age: { gte: 18 },
    score: { gt: 100 },
    views: { lt: 1000 },
    orderCount: { lte: 10 }
  }
});
```

### String Operators

```typescript
const users = await db.user.findMany({
  where: {
    // Contains
    email: { contains: '@example.com' },
    
    // Starts with
    name: { startsWith: 'John' },
    
    // Ends with
    name: { endsWith: 'son' },
    
    // In list
    role: { in: ['admin', 'moderator'] },
    
    // Not in list
    role: { notIn: ['banned', 'suspended'] }
  }
});
```

### Logical Operators

```typescript
const users = await db.user.findMany({
  where: {
    OR: [
      { role: 'admin' },
      { role: 'moderator' }
    ],
    AND: [
      { isActive: true },
      { createdAt: { gte: lastMonth } }
    ],
    NOT: {
      status: 'banned'
    }
  }
});
```

## Sorting

```typescript
const users = await db.user.findMany({
  orderBy: [
    { role: 'asc' },
    { createdAt: 'desc' }
  ]
});
```

## Pagination

### Offset-based

```typescript
const users = await db.user.findMany({
  skip: 20,  // Skip first 20
  take: 10   // Take next 10
});
```

When `skip` is used, dialect-aware pagination is automatically generated (`LIMIT/OFFSET` for PostgreSQL/MySQL/SQLite, `OFFSET/FETCH` for MSSQL).

## Aggregations

### Basic Aggregations

```typescript
const stats = await db.order.aggregate({
  _count: true,
  _sum: { total: true },
  _avg: { total: true },
  _min: { total: true },
  _max: { total: true }
});

console.log({
  count: stats._count._all,
  total: stats._sum.total,
  average: stats._avg.total,
  min: stats._min.total,
  max: stats._max.total
});
```

### Group By

```typescript
const ordersByUser = await db.order.groupBy({
  by: ['status'],
  where: { total: { gte: 10 } },
  orderBy: { status: 'asc' },
  skip: 0,
  take: 10,
  _count: true,
  _sum: { total: true }
});
```

## Nested Relation Pagination

Inside `include`, `skip` and `take` paginate the related rows **per parent row**:

```typescript
const users = await db.user.findMany({
  include: {
    posts: {
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 5,    // first 5 posts for each user
    }
  }
});
```

## Select Specific Fields

```typescript
const users = await db.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    _count: true,
  }
});
```

## Complex Query Example

```typescript
// Find active users with published posts, ordered by join date
const users = await db.user.findMany({
  where: {
    isActive: true,
  },
  include: {
    posts: {
      select: {
        id: true,
        title: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    },
    _count: true
  },
  orderBy: { createdAt: 'desc' },
  take: 10
});
```

## Raw SQL Queries

For queries where you need direct SQL execution:

```typescript
const users = await db.$queryRawUnsafe(
  `SELECT u.*, COUNT(p.id) as post_count
   FROM users u
   LEFT JOIN posts p ON u.id = p.author_id
   WHERE u.is_active = @p_0
   GROUP BY u.id
   HAVING COUNT(p.id) > @p_1
   ORDER BY post_count DESC`,
  1,
  5
);
```

## Next Steps

- [Relations]({{ '/guides/relations/' | relative_url }}) - Model relationships & nested writes
- [Deployment]({{ '/guides/deployment/' | relative_url }}) - Production configuration
