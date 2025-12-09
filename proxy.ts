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

  // Skip intl middleware for admin/manager/girl routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/manager') || pathname.startsWith('/girl')) {
    // Allow /admin/login without auth
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check authentication for protected routes
    const session = await auth();

    if (!session?.user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const userRole = session.user.role as string;

    // Role-based access control
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/manager') && !['admin', 'manager'].includes(userRole)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/girl') && userRole !== 'girl') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  // Handle i18n for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
