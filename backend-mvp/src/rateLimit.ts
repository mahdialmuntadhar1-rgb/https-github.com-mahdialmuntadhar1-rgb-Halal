import { Env } from './db';

export type RateRule = {
  group: string;
  limit: number;
  windowSeconds: number;
};

export type AuthRateRule = RateRule;
export type UserRateRule = RateRule;

const degradedBuckets = new Map<string, { count: number; windowStart: number }>();

/**
 * Shaku Maku auth ceilings, adapted to HALAL paths (with or without /api).
 * login 12 / 15m · register 6 / 60m · forgot 5 / 60m · reset 8 / 60m
 */
export function authRateRuleFor(method: string, pathname: string): AuthRateRule | null {
  const m = String(method || '').toUpperCase();
  if (m !== 'POST') return null;
  const p = String(pathname || '').toLowerCase().replace(/^\/api(?=\/)/, '');

  if (p === '/auth/login') return { group: 'auth-login', limit: 12, windowSeconds: 15 * 60 };
  if (p === '/auth/register') return { group: 'auth-register', limit: 6, windowSeconds: 60 * 60 };
  if (p === '/auth/forgot-password') return { group: 'auth-forgot-password', limit: 5, windowSeconds: 60 * 60 };
  if (p === '/auth/reset-password') return { group: 'auth-reset-password', limit: 8, windowSeconds: 60 * 60 };
  return null;
}

/** Authenticated abuse ceilings keyed by user id (not client-supplied parameters). */
export function userRateRuleFor(method: string, pathname: string): UserRateRule | null {
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

export function clientIp(request: Request): string {
  const forwarded =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    request.headers.get('X-Real-IP') ||
    'unknown';
  return String(forwarded).split(',')[0].trim() || 'unknown';
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function currentWindowStart(windowSeconds: number): number {
  return Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
}

function pruneDegradedBuckets(nowWindowStart: number, windowSeconds: number): void {
  if (degradedBuckets.size <= 256) return;
  for (const [key, value] of degradedBuckets) {
    if (value.windowStart + windowSeconds < nowWindowStart) degradedBuckets.delete(key);
  }
}

/** Per-isolate fallback when D1 is unavailable — same limits, observable via logs. */
export function degradedRateCheck(
  bucketKey: string,
  rule: RateRule,
  nowMs = Date.now(),
): { allowed: boolean; retryAfter?: number } {
  const windowStart = Math.floor(nowMs / 1000 / rule.windowSeconds) * rule.windowSeconds;
  const fullKey = `${bucketKey}:${windowStart}`;
  pruneDegradedBuckets(windowStart, rule.windowSeconds);

  const existing = degradedBuckets.get(fullKey);
  if (!existing || existing.windowStart !== windowStart) {
    degradedBuckets.set(fullKey, { count: 1, windowStart });
    return { allowed: true };
  }

  if (existing.count >= rule.limit) {
    const retryAfter = Math.max(1, windowStart + rule.windowSeconds - Math.floor(nowMs / 1000));
    return { allowed: false, retryAfter };
  }

  existing.count += 1;
  return { allowed: true };
}

function tooManyRequestsResponse(retryAfter: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Retry-After': String(retryAfter),
      },
    },
  );
}

async function assertRateLimit(
  env: Env,
  rule: RateRule,
  bucketKey: string,
  logContext: string,
): Promise<Response | null> {
  try {
    const windowStart = currentWindowStart(rule.windowSeconds);
    const rateKey = await sha256Hex(`${rule.group}:${bucketKey}:${windowStart}`);
    const existing = await env.DB.prepare('SELECT key, count FROM api_rate_limits WHERE key = ? LIMIT 1')
      .bind(rateKey)
      .first<{ key: string; count: number }>();

    if (!existing) {
      const ipHash = await sha256Hex(bucketKey);
      await env.DB.prepare(
        `INSERT INTO api_rate_limits (key, bucket, ip_hash, window_start, count, id, rate_key, route_group)
         VALUES (?, ?, ?, ?, 1, ?, ?, ?)`,
      )
        .bind(rateKey, rule.group, ipHash, windowStart, crypto.randomUUID(), rateKey, rule.group)
        .run();
      return null;
    }

    if (existing.count >= rule.limit) {
      const retryAfter = Math.max(1, windowStart + rule.windowSeconds - Math.floor(Date.now() / 1000));
      return tooManyRequestsResponse(retryAfter);
    }

    await env.DB.prepare(
      `UPDATE api_rate_limits SET count = count + 1, updated_at = CURRENT_TIMESTAMP WHERE key = ?`,
    )
      .bind(existing.key)
      .run();
    return null;
  } catch (error) {
    console.error('[RATE_LIMIT_D1_DEGRADED]', JSON.stringify({
      context: logContext,
      group: rule.group,
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }));
    const degraded = degradedRateCheck(`${rule.group}:${bucketKey}`, rule);
    if (!degraded.allowed) {
      return tooManyRequestsResponse(degraded.retryAfter || 60);
    }
    return null;
  }
}

/**
 * D1-backed limiter against the EXISTING shared rafid-db api_rate_limits table.
 * On D1 failure: log and fall back to per-isolate in-memory buckets with the same limits.
 */
export async function assertAuthRateLimit(env: Env, request: Request, url: URL): Promise<Response | null> {
  const rule = authRateRuleFor(request.method, url.pathname);
  if (!rule) return null;
  return assertRateLimit(env, rule, clientIp(request), 'auth');
}

export async function assertUserRateLimit(
  env: Env,
  request: Request,
  url: URL,
  userId: string,
): Promise<Response | null> {
  const rule = userRateRuleFor(request.method, url.pathname);
  if (!rule) return null;
  return assertRateLimit(env, rule, userId, 'authenticated');
}
