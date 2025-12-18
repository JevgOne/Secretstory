/**
 * Review System Constants - Vibe & Tag Definitions
 * Single source of truth for vibe-based review system
 */

export const VIBE_OPTIONS = {
  unforgettable: {
    id: 'unforgettable',
    emoji: '🔥',
    label_cs: 'Nezapomenutelné',
    label_en: 'Unforgettable',
    label_de: 'Unvergesslich',
    label_uk: 'Незабутнє',
    description_cs: 'Zážitek na celý život',
    description_en: 'Experience of a lifetime',
    description_de: 'Erlebnis fürs Leben',
    description_uk: 'Досвід на все життя',
    color: '#ff6b6b'
  },
  magical: {
    id: 'magical',
    emoji: '✨',
    label_cs: 'Magické',
    label_en: 'Magical',
    label_de: 'Magisch',
    label_uk: 'Чарівне',
    description_cs: 'Něco speciálního ve vzduchu',
    description_en: 'Something special in the air',
    description_de: 'Etwas Besonderes in der Luft',
    description_uk: 'Щось особливе в повітрі',
    color: '#a78bfa'
  },
  great: {
    id: 'great',
    emoji: '💫',
    label_cs: 'Super',
    label_en: 'Great',
    label_de: 'Super',
    label_uk: 'Чудово',
    description_cs: 'Skvělá atmosféra, doporučuju',
    description_en: 'Great atmosphere, recommended',
    description_de: 'Tolle Atmosphäre, empfehlenswert',
    description_uk: 'Чудова атмосфера, рекомендую',
    color: '#60a5fa'
  },
  nice: {
    id: 'nice',
    emoji: '😊',
    label_cs: 'Příjemné',
    label_en: 'Nice',
    label_de: 'Angenehm',
    label_uk: 'Приємно',
    description_cs: 'Solidní, nic k vytčení',
    description_en: 'Solid, no complaints',
    description_de: 'Solide, nichts auszusetzen',
    description_uk: 'Солідно, без нарікань',
    color: '#34d399'
  },
  meh: {
    id: 'meh',
    emoji: '😐',
    label_cs: 'Nic moc',
    label_en: 'Meh',
    label_de: 'Naja',
    label_uk: 'Так собі',
    description_cs: 'Očekával jsem víc',
    description_en: 'Expected more',
    description_de: 'Habe mehr erwartet',
    description_uk: 'Очікував більшого',
    color: '#94a3b8'
  }
} as const;

export const TAG_OPTIONS = {
  intimate: {
    id: 'intimate',
    emoji: '💋',
    label_cs: 'Intimní',
    label_en: 'Intimate',
    label_de: 'Intim',
    label_uk: 'Інтимна'
  },
  playful: {
    id: 'playful',
    emoji: '😜',
    label_cs: 'Hravá',
    label_en: 'Playful',
    label_de: 'Verspielt',
    label_uk: 'Грайлива'
  },
  relaxed: {
    id: 'relaxed',
    emoji: '🧘',
    label_cs: 'Uvolněná',
    label_en: 'Relaxed',
    label_de: 'Entspannt',
    label_uk: 'Розслаблена'
  },
  communicative: {
    id: 'communicative',
    emoji: '💬',
    label_cs: 'Komunikativní',
    label_en: 'Communicative',
    label_de: 'Kommunikativ',
    label_uk: 'Комунікабельна'
  },
  professional: {
    id: 'professional',
    emoji: '👑',
    label_cs: 'Profesionální',
    label_en: 'Professional',
    label_de: 'Professionell',
    label_uk: 'Професійна'
  },
  passionate: {
    id: 'passionate',
    emoji: '❤️‍🔥',
    label_cs: 'Vášnivá',
    label_en: 'Passionate',
    label_de: 'Leidenschaftlich',
    label_uk: 'Пристрасна'
  },
  friendly: {
    id: 'friendly',
    emoji: '🤗',
    label_cs: 'Přátelská',
    label_en: 'Friendly',
    label_de: 'Freundlich',
    label_uk: 'Дружелюбна'
  },
  mysterious: {
    id: 'mysterious',
    emoji: '🌙',
    label_cs: 'Tajemná',
    label_en: 'Mysterious',
    label_de: 'Geheimnisvoll',
    label_uk: 'Загадкова'
  }
} as const;

