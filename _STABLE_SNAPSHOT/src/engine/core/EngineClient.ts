import { api } from "../api";
import { storage } from "../storage";

export const EngineClient = {
  api,
  storage,

  safeMode: true,

  status() {
    return {
      ready: true,
      mode: "stable"
    };
  }
};
