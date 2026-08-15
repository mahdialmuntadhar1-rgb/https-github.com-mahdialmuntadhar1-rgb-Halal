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
  assert.match(apiBase, /normalizeApiBase/);
  assert.match(rateLimit, /auth-login/);
  assert.match(privacy, /sender_email/);
  assert.match(sw, /halal-zawaj-v2-static/);
  assert.match(sw, /shouldBypassCache/);
  assert.match(sw, /isStaticAssetUrl\(event\.request\.url\)/);
  assert.match(worker, /halal-release-google-play-finalization-ab-2026-08-15/);
  assert.doesNotMatch(worker, /zawaj-diagnostic-2026-07-19/);
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
