import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { generateMonthlyBlogPosts } from '@/lib/blog-content-generator';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for AI generation

/**
 * POST /api/admin/blog/generate-month
 * Generate 4 blog posts for the month with AI (1 per week, rotating categories)
 *
 * Categories rotate:
 * Week 1: Průvodce pro klienty
 * Week 2: Lifestyle Praha
 * Week 3: Lokální SEO
 * Week 4: Důvěra & Kvalita
 */
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { locale = 'cs', startDate } = body;

    console.log('[Blog Generator] Starting monthly generation (4 articles)...');

    // Get existing titles to avoid duplicates
    const existingPosts = await db.execute({
      sql: 'SELECT title FROM blog_posts WHERE locale = ? ORDER BY created_at DESC LIMIT 50',
      args: [locale]
    });
    const existingTitles = existingPosts.rows.map(r => r.title as string);

    // Generate 4 articles (one per week)
    const articles = await generateMonthlyBlogPosts(existingTitles);
    console.log(`[Blog Generator] Generated ${articles.length} articles`);

    const createdPosts: any[] = [];
    const errors: any[] = [];

    // Save each article to database
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      try {
        // Calculate scheduled date (one per week)
        const scheduleDate = new Date(startDate || Date.now());
        scheduleDate.setDate(scheduleDate.getDate() + (i * 7)); // Every 7 days
        scheduleDate.setHours(10, 0, 0, 0); // 10:00 AM

        // Map week_type to category
        const categoryMap: Record<number, string> = {
          1: 'pruvodce-pro-klienty',
          2: 'lifestyle-praha',
          3: 'lokalni-seo',
          4: 'duvera-kvalita'
        };

        // Insert into database as DRAFT
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
            article.slug,
            article.title,
            article.excerpt,
            article.content,
            categoryMap[article.week_type] || 'ostatni',
            'AI Generator',
            article.reading_time,
            0, // not featured
            0, // not published yet
            scheduleDate.toISOString(),
            locale,
            article.meta_title,
            article.meta_description,
            article.keywords.join(', '),
            'draft' // needs review before publishing
          ]
        });

        const postId = Number(result.lastInsertRowid);

        createdPosts.push({
          id: postId,
          title: article.title,
          slug: article.slug,
          scheduled_for: scheduleDate.toISOString(),
          category: categoryMap[article.week_type],
          week_type: article.week_type
        });

        console.log(`[Blog Generator] ✓ Saved post #${postId}: ${article.title}`);

      } catch (error) {
        console.error(`[Blog Generator] ✗ Failed to save ${article.title}:`, error);
        errors.push({
          title: article.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`[Blog Generator] Completed! Created ${createdPosts.length} posts, ${errors.length} errors`);

    return NextResponse.json({
      success: true,
      created: createdPosts.length,
      errors: errors.length,
      posts: createdPosts,
      errorDetails: errors,
      message: `Vygenerováno ${createdPosts.length} článků na měsíc (1 týdně)`
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
