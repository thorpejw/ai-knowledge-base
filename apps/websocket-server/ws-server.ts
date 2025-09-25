import { WebSocketServer, WebSocket } from "ws"

const PORT = process.env.WS_PORT ? Number(process.env.WS_PORT) : 3001
const wss = new WebSocketServer({ port: PORT })

function publishJobStatus(ws: WebSocket, jobId: string) {
  const updates = [
    { type: "job", jobId, status: "queued", progress: 0 },
    { type: "job", jobId, status: "processing", progress: 50 },
    { type: "job", jobId, status: "done", progress: 100 },
  ]

  updates.forEach((update, idx) => {
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(update))
      }
    }, idx * 1500) // 0s, 1.5s, 3s
  })
}

function handleClientMessage(ws: WebSocket, message: string) {
  try {
    const data = JSON.parse(message)
    if (data.type === "subscribe" && data.jobId) {
      console.log(`Client subscribed to job ${data.jobId}`)
      publishJobStatus(ws, data.jobId)
    } else {
      console.log("Unknown message:", data)
    }
  } catch (err) {
    console.error("Invalid message from client:", message)
  }
}

wss.on("connection", (ws) => {
  console.log("WS: client connected")
  ws.on("message", (msg) => {
    handleClientMessage(ws, msg.toString())
  })
})

console.log(`✅ WebSocket server running at ws://0.0.0.0:${PORT}`)
