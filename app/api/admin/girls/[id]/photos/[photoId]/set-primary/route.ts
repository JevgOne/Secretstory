import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { requireAuth } from '@/lib/auth-helpers';
import { cache } from '@/lib/cache';
import { revalidatePath } from 'next/cache';

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

// PATCH - Set photo as primary
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const resolvedParams = await params;
    const girlId = parseInt(resolvedParams.id);
    const photoId = parseInt(resolvedParams.photoId);

    console.log(`[SET PRIMARY] Girl ID: ${girlId}, Photo ID: ${photoId}`);

    // Verify photo exists and belongs to this girl
    const photoCheck = await db.execute({
      sql: 'SELECT id, girl_id FROM girl_photos WHERE id = ? AND girl_id = ?',
      args: [photoId, girlId]
    });

    if (photoCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Start transaction: unset all primary photos for this girl, then set the new one
    // First, unset all primary photos
    await db.execute({
      sql: 'UPDATE girl_photos SET is_primary = 0 WHERE girl_id = ?',
      args: [girlId]
    });

    // Set the new primary photo
    await db.execute({
      sql: 'UPDATE girl_photos SET is_primary = 1 WHERE id = ?',
      args: [photoId]
    });

    // Get girl slug for cache invalidation
    const girlResult = await db.execute({
      sql: 'SELECT slug FROM girls WHERE id = ?',
      args: [girlId]
    });
    const girlSlug = girlResult.rows[0]?.slug as string;

    // Invalidate all relevant caches
    if (girlSlug) {
      cache.clear(`girl-profile-${girlSlug}`);
    }
    cache.clearByPrefix('girls-');
    cache.clearByPrefix('homepage-');
    cache.clearByPrefix('stories-');

    // Revalidate Next.js pages (clears CDN cache)
    try {
      revalidatePath('/');
      revalidatePath('/cs');
      revalidatePath('/en');
      revalidatePath('/de');
      revalidatePath('/uk');
      revalidatePath('/cs/divky');
      revalidatePath('/en/divky');
      if (girlSlug) {
        revalidatePath(`/cs/profily/${girlSlug}`);
        revalidatePath(`/en/profily/${girlSlug}`);
      }
    } catch (e) {
      console.error('[SET PRIMARY] Revalidation error:', e);
    }

    console.log(`[SET PRIMARY] Photo ${photoId} set as primary for girl ${girlId}, all caches invalidated`);

    return NextResponse.json({
      success: true,
      message: 'Primary photo updated'
    });
  } catch (error) {
    console.error('[SET PRIMARY] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set primary photo' },
      { status: 500 }
    );
  }
}
