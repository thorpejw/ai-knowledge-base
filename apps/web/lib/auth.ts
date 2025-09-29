import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GitHub from "@auth/core/providers/github"
import Credentials from "@auth/core/providers/credentials"
import NextAuth, { type AuthOptions } from "next-auth"

const prisma = new PrismaClient()

export const authConfig: AuthOptions = {
  //adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    // GitHub OAuth
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    // Credentials (dev-only)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        console.log('hit');
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // NOTE: dev-only, no hashing yet
        if (user && user.hash === credentials.password) {
          return user
        }

        if (!user) {
          return prisma.user.create({
            data: {
              email: credentials.email,
              hash: credentials.password,
            },
          })
        }

        return null
      },
    }),
  ],
}

export const { auth } = NextAuth(authConfig)
