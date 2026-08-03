import { Routes } from '@angular/router';
import { LayoutComponent } from './mainComponents/layout-component/layout-component';
import { langGuard } from './i18n/lang.guard';
import { canonicalSegmentGuard } from './i18n/canonical-segment.guard';
import {
  createBookingMatcher,
  createBookingSuccessMatcher,
  createSegmentMatcher,
  createTourDetailMatcher,
  createTourListMatcher,
} from './i18n/route-matchers';
import { tourIdResolver } from './i18n/tour-id.resolver';
import { LEGACY_TOUR_PATHS, TOUR_IDS, slugForTour } from './i18n/tour-slug-map';
import { homeI18nResolver, pageI18nResolver } from './i18n/page-i18n.resolver';
import { AVAILABLE_LANGS } from './i18n/language.constants';
import { ROUTE_MAP, RouteId } from './i18n/route-map';

const legacyTourRedirects: Routes = Object.entries(LEGACY_TOUR_PATHS).map(([path, tourId]) => ({
  path,
  redirectTo: `/en/tours/${slugForTour(tourId, 'en')}`,
  pathMatch: 'full' as const,
}));

const segmentGuards = [canonicalSegmentGuard];

/** Explicit lang-correct paths so Angular SSR can prerender sitemap URLs. */
function explicitSegmentRoutes(
  routeId: RouteId,
  scopes: string[],
  loadComponent: NonNullable<Routes[number]['loadComponent']>,
): Routes {
  return AVAILABLE_LANGS.map((lang) => ({
    path: ROUTE_MAP[routeId][lang],
    loadComponent,
    canActivate: segmentGuards,
    resolve: { i18n: pageI18nResolver(scopes) },
    data: { routeId },
  }));
}

const guidesRoutes = explicitSegmentRoutes('guides', ['common', 'seo', 'guides'], () =>
  import('./sharedComponents/travel-guides/travel-guides').then((m) => m.TravelGuides),
);

const aboutRoutes = explicitSegmentRoutes('about', ['common', 'seo', 'about'], () =>
  import('./mainComponents/about-component/about-component').then((m) => m.AboutComponent),
);

const servicesRoutes = explicitSegmentRoutes('services', ['common', 'seo', 'services'], () =>
  import('./mainComponents/service-component/service-component').then((m) => m.ServiceComponent),
);

const destinationsRoutes = explicitSegmentRoutes(
  'destinations',
  ['common', 'seo', 'destinations'],
  () =>
    import('./sharedComponents/destination-component/destination-component').then(
      (m) => m.DestinationComponent,
    ),
);

const contactRoutes = explicitSegmentRoutes('contact', ['common', 'seo', 'contact'], () =>
  import('./sharedComponents/contact-us-component/contact-us-component').then(
    (m) => m.ContactUsComponent,
  ),
);

const testimonialsRoutes = explicitSegmentRoutes('testimonials', ['common', 'seo'], () =>
  import('./sharedComponents/testimonial/testimonial').then((m) => m.Testimonial),
);

const restaurantRoutes = explicitSegmentRoutes('restaurant', ['common', 'seo'], () =>
  import('./mainComponents/resturant-component/resturant-component').then(
    (m) => m.ResturantComponent,
  ),
);

const toursListRoutes = explicitSegmentRoutes('tours', ['common', 'seo', 'tours'], () =>
  import('./mainComponents/tour-packages/tour-packages').then((m) => m.TourPackages),
);

/**
 * Explicit lang-correct tour detail paths for prerender.
 * Matcher below still catches wrong-lang slug combos for canonical redirects.
 */
