import { redirect } from "next/navigation"
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export default async function DashboardPage() {
  console.log('config is ' , authConfig);
  const session = await getServerSession(authConfig);
  console.log("sessioon", session);
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
