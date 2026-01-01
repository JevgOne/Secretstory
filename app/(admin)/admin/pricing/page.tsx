"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

interface PricingPlan {
  id: number;
  duration: number;
  price: number;
  is_popular: number;
  display_order: number;
  title_cs: string;
  title_en: string;
  title_de: string;
  title_uk: string;
  features: PlanFeature[];
}

interface PlanFeature {
  id: number;
  plan_id: number;
  display_order: number;
  feature_cs: string;
  feature_en: string;
  feature_de: string;
  feature_uk: string;
}

interface PricingExtra {
  id: number;
  price: number;
  display_order: number;
  name_cs: string;
  name_en: string;
  name_de: string;
  name_uk: string;
}

export default function AdminPricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [extras, setExtras] = useState<PricingExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [editingExtra, setEditingExtra] = useState<PricingExtra | null>(null);
  const [editingFeatures, setEditingFeatures] = useState<{ plan: PricingPlan; features: PlanFeature[] } | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/pricing');
      const data = await response.json();
      if (data.success) {
        setPlans(data.plans);
        setExtras(data.extras);
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      alert('Chyba při načítání dat');
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async (plan: Partial<PricingPlan>) => {
    try {
      const url = '/api/admin/pricing';
      const method = plan.id ? 'PUT' : 'POST';
      const body = plan.id
        ? { type: 'plan', id: plan.id, data: plan }
        : { type: 'plan', data: plan };

      console.log('Saving plan:', { method, body });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        await fetchData();
        setShowPlanModal(false);
        setEditingPlan(null);
        alert('Plán úspěšně uložen!');
      } else {
        console.error('API returned success: false', data);
        alert('Chyba při ukládání plánu');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Chyba při ukládání plánu');
    }
  };

  const deletePlan = async (id: number) => {
    if (!confirm('Opravdu smazat tento plán?')) return;

    try {
      const response = await fetch(`/api/admin/pricing?type=plan&id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert('Plán smazán!');
      } else {
        alert('Chyba při mazání plánu');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Chyba při mazání plánu');
    }
  };

  const saveExtra = async (extra: Partial<PricingExtra>) => {
    try {
      const url = '/api/admin/pricing';
      const method = extra.id ? 'PUT' : 'POST';
      const body = extra.id
        ? { type: 'extra', id: extra.id, data: extra }
        : { type: 'extra', data: extra };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        setShowExtraModal(false);
        setEditingExtra(null);
        alert('Extra úspěšně uloženo!');
      } else {
        alert('Chyba při ukládání extra');
      }
    } catch (error) {
      console.error('Error saving extra:', error);
      alert('Chyba při ukládání extra');
    }
  };

  const deleteExtra = async (id: number) => {
    if (!confirm('Opravdu smazat toto extra?')) return;

    try {
      const response = await fetch(`/api/admin/pricing?type=extra&id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert('Extra smazáno!');
      } else {
        alert('Chyba při mazání extra');
      }
    } catch (error) {
      console.error('Error deleting extra:', error);
      alert('Chyba při mazání extra');
    }
  };

  const saveFeature = async (feature: Partial<PlanFeature>) => {
    try {
      const url = '/api/admin/pricing/features';
      const method = feature.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feature)
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        return true;
      } else {
        alert('Chyba při ukládání feature');
        return false;
      }
    } catch (error) {
      console.error('Error saving feature:', error);
      alert('Chyba při ukládání feature');
      return false;
    }
  };

  const deleteFeature = async (id: number) => {
    if (!confirm('Opravdu smazat tento bod?')) return false;

    try {
      const response = await fetch(`/api/admin/pricing/features?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        return true;
      } else {
        alert('Chyba při mazání feature');
        return false;
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      alert('Chyba při mazání feature');
      return false;
    }
  };

  if (loading) {
    return <div className="loading">Načítání...</div>;
  }

  return (
    <>
      <AdminHeader title="Správa ceníku" showBack={true} />
      <div className="admin-container">

      {/* Pricing Plans Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #2a2a2e 0%, #1f1f23 100%)',
          borderRadius: '12px',
          border: '1px solid #3d3d41'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-0.02em'
          }}>Cenové plány</h2>
          <button
            type="button"
            onClick={() => {
              console.log('Přidat plán clicked');
              setEditingPlan(null);
              setShowPlanModal(true);
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: 'none',
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              color: '#1f1f23',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
              letterSpacing: '0.02em'
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
            + Přidat plán
          </button>
        </div>

        <div className="girls-table">
          <table>
            <thead>
              <tr>
                <th>Pořadí</th>
                <th>Trvání</th>
                <th>Cena</th>
                <th>Název (CS)</th>
                <th>Název (EN)</th>
                <th>Název (DE)</th>
                <th>Název (UK)</th>
                <th>Top</th>
                <th>Features (body)</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td style={{ fontWeight: '600', color: '#d4af37' }}>{plan.display_order}</td>
                  <td style={{ fontWeight: '600' }}>{plan.duration} min</td>
                  <td style={{ fontWeight: '600', color: '#10b981' }}>{plan.price} Kč</td>
                  <td style={{ fontWeight: '600' }}>{plan.title_cs}</td>
                  <td>{plan.title_en}</td>
                  <td>{plan.title_de}</td>
                  <td>{plan.title_uk}</td>
                  <td style={{ textAlign: 'center' }}>
                    {plan.is_popular && (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                        color: '#1f1f23',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>★ Top</span>
                    )}
                  </td>
                  <td>
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#9ca3af',
                      maxWidth: '250px',
                      lineHeight: '1.6'
                    }}>
                      {plan.features && plan.features.length > 0 ? (
                        <ul style={{
                          margin: 0,
                          padding: '0 0 0 20px',
                          listStyle: 'none'
                        }}>
                          {plan.features.map((feature: PlanFeature, idx: number) => (
                            <li key={feature.id} style={{
                              position: 'relative',
                              paddingLeft: '4px',
                              marginBottom: '4px'
                            }}>
                              <span style={{ color: '#10b981', marginRight: '6px' }}>✓</span>
                              {feature.feature_cs}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: '#ef4444', fontStyle: 'italic' }}>Žádné features</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setEditingPlan(plan);
                          setShowPlanModal(true);
                        }}
                        className="btn-small"
                      >
                        ✏️ Upravit
                      </button>
                      <button
                        onClick={() => {
                          setEditingFeatures({ plan, features: plan.features || [] });
                          setShowFeaturesModal(true);
                        }}
                        className="btn-small"
                        style={{ background: '#10b981' }}
                      >
                        ⚡ Features ({plan.features?.length || 0})
                      </button>
                      <button
                        onClick={() => deletePlan(plan.id)}
                        className="btn-small btn-danger"
                      >
                        🗑️ Smazat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Extras Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #2a2a2e 0%, #1f1f23 100%)',
          borderRadius: '12px',
          border: '1px solid #3d3d41'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: '#fff',
            letterSpacing: '-0.02em'
          }}>Příplatky (Extras)</h2>
          <button
            onClick={() => {
              setEditingExtra(null);
              setShowExtraModal(true);
            }}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: 'none',
              background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
              color: '#1f1f23',
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
              letterSpacing: '0.02em'
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
            + Přidat extra
          </button>
        </div>

        <div className="girls-table">
          <table>
            <thead>
              <tr>
                <th>Pořadí</th>
                <th>Cena (Kč)</th>
                <th>Název (CS)</th>
                <th>Název (EN)</th>
                <th>Název (DE)</th>
                <th>Název (UK)</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              {extras.map((extra) => (
                <tr key={extra.id}>
                  <td>{extra.display_order}</td>
                  <td>{extra.price}</td>
                  <td>{extra.name_cs}</td>
                  <td>{extra.name_en}</td>
                  <td>{extra.name_de}</td>
                  <td>{extra.name_uk}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingExtra(extra);
                        setShowExtraModal(true);
                      }}
                      className="btn-small"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => deleteExtra(extra.id)}
                      className="btn-small btn-danger"
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
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: linear-gradient(to bottom, #2a2a2e, #1f1f23);
          border-bottom: 2px solid #d4af37;
        }

        th {
          padding: 16px;
          text-align: left;
          font-size: 0.8rem;
          font-weight: 700;
          color: #d4af37;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        td {
          padding: 20px 16px;
          border-top: 1px solid #3d3d41;
          color: #ffffff;
          font-size: 0.9rem;
          background: #2d2d31;
          vertical-align: middle;
        }

        tbody tr {
          transition: all 0.2s ease;
        }

        tbody tr:hover {
          background: linear-gradient(to right, #35353a, #2d2d31);
          transform: translateX(4px);
        }

        tbody tr:hover td {
          background: transparent;
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
          padding: 8px 14px;
          font-size: 0.8rem;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        button.btn-small:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        button.btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        button.btn-danger:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
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
          max-width: 800px;
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

      {/* Plan Modal */}
      {showPlanModal && (
        <PlanModal
          plan={editingPlan}
          onSave={savePlan}
          onClose={() => {
            setShowPlanModal(false);
            setEditingPlan(null);
          }}
        />
      )}

      {/* Extra Modal */}
      {showExtraModal && (
        <ExtraModal
          extra={editingExtra}
          onSave={saveExtra}
          onClose={() => {
            setShowExtraModal(false);
            setEditingExtra(null);
          }}
        />
      )}

      {/* Features Modal */}
      {showFeaturesModal && editingFeatures && (
        <FeaturesModal
          plan={editingFeatures.plan}
          features={editingFeatures.features}
          onSave={saveFeature}
          onDelete={deleteFeature}
          onClose={() => {
            setShowFeaturesModal(false);
            setEditingFeatures(null);
            fetchData();
          }}
        />
      )}
    </>
  );
}

// Plan Modal Component
function PlanModal({
  plan,
  onSave,
  onClose
}: {
  plan: PricingPlan | null;
  onSave: (plan: Partial<PricingPlan>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    duration: plan?.duration || 60,
    price: plan?.price || 2500,
    is_popular: plan?.is_popular || 0,
    display_order: plan?.display_order || 0,
    title_cs: plan?.title_cs || '',
    title_en: plan?.title_en || '',
    title_de: plan?.title_de || '',
    title_uk: plan?.title_uk || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(plan ? { ...formData, id: plan.id } : formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#2d2d31',
          border: '1px solid #3d3d41',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: '#fff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: '20px' }}>{plan ? 'Upravit plán' : 'Přidat plán'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Trvání (minuty)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Cena (Kč)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pořadí</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={Boolean(formData.is_popular)}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked ? 1 : 0 })}
                />
                {' '}Populární
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Název (čeština)</label>
            <input
              type="text"
              value={formData.title_cs}
              onChange={(e) => setFormData({ ...formData, title_cs: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Název (angličtina)</label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Název (němčina)</label>
            <input
              type="text"
              value={formData.title_de}
              onChange={(e) => setFormData({ ...formData, title_de: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Název (ukrajinština)</label>
            <input
              type="text"
              value={formData.title_uk}
              onChange={(e) => setFormData({ ...formData, title_uk: e.target.value })}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn">
              Zrušit
            </button>
            <button type="submit" className="btn btn-primary">
              Uložit
            </button>
          </div>
        </form>
        <style jsx>{`
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
          .form-group input {
            width: 100%;
            padding: 10px 12px;
            background: #1f1f23;
            border: 1px solid #3d3d41;
            border-radius: 6px;
            color: #fff;
            font-size: 0.875rem;
          }
          .form-group input:focus {
            outline: none;
            border-color: #d4af37;
          }
          .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
          }
          .btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid #3d3d41;
            font-size: 0.875rem;
            background: #2d2d31;
            color: #9ca3af;
          }
          .btn-primary {
            background: #d4af37;
            color: #1f1f23;
            border-color: #d4af37;
          }
        `}</style>
      </div>
    </div>
  );
}

// Extra Modal Component
function ExtraModal({
  extra,
  onSave,
  onClose
}: {
  extra: PricingExtra | null;
  onSave: (extra: Partial<PricingExtra>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    price: extra?.price || 500,
    display_order: extra?.display_order || 0,
    name_cs: extra?.name_cs || '',
    name_en: extra?.name_en || '',
    name_de: extra?.name_de || '',
    name_uk: extra?.name_uk || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(extra ? { ...formData, id: extra.id } : formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#2d2d31',
          border: '1px solid #3d3d41',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: '#fff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: '20px' }}>{extra ? 'Upravit extra' : 'Přidat extra'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Cena (Kč)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                required
              />
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

          <div className="form-group">
            <label>Název (čeština)</label>
            <input
              type="text"
              value={formData.name_cs}
              onChange={(e) => setFormData({ ...formData, name_cs: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Název (angličtina)</label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Název (němčina)</label>
            <input
              type="text"
              value={formData.name_de}
              onChange={(e) => setFormData({ ...formData, name_de: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Název (ukrajinština)</label>
            <input
              type="text"
              value={formData.name_uk}
              onChange={(e) => setFormData({ ...formData, name_uk: e.target.value })}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn">
              Zrušit
            </button>
            <button type="submit" className="btn btn-primary">
              Uložit
            </button>
          </div>
        </form>
        <style jsx>{`
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
          .form-group input {
            width: 100%;
            padding: 10px 12px;
            background: #1f1f23;
            border: 1px solid #3d3d41;
            border-radius: 6px;
            color: #fff;
            font-size: 0.875rem;
          }
          .form-group input:focus {
            outline: none;
            border-color: #d4af37;
          }
          .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
          }
          .btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid #3d3d41;
            font-size: 0.875rem;
            background: #2d2d31;
            color: #9ca3af;
          }
          .btn-primary {
            background: #d4af37;
            color: #1f1f23;
            border-color: #d4af37;
          }
        `}</style>
      </div>
    </div>
  );
}

// Features Modal Component
function FeaturesModal({
  plan,
  features,
  onSave,
  onDelete,
  onClose
}: {
  plan: PricingPlan;
  features: PlanFeature[];
  onSave: (feature: Partial<PlanFeature>) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
  onClose: () => void;
}) {
  const [localFeatures, setLocalFeatures] = useState<PlanFeature[]>(features);
  const [newFeature, setNewFeature] = useState({
    feature_cs: '',
    feature_en: '',
    feature_de: '',
    feature_uk: '',
    display_order: features.length
  });

  const handleSaveFeature = async (feature: PlanFeature) => {
    const success = await onSave(feature);
    if (success) {
      // Data will be refreshed by parent
    }
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave({
      ...newFeature,
      plan_id: plan.id
    });
    if (success) {
      setNewFeature({
        feature_cs: '',
        feature_en: '',
        feature_de: '',
        feature_uk: '',
        display_order: features.length + 1
      });
    }
  };

  const handleDeleteFeature = async (id: number) => {
    await onDelete(id);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#2d2d31',
          border: '1px solid #3d3d41',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: '#fff'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: '20px' }}>Features pro "{plan.title_cs}" ({plan.duration} min, {plan.price} Kč)</h2>

        <div style={{ marginBottom: '20px' }}>
          <h3>Existující features</h3>
          {features.length === 0 ? (
            <p style={{ color: '#666' }}>Zatím žádné features</p>
          ) : (
            features.map((feature) => (
              <div key={feature.id} style={{
                background: '#1f1f23',
                border: '1px solid #2d2d31',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>CS:</strong> {feature.feature_cs}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>EN:</strong> {feature.feature_en}
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>DE:</strong> {feature.feature_de}
                    </div>
                    <div>
                      <strong>UK:</strong> {feature.feature_uk}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFeature(feature.id)}
                    className="btn-small btn-danger"
                  >
                    Smazat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddFeature}>
          <h3>Přidat nový feature</h3>
          <div className="form-group">
            <label>Feature (čeština)</label>
            <input
              type="text"
              value={newFeature.feature_cs}
              onChange={(e) => setNewFeature({ ...newFeature, feature_cs: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Feature (angličtina)</label>
            <input
              type="text"
              value={newFeature.feature_en}
              onChange={(e) => setNewFeature({ ...newFeature, feature_en: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Feature (němčina)</label>
            <input
              type="text"
              value={newFeature.feature_de}
              onChange={(e) => setNewFeature({ ...newFeature, feature_de: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Feature (ukrajinština)</label>
            <input
              type="text"
              value={newFeature.feature_uk}
              onChange={(e) => setNewFeature({ ...newFeature, feature_uk: e.target.value })}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn">
              Zavřít
            </button>
            <button type="submit" className="btn btn-primary">
              + Přidat feature
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
