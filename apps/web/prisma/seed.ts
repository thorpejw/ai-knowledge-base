import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding users...")

  // Wipe existing users (optional, for dev only!)
  await prisma.user.deleteMany()

  await prisma.user.createMany({
    data: [
      {
        email: "alice@example.com",
        hash: "password123", // ⚠️ plain text (dev only)
      },
      {
        email: "bob@example.com",
        hash: "password456",
      },
      {
        email: "charlie@example.com",
        hash: "password789",
      },
    ],
  })

  console.log("✅ Users seeded")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
