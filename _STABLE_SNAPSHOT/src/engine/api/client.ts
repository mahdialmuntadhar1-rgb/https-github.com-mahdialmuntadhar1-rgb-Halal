import { apiClient } from "../../services/apiClient";

export const api = {
  get: (url: string) => apiClient.get(url),
  post: (url: string, body: any) => apiClient.post(url, body),
  put: (url: string, body: any) => apiClient.put(url, body),
  delete: (url: string) => apiClient.delete(url),
};
