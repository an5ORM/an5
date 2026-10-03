---
layout: page
title: VS Code MCP Server
description: Model Context Protocol (MCP) server for AN5 ORM in VS Code, GitHub Copilot, Cursor, and Claude Desktop
---

# VS Code MCP Server

The [AN5 ORM Schema Tooling extension](https://marketplace.visualstudio.com/items?itemName=an5orm.an5-orm-vscode) (`an5-orm-vscode`) ships a native [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server over standard I/O (stdio).

This server bridges your database models, SQL execution engine, and schema workflows directly to AI agent assistants—including **GitHub Copilot in VS Code**, **Cursor**, **Claude Desktop**, and any standard MCP client.

---

## Architecture & Integration Flow

<div class="arch-diagram-card">
<svg viewBox="0 0 940 260" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="mcp-arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="mcp-arrow-indigo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#818cf8"/>
    </marker>
    <marker id="mcp-arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#c084fc"/>
    </marker>
    <linearGradient id="mcp-grad-client" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="mcp-grad-server" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="mcp-grad-backend" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9333ea" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#9333ea" stop-opacity="0.08"/>
    </linearGradient>
  </defs>

  <!-- Connectors -->
  <path d="M 230 130 L 330 130" stroke="#38bdf8" stroke-width="2" marker-end="url(#mcp-arrow-cyan)"/>
  <text x="280" y="118" font-family="'Inter', sans-serif" font-size="11" fill="#38bdf8" text-anchor="middle">JSON-RPC (stdio)</text>

  <path d="M 610 90 L 710 65" stroke="#818cf8" stroke-width="2" marker-end="url(#mcp-arrow-indigo)"/>
  <path d="M 610 170 L 710 195" stroke="#c084fc" stroke-width="2" marker-end="url(#mcp-arrow-purple)"/>

  <!-- Left: AI Clients -->
  <g class="arch-node">
    <rect x="20" y="50" width="210" height="160" rx="12" fill="url(#mcp-grad-client)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="125" y="80" font-family="'Inter', sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">AI Agent Clients</text>
    <rect x="36" y="98" width="178" height="24" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)"/>
    <text x="125" y="114" font-family="'Inter', sans-serif" font-size="11" fill="#e2e8f0" text-anchor="middle">GitHub Copilot (VS Code)</text>
    <rect x="36" y="128" width="178" height="24" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)"/>
    <text x="125" y="144" font-family="'Inter', sans-serif" font-size="11" fill="#e2e8f0" text-anchor="middle">Cursor IDE (MCP)</text>
    <rect x="36" y="158" width="178" height="24" rx="5" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255, 255, 255, 0.08)"/>
    <text x="125" y="174" font-family="'Inter', sans-serif" font-size="11" fill="#e2e8f0" text-anchor="middle">Claude Desktop</text>
  </g>

  <!-- Center: AN5 MCP Server -->
  <g class="arch-node">
    <rect x="330" y="40" width="280" height="180" rx="12" fill="url(#mcp-grad-server)" stroke="#818cf8" stroke-width="1.5"/>
    <text x="470" y="68" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#818cf8" text-anchor="middle">AN5 ORM MCP Server</text>
    <text x="470" y="88" font-family="'Inter', sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">dist/mcp/server.js</text>
    <rect x="346" y="104" width="248" height="26" rx="5" fill="rgba(56, 189, 248, 0.1)" stroke="rgba(56, 189, 248, 0.25)"/>
    <text x="470" y="121" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#38bdf8" text-anchor="middle">8 Read-Only Inspection Tools</text>
    <rect x="346" y="136" width="248" height="26" rx="5" fill="rgba(249, 115, 22, 0.1)" stroke="rgba(249, 115, 22, 0.25)"/>
    <text x="470" y="153" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#fb923c" text-anchor="middle">5 Mutating Schema Operations</text>
    <text x="470" y="184" font-family="'Inter', sans-serif" font-size="10.5" fill="#cbd5e1" text-anchor="middle">Path Traversal Safe &bull; SQL Read Guard</text>
  </g>

  <!-- Right Top: Workspace & Schema -->
  <g class="arch-node">
    <rect x="710" y="25" width="210" height="90" rx="10" fill="url(#mcp-grad-client)" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="815" y="50" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#38bdf8" text-anchor="middle">Workspace Context</text>
    <text x="815" y="72" font-family="'Inter', sans-serif" font-size="11" fill="#e2e8f0" text-anchor="middle">&bull; an5Schema/*.an5</text>
    <text x="815" y="90" font-family="'Inter', sans-serif" font-size="11" fill="#e2e8f0" text-anchor="middle">&bull; an5Orm.config.js / .env</text>
  </g>

  <!-- Right Bottom: DB & Engine -->
  <g class="arch-node">
    <rect x="710" y="145" width="210" height="95" rx="10" fill="url(#mcp-grad-backend)" stroke="#c084fc" stroke-width="1.5"/>
    <text x="815" y="170" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#c084fc" text-anchor="middle">Database &amp; Engine</text>
    <text x="815" y="192" font-family="'Inter', sans-serif" font-size="11" fill="#e2e8f0" text-anchor="middle">&bull; @an5/adapters (Live DB)</text>
    <text x="815" y="210" font-family="'Inter', sans-serif" font-size="11" fill="#e2e8f0" text-anchor="middle">&bull; @an5/orm (Push/Migrate)</text>
  </g>
</svg>
</div>

---

## 1. Quick Setup & Discovery

<div class="arch-grid-2">
  <div class="arch-module-card">
    <div class="arch-module-header">
      <div class="arch-module-title">
        <i class="fas fa-magic"></i> Automatic Discovery
      </div>
      <span class="arch-module-badge">VS Code 1.101+</span>
    </div>
    <p style="font-size: 0.9rem; color: #cbd5e1; margin-bottom: 12px;">
      The extension registers an automatic <code>mcpServerDefinitionProviders</code> handler. No configuration file needed.
    </p>
    <ul class="arch-item-list">
      <li class="arch-item">
        <code>Ctrl+Shift+P</code>
        <span class="arch-item-desc">Open Command Palette</span>
      </li>
      <li class="arch-item">
        <code>MCP: List Servers</code>
        <span class="arch-item-desc">Browse available servers</span>
      </li>
      <li class="arch-item">
        <code>Start AN5 ORM</code>
        <span class="arch-item-desc">Click to run immediately</span>
      </li>
    </ul>
  </div>

  <div class="arch-module-card">
    <div class="arch-module-header">
      <div class="arch-module-title">
        <i class="fas fa-terminal"></i> Workspace Install
      </div>
      <span class="arch-module-badge">Cursor / Portable</span>
    </div>
    <p style="font-size: 0.9rem; color: #cbd5e1; margin-bottom: 12px;">
      Writes resolved execution paths into <code>.mcp.json</code> or <code>.vscode/mcp.json</code> preserving other servers.
    </p>
    <ul class="arch-item-list">
      <li class="arch-item">
        <code>AN5: Install MCP Server</code>
        <span class="arch-item-desc">Generate workspace config</span>
      </li>
      <li class="arch-item">
        <code>AN5: Show MCP Server Config</code>
        <span class="arch-item-desc">Inspect JSON definition</span>
      </li>
      <li class="arch-item">
        <code>Status Bar &gt; AN5 ORM</code>
        <span class="arch-item-desc">One-click quick actions</span>
      </li>
    </ul>
  </div>
</div>

### Sample Generated Workspace Configuration

When running **AN5: Install MCP Server** or inspecting via **AN5: Show MCP Server Configuration**, the server outputs the exact path to the active extension bundle:

```json
{
  "mcpServers": {
    "an5-orm": {
      "type": "stdio",
      "command": "/usr/bin/node",
      "args": [
        "~/.vscode/extensions/an5orm.an5-orm-vscode-1.0.6/dist/mcp/server.js"
      ],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

> **Runtime Execution Note**: The server uses Node.js to launch the script. System Node and version manager binaries (`nvm`, `fnm`, `volta`, `asdf`) are fully supported.

---

## 2. Workspace Context Discovery

When started, the MCP server analyzes your repository environment without requiring manual CLI arguments:

1. **Configuration**: Evaluates `an5Orm.config.js` or `an5Orm.config.cjs` to locate `schemaDir` (defaults to `an5Schema/`).
2. **Schema Files**: Scans `.an5` files up to 4 directory levels deep, filtering out `node_modules`, `.git`, `dist`, and `target`. If `an5Schema/` is empty, it falls back to scanning the project root.
3. **Database URL**: Automatically reads `DATABASE_URL` from active process environment variables or parses the workspace `.env` file.
4. **Local Engine**: Detects the project's installed `@an5/orm` and `@an5/adapters` packages to ensure scripts run against the project's exact dependency versions.

---

## 3. Tool Reference (13 Tools)

Tools are organized into two distinct safety tiers:

<div class="arch-grid-2">
  <div class="arch-module-card">
    <div class="arch-module-header">
      <div class="arch-module-title">
        <i class="fas fa-eye"></i> Tier 1: Read-Only
      </div>
      <span class="arch-module-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border-color: rgba(56, 189, 248, 0.3);">Autonomous</span>
    </div>
    <div class="arch-subgroup">
      <div class="arch-subgroup-title">
        <i class="fas fa-shield-alt"></i> Safe &bull; readOnlyHint: true
      </div>
      <ul class="arch-item-list">
        <li class="arch-item"><code>an5_list_models</code> <span class="arch-item-desc">Overview of all models</span></li>
        <li class="arch-item"><code>an5_describe_model</code> <span class="arch-item-desc">Fields, types, relations</span></li>
        <li class="arch-item"><code>an5_get_relations</code> <span class="arch-item-desc">Relation graph (FK/LK)</span></li>
        <li class="arch-item"><code>an5_analyze_schema</code> <span class="arch-item-desc">Audit keys, indexes, audit</span></li>
        <li class="arch-item"><code>an5_read_schema_file</code> <span class="arch-item-desc">Read raw .an5 file</span></li>
        <li class="arch-item"><code>an5_describe_table</code> <span class="arch-item-desc">Columns &amp; constraints</span></li>
        <li class="arch-item"><code>an5_database_health</code> <span class="arch-item-desc">Latency &amp; connection check</span></li>
        <li class="arch-item"><code>an5_query_database</code> <span class="arch-item-desc">Read-only SELECT / CTE</span></li>
      </ul>
    </div>
  </div>

  <div class="arch-module-card">
    <div class="arch-module-header">
      <div class="arch-module-title">
        <i class="fas fa-pen-nib"></i> Tier 2: Mutating
      </div>
      <span class="arch-module-badge" style="background: rgba(249, 115, 22, 0.15); color: #fb923c; border-color: rgba(249, 115, 22, 0.3);">confirm: true</span>
    </div>
    <div class="arch-subgroup">
      <div class="arch-subgroup-title">
        <i class="fas fa-user-shield"></i> Requires User Approval
      </div>
      <ul class="arch-item-list">
        <li class="arch-item"><code>an5_generate_client</code> <span class="arch-item-desc">TS/Python/.NET/Go/Rust</span></li>
        <li class="arch-item"><code>an5_push_schema</code> <span class="arch-item-desc">Additive DDL push to DB</span></li>
        <li class="arch-item"><code>an5_pull_schema</code> <span class="arch-item-desc">Introspect DB into .an5</span></li>
        <li class="arch-item"><code>an5_migrate</code> <span class="arch-item-desc">diff, apply, rollback</span></li>
        <li class="arch-item"><code>an5_seed</code> <span class="arch-item-desc">Execute db:seed script</span></li>
      </ul>
    </div>
  </div>
</div>

### Detailed Tool Specifications

| Tool | Parameters | Description |
| :--- | :--- | :--- |
| `an5_list_models` | *(none)* | Returns the total count, physical table mapping, and field/relation summaries for every declared model. |
| `an5_describe_model` | `model: string` | Returns full field metadata (`sqlType`, `optional`, `primaryKey`, `unique`, `hasDefault`, `description`) and relation connections. |
| `an5_get_relations` | *(none)* | Returns an edge array representing foreign-key and local-key links between models (`one-to-many`, `many-to-one`). |
| `an5_analyze_schema` | *(none)* | Runs automated static analysis: flags missing primary keys, unindexed foreign keys, and missing audit timestamps (`createdAt`, `updatedAt`). |
| `an5_read_schema_file` | `file: string` | Returns full raw text of a `.an5` file. Validates that the target path is strictly within the workspace root to prevent path traversal. |
| `an5_describe_table` | `table: string` | Checks the schema model first; if absent, inspects physical database metadata directly. |
| `an5_database_health` | *(none)* | Performs a round-trip connection probe, reporting connection state and latency in milliseconds. |
| `an5_query_database` | `sql: string` | Executes read-only queries. Permits single-statement `SELECT` and read-only CTEs (`WITH ... SELECT`). Rejects multi-statements and mutation keywords (`INTO`, `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `TRUNCATE`, `EXEC`). |
| `an5_generate_client` | `language: string`, `outputDir?: string`, `confirm: boolean` | Triggers the code generator for `typescript`, `python`, `dotnet`, `golang`, or `rust`. |
| `an5_push_schema` | `confirm: boolean` | Executes an additive schema sync (`db:push`) to create tables and add missing columns. |
| `an5_pull_schema` | `confirm: boolean` | Overwrites local `.an5` schemas with introspected database structure (`db:pull`). |
| `an5_migrate` | `action: string`, `steps?: number`, `dryRun?: boolean`, `confirm: boolean` | Manages schema migrations: `diff`, `generate`, `apply`, `rollback`, or `status`. |
| `an5_seed` | `confirm: boolean` | Populates the connected database using the project seed script (`db:seed`). |

---

## 4. Cursor & Claude Desktop Setup

### Claude Desktop

Open `claude_desktop_config.json`:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Add the server definition:

```json
{
  "mcpServers": {
    "an5-orm": {
      "command": "node",
      "args": [
        "/absolute/path/to/an5orm.an5-orm-vscode/dist/mcp/server.js"
      ],
      "cwd": "/path/to/your/project",
      "env": {
        "DATABASE_URL": "sqlserver://localhost:1433;database=mydb;user=sa;password=secret"
      }
    }
  }
}
```

### Cursor IDE

1. Open **Settings** &rarr; **Features** &rarr; **MCP**.
2. Click **+ Add New MCP Server**.
3. Select **Type**: `command` (stdio).
4. Paste the command and argument values obtained from **AN5: Show MCP Server Configuration**.

---

## 5. Security & Isolation Guarantees

- **Path Traversal Protection**: File operations in `an5_read_schema_file` verify that canonical paths remain strictly within the workspace boundary. Relative escapes (`../`) and external symlinks are rejected.
- **SQL Guardrails**: `an5_query_database` blocks schema-altering statements, chained semicolons, and write queries.
- **Protocol Separation**: Standard output (`stdout`) is strictly reserved for JSON-RPC MCP messages. Diagnostic outputs and warnings are redirected to `stderr` (`[an5-orm-mcp]`) to prevent protocol corruption.
- **Mandatory Human Confirmation**: Destructive operations cannot be executed autonomously by an AI agent; the parameter `confirm: true` must be explicitly approved.
