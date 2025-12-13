import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/locations/[id] - Get location by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await db.execute({
      sql: 'SELECT * FROM locations WHERE id = ?',
      args: [parseInt(id)]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Pobočka nenalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      location: result.rows[0]
    });
  } catch (error: any) {
    console.error('Get location error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/locations/[id] - Update location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      display_name,
      address,
      postal_code,
      city,
      district,
      coordinates,
      phone,
      email,
      description,
      is_active,
      is_primary
    } = body;

    // Validate required fields
    if (!name || !display_name || !city) {
      return NextResponse.json(
        { error: 'Vyplňte povinná pole: název, zobrazovaný název a město' },
        { status: 400 }
      );
    }

    // If setting as primary, unset other primary locations
    if (is_primary) {
      await db.execute({
        sql: 'UPDATE locations SET is_primary = 0 WHERE is_primary = 1 AND id != ?',
        args: [parseInt(id)]
      });
    }

    await db.execute({
      sql: `
        UPDATE locations SET
          name = ?,
          display_name = ?,
          address = ?,
          postal_code = ?,
          city = ?,
          district = ?,
          coordinates = ?,
          phone = ?,
          email = ?,
          description = ?,
          is_active = ?,
          is_primary = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        name,
        display_name,
        address || null,
        postal_code || null,
        city,
        district || null,
        coordinates || null,
        phone || null,
        email || null,
        description || null,
        is_active ?? 1,
        is_primary ?? 0,
        parseInt(id)
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Pobočka byla úspěšně aktualizována'
    });
  } catch (error: any) {
    console.error('Update location error:', error);

    if (error.message?.includes('UNIQUE')) {
      return NextResponse.json(
        { error: 'Pobočka s tímto názvem již existuje' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/locations/[id] - Delete location
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if it's the primary location
    const checkResult = await db.execute({
      sql: 'SELECT is_primary FROM locations WHERE id = ?',
      args: [parseInt(id)]
    });

    if (checkResult.rows.length > 0 && checkResult.rows[0].is_primary) {
      return NextResponse.json(
        { error: 'Nelze smazat hlavní pobočku. Nejprve nastavte jinou jako hlavní.' },
        { status: 400 }
      );
    }

    await db.execute({
      sql: 'DELETE FROM locations WHERE id = ?',
      args: [parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      message: 'Pobočka byla úspěšně smazána'
    });
  } catch (error: any) {
    console.error('Delete location error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
