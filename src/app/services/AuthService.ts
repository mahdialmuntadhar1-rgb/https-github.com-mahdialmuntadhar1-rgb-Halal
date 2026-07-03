import { storage } from "../../storage/storage";

const KEY = "app_user";

export const AuthService = {
  login(user: any) {
    storage.set(KEY, user);
    return user;
  },

  logout() {
    storage.remove(KEY);
  },

  getUser() {
    return storage.get(KEY);
  }
};
