import {
  CommunityCategory,
  CommunityPost,
  ContentReport,
  HeroImage,
  IntentionBadge,
  MatchProfile,
  PartnerPreferences,
  PrivacySettings,
  SessionUser,
  UserProfile
} from '../types';
import { INITIAL_MATCHES } from '../data/matches';

const DEMO_EMAIL = 'demo@halal.local';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const respectfulBlockedWords = ['hookup', 'sex', 'nude', 'nudes', 'casual dating', 'flirt'];

function hasInappropriateContent(text: string): boolean {
  const normalized = text.toLowerCase();
  return respectfulBlockedWords.some((word) => normalized.includes(word));
}

let sessionUser: SessionUser = {
  id: 'demo_1',
  email: DEMO_EMAIL,
  role: import.meta.env.VITE_DEMO_ADMIN === 'true' ? 'admin' : 'member'
};

let mockUserProfile: UserProfile = {
  name: '',
  age: 0,
  gender: 'male',
  country: 'Iraq',
  governorate: 'Baghdad',
  city: '',
  religion: 'islam',
  sect: 'sunni',
  ethnicity: 'arab',
  education: '',
  profession: '',
  languages: ['Arabic'],
  maritalStatus: 'Single',
  intention: 'Serious for marriage',
  lookingFor: '',
  bio: '',
  timeline: 'Within 1 year',
  wantsChildren: 'Yes',
  relocation: 'Open to discussion',
  communicationPreference: 'Respectful platform communication only',
  values: [],
  intentionBadges: ['Serious for marriage'],
  photoPrivacy: 'visible',
  privateContactMode: 'Private Introduction Requests Only',
  sendRequestsPermission: 'Everyone verified',
  seeProfilePermission: 'All verified members'
};

let heroImages: HeroImage[] = [
  {
    id: 'hero_1',
    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=90&w=1800',
    alt: 'Elegant warm architectural entrance',
    active: true,
    order: 1
  },
  {
    id: 'hero_2',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=90&w=1800',
    alt: 'Respectful wedding details',
    active: true,
    order: 2
  },
  {
    id: 'hero_3',
    url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=90&w=1800',
    alt: 'Quiet celebration hall',
    active: true,
    order: 3
  }
];

let mockMatches: MatchProfile[] = INITIAL_MATCHES.map((match, index) => ({
  ...match,
  requestStatus: 'none',
  saved: false,
  reportCount: 0,
  hiddenByAdmin: false,
  intentionBadges: [
    'Serious for marriage',
    index % 3 === 0 ? 'Family involved' : index % 3 === 1 ? 'Ready for engagement' : 'Private profile'
  ] as IntentionBadge[]
}));

let reports: ContentReport[] = [];

let communityPosts: CommunityPost[] = [
  {
    id: 'daily_1',
    author: 'HALAL Team',
    category: 'Marriage advice',
    text: 'Daily Marriage Question: What is the most important quality in a future spouse?',
    createdAt: 'Today',
    likes: 18,
    likedByMe: false,
    isDailyQuestion: true,
    comments: [
      {
        id: 'c1',
        author: 'Lina',
        text: 'Sincere respect during difficult conversations matters most to me.',
        createdAt: 'Today'
      }
    ],
    reportCount: 0,
    hiddenByAdmin: false
  },
  {
    id: 'post_1',
    author: 'Adam',
    category: 'Family approval',
    text: 'How early should families be involved when both people feel the intention is serious?',
    createdAt: 'Yesterday',
    likes: 9,
    likedByMe: false,
    comments: [],
    reportCount: 0,
    hiddenByAdmin: false
  }
];

export const COMMUNITY_CATEGORIES: CommunityCategory[] = [
  'Marriage advice',
  'Family approval',
  'Engagement questions',
  'Culture and traditions',
  'Religious/respectful questions',
  'Success stories'
];

export const INTENTION_BADGES: IntentionBadge[] = [
  'Serious for marriage',
  'Family involved',
  'Ready for engagement',
  'Studying first',
  'Private profile'
];

