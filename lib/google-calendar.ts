/**
 * Google Calendar Integration Library
 * Handles OAuth, token management, and Calendar API operations
 */

// Types
export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  scope: string;
  token_type: string;
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: { email: string }[];
  extendedProperties?: {
    private: {
      bookingId: string;
      source: string;
    };
  };
  etag?: string;
  updated?: string;
}

export interface CalendarEventListResponse {
  items: CalendarEvent[];
  nextSyncToken?: string;
  nextPageToken?: string;
}

// Constants
const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
].join(' ');
const TIMEZONE = 'Europe/Prague';

/**
 * Generate OAuth URL for Google Calendar authorization
 */
export function getAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state
  });

  return `${GOOGLE_OAUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<GoogleTokens> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
      code
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: new Date(Date.now() + data.expires_in * 1000),
    scope: data.scope,
    token_type: data.token_type
  };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data = await response.json();

  return {
    access_token: data.access_token,
    refresh_token: refreshToken, // Keep original refresh token
    expires_at: new Date(Date.now() + data.expires_in * 1000),
    scope: data.scope || SCOPES,
    token_type: data.token_type
  };
}

/**
 * Check if token is expired (with 5 minute buffer)
 */
export function isTokenExpired(expiresAt: Date): boolean {
  const buffer = 5 * 60 * 1000; // 5 minutes
  return new Date().getTime() > new Date(expiresAt).getTime() - buffer;
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(
  accessToken: string,
  refreshToken: string,
  expiresAt: Date
): Promise<{ accessToken: string; newTokens?: GoogleTokens }> {
  if (!isTokenExpired(expiresAt)) {
    return { accessToken };
  }

  const newTokens = await refreshAccessToken(refreshToken);
  return {
    accessToken: newTokens.access_token,
    newTokens
  };
}

/**
 * Create a calendar event
 */
export async function createEvent(
  accessToken: string,
  calendarId: string = 'primary',
  event: Omit<CalendarEvent, 'id'>
): Promise<CalendarEvent> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create event: ${error}`);
  }

  return response.json();
}

/**
 * Update a calendar event
 */
export async function updateEvent(
  accessToken: string,
  calendarId: string = 'primary',
  eventId: string,
  event: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update event: ${error}`);
  }

  return response.json();
}

/**
 * Delete a calendar event
 */
export async function deleteEvent(
  accessToken: string,
  calendarId: string = 'primary',
  eventId: string
): Promise<void> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok && response.status !== 410) { // 410 = already deleted
    const error = await response.text();
    throw new Error(`Failed to delete event: ${error}`);
  }
}

/**
 * Get a single calendar event
 */
export async function getEvent(
  accessToken: string,
  calendarId: string = 'primary',
  eventId: string
): Promise<CalendarEvent | null> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get event: ${error}`);
  }

  return response.json();
}

/**
 * List calendar events within a time range
 */
export async function listEvents(
  accessToken: string,
  calendarId: string = 'primary',
  options: {
    timeMin?: Date;
    timeMax?: Date;
    syncToken?: string;
    maxResults?: number;
    pageToken?: string;
  } = {}
): Promise<CalendarEventListResponse> {
  const params = new URLSearchParams();

  if (options.timeMin) {
    params.set('timeMin', options.timeMin.toISOString());
  }
  if (options.timeMax) {
    params.set('timeMax', options.timeMax.toISOString());
  }
  if (options.syncToken) {
    params.set('syncToken', options.syncToken);
  }
  if (options.maxResults) {
    params.set('maxResults', options.maxResults.toString());
  }
  if (options.pageToken) {
    params.set('pageToken', options.pageToken);
  }

  params.set('singleEvents', 'true');
  params.set('orderBy', 'startTime');

  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list events: ${error}`);
  }

  return response.json();
}

/**
 * Set up webhook for push notifications (watch calendar)
 */
export async function watchCalendar(
  accessToken: string,
  calendarId: string = 'primary',
  webhookUrl: string,
  channelId: string
): Promise<{
  resourceId: string;
  expiration: Date;
}> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events/watch`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: channelId,
        type: 'web_hook',
        address: webhookUrl,
        params: {
          ttl: '604800' // 7 days in seconds
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to watch calendar: ${error}`);
  }

  const data = await response.json();

  return {
    resourceId: data.resourceId,
    expiration: new Date(parseInt(data.expiration))
  };
}

/**
 * Stop watching a calendar (remove webhook)
 */
export async function stopWatching(
  accessToken: string,
  channelId: string,
  resourceId: string
): Promise<void> {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/channels/stop`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: channelId,
        resourceId
      })
    }
  );

  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    throw new Error(`Failed to stop watching: ${error}`);
  }
}

/**
 * Convert booking data to Google Calendar event format
 */
export function bookingToCalendarEvent(
  booking: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    client_name?: string;
    location?: string;
    notes?: string;
    services?: string[];
  },
  girlName: string
): Omit<CalendarEvent, 'id'> {
  // Combine date and time into ISO datetime
  const startDateTime = `${booking.date}T${booking.start_time}`;
  const endDateTime = `${booking.date}T${booking.end_time}`;

  // Build description
  let description = '';
  if (booking.client_name) {
    description += `Klient: ${booking.client_name}\n`;
  }
  if (booking.services && booking.services.length > 0) {
    description += `Služby: ${booking.services.join(', ')}\n`;
  }
  if (booking.notes) {
    description += `\nPoznámky: ${booking.notes}`;
  }

  return {
    summary: `${girlName} - ${booking.client_name || 'Rezervace'}`,
    description: description || undefined,
    location: booking.location || undefined,
    start: {
      dateTime: startDateTime,
      timeZone: TIMEZONE
    },
    end: {
      dateTime: endDateTime,
      timeZone: TIMEZONE
    },
    extendedProperties: {
      private: {
        bookingId: booking.id.toString(),
        source: 'lovelygirls'
      }
    }
  };
}

/**
 * Parse Google Calendar event to booking update data
 */
export function calendarEventToBookingUpdate(event: CalendarEvent): {
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  notes?: string;
} | null {
  if (!event.start?.dateTime || !event.end?.dateTime) {
    return null;
  }

  const startDate = new Date(event.start.dateTime);
  const endDate = new Date(event.end.dateTime);

  const date = startDate.toISOString().split('T')[0];
  const start_time = startDate.toTimeString().substring(0, 5) + ':00';
  const end_time = endDate.toTimeString().substring(0, 5) + ':00';

  return {
    date,
    start_time,
    end_time,
    location: event.location,
    notes: event.description
  };
}

/**
 * Get booking ID from calendar event (if linked)
 */
export function getBookingIdFromEvent(event: CalendarEvent): number | null {
  const bookingId = event.extendedProperties?.private?.bookingId;
  if (!bookingId) return null;

  const id = parseInt(bookingId);
  return isNaN(id) ? null : id;
}
