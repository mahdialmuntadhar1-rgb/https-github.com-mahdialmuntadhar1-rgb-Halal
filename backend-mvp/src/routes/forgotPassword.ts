import { Env, json, RequestContext, uuid } from '../db';

const encoder = new TextEncoder();

async function sha256Hex(value: string): Promise<string> {
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sendResetEmail(env: Env, toEmail: string, resetLink: string): Promise<void> {
  const apiKey = (env as any).RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured - skipping email send');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'HALAL <onboarding@resend.dev>',
      to: [toEmail],
      subject: 'Reset your HALAL password',
      html: `<p>Someone requested a password reset for your HALAL account.</p>
             <p><a href="${resetLink}">Click here to reset your password</a></p>
             <p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>`,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Failed to send reset email:', res.status, errText);
  }
}

export async function handleForgotPassword(ctx: RequestContext): Promise<Response | null> {
  if (ctx.url.pathname !== '/api/auth/forgot-password' || ctx.request.method !== 'POST') {
    return null;
  }

  try {
    const body = await ctx.request.json() as { email?: string };
    if (!body.email) {
      return json({ error: 'Email required' }, 400);
    }

    const user = await ctx.env.DB.prepare('SELECT id FROM halal_users WHERE email = ?')
      .bind(body.email)
      .first<{ id: string }>();

    // Always return success even if user not found, to avoid leaking which emails are registered
    if (!user) {
      return json({ message: 'If that email exists, a reset link will be sent.' });
    }

    const token = randomToken();
    const tokenHash = await sha256Hex(token);
    const id = uuid();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await ctx.env.DB.prepare(
      'INSERT INTO halal_password_resets (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
    ).bind(id, user.id, tokenHash, expiresAt).run();

    const origin = ctx.request.headers.get('Origin') || 'https://main.zawaj-app.pages.dev';
    const resetLink = `${origin}/reset-password?token=${token}`;

    await sendResetEmail(ctx.env, body.email, resetLink);

    return json({ message: 'If that email exists, a reset link will be sent.' });
  } catch (err) {
    console.error('forgot-password error', err);
    return json({ error: 'Invalid request' }, 400);
  }
}
