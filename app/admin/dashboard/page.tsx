"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface Booking {
  id: number;
  girl_id: number;
  client_name: string;
  client_phone: string;
  duration: number;
  created_at: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

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
    }
  };

  const deleteBooking = async (bookingId: number) => {
    if (!confirm('Opravdu chcete smazat tuto rezervaci?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh bookings list
        fetchBookings();
        alert('Rezervace byla úspěšně smazána');
      } else {
        alert('Chyba při mazání rezervace: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Chyba při mazání rezervace');
    }
  };

  // Convert duration to points
  const getPoints = (duration: number): number => {
    if (duration === 60 || duration === 120) return 1000;
    if (duration === 45 || duration === 90) return 900;
    if (duration === 30) return 800;
    return 0;
  };

  // Filter ONLY completed bookings by time period
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedBookings = bookings.filter(b => b.status === 'completed');

  const todayBookings = completedBookings.filter(b => new Date(b.created_at) >= todayStart);
  const weekBookings = completedBookings.filter(b => new Date(b.created_at) >= weekStart);
  const monthBookings = completedBookings.filter(b => new Date(b.created_at) >= monthStart);

  // Calculate points (only from completed bookings)
  const todayPoints = todayBookings.reduce((sum, b) => sum + getPoints(b.duration), 0);
  const weekPoints = weekBookings.reduce((sum, b) => sum + getPoints(b.duration), 0);
  const monthPoints = monthBookings.reduce((sum, b) => sum + getPoints(b.duration), 0);

  // Calculate duration stats for calendar
  const bookings60min = bookings.filter(b => b.duration === 60 || b.duration === 120).length;
  const bookings45min = bookings.filter(b => b.duration === 45 || b.duration === 90).length;
  const bookings30min = bookings.filter(b => b.duration === 30).length;

  return (
    <>
      {/* HEADER */}
      <header className="app-header admin">
        <div className="app-header-left">
          <span className="app-admin-badge">Admin</span>
          <div className="app-header-title">Administrace</div>
        </div>
        <button className="app-header-btn" onClick={() => signOut({ callbackUrl: '/admin/login' })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </header>

      {/* CONTENT */}
      <main className="app-content">

        {/* SYSTEM STATUS */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, #231a1e 100%)',
          border: '1px solid #22c55e',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(34, 197, 94, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>✓</div>
          <div>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '2px' }}>Systém běží normálně</h3>
            <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>Všechny služby jsou dostupné</div>
          </div>
        </div>

        {/* STATISTIKY BODŮ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {/* DNES */}
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>📊 Dnes</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{todayPoints.toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>bodů • {todayBookings.length} rezervací</div>
          </div>

          {/* TÝDEN */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>📅 Týden (7 dní)</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{weekPoints.toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>bodů • {weekBookings.length} rezervací</div>
          </div>

          {/* MĚSÍC */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '8px' }}>📈 Měsíc</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{monthPoints.toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>bodů • {monthBookings.length} rezervací</div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <Link href="/manager/girls" style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textDecoration: 'none',
            color: 'white'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '12px',
              background: 'rgba(255,255,255,0.2)'
            }}>👩</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Správa dívek</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Profily a nastavení</div>
          </Link>

          <Link href="/manager/calendar" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            textDecoration: 'none',
            color: 'white'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '12px',
              background: 'rgba(255,255,255,0.2)'
            }}>📅</div>
            <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>Kalendář</div>

            {/* Duration statistics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', opacity: 0.95 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>60 min:</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{bookings60min}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>45 min:</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{bookings45min}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>30 min:</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{bookings30min}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* ADMIN MENU */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { icon: '👩', title: 'Dívky', count: 'Správa profilů', color: 'rgba(139, 92, 246, 0.15)', path: '/admin/girls' },
            { icon: '⭐', title: 'Recenze', count: 'Schvalování', color: 'rgba(251, 191, 36, 0.15)', path: '/admin/reviews' },
            { icon: '👥', title: 'Uživatelé', count: '15 uživatelů', color: 'rgba(139, 92, 246, 0.15)', path: '/admin/users' },
            { icon: '🏷️', title: 'Služby', count: '24 služeb', color: 'rgba(59, 130, 246, 0.15)', path: '/admin/services' },
            { icon: '📊', title: 'Statistiky', count: 'Reporty', color: 'rgba(234, 179, 8, 0.15)', path: '/admin/stats' },
            { icon: '⚙️', title: 'Nastavení', count: 'Systém', color: 'rgba(139, 41, 66, 0.15)', path: '/admin/settings' },
            { icon: '📋', title: 'Audit Log', count: 'Historie', color: 'rgba(239, 68, 68, 0.15)', path: '/admin/audit' }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => router.push(item.path)}
              style={{
                background: '#231a1e',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2d2428';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#231a1e';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                marginBottom: '12px',
                background: item.color
              }}>{item.icon}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>{item.count}</div>
            </div>
          ))}
        </div>

        {/* USERS */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>👥 Poslední uživatelé</h3>
            <a href="#" style={{ fontSize: '0.85rem', color: '#a33352', textDecoration: 'none' }}>Všichni →</a>
          </div>

          {[
            { avatar: '👩', name: 'Katy Nováková', role: 'Dívka • katy@lovelygirls.cz', status: 'active' },
            { avatar: '👔', name: 'Jana Manažerová', role: 'Manažer • jana@lovelygirls.cz', status: 'active' },
            { avatar: '👱‍♀️', name: 'Nová dívka', role: 'Dívka • nova@lovelygirls.cz', status: 'pending' }
          ].map((user, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px',
              background: '#231a1e',
              borderRadius: '12px',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#5c1c2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>{user.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '500', marginBottom: '2px' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>{user.role}</div>
              </div>
              <span style={{
                padding: '4px 10px',
                borderRadius: '100px',
                fontSize: '0.65rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                background: user.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                color: user.status === 'active' ? '#22c55e' : '#eab308'
              }}>
                {user.status === 'active' ? 'Aktivní' : 'Čeká'}
              </span>
            </div>
          ))}
        </section>

        {/* POSLEDNÍ REZERVACE */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>📅 Poslední rezervace</h3>
            <Link href="/manager/calendar" style={{ fontSize: '0.85rem', color: '#a33352', textDecoration: 'none' }}>
              Všechny →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#9a8a8e' }}>Klient</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#9a8a8e' }}>Telefon</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#9a8a8e' }}>Datum</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#9a8a8e' }}>Délka</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#9a8a8e' }}>Body</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#9a8a8e' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#9a8a8e' }}>Akce</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 10).map((booking) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 8px', fontSize: '0.85rem' }}>{booking.client_name}</td>
                    <td style={{ padding: '12px 8px', fontSize: '0.85rem', color: '#9a8a8e' }}>{booking.client_phone}</td>
                    <td style={{ padding: '12px 8px', fontSize: '0.85rem', color: '#9a8a8e' }}>
                      {new Date(booking.booking_date).toLocaleDateString('cs-CZ')}
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '0.85rem' }}>{booking.duration} min</td>
                    <td style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: '600' }}>
                      {booking.status === 'completed' ? getPoints(booking.duration) : '—'}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '100px',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background:
                          booking.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' :
                          booking.status === 'confirmed' ? 'rgba(59, 130, 246, 0.15)' :
                          booking.status === 'pending' ? 'rgba(234, 179, 8, 0.15)' :
                          'rgba(239, 68, 68, 0.15)',
                        color:
                          booking.status === 'completed' ? '#22c55e' :
                          booking.status === 'confirmed' ? '#3b82f6' :
                          booking.status === 'pending' ? '#eab308' :
                          '#ef4444'
                      }}>
                        {booking.status === 'completed' ? 'Proběhlo' :
                         booking.status === 'confirmed' ? 'Potvrzeno' :
                         booking.status === 'pending' ? 'Čeká' :
                         booking.status === 'cancelled' ? 'Zrušeno' :
                         'Nedorazil'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#ef4444',
                          fontSize: '0.75rem',
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
                        🗑️ Smazat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#9a8a8e',
              fontSize: '0.9rem'
            }}>
              Žádné rezervace
            </div>
          )}
        </section>

        {/* AUDIT LOG */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>📋 Audit Log</h3>
            <a href="#" style={{ fontSize: '0.85rem', color: '#a33352', textDecoration: 'none' }}>Vše →</a>
          </div>

          {[
            { icon: '🔑', bg: 'rgba(59, 130, 246, 0.15)', action: 'Přihlášení — Admin', details: 'IP: 185.x.x.x • před 5 min' },
            { icon: '✏️', bg: 'rgba(234, 179, 8, 0.15)', action: 'Profil upraven — Katy', details: 'Změna cen • před 23 min' },
            { icon: '➕', bg: 'rgba(34, 197, 94, 0.15)', action: 'Nový uživatel vytvořen', details: 'nova@lovelygirls.cz • před 1h' },
            { icon: '🗑️', bg: 'rgba(239, 68, 68, 0.15)', action: 'Recenze smazána', details: 'Spam content • před 3h' }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '12px',
              padding: '12px 0',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                flexShrink: 0,
                background: item.bg
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', marginBottom: '2px' }}>{item.action}</div>
                <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>{item.details}</div>
              </div>
            </div>
          ))}
        </section>

      </main>
    </>
  );
}
