$ErrorActionPreference = "Stop"
$root = "C:\Users\HB LAPTOP STORE\Documents\https-github.com-mahdialmuntadhar1-rgb-Halal"
$backendDir = Join-Path $root "backend-mvp"

function Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "[OK] $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "[FAIL] $msg" -ForegroundColor Red; Read-Host "Press Enter to exit"; exit 1 }

Set-Location $root
if ((git remote -v) -notmatch "-Halal") { Fail "Wrong repo." }

# ===== 1. Backup files we're about to touch =====
Step "Backing up files before edits"
$ts = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item "src\services\apiClient.ts" "src\services\apiClient.ts.backup-$ts" -Force
Copy-Item "src\App.tsx" "src\App.tsx.backup-$ts" -Force
Ok "Backups created"

# ===== 2. Fix getIsDemoMode() - the actual root cause bug =====
Step "Fixing getIsDemoMode() to genuinely return false"
$apiClient = Get-Content "src\services\apiClient.ts" -Raw
$oldDemoFn = @"
export function getIsDemoMode(): boolean {
  // FORCED REAL MODE - always use backend API
  return true;
}
"@
$newDemoFn = @"
export function getIsDemoMode(): boolean {
  // Real backend mode - forced false so all API calls hit the live Worker
  return false;
}
"@
if ($apiClient -match [regex]::Escape($oldDemoFn)) {
    $apiClient = $apiClient.Replace($oldDemoFn, $newDemoFn)
    Ok "getIsDemoMode() fixed"
} else {
    Fail "Could not find exact getIsDemoMode() block - file may have changed. Aborting to avoid a bad edit."
}

# ===== 3. Fix login() to use email instead of identifier =====
Step "Aligning login() field name with backend (identifier -> email)"
$oldLoginCall = "body: JSON.stringify({ identifier, password }),"
$newLoginCall = "body: JSON.stringify({ email: identifier, password }),"
if ($apiClient -match [regex]::Escape($oldLoginCall)) {
    $apiClient = $apiClient.Replace($oldLoginCall, $newLoginCall)
    Ok "login() field name fixed (sends 'email' key, accepts identifier as email input)"
} else {
    Write-Host "[WARN] login() body pattern not found - may already be correct, continuing" -ForegroundColor Yellow
}

$apiClient | Set-Content "src\services\apiClient.ts" -Encoding utf8
Ok "apiClient.ts written"

# ===== 4. Write .env.production with real API URL =====
Step "Writing .env.production"
"VITE_API_URL=https://halal-api-real.mahdialmuntadhar1.workers.dev/api" | Out-File "$root\.env.production" -Encoding utf8
Ok ".env.production written"

# ===== 5. Extract remaining backend routes (profile, matches, etc.) not yet deployed =====
Step "Extracting full route set from codex/halal-workers-mvp into backend-mvp"
$routeFiles = @(
    "src/routes/profile.ts", "src/routes/matches.ts", "src/routes/cafe.ts",
    "src/routes/requests.ts", "src/routes/conversations.ts", "src/routes/heroImages.ts",
    "src/routes/auth.ts", "src/auth.ts", "src/db.ts", "src/worker.ts"
)
foreach ($f in $routeFiles) {
    $dest = Join-Path $backendDir $f
    git show "origin/codex/halal-workers-mvp:$f" | Out-File -FilePath $dest -Encoding utf8
}
Ok "All backend route files refreshed"

# ===== 6. Redeploy the complete Worker =====
Step "Redeploying halal-api-real with full route set"
Set-Location $backendDir
npx wrangler deploy
if ($LASTEXITCODE -ne 0) { Fail "Worker redeploy failed" }
Ok "Worker redeployed with all routes"

# ===== 7. Verify /auth/forgot-password status (known gap) =====
Write-Host "`n[NOTE] /auth/forgot-password does NOT exist in routes/auth.ts." -ForegroundColor Yellow
Write-Host "[NOTE] Password reset will fail until this route is added. Flagging for a separate follow-up." -ForegroundColor Yellow

# ===== 8. Build and deploy frontend =====
Step "Building and deploying frontend"
Set-Location $root
Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue
npm run build
if ($LASTEXITCODE -ne 0) { Fail "Frontend build failed" }
Ok "Frontend built"

npx wrangler pages deploy dist --project-name=zawaj-app --branch=main --commit-dirty=true
if ($LASTEXITCODE -ne 0) { Fail "Frontend deploy failed" }
Ok "Frontend deployed"

# ===== 9. End-to-end live test against the real deployed site's backend =====
Step "End-to-end test: register + login against live backend"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$workerUrl = "https://halal-api-real.mahdialmuntadhar1.workers.dev"
$testEmail = "e2e-$(Get-Random)@example.com"
$testPassword = "E2ETest123456!"

try {
    $reg = Invoke-RestMethod -Uri "$workerUrl/api/auth/register" -Method Post -ContentType "application/json" -Body (@{ email = $testEmail; password = $testPassword } | ConvertTo-Json)
    Ok "Register OK - user id: $($reg.user.id)"
} catch { Fail "Register failed: $($_.Exception.Message)" }

try {
    $login = Invoke-RestMethod -Uri "$workerUrl/api/auth/login" -Method Post -ContentType "application/json" -Body (@{ email = $testEmail; password = $testPassword } | ConvertTo-Json)
    Ok "Login OK - token received"
} catch { Fail "Login failed: $($_.Exception.Message)" }

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "  REAL AUTH WIRED AND DEPLOYED" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Frontend: https://main.zawaj-app.pages.dev" -ForegroundColor Cyan
Write-Host "Backend:  $workerUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "STILL TODO (not done by this script):" -ForegroundColor Yellow
Write-Host "  - Password reset (/auth/forgot-password route missing)" -ForegroundColor Yellow
Write-Host "  - Registration only stores email/password - full profile fields" -ForegroundColor Yellow
Write-Host "    (name, governorate, age, phone) are NOT saved yet - needs" -ForegroundColor Yellow
Write-Host "    a follow-up to route them into halal_profiles on register." -ForegroundColor Yellow
Write-Host "  - Admin panel routing" -ForegroundColor Yellow
Write-Host "  - Post-login redirect to homepage vs onboarding" -ForegroundColor Yellow
Write-Host "  - Seed demo profiles" -ForegroundColor Yellow

Read-Host "`nPress Enter to close"