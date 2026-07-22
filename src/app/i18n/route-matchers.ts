import { UrlMatcher, UrlSegment } from '@angular/router';
import { isSegmentForRoute, RouteId } from './route-map';
import { resolveTourIdFromSlug } from './tour-slug-map';

export function createSegmentMatcher(routeId: RouteId): UrlMatcher {
  return (segments: UrlSegment[]) => {
    if (segments.length === 0) {
      return null;
    }
    if (!isSegmentForRoute(routeId, segments[0].path)) {
      return null;
    }
    return {
      consumed: [segments[0]],
    };
  };
}

/** Matches /:toursSegment only (tour list). */
export function createTourListMatcher(): UrlMatcher {
  return (segments: UrlSegment[]) => {
    if (segments.length !== 1) {
      return null;
    }
    if (!isSegmentForRoute('tours', segments[0].path)) {
      return null;
    }
    return { consumed: segments };
  };
}

/** Matches /:toursSegment/:tourSlug */
export function createTourDetailMatcher(): UrlMatcher {
  return (segments: UrlSegment[]) => {
    if (segments.length < 2) {
      return null;
    }
    if (!isSegmentForRoute('tours', segments[0].path)) {
      return null;
    }
    if (!resolveTourIdFromSlug(segments[1].path)) {
      return null;
    }
    return {
      consumed: [segments[0], segments[1]],
      posParams: {
        tourSlug: segments[1],
      },
    };
  };
}

export function createBookingMatcher(): UrlMatcher {
  return (segments: UrlSegment[]) => {
    if (segments.length < 2) {
      return null;
    }
    if (!isSegmentForRoute('booking', segments[0].path)) {
      return null;
    }
    return {
      consumed: [segments[0], segments[1]],
      posParams: {
        filecode: segments[1],
      },
    };
  };
}
