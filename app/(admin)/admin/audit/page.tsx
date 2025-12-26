"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type FilterType = 'all' | 'booking' | 'system';

interface AuditLog {
  id: string;
  icon: string;
  action: string;
  user: string;
  details: string;
  timeRelative: string;
  timeAbsolute: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AuditStats {
  today: number;
  week: number;
  month: number;
  errors: number;
}

export default function AdminAuditPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/audit?filter=${filter}&limit=50`);
        const data = await response.json();
        if (data.success) {
          setLogs(data.logs);
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch audit data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, [filter]);

  const filterLabels: Record<FilterType, string> = {
    all: 'Vše',
    booking: 'Rezervace',
    system: 'Systém'
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' },
      success: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' },
      warning: { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' },
      error: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }
    };
    return colors[type as keyof typeof colors] || colors.info;
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
          <div className="app-header-title">Audit Log</div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="app-content">

        {/* FILTER */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {(Object.entries(filterLabels) as [FilterType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: filter === key ? '1px solid var(--wine)' : '1px solid rgba(255,255,255,0.1)',
                background: filter === key ? 'rgba(139, 41, 66, 0.15)' : '#231a1e',
                color: filter === key ? 'var(--wine)' : '#e8e8e8',
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

        {/* STATS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9a8a8e' }}>Načítání...</div>
        ) : stats ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, #231a1e 100%)',
                border: '1px solid #3b82f6',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '4px' }}>Dnes</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.today}</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, #231a1e 100%)',
                border: '1px solid #22c55e',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#22c55e', marginBottom: '4px' }}>Tento týden</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.week}</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, #231a1e 100%)',
                border: '1px solid #eab308',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#eab308', marginBottom: '4px' }}>Tento měsíc</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.month}</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, #231a1e 100%)',
                border: '1px solid #ef4444',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '4px' }}>Chyby</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.errors}</div>
              </div>
            </div>

            {/* AUDIT LOG */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>📋 Historie aktivit</h3>
                <button
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#e8e8e8',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert('Export do CSV bude brzy dostupný!')}
                >
                  📥 Export
                </button>
              </div>

              {logs.map((log) => {
                const color = getTypeColor(log.type);
                return (
                  <div
                    key={log.id}
                    style={{
                      background: '#231a1e',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      marginBottom: '10px',
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: color.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      {log.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{log.action}</span>
                        <span style={{ fontSize: '0.75rem', color: '#9a8a8e', whiteSpace: 'nowrap' }}>
                          {log.timeRelative}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#9a8a8e', marginBottom: '2px' }}>
                        {log.details}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: color.text }}>
                        {log.user}
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        ) : null}

        {/* LOAD MORE */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              padding: '12px 32px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#e8e8e8',
              cursor: 'pointer'
            }}
            onClick={() => alert('Načtení dalších záznamů...')}
          >
            Načíst více
          </button>
        </div>

      </main>
    </>
  );
}
