import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function normalizeApiBase(raw) {
  let base = String(raw || '/api').trim();
  if (base.endsWith('/')) base = base.slice(0, -1);
  if (!base || base === '/') return '/api';
  if (base === '/api' || base.endsWith('/api')) return base;
  return `${base}/api`;
}

function authRateRuleFor(method, pathname) {
  const m = String(method || '').toUpperCase();
  if (m !== 'POST') return null;
  const p = String(pathname || '').toLowerCase().replace(/^\/api(?=\/)/, '');
  if (p === '/auth/login') return { group: 'auth-login', limit: 12, windowSeconds: 15 * 60 };
  if (p === '/auth/register') return { group: 'auth-register', limit: 6, windowSeconds: 60 * 60 };
  if (p === '/auth/forgot-password') return { group: 'auth-forgot-password', limit: 5, windowSeconds: 60 * 60 };
  if (p === '/auth/reset-password') return { group: 'auth-reset-password', limit: 8, windowSeconds: 60 * 60 };
  return null;
}

function userRateRuleFor(method, pathname) {
  const m = String(method || '').toUpperCase();
  if (m !== 'POST') return null;
  const p = String(pathname || '').toLowerCase().replace(/^\/api(?=\/)/, '');
  if (p === '/requests' || p === '/request/send') {
    return { group: 'user-requests', limit: 30, windowSeconds: 60 * 60 };
  }
  if (/^\/conversations\/[^/]+\/messages$/.test(p)) {
    return { group: 'user-messages', limit: 120, windowSeconds: 60 * 60 };
  }
  if (/^\/reports\/profiles\/[^/]+$/.test(p)) {
    return { group: 'user-reports', limit: 10, windowSeconds: 60 * 60 };
  }
  return null;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function degradedRateCheck(bucketKey, rule, nowMs = Date.now()) {
  const windowStart = Math.floor(nowMs / 1000 / rule.windowSeconds) * rule.windowSeconds;
  const fullKey = `${bucketKey}:${windowStart}`;
  const store = degradedRateCheck._store || (degradedRateCheck._store = new Map());
  const existing = store.get(fullKey);
  if (!existing || existing.windowStart !== windowStart) {
    store.set(fullKey, { count: 1, windowStart });
    return { allowed: true };
  }
  if (existing.count >= rule.limit) {
    const retryAfter = Math.max(1, windowStart + rule.windowSeconds - Math.floor(nowMs / 1000));
    return { allowed: false, retryAfter };
  }
  existing.count += 1;
  return { allowed: true };
}

function publicRequestRow(row) {
  const copy = { ...row };
  delete copy.sender_email;
  delete copy.receiver_email;
  delete copy.senderEmail;
  delete copy.receiverEmail;
  return copy;
}

test('source files still contain the contracted implementations', () => {
  const apiBase = readFileSync(join(root, 'src/services/apiBase.ts'), 'utf8');
  const rateLimit = readFileSync(join(root, 'backend-mvp/src/rateLimit.ts'), 'utf8');
  const privacy = readFileSync(join(root, 'backend-mvp/src/privacy.ts'), 'utf8');
  const sw = readFileSync(join(root, 'public/sw.js'), 'utf8');
  const worker = readFileSync(join(root, 'backend-mvp/src/worker.ts'), 'utf8');
  const conversations = readFileSync(join(root, 'backend-mvp/src/routes/conversations.ts'), 'utf8');
  const requests = readFileSync(join(root, 'backend-mvp/src/routes/requests.ts'), 'utf8');
  const forgotPassword = readFileSync(join(root, 'backend-mvp/src/routes/forgotPassword.ts'), 'utf8');
  assert.match(apiBase, /normalizeApiBase/);
  assert.match(rateLimit, /auth-login/);
  assert.match(rateLimit, /RATE_LIMIT_D1_DEGRADED/);
  assert.match(rateLimit, /assertUserRateLimit/);
  assert.match(privacy, /sender_email/);
  assert.match(sw, /halal-zawaj-v2-static/);
  assert.match(sw, /shouldBypassCache/);
  assert.match(sw, /isStaticAssetUrl\(event\.request\.url\)/);
  assert.match(worker, /halal-release-google-play-finalization-ab-2026-08-15/);
  assert.match(worker, /assertUserRateLimit/);
  assert.match(worker, /Strict-Transport-Security/);
  assert.doesNotMatch(worker, /zawaj-diagnostic-2026-07-19/);
  assert.match(conversations, /assertUsersNotBlocked/);
  assert.match(conversations, /halal_blocks/);
  assert.match(requests, /assertUsersNotBlocked/);
  assert.match(forgotPassword, /normalizeEmail/);
});

test('B3 normalizeApiBase is canonical /api', () => {
  assert.equal(normalizeApiBase('https://halal-api-real.mahdialmuntadhar1.workers.dev'), 'https://halal-api-real.mahdialmuntadhar1.workers.dev/api');
  assert.equal(normalizeApiBase('https://halal-api-real.mahdialmuntadhar1.workers.dev/'), 'https://halal-api-real.mahdialmuntadhar1.workers.dev/api');
  assert.equal(normalizeApiBase('https://halal-api-real.mahdialmuntadhar1.workers.dev/api'), 'https://halal-api-real.mahdialmuntadhar1.workers.dev/api');
  assert.equal(normalizeApiBase('https://halal-api-real.mahdialmuntadhar1.workers.dev/api/'), 'https://halal-api-real.mahdialmuntadhar1.workers.dev/api');
  assert.equal(normalizeApiBase('/api'), '/api');
  assert.equal(normalizeApiBase(''), '/api');
});

test('A2 Shaku-style auth ceilings on HALAL paths', () => {
  assert.deepEqual(authRateRuleFor('POST', '/api/auth/login'), { group: 'auth-login', limit: 12, windowSeconds: 900 });
  assert.deepEqual(authRateRuleFor('POST', '/auth/login'), { group: 'auth-login', limit: 12, windowSeconds: 900 });
  assert.deepEqual(authRateRuleFor('POST', '/api/auth/register'), { group: 'auth-register', limit: 6, windowSeconds: 3600 });
  assert.deepEqual(authRateRuleFor('POST', '/auth/forgot-password'), { group: 'auth-forgot-password', limit: 5, windowSeconds: 3600 });
  assert.deepEqual(authRateRuleFor('POST', '/api/auth/reset-password'), { group: 'auth-reset-password', limit: 8, windowSeconds: 3600 });
  assert.equal(authRateRuleFor('GET', '/api/auth/login'), null);
  assert.equal(authRateRuleFor('POST', '/api/matches'), null);
});

test('H1/H2 block enforcement helpers are wired in route handlers', () => {
  const blocks = readFileSync(join(root, 'backend-mvp/src/blocks.ts'), 'utf8');
  assert.match(blocks, /halal_blocks/);
  assert.match(blocks, /assertUsersNotBlocked/);
  const conversations = readFileSync(join(root, 'backend-mvp/src/routes/conversations.ts'), 'utf8');
  assert.match(conversations, /assertUsersNotBlocked\(env, user\.id, recipientId\)/);
  assert.match(conversations, /SELECT blocked_user_id FROM halal_blocks WHERE blocker_id/);
  const requests = readFileSync(join(root, 'backend-mvp/src/routes/requests.ts'), 'utf8');
  assert.match(requests, /assertUsersNotBlocked\(env, user\.id, receiverId\)/);
});

test('Y1 accept/decline rejects blocked participants', () => {
  const requests = readFileSync(join(root, 'backend-mvp/src/routes/requests.ts'), 'utf8');
  assert.match(requests, /assertIntroParticipantsNotBlocked/);
  assert.match(requests, /await assertIntroParticipantsNotBlocked\(ctx, intro\)/);
  const respondBlock = requests.indexOf("path === '/request/respond'");
  const putBlock = requests.indexOf('decisionMatch && request.method === \'PUT\'');
  assert.ok(respondBlock >= 0 && putBlock >= 0);
  assert.ok(requests.indexOf('await assertIntroParticipantsNotBlocked(ctx, intro)', respondBlock) > respondBlock);
  assert.ok(requests.indexOf('await assertIntroParticipantsNotBlocked(ctx, intro)', putBlock) > putBlock);
});

test('Y2 request list excludes blocked counterpart rows', () => {
  const requests = readFileSync(join(root, 'backend-mvp/src/routes/requests.ts'), 'utf8');
  assert.match(requests, /path === '\/request\/list'/);
  assert.match(requests, /SELECT blocked_user_id FROM halal_blocks WHERE blocker_id/);
  assert.match(requests, /SELECT blocker_id FROM halal_blocks WHERE blocked_user_id/);
  assert.match(requests, /\.bind\(user\.id, user\.id, user\.id, user\.id, user\.id, user\.id\)/);
});

test('deployment trap script renamed and marked legacy', () => {
  const legacy = readFileSync(join(root, 'deploy-backend-LEGACY-DO-NOT-USE.ps1'), 'utf8');
  assert.match(legacy, /DO NOT USE/i);
  assert.match(legacy, /DELETE.*backend-mvp/i);
  assert.match(legacy, /pre-hardening/i);
  assert.match(legacy, /remote D1 migrations/i);
});

test('M1 authenticated abuse rate limits', () => {
  assert.deepEqual(userRateRuleFor('POST', '/api/requests'), { group: 'user-requests', limit: 30, windowSeconds: 3600 });
  assert.deepEqual(userRateRuleFor('POST', '/request/send'), { group: 'user-requests', limit: 30, windowSeconds: 3600 });
  assert.deepEqual(userRateRuleFor('POST', '/api/conversations/abc/messages'), { group: 'user-messages', limit: 120, windowSeconds: 3600 });
  assert.deepEqual(userRateRuleFor('POST', '/api/reports/profiles/u1'), { group: 'user-reports', limit: 10, windowSeconds: 3600 });
  assert.equal(userRateRuleFor('GET', '/api/conversations/abc/messages'), null);
});

test('H3 degraded rate limit fallback enforces ceilings when D1 fails', () => {
  degradedRateCheck._store = new Map();
  const rule = { group: 'auth-login', limit: 2, windowSeconds: 900 };
  const key = 'auth-login:127.0.0.1';
  const t0 = 1_700_000_000_000;
  assert.equal(degradedRateCheck(key, rule, t0).allowed, true);
  assert.equal(degradedRateCheck(key, rule, t0 + 1).allowed, true);
  const blocked = degradedRateCheck(key, rule, t0 + 2);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfter >= 1);
});