const tourDetailRoutes: Routes = AVAILABLE_LANGS.flatMap((lang) =>
  TOUR_IDS.map((tourId) => ({
    path: `${ROUTE_MAP.tours[lang]}/${slugForTour(tourId, lang)}`,
    loadComponent: () =>
      import('./mainComponents/tour-detail-page/tour-detail-page.component').then(
        (m) => m.TourDetailPageComponent,
      ),
    canActivate: segmentGuards,
    resolve: { i18n: pageI18nResolver(['common', 'seo', 'tours']) },
    data: { routeId: 'tours' as const, tourId },
  })),
);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'en' },

  { path: 'about-us', redirectTo: '/en/about-us', pathMatch: 'full' },
  { path: 'our-services', redirectTo: '/en/our-services', pathMatch: 'full' },
  { path: 'tour-packages', redirectTo: '/en/tours', pathMatch: 'full' },
  { path: 'contact-us', redirectTo: '/en/contact', pathMatch: 'full' },
  { path: 'destinations-sri-lanka', redirectTo: '/en/destinations', pathMatch: 'full' },
  { path: 'customer-testimonials', redirectTo: '/en/customer-testimonials', pathMatch: 'full' },
  { path: 'sri-lanka-travel-guides', redirectTo: '/en/travel-guides', pathMatch: 'full' },
  { path: 'restaurants-in-sri-lanka', redirectTo: '/en/restaurants', pathMatch: 'full' },
  { path: 'booking/:filecode', redirectTo: '/en/booking/:filecode' },
  ...legacyTourRedirects,

  {
    path: ':lang',
    canActivate: [langGuard],
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./mainComponents/home-page-component/home-page-component').then(
            (m) => m.HomePageComponent,
          ),
        resolve: { i18n: homeI18nResolver },
        data: { routeId: 'home' },
      },
      ...aboutRoutes,
      {
        matcher: createSegmentMatcher('about'),
        loadComponent: () =>
          import('./mainComponents/about-component/about-component').then((m) => m.AboutComponent),
        canActivate: segmentGuards,
        resolve: { i18n: pageI18nResolver(['common', 'seo', 'about']) },
        data: { routeId: 'about' },
      },
      ...servicesRoutes,
      {
        matcher: createSegmentMatcher('services'),
        loadComponent: () =>
          import('./mainComponents/service-component/service-component').then(
            (m) => m.ServiceComponent,
          ),
        canActivate: segmentGuards,
        resolve: { i18n: pageI18nResolver(['common', 'seo', 'services']) },
        data: { routeId: 'services' },
      },
      ...tourDetailRoutes,
      {
        matcher: createTourDetailMatcher(),
        loadComponent: () =>
          import('./mainComponents/tour-detail-page/tour-detail-page.component').then(
            (m) => m.TourDetailPageComponent,
          ),
        canActivate: segmentGuards,
        resolve: { tourId: tourIdResolver, i18n: pageI18nResolver(['common', 'seo', 'tours']) },
        data: { routeId: 'tours' },
      },
      ...toursListRoutes,
      {
        matcher: createTourListMatcher(),
        loadComponent: () =>
          import('./mainComponents/tour-packages/tour-packages').then((m) => m.TourPackages),
        canActivate: segmentGuards,
        resolve: { i18n: pageI18nResolver(['common', 'seo', 'tours']) },
        data: { routeId: 'tours' },
      },
      ...destinationsRoutes,
      {
        matcher: createSegmentMatcher('destinations'),
        loadComponent: () =>
          import('./sharedComponents/destination-component/destination-component').then(
            (m) => m.DestinationComponent,
          ),
        canActivate: segmentGuards,
        resolve: { i18n: pageI18nResolver(['common', 'seo', 'destinations']) },
        data: { routeId: 'destinations' },
      },
      {
        matcher: createBookingSuccessMatcher(),
        loadComponent: () =>
          import('./mainComponents/booking-success-page/booking-success-page.component').then(
            (m) => m.BookingSuccessPageComponent,
          ),
        canActivate: segmentGuards,
        data: { routeId: 'bookingSuccess' },
      },
      {
        matcher: createBookingMatcher(),
        loadComponent: () =>
          import('./sharedComponents/booking-component/booking-component').then(
            (m) => m.BookingComponent,
          ),
        canActivate: segmentGuards,
        data: { routeId: 'booking' },
      },
      ...contactRoutes,
      {
        matcher: createSegmentMatcher('contact'),
        loadComponent: () =>
          import('./sharedComponents/contact-us-component/contact-us-component').then(
            (m) => m.ContactUsComponent,
          ),
        canActivate: segmentGuards,
        resolve: { i18n: pageI18nResolver(['common', 'seo', 'contact']) },
        data: { routeId: 'contact' },
      },
      ...testimonialsRoutes,
      {
        matcher: createSegmentMatcher('testimonials'),
        loadComponent: () =>
          import('./sharedComponents/testimonial/testimonial').then((m) => m.Testimonial),
        canActivate: segmentGuards,
        resolve: { i18n: pageI18nResolver(['common', 'seo']) },
        data: { routeId: 'testimonials' },
      },
      ...guidesRoutes,
      ...restaurantRoutes,
      {
        matcher: createSegmentMatcher('restaurant'),
        loadComponent: () =>
          import('./mainComponents/resturant-component/resturant-component').then(
            (m) => m.ResturantComponent,
          ),
        canActivate: segmentGuards,
        resolve: { i18n: pageI18nResolver(['common', 'seo']) },
        data: { routeId: 'restaurant' },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./sharedComponents/not-found/not-found.component').then(
            (m) => m.NotFoundComponent,
          ),
        data: { notFound: true },
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./sharedComponents/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { notFound: true },
  },
];
