import { Env, json, RequestContext } from '../db';
import { hashPassword } from '../auth';

const encoder = new TextEncoder();

async function sha256Hex(value: string): Promise<string> {
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function handleResetPassword(ctx: RequestContext): Promise<Response | null> {
  const path = ctx.url.pathname.replace(/^\/api(?=\/)/, '');
  if (path !== '/auth/reset-password' || ctx.request.method !== 'POST') {
    return null;
  }

  try {
    const body = await ctx.request.json() as { token?: string; password?: string };
    if (!body.token || !body.password) {
      return json({ error: 'Token and new password required' }, 400);
    }
    if (body.password.length < 10) {
      return json({ error: 'Password must be at least 10 characters.' }, 400);
    }

    const tokenHash = await sha256Hex(body.token);
    const record = await ctx.env.DB.prepare(
      'SELECT id, user_id, expires_at, used FROM halal_password_resets WHERE token_hash = ?'
    ).bind(tokenHash).first<{ id: string; user_id: string; expires_at: string; used: number }>();

    if (!record) {
      return json({ error: 'Invalid or expired reset link.' }, 400);
    }
    if (record.used) {
      return json({ error: 'This reset link has already been used.' }, 400);
    }
    if (new Date(record.expires_at).getTime() < Date.now()) {
      return json({ error: 'This reset link has expired.' }, 400);
    }

    const newHash = await hashPassword(body.password);
    await ctx.env.DB.prepare('UPDATE halal_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(newHash, record.user_id).run();
    await ctx.env.DB.prepare('UPDATE halal_password_resets SET used = 1 WHERE id = ?')
      .bind(record.id).run();

    return json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('reset-password error', err);
    return json({ error: 'Invalid request' }, 400);
  }
}
