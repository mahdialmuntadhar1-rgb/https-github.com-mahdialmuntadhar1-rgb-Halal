import { hashPassword, needsRehash, signToken, verifyPassword } from '../auth';
import { AuthUser, HttpError, json, optionalString, readJson, RequestContext, requireString, requireUser, uuid } from '../db';
import { normalizeEmail } from '../email';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function publicUser(user: AuthUser) {
  return { id: user.id, email: user.email, role: user.role };
}

function currentYear(): number {
  return new Date().getUTCFullYear();
}

/** Map register body age or birthYear → birth_year column (adult profiles only). */
function resolveRegisterBirthYear(body: Record<string, unknown>): number | null {
  if (body.birthYear !== undefined && body.birthYear !== null && body.birthYear !== '') {
    const birthYear = Number(body.birthYear);
    if (!Number.isInteger(birthYear) || birthYear < currentYear() - 100 || birthYear > currentYear() - 18) {
      throw new HttpError(400, 'birthYear must describe an adult profile.');
    }
    return birthYear;
  }
  if (body.age !== undefined && body.age !== null && body.age !== '') {
    const age = Number(body.age);
    if (!Number.isInteger(age) || age < 18 || age > 100) {
      throw new HttpError(400, 'age must be an integer between 18 and 100.');
    }
    return currentYear() - age;
  }
  return null;
}

export async function handleAuth(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;
  const path = url.pathname.replace(/^\/api(?=\/)/, '');

  if (path === '/auth/register' && request.method === 'POST') {
    const body = await readJson(request);
    const email = normalizeEmail(requireString(body, 'email', 254));
    const password = requireString(body, 'password', 200);
    if (!isValidEmail(email)) throw new HttpError(400, 'Invalid email address.');

    // Client contract: fullName (alias name), governorate, district, age/birthYear.
    // Phone is accepted but not persisted — no phone column without a schema change.
    const fullName =
      optionalString(body, 'fullName', 120) ||
      optionalString(body, 'name', 120) ||
      '';
    const governorate = optionalString(body, 'governorate', 80);
    const district = optionalString(body, 'district', 80);
    const birthYear = resolveRegisterBirthYear(body);

    const existing = await env.DB.prepare('SELECT id FROM halal_users WHERE email = ?').bind(email).first();
    if (existing) throw new HttpError(409, 'Email is already registered.');

    const user: AuthUser = { id: uuid(), email, role: 'member' };
    const passwordHash = await hashPassword(password);
    await env.DB.prepare('INSERT INTO halal_users (id, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .bind(user.id, user.email, passwordHash, user.role)
      .run();
    await env.DB.prepare(
      `INSERT INTO halal_profiles (user_id, full_name, governorate, district, city, birth_year, country)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(user.id, fullName, governorate, district, district, birthYear, 'Iraq')
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

    const storedHash = row ? String(row.password_hash) : '';
    if (!row || !(await verifyPassword(password, storedHash))) {
      throw new HttpError(401, 'Invalid email or password.');
    }

    const user: AuthUser = { id: String(row.id), email: String(row.email), role: row.role === 'admin' ? 'admin' : 'member' };

    // Gradual migration: after a successful bcrypt login, upgrade hash to PBKDF2.
    // Best-effort only — never fail the login if the UPDATE fails.
    if (needsRehash(storedHash)) {
      try {
        const upgraded = await hashPassword(password);
        await env.DB.prepare('UPDATE halal_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .bind(upgraded, user.id)
          .run();
      } catch (migrationError) {
        console.error('password hash migration failed', { userId: user.id, error: migrationError });
      }
    }

    return json({ user: publicUser(user), token: await signToken(env, user) });
  }

  if (path === '/auth/me' && request.method === 'GET') {
    return json({ user: publicUser(requireUser(ctx)) });
  }

  // Google Play: authenticated account deletion. Path is /api/auth/account or /auth/account.
  if (path === '/auth/account' && request.method === 'DELETE') {
    const user = requireUser(ctx);
    const userId = user.id;

    // Atomic only — never run sequential deletes that could leave a partial wipe.
    if (typeof env.DB.batch !== 'function') {
      throw new HttpError(500, 'Account deletion is temporarily unavailable. Please try again later.');
    }

    // Order: clear non-CASCADE FKs → community → all messages in user's conversations →
    // conversations → remaining owned rows → user.
    const statements = [
      env.DB.prepare('UPDATE halal_requests SET decided_by = NULL WHERE decided_by = ?').bind(userId),
      env.DB.prepare('UPDATE halal_introduction_requests SET decided_by = NULL WHERE decided_by = ?').bind(userId),

      // Community: likes/comments first (including rows on this user's posts), then posts.
      env.DB.prepare(
        `DELETE FROM halal_post_likes
         WHERE user_id = ?
            OR post_id IN (SELECT id FROM halal_community_posts WHERE user_id = ?)`,
      ).bind(userId, userId),
      env.DB.prepare(
        `DELETE FROM halal_post_comments
         WHERE user_id = ?
            OR post_id IN (SELECT id FROM halal_community_posts WHERE user_id = ?)`,
      ).bind(userId, userId),
      env.DB.prepare('DELETE FROM halal_community_posts WHERE user_id = ?').bind(userId),

      // All messages in conversations involving this user (not only messages they sent).
      env.DB.prepare(
        `DELETE FROM halal_messages
         WHERE conversation_id IN (
           SELECT id FROM halal_conversations
           WHERE user_one_id = ? OR user_two_id = ?
         )`,
      ).bind(userId, userId),
      env.DB.prepare('DELETE FROM halal_conversations WHERE user_one_id = ? OR user_two_id = ?').bind(userId, userId),

      env.DB.prepare('DELETE FROM halal_cafe_answers WHERE user_id = ?').bind(userId),
      env.DB.prepare('DELETE FROM halal_reports WHERE reporter_id = ?').bind(userId),
      env.DB.prepare('DELETE FROM halal_blocks WHERE blocker_id = ? OR blocked_user_id = ?').bind(userId, userId),
      env.DB.prepare('DELETE FROM halal_saved_profiles WHERE user_id = ? OR saved_user_id = ?').bind(userId, userId),
      env.DB.prepare('DELETE FROM halal_password_resets WHERE user_id = ?').bind(userId),
      env.DB.prepare('DELETE FROM halal_requests WHERE sender_id = ? OR receiver_id = ?').bind(userId, userId),
      env.DB.prepare('DELETE FROM halal_introduction_requests WHERE sender_id = ? OR receiver_id = ?').bind(userId, userId),
      env.DB.prepare('DELETE FROM halal_preferences WHERE user_id = ?').bind(userId),
      env.DB.prepare('DELETE FROM halal_profiles WHERE user_id = ?').bind(userId),
      env.DB.prepare('DELETE FROM halal_users WHERE id = ?').bind(userId),
    ];

    await env.DB.batch(statements);

    return json({
      success: true,
      message: 'Your account and associated data have been deleted.',
    });
  }

  return null;
}

