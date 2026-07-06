export type AppTab =
  | 'landing'
  | 'auth'
  | 'explore'
  | 'chat'
  | 'community';

type State = {
  isAuthenticated: boolean;
  userRole: string;
  activeTab: AppTab;
};

type Listener = (state: State) => void;

let state: State = {
  isAuthenticated: false,
  userRole: 'guest',
  activeTab: 'landing'
};

const listeners: Listener[] = [];

function emit() {
  listeners.forEach(l => l(state));
}

export const store = {
  getState: () => state,

  setState(next: Partial<State>) {
    state = { ...state, ...next };
    emit();
  },

  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      const i = listeners.indexOf(listener);
      if (i >= 0) listeners.splice(i, 1);
    };
  },

  navigate(tab: AppTab) {
    state.activeTab = tab;
    emit();
  }
};
