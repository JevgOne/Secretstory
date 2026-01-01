import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

// GET - Fetch all landing pages for admin
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pagesResult = await db.execute(
      'SELECT * FROM landing_pages ORDER BY display_order ASC, created_at DESC'
    );

    return NextResponse.json({
      success: true,
      pages: pagesResult.rows
    });
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch landing pages' },
      { status: 500 }
    );
  }
}

// POST - Create new landing page
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const result = await db.execute({
      sql: `INSERT INTO landing_pages (
        slug, is_published, display_order,
        meta_title_cs, meta_title_en, meta_title_de, meta_title_uk,
        meta_description_cs, meta_description_en, meta_description_de, meta_description_uk,
        title_cs, title_en, title_de, title_uk,
        subtitle_cs, subtitle_en, subtitle_de, subtitle_uk,
        content_cs, content_en, content_de, content_uk,
        cta_text_cs, cta_text_en, cta_text_de, cta_text_uk,
        cta_url, featured_image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        data.slug,
        data.is_published ? 1 : 0,
        data.display_order || 0,
        data.meta_title_cs || '',
        data.meta_title_en || '',
        data.meta_title_de || '',
        data.meta_title_uk || '',
        data.meta_description_cs || '',
        data.meta_description_en || '',
        data.meta_description_de || '',
        data.meta_description_uk || '',
        data.title_cs || '',
        data.title_en || '',
        data.title_de || '',
        data.title_uk || '',
        data.subtitle_cs || '',
        data.subtitle_en || '',
        data.subtitle_de || '',
        data.subtitle_uk || '',
        data.content_cs || '',
        data.content_en || '',
        data.content_de || '',
        data.content_uk || '',
        data.cta_text_cs || '',
        data.cta_text_en || '',
        data.cta_text_de || '',
        data.cta_text_uk || '',
        data.cta_url || '',
        data.featured_image_url || ''
      ]
    });

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error creating landing page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create landing page' },
      { status: 500 }
    );
  }
}

// PUT - Update landing page
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE landing_pages SET
        slug = ?, is_published = ?, display_order = ?,
        meta_title_cs = ?, meta_title_en = ?, meta_title_de = ?, meta_title_uk = ?,
        meta_description_cs = ?, meta_description_en = ?, meta_description_de = ?, meta_description_uk = ?,
        title_cs = ?, title_en = ?, title_de = ?, title_uk = ?,
        subtitle_cs = ?, subtitle_en = ?, subtitle_de = ?, subtitle_uk = ?,
        content_cs = ?, content_en = ?, content_de = ?, content_uk = ?,
        cta_text_cs = ?, cta_text_en = ?, cta_text_de = ?, cta_text_uk = ?,
        cta_url = ?, featured_image_url = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
      args: [
        data.slug,
        data.is_published ? 1 : 0,
        data.display_order || 0,
        data.meta_title_cs || '',
        data.meta_title_en || '',
        data.meta_title_de || '',
        data.meta_title_uk || '',
        data.meta_description_cs || '',
        data.meta_description_en || '',
        data.meta_description_de || '',
        data.meta_description_uk || '',
        data.title_cs || '',
        data.title_en || '',
        data.title_de || '',
        data.title_uk || '',
        data.subtitle_cs || '',
        data.subtitle_en || '',
        data.subtitle_de || '',
        data.subtitle_uk || '',
        data.content_cs || '',
        data.content_en || '',
        data.content_de || '',
        data.content_uk || '',
        data.cta_text_cs || '',
        data.cta_text_en || '',
        data.cta_text_de || '',
        data.cta_text_uk || '',
        data.cta_url || '',
        data.featured_image_url || '',
        data.id
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating landing page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update landing page' },
      { status: 500 }
    );
  }
}

// DELETE - Delete landing page
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await db.execute({
      sql: 'DELETE FROM landing_pages WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting landing page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete landing page' },
      { status: 500 }
    );
  }
}
