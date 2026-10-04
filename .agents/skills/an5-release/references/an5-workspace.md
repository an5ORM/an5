# AN5 workspace delivery notes

Use when the root contains `an5Orm.config.js`, `.gitmodules`, and AN5 npm workspaces. Reinspect current files before choosing commands.

## Repositories, documentation, and generation

The root tracks independent Git submodules, including adapters, ORM, clients, agent, extension, CLI, tasks, schemas, examples, site, and docs. Read `.gitmodules` for current membership, remotes, and branches. Inspect each affected child independently; a parent `m child` does not reveal the child's changes. Do not assume every dirty child belongs to the task. Push child commits before committing parent pointers and verify each gitlink is retrievable from its configured remote.

Root and package READMEs explain public APIs; package changelogs record releases. `an5Docs` is a separate docs repository: locate its source tree before changing guides, API references, feature status, and configuration documentation.

Read `.agents/skills/an5-orm/SKILL.md` and relevant configs for schema/client changes. `.an5` files are the source of truth. Use existing generation scripts, then build clients. `an5Client/typescript` includes tracked source, JavaScript, and declarations: check that generation/build leaves these consistent. Respect the workspace English-only check for committed documentation and code comments; conversation can remain in the user's language.

## Validation discovery

Inspect root `package.json` scripts such as `build`, `test`, `test:full`, `generate`, `test:lang`, and live integration gates. `test:full` includes generator/package smoke and Python/.NET/Go/Rust checks. Child scripts and CI define package-specific verification and version-sync gates. Required missing SDKs or skipped live checks must be reported accurately.

Use disposable local databases. Code delivery does not authorize connecting to or mutating a live database without an intended target.

On a volume that does not preserve executable permissions, repeated `chmod` may not repair dependency tools. Prefer copies on an executable volume and scoped environment wrappers when needed. Do not commit machine-specific paths or remount disks as a routine release step.

## CLI integration

Inspect `an5Cli/src/index.ts`, `delivery.ts`, `documentation.ts`, `impact.ts`, and
its README before invoking release automation. Rebuild the built entrypoint after
source changes. Root `release` still invokes workspace `ws . --push`; root
`preview` invokes `ws . --preview`.

Workspace mode now preserves existing checkouts: it does not initialize, update
remote heads, merge, or switch to `main`. Preview skips builds and all writes.
Single-repository release supports selected paths, prepared changelog notes,
source-aware docs, explicit npm/static Python versions, and verified tag release.
Git failures propagate and pushes are verified. Children must be reachable on
origin before the parent is pushed.

Use `--files` for selected-path delivery and `--changelog-file` for reviewed notes
prepared by the agent. The default single-repo scope includes all changed paths;
do not use that default when unrelated changes exist. Automatic output conflicts
are rejected in selected mode. Include tracked generated artifacts explicitly.
Do not bypass release gates with `--no-verify` or recursion environment flags.

`--verify-release` checks tag-push CI and a published GitHub Release, with npm/PyPI
version checks when job names identify those registries. It does not verify every
possible registry or unconventional publish job. An unavailable/pending/failed
verification must be reported without claiming successful publication.

## Publication routes

Inspect root and child `.github/workflows` for current triggers and publish jobs:

- Root `publish.yml` has `v*` tag/manual routes for npm/PyPI. The workspace route publishes npm adapters, ORM, client, agent and CLI, plus Python adapters, ORM and client, from pinned gitlinks. It creates a workspace GitHub Release. The extension is released independently by its child workflow. Verify these current steps before triggering it.
- Child `ci-release.yml` files may test branch pushes and publish `v*` tags. Adapters currently include npm/PyPI/release jobs; ORM includes npm/release jobs. Other repos have separate workflows.
- Inspect each language's manifests, version-sync tests, and dependency ranges. Root and child package versions need not match.
- Avoid triggering root and child publication for the same package/version. Select the established route for the deliverable.

Inspect CI for the exact SHA/tag using available repository tools or authenticated `gh`, and verify the expected release artifacts. Installation and preview never execute release, publish, tag push, or workflow dispatch.
