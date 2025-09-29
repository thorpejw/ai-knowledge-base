import { createClient } from "redis"

let client: ReturnType<typeof createClient> | null = null

export async function getRedisClient() {
  if (!client) {
    const url = process.env.REDIS_URL
    if (!url) {
      throw new Error("REDIS_URL not set in environment")
    }

    client = createClient({ url })

    client.on("error", (err) => {
      console.error("Redis Client Error", err)
    })

    await client.connect()
    console.log("✅ Connected to Redis:", url)
  }
  return client
}
