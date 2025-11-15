
ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS builder
WORKDIR /app

RUN corepack enable

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static


EXPOSE 3000
# Start Next.js production server
CMD ["node", "server.js"]