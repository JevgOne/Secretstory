"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';

export default function TermsPage() {
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
              <strong>Telefon:</strong> +420 734 332 131<br/>
              <strong>WhatsApp:</strong> +420 734 332 131<br/>
              <strong>Email:</strong> info@lovelygirls.cz<br/>
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>LovelyGirls Prague © 2025 — Pouze 18+</div>
        <div className="footer-links">
          <Link href={`/${locale}/podminky`} className="active">Podmínky</Link>
          <Link href={`/${locale}/soukromi`}>Soukromí</Link>
        </div>
      </footer>
    </>
  );
}
