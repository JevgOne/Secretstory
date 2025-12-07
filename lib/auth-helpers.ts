import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Require authentication and role check for API routes
 */
export async function requireAuth(
  allowedRoles: string[] = []
) {
  const session = await auth()

  if (!session?.user) {
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

  return session.user
}
