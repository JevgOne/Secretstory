import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Require authentication and role check for API routes
 */
export async function requireAuth(
  allowedRoles: string[] = [],
  request?: NextRequest
) {
  try {
    if (!request) {
      console.log('[requireAuth] No request provided')
      return NextResponse.json(
        { error: 'Internal error - no request' },
        { status: 500 }
      )
    }

    console.log('[requireAuth] Cookies:', request.cookies.getAll().map(c => c.name))

    // Try multiple cookie name variations for NextAuth v5
    let token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'lovelygirls-secret-change-in-production'
    })

    // If auto-detect fails, try with explicit cookie name
    if (!token) {
      console.log('[requireAuth] Auto-detect failed, trying explicit cookie name')
      token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || 'lovelygirls-secret-change-in-production',
        cookieName: 'lovelygirls-session'
      })
    }

    console.log('[requireAuth] Checking token...')
    console.log('[requireAuth] Token exists:', !!token)
    console.log('[requireAuth] Token:', token ? JSON.stringify(token) : 'null')

    if (!token || !token.email) {
      console.log('[requireAuth] No valid token - returning 401')
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    const userRole = token.role as string
    console.log('[requireAuth] User role:', userRole, 'Allowed:', allowedRoles)

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      console.log('[requireAuth] Role not allowed - returning 403')
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      )
    }

    console.log('[requireAuth] Success - returning user')
    return {
      id: token.sub as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as string,
      girlId: token.girlId as number | null | undefined
    }
  } catch (error) {
    console.error('[requireAuth] Error:', error)
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    )
  }
}
