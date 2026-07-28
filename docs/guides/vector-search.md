---
layout: page
title: Vector Search
description: AI-powered semantic search with SQL Server
---

# Vector Search

an5 ORM includes built-in vector search capabilities for AI and machine learning applications.

## Overview

Vector search allows you to find similar items based on semantic meaning rather than exact matches. This is useful for:

- Semantic search in documentation
- Recommendation systems
- Image similarity search
- Natural language queries

## Setup

### 1. Enable Vector Search

Ensure your SQL Server instance supports vector operations (SQL Server 2022+).

### 2. Create Vector Fields

```an5
model Document {
  id        NVARCHAR(1000)  @id @default(uuid())
  title     NVARCHAR(255)
  content   TEXT
  embedding VARBINARY(8000) @description("Vector embedding for semantic search")
  
  @@map("documents")
}
```

### 3. Generate Embeddings

```typescript
import { generateEmbedding } from 'an5-agent';

// Generate embedding for a document
const embedding = await generateEmbedding(document.content);

// Store with the document
await db.document.create({
  data: {
    title: document.title,
    content: document.content,
    embedding: Buffer.from(new Float32Array(embedding).buffer)
  }
});
```

## Basic Vector Search

```typescript
// Search for similar documents
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  field: 'embedding',
  take: 10,
  distanceMetric: 'cosine'
});

console.log(results);
// [{ id: "...", title: "...", content: "...", _distance: 0.85 }, ...]
```

## Advanced Vector Search

### With Filters

```typescript
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  field: 'embedding',
  where: {
    category: 'technical',
    published: true
  },
  select: {
    id: true,
    title: true,
    excerpt: true
  },
  take: 5,
  distanceMetric: 'cosine'
});
```

### With Relations

```typescript
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  field: 'embedding',
  include: {
    author: {
      select: { name: true }
    },
    tags: true
  },
  take: 10
});
```

### Threshold Filtering

```typescript
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  field: 'embedding',
  threshold: 0.7,  // Only return results with similarity > 0.7
  take: 10
});
```

## Distance Metrics

| Metric | Description | Use Case |
|--------|-------------|----------|
| `cosine` | Cosine similarity | General purpose, recommended |
| `euclidean` | Euclidean distance | When magnitude matters |
| `dotproduct` | Dot product | When vectors are normalized |

## Hybrid Search

Combine vector search with traditional filters:

```typescript
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  field: 'embedding',
  where: {
    AND: [
      { category: { in: ['tech', 'science'] } },
      { createdAt: { gte: lastMonth } },
      { views: { gte: 100 } }
    ]
  },
  orderBy: [
    { _distance: 'desc' },  // Prioritize similarity
    { views: 'desc' }       // Then by popularity
  ],
  take: 20
});
```

## In-Memory Fallback

For development or when SQL Server vector support is unavailable:

```typescript
import { InMemoryVectorStore } from 'an5-orm';

const store = new InMemoryVectorStore();

// Add vectors
await store.add({
  id: 'doc-1',
  vector: [0.1, 0.2, 0.3],
  metadata: { title: 'Document 1' }
});

// Search
const results = await store.search({
  vector: [0.1, 0.2, 0.3],
  topK: 5,
  threshold: 0.5
});
```

## Use Case: RAG Pipeline

```typescript
import { generateEmbedding, generateText } from 'an5-agent';

async function ragQuery(question: string) {
  // 1. Generate query embedding
  const queryEmbedding = await generateEmbedding(question);
  
  // 2. Retrieve relevant documents
  const relevantDocs = await db.document.vectorSearch({
    vector: queryEmbedding,
    field: 'embedding',
    take: 5,
    threshold: 0.7
  });
  
  // 3. Build context
  const context = relevantDocs
    .map(doc => `Title: ${doc.title}\nContent: ${doc.content}`)
    .join('\n\n');
  
  // 4. Generate answer
  const answer = await generateText({
    prompt: `Based on the following context, answer the question: ${question}\n\nContext:\n${context}`
  });
  
  return {
    answer,
    sources: relevantDocs
  };
}
```

## Performance Tips

1. **Index your vector columns** for faster similarity search
2. **Limit results** with `take` to reduce computation
3. **Use thresholds** to filter low-quality matches
4. **Cache embeddings** to avoid regenerating them

## Next Steps

- [AI Agent]({{ '/guides/ai-agent/' | relative_url }}) - Natural language database queries
- [Raw Queries]({{ '/guides/raw-queries/' | relative_url }}) - Execute raw SQL
