import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { put, del } from '@vercel/blob';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET - List all videos for a girl (with optional pagination)
export async function GET(request: NextRequest, { params }: RouteParams) {
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
      sql: 'SELECT COUNT(*) as total FROM girl_videos WHERE girl_id = ?',
      args: [girlId]
    });
    const total = countResult.rows[0]?.total as number || 0;

    // Get paginated videos
    const result = await db.execute({
      sql: 'SELECT * FROM girl_videos WHERE girl_id = ? ORDER BY display_order ASC, created_at ASC LIMIT ? OFFSET ?',
      args: [girlId, limit, offset]
    });

    return NextResponse.json({
      success: true,
      videos: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

// POST - Upload a new video
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const girlId = parseInt(resolvedParams.id);

    // Verify girl exists
    const girlCheck = await db.execute({
      sql: 'SELECT id FROM girls WHERE id = ?',
      args: [girlId]
    });

    if (girlCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Girl not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { success: false, error: 'File must be a video' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `girls/${girlId}/videos/${timestamp}.${ext}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false
    });

    // Get current max display_order
    const maxOrderResult = await db.execute({
      sql: 'SELECT MAX(display_order) as max_order FROM girl_videos WHERE girl_id = ?',
      args: [girlId]
    });
    const nextOrder = (maxOrderResult.rows[0]?.max_order as number || -1) + 1;

    // Insert into database
    const insertResult = await db.execute({
      sql: `INSERT INTO girl_videos
            (girl_id, filename, url, display_order, file_size, mime_type)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        girlId,
        filename,
        url,
        nextOrder,
        file.size,
        file.type
      ]
    });

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
        'video_added',
        `${girlName} přidala nové video`,
        `${girlName} přidala nové video do galerie`,
        url,
        1
      ]
    });

    return NextResponse.json({
      success: true,
      video: {
        id: insertResult.lastInsertRowid,
        girl_id: girlId,
        filename,
        url,
        display_order: nextOrder,
        file_size: file.size,
        mime_type: file.type
      }
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific video
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const girlId = parseInt(resolvedParams.id);

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID required' },
        { status: 400 }
      );
    }

    // Verify video exists and belongs to this girl
    const videoResult = await db.execute({
      sql: 'SELECT * FROM girl_videos WHERE id = ? AND girl_id = ?',
      args: [parseInt(videoId), girlId]
    });

    if (videoResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      );
    }

    const video = videoResult.rows[0];

    // Delete from Blob storage
    try {
      await del(video.url as string);
    } catch (error) {
      console.error('Error deleting from Blob:', error);
      // Continue even if blob deletion fails
    }

    // Delete from database
    await db.execute({
      sql: 'DELETE FROM girl_videos WHERE id = ?',
      args: [parseInt(videoId)]
    });

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
