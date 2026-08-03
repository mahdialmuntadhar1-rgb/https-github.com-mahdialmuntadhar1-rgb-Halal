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

/** Unwrap Worker `{ profile }` payloads and guarantee array fields used by the UI. */
function normalizeUserProfile(data: any): UserProfile {
  const raw = (data && data.profile) ? data.profile : data;
  return {
    ...raw,
    name: raw?.name || raw?.full_name || '',
    age: Number(raw?.age) || 0,
    education: raw?.education || '',
    profession: raw?.profession || raw?.occupation || '',
    country: raw?.country || 'Iraq',
    religion: raw?.religion || 'islam',
    ethnicity: raw?.ethnicity || 'arab',
    languages: Array.isArray(raw?.languages) ? raw.languages : [],
    values: Array.isArray(raw?.values) ? raw.values : [],
    timeline: raw?.timeline || '',
    wantsChildren: raw?.wantsChildren || raw?.wants_children || '',
    relocation: raw?.relocation || '',
    communicationPreference: raw?.communicationPreference || raw?.communication_preference || '',
    gender: raw?.gender || undefined,
    email: raw?.email,
    savedMatches: Array.isArray(raw?.savedMatches) ? raw.savedMatches : [],
  } as UserProfile;
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

  if (!isJson) {
    let text: string;
    try {
      text = await res.text();
    } catch {
      text = '';
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
        message: 'Demo forgot password instructions simulated. Check your inbox.'
      };
    }

    // Backend route is registered at /api/auth/forgot-password (not /auth/forgot-password).
    return safeFetch<{ success: boolean; message: string }>(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
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

    const data = await safeFetch<any>(`${API_BASE}/profile/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updated),
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
        matches: data,
        hasMore: data.length >= limit
      };
    } else if (data && Array.isArray(data.matches)) {
      return {
        matches: data.matches,
        hasMore: data.hasMore !== undefined ? !!data.hasMore : data.matches.length >= limit
      };
    }
    return { matches: [], hasMore: false };
  },

  async toggleSaveProfile(matchId: string): Promise<UserProfile> {
    if (getIsDemoMode()) {
      return mockApi.toggleSaveProfile(matchId);
    }

    return safeFetch<UserProfile>(`${API_BASE}/matches/${matchId}/save`, {
      method: 'POST',
      headers: getHeaders(),
    });
  },

  async sendIntroductionRequest(matchId: string): Promise<{ success: boolean; request: any }> {
    if (getIsDemoMode()) {
      return mockApi.sendIntroductionRequest(matchId);
    }

    return safeFetch<{ success: boolean; request: any }>(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetMatchId: matchId }),
    });
  },

  async acceptIntroductionRequest(matchId: string): Promise<{ success: boolean; match: MatchProfile }> {
    if (getIsDemoMode()) {
      return mockApi.acceptIntroductionRequest(matchId);
    }

    return safeFetch<{ success: boolean; match: MatchProfile }>(`${API_BASE}/requests/${matchId}/accept`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  async declineIntroductionRequest(matchId: string): Promise<{ success: boolean; match: MatchProfile }> {
    if (getIsDemoMode()) {
      return mockApi.declineIntroductionRequest(matchId);
    }

    return safeFetch<{ success: boolean; match: MatchProfile }>(`${API_BASE}/requests/${matchId}/decline`, {
      method: 'PUT',
      headers: getHeaders(),
    });
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
    return result.conversations || [];
  },

  async sendMessage(matchId: string, text: string, sender: 'user' | 'match'): Promise<Message> {
    if (getIsDemoMode()) {
      return mockApi.sendMessage(matchId, text, sender);
    }

    return safeFetch<Message>(`${API_BASE}/conversations/${matchId}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, sender }),
    });
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



