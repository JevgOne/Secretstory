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

    // Check for time conflicts with existing bookings
    const conflictCheck = await db.execute({
      sql: `
        SELECT id FROM bookings
        WHERE girl_id = ?
          AND date = ?
          AND status NOT IN ('cancelled', 'rejected')
          AND (
            (start_time < ? AND end_time > ?) OR
            (start_time < ? AND end_time > ?) OR
            (start_time >= ? AND end_time <= ?)
          )
      `,
      args: [
        girl_id, date,
        end_time, start_time,
        end_time, end_time,
        start_time, end_time
      ]
    });

    if (conflictCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'Časový konflikt s existující rezervací' },
        { status: 409 }
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

    // Create notification for the girl
    try {
      await db.execute({
        sql: `
          INSERT INTO notifications (user_id, type, title, message, link, created_at)
          SELECT
            u.id,
            'booking_created',
            'Nová rezervace',
            'Máte novou rezervaci na ' || ? || ' v ' || ?,
            '/girl/dashboard',
            CURRENT_TIMESTAMP
          FROM users u
          WHERE u.girl_id = ? AND u.role = 'girl'
        `,
        args: [date, start_time, girl_id]
      });
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
      // Don't fail the booking if notification fails
    }

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
