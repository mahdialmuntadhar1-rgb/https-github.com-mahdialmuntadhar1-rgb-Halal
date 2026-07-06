import { apiClient } from './apiClient';

export async function login(phone: string, password: string) {
  return apiClient.post('/auth/login', { phone, password });
}

export async function register(data: any) {
  return apiClient.post('/auth/register', data);
}

export async function getMe() {
  return apiClient.get('/auth/me');
}
