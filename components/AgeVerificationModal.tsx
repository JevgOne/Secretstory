'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('disclaimer');

  useEffect(() => {
    // Check if user has already agreed
    const hasAgreed = localStorage.getItem('age-verified');
    if (!hasAgreed) {
      setIsVisible(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);
    document.body.style.overflow = 'unset';
  };

  if (!isVisible) return null;

  return (
    <div className="age-verification-overlay">
      <div className="age-verification-modal">
        <h1 className="age-verification-title">{t('title')}</h1>

        <div className="age-verification-content">
          <p className="age-verification-intro">{t('intro')}</p>

          <div className="age-verification-terms">
            <ul>
              <li>{t('term_1')}</li>
              <li>{t('term_2')}</li>
              <li>{t('term_3')}</li>
              <li>{t('term_4')}</li>
              <li>{t('term_5')}</li>
            </ul>
          </div>

          <div className="age-verification-legal-notice">
            <p>{t('legal_notice')}</p>
          </div>
        </div>

        <button
          onClick={handleAgree}
          className="age-verification-button"
        >
          {t('agree_button')}
        </button>
      </div>
    </div>
  );
}
