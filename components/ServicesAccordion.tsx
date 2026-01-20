"use client";

import { useState } from 'react';
import type { Service } from '@/lib/services';

interface ServicesAccordionProps {
  basicServices: Service[];
  extraServices: Service[];
  locale: string;
  translations: {
    servicesIncluded: string;
    extraServices: string;
  };
}

export default function ServicesAccordion({
  basicServices,
  extraServices,
  locale,
  translations
}: ServicesAccordionProps) {
  const [expandedSection, setExpandedSection] = useState<'basic' | 'extra' | null>('basic');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Basic Services */}
      {basicServices.length > 0 && (
        <div className="services-accordion-item">
          <button
            onClick={() => setExpandedSection(expandedSection === 'basic' ? null : 'basic')}
            className="services-accordion-header"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(139, 41, 66, 0.1)',
              border: '1px solid rgba(139, 41, 66, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <span>{translations.servicesIncluded}</span>
            <span style={{
              transform: expandedSection === 'basic' ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease'
            }}>
              ▼
            </span>
          </button>
          {expandedSection === 'basic' && (
            <div className="services-accordion-content" style={{
              padding: '1rem',
              marginTop: '0.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.75rem'
              }}>
                {basicServices.map((service) => (
                  <div key={service.id} style={{
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(139, 41, 66, 0.15)',
                    borderRadius: '6px',
                    color: '#e8b4b8',
                    fontSize: '0.9rem'
                  }}>
                    ✓ {service.translations[locale as keyof typeof service.translations]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Extra Services */}
      {extraServices.length > 0 && (
        <div className="services-accordion-item">
          <button
            onClick={() => setExpandedSection(expandedSection === 'extra' ? null : 'extra')}
            className="services-accordion-header"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(139, 41, 66, 0.1)',
              border: '1px solid rgba(139, 41, 66, 0.3)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <span>{translations.extraServices}</span>
            <span style={{
              transform: expandedSection === 'extra' ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.3s ease'
            }}>
              ▼
            </span>
          </button>
          {expandedSection === 'extra' && (
            <div className="services-accordion-content" style={{
              padding: '1rem',
              marginTop: '0.5rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.75rem'
              }}>
                {extraServices.map((service) => (
                  <div key={service.id} style={{
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(255, 215, 0, 0.15)',
                    borderRadius: '6px',
                    color: '#ffd700',
                    fontSize: '0.9rem'
                  }}>
                    + {service.translations[locale as keyof typeof service.translations]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
