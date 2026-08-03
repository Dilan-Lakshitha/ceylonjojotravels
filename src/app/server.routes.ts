import { RenderMode, ServerRoute } from '@angular/ssr';
import { AVAILABLE_LANGS, AppLang } from './i18n/language.constants';
import { ROUTE_MAP, RouteId } from './i18n/route-map';
import { TOUR_IDS, slugForTour } from './i18n/tour-slug-map';

/**
 * Prerender every public sitemap URL so crawlers receive real
 * title/description/canonical HTML (not the CSR English shell).
 *
 * Paths stay explicit (`:lang/<segment>/…`) so matcher siblings are not
 * pulled into prerender mode. Booking stays Client-only.
 *
 * Important: several locales share the same path segment (e.g. EN+ES
 * both use `tours`, EN+FR use `contact`). Angular dedupes ServerRoute
 * entries by path pattern, so each pattern must return ALL matching
 * langs from getPrerenderParams — one entry per pattern, not per lang.
 */
const PRERENDER_SECTIONS: RouteId[] = [
  'about',
  'services',
  'tours',
  'destinations',
  'contact',
  'testimonials',
  'guides',
  'restaurant',
];

/** One ServerRoute per unique `:lang/<segment>` pattern. */
function prerenderSectionRoutes(routeId: RouteId): ServerRoute[] {
  const langsBySegment = new Map<string, AppLang[]>();
  for (const lang of AVAILABLE_LANGS) {
    const segment = ROUTE_MAP[routeId][lang];
    const langs = langsBySegment.get(segment) ?? [];
    langs.push(lang);
    langsBySegment.set(segment, langs);
  }

  return [...langsBySegment.entries()].map(
    ([segment, langs]): ServerRoute => ({
      path: `:lang/${segment}`,
      renderMode: RenderMode.Prerender,
      async getPrerenderParams() {
        return langs.map((lang) => ({ lang }));
      },
    }),
  );
}

/** One ServerRoute per unique `:lang/<toursSeg>/<slug>` pattern. */
function prerenderTourDetailRoutes(): ServerRoute[] {
  const langsByPath = new Map<string, AppLang[]>();
  for (const lang of AVAILABLE_LANGS) {
    for (const tourId of TOUR_IDS) {
      const path = `${ROUTE_MAP.tours[lang]}/${slugForTour(tourId, lang)}`;
      const langs = langsByPath.get(path) ?? [];
      langs.push(lang);
      langsByPath.set(path, langs);
    }
  }

  return [...langsByPath.entries()].map(
    ([path, langs]): ServerRoute => ({
      path: `:lang/${path}`,
      renderMode: RenderMode.Prerender,
      async getPrerenderParams() {
        return langs.map((lang) => ({ lang }));
      },
    }),
  );
}

export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return AVAILABLE_LANGS.map((lang) => ({ lang }));
    },
  },
  ...PRERENDER_SECTIONS.flatMap(prerenderSectionRoutes),
  ...prerenderTourDetailRoutes(),
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
