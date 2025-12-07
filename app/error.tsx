"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <html lang="cs">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1416 0%, #2d1a24 100%)',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            background: '#231a1e',
            padding: '48px 32px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '24px'
            }}>
              ⚠️
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#e8e8e8',
              marginBottom: '16px'
            }}>
              Něco se pokazilo
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#9a8a8e',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Omlouváme se, ale došlo k neočekávané chybě. Náš tým byl informován
              a pracujeme na řešení.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div style={{
                background: '#1a1416',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                textAlign: 'left',
                overflow: 'auto'
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#ec4899',
                  fontFamily: 'monospace',
                  margin: 0,
                  wordBreak: 'break-word'
                }}>
                  {error.message}
                </p>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => reset()}
                style={{
                  padding: '14px 28px',
                  background: 'var(--wine, #8b2942)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Zkusit znovu
              </button>
              <Link
                href="/"
                style={{
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#e8e8e8',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Zpět na hlavní stránku
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
