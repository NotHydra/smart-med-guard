FROM node:22-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run prisma:generate
RUN pnpm run build



FROM base AS development

CMD ["pnpm", "run", "start:dev"]



FROM node:22-alpine AS production

WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

CMD ["pnpm", "run", "start:prod"]