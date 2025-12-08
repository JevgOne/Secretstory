"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from 'next-intl';

interface BottomCTAProps {
  translations: {
    browse_girls: string;
    whatsapp: string;
    call: string;
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

  const handleCall = () => {
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    window.location.href = 'tel:+420734332131';
  };

  return (
    <>
      <div className={`bottom-cta ${isVisible ? 'visible' : 'hidden'}`}>
        <Link href={`/${locale}/divky`} className="bottom-cta-btn browse">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span className="bottom-cta-label">{translations.browse_girls}</span>
        </Link>

        <button onClick={handleCall} className="bottom-cta-btn call">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span className="bottom-cta-label">{translations.call}</span>
        </button>

        <button onClick={handleWhatsApp} className="bottom-cta-btn whatsapp">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="bottom-cta-label">{translations.whatsapp}</span>
        </button>
      </div>

      <style jsx>{`
        .bottom-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 90;
          display: none;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1px;
          background: rgba(26, 18, 22, 0.98);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: env(safe-area-inset-bottom, 0);
          transform: translateY(0);
          transition: transform 0.3s ease;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
        }

        .bottom-cta.hidden {
          transform: translateY(100%);
        }

        .bottom-cta.visible {
          transform: translateY(0);
        }

        .bottom-cta-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 0.75rem 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 60px;
          text-decoration: none;
        }

        .bottom-cta-btn:active {
          transform: scale(0.95);
        }

        .bottom-cta-btn svg {
          width: 24px;
          height: 24px;
        }

        .bottom-cta-label {
          font-size: 0.7rem;
          font-weight: 500;
          text-align: center;
        }

        .bottom-cta-btn.browse {
          color: var(--white);
        }

        .bottom-cta-btn.browse:active {
          background: rgba(255, 255, 255, 0.05);
        }

        .bottom-cta-btn.call {
          color: #3b82f6;
        }

        .bottom-cta-btn.call:active {
          background: rgba(59, 130, 246, 0.1);
        }

        .bottom-cta-btn.whatsapp {
          color: var(--green);
        }

        .bottom-cta-btn.whatsapp:active {
          background: rgba(34, 197, 94, 0.1);
        }

        /* Show only on mobile */
        @media (max-width: 768px) {
          .bottom-cta {
            display: grid;
          }

          /* Add bottom padding to body to prevent content from being hidden */
          :global(body) {
            padding-bottom: 60px;
          }
        }

        /* Support for iPhone notch */
        @supports (padding: env(safe-area-inset-bottom)) {
          .bottom-cta {
            padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
}
