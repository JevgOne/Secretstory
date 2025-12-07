import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access protected routes
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isManagerRoute = pathname.startsWith('/manager');
  const isGirlRoute = pathname.startsWith('/girl');

  if (isAdminRoute || isManagerRoute || isGirlRoute) {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const userRole = session.user.role as string;

    // Role-based access control
    if (isAdminRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (isManagerRoute && !['admin', 'manager'].includes(userRole)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (isGirlRoute && userRole !== 'girl') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Handle i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(cs|en|de|uk)/:path*', '/admin/:path*', '/manager/:path*', '/girl/:path*'],
};
