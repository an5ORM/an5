---
layout: page
title: Advanced Queries
description: Complex query patterns with filtering, sorting, and aggregation
---

# Advanced Queries

an5 ORM provides powerful query capabilities for complex data retrieval.

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

When `skip` is used, an `ORDER BY (SELECT NULL)` + `OFFSET/FETCH` pagination is
generated (SQL Server requires an `ORDER BY` for `OFFSET`).

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
  count: stats._count,
  total: stats._sum.total,
  average: stats._avg.total,
  min: stats._min.total,
  max: stats._max.total
});
```

### Group By

```typescript
const ordersByUser = await db.order.groupBy({
  by: ['userId'],
  where: { total: { gte: 10 } },
  having: {
    _count: { _all: { gt: 1 } },
    _sum: { total: { gte: 100 } }
  },
  orderBy: { userId: 'asc' },
  skip: 0,
  take: 10,
  _count: true,
  _sum: { total: true }
});
```

`groupBy` supports `by`, `where`, `orderBy`, `skip`, `take`, `_count`, `_sum`,
`_avg`, `_min`, `_max`, and aggregate `having` filters.

## Select Specific Fields

```typescript
const users = await db.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    _count: {
      select: { posts: true }
    }
  }
});
```

## Complex Query Example

```typescript
// Find active users with published posts, ordered by join date
const users = await db.user.findMany({
  where: {
    isActive: true,
    posts: {
      some: { published: true }
    }
  },
  include: {
    posts: {
      where: { published: true },
      select: {
        id: true,
        title: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    },
    _count: {
      select: { posts: true }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 10
});
```

## Raw SQL Queries

For complex queries that are hard to express with the ORM:

```typescript
// Raw query (results are untyped)
const users = await db.$queryRaw`
  SELECT u.*, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON u.id = p.author_id
  WHERE u.is_active = 1
  GROUP BY u.id
  HAVING COUNT(p.id) > 5
  ORDER BY post_count DESC
`;
```

## Next Steps

- [Transactions]({{ '/guides/transactions/' | relative_url }}) - Atomic operations
- [Vector Search]({{ '/guides/vector-search/' | relative_url }}) - AI-powered search
