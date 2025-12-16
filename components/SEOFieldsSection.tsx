"use client";

import { useState } from 'react';

interface SEOFieldsSectionProps {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  onChange: (field: 'meta_title' | 'meta_description' | 'og_image', value: string) => void;
  onGenerate?: () => void;
  girlName?: string;
}

export default function SEOFieldsSection({
  metaTitle,
  metaDescription,
  ogImage,
  onChange,
  onGenerate,
  girlName
}: SEOFieldsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const generateSEOData = () => {
    if (girlName) {
      // Auto-generate SEO fields based on girl's name
      const generatedTitle = `${girlName} - Escort Praha | LovelyGirls`;
      const generatedDescription = `Seznamte se s ${girlName}, profesionální escort v Praze. Ověřený profil, aktuální fotografie a recenze klientů na LovelyGirls.cz`;
      const generatedOGImage = `/girls/${girlName.toLowerCase().replace(/\s+/g, '-')}-og.jpg`;

      onChange('meta_title', generatedTitle);
      onChange('meta_description', generatedDescription);
      onChange('og_image', generatedOGImage);

      if (onGenerate) {
        onGenerate();
      }
    }
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '24px'
    }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded ? '20px' : '0',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px'
          }}>
            SEO & Sociální sítě
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
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
                padding: '8px 16px',
                background: '#111827',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1f2937'}
              onMouseOut={(e) => e.currentTarget.style.background = '#111827'}
            >
              ✨ Generovat automaticky
            </button>
          )}
          <span style={{
            fontSize: '1.25rem',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '20px' }}>
          {/* Meta Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Meta Title
              <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '8px' }}>
                ({metaTitle.length}/60 znaků)
              </span>
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => onChange('meta_title', e.target.value)}
              placeholder="SEO nadpis pro vyhledávače (50-60 znaků)"
              maxLength={60}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#111827'
              }}
            />
            {metaTitle.length > 0 && metaTitle.length < 50 && (
              <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 50-60 znaků)
              </p>
            )}
          </div>

          {/* Meta Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Meta Description
              <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '8px' }}>
                ({metaDescription.length}/160 znaků)
              </span>
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => onChange('meta_description', e.target.value)}
              placeholder="Popis profilu pro vyhledávače a sociální sítě (150-160 znaků)"
              maxLength={160}
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#111827',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            {metaDescription.length > 0 && metaDescription.length < 150 && (
              <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px', marginBottom: 0 }}>
                ⚠️ Příliš krátký (doporučeno 150-160 znaků)
              </p>
            )}
          </div>

          {/* OG Image */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              OG Image URL
              <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '8px' }}>
                (1200x630px)
              </span>
            </label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => onChange('og_image', e.target.value)}
              placeholder="/images/profiles/jmeno-og.jpg"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#111827'
              }}
            />
            {ogImage && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px' }}>Náhled:</p>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: '#e5e7eb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  {ogImage ? `🖼️ ${ogImage}` : 'Žádný obrázek'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
