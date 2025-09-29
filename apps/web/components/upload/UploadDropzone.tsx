"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  accept: string[]
  maxBytes: number
  onFileAccepted: (file: File) => void
  onError: (message: string) => void
  disabled?: boolean
}

export default function UploadDropzone({
  accept,
  maxBytes,
  onFileAccepted,
  onError,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const file = files[0]

    const isValidType =
      accept.includes(file.type) ||
      (file.name.endsWith(".pdf") && accept.includes("application/pdf")) ||
      (file.name.endsWith(".txt") && accept.includes("text/plain")) ||
      (file.name.endsWith(".md") && accept.includes("text/markdown"))

    if (!isValidType) {
      onError("Invalid file type. Please upload a PDF, TXT, or MD file.")
      return
    }

    if (file.size > maxBytes) {
      onError("File too large. Max size is 100 MB.")
      return
    }

    onFileAccepted(file)
  }

  return (
    <div
      className={cn(
        "w-full max-w-md border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragEnter={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) setDragActive(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (!disabled) handleFiles(e.dataTransfer.files)
      }}
    >
      <p className="mb-4">Drag and drop your file here, or use the button below</p>
      <Button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        Select File
      </Button>
      <input
        type="file"
        accept=".pdf,.txt,.md"
        ref={inputRef}
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
