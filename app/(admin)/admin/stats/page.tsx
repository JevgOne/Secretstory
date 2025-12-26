"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type PeriodType = 'day' | 'week' | 'month' | 'year';

interface StatsData {
  bookings: {
    count: number;
    change: number;
    changeDirection: 'up' | 'down';
  };
  activeGirls: number;
  reviews: {
    total: number;
    newThisWeek: number;
  };
  avgDuration: {
    avg: number;
    mostCommon: number;
  };
  topGirls: Array<{
    name: string;
    bookings: number;
    color: string;
    trend: string;
  }>;
  distribution: Array<{
    duration: string;
    count: number;
    percentage: number;
    color: string;
  }>;
}

export default function AdminStatsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/stats?period=${period}`);
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  const periodLabels: Record<PeriodType, string> = {
    day: 'Dnes',
    week: 'Týden',
    month: 'Měsíc',
    year: 'Rok'
  };

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
          {(Object.entries(periodLabels) as [PeriodType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: period === key ? '1px solid var(--wine)' : '1px solid rgba(255,255,255,0.1)',
                background: period === key ? 'rgba(139, 41, 66, 0.15)' : '#231a1e',
                color: period === key ? 'var(--wine)' : '#e8e8e8',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* KEY METRICS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9a8a8e' }}>Načítání...</div>
        ) : stats ? (
          <>
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
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{stats.bookings.count}</div>
                <div style={{ fontSize: '0.75rem', color: stats.bookings.changeDirection === 'up' ? '#22c55e' : '#ef4444' }}>
                  {stats.bookings.changeDirection === 'up' ? '↑' : '↓'} {stats.bookings.changeDirection === 'up' ? '+' : ''}{stats.bookings.change}% oproti minulému {period === 'day' ? 'dni' : period === 'week' ? 'týdnu' : period === 'month' ? 'měsíci' : 'roku'}
                </div>
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
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{stats.activeGirls}</div>
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
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{stats.reviews.total}</div>
                <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>↑ +{stats.reviews.newThisWeek} nových tento týden</div>
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
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{stats.avgDuration.avg} min</div>
                <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>Nejčastěji {stats.avgDuration.mostCommon} min</div>
              </div>
            </div>

            {/* TOP PERFORMERS */}
            <section style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>🏆 Top dívky (tento {period === 'day' ? 'den' : period === 'week' ? 'týden' : period === 'month' ? 'měsíc' : 'rok'})</h3>

              {stats.topGirls.map((girl, i) => (
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

              {stats.distribution.map((stat) => (
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
          </>
        ) : null}

      </main>
    </>
  );
}
