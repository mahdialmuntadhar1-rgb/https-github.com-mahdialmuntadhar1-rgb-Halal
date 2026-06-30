interface Env {
  ZAWAJ_UPLOADS: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const rawKey = String(params.key || '');
  const key = decodeURIComponent(rawKey);

  if (!key || !key.startsWith('marriage-cafe-')) {
    return new Response('Invalid image key', { status: 400 });
  }

  const object = await env.ZAWAJ_UPLOADS.get(key);

  if (!object) {
    return new Response('Image not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000');

  return new Response(object.body, { headers });
};

