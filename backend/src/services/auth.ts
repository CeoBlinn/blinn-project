import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { FastifyInstance } from 'fastify';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async createUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const passwordHash = await this.hashPassword(userData.password);
    const verifyToken = this.generateToken();

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        verifyToken,
      },
    });

    // Remove sensitive data
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async verifyUser(verifyToken: string) {
    const user = await prisma.user.update({
      where: { verifyToken },
      data: {
        isVerified: true,
        verifyToken: null,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email first');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT token
    const token = this.fastify.jwt.sign(
      { 
        userId: user.id,
        email: user.email
      },
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async initiatePasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user doesn't exist for security
      return true;
    }

    const resetToken = this.generateToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken },
    });

    return resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const passwordHash = await this.hashPassword(newPassword);
    
    const user = await prisma.user.update({
      where: { resetToken },
      data: {
        passwordHash,
        resetToken: null,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
} 