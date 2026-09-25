ARG NODE_IMAGE=node:20.15.1-alpine3.20

FROM $NODE_IMAGE AS base
WORKDIR /app
RUN apk --no-cache add dumb-init
RUN mkdir -p /app && chown node:node /app
USER node

FROM base AS build
COPY --chown=node:node ./package*.json ./
RUN npm ci && npm cache clean --force
COPY --chown=node:node . .

FROM base AS production
WORKDIR /app
ENV APP_PORT=8080
ENV NODE_ENV=production
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node . .
EXPOSE $APP_PORT
CMD ["dumb-init", "node", "index.js"]
