import { FastifyInstance } from 'fastify';
import { build } from '../app';
import { PrismaClient } from '@prisma/client';

describe('Optimization Routes', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  let authToken: string;

  beforeAll(async () => {
    app = await build();
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean up the database
    await prisma.user.deleteMany();
    await prisma.card.deleteMany();
    await prisma.cardRewardRule.deleteMany();

    // Create a test user and get auth token
    const registerResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'test@example.com',
        password: 'password123',
      },
    });

    const { token } = JSON.parse(loginResponse.payload).data;
    authToken = token;

    // Seed some test credit cards
    await prisma.card.create({
      data: {
        name: 'Test Card 1',
        issuer: 'Test Bank',
        userId: JSON.parse(registerResponse.payload).data.id,
        rewards: {
          create: [
            {
              tags: ['dining'],
              multiplier: 3.0,
            },
            {
              tags: ['travel'],
              multiplier: 2.0,
            },
          ],
        },
      },
    });
  });

  describe('POST /api/v1/optimize', () => {
    it('should require authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/optimize',
        payload: {
          categories: [
            {
              name: 'Dining',
              amount: 500,
              frequency: 'monthly',
            },
          ],
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should optimize rewards for authenticated user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/optimize',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        payload: {
          categories: [
            {
              name: 'Dining',
              amount: 500,
              frequency: 'monthly',
            },
            {
              name: 'Travel',
              amount: 1000,
              frequency: 'monthly',
            },
          ],
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('success');
      expect(body.data.userId).toBeDefined();
      expect(body.data.categories).toHaveLength(2);
      expect(body.data.result).toBeDefined();
    });

    it('should validate input categories', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/optimize',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        payload: {
          categories: [
            {
              name: 'Dining',
              amount: -500, // Invalid negative amount
              frequency: 'monthly',
            },
          ],
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('error');
    });

    it('should handle empty category list', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/optimize',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        payload: {
          categories: [],
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.status).toBe('error');
    });
  });
}); 