"use client";

import { useRouter } from "next/navigation";

export default function AdminServicesPage() {
  const router = useRouter();

  const services = [
    { id: 1, name: 'Klasický sex', duration: 30, price: 2000, active: true },
    { id: 2, name: 'Klasický sex', duration: 60, price: 3500, active: true },
    { id: 3, name: 'Orální sex', duration: 30, price: 1800, active: true },
    { id: 4, name: 'Masáž', duration: 60, price: 2500, active: true },
    { id: 5, name: 'Speciální služby', duration: 90, price: 5000, active: false }
  ];

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
          <div className="app-header-title">Služby</div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="app-content">

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #22c55e',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#22c55e', marginBottom: '4px' }}>Aktivní</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{services.filter(s => s.active).length}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '4px' }}>Neaktivní</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{services.filter(s => !s.active).length}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #3b82f6',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '4px' }}>Celkem</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{services.length}</div>
          </div>
        </div>

        {/* SERVICES LIST */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>📋 Seznam služeb</h3>
            <button
              style={{
                background: 'var(--wine)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => alert('Modal pro přidání nové služby bude brzy dostupný!')}
            >
              + Nová služba
            </button>
          </div>

          {services.map((service) => (
            <div
              key={service.id}
              style={{
                background: '#231a1e',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>
                  {service.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>
                  {service.duration} min • {service.price} Kč
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  background: service.active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: service.active ? '#22c55e' : '#ef4444'
                }}>
                  {service.active ? 'Aktivní' : 'Neaktivní'}
                </span>

                <button
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    color: '#e8e8e8',
                    cursor: 'pointer'
                  }}
                  onClick={() => alert(`Úprava služby "${service.name}" bude brzy dostupná!`)}
                >
                  Upravit
                </button>
              </div>
            </div>
          ))}
        </section>

      </main>
    </>
  );
}
