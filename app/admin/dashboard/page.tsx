"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

interface Booking {
  id: number;
  girl_id: number;
  girl_name?: string;
  client_name: string;
  client_phone: string;
  duration: number;
  created_at: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  final_price?: number;
  original_price?: number;
  discount_type?: string;
  discount_percentage?: number;
}

interface DashboardStats {
  girlsCount: number;
  reviewsCount: number;
  usersCount: number;
  servicesCount: number;
}

type PeriodType = 'day' | 'week' | 'month' | 'year';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    girlsCount: 0,
    reviewsCount: 0,
    usersCount: 0,
    servicesCount: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');

  useEffect(() => {
    fetchBookings();
    fetchStats();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [girlsRes, reviewsRes, usersRes] = await Promise.all([
        fetch('/api/admin/girls'),
        fetch('/api/reviews?status=approved'),
        fetch('/api/admin/users')
      ]);

      const girlsData = await girlsRes.json();
      const reviewsData = await reviewsRes.json();
      const usersData = await usersRes.json();

      setStats({
        girlsCount: girlsData.girls?.length || 0,
        reviewsCount: reviewsData.reviews?.length || 0,
        usersCount: usersData.users?.length || 0,
        servicesCount: 24
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const getPoints = (booking: Booking): number => {
    if (booking.final_price) {
      return booking.final_price;
    }

    if (booking.duration === 60 || booking.duration === 120) return 1000;
    if (booking.duration === 45 || booking.duration === 90) return 900;
    if (booking.duration === 30) return 800;
    return 0;
  };

  const dates = useMemo(() => {
    const now = new Date();
    return {
      now,
      todayStart: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      weekStart: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      monthStart: new Date(now.getFullYear(), now.getMonth(), 1),
      yearStart: new Date(now.getFullYear(), 0, 1),
    };
  }, []);

  const bookingStats = useMemo(() => {
    const completedBookings: Booking[] = [];
    const todayBookings: Booking[] = [];
    const weekBookings: Booking[] = [];
    const monthBookings: Booking[] = [];
    const yearBookings: Booking[] = [];
    const pendingBookings: Booking[] = [];

    bookings.forEach(b => {
      const createdAt = new Date(b.created_at);

      if (b.status === 'pending') {
        pendingBookings.push(b);
      }

      if (b.status === 'completed') {
        completedBookings.push(b);

        if (createdAt >= dates.todayStart) {
          todayBookings.push(b);
        }
        if (createdAt >= dates.weekStart) {
          weekBookings.push(b);
        }
        if (createdAt >= dates.monthStart) {
          monthBookings.push(b);
        }
        if (createdAt >= dates.yearStart) {
          yearBookings.push(b);
        }
      }
    });

    const todayPoints = todayBookings.reduce((sum, b) => sum + getPoints(b), 0);
    const weekPoints = weekBookings.reduce((sum, b) => sum + getPoints(b), 0);
    const monthPoints = monthBookings.reduce((sum, b) => sum + getPoints(b), 0);
    const yearPoints = yearBookings.reduce((sum, b) => sum + getPoints(b), 0);

    return {
      completedBookings,
      todayBookings,
      weekBookings,
      monthBookings,
      yearBookings,
      pendingBookings,
      todayPoints,
      weekPoints,
      monthPoints,
      yearPoints
    };
  }, [bookings, dates]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('cs-CZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings;
    return bookings.filter(b =>
      b.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.client_phone.includes(searchTerm)
    );
  }, [bookings, searchTerm]);

  return (
    <>
      <AdminHeader title="Administrace" showBack={false} />

      <main className="app-content" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <style jsx global>{`
          @media (max-width: 768px) {
            .stats-grid { grid-template-columns: 1fr !important; }
            .quick-actions { grid-template-columns: 1fr !important; }
            .admin-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .content-grid { grid-template-columns: 1fr !important; }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
            .quick-actions { grid-template-columns: repeat(2, 1fr) !important; }
            .admin-grid { grid-template-columns: repeat(3, 1fr) !important; }
          }
        `}</style>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#fff',
            letterSpacing: '-0.025em'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            {formatDate(currentTime)} • {formatTime(currentTime)}
          </p>
        </div>

        {/* Period Selector */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
          {(['day', 'week', 'month', 'year'] as PeriodType[]).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                padding: '8px 16px',
                background: selectedPeriod === period ? '#2d2d31' : 'transparent',
                border: `1px solid ${selectedPeriod === period ? '#3d3d41' : '#2d2d31'}`,
                borderRadius: '8px',
                color: selectedPeriod === period ? '#ffffff' : '#9ca3af',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (selectedPeriod !== period) {
                  e.currentTarget.style.borderColor = '#3d3d41';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedPeriod !== period) {
                  e.currentTarget.style.borderColor = '#2d2d31';
                }
              }}
            >
              {period === 'day' && 'Dnes'}
              {period === 'week' && 'Týden'}
              {period === 'month' && 'Měsíc'}
              {period === 'year' && 'Rok'}
            </button>
          ))}
        </div>

        {/* Stats Card */}
        <div style={{
          background: '#1f1f23',
          border: '1px solid #2d2d31',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '16px'
          }}>
            {selectedPeriod === 'day' && 'Dnes'}
            {selectedPeriod === 'week' && 'Týden (7 dní)'}
            {selectedPeriod === 'month' && 'Měsíc'}
            {selectedPeriod === 'year' && 'Rok'}
          </div>
          <div style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '12px'
          }}>
            {selectedPeriod === 'day' && bookingStats.todayPoints.toLocaleString()}
            {selectedPeriod === 'week' && bookingStats.weekPoints.toLocaleString()}
            {selectedPeriod === 'month' && bookingStats.monthPoints.toLocaleString()}
            {selectedPeriod === 'year' && bookingStats.yearPoints.toLocaleString()}
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#6b7280'
          }}>
            {selectedPeriod === 'day' && `${bookingStats.todayBookings.length} rezervací`}
            {selectedPeriod === 'week' && `${bookingStats.weekBookings.length} rezervací`}
            {selectedPeriod === 'month' && `${bookingStats.monthBookings.length} rezervací`}
            {selectedPeriod === 'year' && `${bookingStats.yearBookings.length} rezervací`}
          </div>
        </div>

        {/* Other Stats - 3 Cards */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Girls */}
          <div style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '24px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3d3d41';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2d2d31';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Dívky
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '8px'
            }}>
              {stats.girlsCount}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Aktivních profilů
            </div>
          </div>

          {/* Reviews */}
          <div style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '24px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3d3d41';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2d2d31';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Recenze
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '8px'
            }}>
              {stats.reviewsCount}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Schválených
            </div>
          </div>

          {/* Users */}
          <div style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '24px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3d3d41';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2d2d31';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              Uživatelé
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#fff',
              marginBottom: '8px'
            }}>
              {stats.usersCount}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              Administrátoři
            </div>
          </div>
        </div>

        {/* Quick Actions - 4 Cards */}
        <div className="quick-actions" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <Link href="/manager/girls" style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            color: '#fff',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3d3d41';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2d2d31';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '2px' }}>
                Správa dívek
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {stats.girlsCount} profilů
              </div>
            </div>
          </Link>

          <Link href="/manager/calendar" style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            color: '#fff',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3d3d41';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2d2d31';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '2px' }}>
                Kalendář
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Rezervace
              </div>
            </div>
          </Link>

          <Link href="/admin/girls/new" style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            color: '#fff',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3d3d41';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2d2d31';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '2px' }}>
                Přidat dívku
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Nový profil
              </div>
            </div>
          </Link>

          <Link href="/admin/stats" style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            color: '#fff',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#3d3d41';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2d2d31';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            {bookingStats.pendingBookings.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: '#ef4444',
                color: 'white',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.625rem',
                fontWeight: '700'
              }}>
                {bookingStats.pendingBookings.length}
              </div>
            )}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '2px' }}>
                Reporty
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Statistiky
              </div>
            </div>
          </Link>
        </div>

        {/* Admin Menu Grid - 11 Items */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#fff'
          }}>
            Správa systému
          </h2>
          <div className="admin-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>,
                title: 'Dívky',
                count: `${stats.girlsCount} profilů`,
                path: '/admin/girls',
                color: '#8b5cf6'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>,
                title: 'Blog',
                count: 'Články',
                path: '/admin/blog',
                color: '#ec4899'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>,
                title: 'SEO',
                count: 'Meta',
                path: '/admin/seo',
                color: '#22c55e'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>,
                title: 'Rozvrhy',
                count: 'Časy',
                path: '/admin/schedules',
                color: '#3b82f6'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>,
                title: 'Pobočky',
                count: 'Lokace',
                path: '/admin/locations',
                color: '#eab308'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>,
                title: 'Recenze',
                count: `${stats.reviewsCount} schválených`,
                path: '/admin/reviews',
                color: '#f59e0b'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>,
                title: 'Rezervace',
                count: `${bookingStats.pendingBookings.length} čeká`,
                path: '/manager/calendar',
                color: '#06b6d4'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>,
                title: 'Uživatelé',
                count: `${stats.usersCount} uživatelů`,
                path: '/admin/users',
                color: '#8b5cf6'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>,
                title: 'Služby',
                count: `${stats.servicesCount} služeb`,
                path: '/admin/services',
                color: '#10b981'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>,
                title: 'Statistiky',
                count: 'Reporty',
                path: '/admin/stats',
                color: '#6366f1'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m8.66-14.66l-4.24 4.24m-4.24 4.24l-4.24 4.24M23 12h-6m-6 0H1m20.66 8.66l-4.24-4.24m-4.24-4.24l-4.24-4.24"/>
                </svg>,
                title: 'Nastavení',
                count: 'Systém',
                path: '/admin/settings',
                color: '#d4af37'
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>,
                title: 'Audit Log',
                count: 'Historie',
                path: '/admin/audit',
                color: '#ef4444'
              }
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => router.push(item.path)}
                style={{
                  background: '#1f1f23',
                  border: '1px solid #2d2d31',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3d3d41';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2d2d31';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '2px', color: '#fff' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {item.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="content-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Activity Feed */}
          <div style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>
                Poslední aktivita
              </h3>
              <Link href="/admin/audit" style={{
                fontSize: '0.875rem',
                color: '#d4af37',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Vše →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { action: 'Admin se přihlásil', details: 'IP: 185.x.x.x', time: '5 min', icon: '→' },
                { action: 'Profil aktualizován', details: 'Katy - změna cen', time: '23 min', icon: '✎' },
                { action: 'Nový uživatel', details: 'nova@lovelygirls.cz', time: '1h', icon: '+' },
                { action: 'Recenze smazána', details: 'Spam obsah', time: '3h', icon: '×' }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '12px',
                  paddingBottom: '16px',
                  borderBottom: i < 3 ? '1px solid #2d2d31' : 'none'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#2d2d31',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff', marginBottom: '2px' }}>
                      {item.action}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                      {item.details}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      před {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <div style={{
            background: '#1f1f23',
            border: '1px solid #2d2d31',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>
                Poslední rezervace
              </h3>
              <Link href="/manager/calendar" style={{
                fontSize: '0.875rem',
                color: '#d4af37',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Všechny →
              </Link>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Hledat podle jména nebo telefonu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  background: '#0f0f11',
                  border: '1px solid #2d2d31',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3d3d41'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#2d2d31'}
              />
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#1f1f23', zIndex: 1 }}>
                  <tr style={{ borderBottom: '1px solid #2d2d31' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#9ca3af',
                      textTransform: 'uppercase'
                    }}>Klient</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#9ca3af',
                      textTransform: 'uppercase'
                    }}>Telefon</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#9ca3af',
                      textTransform: 'uppercase'
                    }}>Holka</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#9ca3af',
                      textTransform: 'uppercase'
                    }}>Datum</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#9ca3af',
                      textTransform: 'uppercase'
                    }}>Status</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#9ca3af',
                      textTransform: 'uppercase'
                    }}>Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.slice(0, 10).map((booking) => (
                    <tr
                      key={booking.id}
                      style={{
                        borderBottom: '1px solid #2d2d31',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#2d2d31'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: '500', color: '#fff' }}>
                        {booking.client_name}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.875rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                        {booking.client_phone}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.875rem', color: '#fff', fontWeight: '500' }}>
                        {booking.girl_name || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.875rem', color: '#9ca3af' }}>
                        {new Date(booking.booking_date).toLocaleDateString('cs-CZ')}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background:
                            booking.status === 'completed' ? '#10b98120' :
                            booking.status === 'confirmed' ? '#3b82f620' :
                            booking.status === 'pending' ? '#eab30820' :
                            '#ef444420',
                          color:
                            booking.status === 'completed' ? '#10b981' :
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
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#ef444420',
                            border: '1px solid #ef444440',
                            borderRadius: '6px',
                            color: '#ef4444',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ef444430';
                            e.currentTarget.style.borderColor = '#ef444460';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ef444420';
                            e.currentTarget.style.borderColor = '#ef444440';
                          }}
                        >
                          Smazat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBookings.length === 0 && (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '0.875rem' }}>
                  {searchTerm ? 'Žádné výsledky' : 'Zatím žádné rezervace'}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
