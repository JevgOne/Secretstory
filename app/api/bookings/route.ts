import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/bookings - Get all bookings (with filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const girlId = searchParams.get('girl_id');
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    let sql = `
      SELECT
        b.*,
        g.name as girl_name,
        g.color as girl_color
      FROM bookings b
      LEFT JOIN girls g ON b.girl_id = g.id
      WHERE 1=1
    `;
    const args: any[] = [];

    if (girlId) {
      sql += ' AND b.girl_id = ?';
      args.push(parseInt(girlId));
    }

    if (date) {
      sql += ' AND b.date = ?';
      args.push(date);
    }

    if (status) {
      sql += ' AND b.status = ?';
      args.push(status);
    }

    sql += ' ORDER BY b.date DESC, b.start_time ASC';

    const result = await db.execute({ sql, args });

    return NextResponse.json({
      success: true,
      bookings: result.rows.map(row => ({
        ...row,
        services: row.services ? JSON.parse(row.services as string) : []
      }))
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání rezervací' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      girl_id,
      created_by,
      client_name,
      client_phone,
      client_email,
      date,
      start_time,
      end_time,
      duration,
      location,
      location_type,
      services,
      price,
      status,
      notes
    } = body;

    // Validate required fields
    if (!girl_id || !created_by || !date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje' },
        { status: 400 }
      );
    }

    // Insert booking
    const result = await db.execute({
      sql: `
        INSERT INTO bookings (
          girl_id, created_by, client_name, client_phone, client_email,
          date, start_time, end_time, duration, location, location_type,
          services, price, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        girl_id,
        created_by,
        client_name || null,
        client_phone || null,
        client_email || null,
        date,
        start_time,
        end_time,
        duration || null,
        location || null,
        location_type || 'incall',
        services ? JSON.stringify(services) : null,
        price || null,
        status || 'pending',
        notes || null
      ]
    });

    // TODO: Create notification for the girl
    // await createNotification(girl_id, 'booking_created', ...)

    return NextResponse.json({
      success: true,
      booking_id: result.lastInsertRowid,
      message: 'Rezervace vytvořena'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření rezervace' },
      { status: 500 }
    );
  }
}
