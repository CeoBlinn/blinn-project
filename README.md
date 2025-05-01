# Blinn Credit Card Rewards Optimization

A modern application to help users optimize their credit card rewards based on spending patterns.

## Features

- Credit card rewards optimization
- User authentication and account management
- Email verification
- Password reset functionality
- Modern API documentation interface

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   # Application
   NODE_ENV=development
   APP_URL=http://localhost:3000

   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/blinn?schema=public"

   # Authentication
   JWT_SECRET=your-super-secret-key-change-in-production
   COOKIE_SECRET=your-super-secret-cookie-key-change-in-production

   # Email Configuration
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-ethereal-email-user
   SMTP_PASS=your-ethereal-email-password
   EMAIL_FROM="Blinn App <noreply@blinn.app>"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register
- **POST** `/api/v1/auth/register`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

#### Login
- **POST** `/api/v1/auth/login`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

#### Verify Email
- **GET** `/api/v1/auth/verify/:token`

#### Reset Password
- **POST** `/api/v1/auth/forgot-password`
- Body:
  ```json
  {
    "email": "user@example.com"
  }
  ```

- **POST** `/api/v1/auth/reset-password`
- Body:
  ```json
  {
    "resetToken": "token-from-email",
    "newPassword": "newSecurePassword"
  }
  ```

### Protected Endpoints
Protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Development

### Database Migrations
To create a new migration after schema changes:
```bash
npx prisma migrate dev --name <migration-name>
```

### Email Testing
For development, we use Ethereal Email for testing email functionality. Create a test account at https://ethereal.email and update the SMTP configuration in your `.env` file.

## Security Considerations

1. Always use HTTPS in production
2. Update JWT_SECRET and COOKIE_SECRET with strong, unique values
3. Enable CORS only for trusted domains
4. Use secure password hashing (bcrypt)
5. Implement rate limiting for authentication endpoints
6. Keep dependencies updated

## License

MIT 