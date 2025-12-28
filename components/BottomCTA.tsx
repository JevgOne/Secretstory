"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from 'next-intl';

interface BottomCTAProps {
  translations: {
    call: string;
    whatsapp: string;
    telegram: string;
    sms: string;
    branches: string;
    discounts: string;
    whatsapp_warning?: string;
    recommended?: string;
  };
}

export default function BottomCTA({ translations }: BottomCTAProps) {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show on scroll up, hide on scroll down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [lastScrollY]);

  const handleWhatsApp = () => {
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    window.open('https://wa.me/420734332131', '_blank');
  };

  const handleTelegram = () => {
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    window.open('https://t.me/+420734332131', '_blank');
  };

  const handleSMS = () => {
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    window.location.href = 'sms:+420734332131';
  };

  const handleCall = () => {
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    window.location.href = 'tel:+420734332131';
  };

  return (
    <>
      {/* Warning Banner */}
      {translations.whatsapp_warning && (
        <div className="whatsapp-warning-banner">
          <div className="warning-content">
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              <strong>{translations.whatsapp_warning}</strong>
              {translations.recommended && <span> • {translations.recommended}</span>}
            </div>
          </div>
        </div>
      )}

      <div className={`bottom-cta ${isVisible ? 'visible' : 'hidden'}`}>
        <button onClick={handleCall} className="bottom-cta-btn call">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span className="bottom-cta-label">{translations.call}</span>
        </button>

        <button onClick={handleTelegram} className="bottom-cta-btn telegram">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          <span className="bottom-cta-label">{translations.telegram}</span>
          <span className="recommended-badge">✓</span>
        </button>

        <button onClick={handleSMS} className="bottom-cta-btn sms">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="bottom-cta-label">{translations.sms}</span>
          <span className="recommended-badge">✓</span>
        </button>

        <button onClick={handleWhatsApp} className="bottom-cta-btn whatsapp disabled">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="bottom-cta-label">{translations.whatsapp}</span>
          <span className="warning-badge">⚠️</span>
        </button>
      </div>

      <style jsx>{`
        .whatsapp-warning-banner {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #000000;
          z-index: 97;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideDown 0.3s ease-out;
        }

        .warning-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 1rem;
        }

        .warning-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .warning-text {
          line-height: 1.4;
          text-align: center;
        }

        .warning-text strong {
          font-weight: 600;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .bottom-cta-btn.telegram {
          background: linear-gradient(135deg, #0088cc 0%, #229ED9 100%);
        }

        .bottom-cta-btn.sms {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .bottom-cta-btn.whatsapp.disabled {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          opacity: 0.6;
          position: relative;
        }

        .recommended-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #10b981;
          color: white;
          font-size: 10px;
          padding: 2px 4px;
          border-radius: 50%;
          font-weight: bold;
        }

        .warning-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #fbbf24;
          color: #1f2937;
          font-size: 10px;
          padding: 2px 4px;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .warning-content {
            padding: 10px 16px;
            font-size: 0.8125rem;
          }

          .warning-icon {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
}
