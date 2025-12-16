import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// PATCH /api/admin/girls/:id - Update girl profile (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin can update girls
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const updates: string[] = [];
    const args: any[] = [];

    // Build dynamic update query
    const allowedFields = [
      'name', 'email', 'phone', 'age', 'nationality', 'height', 'weight',
      'bust', 'hair', 'eyes', 'color', 'status', 'verified', 'online',
      'bio', 'tattoo_percentage', 'tattoo_description', 'piercing', 'piercing_description',
      'description_cs', 'description_en', 'description_de', 'description_uk', 'location',
      'is_new', 'is_top', 'is_featured', 'featured_section', 'badge_type',
      'meta_title', 'meta_description', 'og_image'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (field === 'verified' || field === 'online' || field === 'piercing' || field === 'is_new' || field === 'is_top' || field === 'is_featured') {
          args.push(body[field] ? 1 : 0);
        } else {
          args.push(body[field]);
        }
      }
    }

    // Handle JSON fields separately
    if (body.services !== undefined) {
      updates.push('services = ?');
      args.push(JSON.stringify(body.services));
    }

    if (body.languages !== undefined) {
      updates.push('languages = ?');
      args.push(JSON.stringify(body.languages));
    }

    if (body.schedule !== undefined) {
      updates.push('schedule = ?');
      args.push(JSON.stringify(body.schedule));
    }

    if (body.photos !== undefined) {
      updates.push('photos = ?');
      args.push(JSON.stringify(body.photos));
    }

    // If name changed, update slug
    if (body.name) {
      const newSlug = body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      updates.push('slug = ?');
      args.push(newSlug);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'Žádná data k aktualizaci' },
        { status: 400 }
      );
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    args.push(parseInt(id));

    await db.execute({
      sql: `UPDATE girls SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    return NextResponse.json({
      success: true,
      message: 'Profil aktualizován'
    });
  } catch (error) {
    console.error('Update girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci profilu' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/girls/:id - Delete girl profile (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin can delete girls
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;

    // Check if girl exists
    const girlResult = await db.execute({
      sql: 'SELECT id FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    if (girlResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Dívka nenalezena' },
        { status: 404 }
      );
    }

    // Delete girl (CASCADE will delete related records)
    await db.execute({
      sql: 'DELETE FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      message: 'Profil smazán'
    });
  } catch (error) {
    console.error('Delete girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání profilu' },
      { status: 500 }
    );
  }
}

// GET /api/admin/girls/:id - Get single girl (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin can view girl details
  const user = await requireAuth(['admin']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const result = await db.execute({
      sql: 'SELECT * FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Dívka nenalezena' },
        { status: 404 }
      );
    }

    const girl = result.rows[0];

    return NextResponse.json({
      success: true,
      girl: {
        ...girl,
        services: girl.services ? JSON.parse(girl.services as string) : [],
        languages: girl.languages ? JSON.parse(girl.languages as string) : ['cs'],
        verified: Boolean(girl.verified),
        online: Boolean(girl.online),
        piercing: Boolean(girl.piercing),
        is_new: Boolean(girl.is_new),
        is_top: Boolean(girl.is_top),
        is_featured: Boolean(girl.is_featured)
      }
    });
  } catch (error) {
    console.error('Get girl error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání profilu' },
      { status: 500 }
    );
  }
}
