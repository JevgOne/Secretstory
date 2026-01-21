"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type PeriodType = 'day' | 'week' | 'month' | 'year';
type TabType = 'overview' | 'contacts' | 'profiles' | 'sources';

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

interface AnalyticsData {
  clicks: {
    call: { count: number; trend: number };
    whatsapp: { count: number; trend: number };
    sms: { count: number; trend: number };
    telegram: { count: number; trend: number };
  };
  profileViews: {
    total: number;
    trend: number;
    uniqueVisitors: number;
    avgPerProfile: number;
  };
  topProfiles: Array<{
    id: number;
    name: string;
    slug: string;
    views: number;
  }>;
  sources: {
    direct: number;
    search: number;
    social: number;
    referral: number;
  };
  sourcesDetailed: Array<{
    source: string;
    count: number;
  }>;
  utmBreakdown: Array<{
    source: string;
    medium: string;
    campaign: string;
    count: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    fullUrl: string;
    count: number;
  }>;
  dailyClicks: Array<{
    date: string;
    call: number;
    whatsapp: number;
    sms: number;
    telegram: number;
  }>;
}

// Animated number component
function AnimatedNumber({ value, duration = 500 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const currentValue = Math.round(startValue.current + (value - startValue.current) * easedProgress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{displayValue.toLocaleString('cs-CZ')}</>;
}

// Skeleton loader
function SkeletonCard() {
  return (
    <div style={{
      background: '#231a1e',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: '60%',
        height: '12px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '6px',
        marginBottom: '12px',
        animation: 'pulse 1.5s infinite',
      }}></div>
      <div style={{
        width: '40%',
        height: '32px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        animation: 'pulse 1.5s infinite',
      }}></div>
    </div>
  );
}

function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: '#231a1e',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            animation: 'pulse 1.5s infinite',
          }}></div>
          <div style={{ flex: 1 }}>
            <div style={{
              width: '60%',
              height: '14px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              marginBottom: '8px',
              animation: 'pulse 1.5s infinite',
            }}></div>
            <div style={{
              width: '30%',
              height: '10px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              animation: 'pulse 1.5s infinite',
            }}></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function AdminStatsPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

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

  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const response = await fetch(`/api/admin/analytics?period=${period}`);
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  const periodLabels: Record<PeriodType, string> = {
    day: 'Dnes',
    week: 'Tyden',
    month: 'Mesic',
    year: 'Rok'
  };

  const tabLabels: Record<TabType, string> = {
    overview: 'Prehled',
    contacts: 'Kontakty',
    profiles: 'Profily',
    sources: 'Zdroje'
  };

  const getTrendColor = (trend: number) => trend >= 0 ? '#22c55e' : '#ef4444';
  const getTrendIcon = (trend: number) => trend >= 0 ? '↑' : '↓';

  // Calculate total sources for percentage
  const totalSources = analytics
    ? analytics.sources.direct + analytics.sources.search + analytics.sources.social + analytics.sources.referral
    : 0;

  const getSourcePercentage = (count: number) => {
    if (totalSources === 0) return 0;
    return Math.round((count / totalSources) * 100);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
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

        {/* TABS */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          background: '#1a1216',
          padding: '4px',
          borderRadius: '12px',
          overflowX: 'auto',
        }}>
          {(Object.entries(tabLabels) as [TabType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === key ? '#231a1e' : 'transparent',
                color: activeTab === key ? '#fff' : '#9a8a8e',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* KEY METRICS */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
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
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={stats.bookings.count} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: stats.bookings.changeDirection === 'up' ? '#22c55e' : '#ef4444' }}>
                      {stats.bookings.changeDirection === 'up' ? '↑' : '↓'} {stats.bookings.changeDirection === 'up' ? '+' : ''}{stats.bookings.change}%
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, #231a1e 100%)',
                    border: '1px solid #ec4899',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#ec4899', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Aktivni divky
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={stats.activeGirls} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>Vsechny aktivni</div>
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
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={stats.reviews.total} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>↑ +{stats.reviews.newThisWeek} novych tento tyden</div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, #231a1e 100%)',
                    border: '1px solid #eab308',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#eab308', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Prumerna doba
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={stats.avgDuration.avg} /> min
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>Nejcasteji {stats.avgDuration.mostCommon} min</div>
                  </div>
                </div>

                {/* TOP PERFORMERS */}
                <section style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Top divky</h3>
                  {stats.topGirls.slice(0, 5).map((girl, i) => (
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
                          {girl.bookings} rezervaci
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            ) : null}
          </>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <>
            {analyticsLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : analytics ? (
              <>
                {/* Click metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, #231a1e 100%)',
                    border: '1px solid #3b82f6',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Volani
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.clicks.call.count} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: getTrendColor(analytics.clicks.call.trend) }}>
                      {getTrendIcon(analytics.clicks.call.trend)} {analytics.clicks.call.trend >= 0 ? '+' : ''}{analytics.clicks.call.trend}%
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, #231a1e 100%)',
                    border: '1px solid #25d366',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#25d366', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      WhatsApp
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.clicks.whatsapp.count} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: getTrendColor(analytics.clicks.whatsapp.trend) }}>
                      {getTrendIcon(analytics.clicks.whatsapp.trend)} {analytics.clicks.whatsapp.trend >= 0 ? '+' : ''}{analytics.clicks.whatsapp.trend}%
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, #231a1e 100%)',
                    border: '1px solid #10b981',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#10b981', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      SMS
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.clicks.sms.count} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: getTrendColor(analytics.clicks.sms.trend) }}>
                      {getTrendIcon(analytics.clicks.sms.trend)} {analytics.clicks.sms.trend >= 0 ? '+' : ''}{analytics.clicks.sms.trend}%
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(0, 136, 204, 0.15) 0%, #231a1e 100%)',
                    border: '1px solid #0088cc',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#0088cc', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                      </svg>
                      Telegram
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.clicks.telegram.count} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: getTrendColor(analytics.clicks.telegram.trend) }}>
                      {getTrendIcon(analytics.clicks.telegram.trend)} {analytics.clicks.telegram.trend >= 0 ? '+' : ''}{analytics.clicks.telegram.trend}%
                    </div>
                  </div>
                </div>

                {/* Total clicks summary */}
                <div style={{
                  background: '#231a1e',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#9a8a8e', marginBottom: '8px' }}>Celkem kliknuti</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff' }}>
                    <AnimatedNumber value={
                      analytics.clicks.call.count +
                      analytics.clicks.whatsapp.count +
                      analytics.clicks.sms.count +
                      analytics.clicks.telegram.count
                    } />
                  </div>
                </div>

                {/* Daily clicks chart (simplified bar chart) */}
                {analytics.dailyClicks.length > 0 && (
                  <section style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Kliknuti podle dnu</h3>
                    <div style={{
                      background: '#231a1e',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '120px' }}>
                        {analytics.dailyClicks.slice(-14).map((day, i) => {
                          const total = day.call + day.whatsapp + day.sms + day.telegram;
                          const maxTotal = Math.max(...analytics.dailyClicks.slice(-14).map(d => d.call + d.whatsapp + d.sms + d.telegram));
                          const height = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

                          return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{
                                width: '100%',
                                height: `${height}%`,
                                minHeight: '4px',
                                background: 'linear-gradient(180deg, #ec4899 0%, #8b5cf6 100%)',
                                borderRadius: '4px 4px 0 0',
                                transition: 'height 0.3s ease',
                              }}></div>
                              <div style={{ fontSize: '0.6rem', color: '#9a8a8e' }}>
                                {new Date(day.date).getDate()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                )}
              </>
            ) : null}
          </>
        )}

        {/* PROFILES TAB */}
        {activeTab === 'profiles' && (
          <>
            {analyticsLoading ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
                <SkeletonList count={5} />
              </>
            ) : analytics ? (
              <>
                {/* Profile metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, #231a1e 100%)',
                    border: '1px solid #8b5cf6',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#8b5cf6', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Zobrazeni profilu
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.profileViews.total} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: getTrendColor(analytics.profileViews.trend) }}>
                      {getTrendIcon(analytics.profileViews.trend)} {analytics.profileViews.trend >= 0 ? '+' : ''}{analytics.profileViews.trend}%
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, #231a1e 100%)',
                    border: '1px solid #ec4899',
                    borderRadius: '16px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#ec4899', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Unikatnich navstevniku
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.profileViews.uniqueVisitors} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>
                      Prumer {analytics.profileViews.avgPerProfile} na profil
                    </div>
                  </div>
                </div>

                {/* Top visited profiles */}
                <section>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Nejnavstevovanejsi profily</h3>
                  {analytics.topProfiles.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#9a8a8e' }}>
                      Zatim zadna data
                    </div>
                  ) : (
                    analytics.topProfiles.map((profile, i) => (
                      <Link
                        key={profile.id}
                        href={`/admin/girls/${profile.id}`}
                        style={{
                          display: 'flex',
                          background: '#231a1e',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '12px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          alignItems: 'center',
                          gap: '16px',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: i < 3 ? `rgba(139, 92, 246, ${0.3 - i * 0.08})` : 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '700',
                          color: i < 3 ? '#8b5cf6' : '#9a8a8e',
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>
                            {profile.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>
                            {profile.views.toLocaleString('cs-CZ')} zobrazeni
                          </div>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px', color: '#9a8a8e' }}>
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </Link>
                    ))
                  )}
                </section>
              </>
            ) : null}
          </>
        )}

        {/* SOURCES TAB */}
        {activeTab === 'sources' && (
          <>
            {analyticsLoading ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
                <SkeletonList count={5} />
              </>
            ) : analytics ? (
              <>
                {/* Source categories */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <div style={{
                    background: '#231a1e',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#9a8a8e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Primo
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.sources.direct} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>
                      {getSourcePercentage(analytics.sources.direct)}%
                    </div>
                  </div>

                  <div style={{
                    background: '#231a1e',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#9a8a8e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Vyhledavace
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.sources.search} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6' }}>
                      {getSourcePercentage(analytics.sources.search)}%
                    </div>
                  </div>

                  <div style={{
                    background: '#231a1e',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#9a8a8e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Socialni site
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.sources.social} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#ec4899' }}>
                      {getSourcePercentage(analytics.sources.social)}%
                    </div>
                  </div>

                  <div style={{
                    background: '#231a1e',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#9a8a8e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Odkazy
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '4px' }}>
                      <AnimatedNumber value={analytics.sources.referral} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#f97316' }}>
                      {getSourcePercentage(analytics.sources.referral)}%
                    </div>
                  </div>
                </div>

                {/* Source distribution bar */}
                <div style={{
                  background: '#231a1e',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Rozlozeni zdroju</div>
                  <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${getSourcePercentage(analytics.sources.direct)}%`, background: '#22c55e' }}></div>
                    <div style={{ width: `${getSourcePercentage(analytics.sources.search)}%`, background: '#3b82f6' }}></div>
                    <div style={{ width: `${getSourcePercentage(analytics.sources.social)}%`, background: '#ec4899' }}></div>
                    <div style={{ width: `${getSourcePercentage(analytics.sources.referral)}%`, background: '#f97316' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', color: '#9a8a8e' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>Primo</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>Vyhledavace</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }}></span>Socialni</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316' }}></span>Odkazy</span>
                  </div>
                </div>

                {/* Top referrers */}
                {analytics.topReferrers.length > 0 && (
                  <section style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Top odkazujici stranky</h3>
                    {analytics.topReferrers.map((ref, i) => (
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
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ref.referrer}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#8b5cf6', marginLeft: '16px' }}>
                          {ref.count}
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {/* UTM Campaigns */}
                {analytics.utmBreakdown.length > 0 && (
                  <section>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>UTM kampane</h3>
                    {analytics.utmBreakdown.map((utm, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#231a1e',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '12px',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>
                              {utm.campaign || utm.source || 'N/A'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#9a8a8e' }}>
                              {utm.source && <span style={{ marginRight: '8px' }}>source: {utm.source}</span>}
                              {utm.medium && <span>medium: {utm.medium}</span>}
                            </div>
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: '700', color: '#8b5cf6' }}>
                            {utm.count}
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>
                )}
              </>
            ) : null}
          </>
        )}

      </main>
    </>
  );
}
