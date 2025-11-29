"use client";

import { useRouter } from "next/navigation";

export default function AdminStatsPage() {
  const router = useRouter();

  return (
    <>
      {/* HEADER */}
      <header className="app-header admin">
        <div className="app-header-left">
          <button className="back-btn" onClick={() => router.push('/admin/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span className="app-admin-badge">Admin</span>
          <div className="app-header-title">Statistiky</div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="app-content">

        {/* TIME FILTER */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {['Dnes', 'Týden', 'Měsíc', 'Rok'].map((period) => (
            <button
              key={period}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: period === 'Měsíc' ? '1px solid var(--wine)' : '1px solid rgba(255,255,255,0.1)',
                background: period === 'Měsíc' ? 'rgba(139, 41, 66, 0.15)' : '#231a1e',
                color: period === 'Měsíc' ? 'var(--wine)' : '#e8e8e8',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {period}
            </button>
          ))}
        </div>

        {/* KEY METRICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #8b5cf6',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#8b5cf6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Rezervace
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>145</div>
            <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>↑ +12% oproti minulému měsíci</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #ec4899',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#ec4899', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Aktivní dívky
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>6</div>
            <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>Všechny aktivní</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #22c55e',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#22c55e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recenze
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>89</div>
            <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>↑ +8 nových tento týden</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #eab308',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#eab308', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Průměrná doba
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>65 min</div>
            <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>Nejčastěji 60 min</div>
          </div>
        </div>

        {/* TOP PERFORMERS */}
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>🏆 Top dívky (tento měsíc)</h3>

          {[
            { name: 'Katy', bookings: 45, color: '#ec4899', trend: '+8' },
            { name: 'Ema', bookings: 38, color: '#3b82f6', trend: '+5' },
            { name: 'Sofia', bookings: 32, color: '#f97316', trend: '+12' }
          ].map((girl, i) => (
            <div
              key={i}
              style={{
                background: '#231a1e',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: `${girl.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: girl.color
              }}>
                {i + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>
                  {girl.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>
                  {girl.bookings} rezervací
                </div>
              </div>

              <span style={{
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e'
              }}>
                {girl.trend}
              </span>
            </div>
          ))}
        </section>

        {/* BOOKING DISTRIBUTION */}
        <section>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>⏱️ Rozdělení rezervací podle délky</h3>

          {[
            { duration: '30 min', count: 28, percentage: 19, color: '#3b82f6' },
            { duration: '45 min', count: 45, percentage: 31, color: '#8b5cf6' },
            { duration: '60 min', count: 52, percentage: 36, color: '#ec4899' },
            { duration: '90+ min', count: 20, percentage: 14, color: '#f97316' }
          ].map((stat) => (
            <div
              key={stat.duration}
              style={{
                background: '#231a1e',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{stat.duration}</span>
                <span style={{ fontSize: '0.9rem', color: stat.color, fontWeight: '600' }}>
                  {stat.count} ({stat.percentage}%)
                </span>
              </div>
              <div style={{
                height: '8px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '100px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stat.percentage}%`,
                  height: '100%',
                  background: stat.color,
                  borderRadius: '100px',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>
          ))}
        </section>

      </main>
    </>
  );
}
