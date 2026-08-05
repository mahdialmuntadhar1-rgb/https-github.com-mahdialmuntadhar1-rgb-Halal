import { clampInt, HttpError, json, RequestContext, requireUser } from '../db';
import { filterProfilePhoto } from './profile';

export async function handleMatches(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;
  const path = url.pathname.replace(/^\/api(?=\/)/, '');
  const match = path.match(/^\/matches(?:\/([^/]+))?$/);
  if (!match || request.method !== 'GET') return null;

  const user = requireUser(ctx);
  const requestedUserId = match[1] ? decodeURIComponent(match[1]) : user.id;
  if (requestedUserId !== user.id && user.role !== 'admin') {
    throw new HttpError(403, 'You can only request matches for your own account.');
  }

  const page = clampInt(url.searchParams.get('page'), 1, 1, 10000);
  const limit = clampInt(url.searchParams.get('limit'), 20, 1, 50);
  const offset = (page - 1) * limit;

  const viewer = await env.DB.prepare(
    `SELECT p.gender, p.governorate, COALESCE(p.district, p.city) AS district, pref.partner_gender
     FROM halal_users u
     LEFT JOIN halal_profiles p ON p.user_id = u.id
     LEFT JOIN halal_preferences pref ON pref.user_id = u.id
     WHERE u.id = ?`,
  )
    .bind(requestedUserId)
    .first<Record<string, unknown>>();
  if (!viewer) throw new HttpError(404, 'User not found.');

  const viewerGender = String(viewer.gender || '');
  const preferredGender =
    viewer.partner_gender === 'male' || viewer.partner_gender === 'female'
      ? String(viewer.partner_gender)
      : viewerGender === 'male'
        ? 'female'
        : viewerGender === 'female'
          ? 'male'
          : '';

  const where = ['u.id != ?', 'p.hidden_by_admin = 0'];
  const params: unknown[] = [requestedUserId];

  // Hide members blocked by or blocking the viewer (persisted halal_blocks).
  where.push('u.id NOT IN (SELECT blocked_user_id FROM halal_blocks WHERE blocker_id = ?)');
  params.push(requestedUserId);
  where.push('u.id NOT IN (SELECT blocker_id FROM halal_blocks WHERE blocked_user_id = ?)');
  params.push(requestedUserId);

  const addFilter = (column: string, paramName: string) => {
    const value = url.searchParams.get(paramName);
    if (value && value !== 'all' && value !== 'All' && value !== 'All Iraq') {
      where.push(`${column} = ?`);
      params.push(value);
    }
  };

  addFilter('p.gender', 'gender');
  addFilter('p.governorate', 'governorate');
  addFilter('COALESCE(p.district, p.city)', 'district');
  addFilter('p.religion', 'religion');
  addFilter('p.sect', 'sect');
  addFilter('p.ethnicity', 'ethnicity');

  if (!url.searchParams.get('gender') && preferredGender) {
    where.push('p.gender = ?');
    params.push(preferredGender);
  }

  const minAge = clampInt(url.searchParams.get('minAge'), 18, 18, 100);
  const maxAge = clampInt(url.searchParams.get('maxAge'), 80, 18, 100);
  where.push("(CAST(strftime('%Y', 'now') AS INTEGER) - p.birth_year) BETWEEN ? AND ?");
  params.push(minAge, maxAge);

  if (url.searchParams.get('verified') === 'true') {
    where.push('u.verified = 1');
  }

  const whereSql = where.join(' AND ');
  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total
     FROM halal_profiles p
     JOIN halal_users u ON u.id = p.user_id
     WHERE ${whereSql}`,
  )
    .bind(...params)
    .first<{ total: number }>();

  const rows = await env.DB.prepare(
    `SELECT
       u.id AS user_id, u.verified, p.*,
       (CAST(strftime('%Y', 'now') AS INTEGER) - p.birth_year) AS age,
       CASE
         WHEN sent.status IS NOT NULL THEN sent.status
         WHEN received.status IS NOT NULL THEN received.status
         ELSE 'none'
       END AS request_status,
       CASE WHEN sp.saved_user_id IS NULL THEN 0 ELSE 1 END AS saved
     FROM halal_profiles p
     JOIN halal_users u ON u.id = p.user_id
     LEFT JOIN halal_saved_profiles sp ON sp.user_id = ? AND sp.saved_user_id = u.id
     LEFT JOIN halal_requests sent ON sent.sender_id = ? AND sent.receiver_id = u.id
     LEFT JOIN halal_requests received ON received.sender_id = u.id AND received.receiver_id = ?
     WHERE ${whereSql}
     ORDER BY
       CASE WHEN COALESCE(p.district, p.city, '') != '' AND COALESCE(p.district, p.city) = ? THEN 0 ELSE 1 END,
       CASE WHEN p.governorate IS NOT NULL AND p.governorate = ? THEN 0 ELSE 1 END,
       CASE WHEN ? != '' AND p.gender = ? THEN 0 ELSE 1 END,
       u.verified DESC,
       p.created_at DESC
     LIMIT ? OFFSET ?`,
  )
    .bind(
      requestedUserId,
      requestedUserId,
      requestedUserId,
      ...params,
      String(viewer.district || ''),
      String(viewer.governorate || ''),
      preferredGender,
      preferredGender,
      limit,
      offset,
    )
    .all<Record<string, unknown>>();

  const total = Number(totalRow?.total || 0);
  const matches = (rows.results || []).map((row) => filterProfilePhoto(row, user.id));

  return json({
    matches,
    hasMore: offset + matches.length < total,
    page,
    limit,
    total,
  });
}

