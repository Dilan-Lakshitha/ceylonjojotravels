import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { resolveTourIdFromSlug, TourId } from './tour-slug-map';
import { LocalizedRouterService } from './localized-router.service';
import { isAppLang } from './language.constants';

export const tourIdResolver: ResolveFn<TourId | null> = (route) => {
  const slug = route.paramMap.get('tourSlug');
  const langParam = route.parent?.paramMap.get('lang');
  const lang = isAppLang(langParam) ? langParam : 'en';
  const router = inject(Router);
  const localizedRouter = inject(LocalizedRouterService);

  if (!slug) {
    void router.navigate(localizedRouter.commandsFor('tours', { lang }));
    return null;
  }

  const tourId = resolveTourIdFromSlug(slug);
  if (!tourId) {
    // Unknown slug (e.g. /en/tours/7-day-ella-yala-safari) → tours list, not blank page
    void router.navigate(localizedRouter.commandsFor('tours', { lang }));
    return null;
  }

  return tourId;
};
