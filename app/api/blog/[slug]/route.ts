import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/blog/[slug] - Get a single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'cs';

    const sql = `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.excerpt,
        p.content,
        p.category,
        p.featured_image,
        p.girl_id,
        p.author,
        p.read_time,
        p.views,
        p.is_featured,
        p.published_at,
        p.created_at,
        p.updated_at,
        p.meta_title,
        p.meta_description,
        p.meta_keywords,
        p.og_image,
        p.locale,
        g.name as girl_name,
        g.slug as girl_slug,
        g.bio as girl_bio,
        g.age as girl_age,
        g.nationality as girl_nationality
      FROM blog_posts p
      LEFT JOIN girls g ON p.girl_id = g.id
      WHERE p.slug = ?
        AND p.locale = ?
        AND p.is_published = 1
      LIMIT 1
    `;

    const result = await db.execute({
      sql,
      args: [slug, locale]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    // Get tags for this post
    const tagsResult = await db.execute({
      sql: `
        SELECT t.id, t.name, t.slug
        FROM blog_tags t
        JOIN blog_post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `,
      args: [row.id]
    });

    // Get related posts (same category or same girl, excluding current post)
    const relatedResult = await db.execute({
      sql: `
        SELECT
          p.id,
          p.slug,
          p.title,
          p.excerpt,
          p.featured_image,
          p.read_time,
          p.published_at,
          p.locale
        FROM blog_posts p
        WHERE p.is_published = 1
          AND p.id != ?
          AND p.locale = ?
          AND (p.category = ? OR p.girl_id = ?)
        ORDER BY p.published_at DESC
        LIMIT 3
      `,
      args: [row.id, locale, row.category, row.girl_id || 0]
    });

    const post = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      category: row.category,
      featured_image: row.featured_image,
      author: row.author,
      read_time: row.read_time,
      views: row.views,
      is_featured: Boolean(row.is_featured),
      published_at: row.published_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      meta_keywords: row.meta_keywords,
      og_image: row.og_image,
      locale: row.locale,
      girl: row.girl_id ? {
        id: row.girl_id,
        name: row.girl_name,
        slug: row.girl_slug,
        bio: row.girl_bio,
        age: row.girl_age,
        nationality: row.girl_nationality
      } : null,
      tags: tagsResult.rows,
      related_posts: relatedResult.rows
    };

    return NextResponse.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    return NextResponse.json(
      { error: 'Error loading blog post' },
      { status: 500 }
    );
  }
}

// PATCH /api/blog/[slug] - Increment view count
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { action } = await request.json();

    if (action === 'increment_views') {
      const sql = `
        UPDATE blog_posts
        SET views = views + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE slug = ?
      `;

      await db.execute({
        sql,
        args: [slug]
      });

      return NextResponse.json({
        success: true,
        message: 'View count incremented'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json(
      { error: 'Error updating blog post' },
      { status: 500 }
    );
  }
}
