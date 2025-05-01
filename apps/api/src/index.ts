import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const server = fastify({ logger: true });

// Register plugins
server.register(cors, {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
});

server.register(swagger, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Blinn API',
      description: 'API for Blinn credit card rewards optimization',
      version: '0.1.0',
    },
  },
  exposeRoute: true,
});

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 