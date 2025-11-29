"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Booking {
  duration: number;
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

  // Calculate duration stats
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
        <button className="app-header-btn" onClick={() => router.push("/admin/login")}>
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
