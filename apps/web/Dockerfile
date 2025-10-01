FROM node:20-alpine
WORKDIR /app

# Copy root manifests for workspace install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/ ./apps/web/
COPY apps/web/node_modules ./apps/web/node_modules

WORKDIR /app/apps/web
RUN npm i -g pnpm && pnpm install
RUN npx prisma generate

# Build the web apps
RUN pnpm build
CMD ["pnpm", "run", "dev"]
