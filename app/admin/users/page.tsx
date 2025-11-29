"use client";

import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const router = useRouter();

  const users = [
    { id: 1, name: 'Admin User', email: 'admin@lovelygirls.cz', role: 'admin', status: 'active', avatar: '👨‍💼' },
    { id: 2, name: 'Manager Jana', email: 'jana@lovelygirls.cz', role: 'manager', status: 'active', avatar: '👔' },
    { id: 3, name: 'Katy Nováková', email: 'katy@lovelygirls.cz', role: 'girl', status: 'active', avatar: '👩' },
    { id: 4, name: 'Ema Krásná', email: 'ema@lovelygirls.cz', role: 'girl', status: 'active', avatar: '👩' },
    { id: 5, name: 'Sofia Luxusní', email: 'sofia@lovelygirls.cz', role: 'girl', status: 'active', avatar: '👱‍♀️' },
    { id: 6, name: 'Nová dívka', email: 'nova@lovelygirls.cz', role: 'girl', status: 'pending', avatar: '👱‍♀️' }
  ];

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', text: 'Admin' },
      manager: { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308', text: 'Manager' },
      girl: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', text: 'Dívka' }
    };
    return badges[role as keyof typeof badges] || badges.girl;
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
          <div className="app-header-title">Uživatelé</div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="app-content">

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #8b5cf6',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#8b5cf6', marginBottom: '4px' }}>Celkem</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{users.length}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #22c55e',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#22c55e', marginBottom: '4px' }}>Aktivní</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{users.filter(u => u.status === 'active').length}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #eab308',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#eab308', marginBottom: '4px' }}>Čeká</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{users.filter(u => u.status === 'pending').length}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, #231a1e 100%)',
            border: '1px solid #ec4899',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#ec4899', marginBottom: '4px' }}>Dívky</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{users.filter(u => u.role === 'girl').length}</div>
          </div>
        </div>

        {/* USERS LIST */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>👥 Seznam uživatelů</h3>
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
              onClick={() => alert('Modal pro přidání nového uživatele bude brzy dostupný!')}
            >
              + Nový uživatel
            </button>
          </div>

          {users.map((user) => {
            const badge = getRoleBadge(user.role);
            return (
              <div
                key={user.id}
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
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#5c1c2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  {user.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>
                    {user.email}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: badge.bg,
                    color: badge.color
                  }}>
                    {badge.text}
                  </span>

                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: user.status === 'active' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                    color: user.status === 'active' ? '#22c55e' : '#eab308'
                  }}>
                    {user.status === 'active' ? 'Aktivní' : 'Čeká'}
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
                    onClick={() => alert(`Úprava uživatele "${user.name}" bude brzy dostupná!`)}
                  >
                    Upravit
                  </button>
                </div>
              </div>
            );
          })}
        </section>

      </main>
    </>
  );
}
