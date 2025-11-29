"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GirlDashboardPage() {
  const router = useRouter();

  return (
    <div className="app-phone-frame">
      {/* HEADER */}
      <header className="app-header">
        <div className="app-header-left">
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            border: '2px solid #a33352'
          }}>👩</div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Katy</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#22c55e' }}>
              <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span>
              Online
            </div>
          </div>
        </div>
        <div className="app-header-right">
          <button className="app-header-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              background: '#ef4444',
              borderRadius: '50%'
            }}></span>
          </button>
          <button className="app-header-btn" onClick={() => router.push("/admin/login")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.36-5.36l-4.24 4.24m0 0L6.88 6.64m4.24 4.24l-4.24 4.24m4.24-4.24l4.24 4.24"/>
            </svg>
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="app-content">

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #5c1c2e 0%, #231a1e 100%)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #8b2942'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#9a8a8e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Dnes</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>2</div>
            <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px' }}>rezervace</div>
          </div>
          <div style={{ background: '#231a1e', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#9a8a8e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Tento měsíc</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>18</div>
            <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px' }}>+12% vs minulý</div>
          </div>
          <div style={{ background: '#231a1e', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#9a8a8e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Hodnocení</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>4.9</div>
            <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px' }}>⭐ 47 recenzí</div>
          </div>
          <div style={{ background: '#231a1e', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '0.75rem', color: '#9a8a8e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Zobrazení</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>1.2k</div>
            <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px' }}>tento týden</div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { icon: '👤', text: 'Profil' },
            { icon: '📷', text: 'Fotky' },
            { icon: '📅', text: 'Dostupnost' },
            { icon: '💬', text: 'Chat' }
          ].map((action, i) => (
            <a key={i} href="#" style={{
              background: '#231a1e',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '16px 8px',
              textAlign: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'white',
              transition: 'all 0.3s'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: '#5c1c2e',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                fontSize: '1.25rem'
              }}>{action.icon}</div>
              <div style={{ fontSize: '0.75rem', color: '#ccc' }}>{action.text}</div>
            </a>
          ))}
        </div>

        {/* TODAY'S BOOKINGS */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>📋 Dnešní rezervace</h3>
            <a href="#" style={{ fontSize: '0.85rem', color: '#a33352', textDecoration: 'none' }}>Všechny →</a>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 41, 66, 0.15) 0%, #231a1e 100%)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '12px',
            border: '1px solid #8b2942'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>14:00</div>
                <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>2 hodiny</div>
              </div>
              <span style={{
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e'
              }}>Potvrzeno</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#ccc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a8a8e" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Incall — Vinohrady
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
              <span style={{ padding: '4px 10px', background: '#2d242a', borderRadius: '6px', fontSize: '0.75rem', color: '#ccc' }}>GFE</span>
              <span style={{ padding: '4px 10px', background: '#2d242a', borderRadius: '6px', fontSize: '0.75rem', color: '#ccc' }}>Massage</span>
            </div>
          </div>

          <div style={{
            background: '#231a1e',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>19:00</div>
                <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>1 hodina</div>
              </div>
              <span style={{
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#eab308'
              }}>Čeká</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: '#ccc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a8a8e" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Outcall — Hotel
              </div>
            </div>
          </div>
        </section>

        {/* AVAILABILITY */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>📅 Tento týden</h3>
            <a href="#" style={{ fontSize: '0.85rem', color: '#a33352', textDecoration: 'none' }}>Upravit →</a>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {[
              { name: 'Dnes', num: '29', available: true, today: true },
              { name: 'So', num: '30', available: true },
              { name: 'Ne', num: '1', available: false },
              { name: 'Po', num: '2', available: true },
              { name: 'Út', num: '3', available: true },
              { name: 'St', num: '4', available: false },
              { name: 'Čt', num: '5', available: true }
            ].map((day, i) => (
              <div key={i} style={{
                minWidth: '70px',
                background: day.today ? 'linear-gradient(135deg, rgba(139, 41, 66, 0.2) 0%, #231a1e 100%)' : '#231a1e',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                border: day.today ? '1px solid #8b2942' : day.available ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.05)',
                opacity: day.available ? 1 : 0.5
              }}>
                <div style={{ fontSize: '0.65rem', color: '#9a8a8e', textTransform: 'uppercase', marginBottom: '4px' }}>{day.name}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '6px' }}>{day.num}</div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  margin: '0 auto',
                  background: day.available ? '#22c55e' : '#9a8a8e'
                }}></div>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT REVIEWS */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>⭐ Poslední recenze</h3>
            <a href="#" style={{ fontSize: '0.85rem', color: '#a33352', textDecoration: 'none' }}>Všechny →</a>
          </div>

          {[
            { stars: 5, date: 'před 2 dny', text: 'Amazing experience! Katy is very professional and made me feel comfortable from the first moment. Highly recommended.' },
            { stars: 4, date: 'před 5 dny', text: 'Great company for dinner. Beautiful and intelligent.' }
          ].map((review, i) => (
            <div key={i} style={{
              background: '#231a1e',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#eab308' }}>
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill={j < review.stars ? 'currentColor' : 'none'} opacity={j < review.stars ? 1 : 0.3}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>{review.date}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>{review.text}</p>
            </div>
          ))}
        </section>

      </main>

      {/* BOTTOM NAV */}
      <nav className="app-bottom-nav">
        <Link href="/girl/dashboard" className="app-nav-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Domů</span>
        </Link>
        <Link href="#" className="app-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Rezervace</span>
        </Link>
        <Link href="#" className="app-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>Recenze</span>
        </Link>
        <Link href="#" className="app-nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Profil</span>
        </Link>
      </nav>

    </div>
  );
}
