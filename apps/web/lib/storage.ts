import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"

export function getStorageDir(): string {
  const dir = process.env.FILE_STORAGE_DIR
  if (!dir) {
    throw new Error("FILE_STORAGE_DIR not set")
  }
  return dir
}

export async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

export function uniqueName(originalName: string): string {
  const ext = path.extname(originalName)
  const base = path.basename(originalName, ext)
  return `${base}-${randomUUID()}${ext}`
}

export function isAllowedType(file: File): boolean {
  const allowed = ["application/pdf", "text/plain", "text/markdown"]
  if (allowed.includes(file.type)) return true

  const name = file.name.toLowerCase()
  return (
    name.endsWith(".pdf") ||
    name.endsWith(".txt") ||
    name.endsWith(".md")
  )
}
