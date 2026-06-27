# Phase 12 - Complete Bug Report

## Critical

### Deployed backend is still demo/mock and does not match the local Worker
- Location: Live API `https://halal-api-06251723.mahdialmuntadhar1.workers.dev`; local `src/worker.ts`, `src/routes/*`
- Description: The live API returns `HALAL Cloudflare Backend`, exposes `/api/health`, returns array-shaped `/hero-images`, and serves public mock profiles. The local Worker returns `HALAL Worker API`, uses `{ success: true, heroImages: [...] }`, and requires authentication for `/matches`.
- Impact: The deployed beta is not the audited local production Worker. Security, persistence, privacy, and endpoint contracts cannot be trusted until deployment parity is restored.
- Recommended fix: Deploy the current Worker from this repo, then rerun production smoke tests against the exact beta URLs before exposing beta users.

### Authentication accepts invalid credentials and returns a fixed demo token
- Location: Live API `/auth/login`, `/auth/register`; local intended code in `src/routes/auth.ts`, `src/auth.ts`
- Description: Register returned `cloudflare_demo_token`; login with the wrong password also returned 200 and the same token.
- Impact: Authentication is non-functional in production. Any beta user/session can be impersonated if the demo token path remains active.
- Recommended fix: Remove deployed demo auth, require DB-backed users, bcrypt password verification, real JWT signing, and reject invalid passwords with 401.

### Protected profile and match data are publicly accessible
- Location: Live API `/matches`, `/profile/me`
- Description: `/matches` returns profile data without auth. `/profile/me` returns a profile with only `Bearer cloudflare_demo_token`.
- Impact: Privacy promises around verified members, photo controls, and private profiles are not enforceable.
- Recommended fix: Require authenticated, validated JWT sessions on all member endpoints; remove public mock profile responses from production.

### Production CORS allows any origin
- Location: Live API responses and preflight; local `src/worker.ts`, `wrangler.toml`
- Description: Preflight from `https://evil.example` returned `Access-Control-Allow-Origin: *`. Local `wrangler.toml` also has stale `CORS_ORIGIN = "https://zawaj-app.pages.dev"` instead of the live frontend.
- Impact: If credential/session handling is added later, this creates unnecessary cross-origin exposure and weakens browser-side protections.
- Recommended fix: Set `CORS_ORIGIN` to `https://halal-match-06251723.pages.dev` only, reject unknown origins, and keep staging/prod origins explicit.

### Main user journey is demo-auto-approved, not real mutual acceptance
- Location: Live frontend Match Explorer; local `src/components/ChatSimulator.tsx`, `src/routes/requests.ts`, `src/routes/conversations.ts`
- Description: Live “Send Request” changes to “Request Pending Review” and auto-approves after 2.5 seconds. The required receiver acceptance journey is not actually exercised for two real users.
- Impact: MVP cannot verify receive request, accept request, unlock conversation, or persistence as a real marriage-introduction workflow.
- Recommended fix: Remove auto-approval from production, add receiver request inbox UI, and test two-user request acceptance through persistent backend records.

## High

### Source and deployed frontend are out of sync
- Location: Live frontend; local `src/App.tsx`
- Description: Live unauthenticated users see public landing/demo flows. Local `src/App.tsx` would render `AuthScreen` when unauthenticated.
- Impact: Developers cannot safely fix or audit production behavior from the current local source without first reconciling deployment state.
- Recommended fix: Identify the exact deployed frontend commit/build, reconcile it into the repo, and redeploy from a clean branch.

### Visible production demo mode remains enabled
- Location: Live frontend sign-in panel
- Description: “Proceed to Demo Sandbox Mode” is visible on the public beta URL and unlocks matches.
- Impact: Users can bypass real registration and interact with misleading “Live Matches Mode Active” screens.
- Recommended fix: Disable demo mode in production builds and gate it behind a non-production environment flag.

### Ordinary members have no visible receiver inbox
- Location: `src/App.tsx`, `src/routes/requests.ts`, `src/screens/AdminScreen.tsx`
- Description: Backend has `/request/list`, but frontend only loads request lists for admins through `/admin/requests`.
- Impact: A real receiver cannot accept/decline a request through the member UI, blocking the required journey.
- Recommended fix: Add a member request inbox connected to `/request/list` and `/request/respond`.

### Multiple visible UI actions are placeholders or 501 paths
- Location: `src/lib/apiClient.ts`, `src/screens/CommunityScreen.tsx`, `src/screens/AdminScreen.tsx`, `src/screens/AccountPlaceholderScreen.tsx`, `src/components/ChatSimulator.tsx`
- Description: Community posts, likes, comments, post reports, moderation, hero image reorder, account/security portal, chat block/report are simulated or throw `501`.
- Impact: The MVP violates the “no dead buttons/no placeholder features” readiness requirement.
- Recommended fix: Either implement each backend path fully or hide these controls from beta.

### Account and verification screen makes simulated security claims
- Location: `src/screens/AccountPlaceholderScreen.tsx`
- Description: The screen contains “Mock Portal,” simulated identity verification, simulated SMS, simulated upgrade, and backend-required warnings.
- Impact: Beta users may misunderstand verification/account state, and trust language is ahead of actual capability.
- Recommended fix: Remove the screen from beta navigation or convert it to real account/security functionality.

### JWT stored in localStorage
- Location: `src/lib/apiClient.ts`
- Description: Auth token is stored under `halal.authToken` in `window.localStorage`.
- Impact: Any XSS can steal bearer tokens. This is high risk for a privacy-sensitive marriage app.
- Recommended fix: Prefer secure, HttpOnly, SameSite cookies or short-lived access tokens with refresh protections.

