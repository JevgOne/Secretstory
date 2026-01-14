'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import GoogleCalendarConnect from '@/components/GoogleCalendarConnect';

interface Girl {
  id: number;
  name: string;
  color: string;
}

export default function CalendarSettingsPage() {
  const router = useRouter();
  const [girls, setGirls] = useState<Girl[]>([]);
  const [selectedGirl, setSelectedGirl] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch girls for sync selection
  useEffect(() => {
    const fetchGirls = async () => {
      try {
        const response = await fetch('/api/admin/girls');
        const data = await response.json();
        if (data.success) {
          setGirls(data.girls);
          if (data.girls.length > 0) {
            setSelectedGirl(data.girls[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch girls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGirls();
  }, []);

  return (
    <>
      <AdminHeader title="Nastaveni kalendare" showBack={true} />
      <div style={{
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#e0d0d5',
            marginBottom: '8px'
          }}>
            Google Calendar Integrace
          </h1>
          <p style={{
            color: '#9a8a8e',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            Propojte svuj Google Calendar pro automatickou synchronizaci rezervaci.
            Kdyz vytvorite rezervaci na webu, automaticky se objevi ve vasem Google Calendar a naopak.
          </p>
        </div>

        {/* Google Calendar Connection */}
        <div style={{ marginBottom: '32px' }}>
          <GoogleCalendarConnect
            girlId={selectedGirl || undefined}
            onStatusChange={(connected) => {
              console.log('Calendar connection status:', connected);
            }}
          />
        </div>

        {/* Girl Selection for Sync */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            color: '#e0d0d5',
            marginBottom: '16px'
          }}>
            Vyberte divku pro synchronizaci
          </h3>

          {loading ? (
            <div style={{ color: '#9a8a8e' }}>Nacitam...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '12px'
            }}>
              {girls.map((girl) => (
                <button
                  key={girl.id}
                  onClick={() => setSelectedGirl(girl.id)}
                  style={{
                    padding: '16px 12px',
                    background: selectedGirl === girl.id
                      ? 'rgba(139,41,66,0.2)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedGirl === girl.id
                      ? '2px solid #8b2942'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: girl.color || '#8b2942',
                    margin: '0 auto 8px'
                  }} />
                  <span style={{
                    color: selectedGirl === girl.id ? '#e0d0d5' : '#9a8a8e',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}>
                    {girl.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          <p style={{
            color: '#9a8a8e',
            fontSize: '0.85rem',
            marginTop: '16px'
          }}>
            Synchronizace bude probihat pouze pro vybranou divku.
            Kazda divka muze mit propojeny vlastni Google Calendar.
          </p>
        </div>

        {/* Instructions */}
        <div style={{
          marginTop: '32px',
          background: 'rgba(139,41,66,0.1)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(139,41,66,0.2)'
        }}>
          <h3 style={{
            fontSize: '1rem',
            color: '#e0d0d5',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>💡</span> Jak to funguje
          </h3>
          <ul style={{
            color: '#9a8a8e',
            fontSize: '0.9rem',
            lineHeight: '1.8',
            paddingLeft: '20px',
            margin: 0
          }}>
            <li>Po pripojeni se existujici rezervace z webu prenesou do Google Calendar</li>
            <li>Udalosti z Google Calendar se importuji jako nove rezervace</li>
            <li>Pri vytvoreni nove rezervace na webu se automaticky vytvori udalost v Google</li>
            <li>Zmeny v rezervacich se synchronizuji obema smery</li>
            <li>Smazani rezervace odstrani i odpovidajici udalost z Google Calendar</li>
          </ul>
        </div>

        {/* Back button */}
        <div style={{ marginTop: '32px' }}>
          <button
            onClick={() => router.push('/manager/calendar')}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#9a8a8e',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            ← Zpet na kalendar
          </button>
        </div>
      </div>
    </>
  );
}
