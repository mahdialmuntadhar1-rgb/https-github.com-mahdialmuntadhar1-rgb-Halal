import { HttpError, json, noContent, readJson, RequestContext, requireAdmin, requireString, requireUser, uuid } from '../db';
import { publicRequestRow } from '../privacy';

async function ensureConversation(ctx: RequestContext, requestId: string): Promise<void> {
  const row = await ctx.env.DB.prepare('SELECT sender_id, receiver_id FROM halal_requests WHERE id = ? AND status = ?')
    .bind(requestId, 'accepted')
    .first<{ sender_id: string; receiver_id: string }>();
  if (!row) return;

  await ctx.env.DB.prepare('INSERT OR IGNORE INTO halal_conversations (id, request_id, user_one_id, user_two_id) VALUES (?, ?, ?, ?)')
    .bind(uuid(), requestId, row.sender_id, row.receiver_id)
    .run();
}

export async function handleRequests(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;
  const path = url.pathname.replace(/^\/api(?=\/)/, '');
  const user = requireUser(ctx);

  if ((path === '/requests' || path === '/request/send') && request.method === 'POST') {
    const body = await readJson(request);
    const receiverId =
      typeof body.receiverId === 'string'
        ? requireString(body, 'receiverId', 80)
        : requireString(body, 'toUserId', 80);
    if (receiverId === user.id) throw new HttpError(400, 'You cannot request your own profile.');

    const receiver = await env.DB.prepare('SELECT id FROM halal_users WHERE id = ?').bind(receiverId).first();
    if (!receiver) throw new HttpError(404, 'Receiver not found.');

    const existing = await env.DB.prepare(
      `SELECT id, status FROM halal_requests
       WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
    )
      .bind(user.id, receiverId, receiverId, user.id)
      .first<Record<string, unknown>>();

    if (existing) return json({ request: existing });

    const id = uuid();
    await env.DB.prepare('INSERT INTO halal_requests (id, sender_id, receiver_id, status) VALUES (?, ?, ?, ?)')
      .bind(id, user.id, receiverId, 'pending')
      .run();
    await env.DB.prepare('INSERT OR IGNORE INTO halal_introduction_requests (id, sender_id, receiver_id, status) VALUES (?, ?, ?, ?)')
      .bind(id, user.id, receiverId, 'pending')
      .run();

    const row = await env.DB.prepare('SELECT * FROM halal_requests WHERE id = ?').bind(id).first();
    return json({ request: row }, 201);
  }

  if (path === '/request/respond' && request.method === 'POST') {
    const body = await readJson(request);
    const requestId = requireString(body, 'requestId', 80);
    const action = requireString(body, 'action', 20);
    if (!['accept', 'accepted', 'decline', 'declined'].includes(action)) {
      throw new HttpError(400, 'action must be accept or decline.');
    }
    const intro = await env.DB.prepare('SELECT * FROM halal_requests WHERE id = ?').bind(requestId).first<Record<string, unknown>>();
    if (!intro) throw new HttpError(404, 'Introduction request not found.');

    const isReceiver = intro.receiver_id === user.id;
    const isAdmin = user.role === 'admin';
    if (!isReceiver && !isAdmin) throw new HttpError(403, 'Only the receiver or an admin can decide this request.');

    const status = action === 'accept' || action === 'accepted' ? 'accepted' : 'declined';
    await env.DB.prepare(
      'UPDATE halal_requests SET status = ?, decided_by = ?, decided_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    )
      .bind(status, user.id, requestId)
      .run();
    await env.DB.prepare(
      'UPDATE halal_introduction_requests SET status = ?, decided_by = ?, decided_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    )
      .bind(status, user.id, requestId)
      .run();

    if (status === 'accepted') await ensureConversation(ctx, requestId);
    return json({ requestId, status });
  }

  const decisionMatch = path.match(/^\/requests\/([^/]+)\/(accept|decline)$/);
  if (decisionMatch && request.method === 'PUT') {
    const requestId = decodeURIComponent(decisionMatch[1]);
    const action = decisionMatch[2];
    const intro = await env.DB.prepare('SELECT * FROM halal_requests WHERE id = ?').bind(requestId).first<Record<string, unknown>>();
    if (!intro) throw new HttpError(404, 'Introduction request not found.');

    const isReceiver = intro.receiver_id === user.id;
    const isAdmin = user.role === 'admin';
    if (!isReceiver && !isAdmin) throw new HttpError(403, 'Only the receiver or an admin can decide this request.');

    const status = action === 'accept' ? 'accepted' : 'declined';
    await env.DB.prepare(
      'UPDATE halal_requests SET status = ?, decided_by = ?, decided_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    )
      .bind(status, user.id, requestId)
      .run();
    await env.DB.prepare(
      'UPDATE halal_introduction_requests SET status = ?, decided_by = ?, decided_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    )
      .bind(status, user.id, requestId)
      .run();

    if (status === 'accepted') await ensureConversation(ctx, requestId);
    return noContent();
  }

  if (path === '/request/list' && request.method === 'GET') {
    const rows = await env.DB.prepare(
      `SELECT
         r.id,
         r.sender_id,
         r.receiver_id,
         r.status,
         r.created_at,
         r.decided_at,
         sender_profile.full_name AS sender_name,
         receiver_profile.full_name AS receiver_name
       FROM halal_requests r
       JOIN halal_users sender ON sender.id = r.sender_id
       JOIN halal_users receiver ON receiver.id = r.receiver_id
       LEFT JOIN halal_profiles sender_profile ON sender_profile.user_id = r.sender_id
       LEFT JOIN halal_profiles receiver_profile ON receiver_profile.user_id = r.receiver_id
       WHERE r.sender_id = ? OR r.receiver_id = ?
       ORDER BY r.created_at DESC
       LIMIT 100`,
    )
      .bind(user.id, user.id)
      .all();
    const requests = (rows.results || []).map((row) => publicRequestRow(row as Record<string, unknown>));
    return json({ requests });
  }

  if (path === '/admin/requests' && request.method === 'GET') {
    requireAdmin(ctx);
    const rows = await env.DB.prepare(
      `SELECT
         r.id,
         r.sender_id,
         r.receiver_id,
         r.status,
         r.created_at,
         r.decided_at,
         sender.email AS sender_email,
         receiver.email AS receiver_email,
         sender_profile.full_name AS sender_name,
         receiver_profile.full_name AS receiver_name
       FROM halal_requests r
       JOIN halal_users sender ON sender.id = r.sender_id
       JOIN halal_users receiver ON receiver.id = r.receiver_id
       LEFT JOIN halal_profiles sender_profile ON sender_profile.user_id = r.sender_id
       LEFT JOIN halal_profiles receiver_profile ON receiver_profile.user_id = r.receiver_id
       ORDER BY
         CASE r.status WHEN 'pending' THEN 0 WHEN 'accepted' THEN 1 ELSE 2 END,
         r.created_at DESC
       LIMIT 100`,
    ).all();
    return json({ requests: rows.results || [] });
  }

  return null;
}

