/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppLanguage = 'en' | 'ar' | 'ku';

export interface User {
  id: string;
  email: string;
  name: string;
  membershipStatus: 'free' | 'premium' | 'verified';
  role?: 'member' | 'admin';
  createdAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  role: 'member' | 'admin';
}

export type AppTab = 'landing' | 'onboarding' | 'explore' | 'chat' | 'community' | 'admin' | 'profile' | 'privacy' | 'account' | 'trust_safety';

export type IntentionBadge =
  | 'Serious for marriage'
  | 'Family involved'
  | 'Ready for engagement'
  | 'Studying first'
  | 'Private profile';

export interface PrivacySettings {
  photoPrivacy: 'visible' | 'hidden_by_default' | 'private_mode' | 'hidden' | 'blurred' | 'initials' | 'floral' | 'mutual_approval';
  profileVisibility: 'all' | 'verified_only' | 'hidden';
  privateContactMode: 'Direct Private Only' | 'Requires Mutual Matching First' | 'Zero External Tracking' | 'Private Introduction Requests Only' | 'Standard Privacy Options';
  sendRequestsPermission: string;
  seeProfilePermission: string;
}

export interface PartnerPreferences {
  partnerAgeRange: string;
  partnerCountry: string;
  partnerGovernorate: string;
  partnerCity?: string;
  partnerReligion?: 'all' | 'islam' | 'non_islam';
  partnerSect?: 'all' | 'sunni' | 'shiaa' | 'none';
  partnerEthnicity?: 'all' | 'arab' | 'kurdish' | 'others';
  partnerEducation?: string;
  partnerProfession?: string;
  partnerLanguage?: string[];
  partnerFamilyValues?: string;
  partnerLifestyle?: string;
  partnerSmoking?: string;
  partnerWantsChildren?: string;
  partnerPersonality?: string;
  partnerSeriousness?: string;
  partnerDealbreakers?: string[];
  locationSearchPreference?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  country: string;
  governorate?: string;
  city?: string;
  religion: 'islam' | 'non_islam';
  sect?: 'sunni' | 'shiaa' | 'none';
  ethnicity: 'arab' | 'kurdish' | 'others';
  education: string;
  professionCategory?: string;
  profession: string;
  languages: string[];
  maritalStatus?: string;
  intention?: string;
  bio?: string;
  intentionBadges?: IntentionBadge[];

  // Marriage Intention & Details
  lookingFor?: string;
  timeline: string;
  wantsChildren: string;
  relocation: string;
  communicationPreference: string;
  values: string[];

  // Embedded Nested Preferences & Privacy for backend mapping
  preferences?: PartnerPreferences;
  privacy?: PrivacySettings;

  // Flattened properties for compatibility with existing components
  partnerReligion?: 'all' | 'islam' | 'non_islam';
  partnerSect?: 'all' | 'sunni' | 'shiaa' | 'none';
  partnerEthnicity?: 'all' | 'arab' | 'kurdish' | 'others';
  partnerAgeRange?: string;
  partnerCountry?: string;
  partnerGovernorate?: string;
  partnerCity?: string;
  partnerEducation?: string;
  partnerProfession?: string;
  partnerLanguage?: string[];
  partnerFamilyValues?: string;
  partnerLifestyle?: string;
  partnerSmoking?: string;
  partnerWantsChildren?: string;
  partnerPersonality?: string;
  partnerSeriousness?: string;
  partnerDealbreakers?: string[];
  locationSearchPreference?: string;

  photoPrivacy: PrivacySettings['photoPrivacy'];
  avatarUrl?: string;
  privateContactMode?: string;
  sendRequestsPermission?: string;
  seeProfilePermission?: string;
}

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  city?: string;
  governorate?: string;
  country: string;
  religion: 'islam' | 'non_islam';
  sect?: 'sunni' | 'shiaa' | 'none';
  ethnicity: 'arab' | 'kurdish' | 'others';
  profession: string;
  education: string;
  intention?: string;
  timeline: string;
  wantsChildren: string;
  communicationPreference: string;
  valuesSummary: string[];
  verified: boolean;
  photoStatus: 'visible' | 'blurred' | 'hidden' | 'initials' | 'unlocked';
  avatarSeed: string;
  avatarUrl: string;
  compatibilityScore: number;
  languages: string[];
  aboutMe: string;
  dealbreakers?: string[];
  requestStatus: 'none' | 'sent' | 'accepted' | 'declined';
  intentionBadges?: IntentionBadge[];
  saved?: boolean;
  hiddenByAdmin?: boolean;
  reportCount?: number;
}

export interface HeroImage {
  id: string;
  url: string;
  alt: string;
  active: boolean;
  order: number;
}

export type CommunityCategory =
  | 'Marriage advice'
  | 'Family approval'
  | 'Engagement questions'
  | 'Culture and traditions'
  | 'Religious/respectful questions'
  | 'Success stories';

export interface CommunityComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  hiddenByAdmin?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  category: CommunityCategory;
  text: string;
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
  comments: CommunityComment[];
  reportCount?: number;
  hiddenByAdmin?: boolean;
  isDailyQuestion?: boolean;
}

export interface ContentReport {
  id: string;
  targetType: 'profile' | 'post';
  targetId: string;
  reason: string;
  createdAt: string;
  status: 'open' | 'resolved';
}

export interface IntroductionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderEmail?: string;
  receiverEmail?: string;
  senderName?: string;
  receiverName?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  decidedAt?: string;
}

export interface Conversation {
  id: string;
  matchId: string;
  match?: MatchProfile;
  messages: Message[];
}

export interface Message {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: string;
}

export type ReportReason = 'unserious' | 'harassment' | 'fake_profile' | 'commercial' | 'inappropriate_photo' | 'other';

export interface BlockedUser {
  id: string;
  blockedUserId: string;
  reason?: string;
  createdAt: string;
}

export interface SearchFilters {
  gender: 'male' | 'female' | 'all';
  minAge: number;
  maxAge: number;
  locationSearchPreference: string;
  governorate: string;
  city?: string;
  religion: 'all' | 'islam' | 'non_islam';
  sect: 'all' | 'sunni' | 'shiaa' | 'none';
  ethnicity: 'all' | 'arab' | 'kurdish' | 'others';
  education: string;
  profession: string;
  seriousness: string;
  familyValues: string;
  wantsChildren: string;
  smoking: string;
  photoVisibility: string;
  verifiedOnly: boolean;
  timeline?: string;
  sortBy?: string;
}
