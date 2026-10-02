---
layout: page
permalink: /architecture/
title: Architecture
description: How the an5 packages fit together, from schema parsing to runtime adapters
---

## Overview

Multi-repository monorepo providing a SQL Server schema-driven development platform with multi-language code generation, provider-based runtime adapters, and AI-powered agent assistance.

<div class="arch-diagram-card">
<svg viewBox="0 0 980 270" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrow-indigo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#818cf8"/>
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#c084fc"/>
    </marker>
    <marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#fb923c"/>
    </marker>
    <linearGradient id="grad-cyan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="grad-orange" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ea580c" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ea580c" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="grad-indigo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="grad-purple" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9333ea" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#9333ea" stop-opacity="0.08"/>
    </linearGradient>
  </defs>

  <!-- Connectors -->
  <path d="M 95 84 L 95 162" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-cyan)"/>
  <path d="M 565 84 L 565 162" stroke="#fb923c" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrow-orange)"/>
  <path d="M 170 204 L 222 204" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-cyan)"/>
  <path d="M 390 204 L 482 204" stroke="#818cf8" stroke-width="2" marker-end="url(#arrow-indigo)"/>
  <g transform="translate(398, 178)">
    <rect width="84" height="20" rx="10" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.2"/>
    <text x="42" y="14" font-family="&apos;Inter&apos;, sans-serif" font-size="10" font-weight="500" fill="#c7d2fe" text-anchor="middle">optional metadata</text>
  </g>
  <path d="M 845 204 L 818 204" stroke="#c084fc" stroke-width="2" marker-end="url(#arrow-purple)"/>
  <path d="M 680 204 L 648 204" stroke="#c084fc" stroke-width="2" marker-end="url(#arrow-purple)"/>

  <!-- Top Row Nodes -->
  <g class="arch-node">
    <rect x="20" y="20" width="150" height="64" rx="10" fill="url(#grad-cyan)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="95" y="46" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="14" font-weight="600" fill="#38bdf8" text-anchor="middle">an5Schema/</text>
    <text x="95" y="66" font-family="&apos;Inter&apos;, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(schema src)</text>
  </g>

  <g class="arch-node">
    <rect x="230" y="20" width="160" height="64" rx="10" fill="url(#grad-orange)" stroke="#fb923c" stroke-width="1.5"/>
    <text x="310" y="46" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="14" font-weight="600" fill="#fb923c" text-anchor="middle">an5OrmVScode/</text>
    <text x="310" y="66" font-family="&apos;Inter&apos;, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(editor tooling)</text>
  </g>

  <g class="arch-node">
    <rect x="490" y="20" width="150" height="64" rx="10" fill="url(#grad-orange)" stroke="#fb923c" stroke-width="1.5"/>
    <text x="565" y="46" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="14" font-weight="600" fill="#fb923c" text-anchor="middle">an5Cli/</text>
    <text x="565" y="66" font-family="&apos;Inter&apos;, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(automation)</text>
  </g>

  <!-- Bottom Row Nodes -->
  <g class="arch-node">
    <rect x="20" y="170" width="150" height="68" rx="10" fill="url(#grad-cyan)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="95" y="198" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="14" font-weight="600" fill="#38bdf8" text-anchor="middle">an5Orm/</text>
    <text x="95" y="220" font-family="&apos;Inter&apos;, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(generator)</text>
  </g>

  <g class="arch-node">
    <rect x="230" y="170" width="160" height="68" rx="10" fill="url(#grad-indigo)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="310" y="198" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="14" font-weight="600" fill="#818cf8" text-anchor="middle">an5Client/</text>
    <text x="310" y="220" font-family="&apos;Inter&apos;, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(generated)</text>
  </g>

  <g class="arch-node">
    <rect x="490" y="170" width="150" height="68" rx="10" fill="url(#grad-indigo)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="565" y="198" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="14" font-weight="600" fill="#818cf8" text-anchor="middle">an5Adapters/</text>
    <text x="565" y="220" font-family="&apos;Inter&apos;, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(runtimes)</text>
  </g>

  <g class="arch-node">
    <rect x="680" y="170" width="130" height="68" rx="10" fill="url(#grad-purple)" stroke="#c084fc" stroke-width="1.5"/>
    <text x="745" y="198" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="14" font-weight="600" fill="#c084fc" text-anchor="middle">an5Agent/</text>
    <text x="745" y="220" font-family="&apos;Inter&apos;, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(AI tools)</text>
  </g>

  <g class="arch-node">
    <rect x="845" y="170" width="125" height="68" rx="10" fill="url(#grad-purple)" stroke="#c084fc" stroke-width="1.5"/>
    <text x="907" y="198" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="14" font-weight="600" fill="#c084fc" text-anchor="middle">an5Tasks/</text>
    <text x="907" y="220" font-family="&apos;Inter&apos;, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">(Genkit flows)</text>
  </g>
