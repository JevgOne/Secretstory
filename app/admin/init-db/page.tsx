"use client";

import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";

export default function InitDbPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const createSchedulesTables = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/init-schedules-db', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const migrateSoftDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/migrate-soft-delete', {
        method: 'POST'
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Database Init" showBack={true} />

      <main className="app-content">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '20px' }}>Database Initialization</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={createSchedulesTables}
              disabled={loading}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #8b2942 0%, #5c1c2e 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Creating...' : 'Create Schedules Tables'}
            </button>

            <button
              onClick={migrateSoftDelete}
              disabled={loading}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Migrating...' : 'Migrate Soft Delete'}
            </button>
          </div>

          {result && (
            <div style={{
              background: '#231a1e',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <h3 style={{ marginBottom: '12px', fontSize: '0.9rem' }}>Result:</h3>
              <pre style={{
                fontSize: '0.8rem',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {result}
              </pre>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
