import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

// POST /api/admin/girls/:id/services - Assign services to girl
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin', 'manager']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const { serviceIds } = await request.json();

    if (!Array.isArray(serviceIds)) {
      return NextResponse.json(
        { error: 'serviceIds musí být pole' },
        { status: 400 }
      );
    }

    // Check if girl exists
    const girlResult = await db.execute({
      sql: 'SELECT id FROM girls WHERE id = ?',
      args: [parseInt(id)]
    });

    if (girlResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Profil nenalezen' },
        { status: 404 }
      );
    }

    // Delete existing services for this girl
    await db.execute({
      sql: 'DELETE FROM girl_services WHERE girl_id = ?',
      args: [parseInt(id)]
    });

    // Insert new services
    if (serviceIds.length > 0) {
      const values = serviceIds.map(serviceId =>
        `(${parseInt(id)}, ${parseInt(serviceId)})`
      ).join(', ');

      await db.execute({
        sql: `INSERT INTO girl_services (girl_id, service_id) VALUES ${values}`,
        args: []
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Služby aktualizovány'
    });
  } catch (error) {
    console.error('Assign services error:', error);
    return NextResponse.json(
      { error: 'Chyba při přiřazování služeb' },
      { status: 500 }
    );
  }
}

// GET /api/admin/girls/:id/services - Get services assigned to girl
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth(['admin', 'manager']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;

    const result = await db.execute({
      sql: `
        SELECT s.id, s.name_cs, s.name_en, s.name_de, s.name_uk, s.category, s.duration
        FROM services s
        INNER JOIN girl_services gs ON s.id = gs.service_id
        WHERE gs.girl_id = ? AND s.is_active = 1
        ORDER BY s.display_order, s.id
      `,
      args: [parseInt(id)]
    });

    return NextResponse.json({
      success: true,
      services: result.rows
    });
  } catch (error) {
    console.error('Get girl services error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání služeb' },
      { status: 500 }
    );
  }
}
