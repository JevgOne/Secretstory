"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { useLocations } from '@/lib/hooks/useLocations';
import { toast } from 'sonner';
import { getBasicServices, getExtraServices, getServiceName } from '@/lib/services';

export default function SecretRegistrationPage() {
  const { primaryLocation } = useLocations();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Osobní údaje
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Profil
    age: '',
    height: '',
    weight: '',
    bust: '',
    waist: '',
    hips: '',

    // Tetování & Piercing
    tattoo_percentage: 0,
    tattoo_description: '',
    piercing: false,
    piercing_description: '',
    languages: [] as string[],
    services: [] as string[],

    // Pracovní údaje
    bio: '',
    location: primaryLocation?.display_name || 'Praha',
    availableDays: [] as string[],

    // Souhlas
    agreeTerms: false,
    agreePrivacy: false
  });

  const handleSubmit = async () => {
    // Validace hesla
    if (formData.password.length < 8) {
      toast.error('Heslo musí mít alespoň 8 znaků');
      return;
    }

    if (!/\d/.test(formData.password)) {
      toast.error('Heslo musí obsahovat alespoň jednu číslici');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Hesla se neshodují!');
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toast.error('Musíte souhlasit s podmínkami!');
      return;
    }

    // Připravit data s automaticky zahrnutými základními službami
    const basicServiceIds = getBasicServices().map(s => s.id);
    const allServices = [...new Set([...basicServiceIds, ...formData.services])];
    const submissionData = {
      ...formData,
      services: allServices
    };

    // Odeslat na API
    try {
      const response = await fetch('/api/register/girl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        toast.success('Registrace úspěšná! Váš profil čeká na schválení administrátorem.');
        setTimeout(() => router.push('/admin/login'), 1500);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Registrace se nezdařila');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Chyba při registraci. Zkuste to prosím znovu.');
    }
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  // Get services from centralized config
  const basicServices = getBasicServices();
  const extraServices = getExtraServices();
  const basicServiceIds = basicServices.map(s => s.id);

  const toggleService = (serviceId: string) => {
    // Cannot toggle basic services (mandatory)
    if (basicServiceIds.includes(serviceId)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1416 0%, #2d1a24 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            Registrace nové slečny
          </div>
          <div style={{ fontSize: '0.9rem', color: '#9a8a8e' }}>
            LovelyGirls.cz • Krok {step} z 3
          </div>
        </div>

        {/* PROGRESS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px'
        }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: i <= step ? 'var(--wine)' : 'rgba(255,255,255,0.1)',
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>

        {/* STEP 1: Osobní údaje */}
        {step === 1 && (
          <div style={{
            background: '#231a1e',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '24px' }}>
              👤 Osobní údaje
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Jméno / Umělecké jméno *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Např. Katy"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1416',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tvuj@email.cz"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1416',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Telefon *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+420 XXX XXX XXX"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1416',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Heslo *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimálně 8 znaků"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1416',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Potvrzení hesla *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Zadejte heslo znovu"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1416',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.name || !formData.email || !formData.phone || !formData.password}
              style={{
                width: '100%',
                padding: '16px',
                background: 'var(--wine)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: formData.name && formData.email && formData.phone && formData.password ? 'pointer' : 'not-allowed',
                opacity: formData.name && formData.email && formData.phone && formData.password ? 1 : 0.5
              }}
            >
              Pokračovat →
            </button>
          </div>
        )}

        {/* STEP 2: Profil */}
        {step === 2 && (
          <div style={{
            background: '#231a1e',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '24px' }}>
              📝 Profilové údaje
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#9a8a8e',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Věk *
                </label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="21"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1416',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#9a8a8e',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Výška (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="170"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1416',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#9a8a8e',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Prsa
                </label>
                <input
                  type="text"
                  value={formData.bust}
                  onChange={(e) => setFormData({ ...formData, bust: e.target.value })}
                  placeholder="90"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1416',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#9a8a8e',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Pas
                </label>
                <input
                  type="text"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  placeholder="60"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1416',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#9a8a8e',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Boky
                </label>
                <input
                  type="text"
                  value={formData.hips}
                  onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                  placeholder="90"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1416',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#e8e8e8',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                O mně
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Napiš něco o sobě..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#1a1416',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Languages */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Jazyky *
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {[
                  { code: 'cs', label: 'Čeština' },
                  { code: 'en', label: 'English' },
                  { code: 'de', label: 'Deutsch' },
                  { code: 'uk', label: 'Українська' },
                  { code: 'ru', label: 'Русский' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => toggleLanguage(lang.code)}
                    style={{
                      padding: '10px 18px',
                      background: formData.languages.includes(lang.code) ? 'var(--wine)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${formData.languages.includes(lang.code) ? 'var(--wine)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '8px',
                      color: formData.languages.includes(lang.code) ? 'white' : '#e8e8e8',
                      fontSize: '0.9rem',
                      fontWeight: formData.languages.includes(lang.code) ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Services */}
            <div style={{ marginBottom: '24px' }}>

              {/* Basic Services (Mandatory) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#22c55e',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '600'
                }}>
                  ✓ Základní služby (vždy zahrnuty v ceně)
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px',
                  padding: '12px',
                  background: 'rgba(34, 197, 94, 0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  {basicServices.map(service => (
                    <label
                      key={service.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '8px',
                        opacity: 0.7,
                        fontSize: '0.85rem'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={true}
                        disabled={true}
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#22c55e'
                        }}
                      />
                      <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>
                        {service.translations[locale as 'cs' | 'en' | 'de' | 'uk'] || service.translations.cs}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Extra Services (Optional) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  color: '#ec4899',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '600'
                }}>
                  + Extra služby (za příplatek)
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {extraServices.map(service => (
                    <label
                      key={service.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        background: formData.services.includes(service.id) ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${formData.services.includes(service.id) ? 'var(--wine)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.85rem'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: 'var(--wine)'
                        }}
                      />
                      <span style={{ color: '#e8e8e8', fontSize: '0.9rem' }}>
                        {service.translations[locale as 'cs' | 'en' | 'de' | 'uk'] || service.translations.cs}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9a8a8e', marginTop: '8px' }}>
                  {formData.services.length} extra {formData.services.length === 1 ? 'služba' : formData.services.length < 5 ? 'služby' : 'služeb'} vybráno
                </div>
              </div>
            </div>

            {/* Tattoo */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Tetování (% těla)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.tattoo_percentage}
                onChange={(e) => setFormData({ ...formData, tattoo_percentage: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  marginBottom: '8px'
                }}
              />
              <div style={{ fontSize: '1.1rem', color: '#ec4899', fontWeight: '600', marginBottom: '12px' }}>
                {formData.tattoo_percentage}%
              </div>
              {formData.tattoo_percentage > 0 && (
                <textarea
                  value={formData.tattoo_description}
                  onChange={(e) => setFormData({ ...formData, tattoo_description: e.target.value })}
                  placeholder="Popis tetování (např. 'Rukou rukáv s květy, malé tetování na kotníku')"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#1a1416',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#e8e8e8',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              )}
            </div>

            {/* Piercing */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                padding: '16px',
                background: formData.piercing ? 'rgba(236, 72, 153, 0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${formData.piercing ? 'var(--wine)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '10px',
                transition: 'all 0.2s'
              }}>
                <input
                  type="checkbox"
                  checked={formData.piercing}
                  onChange={(e) => setFormData({ ...formData, piercing: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{
                  fontSize: '0.95rem',
                  color: '#e8e8e8',
                  fontWeight: '500'
                }}>
                  Mám piercing
                </span>
              </label>
              {formData.piercing && (
                <textarea
                  value={formData.piercing_description}
                  onChange={(e) => setFormData({ ...formData, piercing_description: e.target.value })}
                  placeholder="Popis piercingu (např. 'Nos, pupík, jazyk')"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#1a1416',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#e8e8e8',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    marginTop: '12px'
                  }}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Zpět
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.age}
                style={{
                  flex: 2,
                  padding: '16px',
                  background: 'var(--wine)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: formData.age ? 'pointer' : 'not-allowed',
                  opacity: formData.age ? 1 : 0.5
                }}
              >
                Pokračovat →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Dostupnost & Souhlas */}
        {step === 3 && (
          <div style={{
            background: '#231a1e',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '24px' }}>
              ✅ Dokončení registrace
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#9a8a8e',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Dostupné dny
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'].map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '100px',
                      border: formData.availableDays.includes(day) ? '2px solid var(--wine)' : '1px solid rgba(255,255,255,0.1)',
                      background: formData.availableDays.includes(day) ? 'rgba(139, 41, 66, 0.15)' : '#1a1416',
                      color: formData.availableDays.includes(day) ? 'var(--wine)' : '#e8e8e8',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: 'var(--wine)',
                    marginTop: '2px'
                  }}
                />
                <label htmlFor="terms" style={{ fontSize: '0.9rem', lineHeight: '1.5', cursor: 'pointer' }}>
                  Souhlasím s <strong>obchodními podmínkami</strong> a zavazuji se dodržovat pravidla LovelyGirls.cz
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <input
                  type="checkbox"
                  id="privacy"
                  checked={formData.agreePrivacy}
                  onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: 'var(--wine)',
                    marginTop: '2px'
                  }}
                />
                <label htmlFor="privacy" style={{ fontSize: '0.9rem', lineHeight: '1.5', cursor: 'pointer' }}>
                  Souhlasím se <strong>zpracováním osobních údajů</strong> podle GDPR
                </label>
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              color: '#9a8a8e'
            }}>
              ℹ️ Po odeslání registrace bude váš profil <strong style={{ color: '#3b82f6' }}>čekat na schválení administrátorem</strong>. Oznamíme vám emailem, jakmile bude profil aktivován.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e8e8e8',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Zpět
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.agreeTerms || !formData.agreePrivacy}
                style={{
                  flex: 2,
                  padding: '16px',
                  background: 'var(--wine)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: formData.agreeTerms && formData.agreePrivacy ? 'pointer' : 'not-allowed',
                  opacity: formData.agreeTerms && formData.agreePrivacy ? 1 : 0.5,
                  boxShadow: formData.agreeTerms && formData.agreePrivacy ? '0 4px 12px rgba(139, 41, 66, 0.4)' : 'none'
                }}
              >
                🎉 Dokončit registraci
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
