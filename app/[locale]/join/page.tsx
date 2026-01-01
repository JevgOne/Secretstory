"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Cormorant, DM_Sans } from 'next/font/google';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

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
    waist: '',
    hips: '',
    email: '',
    phone: '',
    telegram: '',
    experience: 'beginner',
    languages: [] as string[],
    availability: [] as string[],
    bio_cs: '',
    bio_en: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          height: formData.height ? parseInt(formData.height) : null,
          weight: formData.weight ? parseInt(formData.weight) : null,
          bust: formData.bust ? parseInt(formData.bust) : null,
          waist: formData.waist ? parseInt(formData.waist) : null,
          hips: formData.hips ? parseInt(formData.hips) : null
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

  const handleAvailabilityToggle = (day: string) => {
    if (formData.availability.includes(day)) {
      setFormData({
        ...formData,
        availability: formData.availability.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        availability: [...formData.availability, day]
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
          <div className="success-content">
            <div className="success-icon">✨</div>
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
          }

          .success-content {
            text-align: center;
            max-width: 600px;
          }

          .success-icon {
            font-size: 5rem;
            margin-bottom: 2rem;
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

          {error && (
            <div className="error-alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="join-form">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="form-step">
                <h2 className="step-title">Základní údaje</h2>

                <div className="form-group">
                  <label>Jméno / Přezdívka *</label>
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
                    <label>Věk *</label>
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
                    <label>Výška (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="165"
                    />
                  </div>

                  <div className="form-group">
                    <label>Váha (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="55"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Poprsí (cm)</label>
                    <input
                      type="number"
                      value={formData.bust}
                      onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                      placeholder="90"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pas (cm)</label>
                    <input
                      type="number"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      placeholder="60"
                    />
                  </div>

                  <div className="form-group">
                    <label>Boky (cm)</label>
                    <input
                      type="number"
                      value={formData.hips}
                      onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                      placeholder="90"
                    />
                  </div>
                </div>
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
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tvuj@email.cz"
                  />
                </div>

                <div className="form-group">
                  <label>Telegram</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    placeholder="@username"
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
                  <label>Dostupnost (kdy můžeš pracovat?)</label>
                  <div className="checkbox-grid">
                    {['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'].map(day => (
                      <label key={day} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.availability.includes(day)}
                          onChange={() => handleAvailabilityToggle(day)}
                        />
                        <span>{day}</span>
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
                  <label>Popis (česky)</label>
                  <textarea
                    value={formData.bio_cs}
                    onChange={(e) => setFormData({ ...formData, bio_cs: e.target.value })}
                    rows={5}
                    placeholder="Napiš něco o sobě, co by měli klienti vědět..."
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

          .checkbox-grid {
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