</svg>
</div>

## Repository Roles

| Repo | Role | Key Capabilities |
|------|------|------------------|
| **an5Orm** | Schema, Generator & Migrations | Schema parser, multi-language code generator, database introspection (`pull.ts`), schema push (`push.ts`), migrations (`migrate.ts`), and seeder runner |
| **an5Client** | Generated artifacts | TypeScript model interfaces + metadata, Python dataclasses + metadata, .NET entity classes, Go structs/client |

## Data Flow

<div class="arch-diagram-card">
<svg viewBox="0 0 920 226" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="df-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="df-arrow-indigo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#818cf8"/>
    </marker>
    <marker id="df-arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#c084fc"/>
    </marker>
    <marker id="df-arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#fb923c"/>
    </marker>
    <linearGradient id="df-grad-cyan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="df-grad-indigo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="df-grad-purple" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9333ea" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#9333ea" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="df-grad-orange" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ea580c" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ea580c" stop-opacity="0.08"/>
    </linearGradient>
  </defs>

  <!-- Connectors -->
  <path d="M 215 46 L 262 46" stroke="#38bdf8" stroke-width="2" marker-end="url(#df-arrow)"/>
  <path d="M 475 46 L 522 46" stroke="#38bdf8" stroke-width="2" marker-end="url(#df-arrow)"/>
  <path d="M 685 72 L 685 98" stroke="#818cf8" stroke-width="2" marker-end="url(#df-arrow-indigo)"/>
  <path d="M 685 152 L 685 168" stroke="#c084fc" stroke-width="2" marker-end="url(#df-arrow-purple)"/>
  <path d="M 530 196 L 438 196" stroke="#fb923c" stroke-width="2" marker-end="url(#df-arrow-orange)"/>

  <!-- Step 1: Developer writes .an5 -->
  <g class="arch-node">
    <rect x="20" y="20" width="195" height="52" rx="10" fill="url(#df-grad-cyan)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="117" y="44" font-family="&apos;Inter&apos;, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0" text-anchor="middle">Developer writes <tspan fill="#38bdf8" font-family="&apos;JetBrains Mono&apos;, monospace">.an5</tspan></text>
    <text x="117" y="60" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Schema Definitions</text>
  </g>

  <!-- Step 2: an5Orm/generator -->
  <g class="arch-node">
    <rect x="270" y="20" width="205" height="52" rx="10" fill="url(#df-grad-cyan)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="372" y="44" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="13" font-weight="600" fill="#38bdf8" text-anchor="middle">an5Orm/generator</text>
    <text x="372" y="60" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">Multi-language code generator</text>
  </g>

  <!-- Step 3: an5Client -->
  <g class="arch-node">
    <rect x="530" y="20" width="310" height="52" rx="10" fill="url(#df-grad-indigo)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="685" y="44" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="13" font-weight="600" fill="#818cf8" text-anchor="middle">an5Client/</text>
    <text x="685" y="60" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">TS / Python / .NET (C#) / Go models + metadata</text>
  </g>

  <!-- Step 4: an5Adapters -->
  <g class="arch-node">
    <rect x="530" y="104" width="310" height="48" rx="10" fill="url(#df-grad-indigo)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="685" y="126" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="13" font-weight="600" fill="#818cf8" text-anchor="middle">an5Adapters/</text>
    <text x="685" y="142" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#a5b4fc" text-anchor="middle">(optional metadata injection) — DB runtimes</text>
  </g>

  <!-- Step 5: an5Agent -->
  <g class="arch-node">
    <rect x="530" y="174" width="310" height="44" rx="10" fill="url(#df-grad-purple)" stroke="#c084fc" stroke-width="1.5"/>
    <text x="685" y="194" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="13" font-weight="600" fill="#c084fc" text-anchor="middle">an5Agent/</text>
    <text x="685" y="208" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#e9d5ff" text-anchor="middle">7 consolidated schema-driven tools</text>
  </g>

  <!-- Step 6: an5Cli -->
  <g class="arch-node">
    <rect x="180" y="174" width="250" height="44" rx="10" fill="url(#df-grad-orange)" stroke="#fb923c" stroke-width="1.5"/>
    <text x="305" y="194" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="13" font-weight="600" fill="#fb923c" text-anchor="middle">an5Cli/</text>
    <text x="305" y="208" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#fed7aa" text-anchor="middle">Workspace automation &amp; orchestration</text>
  </g>
</svg>
</div>

## Cross-Repo Connections

