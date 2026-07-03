import { storage } from "../storage";

const AUTH_KEY = "auth_user";

export const auth = {
  login(user) {
    storage.set(AUTH_KEY, user);
    return user;
  },

  logout() {
    storage.remove(AUTH_KEY);
  },

  getUser() {
    return storage.get(AUTH_KEY);
  },

  isLoggedIn() {
    return !!storage.get(AUTH_KEY);
  }
};
