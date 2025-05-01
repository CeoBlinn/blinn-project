import { FastifyRequest, FastifyReply } from 'fastify';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({
      status: 'error',
      message: 'Authentication required',
    });
  }
}

// Type augmentation for Fastify JWT
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { userId: string; email: string }
    user: {
      userId: string;
      email: string;
    }
  }
} 