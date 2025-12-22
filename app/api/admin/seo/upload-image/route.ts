import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

// POST - Upload SEO OG image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `seo/og-images/${timestamp}.${ext}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false
    });

    return NextResponse.json({
      success: true,
      url,
      filename
    });
  } catch (error) {
    console.error('Error uploading SEO image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
