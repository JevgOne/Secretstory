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
  girlName,
  primaryPhoto
}: SEOFieldsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('cs');

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

      // Use primary photo from gallery if available
      const generatedOGImage = primaryPhoto || `/girls/${girlName.toLowerCase().replace(/\s+/g, '-')}-og.jpg`;

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

      onChange('og_image', generatedOGImage);

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
          {girlName && (
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
              ✨ Generovat automaticky (všechny jazyky)
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

          {/* OG Image */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: 'var(--white)'
            }}>
              OG Image URL
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                (automaticky z galerie)
              </span>
            </label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => onChange('og_image', e.target.value)}
              placeholder="Automaticky použita primární fotka z galerie"
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
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>📸 Náhled fotky pro sdílení:</p>
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
