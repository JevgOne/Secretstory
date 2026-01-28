"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  locale: string;
  is_published: boolean;
  is_featured: boolean;
  scheduled_for?: string | null;
  girl_id?: number;
  girl_name?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [localeFilter, setLocaleFilter] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter, localeFilter, publishedFilter]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (localeFilter !== 'all') params.append('locale', localeFilter);
      if (publishedFilter !== 'all') params.append('published', publishedFilter);

      const response = await fetch(`/api/admin/blog?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number, postTitle: string) => {
    if (!confirm(`Opravdu chcete smazat článek "${postTitle}"? Tato akce je nevratná.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchPosts();
      } else {
        alert(data.error || 'Chyba při mazání článku');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Chyba při mazání článku');
    }
  };

  const getPublishedBadge = (post: BlogPost) => {
    let styles, text;

    if (post.scheduled_for) {
      // Scheduled
      styles = { background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' };
      text = 'Naplánováno';
    } else if (post.is_published) {
      // Published
      styles = { background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' };
      text = 'Publikováno';
    } else {
      // Draft
      styles = { background: 'rgba(107, 114, 128, 0.2)', color: '#6b7280' };
      text = 'Koncept';
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', ...styles }}>
          {text}
        </span>
        {post.scheduled_for && (
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            {new Date(post.scheduled_for).toLocaleString('cs-CZ', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      'pribehy-spolecnic': { bg: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' },
      'rady-a-tipy': { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' },
      'novinky': { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' },
      'ostatni': { bg: 'rgba(107, 114, 128, 0.2)', color: '#6b7280' }
    };

    const categoryLabels: Record<string, string> = {
      'pribehy-spolecnic': 'Příběhy společnic',
      'rady-a-tipy': 'Rady a tipy',
      'novinky': 'Novinky',
      'ostatni': 'Ostatní'
    };

    const style = colors[category] || colors['ostatni'];

    return (
      <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', background: style.bg, color: style.color }}>
        {categoryLabels[category] || category}
      </span>
    );
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminHeader title="Správa blogu" showBack={true} />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p className="admin-subtitle">Vytvářejte a spravujte blogové články</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/admin/blog/generate" className="btn btn-ai">
              🤖 AI Generátor (16 článků)
            </Link>
            <Link href="/admin/blog/new" className="btn btn-primary">
              + Vytvořit nový článek
            </Link>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Hledat podle názvu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Kategorie:</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Všechny</option>
              <option value="pribehy-spolecnic">Příběhy společnic</option>
              <option value="rady-a-tipy">Rady a tipy</option>
              <option value="novinky">Novinky</option>
              <option value="ostatni">Ostatní</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Jazyk:</label>
            <select value={localeFilter} onChange={(e) => setLocaleFilter(e.target.value)}>
              <option value="all">Všechny</option>
              <option value="cs">Čeština</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select value={publishedFilter} onChange={(e) => setPublishedFilter(e.target.value)}>
              <option value="all">Všechny</option>
              <option value="true">Publikované</option>
              <option value="false">Koncepty</option>
              <option value="scheduled">Naplánované</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Načítání...</div>
        ) : (
          <div className="posts-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Název</th>
                  <th>Kategorie</th>
                  <th>Jazyk</th>
                  <th>Dívka</th>
                  <th>Status</th>
                  <th>Vytvořeno</th>
                  <th>Akce</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>
                      <div className="post-title">
                        {post.is_featured && <span className="featured-badge">★</span>}
                        <strong>{post.title}</strong>
                        <div className="slug">/{post.slug}</div>
                      </div>
                    </td>
                    <td>{getCategoryBadge(post.category)}</td>
                    <td>
                      <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--gray)' }}>
                        {post.locale}
                      </span>
                    </td>
                    <td>
                      {post.girl_name ? (
                        <span style={{ fontSize: '0.9rem' }}>{post.girl_name}</span>
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>-</span>
                      )}
                    </td>
                    <td>{getPublishedBadge(post)}</td>
                    <td>{new Date(post.created_at).toLocaleDateString('cs-CZ')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          style={{
                            padding: '6px 12px',
                            background: '#2d2d31',
                            border: '1px solid #3d3d41',
                            borderRadius: '6px',
                            color: '#ffffff',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#35353a'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#2d2d31'}
                        >
                          Upravit
                        </Link>
                        <Link
                          href={`/${post.locale}/blog/${post.slug}`}
                          target="_blank"
                          style={{
                            padding: '6px 12px',
                            background: '#2d2d31',
                            border: '1px solid #3d3d41',
                            borderRadius: '6px',
                            color: '#9ca3af',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#35353a'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#2d2d31'}
                        >
                          Zobrazit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '6px',
                            color: '#ef4444',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#ef4444';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.color = '#ef4444';
                          }}
                        >
                          Smazat
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPosts.length === 0 && (
              <div className="empty-state">
                <p>{searchTerm ? 'Žádné články nenalezeny' : 'Zatím nejsou žádné články'}</p>
              </div>
            )}
          </div>
        )}

        <style jsx>{`
          .admin-container {
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
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
            background: #1f1f23;
            color: #fff;
            border: 1px solid #2d2d31;
          }

          .btn-primary:hover {
            border-color: #3d3d41;
            transform: translateY(-2px);
          }

          .btn-ai {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
          }

          .btn-ai:hover {
            opacity: 0.9;
            transform: translateY(-2px);
          }

          .search-bar {
            margin-bottom: 16px;
          }

          .search-input {
            width: 100%;
            max-width: 500px;
            padding: 10px 14px;
            background: #1f1f23;
            border: 1px solid #2d2d31;
            border-radius: 8px;
            color: #fff;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }

          .search-input:focus {
            outline: none;
            border-color: #3d3d41;
          }

          .search-input::placeholder {
            color: #6b7280;
          }

          .filters {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
            flex-wrap: wrap;
          }

          .filter-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .filter-group label {
            font-size: 0.875rem;
            color: #9ca3af;
            white-space: nowrap;
          }

          .filter-group select {
            padding: 8px 12px;
            background: #1f1f23;
            border: 1px solid #2d2d31;
            border-radius: 8px;
            color: #fff;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .filter-group select:focus {
            outline: none;
            border-color: #3d3d41;
          }

          .loading {
            text-align: center;
            padding: 48px;
            color: #6b7280;
            font-size: 0.875rem;
          }

          .posts-table {
            background: #1f1f23;
            border: 1px solid #2d2d31;
            border-radius: 12px;
            overflow: hidden;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead {
            background: #18181b;
            border-bottom: 1px solid #2d2d31;
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
            border-top: 1px solid #2d2d31;
            color: #fff;
            font-size: 0.875rem;
          }

          .post-title {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .featured-badge {
            color: #fbbf24;
            font-size: 1rem;
            margin-right: 6px;
          }

          .slug {
            font-size: 0.75rem;
            color: #6b7280;
            font-family: 'Monaco', monospace;
          }

          .action-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .action-btn {
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid transparent;
            text-decoration: none;
            transition: all 0.2s ease;
            display: inline-block;
          }

          .action-btn.edit {
            background: #1f1f23;
            color: #3b82f6;
            border-color: #2d2d31;
          }

          .action-btn.edit:hover {
            border-color: #3b82f6;
            transform: translateY(-2px);
          }

          .action-btn.view {
            background: #1f1f23;
            color: #8b5cf6;
            border-color: #2d2d31;
          }

          .action-btn.view:hover {
            border-color: #8b5cf6;
            transform: translateY(-2px);
          }

          .action-btn.delete {
            background: #1f1f23;
            color: #ef4444;
            border-color: #2d2d31;
          }

          .action-btn.delete:hover {
            border-color: #ef4444;
            transform: translateY(-2px);
          }

          .empty-state {
            text-align: center;
            padding: 48px;
            color: #6b7280;
            font-size: 0.875rem;
          }

          @media (max-width: 1200px) {
            .posts-table {
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
