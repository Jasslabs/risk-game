<#
File watcher that auto-commits & pushes debounced changes to origin/main.

Usage:
  .\watch_autocommit.ps1
  or
  .\watch_autocommit.ps1 -Path "C:\path\to\repo" -DebounceMs 3000

Notes:
- Ignores changes inside .git, node_modules, .vs, and .vscode
- Debounce default: 3000 ms (3s). Commits/pushes after changes settle.
- Ensure you have git auth (PAT or SSH) configured for push to succeed.
#>

param(
    [string]$Path = $null,
    [int]$DebounceMs = 3000
)

Set-StrictMode -Version Latest

if (-not $Path) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
    $Path = Resolve-Path (Join-Path $scriptDir "..")
}

$Root = (Get-Item $Path).FullName
Write-Host "Watching: $Root" -ForegroundColor Cyan

$ignoredPatterns = @('\.git\', '\\node_modules\\', '\\.vs\\', '\\.vscode\\')

$global:changedFiles = [System.Collections.Generic.HashSet[string]]::new()

function IsIgnored($filePath) {
    foreach ($p in $ignoredPatterns) {
        if ($filePath -match $p) { return $true }
    }
    return $false
}

function ScheduleCommit {
    try {
        if ($timer.Enabled) { $timer.Stop() }
        $timer.Start()
    }
    catch {
        Write-Warning "Failed to schedule commit: $_"
    }
}

function PerformCommit {
    try {
        if ($global:changedFiles.Count -eq 0) {
            return
        }

        $files = $global:changedFiles -join ", "
        $time = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        $msg = "auto: changes $time - $files"

        Write-Host "Committing changes: $msg" -ForegroundColor Yellow

        Push-Location $Root
        git add -A
        git commit -m "$msg" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Pushing to origin/main..." -ForegroundColor Yellow
            git push origin main
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Pushed successfully." -ForegroundColor Green
            } else {
                Write-Warning "git push exited with code $LASTEXITCODE"
            }
        } else {
            Write-Host "Nothing to commit (maybe changes were already staged)." -ForegroundColor DarkCyan
        }
        Pop-Location

        $global:changedFiles.Clear()
    }
    catch {
        Write-Error "PerformCommit failed: $_"
    }
}

# Timer for debounce
$timer = New-Object System.Timers.Timer($DebounceMs)
$timer.AutoReset = $false
$timer.Add_Elapsed({ PerformCommit })

# FileSystemWatcher setup
$fsw = New-Object System.IO.FileSystemWatcher $Root -Property @{IncludeSubdirectories = $true; NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, DirectoryName, Size'}

$action = {
    try {
        $full = $Event.SourceEventArgs.FullPath
        if (IsIgnored($full)) { return }
        # Record changed filename (shorten to relative path)
        $rel = Resolve-Path -LiteralPath $full -Relative
        if (-not $rel) { $rel = $full }
        $global:changedFiles.Add($rel) | Out-Null
        ScheduleCommit
    }
    catch {
        Write-Warning "Watcher event error: $_"
    }
}

Register-ObjectEvent $fsw Changed -SourceIdentifier FileChanged -Action $action | Out-Null
Register-ObjectEvent $fsw Created -SourceIdentifier FileCreated -Action $action | Out-Null
Register-ObjectEvent $fsw Deleted -SourceIdentifier FileDeleted -Action $action | Out-Null
Register-ObjectEvent $fsw Renamed -SourceIdentifier FileRenamed -Action $action | Out-Null

$fsw.EnableRaisingEvents = $true

Write-Host "Auto-commit watcher running. Press Ctrl+C to stop." -ForegroundColor Green

try {
    while ($true) { Start-Sleep -Seconds 3600 }
}
catch [System.Management.Automation.StopException] {
    # Ctrl+C pressed
}
finally {
    Write-Host "Shutting down watcher..." -ForegroundColor Cyan
    $fsw.EnableRaisingEvents = $false
    Unregister-Event -SourceIdentifier FileChanged -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier FileCreated -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier FileDeleted -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier FileRenamed -ErrorAction SilentlyContinue
    $timer.Dispose()
    $fsw.Dispose()
}
