import { AppLang } from './language.constants';

export type RouteId =
  | 'home'
  | 'about'
  | 'services'
  | 'tours'
  | 'destinations'
  | 'contact'
  | 'booking'
  | 'bookingSuccess'
  | 'testimonials'
  | 'guides'
  | 'restaurant';

export type LocalizedSegments = Record<AppLang, string>;

/** Stable routeId → localized path segment per language (empty = home). */
export const ROUTE_MAP: Record<RouteId, LocalizedSegments> = {
  home: {
    en: '',
    de: '',
    fr: '',
    it: '',
    es: '',
    pl: '',
    ru: '',
  },
  about: {
    en: 'about-us',
    de: 'uber-uns',
    fr: 'a-propos',
    it: 'chi-siamo',
    es: 'sobre-nosotros',
    pl: 'o-nas',
    ru: 'o-nas',
  },
  services: {
    en: 'our-services',
    de: 'leistungen',
    fr: 'services',
    it: 'servizi',
    es: 'servicios',
    pl: 'uslugi',
    ru: 'uslugi',
  },
  tours: {
    en: 'tours',
    de: 'touren',
    fr: 'circuits',
    it: 'tour',
    es: 'tours',
    pl: 'wycieczki',
    ru: 'tury',
  },
  destinations: {
    en: 'destinations',
    de: 'reiseziele',
    fr: 'destinations',
    it: 'destinazioni',
    es: 'destinos',
    pl: 'destynacje',
    ru: 'napravleniya',
  },
  contact: {
    en: 'contact',
    de: 'kontakt',
    fr: 'contact',
    it: 'contatti',
    es: 'contacto',
    pl: 'kontakt',
    ru: 'kontakty',
  },
  booking: {
    en: 'booking',
    de: 'buchung',
    fr: 'reservation',
    it: 'prenotazione',
    es: 'reserva',
    pl: 'rezerwacja',
    ru: 'bronirovanie',
  },
  bookingSuccess: {
    en: 'booking-success',
    de: 'buchung-erfolgreich',
    fr: 'reservation-confirmee',
    it: 'prenotazione-confermata',
    es: 'reserva-confirmada',
    pl: 'rezerwacja-potwierdzona',
    ru: 'bronirovanie-uspeshno',
  },
  testimonials: {
    en: 'customer-testimonials',
    de: 'kundenbewertungen',
    fr: 'temoignages',
    it: 'recensioni',
    es: 'opiniones',
    pl: 'opinie',
    ru: 'otzyvy',
  },
  guides: {
    en: 'travel-guides',
    de: 'reisefuehrer',
    fr: 'guides-voyage',
    it: 'guide-di-viaggio',
    es: 'guias-viaje',
    pl: 'przewodniki',
    ru: 'putevoditeli',
  },
  restaurant: {
    en: 'restaurants',
    de: 'restaurants',
    fr: 'restaurants',
    it: 'ristoranti',
    es: 'restaurantes',
    pl: 'restauracje',
    ru: 'restorany',
  },
};

export function segmentFor(routeId: RouteId, lang: AppLang): string {
  return ROUTE_MAP[routeId][lang];
}

export function resolveRouteIdFromSegment(segment: string): RouteId | null {
  for (const [routeId, segments] of Object.entries(ROUTE_MAP) as [RouteId, LocalizedSegments][]) {
    if (Object.values(segments).includes(segment)) {
      return routeId;
    }
  }
  return null;
}

export function isSegmentForRoute(routeId: RouteId, segment: string): boolean {
  return Object.values(ROUTE_MAP[routeId]).includes(segment);
}
