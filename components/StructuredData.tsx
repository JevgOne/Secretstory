import Script from 'next/script'

interface OrganizationSchemaProps {
  locale?: string
}

export function OrganizationSchema({ locale = 'cs' }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LovelyGirls Prague",
    "alternateName": "LovelyGirls",
    "url": "https://www.lovelygirls.cz",
    "logo": "https://www.lovelygirls.cz/logo.png",
    "description": "Premium escort services and erotic massage in Prague. Professional companions, verified profiles, discreet service.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Prague",
      "addressCountry": "CZ"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+420734332131",
      "contactType": "customer service",
      "availableLanguage": ["Czech", "English", "German", "Ukrainian"]
    },
    "sameAs": [
      "https://www.instagram.com/lovelygirls_prague",
      "https://t.me/lovelygirls_prague"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    }
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface PersonSchemaProps {
  girl: {
    name: string
    age: number
    height: number
    weight: number
    nationality: string
    bio?: string
    slug: string
  }
  locale: string
}

export function PersonSchema({ girl, locale }: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": girl.name,
    "description": girl.bio || `${girl.name}, professional companion in Prague. Age: ${girl.age}, Height: ${girl.height}cm.`,
    "nationality": girl.nationality,
    "url": `https://www.lovelygirls.cz/${locale}/profily/${girl.slug}`,
    "worksFor": {
      "@type": "Organization",
      "name": "LovelyGirls Prague",
      "url": "https://www.lovelygirls.cz"
    }
  }

  return (
    <Script
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ServiceSchemaProps {
  locale?: string
}

export function ServiceSchema({ locale = 'cs' }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Adult Entertainment Services",
    "name": "Premium Escort & Erotic Massage Services",
    "provider": {
      "@type": "Organization",
      "name": "LovelyGirls Prague",
      "url": "https://www.lovelygirls.cz"
    },
    "areaServed": {
      "@type": "City",
      "name": "Prague",
      "addressCountry": "CZ"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Escort Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Classic Experience (60 minutes)",
            "description": "Classic massage, erotic massage, body to body, shared shower"
          },
          "price": "2500",
          "priceCurrency": "CZK"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Premium Pleasure (90 minutes)",
            "description": "Premium experience with tantra elements"
          },
          "price": "3500",
          "priceCurrency": "CZK"
        }
      ]
    }
  }

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
