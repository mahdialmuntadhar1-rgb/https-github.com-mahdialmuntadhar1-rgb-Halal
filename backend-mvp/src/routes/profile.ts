import { HttpError, json, noContent, optionalString, readJson, RequestContext, requireAdmin, requireUser, uuid } from '../db';

function currentYear(): number {
  return new Date().getUTCFullYear();
}

function ageSql(): string {
  return `(CAST(strftime('%Y', 'now') AS INTEGER) - p.birth_year)`;
}

export async function profileForUser(ctx: RequestContext, userId: string): Promise<Record<string, unknown>> {
  const row = await ctx.env.DB.prepare(
    `SELECT u.id AS user_id, u.email, u.role, u.verified, p.*, ${ageSql()} AS age
     FROM halal_users u
     LEFT JOIN halal_profiles p ON p.user_id = u.id
     WHERE u.id = ?`,
  )
    .bind(userId)
    .first<Record<string, unknown>>();
  if (!row) throw new HttpError(404, 'Profile not found.');
  return row;
}

export function filterProfilePhoto(row: Record<string, unknown>, viewerId: string): Record<string, unknown> {
  const filtered = { ...row };
  const isFemale = filtered.gender === 'female';
  const isOwner = filtered.user_id === viewerId;
  const visibility = String(filtered.photo_visibility || 'private');
  const requestStatus = String(filtered.request_status || 'none');

  if (isFemale && !isOwner && requestStatus !== 'accepted' && visibility !== 'public') {
    filtered.photo_url = '';
    filtered.photo_status = visibility === 'initials' ? 'initials' : visibility === 'blurred' ? 'blurred' : 'hidden';
  } else if (filtered.photo_url) {
    filtered.photo_status = 'visible';
  } else {
    filtered.photo_status = 'hidden';
  }

  return filtered;
}

