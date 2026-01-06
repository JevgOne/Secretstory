'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [envCheck, setEnvCheck] = useState<any>(null);
  const [uploadCheck, setUploadCheck] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkEnv();
  }, []);

  const checkEnv = async () => {
    try {
      const res = await fetch('/api/admin/debug/check-env');
      const data = await res.json();
      setEnvCheck(data);
    } catch (error) {
      setEnvCheck({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadCheck({ status: 'uploading' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/debug/test-upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setUploadCheck({ status: res.ok ? 'success' : 'failed', data });
    } catch (error) {
      setUploadCheck({ status: 'error', error: String(error) });
    }

    e.target.value = '';
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        <h1>Loading diagnostics...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>🔧 Upload Diagnostics</h1>

      {/* Environment Check */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        background: envCheck?.overall === 'ALL_OK' ? '#1a3a1a' : '#3a1a1a',
        border: `2px solid ${envCheck?.overall === 'ALL_OK' ? '#2a5a2a' : '#5a2a2a'}`,
        borderRadius: '8px'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>
          {envCheck?.overall === 'ALL_OK' ? '✅ Environment Variables' : '❌ Environment Variables'}
        </h2>

        {envCheck?.checks && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(envCheck.checks).map(([key, value]: [string, any]) => (
              <div key={key} style={{
                padding: '1rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                borderLeft: `4px solid ${value.status === 'OK' ? '#2a5a2a' : '#5a2a2a'}`
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {value.status === 'OK' ? '✅' : '❌'} {key}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Status: {value.status}
                </div>
                {value.prefix && (
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.25rem' }}>
                    {value.prefix}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {envCheck?.instructions && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(251,146,60,0.1)',
            border: '1px solid rgba(251,146,60,0.3)',
            borderRadius: '4px'
          }}>
            <strong>⚠️ Action Required:</strong>
            <p style={{ margin: '0.5rem 0 0 0' }}>{envCheck.instructions}</p>
          </div>
        )}
      </div>

      {/* Upload Test */}
      <div style={{
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>🧪 Test Upload</h2>

        <label style={{
          display: 'block',
          padding: '1.5rem',
          background: 'rgba(236, 72, 153, 0.1)',
          border: '2px dashed rgba(236, 72, 153, 0.5)',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📷</div>
          <div>Click to test upload</div>
          <input
            type="file"
            accept="image/*"
            onChange={testUpload}
            style={{ display: 'none' }}
          />
        </label>

        {uploadCheck && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: uploadCheck.status === 'success' ? '#1a3a1a' : '#3a1a1a',
            border: `2px solid ${uploadCheck.status === 'success' ? '#2a5a2a' : '#5a2a2a'}`,
            borderRadius: '4px'
          }}>
            <h3>{uploadCheck.status === 'success' ? '✅ Upload Success' : '❌ Upload Failed'}</h3>
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer' }}>View Details</summary>
              <pre style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#000',
                overflow: 'auto',
                fontSize: '0.8rem'
              }}>
                {JSON.stringify(uploadCheck.data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
        <h3>💡 Quick Fixes</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>If BLOB_READ_WRITE_TOKEN is missing → Set in Vercel dashboard</li>
          <li>If test upload works here but not in girl edit → Check girl ID exists</li>
          <li>If you see FOREIGN KEY error → Girl doesn't exist in database</li>
        </ul>
      </div>
    </div>
  );
}
