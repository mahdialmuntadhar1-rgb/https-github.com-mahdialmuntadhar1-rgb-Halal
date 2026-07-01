import { UserProfile, MatchProfile, Conversation, Message, PrivacySettings, PartnerPreferences, IntroductionRequest, HeroImage, CommunityPost, PostComment } from '../types';
import { INITIAL_MATCHES } from '../data/matches';

// Default Admin Hero Images of elegant, clear wedding & marriage theme (no text overlays)
let mockHeroImages: HeroImage[] = [
  {
    id: 'hero_1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    order: 1,
    isActive: true,
    title: 'Traditional Floral Arbors (Unsplash)'
  },
  {
    id: 'hero_2',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    order: 2,
    isActive: true,
    title: 'Sacred Rings Covenant (Unsplash)'
  },
  {
    id: 'hero_3',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    order: 3,
    isActive: true,
    title: 'Traditional Wedding Union (Unsplash)'
  }
];

// Local in-memory store simulating database collections
let mockUserProfile: UserProfile = {
  name: '',
  age: 0,
  gender: 'male',
  country: 'Iraq',
  governorate: 'Baghdad',
  religion: 'islam',
  sect: 'sunni',
  ethnicity: 'arab',
  education: '',
  profession: '',
  languages: ['Arabic', 'English'],
  intention: 'Seeking serious marriage introduces.',
  timeline: 'Within 1 year',
  wantsChildren: 'Yes, definitely',
  relocation: 'Yes, open globally',
  communicationPreference: 'Prefers private respectful correspondence',
  values: [],
  photoPrivacy: 'visible',
  privateContactMode: 'Direct Private Only',
  sendRequestsPermission: 'Everyone verified',
  seeProfilePermission: 'All verified members',
  email: 'user@example.com', // Default placeholder
  badges: ['Serious for marriage'], // Default badge
  savedMatches: []
};

let mockMatches: MatchProfile[] = [...INITIAL_MATCHES];
let mockConversations: Conversation[] = [];
let mockIntroductionRequests: IntroductionRequest[] = [];

// Starter respectful community posts grouped by topic categories
const LOCAL_STORAGE_POSTS_KEY = 'zawaj_marriage_cafe_posts';
let mockCommunityPosts: CommunityPost[] = (() => {
  const saved = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse community posts', e);
    }
  }
  return [
    {
      id: 'post_1',
      category: 'religion',
      title: 'Assalamu Alaikum. Traditional family meeting etiquette?',
      content: 'My family and I are preparing for our first face-to-face meeting with a potential spouse and his father next week in Erbil. What are the best practices to keep everything respectful, traditional, and matching Islamic expectations? Any advice is highly appreciated.',
      userName: 'Layla S.',
      userGender: 'female',
      createdAt: '2026-06-21T10:30:00Z',
      likesCount: 14,
      likedBy: [],
      status: 'approved',
      comments: [
        {
          id: 'comm_1_1',
          postId: 'post_1',
          userName: 'Ahmad M.',
          userGender: 'male',
          text: 'Keep it open and light! Let the parents talk, and make sure to meet in the family salon with complete respect.',
          createdAt: '2026-06-21T11:15:00Z'
        }
      ]
    },
    {
      id: 'post_2',
      category: 'advice',
      title: 'Essential questions to ask before engagement?',
      content: 'What are the main dealbreakers or questions we must clear before signing the official engagement contract (Nikkah)? I want to focus on prayer habits, career support, and family residency.',
      userName: 'Mustafa K.',
      userGender: 'male',
      createdAt: '2026-06-22T08:00:00Z',
      likesCount: 22,
      likedBy: [],
      status: 'approved',
      comments: [
        {
          id: 'comm_2_1',
          postId: 'post_2',
          userName: 'Fatima Z.',
          userGender: 'female',
          text: 'Salary, career boundaries, and expectation of living arrangements should be decided with total clarity.',
          createdAt: '2026-06-22T08:45:00Z'
        }
      ]
    },
    {
      id: 'post_3',
      category: 'family',
      title: 'Balancing careers with a peaceful Islamic home',
      content: 'To my brothers and sisters: How do you achieve balance between demanding professional careers (e.g. engineering, medicine) and dedication to your family? Any beautiful success stories are welcome.',
      userName: 'Dr. Yasmin A.',
      userGender: 'female',
      createdAt: '2026-06-22T14:20:00Z',
      likesCount: 19,
      likedBy: [],
      status: 'approved',
      comments: []
    },
    {
      id: 'post_daily_active',
      category: 'daily',
      title: 'Daily Marriage Question',
      content: 'What is the most important quality in a future spouse? Compassion, reliability, religiosity, or family background?',
      userName: 'HALAL Moderator',
      userGender: 'male',
      createdAt: '2026-06-23T00:00:00Z',
      likesCount: 45,
      likedBy: [],
      isDailyQuestion: true,
      status: 'approved',
      comments: [
        {
          id: 'comm_d_1',
          postId: 'post_daily_active',
          userName: 'Youssef H.',
          userGender: 'male',
          text: 'Sincere religious commitment and a calm respectful temper are the pillars of a successful marriage.',
          createdAt: '2026-06-23T04:15:00Z'
        },
        {
          id: 'comm_d_2',
          postId: 'post_daily_active',
          userName: 'Amina F.',
          userGender: 'female',
          text: 'I agree. Mutual respect and involvement of both families from day one makes everything blessed.',
          createdAt: '2026-06-23T05:30:00Z'
        }
      ]
    }
  ];
})();

