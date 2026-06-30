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
  createdAt: string;
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

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const posts = await readPosts(env);
  return json({ success: true, posts });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as {
      caption?: string;
      imageDataUrl?: string;
      author?: string;
      avatar?: string;
    };

    const caption = String(body.caption || '').trim();
    const imageDataUrl = String(body.imageDataUrl || '').trim();

    if (!caption && !imageDataUrl) {
      return json({ success: false, message: 'Caption or image is required.' }, 400);
    }

    if (!imageDataUrl) {
      return json({ success: false, message: 'Image is required for Marriage Cafe posts.' }, 400);
    }

    const now = new Date();
    const id = `cafe_${now.getTime()}_${Math.random().toString(36).slice(2, 8)}`;
    const { bytes, contentType } = dataUrlToBytes(imageDataUrl);

    const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const imageKey = `marriage-cafe-${id}.${extension}`;

    await env.ZAWAJ_UPLOADS.put(imageKey, bytes, {
      httpMetadata: {
        contentType,
        cacheControl: 'public, max-age=31536000',
      },
    });

    const post: CafePost = {
      id,
      author: body.author || 'Zawaj Al Araqi Member',
      role: 'Member post',
      avatar: body.avatar || 'ز',
      time: 'Just now',
      imageUrl: `/api/marriage-cafe/images/${encodeURIComponent(imageKey)}`,
      imageKey,
      caption: caption || 'A respectful visual post shared with the community.',
      likes: 0,
      comments: [],
      createdAt: now.toISOString(),
    };

    const posts = await readPosts(env);
    const updatedPosts = [post, ...posts].slice(0, 200);
    await writePosts(env, updatedPosts);

    return json({ success: true, post });
  } catch (error: any) {
    return json({
      success: false,
      message: error?.message || 'Could not save Marriage Cafe post.',
    }, 500);
  }
};

