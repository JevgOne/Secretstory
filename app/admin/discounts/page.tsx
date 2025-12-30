"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Discount {
  id: number;
  icon: string;
  discount_type: string;
  discount_value: number;
  display_order: number;
  is_featured: number;
  is_active: number;
  name_cs: string;
  name_en: string;
  name_de: string;
  name_uk: string;
  description_cs: string;
  description_en: string;
  description_de: string;
  description_uk: string;
}

interface LoyaltyTier {
  id: number;
  visits_required: number;
  discount_percentage: number;
  tier_level: number;
  display_order: number;
  title_cs: string;
  title_en: string;
  title_de: string;
  title_uk: string;
  description_cs: string;
  description_en: string;
  description_de: string;
  description_uk: string;
}

export default function AdminDiscountsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);

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
      const response = await fetch('/api/admin/discounts');
      const data = await response.json();
      if (data.success) {
        setDiscounts(data.discounts);
        setLoyaltyTiers(data.loyalty_tiers);
      }
    } catch (error) {
      console.error('Error fetching discounts data:', error);
      alert('Chyba při načítání dat');
    } finally {
      setLoading(false);
    }
  };

  const saveDiscount = async (discount: Partial<Discount>) => {
    try {
      const url = '/api/admin/discounts';
      const method = discount.id ? 'PUT' : 'POST';
      const body = discount.id
        ? { type: 'discount', id: discount.id, data: discount }
        : { type: 'discount', data: discount };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        setShowDiscountModal(false);
        setEditingDiscount(null);
        alert('Sleva úspěšně uložena!');
      } else {
        alert('Chyba při ukládání slevy');
      }
    } catch (error) {
      console.error('Error saving discount:', error);
      alert('Chyba při ukládání slevy');
    }
  };

  const deleteDiscount = async (id: number) => {
    if (!confirm('Opravdu smazat tuto slevu?')) return;

    try {
      const response = await fetch(`/api/admin/discounts?type=discount&id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert('Sleva smazána!');
      } else {
        alert('Chyba při mazání slevy');
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      alert('Chyba při mazání slevy');
    }
  };

  const saveTier = async (tier: Partial<LoyaltyTier>) => {
    try {
      const url = '/api/admin/discounts';
      const method = tier.id ? 'PUT' : 'POST';
      const body = tier.id
        ? { type: 'loyalty', id: tier.id, data: tier }
        : { type: 'loyalty', data: tier };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        setShowTierModal(false);
        setEditingTier(null);
        alert('Loyalty tier úspěšně uložen!');
      } else {
        alert('Chyba při ukládání loyalty tier');
      }
    } catch (error) {
      console.error('Error saving tier:', error);
      alert('Chyba při ukládání loyalty tier');
    }
  };

  const deleteTier = async (id: number) => {
    if (!confirm('Opravdu smazat tento loyalty tier?')) return;

    try {
      const response = await fetch(`/api/admin/discounts?type=loyalty&id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert('Loyalty tier smazán!');
      } else {
        alert('Chyba při mazání loyalty tier');
      }
    } catch (error) {
      console.error('Error deleting tier:', error);
      alert('Chyba při mazání loyalty tier');
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
        <h1>Správa slev a loyalty programu</h1>
        <button onClick={() => router.push('/admin')} className="app-btn">
          ← Zpět do admin
        </button>
      </div>

      {/* Discounts Section */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Slevy</h2>
          <button
            onClick={() => {
              setEditingDiscount(null);
              setShowDiscountModal(true);
            }}
            className="app-btn app-btn-primary"
          >
            + Přidat slevu
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pořadí</th>
                <th>Icon</th>
                <th>Typ</th>
                <th>Hodnota</th>
                <th>Název (CS)</th>
                <th>Název (EN)</th>
                <th>Featured</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td>{discount.display_order}</td>
                  <td>{discount.icon}</td>
                  <td>{discount.discount_type}</td>
                  <td>{discount.discount_value}{discount.discount_type === 'percentage' ? '%' : ''}</td>
                  <td>{discount.name_cs}</td>
                  <td>{discount.name_en}</td>
                  <td>{discount.is_featured ? '✓' : ''}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingDiscount(discount);
                        setShowDiscountModal(true);
                      }}
                      className="app-btn-small"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => deleteDiscount(discount.id)}
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

      {/* Loyalty Tiers Section */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Loyalty program</h2>
          <button
            onClick={() => {
              setEditingTier(null);
              setShowTierModal(true);
            }}
            className="app-btn app-btn-primary"
          >
            + Přidat tier
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pořadí</th>
                <th>Úroveň</th>
                <th>Návštěvy</th>
                <th>Sleva %</th>
                <th>Název (CS)</th>
                <th>Název (EN)</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              {loyaltyTiers.map((tier) => (
                <tr key={tier.id}>
                  <td>{tier.display_order}</td>
                  <td>{tier.tier_level}</td>
                  <td>{tier.visits_required}</td>
                  <td>{tier.discount_percentage}%</td>
                  <td>{tier.title_cs}</td>
                  <td>{tier.title_en}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingTier(tier);
                        setShowTierModal(true);
                      }}
                      className="app-btn-small"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => deleteTier(tier.id)}
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

      {/* Discount Modal */}
      {showDiscountModal && (
        <DiscountModal
          discount={editingDiscount}
          onSave={saveDiscount}
          onClose={() => {
            setShowDiscountModal(false);
            setEditingDiscount(null);
          }}
        />
      )}

      {/* Tier Modal */}
      {showTierModal && (
        <TierModal
          tier={editingTier}
          onSave={saveTier}
          onClose={() => {
            setShowTierModal(false);
            setEditingTier(null);
          }}
        />
      )}
    </div>
  );
}

