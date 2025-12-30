"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [extras, setExtras] = useState<PricingExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [editingExtra, setEditingExtra] = useState<PricingExtra | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showExtraModal, setShowExtraModal] = useState(false);

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

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        setShowPlanModal(false);
        setEditingPlan(null);
        alert('Plán úspěšně uložen!');
      } else {
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

  if (status === 'loading' || loading) {
    return <div className="admin-loading">Načítání...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Správa ceníku</h1>
        <button onClick={() => router.push('/admin')} className="app-btn">
          ← Zpět do admin
        </button>
      </div>

      {/* Pricing Plans Section */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Cenové plány</h2>
          <button
            onClick={() => {
              setEditingPlan(null);
              setShowPlanModal(true);
            }}
            className="app-btn app-btn-primary"
          >
            + Přidat plán
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pořadí</th>
                <th>Trvání (min)</th>
                <th>Cena (Kč)</th>
                <th>Název (CS)</th>
                <th>Název (EN)</th>
                <th>Název (DE)</th>
                <th>Název (UK)</th>
                <th>Populární</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.display_order}</td>
                  <td>{plan.duration}</td>
                  <td>{plan.price}</td>
                  <td>{plan.title_cs}</td>
                  <td>{plan.title_en}</td>
                  <td>{plan.title_de}</td>
                  <td>{plan.title_uk}</td>
                  <td>{plan.is_popular ? '✓' : ''}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setShowPlanModal(true);
                      }}
                      className="app-btn-small"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
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

      {/* Extras Section */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Příplatky (Extras)</h2>
          <button
            onClick={() => {
              setEditingExtra(null);
              setShowExtraModal(true);
            }}
            className="app-btn app-btn-primary"
          >
            + Přidat extra
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
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
                      className="app-btn-small"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => deleteExtra(extra.id)}
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
    </div>
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{plan ? 'Upravit plán' : 'Přidat plán'}</h2>
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{extra ? 'Upravit extra' : 'Přidat extra'}</h2>
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
