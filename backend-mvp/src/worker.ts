import { authenticateRequest } from './auth';
import { Env, errorResponse, HttpError, json, RequestContext } from './db';
import { assertAuthRateLimit } from './rateLimit';
import { handleAuth } from './routes/auth';
import { handleCafe } from './routes/cafe';
import { handleConversations } from './routes/conversations';
import { handleHeroImages } from './routes/heroImages';
import { handleMatches } from './routes/matches';
import { handleProfile } from './routes/profile';
import { handleRequests } from './routes/requests';
import { handleForgotPassword } from './routes/forgotPassword';
import { handleResetPassword } from './routes/resetPassword';

const RELEASE_ID = 'halal-release-google-play-finalization-ab-2026-08-15';
const RELEASE_COMMIT = '06ae57e+A+B';

function getAllowedOrigin(request: Request, env: Env): string {
  const origin = request.headers.get('Origin') || '';
  
  // Hardcoded allowed origins for immediate fix
  const configured = [
    'https://app.kaniq.org',
    'https://zawaj-app.pages.dev',
    'https://main.zawaj-app.pages.dev',
    'https://localhost'
  ];

  if (configured.includes(origin)) return origin;
  return configured[0] || origin || '*';
}

function withCors(request: Request, env: Env, response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', getAllowedOrigin(request, env));
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  headers.set('Vary', 'Origin');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  headers.set('X-Frame-Options', 'DENY');
  const path = new URL(request.url).pathname.toLowerCase();
  if (path.includes('/auth/')) {
    headers.set('Cache-Control', 'no-store');
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function route(ctx: RequestContext): Promise<Response> {
const publicRoute = await handleAuth(ctx) || await handleHeroImages(ctx) || await handleForgotPassword(ctx) || await handleResetPassword(ctx);  if (publicRoute) return publicRoute;

  if (ctx.url.pathname === '/' || ctx.url.pathname === '/api') {
    return json({ ok: true, service: 'HALAL Worker API' });
  }

  if (ctx.url.pathname === '/api/version' || ctx.url.pathname === '/version') {
    return json({
      ok: true,
      service: 'HALAL Worker API',
      version: RELEASE_ID,
      commit: RELEASE_COMMIT,
      environment: 'production',
      diagnostic: false,
    });
  }

  if (!ctx.user) throw new HttpError(401, 'Authentication required.');

  const routeHandlers = [
    handleProfile,
    handleMatches,
    handleCafe,
    handleRequests,
    handleConversations,
    handleHeroImages,
  ];

  for (const handler of routeHandlers) {
    const response = await handler(ctx);
    if (response) return response;
  }

  throw new HttpError(404, 'Route not found.');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return withCors(request, env, new Response(null, { status: 204 }));
    }

    try {
      const url = new URL(request.url);
      const limited = await assertAuthRateLimit(env, request, url);
      if (limited) return withCors(request, env, limited);
      const ctx: RequestContext = {
        env,
        request,
        url,
        user: await authenticateRequest(env, request),
      };
      return withCors(request, env, await route(ctx));
    } catch (error) {
      return withCors(request, env, errorResponse(error));
    }
  },
};



