import { UserProfile, MatchProfile, Conversation, Message, PrivacySettings, PartnerPreferences, IntroductionRequest } from '../types';
import { INITIAL_MATCHES } from '../data/matches';

// Local in-memory store simulating database collections
let mockUserProfile: UserProfile = {
  name: '',
  age: 0,
  gender: 'male',
  country: '',
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
  seeProfilePermission: 'All verified members'
};

let mockMatches: MatchProfile[] = [...INITIAL_MATCHES];
let mockConversations: Conversation[] = [];
let mockIntroductionRequests: IntroductionRequest[] = [];

// Helper utility to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * Fetches the current user's profile info
   */
  async getCurrentUser(): Promise<UserProfile> {
    await delay(150);
    return { ...mockUserProfile };
  },

  /**
   * Updates the current user's profile info
   */
  async updateCurrentUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    await delay(200);
    mockUserProfile = {
      ...mockUserProfile,
      ...updated,
      // If nested structures are updated, let's also sync them
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
    await delay(180);
    return [...mockMatches];
  },

  /**
   * Dispatches an introduction request from the user to a match
   */
  async sendIntroductionRequest(matchId: string): Promise<{ success: boolean; request: IntroductionRequest }> {
    await delay(250);
    
    // Create request
    const newRequest: IntroductionRequest = {
      id: `req_${Date.now()}`,
      senderId: 'me',
      receiverId: matchId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    mockIntroductionRequests.push(newRequest);

    // Update match status to sent
    mockMatches = mockMatches.map(m => 
      m.id === matchId ? { ...m, requestStatus: 'sent' } : m
    );

    return { success: true, request: newRequest };
  },

  /**
   * Simulates/executes the acceptance of an introduction request (both ways)
   */
  async acceptIntroductionRequest(matchId: string): Promise<{ success: boolean; match: MatchProfile }> {
    await delay(300);

    // Update the request status
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

    // Auto-bootstrap conversation if it doesn't exist
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

  /**
   * Fetches the current conversations list
   */
  async getConversations(): Promise<Conversation[]> {
    await delay(150);
    return [...mockConversations];
  },

  /**
   * Sends a message into a conversation log
   */
  async sendMessage(matchId: string, text: string, sender: 'user' | 'match'): Promise<Message> {
    await delay(100);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
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
  }
};
