FROM node:22-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .



FROM base AS build

ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}

ARG NEXT_PUBLIC_SERVER_WEBSOCKET_URL
ENV NEXT_PUBLIC_SERVER_WEBSOCKET_URL=${NEXT_PUBLIC_SERVER_WEBSOCKET_URL}

ARG NEXT_PUBLIC_SERVER_API_KEY
ENV NEXT_PUBLIC_SERVER_API_KEY=${NEXT_PUBLIC_SERVER_API_KEY}

RUN pnpm run build



FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

RUN npm install -g pnpm

CMD ["pnpm", "run", "start"]