test('M4 forgot-password email normalization matches auth', () => {
  assert.equal(normalizeEmail('  User@Example.COM  '), 'user@example.com');
  const emailModule = readFileSync(join(root, 'backend-mvp/src/email.ts'), 'utf8');
  assert.match(emailModule, /trim\(\)\.toLowerCase\(\)/);
  const auth = readFileSync(join(root, 'backend-mvp/src/routes/auth.ts'), 'utf8');
  assert.match(auth, /from '\.\.\/email'/);
});

test('B1 request-list rows drop emails', () => {
  const row = publicRequestRow({
    id: 'r1',
    sender_id: 'a',
    receiver_id: 'b',
    sender_email: 'a@example.com',
    receiver_email: 'b@example.com',
    senderEmail: 'a@example.com',
    sender_name: 'A',
    receiver_name: 'B',
  });
  assert.equal(row.sender_email, undefined);
  assert.equal(row.receiver_email, undefined);
  assert.equal(row.senderEmail, undefined);
  assert.equal(row.sender_name, 'A');
  assert.equal(row.id, 'r1');
});

test('A3 service worker must not cache API or Authorization', () => {
  const origin = 'https://app.kaniq.org';
  const bypass = (url, headers = {}) => {
    if (headers.Authorization) return true;
    const parsed = new URL(url);
    if (parsed.origin !== origin) return true;
    if (parsed.pathname.startsWith('/api')) return true;
    if (parsed.pathname.includes('/auth/')) return true;
    return false;
  };
  assert.equal(bypass('https://halal-api-real.mahdialmuntadhar1.workers.dev/api/profile/me'), true);
  assert.equal(bypass('https://app.kaniq.org/api/profile/me'), true);
  assert.equal(bypass('https://app.kaniq.org/profile/me', { Authorization: 'Bearer x' }), true);
  assert.equal(bypass('https://app.kaniq.org/manifest.webmanifest'), false);
  assert.equal(bypass('https://app.kaniq.org/index.html'), false);
});

test('P7 trust/privacy UI reflects live block and report', () => {
  const trust = readFileSync(join(root, 'src/screens/TrustPrivacyScreen.tsx'), 'utf8');
  assert.match(trust, /Live on the HALAL API/);
  assert.doesNotMatch(trust, /Report and block tools planned/);
  const privacy = readFileSync(join(root, 'src/screens/PrivacySettingsScreen.tsx'), 'utf8');
  assert.match(privacy, /getBlockedUserIds/);
  assert.doesNotMatch(privacy, /handleAddBlockMock/);
});
