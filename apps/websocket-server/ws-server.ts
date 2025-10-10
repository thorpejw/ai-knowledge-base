/**
 * ws-server.ts
 * Purpose: Bridge Redis pub/sub (events:jobs) → WebSocket clients.
 * Clients send: { type: "subscribe", jobId: string }
 * Server forwards only matching job updates to those subscribers.
 */

import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "redis";

type JobEvent = {
  type: "job";
  jobId: string;          // documentId as jobId in our worker
  status:
    | "queued"
    | "parsing"
    | "chunking"
    | "embedding"
    | "indexing"
    | "ready"
    | "error";
  progress: number;       // 0..100
  message?: string;
  documentId?: string;
  userId?: string;
};

const PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 3001;
const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) throw new Error("REDIS_URL not set");

// Track who subscribed to which jobId
const subscribers = new Map<string, Set<WebSocket>>();

function addSubscriber(jobId: string, ws: WebSocket) {
  let set = subscribers.get(jobId);
  if (!set) {
    set = new Set();
    subscribers.set(jobId, set);
  }
  set.add(ws);
}

function removeSubscriber(ws: WebSocket) {
  for (const set of subscribers.values()) set.delete(ws);
}

function broadcastTo(jobId: string, payload: JobEvent) {
  const set = subscribers.get(jobId);
  if (!set) return;
  const data = JSON.stringify(payload);
  for (const ws of set) {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  }
}

const wss = new WebSocketServer({ port: PORT });
wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      if (data?.type === "subscribe" && typeof data.jobId === "string") {
        console.log(`Client subscribed to job ${data.jobId}`);
        addSubscriber(data.jobId, ws);
        // Optional: send an immediate ack
        ws.send(JSON.stringify({ type: "subscribed", jobId: data.jobId }));
      }
    } catch (err) {
      console.error("Invalid WS message:", err);
    }
  });

  ws.on("close", () => removeSubscriber(ws));
});

console.log(`✅ WS server at ws://0.0.0.0:${PORT}`);

// --- Redis pub/sub: forward worker events to WS clients ---
(async () => {
  const sub = createClient({ url: REDIS_URL });
  sub.on("error", (e) => console.error("Redis subscriber error:", e));
  await sub.connect();
  await sub.subscribe("events:jobs", (message) => {
    try {
      const evt: JobEvent = JSON.parse(message);
      if (evt?.type === "job" && evt.jobId) {
        broadcastTo(evt.jobId, evt);
      }
    } catch (e) {
      console.error("Bad event payload on events:jobs:", e, message);
    }
  });
  console.log("📡 Subscribed to Redis channel: events:jobs");
})();
