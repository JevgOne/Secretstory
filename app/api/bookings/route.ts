import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';
import { sendBookingNotification } from '@/lib/email';
import { syncBookingToGoogle } from '@/lib/calendar-sync';

// GET /api/bookings - Get all bookings (with filters)
export async function GET(request: NextRequest) {
  // Require authentication - admin, manager, or girl
  const user = await requireAuth(['admin', 'manager', 'girl']);
  if (user instanceof NextResponse) return user;

  try {
    const searchParams = request.nextUrl.searchParams;
    const girlId = searchParams.get('girl_id');
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    let sql = `
      SELECT
        b.*,
        b.booking_source,
        g.name as girl_name,
        g.color as girl_color
      FROM bookings b
      LEFT JOIN girls g ON b.girl_id = g.id
      WHERE 1=1
    `;
    const args: any[] = [];

    // Role-based filtering: Girls can only see their own bookings
    if (user.role === 'girl' && user.girlId) {
      sql += ' AND b.girl_id = ?';
      args.push(user.girlId);
    } else if (girlId) {
      // Admin/Manager can filter by girl_id
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
  // Require authentication - admin or manager only
  const user = await requireAuth(['admin', 'manager']);
  if (user instanceof NextResponse) return user;

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
      notes,
booking_source
    } = body;

    // Validate required fields
    if (!girl_id || !created_by || !date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Chybí povinné údaje' },
        { status: 400 }
      );
    }

    // Check for time conflicts with existing bookings
    // Overlap occurs if: NOT (existing ends before new starts OR existing starts after new ends)
    const conflictCheck = await db.execute({
      sql: `
        SELECT id FROM bookings
        WHERE girl_id = ?
          AND date = ?
          AND status NOT IN ('cancelled', 'rejected')
          AND NOT (end_time <= ? OR start_time >= ?)
      `,
      args: [
        girl_id, date,
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
services, price, status, notes, booking_source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        notes || null,
booking_source || 'call'
      ]
    });

    const bookingId = Number(result.lastInsertRowid);

    // Create in-app notification for the girl
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

    // Send email notifications (non-blocking, runs in background)
    Promise.all([
      // Get girl's email and name
      db.execute({
        sql: 'SELECT name, email FROM girls WHERE id = ?',
        args: [girl_id]
      }),
      // Get manager's email (the one who created the booking)
      db.execute({
        sql: 'SELECT email FROM users WHERE id = ?',
        args: [created_by]
      })
    ]).then(([girlResult, managerResult]) => {
      const girl = girlResult.rows[0];
      const manager = managerResult.rows[0];

      if (girl?.email && manager?.email) {
        sendBookingNotification({
          girlEmail: girl.email as string,
          girlName: girl.name as string,
          managerEmail: manager.email as string,
          customerName: client_name || 'Zákazník',
          date: date,
          time: `${start_time} - ${end_time}`,
          bookingId
        }).catch(error => {
          console.error('Failed to send booking emails:', error);
          // Email failure doesn't affect booking creation
        });
      }
    }).catch(error => {
      console.error('Failed to fetch email data:', error);
    });

    // Sync to Google Calendar (non-blocking)
    syncBookingToGoogle(bookingId, created_by).catch(error => {
      console.error('Failed to sync booking to Google Calendar:', error);
      // Google sync failure doesn't affect booking creation
    });

    return NextResponse.json({
      success: true,
      booking_id: bookingId,
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
