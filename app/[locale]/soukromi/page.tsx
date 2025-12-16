"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

export default function PrivacyPage() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <>
      {/* Mobile Menu - outside nav for proper z-index */}
      <MobileMenu currentPath={pathname} />

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
          <Link href={`/${locale}`}>{tNav('home')}</Link>
          <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
          <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
          <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
          <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
          <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
        </div>
        <div className="nav-contact">
          <LanguageSwitcher />
          <a href="https://t.me/+420734332131" className="btn">{tNav('telegram')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{tNav('whatsapp')}</a>
        </div>
      </nav>

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">Ochrana osobních údajů</h1>
        <p className="page-subtitle">Zásady zpracování osobních údajů dle GDPR</p>
      </section>

      {/* Privacy Content */}
      <section className="legal-content">
        <div className="legal-container">

          <div className="legal-section">
            <h2>1. Správce osobních údajů</h2>
            <p>
              <strong>Provozovatel:</strong> LovelyGirls Prague<br/>
              <strong>Kontaktní email:</strong> info@lovelygirls.cz<br/>
              <strong>Telegram/WhatsApp:</strong> Dostupné přes tlačítka na webu
            </p>
            <p>
              Tento dokument popisuje, jak zpracováváme vaše osobní údaje v souladu s Nařízením Evropského
              parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob (GDPR).
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Jaké osobní údaje zpracováváme</h2>
            <p>V rámci poskytování našich služeb můžeme zpracovávat tyto osobní údaje:</p>
            <ul>
              <li><strong>Kontaktní údaje:</strong> jméno, telefonní číslo, email (pouze pokud je poskytnut)</li>
              <li><strong>Rezervační údaje:</strong> datum a čas návštěvy, preference služeb</li>
              <li><strong>Platební údaje:</strong> způsob platby (bez ukládání citlivých bankovních informací)</li>
              <li><strong>Technické údaje:</strong> IP adresa, informace o zařízení a prohlížeči (cookies)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Účel zpracování osobních údajů</h2>
            <p>Vaše osobní údaje zpracováváme za následujícími účely:</p>
            <ul>
              <li>Realizace rezervace a poskytnutí služeb</li>
              <li>Komunikace ohledně vaší rezervace</li>
              <li>Vyřízení platby za poskytnuté služby</li>
              <li>Zlepšení našich služeb a uživatelské zkušenosti</li>
              <li>Splnění zákonných povinností (účetnictví, daňové evidence)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Právní základ zpracování</h2>
            <p>Osobní údaje zpracováváme na základě:</p>
            <ul>
              <li><strong>Plnění smlouvy:</strong> zpracování nezbytné pro poskytnutí služeb</li>
              <li><strong>Oprávněný zájem:</strong> zlepšování kvality služeb, komunikace s klienty</li>
              <li><strong>Zákonná povinnost:</strong> účetnictví, archivace dokladů dle zákonných lhůt</li>
              <li><strong>Souhlas:</strong> marketingová komunikace (pouze se souhlasem)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Doba uchování osobních údajů</h2>
            <ul>
              <li><strong>Rezervační údaje:</strong> 30 dní po poskytnutí služby (pokud není jiný důvod)</li>
              <li><strong>Účetní doklady:</strong> 10 let (dle zákona o účetnictví)</li>
              <li><strong>Marketingová komunikace:</strong> do odvolání souhlasu</li>
              <li><strong>Cookies a technické údaje:</strong> maximálně 12 měsíců</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>6. Předávání osobních údajů třetím stranám</h2>
            <p>
              Vaše osobní údaje nepředáváme třetím stranám kromě případů, kdy je to nezbytné
              pro poskytnutí služeb nebo vyžadováno zákonem:
            </p>
            <ul>
              <li><strong>Platební brána:</strong> při platbě kartou (pouze nezbytné údaje)</li>
              <li><strong>Účetní služby:</strong> zpracování účetnictví (na základě smlouvy o mlčenlivosti)</li>
              <li><strong>Státní orgány:</strong> pouze na základě právního podkladu (soudy, finanční úřad)</li>
            </ul>
            <p>
              S těmito subjekty máme uzavřeny smlouvy o zpracování osobních údajů a zajišťujeme,
              aby dodržovaly stejné standardy ochrany jako my.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Vaše práva (dle GDPR)</h2>
            <p>Máte následující práva ohledně vašich osobních údajů:</p>
            <ul>
              <li><strong>Právo na přístup:</strong> informace o zpracovávaných údajích</li>
              <li><strong>Právo na opravu:</strong> oprava nesprávných nebo neúplných údajů</li>
              <li><strong>Právo na výmaz:</strong> "právo být zapomenut" (za určitých podmínek)</li>
              <li><strong>Právo na omezení zpracování:</strong> dočasné omezení zpracování</li>
              <li><strong>Právo na přenositelnost:</strong> přenos údajů k jinému správci</li>
              <li><strong>Právo vznést námitku:</strong> proti zpracování z oprávněného zájmu</li>
              <li><strong>Právo odvolat souhlas:</strong> kdykoli bez vlivu na zákonnost předchozího zpracování</li>
            </ul>
            <p>
              Pro uplatnění vašich práv nás kontaktujte na <strong>info@lovelygirls.cz</strong>.
              Odpovíme do 30 dnů.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Zabezpečení osobních údajů</h2>
            <p>Vaše osobní údaje chráníme pomocí technických a organizačních opatření:</p>
            <ul>
              <li>Šifrované připojení (HTTPS/SSL)</li>
              <li>Bezpečné úložiště dat s omezeným přístupem</li>
              <li>Pravidelné bezpečnostní audity</li>
              <li>Školení zaměstnanců v oblasti ochrany osobních údajů</li>
              <li>Anonymizace dat tam, kde je to možné</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Cookies</h2>
            <p>
              Naše webové stránky používají cookies pro zajištění funkcionalit a analýzu návštěvnosti:
            </p>
            <ul>
              <li><strong>Nezbytné cookies:</strong> zajišťují základní funkce webu</li>
              <li><strong>Analytické cookies:</strong> statistiky návštěvnosti (Google Analytics)</li>
              <li><strong>Marketingové cookies:</strong> pouze se souhlasem uživatele</li>
            </ul>
            <p>
              Cookies můžete kdykoliv zakázat v nastavení vašeho prohlížeče. Některé funkce
              webu však nemusí fungovat správně.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Diskrétnost</h2>
            <p>
              <strong>Zaručujeme naprostou diskrétnost.</strong> Vaše návštěva a identita zůstane
              v tajnosti. Nevedeme žádnou veřejně přístupnou evidenci klientů. Osobní údaje
              používáme pouze pro nezbytnou komunikaci a rezervaci.
            </p>
            <p>
              V platebních výpisech se objeví neutrální popis platby bez jakékoliv souvislosti
              s povahu našich služeb.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Změny těchto zásad</h2>
            <p>
              Tyto zásady můžeme čas od času aktualizovat. O významných změnách vás budeme
              informovat prostřednictvím webu nebo emailem. Doporučujeme pravidelně kontrolovat
              tuto stránku.
            </p>
            <p>
              <strong>Datum poslední aktualizace:</strong> 1. 1. 2025
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Právo podat stížnost</h2>
            <p>
              Pokud se domníváte, že zpracováváme vaše osobní údaje v rozporu s GDPR,
              máte právo podat stížnost u dozorového úřadu:
            </p>
            <p>
              <strong>Úřad pro ochranu osobních údajů</strong><br/>
              Pplk. Sochora 27<br/>
              170 00 Praha 7<br/>
              Email: posta@uoou.cz<br/>
              Web: <a href="https://www.uoou.cz" target="_blank" rel="noopener">www.uoou.cz</a>
            </p>
          </div>

          <div className="legal-section">
            <h2>13. Kontakt pro dotazy</h2>
            <p>
              Máte-li jakékoliv dotazy ohledně zpracování vašich osobních údajů,
              neváhejte nás kontaktovat:
            </p>
            <p>
              <strong>Email:</strong> info@lovelygirls.cz<br/>
              <strong>Telegram/WhatsApp:</strong> Dostupné přes tlačítka na webu
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
              <p className="footer-tagline">{tFooter('tagline')}</p>
              <p className="footer-desc">{tFooter('about_text')}</p>
            </div>

            <div className="footer-links-grid">
              {/* Services */}
              <div className="footer-links-col">
                <h4 className="footer-links-title">{tFooter('practices')}</h4>
                <nav className="footer-links">
                  <Link href={`/${locale}/divky`}>{tNav('girls')}</Link>
                  <Link href={`/${locale}/cenik`}>{tNav('pricing')}</Link>
                  <Link href={`/${locale}/schedule`}>{tNav('schedule')}</Link>
                  <Link href={`/${locale}/discounts`}>{tNav('discounts')}</Link>
                  <Link href={`/${locale}/faq`}>{tNav('faq')}</Link>
                  <Link href={`/${locale}/blog`}>{tFooter('blog')}</Link>
                </nav>
              </div>

              {/* Contact */}
              <div className="footer-links-col">
                <h4 className="footer-links-title">{tFooter('contact')}</h4>
                <div className="footer-contact-info">
                  <div className="footer-contact-item">
                    <span className="label">{tFooter('hours')}</span>
                    <span className="value">{tFooter('hours_value')}</span>
                  </div>
                  <div className="footer-contact-item">
                    <span className="label">{tFooter('location')}</span>
                    <span className="value">{tFooter('location_value')}</span>
                  </div>
                </div>
                <div className="footer-contact-actions">
                  <a href="tel:+420734332131" className="footer-contact-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {tFooter('call')}
                  </a>
                  <a href="https://wa.me/420734332131?text=Ahoj%2C%20m%C3%A1te%20dneska%20voln%C3%BD%20term%C3%ADn%3F" className="footer-contact-btn whatsapp">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    {tFooter('whatsapp')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>{tFooter('copyright')}</span>
              <span className="dot">•</span>
              <span>{tCommon('adults_only')}</span>
            </div>
            <div className="footer-bottom-right">
              <Link href={`/${locale}/podminky`}>{tFooter('terms')}</Link>
              <Link href={`/${locale}/soukromi`}>{tFooter('privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
