import bcrypt from 'bcryptjs';
import { Env, getUserById, HttpError, AuthUser } from './db';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function getJwtSecret(env: Env): string {
  if (!env.JWT_SECRET) {
    throw new HttpError(500, 'JWT_SECRET is not configured.');
  }
  return env.JWT_SECRET;
}

/**
 * PBKDF2-SHA256 iteration count for newly written hashes.
 * Cloudflare Workers WebCrypto rejects counts above 100_000
 * (NotSupportedError: "iteration counts above 100000 are not supported").
 */
const PBKDF2_ITERATIONS = 100_000;

export function isBcryptHash(stored: string): boolean {
  return stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$');
}

export function isPBKDF2Hash(stored: string): boolean {
  return stored.startsWith('pbkdf2_sha256$');
}

/** True when the stored hash should be upgraded to the current PBKDF2 writer format. */
export function needsRehash(stored: string): boolean {
  return isBcryptHash(stored);
}

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 10) throw new HttpError(400, 'Password must be at least 10 characters.');

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  );
  const derived = new Uint8Array(bits);
  return `pbkdf2_sha256$${PBKDF2_ITERATIONS}$${base64UrlEncode(salt)}$${base64UrlEncode(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Legacy production hashes (bcryptjs cost 12). Kept until all users migrate via login/reset.
  if (isBcryptHash(stored)) {
    return bcrypt.compare(password, stored);
  }

  if (!isPBKDF2Hash(stored)) return false;

  const [algorithm, iterationsRaw, saltRaw, hashRaw] = stored.split('$');
  if (algorithm !== 'pbkdf2_sha256' || !iterationsRaw || !saltRaw || !hashRaw) return false;

  const iterations = Number.parseInt(iterationsRaw, 10);
  if (!Number.isFinite(iterations) || iterations < 1) return false;

  const salt = base64UrlDecode(saltRaw);
  const expected = base64UrlDecode(hashRaw);
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
  const actual = new Uint8Array(bits);

  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let index = 0; index < actual.length; index += 1) diff |= actual[index] ^ expected[index];
  return diff === 0;
}

export async function signToken(env: Env, user: AuthUser): Promise<string> {
  const header = base64UrlEncode(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(encoder.encode(JSON.stringify({ sub: user.id, iat: now, exp: now + 60 * 60 * 24 * 7 })));
  const key = await hmacKey(getJwtSecret(env));
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${payload}`));
  return `${header}.${payload}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function authenticateRequest(env: Env, request: Request): Promise<AuthUser | undefined> {
  const auth = request.headers.get('Authorization') || '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return undefined;

  const token = match[1];
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) throw new HttpError(401, 'Invalid token.');

  const key = await hmacKey(getJwtSecret(env));
  const valid = await crypto.subtle.verify('HMAC', key, base64UrlDecode(signature), encoder.encode(`${header}.${payload}`));
  if (!valid) throw new HttpError(401, 'Invalid token.');

  const claims = JSON.parse(decoder.decode(base64UrlDecode(payload))) as { sub?: string; exp?: number };
  if (!claims.sub || !claims.exp || claims.exp < Math.floor(Date.now() / 1000)) {
    throw new HttpError(401, 'Token expired.');
  }

  const user = await getUserById(env, claims.sub);
  if (!user) throw new HttpError(401, 'User not found.');
  return user;
}

