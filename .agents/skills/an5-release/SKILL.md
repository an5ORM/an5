---
name: an5-release
description: "Deliver AN5 Git changes: write changelogs, reconcile documentation with implementation, validate packages, commit, push, and release. Use for requested code delivery or automated releases; ordinary code review does not authorize pushing or publishing."
---

# AN5 code delivery and release

Turn actual changes into accurate documentation, validated commits, and verified delivery. In the AN5 monorepo, read [references/an5-workspace.md](references/an5-workspace.md). Reinspect current scripts and workflows rather than treating the reference as executable configuration.

## Scope and authorization

- Follow the requested mode: prepare/preview, commit, push, or release. A request to execute this skill's complete automatic workflow authorizes commit, push, and release for the requested repositories. Continue without another confirmation when scope and destination are established.
- Creating, installing, or reviewing this skill does not execute delivery. Preview stops before commits, pushes, tags, dispatch, and publication. Push-only does not authorize release tags or registry publication; check whether the branch push itself publishes.
- Inventory staged, unstaged, untracked, and existing unpushed changes in each affected repository. Include the requested changes; preserve unrelated edits and staged work. Do not silently push unrelated earlier commits. Explicit authorization for all workspace changes establishes that wider scope.
- Resolve remote, branch, version, and publication route from the request and established conventions. Ask only for material ambiguity or missing authorization, after completing independent preparation. A dirty tree alone is not a release instruction.

## Inspect changes and reconcile documentation

Read applicable `AGENTS.md`, scripts, release workflows, configuration, changelogs, implementation, and tests. Inspect unstaged/staged diffs, untracked source, and outgoing commits. For submodules, inspect inside each child; the parent only records pointers.

Trace changed public behavior through exports, signatures, defaults, errors, provider/language support, and examples. Compare it with READMEs, guides, API reference, configuration examples, and feature-status pages. Verify paths and commands against actual code. Update affected documentation; fix code defects only within the task's scope. Record unrelated pre-existing mismatches without broadening delivery into a rewrite.

Write changelog entries from the final diff. Explain concrete before/after behavior and user impact, affected packages/providers/languages, and compatibility or migration steps. Follow existing format and language, preserve history, and merge unreleased entries without duplicates. Do not claim coverage or support that was not verified.

For a release, choose the version using actual compatibility impact and existing version policy. Synchronize applicable manifests, lockfiles, cross-language versions, dependency ranges, and version checks with maintained tools. Move only included unreleased notes into the dated release entry, preserving unrelated pending notes. Use the user's timezone for the date.

## Validate

Regenerate artifacts from their sources, review generated diffs, and run affected builds/tests plus required release gates. Include package artifact checks when relevant. Distinguish passed, failed, and skipped checks; a skipped live example is not a successful database test.

Resolve missing prerequisites within scope or stop before release with the specific blocker. Do not weaken a required gate or silently publish unchecked artifacts. Before staging, review the final diff and `git diff --check` for credentials, private connection strings, temporary databases, and unrelated generated output. Rerun affected checks if files change after validation.

## Execute through an5Cli

Use the repository's built `an5Cli/dist/index.js` for delivery. Rebuild it when its
source changed. It now supports read-only preview, selected paths, prepared notes,
source-aware docs, explicit npm/Python version synchronization, and verification.
Read the current CLI README for exact behavior and limitations. Set scoped `TZ`
to the user's timezone when invoking delivery so changelog dates match it.

- Preview: `node an5Cli/dist/index.js release <repo> --preview --skip-llm`.
- Write reviewed notes to a temporary file and pass `--changelog-file <file>`.
  Use `--message <message> --skip-llm --skip-prompt` when the agent supplies the
  analysis itself; no second LLM service is needed for prepared docs/notes.
- Repeat `--files <path>` for each included changed path, including regenerated
  artifacts. The CLI rejects unrelated staged edits or dirty automatic outputs.
- Use `--update-docs` only when configured LLM generation is intended. Otherwise
  reconcile docs directly before calling the CLI; its generated docs need review.
- For an authorized package release, add `--version <version> --tag v<version>
  --push --verify-release`. Inspect publication triggers first. Stable static
  Python versions following npm are synchronized; independent Rust/.NET versions
  and downstream dependency ranges remain the agent's responsibility.
- Workspace `ws` uses current checkouts and child-first pushes. Do not pass one
  shared version/tag across independent packages; release them individually and
  then deliver parent pointers. Prefer per-repo calls for selected change scope.
- CLI verification covers exact tag CI, GitHub Release, and npm/PyPI records when
  publish jobs identify those registries. Verify other registries separately.
  If checks stop after a push/tag, inspect existing remote state before retrying.

## Commit and push

1. Fetch target refs and inspect incoming/outgoing commits and branch/upstream state. Do not switch dirty or detached checkouts to a guessed branch. Resolve conflicts within authorized work, preserving existing edits; stop if the destination cannot be determined.
2. Stage explicit deliverable paths, preserving unrelated staged changes. Review the exact staged diff and commit only the included changes. Follow existing commit conventions and describe the resulting behavior.
3. Use normal fast-forward pushes. Push included submodule commits first and verify their remote reachability; then commit and push parent gitlinks. Do not force-push, reset, or rewrite published history.
4. Check command exit status and verify the intended remote branch contains the commit. A wrapper's success banner is not evidence of a successful push.

## Release and verify

Use the maintained publication route. Inspect what branch/tag/dispatch triggers releases or package publication, choosing one route per package. Do not trigger a workflow and separately publish the same package unless that workflow requires it.

Tag only the intended release commit with a version matching its manifests. Check local and remote tag existence; never replace a tag. Push the specific authorized tag after verifying the release commit reached the remote. Avoid `--tags`, which could publish unrelated tags.

Track CI for the exact commit/tag and verify required jobs and intended artifacts: release page, package version, assets, or registry records. If pending or unobservable, report that status without claiming publication is complete. Never print tokens or switch accounts to bypass failures.

Stop on rejected pushes, unresolved conflicts, missing credentials, version/tag collisions, or failed release jobs. Diagnose before retrying. Retry transient reads/checks at most twice; retry an external mutation only after confirming it did not already succeed. After partial delivery, report what shipped and what remains. Preserve published versions/tags instead of bumping again to conceal failure.

Finish with behavior changes, documentation/changelog paths, validation and skips, commit hashes, branch/tag, and verified release URLs or the precise blocker. Do not report full success while requested delivery remains incomplete.
