import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';
import { syncBookingToGoogle, deleteBookingFromGoogle } from '@/lib/calendar-sync';

// GET /api/bookings/:id - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require authentication
  const user = await requireAuth(['admin', 'manager', 'girl']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const result = await db.execute({
      sql: `
        SELECT
          b.*,
          g.name as girl_name,
          g.color as girl_color
        FROM bookings b
        LEFT JOIN girls g ON b.girl_id = g.id
        WHERE b.id = ?
      `,
      args: [parseInt(id)]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Rezervace nenalezena' },
        { status: 404 }
      );
    }

    const booking = result.rows[0];

    // Girls can only see their own bookings
    if (user.role === 'girl' && booking.girl_id !== user.girlId) {
      return NextResponse.json(
        { error: 'Nemáte oprávnění k této rezervaci' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        services: booking.services ? JSON.parse(booking.services as string) : []
      }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání rezervace' },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/:id - Update booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin and manager can update bookings
  const user = await requireAuth(['admin', 'manager']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const body = await request.json();
    const updates: string[] = [];
    const args: any[] = [];

    // Build dynamic update query
    const allowedFields = [
      'client_name', 'client_phone', 'client_email',
      'date', 'start_time', 'end_time', 'duration',
      'location', 'location_type', 'price', 'status', 'notes'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        args.push(body[field]);
      }
    }

    if (body.services) {
      updates.push('services = ?');
      args.push(JSON.stringify(body.services));
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
      sql: `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    // Sync to Google Calendar (non-blocking)
    syncBookingToGoogle(parseInt(id), user.id).catch(error => {
      console.error('Failed to sync booking update to Google Calendar:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Rezervace aktualizována'
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci rezervace' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/:id - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admin and manager can delete bookings
  const user = await requireAuth(['admin', 'manager']);
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const bookingId = parseInt(id);

    // Delete from Google Calendar first (non-blocking)
    deleteBookingFromGoogle(bookingId, user.id).catch(error => {
      console.error('Failed to delete booking from Google Calendar:', error);
    });

    await db.execute({
      sql: 'DELETE FROM bookings WHERE id = ?',
      args: [bookingId]
    });

    return NextResponse.json({
      success: true,
      message: 'Rezervace smazána'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání rezervace' },
      { status: 500 }
    );
  }
}
