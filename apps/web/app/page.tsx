"use client"

import Link from "next/link"
import { useEffect } from "react"
import { signOut } from "next-auth/react"

export default function Home() {
  useEffect(() => {
    console.log("✅ Home page loaded")
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-green-600">
        AI Knowledge Base
      </h1>
      <p className="mt-4 text-gray-600">Next.js + FastAPI + Redis + Postgres</p>

      <div className="mt-6">
        <Link href="/upload" className="underline text-blue-600">
          Go to Uploads
        </Link>
        <button onClick={() => signOut()}>
      Sign out
    </button>
      </div>
      
    </main>
  )
}
