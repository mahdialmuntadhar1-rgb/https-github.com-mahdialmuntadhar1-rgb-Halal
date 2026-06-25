import { clampInt, json, RequestContext, requireUser } from '../db';
import { filterProfilePhoto } from './profile';

export async function handleMatches(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;
  if (url.pathname !== '/api/matches' || request.method !== 'GET') return null;

  const user = requireUser(ctx);
  const page = clampInt(url.searchParams.get('page'), 1, 1, 10000);
  const limit = clampInt(url.searchParams.get('limit'), 20, 1, 50);
  const offset = (page - 1) * limit;

  const where = ['u.id != ?', 'p.hidden_by_admin = 0'];
  const params: unknown[] = [user.id];

  const addFilter = (column: string, paramName: string) => {
    const value = url.searchParams.get(paramName);
    if (value && value !== 'all' && value !== 'All' && value !== 'All Iraq') {
      where.push(`${column} = ?`);
      params.push(value);
    }
  };

  addFilter('p.gender', 'gender');
  addFilter('p.governorate', 'governorate');
  addFilter('p.religion', 'religion');
  addFilter('p.sect', 'sect');
  addFilter('p.ethnicity', 'ethnicity');

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
     FROM profiles p
     JOIN users u ON u.id = p.user_id
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
     FROM profiles p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN saved_profiles sp ON sp.user_id = ? AND sp.saved_user_id = u.id
     LEFT JOIN introduction_requests sent ON sent.sender_id = ? AND sent.receiver_id = u.id
     LEFT JOIN introduction_requests received ON received.sender_id = u.id AND received.receiver_id = ?
     WHERE ${whereSql}
     ORDER BY u.verified DESC, p.created_at DESC
     LIMIT ? OFFSET ?`,
  )
    .bind(user.id, user.id, user.id, ...params, limit, offset)
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
