import { store } from './store';
import { restoreSession } from './authBridge';

export async function bootApp() {
  store.setState({ activeTab: 'landing' });

  try {
    const user = await restoreSession();

    if (user) {
      store.setState({
        isAuthenticated: true,
        userRole: user.role || 'user'
      });
    } else {
      store.setState({
        isAuthenticated: false,
        activeTab: 'auth'
      });
    }
  } catch (e) {
    store.setState({
      isAuthenticated: false,
      activeTab: 'auth'
    });
  }
}
