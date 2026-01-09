// JSON-LD Structured Data Components for SEO

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
}

export function LocalBusinessSchema({
  name,
  description,
  telephone,
  address,
  geo,
  openingHours = ['Mo-Su 10:00-22:00'],
  priceRange = '$$$$'
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AdultEntertainment',
    name,
    description,
    telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry
    },
    geo: geo ? {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude
    } : undefined,
    openingHoursSpecification: openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0],
      opens: hours.split(' ')[1]?.split('-')[0],
      closes: hours.split(' ')[1]?.split('-')[1]
    })),
    priceRange,
    url: 'https://www.lovelygirls.cz',
    sameAs: [
      'https://www.instagram.com/lovelygirls.cz',
      'https://t.me/lovelygirlscz'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LovelyGirls Prague',
    url: 'https://www.lovelygirls.cz',
    logo: 'https://www.lovelygirls.cz/logo.png',
    description: 'Premium escort services in Prague. Professional companions, erotic massage, VIP services.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Prague',
      addressCountry: 'CZ'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+420734332131',
      contactType: 'customer service',
      availableLanguage: ['Czech', 'English', 'German', 'Ukrainian']
    },
    sameAs: [
      'https://www.instagram.com/lovelygirls.cz',
      'https://t.me/lovelygirlscz'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LovelyGirls Prague',
    url: 'https://www.lovelygirls.cz',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.lovelygirls.cz/cs/divky?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: ['cs', 'en', 'de', 'uk']
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbListSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface PersonSchemaProps {
  name: string;
  age?: number;
  nationality?: string;
  image?: string;
  description?: string;
  url: string;
}

export function PersonSchema({
  name,
  age,
  nationality,
  image,
  description,
  url
}: PersonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(age && { age }),
    ...(nationality && { nationality }),
    ...(image && { image }),
    ...(description && { description }),
    url,
    memberOf: {
      '@type': 'Organization',
      name: 'LovelyGirls Prague',
      url: 'https://www.lovelygirls.cz'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ItemListSchemaProps {
  items: Array<{
    name: string;
    url: string;
    image?: string;
    description?: string;
  }>;
}

export function ItemListSchema({ items }: ItemListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: item.name,
        url: item.url,
        ...(item.image && { image: item.image }),
        ...(item.description && { description: item.description })
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface AggregateRatingSchemaProps {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function AggregateRatingSchema({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1
}: AggregateRatingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'LovelyGirls Prague',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toFixed(1),
      reviewCount,
      bestRating,
      worstRating
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// GEO/AIEO Optimized Schemas

interface SpeakableSchemaProps {
  name: string;
  description: string;
  url: string;
  speakableSelectors?: string[];
}

export function SpeakableSchema({
  name,
  description,
  url,
  speakableSelectors = ['.speakable', 'h1', '.description']
}: SpeakableSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableSelectors
    },
    publisher: {
      '@type': 'Organization',
      name: 'LovelyGirls Prague',
      url: 'https://www.lovelygirls.cz'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    url?: string;
  }>;
  totalTime?: string;
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime = 'PT5M'
}: HowToSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  priceRange?: string;
  url: string;
}

export function ServiceSchema({
  name,
  description,
  provider = 'LovelyGirls Prague',
  areaServed = 'Prague, Czech Republic',
  priceRange = '$$$$',
  url
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: 'https://www.lovelygirls.cz'
    },
    areaServed: {
      '@type': 'City',
      name: areaServed
    },
    priceRange,
    url
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface CollectionPageSchemaProps {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
}

export function CollectionPageSchema({
  name,
  description,
  url,
  numberOfItems
}: CollectionPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    numberOfItems,
    provider: {
      '@type': 'Organization',
      name: 'LovelyGirls Prague',
      url: 'https://www.lovelygirls.cz'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