export const mockApi = {
  async getSession(): Promise<SessionUser> {
    await delay(80);
    return { ...sessionUser };
  },

  async getHeroImages(): Promise<HeroImage[]> {
    await delay(100);
    return [...heroImages].sort((a, b) => a.order - b.order);
  },

  async addHeroImage(image: Pick<HeroImage, 'url' | 'alt'>): Promise<HeroImage> {
    await delay(120);
    const next: HeroImage = {
      id: `hero_${Date.now()}`,
      url: image.url,
      alt: image.alt || 'Marriage matchmaking hero image',
      active: true,
      order: heroImages.length + 1
    };
    heroImages = [...heroImages, next];
    return next;
  },

  async updateHeroImage(id: string, updates: Partial<HeroImage>): Promise<HeroImage[]> {
    await delay(120);
    heroImages = heroImages.map((image) => (image.id === id ? { ...image, ...updates } : image));
    return this.getHeroImages();
  },

  async removeHeroImage(id: string): Promise<HeroImage[]> {
    await delay(120);
    heroImages = heroImages
      .filter((image) => image.id !== id)
      .map((image, index) => ({ ...image, order: index + 1 }));
    return this.getHeroImages();
  },

  async moveHeroImage(id: string, direction: 'up' | 'down'): Promise<HeroImage[]> {
    await delay(120);
    const ordered = [...heroImages].sort((a, b) => a.order - b.order);
    const index = ordered.findIndex((image) => image.id === id);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (index >= 0 && swapIndex >= 0 && swapIndex < ordered.length) {
      [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
      heroImages = ordered.map((image, orderIndex) => ({ ...image, order: orderIndex + 1 }));
    }
    return this.getHeroImages();
  },

  async getCurrentUser(): Promise<UserProfile> {
    await delay(120);
    return { ...mockUserProfile };
  },

  async updateCurrentUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    await delay(160);
    mockUserProfile = {
      ...mockUserProfile,
      ...updated,
      preferences: {
        ...mockUserProfile.preferences,
        ...(updated.preferences ? updated.preferences : {})
      } as PartnerPreferences,
      privacy: {
        ...mockUserProfile.privacy,
        ...(updated.privacy ? updated.privacy : {})
      } as PrivacySettings
    };
    return { ...mockUserProfile };
  },

  async getMatches(): Promise<MatchProfile[]> {
    await delay(140);
    return mockMatches.filter((match) => !match.hiddenByAdmin).map((match) => ({ ...match }));
  },

  async toggleSavedProfile(matchId: string): Promise<MatchProfile[]> {
    await delay(100);
    mockMatches = mockMatches.map((match) =>
      match.id === matchId ? { ...match, saved: !match.saved } : match
    );
    return this.getMatches();
  },

  async reportProfile(matchId: string, reason = 'Reported by member'): Promise<ContentReport> {
    await delay(100);
    const report: ContentReport = {
      id: `report_${Date.now()}`,
      targetType: 'profile',
      targetId: matchId,
      reason,
      createdAt: new Date().toISOString(),
      status: 'open'
    };
    reports = [report, ...reports];
    mockMatches = mockMatches.map((match) =>
      match.id === matchId ? { ...match, reportCount: (match.reportCount || 0) + 1 } : match
    );
    return report;
  },

  async getCommunityPosts(): Promise<CommunityPost[]> {
    await delay(120);
    return communityPosts.filter((post) => !post.hiddenByAdmin).map((post) => ({ ...post }));
  },

  async addCommunityPost(category: CommunityCategory, text: string): Promise<CommunityPost[]> {
    await delay(120);
    if (hasInappropriateContent(text)) {
      throw new Error('Please keep community posts focused on respectful marriage topics.');
    }
    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      author: mockUserProfile.name || 'Member',
      category,
      text,
      createdAt: 'Just now',
      likes: 0,
      likedByMe: false,
      comments: [],
      reportCount: 0,
      hiddenByAdmin: false
    };
    communityPosts = [post, ...communityPosts];
    return this.getCommunityPosts();
  },

  async likePost(postId: string): Promise<CommunityPost[]> {
    await delay(80);
    communityPosts = communityPosts.map((post) => {
      if (post.id !== postId) return post;
      const likedByMe = !post.likedByMe;
      return { ...post, likedByMe, likes: Math.max(0, post.likes + (likedByMe ? 1 : -1)) };
    });
    return this.getCommunityPosts();
  },

  async addComment(postId: string, text: string): Promise<CommunityPost[]> {
    await delay(100);
    if (hasInappropriateContent(text)) {
      throw new Error('Please keep comments respectful and marriage-focused.');
    }
    communityPosts = communityPosts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: `comment_${Date.now()}`,
                author: mockUserProfile.name || 'Member',
                text,
                createdAt: 'Just now'
              }
            ]
          }
        : post
    );
    return this.getCommunityPosts();
  },

  async reportPost(postId: string, reason = 'Reported by member'): Promise<ContentReport> {
    await delay(100);
    const report: ContentReport = {
      id: `report_${Date.now()}`,
      targetType: 'post',
      targetId: postId,
      reason,
      createdAt: new Date().toISOString(),
      status: 'open'
    };
    reports = [report, ...reports];
    communityPosts = communityPosts.map((post) =>
      post.id === postId ? { ...post, reportCount: (post.reportCount || 0) + 1 } : post
    );
    return report;
  },

  async getReports(): Promise<ContentReport[]> {
    await delay(100);
    return [...reports];
  },

  async moderateContent(targetType: 'profile' | 'post', targetId: string, action: 'hide' | 'delete'): Promise<void> {
    await delay(120);
    if (targetType === 'profile') {
      mockMatches = mockMatches.map((match) =>
        match.id === targetId ? { ...match, hiddenByAdmin: true } : match
      );
    } else {
      communityPosts = communityPosts.map((post) =>
        post.id === targetId ? { ...post, hiddenByAdmin: true } : post
      );
    }
    reports = reports.map((report) =>
      report.targetId === targetId && report.targetType === targetType
        ? { ...report, status: 'resolved' }
        : report
    );
  }
};
