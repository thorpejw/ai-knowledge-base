FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm tsx

COPY apps/websocket-server ./apps/websocket-server
WORKDIR /app/apps/websocket-server
RUN pnpm install

CMD ["pnpm", "tsx", "ws-server.ts"]
