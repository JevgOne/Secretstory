import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/blog - Get published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const locale = searchParams.get('locale');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
    const girl_id = searchParams.get('girl_id');

    let sql = `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.excerpt,
        p.category,
        p.featured_image,
        p.girl_id,
        p.author,
        p.read_time,
        p.views,
        p.is_featured,
        p.published_at,
        p.locale,
        p.meta_title,
        p.meta_description,
        p.og_image,
        g.name as girl_name,
        g.slug as girl_slug,
        GROUP_CONCAT(t.name, ',') as tags
      FROM blog_posts p
      LEFT JOIN girls g ON p.girl_id = g.id
      LEFT JOIN blog_post_tags pt ON p.id = pt.post_id
      LEFT JOIN blog_tags t ON pt.tag_id = t.id
      WHERE p.is_published = 1
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

    if (featured === 'true' || featured === '1') {
      sql += ' AND p.is_featured = 1';
    }

    if (girl_id) {
      sql += ' AND p.girl_id = ?';
      args.push(parseInt(girl_id));
    }

    sql += ' GROUP BY p.id ORDER BY p.published_at DESC';

    if (limit) {
      sql += ' LIMIT ?';
      args.push(parseInt(limit));
    }

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      posts: result.rows.map(row => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        category: row.category,
        featured_image: row.featured_image,
        girl_id: row.girl_id,
        girl_name: row.girl_name,
        girl_slug: row.girl_slug,
        author: row.author,
        read_time: row.read_time,
        views: row.views,
        is_featured: Boolean(row.is_featured),
        published_at: row.published_at,
        locale: row.locale,
        meta_title: row.meta_title,
        meta_description: row.meta_description,
        og_image: row.og_image,
        tags: row.tags ? row.tags.toString().split(',') : []
      }))
    });
  } catch (error) {
    console.error('Get published blog posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
