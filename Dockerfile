# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy rest of the application
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

# Copy built application from builder
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Expose port
EXPOSE 7000

# Start the application
CMD ["node", ".output/server/index.mjs"] 