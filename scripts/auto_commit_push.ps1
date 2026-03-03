<#
Auto Commit & Push Helper

Usage:
  .\auto_commit_push.ps1 -Message "Brief description"

If no message is provided, a timestamped message will be used.

This script stages all changes, creates a commit, and pushes to origin/main.
Be sure you are authenticated (PAT or SSH) for `git push` to succeed.
#>

param(
    [string]$Message = ""
)

try {
    Push-Location -ErrorAction Stop (Split-Path -Parent $MyInvocation.MyCommand.Definition)

    $status = git status --porcelain
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-Output "No changes to commit."
        Pop-Location
        exit 0
    }

    git add -A

    if ([string]::IsNullOrWhiteSpace($Message)) {
        $Message = "Auto-update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }

    git commit -m "$Message"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "git commit failed with exit code $LASTEXITCODE"
        Pop-Location
        exit $LASTEXITCODE
    }

    git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Error "git push failed with exit code $LASTEXITCODE"
        Pop-Location
        exit $LASTEXITCODE
    }

    Write-Output "Pushed to origin/main successfully."
    Pop-Location
    exit 0
}
catch {
    Write-Error "Auto commit failed: $_"
    if (Get-Location) { Pop-Location }
    exit 1
}