| Source | Target | Mechanism |
|--------|--------|-----------|
| `an5Agent` | `an5Adapters` | Dynamic `require()` via relative path |
| `an5Agent` | `an5Tasks` | Dynamic `require()` — bridges Genkit tools into agent Tool interface |
| `an5Agent` | `an5Client` | Metadata file read for model info |
| `an5Agent` | `an5Schema` | Directory scan for `.an5` files |
| generated clients | `an5Adapters` | Optional metadata injection for model/table mapping |
| `an5Orm` | own `an5Metadata.ts` | Local metadata require — the core never imports the generated client (the client is generated *from* the ORM) |
| `an5Orm` | `an5Adapters` | `An5Adapter` (via `createAn5Adapter`) for DB operations |
| `an5Orm/generator` | `an5Client/*` | **Writes** generated files |
| `an5Orm/generator` | `an5Schema/` | **Reads** .an5 definitions |
| `an5Cli` | `an5Tasks` | Dynamic `require()` for task operations |

## Agent Tools (7 consolidated)

### Schema (1 tool with 3 actions)
| Tool | Actions | Description |
|------|---------|-------------|
| `schema` | list, describe, relations | Explore data models |

### Query (1 tool with 3 actions)
| Tool | Actions | Description |
|------|---------|-------------|
| `query` | generate, explain, validate | Work with SQL queries |

### Database (1 tool with 3 actions)
| Tool | Actions | Description |
|------|---------|-------------|
| `database` | execute, describe, health | Database operations |

### Code Generation (2 tools)
| Tool | Description |
|------|-------------|
| `generateClientCode` | Generate TS/Python/.NET/Go client code |
| `analyzeSchema` | Analyze schema for design issues |

### RAG (1 tool with 2 actions)
| Tool | Actions | Description |
|------|---------|-------------|
| `retrieve` | schema, queries | Semantic search |

### Task Management (1 tool with 4 actions)
| Tool | Actions | Description |
|------|---------|-------------|
| `task` | create, list, update, delete | Manage tasks |

## LLM Integration

| Provider | Env Variable | Default Model |
|----------|-------------|---------------|
| OpenAI | `OPENAI_API_KEY` / `LLM_API_KEY` | `gpt-4o-mini` |
| Gemini | `GEMINI_API_KEY` / `LLM_API_KEY` | `gemini-2.5-flash` |
| Custom | `LLM_ENDPOINT` | `llama3` |

## Genkit Integration

| Module | Role | Features |
|--------|------|----------|
| `an5Tasks` | Tool provider | `ai.defineTool()`, `ai.defineFlow()`, `ai.generate()` |
| `an5Agent` | Tool consumer | Bridges Genkit tools into agent `Tool` interface via `task-tools.ts` |

### Genkit Tools (defined in an5Tasks, used by an5Agent)

| Tool | Input | Output |
|------|-------|--------|
| `createTask` | type, description, file? | Task object |
| `listTasks` | workspaceDir, status?, priority? | Task[] |
| `updateTask` | workspaceDir, taskId, status?, priority? | Task \| null |
| `deleteTask` | workspaceDir, taskId | boolean |

### Genkit Flows

| Flow | Description |
|------|-------------|
| `parseReviewToTasksFlow` | Regex-based task extraction from LLM reviews |
| `aiParseReviewToTasksFlow` | AI-powered task extraction using `generate()` |

### Architecture: Genkit Bridge

