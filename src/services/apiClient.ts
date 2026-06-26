import { UserProfile, MatchProfile, Conversation, Message, HeroImage, CommunityPost, PostComment, SearchFilters, User } from '../types';
import { mockApi } from './mockApi';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || (import.meta as any).env?.VITE_API_URL || '/api';

/**
 * Checks if we should run in local demo mode.
 * If there is a real session token in localStorage or a backend URL is explicitly configured, 
 * we try to contact the backend, otherwise we fallback to the local mock state.
 */
export function getIsDemoMode(): boolean {
  const token = localStorage.getItem('halal_token');
  const forceReal = localStorage.getItem('halal_force_real') === 'true';
  
  if (forceReal) return false;
  
  // If no token exists, we default to demo mode so the user can interact with the app immediately
  if (!token) return true;
  
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

export const apiClient = {
  isDemoMode: getIsDemoMode,

  /**
   * AUTHENTICATION
   */
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    if (getIsDemoMode()) {
      // Mock login response
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      localStorage.setItem('halal_token', 'mock_jwt_token_for_demo');
      const user: User = {
        id: 'me',
        email,
        name: email.split('@')[0],
        membershipStatus: 'free',
        createdAt: new Date().toISOString(),
        role: email.includes('admin') || email.includes('safar') ? 'admin' : 'user'
      };
      
      // Update mock api profile
      await mockApi.updateCurrentUserProfile({
        email,
        name: user.name,
        role: user.role
      });

      return { token: 'mock_jwt_token_for_demo', user };
    }

    // Real API call
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Login failed: ${res.statusText}`);
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('halal_token', data.token);
    }
    return data;
  },

  async register(email: string, password: string, name: string, gender: 'male' | 'female'): Promise<{ token: string; user: User }> {
    if (getIsDemoMode()) {
      // Mock register response
      if (!email || !password || !name) {
        throw new Error('Please fill in all registration fields');
      }
      localStorage.setItem('halal_token', 'mock_jwt_token_for_demo');
      const user: User = {
        id: 'me',
        email,
        name,
        membershipStatus: 'free',
        createdAt: new Date().toISOString(),
        role: email.includes('admin') ? 'admin' : 'user'
      };

      // Reset mock profile with basic data
      await mockApi.updateCurrentUserProfile({
        email,
        name,
        gender,
        role: user.role,
        age: 25, // default
        education: 'Bachelor Degree',
        profession: 'Professional'
      });

      return { token: 'mock_jwt_token_for_demo', user };
    }

    // Real API call
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, gender }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Registration failed: ${res.statusText}`);
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('halal_token', data.token);
    }
    return data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('halal_token');
    localStorage.removeItem('halal_force_real');
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (getIsDemoMode()) {
      return { 
        success: true, 
        message: 'Demo forgot password instructions simulated. Check your inbox.' 
      };
    }
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      throw new Error(`Forgot password request failed: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * USER PROFILE
   */
  async getCurrentUser(): Promise<UserProfile> {
    if (getIsDemoMode()) {
      return mockApi.getCurrentUser();
    }

    const res = await fetch(`${API_BASE}/profile/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.statusText}`);
    }
    return res.json();
  },

  async updateCurrentUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    if (getIsDemoMode()) {
      return mockApi.updateCurrentUserProfile(updated);
    }

    const res = await fetch(`${API_BASE}/profile/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updated),
    });
    if (!res.ok) {
      throw new Error(`Failed to update profile: ${res.statusText}`);
    }
    return res.json();
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
          filtered = filtered.filter(m => m.governorate === filters.governorate);
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
          // Fix matching filters: Remove the `|| true` bug from the smoking filter
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

    const res = await fetch(`${API_BASE}/matches?${params.toString()}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch matches: ${res.statusText}`);
    }

    const data = await res.json();
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

    const res = await fetch(`${API_BASE}/matches/${matchId}/save`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to toggle save profile: ${res.statusText}`);
    }
    return res.json();
  },

  async sendIntroductionRequest(matchId: string): Promise<{ success: boolean; request: any }> {
    if (getIsDemoMode()) {
      return mockApi.sendIntroductionRequest(matchId);
    }

    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetMatchId: matchId }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send introduction request: ${res.statusText}`);
    }
    return res.json();
  },

  async acceptIntroductionRequest(matchId: string): Promise<{ success: boolean; match: MatchProfile }> {
    if (getIsDemoMode()) {
      return mockApi.acceptIntroductionRequest(matchId);
    }

    const res = await fetch(`${API_BASE}/requests/${matchId}/accept`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to accept request: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * CHAT / CONVERSATIONS
   */
  async getConversations(): Promise<Conversation[]> {
    if (getIsDemoMode()) {
      return mockApi.getConversations();
    }

    const res = await fetch(`${API_BASE}/conversations`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch conversations: ${res.statusText}`);
    }
    return res.json();
  },

  async sendMessage(matchId: string, text: string, sender: 'user' | 'match'): Promise<Message> {
    if (getIsDemoMode()) {
      return mockApi.sendMessage(matchId, text, sender);
    }

    const res = await fetch(`${API_BASE}/conversations/${matchId}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, sender }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send message: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * HERO SLIDESHOW
   */
  async getHeroImages(): Promise<HeroImage[]> {
    if (getIsDemoMode()) {
      return mockApi.getHeroImages();
    }

    const res = await fetch(`${API_BASE}/hero-images`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch hero images: ${res.statusText}`);
    }
    return res.json();
  },

  async addHeroImage(url: string, title: string, isActive: boolean = true): Promise<HeroImage> {
    if (getIsDemoMode()) {
      return mockApi.addHeroImage(url, title, isActive);
    }

    const res = await fetch(`${API_BASE}/hero-images`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ url, title, isActive }),
    });
    if (!res.ok) {
      throw new Error(`Failed to add hero image: ${res.statusText}`);
    }
    return res.json();
  },

  async updateHeroImage(id: string, updatedFields: Partial<HeroImage>): Promise<HeroImage> {
    if (getIsDemoMode()) {
      return mockApi.updateHeroImage(id, updatedFields);
    }

    const res = await fetch(`${API_BASE}/hero-images/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) {
      throw new Error(`Failed to update hero image: ${res.statusText}`);
    }
    return res.json();
  },

  async deleteHeroImage(id: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.deleteHeroImage(id);
    }

    const res = await fetch(`${API_BASE}/hero-images/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to delete hero image: ${res.statusText}`);
    }
    const data = await res.json();
    return !!data.success;
  },

  async reorderHeroImages(reordered: HeroImage[]): Promise<HeroImage[]> {
    if (getIsDemoMode()) {
      return mockApi.reorderHeroImages(reordered);
    }

    const res = await fetch(`${API_BASE}/hero-images/reorder`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reordered }),
    });
    if (!res.ok) {
      throw new Error(`Failed to reorder hero images: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * COMMUNITY APIS
   */
  async getCommunityPosts(): Promise<CommunityPost[]> {
    if (getIsDemoMode()) {
      return mockApi.getCommunityPosts();
    }

    const res = await fetch(`${API_BASE}/community/posts`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch community posts: ${res.statusText}`);
    }
    return res.json();
  },

  async createCommunityPost(title: string, content: string, category: CommunityPost['category'], isDaily: boolean = false): Promise<CommunityPost> {
    if (getIsDemoMode()) {
      return mockApi.createCommunityPost(title, content, category, isDaily);
    }

    const res = await fetch(`${API_BASE}/community/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, content, category, isDaily }),
    });
    if (!res.ok) {
      throw new Error(`Failed to create post: ${res.statusText}`);
    }
    return res.json();
  },

  async likePost(postId: string, userName: string): Promise<CommunityPost> {
    if (getIsDemoMode()) {
      return mockApi.likePost(postId, userName);
    }

    const res = await fetch(`${API_BASE}/community/posts/${postId}/like`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userName }),
    });
    if (!res.ok) {
      throw new Error(`Failed to like post: ${res.statusText}`);
    }
    return res.json();
  },

  async addComment(postId: string, text: string, userName: string, userGender: 'male' | 'female'): Promise<PostComment> {
    if (getIsDemoMode()) {
      return mockApi.addComment(postId, text, userName, userGender);
    }

    const res = await fetch(`${API_BASE}/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, userName, userGender }),
    });
    if (!res.ok) {
      throw new Error(`Failed to add comment: ${res.statusText}`);
    }
    return res.json();
  },

  async reportPost(postId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.reportPost(postId);
    }

    const res = await fetch(`${API_BASE}/community/posts/${postId}/report`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to report post: ${res.statusText}`);
    }
    const data = await res.json();
    return !!data.success;
  },

  async reportComment(postId: string, commentId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.reportComment(postId, commentId);
    }

    const res = await fetch(`${API_BASE}/community/posts/${postId}/comments/${commentId}/report`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to report comment: ${res.statusText}`);
    }
    const data = await res.json();
    return !!data.success;
  },

  async deletePost(postId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.deletePost(postId);
    }

    const res = await fetch(`${API_BASE}/community/posts/${postId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to delete post: ${res.statusText}`);
    }
    const data = await res.json();
    return !!data.success;
  },

  async deleteComment(postId: string, commentId: string): Promise<boolean> {
    if (getIsDemoMode()) {
      return mockApi.deleteComment(postId, commentId);
    }

    const res = await fetch(`${API_BASE}/community/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to delete comment: ${res.statusText}`);
    }
    const data = await res.json();
    return !!data.success;
  }
};
