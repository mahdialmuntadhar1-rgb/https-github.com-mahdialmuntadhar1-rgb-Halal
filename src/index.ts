type AnyRecord = Record<string, any>;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const users = new Map<string, AnyRecord>();
const profiles = new Map<string, AnyRecord>();
const savedMatches = new Map<string, Set<string>>();
const requestStatuses = new Map<string, string>();
const conversations = new Map<string, AnyRecord[]>();

let heroImages: AnyRecord[] = [
  {
    id: 'hero-1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
    order: 1,
    isActive: true,
    title: 'Respectful halal introductions',
  },
  {
    id: 'hero-2',
    url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1400&q=80',
    order: 2,
    isActive: true,
    title: 'Privacy-first family values',
  },
];

let communityPosts: AnyRecord[] = [
  {
    id: 'post-1',
    category: 'advice',
    title: 'Respectful communication',
    content: 'Keep introductions serious, kind, and family-respecting. Never share private contact details too early.',
    userName: 'HALAL Team',
    userGender: 'male',
    createdAt: new Date().toISOString(),
    likesCount: 0,
    likedBy: [],
    comments: [],
    isDailyQuestion: true,
  },
];

const baseMatches: AnyRecord[] = [
  {
    id: 'match-1',
    name: 'Amina',
    age: 27,
    gender: 'female',
    city: 'Sulaymaniyah',
    governorate: 'Sulaymaniyah',
    country: 'Iraq',
    religion: 'islam',
    sect: 'none',
    ethnicity: 'kurdish',
    profession: 'Teacher',
    education: 'Bachelor Degree',
    intention: 'Marriage',
    timeline: 'Within 1 year',
    wantsChildren: 'Yes',
    communicationPreference: 'Private introduction first',
    valuesSummary: ['Family respect', 'Education', 'Kindness'],
    verified: true,
    isOnline: true,
    photoStatus: 'blurred',
    avatarSeed: 'amina',
    avatarUrl: '',
    compatibilityScore: 92,
    languages: ['Kurdish', 'Arabic', 'English'],
    aboutMe: 'Serious about halal marriage and respectful family communication.',
    dealbreakers: ['Disrespect', 'Dishonesty'],
    requestStatus: 'none',
    badges: ['Verified', 'Serious'],
  },
  {
    id: 'match-2',
    name: 'Zainab',
    age: 29,
    gender: 'female',
    city: 'Baghdad',
    governorate: 'Baghdad',
    country: 'Iraq',
    religion: 'islam',
    sect: 'none',
    ethnicity: 'arab',
    profession: 'Pharmacist',
    education: 'Bachelor Degree',
    intention: 'Marriage',
    timeline: '6 months',
    wantsChildren: 'Yes',
    communicationPreference: 'Family-aware introduction',
    valuesSummary: ['Religion', 'Stability', 'Respect'],
    verified: true,
    isOnline: false,
    photoStatus: 'initials',
    avatarSeed: 'zainab',
    avatarUrl: '',
    compatibilityScore: 88,
    languages: ['Arabic', 'English'],
    aboutMe: 'Looking for a sincere, responsible, and respectful partner.',
    dealbreakers: ['Smoking', 'Not serious'],
    requestStatus: 'none',
    badges: ['Verified'],
  },
  {
    id: 'match-3',
    name: 'Sara',
    age: 26,
    gender: 'female',
    city: 'Erbil',
    governorate: 'Erbil',
    country: 'Iraq',
    religion: 'islam',
    sect: 'none',
    ethnicity: 'kurdish',
    profession: 'Designer',
    education: 'Bachelor Degree',
    intention: 'Marriage',
    timeline: 'Flexible',
    wantsChildren: 'Maybe later',
    communicationPreference: 'Platform chat first',
    valuesSummary: ['Creativity', 'Family', 'Honesty'],
    verified: false,
    isOnline: true,
    photoStatus: 'hidden',
    avatarSeed: 'sara',
    avatarUrl: '',
    compatibilityScore: 81,
    languages: ['Kurdish', 'Arabic'],
    aboutMe: 'Calm personality, family-oriented, and values privacy.',
    dealbreakers: ['Aggression', 'Dishonesty'],
    requestStatus: 'none',
    badges: [],
  },
];

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function readJson(request: Request): Promise<AnyRecord> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function createToken(user: AnyRecord): string {
  return `halal.${toBase64Url(JSON.stringify({ email: user.email, name: user.name, role: user.role, iat: Date.now() }))}`;
}

