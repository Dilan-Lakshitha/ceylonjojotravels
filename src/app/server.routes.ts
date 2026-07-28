import { RenderMode, ServerRoute } from '@angular/ssr';
import { AVAILABLE_LANGS } from './i18n/language.constants';
import { ROUTE_MAP } from './i18n/route-map';

/**
 * Prerender each language homepage (`/en`, `/de`, …) so Vercel serves real HTML
 * on first request instead of the blank CSR shell.
 *
 * Guides use `:lang/<localized-segment>` (not a catch-all `:segment`) so sibling
 * matcher routes under `:lang` stay out of prerender mode.
 *
 * Other nested marketing URLs stay client-rendered for now.
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
        // Only the matching language for this localized segment.
        return [{ lang }];
      },
    }),
  ),
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
