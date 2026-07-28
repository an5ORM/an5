#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Reset git history for a monorepo and all its submodules.
.DESCRIPTION
    Creates a fresh orphan commit for the main repo and each submodule,
    then force pushes to origin. All previous commit history is lost.
.PARAMETER RepoPath
    Path to the root of the git monorepo. Defaults to current directory.
.PARAMETER Branch
    Target branch name. Defaults to "main".
.PARAMETER DryRun
    If set, only shows what would be done without making changes.
.EXAMPLE
    .\scripts\git-reset-history.ps1
    .\scripts\git-reset-history.ps1 -RepoPath "E:\git\mssql" -Branch "main"
#>

param(
    [string]$RepoPath = (Get-Location).Path,
    [string]$Branch = "main",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "=== Git History Reset ===" -ForegroundColor Cyan
Write-Host "Repo: $RepoPath"
Write-Host "Branch: $Branch"
if ($DryRun) { Write-Host "DRY RUN MODE - No changes will be made" -ForegroundColor Yellow }
Write-Host ""

Set-Location $RepoPath

# ── Discover submodules ──────────────────────────────────────────────────────
$gitmodules = Join-Path $RepoPath ".gitmodules"
$submodules = @()
if (Test-Path $gitmodules) {
    $lines = Get-Content $gitmodules
    foreach ($line in $lines) {
        if ($line -match '^\s*path\s*=\s*(.+)$') {
            $submodules += $matches[1]
        }
    }
}

Write-Host "Found $($submodules.Count) submodule(s):" -ForegroundColor Green
foreach ($sm in $submodules) { Write-Host "  - $sm" }
Write-Host ""

# ── Helper function ──────────────────────────────────────────────────────────
function Reset-RepoHistory {
    param([string]$Path, [string]$Name)

    Write-Host ">>> Processing: $Name" -ForegroundColor Yellow
    Set-Location $Path

    $currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
    if (-not $currentBranch) { $currentBranch = $Branch }

    if ($DryRun) {
        Write-Host "  [DRY-RUN] Would reset history for $Name on branch $currentBranch" -ForegroundColor DarkYellow
        return
    }

    # Create orphan branch (no history)
    git checkout --orphan latest_branch
    # Stage all files
    git add -A
    # Create fresh initial commit
    git commit -m "Initial commit"
    # Delete old branch and rename
    git branch -D $currentBranch 2>$null
    git branch -m $currentBranch
    # Force push
    git push -f origin $currentBranch

    Write-Host "  Done: $Name ($(git rev-parse HEAD))" -ForegroundColor Green
    Write-Host ""
}

# ── Process each submodule ───────────────────────────────────────────────────
foreach ($sm in $submodules) {
    $smPath = Join-Path $RepoPath $sm
    if (-not (Test-Path $smPath)) {
        Write-Host "  Skipping $sm (path not found)" -ForegroundColor DarkYellow
        continue
    }
    Reset-RepoHistory -Path $smPath -Name $sm
}

# ── Update submodule pointers in parent ──────────────────────────────────────
Write-Host ">>> Updating submodule pointers in parent repo" -ForegroundColor Yellow
Set-Location $RepoPath
if (-not $DryRun) {
    git add $submodules
}
Write-Host ""

# ── Process main repo ────────────────────────────────────────────────────────
$repoName = Split-Path $RepoPath -Leaf
Reset-RepoHistory -Path $RepoPath -Name $repoName

Write-Host "=== ALL DONE ===" -ForegroundColor Cyan
Write-Host "All repos (1 main + $($submodules.Count) submodules) have been reset." -ForegroundColor Green
