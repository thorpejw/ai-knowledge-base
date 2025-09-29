FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm tsx

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY /apps/websocket-server/ws-server.ts ./ws-server.ts

CMD ["pnpm", "tsx", "ws-server.ts"]
