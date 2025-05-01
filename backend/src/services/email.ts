import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // For development, use ethereal.email
    // For production, use your actual SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(to: string, verificationToken: string) {
    const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/verify/${verificationToken}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Blinn App" <noreply@blinn.app>',
      to,
      subject: 'Verify your email address',
      html: `
        <h1>Welcome to Blinn!</h1>
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Blinn App" <noreply@blinn.app>',
      to,
      subject: 'Reset your password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }
} 