const TOKEN_KEY = 'auth_token';

export const authStore = {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
  }
};
