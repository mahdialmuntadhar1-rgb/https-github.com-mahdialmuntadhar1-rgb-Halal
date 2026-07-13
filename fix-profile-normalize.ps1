$ErrorActionPreference = "Stop"
$root = "C:\Users\HB LAPTOP STORE\Documents\https-github.com-mahdialmuntadhar1-rgb-Halal"

function Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "[OK] $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "[FAIL] $msg" -ForegroundColor Red; Read-Host "Press Enter to exit"; exit 1 }

Set-Location $root
if ((git remote -v) -notmatch "-Halal") { Fail "Wrong repo." }

$ts = Get-Date -Format "yyyyMMdd-HHmmss"

Step "Backing up App.tsx"
Copy-Item "src\App.tsx" "src\App.tsx.backup-$ts" -Force
Ok "Backup created"

$content = Get-Content "src\App.tsx" -Raw

# ===== Fix 1: handleAuthSuccess normalization =====
Step "Patching handleAuthSuccess"
$old1 = "let currentProfile = profile;"
$new1 = @"
let currentProfile = profile;
      currentProfile = {
        ...currentProfile,
        name: currentProfile.name || '',
        age: currentProfile.age || 18,
        languages: currentProfile.languages || [],
        values: currentProfile.values || [],
        country: currentProfile.country || 'Iraq',
        governorate: currentProfile.governorate || '',
        religion: currentProfile.religion || '',
        ethnicity: currentProfile.ethnicity || '',
        education: currentProfile.education || '',
        profession: currentProfile.profession || '',
        photoPrivacy: currentProfile.photoPrivacy || 'visible',
        savedMatches: currentProfile.savedMatches || [],
      };
"@

if ($content -notmatch [regex]::Escape($old1)) {
    Fail "Could not find 'let currentProfile = profile;' - file may have changed. Aborting."
}
$occurrences1 = ([regex]::Matches($content, [regex]::Escape($old1))).Count
if ($occurrences1 -ne 1) {
    Fail "Expected exactly 1 occurrence of the currentProfile line, found $occurrences1. Aborting to avoid a bad edit."
}
$content = $content.Replace($old1, $new1) 
Ok "handleAuthSuccess patched"

# ===== Fix 2: initial session load normalization =====
Step "Patching initial session-load useEffect"
$old2 = @"
          const [profile, matchesResult, convs] = await Promise.all([
            apiClient.getCurrentUser(),
            apiClient.getMatches(),
            apiClient.getConversations()
          ]);
          setUserProfile(profile);
"@
$new2 = @"
          const [rawProfile, matchesResult, convs] = await Promise.all([
            apiClient.getCurrentUser(),
            apiClient.getMatches(),
            apiClient.getConversations()
          ]);
          const profile = {
            ...rawProfile,
            name: rawProfile.name || '',
            age: rawProfile.age || 18,
            languages: rawProfile.languages || [],
            values: rawProfile.values || [],
            country: rawProfile.country || 'Iraq',
            governorate: rawProfile.governorate || '',
            religion: rawProfile.religion || '',
            ethnicity: rawProfile.ethnicity || '',
            education: rawProfile.education || '',
            profession: rawProfile.profession || '',
            photoPrivacy: rawProfile.photoPrivacy || 'visible',
            savedMatches: rawProfile.savedMatches || [],
          };
          setUserProfile(profile);
"@

if ($content -notmatch [regex]::Escape($old2)) {
    Fail "Could not find the initial session-load block - file may have changed. Aborting."
}
$content = $content.Replace($old2, $new2)
Ok "Initial session-load useEffect patched"

$content | Set-Content "src\App.tsx" -Encoding utf8
Ok "App.tsx written"

Step "Verifying edits landed"
$verify = Get-Content "src\App.tsx" -Raw
if (($verify -match "photoPrivacy: currentProfile.photoPrivacy") -and ($verify -match "photoPrivacy: rawProfile.photoPrivacy")) {
    Ok "Both normalization blocks confirmed present"
} else {
    Fail "Verification failed - one or both edits did not land as expected"
}

Step "Building frontend"
Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue
npm run build
if ($LASTEXITCODE -ne 0) { Fail "Frontend build failed" }
Ok "Build succeeded"

Step "Deploying frontend"
npx wrangler pages deploy dist --project-name=zawaj-app --branch=main --commit-dirty=true
if ($LASTEXITCODE -ne 0) { Fail "Frontend deploy failed" }
Ok "Deployed"

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "  DONE - profile normalization applied and deployed" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Now test: https://main.zawaj-app.pages.dev" -ForegroundColor Cyan
Write-Host "Register a NEW account and confirm it no longer goes blank." -ForegroundColor Cyan

Read-Host "`nPress Enter to close"