// Discount Modal Component
function DiscountModal({
  discount,
  onSave,
  onClose
}: {
  discount: Discount | null;
  onSave: (discount: Partial<Discount>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    icon: discount?.icon || '🎁',
    discount_type: discount?.discount_type || 'percentage',
    discount_value: discount?.discount_value || 10,
    display_order: discount?.display_order || 0,
    is_featured: discount?.is_featured || 0,
    name_cs: discount?.name_cs || '',
    name_en: discount?.name_en || '',
    name_de: discount?.name_de || '',
    name_uk: discount?.name_uk || '',
    description_cs: discount?.description_cs || '',
    description_en: discount?.description_en || '',
    description_de: discount?.description_de || '',
    description_uk: discount?.description_uk || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(discount ? { ...formData, id: discount.id } : formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <h2>{discount ? 'Upravit slevu' : 'Přidat slevu'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Icon (emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                maxLength={2}
              />
            </div>
            <div className="form-group">
              <label>Typ slevy</label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
              >
                <option value="percentage">Procentuální</option>
                <option value="fixed">Fixní částka</option>
                <option value="special">Speciální</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hodnota slevy</label>
              <input
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: parseInt(e.target.value) })}
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
            <label>
              <input
                type="checkbox"
                checked={Boolean(formData.is_featured)}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })}
              />
              {' '}Zobrazit jako featured (nahoře stránky)
            </label>
          </div>

          <h3>Názvy</h3>
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

          <h3>Popisy</h3>
          <div className="form-group">
            <label>Popis (čeština)</label>
            <textarea
              value={formData.description_cs}
              onChange={(e) => setFormData({ ...formData, description_cs: e.target.value })}
              rows={2}
              required
            />
          </div>
          <div className="form-group">
            <label>Popis (angličtina)</label>
            <textarea
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={2}
              required
            />
          </div>
          <div className="form-group">
            <label>Popis (němčina)</label>
            <textarea
              value={formData.description_de}
              onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
              rows={2}
              required
            />
          </div>
          <div className="form-group">
            <label>Popis (ukrajinština)</label>
            <textarea
              value={formData.description_uk}
              onChange={(e) => setFormData({ ...formData, description_uk: e.target.value })}
              rows={2}
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

// Tier Modal Component
function TierModal({
  tier,
  onSave,
  onClose
}: {
  tier: LoyaltyTier | null;
  onSave: (tier: Partial<LoyaltyTier>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    visits_required: tier?.visits_required || 3,
    discount_percentage: tier?.discount_percentage || 5,
    tier_level: tier?.tier_level || 1,
    display_order: tier?.display_order || 0,
    title_cs: tier?.title_cs || '',
    title_en: tier?.title_en || '',
    title_de: tier?.title_de || '',
    title_uk: tier?.title_uk || '',
    description_cs: tier?.description_cs || '',
    description_en: tier?.description_en || '',
    description_de: tier?.description_de || '',
    description_uk: tier?.description_uk || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tier ? { ...formData, id: tier.id } : formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <h2>{tier ? 'Upravit loyalty tier' : 'Přidat loyalty tier'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Počet návštěv</label>
              <input
                type="number"
                value={formData.visits_required}
                onChange={(e) => setFormData({ ...formData, visits_required: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Sleva (%)</label>
              <input
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Úroveň (1-4)</label>
              <input
                type="number"
                min="1"
                max="4"
                value={formData.tier_level}
                onChange={(e) => setFormData({ ...formData, tier_level: parseInt(e.target.value) })}
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

          <h3>Názvy</h3>
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

          <h3>Popisy</h3>
          <div className="form-group">
            <label>Popis (čeština)</label>
            <textarea
              value={formData.description_cs}
              onChange={(e) => setFormData({ ...formData, description_cs: e.target.value })}
              rows={2}
              required
            />
          </div>
          <div className="form-group">
            <label>Popis (angličtina)</label>
            <textarea
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={2}
              required
            />
          </div>
          <div className="form-group">
            <label>Popis (němčina)</label>
            <textarea
              value={formData.description_de}
              onChange={(e) => setFormData({ ...formData, description_de: e.target.value })}
              rows={2}
              required
            />
          </div>
          <div className="form-group">
            <label>Popis (ukrajinština)</label>
            <textarea
              value={formData.description_uk}
              onChange={(e) => setFormData({ ...formData, description_uk: e.target.value })}
              rows={2}
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
