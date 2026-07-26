import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';
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

  if (isPlatformBrowser(platformId)) {
    localStorage.setItem('preferred_lang', lang);
  }

  // Wait for shell translations so prerendered HTML is not empty keys.
  return transloco.load(`common/${lang}`).pipe(map(() => true));
};
