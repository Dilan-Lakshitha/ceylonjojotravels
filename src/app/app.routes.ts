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
import { LEGACY_TOUR_PATHS } from './i18n/tour-slug-map';
import { slugForTour } from './i18n/tour-slug-map';

const legacyTourRedirects: Routes = Object.entries(LEGACY_TOUR_PATHS).map(([path, tourId]) => ({
  path,
  redirectTo: `/en/tours/${slugForTour(tourId, 'en')}`,
  pathMatch: 'full' as const,
}));

const segmentGuards = [canonicalSegmentGuard];

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
        data: { routeId: 'home' },
      },
      {
        matcher: createSegmentMatcher('about'),
        loadComponent: () =>
          import('./mainComponents/about-component/about-component').then((m) => m.AboutComponent),
        canActivate: segmentGuards,
        data: { routeId: 'about' },
      },
      {
        matcher: createSegmentMatcher('services'),
        loadComponent: () =>
          import('./mainComponents/service-component/service-component').then(
            (m) => m.ServiceComponent,
          ),
        canActivate: segmentGuards,
        data: { routeId: 'services' },
      },
      {
        matcher: createTourDetailMatcher(),
        loadComponent: () =>
          import('./mainComponents/tour-detail-page/tour-detail-page.component').then(
            (m) => m.TourDetailPageComponent,
          ),
        canActivate: segmentGuards,
        resolve: { tourId: tourIdResolver },
        data: { routeId: 'tours' },
      },
      {
        matcher: createTourListMatcher(),
        loadComponent: () =>
          import('./mainComponents/tour-packages/tour-packages').then((m) => m.TourPackages),
        canActivate: segmentGuards,
        data: { routeId: 'tours' },
      },
      {
        matcher: createSegmentMatcher('destinations'),
        loadComponent: () =>
          import('./sharedComponents/destination-component/destination-component').then(
            (m) => m.DestinationComponent,
          ),
        canActivate: segmentGuards,
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
      {
        matcher: createSegmentMatcher('contact'),
        loadComponent: () =>
          import('./sharedComponents/contact-us-component/contact-us-component').then(
            (m) => m.ContactUsComponent,
          ),
        canActivate: segmentGuards,
        data: { routeId: 'contact' },
      },
      {
        matcher: createSegmentMatcher('testimonials'),
        loadComponent: () =>
          import('./sharedComponents/testimonial/testimonial').then((m) => m.Testimonial),
        canActivate: segmentGuards,
        data: { routeId: 'testimonials' },
      },
      {
        matcher: createSegmentMatcher('guides'),
        loadComponent: () =>
          import('./sharedComponents/travel-guides/travel-guides').then((m) => m.TravelGuides),
        canActivate: segmentGuards,
        data: { routeId: 'guides' },
      },
      {
        matcher: createSegmentMatcher('restaurant'),
        loadComponent: () =>
          import('./mainComponents/resturant-component/resturant-component').then(
            (m) => m.ResturantComponent,
          ),
        canActivate: segmentGuards,
        data: { routeId: 'restaurant' },
      },
    ],
  },

  { path: '**', redirectTo: 'en' },
];
