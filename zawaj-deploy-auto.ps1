<#
.SYNOPSIS
    ZAWAJ HALAL - Auto Brown-Login Deployment
#>

$ErrorActionPreference = "Stop"

# Keep window open on error
trap {
    Write-Host "`n`n=== ERROR ===" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`nPress Enter to exit..." -ForegroundColor Yellow
    Read-Host
    exit 1
}

param(
    [string]$ProjectPath = "C:\Users\HB LAPTOP STORE\Documents\https-github.com-mahdialmuntadhar1-rgb-Halal",
    [string]$BackendUrl = "https://halal-api-06251723.mahdialmuntadhar1.workers.dev",
    [string]$PagesProjectName = "zawaj-app",
    [string]$BranchName = "brown-login-recovery"
)

Clear-Host
Write-Host "ZAWAJ HALAL - BROWN LOGIN DEPLOYMENT" -ForegroundColor DarkYellow
Write-Host "=====================================" -ForegroundColor DarkYellow

$logFile = "$env:TEMP\zawaj-deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
"START: $(Get-Date)" | Out-File $logFile

function Log($msg, $color = "White") {
    $ts = Get-Date -Format "HH:mm:ss"
    $line = "[$ts] $msg"
    Add-Content -Path $logFile -Value $line
    Write-Host $line -ForegroundColor $color
}

Log "Project: $ProjectPath" "Gray"
Log "Backend: $BackendUrl" "Gray"
Log ""

# STEP 1: VALIDATE
Log "STEP 1: Validating..." "Cyan"
try { $v = node --version 2>$null; Log "  [OK] Node $v" "Green" } catch { throw "Node.js not found" }
try { $v = npm --version 2>$null; Log "  [OK] npm $v" "Green" } catch { throw "npm not found" }
try { $v = git --version 2>$null; Log "  [OK] Git" "Green" } catch { throw "Git not found" }
try { $v = npx wrangler --version 2>$null; Log "  [OK] Wrangler $v" "Green" } catch { 
    Log "  Installing Wrangler..." "Yellow"
    npm install -g wrangler 2>&1 | Out-Null
    Log "  [OK] Wrangler installed" "Green"
}
if (!(Test-Path $ProjectPath)) { throw "Project path NOT FOUND: $ProjectPath" }
Log "  [OK] Project path" "Green"

Set-Location $ProjectPath
if (!(git rev-parse --git-dir 2>$null)) { throw "Not a git repo" }
Log "  [OK] Git repo" "Green"

# STEP 2: USE CURRENT FILES
Log ""
Log "STEP 2: Using current files..." "Cyan"
$status = git status --short 2>$null
if ($status) {
    Log "  Uncommitted changes:" "Yellow"
    $status -split "`n" | Where-Object { $_.Trim() } | ForEach-Object { Log "    $_" "DarkYellow" }
    Log "  Keeping them" "Green"
} else {
    Log "  No uncommitted changes" "Yellow"
}

# STEP 3: FIX BACKEND
Log ""
Log "STEP 3: Fixing backend URL..." "Cyan"
$apiFile = "$ProjectPath\src\services\apiClient.ts"
if (Test-Path $apiFile) {
    $content = Get-Content $apiFile -Raw
    $fixed = $content -replace 'https?://[^\s"''`]+?\.workers\.dev', $BackendUrl
    if ($fixed -ne $content) {
        $fixed | Out-File $apiFile -Encoding UTF8
        Log "  [OK] Fixed apiClient.ts" "Green"
    } else {
        Log "  [OK] apiClient.ts already correct" "Green"
    }
}

$envFile = "$ProjectPath\.env.production"
if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    $fixed = $content -replace 'VITE_API_URL=.*', "VITE_API_URL=$BackendUrl"
    $fixed | Out-File $envFile -Encoding UTF8
    Log "  [OK] Fixed .env.production" "Green"
}

