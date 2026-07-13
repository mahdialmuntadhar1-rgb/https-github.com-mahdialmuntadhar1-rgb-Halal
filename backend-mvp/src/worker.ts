import { authenticateRequest } from './auth';
import { Env, errorResponse, HttpError, json, RequestContext } from './db';
import { handleAuth } from './routes/auth';
import { handleCafe } from './routes/cafe';
import { handleConversations } from './routes/conversations';
import { handleHeroImages } from './routes/heroImages';
import { handleMatches } from './routes/matches';
import { handleProfile } from './routes/profile';
import { handleRequests } from './routes/requests';
import { handleForgotPassword } from './routes/forgotPassword';
import { handleResetPassword } from './routes/resetPassword';

function getAllowedOrigin(request: Request, env: Env): string {
  const origin = request.headers.get('Origin') || '';
  const configured = String(env.CORS_ORIGIN || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (configured.includes(origin)) return origin;
  return configured[0] || origin || '*';
}

function withCors(request: Request, env: Env, response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', getAllowedOrigin(request, env));
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  headers.set('Vary', 'Origin');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function route(ctx: RequestContext): Promise<Response> {
const publicRoute = await handleAuth(ctx) || await handleHeroImages(ctx) || await handleForgotPassword(ctx) || await handleResetPassword(ctx);  if (publicRoute) return publicRoute;

  if (ctx.url.pathname === '/' || ctx.url.pathname === '/api') {
    return json({ ok: true, service: 'HALAL Worker API' });
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



