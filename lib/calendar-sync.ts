/**
 * Calendar Synchronization Service
 * Handles bidirectional sync between local bookings and Google Calendar
 */

import { db } from '@/lib/db';
import {
  GoogleTokens,
  CalendarEvent,
  getValidAccessToken,
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  listEvents,
  bookingToCalendarEvent,
  calendarEventToBookingUpdate,
  getBookingIdFromEvent
} from '@/lib/google-calendar';

// Types
interface GoogleCalendarToken {
  id: number;
  user_id: number;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  calendar_id: string;
  sync_enabled: number;
  last_sync_at: string | null;
  sync_token: string | null;
}

interface Booking {
  id: number;
  girl_id: number;
  created_by: number;
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  date: string;
  start_time: string;
  end_time: string;
  duration: number | null;
  location: string | null;
  location_type: string | null;
  services: string | null;
  price: number | null;
  status: string;
  notes: string | null;
  booking_source: string | null;
  google_event_id: string | null;
  sync_status: string | null;
  last_synced_at: string | null;
}

interface SyncResult {
  success: boolean;
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  bookingsCreated: number;
  bookingsUpdated: number;
  errors: string[];
}

/**
 * Get Google Calendar tokens for a user
 */
export async function getUserTokens(userId: number): Promise<GoogleCalendarToken | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM google_calendar_tokens WHERE user_id = ? AND sync_enabled = 1',
    args: [userId]
  });

  if (result.rows.length === 0) return null;
  return result.rows[0] as unknown as GoogleCalendarToken;
}

/**
 * Update stored tokens after refresh
 */
async function updateStoredTokens(userId: number, tokens: GoogleTokens): Promise<void> {
  await db.execute({
    sql: `
      UPDATE google_calendar_tokens
      SET access_token = ?, expires_at = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `,
    args: [tokens.access_token, tokens.expires_at.toISOString(), userId]
  });
}

/**
 * Get girl name by ID
 */
async function getGirlName(girlId: number): Promise<string> {
  const result = await db.execute({
    sql: 'SELECT name FROM girls WHERE id = ?',
    args: [girlId]
  });
  return (result.rows[0]?.name as string) || 'Rezervace';
}

/**
 * Sync a single booking to Google Calendar
 */
export async function syncBookingToGoogle(
  bookingId: number,
  userId: number
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    // Get user's Google tokens
    const tokenData = await getUserTokens(userId);
    if (!tokenData) {
      return { success: false, error: 'Google Calendar není připojen' };
    }

    // Get valid access token
    const { accessToken, newTokens } = await getValidAccessToken(
      tokenData.access_token,
      tokenData.refresh_token,
      new Date(tokenData.expires_at)
    );

    // Update tokens if refreshed
    if (newTokens) {
      await updateStoredTokens(userId, newTokens);
    }

    // Get booking data
    const bookingResult = await db.execute({
      sql: 'SELECT * FROM bookings WHERE id = ?',
      args: [bookingId]
    });

    if (bookingResult.rows.length === 0) {
      return { success: false, error: 'Rezervace nenalezena' };
    }

    const booking = bookingResult.rows[0] as unknown as Booking;

    // Get girl name
    const girlName = await getGirlName(booking.girl_id);

    // Convert booking to calendar event
    const eventData = bookingToCalendarEvent(
      {
        id: booking.id,
        date: booking.date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        client_name: booking.client_name || undefined,
        location: booking.location || undefined,
        notes: booking.notes || undefined,
        services: booking.services ? JSON.parse(booking.services) : undefined
      },
      girlName
    );

    let eventId = booking.google_event_id;

    if (eventId) {
      // Update existing event
      try {
        await updateEvent(accessToken, tokenData.calendar_id, eventId, eventData);
      } catch (err) {
        // Event might have been deleted, create new one
        const newEvent = await createEvent(accessToken, tokenData.calendar_id, eventData);
        eventId = newEvent.id!;
      }
    } else {
      // Create new event
      const newEvent = await createEvent(accessToken, tokenData.calendar_id, eventData);
      eventId = newEvent.id!;
    }

    // Update booking with event ID
    await db.execute({
      sql: `
        UPDATE bookings
        SET google_event_id = ?, sync_status = 'synced', last_synced_at = datetime('now')
        WHERE id = ?
      `,
      args: [eventId, bookingId]
    });

    return { success: true, eventId };

  } catch (error) {
    console.error('Sync booking to Google error:', error);

    // Mark as error
    await db.execute({
      sql: `UPDATE bookings SET sync_status = 'error' WHERE id = ?`,
      args: [bookingId]
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Neznámá chyba'
    };
  }
}

/**
 * Delete booking's Google Calendar event
 */
export async function deleteBookingFromGoogle(
  bookingId: number,
  userId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user's Google tokens
    const tokenData = await getUserTokens(userId);
    if (!tokenData) {
      return { success: true }; // No Google connected, nothing to delete
    }

    // Get booking to find event ID
    const bookingResult = await db.execute({
      sql: 'SELECT google_event_id FROM bookings WHERE id = ?',
      args: [bookingId]
    });

    const eventId = bookingResult.rows[0]?.google_event_id as string | null;
    if (!eventId) {
      return { success: true }; // No event to delete
    }

    // Get valid access token
    const { accessToken, newTokens } = await getValidAccessToken(
      tokenData.access_token,
      tokenData.refresh_token,
      new Date(tokenData.expires_at)
    );

    if (newTokens) {
      await updateStoredTokens(userId, newTokens);
    }

    // Delete event
    await deleteEvent(accessToken, tokenData.calendar_id, eventId);

    return { success: true };

  } catch (error) {
    console.error('Delete booking from Google error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Neznámá chyba'
    };
  }
}

