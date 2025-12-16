import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/admin/locations - Get all locations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const sql = activeOnly
      ? 'SELECT * FROM locations WHERE is_active = 1 ORDER BY is_primary DESC, display_name ASC'
      : 'SELECT * FROM locations ORDER BY is_primary DESC, display_name ASC';

    const result = await db.execute(sql);

    return NextResponse.json({
      success: true,
      locations: result.rows
    });
  } catch (error: any) {
    console.error('Get locations error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/admin/locations - Create new location
export async function POST(request: NextRequest) {
  try {
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
      is_active = 1,
      is_primary = 0
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
      await db.execute('UPDATE locations SET is_primary = 0 WHERE is_primary = 1');
    }

    const result = await db.execute({
      sql: `
        INSERT INTO locations
        (name, display_name, address, postal_code, city, district, coordinates, phone, email, description, is_active, is_primary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        is_active,
        is_primary
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Pobočka byla úspěšně vytvořena',
      location_id: Number(result.lastInsertRowid)
    });
  } catch (error: any) {
    console.error('Create location error:', error);

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
