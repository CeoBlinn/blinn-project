import { FastifyInstance } from 'fastify';
import { OptimizationService } from '../services/optimization';
import { requireAuth } from '../middleware/auth';
import { SpendingCategory } from '../types/optimization';

const optimizationService = new OptimizationService();

interface OptimizationRequest {
  categories: SpendingCategory[];
}

export async function optimizationRoutes(fastify: FastifyInstance) {
  // Add preHandler hook for authentication
  fastify.addHook('preHandler', requireAuth);

  fastify.post<{ Body: OptimizationRequest }>('/optimize', async (request, reply) => {
    try {
      const userId = request.user.userId; // Get authenticated user's ID
      const { categories } = request.body;

      const result = await optimizationService.optimize(categories);
      
      reply.code(200).send({
        status: 'success',
        data: {
          userId,
          categories,
          result,
        },
      });
    } catch (error) {
      reply.code(400).send({
        status: 'error',
        message: error instanceof Error ? error.message : 'Optimization failed',
      });
    }
  });
} 