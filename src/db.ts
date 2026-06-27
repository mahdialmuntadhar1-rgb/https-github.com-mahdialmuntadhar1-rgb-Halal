export interface D1Result<T = Record<string, unknown>> {
  results?: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface R2Bucket {
  get(key: string): Promise<unknown>;
  put(key: string, value: ReadableStream | ArrayBuffer | string): Promise<unknown>;
  delete(key: string): Promise<void>;
}

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  JWT_SECRET?: string;
  ENVIRONMENT?: string;
  CORS_ORIGIN?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'member' | 'admin';
}

export interface RequestContext {
  env: Env;
  request: Request;
  url: URL;
  user?: AuthUser;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function json(data: unknown, status = 200): Response {
  const payload =
    data && typeof data === 'object' && !Array.isArray(data) && !('success' in data)
      ? { success: true, ...data }
      : data;

  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export function noContent(): Response {
  return new Response(null, { status: 204 });
}

export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError) {
    return json({ success: false, error: error.message, details: error.details }, error.status);
  }

  return json({ success: false, error: 'Internal server error' }, 500);
}

export async function readJson<T extends Record<string, unknown>>(request: Request): Promise<T> {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new HttpError(415, 'Expected application/json request body.');
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new Error('Invalid JSON object');
    }
    return body as T;
  } catch {
    throw new HttpError(400, 'Invalid JSON request body.');
  }
}

export function requireString(body: Record<string, unknown>, key: string, max = 500): string {
  const value = body[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${key} is required.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > max) {
    throw new HttpError(400, `${key} is too long.`);
  }

  return trimmed;
}

export function optionalString(body: Record<string, unknown>, key: string, max = 1000): string | null {
  const value = body[key];
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw new HttpError(400, `${key} must be a string.`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new HttpError(400, `${key} is too long.`);
  return trimmed;
}

export function clampInt(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

export function uuid(): string {
  return crypto.randomUUID();
}

export async function getUserById(env: Env, id: string): Promise<AuthUser | null> {
  const row = await env.DB.prepare('SELECT id, email, role FROM halal_users WHERE id = ?').bind(id).first<AuthUser>();
  if (!row) return null;
  return { id: String(row.id), email: String(row.email), role: row.role === 'admin' ? 'admin' : 'member' };
}

export function requireUser(ctx: RequestContext): AuthUser {
  if (!ctx.user) throw new HttpError(401, 'Authentication required.');
  return ctx.user;
}

export function requireAdmin(ctx: RequestContext): AuthUser {
  const user = requireUser(ctx);
  if (user.role !== 'admin') throw new HttpError(403, 'Admin access required.');
  return user;
}

