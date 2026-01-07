"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';

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
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes: string;
  rejection_reason: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [viewingApp, setViewingApp] = useState<Application | null>(null);
  const [userId] = useState(1); // TODO: Get from session

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`/api/applications?status=${filter}`);
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('Schválit tuto žádost?')) return;

    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'approved',
          reviewed_by: userId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Žádost schválena! Teď můžeš vytvořit profil dívky.');
        fetchApplications();
        setViewingApp(null);
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Chyba při schvalování');
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Důvod zamítnutí (volitelné):');
    if (reason === null) return; // Cancelled

    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'rejected',
          reviewed_by: userId,
          rejection_reason: reason
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Žádost zamítnuta');
        fetchApplications();
        setViewingApp(null);
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Chyba při zamítání');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Opravdu smazat tuto žádost?')) return;

    try {
      const response = await fetch(`/api/applications?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        alert('Žádost smazána');
        fetchApplications();
        setViewingApp(null);
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

  return (
    <>
      <AdminHeader title="Žádosti o profil" showBack={true} />
      <div className="admin-container">
        {/* Filter buttons */}
        <div className="filters">
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              border: '1px solid #3d3d41',
              background: filter === 'pending'
                ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
                : '#2d2d31',
              color: filter === 'pending' ? '#1f1f23' : '#9ca3af',
              transition: 'all 0.2s ease',
              boxShadow: filter === 'pending'
                ? '0 4px 12px rgba(212, 175, 55, 0.3)'
                : 'none'
            }}
          >
            ⏳ Čekající ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              border: '1px solid #3d3d41',
              background: filter === 'approved'
                ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
                : '#2d2d31',
              color: filter === 'approved' ? '#1f1f23' : '#9ca3af',
              transition: 'all 0.2s ease',
              boxShadow: filter === 'approved'
                ? '0 4px 12px rgba(212, 175, 55, 0.3)'
                : 'none'
            }}
          >
            ✅ Schválené
          </button>
          <button
            onClick={() => setFilter('rejected')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              border: '1px solid #3d3d41',
              background: filter === 'rejected'
                ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
                : '#2d2d31',
              color: filter === 'rejected' ? '#1f1f23' : '#9ca3af',
              transition: 'all 0.2s ease',
              boxShadow: filter === 'rejected'
                ? '0 4px 12px rgba(212, 175, 55, 0.3)'
                : 'none'
            }}
          >
            ❌ Zamítnuté
          </button>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              border: '1px solid #3d3d41',
              background: filter === 'all'
                ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
                : '#2d2d31',
              color: filter === 'all' ? '#1f1f23' : '#9ca3af',
              transition: 'all 0.2s ease',
              boxShadow: filter === 'all'
                ? '0 4px 12px rgba(212, 175, 55, 0.3)'
                : 'none'
            }}
          >
            📋 Všechny
          </button>
        </div>

        {/* Applications grid */}
        {loading ? (
          <div className="loading">Načítání...</div>
        ) : (
          <div className="applications-grid">
            {applications.map((app) => (
              <div
                key={app.id}
                className="app-card"
              >
                <div className="app-header">
                  <div>
                    <h3>{app.name}</h3>
                    <p className="app-meta">
                      {app.age} let • {app.height ? `${app.height}cm` : '?'} • {app.weight ? `${app.weight}kg` : '?'}
                    </p>
                    {app.bust && app.waist && app.hips && (
                      <p className="app-measurements">
                        {app.bust}-{app.waist}-{app.hips}
                      </p>
                    )}
                  </div>
                  <div className="app-status-badge" data-status={app.status}>
                    {app.status === 'pending' && '⏳ Čeká'}
                    {app.status === 'approved' && '✅ Schváleno'}
                    {app.status === 'rejected' && '❌ Zamítnuto'}
                  </div>
                </div>

                <div className="app-details">
                  <p><strong>📞</strong> {app.phone}</p>
                  {app.email && <p><strong>✉️</strong> {app.email}</p>}
                  {app.telegram && <p><strong>💬</strong> {app.telegram}</p>}
                </div>

                <div className="app-skills">
                  <span className="skill-badge">{app.experience}</span>
                  {parseJSON(app.languages).slice(0, 3).map((lang: string) => (
                    <span key={lang} className="skill-badge">{lang}</span>
                  ))}
                </div>

                <p className="app-date">Podáno {formatDate(app.created_at)}</p>

                <Link
                  href={`/admin/applications/${app.id}`}
                  className="detail-button"
                >
                  👁️ Detail
                </Link>
              </div>
            ))}

            {applications.length === 0 && (
              <div className="empty-state">
                <p>Žádné žádosti nenalezeny</p>
              </div>
            )}
          </div>
        )}

        {/* Detail Modal */}
        {viewingApp && (
          <div className="modal-overlay" onClick={() => setViewingApp(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Detail žádosti - {viewingApp.name}</h2>

              <div className="detail-section">
                <h3>Osobní údaje</h3>
                <div className="detail-grid">
                  <div><strong>Věk:</strong> {viewingApp.age} let</div>
                  <div><strong>Výška:</strong> {viewingApp.height || '?'} cm</div>
                  <div><strong>Váha:</strong> {viewingApp.weight || '?'} kg</div>
                  <div><strong>Poprsí:</strong> {viewingApp.bust || '?'}</div>
                  <div><strong>Pas:</strong> {viewingApp.waist || '?'} cm</div>
                  <div><strong>Boky:</strong> {viewingApp.hips || '?'} cm</div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Vzhled</h3>
                <div className="detail-grid">
                  <div><strong>💇‍♀️ Barva vlasů:</strong> {viewingApp.hair || '?'}</div>
                  <div><strong>👁️ Barva očí:</strong> {viewingApp.eyes || '?'}</div>
                  <div><strong>💉 Tetování:</strong> {viewingApp.tattoo ? 'Ano' : 'Ne'}</div>
                  <div><strong>✨ Piercing:</strong> {viewingApp.piercing ? 'Ano' : 'Ne'}</div>
                </div>
                {viewingApp.tattoo && viewingApp.tattoo_description && (
                  <p style={{ marginTop: '1rem' }}>
                    <strong>Popis tetování:</strong> {viewingApp.tattoo_description}
                  </p>
                )}
              </div>

              <div className="detail-section">
                <h3>Kontakt</h3>
                <p><strong>Telefon:</strong> {viewingApp.phone}</p>
                {viewingApp.email && <p><strong>Email:</strong> {viewingApp.email}</p>}
                {viewingApp.telegram && <p><strong>Telegram:</strong> {viewingApp.telegram}</p>}
              </div>

              <div className="detail-section">
                <h3>Profesní info</h3>
                <p><strong>Zkušenosti:</strong> {viewingApp.experience}</p>
                <p><strong>Jazyky:</strong> {parseJSON(viewingApp.languages).join(', ') || 'Neuvedeno'}</p>
                <p><strong>Dostupnost:</strong> {parseJSON(viewingApp.availability).join(', ') || 'Neuvedeno'}</p>
              </div>

              {viewingApp.bio_cs && (
                <div className="detail-section">
                  <h3>Bio (CS)</h3>
                  <p>{viewingApp.bio_cs}</p>
                </div>
              )}

              {viewingApp.bio_en && (
                <div className="detail-section">
                  <h3>Bio (EN)</h3>
                  <p>{viewingApp.bio_en}</p>
                </div>
              )}

              {viewingApp.status === 'pending' && (
                <div className="modal-actions">
                  <button
                    onClick={() => handleReject(viewingApp.id)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    ❌ Zamítnout
                  </button>
                  <button
                    onClick={() => handleApprove(viewingApp.id)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    ✅ Schválit
                  </button>
                </div>
              )}

              <div className="modal-actions">
                <button
                  onClick={() => handleDelete(viewingApp.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: '1px solid #3d3d41',
                    background: '#2d2d31',
                    color: '#9ca3af',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🗑️ Smazat žádost
                </button>
                <button
                  onClick={() => setViewingApp(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: '1px solid #3d3d41',
                    background: '#2d2d31',
                    color: '#9ca3af',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Zavřít
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
