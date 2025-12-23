import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/seo - Get all SEO metadata (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale');
    const pageType = searchParams.get('page_type');
    const pagePath = searchParams.get('page_path');

    let sql = 'SELECT * FROM seo_metadata WHERE 1=1';
    const args: any[] = [];

    if (locale) {
      sql += ' AND locale = ?';
      args.push(locale);
    }

    if (pageType) {
      sql += ' AND page_type = ?';
      args.push(pageType);
    }

    if (pagePath) {
      sql += ' AND page_path = ?';
      args.push(pagePath);
    }

    sql += ' ORDER BY page_path ASC';

    const result = await db.execute({ sql, args });

    // If querying for a specific page_path, return single object instead of array
    if (pagePath) {
      return NextResponse.json({
        success: true,
        metadata: result.rows.length > 0 ? result.rows[0] : null
      });
    }

    return NextResponse.json({
      success: true,
      metadata: result.rows
    });
  } catch (error: any) {
    console.error('Error fetching SEO metadata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/seo - Create or update SEO metadata (ADMIN ONLY)
export async function POST(request: NextRequest) {
  // Check authentication - proper auth is handled by middleware
  const isAuth = await requireAuth(request);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      page_path,
      page_type,
      locale,
      meta_title,
      meta_description,
      meta_keywords,
      og_title,
      og_description,
      og_image,
      og_image_alt,
      og_type,
      twitter_card,
      twitter_title,
      twitter_description,
      twitter_image,
      schema_type,
      schema_data,
      canonical_url,
      robots_index,
      robots_follow,
      focus_keyword,
      seo_score
    } = body;

    // Validation
    if (!page_path || !page_type || !locale) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: page_path, page_type, locale' },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM seo_metadata WHERE page_path = ?',
      args: [page_path]
    });

    if (existing.rows.length > 0) {
      // Update existing
      await db.execute({
        sql: `UPDATE seo_metadata SET
          page_type = ?,
          locale = ?,
          meta_title = ?,
          meta_description = ?,
          meta_keywords = ?,
          og_title = ?,
          og_description = ?,
          og_image = ?,
          og_image_alt = ?,
          og_type = ?,
          twitter_card = ?,
          twitter_title = ?,
          twitter_description = ?,
          twitter_image = ?,
          schema_type = ?,
          schema_data = ?,
          canonical_url = ?,
          robots_index = ?,
          robots_follow = ?,
          focus_keyword = ?,
          seo_score = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE page_path = ?`,
        args: [
          page_type, locale, meta_title, meta_description, meta_keywords,
          og_title, og_description, og_image, og_image_alt, og_type,
          twitter_card, twitter_title, twitter_description, twitter_image,
          schema_type, schema_data, canonical_url,
          robots_index ?? 1, robots_follow ?? 1,
          focus_keyword, seo_score ?? 0,
          page_path
        ]
      });

      return NextResponse.json({
        success: true,
        message: 'SEO metadata updated',
        id: existing.rows[0].id
      });
    } else {
      // Insert new
      const result = await db.execute({
        sql: `INSERT INTO seo_metadata (
          page_path, page_type, locale,
          meta_title, meta_description, meta_keywords,
          og_title, og_description, og_image, og_image_alt, og_type,
          twitter_card, twitter_title, twitter_description, twitter_image,
          schema_type, schema_data, canonical_url,
          robots_index, robots_follow, focus_keyword, seo_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          page_path, page_type, locale,
          meta_title, meta_description, meta_keywords,
          og_title, og_description, og_image, og_image_alt, og_type || 'website',
          twitter_card || 'summary_large_image', twitter_title, twitter_description, twitter_image,
          schema_type, schema_data, canonical_url,
          robots_index ?? 1, robots_follow ?? 1, focus_keyword, seo_score ?? 0
        ]
      });

      return NextResponse.json({
        success: true,
        message: 'SEO metadata created',
        id: Number(result.lastInsertRowid)
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error saving SEO metadata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/seo?page_path=... - Delete SEO metadata (ADMIN ONLY)
export async function DELETE(request: NextRequest) {
  // Check authentication - proper auth is handled by middleware
  const isAuth = await requireAuth(request);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const pagePath = searchParams.get('page_path');

    if (!pagePath) {
      return NextResponse.json(
        { success: false, error: 'Missing page_path parameter' },
        { status: 400 }
      );
    }

    await db.execute({
      sql: 'DELETE FROM seo_metadata WHERE page_path = ?',
      args: [pagePath]
    });

    return NextResponse.json({
      success: true,
      message: 'SEO metadata deleted'
    });
  } catch (error: any) {
    console.error('Error deleting SEO metadata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
