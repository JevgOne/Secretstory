import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

// GET /api/admin/services - Get all services or filter by category
export async function GET(request: NextRequest) {
  const user = await requireAuth(['admin', 'manager'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let sql = `
      SELECT id, name_cs, name_en, name_de, name_uk, category, duration, is_active, display_order
      FROM services
      WHERE 1=1
    `;
    const args: any[] = [];

    if (category) {
      sql += ' AND category = ?';
      args.push(category);
    }

    sql += ' ORDER BY display_order, id';

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      services: result.rows.map(row => ({
        ...row,
        is_active: Boolean(row.is_active)
      }))
    });
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání služeb' },
      { status: 500 }
    );
  }
}

// POST /api/admin/services - Create new service
export async function POST(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { name_cs, name_en, name_de, name_uk, category, duration, display_order } = body;

    if (!name_cs || !name_en || !name_de || !name_uk) {
      return NextResponse.json(
        { error: 'Chybí povinné překlady názvů služby' },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: `
        INSERT INTO services (name_cs, name_en, name_de, name_uk, category, duration, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        name_cs,
        name_en,
        name_de,
        name_uk,
        category || null,
        duration || null,
        display_order || 0
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Služba vytvořena',
      id: Number(result.lastInsertRowid)
    });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření služby' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/services/:id - Update service
export async function PUT(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const { id, name_cs, name_en, name_de, name_uk, category, duration, display_order, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Chybí ID služby' },
        { status: 400 }
      );
    }

    const updates: string[] = [];
    const args: any[] = [];

    if (name_cs !== undefined) {
      updates.push('name_cs = ?');
      args.push(name_cs);
    }
    if (name_en !== undefined) {
      updates.push('name_en = ?');
      args.push(name_en);
    }
    if (name_de !== undefined) {
      updates.push('name_de = ?');
      args.push(name_de);
    }
    if (name_uk !== undefined) {
      updates.push('name_uk = ?');
      args.push(name_uk);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      args.push(category);
    }
    if (duration !== undefined) {
      updates.push('duration = ?');
      args.push(duration);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      args.push(display_order);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      args.push(is_active ? 1 : 0);
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
      sql: `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    return NextResponse.json({
      success: true,
      message: 'Služba aktualizována'
    });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci služby' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/:id - Delete service
export async function DELETE(request: NextRequest) {
  const user = await requireAuth(['admin'], request);
  if (user instanceof NextResponse) return user;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Chybí ID služby' },
        { status: 400 }
      );
    }

    await db.execute({
      sql: 'DELETE FROM services WHERE id = ?',
      args: [parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      message: 'Služba smazána'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání služby' },
      { status: 500 }
    );
  }
}
