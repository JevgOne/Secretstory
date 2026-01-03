"use client";

import { useState, useEffect } from 'react';

interface Application {
  id: number;
  name: string;
  age: number;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hips: number;
  hair: string;
  eyes: string;
  tattoo: number;
  tattoo_description: string;
  piercing: number;
  email: string;
  phone: string;
  telegram: string;
  experience: string;
  languages: string;
  availability: string;
  bio_cs: string;
  bio_en: string;
  status: string;
  created_at: string;
}

export default function QuickViewPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApplications(data.applications);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const parseJSON = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: 'white' }}>Načítání...</div>;
  }

  return (
    <div style={{
      padding: '20px',
      background: '#1f1f23',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <h1 style={{ marginBottom: '30px' }}>ŽÁDOSTI O PROFIL - Quick View</h1>

      {applications.map((app) => (
        <div key={app.id} style={{
          background: '#2d2d31',
          border: '2px solid #3d3d41',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            color: '#d4af37',
            fontSize: '24px',
            marginBottom: '20px',
            borderBottom: '2px solid #3d3d41',
            paddingBottom: '10px'
          }}>
            {app.name} (ID: {app.id})
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '12px', marginBottom: '20px' }}>
            <strong>Věk:</strong> <span>{app.age} let</span>
            <strong>Výška:</strong> <span>{app.height || '?'} cm</span>
            <strong>Váha:</strong> <span>{app.weight || '?'} kg</span>
            <strong>Míry:</strong> <span>{app.bust || '?'}-{app.waist || '?'}-{app.hips || '?'}</span>
            <strong>Vlasy:</strong> <span>{app.hair || 'N/A'}</span>
            <strong>Oči:</strong> <span>{app.eyes || 'N/A'}</span>
            <strong>Tetování:</strong> <span>{app.tattoo ? 'Ano' : 'Ne'}</span>
            {app.tattoo_description && (
              <>
                <strong>Popis tetování:</strong> <span>{app.tattoo_description}</span>
              </>
            )}
            <strong>Piercing:</strong> <span>{app.piercing ? 'Ano' : 'Ne'}</span>
            <strong>Telefon:</strong> <span style={{ color: '#4ade80' }}>{app.phone}</span>
            <strong>Email:</strong> <span style={{ color: '#4ade80' }}>{app.email || 'N/A'}</span>
            <strong>Telegram:</strong> <span style={{ color: '#4ade80' }}>{app.telegram || 'N/A'}</span>
            <strong>Zkušenosti:</strong> <span>{app.experience}</span>
            <strong>Jazyky:</strong> <span>{parseJSON(app.languages).join(', ') || 'N/A'}</span>
            <strong>Dostupnost:</strong> <span>{parseJSON(app.availability).join(', ') || 'N/A'}</span>
            <strong>Status:</strong> <span style={{
              color: app.status === 'pending' ? '#fbbf24' : app.status === 'approved' ? '#22c55e' : '#ef4444',
              fontWeight: 'bold'
            }}>{app.status.toUpperCase()}</span>
            <strong>Podáno:</strong> <span>{new Date(app.created_at).toLocaleString('cs-CZ')}</span>
          </div>

          {app.bio_cs && (
            <div style={{ marginTop: '20px' }}>
              <strong style={{ color: '#d4af37' }}>Bio (CZ):</strong>
              <p style={{
                marginTop: '8px',
                padding: '12px',
                background: '#1f1f23',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap'
              }}>{app.bio_cs}</p>
            </div>
          )}

          {app.bio_en && (
            <div style={{ marginTop: '20px' }}>
              <strong style={{ color: '#d4af37' }}>Bio (EN):</strong>
              <p style={{
                marginTop: '8px',
                padding: '12px',
                background: '#1f1f23',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap'
              }}>{app.bio_en}</p>
            </div>
          )}
        </div>
      ))}

      {applications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          Žádné žádosti nenalezeny
        </div>
      )}
    </div>
  );
}
