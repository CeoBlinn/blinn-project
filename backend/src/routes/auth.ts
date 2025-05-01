import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth';

interface RegisterBody {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface ResetPasswordBody {
  resetToken: string;
  newPassword: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);

  // Register new user
  fastify.post<{ Body: RegisterBody }>('/auth/register', async (request, reply) => {
    try {
      const user = await authService.createUser(request.body);
      reply.code(201).send({
        status: 'success',
        data: user,
        message: 'Please check your email to verify your account',
      });
    } catch (error) {
      reply.code(400).send({
        status: 'error',
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  });

  // Verify email
  fastify.get('/auth/verify/:token', async (request, reply) => {
    try {
      const { token } = request.params as { token: string };
      const user = await authService.verifyUser(token);
      reply.code(200).send({
        status: 'success',
        data: user,
        message: 'Email verified successfully',
      });
    } catch (error) {
      reply.code(400).send({
        status: 'error',
        message: 'Invalid or expired verification token',
      });
    }
  });

  // Login
  fastify.post<{ Body: LoginBody }>('/auth/login', async (request, reply) => {
    try {
      const { user, token } = await authService.login(
        request.body.email,
        request.body.password
      );
      
      // Set JWT token in cookie
      reply.setCookie('token', token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      });

      reply.code(200).send({
        status: 'success',
        data: { user, token },
      });
    } catch (error) {
      reply.code(401).send({
        status: 'error',
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  });

  // Request password reset
  fastify.post('/auth/forgot-password', async (request, reply) => {
    try {
      const { email } = request.body as { email: string };
      await authService.initiatePasswordReset(email);
      reply.code(200).send({
        status: 'success',
        message: 'If an account exists with this email, you will receive a password reset link',
      });
    } catch (error) {
      reply.code(400).send({
        status: 'error',
        message: 'Failed to initiate password reset',
      });
    }
  });

  // Reset password
  fastify.post<{ Body: ResetPasswordBody }>('/auth/reset-password', async (request, reply) => {
    try {
      const user = await authService.resetPassword(
        request.body.resetToken,
        request.body.newPassword
      );
      reply.code(200).send({
        status: 'success',
        data: user,
        message: 'Password reset successfully',
      });
    } catch (error) {
      reply.code(400).send({
        status: 'error',
        message: 'Invalid or expired reset token',
      });
    }
  });

  // Logout
  fastify.post('/auth/logout', async (request, reply) => {
    reply.clearCookie('token', { path: '/' });
    reply.code(200).send({
      status: 'success',
      message: 'Logged out successfully',
    });
  });
} 