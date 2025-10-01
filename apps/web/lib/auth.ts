import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { type AuthOptions } from "next-auth"
import { pris } from "@/lib/prisma"

//const prisma = new PrismaClient()

export const authConfig: AuthOptions = {
  debug: true,
  adapter: PrismaAdapter(pris),
  session: { strategy: "jwt" }, //fix prisma client!!
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await pris.user.findUnique({
          where: { email: credentials.email },
        })
        console.log("authorize user:", user);


        // NOTE: dev-only, no hashing yet
        if (user && user.hash === credentials.password) {
          return user
        }

        if (!user) {
          const newUser = await pris.user.create({
            data: {
              email: credentials.email,
              hash: credentials.password,
            },
          });
          return newUser;
        }

        return null
      },
    }),
  ],
}