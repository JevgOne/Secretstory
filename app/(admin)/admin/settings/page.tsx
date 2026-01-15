"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import GoogleCalendarConnect from "@/components/GoogleCalendarConnect";

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

        {/* WHATSAPP SETTINGS */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#e8e8e8' }}>
            📱 WhatsApp
          </h3>

          <div style={{
            background: whatsappBlocked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            padding: '20px',
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

        {/* GOOGLE CALENDAR SETTINGS */}
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#e8e8e8' }}>
            📅 Google Calendar
          </h3>
          <GoogleCalendarConnect />
        </section>

      </main>
    </>
  );
}
