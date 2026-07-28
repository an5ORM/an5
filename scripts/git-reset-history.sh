#!/usr/bin/env bash
set -euo pipefail

# ─── Git History Reset Script ────────────────────────────────────────────────
# Usage: bash scripts/git-reset-history.sh [main-repo-path]
# If no path given, uses current directory.
#
# Resets ALL git history for the main repo and ALL its submodules:
#   1. Processes every submodule (git checkout --orphan + commit + force push)
#   2. Updates submodule pointers in the main repo
#   3. Resets main repo history and force pushes
#
# WARNING: Destructive! All commit history is permanently lost.
# ──────────────────────────────────────────────────────────────────────────────

ROOT="${1:-$(pwd)}"
cd "$ROOT"

echo "=== Git History Reset ==="
echo "Root repo: $(pwd)"
echo ""

# ── Collect submodules ───────────────────────────────────────────────────────
SUBMODULES=()
while IFS= read -r line; do
    name=$(echo "$line" | cut -d' ' -f2)
    SUBMODULES+=("$name")
done < <(git config --file .gitmodules --get-regexp '^submodule\..*\.path$' 2>/dev/null || true)

echo "Found ${#SUBMODULES[@]} submodule(s):"
for s in "${SUBMODULES[@]}"; do echo "  - $s"; done
echo ""

# ── Process each submodule ───────────────────────────────────────────────────
for sm in "${SUBMODULES[@]}"; do
    echo ">>> Processing submodule: $sm"
    (
        cd "$ROOT/$sm"
        BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

        git checkout --orphan latest_branch
        git add -A
        git commit -m "Initial commit"
        git branch -D "$BRANCH" 2>/dev/null || true
        git branch -m "$BRANCH"
        git push -f origin "$BRANCH"
    )
    echo "<<< Done: $sm"
    echo ""
done

# ── Update submodule pointers in parent ──────────────────────────────────────
echo ">>> Updating submodule pointers in parent repo"
git add "${SUBMODULES[@]}"
echo ""

# ── Process main repo ────────────────────────────────────────────────────────
echo ">>> Processing main repo: $(basename $(pwd))"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

git checkout --orphan latest_branch
git add -A
git commit -m "Initial commit"
git branch -D "$BRANCH" 2>/dev/null || true
git branch -m "$BRANCH"
git push -f origin "$BRANCH"

echo ""
echo "=== ALL DONE ==="
echo "All repos (main + ${#SUBMODULES[@]} submodules) have been reset."
