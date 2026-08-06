$ErrorActionPreference = "Stop"
$expectedPath = "C:\Users\HB LAPTOP STORE\Documents\https-github.com-mahdialmuntadhar1-rgb-Halal"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ZAWAJ HALAL - SAFE VERIFY & DEPLOY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $expectedPath
if ((Get-Location).Path -ne $expectedPath) {
    Write-Host "ABORT: Not in the correct project folder." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] In correct folder" -ForegroundColor Green

$remote = git remote -v 2>$null
if ($remote -notmatch "-Halal") {
    Write-Host "ABORT: This is not the Halal repo." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Correct git remote confirmed" -ForegroundColor Green

$branch = git branch --show-current
if ($branch -ne "main") {
    Write-Host "WARNING: Not on main branch (currently: $branch)" -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/n)"
    if ($confirm -ne "y") { exit 1 }
}
Write-Host "[OK] On branch: $branch" -ForegroundColor Green

$rebaseInProgress = (Test-Path ".git\rebase-merge") -or (Test-Path ".git\rebase-apply")
if ($rebaseInProgress) {
    Write-Host "ABORT: A rebase is in progress. Resolve manually first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$dirty = git status --porcelain
if ($dirty) {
    Write-Host "WARNING: You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $dirty -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/n)"
    if ($confirm -ne "y") { exit 1 }
}
Write-Host "[OK] Working tree checked" -ForegroundColor Green

Write-Host ""
Write-Host "Verifying auth fix is present in Header.tsx..." -ForegroundColor Yellow

$headerContent = Get-Content "src\components\Header.tsx" -Raw
$checks = @{
    "isAuthenticated in interface" = $headerContent -match "isAuthenticated\?:\s*boolean"
    "onLoginClick in interface"    = $headerContent -match "onLoginClick\?:\s*\(\)"
    "isAuthenticated conditional"  = $headerContent -match "\{isAuthenticated\s*\?\s*\("
    "onLoginClick wired to button" = $headerContent -match "onClick=\{onLoginClick\}"
}

$allGood = $true
foreach ($check in $checks.GetEnumerator()) {
    if ($check.Value) {
        Write-Host "  [PASS] $($check.Key)" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $($check.Key)" -ForegroundColor Red
        $allGood = $false
    }
}

if (-not $allGood) {
    Write-Host "ABORT: Auth fix missing or incomplete." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""
Write-Host "[OK] All auth fix checks passed" -ForegroundColor Green

Write-Host ""
Write-Host "Building..." -ForegroundColor Yellow
Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED. Aborting deploy." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Build succeeded" -ForegroundColor Green

Write-Host ""
Write-Host "Deploying to Cloudflare Pages..." -ForegroundColor Yellow
# app.kaniq.org is bound to zawaj-app-v4 (not zawaj-app)
& npx wrangler pages deploy dist --project-name=zawaj-app-v4 --branch=main --commit-dirty=true
if ($LASTEXITCODE -ne 0) {
    Write-Host "DEPLOY FAILED." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Deploy succeeded" -ForegroundColor Green

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  DONE - https://app.kaniq.org (zawaj-app-v4)" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

Read-Host "Press Enter to close"