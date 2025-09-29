let socket: WebSocket | null = null

export function connectToWS() {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001"
    socket = new WebSocket(url)

    socket.addEventListener("open", () => {
      console.log("Connected to WS at", url)
    })

    socket.addEventListener("close", () => {
      console.log("WS connection closed")
      socket = null
    })
  }
  return socket
}

export function subscribeToJob(
  jobId: string,
  onUpdate: (update: any) => void
) {
  const ws = connectToWS()

  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ type: "subscribe", jobId }))
  })

  ws.addEventListener("message", (event) => {
    try {
      const update = JSON.parse(event.data.toString())
      if (update.type === "job" && update.jobId === jobId) {
        onUpdate(update)
      }
    } catch (err) {
      console.error("Failed to parse WS message:", event.data)
    }
  })
}
