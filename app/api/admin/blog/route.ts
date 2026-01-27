import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// POST /api/admin/blog - Create new blog post (admin only)
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      category,
      featured_image,
      girl_id,
      author,
      read_time,
      is_featured,
      published, // Changed from is_published for consistency with frontend
      published_at,
      scheduled_for,
      meta_title,
      meta_description,
      meta_keywords,
      og_title,
      og_description,
      og_image,
      locale,
      tags
    } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields (title, content, category)' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existingPost = await db.execute({
      sql: 'SELECT id FROM blog_posts WHERE slug = ?',
      args: [slug]
    });

    if (existingPost.rows.length > 0) {
      return NextResponse.json(
        { error: 'Post with this title already exists' },
        { status: 400 }
      );
    }

    // Determine publication status
    // If scheduled_for is set, keep as draft (is_published = 0) until scheduled time
    const is_published = scheduled_for ? 0 : (published ? 1 : 0);
    const final_published_at = published && !scheduled_for ? new Date().toISOString() : null;

    // Insert new blog post
    const result = await db.execute({
      sql: `
        INSERT INTO blog_posts (
          slug, title, excerpt, content, category, featured_image, girl_id,
          author, read_time, is_featured, is_published, published_at, scheduled_for,
          meta_title, meta_description, meta_keywords, og_title, og_description, og_image, locale
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        slug,
        title,
        excerpt || null,
        content,
        category,
        featured_image || null,
        girl_id || null,
        author || 'LovelyGirls Team',
        read_time || 5,
        is_featured ? 1 : 0,
        is_published,
        final_published_at,
        scheduled_for || null,
        meta_title || title,
        meta_description || excerpt || null,
        meta_keywords || null,
        og_title || meta_title || title,
        og_description || meta_description || excerpt || null,
        og_image || featured_image || null,
        locale || 'cs'
      ]
    });

    const postId = Number(result.lastInsertRowid);

    // Handle tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        // Get or create tag
        const tagSlug = tagName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        let tagId: number;

        // Try to get existing tag
        const existingTag = await db.execute({
          sql: 'SELECT id FROM blog_tags WHERE slug = ?',
          args: [tagSlug]
        });

        if (existingTag.rows.length > 0) {
          tagId = existingTag.rows[0].id as number;
        } else {
          // Create new tag
          const tagResult = await db.execute({
            sql: 'INSERT INTO blog_tags (name, slug) VALUES (?, ?)',
            args: [tagName, tagSlug]
          });
          tagId = Number(tagResult.lastInsertRowid);
        }

        // Link tag to post
        await db.execute({
          sql: 'INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)',
          args: [postId, tagId]
        });
      }
    }

    return NextResponse.json({
      success: true,
      post_id: postId,
      slug,
      message: 'Blog post created successfully'
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// GET /api/admin/blog - Get all blog posts (admin only)
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const locale = searchParams.get('locale');
    const published = searchParams.get('published');

    let sql = `
      SELECT
        p.*,
        g.name as girl_name,
        GROUP_CONCAT(t.name, ',') as tags
      FROM blog_posts p
      LEFT JOIN girls g ON p.girl_id = g.id
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN blog_tags t ON pt.tag_id = t.id
      WHERE 1=1
    `;
    const args: any[] = [];

    if (category) {
      sql += ' AND p.category = ?';
      args.push(category);
    }

    if (locale) {
      sql += ' AND p.locale = ?';
      args.push(locale);
    }

    if (published !== null && published !== undefined && published !== 'all') {
      if (published === 'scheduled') {
        // Filter for scheduled posts only
        sql += ' AND p.scheduled_for IS NOT NULL';
      } else {
        // Filter for published or draft
        sql += ' AND p.is_published = ?';
        args.push(published === 'true' || published === '1' ? 1 : 0);
        // Ensure we only get non-scheduled posts
        sql += ' AND p.scheduled_for IS NULL';
      }
    }

    sql += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      posts: result.rows.map(row => ({
        ...row,
        is_featured: Boolean(row.is_featured),
        is_published: Boolean(row.is_published),
        tags: row.tags ? row.tags.toString().split(',') : []
      }))
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
