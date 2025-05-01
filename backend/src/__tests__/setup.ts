import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import { build } from '../app';

declare global {
  var prisma: PrismaClient;
  var app: FastifyInstance;
}

beforeAll(async () => {
  // Create a new Prisma client for tests
  global.prisma = new PrismaClient();
  
  // Build the Fastify app
  global.app = await build({
    logger: false,
  });
});

afterAll(async () => {
  // Clean up database connections
  await global.prisma.$disconnect();
  
  // Close the Fastify app
  await global.app.close();
}); 