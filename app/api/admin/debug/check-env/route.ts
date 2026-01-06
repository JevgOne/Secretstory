import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {} as Record<string, any>
  };

  // Check BLOB token
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  diagnostics.checks.blob_token = {
    exists: !!blobToken,
    prefix: blobToken ? blobToken.substring(0, 20) + '...' : null,
    status: blobToken ? 'OK' : 'MISSING - Set in Vercel dashboard'
  };

  // Check Turso DB
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  diagnostics.checks.turso_database = {
    url_exists: !!tursoUrl,
    token_exists: !!tursoToken,
    status: (tursoUrl && tursoToken) ? 'OK' : 'MISSING'
  };

  // Check NextAuth
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  diagnostics.checks.nextauth = {
    exists: !!nextAuthSecret,
    status: nextAuthSecret ? 'OK' : 'MISSING'
  };

  const allOk = blobToken && tursoUrl && tursoToken && nextAuthSecret;

  return NextResponse.json({
    overall: allOk ? 'ALL_OK' : 'MISSING_ENV_VARS',
    ...diagnostics,
    instructions: allOk ? null : 'Set missing environment variables in Vercel dashboard: https://vercel.com/your-project/settings/environment-variables'
  }, { status: allOk ? 200 : 500 });
}
