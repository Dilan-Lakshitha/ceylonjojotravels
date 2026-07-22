import { AppLang } from './language.constants';

export type TourId =
  | 'ella-day-tour'
  | 'galle-day-tour'
  | 'kandy-day-tour'
  | 'sigiriya-day-tour'
  | '2-day-ella-kandy-private-tour-sri-lanka'
  | '2-day-ella-yala-private-tour-sri-lanka'
  | '4-day-sri-lanka-tour'
  | '5-day-sri-lanka-tour'
  | '6-day-sri-lanka-private-tour'
  | '7-day-sri-lanka-tour'
  | '8-day-sri-lanka-private-tour'
  | '10-day-sri-lanka-tour';

export type TourSlugMap = Record<TourId, Record<AppLang, string>>;

export const TOUR_SLUG_MAP: TourSlugMap = {
  'ella-day-tour': {
    en: 'ella-day-tour',
    de: 'ella-tagesausflug',
    fr: 'excursion-ella',
    it: 'escursione-ella',
    es: 'excursion-ella',
    pl: 'wycieczka-ella',
    ru: 'odnodnevnyy-tur-ella',
  },
  'galle-day-tour': {
    en: 'galle-day-tour',
    de: 'galle-tagesausflug',
    fr: 'excursion-galle',
    it: 'escursione-galle',
    es: 'excursion-galle',
    pl: 'wycieczka-galle',
    ru: 'odnodnevnyy-tur-galle',
  },
  'kandy-day-tour': {
    en: 'kandy-day-tour',
    de: 'kandy-tagesausflug',
    fr: 'excursion-kandy',
    it: 'escursione-kandy',
    es: 'excursion-kandy',
    pl: 'wycieczka-kandy',
    ru: 'odnodnevnyy-tur-kandy',
  },
  'sigiriya-day-tour': {
    en: 'sigiriya-day-tour',
    de: 'sigiriya-tagesausflug',
    fr: 'excursion-sigiriya',
    it: 'escursione-sigiriya',
    es: 'excursion-sigiriya',
    pl: 'wycieczka-sigiriya',
    ru: 'odnodnevnyy-tur-sigiriya',
  },
  '2-day-ella-kandy-private-tour-sri-lanka': {
    en: '2-day-ella-kandy-private-tour',
    de: '2-tage-ella-kandy-privattour',
    fr: 'circuit-2-jours-ella-kandy',
    it: 'tour-2-giorni-ella-kandy',
    es: 'tour-2-dias-ella-kandy',
    pl: '2-dni-ella-kandy',
    ru: '2-dnya-ella-kandy',
  },
  '2-day-ella-yala-private-tour-sri-lanka': {
    en: '2-day-ella-yala-safari',
    de: '2-tage-ella-yala-safari',
    fr: 'circuit-2-jours-ella-yala',
    it: 'tour-2-giorni-ella-yala',
    es: 'tour-2-dias-ella-yala',
    pl: '2-dni-ella-yala',
    ru: '2-dnya-ella-yala',
  },
  '4-day-sri-lanka-tour': {
    en: '4-day-sri-lanka-tour',
    de: '4-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-4-jours',
    it: 'tour-sri-lanka-4-giorni',
    es: 'tour-sri-lanka-4-dias',
    pl: '4-dni-sri-lanka',
    ru: '4-dnya-shri-lanka',
  },
  '5-day-sri-lanka-tour': {
    en: '5-day-sri-lanka-tour',
    de: '5-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-5-jours',
    it: 'tour-sri-lanka-5-giorni',
    es: 'tour-sri-lanka-5-dias',
    pl: '5-dni-sri-lanka',
    ru: '5-dney-shri-lanka',
  },
  '6-day-sri-lanka-private-tour': {
    en: '6-day-sri-lanka-private-tour',
    de: '6-tage-sri-lanka-privattour',
    fr: 'circuit-prive-sri-lanka-6-jours',
    it: 'tour-privato-sri-lanka-6-giorni',
    es: 'tour-privado-sri-lanka-6-dias',
    pl: '6-dni-prywatny-sri-lanka',
    ru: '6-dney-shri-lanka',
  },
  '7-day-sri-lanka-tour': {
    en: '7-day-sri-lanka-tour',
    de: '7-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-7-jours',
    it: 'tour-sri-lanka-7-giorni',
    es: 'tour-sri-lanka-7-dias',
    pl: '7-dni-sri-lanka',
    ru: '7-dney-shri-lanka',
  },
  '8-day-sri-lanka-private-tour': {
    en: '8-day-sri-lanka-private-tour',
    de: '8-tage-sri-lanka-privattour',
    fr: 'circuit-prive-sri-lanka-8-jours',
    it: 'tour-privato-sri-lanka-8-giorni',
    es: 'tour-privado-sri-lanka-8-dias',
    pl: '8-dni-prywatny-sri-lanka',
    ru: '8-dney-shri-lanka',
  },
  '10-day-sri-lanka-tour': {
    en: '10-day-sri-lanka-tour',
    de: '10-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-10-jours',
    it: 'tour-sri-lanka-10-giorni',
    es: 'tour-sri-lanka-10-dias',
    pl: '10-dni-sri-lanka',
    ru: '10-dney-shri-lanka',
  },
};

export const TOUR_IDS = Object.keys(TOUR_SLUG_MAP) as TourId[];

/** Legacy flat English tour paths → stable tour id (for redirects). */
export const LEGACY_TOUR_PATHS: Record<string, TourId> = {
  'ella-day-tour': 'ella-day-tour',
  'galle-day-tour': 'galle-day-tour',
  'kandy-day-tour': 'kandy-day-tour',
  'sigiriya-day-tour': 'sigiriya-day-tour',
  '2-day-ella-kandy-private-tour-sri-lanka': '2-day-ella-kandy-private-tour-sri-lanka',
  '2-day-ella-yala-private-tour-sri-lanka': '2-day-ella-yala-private-tour-sri-lanka',
  '4-day-sri-lanka-tour': '4-day-sri-lanka-tour',
  '5-day-sri-lanka-tour': '5-day-sri-lanka-tour',
  '6-day-sri-lanka-private-tour': '6-day-sri-lanka-private-tour',
  '7-day-sri-lanka-tour': '7-day-sri-lanka-tour',
  '8-day-sri-lanka-private-tour': '8-day-sri-lanka-private-tour',
  '10-day-sri-lanka-tour': '10-day-sri-lanka-tour',
};

export function slugForTour(tourId: TourId, lang: AppLang): string {
  return TOUR_SLUG_MAP[tourId][lang];
}

export function resolveTourIdFromSlug(slug: string): TourId | null {
  for (const [tourId, slugs] of Object.entries(TOUR_SLUG_MAP) as [TourId, Record<AppLang, string>][]) {
    if (Object.values(slugs).includes(slug)) {
      return tourId;
    }
  }
  return LEGACY_TOUR_PATHS[slug] ?? null;
}
