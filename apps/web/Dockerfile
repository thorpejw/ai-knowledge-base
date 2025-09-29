FROM node:20-alpine

WORKDIR /app

# Copy root manifests
COPY pnpm-lock.yaml package.json ./

# Ensure the apps/web dir exists
RUN mkdir -p apps/web

# Copy only web’s manifest first
COPY apps/web/package.json apps/web/node_modules/ apps/web/

# Install pnpm + dependencies
RUN npm install -g pnpm \
  && pnpm install

# Now copy the full source
COPY apps/web apps/web

WORKDIR /app/apps/web
RUN pnpm ls next
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
