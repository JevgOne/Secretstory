"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

// WhatsApp Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Vše");
  const [openItems, setOpenItems] = useState<number[]>([0]); // První otázka otevřená

  const faqs: FAQItem[] = [
    {
      question: "Jak si mohu rezervovat termín?",
      answer: "Rezervaci můžete provést přes WhatsApp, Telegram nebo telefonicky. Stačí nám napsat jméno preferované dívky, datum, čas a délku programu. Potvrzení obdržíte do 5 minut.",
      category: "Rezervace"
    },
    {
      question: "Je potřeba rezervovat předem?",
      answer: "Doporučujeme rezervovat alespoň 1-2 hodiny předem, abyste měli jistotu dostupnosti vaší preferované dívky. V případě volné kapacity přijímáme i walk-in návštěvy.",
      category: "Rezervace"
    },
    {
      question: "Jaké platební metody přijímáte?",
      answer: "Přijímáme hotovost i platební karty (Visa, Mastercard). Platba probíhá vždy na začátku návštěvy. Na požádání vystavíme účtenku.",
      category: "Platba"
    },
    {
      question: "Jak je zajištěna diskrétnost?",
      answer: "Naše apartmány jsou v běžných rezidenčních budovách bez jakéhokoliv označení. Nevedeme žádnou evidenci klientů. Na výpisu z karty se zobrazí neutrální název.",
      category: "Diskrétnost"
    },
    {
      question: "Co je zahrnuto v ceně?",
      answer: "Základní cena zahrnuje erotickou masáž, body to body, společnou sprchu a happy end. Detailní rozpis služeb najdete v ceníku nebo na profilu každé dívky.",
      category: "Služby"
    },
    {
      question: "Mohu zrušit rezervaci?",
      answer: "Ano, rezervaci lze zrušit bez poplatku nejpozději 2 hodiny před termínem. V případě pozdějšího zrušení nebo nedostavení se může být účtován storno poplatek.",
      category: "Rezervace"
    },
    {
      question: "Kde se apartmány nacházejí?",
      answer: "Máme dvě lokace v centru Prahy — Praha 2 (Nové Město) a Praha 3 (Žižkov). Přesnou adresu obdržíte po potvrzení rezervace.",
      category: "Diskrétnost"
    },
    {
      question: "Poskytujete služby i pro páry?",
      answer: "Ano, nabízíme programy pro páry. Můžete si vybrat masáž pro oba partnery současně nebo individuální programy. Kontaktujte nás pro více informací.",
      category: "Služby"
    }
  ];

  const categories = ["Vše", "Rezervace", "Služby", "Platba", "Diskrétnost"];

  const filteredFAQs = activeCategory === "Vše"
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      {/* Navigation */}
      <nav>
        <Link href="/" className="logo">
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
          <Link href="/">Home</Link>
          <Link href="/divky">Dívky</Link>
          <Link href="/cenik">Ceník</Link>
          <Link href="/schedule">Schedule</Link>
          <Link href="/discounts">Discounts</Link>
          <Link href="/faq" className="active">FAQ</Link>
        </div>
        <div className="nav-contact">
          <a href="tel:+420734332131" className="btn">+420 734 332 131</a>
          <a href="https://wa.me/420734332131" className="btn btn-fill">WhatsApp</a>
        </div>
        <button className="mobile-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Page Header */}
      <section className="page-header">
        <h1 className="page-title">FAQ</h1>
        <p className="page-subtitle">Odpovědi na nejčastější otázky. Nenašli jste co hledáte? Kontaktujte nás.</p>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        {/* Categories */}
        <div className="faq-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`faq-cat ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="faq-grid">
          {filteredFAQs.map((faq, i) => (
            <div key={i} className={`faq-item ${openItems.includes(i) ? "open" : ""}`}>
              <button className="faq-question" onClick={() => toggleItem(i)}>
                {faq.question}
                <span className="faq-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="contact-inner">
          <h2 className="contact-title">Máte další otázky?</h2>
          <p className="contact-subtitle">Neváhejte nás kontaktovat. Odpovíme do pár minut.</p>
          <div className="contact-buttons">
            <a href="https://wa.me/420734332131" className="contact-btn whatsapp">
              <WhatsAppIcon />
              WhatsApp
            </a>
            <a href="tel:+420734332131" className="contact-btn phone">
              <Phone size={20} />
              +420 734 332 131
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div>LovelyGirls Prague © 2025 — Pouze 18+</div>
        <div className="footer-links">
          <Link href="/podminky">Podmínky</Link>
          <Link href="/soukromi">Soukromí</Link>
        </div>
      </footer>
    </>
  );
}
