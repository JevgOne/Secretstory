"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBasicServices, getExtraServices } from '@/lib/services';

export default function NewGirlPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const basicServices = getBasicServices();
  const extraServices = getExtraServices();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    nationality: 'Česká',
    height: '',
    weight: '',
    bust: '',
    hair: 'Blond',
    eyes: 'Modré',
    bio: '',
    tattoo_percentage: '0',
    tattoo_description: '',
    piercing: false,
    piercing_description: '',
    languages: ['cs'],
    services: [] as string[],
    is_new: false,
    is_top: false,
    is_featured: false,
    featured_section: '',
    badge_type: ''
  });

  // Auto-assign color based on existing girls count
  const getAutoColor = async () => {
    const colors = ['rose', 'purple', 'blue', 'green', 'orange', 'red'];
    // Fetch current girls count to rotate through colors sequentially
    try {
      const response = await fetch('/api/admin/girls');
      const data = await response.json();
      const girlsCount = data.girls?.length || 0;
      // This will rotate through colors for each new girl
      return colors[girlsCount % colors.length];
    } catch {
      // Fallback to first color if fetch fails
      return colors[0];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.languages.length === 0) {
      setError('Vyberte alespoň jeden jazyk');
      return;
    }

    if (formData.services.length === 0) {
      setError('Vyberte alespoň jednu službu');
      return;
    }

    setLoading(true);

    try {
      const autoColor = await getAutoColor(); // Get sequential color

      const response = await fetch('/api/admin/girls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: '+420734332131', // Fixed phone number for all girls
          color: autoColor, // Auto-assign color sequentially
          age: parseInt(formData.age),
          height: formData.height ? parseInt(formData.height) : null,
          weight: formData.weight ? parseInt(formData.weight) : null,
          tattoo_percentage: parseInt(formData.tattoo_percentage)
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/admin/girls`);
      } else {
        setError(data.error || 'Chyba při vytváření profilu');
      }
    } catch (err) {
      console.error('Error creating girl:', err);
      setError('Chyba při vytváření profilu');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    if (formData.languages.includes(lang)) {
      setFormData({
        ...formData,
        languages: formData.languages.filter(l => l !== lang)
      });
    } else {
      setFormData({
        ...formData,
        languages: [...formData.languages, lang]
      });
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    if (formData.services.includes(serviceId)) {
      setFormData({
        ...formData,
        services: formData.services.filter(s => s !== serviceId)
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, serviceId]
      });
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Přidat novou dívku</h1>
          <p className="admin-subtitle">Vytvořte nový profil dívky</p>
        </div>
        <Link href="/admin/girls" className="btn btn-secondary">
          ← Zpět na seznam
        </Link>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="girl-form">
        <div className="form-section">
          <h2 className="section-title">Základní informace</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Jméno *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="např. Natalie"
              />
            </div>

            <div className="form-group">
              <label>Věk *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min="18"
                max="99"
                placeholder="např. 24"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group">
              <label>Národnost</label>
              <select
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
              >
                <option>Česká</option>
                <option>Slovenka</option>
                <option>Ukrajinka</option>
                <option>Ruska</option>
                <option>Polka</option>
                <option>Jiná</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Fyzické parametry</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Výška (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                min="150"
                max="200"
                placeholder="např. 170"
              />
            </div>

            <div className="form-group">
              <label>Váha (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                min="40"
                max="100"
                placeholder="např. 55"
              />
            </div>

            <div className="form-group">
              <label>Prsa</label>
              <input
                type="text"
                value={formData.bust}
                onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                placeholder="např. 85-C nebo jen C"
              />
            </div>

            <div className="form-group">
              <label>Vlasy</label>
              <select
                value={formData.hair}
                onChange={(e) => setFormData({ ...formData, hair: e.target.value })}
              >
                <option>Blond</option>
                <option>Hnědé</option>
                <option>Černé</option>
                <option>Zrzavé</option>
                <option>Jiné</option>
              </select>
            </div>

            <div className="form-group">
              <label>Oči</label>
              <select
                value={formData.eyes}
                onChange={(e) => setFormData({ ...formData, eyes: e.target.value })}
              >
                <option>Modré</option>
                <option>Zelené</option>
                <option>Hnědé</option>
                <option>Šedé</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Jazyky</h2>
          <div className="language-checkboxes">
            {[
              { code: 'cs', label: 'Čeština' },
              { code: 'en', label: 'Angličtina' },
              { code: 'de', label: 'Němčina' },
              { code: 'uk', label: 'Ukrajinština' },
              { code: 'ru', label: 'Ruština' }
            ].map(lang => (
              <label key={lang.code} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(lang.code)}
                  onChange={() => handleLanguageToggle(lang.code)}
                />
                {lang.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Tetování & Piercing</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Tetování (%)</label>
              <input
                type="number"
                value={formData.tattoo_percentage}
                onChange={(e) => setFormData({ ...formData, tattoo_percentage: e.target.value })}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Popis tetování</label>
              <input
                type="text"
                value={formData.tattoo_description}
                onChange={(e) => setFormData({ ...formData, tattoo_description: e.target.value })}
                placeholder="např. Malé tetování na rameni"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.piercing}
                  onChange={(e) => setFormData({ ...formData, piercing: e.target.checked })}
                />
                Má piercing
              </label>
            </div>

            <div className="form-group">
              <label>Popis piercingu</label>
              <input
                type="text"
                value={formData.piercing_description}
                onChange={(e) => setFormData({ ...formData, piercing_description: e.target.value })}
                placeholder="např. Piercing v nose"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Služby</h2>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--white)' }}>
              ✓ Základní služby (vždy zahrnuty)
            </h3>
            <div className="services-grid">
              {basicServices.map(service => (
                <label key={service.id} className="service-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                  />
                  <span>{service.translations.cs}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--white)' }}>
              + Extra služby (za příplatek)
            </h3>
            <div className="services-grid">
              {extraServices.map(service => (
                <label key={service.id} className="service-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                  />
                  <span>{service.translations.cs}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Fotky & Videa</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            ⚠️ Upload fotek a videí bude dostupný po implementaci backend API
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--white)' }}>
              📸 Fotky
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'var(--gray)',
              opacity: 0.5,
              cursor: 'not-allowed'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
              <div>Přetáhněte fotky sem nebo klikněte pro výběr</div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>(Backend API zatím není k dispozici)</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--white)' }}>
              🎥 Videa
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '3rem 2rem',
              textAlign: 'center',
              color: 'var(--gray)',
              opacity: 0.5,
              cursor: 'not-allowed'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
              <div>Přetáhněte videa sem nebo klikněte pro výběr</div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>(Backend API zatím není k dispozici)</div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Popis profilu</h2>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={8}
              placeholder="Popis dívky, její osobnost, co nabízí..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">🏷️ Badges & Zvýraznění</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>
            Nastavte badges a featured sekce pro tuto dívku
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                />
                <span>🆕 Nová dívka (New badge)</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_top}
                  onChange={(e) => setFormData({ ...formData, is_top: e.target.checked })}
                />
                <span>⭐ Top recenze (Top Reviews badge)</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                <span>💎 Zvýrazněná dívka (Featured)</span>
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Typ badge</label>
              <select
                value={formData.badge_type}
                onChange={(e) => setFormData({ ...formData, badge_type: e.target.value })}
              >
                <option value="">Žádný</option>
                <option value="new">🆕 New (červený)</option>
                <option value="top">⭐ Top Reviews (zlatý)</option>
                <option value="recommended">💎 Recommended (fialový)</option>
                <option value="asian">🌸 Asian (fialový)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.featured_section === 'homepage_new'}
                  onChange={(e) => setFormData({
                    ...formData,
                    featured_section: e.target.checked ? 'homepage_new' : ''
                  })}
                />
                <span>🆕 Zobrazit jako "Nová dívka" na homepage</span>
              </label>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginTop: '0.5rem' }}>
                ⚠️ Pouze jedna dívka by měla mít tuto možnost aktivní!
              </p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link href="/admin/girls" className="btn btn-secondary">
            Zrušit
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Vytváření...' : 'Vytvořit profil'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .admin-container {
          padding: 2rem;
          max-width: 1200px;
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
          border: none;
          display: inline-block;
        }

        .btn-primary {
          background: var(--wine);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #9a2942;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .girl-form {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 0.9rem;
          color: var(--gray);
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: var(--white);
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
          line-height: 1.6;
        }

        .language-checkboxes {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--white);
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          cursor: pointer;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 0.75rem;
        }

        .service-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .service-checkbox-label:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .service-checkbox-label input[type="checkbox"] {
          width: auto;
          cursor: pointer;
          margin: 0;
        }

        .service-checkbox-label span {
          color: var(--white);
          font-size: 0.9rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
