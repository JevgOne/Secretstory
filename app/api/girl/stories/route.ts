import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { put, del } from '@vercel/blob';
import { auth } from '@/auth';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!
});

// GET - List stories for the authenticated girl
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get girl ID from email
    const girlResult = await db.execute({
      sql: 'SELECT id FROM girls WHERE email = ?',
      args: [session.user.email]
    });

    if (girlResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Girl not found' },
        { status: 404 }
      );
    }

    const girlId = girlResult.rows[0].id;

    const result = await db.execute({
      sql: 'SELECT * FROM stories WHERE girl_id = ? ORDER BY order_index ASC, created_at DESC',
      args: [girlId]
    });

    return NextResponse.json({
      success: true,
      stories: result.rows
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

// POST - Upload a new story
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get girl ID from email
    const girlResult = await db.execute({
      sql: 'SELECT id, name FROM girls WHERE email = ?',
      args: [session.user.email]
    });

    if (girlResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Girl not found' },
        { status: 404 }
      );
    }

    const girlId = girlResult.rows[0].id as number;
    const girlName = girlResult.rows[0].name as string;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const duration = formData.get('duration') as string;
    const expiresIn = formData.get('expiresIn') as string; // hours

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (image or video)
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: 'File must be an image or video' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `girls/${girlId}/stories/${timestamp}.${ext}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false
    });

    // Get current max order_index
    const maxOrderResult = await db.execute({
      sql: 'SELECT MAX(order_index) as max_order FROM stories WHERE girl_id = ?',
      args: [girlId]
    });
    const nextOrder = (maxOrderResult.rows[0]?.max_order as number || -1) + 1;

    // Calculate expiration time if provided
    let expiresAt = null;
    if (expiresIn) {
      const hours = parseInt(expiresIn);
      const expireDate = new Date();
      expireDate.setHours(expireDate.getHours() + hours);
      expiresAt = expireDate.toISOString();
    }

    // Insert into database
    const insertResult = await db.execute({
      sql: `INSERT INTO stories
            (girl_id, media_url, media_type, duration, order_index, expires_at, is_active, created_at, views_count)
            VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), 0)`,
      args: [
        girlId,
        url,
        isImage ? 'image' : 'video',
        duration ? parseInt(duration) : 5,
        nextOrder,
        expiresAt
      ]
    });

    // Log activity
    await db.execute({
      sql: `INSERT INTO activity_log
            (girl_id, activity_type, title, description, media_url, is_visible)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        girlId,
        'story_added',
        `${girlName} přidala novou story`,
        `${girlName} přidala novou story`,
        url,
        1
      ]
    });

    return NextResponse.json({
      success: true,
      story: {
        id: insertResult.lastInsertRowid,
        girl_id: girlId,
        media_url: url,
        media_type: isImage ? 'image' : 'video',
        duration: duration ? parseInt(duration) : 5,
        order_index: nextOrder,
        expires_at: expiresAt
      }
    });
  } catch (error) {
    console.error('Error uploading story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload story' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a story
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get girl ID from email
    const girlResult = await db.execute({
      sql: 'SELECT id FROM girls WHERE email = ?',
      args: [session.user.email]
    });

    if (girlResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Girl not found' },
        { status: 404 }
      );
    }

    const girlId = girlResult.rows[0].id;

    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');

    if (!storyId) {
      return NextResponse.json(
        { success: false, error: 'Story ID required' },
        { status: 400 }
      );
    }

    // Verify story exists and belongs to this girl
    const storyResult = await db.execute({
      sql: 'SELECT * FROM stories WHERE id = ? AND girl_id = ?',
      args: [parseInt(storyId), girlId]
    });

    if (storyResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Story not found or unauthorized' },
        { status: 404 }
      );
    }

    const story = storyResult.rows[0];

    // Delete from Blob storage
    try {
      await del(story.media_url as string);
    } catch (error) {
      console.error('Error deleting from Blob:', error);
      // Continue even if blob deletion fails
    }

    // Delete from database
    await db.execute({
      sql: 'DELETE FROM stories WHERE id = ?',
      args: [parseInt(storyId)]
    });

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
