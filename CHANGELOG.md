# Changelog

## [1.3.0] - 2026-10-06

### Added
- Ship the Java (JDBC), Kotlin and Swift adapter runtimes and the generated clients for all three, each with a compile gate and a SQLite smoke, plus runnable examples in an5example (Maven, kotlinc, SwiftPM).
- Publish the Java and Kotlin adapters to Maven Central from a workspace tag: `org.an5orm:an5-adapters-java` and `org.an5orm:an5-adapters-kotlin` with sources, javadoc and detached GPG signatures. The job builds both manifests before uploading anything and fails when the tag does not match the workspace version.
- Build the Kotlin manifest with Gradle in CI (`test:gradle`) — the resolution path a Gradle consumer takes, which the kotlinc gate does not exercise.

### Fixed
- The Kotlin example and adapter gates find `kotlin-stdlib.jar` through the compiler's real path, so a symlinked or runner-installed compiler runs the smoke instead of failing on a missing class.
- CI resolves Gradle through `GRADLE_HOME`, so the pinned distribution is used even when the runner's own Gradle comes first on PATH.

## [1.2.0] - 2026-10-04

### Added
- Add Java, Kotlin and Swift client generation and runtimes, alongside the existing TypeScript, Python, .NET, Go and Rust clients.
- Add the repository-local an5-release skill for reviewed changelogs, documentation checks, selected-file delivery and release verification.
- Publish npm adapters, ORM, client, agent and CLI, plus Python adapters, ORM and client, through the workspace tag workflow, and create a version manifest in the GitHub Release.
### Changed
- Use --preview/preview throughout workspace scripts and migration examples; remove the old preview flag/name.
- Build and publish the exact submodule commits pinned by the release tag. The extension uses its own tested VSIX/Open VSX workflow; Marketplace upload remains manual.
- Include shared brand assets and updated site/documentation pointers.

## [1.0.1] - 2026-08-19

- chore: update misc

## [1.1.0] - 2026-07-05

### Added
- **Per-repo UI dashboard** — each repo shows its own specific actions (Generate, DB Push, Build, Test, etc.)
- **Openencode integration** — 🤖 button on tasks to open in opencode for AI-assisted fixing
- **"Fix All" button** — batch-open all pending tasks in opencode
- **Toast notification system** — replaces all `alert()` calls with auto-dismiss toasts
- **Collapsible operation steps** — click header to collapse/expand any section
- **Step badges** — shows task count on Tasks section
- **`/api/repo/build`** — run `npm run build` per repo
- **`/api/repo/test`** — run `npm test` per repo
- **`/api/repo/run`** — run any script per repo (with sanitization)
- **`/api/task/open`** — open a task in opencode from UI
- **`an5-cli task open --id <taskId>`** — CLI command to open task in opencode
- **Task filter dropdown** — filter by All / Todo / In Progress / Done
- **Cancel button in SettingsModal** — close without saving
- **"API key configured" indicator** — green dot when key is set
- **Auto-kill port 5070** — server auto-kills old process before starting
- **Git diff viewer** — inline diff with color-coded additions/deletions, per-file selection
- **Pull button** — per-repo git pull in one click
- **LLM Code Review** — AI-powered review with generate button and result display
- **Commit & Release** — write commit message, AI generate option, publish with optional remote push
- **`/api/diff`** — get git diff per repo or per file
- **`/api/pull`** — git pull per repo
- **`/api/review`** — run LLM code review per repo
- **`/api/commit-msg`** — AI-generated commit messages
- **`/api/release`** — git commit + optional push per repo
- **Mobile responsive UI** — sidebar becomes slide-out drawer, single-column layout, larger touch targets
- **Vercel deployment** — `vercel.json` for deploying UI to Vercel, `VITE_API_URL` env var for remote API
- **Tunnel support** — `npm run ui:tunnel` exposes dashboard via localtunnel for mobile/remote access
- **OpencodePanel component** — dedicated opencode section in dashboard with quick actions, custom prompt, session management
- **`/api/opencode/start`** — start opencode web for any workspace with optional prompt
- **`/api/opencode/stop`** — stop opencode sessions by PID from the dashboard
- **Consolidated opencode** — all opencode access centralized in UI dashboard; removed CLI `open`/`opencode` commands, `task open` action, `/api/task/open` endpoint

### Changed
- **an5Agent: 17 tools** (was 13) — added 4 task tools from an5Tasks (Genkit bridge)
- **an5Agent: fixed adapter path** — `database-tools.ts` was using wrong path depth
- **RepoDashboard replaces generic 7-step workflow** — each repo shows specific actions
- **App.tsx cleanup** — removed unused handlers, formatMarkdown, reduced from 755 to ~310 lines
- **OperationStep component** — now supports `defaultOpen`, `badge`, collapsible toggle
- **ToastContainer** — fixed position, top-right, auto-dismiss after 3s
- **tasks.json** — cleaned 49 → 7 duplicate tasks

### Fixed
- **Tab-index race condition** — `handleSelectRepo` uses functional updater
- **Task filter dropdown** — was non-functional, now filters by status
- **Settings modal** — added Cancel button, shows "✓ configured" for API key
- **Empty catch blocks** — now show toast notifications on error

## [1.0.0] - 2026-07-04

### Added
- Initial workspace setup with 8 submodules
- `an5Orm` — Core ORM runtime with proxy-based client, CRUD, vector search
- `an5Client` — Generated client artifacts (TypeScript, Python, .NET)
- `an5Adapters` — Standalone language adapters (TS, Python, C#)
- `an5Agent` — AI agent library with 13 tools and RAG pipeline
- `an5Cli` — CLI for release automation, changelog, and LLM-powered commits
- `an5OrmVScode` — VS Code extension for `.mssql` schema files
- `an5Schema` — SQL Server native schema definitions
- `an5Tasks` — Genkit-powered task manager for code review analysis
- Documentation, build automation, CI/CD workflows
