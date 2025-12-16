"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

// Color palette - 16 distinct colors for calendar coding
const COLOR_PALETTE = [
  { id: 'pink', hex: '#ec4899', name: 'Růžová' },
  { id: 'blue', hex: '#3b82f6', name: 'Modrá' },
  { id: 'purple', hex: '#8b5cf6', name: 'Fialová' },
  { id: 'green', hex: '#22c55e', name: 'Zelená' },
  { id: 'orange', hex: '#f97316', name: 'Oranžová' },
  { id: 'cyan', hex: '#06b6d4', name: 'Tyrkysová' },
  { id: 'rose', hex: '#f43f5e', name: 'Rose' },
  { id: 'amber', hex: '#f59e0b', name: 'Amber' },
  { id: 'teal', hex: '#14b8a6', name: 'Teal' },
  { id: 'indigo', hex: '#6366f1', name: 'Indigo' },
  { id: 'lime', hex: '#84cc16', name: 'Limetka' },
  { id: 'sky', hex: '#0ea5e9', name: 'Nebeská' },
  { id: 'violet', hex: '#7c3aed', name: 'Violet' },
  { id: 'fuchsia', hex: '#d946ef', name: 'Fuchsia' },
  { id: 'emerald', hex: '#10b981', name: 'Smaragd' },
  { id: 'red', hex: '#ef4444', name: 'Červená' }
];

const SERVICES = [
  'GFE', 'PSE', 'Classic', 'Massage', 'Oral', 'Anal',
  'BDSM', 'Roleplay', 'Dinner Date', 'Travel', 'Overnight', 'Couples'
];

interface Girl {
  id: number;
  name: string;
  email: string;
  color: string;
  age: number;
  nationality: string;
  height: number;
  weight: number;
  bust: string;
  hair: string;
  eyes: string;
  status: 'active' | 'pending' | 'inactive';
  verified: boolean;
  online: boolean;
  rating: number;
  reviews: number;
  bookings: number;
  services: string[];
  bio: string;
}

