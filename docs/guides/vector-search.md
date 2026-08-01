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

Requires **SQL Server 2025** for native `VECTOR_DISTANCE`. On earlier instances the
ORM automatically falls back to an in-memory cosine-distance search.

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

Embeddings are generated with your own embedding provider (e.g. OpenAI), typically
configured through the `EmbeddingConfig` model:

```typescript
// Generate embedding with your provider, e.g. OpenAI text-embedding-3-small
const embedding: number[] = await myEmbeddingProvider.embed(document.content);

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
  vectorField: 'embedding',
  take: 10,
  distanceMetric: 'cosine'
});

console.log(results);
// [{ id: "...", title: "...", content: "...", distance: 0.85 }, ...]
```

## Advanced Vector Search

### With Filters

```typescript
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  vectorField: 'embedding',
  where: {
    category: 'technical',
    published: true
  },
  take: 5,
  distanceMetric: 'cosine'
});
```

### With Relations

```typescript
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  vectorField: 'embedding',
  include: {
    author: {
      select: { name: true }
    },
    tags: true
  },
  take: 10
});
```

## Distance Metrics

| Metric | Description | Use Case |
|--------|-------------|----------|
| `cosine` | Cosine distance | General purpose, recommended |
| `euclidean` | Euclidean distance | When magnitude matters |
| `dot` | Dot product | When vectors are normalized |

## Hybrid Search

Combine vector search with traditional filters:

```typescript
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  vectorField: 'embedding',
  where: {
    AND: [
      { category: { in: ['tech', 'science'] } },
      { createdAt: { gte: lastMonth } },
      { views: { gte: 100 } }
    ]
  },
  take: 20
});
```

Results are always returned ordered by `distance` ascending (closest first).

## In-Memory Fallback

For development or when SQL Server vector support is unavailable, `vectorSearch`
automatically falls back to an in-memory cosine-distance search. No separate store
class is needed — pass the same arguments and the ORM handles the fallback:

```typescript
const results = await db.document.vectorSearch({
  vector: queryEmbedding,
  take: 5
});
```

## Use Case: RAG Pipeline

```typescript
// 1. Generate the query embedding with your own provider
const queryEmbedding = await myEmbeddingProvider.embed(question);

// 2. Retrieve relevant documents
const relevantDocs = await db.document.vectorSearch({
  vector: queryEmbedding,
  take: 5
});

// 3. Build context and answer with your LLM of choice
const context = relevantDocs
  .map(doc => `Title: ${doc.title}\nContent: ${doc.content}`)
  .join('\n\n');

const answer = await myLlmProvider.complete({
  prompt: `Based on the following context, answer the question: ${question}\n\nContext:\n${context}`
});

return {
  answer,
  sources: relevantDocs
};
```

## Performance Tips

1. **Index your vector columns** for faster similarity search
2. **Limit results** with `take` to reduce computation
3. **Filter early** with `where` to narrow candidates
4. **Cache embeddings** to avoid regenerating them

## Next Steps

- [AI Agent]({{ '/guides/agent-tools/' | relative_url }}) - Natural language database queries
- [Raw Queries]({{ '/guides/queries/' | relative_url }}) - Execute raw SQL
