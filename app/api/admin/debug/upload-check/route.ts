import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: {}
  };

  // Check 1: Authentication
  try {
    const user = await requireAuth(['admin', 'manager'], request);
    if (user instanceof NextResponse) {
      diagnostics.checks.auth = {
        status: 'FAILED',
        error: 'Not authenticated or insufficient permissions',
        statusCode: user.status
      };
    } else {
      diagnostics.checks.auth = {
        status: 'OK',
        user: {
          email: user.email,
          role: user.role
        }
      };
    }
  } catch (error) {
    diagnostics.checks.auth = {
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Check 2: Vercel Blob Token
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  diagnostics.checks.blobToken = {
    status: blobToken ? 'OK' : 'MISSING',
    configured: !!blobToken,
    tokenPrefix: blobToken ? blobToken.substring(0, 15) + '...' : null
  };

  // Check 3: Turso Database
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  diagnostics.checks.database = {
    status: (tursoUrl && tursoToken) ? 'OK' : 'MISSING',
    urlConfigured: !!tursoUrl,
    tokenConfigured: !!tursoToken
  };

  // Overall status
  const allOk = Object.values(diagnostics.checks).every(
    (check: any) => check.status === 'OK'
  );
  diagnostics.overall = allOk ? 'ALL_OK' : 'ISSUES_FOUND';

  return NextResponse.json(diagnostics, {
    status: allOk ? 200 : 500
  });
}
