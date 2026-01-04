"use client";

import { useState } from 'react';

type Language = 'cs' | 'en' | 'de' | 'uk';

interface SEOFieldsSectionProps {
  // Multi-language SEO fields
  metaTitleCs: string;
  metaTitleEn: string;
  metaTitleDe: string;
  metaTitleUk: string;
  metaDescriptionCs: string;
  metaDescriptionEn: string;
  metaDescriptionDe: string;
  metaDescriptionUk: string;
  ogTitleCs: string;
  ogTitleEn: string;
  ogTitleDe: string;
  ogTitleUk: string;
  ogDescriptionCs: string;
  ogDescriptionEn: string;
  ogDescriptionDe: string;
  ogDescriptionUk: string;
  ogImage: string;
  onChange: (field: string, value: string) => void;
  onGenerate?: () => void;
  onSave?: () => Promise<void>;
  girlName?: string;
  primaryPhoto?: string | null;
}

export default function SEOFieldsSection({
  metaTitleCs,
  metaTitleEn,
  metaTitleDe,
  metaTitleUk,
  metaDescriptionCs,
  metaDescriptionEn,
  metaDescriptionDe,
  metaDescriptionUk,
  ogTitleCs,
  ogTitleEn,
  ogTitleDe,
  ogTitleUk,
  ogDescriptionCs,
  ogDescriptionEn,
  ogDescriptionDe,
  ogDescriptionUk,
  ogImage,
  onChange,
  onGenerate,
  onSave,
  girlName,
  primaryPhoto
}: SEOFieldsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('cs');
  const [isSaving, setIsSaving] = useState(false);

  // Get current language values
  const getCurrentValues = () => {
    const values = {
      cs: {
        metaTitle: metaTitleCs,
        metaDescription: metaDescriptionCs,
        ogTitle: ogTitleCs,
        ogDescription: ogDescriptionCs
      },
      en: {
        metaTitle: metaTitleEn,
        metaDescription: metaDescriptionEn,
        ogTitle: ogTitleEn,
        ogDescription: ogDescriptionEn
      },
      de: {
        metaTitle: metaTitleDe,
        metaDescription: metaDescriptionDe,
        ogTitle: ogTitleDe,
        ogDescription: ogDescriptionDe
      },
      uk: {
        metaTitle: metaTitleUk,
        metaDescription: metaDescriptionUk,
        ogTitle: ogTitleUk,
        ogDescription: ogDescriptionUk
      }
    };
    return values[currentLang];
  };

  const currentValues = getCurrentValues();

  const generateAndSave = async () => {
    if (!girlName || !onSave) return;

    setIsSaving(true);
    try {
      // Generate SEO data first
      generateSEOData();

      // Wait for React to apply state updates (needs more time!)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Save to database
      await onSave();

      alert('✅ SEO data byla vygenerována a uložena!');
    } catch (error) {
      console.error('Error saving SEO:', error);
      alert('❌ Chyba při ukládání SEO dat');
    } finally {
      setIsSaving(false);
    }
  };

  const generateSEOData = () => {
    if (girlName) {
      // Generate for Czech
      const generatedTitleCs = `${girlName} - Escort Praha | LovelyGirls`;
      const generatedDescriptionCs = `Seznamte se s ${girlName}, profesionální escort v Praze. Ověřený profil, aktuální fotografie a recenze klientů na LovelyGirls.cz`;
      const generatedOGTitleCs = `${girlName} - Profesionální Escort Praha`;
      const generatedOGDescriptionCs = `Profesionální escort ${girlName} v Praze. Ověřený profil s aktuálními fotografiemi a recenzemi. Rezervujte si schůzku ještě dnes!`;

      // Generate for English
      const generatedTitleEn = `${girlName} - Prague Escort | LovelyGirls`;
      const generatedDescriptionEn = `Meet ${girlName}, professional escort in Prague. Verified profile, current photos and client reviews on LovelyGirls.cz`;
      const generatedOGTitleEn = `${girlName} - Professional Prague Escort`;
      const generatedOGDescriptionEn = `Professional escort ${girlName} in Prague. Verified profile with current photos and reviews. Book your meeting today!`;

      // Generate for German
      const generatedTitleDe = `${girlName} - Escort Prag | LovelyGirls`;
      const generatedDescriptionDe = `Treffen Sie ${girlName}, professionelle Escort in Prag. Verifiziertes Profil, aktuelle Fotos und Kundenbewertungen auf LovelyGirls.cz`;
      const generatedOGTitleDe = `${girlName} - Professionelle Escort Prag`;
      const generatedOGDescriptionDe = `Professionelle Escort ${girlName} in Prag. Verifiziertes Profil mit aktuellen Fotos und Bewertungen. Buchen Sie Ihr Treffen noch heute!`;

      // Generate for Ukrainian
      const generatedTitleUk = `${girlName} - Ескорт Прага | LovelyGirls`;
      const generatedDescriptionUk = `Зустрічайте ${girlName}, професійний ескорт у Празі. Перевірений профіль, актуальні фото та відгуки клієнтів на LovelyGirls.cz`;
      const generatedOGTitleUk = `${girlName} - Професійний Ескорт Прага`;
      const generatedOGDescriptionUk = `Професійний ескорт ${girlName} у Празі. Перевірений профіль з актуальними фото та відгуками. Забронюйте зустріч сьогодні!`;

      // Only use primary photo if available, otherwise leave og_image empty (will use primary photo automatically)
      // Don't generate fake URLs - primární fotka se použije automaticky z galerie
      const generatedOGImage = primaryPhoto || '';

      // Update all languages
      onChange('meta_title_cs', generatedTitleCs);
      onChange('meta_description_cs', generatedDescriptionCs);
      onChange('og_title_cs', generatedOGTitleCs);
      onChange('og_description_cs', generatedOGDescriptionCs);

      onChange('meta_title_en', generatedTitleEn);
      onChange('meta_description_en', generatedDescriptionEn);
      onChange('og_title_en', generatedOGTitleEn);
      onChange('og_description_en', generatedOGDescriptionEn);

      onChange('meta_title_de', generatedTitleDe);
      onChange('meta_description_de', generatedDescriptionDe);
      onChange('og_title_de', generatedOGTitleDe);
      onChange('og_description_de', generatedOGDescriptionDe);

      onChange('meta_title_uk', generatedTitleUk);
      onChange('meta_description_uk', generatedDescriptionUk);
      onChange('og_title_uk', generatedOGTitleUk);
      onChange('og_description_uk', generatedOGDescriptionUk);

      // Only set og_image if primary photo exists, otherwise leave empty (automatic from gallery)
      if (generatedOGImage) {
        onChange('og_image', generatedOGImage);
      }

      if (onGenerate) {
        onGenerate();
      }
    }
  };

  const languageTabs = [
    { code: 'cs' as Language, label: 'Čeština', flag: '🇨🇿' },
    { code: 'en' as Language, label: 'English', flag: '🇬🇧' },
    { code: 'de' as Language, label: 'Deutsch', flag: '🇩🇪' },
    { code: 'uk' as Language, label: 'Українська', flag: '🇺🇦' }
  ];

  return (
    <div className="form-section">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded ? '24px' : '0',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="section-title" style={{ marginBottom: '8px' }}>
            📊 SEO & Sociální sítě
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.7)',
            margin: 0
          }}>
            Meta title, description a OG image pro vyhledávače a sociální sítě (vícejazyčné)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {girlName && onSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                generateAndSave();
              }}
              disabled={isSaving}
              style={{
                padding: '10px 20px',
                background: isSaving ? '#6b7280' : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                opacity: isSaving ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                }
              }}
            >
              {isSaving ? '💾 Ukládám...' : '💾 Generovat a uložit (všechny jazyky)'}
            </button>
          )}
          {girlName && !onSave && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                generateSEOData();
              }}
              style={{
                padding: '10px 20px',
                background: 'var(--primary)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--primary-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(236, 72, 153, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(236, 72, 153, 0.3)';
              }}
            >
              ✨ Generovat (jen vyplní pole)
            </button>
          )}
          <span style={{
            fontSize: '1.25rem',
            color: 'var(--white)',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div>
          {/* Language Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: '12px'
          }}>
            {languageTabs.map(({ code, label, flag }) => (
              <button
                key={code}
                type="button"
                onClick={() => setCurrentLang(code)}
                style={{
                  padding: '10px 16px',
                  background: currentLang === code ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: currentLang === code ? 'var(--white)' : 'rgba(255,255,255,0.7)',
                  border: currentLang === code ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (currentLang !== code) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentLang !== code) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                {flag} {label}
              </button>
            ))}
          </div>

          {/* Meta Title */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'var(--white)'
            }}>
              Meta Title ({currentLang.toUpperCase()})
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                ({currentValues.metaTitle.length}/60 znaků)
              </span>
            </label>
            <input
              type="text"
              value={currentValues.metaTitle}
              onChange={(e) => onChange(`meta_title_${currentLang}`, e.target.value)}
              placeholder="SEO nadpis pro vyhledávače (50-60 znaků)"
              maxLength={60}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--white)',
                fontSize: '0.95rem',
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
            {currentValues.metaTitle.length > 0 && currentValues.metaTitle.length < 50 && (
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '8px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 50-60 znaků)
              </p>
            )}
          </div>

          {/* Meta Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'var(--white)'
            }}>
              Meta Description ({currentLang.toUpperCase()})
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                ({currentValues.metaDescription.length}/160 znaků)
              </span>
            </label>
            <textarea
              value={currentValues.metaDescription}
              onChange={(e) => onChange(`meta_description_${currentLang}`, e.target.value)}
              placeholder="Popis profilu pro vyhledávače a sociální sítě (150-160 znaků)"
              maxLength={160}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--white)',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
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
            {currentValues.metaDescription.length > 0 && currentValues.metaDescription.length < 150 && (
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '8px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 150-160 znaků)
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            margin: '32px 0 24px 0',
            paddingTop: '24px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--white)',
              marginBottom: '8px'
            }}>
              🔗 Open Graph (Facebook, Twitter, LinkedIn)
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.6)',
              margin: 0
            }}>
              Nastavení pro sdílení na sociálních sítích a WhatsApp
            </p>
          </div>

          {/* OG Title */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'var(--white)'
            }}>
              OG Title ({currentLang.toUpperCase()})
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                ({currentValues.ogTitle.length}/60 znaků)
              </span>
            </label>
            <input
              type="text"
              value={currentValues.ogTitle}
              onChange={(e) => onChange(`og_title_${currentLang}`, e.target.value)}
              placeholder="Nadpis při sdílení na sociálních sítích (50-60 znaků)"
              maxLength={60}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--white)',
                fontSize: '0.95rem',
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
            {currentValues.ogTitle.length > 0 && currentValues.ogTitle.length < 50 && (
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '8px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 50-60 znaků)
              </p>
            )}
          </div>

          {/* OG Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'var(--white)'
            }}>
              OG Description ({currentLang.toUpperCase()})
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                ({currentValues.ogDescription.length}/160 znaků)
              </span>
            </label>
            <textarea
              value={currentValues.ogDescription}
              onChange={(e) => onChange(`og_description_${currentLang}`, e.target.value)}
              placeholder="Popis při sdílení na sociálních sítích (150-160 znaků)"
              maxLength={160}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--white)',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
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
            {currentValues.ogDescription.length > 0 && currentValues.ogDescription.length < 150 && (
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '8px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 150-160 znaků)
              </p>
            )}
          </div>

          {/* Automatic OG Image from Gallery */}
          {primaryPhoto && (
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                marginBottom: '12px',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--white)'
              }}>
                📸 Automatický OG Image z galerie
                <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                  (primární fotka pro Facebook, Twitter, WhatsApp)
                </span>
              </label>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                borderRadius: '12px',
                border: '2px solid rgba(16, 185, 129, 0.3)'
              }}>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
                  ℹ️ Automaticky použita primární fotka z galerie (můžete přepsat vlastním URL níže)
                </p>
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img
                    src={primaryPhoto}
                    alt="Primary Photo OG Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      maxHeight: '400px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<div style="padding: 40px; text-align: center; color: rgba(255,255,255,0.5);">⚠️ Primární fotka se nepodařilo načíst</div>';
                      }
                    }}
                  />
                </div>
                <div style={{
                  marginTop: '12px',
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <span style={{
                    padding: '8px 12px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#10b981',
                    fontWeight: '600'
                  }}>
                    ✓ Používá se automaticky
                  </span>
                  <span style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    {primaryPhoto}
                  </span>
                </div>
              </div>
            </div>
          )}
          {!primaryPhoto && girlName && (
            <div style={{
              marginBottom: '32px',
              padding: '16px',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#fbbf24', margin: 0 }}>
                ⚠️ Není nastavena primární fotka v galerii. Nastavte primární fotku nebo použijte vlastní OG image URL níže.
              </p>
            </div>
          )}

          {/* OG Image */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'var(--white)'
            }}>
              OG Image URL (vlastní - volitelné)
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                (přepíše automatický)
              </span>
            </label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => onChange('og_image', e.target.value)}
              placeholder="Nechte prázdné pro použití automatického OG image"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--white)',
                fontSize: '0.95rem',
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
            {ogImage && (
              <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>📸 Vlastní OG image:</p>
                {ogImage.startsWith('http') ? (
                  <img
                    src={ogImage}
                    alt="OG Preview"
                    style={{
                      width: '100%',
                      maxHeight: '250px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.9rem',
                    border: '1px dashed rgba(255,255,255,0.2)'
                  }}>
                    🖼️ {ogImage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
