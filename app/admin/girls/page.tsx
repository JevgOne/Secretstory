"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';

interface Girl {
  id: number;
  name: string;
  slug: string;
  age: number;
  status: 'active' | 'pending' | 'inactive';
  online: boolean;
  verified: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export default function AdminGirlsPage() {
  const router = useRouter();
  const [girls, setGirls] = useState<Girl[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchGirls();
  }, [filter]);

  const fetchGirls = async () => {
    try {
      let url = '/api/admin/girls';
      if (filter !== 'all') url += `?status=${filter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setGirls(data.girls);
      }
    } catch (err) {
      console.error('Error fetching girls:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (girlId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/girls/${girlId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        fetchGirls();
      } else {
        alert(data.error || 'Chyba při změně statusu');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Chyba při změně statusu');
    }
  };

  const handleToggleOnline = async (girlId: number, currentOnline: boolean) => {
    try {
      const response = await fetch(`/api/admin/girls/${girlId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ online: !currentOnline })
      });

      const data = await response.json();

      if (data.success) {
        fetchGirls();
      }
    } catch (err) {
      console.error('Error toggling online:', err);
    }
  };

  const handleDelete = async (girlId: number, girlName: string) => {
    if (!confirm(`Opravdu chcete smazat profil ${girlName}? Tato akce je nevratná.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/girls/${girlId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchGirls();
      } else {
        alert(data.error || 'Chyba při mazání profilu');
      }
    } catch (err) {
      console.error('Error deleting girl:', err);
      alert('Chyba při mazání profilu');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      active: { background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
      pending: { background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' },
      inactive: { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }
    };

    const labels = {
      active: 'Aktivní',
      pending: 'Čeká',
      inactive: 'Neaktivní'
    };

    return (
      <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', ...styles[status] }}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <>
      <AdminHeader title="Správa dívek" showBack={true} />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p className="admin-subtitle">Přidávejte a upravujte profily dívek</p>
          </div>
          <Link href="/admin/girls/new" className="btn btn-primary">
            + Přidat novou dívku
          </Link>
        </div>

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Všechny ({girls.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Aktivní
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Čekající
        </button>
        <button
          className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
          onClick={() => setFilter('inactive')}
        >
          Neaktivní
        </button>
      </div>

      {loading ? (
        <div className="loading">Načítání...</div>
      ) : (
        <div className="girls-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Jméno</th>
                <th>Věk</th>
                <th>Status</th>
                <th>Online</th>
                <th>Hodnocení</th>
                <th>Recenze</th>
                <th>Vytvořeno</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              {girls.map((girl) => (
                <tr key={girl.id}>
                  <td>{girl.id}</td>
                  <td>
                    <div className="girl-name">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {girl.verified && <span className="verified-badge">✓</span>}
                        <strong>{girl.name}</strong>
                      </div>
                      <div className="slug">/{girl.slug}</div>
                    </div>
                  </td>
                  <td>{girl.age}</td>
                  <td>{getStatusBadge(girl.status)}</td>
                  <td>
                    <button
                      className={`toggle-btn ${girl.online ? 'online' : 'offline'}`}
                      onClick={() => handleToggleOnline(girl.id, girl.online)}
                    >
                      {girl.online ? 'Online' : 'Offline'}
                    </button>
                  </td>
                  <td>{girl.rating > 0 ? girl.rating.toFixed(1) : '-'}</td>
                  <td>{girl.reviews_count}</td>
                  <td>{new Date(girl.created_at).toLocaleDateString('cs-CZ')}</td>
                  <td>
                    <div className="action-buttons">
                      <Link href={`/admin/girls/${girl.id}/edit`} className="action-btn edit">
                        Upravit
                      </Link>
                      <Link href={`/cs/profily/${girl.slug}`} className="action-btn view" target="_blank">
                        Zobrazit
                      </Link>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(girl.id, girl.name)}
                      >
                        Smazat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {girls.length === 0 && (
            <div className="empty-state">
              <p>Žádné dívky nenalezeny</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .admin-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          background: #1f1f23;
          min-height: 100vh;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .admin-subtitle {
          color: #9ca3af;
          font-size: 0.875rem;
          margin-top: 4px;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background: #d4af37;
          color: #1f1f23;
          border: 1px solid #d4af37;
        }

        .btn-primary:hover {
          background: #c19b2b;
          border-color: #c19b2b;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(212, 175, 55, 0.3);
        }

        .filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          background: #2d2d31;
          border: 1px solid #3d3d41;
          border-radius: 8px;
          color: #9ca3af;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-btn:hover {
          border-color: #4d4d51;
          background: #35353a;
        }

        .filter-btn.active {
          background: #d4af37;
          color: #1f1f23;
          border-color: #d4af37;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #9ca3af;
          font-size: 0.875rem;
          background: #2d2d31;
          border-radius: 12px;
        }

        .girls-table {
          background: #2d2d31;
          border: 1px solid #3d3d41;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #1f1f23;
          border-bottom: 1px solid #3d3d41;
        }

        th {
          padding: 12px 16px;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        td {
          padding: 16px;
          border-top: 1px solid #3d3d41;
          color: #ffffff;
          font-size: 0.875rem;
          background: #2d2d31;
        }

        tbody tr:hover td {
          background: #35353a;
        }

        .girl-name {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .verified-badge {
          background: #10b981;
          color: #fff;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .slug {
          font-size: 0.75rem;
          color: #9ca3af;
          font-family: 'Monaco', monospace;
        }

        .toggle-btn {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-btn.online {
          background: #d1fae5;
          color: #065f46;
          border-color: #10b981;
        }

        .toggle-btn.online:hover {
          background: #a7f3d0;
          transform: translateY(-1px);
        }

        .toggle-btn.offline {
          background: #f3f4f6;
          color: #6b7280;
          border-color: #d1d5db;
        }

        .toggle-btn.offline:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }

        .action-btn.edit {
          background: #dbeafe;
          color: #1e40af;
          border-color: #3b82f6;
        }

        .action-btn.edit:hover {
          background: #bfdbfe;
          transform: translateY(-1px);
        }

        .action-btn.view {
          background: #e9d5ff;
          color: #6b21a8;
          border-color: #8b5cf6;
        }

        .action-btn.view:hover {
          background: #d8b4fe;
          transform: translateY(-1px);
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #991b1b;
          border-color: #ef4444;
        }

        .action-btn.delete:hover {
          background: #fecaca;
          transform: translateY(-1px);
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          color: #9ca3af;
          font-size: 0.875rem;
          background: #2d2d31;
        }

        @media (max-width: 1200px) {
          .girls-table {
            overflow-x: auto;
          }

          table {
            min-width: 1000px;
          }
        }
      `}</style>
      </div>
    </>
  );
}