function getAuthUser(request: Request): AnyRecord | null {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token.startsWith('halal.')) return null;

  try {
    const payload = JSON.parse(fromBase64Url(token.slice('halal.'.length)));
    if (!payload.email) return null;
    const email = String(payload.email).toLowerCase();
    const existing = users.get(email);
    if (existing) return existing;
    const user = {
      id: email,
      email,
      name: payload.name || email.split('@')[0],
      membershipStatus: 'free',
      createdAt: new Date().toISOString(),
      role: payload.role || 'user',
    };
    users.set(email, user);
    return user;
  } catch {
    return null;
  }
}

function userFromEmail(email: string, name?: string, gender?: string): AnyRecord {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const safeName = String(name || cleanEmail.split('@')[0] || 'User').trim();
  const role = cleanEmail.includes('admin') || cleanEmail.includes('safar') ? 'admin' : 'user';
  const user = {
    id: cleanEmail,
    email: cleanEmail,
    name: safeName,
    membershipStatus: 'free',
    createdAt: new Date().toISOString(),
    role,
  };
  users.set(cleanEmail, user);

  if (!profiles.has(cleanEmail)) {
    profiles.set(cleanEmail, makeDefaultProfile(user, gender === 'male' ? 'male' : 'female'));
  }
  return user;
}

function makeDefaultProfile(user: AnyRecord, gender: 'male' | 'female' = 'male'): AnyRecord {
  return {
    name: user.name,
    age: 25,
    gender,
    country: 'Iraq',
    governorate: 'Baghdad',
    city: 'Baghdad',
    religion: 'islam',
    sect: 'none',
    ethnicity: 'others',
    education: 'Bachelor Degree',
    profession: 'Professional',
    professionCategory: 'General',
    languages: ['Arabic'],
    maritalStatus: 'Single',
    intention: 'Marriage',
    email: user.email,
    role: user.role,
    badges: user.role === 'admin' ? ['Admin'] : [],
    savedMatches: Array.from(savedMatches.get(user.email) || []),
    lookingFor: 'Serious halal marriage',
    timeline: 'Flexible',
    wantsChildren: 'Yes',
    relocation: 'Open to discussion',
    communicationPreference: 'Private introduction first',
    values: ['Respect', 'Honesty', 'Family'],
    photoPrivacy: 'blurred',
    privateContactMode: 'Private Introduction Requests Only',
    sendRequestsPermission: 'Verified and respectful profiles only',
    seeProfilePermission: 'Respectful users only',
    preferences: {
      partnerAgeRange: '24-35',
      partnerCountry: 'Iraq',
      partnerGovernorate: 'All Iraq',
      partnerReligion: 'islam',
      partnerSect: 'all',
      partnerEthnicity: 'all',
      partnerLanguage: ['Arabic', 'Kurdish'],
      partnerSmoking: 'No',
      partnerWantsChildren: 'Yes',
    },
    privacy: {
      photoPrivacy: 'blurred',
      profileVisibility: 'all',
      privateContactMode: 'Private Introduction Requests Only',
      sendRequestsPermission: 'Verified and respectful profiles only',
      seeProfilePermission: 'Respectful users only',
    },
  };
}

function getMatchesForUser(email: string, url: URL): AnyRecord[] {
  const page = Number(url.searchParams.get('page') || '1');
  const limit = Number(url.searchParams.get('limit') || '20');
  let items = baseMatches.map((match) => ({
    ...match,
    requestStatus: requestStatuses.get(`${email}:${match.id}`) || 'none',
  }));

  const gender = url.searchParams.get('gender');
  const governorate = url.searchParams.get('governorate');
  const religion = url.searchParams.get('religion');
  const verifiedOnly = url.searchParams.get('verifiedOnly');
  const minAge = Number(url.searchParams.get('minAge') || '0');
  const maxAge = Number(url.searchParams.get('maxAge') || '120');

  if (gender && gender !== 'all') items = items.filter((m) => m.gender === gender);
  if (governorate && governorate !== 'all' && governorate !== 'All Iraq') items = items.filter((m) => m.governorate === governorate);
  if (religion && religion !== 'all') items = items.filter((m) => m.religion === religion);
  if (verifiedOnly === 'true') items = items.filter((m) => m.verified);
  items = items.filter((m) => m.age >= minAge && m.age <= maxAge);

  const start = Math.max(0, (page - 1) * limit);
  return items.slice(start, start + limit);
}

function getUserConversations(email: string): AnyRecord[] {
  const rows = conversations.get(email) || [];
  return rows;
}

function findMatch(matchId: string): AnyRecord | undefined {
  return baseMatches.find((match) => match.id === matchId);
}

