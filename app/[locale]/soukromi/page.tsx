"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

export default function PrivacyPage() {
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <>
      {/* Navigation */}
      <nav>
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
          <a href="tel:+420734332131" className="btn">{tNav('phone')}</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">{tNav('whatsapp')}</a>
        </div>
        <MobileMenu currentPath={pathname} />
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
              <strong>Telefon:</strong> +420 734 332 131
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
              <strong>Telefon:</strong> +420 734 332 131<br/>
              <strong>WhatsApp:</strong> +420 734 332 131
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>LovelyGirls Prague © 2025 — Pouze 18+</div>
        <div className="footer-disclaimer">Všechny modely jsou plnoleté. Pouze pro osoby 18+.</div>
        <div className="footer-links">
          <Link href={`/${locale}/blog`}>Blog</Link>
          <Link href={`/${locale}/podminky`}>Podmínky</Link>
          <Link href={`/${locale}/soukromi`} className="active">Soukromí</Link>
        </div>
      </footer>
    </>
  );
}
