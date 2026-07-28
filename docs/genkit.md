# Genkit Integration Guide

This workspace uses [Google Genkit](https://genkit.dev) for AI-powered features across multiple modules.

## Architecture

```
an5Agent (Genkit v1.39)
├── RAG Pipeline
│   ├── embedder.ts        — Custom embedding (OpenAI/Cohere/dummy fallback)
│   ├── indexer.ts         — Schema + query sample indexing
│   └── index.ts           — Genkit singleton with vector store
├── Tools (13 total)
│   ├── schema-tools.ts    — listModels, describeModel, getRelations
│   ├── query-tools.ts     — generateQuery, explainQuery, validateQuery
│   ├── database-tools.ts  — executeQuery, describeTable, healthCheck
│   ├── codegen-tools.ts   — generateClientCode, analyzeSchema
│   └── rag-tools.ts       — retrieveSchema, retrieveQuerySamples
└── RAG Data
    ├── __db_an5-schema.json   — Schema vector index
    └── __db_mssql-queries.json  — Query sample vector index

an5Tasks (Genkit v1.39)
├── Flows
│   ├── parseReviewToTasksFlow    — Regex-based task extraction
│   └── aiParseReviewToTasksFlow  — LLM-powered task extraction
└── Tools
    ├── createTaskTool   — Create tasks from review issues
    ├── listTasksTool    — List/filter tasks
    └── updateTaskTool   — Update task status/priority
```

## Setup

### Environment Variables

```bash
# LLM Provider (for aiParseReviewToTasksFlow)
LLM_PROVIDER=openai          # openai | gemini | custom
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4o-mini
LLM_ENDPOINT=                # Optional: custom endpoint

# Embedding (for RAG pipeline)
EMBEDDING_ENDPOINT=          # OpenAI/Cohere embedding endpoint
EMBEDDING_API_KEY=           # API key for embedding
EMBEDDING_MODEL=text-embedding-3-small  # Default model
```

### Initialize RAG Index

```bash
cd an5Agent
npm run rag:index
```

This indexes `.mssql` schema files and `query-samples.json` into the local vector store.

## Usage

### an5Agent — RAG Retrieval

```typescript
import { retrieveSchema, retrieveQuerySamples } from 'an5-agent';

// Retrieve schema context for a user question
const schemaContext = await retrieveSchema('How do I find users with their orders?');

// Retrieve similar query samples
const querySamples = await retrieveQuerySamples('aggregate functions');
```

### an5Tasks — Task Extraction

```typescript
import { createTasksFromReview } from 'an5-tasks';

// Regex-based (fast, no LLM)
const tasks = await createTasksFromReview(reviewText, workspaceDir);

// AI-powered (smarter extraction)
const tasks = await createTasksFromReview(reviewText, workspaceDir, true);
```

### an5Tasks — Task Management

```typescript
import { getTasks, updateTask } from 'an5-tasks';

// List all todo tasks
const todoTasks = await getTasks(workspaceDir, { status: 'todo' });

// Mark task as done
await updateTask(workspaceDir, 'TASK-1234', { status: 'done' });
```

## Genkit Features Used

| Feature | Module | Purpose |
|---------|--------|---------|
| `genkit()` | an5Agent, an5Tasks | Initialize Genkit instance |
| `defineFlow()` | an5Tasks | Define typed task extraction flows |
| `defineTool()` | an5Tasks | Register task management tools |
| `runFlow()` | an5Tasks | Execute flows with type safety |
| `generate()` | an5Tasks | LLM-powered task extraction |
| `embedder()` | an5Agent | Custom embedding with fallback |
| `devLocalVectorstore` | an5Agent | Local filesystem vector store |
| `Document.fromText()` | an5Agent | Create indexed documents |
| `ai.index()` | an5Agent | Index documents to vector store |
| `ai.retrieve()` | an5Agent | Semantic retrieval from vector store |

## Genkit Features Available (Not Yet Used)

| Feature | Module | Potential Use |
|---------|--------|---------------|
| `definePrompt()` | an5Agent | Reusable prompt templates for code review |
| `@genkit-ai/firebase` | an5Agent | Production vector store (Firestore) |
| `@genkit-ai/google-cloud` | an5Agent | GCP telemetry, tracing, logging |
| Model plugins | an5Cli | Replace raw HTTP LLM calls |
| Session/memory | an5Agent | Multi-turn conversations |
| Streaming | an5Cli | Real-time LLM output in Web UI |
| Eval framework | an5Agent | Measure RAG quality |
| Reranking | an5Agent | Improve retrieval quality |

## Cross-Repo Integration

```
an5Cli (LLM calls)
  └── uses Genkit generate() for:
      ├── Commit message generation
      ├── Changelog generation
      ├── Code review
      └── Documentation generation

an5Agent (RAG + Tools)
  └── uses Genkit for:
      ├── Schema/query indexing
      ├── Semantic retrieval
      └── Tool execution

an5Tasks (Task Management)
  └── uses Genkit for:
      ├── Task extraction flows
      └── Task management tools
```

## Vector Store

The local vector store persists to `.genkit/vectorstore/` in each module. Index data is also saved as `__db_*.json` files for portability.

### Re-indexing

After schema changes, re-run:
```bash
npm run rag:index -w an5Agent
```

### Production Vector Store

For production, replace `devLocalVectorstore` with:
- `@genkit-ai/firebase` (Firestore)
- Pinecone plugin
- Weaviate plugin
