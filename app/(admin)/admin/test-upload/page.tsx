'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/debug/test-upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setResult({
        status: response.status,
        ok: response.ok,
        data
      });
    } catch (error) {
      setResult({
        status: 'ERROR',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Test Photo Upload</h1>

      <div style={{
        padding: '2rem',
        border: '2px dashed #666',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <label style={{
          display: 'block',
          padding: '1rem',
          background: '#333',
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer'
        }}>
          {loading ? 'Nahrávám...' : 'Vybrat fotku'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={loading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {result && (
        <div style={{
          padding: '1.5rem',
          background: result.ok ? '#1a3a1a' : '#3a1a1a',
          border: `2px solid ${result.ok ? '#2a5a2a' : '#5a2a2a'}`,
          borderRadius: '8px',
          color: 'white'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>
            {result.ok ? '✅ SUCCESS' : '❌ FAILED'}
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <strong>HTTP Status:</strong> {result.status}
          </div>

          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', padding: '0.5rem', background: '#222', borderRadius: '4px' }}>
              Zobrazit detaily
            </summary>
            <pre style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#000',
              overflow: 'auto',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>

          {result.data?.steps && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Kroky:</h3>
              {result.data.steps.map((step: any, i: number) => (
                <div key={i} style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: step.status === 'OK' || step.status === 'SUCCESS' ? '#1a2a1a' : '#2a1a1a',
                  borderLeft: `4px solid ${step.status === 'OK' || step.status === 'SUCCESS' ? '#2a5a2a' : '#5a2a2a'}`,
                  borderRadius: '4px'
                }}>
                  <div><strong>{step.step}</strong>: {step.status}</div>
                  {step.error && <div style={{ color: '#ff6b6b', marginTop: '0.25rem' }}>Error: {step.error}</div>}
                  {step.url && <div style={{ color: '#69db7c', marginTop: '0.25rem' }}>URL: {step.url}</div>}
                </div>
              ))}
            </div>
          )}

          {result.data?.message && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#2a5a2a',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              {result.data.message}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#1a1a1a', borderRadius: '4px' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Instrukce:</h3>
        <ol style={{ paddingLeft: '1.5rem', lineHeight: 1.6 }}>
          <li>Vyber libovolnou fotku</li>
          <li>Systém zkusí nahrát do Vercel Blob</li>
          <li>Uvidíš přesně, kde selhává</li>
          <li>Když uvidíš SUCCESS, nahrávání funguje!</li>
        </ol>
      </div>
    </div>
  );
}
