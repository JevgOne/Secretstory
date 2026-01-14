'use client';

import { useRouter } from 'next/navigation';
import GoogleCalendarConnect from '@/components/GoogleCalendarConnect';

export default function GirlCalendarSettingsPage() {
  const router = useRouter();

  return (
    <div style={{
      padding: '24px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: '#9a8a8e',
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Zpet
        </button>

        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#e0d0d5',
          marginBottom: '8px'
        }}>
          Google Calendar
        </h1>
        <p style={{
          color: '#9a8a8e',
          fontSize: '0.95rem',
          lineHeight: '1.6'
        }}>
          Propojte svuj Google Calendar pro prehled vasich rezervaci.
        </p>
      </div>

      {/* Google Calendar Connection */}
      <GoogleCalendarConnect
        onStatusChange={(connected) => {
          console.log('Calendar connection status:', connected);
        }}
      />

      {/* Info */}
      <div style={{
        marginTop: '24px',
        background: 'rgba(139,41,66,0.1)',
        borderRadius: '12px',
        padding: '20px',
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
          <span>💡</span> Vyhody propojeni
        </h3>
        <ul style={{
          color: '#9a8a8e',
          fontSize: '0.9rem',
          lineHeight: '1.8',
          paddingLeft: '20px',
          margin: 0
        }}>
          <li>Vase rezervace se automaticky zobrazi ve vasem Google Calendar</li>
          <li>Dostanete upozorneni na nadchazejici rezervace</li>
          <li>Muzete si rezervace synchronizovat s telefonem</li>
        </ul>
      </div>
    </div>
  );
}
