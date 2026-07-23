import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { DEFAULT_LANG, isAppLang } from './language.constants';

export const langGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const transloco = inject(TranslocoService);
  const platformId = inject(PLATFORM_ID);
  const lang = route.paramMap.get('lang');

  if (!isAppLang(lang)) {
    return router.createUrlTree(['/', DEFAULT_LANG]);
  }

  transloco.setActiveLang(lang);
  // Preload shell translations so layout/nav render immediately
  transloco.load(`common/${lang}`).subscribe();

  if (isPlatformBrowser(platformId)) {
    localStorage.setItem('preferred_lang', lang);
  }

  return true;
};
