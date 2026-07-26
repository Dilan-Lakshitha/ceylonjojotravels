import { RenderMode, ServerRoute } from '@angular/ssr';
import { AVAILABLE_LANGS } from './i18n/language.constants';

/**
 * Prerender each language homepage (`/en`, `/de`, …) so Vercel serves real HTML
 * on first request instead of the blank CSR shell.
 *
 * Nested marketing URLs use custom route matchers, so they stay client-rendered
 * for now (boot shell in index.html covers their white-flash).
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return AVAILABLE_LANGS.map((lang) => ({ lang }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
