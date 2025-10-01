import { getRedisClient } from "./redis"

export type IngestJob = {
  documentId: string
  documentName: string
  userId: string
}

export async function enqueueIngestJob(job: IngestJob) {
  const client = await getRedisClient()
  const payload = JSON.stringify(job)
  const len = await client.rPush("jobs:ingest:file", payload)

  console.log(
    `📥 Enqueued ingest:file job (doc ${job.documentId}, user ${job.userId}). Queue length = ${len}`
  )

  return len
}
