# Use official Bun image
FROM oven/bun:1 as base

WORKDIR /app

# Copy package files first (for caching installs)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose app port
EXPOSE 3000

# Run server
CMD ["bun", "main.ts"]