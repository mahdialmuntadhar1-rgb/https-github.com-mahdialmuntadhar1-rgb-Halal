import { Env } from './db';

export type AuthRateRule = {
  group: string;
  limit: number;
  windowSeconds: number;
};

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

/**
 * D1-backed limiter against the EXISTING shared rafid-db api_rate_limits table.
 * Live schema (do not DROP/recreate): key PK, bucket, ip_hash, window_start, count,
 * plus later-added nullable id/rate_key/route_group.
 * Fail-open if D1 errors so auth is not bricked.
 */
export async function assertAuthRateLimit(env: Env, request: Request, url: URL): Promise<Response | null> {
  const rule = authRateRuleFor(request.method, url.pathname);
  if (!rule) return null;

  try {
    const windowStart = Math.floor(Date.now() / 1000 / rule.windowSeconds) * rule.windowSeconds;
    const ip = clientIp(request);
    const rateKey = await sha256Hex(`${rule.group}:${ip}:${windowStart}`);
    const existing = await env.DB.prepare('SELECT key, count FROM api_rate_limits WHERE key = ? LIMIT 1')
      .bind(rateKey)
      .first<{ key: string; count: number }>();

    if (!existing) {
      const ipHash = await sha256Hex(ip);
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

    await env.DB.prepare(
      `UPDATE api_rate_limits SET count = count + 1, updated_at = CURRENT_TIMESTAMP WHERE key = ?`,
    )
      .bind(existing.key)
      .run();
    return null;
  } catch {
    return null;
  }
}
