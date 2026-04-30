# Push to GitHub (first-time setup)
# Usage:
#   .\push-to-github.ps1 -RepoUrl "https://github.com/<username>/<repo>.git"
# Optional:
#   .\push-to-github.ps1 -RepoUrl "https://github.com/<username>/<repo>.git" -Branch "main"

param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl,
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "Git is not installed or not in PATH. Install Git from https://git-scm.com/download/win and re-run this script."
}

if (-not (Test-Path ".git")) {
  git init
}

# Ensure the branch exists and is checked out
try {
  git checkout -B $Branch
} catch {
  git switch -c $Branch
}

# Stage and commit (safe if already committed)
git add .

$hasChanges = (git status --porcelain)
if ($hasChanges) {
  git commit -m "Initial commit"
} else {
  Write-Host "No new changes to commit."
}

# Configure remote origin
$hasOrigin = git remote | Select-String -Pattern "^origin$"
if ($hasOrigin) {
  git remote set-url origin $RepoUrl
} else {
  git remote add origin $RepoUrl
}

# Push

git push -u origin $Branch

Write-Host "Done. Your project is pushed to GitHub on branch '$Branch'."
