"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

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

  if (status === 'loading' || loading) {
    return <div className="admin-loading">Načítání...</div>;
  }

  if (!session) {
    return null;
  }

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

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Správa FAQ</h1>
        <button onClick={() => router.push('/admin/dashboard')} className="app-btn">
          ← Zpět do admin
        </button>
      </div>

      {/* Category Filter */}
      <div className="admin-section">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={`app-btn ${filterCategory === cat.key ? 'app-btn-primary' : ''}`}
              style={{ padding: '8px 16px' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items Section */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>FAQ položky ({filteredFaqs.length})</h2>
          <button
            onClick={() => {
              setEditingFaq(null);
              setShowModal(true);
            }}
            className="app-btn app-btn-primary"
          >
            + Přidat FAQ
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
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
                      className="app-btn-small"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="app-btn-small app-btn-danger"
                    >
                      Smazat
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
    </div>
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
            <button type="button" onClick={onClose} className="app-btn">
              Zrušit
            </button>
            <button type="submit" className="app-btn app-btn-primary">
              Uložit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
