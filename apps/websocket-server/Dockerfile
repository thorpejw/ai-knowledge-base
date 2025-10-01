FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm tsx

COPY apps/websocket-server ./apps/websocket-server
RUN pnpm install --frozen-lockfile --prod

COPY /apps/websocket-server/ws-server.ts ./apps/websocket-server/ws-server.ts

WORKDIR /app/apps/websocket-server

CMD ["pnpm", "tsx", "ws-server.ts"]
