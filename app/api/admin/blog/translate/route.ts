import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { translateBlogPost, translateToAllLanguages } from '@/lib/auto-translate';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute

/**
 * POST /api/admin/blog/translate
 * Auto-translate a blog post to other languages
 */
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { postId, mode = 'all' } = body;
    // mode: 'all' = translate to all 4 languages, 'single' = translate to specific target

    // Get source post
    const sourcePost = await db.execute({
      sql: 'SELECT * FROM blog_posts WHERE id = ?',
      args: [postId]
    });

    if (sourcePost.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const post = sourcePost.rows[0];
    const sourceLang = post.locale as 'cs' | 'en' | 'de' | 'uk';

    console.log(`[Auto-Translate] Translating post #${postId} from ${sourceLang}...`);

    if (mode === 'all') {
      // Translate to all languages
      const translations = await translateToAllLanguages(
        {
          title: post.title as string,
          excerpt: post.excerpt as string,
          content: post.content as string,
          meta_description: post.meta_description as string | undefined
        },
        sourceLang
      );

      const createdPosts: any[] = [];

      // Create posts in other languages
      for (const [lang, translated] of Object.entries(translations)) {
        if (lang === sourceLang || !translated) continue;

        const slug = (translated.title as string)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Check if translation already exists
        const existing = await db.execute({
          sql: 'SELECT id FROM blog_posts WHERE slug = ? AND locale = ?',
          args: [slug, lang]
        });

        if (existing.rows.length > 0) {
          console.log(`[Auto-Translate] Skipping ${lang} - already exists`);
          continue;
        }

        // Create translated post
        const result = await db.execute({
          sql: `
            INSERT INTO blog_posts (
              slug, title, excerpt, content, category,
              girl_id, author, read_time, is_featured, is_published,
              scheduled_for, locale,
              meta_title, meta_description, meta_keywords,
              og_title, og_description, og_image, featured_image,
              review_status, assigned_copywriter_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            slug,
            translated.title,
            translated.excerpt,
            translated.content,
            post.category,
            post.girl_id,
            'Auto-Translate',
            post.read_time,
            post.is_featured,
            0, // not published yet
            post.scheduled_for,
            lang,
            translated.title,
            translated.meta_description,
            post.meta_keywords,
            translated.title,
            translated.meta_description,
            post.og_image,
            post.featured_image,
            'pending_review', // needs copywriter review
            // Auto-assign copywriter based on language
            lang === 'cs' ? 1 : lang === 'en' ? 2 : lang === 'de' ? 3 : 4
          ]
        });

        createdPosts.push({
          id: Number(result.lastInsertRowid),
          locale: lang,
          title: translated.title,
          slug: slug
        });

        console.log(`[Auto-Translate] ✓ Created ${lang} translation #${result.lastInsertRowid}`);
      }

      return NextResponse.json({
        success: true,
        translated: createdPosts.length,
        posts: createdPosts,
        message: `Successfully translated to ${createdPosts.length} language(s)`
      });

    } else {
      return NextResponse.json(
        { error: 'Only "all" mode is supported currently' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[Auto-Translate] Error:', error);
    return NextResponse.json(
      {
        error: 'Translation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
