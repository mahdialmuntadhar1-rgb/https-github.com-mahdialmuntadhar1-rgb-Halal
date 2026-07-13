import { hashPassword, signToken, verifyPassword } from '../auth';
import { AuthUser, HttpError, json, readJson, RequestContext, requireString, requireUser, uuid } from '../db';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function publicUser(user: AuthUser) {
  return { id: user.id, email: user.email, role: user.role };
}

export async function handleAuth(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;
  const path = url.pathname.replace(/^\/api(?=\/)/, '');

  if (path === '/auth/register' && request.method === 'POST') {
    const body = await readJson(request);
    const email = normalizeEmail(requireString(body, 'email', 254));
    const password = requireString(body, 'password', 200);
    if (!isValidEmail(email)) throw new HttpError(400, 'Invalid email address.');

    const existing = await env.DB.prepare('SELECT id FROM halal_users WHERE email = ?').bind(email).first();
    if (existing) throw new HttpError(409, 'Email is already registered.');

    const user: AuthUser = { id: uuid(), email, role: 'member' };
    const passwordHash = await hashPassword(password);
    await env.DB.prepare('INSERT INTO halal_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .bind(user.id, user.email, passwordHash, user.role)
      .run();
    await env.DB.prepare('INSERT INTO halal_profiles (user_id, full_name) VALUES (?, ?)')
      .bind(user.id, '')
      .run();

    return json({ user: publicUser(user), token: await signToken(env, user) }, 201);
  }

  if (path === '/auth/login' && request.method === 'POST') {
    const body = await readJson(request);
    const email = normalizeEmail(requireString(body, 'email', 254));
    const password = requireString(body, 'password', 200);
    const row = await env.DB.prepare('SELECT id, email, role, password_hash FROM halal_users WHERE email = ?')
      .bind(email)
      .first<AuthUser & { password_hash: string }>();

    if (!row || !(await verifyPassword(password, String(row.password_hash)))) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const user: AuthUser = { id: String(row.id), email: String(row.email), role: row.role === 'admin' ? 'admin' : 'member' };
    return json({ user: publicUser(user), token: await signToken(env, user) });
  }

  if (path === '/auth/me' && request.method === 'GET') {
    return json({ user: publicUser(requireUser(ctx)) });
  }

  return null;
}

