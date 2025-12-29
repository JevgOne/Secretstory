'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function AgeVerificationModal() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('disclaimer');

  useEffect(() => {
    // Check if user has already agreed in this session
    const hasAgreed = sessionStorage.getItem('age-verified');
    if (!hasAgreed) {
      setIsVisible(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';

      // Disable right-click
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);

      // Cleanup listeners when modal closes
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleAgree = () => {
    sessionStorage.setItem('age-verified', 'true');
    setIsVisible(false);
    document.body.style.overflow = 'unset';
  };

  const handleLeave = () => {
    window.location.href = 'https://www.google.com';
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

        <div className="age-verification-buttons">
          <button
            onClick={handleLeave}
            className="age-verification-button age-verification-button-leave"
          >
            {t('leave_button')}
          </button>
          <button
            onClick={handleAgree}
            className="age-verification-button age-verification-button-agree"
          >
            {t('agree_button')}
          </button>
        </div>
      </div>
    </div>
  );
}
