import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { auth } from '@/auth'

/**
 * Require authentication and role check for API routes
 * Uses NextAuth v5 auth() instead of deprecated getToken()
 */
export async function requireAuth(
  allowedRoles: string[] = [],
  _request?: NextRequest
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    const userRole = session.user.role as string

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      )
    }

    return {
      id: session.user.id as string,
      email: session.user.email as string,
      name: session.user.name as string,
      role: userRole,
      girlId: session.user.girlId as number | null | undefined
    }
  } catch (error) {
    console.error('[requireAuth] Error:', error)
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    )
  }
}
