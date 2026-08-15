/**
 * Canonical API prefix for halal-api-real.
 * Always ends with `/api` (or is exactly `/api`) so callers use `${API_BASE}/auth/login`.
 * Accepts host-only, host+/api, or relative `/api` from Vite env.
 */
export function normalizeApiBase(raw: string | undefined | null): string {
  let base = String(raw || '/api').trim();
  if (base.endsWith('/')) base = base.slice(0, -1);
  if (!base || base === '/') return '/api';
  if (base === '/api' || base.endsWith('/api')) return base;
  return `${base}/api`;
}

export function resolveApiBase(): string {
  const env = (import.meta as any).env || {};
  return normalizeApiBase(env.VITE_API_URL || env.VITE_API_BASE_URL || '/api');
}
