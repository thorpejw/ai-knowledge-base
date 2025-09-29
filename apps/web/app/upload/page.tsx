"use client"

import { useState } from "react"
import UploadDropzone from "@/components/upload/UploadDropzone"
import { Progress } from "@/components/ui/progress"
import { subscribeToJob } from "@/lib/ws-client"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  async function handleUpload(f: File) {
    setError(null)
    setFile(f)
    setProgress(0)

    const fd = new FormData()
    fd.append("file", f)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      })

      if (!res.ok) {
        const msg = await res.text()
        setError(msg || "Upload failed")
        setFile(null)
        return
      }

      const json = await res.json()
      const doc = json.document

      // Subscribe to WS updates for this job
      subscribeToJob(doc.id, (update) => {
        setProgress(update.progress)
      })
    } catch (e: any) {
      setError(e?.message ?? "Network error")
      setFile(null)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Upload a Document</h1>

      <UploadDropzone
        accept={["application/pdf", "text/plain", "text/markdown"]}
        maxBytes={100 * 1024 * 1024}
        onFileAccepted={handleUpload}
        onError={(msg) => {
          setFile(null)
          setError(msg)
          setProgress(0)
        }}
        disabled={progress > 0 && progress < 100}
      />

      {file && (
        <div className="mt-6 w-full max-w-md">
          <p className="font-medium">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
          <Progress value={progress} className="mt-2" />
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-600 font-medium">{error}</p>
      )}
    </main>
  )
}
