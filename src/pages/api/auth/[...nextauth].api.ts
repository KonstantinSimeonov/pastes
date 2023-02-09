import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { withClient } from "@/prisma/with-client"

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],

  adapter: withClient(PrismaAdapter),

  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          id: user?.id,
          ...session.user
        }
      }
    }
  }
}

export default NextAuth(authOptions)
