"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import { getServiceName, getBasicServices, getExtraServices } from '@/lib/services';
import Image from 'next/image';

interface Application {
  id: number;
  name: string;
  age: number;
  height: number;
  weight: number;
  bust: number;
  hair: string;
  eyes: string;
  tattoo: number;
  tattoo_description: string;
  piercing: number;
  waist: number;
  hips: number;
  email: string;
  phone: string;
  telegram: string;
  experience: string;
  languages: string;
  availability: string;
  bio_cs: string;
  bio_en: string;
  photo_main: string;
  photo_gallery: string;
  services: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes: string;
  rejection_reason: string;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(1); // TODO: Get from session

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/applications?id=${params.id}`);
      const data = await response.json();
      if (data.success && data.applications.length > 0) {
        setApplication(data.applications[0]);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!application || !confirm('Schválit tuto žádost?')) return;

    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: application.id,
          status: 'approved',
          reviewed_by: userId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Žádost schválena! Teď můžeš vytvořit profil dívky.');
        router.push('/admin/applications');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Chyba při schvalování');
    }
  };

  const handleReject = async () => {
    if (!application) return;
    const reason = prompt('Důvod zamítnutí (volitelné):');
    if (reason === null) return; // Cancelled

    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: application.id,
          status: 'rejected',
          reviewed_by: userId,
          rejection_reason: reason
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Žádost zamítnuta');
        router.push('/admin/applications');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Chyba při zamítání');
    }
  };

  const handleDelete = async () => {
    if (!application || !confirm('Opravdu smazat tuto žádost?')) return;

    try {
      const response = await fetch(`/api/applications?id=${application.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        alert('Žádost smazána');
        router.push('/admin/applications');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Chyba při mazání');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseJSON = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <>
        <AdminHeader title="Detail žádosti" showBack={true} />
        <div className="admin-container">
          <div className="loading">Načítání...</div>
        </div>
      </>
    );
  }

  if (!application) {
    return (
      <>
        <AdminHeader title="Detail žádosti" showBack={true} />
        <div className="admin-container">
          <div className="error">Žádost nenalezena</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={`Detail žádosti`} showBack={true} />
      <div className="admin-container">
        <div className="detail-content">
          {/* Header with name and status */}
          <div className="detail-header">
            <div>
              <h1 className="applicant-name">{application.name}</h1>
              <p className="applicant-meta">{application.age} let • {application.height || '?'} cm • {application.weight || '?'} kg</p>
            </div>
            <div className="status-badge" data-status={application.status}>
              {application.status === 'pending' && '⏳ ČEKÁ NA SCHVÁLENÍ'}
              {application.status === 'approved' && '✅ SCHVÁLENO'}
              {application.status === 'rejected' && '❌ ZAMÍTNUTO'}
            </div>
          </div>

          {/* Measurements highlight */}
          {application.bust && application.waist && application.hips && (
            <div className="measurements-card">
              <div className="measurements-icon">📏</div>
              <div>
                <div className="measurements-label">Míry</div>
                <div className="measurements-value">{application.bust} - {application.waist} - {application.hips}</div>
              </div>
            </div>
          )}

          {/* Two column layout for stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-label">Věk</div>
              <div className="stat-value">{application.age} let</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📐</div>
              <div className="stat-label">Výška</div>
              <div className="stat-value">{application.height || '?'} cm</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚖️</div>
              <div className="stat-label">Váha</div>
              <div className="stat-value">{application.weight || '?'} kg</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💝</div>
              <div className="stat-label">Poprsí</div>
              <div className="stat-value">{application.bust || '?'}</div>
            </div>
          </div>

          <div className="detail-section">
            <h3>💇‍♀️ Vzhled</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Barva vlasů</span>
                <span className="info-value">{application.hair || 'Neuvedeno'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Barva očí</span>
                <span className="info-value">{application.eyes || 'Neuvedeno'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tetování</span>
                <span className="info-value">{application.tattoo ? '✅ Ano' : '❌ Ne'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Piercing</span>
                <span className="info-value">{application.piercing ? '✅ Ano' : '❌ Ne'}</span>
              </div>
            </div>
            {application.tattoo && application.tattoo_description && (
              <p style={{ marginTop: '1rem', color: '#9ca3af' }}>
                <strong>Popis tetování:</strong> {application.tattoo_description}
              </p>
            )}
          </div>

          <div className="detail-section">
            <h3>📱 Kontakt</h3>
            <div className="contact-grid">
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-label">Telefon</div>
                  <div className="contact-value">{application.phone}</div>
                </div>
              </div>
              {application.email && (
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">{application.email}</div>
                  </div>
                </div>
              )}
              {application.telegram && (
                <div className="contact-item">
                  <div className="contact-icon">💬</div>
                  <div>
                    <div className="contact-label">Telegram</div>
                    <div className="contact-value">{application.telegram}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>💼 Profesní informace</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Zkušenosti</span>
                <span className="info-value">{application.experience}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Jazyky</span>
                <span className="info-value">{parseJSON(application.languages).join(', ') || 'Neuvedeno'}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Dostupnost</span>
                <span className="info-value">{parseJSON(application.availability).join(', ') || 'Neuvedeno'}</span>
              </div>
            </div>
          </div>

          {application.bio_cs && (
            <div className="detail-section">
              <h3>Bio (CS)</h3>
              <p className="bio-text">{application.bio_cs}</p>
            </div>
          )}

          {application.bio_en && (
            <div className="detail-section">
              <h3>Bio (EN)</h3>
              <p className="bio-text">{application.bio_en}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>📸 Fotografie</h3>
            {application.photo_main && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p><strong>Hlavní fotka:</strong></p>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px', height: '500px', borderRadius: '12px', overflow: 'hidden', marginTop: '1rem' }}>
                  <Image
                    src={application.photo_main}
                    alt="Hlavní fotka"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}
            {application.photo_gallery && parseJSON(application.photo_gallery).length > 0 && (
              <div>
                <p><strong>Galerie ({parseJSON(application.photo_gallery).length} fotek):</strong></p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {parseJSON(application.photo_gallery).map((url: string, idx: number) => (
                    <div key={idx} style={{ position: 'relative', width: '100%', height: '250px', borderRadius: '8px', overflow: 'hidden' }}>
                      <Image
                        src={url}
                        alt={`Galerie ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!application.photo_main && (!application.photo_gallery || parseJSON(application.photo_gallery).length === 0) && (
              <p style={{ color: '#9ca3af' }}>Žádné fotky nebyly nahrány</p>
            )}
          </div>

          <div className="detail-section">
            <h3>💎 Služby</h3>
            {application.services && parseJSON(application.services).length > 0 ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ marginBottom: '0.75rem', color: '#22c55e' }}><strong>Základní služby (vždy nabízí):</strong></p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {getBasicServices().map((service) => (
                      <span
                        key={service.id}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          color: '#22c55e'
                        }}
                      >
                        ✓ {getServiceName(service.id, 'cs')}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ marginBottom: '0.75rem', color: '#d4af37' }}><strong>Extra služby (volitelné):</strong></p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {parseJSON(application.services)
                      .filter((serviceId: string) => getExtraServices().some(s => s.id === serviceId))
                      .map((serviceId: string) => (
                        <span
                          key={serviceId}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(212, 175, 55, 0.15)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            color: '#d4af37'
                          }}
                        >
                          ⭐ {getServiceName(serviceId, 'cs')}
                        </span>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: '#9ca3af' }}>Žádné služby nebyly vybrány</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Meta informace</h3>
            <p><strong>Podáno:</strong> {formatDate(application.created_at)}</p>
            {application.notes && <p><strong>Poznámky:</strong> {application.notes}</p>}
            {application.rejection_reason && (
              <p><strong>Důvod zamítnutí:</strong> {application.rejection_reason}</p>
            )}
          </div>

          {application.status === 'pending' && (
            <div className="action-buttons">
              <button onClick={handleReject} className="btn-reject">
                ❌ Zamítnout
              </button>
              <button onClick={handleApprove} className="btn-approve">
                ✅ Schválit
              </button>
            </div>
          )}

          <div className="action-buttons-secondary">
            <button onClick={handleDelete} className="btn-delete">
              🗑️ Smazat žádost
            </button>
            <button onClick={() => router.back()} className="btn-back">
              ← Zpět na seznam
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