const savePosts = () => {
  localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(mockCommunityPosts));
};

// Helper utility to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * Fetches the current user's profile info
   */
  async getCurrentUser(): Promise<UserProfile> {
    await delay(100);
    return { ...mockUserProfile };
  },

  /**
   * Updates the current user's profile info
   */
  async updateCurrentUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    await delay(120);
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

  /**
   * Fetches the matchmaking profiles group
   */
  async getMatches(): Promise<MatchProfile[]> {
    await delay(120);
    return [...mockMatches];
  },

  /**
   * Saves or bookmarks/unbookmarks a profile
   */
  async toggleSaveProfile(matchId: string): Promise<UserProfile> {
    await delay(100);
    const saved = mockUserProfile.savedMatches || [];
    if (saved.includes(matchId)) {
      mockUserProfile.savedMatches = saved.filter(id => id !== matchId);
    } else {
      mockUserProfile.savedMatches = [...saved, matchId];
    }
    return { ...mockUserProfile };
  },

  /**
   * Dispatches an introduction request from the user to a match
   */
  async sendIntroductionRequest(matchId: string): Promise<{ success: boolean; request: IntroductionRequest }> {
    await delay(150);
    const newRequest: IntroductionRequest = {
      id: `req_${Date.now()}`,
      senderId: 'me',
      receiverId: matchId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    mockIntroductionRequests.push(newRequest);

    mockMatches = mockMatches.map(m => 
      m.id === matchId ? { ...m, requestStatus: 'sent' } : m
    );

    return { success: true, request: newRequest };
  },

  /**
   * Simulates/executes the acceptance of an introduction request (both ways)
   */
  async acceptIntroductionRequest(matchId: string): Promise<{ success: boolean; match: MatchProfile }> {
    await delay(200);

    mockIntroductionRequests = mockIntroductionRequests.map(r => 
      r.receiverId === matchId || r.senderId === matchId ? { ...r, status: 'accepted' } : r
    );

    let updatedMatch: MatchProfile | undefined;
    mockMatches = mockMatches.map(m => {
      if (m.id === matchId) {
        updatedMatch = {
          ...m,
          requestStatus: 'accepted',
          photoStatus: 'unlocked'
        };
        return updatedMatch;
      }
      return m;
    });

    if (!updatedMatch) {
      throw new Error(`Match with ID ${matchId} not found`);
    }

    if (!mockConversations.some(c => c.matchId === matchId)) {
      mockConversations.push({
        matchId,
        messages: [
          {
            id: `welcome_${matchId}`,
            sender: 'match',
            text: `Assalamu Alaikum. Thank you for connecting with serious intentions. I liked your profile and compatibility values! What does a peaceful married life look like to you?`,
            timestamp: 'Just now'
          }
        ]
      });
    }

    return { success: true, match: updatedMatch };
  },

  async declineIntroductionRequest(matchId: string): Promise<{ success: boolean; match: MatchProfile }> {
    await delay(200);

    mockIntroductionRequests = mockIntroductionRequests.map(r => 
      r.receiverId === matchId || r.senderId === matchId ? { ...r, status: 'declined' } : r
    );

    let updatedMatch: MatchProfile | undefined;
    mockMatches = mockMatches.map(m => {
      if (m.id === matchId) {
        updatedMatch = {
          ...m,
          requestStatus: 'declined'
        };
        return updatedMatch;
      }
      return m;
    });

    if (!updatedMatch) {
      throw new Error(`Match with ID ${matchId} not found`);
    }

    return { success: true, match: updatedMatch };
  },

  /**
   * Fetches the current conversations list
   */
  async getConversations(): Promise<Conversation[]> {
    await delay(100);
    return [...mockConversations];
  },

  /**
   * Sends a message into a conversation log
   */
  async sendMessage(matchId: string, text: string, sender: 'user' | 'match'): Promise<Message> {
    await delay(50);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      text,
      timestamp: timeNow
    };

    let found = false;
    mockConversations = mockConversations.map(c => {
      if (c.matchId === matchId) {
        found = true;
        return {
          ...c,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    if (!found) {
      mockConversations.push({
        matchId,
        messages: [newMessage]
      });
    }

    return newMessage;
  },

  /* -------------------------------------------------------------
   * NEW HERO SLIDESHOW APIS
   * ------------------------------------------------------------- */
  async getHeroImages(): Promise<HeroImage[]> {
    await delay(100);
    // Return sorted by order ascending
    return [...mockHeroImages].sort((a, b) => a.order - b.order);
  },

  async addHeroImage(url: string, title: string, isActive: boolean = true): Promise<HeroImage> {
    await delay(100);
    const newImage: HeroImage = {
      id: `hero_${Date.now()}`,
      url,
      title: title || 'Custom Hero Image',
      order: mockHeroImages.length + 1,
      isActive
    };
    mockHeroImages.push(newImage);
    return newImage;
  },

  async updateHeroImage(id: string, updatedFields: Partial<HeroImage>): Promise<HeroImage> {
    await delay(100);
    let updated: HeroImage | null = null;
    mockHeroImages = mockHeroImages.map(img => {
      if (img.id === id) {
        updated = { ...img, ...updatedFields };
        return updated;
      }
      return img;
    });
    if (!updated) throw new Error(`Hero image not found: ${id}`);
    return updated;
  },

  async deleteHeroImage(id: string): Promise<boolean> {
    await delay(100);
    const lengthBefore = mockHeroImages.length;
    mockHeroImages = mockHeroImages.filter(img => img.id !== id);
    // Recalculate order numbers of remaining ones
    mockHeroImages = mockHeroImages.map((img, index) => ({
      ...img,
      order: index + 1
    }));
    return mockHeroImages.length < lengthBefore;
  },

  async reorderHeroImages(reordered: HeroImage[]): Promise<HeroImage[]> {
    await delay(100);
    mockHeroImages = reordered.map((img, i) => ({
      ...img,
      order: i + 1
    }));
    return [...mockHeroImages];
  },

  /* -------------------------------------------------------------
   * NEW COMMUNITY APIS
   * ------------------------------------------------------------- */
  async getCommunityPosts(): Promise<CommunityPost[]> {
    await delay(100);
    return [...mockCommunityPosts];
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
    await delay(100);
    
    // Auto-approve if user is admin, otherwise default to pending
    const defaultStatus = (mockUserProfile.role === 'admin' || mockUserProfile.email === 'shkar9441@gmail.com') ? 'approved' : 'pending';

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      category,
      title,
      content,
      userName: mockUserProfile.name || 'Anonymous User',
      userGender: mockUserProfile.gender,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedBy: [],
      comments: [],
      isDailyQuestion: isDaily,
      image,
      status: status || defaultStatus,
      isFeatured: false,
      postType,
      opinionColor,
      pollOptions,
      pollVotes: pollVotes || (pollOptions ? pollOptions.reduce((acc, opt) => ({ ...acc, [opt]: [] }), {}) : undefined)
    };
    mockCommunityPosts.unshift(newPost); // Add to top
    savePosts();
    return newPost;
  },

  async likePost(postId: string, userName: string): Promise<CommunityPost> {
    await delay(55);
    let updated: CommunityPost | null = null;
    mockCommunityPosts = mockCommunityPosts.map(post => {
      if (post.id === postId) {
        let isAlreadyLiked = post.likedBy.includes(userName);
        let newLikedBy = isAlreadyLiked 
          ? post.likedBy.filter(u => u !== userName)
          : [...post.likedBy, userName];
        let newLikesCount = isAlreadyLiked ? post.likesCount - 1 : post.likesCount + 1;
        
        updated = {
          ...post,
          likesCount: newLikesCount,
          likedBy: newLikedBy
        };
        return updated;
      }
      return post;
    });
    if (!updated) throw new Error(`Post not found: ${postId}`);
    savePosts();
    return updated;
  },

  async voteInPoll(postId: string, optionText: string, userName: string): Promise<CommunityPost> {
    await delay(60);
    let updated: CommunityPost | null = null;
    mockCommunityPosts = mockCommunityPosts.map(post => {
      if (post.id === postId) {
        const votes = post.pollVotes || {};
        const newVotes: Record<string, string[]> = {};
        Object.keys(votes).forEach(opt => {
          const voters = votes[opt] || [];
          newVotes[opt] = voters.filter(u => u !== userName);
        });
        newVotes[optionText] = [...(newVotes[optionText] || []), userName];
        updated = {
          ...post,
          pollVotes: newVotes
        };
        return updated;
      }
      return post;
    });
    if (!updated) throw new Error(`Post not found: ${postId}`);
    savePosts();
    return updated;
  },

  async addComment(postId: string, text: string, userName: string, userGender: 'male' | 'female'): Promise<PostComment> {
    await delay(80);
    const newComment: PostComment = {
      id: `comm_${Date.now()}`,
      postId,
      userName,
      userGender,
      text,
      createdAt: new Date().toISOString()
    };

    mockCommunityPosts = mockCommunityPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    });

    savePosts();
    return newComment;
  },

  async reportPost(postId: string): Promise<boolean> {
    await delay(50);
    mockCommunityPosts = mockCommunityPosts.map(post => {
      if (post.id === postId) {
        return { ...post, isReported: true };
      }
      return post;
    });
    savePosts();
    return true;
  },

  async reportComment(postId: string, commentId: string): Promise<boolean> {
    await delay(50);
    mockCommunityPosts = mockCommunityPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => c.id === commentId ? { ...c, isReported: true } : c)
        };
      }
      return post;
    });
    savePosts();
    return true;
  },

  /* Admin exclusive deletes & status controls */
  async deletePost(postId: string): Promise<boolean> {
    await delay(100);
    const lengthBefore = mockCommunityPosts.length;
    mockCommunityPosts = mockCommunityPosts.filter(post => post.id !== postId);
    savePosts();
    return mockCommunityPosts.length < lengthBefore;
  },

  async deleteComment(postId: string, commentId: string): Promise<boolean> {
    await delay(100);
    let deleted = false;
    mockCommunityPosts = mockCommunityPosts.map(post => {
      if (post.id === postId) {
        const commentsBefore = post.comments.length;
        const remainingComments = post.comments.filter(c => c.id !== commentId);
        if (remainingComments.length < commentsBefore) {
          deleted = true;
        }
        return {
          ...post,
          comments: remainingComments
        };
      }
      return post;
    });
    savePosts();
    return deleted;
  },

  async updatePostStatus(postId: string, status: 'approved' | 'hidden' | 'rejected' | 'pending'): Promise<boolean> {
    await delay(50);
    let updated = false;
    mockCommunityPosts = mockCommunityPosts.map(post => {
      if (post.id === postId) {
        updated = true;
        return { ...post, status };
      }
      return post;
    });
    savePosts();
    return updated;
  },

  async toggleFeaturePost(postId: string): Promise<boolean> {
    await delay(50);
    let updated = false;
    mockCommunityPosts = mockCommunityPosts.map(post => {
      if (post.id === postId) {
        updated = true;
        return { ...post, isFeatured: !post.isFeatured };
      }
      return post;
    });
    savePosts();
    return updated;
  }
};
