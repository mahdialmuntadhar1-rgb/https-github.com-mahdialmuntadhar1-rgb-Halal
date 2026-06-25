import { authenticateRequest } from './auth';
import { Env, errorResponse, HttpError, json, RequestContext } from './db';
import { handleAuth } from './routes/auth';
import { handleConversations } from './routes/conversations';
import { handleHeroImages } from './routes/heroImages';
import { handleMatches } from './routes/matches';
import { handleProfile } from './routes/profile';
import { handleRequests } from './routes/requests';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) headers.set(key, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function route(ctx: RequestContext): Promise<Response> {
  const publicRoute = await handleAuth(ctx) || await handleHeroImages(ctx);
  if (publicRoute) return publicRoute;

  if (!ctx.url.pathname.startsWith('/api/')) {
    return json({ ok: true, service: 'HALAL Worker API' });
  }

  if (!ctx.user) throw new HttpError(401, 'Authentication required.');

  const routeHandlers = [
    handleProfile,
    handleMatches,
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
      return withCors(new Response(null, { status: 204 }));
    }

    try {
      const url = new URL(request.url);
      const ctx: RequestContext = {
        env,
        request,
        url,
        user: await authenticateRequest(env, request),
      };
      return withCors(await route(ctx));
    } catch (error) {
      return withCors(errorResponse(error));
    }
  },
};
