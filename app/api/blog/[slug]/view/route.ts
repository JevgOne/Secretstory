import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/blog/:slug/view - Increment view count (public)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Increment view count
    await db.execute({
      sql: `
        UPDATE blog_posts
        SET views = views + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE slug = ? AND is_published = 1
      `,
      args: [slug]
    });

    return NextResponse.json({
      success: true,
      message: 'View count incremented'
    });
  } catch (error) {
    console.error('Increment view count error:', error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}
