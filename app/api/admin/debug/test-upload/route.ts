import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  console.log('[TEST UPLOAD] Request received');

  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    steps: []
  };

  // Step 1: Check auth
  try {
    const user = await requireAuth(['admin', 'manager'], request);
    if (user instanceof NextResponse) {
      diagnostics.steps.push({
        step: 'auth',
        status: 'FAILED',
        error: 'Not authenticated',
        statusCode: user.status
      });
      return NextResponse.json(diagnostics, { status: 401 });
    }
    diagnostics.steps.push({
      step: 'auth',
      status: 'OK',
      user: { email: user.email, role: user.role }
    });
  } catch (error) {
    diagnostics.steps.push({
      step: 'auth',
      status: 'ERROR',
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(diagnostics, { status: 500 });
  }

  // Step 2: Check Blob token
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    diagnostics.steps.push({
      step: 'blob_token',
      status: 'MISSING',
      error: 'BLOB_READ_WRITE_TOKEN not configured'
    });
    return NextResponse.json(diagnostics, { status: 500 });
  }
  diagnostics.steps.push({
    step: 'blob_token',
    status: 'OK',
    tokenPrefix: blobToken.substring(0, 15) + '...'
  });

  // Step 3: Parse form data
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      diagnostics.steps.push({
        step: 'form_data',
        status: 'FAILED',
        error: 'No file in form data'
      });
      return NextResponse.json(diagnostics, { status: 400 });
    }

    diagnostics.steps.push({
      step: 'form_data',
      status: 'OK',
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });

    // Step 4: Try Vercel Blob upload
    const filename = `test/${Date.now()}-${file.name}`;

    try {
      const { url } = await put(filename, file, {
        access: 'public',
        addRandomSuffix: false
      });

      diagnostics.steps.push({
        step: 'blob_upload',
        status: 'SUCCESS',
        url,
        filename
      });

      return NextResponse.json({
        ...diagnostics,
        overall: 'SUCCESS',
        message: 'Test upload completed successfully! You can now upload photos.'
      }, { status: 200 });

    } catch (error) {
      diagnostics.steps.push({
        step: 'blob_upload',
        status: 'FAILED',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      return NextResponse.json(diagnostics, { status: 500 });
    }

  } catch (error) {
    diagnostics.steps.push({
      step: 'form_data',
      status: 'ERROR',
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(diagnostics, { status: 500 });
  }
}
