import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './auth'

// Rate limiting store (in-memory, resets on restart)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown'
}

function isRateLimited(ip: string): boolean {
  const attempts = loginAttempts.get(ip)
  if (!attempts) return false

  const now = Date.now()
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip)
    return false
  }

  return attempts.count >= MAX_LOGIN_ATTEMPTS
}

function recordLoginAttempt(ip: string): void {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (attempts && now - attempts.lastAttempt < LOCKOUT_DURATION) {
    attempts.count++
    attempts.lastAttempt = now
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
  }
}

export default auth((request) => {
  const { nextUrl } = request
  const isLoggedIn = !!request.auth?.user
  const userRole = request.auth?.user?.role as string | undefined
  const clientIP = getClientIP(request)

  // Paths that require authentication
  const isAdminPath = nextUrl.pathname.startsWith('/admin') && !nextUrl.pathname.startsWith('/admin/login')
  const isAdminApiPath = nextUrl.pathname.startsWith('/api/admin')
  const isManagerPath = nextUrl.pathname.startsWith('/manager')
  const isGirlPath = nextUrl.pathname.startsWith('/girl')

  // Allow login page and login API without auth
  if (nextUrl.pathname === '/admin/login') {
    // Rate limiting for login page
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // If already logged in as admin, redirect to dashboard
    if (isLoggedIn && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
    }

    return NextResponse.next()
  }

  // Handle login API rate limiting
  if (nextUrl.pathname === '/api/auth/callback/credentials') {
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }
    recordLoginAttempt(clientIP)
    return NextResponse.next()
  }

  // Protected routes
  if (isAdminPath || isAdminApiPath) {
    if (!isLoggedIn) {
      if (isAdminApiPath) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', nextUrl))
    }

    if (userRole !== 'admin') {
      if (isAdminApiPath) {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/admin/login', nextUrl))
    }

    // Add security headers
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    return response
  }

  // Manager routes
  if (isManagerPath) {
    if (!isLoggedIn || !['admin', 'manager'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/admin/login', nextUrl))
    }
    return NextResponse.next()
  }

  // Girl routes
  if (isGirlPath) {
    if (!isLoggedIn || userRole !== 'girl') {
      return NextResponse.redirect(new URL('/admin/login', nextUrl))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/manager/:path*',
    '/girl/:path*',
    '/api/auth/callback/:path*',
  ],
}