async function handleApi(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '') || '/';

  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (path === '/health') return json({ ok: true, service: 'halal-api', time: new Date().toISOString() });

  if (path === '/auth/register' && request.method === 'POST') {
    const body = await readJson(request);
    if (!body.email || !body.password || !body.name) return json({ message: 'Email, password, and name are required' }, 400);
    const user = userFromEmail(body.email, body.name, body.gender);
    return json({ token: createToken(user), user });
  }

  if (path === '/auth/login' && request.method === 'POST') {
    const body = await readJson(request);
    if (!body.email || !body.password) return json({ message: 'Email and password are required' }, 400);
    const user = users.get(String(body.email).toLowerCase()) || userFromEmail(body.email, undefined, body.gender);
    return json({ token: createToken(user), user });
  }

  if (path === '/auth/forgot-password' && request.method === 'POST') {
    return json({ success: true, message: 'Password reset request received. Email delivery can be connected later.' });
  }

  const authUser = getAuthUser(request);
  if (!authUser) return json({ message: 'Unauthorized' }, 401);
  const email = authUser.email;

  if (path === '/profile/me' && request.method === 'GET') {
    const profile = profiles.get(email) || makeDefaultProfile(authUser);
    profile.savedMatches = Array.from(savedMatches.get(email) || []);
    profiles.set(email, profile);
    return json(profile);
  }

  if (path === '/profile/me' && request.method === 'PUT') {
    const body = await readJson(request);
    const current = profiles.get(email) || makeDefaultProfile(authUser);
    const updated = { ...current, ...body, email, role: authUser.role };
    profiles.set(email, updated);
    return json(updated);
  }

  if (path === '/matches' && request.method === 'GET') {
    const matches = getMatchesForUser(email, url);
    return json({ matches, hasMore: false });
  }

  const saveMatch = path.match(/^\/matches\/([^/]+)\/save$/);
  if (saveMatch && request.method === 'POST') {
    const matchId = saveMatch[1];
    const set = savedMatches.get(email) || new Set<string>();
    if (set.has(matchId)) set.delete(matchId);
    else set.add(matchId);
    savedMatches.set(email, set);
    const profile = profiles.get(email) || makeDefaultProfile(authUser);
    profile.savedMatches = Array.from(set);
    profiles.set(email, profile);
    return json(profile);
  }

  if (path === '/requests' && request.method === 'POST') {
    const body = await readJson(request);
    const targetMatchId = String(body.targetMatchId || '');
    if (!findMatch(targetMatchId)) return json({ message: 'Match not found' }, 404);
    requestStatuses.set(`${email}:${targetMatchId}`, 'sent');
    return json({
      success: true,
      request: {
        id: crypto.randomUUID(),
        senderId: email,
        receiverId: targetMatchId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  }

  const acceptRequest = path.match(/^\/requests\/([^/]+)\/accept$/);
  if (acceptRequest && request.method === 'PUT') {
    const matchId = acceptRequest[1];
    const match = findMatch(matchId);
    if (!match) return json({ message: 'Match not found' }, 404);
    requestStatuses.set(`${email}:${matchId}`, 'accepted');
    const list = getUserConversations(email);
    if (!list.find((c) => c.matchId === matchId)) {
      list.push({
        matchId,
        messages: [
          {
            id: crypto.randomUUID(),
            sender: 'match',
            text: 'Assalamu alaikum. Thank you for the respectful introduction request.',
            timestamp: new Date().toISOString(),
          },
        ],
      });
      conversations.set(email, list);
    }
    return json({ success: true, match: { ...match, requestStatus: 'accepted' } });
  }

  if (path === '/conversations' && request.method === 'GET') {
    return json(getUserConversations(email));
  }

  const messageRoute = path.match(/^\/conversations\/([^/]+)\/messages$/);
  if (messageRoute && request.method === 'POST') {
    const matchId = messageRoute[1];
    const body = await readJson(request);
    const message = {
      id: crypto.randomUUID(),
      sender: body.sender === 'match' ? 'match' : 'user',
      text: String(body.text || '').slice(0, 2000),
      timestamp: new Date().toISOString(),
    };
    const list = getUserConversations(email);
    let conversation = list.find((c) => c.matchId === matchId);
    if (!conversation) {
      conversation = { matchId, messages: [] };
      list.push(conversation);
    }
    conversation.messages.push(message);
    conversations.set(email, list);
    return json(message);
  }

  if (path === '/hero-images' && request.method === 'GET') {
    return json(heroImages.filter((img) => img.isActive).sort((a, b) => a.order - b.order));
  }

  if (path === '/hero-images' && request.method === 'POST') {
    const body = await readJson(request);
    const image = {
      id: crypto.randomUUID(),
      url: String(body.url || ''),
      title: String(body.title || 'Hero image'),
      isActive: body.isActive !== false,
      order: heroImages.length + 1,
    };
    heroImages.push(image);
    return json(image, 201);
  }

  const heroRoute = path.match(/^\/hero-images\/([^/]+)$/);
  if (heroRoute && request.method === 'PUT') {
    const body = await readJson(request);
    const id = heroRoute[1];
    heroImages = heroImages.map((img) => (img.id === id ? { ...img, ...body, id } : img));
    return json(heroImages.find((img) => img.id === id) || null);
  }

  if (heroRoute && request.method === 'DELETE') {
    const id = heroRoute[1];
    heroImages = heroImages.filter((img) => img.id !== id);
    return json({ success: true });
  }

  if (path === '/hero-images/reorder' && request.method === 'PUT') {
    const body = await readJson(request);
    if (Array.isArray(body.reordered)) heroImages = body.reordered;
    return json(heroImages);
  }

  if (path === '/community/posts' && request.method === 'GET') {
    return json(communityPosts);
  }

  if (path === '/community/posts' && request.method === 'POST') {
    const body = await readJson(request);
    const post = {
      id: crypto.randomUUID(),
      category: body.category || 'advice',
      title: String(body.title || '').slice(0, 140),
      content: String(body.content || '').slice(0, 4000),
      userName: authUser.name,
      userGender: profiles.get(email)?.gender || 'male',
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedBy: [],
      comments: [],
      isDailyQuestion: body.isDaily === true,
    };
    communityPosts.unshift(post);
    return json(post, 201);
  }

  const likeRoute = path.match(/^\/community\/posts\/([^/]+)\/like$/);
  if (likeRoute && request.method === 'POST') {
    const post = communityPosts.find((p) => p.id === likeRoute[1]);
    if (!post) return json({ message: 'Post not found' }, 404);
    if (!post.likedBy.includes(authUser.name)) post.likedBy.push(authUser.name);
    post.likesCount = post.likedBy.length;
    return json(post);
  }

  const commentRoute = path.match(/^\/community\/posts\/([^/]+)\/comments$/);
  if (commentRoute && request.method === 'POST') {
    const body = await readJson(request);
    const post = communityPosts.find((p) => p.id === commentRoute[1]);
    if (!post) return json({ message: 'Post not found' }, 404);
    const comment = {
      id: crypto.randomUUID(),
      postId: post.id,
      userName: body.userName || authUser.name,
      userGender: body.userGender === 'female' ? 'female' : 'male',
      text: String(body.text || '').slice(0, 1000),
      createdAt: new Date().toISOString(),
    };
    post.comments.push(comment);
    return json(comment, 201);
  }

  const postDeleteRoute = path.match(/^\/community\/posts\/([^/]+)$/);
  if (postDeleteRoute && request.method === 'DELETE') {
    communityPosts = communityPosts.filter((p) => p.id !== postDeleteRoute[1]);
    return json({ success: true });
  }

  const reportPostRoute = path.match(/^\/community\/posts\/([^/]+)\/report$/);
  if (reportPostRoute && request.method === 'POST') {
    const post = communityPosts.find((p) => p.id === reportPostRoute[1]);
    if (post) post.isReported = true;
    return json({ success: true });
  }

  const reportCommentRoute = path.match(/^\/community\/posts\/([^/]+)\/comments\/([^/]+)\/report$/);
  if (reportCommentRoute && request.method === 'POST') {
    const post = communityPosts.find((p) => p.id === reportCommentRoute[1]);
    const comment = post?.comments.find((c: AnyRecord) => c.id === reportCommentRoute[2]);
    if (comment) comment.isReported = true;
    return json({ success: true });
  }

  const deleteCommentRoute = path.match(/^\/community\/posts\/([^/]+)\/comments\/([^/]+)$/);
  if (deleteCommentRoute && request.method === 'DELETE') {
    const post = communityPosts.find((p) => p.id === deleteCommentRoute[1]);
    if (post) post.comments = post.comments.filter((c: AnyRecord) => c.id !== deleteCommentRoute[2]);
    return json({ success: true });
  }

  return json({ message: `API route not found: ${path}` }, 404);
}

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return json({ ok: true, service: 'halal-worker', hint: 'Build frontend assets before deployment.' });
  },
};
