import { UserProfile, MatchProfile, Conversation, Message, HeroImage, CommunityPost, PostComment, SearchFilters, User } from '../types';
import { mockApi } from './mockApi';

let API_BASE = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL || '/api';
if (API_BASE.endsWith('/')) {
  API_BASE = API_BASE.slice(0, -1);
}

/**
 * Checks if we should run in local demo mode.
 * FORCED TO ALWAYS RETURN FALSE - uses real backend API
 */
export function getIsDemoMode(): boolean {
  // Real backend mode - forced false so all API calls hit the live Worker
  return false;
}

export function setDemoMode(isDemo: boolean) {
  if (isDemo) {
    localStorage.removeItem('halal_token');
    localStorage.setItem('halal_force_real', 'false');
  } else {
    localStorage.setItem('halal_token', 'demo_real_token_placeholder');
    localStorage.setItem('halal_force_real', 'true');
  }
}

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('halal_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/** Map UI photoPrivacy → Worker photo_visibility enum. */
function toWorkerPhotoVisibility(value: unknown): string | undefined {
  if (value == null || value === '') return undefined;
  const v = String(value);
  if (v === 'visible') return 'public';
  if (v === 'hidden_by_default' || v === 'private_mode' || v === 'floral' || v === 'mutual_approval') return 'private';
  if (v === 'public' || v === 'private' || v === 'blurred' || v === 'initials' || v === 'hidden') return v;
  return 'private';
}

/** Serialize UserProfile fields to the Worker PUT /profile/me contract. */
function serializeProfileForWorker(updated: Partial<UserProfile>): Record<string, unknown> {
  const year = new Date().getUTCFullYear();
  const ageNum = updated.age !== undefined && updated.age !== null ? Number(updated.age) : NaN;
  const birthYearFromAge = Number.isFinite(ageNum) && ageNum > 0 ? year - ageNum : undefined;
  const birthYear =
    (updated as any).birthYear !== undefined
      ? Number((updated as any).birthYear)
      : birthYearFromAge;

  const payload: Record<string, unknown> = {
    fullName: updated.name || (updated as any).fullName || (updated as any).full_name || '',
    gender: updated.gender,
    country: updated.country || 'Iraq',
    governorate: updated.governorate,
    district: updated.district || updated.city,
    city: updated.city || updated.district,
    religion: updated.religion,
    sect: updated.sect,
    ethnicity: updated.ethnicity,
    maritalStatus: updated.maritalStatus,
    education: updated.education,
    occupation: updated.profession || (updated as any).occupation,
    bio: (updated as any).bio,
    intention: updated.intention,
    timeline: updated.timeline,
    wantsChildren: updated.wantsChildren,
    communicationPreference: updated.communicationPreference,
    photoUrl: updated.avatarUrl || (updated as any).photoUrl || (updated as any).photo_url,
  };

  if (birthYear !== undefined && Number.isInteger(birthYear)) {
    payload.birthYear = birthYear;
  } else if (Number.isFinite(ageNum) && ageNum >= 18) {
    payload.age = Math.trunc(ageNum);
  }

  const photoVisibility = toWorkerPhotoVisibility(
    updated.photoPrivacy ?? (updated as any).photoVisibility ?? (updated as any).photo_visibility,
  );
  if (photoVisibility) payload.photoVisibility = photoVisibility;

  return payload;
}

/** Unwrap Worker `{ profile }` payloads and guarantee array fields used by the UI. */
function normalizeUserProfile(data: any): UserProfile {
  const raw = (data && data.profile) ? data.profile : data;
  const photoVis = String(raw?.photo_visibility || raw?.photoVisibility || raw?.photoPrivacy || '');
  const photoPrivacy =
    photoVis === 'public' ? 'visible'
      : photoVis === 'private' ? 'hidden_by_default'
      : photoVis === 'blurred' ? 'blurred'
      : photoVis === 'initials' ? 'initials'
      : photoVis === 'hidden' ? 'hidden'
      : (raw?.photoPrivacy || 'hidden_by_default');

  return {
    ...raw,
    id: String(raw?.id || raw?.user_id || ''),
    name: raw?.name || raw?.full_name || '',
    age: Number(raw?.age) || 0,
    education: raw?.education || '',
    profession: raw?.profession || raw?.occupation || '',
    country: raw?.country || 'Iraq',
    governorate: raw?.governorate || '',
    district: raw?.district || raw?.city || '',
    city: raw?.city || raw?.district || '',
    religion: raw?.religion || 'islam',
    sect: raw?.sect,
    ethnicity: raw?.ethnicity || 'arab',
    maritalStatus: raw?.maritalStatus || raw?.marital_status || '',
    languages: Array.isArray(raw?.languages) ? raw.languages : [],
    values: Array.isArray(raw?.values) ? raw.values : [],
    timeline: raw?.timeline || '',
    wantsChildren: raw?.wantsChildren || raw?.wants_children || '',
    relocation: raw?.relocation || '',
    communicationPreference: raw?.communicationPreference || raw?.communication_preference || '',
    gender: raw?.gender || undefined,
    email: raw?.email,
    phone: raw?.phone,
    intention: raw?.intention || '',
    avatarUrl: raw?.avatarUrl || raw?.photo_url || '',
    photoPrivacy: photoPrivacy as UserProfile['photoPrivacy'],
    savedMatches: Array.isArray(raw?.savedMatches) ? raw.savedMatches : [],
  } as UserProfile;
}

/** Map Worker match rows so intro send can use match.id as receiverId. */
function normalizeMatchProfile(raw: any): MatchProfile {
  const requestRaw = String(raw?.requestStatus ?? raw?.request_status ?? 'none');
  const requestStatus =
    requestRaw === 'pending' ? 'sent' : (requestRaw as MatchProfile['requestStatus']);

  return {
    ...raw,
    id: String(raw?.id || raw?.user_id || ''),
    name: raw?.name || raw?.full_name || '',
    age: Number(raw?.age) || 0,
    profession: raw?.profession || raw?.occupation || '',
    education: raw?.education || '',
    country: raw?.country || 'Iraq',
    religion: raw?.religion || 'islam',
    ethnicity: raw?.ethnicity || 'arab',
    timeline: raw?.timeline || '',
    wantsChildren: raw?.wantsChildren || raw?.wants_children || '',
    communicationPreference: raw?.communicationPreference || raw?.communication_preference || '',
    valuesSummary: Array.isArray(raw?.valuesSummary)
      ? raw.valuesSummary
      : Array.isArray(raw?.values)
        ? raw.values
        : [],
    languages: Array.isArray(raw?.languages) ? raw.languages : [],
    verified: !!(raw?.verified === true || raw?.verified === 1),
    photoStatus: raw?.photoStatus || raw?.photo_status || 'hidden',
    avatarUrl: raw?.avatarUrl || raw?.photo_url || '',
    avatarSeed: raw?.avatarSeed || String(raw?.id || raw?.user_id || ''),
    aboutMe: raw?.aboutMe || raw?.bio || '',
    requestStatus: ['none', 'sent', 'accepted', 'declined'].includes(requestStatus)
      ? requestStatus
      : 'none',
  } as MatchProfile;
}

/**
 * Robust wrapper over fetch to safely validate content-type and handle HTML/text fallbacks
 * without crashing or throwing cryptic "Unexpected token <" JSON parsing exceptions.
 */
async function safeFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (error: any) {
    throw new Error(`Connection error: Could not connect to the matchmaking API server at ${url}. Please verify your network connection or API base URL.`);
  }

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    if (isJson) {
      let errData: any;
      try {
        errData = await res.json();
      } catch {
        throw new Error(`The API server returned an error (Status ${res.status}: ${res.statusText}) but the response could not be parsed as JSON.`);
      }
      throw new Error(errData.message || errData.error || `Request failed with status ${res.status}: ${res.statusText}`);
    } else {
      let text: string;
      try {
        text = await res.text();
      } catch {
        text = '';
      }
      const snippet = text.slice(0, 150).trim();
      throw new Error(`The API server returned an unexpected HTML or text response instead of JSON (Status ${res.status}). This usually indicates a configuration error, an incorrect VITE_API_URL endpoint, or a server fallback to index.html.\nResponse snippet: "${snippet}..."`);
    }
  }

  // Worker accept/decline returns 204 No Content
  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }

  if (!isJson) {
    let text: string;
    try {
      text = await res.text();
    } catch {
      text = '';
    }
    if (!text) {
      return undefined as T;
    }
    const snippet = text.slice(0, 150).trim();
    throw new Error(`The API server returned a non-JSON response (Status ${res.status}). This usually indicates an incorrect API endpoint or route mismatch.\nResponse snippet: "${snippet}..."`);
  }

  try {
    return await res.json() as T;
  } catch (error: any) {
    throw new Error(`Failed to parse the response as JSON: ${error.message}`);
  }
}

