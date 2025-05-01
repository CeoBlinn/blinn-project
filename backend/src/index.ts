import fastify, { FastifyRequest } from 'fastify';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { AuthService } from './services/auth';

// Load environment variables
dotenv.config();

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}

const server = fastify({
  logger: true
});

// Register JWT plugin
server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-here-please-change-in-production'
});

// Add authentication decorator
server.decorate('authenticate', async (request: FastifyRequest) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw { statusCode: 401, message: 'Unauthorized' };
  }
});

// Register services
const authService = new AuthService(server);

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

// Auth routes
server.post('/auth/register', async (request, reply) => {
  const { email, password, firstName, lastName } = request.body as any;
  try {
    const user = await authService.createUser({
      email,
      password,
      firstName,
      lastName
    });
    return user;
  } catch (error) {
    reply.code(400).send({ error: (error as Error).message });
  }
});

server.post('/auth/login', async (request, reply) => {
  const { email, password } = request.body as any;
  try {
    const result = await authService.login(email, password);
    return result;
  } catch (error) {
    reply.code(401).send({ error: (error as Error).message });
  }
});

// Protected route example
server.get('/protected', {
  onRequest: [server.authenticate],
  handler: async (request) => {
    return { user: request.user };
  }
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 