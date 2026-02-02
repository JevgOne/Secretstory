import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Debug endpoint to check auth status
export async function GET(request: NextRequest) {
  try {
    // Check ALL cookies
    const cookies = request.cookies.getAll().map(c => ({
      name: c.name,
      valueLength: c.value.length,
    }));
    
    // Try auth()
    let session = null;
    let authError = null;
    try {
      session = await auth();
    } catch (e: any) {
      authError = e.message;
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      cookies,
      cookieNames: cookies.map(c => c.name),
      hasSession: !!session,
      sessionUser: session?.user ? {
        email: session.user.email,
        role: session.user.role,
        name: session.user.name,
      } : null,
      authError,
      envCheck: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5)
    }, { status: 500 });
  }
}
