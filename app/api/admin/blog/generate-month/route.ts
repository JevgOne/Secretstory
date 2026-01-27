import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { generateBlogIdeasForMonth, generateBlogPostContent } from '@/lib/blog-content-generator';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for AI generation

/**
 * POST /api/admin/blog/generate-month
 * Generate 30 blog posts for the month with AI
 */
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { locale = 'cs', startDate } = body;

    console.log('[Blog Generator] Starting month generation...');

    // Step 1: Generate ideas
    const ideas = await generateBlogIdeasForMonth();
    console.log(`[Blog Generator] Generated ${ideas.length} ideas`);

    const createdPosts: any[] = [];
    const errors: any[] = [];

    // Step 2: Generate content for each idea
    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i];

      try {
        console.log(`[Blog Generator] Generating content ${i + 1}/${ideas.length}: ${idea.title}`);

        // Generate full content
        const content = await generateBlogPostContent(idea);

        // Generate slug
        const slug = content.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Calculate scheduled date (spread across month)
        const scheduleDate = new Date(startDate || Date.now());
        scheduleDate.setDate(scheduleDate.getDate() + i);
        scheduleDate.setHours(10, 0, 0, 0); // 10:00 AM each day

        // Insert into database as DRAFT with review_status = 'draft'
        const result = await db.execute({
          sql: `
            INSERT INTO blog_posts (
              slug, title, excerpt, content, category,
              author, read_time, is_featured, is_published,
              scheduled_for, locale,
              meta_title, meta_description, meta_keywords,
              review_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            slug,
            content.title,
            content.excerpt,
            content.content,
            idea.category,
            'AI Generator',
            content.read_time,
            0, // not featured
            0, // not published yet
            scheduleDate.toISOString(),
            locale,
            content.meta_title,
            content.meta_description,
            content.meta_keywords,
            'draft' // needs review before publishing
          ]
        });

        const postId = Number(result.lastInsertRowid);

        createdPosts.push({
          id: postId,
          title: content.title,
          slug: slug,
          scheduled_for: scheduleDate.toISOString(),
          category: idea.category
        });

        console.log(`[Blog Generator] ✓ Created post #${postId}: ${content.title}`);

      } catch (error) {
        console.error(`[Blog Generator] ✗ Failed to generate ${idea.title}:`, error);
        errors.push({
          title: idea.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`[Blog Generator] Completed! Created ${createdPosts.length} posts, ${errors.length} errors`);

    return NextResponse.json({
      success: true,
      created: createdPosts.length,
      errors: errors.length,
      posts: createdPosts,
      errorDetails: errors,
      message: `Successfully generated ${createdPosts.length} blog posts for the month!`
    });

  } catch (error) {
    console.error('[Blog Generator] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate blog posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
