"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { useLocations } from "@/lib/hooks/useLocations";

// Same color palette as girls management
const GIRL_COLORS: Record<string, { hex: string; name: string }> = {
  katy: { hex: '#ec4899', name: 'Katy' },
  ema: { hex: '#3b82f6', name: 'Ema' },
  daniela: { hex: '#8b5cf6', name: 'Daniela' },
  natalie: { hex: '#22c55e', name: 'Natalie' },
  sofia: { hex: '#f97316', name: 'Sofia' },
  victoria: { hex: '#06b6d4', name: 'Victoria' },
};

interface Event {
  id: number;
  girlId: string;
  title: string;
  client: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
  notes?: string;
bookingSource?: 'sms' | 'call' | 'whatsapp' | 'telegram' | 'web' | 'google_calendar';
}

// Booking source options with icons
const BOOKING_SOURCES = {
  call: { label: 'Hovor', icon: '📞' },
  sms: { label: 'SMS', icon: '💬' },
  whatsapp: { label: 'WhatsApp', icon: '📱' },
  telegram: { label: 'Telegram', icon: '✈️' },
  web: { label: 'Web', icon: '🌐' },
  google_calendar: { label: 'Google', icon: '📅' }
} as const;

interface Schedule {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface GirlSchedule {
  girl_id: number;
  girl_name: string;
  girl_color: string;
  schedules: Schedule[];
}

export default function CalendarPage() {
  const { primaryLocation } = useLocations();
  const router = useRouter();
  const [view, setView] = useState<'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedGirl, setSelectedGirl] = useState<string>('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const timeGridRef = useRef<HTMLDivElement>(null);

  // Visible calendars (girls) - all visible by default
  const [visibleCalendars, setVisibleCalendars] = useState<string[]>(
    Object.keys(GIRL_COLORS)
  );

  // Toggle calendar visibility
  const toggleCalendar = (girlId: string) => {
    setVisibleCalendars(prev =>
      prev.includes(girlId)
        ? prev.filter(id => id !== girlId)
        : [...prev, girlId]
    );
  };

  // Events from database
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Girl schedules from database
  const [girlSchedules, setGirlSchedules] = useState<GirlSchedule[]>([]);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();

      if (data.success) {
        // Convert bookings to events
        const convertedEvents: Event[] = data.bookings.map((booking: any) => ({
          id: booking.id,
          girlId: booking.girl_name?.toLowerCase() || 'unknown',
          title: 'Rezervace',
          client: booking.client_name || 'Klient',
          date: new Date(booking.date),
          startTime: booking.start_time.substring(0, 5), // HH:MM
          endTime: booking.end_time.substring(0, 5),
          location: booking.location || '',
          status: booking.status,
          notes: booking.notes,
          bookingSource: booking.booking_source || 'call'
        }));
        setEvents(convertedEvents);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch girl schedules from API
  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/admin/schedules');
      const data = await response.json();

      if (data.success) {
        setGirlSchedules(data.schedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const [newEvent, setNewEvent] = useState({
    girlId: 'katy',
    title: '',
    client: '',
    date: '',
    startTime: '14:00',
    endTime: '16:00',
    location: primaryLocation?.display_name || 'Praha 2',
    status: 'confirmed' as const,
bookingSource: 'call' as 'sms' | 'call' | 'whatsapp' | 'telegram' | 'web' | 'google_calendar'
  });

  // Get week days
  const getWeekDays = () => {
    const week = [];
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDays = view === 'week' ? getWeekDays() : [currentDate];

  // Format date
  const formatDate = (date: Date) => {
    const months = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatDay = (date: Date) => {
    const days = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
    return days[date.getDay()];
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Fetch bookings, schedules and scroll to current time on mount
  useEffect(() => {
    fetchBookings();
    fetchSchedules();

    if (timeGridRef.current) {
      const now = new Date();
      const hours = now.getHours();
      const scroll = (hours - 2) * 60; // Scroll to 2 hours before current time
      timeGridRef.current.scrollTop = Math.max(0, scroll);
    }
  }, []);

  // Get current time line position
  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours * 60 + minutes);
  };

  // Get event position and height
  const getEventStyle = (event: Event, dayIndex: number) => {
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);

    const top = (startHour * 60 + startMinute);
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

    return {
      top: `${top}px`,
      height: `${duration}px`,
      gridColumn: view === 'week' ? dayIndex + 2 : 2,
      gridRow: '1 / -1'
    };
  };

  // Get schedules for a specific day
  const getSchedulesForDay = (date: Date) => {
    const dayOfWeek = date.getDay();
    // Convert Sunday (0) to 6, and Monday-Saturday (1-6) to 0-5
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const daySchedules: { girlId: string; schedule: Schedule; color: string }[] = [];

    girlSchedules.forEach((girlSchedule) => {
      const girlId = girlSchedule.girl_name?.toLowerCase() || 'unknown';

      // Only include if calendar is visible
      if (!visibleCalendars.includes(girlId)) return;

      girlSchedule.schedules.forEach((schedule) => {
        if (schedule.day_of_week === adjustedDay) {
          daySchedules.push({
            girlId,
            schedule,
            color: GIRL_COLORS[girlId]?.hex || '#8b2942'
          });
        }
      });
    });

    return daySchedules;
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    // Filter by visible calendars
    if (!visibleCalendars.includes(event.girlId)) return false;

    if (view === 'week') {
      const eventDate = event.date;
      return weekDays.some(day => day.toDateString() === eventDate.toDateString());
    } else {
      return event.date.toDateString() === currentDate.toDateString();
    }
  });

  const openEventDetail = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const deleteEvent = async (eventId: number) => {
    if (!confirm('Opravdu chcete smazat tuto rezervaci?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh bookings list and close detail panel
        await fetchBookings();
        setSelectedEvent(null);
        alert('Rezervace byla úspěšně smazána');
      } else {
        alert('Chyba při mazání rezervace: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Chyba při mazání rezervace');
    }
  };

  const saveNewEvent = async () => {
    try {
      // Map girl names to IDs (based on seeded data)
      const girlNameToId: Record<string, number> = {
        'katy': 1,
        'ema': 2,
        'sofia': 3,
        'daniela': 4,
        'natalie': 5,
        'victoria': 6
      };

      const girlId = girlNameToId[newEvent.girlId.toLowerCase()] || 1;

      // Calculate duration in minutes
      const [startHour, startMin] = newEvent.startTime.split(':').map(Number);
      const [endHour, endMin] = newEvent.endTime.split(':').map(Number);
      const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          girl_id: girlId,
          created_by: 2, // Manager user ID
          client_name: newEvent.client || 'Klient',
          client_phone: '',
          date: newEvent.date,
          start_time: newEvent.startTime + ':00',
          end_time: newEvent.endTime + ':00',
          duration: duration,
          location: newEvent.location,
          location_type: 'incall',
          status: newEvent.status,
booking_source: newEvent.bookingSource
        })
      });

      if (response.ok) {
        // Refresh bookings
        await fetchBookings();
        setShowNewEventModal(false);
        setNewEvent({
          girlId: 'katy',
          title: '',
          client: '',
          date: '',
          startTime: '14:00',
          endTime: '16:00',
          location: primaryLocation?.display_name || 'Praha 2',
          status: 'confirmed',
bookingSource: 'call'
        });
      } else {
        console.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <>
      <AdminHeader title="Rezervace" showBack={true} />
      <div className="gcal-app">
        {/* HEADER */}
        <header className="gcal-header" style={{ marginTop: '0', paddingTop: '1rem' }}>
          <div className="header-top">
            <div className="header-left">
              <button className="back-btn" onClick={() => router.push('/manager/dashboard')} style={{ display: 'none' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <span className="current-date">{formatDate(currentDate)}</span>
          </div>
          <div className="header-right" style={{ display: 'flex', gap: '8px' }}>
            <button
              className="header-btn"
              onClick={() => router.push('/manager/settings/calendar')}
              title="Nastaveni Google Calendar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
            <button
              className={`header-btn ${showFilterBar ? 'active' : ''}`}
              onClick={() => setShowFilterBar(!showFilterBar)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="nav-row">
          <div className="nav-arrows">
            <button className="nav-arrow" onClick={goToPrevious}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button className="nav-arrow" onClick={goToNext}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
            <button className="today-btn" onClick={goToToday}>Dnes</button>
          </div>
          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'day' ? 'active' : ''}`}
              onClick={() => setView('day')}
            >
              Den
            </button>
            <button
              className={`view-btn ${view === 'week' ? 'active' : ''}`}
              onClick={() => setView('week')}
            >
              Týden
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - 3 COLUMN LAYOUT */}
      <div className="gcal-container">

        {/* LEFT SIDEBAR - Calendars List */}
        <div className="gcal-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Kalendáře</h3>
          </div>
          <div className="sidebar-calendars">
            {Object.entries(GIRL_COLORS).map(([id, { hex, name }]) => (
              <div key={id} className="calendar-item">
                <input
                  type="checkbox"
                  id={`cal-${id}`}
                  checked={visibleCalendars.includes(id)}
                  onChange={() => toggleCalendar(id)}
                  className="calendar-checkbox"
                  style={{ accentColor: hex }}
                />
                <label htmlFor={`cal-${id}`} className="calendar-label">
                  <span className="calendar-color" style={{ background: hex }}></span>
                  <span className="calendar-name">{name}</span>
                </label>
              </div>
            ))}
          </div>

          {/* LEGEND */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            fontSize: '0.8rem'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '12px', color: '#e0d0d5' }}>
              Legenda
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '12px',
                  background: 'rgba(139, 41, 66, 0.08)',
                  border: '2px solid rgba(139, 41, 66, 0.3)',
                  borderRadius: '2px'
                }}></div>
                <span style={{ color: '#9a8a8e' }}>Dostupná hodina</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '12px',
                  background: 'rgba(139, 41, 66, 0.2)',
                  borderLeft: '3px solid #8b2942',
                  borderRadius: '2px'
                }}></div>
                <span style={{ color: '#9a8a8e' }}>Rezervace</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER - CALENDAR */}
        <div className="gcal-main">
        {/* WEEK HEADER */}
        <div className={`week-header ${view === 'day' ? 'day-view' : ''}`}>
          <div className="week-header-spacer"></div>
          {weekDays.map((day, i) => (
            <div key={i} className={`week-day ${isToday(day) ? 'today' : ''}`}>
              <div className="week-day-name">{formatDay(day)}</div>
              <div className="week-day-number">{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* TIME GRID */}
        <div className="time-grid-container" ref={timeGridRef}>
          <div className={`time-grid ${view === 'day' ? 'day-view' : ''}`}>
            {/* TIME LABELS */}
            <div className="time-labels">
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="time-label">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* DAY COLUMNS */}
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className="day-column">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="hour-slot">
                    <div className="half-hour"></div>
                  </div>
                ))}

                {/* SCHEDULE AVAILABILITY BLOCKS (background) */}
                {getSchedulesForDay(day).map((scheduleItem, idx) => {
                  const [startHour, startMinute] = scheduleItem.schedule.start_time.substring(0, 5).split(':').map(Number);
                  const [endHour, endMinute] = scheduleItem.schedule.end_time.substring(0, 5).split(':').map(Number);

                  const top = (startHour * 60 + startMinute);
                  const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

                  return (
                    <div
                      key={`schedule-${idx}`}
                      style={{
                        position: 'absolute',
                        top: `${top}px`,
                        height: `${duration}px`,
                        left: '0',
                        right: '0',
                        background: `${scheduleItem.color}08`,
                        borderLeft: `2px solid ${scheduleItem.color}30`,
                        borderRight: `2px solid ${scheduleItem.color}30`,
                        zIndex: 1,
                        pointerEvents: 'none'
                      }}
                    />
                  );
                })}

                {/* EVENTS for this day */}
                {filteredEvents
                  .filter(event => event.date.toDateString() === day.toDateString())
                  .map(event => {
                    const style = getEventStyle(event, dayIndex);
                    const color = GIRL_COLORS[event.girlId];
                    return (
                      <div
                        key={event.id}
                        className={`event ${event.girlId} ${event.status}`}
                        style={{
                          position: 'absolute',
                          top: style.top,
                          height: style.height,
                          left: '2px',
                          right: '2px',
                          background: `${color.hex}20`,
                          borderLeft: `3px solid ${color.hex}`,
                          zIndex: 10
                        }}
                        onClick={() => openEventDetail(event)}
                      >
                        <div className="event-title">{event.title}</div>
                        <div className="event-time">{event.startTime} - {event.endTime}</div>
                        <div className="event-location">{event.location}</div>
                      </div>
                    );
                  })}
              </div>
            ))}

            {/* CURRENT TIME LINE */}
            {isToday(currentDate) && (
              <div
                className="current-time-line"
                style={{ top: `${getCurrentTimePosition()}px` }}
              />
            )}
          </div>
        </div>
        </div> {/* END gcal-main */}

        {/* RIGHT - EVENT DETAIL PANEL */}
        {selectedEvent && (
          <div className="gcal-detail">
            <div className="detail-header">
              <h3 className="detail-title">Detail rezervace</h3>
              <button
                className="detail-close"
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>
            </div>
            <div className="detail-body">
              <div className="detail-section">
                <div className="detail-label">Klient</div>
                <div className="detail-value">{selectedEvent.client}</div>
              </div>
              <div className="detail-section">
                <div className="detail-label">Dívka</div>
                <div className="detail-value">
                  <span
                    className="detail-girl-color"
                    style={{ background: GIRL_COLORS[selectedEvent.girlId]?.hex }}
                  ></span>
                  {GIRL_COLORS[selectedEvent.girlId]?.name}
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-label">Datum</div>
                <div className="detail-value">
                  {selectedEvent.date.toLocaleDateString('cs-CZ', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-label">Čas</div>
                <div className="detail-value">
                  {selectedEvent.startTime} - {selectedEvent.endTime}
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-label">Místo</div>
                <div className="detail-value">{selectedEvent.location}</div>
              </div>
              <div className="detail-section">
                <div className="detail-label">Stav</div>
                <div className="detail-value">
                  <span className={`status-badge ${selectedEvent.status}`}>
                    {selectedEvent.status === 'confirmed' ? 'Potvrzeno' :
                     selectedEvent.status === 'pending' ? 'Čeká' : 'Dokončeno'}
                  </span>
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-label">Zdroj</div>
                <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {selectedEvent.bookingSource && BOOKING_SOURCES[selectedEvent.bookingSource]?.icon}
                  </span>
                  <span>
                    {selectedEvent.bookingSource && BOOKING_SOURCES[selectedEvent.bookingSource]?.label}
                  </span>
                </div>
              </div>
              {selectedEvent.notes && (
                <div className="detail-section">
                  <div className="detail-label">Poznámky</div>
                  <div className="detail-value">{selectedEvent.notes}</div>
                </div>
              )}

              {/* DELETE BUTTON */}
              <div className="detail-actions" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  onClick={() => deleteEvent(selectedEvent.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  }}
                >
                  🗑️ Smazat rezervaci
                </button>
              </div>
            </div>
          </div>
        )}

      </div> {/* END gcal-container */}

      {/* FAB */}
      <button className="fab" onClick={() => setShowNewEventModal(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {/* NEW EVENT MODAL */}
      {showNewEventModal && (
        <div className={`modal-overlay ${showNewEventModal ? 'show' : ''}`} onClick={(e) => {
          if (e.target === e.currentTarget) setShowNewEventModal(false);
        }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Nová rezervace</span>
              <button className="modal-close" onClick={() => setShowNewEventModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Dívka</label>
                <div className="girl-select-grid">
                  {Object.entries(GIRL_COLORS).map(([id, { hex, name }]) => (
                    <div
                      key={id}
                      className={`girl-option ${newEvent.girlId === id ? 'selected' : ''}`}
                      onClick={() => setNewEvent({...newEvent, girlId: id})}
                    >
                      <div className="girl-option-name" style={{
                        color: hex,
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Klient</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Jméno klienta"
                  value={newEvent.client}
                  onChange={(e) => setNewEvent({...newEvent, client: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Typ komunikace</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  marginTop: '8px'
                }}>
                  {[
                    { value: 'sms', label: 'SMS' },
                    { value: 'call', label: 'Hovor' },
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'telegram', label: 'Telegram' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewEvent({...newEvent, bookingSource: option.value as any})}
                      style={{
                        padding: '12px 8px',
                        background: newEvent.bookingSource === option.value
                          ? 'rgba(139, 41, 66, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: newEvent.bookingSource === option.value
                          ? '2px solid #8b2942'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#e0d0d5',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (newEvent.bookingSource !== option.value) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (newEvent.bookingSource !== option.value) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Datum</label>
                <input
                  type="date"
                  className="form-input"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Od</label>
                  <input
                    type="time"
                    className="form-input"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Do</label>
                  <input
                    type="time"
                    className="form-input"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Místo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={primaryLocation?.display_name || 'Praha 2'}
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Zdroj rezervace</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px'
                }}>
                  {Object.entries(BOOKING_SOURCES).map(([key, { label, icon }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewEvent({...newEvent, bookingSource: key as typeof newEvent.bookingSource})}
                      style={{
                        padding: '10px 8px',
                        border: newEvent.bookingSource === key
                          ? '2px solid #8b2942'
                          : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        background: newEvent.bookingSource === key
                          ? 'rgba(139, 41, 66, 0.2)'
                          : 'rgba(255,255,255,0.05)',
                        color: newEvent.bookingSource === key ? '#e0d0d5' : '#9a8a8e',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowNewEventModal(false)}>
                Zrušit
              </button>
              <button className="modal-btn primary" onClick={saveNewEvent}>
                Vytvořit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVENT DETAIL MODAL */}
      {showEventModal && selectedEvent && (
        <div className={`modal-overlay ${showEventModal ? 'show' : ''}`} onClick={(e) => {
          if (e.target === e.currentTarget) setShowEventModal(false);
        }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Detail rezervace</span>
              <button className="modal-close" onClick={() => setShowEventModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="event-detail-header">
                <div
                  className={`event-detail-avatar ${selectedEvent.girlId}`}
                  style={{ background: `${GIRL_COLORS[selectedEvent.girlId].hex}20` }}
                >
                  👩
                </div>
                <div className="event-detail-info">
                  <h3>{GIRL_COLORS[selectedEvent.girlId].name}</h3>
                  <span className={`event-detail-status ${selectedEvent.status}`}>
                    {selectedEvent.status === 'confirmed' ? 'Potvrzeno' : 'Čeká'}
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Čas</div>
                  <div className="detail-value">{selectedEvent.startTime} - {selectedEvent.endTime}</div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Místo</div>
                  <div className="detail-value">{selectedEvent.location}</div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <div className="detail-label">Klient</div>
                  <div className="detail-value">{selectedEvent.client}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowEventModal(false)}>
                Zavřít
              </button>
              <button className="modal-btn primary">
                Upravit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
