import { HttpError, json, noContent, optionalString, readJson, RequestContext, requireAdmin, requireString, uuid } from '../db';

export async function handleHeroImages(ctx: RequestContext): Promise<Response | null> {
  const { request, url, env } = ctx;

  if (url.pathname === '/api/hero-images' && request.method === 'GET') {
    const rows = await env.DB.prepare(
      'SELECT * FROM hero_images WHERE active = 1 ORDER BY sort_order ASC, created_at DESC',
    ).all();
    return json({ heroImages: rows.results || [] });
  }

  if (url.pathname === '/api/admin/hero-images' && request.method === 'POST') {
    requireAdmin(ctx);
    const body = await readJson(request);
    const imageUrl = requireString(body, 'imageUrl', 1000);
    const title = optionalString(body, 'title', 120) || 'Hero image';
    const altText = optionalString(body, 'altText', 240) || title;
    const nextOrder = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM hero_images')
      .first<{ next_order: number }>();
    const id = uuid();
    await env.DB.prepare(
      'INSERT INTO hero_images (id, title, image_url, alt_text, active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
    )
      .bind(id, title, imageUrl, altText, 1, Number(nextOrder?.next_order || 1))
      .run();
    const heroImage = await env.DB.prepare('SELECT * FROM hero_images WHERE id = ?').bind(id).first();
    return json({ heroImage }, 201);
  }

  const adminMatch = url.pathname.match(/^\/api\/admin\/hero-images\/([^/]+)$/);
  if (adminMatch && request.method === 'PUT') {
    requireAdmin(ctx);
    const id = decodeURIComponent(adminMatch[1]);
    const body = await readJson(request);
    const existing = await env.DB.prepare('SELECT * FROM hero_images WHERE id = ?').bind(id).first<Record<string, unknown>>();
    if (!existing) throw new HttpError(404, 'Hero image not found.');

    const active = typeof body.active === 'boolean' ? (body.active ? 1 : 0) : Number(existing.active ?? 1);
    const sortOrder = Number.isInteger(Number(body.sortOrder)) ? Number(body.sortOrder) : Number(existing.sort_order ?? 0);

    await env.DB.prepare(
      `UPDATE hero_images
       SET title = ?, image_url = ?, alt_text = ?, active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
      .bind(
        optionalString(body, 'title', 120) || String(existing.title || 'Hero image'),
        optionalString(body, 'imageUrl', 1000) || String(existing.image_url || ''),
        optionalString(body, 'altText', 240) || String(existing.alt_text || 'Hero image'),
        active,
        sortOrder,
        id,
      )
      .run();

    const heroImage = await env.DB.prepare('SELECT * FROM hero_images WHERE id = ?').bind(id).first();
    return json({ heroImage });
  }

  if (adminMatch && request.method === 'DELETE') {
    requireAdmin(ctx);
    await env.DB.prepare('DELETE FROM hero_images WHERE id = ?').bind(decodeURIComponent(adminMatch[1])).run();
    return noContent();
  }

  return null;
}
