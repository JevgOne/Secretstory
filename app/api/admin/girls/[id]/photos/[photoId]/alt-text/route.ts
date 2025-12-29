import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { cache } from '@/lib/cache';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

interface RouteParams {
  params: Promise<{
    id: string;
    photoId: string;
  }>;
}

// PATCH - Update ALT text for a photo (supports multi-language)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const girlId = parseInt(resolvedParams.id);
    const photoId = parseInt(resolvedParams.photoId);

    const body = await request.json();

    // Verify photo exists and belongs to this girl
    const photoCheck = await db.execute({
      sql: 'SELECT id FROM girl_photos WHERE id = ? AND girl_id = ?',
      args: [photoId, girlId]
    });

    if (photoCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Build dynamic UPDATE query based on provided fields
    const updates: string[] = [];
    const args: any[] = [];

    // Support both single alt_text and language-specific fields
    if ('alt_text' in body) {
      updates.push('alt_text = ?');
      args.push(body.alt_text || null);
    }
    if ('alt_text_cs' in body) {
      updates.push('alt_text_cs = ?');
      args.push(body.alt_text_cs || null);
    }
    if ('alt_text_en' in body) {
      updates.push('alt_text_en = ?');
      args.push(body.alt_text_en || null);
    }
    if ('alt_text_de' in body) {
      updates.push('alt_text_de = ?');
      args.push(body.alt_text_de || null);
    }
    if ('alt_text_uk' in body) {
      updates.push('alt_text_uk = ?');
      args.push(body.alt_text_uk || null);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No ALT text fields provided' },
        { status: 400 }
      );
    }

    args.push(photoId);

    // Update ALT text
    await db.execute({
      sql: `UPDATE girl_photos SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    // Clear cache for this girl's profile
    const girlResult = await db.execute({
      sql: 'SELECT slug FROM girls WHERE id = ?',
      args: [girlId]
    });

    if (girlResult.rows.length > 0) {
      const slug = girlResult.rows[0].slug;
      cache.clear(`girl-profile-${slug}`);
      console.log(`[Cache] Cleared cache for girl profile after ALT text update: ${slug}`);
    }

    return NextResponse.json({
      success: true,
      message: 'ALT text updated successfully'
    });
  } catch (error) {
    console.error('Error updating ALT text:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ALT text' },
      { status: 500 }
    );
  }
}
