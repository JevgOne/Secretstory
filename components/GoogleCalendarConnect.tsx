'use client';

import { useState, useEffect } from 'react';

interface CalendarStatus {
  connected: boolean;
  calendarId?: string;
  syncEnabled?: boolean;
  lastSyncAt?: string;
  connectedAt?: string;
}

interface SyncStats {
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  bookingsCreated: number;
  bookingsUpdated: number;
}

interface GoogleCalendarConnectProps {
  girlId?: number;
  onStatusChange?: (connected: boolean) => void;
  className?: string;
}

export default function GoogleCalendarConnect({
  girlId,
  onStatusChange,
  className = ''
}: GoogleCalendarConnectProps) {
  const [status, setStatus] = useState<CalendarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastSyncStats, setLastSyncStats] = useState<SyncStats | null>(null);

  // Fetch connection status
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();

      if (data.success) {
        setStatus({
          connected: data.connected,
          calendarId: data.calendarId,
          syncEnabled: data.syncEnabled,
          lastSyncAt: data.lastSyncAt,
          connectedAt: data.connectedAt
        });
        onStatusChange?.(data.connected);
      }
    } catch (err) {
      console.error('Failed to fetch calendar status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Check URL params for success/error from OAuth callback
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get('success');
    const errorParam = params.get('error');

    if (successParam === 'connected') {
      setSuccess('Google Calendar byl uspesne propojen!');
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    } else if (errorParam) {
      const errorMessages: Record<string, string> = {
        google_denied: 'Pristup ke Google Calendar byl odepren.',
        missing_params: 'Chybejici parametry z Google.',
        invalid_state: 'Neplatny pozadavek. Zkuste to znovu.',
        exchange_failed: 'Chyba pri pripojovani ke Google.'
      };
      setError(errorMessages[errorParam] || 'Neznama chyba.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Connect to Google Calendar
  const handleConnect = () => {
    // Redirect to OAuth endpoint
    window.location.href = '/api/auth/google';
  };

  // Disconnect from Google Calendar
  const handleDisconnect = async () => {
    if (!confirm('Opravdu chcete odpojit Google Calendar? Synchronizace bude zastavena.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ connected: false });
        setSuccess('Google Calendar byl odpojen.');
        onStatusChange?.(false);
      } else {
        setError(data.error || 'Chyba pri odpojovani.');
      }
    } catch (err) {
      setError('Chyba pri odpojovani Google Calendar.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger manual sync
  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: 'both',
          girlId
        })
      });

      const data = await response.json();

      if (data.success) {
        setLastSyncStats(data.stats);
        setSuccess(`Synchronizace dokoncena! Vytvoreno: ${data.stats.bookingsCreated} rezervaci, ${data.stats.eventsCreated} udalosti.`);
        fetchStatus(); // Refresh last sync time
      } else {
        setError(data.error || 'Chyba pri synchronizaci.');
        if (data.errors?.length > 0) {
          console.error('Sync errors:', data.errors);
        }
      }
    } catch (err) {
      setError('Chyba pri synchronizaci kalendare.');
    } finally {
      setSyncing(false);
    }
  };

  // Toggle sync enabled
  const handleToggleSync = async () => {
    if (!status?.connected) return;

    try {
      const response = await fetch('/api/calendar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncEnabled: !status.syncEnabled
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus(prev => prev ? { ...prev, syncEnabled: !prev.syncEnabled } : null);
      }
    } catch (err) {
      console.error('Failed to toggle sync:', err);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`gcal-connect-card ${className}`} style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9a8a8e' }}>
          <div className="spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(139,41,66,0.3)',
            borderTopColor: '#8b2942',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Nacitam...
        </div>
      </div>
    );
  }

  return (
    <div className={`gcal-connect-card ${className}`} style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: status?.connected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {status?.connected ? '📅' : '🔗'}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#e0d0d5' }}>
            Google Calendar
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#9a8a8e' }}>
            {status?.connected ? 'Pripojeno' : 'Nepripojeno'}
          </p>
        </div>
        {status?.connected && (
          <div style={{
            marginLeft: 'auto',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: status.syncEnabled ? '#22c55e' : '#ef4444'
          }} />
        )}
      </div>

      {/* Status messages */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#ef4444',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#22c55e',
          fontSize: '0.9rem'
        }}>
          {success}
        </div>
      )}

      {/* Connected state */}
      {status?.connected ? (
        <div>
          {/* Last sync info */}
          {status.lastSyncAt && (
            <div style={{
              fontSize: '0.85rem',
              color: '#9a8a8e',
              marginBottom: '16px'
            }}>
              Posledni synchronizace: {formatDate(status.lastSyncAt)}
            </div>
          )}

          {/* Sync toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '16px'
          }}>
            <span style={{ color: '#e0d0d5', fontSize: '0.9rem' }}>
              Automaticka synchronizace
            </span>
            <button
              onClick={handleToggleSync}
              style={{
                width: '48px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                background: status.syncEnabled ? '#8b2942' : 'rgba(255,255,255,0.1)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '2px',
                left: status.syncEnabled ? '26px' : '2px',
                transition: 'left 0.2s'
              }} />
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSync}
              disabled={syncing}
              style={{
                flex: 1,
                padding: '12px',
                background: syncing ? 'rgba(139,41,66,0.3)' : 'rgba(139,41,66,0.2)',
                border: '1px solid rgba(139,41,66,0.4)',
                borderRadius: '8px',
                color: '#e0d0d5',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: syncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {syncing ? (
                <>
                  <div className="spinner" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(224,208,213,0.3)',
                    borderTopColor: '#e0d0d5',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Synchronizuji...
                </>
              ) : (
                <>🔄 Synchronizovat</>
              )}
            </button>

            <button
              onClick={handleDisconnect}
              style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Odpojit
            </button>
          </div>
        </div>
      ) : (
        /* Not connected state */
        <div>
          <p style={{
            color: '#9a8a8e',
            fontSize: '0.9rem',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            Propojte svuj Google Calendar pro automatickou synchronizaci rezervaci.
            Vase rezervace se budou automaticky zobrazovat v Google Calendar a naopak.
          </p>

          <button
            onClick={handleConnect}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #8b2942 0%, #6b1d32 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Pripojit Google Calendar
          </button>
        </div>
      )}

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