### No rate limiting or login abuse controls
- Location: Live API; local `src/routes/auth.ts`, schema
- Description: No rate-limit storage or lockout checks were found; live login accepts any password.
- Impact: Credential stuffing and automated account creation are unbounded.
- Recommended fix: Add per-IP and per-account limits, login attempt tracking, cooldowns, and abuse telemetry.

## Medium

### Document language metadata is wrong for Arabic/Kurdish
- Location: Live frontend root document and app container
- Description: Arabic and Kurdish pages render with RTL container direction, but `document.documentElement.lang` remains `en` and root `dir` is empty.
- Impact: Screen readers, browser translation, search metadata, and accessibility tooling receive wrong language context.
- Recommended fix: Update `document.documentElement.lang` and `dir` whenever locale changes.

### Bundle is large and not code-split
- Location: Vite build output
- Description: Build succeeded, but main JS is 831.75 kB minified, 194.90 kB gzip, and Vite warns chunks exceed 500 kB.
- Impact: Slower first load on mobile networks and unnecessary code for routes not currently viewed.
- Recommended fix: Add route-level dynamic imports and split admin/community/chat code into separate chunks.

### Some privacy/report/block actions only change local UI state
- Location: `src/components/ChatSimulator.tsx`
- Description: Blocking and reporting active chat members are local simulated state and do not persist to backend.
- Impact: Safety tools appear functional but do not protect users across sessions/devices.
- Recommended fix: Connect block/report to backend tables and reload from persistent state.

### Form validation is incomplete across profile/account surfaces
- Location: `src/components/OnboardingWizard.tsx`, `src/routes/profile.ts`, `src/screens/AccountPlaceholderScreen.tsx`
- Description: Onboarding validates age, profession, bio, and looking-for text, but account phone/email forms are simulated and profile fields like governorate/religion/sect are not strongly enumerated on backend beyond DB checks.
- Impact: Users can encounter late DB errors or simulated success instead of friendly validation.
- Recommended fix: Share frontend/backend schemas and validate all enum, phone, email, age, and profile fields before submit.

### API contract mismatch for hero images
- Location: Live `/hero-images`; local `src/lib/apiClient.ts`, `src/routes/heroImages.ts`
- Description: Live endpoint returns an array with `url/order/isActive`; local client expects `{ heroImages: [...] }` from current Worker.
- Impact: Redeploying one side without the other can break landing images/admin hero management.
- Recommended fix: Freeze a versioned frontend/backend contract and add contract tests in CI.

### Admin moderation endpoint mismatch
- Location: `src/lib/apiClient.ts`, `src/routes/profile.ts`, `src/screens/AdminScreen.tsx`
- Description: Frontend `moderateContent()` throws 501; backend only supports resolving reports, not hide/delete moderation actions.
- Impact: Admin “Hide/Delete” button cannot perform the stated action.
- Recommended fix: Align admin UI with resolve-only behavior or implement hide/delete endpoints.

## Low

### Package metadata is generic
- Location: `package.json`
- Description: Package name is `react-example`, version `0.0.0`.
- Impact: Build/deploy logs are harder to trace for HALAL production.
- Recommended fix: Rename package to a HALAL-specific name and set meaningful versioning.

### Local repo contains backup files
- Location: `src/main.tsx.BACKUP-*`, `src/components/Header.tsx.BACKUP-*`
- Description: Backup files are present in source tree.
- Impact: Noise in audits and potential accidental deployment/import confusion.
- Recommended fix: Move backups outside source or delete after confirming they are no longer needed.

### Mobile layout passed basic overflow checks, but deeper flows need authenticated visual QA
- Location: Live frontend, tested widths 320, 375, 390, 414, 768, 1024
- Description: No horizontal overflow or clipped text was detected on the landing/demo state in the automated pass.
- Impact: Risk remains for modals, chat, admin, and long localized text states.
- Recommended fix: Re-run viewport screenshots after production auth and real user flows are restored.

# Phase 13 - MVP Score

- Frontend: 55/100
- Backend: 35/100
- Authentication: 10/100
- Security: 20/100
- Database: 65/100
- Performance: 65/100
- Accessibility: 55/100
- UX: 50/100
- UI: 70/100
- Mobile: 75/100
- Overall MVP: 42%

# Phase 14 - Deployment Plan

## Chunk 1 - Critical
- Reconcile deployed frontend/backend with the current HALAL repo.
- Remove production demo/mock backend behavior.
- Deploy DB-backed auth, real JWT/session validation, and protected member endpoints.
- Restrict CORS to the real frontend domain.
- Remove production auto-approval and require real receiver/admin acceptance.
- Run production smoke tests for register, login, profile, matches, request, accept, conversation, logout, login persistence.

## Chunk 2 - High
- Disable public demo sandbox mode on production.
- Add member request inbox and accept/decline UI.
- Remove or implement all visible 501/dead actions.
- Replace AccountPlaceholderScreen with real account/security flows or hide it from beta.
- Add rate limiting and abuse controls for auth and request endpoints.
- Move token handling away from persistent localStorage.

## Chunk 3 - Medium
- Fix document `lang` and `dir` metadata for Arabic, Kurdish, and English.
- Align frontend/backend API contracts for hero images, reports, moderation, conversations, and community.
- Persist chat block/report actions.
- Add shared validation schemas for profile/account forms.
- Split large frontend bundle by route/admin/chat/community surfaces.

## Chunk 4 - Polish
- Rename package metadata and clean backup files.
- Add CI checks for build, TypeScript, production smoke, API contract tests, and basic accessibility.
- Re-run full responsive visual QA at 320, 375, 390, 414, 768, and 1024 after real auth is restored.
- Review final Arabic/Kurdish/English translations for consistency and tone.
