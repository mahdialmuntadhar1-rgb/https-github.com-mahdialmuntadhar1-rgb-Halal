import { api } from "./engine/api/client";

export const API = {
  auth: {
    login: (user: any) => Promise.resolve(user),
    logout: () => Promise.resolve(true),
    getUser: () => null
  },

  health: () => api.get("/health")
};
