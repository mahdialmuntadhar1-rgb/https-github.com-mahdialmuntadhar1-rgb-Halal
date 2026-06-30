interface Env {
  ZAWAJ_UPLOADS: R2Bucket;
}

interface CafeComment {
  id: string;
  name: string;
  text: string;
}

interface CafePost {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  imageUrl: string;
  imageKey?: string;
  caption: string;
  likes: number;
  comments: CafeComment[];
  isOfficial?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const POSTS_KEY = 'marriage-cafe-posts.json';

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  });
}

async function readPosts(env: Env): Promise<CafePost[]> {
  const object = await env.ZAWAJ_UPLOADS.get(POSTS_KEY);
  if (!object) return [];

  try {
    const text = await object.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writePosts(env: Env, posts: CafePost[]) {
  await env.ZAWAJ_UPLOADS.put(POSTS_KEY, JSON.stringify(posts, null, 2), {
    httpMetadata: {
      contentType: 'application/json; charset=utf-8',
    },
  });
}

function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; contentType: string } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid image data.');
  }

  const contentType = match[1] || 'image/jpeg';
  const base64 = match[2];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return { bytes, contentType };
}

function getPostId(params: Record<string, string | string[]>): string {
  const raw = params.id;
  return Array.isArray(raw) ? raw[0] : String(raw || '');
}

export const onRequestPut: PagesFunction<Env> = async ({ request, params, env }) => {
  try {
    const id = getPostId(params);
    if (!id) {
      return json({ success: false, message: 'Post id is required.' }, 400);
    }

    const body = await request.json() as {
      caption?: string;
      imageDataUrl?: string;
      likes?: number;
    };

    const posts = await readPosts(env);
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
      return json({ success: false, message: 'Post not found.' }, 404);
    }

    const current = posts[index];
    const updated: CafePost = {
      ...current,
      updatedAt: new Date().toISOString(),
    };

    if (typeof body.caption === 'string') {
      updated.caption = body.caption.trim() || current.caption;
    }

    if (typeof body.likes === 'number' && Number.isFinite(body.likes)) {
      updated.likes = Math.max(0, Math.round(body.likes));
    }

    const imageDataUrl = String(body.imageDataUrl || '').trim();

    if (imageDataUrl) {
      const { bytes, contentType } = dataUrlToBytes(imageDataUrl);
      const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
      const imageKey = `marriage-cafe-${id}-edited-${Date.now()}.${extension}`;

      await env.ZAWAJ_UPLOADS.put(imageKey, bytes, {
        httpMetadata: {
          contentType,
          cacheControl: 'public, max-age=31536000',
        },
      });

      updated.imageKey = imageKey;
      updated.imageUrl = `/api/marriage-cafe/images/${encodeURIComponent(imageKey)}`;
    }

    posts[index] = updated;
    await writePosts(env, posts);

    return json({ success: true, post: updated });
  } catch (error: any) {
    return json({
      success: false,
      message: error?.message || 'Could not update Marriage Cafe post.',
    }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ params, env }) => {
  try {
    const id = getPostId(params);
    if (!id) {
      return json({ success: false, message: 'Post id is required.' }, 400);
    }

    const posts = await readPosts(env);
    const updatedPosts = posts.filter((post) => post.id !== id);

    if (updatedPosts.length === posts.length) {
      return json({ success: false, message: 'Post not found.' }, 404);
    }

    await writePosts(env, updatedPosts);

    return json({ success: true });
  } catch (error: any) {
    return json({
      success: false,
      message: error?.message || 'Could not delete Marriage Cafe post.',
    }, 500);
  }
};
