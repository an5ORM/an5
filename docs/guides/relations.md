---
layout: page
title: Relations
description: Define and query relationships between models
---

# Relations

an5 ORM supports relations between models using foreign keys.

## Defining Relations

### One-to-Many

```an5
model User {
  id    NVARCHAR(1000) @id @default(uuid())
  email NVARCHAR(255)  @unique
  
  posts Post[]         // One user has many posts
}

model Post {
  id       NVARCHAR(1000) @id @default(uuid())
  title    NVARCHAR(255)
  authorId NVARCHAR(1000)
  
  author   User @relation(fields: [authorId], references: [id])
}
```

### One-to-One

```an5
model User {
  id      NVARCHAR(1000) @id @default(uuid())
  email   NVARCHAR(255)  @unique
  profile Profile?
}

model Profile {
  id     NVARCHAR(1000) @id @default(uuid())
  bio    TEXT
  userId NVARCHAR(1000) @unique
  
  user   User @relation(fields: [userId], references: [id])
}
```

### Many-to-Many

```an5
model Post {
  id    NVARCHAR(1000) @id @default(uuid())
  title NVARCHAR(255)
  
  tags  Tag[]
}

model Tag {
  id   NVARCHAR(1000) @id @default(uuid())
  name NVARCHAR(100)  @unique
  
  posts Post[]
}
```

## Querying Relations

### Include Relations

```typescript
// Include all posts
const user = await db.user.findUnique({
  where: { id: 'user-id' },
  include: { posts: true }
});

// Include with filtering
const user = await db.user.findUnique({
  where: { id: 'user-id' },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }
  }
});
```

### Nested Relations

```typescript
const users = await db.user.findMany({
  include: {
    posts: {
      include: {
        tags: true
      }
    },
    profile: true
  }
});
```

### Relation Filters

```typescript
// Find users with at least one published post
const users = await db.user.findMany({
  where: {
    posts: {
      some: { published: true }
    }
  }
});

// Find users with no posts
const users = await db.user.findMany({
  where: {
    posts: {
      none: true
    }
  }
});

// Find users where all posts are published
const users = await db.user.findMany({
  where: {
    posts: {
      every: { published: true }
    }
  }
});
```

## Creating with Relations

### Nested Create

```typescript
const user = await db.user.create({
  data: {
    email: 'john@example.com',
    name: 'John',
    posts: {
      create: [
        { title: 'Post 1', content: 'Content 1' },
        { title: 'Post 2', content: 'Content 2' }
      ]
    },
    profile: {
      create: { bio: 'Hello!' }
    }
  }
});
```

### Connect Existing Records

```typescript
const post = await db.post.create({
  data: {
    title: 'New Post',
    author: {
      connect: { id: 'user-id' }
    },
    tags: {
      connect: [
        { id: 'tag-id-1' },
        { id: 'tag-id-2' }
      ]
    }
  }
});
```

### Disconnect Relations

```typescript
// Disconnect a single relation
await db.user.update({
  where: { id: 'user-id' },
  data: {
    profile: {
      disconnect: true
    }
  }
});

// Disconnect multiple relations
await db.post.update({
  where: { id: 'post-id' },
  data: {
    tags: {
      disconnect: [
        { id: 'tag-id-1' },
        { id: 'tag-id-2' }
      ]
    }
  }
});
```

## Cascade Operations

Define cascade behavior in your schema:

```an5
model User {
  id    NVARCHAR(1000) @id @default(uuid())
  posts Post[]         @cascade
  
  @@map("users")
}

model Post {
  id       NVARCHAR(1000) @id @default(uuid())
  authorId NVARCHAR(1000)
  author   User           @relation(fields: [authorId], references: [id])
  
  @@map("posts")
}
```

## Select Specific Fields

```typescript
const user = await db.user.findUnique({
  where: { id: 'user-id' },
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        id: true,
        title: true
      }
    }
  }
});
```

## Next Steps

- [Advanced Queries]({{ '/guides/queries/' | relative_url }}) - Complex query patterns
- [Transactions]({{ '/guides/transactions/' | relative_url }}) - Atomic operations
