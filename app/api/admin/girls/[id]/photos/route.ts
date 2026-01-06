import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { put, del } from '@vercel/blob';
import { requireAuth } from '@/lib/auth-helpers';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - List all photos for a girl (with optional pagination)
export async function GET(request: NextRequest, { params }: RouteParams) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const resolvedParams = await params;
    const girlId = parseInt(resolvedParams.id);

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db.execute({
      sql: 'SELECT COUNT(*) as total FROM girl_photos WHERE girl_id = ?',
      args: [girlId]
    });
    const total = countResult.rows[0]?.total as number || 0;

    // Get paginated photos
    const result = await db.execute({
      sql: 'SELECT * FROM girl_photos WHERE girl_id = ? ORDER BY display_order ASC, created_at ASC LIMIT ? OFFSET ?',
      args: [girlId, limit, offset]
    });

    return NextResponse.json({
      success: true,
      photos: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

// POST - Upload a new photo
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    console.log('[PHOTO UPLOAD] Starting upload...');

    // Auth check
    const user = await requireAuth(['admin', 'manager'], request);
    if (user instanceof NextResponse) {
      console.log('[PHOTO UPLOAD] Auth failed');
      return user;
    }
    console.log('[PHOTO UPLOAD] Auth OK');

    // Parse params
    const resolvedParams = await params;
    const girlId = parseInt(resolvedParams.id);
    console.log('[PHOTO UPLOAD] Girl ID:', girlId);

    // Get file from form
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[PHOTO UPLOAD] No file in form data');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('[PHOTO UPLOAD] File:', file.name, file.size, 'bytes', file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[PHOTO UPLOAD] Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    console.log('[PHOTO UPLOAD] Starting Blob upload...');
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `girls/${girlId}/${timestamp}.${ext}`;

    let blobUrl: string;
    try {
      const { url } = await put(filename, file, {
        access: 'public',
        addRandomSuffix: false
      });
      blobUrl = url;
      console.log('[PHOTO UPLOAD] Blob upload SUCCESS:', blobUrl);
    } catch (blobError) {
      console.error('[PHOTO UPLOAD] Blob upload FAILED:', blobError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to upload to storage',
          details: blobError instanceof Error ? blobError.message : String(blobError)
        },
        { status: 500 }
      );
    }

    // Database operations
    console.log('[PHOTO UPLOAD] Starting database operations...');
    try {
      // Check if girl exists
      const girlCheck = await db.execute({
        sql: 'SELECT id, name FROM girls WHERE id = ?',
        args: [girlId]
      });

      if (girlCheck.rows.length === 0) {
        console.error('[PHOTO UPLOAD] Girl not found, ID:', girlId);
        return NextResponse.json(
          {
            success: false,
            error: 'Girl not found',
            details: `Girl with ID ${girlId} does not exist in database`
          },
          { status: 404 }
        );
      }
      console.log('[PHOTO UPLOAD] Girl found:', girlCheck.rows[0].name);

      // Get current max display_order
      const maxOrderResult = await db.execute({
        sql: 'SELECT MAX(display_order) as max_order FROM girl_photos WHERE girl_id = ?',
        args: [girlId]
      });
      const nextOrder = (maxOrderResult.rows[0]?.max_order as number || -1) + 1;
      console.log('[PHOTO UPLOAD] Next display_order:', nextOrder);

      // Check if this should be primary (first photo)
      const photoCountResult = await db.execute({
        sql: 'SELECT COUNT(*) as count FROM girl_photos WHERE girl_id = ?',
        args: [girlId]
      });
      const isPrimary = photoCountResult.rows[0]?.count === 0 ? 1 : 0;
      console.log('[PHOTO UPLOAD] Is primary?', isPrimary);

      // Insert into database
      const insertResult = await db.execute({
        sql: `INSERT INTO girl_photos
              (girl_id, filename, url, display_order, is_primary, file_size, mime_type)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          girlId,
          filename,
          blobUrl,
          nextOrder,
          isPrimary,
          file.size,
          file.type
        ]
      });
      console.log('[PHOTO UPLOAD] Database INSERT OK, ID:', insertResult.lastInsertRowid);

      // Get girl name for activity log
      const girlData = await db.execute({
        sql: 'SELECT name FROM girls WHERE id = ?',
        args: [girlId]
      });
      const girlName = girlData.rows[0]?.name || 'Unknown';

      // Log activity
      await db.execute({
        sql: `INSERT INTO activity_log
              (girl_id, activity_type, title, description, media_url, is_visible)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          girlId,
          'photo_added',
          `${girlName} přidala novou fotku`,
          `${girlName} přidala novou fotku do galerie`,
          blobUrl,
          1
        ]
      });
      console.log('[PHOTO UPLOAD] Activity log OK');

      return NextResponse.json({
        success: true,
        photo: {
          id: insertResult.lastInsertRowid,
          girl_id: girlId,
          filename,
          url: blobUrl,
          display_order: nextOrder,
          is_primary: isPrimary,
          file_size: file.size,
          mime_type: file.type
        }
      });
    } catch (dbError) {
      console.error('[PHOTO UPLOAD] Database operation FAILED:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save photo to database',
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[PHOTO UPLOAD] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload photo',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific photo
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const resolvedParams = await params;
    const girlId = parseInt(resolvedParams.id);

    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('photoId');

    if (!photoId) {
      return NextResponse.json(
        { success: false, error: 'Photo ID required' },
        { status: 400 }
      );
    }

    // Get photo info before deleting
    const photoResult = await db.execute({
      sql: 'SELECT * FROM girl_photos WHERE id = ? AND girl_id = ?',
      args: [parseInt(photoId), girlId]
    });

    if (photoResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    const photo = photoResult.rows[0];
    const wasPrimary = photo.is_primary;

    // Delete from Blob storage
    try {
      await del(photo.url as string);
    } catch (error) {
      console.error('Error deleting from Blob:', error);
      // Continue even if blob deletion fails
    }

    // Delete from database
    await db.execute({
      sql: 'DELETE FROM girl_photos WHERE id = ?',
      args: [parseInt(photoId)]
    });

    // If it was primary, make the next photo primary
    if (wasPrimary) {
      const nextPhotoResult = await db.execute({
        sql: 'SELECT id FROM girl_photos WHERE girl_id = ? ORDER BY display_order ASC LIMIT 1',
        args: [girlId]
      });

      if (nextPhotoResult.rows.length > 0) {
        await db.execute({
          sql: 'UPDATE girl_photos SET is_primary = 1 WHERE id = ?',
          args: [nextPhotoResult.rows[0].id]
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
