import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { promises as fs } from "fs"
import path from "path"
import {
  getStorageDir,
  ensureDir,
  uniqueName,
  isAllowedType,
} from "@/lib/storage"
import { enqueueIngestJob } from "@/lib/queue"
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  console.log('session ', session);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get("file") as File | null
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const maxBytes = Number(process.env.MAX_UPLOAD_BYTES ?? 100 * 1024 * 1024)
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "File too large" }, { status: 400 })
  }

  if (!isAllowedType(file)) {
    return NextResponse.json(
      { error: "Invalid file type. Only PDF, TXT, MD allowed." },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const storageDir = getStorageDir()
  await ensureDir(storageDir)

  const unique = uniqueName(file.name)
  const filePath = path.join(storageDir, unique)

  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  const document = await prisma.document.create({
    data: {
      userId: user.id,
      name: file.name,
      storagePath: filePath,
      bytes: file.size,
      status: "pending",
    },
  })

  // enqueue background job
  await enqueueIngestJob({ documentId: document.id, documentName: document.name, userId: user.id })

  return NextResponse.json({ document })
}
