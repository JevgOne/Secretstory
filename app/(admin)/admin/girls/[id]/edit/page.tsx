"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBasicServices, getExtraServices } from '@/lib/services';
import { HASHTAGS, Hashtag } from '@/lib/hashtags';
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
  const [stories, setStories] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [vimeoUrl, setVimeoUrl] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [locations, setLocations] = useState<any[]>([]);

  // Pagination states
  const [photosPage, setPhotosPage] = useState(1);
  const [photosPagination, setPhotosPagination] = useState<any>(null);
  const [loadingMorePhotos, setLoadingMorePhotos] = useState(false);

  const [videosPage, setVideosPage] = useState(1);
  const [videosPagination, setVideosPagination] = useState<any>(null);
  const [loadingMoreVideos, setLoadingMoreVideos] = useState(false);

  const [storiesPage, setStoriesPage] = useState(1);
  const [storiesPagination, setStoriesPagination] = useState<any>(null);
  const [loadingMoreStories, setLoadingMoreStories] = useState(false);

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
    bio_cs: '',
    bio_de: '',
    bio_uk: '',
    // Subtitle fields (H2 on profile page)
    subtitle_cs: '',
    subtitle_en: '',
    subtitle_de: '',
    subtitle_uk: '',
    tattoo_percentage: '0',
    tattoo_description: '',
    piercing: false,
    piercing_description: '',
    languages: ['cs'],
    location: 'Praha 2',
    services: [] as string[],
    hashtags: [] as string[],
    is_new: false,
    is_top: false,
    is_featured: false,
    featured_section: '',
    badge_type: '',
    // Legacy single-language SEO fields (kept for backward compatibility)
    meta_title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_image: '',
    // Multi-language SEO fields
    meta_title_cs: '',
    meta_title_en: '',
    meta_title_de: '',
    meta_title_uk: '',
    meta_description_cs: '',
    meta_description_en: '',
    meta_description_de: '',
    meta_description_uk: '',
    og_title_cs: '',
    og_title_en: '',
    og_title_de: '',
    og_title_uk: '',
    og_description_cs: '',
    og_description_en: '',
    og_description_de: '',
    og_description_uk: ''
  });

  // Load photos with pagination
  const loadPhotos = async (id: string, page: number = 1, append: boolean = false) => {
    try {
      const response = await fetch(`/api/admin/girls/${id}/photos?page=${page}&limit=12`);
      const data = await response.json();
      if (data.success) {
        if (append) {
          setPhotos(prev => [...prev, ...data.photos]);
        } else {
          setPhotos(data.photos);
        }
        setPhotosPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  // Load more photos
  const loadMorePhotos = async () => {
    if (!photosPagination?.hasMore || loadingMorePhotos) return;
    setLoadingMorePhotos(true);
    const nextPage = photosPage + 1;
    setPhotosPage(nextPage);
    await loadPhotos(girlId, nextPage, true);
    setLoadingMorePhotos(false);
  };

  // Load videos with pagination
  const loadVideos = async (id: string, page: number = 1, append: boolean = false) => {
    try {
      const response = await fetch(`/api/admin/girls/${id}/videos?page=${page}&limit=12`);
      const data = await response.json();
      if (data.success) {
        if (append) {
          setVideos(prev => [...prev, ...data.videos]);
        } else {
          setVideos(data.videos);
        }
        setVideosPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  // Load more videos
  const loadMoreVideos = async () => {
    if (!videosPagination?.hasMore || loadingMoreVideos) return;
    setLoadingMoreVideos(true);
    const nextPage = videosPage + 1;
    setVideosPage(nextPage);
    await loadVideos(girlId, nextPage, true);
    setLoadingMoreVideos(false);
  };

  // Load stories with pagination
  const loadStories = async (id: string, page: number = 1, append: boolean = false) => {
    try {
      const response = await fetch(`/api/admin/girls/${id}/stories?page=${page}&limit=12`);
      const data = await response.json();
      if (data.success) {
        if (append) {
          setStories(prev => [...prev, ...data.stories]);
        } else {
          setStories(data.stories);
        }
        setStoriesPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  // Load more stories
  const loadMoreStories = async () => {
    if (!storiesPagination?.hasMore || loadingMoreStories) return;
    setLoadingMoreStories(true);
    const nextPage = storiesPage + 1;
    setStoriesPage(nextPage);
    await loadStories(girlId, nextPage, true);
    setLoadingMoreStories(false);
  };

  // Load girl data
  useEffect(() => {
    async function loadGirl() {
      const resolvedParams = await params;
      setGirlId(resolvedParams.id);

      try {
        // Load locations first
        const locationsResponse = await fetch('/api/homepage');
        const locationsData = await locationsResponse.json();
        if (locationsData.success && locationsData.locations) {
          setLocations(locationsData.locations);
        }

        const response = await fetch(`/api/admin/girls/${resolvedParams.id}`);
        const data = await response.json();

        if (data.success && data.girl) {
          const girl = data.girl;

          // Load media sequentially to avoid overwhelming the server
          // Photos first (most important), then videos, then stories
          await loadPhotos(resolvedParams.id);
          loadVideos(resolvedParams.id); // Load in background (no await)
          loadStories(resolvedParams.id); // Load in background (no await)

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
            bio_cs: girl.bio_cs || '',
            bio_de: girl.bio_de || '',
            bio_uk: girl.bio_uk || '',
            subtitle_cs: girl.subtitle_cs || '',
            subtitle_en: girl.subtitle_en || '',
            subtitle_de: girl.subtitle_de || '',
            subtitle_uk: girl.subtitle_uk || '',
            tattoo_percentage: girl.tattoo_percentage?.toString() || '0',
            tattoo_description: girl.tattoo_description || '',
            piercing: girl.piercing || false,
            piercing_description: girl.piercing_description || '',
            languages: girl.languages || ['cs'],
            location: girl.location || 'Praha 2',
            services: girl.services || [],
            hashtags: girl.hashtags || [],
            is_new: girl.is_new || false,
            is_top: girl.is_top || false,
            is_featured: girl.is_featured || false,
            featured_section: girl.featured_section || '',
            badge_type: girl.badge_type || '',
            // Legacy SEO fields
            meta_title: girl.meta_title || '',
            meta_description: girl.meta_description || '',
            og_title: girl.og_title || '',
            og_description: girl.og_description || '',
            og_image: girl.og_image || '',
            // Multi-language SEO fields
            meta_title_cs: girl.meta_title_cs || '',
            meta_title_en: girl.meta_title_en || '',
            meta_title_de: girl.meta_title_de || '',
            meta_title_uk: girl.meta_title_uk || '',
            meta_description_cs: girl.meta_description_cs || '',
            meta_description_en: girl.meta_description_en || '',
            meta_description_de: girl.meta_description_de || '',
            meta_description_uk: girl.meta_description_uk || '',
            og_title_cs: girl.og_title_cs || '',
            og_title_en: girl.og_title_en || '',
            og_title_de: girl.og_title_de || '',
            og_title_uk: girl.og_title_uk || '',
            og_description_cs: girl.og_description_cs || '',
            og_description_en: girl.og_description_en || '',
            og_description_de: girl.og_description_de || '',
            og_description_uk: girl.og_description_uk || ''
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

  // Save profile without redirect (for SEO auto-save)
  const saveProfile = async () => {
    // Validation
    if (formData.languages.length === 0) {
      throw new Error('Vyberte alespoň jeden jazyk');
    }

    // Always include all basic services (mandatory)
    const basicServiceIds = basicServices.map(s => s.id);
    const allServices = [...new Set([...basicServiceIds, ...formData.services])];

    const payload = {
      ...formData,
      services: allServices,
      age: parseInt(formData.age),
      height: formData.height ? parseInt(formData.height) : null,
      weight: formData.weight ? parseInt(formData.weight) : null,
      tattoo_percentage: parseInt(formData.tattoo_percentage)
    };

    // DEBUG: Log SEO fields being sent
    console.log('[DEBUG] SEO fields being sent:', {
      meta_title_cs: payload.meta_title_cs,
      meta_title_en: payload.meta_title_en,
      meta_description_cs: payload.meta_description_cs,
      og_title_cs: payload.og_title_cs
    });

    const response = await fetch(`/api/admin/girls/${girlId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Chyba při aktualizaci profilu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await saveProfile();
      router.push(`/admin/girls`);
    } catch (err) {
      console.error('Error updating girl:', err);
      setError(err instanceof Error ? err.message : 'Chyba při aktualizaci profilu');
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
              <label>Pobočka / Lokace</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                {locations.length > 0 ? (
                  locations.map((loc: any) => (
                    <option key={loc.id} value={loc.display_name}>
                      {loc.display_name}
                    </option>
                  ))
                ) : (
                  <option value="Praha 2">Praha 2 (načítání...)</option>
                )}
              </select>
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
              <input
                type="text"
                value={formData.color}
                disabled
                style={{
                  opacity: 0.7,
                  cursor: 'not-allowed',
                  textTransform: 'capitalize'
                }}
                placeholder="Automaticky z profilu"
              />
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
                Barva se nastavuje automaticky podle profilu dívky
              </p>
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

        {/* Hashtags Section */}
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

          {/* Photos */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, color: 'var(--white)' }}>
                📸 Fotky
              </h3>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                {photosPagination ? (
                  <>
                    {photosPagination.total} {photosPagination.total === 1 ? 'fotka' : photosPagination.total < 5 ? 'fotky' : 'fotek'}
                    {photos.length < photosPagination.total && ` (zobrazeno ${photos.length})`}
                  </>
                ) : (
                  `${photos.length} ${photos.length === 1 ? 'fotka' : photos.length < 5 ? 'fotky' : 'fotek'}`
                )}
              </span>
            </div>

            {/* Photo Upload - Modern Drag & Drop */}
            <label
              htmlFor="photo-upload"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2rem',
                border: '2px dashed rgba(236, 72, 153, 0.5)',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '2rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.5)';
                e.currentTarget.style.background = 'rgba(236, 72, 153, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</div>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--white)', marginBottom: '0.5rem' }}>
                Klikni nebo přetáhni fotky sem
              </p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                Podporované formáty: JPG, PNG, WEBP (max. 10MB)
              </p>
              <input
                id="photo-upload"
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
                        // Upload succeeded - reload photos
                        try {
                          await loadPhotos(girlId);
                          console.log(`✅ Photo ${file.name} uploaded successfully`);
                          setUploadSuccess(file.name);
                          setTimeout(() => setUploadSuccess(null), 3000);
                        } catch (loadError) {
                          // Upload succeeded but photo list reload failed
                          console.error('Photo uploaded but list reload failed:', loadError);
                          // Don't show error alert - just refresh the page
                          window.location.reload();
                        }
                      } else {
                        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                        console.error('Upload failed:', response.status, errorData);
                        const errorMsg = errorData.details
                          ? `${errorData.error}\n\nDetaily: ${errorData.details}`
                          : errorData.error || `HTTP ${response.status}`;
                        alert(`Chyba při nahrávání ${file.name}:\n${errorMsg}`);
                      }
                    } catch (error) {
                      console.error('Upload error:', error);
                      alert(`Chyba při nahrávání ${file.name}:\n${error instanceof Error ? error.message : 'Network error'}`);
                    }
                  }
                  setUploadingPhoto(false);
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />
            </label>

            {/* Photos Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    border: photo.is_primary ? '3px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Photo container with overlay */}
                  <div
                    style={{
                      position: 'relative',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt_text || ""}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />

                    {/* Overlay Gradient */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      pointerEvents: 'none'
                    }} />

                    {/* Primary Badge */}
                    {photo.is_primary && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        ⭐ Hlavní
                      </div>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm('Opravdu smazat tuto fotku?')) {
                          await fetch(`/api/admin/girls/${girlId}/photos?photoId=${photo.id}`, {
                            method: 'DELETE'
                          });
                          await loadPhotos(girlId);
                        }
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(239, 68, 68, 0.95)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 1)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.95)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      🗑️
                    </button>

                    {/* Set Primary Button - Only show if not already primary */}
                    {!photo.is_primary && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/admin/girls/${girlId}/photos/${photo.id}/set-primary`, {
                              method: 'PATCH'
                            });

                            if (response.ok) {
                              await loadPhotos(girlId);
                            } else {
                              alert('Chyba při nastavování hlavní fotky');
                            }
                          } catch (error) {
                            console.error('Error setting primary photo:', error);
                            alert('Chyba při nastavování hlavní fotky');
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(236, 72, 153, 0.95)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(219, 39, 119, 1)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(236, 72, 153, 0.95)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        ⭐ Hlavní
                      </button>
                    )}
                  </div>

                  {/* ALT Text Input - Multi-language */}
                  <div style={{
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '6px'
                    }}>
                      📝 ALT popisek (CS/EN/DE/UK)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {[
                        { lang: 'cs', label: 'CS', placeholder: 'Popis (čeština)' },
                        { lang: 'en', label: 'EN', placeholder: 'Description (English)' },
                        { lang: 'de', label: 'DE', placeholder: 'Beschreibung (Deutsch)' },
                        { lang: 'uk', label: 'UK', placeholder: 'Опис (українська)' }
                      ].map(({ lang, label, placeholder }) => (
                        <input
                          key={lang}
                          type="text"
                          value={photo[`alt_text_${lang}`] || ''}
                          onChange={async (e) => {
                            const newAltText = e.target.value;
                            // Update local state immediately
                            setPhotos(photos.map(p =>
                              p.id === photo.id ? { ...p, [`alt_text_${lang}`]: newAltText } : p
                            ));

                            // Save to database
                            try {
                              await fetch(`/api/admin/girls/${girlId}/photos/${photo.id}/alt-text`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ [`alt_text_${lang}`]: newAltText })
                              });
                            } catch (error) {
                              console.error('Error updating ALT text:', error);
                            }
                          }}
                          placeholder={`${label}: ${placeholder}`}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '4px',
                            color: 'var(--white)',
                            fontSize: '0.75rem',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {photosPagination && photosPagination.hasMore && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={loadMorePhotos}
                  disabled={loadingMorePhotos}
                  style={{
                    padding: '12px 32px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'var(--white)',
                    fontWeight: '500',
                    cursor: loadingMorePhotos ? 'wait' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    opacity: loadingMorePhotos ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMorePhotos) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  {loadingMorePhotos ? 'Načítání...' : `Načíst další (${photosPagination.total - photos.length} zbývá)`}
                </button>
              </div>
            )}

            {uploadingPhoto && <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>Nahrávání...</p>}
            {photos.length === 0 && !uploadingPhoto && (
              <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '2rem' }}>
                Zatím žádné fotky
              </p>
            )}
          </div>

          {/* Videos */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, color: 'var(--white)' }}>
                🎥 Videa
              </h3>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                {videosPagination ? (
                  <>
                    {videosPagination.total} {videosPagination.total === 1 ? 'video' : videosPagination.total < 5 ? 'videa' : 'videí'}
                    {videos.length < videosPagination.total && ` (zobrazeno ${videos.length})`}
                  </>
                ) : (
                  `${videos.length} ${videos.length === 1 ? 'video' : videos.length < 5 ? 'videa' : 'videí'}`
                )}
              </span>
            </div>

            {/* Video Upload - Modern Drag & Drop */}
            <label
              htmlFor="video-upload"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2rem',
                border: '2px dashed rgba(147, 51, 234, 0.5)',
                borderRadius: '12px',
                background: 'rgba(147, 51, 234, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '2rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgb(147, 51, 234)';
                e.currentTarget.style.background = 'rgba(147, 51, 234, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.5)';
                e.currentTarget.style.background = 'rgba(147, 51, 234, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--white)', marginBottom: '0.5rem' }}>
                Klikni nebo přetáhni videa sem
              </p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                Podporované formáty: MP4, MOV, WEBM (max. 100MB)
              </p>
              <input
                id="video-upload"
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
                style={{ display: 'none' }}
              />
            </label>

            {/* Vimeo URL Input */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--white)' }}>
                Nebo přidej Vimeo video odkaz
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={vimeoUrl}
                  onChange={(e) => setVimeoUrl(e.target.value)}
                  placeholder="https://vimeo.com/123456789"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'var(--white)',
                    fontSize: '1rem'
                  }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!vimeoUrl.trim()) {
                      alert('Zadej Vimeo odkaz');
                      return;
                    }

                    setUploadingVideo(true);
                    try {
                      const response = await fetch(`/api/admin/girls/${girlId}/videos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ vimeo_url: vimeoUrl })
                      });

                      if (response.ok) {
                        await loadVideos(girlId);
                        setVimeoUrl('');
                      } else {
                        const data = await response.json();
                        alert(data.error || 'Chyba při přidávání videa');
                      }
                    } catch (error) {
                      console.error('Error adding Vimeo:', error);
                      alert('Chyba při přidávání videa');
                    }
                    setUploadingVideo(false);
                  }}
                  disabled={uploadingVideo || !vimeoUrl.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    fontWeight: '600',
                    cursor: uploadingVideo || !vimeoUrl.trim() ? 'not-allowed' : 'pointer',
                    opacity: uploadingVideo || !vimeoUrl.trim() ? 0.5 : 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {uploadingVideo ? 'Přidávám...' : 'Přidat'}
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', marginBottom: 0 }}>
                Podporujeme Vimeo odkazy (např. https://vimeo.com/123456789)
              </p>
            </div>

            {/* Videos Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {videos.map((video) => (
                <div key={video.id} style={{ position: 'relative' }}>
                  <video
                    src={video.url}
                    controls
                    preload="metadata"
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

            {/* Load More Button for Videos */}
            {videosPagination && videosPagination.hasMore && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={loadMoreVideos}
                  disabled={loadingMoreVideos}
                  style={{
                    padding: '12px 32px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'var(--white)',
                    fontWeight: '500',
                    cursor: loadingMoreVideos ? 'wait' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    opacity: loadingMoreVideos ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMoreVideos) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  {loadingMoreVideos ? 'Načítání...' : `Načíst další (${videosPagination.total - videos.length} zbývá)`}
                </button>
              </div>
            )}

            {uploadingVideo && <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>Nahrávání...</p>}
            {videos.length === 0 && !uploadingVideo && (
              <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '2rem' }}>
                Zatím žádná videa
              </p>
            )}
          </div>

          {/* Stories */}
          <div style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, color: 'var(--white)' }}>
                ⚡ Stories (24h jako Instagram)
              </h3>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
                {storiesPagination ? (
                  <>
                    {storiesPagination.total} {storiesPagination.total === 1 ? 'story' : storiesPagination.total < 5 ? 'stories' : 'stories'}
                    {stories.length < storiesPagination.total && ` (zobrazeno ${stories.length})`}
                  </>
                ) : (
                  `${stories.length} ${stories.length === 1 ? 'story' : stories.length < 5 ? 'stories' : 'stories'}`
                )}
              </span>
            </div>

            {/* Story Settings */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
              padding: '1.5rem',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.9rem' }}>
                  ⏱️ Doba zobrazení (sekundy)
                </label>
                <input
                  type="number"
                  id="story-duration"
                  defaultValue="5"
                  min="3"
                  max="15"
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.9rem' }}>
                  ⏰ Vyprší za (hodin)
                </label>
                <input
                  type="number"
                  id="story-expires"
                  defaultValue="24"
                  min="1"
                  max="168"
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            </div>

            {/* Story Upload - Modern Drag & Drop */}
            <label
              htmlFor="story-upload"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2rem',
                border: '2px dashed rgba(251, 191, 36, 0.5)',
                borderRadius: '12px',
                background: 'rgba(251, 191, 36, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '2rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgb(251, 191, 36)';
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                e.currentTarget.style.background = 'rgba(251, 191, 36, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--white)', marginBottom: '0.5rem' }}>
                Klikni nebo přetáhni stories sem
              </p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                Fotky nebo videa • Automaticky zmizí po nastaveném čase
              </p>
              <input
                id="story-upload"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;

                  const duration = (document.getElementById('story-duration') as HTMLInputElement)?.value || '5';
                  const expiresIn = (document.getElementById('story-expires') as HTMLInputElement)?.value || '24';

                  setUploadingStory(true);
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('duration', duration);
                    formData.append('expiresIn', expiresIn);

                    try {
                      const response = await fetch(`/api/admin/girls/${girlId}/stories`, {
                        method: 'POST',
                        body: formData
                      });

                      if (response.ok) {
                        await loadStories(girlId);
                      } else {
                        const data = await response.json();
                        alert(`Chyba při nahrávání ${file.name}: ${data.error || 'Neznámá chyba'}`);
                      }
                    } catch (error) {
                      console.error('Upload error:', error);
                      alert(`Chyba při nahrávání ${file.name}`);
                    }
                  }
                  setUploadingStory(false);
                  e.target.value = '';
                }}
                style={{ display: 'none' }}
              />
            </label>

            {/* Stories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {stories.map((story) => (
                <div key={story.id} style={{ position: 'relative' }}>
                  {story.media_type === 'image' ? (
                    <img
                      src={story.media_url}
                      alt=""
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  ) : (
                    <video
                      src={story.media_url}
                      controls
                      preload="metadata"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        background: '#000'
                      }}
                    />
                  )}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}>
                    {story.duration}s
                  </div>
                  {story.expires_at && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(234, 179, 8, 0.9)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      Vyprší {new Date(story.expires_at).toLocaleString('cs-CZ')}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm('Smazat tuto story?')) {
                        await fetch(`/api/admin/girls/${girlId}/stories?storyId=${story.id}`, {
                          method: 'DELETE'
                        });
                        await loadStories(girlId);
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

            {/* Load More Button for Stories */}
            {storiesPagination && storiesPagination.hasMore && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={loadMoreStories}
                  disabled={loadingMoreStories}
                  style={{
                    padding: '12px 32px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'var(--white)',
                    fontWeight: '500',
                    cursor: loadingMoreStories ? 'wait' : 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem',
                    opacity: loadingMoreStories ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMoreStories) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.borderColor = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  {loadingMoreStories ? 'Načítání...' : `Načíst další (${storiesPagination.total - stories.length} zbývá)`}
                </button>
              </div>
            )}

            {uploadingStory && <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>Nahrávání...</p>}
            {stories.length === 0 && !uploadingStory && (
              <p style={{ color: 'var(--gray)', textAlign: 'center', padding: '2rem' }}>
                Zatím žádné stories
              </p>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">Popis profilu</h2>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={async () => {
                if (!formData.bio_cs) {
                  alert('Nejdříve vyplň české bio (Bio CS)');
                  return;
                }

                setIsTranslating(true);
                try {
                  // Translate to EN
                  const enResponse = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      text: formData.bio_cs,
                      targetLang: 'en',
                      sourceLang: 'cs'
                    })
                  });
                  const enData = await enResponse.json();

                  // Translate to DE
                  const deResponse = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      text: formData.bio_cs,
                      targetLang: 'de',
                      sourceLang: 'cs'
                    })
                  });
                  const deData = await deResponse.json();

                  // Translate to UK
                  const ukResponse = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      text: formData.bio_cs,
                      targetLang: 'uk',
                      sourceLang: 'cs'
                    })
                  });
                  const ukData = await ukResponse.json();

                  if (enData.success && deData.success && ukData.success) {
                    setFormData({
                      ...formData,
                      bio: enData.translatedText,
                      bio_de: deData.translatedText,
                      bio_uk: ukData.translatedText
                    });
                    alert('✅ Bio bylo úspěšně přeloženo do všech jazyků!');
                  } else {
                    alert('❌ Chyba při překladu');
                  }
                } catch (error) {
                  console.error('Translation error:', error);
                  alert('❌ Chyba při překladu');
                } finally {
                  setIsTranslating(false);
                }
              }}
              disabled={isTranslating || !formData.bio_cs}
              style={{
                padding: '10px 20px',
                background: isTranslating ? '#6b7280' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isTranslating ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isTranslating || !formData.bio_cs ? 0.6 : 1
              }}
            >
              {isTranslating ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                  Překládám...
                </>
              ) : (
                <>
                  🔄 Auto-přeložit z češtiny
                </>
              )}
            </button>
            {!formData.bio_cs && (
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                Nejdříve vyplň české bio (Bio CS) →
              </span>
            )}
          </div>
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
          <h2 className="section-title">📝 Subtitle (H2 nadpis na profilu)</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>
            Nastavte unikátní H2 nadpis pro každou dívku v různých jazycích (výchozí: "Elegantní společnice pro náročné gentlemany")
          </p>
          <div className="form-group">
            <label>Subtitle CS (Čeština)</label>
            <input
              type="text"
              value={formData.subtitle_cs}
              onChange={(e) => setFormData({ ...formData, subtitle_cs: e.target.value })}
              placeholder="Elegantní společnice pro náročné gentlemany"
            />
          </div>
          <div className="form-group">
            <label>Subtitle EN (English)</label>
            <input
              type="text"
              value={formData.subtitle_en}
              onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
              placeholder="Elegant companion for discerning gentlemen"
            />
          </div>
          <div className="form-group">
            <label>Subtitle DE (Deutsch)</label>
            <input
              type="text"
              value={formData.subtitle_de}
              onChange={(e) => setFormData({ ...formData, subtitle_de: e.target.value })}
              placeholder="Elegante Begleiterin für anspruchsvolle Herren"
            />
          </div>
          <div className="form-group">
            <label>Subtitle UK (Українська)</label>
            <input
              type="text"
              value={formData.subtitle_uk}
              onChange={(e) => setFormData({ ...formData, subtitle_uk: e.target.value })}
              placeholder="Елегантна супутниця для вимогливих джентльменів"
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
          metaTitleCs={formData.meta_title_cs}
          metaTitleEn={formData.meta_title_en}
          metaTitleDe={formData.meta_title_de}
          metaTitleUk={formData.meta_title_uk}
          metaDescriptionCs={formData.meta_description_cs}
          metaDescriptionEn={formData.meta_description_en}
          metaDescriptionDe={formData.meta_description_de}
          metaDescriptionUk={formData.meta_description_uk}
          ogTitleCs={formData.og_title_cs}
          ogTitleEn={formData.og_title_en}
          ogTitleDe={formData.og_title_de}
          ogTitleUk={formData.og_title_uk}
          ogDescriptionCs={formData.og_description_cs}
          ogDescriptionEn={formData.og_description_en}
          ogDescriptionDe={formData.og_description_de}
          ogDescriptionUk={formData.og_description_uk}
          ogImage={formData.og_image}
          girlName={formData.name}
          primaryPhoto={photos.find(p => p.is_primary)?.url || null}
          onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
          onSave={saveProfile}
        />

        <div className="form-actions">
          <Link href="/admin/girls" className="btn btn-secondary">
            Zrušit
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              className="btn btn-danger"
              onClick={async () => {
                if (confirm('Opravdu smazat celý profil? Tato akce je nevratná a smaže všechny fotky, videa, recenze, rozvrhy a další data.')) {
                  try {
                    const response = await fetch(`/api/admin/girls/${girlId}`, {
                      method: 'DELETE'
                    });
                    const data = await response.json();
                    if (data.success) {
                      router.push('/admin/girls');
                    } else {
                      alert(data.error || 'Chyba při mazání profilu');
                    }
                  } catch (err) {
                    console.error('Delete error:', err);
                    alert('Chyba při mazání profilu');
                  }
                }
              }}
            >
              Smazat profil
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Ukládání...' : 'Uložit změny'}
            </button>
          </div>
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

        .btn-danger {
          background: #dc2626;
          color: white;
          border: 1px solid #b91c1c;
        }

        .btn-danger:hover {
          background: #b91c1c;
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
