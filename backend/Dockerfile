ARG NODE_IMAGE=node:20.15.1-alpine3.20

FROM $NODE_IMAGE AS base
WORKDIR /app
RUN apk --no-cache add dumb-init
RUN mkdir -p /app && chown node:node /app

# Dependencies stage
FROM base AS dependencies
WORKDIR /app
COPY --chown=node:node package*.json ./
USER node
RUN npm ci && npm cache clean --force

# Development stage (used by docker compose dev workflow)
FROM dependencies AS dev
WORKDIR /app
COPY --chown=node:node . .
ENV APP_PORT=8080
ENV NODE_ENV=development
EXPOSE $APP_PORT
CMD ["tail", "-f", "/dev/null"]

# Production stage (used by production builds and raw docker run)
FROM base AS production
WORKDIR /app
ENV APP_PORT=8080
ENV NODE_ENV=production
USER node
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node . .
EXPOSE $APP_PORT
CMD ["dumb-init", "node", "index.js"]