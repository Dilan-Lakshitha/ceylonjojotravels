export const AVAILABLE_LANGS = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'] as const;

export type AppLang = (typeof AVAILABLE_LANGS)[number];

export const DEFAULT_LANG: AppLang = 'en';

export const SITE_ORIGIN = 'https://ceylonjojotravels.com';

export const TRANSLOCO_SCOPES = [
  'common',
  'home',
  'about',
  'services',
  'tours',
  'destinations',
  'contact',
  'booking',
  'seo',
  'routes',
] as const;

export type TranslocoScope = (typeof TRANSLOCO_SCOPES)[number];

export function isAppLang(value: string | null | undefined): value is AppLang {
  return !!value && (AVAILABLE_LANGS as readonly string[]).includes(value);
}
