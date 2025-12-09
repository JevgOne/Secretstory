"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Správa dívek</h1>
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
                      {girl.verified && <span className="verified-badge">✓</span>}
                      <strong>{girl.name}</strong>
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
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .admin-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 0.5rem;
        }

        .admin-subtitle {
          color: var(--gray);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: var(--wine);
          color: white;
          border: none;
        }

        .btn-primary:hover {
          background: #9a2942;
        }

        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .filter-btn {
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--gray);
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .filter-btn.active {
          background: var(--wine);
          color: white;
          border-color: var(--wine);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--gray);
        }

        .girls-table {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: rgba(255, 255, 255, 0.05);
        }

        th {
          padding: 1rem;
          text-align: left;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--gray);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        td {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--white);
        }

        .girl-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .verified-badge {
          background: var(--accent);
          color: var(--black);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .slug {
          font-size: 0.85rem;
          color: var(--gray);
          margin-top: 4px;
        }

        .toggle-btn {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .toggle-btn.online {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .toggle-btn.offline {
          background: rgba(107, 114, 128, 0.2);
          color: #6b7280;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          text-decoration: none;
          transition: all 0.3s;
        }

        .action-btn.edit {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .action-btn.edit:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .action-btn.view {
          background: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
        }

        .action-btn.view:hover {
          background: rgba(139, 92, 246, 0.3);
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--gray);
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
  );
}
