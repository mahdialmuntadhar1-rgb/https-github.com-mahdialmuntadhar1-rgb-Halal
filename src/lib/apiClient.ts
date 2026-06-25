import {
  CommunityCategory,
  CommunityPost,
  ContentReport,
  Conversation,
  HeroImage,
  IntroductionRequest,
  MatchProfile,
  SearchFilters,
  SessionUser,
  UserProfile,
} from '../types';
import { mockApi } from '../services/mockApi';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const TOKEN_KEY = 'halal.authToken';

export interface MatchesResponse {
  matches: MatchProfile[];
  hasMore: boolean;
  page: number;
  limit: number;
  total: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function getIsDemoMode(): boolean {
  const requested = String(import.meta.env.VITE_DEMO_MODE || '').toLowerCase() === 'true';
  const allowProductionDemo = String(import.meta.env.VITE_ALLOW_PROD_DEMO || '').toLowerCase() === 'true';
  return requested && (!import.meta.env.PROD || allowProductionDemo);
}

function getToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch (error) {
    throw new ApiError(`Network error while contacting HALAL backend for ${path}.`, 0, String(error));
  }

  const contentType = response.headers.get('content-type') || '';
  let payload: unknown = null;
  try {
    payload = contentType.includes('application/json') ? await response.json() : await response.text();
  } catch (error) {
    if (response.ok) {
      throw new ApiError(`Backend returned an invalid response for ${path}.`, response.status, String(error));
    }
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : `${init.method || 'GET'} ${path} failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

async function withDemoFallback<T>(operation: () => Promise<T>, demoOperation: () => Promise<T>): Promise<T> {
  if (getIsDemoMode()) {
    return demoOperation();
  }

  return operation();
}

function roleFromBackend(role?: string): SessionUser['role'] {
  return role === 'admin' ? 'admin' : 'member';
}

function normalizeHeroImage(row: Record<string, unknown>): HeroImage {
  return {
    id: String(row.id),
    url: String(row.image_url || row.url || ''),
    alt: String(row.alt_text || row.alt || 'HALAL hero image'),
    active: row.active !== 0 && row.active !== false,
    order: Number(row.sort_order ?? row.order ?? 0),
  };
}

function normalizeUserProfile(row: Record<string, unknown>): UserProfile {
  const age = Number(row.age || 0);
  const gender = row.gender === 'female' ? 'female' : 'male';

  return {
    name: String(row.full_name || row.name || ''),
    age,
    gender,
    country: String(row.country || 'Iraq'),
    governorate: String(row.governorate || 'Baghdad'),
    city: String(row.city || ''),
    religion: row.religion === 'non_islam' ? 'non_islam' : 'islam',
    sect: row.sect === 'shiaa' || row.sect === 'none' ? row.sect : 'sunni',
    ethnicity: row.ethnicity === 'kurdish' || row.ethnicity === 'others' ? row.ethnicity : 'arab',
    education: String(row.education || ''),
    profession: String(row.occupation || row.profession || ''),
    languages: Array.isArray(row.languages) ? row.languages.map(String) : ['Arabic'],
    maritalStatus: String(row.marital_status || row.maritalStatus || 'Single'),
    intention: String(row.intention || 'Serious for marriage'),
    lookingFor: String(row.looking_for || row.lookingFor || ''),
    bio: String(row.bio || ''),
    timeline: String(row.timeline || 'Within 1 year'),
    wantsChildren: String(row.wants_children || row.wantsChildren || 'Yes'),
    relocation: String(row.relocation || 'Open to discussion'),
    communicationPreference: String(row.communication_preference || row.communicationPreference || 'Respectful platform communication only'),
    values: Array.isArray(row.values) ? row.values.map(String) : [],
    intentionBadges: ['Serious for marriage'],
    photoPrivacy: row.photo_visibility === 'public' ? 'visible' : 'hidden_by_default',
    avatarUrl: String(row.photo_url || ''),
    privateContactMode: 'Private Introduction Requests Only',
    sendRequestsPermission: 'Everyone verified',
    seeProfilePermission: 'All verified members',
  };
}

function normalizeMatch(row: Record<string, unknown>): MatchProfile {
  const name = String(row.full_name || row.name || 'Member');
  const photoUrl = String(row.photo_url || row.avatarUrl || '');
  const backendPhotoStatus = String(row.photo_status || row.photoStatus || '');
  const photoStatus =
    backendPhotoStatus === 'blurred' || backendPhotoStatus === 'initials' || backendPhotoStatus === 'hidden' || backendPhotoStatus === 'unlocked'
      ? backendPhotoStatus
      : photoUrl
        ? 'visible'
        : 'hidden';

  return {
    id: String(row.user_id || row.id),
    name,
    age: Number(row.age || 0),
    gender: row.gender === 'female' ? 'female' : 'male',
    city: String(row.city || ''),
    governorate: String(row.governorate || ''),
    country: String(row.country || 'Iraq'),
    religion: row.religion === 'non_islam' ? 'non_islam' : 'islam',
    sect: row.sect === 'shiaa' || row.sect === 'none' ? row.sect : 'sunni',
    ethnicity: row.ethnicity === 'kurdish' || row.ethnicity === 'others' ? row.ethnicity : 'arab',
    profession: String(row.occupation || row.profession || 'Not specified'),
    education: String(row.education || 'Not specified'),
    intention: String(row.intention || 'Serious for marriage'),
    timeline: String(row.timeline || 'Within 1 year'),
    wantsChildren: String(row.wants_children || 'Open to discussion'),
    communicationPreference: String(row.communication_preference || 'Respectful platform communication only'),
    valuesSummary: Array.isArray(row.valuesSummary) ? row.valuesSummary.map(String) : ['Family values', 'Respectful communication'],
    verified: row.verified === 1 || row.verified === true,
    photoStatus,
    avatarSeed: name,
    avatarUrl: photoUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
    compatibilityScore: Number(row.compatibilityScore || 80),
    languages: Array.isArray(row.languages) ? row.languages.map(String) : ['Arabic'],
    aboutMe: String(row.bio || row.aboutMe || ''),
    dealbreakers: [],
    requestStatus:
      row.request_status === 'pending'
        ? 'sent'
        : row.request_status === 'sent' || row.requestStatus === 'sent'
        ? 'sent'
        : row.request_status === 'accepted' || row.requestStatus === 'accepted'
          ? 'accepted'
          : row.request_status === 'declined' || row.requestStatus === 'declined'
            ? 'declined'
            : 'none',
    saved: row.saved === 1 || row.saved === true,
    reportCount: Number(row.report_count || 0),
  };
}

function filtersToQuery(filters?: Partial<SearchFilters>, page = 1, limit = 20): string {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (filters?.gender && filters.gender !== 'all') params.set('gender', filters.gender);
  if (filters?.governorate && filters.governorate !== 'All' && filters.governorate !== 'All Iraq') {
    params.set('governorate', filters.governorate);
  }
  if (filters?.minAge) params.set('minAge', String(filters.minAge));
  if (filters?.maxAge) params.set('maxAge', String(filters.maxAge));
  if (filters?.religion && filters.religion !== 'all') params.set('religion', filters.religion);
  if (filters?.sect && filters.sect !== 'all') params.set('sect', filters.sect);
  if (filters?.ethnicity && filters.ethnicity !== 'all') params.set('ethnicity', filters.ethnicity);
  if (filters?.verifiedOnly) params.set('verified', 'true');

  return params.toString();
}

function normalizeIntroductionRequest(row: Record<string, unknown>): IntroductionRequest {
  return {
    id: String(row.id),
    senderId: String(row.sender_id || row.senderId || ''),
    receiverId: String(row.receiver_id || row.receiverId || ''),
    senderEmail: String(row.sender_email || row.senderEmail || ''),
    receiverEmail: String(row.receiver_email || row.receiverEmail || ''),
    senderName: String(row.sender_name || row.senderName || ''),
    receiverName: String(row.receiver_name || row.receiverName || ''),
    status: row.status === 'accepted' ? 'accepted' : row.status === 'declined' ? 'declined' : 'pending',
    createdAt: String(row.created_at || row.createdAt || ''),
    decidedAt: row.decided_at || row.decidedAt ? String(row.decided_at || row.decidedAt) : undefined,
  };
}

function normalizeConversation(row: Record<string, unknown>): Conversation {
  const messages = Array.isArray(row.messages)
    ? row.messages
        .filter((message): message is Record<string, unknown> => Boolean(message) && typeof message === 'object')
        .map((message) => ({
          id: String(message.id),
          sender: (message.sender === 'match' ? 'match' : 'user') as 'match' | 'user',
          text: String(message.text || ''),
          timestamp: String(message.timestamp || message.created_at || ''),
        }))
    : [];

  const match = row.match && typeof row.match === 'object' && !Array.isArray(row.match)
    ? normalizeMatch(row.match as Record<string, unknown>)
    : undefined;

  return {
    id: String(row.id || ''),
    matchId: String(row.matchId || row.match_id || match?.id || ''),
    match,
    messages,
  };
}

export const apiClient = {
  getIsDemoMode,

  hasToken(): boolean {
    return Boolean(getToken());
  },

  async register(email: string, password: string) {
    const response = await request<{ user: { id: string; email: string; role: string }; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(response.token);
    return { ...response.user, role: roleFromBackend(response.user.role) };
  },

  async login(email: string, password: string) {
    const response = await request<{ user: { id: string; email: string; role: string }; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(response.token);
    return { ...response.user, role: roleFromBackend(response.user.role) };
  },

  logout() {
    clearToken();
  },

  async getSession(): Promise<SessionUser> {
    return withDemoFallback(
      async () => {
        const response = await request<{ user: { id: string; email: string; role: string } }>('/auth/me');
        return { id: response.user.id, email: response.user.email, role: roleFromBackend(response.user.role) };
      },
      () => mockApi.getSession(),
    );
  },

  async getCurrentUser(): Promise<UserProfile & { backendRole?: SessionUser['role'] }> {
    return withDemoFallback(
      async () => {
        const response = await request<{ profile: Record<string, unknown> }>('/profile/me');
        const profile = normalizeUserProfile(response.profile);
        return { ...profile, backendRole: roleFromBackend(String(response.profile.role || 'user')) };
      },
      () => mockApi.getCurrentUser(),
    );
  },

  async updateCurrentUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    return withDemoFallback(
      async () => {
        const currentResponse = await request<{ profile: Record<string, unknown> }>('/profile/me');
        const current = normalizeUserProfile(currentResponse.profile);
        const merged = { ...current, ...updated };
        const birthYear = merged.age ? new Date().getUTCFullYear() - merged.age : undefined;
        const response = await request<{ profile: Record<string, unknown> }>('/profile/me', {
          method: 'PUT',
          body: JSON.stringify({
            fullName: merged.name || 'HALAL Member',
            gender: merged.gender,
            birthYear,
            governorate: merged.governorate,
            city: merged.city,
            religion: merged.religion,
            sect: merged.sect,
            ethnicity: merged.ethnicity,
            maritalStatus: merged.maritalStatus,
            education: merged.education,
            occupation: merged.profession,
            bio: merged.bio || merged.lookingFor,
            photoUrl: merged.avatarUrl,
            photoVisibility: merged.photoPrivacy === 'visible' ? 'public' : 'private',
          }),
        });
        return normalizeUserProfile(response.profile);
      },
      () => mockApi.updateCurrentUserProfile(updated),
    );
  },

  async getMatches(filters?: Partial<SearchFilters>, page = 1, limit = 20): Promise<MatchesResponse> {
    return withDemoFallback(
      async () => {
        const response = await request<{ matches: Record<string, unknown>[]; hasMore: boolean; page: number; limit: number; total: number }>(
          `/matches?${filtersToQuery(filters, page, limit)}`,
        );
        if (!Array.isArray(response.matches) || typeof response.hasMore !== 'boolean') {
          throw new ApiError('Backend returned an invalid matches response.', 502, response);
        }
        return {
          matches: response.matches.map(normalizeMatch),
          hasMore: Boolean(response.hasMore),
          page: Number(response.page),
          limit: Number(response.limit),
          total: Number(response.total),
        };
      },
      async () => {
        const all = await mockApi.getMatches();
        const start = (page - 1) * limit;
        const pageMatches = all.slice(start, start + limit);
        return { matches: pageMatches, hasMore: start + pageMatches.length < all.length, page, limit, total: all.length };
      },
    );
  },

  async saveProfile(id: string, saved = true): Promise<{ saved: boolean }> {
    return withDemoFallback(
      () => request<{ saved: boolean }>(`/saved-profiles/${encodeURIComponent(id)}`, { method: saved ? 'POST' : 'DELETE' }),
      async () => {
        await mockApi.toggleSavedProfile(id);
        return { saved };
      },
    );
  },

  async sendIntroductionRequest(receiverId: string): Promise<void> {
    return withDemoFallback(
      async () => {
        await request('/requests', {
          method: 'POST',
          body: JSON.stringify({ receiverId }),
        });
      },
      async () => undefined,
    );
  },

  async getAdminIntroductionRequests(): Promise<IntroductionRequest[]> {
    if (getIsDemoMode()) return [];
    const response = await request<{ requests: Record<string, unknown>[] }>('/admin/requests');
    return response.requests.map(normalizeIntroductionRequest);
  },

  async decideIntroductionRequest(id: string, decision: 'accept' | 'decline'): Promise<void> {
    if (getIsDemoMode()) return;
    await request(`/requests/${encodeURIComponent(id)}/${decision}`, { method: 'PUT' });
  },

  async getConversations(): Promise<Conversation[]> {
    const response = await request<{ conversations: unknown[] }>('/conversations');
    return response.conversations
      .filter((conversation): conversation is Record<string, unknown> => Boolean(conversation) && typeof conversation === 'object')
      .map(normalizeConversation);
  },

  async sendMessage(conversationId: string, text: string) {
    return request(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async getHeroImages(): Promise<HeroImage[]> {
    return withDemoFallback(
      async () => {
        const response = await request<{ heroImages: Record<string, unknown>[] }>('/hero-images');
        return response.heroImages.map(normalizeHeroImage);
      },
      () => mockApi.getHeroImages(),
    );
  },

  async addHeroImage(image: Pick<HeroImage, 'url' | 'alt'>): Promise<HeroImage> {
    return withDemoFallback(
      async () => {
        const response = await request<{ heroImage: Record<string, unknown> }>('/admin/hero-images', {
          method: 'POST',
          body: JSON.stringify({ title: image.alt, imageUrl: image.url, altText: image.alt }),
        });
        return normalizeHeroImage({ ...response.heroImage, image_url: image.url, alt_text: image.alt, active: 1 });
      },
      () => mockApi.addHeroImage(image),
    );
  },

  async updateHeroImage(id: string, updates: Partial<HeroImage>): Promise<HeroImage[]> {
    await request(`/admin/hero-images/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: updates.alt || 'Hero image',
        imageUrl: updates.url,
        altText: updates.alt,
        active: updates.active,
        sortOrder: updates.order,
      }),
    });
    return this.getHeroImages();
  },

  async removeHeroImage(id: string): Promise<HeroImage[]> {
    await request(`/admin/hero-images/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return this.getHeroImages();
  },

  async moveHeroImage(id: string, direction: 'up' | 'down'): Promise<HeroImage[]> {
    if (getIsDemoMode()) return mockApi.moveHeroImage(id, direction);
    throw new ApiError('Hero image reordering is not implemented by the backend yet.', 501);
  },

  getCommunityPosts(): Promise<CommunityPost[]> {
    if (getIsDemoMode()) return mockApi.getCommunityPosts();
    return Promise.resolve([]);
  },

  addCommunityPost(category: CommunityCategory, text: string): Promise<CommunityPost[]> {
    if (getIsDemoMode()) return mockApi.addCommunityPost(category, text);
    throw new ApiError('Community posts backend is not implemented yet.', 501);
  },

  likePost(id: string): Promise<CommunityPost[]> {
    if (getIsDemoMode()) return mockApi.likePost(id);
    throw new ApiError('Community posts backend is not implemented yet.', 501);
  },

  addComment(id: string, text: string): Promise<CommunityPost[]> {
    if (getIsDemoMode()) return mockApi.addComment(id, text);
    throw new ApiError('Community posts backend is not implemented yet.', 501);
  },

  reportPost(id: string): Promise<ContentReport> {
    if (getIsDemoMode()) return mockApi.reportPost(id);
    throw new ApiError('Reports backend is not implemented yet.', 501);
  },

  reportProfile(id: string): Promise<ContentReport> {
    if (getIsDemoMode()) return mockApi.reportProfile(id);
    return request<{ report: Record<string, unknown> }>(`/reports/profiles/${encodeURIComponent(id)}`, {
      method: 'POST',
      body: JSON.stringify({ reason: 'Reported by member' }),
    }).then(({ report }) => ({
      id: String(report.id),
      targetType: 'profile',
      targetId: String(report.target_id || report.targetId || id),
      reason: String(report.reason || 'Reported by member'),
      createdAt: String(report.created_at || report.createdAt || new Date().toISOString()),
      status: report.status === 'resolved' ? 'resolved' : 'open',
    }));
  },

  getReports(): Promise<ContentReport[]> {
    if (getIsDemoMode()) return mockApi.getReports();
    return request<{ reports: Record<string, unknown>[] }>('/reports').then(({ reports }) =>
      reports.map((report) => ({
        id: String(report.id),
        targetType: report.target_type === 'post' ? 'post' : 'profile',
        targetId: String(report.target_id || ''),
        reason: String(report.reason || ''),
        createdAt: String(report.created_at || ''),
        status: report.status === 'resolved' ? 'resolved' : 'open',
      })),
    );
  },

  moderateContent(targetType: 'profile' | 'post', targetId: string, action: 'hide' | 'delete'): Promise<void> {
    if (getIsDemoMode()) return mockApi.moderateContent(targetType, targetId, action);
    throw new ApiError('Moderation backend is not implemented yet.', 501);
  },
};
