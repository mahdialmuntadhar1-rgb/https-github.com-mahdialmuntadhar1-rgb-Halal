# Google Play remaining actions (A5)

Code and package work is separate from Play Console operator work.

## Already in the app / repo (not Console)

| Item | Status |
| ---- | ------ |
| Application ID | `org.kaniq.zawaj` |
| versionName / versionCode | `1.0.2` / `3` on existing RC |
| Privacy Policy URL | https://app.kaniq.org/privacy-policy |
| Terms URL | https://app.kaniq.org/terms-of-service |
| In-app account deletion | Settings → Delete Account → live `DELETE /api/auth/account` |
| Network security | HTTPS only, `allowBackup=false` |
| Reset-password App Link intent | `https://app.kaniq.org/reset-password` (B6). Digital Asset Links fingerprint still required for autoVerify |

## Manual Play Console actions (operator)

1. Upload the **existing** signed AAB `android/app/build/outputs/bundle/release/app-release.aab` (1.0.2 / 3) to Internal Testing. Do not rebuild unless that file is missing.
2. Store listing: short description, full description, **feature graphic 1024×500**, **at least 2 phone screenshots**.
3. Data Safety form — declare only what the live app does:
   - Collected: email, name, age/birth year, gender, location, religion/sect/ethnicity, education, occupation, bio, photo URL, messages after accept, introduction requests, reports/blocks
   - **Not collected:** phone (form may accept it; API does not persist), payment, health, device advertising ID, analytics SDK
   - Shared with: Cloudflare (Workers/D1/R2/Pages), Resend (password-reset email only)
   - Encrypted in transit: yes
   - Users can request deletion: yes (immediate cascade)
4. Content rating questionnaire (dating / social — answer honestly; 18+).
5. Privacy Policy URL in listing and Data Safety.
6. Support email: `support@kaniq.org` (mailbox must exist and be monitored).
7. Contact / developer address as required by Play.
8. After Internal Testing device smoke: Closed Testing, then Production.

## Screenshots / feature graphic

These are **store assets**, not code. Capture from https://app.kaniq.org or the existing 1.0.2 APK. Do not invent product screens in the repo unless design provides them.

## App Links verification (after deploy)

Host `https://app.kaniq.org/.well-known/assetlinks.json` with package `org.kaniq.zawaj` and the **release** signing-cert SHA-256 (from `apksigner` / Play App signing). Do not publish a placeholder fingerprint.
