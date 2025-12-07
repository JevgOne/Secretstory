import Link from "next/link";

export default function NotFound() {
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
            maxWidth: '600px',
            textAlign: 'center',
            background: '#231a1e',
            padding: '48px 32px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{
              fontSize: '6rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '24px',
              lineHeight: '1'
            }}>
              404
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#e8e8e8',
              marginBottom: '16px'
            }}>
              Stránka nenalezena
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#9a8a8e',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Omlouváme se, ale stránka kterou hledáte neexistuje nebo byla přesunuta.
              Zkontrolujte prosím URL adresu nebo se vraťte na hlavní stránku.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                href="/"
                style={{
                  padding: '14px 28px',
                  background: 'var(--wine, #8b2942)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.2s'
                }}
              >
                Zpět na hlavní stránku
              </Link>
              <Link
                href="/divky"
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
              >
                Prohlédnout dívky
              </Link>
            </div>

            <div style={{
              marginTop: '48px',
              padding: '24px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#e8e8e8',
                marginBottom: '12px'
              }}>
                Potřebujete pomoc?
              </h2>
              <p style={{
                fontSize: '0.9rem',
                color: '#9a8a8e',
                marginBottom: '16px'
              }}>
                Kontaktujte nás kdykoliv
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <a
                  href="tel:+420734332131"
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#e8e8e8',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  📞 +420 734 332 131
                </a>
                <a
                  href="https://wa.me/420734332131"
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(37, 211, 102, 0.1)',
                    color: '#25d366',
                    border: '1px solid rgba(37, 211, 102, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
