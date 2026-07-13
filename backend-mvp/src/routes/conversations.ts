import { HttpError, json, readJson, RequestContext, requireString, requireUser, uuid } from '../db';
import { filterProfilePhoto } from './profile';

export async function handleConversations(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;
  const path = url.pathname.replace(/^\/api(?=\/)/, '');
  const user = requireUser(ctx);

  if (path === '/conversations' && request.method === 'GET') {
    const conversations = await env.DB.prepare(
      `SELECT
         c.*,
         CASE WHEN c.user_one_id = ? THEN c.user_two_id ELSE c.user_one_id END AS match_id,
         u.verified,
         p.*,
         (CAST(strftime('%Y', 'now') AS INTEGER) - p.birth_year) AS age,
         'accepted' AS request_status,
         0 AS saved
       FROM halal_conversations c
       JOIN halal_requests r ON r.id = c.request_id AND r.status = 'accepted'
       JOIN halal_users u ON u.id = CASE WHEN c.user_one_id = ? THEN c.user_two_id ELSE c.user_one_id END
       LEFT JOIN halal_profiles p ON p.user_id = u.id
       WHERE c.user_one_id = ? OR c.user_two_id = ?
       ORDER BY c.created_at DESC`,
    )
      .bind(user.id, user.id, user.id, user.id)
      .all<Record<string, unknown>>();

    const result = [];
    for (const conversation of conversations.results || []) {
      const messages = await env.DB.prepare('SELECT id, sender_id, text, created_at FROM halal_messages WHERE conversation_id = ? ORDER BY created_at ASC')
        .bind(conversation.id)
        .all<Record<string, unknown>>();
      result.push({
        id: conversation.id,
        matchId: conversation.match_id,
        match: filterProfilePhoto({ ...conversation, user_id: conversation.match_id }, user.id),
        messages: (messages.results || []).map((message) => ({
          id: message.id,
          sender: message.sender_id === user.id ? 'user' : 'match',
          text: message.text,
          timestamp: message.created_at,
        })),
      });
    }

    return json({ conversations: result });
  }

  const messageMatch = path.match(/^\/conversations\/([^/]+)\/messages$/);
  if (messageMatch && request.method === 'POST') {
    const conversationId = decodeURIComponent(messageMatch[1]);
    const conversation = await env.DB.prepare(
      `SELECT c.id
       FROM halal_conversations c
       JOIN halal_requests r ON r.id = c.request_id AND r.status = 'accepted'
       WHERE c.id = ? AND (c.user_one_id = ? OR c.user_two_id = ?)`,
    )
      .bind(conversationId, user.id, user.id)
      .first();
    if (!conversation) throw new HttpError(404, 'Conversation not found.');

    const body = await readJson(request);
    const text = requireString(body, 'text', 2000);
    const id = uuid();
    await env.DB.prepare('INSERT INTO halal_messages (id, conversation_id, sender_id, text) VALUES (?, ?, ?, ?)')
      .bind(id, conversationId, user.id, text)
      .run();

    const message = await env.DB.prepare('SELECT id, sender_id, text, created_at FROM halal_messages WHERE id = ?').bind(id).first();
    return json({ message }, 201);
  }

  return null;
}