// Type definitions
export type VibeId = keyof typeof VIBE_OPTIONS;
export type TagId = keyof typeof TAG_OPTIONS;

export const VIBE_IDS = Object.keys(VIBE_OPTIONS) as VibeId[];
export const TAG_IDS = Object.keys(TAG_OPTIONS) as TagId[];

// Validation functions
export function isValidVibe(vibe: string): vibe is VibeId {
  return VIBE_IDS.includes(vibe as VibeId);
}

export function isValidTag(tag: string): tag is TagId {
  return TAG_IDS.includes(tag as TagId);
}

export function validateTags(tags: string[]): boolean {
  if (!Array.isArray(tags)) return false;
  if (tags.length > 4) return false;
  return tags.every(tag => isValidTag(tag));
}

// Helper to get localized label
export function getVibeLabel(vibeId: VibeId, locale: 'cs' | 'en' | 'de' | 'uk'): string {
  const vibe = VIBE_OPTIONS[vibeId];
  return vibe[`label_${locale}`] || vibe.label_cs;
}

export function getTagLabel(tagId: TagId, locale: 'cs' | 'en' | 'de' | 'uk'): string {
  const tag = TAG_OPTIONS[tagId];
  return tag[`label_${locale}`] || tag.label_cs;
}

// Aggregation helpers
export interface VibeDistribution {
  unforgettable: number;
  magical: number;
  great: number;
  nice: number;
  meh: number;
}

export interface DominantVibe {
  vibe: VibeId;
  count: number;
  percentage: number;
}

export interface TagCount {
  tag: TagId;
  count: number;
}

export interface ReviewSummary {
  totalReviews: number;
  dominantVibe: DominantVibe;
  vibeDistribution: VibeDistribution;
  topTags: TagCount[];
}

export function calculateDominantVibe(vibes: VibeId[]): DominantVibe {
  const counts: VibeDistribution = {
    unforgettable: 0,
    magical: 0,
    great: 0,
    nice: 0,
    meh: 0
  };

  vibes.forEach(vibe => {
    if (isValidVibe(vibe)) {
      counts[vibe]++;
    }
  });

  const total = vibes.length;
  const entries = Object.entries(counts) as [VibeId, number][];
  const [dominantVibe, count] = entries.sort(([, a], [, b]) => b - a)[0];

  return {
    vibe: dominantVibe,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0
  };
}

export function calculateVibeDistribution(vibes: VibeId[]): VibeDistribution {
  const counts: VibeDistribution = {
    unforgettable: 0,
    magical: 0,
    great: 0,
    nice: 0,
    meh: 0
  };

  vibes.forEach(vibe => {
    if (isValidVibe(vibe)) {
      counts[vibe]++;
    }
  });

  return counts;
}

export function calculateTopTags(tagArrays: string[][], limit = 4): TagCount[] {
  const tagCounts: Partial<Record<TagId, number>> = {};

  tagArrays.forEach(tags => {
    tags.forEach(tag => {
      if (isValidTag(tag)) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag: tag as TagId, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function calculateReviewSummary(
  reviews: Array<{ vibe: string; tags: string[] }>
): ReviewSummary {
  const vibes = reviews
    .map(r => r.vibe)
    .filter((v): v is VibeId => isValidVibe(v));

  const tagArrays = reviews
    .map(r => Array.isArray(r.tags) ? r.tags : JSON.parse(r.tags || '[]'))
    .filter(tags => Array.isArray(tags));

  return {
    totalReviews: reviews.length,
    dominantVibe: calculateDominantVibe(vibes),
    vibeDistribution: calculateVibeDistribution(vibes),
    topTags: calculateTopTags(tagArrays)
  };
}

// Fingerprinting for helpful votes
export function generateFingerprint(ip: string, userAgent: string): string {
  // Use Web Crypto API for fingerprinting
  const data = `${ip}:${userAgent}`;

  // Simple hash for Node.js environment
  if (typeof window === 'undefined') {
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')
      .slice(0, 32);
  }

  // For browser (shouldn't be called client-side, but just in case)
  return btoa(data).slice(0, 32);
}
