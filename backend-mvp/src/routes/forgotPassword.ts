import { Env, json, RequestContext, uuid } from '../db';

const encoder = new TextEncoder();

function generateCorrelationId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

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

async function sendResetEmail(env: Env, toEmail: string, resetLink: string, correlationId: string): Promise<void> {
  const apiKey = (env as any).RESEND_API_KEY;
  if (!apiKey) {
    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'EMAIL_SEND_SKIPPED',
      reason: 'RESEND_API_KEY not configured',
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  console.log('[FORGOT_PASSWORD]', JSON.stringify({
    correlationId,
    stage: 'EMAIL_SEND_STARTED',
    timestamp: new Date().toISOString(),
  }));

  try {
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
      console.log('[FORGOT_PASSWORD]', JSON.stringify({
        correlationId,
        stage: 'EMAIL_SEND_FAILED',
        httpStatus: res.status,
        error: errText,
        timestamp: new Date().toISOString(),
      }));
    } else {
      console.log('[FORGOT_PASSWORD]', JSON.stringify({
        correlationId,
        stage: 'EMAIL_SEND_SUCCESS',
        timestamp: new Date().toISOString(),
      }));
    }
  } catch (emailErr) {
    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'EMAIL_SEND_EXCEPTION',
      error: emailErr instanceof Error ? emailErr.message : String(emailErr),
      timestamp: new Date().toISOString(),
    }));
  }
}

export async function handleForgotPassword(ctx: RequestContext): Promise<Response | null> {
  if (ctx.url.pathname !== '/api/auth/forgot-password' || ctx.request.method !== 'POST') {
    return null;
  }

  const correlationId = generateCorrelationId();

  console.log('[FORGOT_PASSWORD]', JSON.stringify({
    correlationId,
    stage: 'REQUEST_RECEIVED',
    method: ctx.request.method,
    pathname: ctx.url.pathname,
    timestamp: new Date().toISOString(),
  }));

  try {
    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'BODY_PARSE_STARTED',
      timestamp: new Date().toISOString(),
    }));

    const body = await ctx.request.json() as { email?: string };

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'BODY_PARSED',
      hasEmail: !!body.email,
      timestamp: new Date().toISOString(),
    }));

    if (!body.email) {
      console.log('[FORGOT_PASSWORD]', JSON.stringify({
        correlationId,
        stage: 'EMAIL_VALIDATION_FAILED',
        reason: 'Email field missing',
        timestamp: new Date().toISOString(),
      }));
      return json({ error: 'Email required' }, 400);
    }

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'EMAIL_VALIDATION_PASSED',
      timestamp: new Date().toISOString(),
    }));

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'USER_LOOKUP_STARTED',
      timestamp: new Date().toISOString(),
    }));

    const user = await ctx.env.DB.prepare('SELECT id FROM halal_users WHERE email = ?')
      .bind(body.email)
      .first<{ id: string }>();

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'USER_LOOKUP_COMPLETED',
      userFound: !!user,
      timestamp: new Date().toISOString(),
    }));

    // Always return success even if user not found, to avoid leaking which emails are registered
    if (!user) {
      console.log('[FORGOT_PASSWORD]', JSON.stringify({
        correlationId,
        stage: 'RESPONSE_SUCCESS',
        reason: 'User not found (security)',
        timestamp: new Date().toISOString(),
      }));
      return json({ message: 'If that email exists, a reset link will be sent.' });
    }

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'TOKEN_GENERATION_STARTED',
      timestamp: new Date().toISOString(),
    }));

    const token = randomToken();
    const tokenHash = await sha256Hex(token);
    const id = uuid();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'TOKEN_GENERATION_COMPLETED',
      timestamp: new Date().toISOString(),
    }));

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'RESET_INSERT_STARTED',
      timestamp: new Date().toISOString(),
    }));

    await ctx.env.DB.prepare(
      'INSERT INTO halal_password_resets (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
    ).bind(id, user.id, tokenHash, expiresAt).run();

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'RESET_INSERT_COMPLETED',
      timestamp: new Date().toISOString(),
    }));

    const origin = ctx.request.headers.get('Origin') || 'https://main.zawaj-app.pages.dev';
    const resetLink = `${origin}/reset-password?token=${token}`;

    await sendResetEmail(ctx.env, body.email, resetLink, correlationId);

    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'RESPONSE_SUCCESS',
      timestamp: new Date().toISOString(),
    }));

    return json({ message: 'If that email exists, a reset link will be sent.' });
  } catch (err) {
    console.log('[FORGOT_PASSWORD]', JSON.stringify({
      correlationId,
      stage: 'FAILURE',
      errorName: err instanceof Error ? err.name : 'UnknownError',
      errorMessage: err instanceof Error ? err.message : String(err),
      errorStack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    }));
    return json({ error: 'Invalid request' }, 400);
  }
}
