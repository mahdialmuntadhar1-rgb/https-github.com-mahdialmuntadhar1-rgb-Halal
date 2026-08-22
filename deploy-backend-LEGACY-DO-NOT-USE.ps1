# =============================================================================
# LEGACY — DO NOT USE
# =============================================================================
# This script is FORBIDDEN for the current HALAL / ZAWAJ production deployment.
#
# If you run this script it will:
#   - DELETE the entire backend-mvp/ directory
#   - Restore PRE-HARDENING code from origin/codex/halal-workers-mvp
#   - Run REMOTE D1 migrations against production rafid-db
#   - Overwrite wrangler.toml (including missing app.kaniq.org CORS)
#   - Deploy an outdated Worker to halal-api-real
#
# Authoritative production deploy (human-authorized only):
#   cd backend-mvp
#   npx wrangler deploy
#
# Pages deploy: deploy-safe.ps1
#
# NEVER use this file for halal-api-real / rafid-db / app.kaniq.org.
# =============================================================================

$ErrorActionPreference = "Stop"
$root = "C:\Users\HB LAPTOP STORE\Documents\https-github.com-mahdialmuntadhar1-rgb-Halal"
$backendDir = Join-Path $root "backend-mvp"

function Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "[OK] $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "[FAIL] $msg" -ForegroundColor Red; Read-Host "Press Enter to exit"; exit 1 }

Set-Location $root
if ((git remote -v) -notmatch "-Halal") { Fail "Wrong repo." }

Step "Extracting backend-only files from codex/halal-workers-mvp"
if (Test-Path $backendDir) { Remove-Item $backendDir -Recurse -Force }
New-Item -ItemType Directory -Path $backendDir | Out-Null
New-Item -ItemType Directory -Path "$backendDir\src" | Out-Null
New-Item -ItemType Directory -Path "$backendDir\src\routes" | Out-Null
New-Item -ItemType Directory -Path "$backendDir\migrations" | Out-Null

$files = @(
    "src/worker.ts", "src/auth.ts", "src/db.ts",
    "src/routes/auth.ts", "src/routes/cafe.ts", "src/routes/conversations.ts",
    "src/routes/heroImages.ts", "src/routes/matches.ts", "src/routes/profile.ts", "src/routes/requests.ts",
    "migrations/0001_initial.sql", "migrations/0002_contract_endpoints.sql",
    "package.json"
)
foreach ($f in $files) {
    $dest = Join-Path $backendDir $f
    git show "origin/codex/halal-workers-mvp:$f" | Out-File -FilePath $dest -Encoding utf8
}
Ok "Backend files extracted to $backendDir"

Step "Writing wrangler.toml for standalone backend Worker"
$wranglerToml = @"
name = "halal-api-real"
main = "src/worker.ts"
compatibility_date = "2026-06-26"

[vars]
ENVIRONMENT = "production"
CORS_ORIGIN = "https://zawaj-app.pages.dev,https://main.zawaj-app.pages.dev"

[[d1_databases]]
binding = "DB"
database_name = "rafid-db"
database_id = "30febf83-135b-4888-8e5a-461105bb590a"

[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "halal-assets"
"@
$wranglerToml | Out-File -FilePath "$backendDir\wrangler.toml" -Encoding utf8
Ok "wrangler.toml written (Worker name: halal-api-real, DB: rafid-db)"

Step "Installing backend dependencies"
Set-Location $backendDir
npm install
if ($LASTEXITCODE -ne 0) { Fail "npm install failed" }
Ok "Dependencies installed"

Step "Checking D1 database rafid-db"
npx wrangler d1 list
Write-Host "Confirm 'rafid-db' appears above." -ForegroundColor Yellow
$confirm = Read-Host "Does rafid-db exist in that list? (y/n)"
if ($confirm -ne "y") { Fail "rafid-db not found. Stopping before any data changes." }

Step "Applying database migrations to rafid-db"
Write-Host "This will run migrations against the REMOTE production database." -ForegroundColor Yellow
$confirm = Read-Host "Type YES to apply migrations to rafid-db"
if ($confirm -ne "YES") { Fail "Migration cancelled by user." }

npx wrangler d1 execute rafid-db --remote --file=migrations/0001_initial.sql
if ($LASTEXITCODE -ne 0) { Fail "Migration 0001 failed" }
Ok "Migration 0001 applied"

if (Test-Path "migrations/0002_contract_endpoints.sql") {
    npx wrangler d1 execute rafid-db --remote --file=migrations/0002_contract_endpoints.sql
    if ($LASTEXITCODE -ne 0) { Fail "Migration 0002 failed" }
    Ok "Migration 0002 applied"
}

Step "Setting JWT_SECRET"
Write-Host "You'll be prompted to paste a secret. Use a long random string." -ForegroundColor Yellow
$generated = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
Write-Host "Suggested secret (copy this): $generated" -ForegroundColor Green
npx wrangler secret put JWT_SECRET
if ($LASTEXITCODE -ne 0) { Fail "Setting JWT_SECRET failed" }
Ok "JWT_SECRET set"

Step "Deploying halal-api-real Worker"
npx wrangler deploy
if ($LASTEXITCODE -ne 0) { Fail "Worker deploy failed" }
Ok "Worker deployed"

$workerUrl = "https://halal-api-real.mahdialmuntadhar1.workers.dev"

Step "Smoke testing live API"
$testEmail = "smoketest-$(Get-Random)@example.com"
$testPassword = "SmokeTest123456!"

Write-Host "Registering test user: $testEmail"
try {
    $registerResp = Invoke-RestMethod -Uri "$workerUrl/api/auth/register" -Method Post -ContentType "application/json" -Body (@{
        email = $testEmail
        password = $testPassword
        name = "Smoke Test"
    } | ConvertTo-Json)
    Ok "Register succeeded"
} catch {
    Fail "Register failed: $($_.Exception.Message)"
}

Write-Host "Logging in as test user"
try {
    $loginResp = Invoke-RestMethod -Uri "$workerUrl/api/auth/login" -Method Post -ContentType "application/json" -Body (@{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json)
    $token = $loginResp.token
    if (-not $token) { Fail "Login succeeded but no token returned" }
    Ok "Login succeeded, token received"
} catch {
    Fail "Login failed: $($_.Exception.Message)"
}

Write-Host "Making authenticated request with token"
try {
    $headers = @{ Authorization = "Bearer $token" }
    $profileResp = Invoke-RestMethod -Uri "$workerUrl/api/profile" -Method Get -Headers $headers
    Ok "Authenticated request succeeded"
} catch {
    Write-Host "[WARN] Authenticated request failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Set-Location $root
Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "  BACKEND DEPLOYED AND SMOKE-TESTED" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Worker URL: $workerUrl" -ForegroundColor Cyan

Read-Host "`nPress Enter to close"