export default function GirlsManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewGirlModal, setShowNewGirlModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGirl, setSelectedGirl] = useState<Girl | null>(null);
  const [selectedColor, setSelectedColor] = useState('pink');
  const [selectedServices, setSelectedServices] = useState<string[]>(['GFE']);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [girls, setGirls] = useState<Girl[]>([]);

  // Load girls from API
  useEffect(() => {
    async function loadGirls() {
      try {
        const response = await fetch('/api/admin/girls');
        const data = await response.json();

        if (data.success && data.girls) {
          // Transform API data to match our interface
          const transformedGirls = data.girls.map((girl: any) => ({
            id: girl.id,
            name: girl.name,
            email: girl.email || '',
            color: girl.color || 'pink',
            age: girl.age,
            nationality: girl.nationality || '',
            height: girl.height || 0,
            weight: girl.weight || 0,
            bust: girl.bust || '',
            hair: girl.hair || '',
            eyes: girl.eyes || '',
            status: girl.status || 'active',
            verified: girl.status === 'active',
            online: girl.is_online || false,
            rating: girl.rating || 0,
            reviews: girl.review_count || 0,
            bookings: girl.booking_count || 0,
            services: girl.services || [],
            bio: girl.bio || ''
          }));
          setGirls(transformedGirls);
        }
      } catch (error) {
        console.error('Error loading girls:', error);
        displayToast('Chyba při načítání dívek', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadGirls();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    nationality: 'czech',
    height: '',
    weight: '',
    bust: 'C',
    hair: 'brunette',
    eyes: 'brown',
    bio: '',
    bioEn: ''
  });

  const activeGirls = girls.filter(g => g.status === 'active');
  const pendingGirls = girls.filter(g => g.status === 'pending');
  const onlineCount = girls.filter(g => g.online).length;

  const filteredActiveGirls = activeGirls.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPendingGirls = pendingGirls.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const usedColors = girls.map(g => g.color);

  useEffect(() => {
    // Auto-select first available color
    const availableColor = COLOR_PALETTE.find(c => !usedColors.includes(c.id));
    if (availableColor) {
      setSelectedColor(availableColor.id);
    }
  }, [girls]);

  const getGirlEmoji = (girl: Girl) => {
    const hairEmojis: Record<string, string> = {
      blonde: '👱‍♀️',
      brunette: '👩',
      black: '👩‍🦱',
      red: '👩‍🦰'
    };
    return hairEmojis[girl.hair] || '👩';
  };

  const openNewGirlModal = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
      nationality: 'czech',
      height: '',
      weight: '',
      bust: 'C',
      hair: 'brunette',
      eyes: 'brown',
      bio: '',
      bioEn: ''
    });
    setSelectedServices(['GFE']);
    const availableColor = COLOR_PALETTE.find(c => !usedColors.includes(c.id));
    if (availableColor) {
      setSelectedColor(availableColor.id);
    }
    setShowNewGirlModal(true);
  };

  const saveNewGirl = async () => {
    if (!formData.name || !formData.email) {
      displayToast('Vyplňte jméno a email', 'error');
      return;
    }

    if (!formData.age) {
      displayToast('Vyplňte věk', 'error');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/girls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: null,
          age: parseInt(formData.age),
          nationality: formData.nationality,
          height: parseInt(formData.height) || null,
          weight: parseInt(formData.weight) || null,
          bust: formData.bust,
          hair: formData.hair,
          eyes: formData.eyes,
          color: selectedColor,
          services: selectedServices,
          bio: formData.bio,
          tattoo_percentage: 0,
          tattoo_description: null,
          piercing: false,
          piercing_description: null,
          languages: ['cs'],
          is_new: true,
          is_top: false,
          is_featured: false,
          featured_section: null,
          badge_type: null
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        displayToast(`Profil ${formData.name} vytvořen`, 'success');
        setShowNewGirlModal(false);

        // Reload girls list
        const girlsResponse = await fetch('/api/admin/girls');
        const girlsData = await girlsResponse.json();

        if (girlsData.success && girlsData.girls) {
          const transformedGirls = girlsData.girls.map((girl: any) => ({
            id: girl.id,
            name: girl.name,
            email: girl.email || '',
            color: girl.color || 'pink',
            age: girl.age,
            nationality: girl.nationality || '',
            height: girl.height || 0,
            weight: girl.weight || 0,
            bust: girl.bust || '',
            hair: girl.hair || '',
            eyes: girl.eyes || '',
            status: girl.status || 'active',
            verified: girl.status === 'active',
            online: girl.online || false,
            rating: girl.rating || 0,
            reviews: girl.reviews_count || 0,
            bookings: girl.bookings_count || 0,
            services: girl.services || [],
            bio: girl.bio || ''
          }));
          setGirls(transformedGirls);
        }
      } else {
        displayToast(data.error || 'Chyba při vytváření profilu', 'error');
      }
    } catch (error) {
      console.error('Error creating girl:', error);
      displayToast('Chyba při vytváření profilu', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openGirlDetail = (girl: Girl) => {
    setSelectedGirl(girl);
    setShowDetailModal(true);
  };

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const displayToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const getColorHex = (colorId: string) => {
    const color = COLOR_PALETTE.find(c => c.id === colorId);
    return color ? color.hex : '#8b2942';
  };

  return (
    <>
      <AdminHeader title="Správa dívek" showBack={true} />

      {/* CONTENT */}
      <main className="app-content">
        {/* SEARCH */}
        <div style={{
          marginBottom: '20px',
          position: 'relative'
        }}>
        <div className="search-input-wrap">
          <span className="search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Hledat dívku..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat-chip">
          <span className="stat-chip-value">{girls.length}</span>
          <span className="stat-chip-label">Celkem</span>
        </div>
        <div className="stat-chip online">
          <span className="stat-chip-value">{onlineCount}</span>
          <span className="stat-chip-label">Online</span>
        </div>
        <div className="stat-chip">
          <span className="stat-chip-value">{pendingGirls.length}</span>
          <span className="stat-chip-label">Čeká</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        {/* ACTIVE GIRLS */}
        <section className="section">
          <div className="section-header">
            <h3 className="section-title">Aktivní dívky</h3>
          </div>
          <div>
            {filteredActiveGirls.map(girl => {
              const colorHex = getColorHex(girl.color);
              return (
                <div key={girl.id} className="girl-card" onClick={() => openGirlDetail(girl)}>
                  <div className="girl-avatar" style={{ background: `${colorHex}20` }}>
                    {getGirlEmoji(girl)}
                    <div className="girl-color-dot" style={{ background: colorHex }}></div>
                    {girl.online && <div className="online-indicator"></div>}
                  </div>
                  <div className="girl-info">
                    <div className="girl-name">
                      {girl.name}
                      {girl.verified && <span className="verified-badge">✓</span>}
                    </div>
                    <div className="girl-meta">
                      <span>{girl.age} let</span>
                      <span>{girl.height} cm</span>
                      <span>{girl.bust}</span>
                    </div>
                  </div>
                  <div className="girl-stats">
                    <div className="girl-rating">
                      <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {girl.rating}
                    </div>
                    <div className="girl-bookings">{girl.bookings} rezervací</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PENDING GIRLS */}
        {filteredPendingGirls.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h3 className="section-title">Čekající na schválení</h3>
            </div>
            <div>
              {filteredPendingGirls.map(girl => {
                const colorHex = getColorHex(girl.color);
                return (
                  <div key={girl.id} className="girl-card" onClick={() => openGirlDetail(girl)}>
                    <div className="girl-avatar" style={{ background: `${colorHex}20` }}>
                      {getGirlEmoji(girl)}
                      <div className="girl-color-dot" style={{ background: colorHex }}></div>
                    </div>
                    <div className="girl-info">
                      <div className="girl-name">{girl.name}</div>
                      <div className="girl-meta">
                        <span>{girl.age} let</span>
                        <span>{girl.height} cm</span>
                        <span>{girl.bust}</span>
                      </div>
                    </div>
                    <div className="girl-stats">
                      <span className="girl-status pending">Čeká</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* FAB */}
      <div className="fab" onClick={openNewGirlModal}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
      </main>

      {/* NEW GIRL MODAL */}
      {showNewGirlModal && (
        <div className={`modal-overlay ${showNewGirlModal ? 'show' : ''}`} onClick={(e) => {
          if (e.target === e.currentTarget) setShowNewGirlModal(false);
        }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Nová dívka</span>
              <button className="modal-close" onClick={() => setShowNewGirlModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* PREVIEW */}
              <div className="preview-section">
                <div className="preview-title">Náhled</div>
                <div className="preview-card">
                  <div className="preview-avatar" style={{ background: `${getColorHex(selectedColor)}20` }}>👩</div>
                  <div className="preview-info">
                    <h4>{formData.name || 'Jméno dívky'}</h4>
                    <div className="preview-color-bar" style={{ background: getColorHex(selectedColor) }}></div>
                  </div>
                </div>
              </div>

              {/* BASIC INFO */}
              <div className="form-section">
                <div className="form-section-title">Základní údaje</div>
                <div className="form-group">
                  <label className="form-label">Jméno *</label>
                  <input type="text" className="form-input" placeholder="Zobrazované jméno"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" placeholder="email@example.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Věk</label>
                    <input type="number" className="form-input" placeholder="25" min="18" max="60"
                      value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Národnost</label>
                    <select className="form-select" value={formData.nationality}
                      onChange={(e) => setFormData({...formData, nationality: e.target.value})}>
                      <option value="czech">Česká</option>
                      <option value="slovak">Slovenská</option>
                      <option value="ukrainian">Ukrajinská</option>
                      <option value="russian">Ruská</option>
                      <option value="polish">Polská</option>
                      <option value="other">Jiná</option>
                    </select>
                  </div>
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Výška (cm)</label>
                    <input type="number" className="form-input" placeholder="170"
                      value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Váha (kg)</label>
                    <input type="number" className="form-input" placeholder="55"
                      value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prsa</label>
                    <select className="form-select" value={formData.bust}
                      onChange={(e) => setFormData({...formData, bust: e.target.value})}>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="DD">DD+</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Barva vlasů</label>
                    <select className="form-select" value={formData.hair}
                      onChange={(e) => setFormData({...formData, hair: e.target.value})}>
                      <option value="blonde">Blond</option>
                      <option value="brunette">Bruneta</option>
                      <option value="black">Černé</option>
                      <option value="red">Zrzavé</option>
                      <option value="other">Jiné</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Barva očí</label>
                    <select className="form-select" value={formData.eyes}
                      onChange={(e) => setFormData({...formData, eyes: e.target.value})}>
                      <option value="blue">Modré</option>
                      <option value="green">Zelené</option>
                      <option value="brown">Hnědé</option>
                      <option value="gray">Šedé</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* COLOR */}
              <div className="form-section">
                <div className="form-section-title">Barva v kalendáři</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '14px' }}>
                  Tato barva bude použita v kalendáři a všude kde se zobrazuje dívka. Šedé barvy jsou již použité.
                </p>
                <div className="color-picker">
                  {COLOR_PALETTE.map(color => {
                    const isUsed = usedColors.includes(color.id);
                    const isSelected = color.id === selectedColor;
                    return (
                      <div
                        key={color.id}
                        className={`color-option ${isSelected ? 'selected' : ''} ${isUsed ? 'used' : ''}`}
                        style={{ background: color.hex }}
                        title={`${color.name}${isUsed ? ' (použitá)' : ''}`}
                        onClick={() => !isUsed && setSelectedColor(color.id)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* PHOTO */}
              <div className="form-section">
                <div className="form-section-title">Profilová fotka</div>
                <div className="photo-upload-area" onClick={() => document.getElementById('photoInput')?.click()}>
                  <div className="photo-upload-icon">📷</div>
                  <div className="photo-upload-text">Klikněte pro nahrání fotky</div>
                  <div className="photo-upload-hint">JPG, PNG • Max 10MB</div>
                </div>
                <input type="file" id="photoInput" accept="image/*" style={{ display: 'none' }} />
              </div>

              {/* SERVICES */}
              <div className="form-section">
                <div className="form-section-title">Služby</div>
                <div className="services-grid">
                  {SERVICES.map(service => (
                    <div
                      key={service}
                      className={`service-toggle ${selectedServices.includes(service) ? 'active' : ''}`}
                      onClick={() => toggleService(service)}
                    >
                      <div className="service-checkbox">{selectedServices.includes(service) ? '✓' : ''}</div>
                      <span className="service-name">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BIO */}
              <div className="form-section">
                <div className="form-section-title">Popis</div>
                <div className="form-group">
                  <label className="form-label">Bio (CZ)</label>
                  <textarea className="form-textarea" placeholder="Krátký popis dívky..."
                    value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio (EN)</label>
                  <textarea className="form-textarea" placeholder="Short description in English..."
                    value={formData.bioEn} onChange={(e) => setFormData({...formData, bioEn: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowNewGirlModal(false)} disabled={saving}>Zrušit</button>
              <button className="modal-btn primary" onClick={saveNewGirl} disabled={saving}>
                {saving ? 'Vytváření...' : 'Vytvořit profil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GIRL DETAIL MODAL */}
      {showDetailModal && selectedGirl && (
        <div className={`modal-overlay ${showDetailModal ? 'show' : ''}`} onClick={(e) => {
          if (e.target === e.currentTarget) setShowDetailModal(false);
        }}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Detail dívky</span>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-header">
                <div className="detail-avatar" style={{ background: `${getColorHex(selectedGirl.color)}20` }}>
                  {getGirlEmoji(selectedGirl)}
                </div>
                <div className="detail-info">
                  <h3 className="detail-name">
                    {selectedGirl.name}
                    {selectedGirl.verified && <span className="verified-badge">✓</span>}
                  </h3>
                  <div className="detail-meta">{selectedGirl.age} let • {selectedGirl.height} cm • {selectedGirl.bust}</div>
                  <div className="detail-color">
                    <span className="detail-color-dot" style={{ background: getColorHex(selectedGirl.color) }}></span>
                    {COLOR_PALETTE.find(c => c.id === selectedGirl.color)?.name}
                  </div>
                </div>
              </div>

              <div className="detail-stats">
                <div className="detail-stat">
                  <div className="detail-stat-value">{selectedGirl.rating || '—'}</div>
                  <div className="detail-stat-label">Rating</div>
                </div>
                <div className="detail-stat">
                  <div className="detail-stat-value">{selectedGirl.reviews}</div>
                  <div className="detail-stat-label">Recenzí</div>
                </div>
                <div className="detail-stat">
                  <div className="detail-stat-value">{selectedGirl.bookings}</div>
                  <div className="detail-stat-label">Rezervací</div>
                </div>
                <div className="detail-stat">
                  <div className="detail-stat-value">{selectedGirl.online ? '🟢' : '⚫'}</div>
                  <div className="detail-stat-label">{selectedGirl.online ? 'Online' : 'Offline'}</div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Služby</div>
                <div className="detail-services">
                  {selectedGirl.services.map(s => <span key={s} className="detail-service-tag">{s}</span>)}
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Kontakt</div>
                <p style={{ color: 'var(--gray-light)' }}>{selectedGirl.email}</p>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Rychlé akce</div>
                <div className="detail-actions">
                  <button className="detail-action-btn" onClick={() => router.push('/manager/calendar')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                    </svg>
                    Kalendář
                  </button>
                  <button className="detail-action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Recenze
                  </button>
                  <button className="detail-action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Export
                  </button>
                  <button className="detail-action-btn" style={{ color: 'var(--red)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    Deaktivovat
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowDetailModal(false)}>Zavřít</button>
              <button className="modal-btn primary" onClick={() => displayToast('Funkce ve vývoji')}>Upravit profil</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`toast ${showToast ? 'show' : ''} ${toastType === 'success' ? 'success' : ''}`}>
        <span className="toast-icon">{toastType === 'success' ? '✓' : '⚠'}</span>
        <span className="toast-text">{toastMessage}</span>
      </div>
    </>
  );
}