/**
 * Sync all bookings for a girl to Google Calendar
 */
export async function syncAllBookingsForGirl(
  girlId: number,
  userId: number
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    eventsCreated: 0,
    eventsUpdated: 0,
    eventsDeleted: 0,
    bookingsCreated: 0,
    bookingsUpdated: 0,
    errors: []
  };

  try {
    // Get pending bookings for this girl
    const bookingsResult = await db.execute({
      sql: `
        SELECT id FROM bookings
        WHERE girl_id = ? AND (sync_status IS NULL OR sync_status = 'pending')
        AND status NOT IN ('cancelled', 'rejected')
      `,
      args: [girlId]
    });

    for (const row of bookingsResult.rows) {
      const syncResult = await syncBookingToGoogle(row.id as number, userId);
      if (syncResult.success) {
        if (syncResult.eventId) {
          result.eventsCreated++;
        }
      } else {
        result.errors.push(`Booking ${row.id}: ${syncResult.error}`);
      }
    }

  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Neznámá chyba');
  }

  return result;
}

/**
 * Import events from Google Calendar to local bookings
 * Used for initial sync when connecting Google Calendar
 */
export async function importFromGoogleCalendar(
  userId: number,
  girlId: number,
  daysBack: number = 30,
  daysForward: number = 90
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    eventsCreated: 0,
    eventsUpdated: 0,
    eventsDeleted: 0,
    bookingsCreated: 0,
    bookingsUpdated: 0,
    errors: []
  };

  try {
    // Get user's Google tokens
    const tokenData = await getUserTokens(userId);
    if (!tokenData) {
      result.success = false;
      result.errors.push('Google Calendar není připojen');
      return result;
    }

    // Get valid access token
    const { accessToken, newTokens } = await getValidAccessToken(
      tokenData.access_token,
      tokenData.refresh_token,
      new Date(tokenData.expires_at)
    );

    if (newTokens) {
      await updateStoredTokens(userId, newTokens);
    }

    // Calculate time range
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - daysBack);

    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + daysForward);

    // List events from Google Calendar
    const eventsResponse = await listEvents(accessToken, tokenData.calendar_id, {
      timeMin,
      timeMax,
      maxResults: 250
    });

    // Process each event
    for (const event of eventsResponse.items) {
      // Skip events that are already linked to a booking
      const existingBookingId = getBookingIdFromEvent(event);
      if (existingBookingId) {
        // This event was created by our system, skip
        continue;
      }

      // Skip all-day events (no dateTime)
      if (!event.start?.dateTime || !event.end?.dateTime) {
        continue;
      }

      // Check if event already imported (by google_event_id)
      const existingResult = await db.execute({
        sql: 'SELECT id FROM bookings WHERE google_event_id = ?',
        args: [event.id]
      });

      if (existingResult.rows.length > 0) {
        // Already imported, update if needed
        const bookingUpdate = calendarEventToBookingUpdate(event);
        if (bookingUpdate) {
          await db.execute({
            sql: `
              UPDATE bookings
              SET date = ?, start_time = ?, end_time = ?,
                  location = COALESCE(?, location),
                  sync_status = 'synced', last_synced_at = datetime('now')
              WHERE google_event_id = ?
            `,
            args: [
              bookingUpdate.date,
              bookingUpdate.start_time,
              bookingUpdate.end_time,
              bookingUpdate.location,
              event.id
            ]
          });
          result.bookingsUpdated++;
        }
        continue;
      }

      // Create new booking from Google event
      const bookingData = calendarEventToBookingUpdate(event);
      if (bookingData) {
        // Calculate duration
        const [startHour, startMin] = bookingData.start_time.split(':').map(Number);
        const [endHour, endMin] = bookingData.end_time.split(':').map(Number);
        const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);

        await db.execute({
          sql: `
            INSERT INTO bookings (
              girl_id, created_by, client_name, date, start_time, end_time,
              duration, location, status, booking_source,
              google_event_id, sync_status, last_synced_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'google_calendar', ?, 'synced', datetime('now'))
          `,
          args: [
            girlId,
            userId,
            event.summary || 'Import z Google',
            bookingData.date,
            bookingData.start_time,
            bookingData.end_time,
            duration,
            bookingData.location,
            event.id
          ]
        });
        result.bookingsCreated++;
      }
    }

    // Update last sync time
    await db.execute({
      sql: `
        UPDATE google_calendar_tokens
        SET last_sync_at = datetime('now'), sync_token = ?
        WHERE user_id = ?
      `,
      args: [eventsResponse.nextSyncToken || null, userId]
    });

  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Neznámá chyba');
  }

  return result;
}

/**
 * Full bidirectional sync for a user
 */
export async function fullSync(userId: number, girlId: number): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    eventsCreated: 0,
    eventsUpdated: 0,
    eventsDeleted: 0,
    bookingsCreated: 0,
    bookingsUpdated: 0,
    errors: []
  };

  try {
    // First, import from Google (this will create/update local bookings)
    const importResult = await importFromGoogleCalendar(userId, girlId);
    result.bookingsCreated += importResult.bookingsCreated;
    result.bookingsUpdated += importResult.bookingsUpdated;
    result.errors.push(...importResult.errors);

    // Then, sync local bookings to Google
    const exportResult = await syncAllBookingsForGirl(girlId, userId);
    result.eventsCreated += exportResult.eventsCreated;
    result.eventsUpdated += exportResult.eventsUpdated;
    result.errors.push(...exportResult.errors);

    if (importResult.errors.length > 0 || exportResult.errors.length > 0) {
      result.success = false;
    }

  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Neznámá chyba');
  }

  return result;
}
