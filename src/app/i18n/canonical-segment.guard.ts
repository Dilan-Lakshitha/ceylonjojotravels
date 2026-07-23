import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { isAppLang } from './language.constants';
import { RouteId, segmentFor } from './route-map';
import { resolveTourIdFromSlug, slugForTour } from './tour-slug-map';
import { LocalizedRouterService } from './localized-router.service';

/**
 * Redirects URLs that use another language's path segment under the current lang prefix
 * to the lang-correct canonical URL (client-side equivalent of a 301).
 */
export const canonicalSegmentGuard: CanActivateFn = (route): boolean | UrlTree => {
  const router = inject(Router);
  const localizedRouter = inject(LocalizedRouterService);
  const langParam = route.parent?.paramMap.get('lang');
  if (!isAppLang(langParam)) {
    return true;
  }
  const lang = langParam;
  const routeId = route.data['routeId'] as RouteId | undefined;
  if (!routeId || routeId === 'home') {
    return true;
  }

  const urlSeg = route.url.map((s) => s.path);
  if (!urlSeg.length) {
    return true;
  }

  const expectedPrimary = segmentFor(routeId === 'tours' ? 'tours' : routeId, lang);

  if (routeId === 'tours' && urlSeg.length >= 2) {
    const tourId = resolveTourIdFromSlug(urlSeg[1]);
    if (!tourId) {
      return true;
    }
    const expectedSlug = slugForTour(tourId, lang);
    if (urlSeg[0] !== expectedPrimary || urlSeg[1] !== expectedSlug) {
      return router.createUrlTree(
        localizedRouter.commandsFor('tours', { lang, tourId }),
      );
    }
    return true;
  }

  if (routeId === 'booking' && urlSeg.length >= 2) {
    if (urlSeg[0] !== expectedPrimary) {
      return router.createUrlTree(
        localizedRouter.commandsFor('booking', { lang, filecode: urlSeg[1] }),
      );
    }
    return true;
  }

  if (urlSeg[0] !== expectedPrimary) {
    return router.createUrlTree(localizedRouter.commandsFor(routeId, { lang }));
  }

  return true;
};
