import { AppTab, AppState } from '../types/core/app';

export function createInitialState(): AppState {
  return {
    isAuthenticated: false,
    userRole: 'guest',
    activeTab: 'landing'
  };
}

export function setActiveTab(state: AppState, tab: AppTab): AppState {
  return {
    ...state,
    activeTab: tab
  };
}
