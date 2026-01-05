import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// GET /api/admin/blog/:id - Get single blog post (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;

    // Get post with related data
    const result = await db.execute({
      sql: `
        SELECT
          p.*,
          g.name as girl_name,
          g.slug as girl_slug
        FROM blog_posts p
        LEFT JOIN girls g ON p.girl_id = g.id
        WHERE p.id = ?
      `,
      args: [parseInt(id)]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    const post = result.rows[0];

    // Get tags for this post
    const tagsResult = await db.execute({
      sql: `
        SELECT t.id, t.name, t.slug
        FROM blog_tags t
        JOIN blog_post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `,
      args: [parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        is_featured: Boolean(post.is_featured),
        is_published: Boolean(post.is_published),
        tags: tagsResult.rows
      }
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/blog/:id - Update blog post (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const updates: string[] = [];
    const args: any[] = [];

    // Build dynamic update query
    const allowedFields = [
      'title', 'excerpt', 'content', 'category', 'featured_image', 'girl_id',
      'author', 'read_time', 'is_featured', 'is_published', 'published_at',
      'meta_title', 'meta_description', 'meta_keywords', 'og_image', 'locale'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (field === 'is_featured' || field === 'is_published') {
          args.push(body[field] ? 1 : 0);
        } else {
          args.push(body[field]);
        }
      }
    }

    // If title changed, update slug
    if (body.title) {
      const newSlug = body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      updates.push('slug = ?');
      args.push(newSlug);
    }

    // If publishing status changed to published and no published_at, set it
    if (body.is_published === true || body.is_published === 1) {
      const currentPost = await db.execute({
        sql: 'SELECT published_at FROM blog_posts WHERE id = ?',
        args: [parseInt(id)]
      });

      if (currentPost.rows.length > 0 && !currentPost.rows[0].published_at) {
        updates.push('published_at = ?');
        args.push(new Date().toISOString());
      }
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      args.push(parseInt(id));

      await db.execute({
        sql: `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?`,
        args
      });
    }

    // Handle tags update if provided
    if (body.tags !== undefined && Array.isArray(body.tags)) {
      // Remove existing tags
      await db.execute({
        sql: 'DELETE FROM blog_post_tags WHERE post_id = ?',
        args: [parseInt(id)]
      });

      // Add new tags
      for (const tagName of body.tags) {
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
          args: [parseInt(id), tagId]
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/:id - Delete blog post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;

    // Check if post exists
    const postResult = await db.execute({
      sql: 'SELECT id FROM blog_posts WHERE id = ?',
      args: [parseInt(id)]
    });

    if (postResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Delete post (CASCADE will delete related tags)
    await db.execute({
      sql: 'DELETE FROM blog_posts WHERE id = ?',
      args: [parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
