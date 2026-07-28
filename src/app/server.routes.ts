import { RenderMode, ServerRoute } from '@angular/ssr';
import { AVAILABLE_LANGS } from './i18n/language.constants';
import { ROUTE_MAP } from './i18n/route-map';
import { TOUR_IDS, slugForTour } from './i18n/tour-slug-map';

/**
 * Prerender language homes, guides, and every localized tour detail URL so
 * crawlers receive real title/description/canonical HTML (not the CSR shell).
 *
 * Paths stay explicit (`:lang/<segment>/…`) so matcher siblings are not pulled
 * into prerender mode.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return AVAILABLE_LANGS.map((lang) => ({ lang }));
    },
  },
  ...AVAILABLE_LANGS.map(
    (lang): ServerRoute => ({
      path: `:lang/${ROUTE_MAP.guides[lang]}`,
      renderMode: RenderMode.Prerender,
      async getPrerenderParams() {
        return [{ lang }];
      },
    }),
  ),
  ...AVAILABLE_LANGS.flatMap((lang) =>
    TOUR_IDS.map(
      (tourId): ServerRoute => ({
        path: `:lang/${ROUTE_MAP.tours[lang]}/${slugForTour(tourId, lang)}`,
        renderMode: RenderMode.Prerender,
        async getPrerenderParams() {
          return [{ lang }];
        },
      }),
    ),
  ),
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
