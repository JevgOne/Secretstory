import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    role: string
    girlId?: number | null
  }

  interface Session {
    user: {
      role: string
      girlId?: number | null
    } & DefaultSession['user']
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role: string
    girlId?: number | null
  }
}
