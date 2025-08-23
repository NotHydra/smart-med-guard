FROM node:22-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build



FROM base AS development

CMD ["pnpm", "run", "dev"]



FROM node:22-alpine AS production

WORKDIR /app

COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/public ./public

RUN npm install -g pnpm

ENTRYPOINT []

CMD ["pnpm", "run", "start"]