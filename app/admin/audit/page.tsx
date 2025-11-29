"use client";

import { useRouter } from "next/navigation";

export default function AdminAuditPage() {
  const router = useRouter();

  const auditLogs = [
    { id: 1, icon: '🔑', action: 'Přihlášení', user: 'Admin', details: 'IP: 185.216.34.12', time: 'před 5 min', type: 'info' },
    { id: 2, icon: '✏️', action: 'Profil upraven', user: 'Manager Jana', details: 'Změna cen služeb u Katy', time: 'před 23 min', type: 'warning' },
    { id: 3, icon: '➕', action: 'Nová rezervace', user: 'Katy', details: 'Klient: Jan Novák, 60 min', time: 'před 45 min', type: 'success' },
    { id: 4, icon: '🗑️', action: 'Recenze smazána', user: 'Admin', details: 'Spam content', time: 'před 1 h', type: 'error' },
    { id: 5, icon: '👥', action: 'Nový uživatel', user: 'System', details: 'nova@lovelygirls.cz', time: 'před 2 h', type: 'success' },
    { id: 6, icon: '⚙️', action: 'Nastavení změněno', user: 'Admin', details: 'Online rezervace povoleny', time: 'před 3 h', type: 'warning' },
    { id: 7, icon: '📧', action: 'Email odeslán', user: 'System', details: 'Potvrzení rezervace pro Jana Nováka', time: 'před 4 h', type: 'info' },
    { id: 8, icon: '🔒', action: 'Heslo změněno', user: 'Manager Jana', details: 'Úspěšná změna hesla', time: 'před 5 h', type: 'warning' },
    { id: 9, icon: '📸', action: 'Fotka nahrána', user: 'Ema', details: '3 nové fotky do galerie', time: 'před 6 h', type: 'success' },
    { id: 10, icon: '💬', action: 'Recenze schválena', user: 'Admin', details: 'Recenze pro Katy (5⭐)', time: 'před 7 h', type: 'success' }
  ];

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
          {['Vše', 'Přihlášení', 'Úpravy', 'Rezervace', 'Systém'].map((filter) => (
            <button
              key={filter}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: filter === 'Vše' ? '1px solid var(--wine)' : '1px solid rgba(255,255,255,0.1)',
                background: filter === 'Vše' ? 'rgba(139, 41, 66, 0.15)' : '#231a1e',
                color: filter === 'Vše' ? 'var(--wine)' : '#e8e8e8',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #3b82f6',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '4px' }}>Dnes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>24</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #22c55e',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#22c55e', marginBottom: '4px' }}>Tento týden</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>156</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #eab308',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#eab308', marginBottom: '4px' }}>Tento měsíc</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>892</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '4px' }}>Chyby</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>3</div>
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

          {auditLogs.map((log) => {
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
                      {log.time}
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
