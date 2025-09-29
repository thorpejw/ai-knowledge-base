import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Signed in as {session.user.email}</p>
    </main>
  )
}
