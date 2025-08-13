FROM node:22-alpine as base

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run prisma:generate



FROM base AS development

CMD ["pnpm", "run", "start:dev"]