/**
 * Worker accept/decline require halal_requests.id.
 * UI historically passes the counterpart user/match id — resolve via /request/list.
 * Also accepts an already-correct request id for compatibility.
 */
async function resolveIntroductionRequestId(matchOrRequestId: string): Promise<string> {
  const data = await safeFetch<any>(`${API_BASE}/request/list`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const requests: any[] = Array.isArray(data?.requests)
    ? data.requests
    : Array.isArray(data)
      ? data
      : [];

  const exact = requests.find((r) => r?.id === matchOrRequestId);
  if (exact?.id) return String(exact.id);

  const pending = requests.filter((r) => {
    const status = String(r?.status || '');
    const sender = r?.sender_id || r?.senderId;
    const receiver = r?.receiver_id || r?.receiverId;
    return status === 'pending' && (sender === matchOrRequestId || receiver === matchOrRequestId);
  });

  // Prefer incoming request (counterpart is sender) — receiver is who accepts/declines
  const incoming = pending.find((r) => (r?.sender_id || r?.senderId) === matchOrRequestId);
  if (incoming?.id) return String(incoming.id);
  if (pending.length >= 1 && pending[0]?.id) return String(pending[0].id);

  throw new Error('Introduction request not found for this profile.');
}

/**
 * Worker message POST requires halal_conversations.id.
 * UI passes the counterpart match/user id — resolve via GET /conversations.
 * Also accepts an already-correct conversation id for compatibility.
 */
async function resolveConversationId(matchOrConversationId: string): Promise<string> {
  const result = await safeFetch<any>(`${API_BASE}/conversations`, {
    method: 'GET',
    headers: getHeaders(),
  });
  const conversations: any[] = Array.isArray(result?.conversations)
    ? result.conversations
    : Array.isArray(result)
      ? result
      : [];

  const byConversationId = conversations.find((c) => c?.id === matchOrConversationId);
  if (byConversationId?.id) return String(byConversationId.id);

  const byMatchId = conversations.find(
    (c) => c?.matchId === matchOrConversationId || c?.match_id === matchOrConversationId,
  );
  if (byMatchId?.id) return String(byMatchId.id);

  throw new Error('Conversation not found for this match. Accept the introduction first.');
}

export const apiClient = {
  isDemoMode: getIsDemoMode,

  /**
   * AUTHENTICATION
   */
  async login(identifier: string, password: string): Promise<{ token: string; user: User }> {
    if (getIsDemoMode()) {
      // Mock login response
      if (!identifier || !password) {
        throw new Error('Email/phone and password are required');
      }
      localStorage.setItem('halal_token', 'mock_jwt_token_for_demo');
      const user: User = {
        id: 'me',
        email: identifier.includes('@') ? identifier : 'demo@example.com',
        name: identifier.split('@')[0],
        membershipStatus: 'free',
        createdAt: new Date().toISOString(),
        role: identifier.includes('admin') || identifier.includes('safar') ? 'admin' : 'user'
      };

      // Update mock api profile
      await mockApi.updateCurrentUserProfile({
        email: user.email,
        name: user.name,
        role: user.role
      });

      return { token: 'mock_jwt_token_for_demo', user };
    }

    // Real API call
    const data = await safeFetch<{ token: string; user: User }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier, password }),
    });

    if (data.token) {
      localStorage.setItem('halal_token', data.token);
    }
    return data;
  },

  async register(fullName: string, governorate: string, district: string, email: string, phone: string | undefined, password: string, age: number): Promise<{ token: string; user: User }> {
    if (getIsDemoMode()) {
      // Mock register response
      if (!fullName || !governorate || !email || !password) {
        throw new Error('Please fill in all required registration fields');
      }
      localStorage.setItem('halal_token', 'mock_jwt_token_for_demo');
      const user: User = {
        id: 'me',
        email,
        name: fullName,
        membershipStatus: 'free',
        createdAt: new Date().toISOString(),
        role: email.includes('admin') ? 'admin' : 'user'
      };

      // Reset mock profile with basic data
      await mockApi.updateCurrentUserProfile({
        email,
        phone,
        name: fullName,
        governorate,
        city: district, // district stored as city
        district,
        gender: undefined, // do not send gender on register
        role: user.role,
        age: age || 24,
        education: '',
        profession: ''
      });

      return { token: 'mock_jwt_token_for_demo', user };
    }

    // Real API call
    const data = await safeFetch<{ token: string; user: User }>(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, governorate, district, email, phone, password, age }),
    });

    if (data.token) {
      localStorage.setItem('halal_token', data.token);
    }
    return data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('halal_token');
    localStorage.removeItem('halal_force_real');
  },

  /**
   * Permanently delete the authenticated account and user-owned server data.
   * Requires a valid JWT. Clears the local token after a successful response.
   */
  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    const data = await safeFetch<{ success: boolean; message: string }>(`${API_BASE}/api/auth/account`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    localStorage.removeItem('halal_token');
    localStorage.removeItem('halal_force_real');
    return data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (getIsDemoMode()) {
      return {
        success: true,
        message: 'If that email exists, a reset link will be sent.',
      };
    }

    // Backend route is registered at /api/auth/forgot-password (not /auth/forgot-password).
    return safeFetch<{ success: boolean; message: string }>(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    if (getIsDemoMode()) {
      return { message: 'Password reset successfully. You can now log in.' };
    }
    return safeFetch<{ message: string }>(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
  },

  /**
   * USER PROFILE
   */
  async getCurrentUser(): Promise<UserProfile> {
    if (getIsDemoMode()) {
      return mockApi.getCurrentUser();
    }

    // Worker returns { success, profile } — unwrap and normalize arrays the UI expects.
    const data = await safeFetch<any>(`${API_BASE}/profile/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return normalizeUserProfile(data);
  },

  async updateCurrentUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    if (getIsDemoMode()) {
      return mockApi.updateCurrentUserProfile(updated);
    }

    // Worker expects fullName / birthYear / occupation — not UI name / age / profession.
    const data = await safeFetch<any>(`${API_BASE}/profile/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(serializeProfileForWorker(updated)),
    });
    return normalizeUserProfile(data);
  },

  /**
   * MATCHES / PARTNERS
   */
  async getMatches(filters?: Partial<SearchFilters>, page: number = 1, limit: number = 20): Promise<{ matches: MatchProfile[]; hasMore: boolean }> {
    if (getIsDemoMode()) {
      const allMatches = await mockApi.getMatches();
      // Apply filters locally in demo mode
      let filtered = allMatches;

      if (filters) {
        if (filters.gender && filters.gender !== 'all') {
          filtered = filtered.filter(m => m.gender === filters.gender);
        }
        if (filters.minAge !== undefined) {
          filtered = filtered.filter(m => m.age >= (filters.minAge ?? 18));
        }
        if (filters.maxAge !== undefined) {
          filtered = filtered.filter(m => m.age <= (filters.maxAge ?? 100));
        }
        if (filters.governorate && filters.governorate !== 'All Iraq' && filters.governorate !== 'all') {
          const target = filters.governorate.toLowerCase();
          filtered = filtered.filter(m => {
            const current = m.governorate?.toLowerCase() || '';
            if (target === 'nineveh' || target === 'mosul') {
              return current === 'nineveh' || current === 'mosul';
            }
            return current === target;
          });
        }
        if (filters.city && filters.city !== 'All Cities' && filters.city !== 'all') {
          filtered = filtered.filter(m => m.city?.toLowerCase().includes(filters.city!.toLowerCase()));
        }
        if (filters.religion && filters.religion !== 'all') {
          filtered = filtered.filter(m => m.religion === filters.religion);
        }
        if (filters.sect && filters.sect !== 'all') {
          filtered = filtered.filter(m => m.sect === filters.sect);
        }
        if (filters.ethnicity && filters.ethnicity !== 'all') {
          filtered = filtered.filter(m => m.ethnicity === filters.ethnicity);
        }
        if (filters.verifiedOnly !== undefined && filters.verifiedOnly) {
          filtered = filtered.filter(m => m.verified);
        }
        if (filters.smoking && filters.smoking !== 'all') {
          const isNonSmoker = filters.smoking === 'Strictly Non-smoker' || filters.smoking === 'No';
          filtered = filtered.filter(m => {
            const hasSmokingDealbreaker = m.dealbreakers?.some(d => d.toLowerCase().includes('smoking'));
            return isNonSmoker ? !!hasSmokingDealbreaker : !hasSmokingDealbreaker;
          });
        }
        if (filters.timeline && filters.timeline !== 'all') {
          const tFilter = filters.timeline;
          filtered = filtered.filter(m => {
            const mTimeline = m.timeline.toLowerCase();
            if (tFilter === 'soon') return mTimeline.includes('6 months') || mTimeline.includes('soon');
            if (tFilter === '1year') return mTimeline.includes('1 year') || mTimeline.includes('6 months') || mTimeline.includes('soon');
            if (tFilter === '2years') return mTimeline.includes('1-2 years') || mTimeline.includes('1 year') || mTimeline.includes('6 months');
            return mTimeline.includes('flexible');
          });
        }
        if (filters.photoVisibility && filters.photoVisibility !== 'All' && filters.photoVisibility !== 'all') {
          filtered = filtered.filter(m => {
            if (filters.photoVisibility === 'Blurred Only') return m.photoStatus === 'blurred';
            if (filters.photoVisibility === 'Visible Only') return m.photoStatus === 'visible';
            return true;
          });
        }
        if (filters.wantsChildren && filters.wantsChildren !== 'All' && filters.wantsChildren !== 'all') {
          const isYesFilter = filters.wantsChildren === 'Yes';
          filtered = filtered.filter(m => {
            const mChildren = m.wantsChildren.toLowerCase();
            const matchWants = mChildren.includes('yes') || mChildren.includes('willing') || mChildren.includes('looking forward') || mChildren.includes('parenting');
            return isYesFilter ? matchWants : !matchWants;
          });
        }
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);
      return {
        matches: paginated,
        hasMore: startIndex + limit < filtered.length
      };
    }

    // Real API call
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params.append(key, val.toString());
        }
      });
    }

    const data = await safeFetch<any>(`${API_BASE}/matches?${params.toString()}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (Array.isArray(data)) {
      return {
        matches: data.map(normalizeMatchProfile),
        hasMore: data.length >= limit
      };
    } else if (data && Array.isArray(data.matches)) {
      return {
        matches: data.matches.map(normalizeMatchProfile),
        hasMore: data.hasMore !== undefined ? !!data.hasMore : data.matches.length >= limit
      };
    }
    return { matches: [], hasMore: false };
  },

  async toggleSaveProfile(matchId: string): Promise<UserProfile> {
    if (getIsDemoMode()) {
      return mockApi.toggleSaveProfile(matchId);
    }

    // CONTRACT-02: Worker uses /saved-profiles/:id (POST save, DELETE unsave).
    const matchesRes = await this.getMatches({} as any, 1, 50);
    const row = matchesRes.matches.find((m) => m.id === matchId);
    const alreadySaved = !!(row as any)?.saved || (row as any)?.saved === 1 || (row as any)?.saved === true;
    await safeFetch(`${API_BASE}/saved-profiles/${encodeURIComponent(matchId)}`, {
      method: alreadySaved ? 'DELETE' : 'POST',
      headers: getHeaders(),
    });
    return this.getCurrentUser();
  },

  async sendIntroductionRequest(matchId: string): Promise<{ success: boolean; request: any }> {
    if (getIsDemoMode()) {
      return mockApi.sendIntroductionRequest(matchId);
    }

    // Worker accepts receiverId or toUserId (matchId is the target user's id from matches).
    return safeFetch<{ success: boolean; request: any }>(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ receiverId: matchId }),
    });
  },

  /** Real introduction requests for the authenticated user (incoming + outgoing). */
  async getIntroductionRequests(): Promise<any[]> {
    if (getIsDemoMode()) {
      return [];
    }
    const data = await safeFetch<any>(`${API_BASE}/request/list`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return Array.isArray(data?.requests) ? data.requests : Array.isArray(data) ? data : [];
  },

  async acceptIntroductionRequest(matchId: string): Promise<{ success: boolean; match: MatchProfile }> {
    if (getIsDemoMode()) {
      return mockApi.acceptIntroductionRequest(matchId);
    }

    const requestId = await resolveIntroductionRequestId(matchId);
    await safeFetch(`${API_BASE}/requests/${encodeURIComponent(requestId)}/accept`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return { success: true, match: { id: matchId } as MatchProfile };
  },

  async declineIntroductionRequest(matchId: string): Promise<{ success: boolean; match: MatchProfile }> {
    if (getIsDemoMode()) {
      return mockApi.declineIntroductionRequest(matchId);
    }

    const requestId = await resolveIntroductionRequestId(matchId);
    await safeFetch(`${API_BASE}/requests/${encodeURIComponent(requestId)}/decline`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return { success: true, match: { id: matchId } as MatchProfile };
  },

  /**
   * CHAT / CONVERSATIONS
   */
  async getConversations(): Promise<Conversation[]> {
    if (getIsDemoMode()) {
      return mockApi.getConversations();
    }

    const result = await safeFetch<{ conversations: Conversation[] }>(`${API_BASE}/conversations`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return (result.conversations || []).map((c: any) => ({
      ...c,
      id: c.id,
      matchId: c.matchId || c.match_id || '',
      messages: Array.isArray(c.messages) ? c.messages : [],
    }));
  },

  async sendMessage(matchId: string, text: string, sender: 'user' | 'match'): Promise<Message> {
    if (getIsDemoMode()) {
      return mockApi.sendMessage(matchId, text, sender);
    }

    const conversationId = await resolveConversationId(matchId);
    const data = await safeFetch<any>(`${API_BASE}/conversations/${encodeURIComponent(conversationId)}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      // Worker infers sender from JWT; only `text` is required
      body: JSON.stringify({ text }),
    });
    const raw = data?.message || data;
    return {
      id: raw?.id || '',
      sender: raw?.sender === 'match' ? 'match' : 'user',
      text: raw?.text || text,
      timestamp: raw?.timestamp || raw?.created_at || new Date().toISOString(),
    };
  },

  /**
   * HERO SLIDESHOW
   */
  async getHeroImages(): Promise<HeroImage[]> {
    if (getIsDemoMode()) {
      return mockApi.getHeroImages();
    }

    return safeFetch<HeroImage[]>(`${API_BASE}/hero-images`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  async addHeroImage(url: string, title: string, isActive: boolean = true): Promise<HeroImage> {
    if (getIsDemoMode()) {
      return mockApi.addHeroImage(url, title, isActive);
    }

    return safeFetch<HeroImage>(`${API_BASE}/hero-images`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url, title, isActive }),
    });
  },

  async updateHeroImage(id: string, updatedFields: Partial<HeroImage>): Promise<HeroImage> {
    if (getIsDemoMode()) {
      return mockApi.updateHeroImage(id, updatedFields);
    }

    return safeFetch<HeroImage>(`${API_BASE}/hero-images/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedFields),
    });
  },

  async deleteHeroImage(id: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.deleteHeroImage(id);
    }

    const data = await safeFetch<{ success: boolean }>(`${API_BASE}/hero-images/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return !!data.success;
  },

  async reorderHeroImages(reordered: HeroImage[]): Promise<HeroImage[]> {
    if (getIsDemoMode()) {
      return mockApi.reorderHeroImages(reordered);
    }

    return safeFetch<HeroImage[]>(`${API_BASE}/hero-images/reorder`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reordered }),
    });
  },

  /**
   * COMMUNITY APIS
   */
  async getCommunityPosts(): Promise<CommunityPost[]> {
    if (getIsDemoMode()) {
      return mockApi.getCommunityPosts();
    }

    return safeFetch<CommunityPost[]>(`${API_BASE}/community/posts`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  async createCommunityPost(
    title: string,
    content: string,
    category: CommunityPost['category'],
    isDaily: boolean = false,
    image?: string,
    status?: 'pending' | 'approved' | 'hidden' | 'rejected',
    postType?: 'standard' | 'photo' | 'opinion' | 'poll',
    opinionColor?: string,
    pollOptions?: string[],
    pollVotes?: Record<string, string[]>
  ): Promise<CommunityPost> {
    if (getIsDemoMode()) {
      return mockApi.createCommunityPost(title, content, category, isDaily, image, status, postType, opinionColor, pollOptions, pollVotes);
    }

    return safeFetch<CommunityPost>(`${API_BASE}/community/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, content, category, isDaily, image, status, postType, opinionColor, pollOptions, pollVotes }),
    });
  },

  async voteInPoll(postId: string, optionText: string, userName: string): Promise<CommunityPost> {
    if (getIsDemoMode()) {
      return mockApi.voteInPoll(postId, optionText, userName);
    }

    return safeFetch<CommunityPost>(`${API_BASE}/community/posts/${postId}/vote`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ optionText, userName }),
    });
  },

  async likePost(postId: string, userName: string): Promise<CommunityPost> {
    if (getIsDemoMode()) {
      return mockApi.likePost(postId, userName);
    }

    return safeFetch<CommunityPost>(`${API_BASE}/community/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userName }),
    });
  },

  async addComment(postId: string, text: string, userName: string, userGender: 'male' | 'female'): Promise<PostComment> {
    if (getIsDemoMode()) {
      return mockApi.addComment(postId, text, userName, userGender);
    }

    return safeFetch<PostComment>(`${API_BASE}/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, userName, userGender }),
    });
  },

  async reportPost(postId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.reportPost(postId);
    }

    const data = await safeFetch<{ success: boolean }>(`${API_BASE}/community/posts/${postId}/report`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return !!data.success;
  },

  /** Persist a profile report to Worker `POST /reports/profiles/:userId`. */
  async reportProfile(userId: string, reason: string): Promise<{ success: boolean }> {
    if (getIsDemoMode()) {
      return { success: true };
    }
    await safeFetch(`${API_BASE}/reports/profiles/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason: reason || 'Reported by member' }),
    });
    return { success: true };
  },

  /** Persist a block to Worker `POST /blocks/:userId`. */
  async blockUser(userId: string, reason?: string): Promise<{ success: boolean }> {
    if (getIsDemoMode()) {
      return { success: true };
    }
    await safeFetch(`${API_BASE}/blocks/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason: reason || undefined }),
    });
    return { success: true };
  },

  /** Load blocked user ids for the current member. */
  async getBlockedUserIds(): Promise<string[]> {
    if (getIsDemoMode()) {
      return [];
    }
    const data = await safeFetch<any>(`${API_BASE}/blocks`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const blocks = Array.isArray(data?.blocks) ? data.blocks : Array.isArray(data) ? data : [];
    return blocks
      .map((b: any) => String(b.blockedUserId || b.blocked_user_id || ''))
      .filter(Boolean);
  },

  async reportComment(postId: string, commentId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.reportComment(postId, commentId);
    }

    const data = await safeFetch<{ success: boolean }>(`${API_BASE}/community/posts/${postId}/comments/${commentId}/report`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return !!data.success;
  },

  async deletePost(postId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.deletePost(postId);
    }

    const data = await safeFetch<{ success: boolean }>(`${API_BASE}/community/posts/${postId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return !!data.success;
  },

  async deleteComment(postId: string, commentId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.deleteComment(postId, commentId);
    }

    const data = await safeFetch<{ success: boolean }>(`${API_BASE}/community/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return !!data.success;
  },

  async updatePostStatus(postId: string, status: 'approved' | 'hidden' | 'rejected' | 'pending'): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.updatePostStatus(postId, status);
    }

    const data = await safeFetch<{ success: boolean }>(`${API_BASE}/community/posts/${postId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return !!data.success;
  },

  async toggleFeaturePost(postId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.toggleFeaturePost(postId);
    }

    const data = await safeFetch<{ success: boolean }>(`${API_BASE}/community/posts/${postId}/feature`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return !!data.success;
  }
};



