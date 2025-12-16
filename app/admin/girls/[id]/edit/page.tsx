"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBasicServices, getExtraServices } from '@/lib/services';
import SEOFieldsSection from '@/components/SEOFieldsSection';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditGirlPage({ params }: PageProps) {
  const router = useRouter();
  const [girlId, setGirlId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const basicServices = getBasicServices();
  const extraServices = getExtraServices();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    nationality: 'Česká',
    height: '',
    weight: '',
    bust: '',
    hair: 'Blond',
    eyes: 'Modré',
    color: 'rose',
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
    badge_type: '',
    meta_title: '',
    meta_description: '',
    og_image: ''
  });

  // Load photos
  const loadPhotos = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/girls/${id}/photos`);
      const data = await response.json();
      if (data.success) {
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  // Load videos
  const loadVideos = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/girls/${id}/videos`);
      const data = await response.json();
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  // Load girl data
  useEffect(() => {
    async function loadGirl() {
      const resolvedParams = await params;
      setGirlId(resolvedParams.id);

      try {
        const response = await fetch(`/api/admin/girls/${resolvedParams.id}`);
        const data = await response.json();

        if (data.success && data.girl) {
          const girl = data.girl;

          // Load photos and videos
          await Promise.all([
            loadPhotos(resolvedParams.id),
            loadVideos(resolvedParams.id)
          ]);

          setFormData({
            name: girl.name || '',
            email: girl.email || '',
            phone: girl.phone || '',
            age: girl.age?.toString() || '',
            nationality: girl.nationality || 'Česká',
            height: girl.height?.toString() || '',
            weight: girl.weight?.toString() || '',
            bust: girl.bust || '',
            hair: girl.hair || 'Blond',
            eyes: girl.eyes || 'Modré',
            color: girl.color || 'rose',
            bio: girl.bio || '',
            tattoo_percentage: girl.tattoo_percentage?.toString() || '0',
            tattoo_description: girl.tattoo_description || '',
            piercing: girl.piercing || false,
            piercing_description: girl.piercing_description || '',
            languages: girl.languages || ['cs'],
            services: girl.services || [],
            is_new: girl.is_new || false,
            is_top: girl.is_top || false,
            is_featured: girl.is_featured || false,
            featured_section: girl.featured_section || '',
            badge_type: girl.badge_type || '',
            meta_title: girl.meta_title || '',
            meta_description: girl.meta_description || '',
            og_image: girl.og_image || ''
          });
        } else {
          setError('Dívka nenalezena');
        }
      } catch (err) {
        console.error('Error loading girl:', err);
        setError('Chyba při načítání dat');
      } finally {
        setLoadingData(false);
      }
    }

    loadGirl();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.languages.length === 0) {
      setError('Vyberte alespoň jeden jazyk');
      return;
    }

    // Always include all basic services (mandatory)
    const basicServiceIds = basicServices.map(s => s.id);
    const allServices = [...new Set([...basicServiceIds, ...formData.services])];

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/girls/${girlId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          services: allServices,
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
        setError(data.error || 'Chyba při aktualizaci profilu');
      }
    } catch (err) {
      console.error('Error updating girl:', err);
      setError('Chyba při aktualizaci profilu');
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

  if (loadingData) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>
          Načítání...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Upravit dívku</h1>
          <p className="admin-subtitle">Upravte profil dívky</p>
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
              <label>Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+420 xxx xxx xxx"
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

            <div className="form-group">
              <label>Barva kalendáře</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              >
                <option value="rose">Růžová</option>
                <option value="purple">Fialová</option>
                <option value="blue">Modrá</option>
                <option value="green">Zelená</option>
                <option value="orange">Oranžová</option>
                <option value="red">Červená</option>
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
              ✓ Základní služby (povinné - nelze odebrat)
            </h3>
            <div className="services-grid">
              {basicServices.map(service => (
                <label key={service.id} className="service-checkbox-label" style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    style={{ cursor: 'not-allowed' }}
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

          {/* Photos */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--white)' }}>
              Fotky
            </h3>

            {/* Photo Upload */}
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;

                  setUploadingPhoto(true);
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                      const response = await fetch(`/api/admin/girls/${girlId}/photos`, {
                        method: 'POST',
                        body: formData
                      });

                      if (response.ok) {
                        await loadPhotos(girlId);
                      } else {
                        alert(`Chyba při nahrávání ${file.name}`);
                      }
                    } catch (error) {
                      console.error('Upload error:', error);
                      alert(`Chyba při nahrávání ${file.name}`);
                    }
                  }
                  setUploadingPhoto(false);
                  e.target.value = '';
                }}
                style={{ marginBottom: '1rem' }}
              />
            </div>

            {/* Photos Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {photos.map((photo) => (
                <div key={photo.id} style={{ position: 'relative' }}>
                  <img
                    src={photo.url}
                    alt=""
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  {photo.is_primary && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'var(--wine)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      Hlavní
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm('Smazat tuto fotku?')) {
                        await fetch(`/api/admin/girls/${girlId}/photos?photoId=${photo.id}`, {
                          method: 'DELETE'
                        });
                        await loadPhotos(girlId);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {uploadingPhoto && <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>Nahrávání...</p>}
            {photos.length === 0 && !uploadingPhoto && (
              <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '2rem' }}>
                Zatím žádné fotky
              </p>
            )}
          </div>

          {/* Videos */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--white)' }}>
              Videa
            </h3>

            {/* Video Upload */}
            <div>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;

                  setUploadingVideo(true);
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                      const response = await fetch(`/api/admin/girls/${girlId}/videos`, {
                        method: 'POST',
                        body: formData
                      });

                      if (response.ok) {
                        await loadVideos(girlId);
                      } else {
                        alert(`Chyba při nahrávání ${file.name}`);
                      }
                    } catch (error) {
                      console.error('Upload error:', error);
                      alert(`Chyba při nahrávání ${file.name}`);
                    }
                  }
                  setUploadingVideo(false);
                  e.target.value = '';
                }}
                style={{ marginBottom: '1rem' }}
              />
            </div>

            {/* Videos Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {videos.map((video) => (
                <div key={video.id} style={{ position: 'relative' }}>
                  <video
                    src={video.url}
                    controls
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      background: '#000'
                    }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm('Smazat toto video?')) {
                        await fetch(`/api/admin/girls/${girlId}/videos?videoId=${video.id}`, {
                          method: 'DELETE'
                        });
                        await loadVideos(girlId);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {uploadingVideo && <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>Nahrávání...</p>}
            {videos.length === 0 && !uploadingVideo && (
              <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '2rem' }}>
                Zatím žádná videa
              </p>
            )}
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

        <SEOFieldsSection
          metaTitle={formData.meta_title}
          metaDescription={formData.meta_description}
          ogImage={formData.og_image}
          girlName={formData.name}
          onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
        />

        <div className="form-actions">
          <Link href="/admin/girls" className="btn btn-secondary">
            Zrušit
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Ukládání...' : 'Uložit změny'}
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
