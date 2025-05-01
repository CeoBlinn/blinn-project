# Use Node.js LTS version
FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Create app directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and build TypeScript code
RUN npm run prisma:generate && \
    npm run build && \
    ls -la dist/

# Expose port
EXPOSE 3000

# Start the application with proper error handling
CMD ["sh", "-c", "npm run prisma:generate && npm start"] 