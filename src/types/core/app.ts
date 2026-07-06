export type AppTab =
  | 'landing'
  | 'auth'
  | 'onboarding'
  | 'explore'
  | 'chat'
  | 'profile'
  | 'privacy'
  | 'account'
  | 'community'
  | 'trust_safety'
  | 'admin';

export type UserRole = 'guest' | 'user' | 'admin';

export interface AppState {
  isAuthenticated: boolean;
  userRole: UserRole;
  activeTab: AppTab;
}
