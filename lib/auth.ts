import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { executeQuery } from "@/lib/neon-client"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const users = await executeQuery("SELECT * FROM users WHERE email = $1", [credentials.email])

          if (users.length === 0) {
            return null
          }

          const user = users[0]

          // Verify password
          const passwordMatch = await compare(credentials.password, user.password_hash)
          if (!passwordMatch) {
            return null
          }

          // Update last login
          await executeQuery("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id])

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar_url,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
