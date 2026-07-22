import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { resolveTourIdFromSlug, TourId } from './tour-slug-map';

export const tourIdResolver: ResolveFn<TourId | null> = (route) => {
  const slug = route.paramMap.get('tourSlug');
  if (!slug) {
    return null;
  }
  const tourId = resolveTourIdFromSlug(slug);
  if (!tourId) {
    inject(Router).navigate(['/', route.parent?.paramMap.get('lang') || 'en']);
    return null;
  }
  return tourId;
};
