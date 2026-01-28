import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { generateMonthlyBlogPosts, GeneratedBlogPost } from '@/lib/blog-content-generator';
import { translateToAllLanguages } from '@/lib/auto-translate';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for AI generation

const LANGUAGES = ['cs', 'en', 'de', 'uk'] as const;

/**
 * POST /api/admin/blog/generate-month
 * Generate 4 blog posts for the month with AI (1 per week, rotating categories)
 * Each article is created in all 4 languages: CS, EN, DE, UK
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
    const { startDate } = body;

    console.log('[Blog Generator] Starting monthly generation (4 articles × 4 languages = 16 total)...');

    // Get existing titles to avoid duplicates
    const existingPosts = await db.execute({
      sql: 'SELECT title FROM blog_posts ORDER BY created_at DESC LIMIT 100',
      args: []
    });
    const existingTitles = existingPosts.rows.map(r => r.title as string);

    // Generate 4 articles in Czech (one per week)
    const articles = await generateMonthlyBlogPosts(existingTitles);
    console.log(`[Blog Generator] Generated ${articles.length} Czech articles`);

    const createdPosts: any[] = [];
    const errors: any[] = [];

    // Map week_type to category
    const categoryMap: Record<number, string> = {
      1: 'pribehy-spolecnic',
      2: 'rady-a-tipy',
      3: 'novinky',
      4: 'pribehy-spolecnic'
    };

    // Process each article
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      try {
        console.log(`\n[Blog Generator] Processing article ${i + 1}/${articles.length}: ${article.title}`);

        // Calculate scheduled date (one per week)
        const scheduleDate = new Date(startDate || Date.now());
        scheduleDate.setDate(scheduleDate.getDate() + (i * 7)); // Every 7 days
        scheduleDate.setHours(10, 0, 0, 0); // 10:00 AM

        // Translate to all languages
        console.log('[Blog Generator] Translating to EN, DE, UK...');
        const translations = await translateToAllLanguages(
          {
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            meta_description: article.meta_description
          },
          'cs'
        );

        // Save in all 4 languages
        for (const lang of LANGUAGES) {
          const translated = translations[lang];
          if (!translated) {
            console.log(`[Blog Generator] ⚠️ Translation to ${lang} failed, skipping...`);
            errors.push({ title: article.title, lang, error: 'Translation failed' });
            continue;
          }

          // Generate slug for this language version
          const slug = (translated.title || article.title)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

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
              slug,
              translated.title || article.title,
              translated.excerpt || article.excerpt,
              translated.content || article.content,
              categoryMap[article.week_type] || 'ostatni',
              'AI Generator',
              article.reading_time,
              0, // not featured
              0, // not published yet
              scheduleDate.toISOString(),
              lang,
              translated.title || article.meta_title,
              translated.meta_description || article.meta_description,
              article.keywords.join(', '),
              'draft' // needs review before publishing
            ]
          });

          const postId = Number(result.lastInsertRowid);

          createdPosts.push({
            id: postId,
            title: translated.title || article.title,
            slug: slug,
            scheduled_for: scheduleDate.toISOString(),
            category: categoryMap[article.week_type],
            week_type: article.week_type,
            locale: lang
          });

          console.log(`[Blog Generator] ✓ Saved ${lang.toUpperCase()}: ${translated.title || article.title} (ID: ${postId})`);
        }

        // Delay between articles to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`[Blog Generator] ✗ Failed to process ${article.title}:`, error);
        errors.push({
          title: article.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`\n[Blog Generator] Completed!`);
    console.log(`✓ Created: ${createdPosts.length} articles (${articles.length} × 4 languages)`);
    console.log(`✗ Errors: ${errors.length}`);

    return NextResponse.json({
      success: true,
      created: createdPosts.length,
      errors: errors.length,
      posts: createdPosts,
      errorDetails: errors,
      message: `Vygenerováno ${createdPosts.length} článků (${articles.length} články × 4 jazyky)`
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
