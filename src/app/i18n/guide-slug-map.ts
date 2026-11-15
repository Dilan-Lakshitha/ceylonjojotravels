import { AppLang } from './language.constants';

/** Stable guide article ids (Wave 1+). */
export type GuideId = 'best-time-to-visit-sri-lanka';

/**
 * Localized slugs per language.
 * Empty string = locale not ready yet (exclude from sitemap/hreflang; 301 → EN).
 */
export type GuideSlugMap = Record<GuideId, Record<AppLang, string>>;

export const GUIDE_SLUG_MAP: GuideSlugMap = {
  'best-time-to-visit-sri-lanka': {
    en: 'best-time-to-visit-sri-lanka',
    de: '',
    fr: '',
    it: '',
    es: '',
    pl: '',
    ru: '',
  },
};

/** False = keep out of routes, prerender and sitemap until copy is approved. */
export const GUIDE_APPROVED: Record<GuideId, boolean> = {
  'best-time-to-visit-sri-lanka': false,
};

export const GUIDE_IDS = Object.keys(GUIDE_SLUG_MAP) as GuideId[];

export function slugForGuide(guideId: GuideId, lang: AppLang): string {
  return GUIDE_SLUG_MAP[guideId]?.[lang] || '';
}

export function isGuideReady(guideId: GuideId, lang: AppLang): boolean {
  return Boolean(GUIDE_APPROVED[guideId] && slugForGuide(guideId, lang));
}

export function resolveGuideIdFromSlug(slug: string): GuideId | null {
  for (const id of GUIDE_IDS) {
    for (const lang of Object.keys(GUIDE_SLUG_MAP[id]) as AppLang[]) {
      if (GUIDE_SLUG_MAP[id][lang] === slug) {
        return id;
      }
    }
  }
  return null;
}

/** Canonical English path for incomplete locale fallbacks. */
export function enGuidePath(guideId: GuideId): string {
  return `/en/travel-guides/${GUIDE_SLUG_MAP[guideId].en}`;
}
