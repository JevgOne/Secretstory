import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledPosts } from '@/lib/blog-scheduler';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Cron endpoint for publishing scheduled blog posts
 *
 * This endpoint is called by Vercel Cron Jobs every 10 minutes
 * to ensure scheduled posts are published on time, even if no one visits the blog.
 *
 * Security: Protected by Vercel's cron secret header
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (if CRON_SECRET is set)
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Publish scheduled posts
    const publishedCount = await publishScheduledPosts();

    return NextResponse.json({
      success: true,
      published: publishedCount,
      message: publishedCount > 0
        ? `Published ${publishedCount} scheduled post(s)`
        : 'No scheduled posts to publish',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Cron] Error in publish-scheduled endpoint:', error);
    return NextResponse.json(
      {
        error: 'Failed to publish scheduled posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
