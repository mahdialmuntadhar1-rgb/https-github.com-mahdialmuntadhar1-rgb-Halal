import { authStore } from './authStore';

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint: string, method: string = 'GET', body?: any) {
  const token = authStore.getToken();

  const res = await fetch(BASE_URL + endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    throw new Error('API Error: ' + res.status);
  }

  return res.json();
}

export const apiClient = {
  get: (url: string) => request(url),
  post: (url: string, body: any) => request(url, 'POST', body),
  put: (url: string, body: any) => request(url, 'PUT', body),
  delete: (url: string) => request(url, 'DELETE')
};
