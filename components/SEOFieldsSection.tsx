"use client";

import { useState } from 'react';

interface SEOFieldsSectionProps {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  onChange: (field: 'meta_title' | 'meta_description' | 'og_title' | 'og_description' | 'og_image', value: string) => void;
  onGenerate?: () => void;
  girlName?: string;
  primaryPhoto?: string | null;
}

export default function SEOFieldsSection({
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  ogImage,
  onChange,
  onGenerate,
  girlName,
  primaryPhoto
}: SEOFieldsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const generateSEOData = () => {
    if (girlName) {
      // Auto-generate SEO fields based on girl's name
      const generatedTitle = `${girlName} - Escort Praha | LovelyGirls`;
      const generatedDescription = `Seznamte se s ${girlName}, profesionální escort v Praze. Ověřený profil, aktuální fotografie a recenze klientů na LovelyGirls.cz`;
      const generatedOGTitle = `${girlName} - Profesionální Escort Praha`;
      const generatedOGDescription = `Profesionální escort ${girlName} v Praze. Ověřený profil s aktuálními fotografiemi a recenzemi. Rezervujte si schůzku ještě dnes!`;

      // Use primary photo from gallery if available
      const generatedOGImage = primaryPhoto || `/girls/${girlName.toLowerCase().replace(/\s+/g, '-')}-og.jpg`;

      onChange('meta_title', generatedTitle);
      onChange('meta_description', generatedDescription);
      onChange('og_title', generatedOGTitle);
      onChange('og_description', generatedOGDescription);
      onChange('og_image', generatedOGImage);

      if (onGenerate) {
        onGenerate();
      }
    }
  };

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
            Meta title, description a OG image pro vyhledávače a sociální sítě
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
              ✨ Generovat automaticky
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
          {/* Meta Title */}
          <div className="form-group">
            <label>
              Meta Title
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                ({metaTitle.length}/60 znaků)
              </span>
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => onChange('meta_title', e.target.value)}
              placeholder="SEO nadpis pro vyhledávače (50-60 znaků)"
              maxLength={60}
            />
            {metaTitle.length > 0 && metaTitle.length < 50 && (
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '8px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 50-60 znaků)
              </p>
            )}
          </div>

          {/* Meta Description */}
          <div className="form-group">
            <label>
              Meta Description
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                ({metaDescription.length}/160 znaků)
              </span>
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => onChange('meta_description', e.target.value)}
              placeholder="Popis profilu pro vyhledávače a sociální sítě (150-160 znaků)"
              maxLength={160}
              rows={3}
            />
            {metaDescription.length > 0 && metaDescription.length < 150 && (
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
          <div className="form-group">
            <label>
              OG Title
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                ({ogTitle.length}/60 znaků)
              </span>
            </label>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => onChange('og_title', e.target.value)}
              placeholder="Nadpis při sdílení na sociálních sítích (50-60 znaků)"
              maxLength={60}
            />
            {ogTitle.length > 0 && ogTitle.length < 50 && (
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '8px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 50-60 znaků)
              </p>
            )}
          </div>

          {/* OG Description */}
          <div className="form-group">
            <label>
              OG Description
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', marginLeft: '8px' }}>
                ({ogDescription.length}/160 znaků)
              </span>
            </label>
            <textarea
              value={ogDescription}
              onChange={(e) => onChange('og_description', e.target.value)}
              placeholder="Popis při sdílení na sociálních sítích (150-160 znaků)"
              maxLength={160}
              rows={3}
            />
            {ogDescription.length > 0 && ogDescription.length < 150 && (
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '8px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 150-160 znaků)
              </p>
            )}
          </div>

          {/* OG Image */}
          <div className="form-group">
            <label>
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
              disabled
              style={{
                opacity: 0.7,
                cursor: 'not-allowed'
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
