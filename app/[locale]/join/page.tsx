"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Cormorant, DM_Sans } from 'next/font/google';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
import { SERVICES, getBasicServices, getExtraServices } from '@/lib/services';

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant'
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans'
});

export default function JoinPage() {
  const locale = useLocale();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    bust: '',
    hair: '',
    eyes: '',
    tattoo: false,
    tattoo_description: '',
    piercing: false,
    email: '',
    phone: '',
    experience: 'beginner',
    languages: [] as string[],
    services: [] as string[],
    bio_cs: '',
    bio_en: ''
  });

  const basicServices = getBasicServices();
  const extraServices = getExtraServices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Always include basic services + selected extra services
      const allServices = [
        ...basicServices.map(s => s.id),
        ...formData.services
      ];

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          services: allServices,
          age: parseInt(formData.age),
          height: formData.height ? parseInt(formData.height) : null,
          weight: formData.weight ? parseInt(formData.weight) : null,
          bust: formData.bust ? parseInt(formData.bust) : null,
          hair: formData.hair,
          eyes: formData.eyes,
          tattoo: formData.tattoo,
          tattoo_description: formData.tattoo ? formData.tattoo_description : null,
          piercing: formData.piercing,
          waist: null,
          hips: null,
          telegram: null,
          availability: null
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Chyba při odesílání žádosti');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Chyba při odesílání žádosti');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLanguageToggle = (lang: string) => {
    if (formData.languages.includes(lang)) {
      setFormData({
        ...formData,
        languages: formData.languages.filter(l => l !== lang)
      });
    } else {
      setFormData({
        ...formData,
        languages: [...formData.languages, lang]
      });
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    if (formData.services.includes(serviceId)) {
      setFormData({
        ...formData,
        services: formData.services.filter(s => s !== serviceId)
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, serviceId]
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name && formData.age && parseInt(formData.age) >= 18;
    }
    if (currentStep === 2) {
      return formData.phone;
    }
    return true;
  };

  if (submitted) {
    return (
      <div className={`${cormorant.variable} ${dmSans.variable}`}>
        <MobileMenu currentPath={pathname} />

        <nav className="main-nav">
          <Link href={`/${locale}`} className="logo">
            <span className="logo-L">
              <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
                <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="1.5" r="1.5" fill="#fff"/>
                <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              L
            </span>
            {tCommon('brand_suffix')}
          </Link>
          <div className="nav-contact">
            <LanguageSwitcher />
          </div>
        </nav>

        <div className="success-page">
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {['🎉', '🎊', '✨', '💫', '⭐'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <h1>Děkujeme za tvůj zájem!</h1>
            <p>Tvoje žádost byla úspěšně odeslána. Brzy se ti ozveme na uvedený telefon nebo email.</p>
            <Link href={`/${locale}`} className="btn-home">
              Zpět na hlavní stránku
            </Link>
          </div>
        </div>

        <style jsx>{`
          .success-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: var(--bg-dark);
            position: relative;
            overflow: hidden;
          }

          .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .confetti {
            position: absolute;
            top: -10%;
            font-size: 2rem;
            animation: fall linear infinite;
            opacity: 0;
          }

          @keyframes fall {
            0% {
              opacity: 1;
              transform: translateY(0) rotate(0deg);
            }
            100% {
              opacity: 0;
              transform: translateY(100vh) rotate(360deg);
            }
          }

          .success-content {
            text-align: center;
            max-width: 600px;
            position: relative;
            z-index: 2;
          }

          .success-icon {
            font-size: 5rem;
            margin-bottom: 2rem;
            animation: bounce 1s ease infinite;
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          h1 {
            font-family: var(--font-cormorant);
            font-size: 3rem;
            font-weight: 400;
            color: var(--white);
            margin-bottom: 1.5rem;
            font-style: italic;
          }

          p {
            font-family: var(--font-dm-sans);
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.8;
            margin-bottom: 3rem;
          }

          .btn-home {
            display: inline-block;
            padding: 16px 40px;
            background: var(--wine);
            color: var(--white);
            text-decoration: none;
            border-radius: 50px;
            font-family: var(--font-dm-sans);
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 1rem;
          }

          .btn-home:hover {
            background: var(--wine-hover);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(180, 39, 77, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`}>
      <MobileMenu currentPath={pathname} />

      <nav className="main-nav">
        <Link href={`/${locale}`} className="logo">
          <span className="logo-L">
            <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
              <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="1.5" r="1.5" fill="#fff"/>
              <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            L
          </span>
          {tCommon('brand_suffix')}
        </Link>
        <div className="nav-contact">
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="join-page">
        <div className="join-container">
          <div className="join-header">
            <h1>Staň se součástí LovelyGirls</h1>
            <p className="subtitle">Vyplň jednoduchý formulář a my se ti brzy ozveme</p>
          </div>

          {/* Progress bar */}
          <div className="progress-container">
            <div className="progress-bar">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                >
                  <div className="progress-circle">
                    {currentStep > step ? '✓' : step}
                  </div>
                  <div className="progress-label">
                    {step === 1 && 'Základní info'}
                    {step === 2 && 'Kontakt'}
                    {step === 3 && 'Profesní údaje'}
                    {step === 4 && 'O tobě'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="join-form">
            {error && (
              <div className="error-alert">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="form-step">
                <h2 className="step-title">Základní údaje</h2>

                <div className="form-group">
                  <label>👤 Jméno / Přezdívka *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jak ti máme říkat?"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>🎂 Věk *</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      min="18"
                      max="99"
                      placeholder="18+"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>📏 Výška (cm) *</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="165"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>⚖️ Váha (kg) *</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="55"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>💕 Poprsí *</label>
                  <input
                    type="number"
                    value={formData.bust}
                    onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                    placeholder="1-4 (1=A, 2=B, 3=C, 4=D+)"
                    min="1"
                    max="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>💇‍♀️ Barva vlasů</label>
                    <select
                      value={formData.hair}
                      onChange={(e) => setFormData({ ...formData, hair: e.target.value })}
                    >
                      <option value="">Vyber barvu</option>
                      <option value="blonde">🌟 Blond</option>
                      <option value="brown">🤎 Hnědá</option>
                      <option value="black">🖤 Černá</option>
                      <option value="red">🦊 Zrzavá</option>
                      <option value="other">🌈 Jiná</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>👁️ Barva očí</label>
                    <select
                      value={formData.eyes}
                      onChange={(e) => setFormData({ ...formData, eyes: e.target.value })}
                    >
                      <option value="">Vyber barvu</option>
                      <option value="blue">💙 Modré</option>
                      <option value="green">💚 Zelené</option>
                      <option value="brown">🤎 Hnědé</option>
                      <option value="gray">🩶 Šedé</option>
                      <option value="hazel">🌰 Oříškové</option>
                    </select>
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.tattoo}
                      onChange={(e) => setFormData({ ...formData, tattoo: e.target.checked })}
                    />
                    <span className="checkbox-mark"></span>
                    <span className="checkbox-text">💉 Mám tetování</span>
                  </label>

                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.piercing}
                      onChange={(e) => setFormData({ ...formData, piercing: e.target.checked })}
                    />
                    <span className="checkbox-mark"></span>
                    <span className="checkbox-text">✨ Mám piercing</span>
                  </label>
                </div>

                {formData.tattoo && (
                  <div className="form-group tattoo-details">
                    <label>💉 Kde máš tetování? *</label>
                    <textarea
                      value={formData.tattoo_description}
                      onChange={(e) => setFormData({ ...formData, tattoo_description: e.target.value })}
                      placeholder="Např. malý motýlek na zápěstí..."
                      rows={3}
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Contact */}
            {currentStep === 2 && (
              <div className="form-step">
                <h2 className="step-title">Kontaktní údaje</h2>

                <div className="form-group">
                  <label>Telefon *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+420 123 456 789"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tvuj@email.cz"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Professional */}
            {currentStep === 3 && (
              <div className="form-step">
                <h2 className="step-title">Profesní informace</h2>

                <div className="form-group">
                  <label>Zkušenosti</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  >
                    <option value="beginner">Začátečnice - nemám zkušenosti</option>
                    <option value="intermediate">Mírně pokročilá - pár měsíců</option>
                    <option value="experienced">Zkušená - více než rok</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Jazyky (vyber všechny, které ovládáš)</label>
                  <div className="checkbox-grid">
                    {['Čeština', 'English', 'Deutsch', 'Українська', 'Русский', 'Slovenčina'].map(lang => (
                      <label key={lang} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(lang)}
                          onChange={() => handleLanguageToggle(lang)}
                        />
                        <span>{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Základní služby (vždy zahrnuté v ceně)</label>
                  <div className="services-list">
                    {basicServices.map(service => (
                      <div key={service.id} className="service-item-fixed">
                        <span>✓</span>
                        <span>{service.translations.cs}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Extra služby (které chceš nabízet?)</label>
                  <div className="checkbox-grid">
                    {extraServices.map(service => (
                      <label key={service.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                        />
                        <span>{service.translations.cs}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Bio */}
            {currentStep === 4 && (
              <div className="form-step">
                <h2 className="step-title">O tobě</h2>

                <div className="form-group">
                  <label>Popis (česky) *</label>
                  <textarea
                    value={formData.bio_cs}
                    onChange={(e) => setFormData({ ...formData, bio_cs: e.target.value })}
                    rows={5}
                    placeholder="Napiš něco o sobě, co by měli klienti vědět..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Popis (anglicky) - nepovinné</label>
                  <textarea
                    value={formData.bio_en}
                    onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                    rows={5}
                    placeholder="Write something about yourself..."
                  />
                </div>

                <p className="info-note">
                  * Fotky nahraješ později po schválení žádosti
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  ← Zpět
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="btn-primary"
                >
                  Další →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-submit"
                >
                  {submitting ? 'Odesílám...' : '✨ Odeslat žádost'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .join-page {
          min-height: 100vh;
          background: var(--bg-dark);
          padding: 2rem 1rem;
        }

        .join-container {
          max-width: 800px;
          margin: 0 auto;
          padding-top: 2rem;
        }

        .join-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        h1 {
          font-family: var(--font-cormorant);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 400;
          font-style: italic;
          color: var(--white);
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .subtitle {
          font-family: var(--font-dm-sans);
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 300;
        }

        .progress-container {
          margin-bottom: 3rem;
        }

        .progress-bar {
          display: flex;
          justify-content: space-between;
          position: relative;
        }

        .progress-bar::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 0;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
          flex: 1;
        }

        .progress-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-dm-sans);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
        }

        .progress-step.active .progress-circle {
          background: var(--wine);
          border-color: var(--wine);
          color: var(--white);
        }

        .progress-step.completed .progress-circle {
          background: rgba(180, 39, 77, 0.3);
          border-color: var(--wine);
          color: var(--wine);
        }

        .progress-label {
          font-family: var(--font-dm-sans);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
        }

        .progress-step.active .progress-label {
          color: var(--white);
          font-weight: 500;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .error-alert span {
          font-size: 1.5rem;
        }

        .error-alert p {
          font-family: var(--font-dm-sans);
          color: #ef4444;
          margin: 0;
        }

        .join-form {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 3rem 2.5rem;
          backdrop-filter: blur(10px);
        }

        .form-step {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .step-title {
          font-family: var(--font-cormorant);
          font-size: 2rem;
          font-weight: 500;
          font-style: italic;
          color: var(--white);
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.25rem;
        }

        .form-group {
          margin-bottom: 1.75rem;
        }

        label {
          display: block;
          font-family: var(--font-dm-sans);
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        input,
        select,
        textarea {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--white);
          font-family: var(--font-dm-sans);
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: var(--wine);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 4px rgba(180, 39, 77, 0.1);
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .services-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .service-item-fixed {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(180, 39, 77, 0.1);
          border: 1px solid rgba(180, 39, 77, 0.2);
          border-radius: 10px;
          font-family: var(--font-dm-sans);
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .service-item-fixed span:first-child {
          color: var(--wine);
          font-weight: 600;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-dm-sans);
        }

        .checkbox-label:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          accent-color: var(--wine);
        }

        .checkbox-label span {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        /* Custom Checkboxes */
        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.75rem;
        }

        .custom-checkbox {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border: 2px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: var(--font-dm-sans);
        }

        .custom-checkbox:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .custom-checkbox input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkbox-mark {
          position: relative;
          height: 24px;
          width: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }

        .checkbox-mark::after {
          content: '';
          position: absolute;
          display: none;
          left: 7px;
          top: 3px;
          width: 6px;
          height: 11px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .custom-checkbox input:checked ~ .checkbox-mark {
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          border-color: #d4af37;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }

        .custom-checkbox input:checked ~ .checkbox-mark::after {
          display: block;
        }

        .custom-checkbox input:checked ~ .checkbox-text {
          color: #d4af37;
          font-weight: 600;
        }

        .checkbox-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .tattoo-details {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .info-note {
          font-family: var(--font-dm-sans);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
          margin-top: 1.5rem;
          text-align: center;
        }

        .form-navigation {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .btn-secondary,
        .btn-primary,
        .btn-submit {
          padding: 14px 32px;
          border-radius: 50px;
          font-family: var(--font-dm-sans);
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(-4px);
        }

        .btn-primary {
          background: var(--wine);
          color: var(--white);
          margin-left: auto;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--wine-hover);
          transform: translateX(4px);
          box-shadow: 0 10px 30px rgba(180, 39, 77, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-submit {
          background: var(--wine);
          color: var(--white);
          width: 100%;
          font-size: 1.1rem;
        }

        .btn-submit:hover:not(:disabled) {
          background: var(--wine-hover);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(180, 39, 77, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .join-form {
            padding: 2rem 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .checkbox-grid,
          .services-list {
            grid-template-columns: repeat(2, 1fr);
          }

          .progress-label {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}
