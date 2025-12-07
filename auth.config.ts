import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnManager = nextUrl.pathname.startsWith('/manager')
      const isOnGirl = nextUrl.pathname.startsWith('/girl')

      if (isOnAdmin || isOnManager || isOnGirl) {
        if (!isLoggedIn) return false

        const userRole = auth.user?.role as string

        if (isOnAdmin && userRole !== 'admin') return false
        if (isOnManager && !['admin', 'manager'].includes(userRole)) return false
        if (isOnGirl && userRole !== 'girl') return false

        return true
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.girlId = user.girlId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.girlId = token.girlId as number | null
      }
      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        const result = await db.execute({
          sql: 'SELECT * FROM users WHERE email = ?',
          args: [email]
        })

        const user = result.rows[0] as any
        if (!user) return null

        const isValid = await bcrypt.compare(password, user.password_hash)
        if (!isValid) return null

        let girlId = user.girl_id

        // If user is a girl, fetch girl data
        if (user.role === 'girl' && user.girl_id) {
          const girlResult = await db.execute({
            sql: 'SELECT id FROM girls WHERE id = ?',
            args: [user.girl_id]
          })
          girlId = girlResult.rows[0]?.id || null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          girlId: girlId
        }
      },
    }),
  ],
} satisfies NextAuthConfig
