"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [whatsappBlocked, setWhatsappBlocked] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setWhatsappBlocked(data.settings?.whatsapp_blocked ?? false);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setWhatsappBlocked(false);
    }
  };

  const toggleWhatsApp = async () => {
    if (whatsappBlocked === null) return;
    setSaving(true);
    const newValue = !whatsappBlocked;
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'whatsapp_blocked', value: newValue })
      });
      if (res.ok) {
        setWhatsappBlocked(newValue);
      }
    } catch (error) {
      console.error('Error updating WhatsApp setting:', error);
    }
    setSaving(false);
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
          <div className="app-header-title">Nastavení</div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="app-content">

        {/* GENERAL SETTINGS */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#e8e8e8' }}>
            ⚙️ Obecné nastavení
          </h3>

          {[
            { label: 'Název webu', value: 'LovelyGirls.cz', type: 'text' },
            { label: 'Email kontakt', value: 'info@lovelygirls.cz', type: 'email' },
            { label: 'Telefon', value: '+420 123 456 789', type: 'tel' }
          ].map((field, i) => (
            <div
              key={i}
              style={{
                background: '#231a1e',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                color: '#9a8a8e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {field.label}
              </label>
              <input
                type={field.type}
                defaultValue={field.value}
                style={{
                  width: '100%',
                  background: '#1a1416',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#e8e8e8',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          ))}
        </section>

        {/* WHATSAPP SETTINGS */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#e8e8e8' }}>
            📱 WhatsApp
          </h3>

          <div style={{
            background: whatsappBlocked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '12px',
            border: `1px solid ${whatsappBlocked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
            transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  WhatsApp stav
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: whatsappBlocked ? '#ef4444' : '#22c55e',
                    color: 'white'
                  }}>
                    {whatsappBlocked === null ? '...' : whatsappBlocked ? 'BLOKOVÁN' : 'AKTIVNÍ'}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#9a8a8e' }}>
                  {whatsappBlocked
                    ? 'Banner s varováním je zobrazen na webu'
                    : 'WhatsApp funguje normálně, banner je skrytý'}
                </div>
              </div>
              <button
                onClick={toggleWhatsApp}
                disabled={saving || whatsappBlocked === null}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: whatsappBlocked ? '#22c55e' : '#ef4444',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: saving ? 'wait' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {saving ? 'Ukládám...' : whatsappBlocked ? 'Odblokovat' : 'Zablokovat'}
              </button>
            </div>
          </div>
        </section>

        {/* BOOKING SETTINGS */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#e8e8e8' }}>
            📅 Nastavení rezervací
          </h3>

          <div style={{
            background: '#231a1e',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>
                  Povolit online rezervace
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9a8a8e' }}>
                  Uživatelé mohou rezervovat přímo přes web
                </div>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px' }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'var(--wine)',
                  borderRadius: '28px',
                  transition: '0.3s'
                }}></span>
                <span style={{
                  position: 'absolute',
                  content: '',
                  height: '20px',
                  width: '20px',
                  left: '4px',
                  bottom: '4px',
                  background: 'white',
                  borderRadius: '50%',
                  transition: '0.3s',
                  transform: 'translateX(24px)'
                }}></span>
              </label>
            </div>
          </div>

          <div style={{
            background: '#231a1e',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              color: '#9a8a8e',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Minimální délka rezervace (minuty)
            </label>
            <input
              type="number"
              defaultValue={30}
              style={{
                width: '100%',
                background: '#1a1416',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#e8e8e8',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#e8e8e8' }}>
            🔔 Notifikace
          </h3>

          {[
            { label: 'Email notifikace pro nové rezervace', checked: true },
            { label: 'SMS notifikace pro dívky', checked: true },
            { label: 'Push notifikace v aplikaci', checked: false }
          ].map((notification, i) => (
            <div
              key={i}
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
              <span style={{ fontSize: '0.95rem' }}>{notification.label}</span>
              <input
                type="checkbox"
                defaultChecked={notification.checked}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: 'var(--wine)'
                }}
              />
            </div>
          ))}
        </section>

        {/* SECURITY */}
        <section>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#e8e8e8' }}>
            🔒 Zabezpečení
          </h3>

          <div style={{
            background: '#231a1e',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <button
              style={{
                width: '100%',
                background: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #eab308',
                borderRadius: '8px',
                padding: '12px',
                color: '#eab308',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => alert('Změna hesla bude brzy dostupná!')}
            >
              Změnit heslo
            </button>
          </div>

          <div style={{
            background: '#231a1e',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <button
              style={{
                width: '100%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                padding: '12px',
                color: '#ef4444',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (confirm('Opravdu chcete odhlásit všechny uživatele?')) {
                  alert('Všichni uživatelé budou odhlášeni!');
                }
              }}
            >
              Odhlásit všechny uživatele
            </button>
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            style={{
              width: '100%',
              background: 'var(--wine)',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 41, 66, 0.3)'
            }}
            onClick={() => alert('Nastavení uložena!')}
          >
            Uložit změny
          </button>
        </div>

      </main>
    </>
  );
}
