"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

export default function TermsPage() {
  const t = useTranslations();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <>
      {/* Navigation */}
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
          ovely Girls
        </Link>
        <div className="nav-links">
          <Link href={`/${locale}`}>{t('nav.home')}</Link>
          <Link href={`/${locale}/divky`}>{t('nav.girls')}</Link>
          <Link href={`/${locale}/cenik`}>{t('nav.pricing')}</Link>
          <Link href={`/${locale}/schedule`}>{t('nav.schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{t('nav.discounts')}</Link>
          <Link href={`/${locale}/faq`}>{t('nav.faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="https://t.me/+420734332131" className="btn">{t('nav.telegram')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{t('nav.whatsapp')}</a>
        </div>
        <MobileMenu currentPath={pathname} />
      </nav>

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">Obchodní podmínky</h1>
        <p className="page-subtitle">Podmínky používání služeb LovelyGirls Prague</p>
      </section>

      {/* Terms Content */}
      <section className="legal-content">
        <div className="legal-container">

          <div className="legal-section">
            <h2>1. Úvodní ustanovení</h2>
            <p>
              Tyto obchodní podmínky upravují vztah mezi provozovatelem služeb LovelyGirls Prague
              (dále jen "provozovatel") a klientem využívajícím našich služeb. Využitím našich služeb
              vyjadřujete souhlas s těmito podmínkami.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Věkové omezení</h2>
            <p>
              Naše služby jsou určeny výhradně pro osoby starší 18 let. Vstupem na webové stránky
              a využitím našich služeb potvrzujete, že jste dosáhli věku 18 let.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Rezervace a objednávky</h2>
            <ul>
              <li>Rezervace lze provést telefonicky, přes WhatsApp nebo Telegram</li>
              <li>Rezervace je závazná po obdržení potvrzení od provozovatele</li>
              <li>Doporučujeme rezervovat minimálně 1-2 hodiny předem</li>
              <li>V případě zpoždění informujte provozovatele co nejdříve</li>
              <li>Při zpoždění delším než 15 minut může být rezervace zrušena</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Platební podmínky</h2>
            <ul>
              <li>Platba je splatná vždy na začátku návštěvy</li>
              <li>Přijímáme hotovost a platební karty (Visa, Mastercard)</li>
              <li>Ceny jsou uvedeny včetně DPH</li>
              <li>Na požádání vystavíme účtenku s neutrálním popisem služby</li>
              <li>Případné příplatky za extra služby jsou splatné ihned</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Storno podmínky</h2>
            <ul>
              <li>Rezervaci lze zrušit bez poplatku nejpozději 2 hodiny před termínem</li>
              <li>Při pozdějším zrušení může být účtován storno poplatek</li>
              <li>V případě nedostavení se bez omluvy může být účtován storno poplatek ve výši 50% ceny služby</li>
              <li>Provozovatel si vyhrazuje právo zrušit rezervaci z provozních důvodů</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Pravidla chování</h2>
            <ul>
              <li>Očekáváme slušné a respektující chování vůči personálu</li>
              <li>Je zakázáno být pod vlivem alkoholu nebo jiných omamných látek</li>
              <li>Dodržujte hygienické standardy - používejte sprchu před službou</li>
              <li>Respektujte osobní hranice našich zaměstnankyň</li>
              <li>Jakékoliv agresivní chování bude důvodem k okamžitému ukončení služby bez náhrady</li>
              <li>Je zakázáno fotografovat nebo nahrávat audio/video bez souhlasu</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Diskrétnost</h2>
            <p>
              Provozovatel se zavazuje zachovávat naprostou diskrétnost ohledně identity klientů.
              Nevedeme žádnou evidenci osobních údajů kromě nezbytných pro komunikaci a rezervaci.
              Stejnou diskrétnost očekáváme od klientů vůči našim zaměstnankyním.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Odpovědnost</h2>
            <ul>
              <li>Provozovatel neodpovídá za ztrátu nebo poškození osobních věcí klienta</li>
              <li>Klient je zodpovědný za jakékoliv škody způsobené na majetku provozovatele</li>
              <li>Provozovatel si vyhrazuje právo odmítnout službu bez udání důvodu</li>
              <li>Služby jsou poskytovány výhradně v rámci platných zákonů České republiky</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Reklamace</h2>
            <p>
              V případě nespokojenosti se službou kontaktujte provozovatele do 24 hodin od poskytnutí služby.
              Reklamace řešíme individuálně s cílem dosáhnout oboustranně přijatelného řešení.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Závěrečná ustanovení</h2>
            <ul>
              <li>Provozovatel si vyhrazuje právo změnit tyto podmínky kdykoli</li>
              <li>Aktuální verze podmínek je vždy dostupná na webových stránkách</li>
              <li>Vztahy neupravené těmito podmínkami se řídí právním řádem České republiky</li>
              <li>Tyto podmínky nabývají účinnosti dnem 1. 1. 2025</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>11. Kontakt</h2>
            <p>
              <strong>Provozovatel:</strong> LovelyGirls Prague<br/>
              <strong>Email:</strong> info@lovelygirls.cz<br/>
              <strong>Telegram/WhatsApp:</strong> Dostupné přes tlačítka na webu<br/>
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand-section">
              <Link href={`/${locale}`} className="footer-logo">
                <span className="logo-L">
                  <svg className="santa-hat" viewBox="0 0 16 14" fill="none">
                    <path d="M2 12C4 11 6 7 9 5C8 3 9 1.5 10 1" stroke="#c41e3a" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="10" cy="1.5" r="1.5" fill="#fff"/>
                    <path d="M1 12C3 11.5 6 11 9 11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  L
                </span>
                ovely Girls
              </Link>
              <p className="footer-tagline">Prague Premium Escort</p>
              <p className="footer-desc">{t('footer.about_text')}</p>
            </div>

            <div className="footer-links-grid">
              {/* Services */}
              <div className="footer-links-col">
                <h4 className="footer-links-title">Služby</h4>
                <nav className="footer-links">
                  <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
                  <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
                  <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
                  <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
                  <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
                  <Link href={`/${locale}/blog`}>{t('footer.blog')}</Link>
                </nav>
              </div>

              {/* Contact */}
              <div className="footer-links-col">
                <h4 className="footer-links-title">{t('footer.contact')}</h4>
                <div className="footer-contact-info">
                  <div className="footer-contact-item">
                    <span className="label">{t('footer.hours')}</span>
                    <span className="value">{t('footer.hours_value')}</span>
                  </div>
                  <div className="footer-contact-item">
                    <span className="label">{t('footer.location')}</span>
                    <span className="value">{t('footer.location_value')}</span>
                  </div>
                </div>
                <div className="footer-contact-actions">
                  <a href="tel:+420734332131" className="footer-contact-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    Zavolat
                  </a>
                  <a href="https://wa.me/420734332131?text=Ahoj%2C%20m%C3%A1te%20dneska%20voln%C3%BD%20term%C3%ADn%3F" className="footer-contact-btn whatsapp">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>{t('footer.copyright')}</span>
              <span className="dot">•</span>
              <span>{tCommon('adults_only')}</span>
            </div>
            <div className="footer-bottom-right">
              <Link href={`/${locale}/podminky`}>{t('footer.terms')}</Link>
              <Link href={`/${locale}/soukromi`}>{t('footer.privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