export async function handleProfile(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;
  const path = url.pathname.replace(/^\/api(?=\/)/, '');
  const user = requireUser(ctx);

  if (path === '/profile/me' && request.method === 'GET') {
    return json({ profile: await profileForUser(ctx, user.id) });
  }

  if (path === '/profile/me' && request.method === 'PUT') {
    const body = await readJson(request);
    let birthYear: number | null = null;
    if (body.birthYear !== undefined && body.birthYear !== null && body.birthYear !== '') {
      const parsed = Number(body.birthYear);
      if (!Number.isInteger(parsed) || parsed < currentYear() - 100 || parsed > currentYear() - 18) {
        throw new HttpError(400, 'birthYear must describe an adult profile.');
      }
      birthYear = parsed;
    } else if (body.age !== undefined && body.age !== null && body.age !== '') {
      const age = Number(body.age);
      if (!Number.isInteger(age) || age < 18 || age > 100) {
        throw new HttpError(400, 'age must be an integer between 18 and 100.');
      }
      birthYear = currentYear() - age;
    }

    const fullName =
      optionalString(body, 'fullName', 120) ||
      optionalString(body, 'name', 120) ||
      '';
    const occupation =
      optionalString(body, 'occupation', 120) ||
      optionalString(body, 'profession', 120);

    await env.DB.prepare(
      `INSERT INTO halal_profiles (
        user_id, full_name, gender, birth_year, country, governorate, district, city, religion, sect, ethnicity,
        marital_status, education, occupation, bio, intention, timeline, wants_children,
        communication_preference, photo_url, photo_visibility, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        full_name = excluded.full_name,
        gender = excluded.gender,
        birth_year = excluded.birth_year,
        country = excluded.country,
        governorate = excluded.governorate,
        district = excluded.district,
        city = excluded.city,
        religion = excluded.religion,
        sect = excluded.sect,
        ethnicity = excluded.ethnicity,
        marital_status = excluded.marital_status,
        education = excluded.education,
        occupation = excluded.occupation,
        bio = excluded.bio,
        intention = excluded.intention,
        timeline = excluded.timeline,
        wants_children = excluded.wants_children,
        communication_preference = excluded.communication_preference,
        photo_url = excluded.photo_url,
        photo_visibility = excluded.photo_visibility,
        updated_at = CURRENT_TIMESTAMP`,
    )
      .bind(
        user.id,
        fullName,
        optionalString(body, 'gender', 20),
        birthYear,
        optionalString(body, 'country', 80) || 'Iraq',
        optionalString(body, 'governorate', 80),
        optionalString(body, 'district', 80) || optionalString(body, 'city', 80),
        optionalString(body, 'city', 80),
        optionalString(body, 'religion', 40) || 'islam',
        optionalString(body, 'sect', 40) || 'sunni',
        optionalString(body, 'ethnicity', 40) || 'arab',
        optionalString(body, 'maritalStatus', 80),
        optionalString(body, 'education', 120),
        occupation,
        optionalString(body, 'bio', 2000),
        optionalString(body, 'intention', 200) || 'Serious for marriage',
        optionalString(body, 'timeline', 120) || 'Within 1 year',
        optionalString(body, 'wantsChildren', 120) || 'Open to discussion',
        optionalString(body, 'communicationPreference', 200) || 'Respectful platform communication only',
        optionalString(body, 'photoUrl', 1000),
        optionalString(body, 'photoVisibility', 40) || 'private',
      )
      .run();

    return json({ profile: await profileForUser(ctx, user.id) });
  }

  const savedMatch = path.match(/^\/saved-profiles\/([^/]+)$/);
  if (savedMatch && request.method === 'POST') {
    const savedUserId = decodeURIComponent(savedMatch[1]);
    if (savedUserId === user.id) throw new HttpError(400, 'You cannot save your own profile.');
    await env.DB.prepare('INSERT OR IGNORE INTO halal_saved_profiles (user_id, saved_user_id) VALUES (?, ?)')
      .bind(user.id, savedUserId)
      .run();
    return json({ saved: true });
  }

  if (savedMatch && request.method === 'DELETE') {
    await env.DB.prepare('DELETE FROM halal_saved_profiles WHERE user_id = ? AND saved_user_id = ?')
      .bind(user.id, decodeURIComponent(savedMatch[1]))
      .run();
    return json({ saved: false });
  }

  if (path === '/reports' && request.method === 'GET') {
    requireAdmin(ctx);
    const rows = await env.DB.prepare('SELECT * FROM halal_reports ORDER BY created_at DESC LIMIT 100').all();
    return json({ reports: rows.results || [] });
  }

  const reportMatch = path.match(/^\/reports\/profiles\/([^/]+)$/);
  if (reportMatch && request.method === 'POST') {
    const body = await readJson(request);
    const targetId = decodeURIComponent(reportMatch[1]);
    if (targetId === user.id) throw new HttpError(400, 'You cannot report your own profile.');
    const id = uuid();
    await env.DB.prepare('INSERT INTO halal_reports (id, reporter_id, target_type, target_id, reason) VALUES (?, ?, ?, ?, ?)')
      .bind(id, user.id, 'profile', targetId, optionalString(body, 'reason', 500) || 'Reported by member')
      .run();
    const report = await env.DB.prepare('SELECT * FROM halal_reports WHERE id = ?').bind(id).first();
    return json({ report }, 201);
  }

  // Block list for the authenticated member (persisted in halal_blocks).
  if (path === '/blocks' && request.method === 'GET') {
    const rows = await env.DB.prepare(
      'SELECT blocked_user_id, reason, created_at FROM halal_blocks WHERE blocker_id = ? ORDER BY created_at DESC LIMIT 500',
    )
      .bind(user.id)
      .all<{ blocked_user_id: string; reason: string | null; created_at: string }>();
    const blocks = (rows.results || []).map((r) => ({
      blockedUserId: r.blocked_user_id,
      reason: r.reason,
      createdAt: r.created_at,
    }));
    return json({ blocks });
  }

  const blockMatch = path.match(/^\/blocks\/([^/]+)$/);
  if (blockMatch && request.method === 'POST') {
    const body = await readJson(request);
    const blockedUserId = decodeURIComponent(blockMatch[1]);
    if (blockedUserId === user.id) throw new HttpError(400, 'You cannot block yourself.');
    const exists = await env.DB.prepare('SELECT id FROM halal_users WHERE id = ?').bind(blockedUserId).first();
    if (!exists) throw new HttpError(404, 'User not found.');
    await env.DB.prepare(
      'INSERT OR IGNORE INTO halal_blocks (blocker_id, blocked_user_id, reason) VALUES (?, ?, ?)',
    )
      .bind(user.id, blockedUserId, optionalString(body, 'reason', 500))
      .run();
    return json({ blocked: true, blockedUserId }, 201);
  }

  if (blockMatch && request.method === 'DELETE') {
    const blockedUserId = decodeURIComponent(blockMatch[1]);
    await env.DB.prepare('DELETE FROM halal_blocks WHERE blocker_id = ? AND blocked_user_id = ?')
      .bind(user.id, blockedUserId)
      .run();
    return json({ blocked: false, blockedUserId });
  }

  const moderateMatch = path.match(/^\/admin\/reports\/([^/]+)\/resolve$/);
  if (moderateMatch && request.method === 'POST') {
    requireAdmin(ctx);
    await env.DB.prepare("UPDATE halal_reports SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(decodeURIComponent(moderateMatch[1]))
      .run();
    return noContent();
  }

  return null;
}

