FROM node:22-alpine AS base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run prisma:generate



FROM base AS development

CMD ["pnpm", "run", "start:dev"] 



FROM base AS build

RUN pnpm run build



FROM node:22-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json

CMD ["pnpm", "run", "start:prod"]