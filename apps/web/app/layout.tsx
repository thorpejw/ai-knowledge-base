import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Knowledge Base",
  description: "Next.js + FastAPI + Redis + Postgres knowledge base",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
