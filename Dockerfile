# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and configs
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build application
RUN npm run build

# Verify build output - main.js should be at dist/main.js
RUN echo "=== Checking build output ===" && \
    ls -la dist/ && \
    test -f dist/main.js && echo "dist/main.js found" || \
    (echo "dist/main.js not found!" && ls -la dist/ && exit 1)

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Verify
RUN ls -la dist/ && test -f dist/main.js

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]