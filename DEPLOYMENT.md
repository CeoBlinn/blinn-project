# Production Deployment Guide

This guide outlines the steps to deploy the Blinn application to a production environment.

## Prerequisites

- Docker and Docker Compose
- Domain name with SSL certificate
- Production PostgreSQL database
- SMTP server for transactional emails
- Node.js 20.x LTS (for local builds)

## Environment Setup

1. Create a production `.env` file:
   ```env
   # Application
   NODE_ENV=production
   APP_URL=https://your-domain.com

   # Database
   DATABASE_URL=postgresql://user:password@your-db-host:5432/blinn

   # Authentication
   JWT_SECRET=your-secure-random-string
   COOKIE_SECRET=another-secure-random-string

   # Email Configuration
   SMTP_HOST=your-smtp-host
   SMTP_PORT=587
   SMTP_SECURE=true
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password
   EMAIL_FROM="Blinn App <noreply@your-domain.com>"
   ```

## Database Migration

1. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

2. Verify database connection:
   ```bash
   npx prisma studio
   ```

## SSL Configuration

1. Obtain SSL certificate (e.g., using Let's Encrypt):
   ```bash
   certbot certonly --webroot -w /var/www/html -d your-domain.com
   ```

2. Configure SSL in your reverse proxy (e.g., Nginx):
   ```nginx
   server {
     listen 443 ssl;
     server_name your-domain.com;

     ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
     ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

## Docker Deployment

1. Build the production image:
   ```bash
   docker build -t blinn-api:production .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name blinn-api \
     --env-file .env \
     -p 3000:3000 \
     blinn-api:production
   ```

## Monitoring and Logging

1. Set up application monitoring:
   - Install and configure PM2 or similar process manager
   - Set up log rotation
   - Configure error tracking (e.g., Sentry)

2. Configure system monitoring:
   - Set up server monitoring (e.g., Datadog, New Relic)
   - Configure disk space alerts
   - Monitor database performance

## Security Measures

1. Enable security headers:
   - HTTPS only
   - CORS restrictions
   - Content Security Policy
   - XSS Protection
   - Rate limiting

2. Regular maintenance:
   - Keep dependencies updated
   - Apply security patches
   - Perform regular backups
   - Monitor for suspicious activity

## Scaling Considerations

1. Horizontal scaling:
   - Use load balancer for multiple API instances
   - Configure session persistence
   - Set up Redis for caching (if needed)

2. Database optimization:
   - Configure connection pooling
   - Set up read replicas
   - Implement query caching
   - Regular performance tuning

## Backup Strategy

1. Database backups:
   ```bash
   # Daily backup script
   pg_dump -U postgres blinn > /backups/blinn_$(date +%Y%m%d).sql
   ```

2. Application data:
   - Regular backups of user data
   - Automated backup verification
   - Off-site backup storage

## Troubleshooting

Common issues and solutions:

1. Database connection issues:
   - Check connection string
   - Verify network connectivity
   - Check database logs

2. Email delivery problems:
   - Verify SMTP settings
   - Check email logs
   - Test email configuration

3. Performance issues:
   - Monitor server resources
   - Check database query performance
   - Review application logs

## Rollback Procedure

In case of deployment issues:

1. Stop the new deployment:
   ```bash
   docker stop blinn-api
   ```

2. Start the previous version:
   ```bash
   docker run -d \
     --name blinn-api \
     --env-file .env \
     -p 3000:3000 \
     blinn-api:previous
   ```

3. Verify the rollback:
   - Check application logs
   - Test critical functionality
   - Monitor error rates

## Contact

For deployment support:
- Email: devops@blinn.app
- Emergency: +1 (XXX) XXX-XXXX 