# STEP 4: BUILD
Log ""
Log "STEP 4: Building..." "Cyan"
if (Test-Path "$ProjectPath\dist") { Remove-Item "$ProjectPath\dist" -Recurse -Force -ErrorAction SilentlyContinue }
if (Test-Path "$ProjectPath\build") { Remove-Item "$ProjectPath\build" -Recurse -Force -ErrorAction SilentlyContinue }

Log "  npm install..." "Gray"
$install = npm install 2>&1
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
Log "  [OK] Dependencies" "Green"

Log "  npm run build..." "Gray"
$build = npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Log "BUILD FAILED:" "Red"
    $build | ForEach-Object { Log "  $_" "Red" }
    throw "Build failed"
}

$outputDir = $null
if (Test-Path "$ProjectPath\dist") { $outputDir = "dist" }
elseif (Test-Path "$ProjectPath\build") { $outputDir = "build" }
if (!$outputDir) { throw "No dist/ or build/ folder!" }

$fileCount = (Get-ChildItem "$ProjectPath\$outputDir" -Recurse -File).Count
Log "  [OK] Build: $outputDir/ ($fileCount files)" "Green"

# STEP 5: DEPLOY
Log ""
Log "STEP 5: Deploying..." "Cyan"
$whoami = npx wrangler whoami 2>&1
if ($whoami -match "not authenticated|login required") {
    Log "  Wrangler login needed..." "Yellow"
    npx wrangler login 2>&1 | Out-Null
    Log "  Press Enter after login..." "Yellow"
    Read-Host
}

Log "  Deploying to $PagesProjectName..." "Gray"
$deploy = npx wrangler pages deploy $outputDir --project-name=$PagesProjectName --branch=main 2>&1
$deploy | ForEach-Object { "DEPLOY: $_" | Add-Content $logFile }

$deployUrl = $deploy | Select-String "https://[a-f0-9]+\.$PagesProjectName\.pages\.dev" | ForEach-Object { $_.Matches.Value } | Select-Object -First 1
$mainUrl = "https://main.$PagesProjectName.pages.dev"

if ($deployUrl) { Log "  [OK] Deployed: $deployUrl" "Green" }
else { Log "  [WARN] URL not in output" "Yellow" }

# STEP 6: VERIFY
Log ""
Log "STEP 6: Verifying..." "Cyan"
Start-Sleep -Seconds 10
try {
    $resp = Invoke-WebRequest -Uri $mainUrl -Method GET -TimeoutSec 30 -UseBasicParsing
    if ($resp.StatusCode -eq 200) {
        Log "  [OK] Site LIVE - HTTP 200" "Green"
        if ($resp.Content -match "brown|8B4513|saddlebrown|chocolate") {
            Log "  [OK] BROWN THEME FOUND!" "Green"
        }
    }
} catch {
    Log "  [WARN] Verify: $($_.Exception.Message)" "Yellow"
}

# STEP 7: GIT SAVE
Log ""
Log "STEP 7: Git save..." "Cyan"
$current = git branch --show-current 2>$null
if ($current -ne $BranchName) {
    $exists = git branch --list $BranchName 2>$null
    if ($exists) { git checkout $BranchName 2>$null }
    else { git checkout -b $BranchName 2>$null }
    Log "  Switched to $BranchName" "Green"
}

git add -A 2>$null
$diff = git diff --cached --name-only 2>$null
if ($diff) {
    git commit -m "feat: brown-login deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>$null
    Log "  [OK] Committed" "Green"
    git push -u origin $BranchName 2>&1 | Out-Null
    Log "  [OK] Pushed" "Green"
} else {
    Log "  Nothing to commit" "Yellow"
}

# DONE
Log ""
Log "================================" "Cyan"
Log "  DEPLOYMENT COMPLETE" "Green"
Log "================================" "Cyan"
Log "  URL:  $mainUrl" "Green"
if ($deployUrl) { Log "  Deploy: $deployUrl" "Green" }
Log "  Log:  $logFile" "Gray"
Log ""

$open = Read-Host "Open site? (Y/n)"
if ($open -ne 'n') { Start-Process $mainUrl }

Log ""
Log "Press Enter to close..." "Gray"
Read-Host