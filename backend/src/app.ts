import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { optimizationRoutes } from './routes/optimization';
import { authRoutes } from './routes/auth';
import { legalRoutes } from './routes/legal';

export async function build(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
  const app = fastify(opts);

  // Register plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    sign: {
      expiresIn: '7d',
    },
  });

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'your-super-secret-cookie-key-change-in-production',
    parseOptions: {},
  });

  // Register routes
  await app.register(authRoutes, { prefix: '/api/v1' });
  await app.register(optimizationRoutes, { prefix: '/api/v1' });
  await app.register(legalRoutes, { prefix: '/api/v1' });

  // Root endpoint for documentation
  app.get('/', async (request, reply) => {
    reply.type('text/html; charset=utf-8');
    return `<!DOCTYPE html>
      <html>
        <!-- Your existing documentation HTML -->
      </html>`;
  });

  // Health check endpoint
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  return app;
} 