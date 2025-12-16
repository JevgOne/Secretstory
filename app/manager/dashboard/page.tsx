"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

interface Booking {
  id: number;
  girl_id: number;
  girl_name: string;
  girl_color: string;
  client_name: string;
  client_phone: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  location: string;
  location_type: string;
  status: string;
}

export default function ManagerDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' })
      });

      if (response.ok) {
        // Refresh bookings
        fetchBookings();
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        // Refresh bookings
        fetchBookings();
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  // Calculate stats from bookings
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today);
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  const formatTime = (time: string) => {
    return time.substring(0, 5); // HH:MM
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  return (
    <>
      <AdminHeader title="Manager Panel" showBack={true} />

      {/* CONTENT */}
      <main className="app-content">

        {/* ALERTS */}
        {pendingBookings.length > 0 && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.08)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderLeft: '4px solid #eab308'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              flexShrink: 0,
              background: 'rgba(234, 179, 8, 0.2)'
            }}>⏳</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '2px' }}>
                {pendingBookings.length} čekající rezervace
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>Vyžadují potvrzení</div>
            </div>
            <button style={{
              padding: '8px 14px',
              background: '#2d242a',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>Zobrazit</button>
          </div>
        )}

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {[
            { value: todayBookings.length.toString(), label: 'Dnes' },
            { value: bookings.length.toString(), label: 'Celkem' },
            { value: pendingBookings.length.toString(), label: 'Čeká' },
            { value: '4.8', label: 'Rating' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#231a1e', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</div>
              <div style={{ fontSize: '0.65rem', color: '#9a8a8e', textTransform: 'uppercase', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* PENDING BOOKINGS */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Čekající rezervace
              {pendingBookings.length > 0 && (
                <span style={{ background: '#8b2942', color: 'white', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '100px' }}>
                  {pendingBookings.length}
                </span>
              )}
            </h3>
            <Link href="/manager/calendar" style={{ fontSize: '0.85rem', color: '#a33352', textDecoration: 'none' }}>Vše →</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9a8a8e' }}>
              Načítání...
            </div>
          ) : pendingBookings.length === 0 ? (
            <div style={{
              background: '#231a1e',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              color: '#9a8a8e'
            }}>
              ✓ Žádné čekající rezervace
            </div>
          ) : (
            pendingBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} style={{
                background: '#231a1e',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '10px',
                border: '1px solid rgba(234, 179, 8, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: booking.girl_color || '#5c1c2e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      border: `2px solid ${booking.girl_color || '#5c1c2e'}`
                    }}>👩</div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{booking.girl_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>
                        {booking.date === today ? 'Dnes' : booking.date} {formatTime(booking.start_time)} — {formatDuration(booking.duration)}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#ccc', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a8a8e" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {booking.location_type === 'incall' ? 'Incall' : 'Outcall'} — {booking.location}
                  </div>
                  {booking.client_phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a8a8e" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
                      </svg>
                      {booking.client_phone}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleConfirmBooking(booking.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: '#22c55e',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>✓ Potvrdit</button>
                  <button
                    onClick={() => handleRejectBooking(booking.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: '#2d242a',
                      color: '#ccc'
                    }}>✕ Odmítnout</button>
                </div>
              </div>
            ))
          )}
        </section>

        {/* TODAY'S BOOKINGS */}
        {todayBookings.length > 0 && (
          <section style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>📋 Dnešní rezervace</h3>
              <Link href="/manager/calendar" style={{ fontSize: '0.85rem', color: '#a33352', textDecoration: 'none' }}>Kalendář →</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} style={{
                  background: '#231a1e',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: booking.status === 'confirmed' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: booking.girl_color || '#5c1c2e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem'
                  }}>👩</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{booking.girl_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '100px',
                    fontSize: '0.65rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: booking.status === 'confirmed' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                    color: booking.status === 'confirmed' ? '#22c55e' : '#eab308'
                  }}>
                    {booking.status === 'confirmed' ? 'Potvrzeno' : booking.status === 'pending' ? 'Čeká' : booking.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* FAB */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: 'calc(50% - 175px)',
        width: '56px',
        height: '56px',
        background: 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(139, 41, 66, 0.4)',
        cursor: 'pointer',
        zIndex: 90
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>

    </>
  );
}
