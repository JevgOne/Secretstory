"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBasicServices, getExtraServices } from '@/lib/services';
import { HASHTAGS } from '@/lib/hashtags';

export default function NewGirlPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<Array<{file: File, preview: string}>>([]);
  const [videos, setVideos] = useState<Array<{file: File, preview: string}>>([]);

  const basicServices = getBasicServices();
  const extraServices = getExtraServices();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    nationality: 'Česká',
    height: '',
    weight: '',
    bust: '',
    hair: 'Blond',
    eyes: 'Modré',
    bio: '',
    bio_cs: '',
    bio_de: '',
    bio_uk: '',
    tattoo_percentage: '0',
    tattoo_description: '',
    piercing: false,
    piercing_description: '',
    languages: ['cs'],
    location: 'Praha 2',
    services: basicServices.map(s => s.id),
    hashtags: [] as string[],
    is_new: false,
    is_top: false,
    is_featured: false,
    featured_section: '',
    badge_type: ''
  });

  // Auto-assign unique color that's not already used
  const getAutoColor = async () => {
    // High contrast color palette - 15 visually distinct colors
    const allColors = [
      '#e91e63', // růžová (pink)
      '#2196f3', // modrá (blue)
      '#ff9800', // oranžová (orange)
      '#4caf50', // zelená (green)
      '#9c27b0', // fialová (purple)
      '#00bcd4', // tyrkysová (cyan)
      '#f44336', // červená (red)
      '#ffeb3b', // žlutá (yellow)
      '#673ab7', // tmavě fialová (deep purple)
      '#009688', // teal
      '#ff5722', // tmavě oranžová (deep orange)
      '#3f51b5', // indigo
      '#8bc34a', // světle zelená (light green)
      '#795548', // hnědá (brown)
      '#607d8b', // šedá (blue grey)
    ];

    try {
      const response = await fetch('/api/admin/girls');
      const data = await response.json();
      const usedColors = (data.girls || []).map((g: any) => g.color?.toLowerCase());

      // Find first unused color
      const unusedColor = allColors.find(color => !usedColors.includes(color.toLowerCase()));

      // If all colors used, generate a random one
      if (!unusedColor) {
        const randomHue = Math.floor(Math.random() * 360);
        return `hsl(${randomHue}, 70%, 50%)`;
      }

      return unusedColor;
    } catch {
      // Fallback to first color if fetch fails
      return allColors[0];
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

      // Step 1: Create girl profile
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

      if (!data.success) {
        setError(data.error || 'Chyba při vytváření profilu');
        setLoading(false);
        return;
      }

      const girlId = data.girl_id;

      // Step 2: Upload photos if any
      if (photos.length > 0) {
        for (const photo of photos) {
          const formData = new FormData();
          formData.append('file', photo.file);

          try {
            const photoResponse = await fetch(`/api/admin/girls/${girlId}/photos`, {
              method: 'POST',
              body: formData
            });

            if (!photoResponse.ok) {
              console.error(`Failed to upload photo: ${photo.file.name}`);
            }
          } catch (error) {
            console.error(`Error uploading photo: ${photo.file.name}`, error);
          }
        }
      }

      // Step 3: Upload videos if any
      if (videos.length > 0) {
        // Video upload will be implemented later
        console.log('Video upload not yet implemented');
      }

      router.push(`/admin/girls`);
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

  const handleHashtagToggle = (hashtagId: string) => {
    if (formData.hashtags.includes(hashtagId)) {
      setFormData({
        ...formData,
        hashtags: formData.hashtags.filter(h => h !== hashtagId)
      });
    } else {
      setFormData({
        ...formData,
        hashtags: [...formData.hashtags, hashtagId]
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhotos(prev => [...prev, {
            file,
            preview: event.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setVideos(prev => [...prev, {
            file,
            preview: event.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
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
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Heslo *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimálně 6 znaků"
                required
                minLength={6}
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
              <label>Pobočka / Lokace</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <option value="Praha 2">Praha 2 — Nové Město</option>
                <option value="Praha 3">Praha 3 — Žižkov</option>
                <option value="Praha 1">Praha 1 — Staré Město</option>
                <option value="Praha 5">Praha 5 — Smíchov</option>
                <option value="Praha 6">Praha 6 — Dejvice</option>
                <option value="Praha 7">Praha 7 — Holešovice</option>
                <option value="Praha 8">Praha 8 — Karlín</option>
                <option value="Praha 9">Praha 9 — Vysočany</option>
                <option value="Praha 10">Praha 10 — Vršovice</option>
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
          <h2 className="section-title">Hashtags</h2>
          <p style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Vyberte hashtags které se zobrazí na profilu dívky
          </p>
          <div className="services-grid">
            {HASHTAGS.map((hashtag) => (
              <label key={hashtag.id} className="service-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.hashtags.includes(hashtag.id)}
                  onChange={() => handleHashtagToggle(hashtag.id)}
                />
                <span>#{hashtag.translations.cs}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Fotky & Videa</h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--white)' }}>
              📸 Fotky
            </h3>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              id="photo-upload"
            />

            <label
              htmlFor="photo-upload"
              style={{
                display: 'block',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '2px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: 'var(--gray)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '1rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--wine)';
                e.currentTarget.style.background = 'rgba(139, 41, 66, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
              <div>Přetáhněte fotky sem nebo klikněte pro výběr</div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {photos.length} {photos.length === 1 ? 'fotka' : photos.length < 5 ? 'fotky' : 'fotek'} nahráno
              </div>
            </label>

            {photos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '1rem'
              }}>
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      aspectRatio: '3/4',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#1a1416'
                    }}
                  >
                    <img
                      src={photo.preview}
                      alt={`Photo ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        color: 'white',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--white)' }}>
              🎥 Videa
            </h3>

            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              style={{ display: 'none' }}
              id="video-upload"
            />

            <label
              htmlFor="video-upload"
              style={{
                display: 'block',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '2px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: 'var(--gray)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '1rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--wine)';
                e.currentTarget.style.background = 'rgba(139, 41, 66, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
              <div>Přetáhněte videa sem nebo klikněte pro výběr</div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {videos.length} {videos.length === 1 ? 'video' : videos.length < 5 ? 'videa' : 'videí'} nahráno
              </div>
            </label>

            {videos.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {videos.map((video, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#1a1416',
                      padding: '1rem'
                    }}
                  >
                    <div style={{ color: 'var(--white)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      🎬 Video {index + 1}
                    </div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                      {video.file.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        width: '100%'
                      }}
                    >
                      Odstranit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Popis profilu</h2>
          <div className="form-group">
            <label>Bio EN (English)</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={6}
              placeholder="Profile description in English..."
            />
          </div>
          <div className="form-group">
            <label>Bio CS (Čeština)</label>
            <textarea
              value={formData.bio_cs}
              onChange={(e) => setFormData({ ...formData, bio_cs: e.target.value })}
              rows={6}
              placeholder="Popis profilu v češtině..."
            />
          </div>
          <div className="form-group">
            <label>Bio DE (Deutsch)</label>
            <textarea
              value={formData.bio_de}
              onChange={(e) => setFormData({ ...formData, bio_de: e.target.value })}
              rows={6}
              placeholder="Profilbeschreibung auf Deutsch..."
            />
          </div>
          <div className="form-group">
            <label>Bio UK (Українська)</label>
            <textarea
              value={formData.bio_uk}
              onChange={(e) => setFormData({ ...formData, bio_uk: e.target.value })}
              rows={6}
              placeholder="Опис профілю українською..."
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
