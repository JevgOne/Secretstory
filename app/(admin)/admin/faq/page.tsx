"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

interface FAQItem {
  id: number;
  category: string;
  display_order: number;
  question_cs: string;
  question_en: string;
  question_de: string;
  question_uk: string;
  answer_cs: string;
  answer_en: string;
  answer_de: string;
  answer_uk: string;
}

export default function AdminFAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/faq');
      const data = await response.json();
      if (data.success) {
        setFaqs(data.faqs);
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      alert('Chyba při načítání dat');
    } finally {
      setLoading(false);
    }
  };

  const saveFaq = async (faq: Partial<FAQItem>) => {
    try {
      const url = '/api/admin/faq';
      const method = faq.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        setShowModal(false);
        setEditingFaq(null);
        alert('FAQ úspěšně uloženo!');
      } else {
        alert('Chyba při ukládání FAQ');
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Chyba při ukládání FAQ');
    }
  };

  const deleteFaq = async (id: number) => {
    if (!confirm('Opravdu smazat toto FAQ?')) return;

    try {
      const response = await fetch(`/api/admin/faq?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert('FAQ smazáno!');
      } else {
        alert('Chyba při mazání FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Chyba při mazání FAQ');
    }
  };

  const categories = [
    { key: 'all', label: 'Vše' },
    { key: 'booking', label: 'Rezervace' },
    { key: 'services', label: 'Služby' },
    { key: 'payment', label: 'Platba' },
    { key: 'discretion', label: 'Diskrétnost' },
    { key: 'general', label: 'Obecné' }
  ];

  const filteredFaqs = filterCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === filterCategory);

  if (loading) {
    return <div className="loading">Načítání...</div>;
  }

  return (
    <>
      <AdminHeader title="Správa FAQ" showBack={true} />
      <div className="admin-container">

      {/* Category Filter */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                border: '1px solid #3d3d41',
                background: filterCategory === cat.key
                  ? 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)'
                  : '#2d2d31',
                color: filterCategory === cat.key ? '#1f1f23' : '#9ca3af',
                transition: 'all 0.2s ease',
                boxShadow: filterCategory === cat.key
                  ? '0 4px 12px rgba(212, 175, 55, 0.3)'
                  : 'none'
              }}
              onMouseOver={(e) => {
                if (filterCategory !== cat.key) {
                  e.currentTarget.style.background = '#35353a';
                  e.currentTarget.style.borderColor = '#4d4d51';
                } else {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (filterCategory !== cat.key) {
                  e.currentTarget.style.background = '#2d2d31';
                  e.currentTarget.style.borderColor = '#3d3d41';
                } else {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                }
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff' }}>FAQ položky ({filteredFaqs.length})</h2>
          <button
            onClick={() => {
              setEditingFaq(null);
              setShowModal(true);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              color: '#1f1f23',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            }}
          >
            ➕ Přidat FAQ
          </button>
        </div>

        <div className="girls-table">
          <table>
            <thead>
              <tr>
                <th>Pořadí</th>
                <th>Kategorie</th>
                <th>Otázka (CS)</th>
                <th>Otázka (EN)</th>
                <th>Odpověď (CS)</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaqs.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.display_order}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: getCategoryColor(faq.category),
                      color: '#fff'
                    }}>
                      {faq.category}
                    </span>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {faq.question_cs}
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {faq.question_en}
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {faq.answer_cs.substring(0, 80)}...
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingFaq(faq);
                        setShowModal(true);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: '#ffffff',
                        marginRight: '8px',
                        boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.3)';
                      }}
                    >
                      ✏️ Upravit
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#ffffff',
                        boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(239, 68, 68, 0.3)';
                      }}
                    >
                      🗑️ Smazat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Modal */}
      {showModal && (
        <FAQModal
          faq={editingFaq}
          onSave={saveFaq}
          onClose={() => {
            setShowModal(false);
            setEditingFaq(null);
          }}
        />
      )}

      <style jsx>{`
        .admin-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          background: #1f1f23;
          min-height: 100vh;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: #2d2d31;
          color: #9ca3af;
          border: 1px solid #3d3d41;
        }

        .btn:hover {
          border-color: #4d4d51;
          background: #35353a;
        }

        .btn.btn-primary {
          background: #d4af37;
          color: #1f1f23;
          border-color: #d4af37;
        }

        .btn.btn-primary:hover {
          background: #c19b2b;
          border-color: #c19b2b;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(212, 175, 55, 0.3);
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
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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

        tbody tr {
          transition: all 0.2s ease;
        }

        tbody tr:hover td {
          background: rgba(212, 175, 55, 0.08);
        }

        button {
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
          margin-right: 8px;
        }

        button:hover {
          transform: translateY(-1px);
        }

        button.btn-primary {
          background: #d4af37;
          color: #1f1f23;
        }

        button.btn-small {
          padding: 6px 12px;
          font-size: 0.8rem;
          background: #3b82f6;
          color: white;
        }

        button.btn-danger {
          background: #ef4444;
          color: white;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: #2d2d31;
          border: 1px solid #3d3d41;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content.large {
          max-width: 900px;
        }

        .modal-content h2 {
          color: #fff;
          margin-bottom: 20px;
        }

        .modal-content h3 {
          color: #d4af37;
          margin-top: 20px;
          margin-bottom: 12px;
          font-size: 1.1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #9ca3af;
          font-size: 0.875rem;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          background: #1f1f23;
          border: 1px solid #3d3d41;
          border-radius: 6px;
          color: #fff;
          font-size: 0.875rem;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        @media (max-width: 1200px) {
          .girls-table {
            overflow-x: auto;
          }

          table {
            min-width: 800px;
          }
        }
      `}</style>
      </div>
    </>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    booking: '#3b82f6',
    services: '#10b981',
    payment: '#f59e0b',
    discretion: '#ec4899',
    general: '#8b5cf6'
  };
  return colors[category] || '#6b7280';
}

// FAQ Modal Component
function FAQModal({
  faq,
  onSave,
  onClose
}: {
  faq: FAQItem | null;
  onSave: (faq: Partial<FAQItem>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    category: faq?.category || 'general',
    display_order: faq?.display_order || 0,
    question_cs: faq?.question_cs || '',
    question_en: faq?.question_en || '',
    question_de: faq?.question_de || '',
    question_uk: faq?.question_uk || '',
    answer_cs: faq?.answer_cs || '',
    answer_en: faq?.answer_en || '',
    answer_de: faq?.answer_de || '',
    answer_uk: faq?.answer_uk || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(faq ? { ...formData, id: faq.id } : formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <h2>{faq ? 'Upravit FAQ' : 'Přidat FAQ'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Kategorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="booking">Rezervace</option>
                <option value="services">Služby</option>
                <option value="payment">Platba</option>
                <option value="discretion">Diskrétnost</option>
                <option value="general">Obecné</option>
              </select>
            </div>
            <div className="form-group">
              <label>Pořadí</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Otázky</h3>

          <div className="form-group">
            <label>Otázka (čeština)</label>
            <input
              type="text"
              value={formData.question_cs}
              onChange={(e) => setFormData({ ...formData, question_cs: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Otázka (angličtina)</label>
            <input
              type="text"
              value={formData.question_en}
              onChange={(e) => setFormData({ ...formData, question_en: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Otázka (němčina)</label>
            <input
              type="text"
              value={formData.question_de}
              onChange={(e) => setFormData({ ...formData, question_de: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Otázka (ukrajinština)</label>
            <input
              type="text"
              value={formData.question_uk}
              onChange={(e) => setFormData({ ...formData, question_uk: e.target.value })}
              required
            />
          </div>

          <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Odpovědi</h3>

          <div className="form-group">
            <label>Odpověď (čeština)</label>
            <textarea
              value={formData.answer_cs}
              onChange={(e) => setFormData({ ...formData, answer_cs: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Odpověď (angličtina)</label>
            <textarea
              value={formData.answer_en}
              onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Odpověď (němčina)</label>
            <textarea
              value={formData.answer_de}
              onChange={(e) => setFormData({ ...formData, answer_de: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Odpověď (ukrajinština)</label>
            <textarea
              value={formData.answer_uk}
              onChange={(e) => setFormData({ ...formData, answer_uk: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                border: '1px solid #3d3d41',
                background: '#2d2d31',
                color: '#9ca3af',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#35353a';
                e.currentTarget.style.borderColor = '#4d4d51';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#2d2d31';
                e.currentTarget.style.borderColor = '#3d3d41';
              }}
            >
              Zrušit
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                color: '#1f1f23',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
              }}
            >
              💾 Uložit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