<div class="arch-diagram-card">
<svg viewBox="0 0 920 286" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="gb-arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="gb-arrow-indigo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#818cf8"/>
    </marker>
    <marker id="gb-arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#c084fc"/>
    </marker>
    <linearGradient id="gb-grad-purple" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9333ea" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#9333ea" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="gb-grad-indigo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="gb-grad-cyan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.08"/>
    </linearGradient>
  </defs>

  <!-- Connectors -->
  <!-- Box 2 to Box 1 (require) -->
  <path d="M 495 76 L 418 76" stroke="#38bdf8" stroke-width="2" marker-end="url(#gb-arrow-cyan)"/>
  <g transform="translate(424, 52)">
    <rect width="66" height="18" rx="9" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1"/>
    <text x="33" y="13" font-family="&apos;Inter&apos;, sans-serif" font-size="9.5" font-weight="600" fill="#bae6fd" text-anchor="middle">require()</text>
  </g>

  <!-- Box 2 to Box 3 (Tool interface) -->
  <path d="M 690 176 L 690 200" stroke="#818cf8" stroke-width="2" marker-end="url(#gb-arrow-indigo)"/>

  <!-- Box 3 loopback to Box 1 (Genkit flow execution) -->
  <path d="M 495 240 L 220 240 L 220 184" stroke="#c084fc" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#gb-arrow-purple)"/>
  <g transform="translate(290, 228)">
    <rect width="130" height="22" rx="11" fill="#3b0764" stroke="#c084fc" stroke-width="1"/>
    <text x="65" y="15" font-family="&apos;Inter&apos;, sans-serif" font-size="10" font-weight="600" fill="#f3e8ff" text-anchor="middle">Genkit v1.39 flows</text>
  </g>

  <!-- Box 1: an5Tasks (Left) -->
  <g class="arch-node">
    <rect x="20" y="20" width="390" height="156" rx="10" fill="url(#gb-grad-purple)" stroke="#c084fc" stroke-width="1.5"/>
    <text x="36" y="46" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="13" font-weight="700" fill="#c084fc">an5Tasks/src/index.ts</text>
    <rect x="290" y="32" width="105" height="18" rx="9" fill="rgba(192, 132, 252, 0.2)" stroke="#c084fc" stroke-width="1"/>
    <text x="342" y="45" font-family="&apos;Inter&apos;, sans-serif" font-size="9.5" font-weight="600" fill="#f3e8ff" text-anchor="middle">Genkit Tools</text>

    <!-- Sub-tools -->
    <rect x="36" y="60" width="358" height="22" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.06)"/>
    <text x="46" y="75" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11" fill="#e2e8f0">ai.defineTool('createTask')</text>

    <rect x="36" y="86" width="358" height="22" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.06)"/>
    <text x="46" y="101" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11" fill="#e2e8f0">ai.defineTool('listTasks')</text>

    <rect x="36" y="112" width="358" height="22" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.06)"/>
    <text x="46" y="127" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11" fill="#e2e8f0">ai.defineTool('updateTask')</text>

    <rect x="36" y="138" width="358" height="22" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.06)"/>
    <text x="46" y="153" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11" fill="#e2e8f0">ai.defineTool('deleteTask')</text>
  </g>

  <!-- Box 2: an5Agent Bridge (Right Top) -->
  <g class="arch-node">
    <rect x="495" y="20" width="405" height="156" rx="10" fill="url(#gb-grad-indigo)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="512" y="46" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="13" font-weight="700" fill="#818cf8">an5Agent/src/tools/task-tools.ts</text>
    <rect x="795" y="32" width="90" height="18" rx="9" fill="rgba(129, 140, 248, 0.2)" stroke="#818cf8" stroke-width="1"/>
    <text x="840" y="45" font-family="&apos;Inter&apos;, sans-serif" font-size="9.5" font-weight="600" fill="#e0e7ff" text-anchor="middle">Tool Bridge</text>

    <rect x="512" y="62" width="372" height="26" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.06)"/>
    <text x="522" y="79" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11.5" fill="#38bdf8">loadTasksModule()</text>
    <text x="874" y="79" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">dynamic import</text>

    <rect x="512" y="94" width="372" height="26" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.06)"/>
    <text x="522" y="111" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11.5" fill="#e2e8f0">task.execute()</text>
    <text x="874" y="111" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">calls loaded module</text>

    <rect x="512" y="126" width="372" height="26" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.06)"/>
    <text x="522" y="143" font-family="&apos;Inter&apos;, sans-serif" font-size="11" fill="#cbd5e1">action param routes to method</text>
    <text x="874" y="143" font-family="&apos;Inter&apos;, sans-serif" font-size="10" fill="#818cf8" text-anchor="end">create | list | update | delete</text>
  </g>

  <!-- Box 3: An5Agent Consumer (Right Bottom) -->
  <g class="arch-node">
    <rect x="495" y="206" width="405" height="66" rx="10" fill="url(#gb-grad-cyan)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="512" y="230" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="12.5" font-weight="700" fill="#38bdf8">An5Agent class <tspan font-family="&apos;Inter&apos;, sans-serif" font-weight="400" fill="#94a3b8">— Consumer Interface</tspan></text>
    <text x="512" y="252" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11" fill="#e2e8f0">.addTool(task)</text>
    <text x="635" y="252" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11" fill="#94a3b8">→</text>
    <text x="655" y="252" font-family="&apos;JetBrains Mono&apos;, monospace" font-size="11" fill="#38bdf8">.executeTool('task', { action: 'create' })</text>
  </g>
</svg>
</div>

The bridge works by:
1. `an5Tasks` defines Genkit tools with `ai.defineTool()`
2. `an5Agent/src/tools/task-tools.ts` consolidates 4 tools into 1 `task` tool
3. `an5Agent` registers all 7 tools in `DEFAULT_TOOLS`
4. `process()` matches natural language → routes to appropriate tool/action
