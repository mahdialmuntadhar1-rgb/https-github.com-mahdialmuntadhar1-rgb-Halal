import { getMe } from '../services/core/authService';
import { authStore } from '../services/core/authStore';

export async function restoreSession() {
  const token = authStore.getToken();

  if (!token) return null;

  try {
    const user = await getMe();
    return user;
  } catch (e) {
    authStore.clear();
    return null;
  }
}
