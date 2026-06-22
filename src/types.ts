/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  
  // Step 2 Marriage Intention
  lookingFor?: string;
  timeline: string;
  wantsChildren: string;
  relocation: string;
  familyInvolvement: string;
  values: string[];

  // Step 3 Partner Preferences
  partnerAgeRange?: string;
  partnerCountry?: string;
  partnerGovernorate?: string;
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

  // Step 4 Photo Privacy
  photoPrivacy: 'visible' | 'hidden_by_default' | 'private_mode' | 'hidden' | 'blurred' | 'initials' | 'floral' | 'mutual_approval';
  avatarUrl?: string;

  // Step 5 Family/Privacy settings
  trustedPerson?: string;
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
  familyInvolvement: string;
  valuesSummary: string[];
  verified: boolean;
  photoStatus: 'visible' | 'blurred' | 'hidden' | 'unlocked';
  avatarSeed: string; // Used to generate or reference stable images
  avatarUrl: string; // Real Unsplash image reference
  compatibilityScore: number;
  languages: string[];
  aboutMe: string;
  dealbreakers?: string[];
  requestStatus: 'none' | 'sent' | 'accepted' | 'declined';
}

export interface Conversation {
  matchId: string;
  messages: Message[];
}

export interface Message {
  id: string;
  sender: 'user' | 'match';
  text: string;
  timestamp: string;
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
}
