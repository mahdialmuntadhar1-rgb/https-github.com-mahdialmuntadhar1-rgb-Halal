import type { AppTab } from './store';

export function resolveRoute(isAuth: boolean, tab: AppTab): AppTab {
  if (!isAuth && tab !== 'auth' && tab !== 'landing') {
    return 'auth';
  }
  return tab;
}
