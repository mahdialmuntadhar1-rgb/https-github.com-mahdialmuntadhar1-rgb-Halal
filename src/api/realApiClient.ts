/**
 * Real API Client for Zawaj Backend
 * Replaces localStorage/mock data with Cloudflare Workers API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export interface ApiError {
  error: string;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('zawaj_token');
  
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json() as ApiError;
    throw new Error(error.error || `API Error: ${res.status}`);
  }
  
  return res.json();
}

// ==================== AUTH ====================

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    gender: 'male' | 'female';
    age: number;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  gender: 'male' | 'female';
  age: number;
  country?: string;
  governorate?: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/api/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<any> {
  return apiFetch('/api/auth/me');
}

// ==================== MEMBERS ====================

export interface Member {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female';
  age: number;
  country: string;
  governorate?: string;
  city?: string;
  religion: string;
  sect?: string;
  ethnicity: string;
  education?: string;
  profession?: string;
  languages?: string[];
  marital_status?: string;
  intention?: string;
  timeline: string;
  wants_children: string;
  relocation: string;
  communication_preference: string;
  values?: string[];
  photo_privacy: string;
  avatar_url?: string;
  photo_status: string;
  about_me?: string;
  verified: boolean;
  compatibility_score: number;
  // ... other fields
}

export interface MembersResponse {
  members: Member[];
  page: number;
  limit: number;
  total: number;
}

export async function getMembers(params?: {
  page?: number;
  limit?: number;
  gender?: 'male' | 'female';
  governorate?: string;
}): Promise<MembersResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.gender) searchParams.set('gender', params.gender);
  if (params?.governorate) searchParams.set('governorate', params.governorate);
  
  const query = searchParams.toString();
  return apiFetch<MembersResponse>(`/api/members${query ? `?${query}` : ''}`);
}

export async function getMember(id: string): Promise<Member> {
  return apiFetch<Member>(`/api/members/${id}`);
}

// ==================== LIKES ====================

export interface LikeResponse {
  success: boolean;
  liked: boolean;
  matchCreated?: boolean;
}

export async function toggleLike(likedUserId: string): Promise<LikeResponse> {
  return apiFetch<LikeResponse>('/api/likes', {
    method: 'POST',
    body: JSON.stringify({ likedUserId }),
  });
}

export interface LikesResponse {
  likes: Member[];
}

export async function getMyLikes(): Promise<LikesResponse> {
  return apiFetch<LikesResponse>('/api/likes/my');
}

export async function getReceivedLikes(): Promise<LikesResponse> {
  return apiFetch<LikesResponse>('/api/likes/received');
}

// ==================== MATCHES ====================

export interface MatchesResponse {
  matches: Member[];
}

export async function getMatches(): Promise<MatchesResponse> {
  return apiFetch<MatchesResponse>('/api/matches');
}

// ==================== MESSAGES ====================

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

export interface MessagesResponse {
  messages: Message[];
  page: number;
  limit: number;
}

export async function getMessages(
  matchId: string,
  params?: { page?: number; limit?: number }
): Promise<MessagesResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  
  const query = searchParams.toString();
  return apiFetch<MessagesResponse>(
    `/api/messages/${matchId}${query ? `?${query}` : ''}`
  );
}

export interface SendMessageData {
  matchId: string;
  text: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId: string;
}

export async function sendMessage(data: SendMessageData): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>('/api/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ==================== UPLOAD ====================

export interface UploadResponse {
  success: boolean;
  url: string;
}

export async function uploadAvatar(file: File): Promise<UploadResponse> {
  const token = localStorage.getItem('zawaj_token');
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_URL}/api/upload/avatar`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  
  if (!res.ok) {
    const error = await res.json() as ApiError;
    throw new Error(error.error || `Upload Error: ${res.status}`);
  }
  
  return res.json();
}
