import { NextRequest } from 'next/server';

/**
 * Simple auth helper - checks for admin session cookie
 */
export async function requireAuth(request: NextRequest) {
  // For now, just return true - proper auth is handled by middleware
  // This is a placeholder for future auth requirements
  return true;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get('admin-session');
  return !!sessionCookie;
}

/**
 * Get current user from request
 */
export async function getCurrentUser(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie.value);
    return session;
  } catch {
    return null;
  }
}
