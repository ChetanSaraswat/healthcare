FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Dependencies stage
FROM base AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Development stage (used for local Docker Compose dev workflow)
FROM dependencies AS dev
WORKDIR /app
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 3. Production builder stage
FROM dependencies AS builder
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npm run build

# 4. Production standalone runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000
CMD ["node", "server.js"]
