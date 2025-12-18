// Mapping from old JSON slugs (English) to new service slugs (Czech)
export const OLD_TO_NEW_SLUG_MAPPING: Record<string, string> = {
  'classic': 'klasicky-sex',
  'blowjob_condom': 'oral-s-ochranou',
  'blowjob_no_condom': 'oral-bez-ochrany',
  'massage': 'eroticka-masaz',
  'cuddling': 'cuddling', // Keep as is, not in DB
  'licking': 'licking', // Keep as is, not in DB
  '69': 'poloha-69',
  'cum_on_body': 'strikani-na-telo',
  'cum_on_face': 'strikani-do-obliceje',
  'cum_in_mouth': 'strikani-do-ust',
  'shared_shower': 'shared_shower', // Keep as is, not in DB
  'basic': 'basic', // Keep as is, not in DB
  'erotic_massage': 'eroticka-masaz',
  'prostate_massage': 'prostatova-masaz',
  'foot_fetish': 'nohy-fetis',
  'facesitting': 'facesitting', // Keep as is, not in DB
  'role_play': 'hrani-roli',
  'bondage': 'bondage', // Keep as is, not in DB
  'piss_passive': 'zlaty-dest',
  'piss_active': 'zlaty-dest',
  'piss': 'zlaty-dest',
  'golden_shower': 'zlaty-dest',
  'anal': 'analni-sex',
  'deep_throat': 'hluboky-oral',
  'french_kissing': 'francouzske-libani',
  'kissing': 'francouzske-libani',
  'gfe': 'gfe-zkusenost-pritelkyne',
  'pse': 'pse-pornstar-zkusenost',
  'striptease': 'striptyz',
  'duo': 'duo-service',
  'swallow': 'polyknuti',
  'squirting': 'strikani-divky',
  'bdsm': 'bdsm-lehke',
  'light_bdsm': 'bdsm-lehke',
  'dinner': 'dinner-date',
  'toys': 'eroticke-pomucky',
  'sex_toys': 'eroticke-pomucky',
  'nuru_massage': 'nuru_massage', // Keep as is, not in DB
  'tantra_massage': 'tantra_massage' // Keep as is, not in DB
};

/**
 * Converts old JSON service slug to new service slug
 */
export function normalizeServiceSlug(oldSlug: string): string {
  return OLD_TO_NEW_SLUG_MAPPING[oldSlug] || oldSlug;
}
