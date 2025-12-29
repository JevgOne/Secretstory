import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'

/**
 * Require authentication and role check for API routes
 */
export async function requireAuth(
  allowedRoles: string[] = []
) {
  try {
    // Get session using auth() from NextAuth
    const session = await auth()

    console.log('[requireAuth] Checking session...')
    console.log('[requireAuth] Headers:', Object.fromEntries((await headers()).entries()))
    console.log('[requireAuth] Cookies:', (await cookies()).getAll())
    console.log('[requireAuth] Session:', session ? JSON.stringify(session) : 'null')

    if (!session?.user) {
      console.log('[requireAuth] No session.user - returning 401')
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    const userRole = session.user.role as string
    console.log('[requireAuth] User role:', userRole, 'Allowed:', allowedRoles)

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      console.log('[requireAuth] Role not allowed - returning 403')
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      )
    }

    console.log('[requireAuth] Success - returning user')
    return session.user
  } catch (error) {
    console.error('[requireAuth] Error:', error)
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    )
  }
}
