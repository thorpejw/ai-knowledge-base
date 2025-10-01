FROM node:20-alpine
WORKDIR /app

# Copy root manifests for workspace install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy app-specific manifest (so layer cache busts only when web deps change)
COPY apps/web/package.json ./apps/web/package.json

# Install all workspace deps
RUN npm i -g pnpm && pnpm install --frozen-lockfile


# Copy the rest of the repo
COPY . .

RUN pnpm --filter web exec prisma generate

# Build the web app
RUN pnpm --filter web build

EXPOSE 3000
CMD ["pnpm", "--filter", "web", "start"]
