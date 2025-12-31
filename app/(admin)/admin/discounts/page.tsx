"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

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
  const router = useRouter();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) {
    return <div className="loading">Načítání...</div>;
  }

  return (
    <>
      <AdminHeader title="Správa slev a loyalty programu" showBack={true} />
      <div className="admin-container">

      {/* Discounts Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff' }}>Slevy</h2>
          <button
            onClick={() => {
              setEditingDiscount(null);
              setShowDiscountModal(true);
            }}
            className="btn btn-primary"
          >
            + Přidat slevu
          </button>
        </div>

        <div className="girls-table">
          <table >
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
                      className="btn-small"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => deleteDiscount(discount.id)}
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

      {/* Loyalty Tiers Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff' }}>Loyalty program</h2>
          <button
            onClick={() => {
              setEditingTier(null);
              setShowTierModal(true);
            }}
            className="btn btn-primary"
          >
            + Přidat tier
          </button>
        </div>

        <div className="girls-table">
          <table >
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
                      className="btn-small"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => deleteTier(tier.id)}
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
    </>
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
            <button type="button" onClick={onClose} className="btn">
              Zrušit
            </button>
            <button type="submit" className="btn btn-primary">
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
            <button type="button" onClick={onClose} className="btn">
              Zrušit
            </button>
            <button type="submit" className="btn btn-primary">
              Uložit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
