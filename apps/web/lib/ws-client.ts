let socket: WebSocket | null = null;
const listeners = new Map<string, Set<(u: any) => void>>();

function connect() {
  if (socket) return socket;
  const url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001";
  socket = new WebSocket(url);

  socket.addEventListener("open", () => {
    console.log("Connected to WS at", url);
    // re-subscribe after reconnect
    for (const jobId of listeners.keys()) {
      socket?.send(JSON.stringify({ type: "subscribe", jobId }));
    }
  });

  socket.addEventListener("message", (event) => {
    try {
      const update = JSON.parse(event.data.toString());
      if (update?.type === "job" && update.jobId) {
        const subs = listeners.get(update.jobId);
        subs?.forEach((fn) => fn(update));
      }
    } catch {
      console.error("Failed to parse WS message:", event.data);
    }
  });

  socket.addEventListener("close", () => {
    console.log("WS connection closed");
    socket = null;
  });

  return socket;
}

export function subscribeToJob(jobId: string, onUpdate: (u: any) => void) {
  connect();
  // store callback
  let set = listeners.get(jobId);
  if (!set) {
    set = new Set();
    listeners.set(jobId, set);
    // send subscribe on first listener for this jobId
    socket?.readyState === 1
      ? socket.send(JSON.stringify({ type: "subscribe", jobId }))
      : socket?.addEventListener(
          "open",
          () => socket?.send(JSON.stringify({ type: "subscribe", jobId })),
          { once: true }
        );
  }
  set.add(onUpdate);

  // return an unsubscribe
  return () => {
    const s = listeners.get(jobId);
    if (!s) return;
    s.delete(onUpdate);
    if (s.size === 0) listeners.delete(jobId);
  };
}
