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
        <head>
          <title>Blinn Project API Documentation</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            h2 { color: #666; }
            .endpoint { margin-bottom: 20px; }
            .path { color: #0066cc; }
            .method { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Blinn Project API</h1>
          <p>Welcome to the Blinn Project API. Below are the available endpoints:</p>
          
          <h2>Authentication</h2>
          <div class="endpoint">
            <p><span class="method">POST</span> <span class="path">/api/v1/auth/register</span> - Register a new user</p>
            <p><span class="method">POST</span> <span class="path">/api/v1/auth/login</span> - Login user</p>
            <p><span class="method">GET</span> <span class="path">/api/v1/auth/verify/:token</span> - Verify email</p>
          </div>

          <h2>Credit Card Optimization</h2>
          <div class="endpoint">
            <p><span class="method">GET</span> <span class="path">/api/v1/optimization/cards</span> - List all credit cards</p>
            <p><span class="method">GET</span> <span class="path">/api/v1/optimization/rewards</span> - Get reward categories</p>
          </div>

          <h2>System</h2>
          <div class="endpoint">
            <p><span class="method">GET</span> <span class="path">/health</span> - Health check endpoint</p>
          </div>
        </body>
      </html>`;
  });

  // Health check endpoint
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  return app;
} 