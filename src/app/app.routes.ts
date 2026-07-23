import { Routes } from '@angular/router';
import { LayoutComponent } from './mainComponents/layout-component/layout-component';
import { HomePageComponent } from './mainComponents/home-page-component/home-page-component';
import { AboutComponent } from './mainComponents/about-component/about-component';
import { ServiceComponent } from './mainComponents/service-component/service-component';
import { TourPackages } from './mainComponents/tour-packages/tour-packages';
import { BookingComponent } from './sharedComponents/booking-component/booking-component';
import { ContactUsComponent } from './sharedComponents/contact-us-component/contact-us-component';
import { DestinationComponent } from './sharedComponents/destination-component/destination-component';
import { Testimonial } from './sharedComponents/testimonial/testimonial';
import { TravelGuides } from './sharedComponents/travel-guides/travel-guides';
import { ResturantComponent } from './mainComponents/resturant-component/resturant-component';
import { TourDetailPageComponent } from './mainComponents/tour-detail-page/tour-detail-page.component';
import { langGuard } from './i18n/lang.guard';
import { canonicalSegmentGuard } from './i18n/canonical-segment.guard';
import { BookingSuccessPageComponent } from './mainComponents/booking-success-page/booking-success-page.component';
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
        component: HomePageComponent,
        data: { routeId: 'home' },
      },
      {
        matcher: createSegmentMatcher('about'),
        component: AboutComponent,
        canActivate: segmentGuards,
        data: { routeId: 'about' },
      },
      {
        matcher: createSegmentMatcher('services'),
        component: ServiceComponent,
        canActivate: segmentGuards,
        data: { routeId: 'services' },
      },
      {
        matcher: createTourDetailMatcher(),
        component: TourDetailPageComponent,
        canActivate: segmentGuards,
        resolve: { tourId: tourIdResolver },
        data: { routeId: 'tours' },
      },
      {
        matcher: createTourListMatcher(),
        component: TourPackages,
        canActivate: segmentGuards,
        data: { routeId: 'tours' },
      },
      {
        matcher: createSegmentMatcher('destinations'),
        component: DestinationComponent,
        canActivate: segmentGuards,
        data: { routeId: 'destinations' },
      },
      {
        matcher: createBookingSuccessMatcher(),
        component: BookingSuccessPageComponent,
        canActivate: segmentGuards,
        data: { routeId: 'bookingSuccess' },
      },
      {
        matcher: createBookingMatcher(),
        component: BookingComponent,
        canActivate: segmentGuards,
        data: { routeId: 'booking' },
      },
      {
        matcher: createSegmentMatcher('contact'),
        component: ContactUsComponent,
        canActivate: segmentGuards,
        data: { routeId: 'contact' },
      },
      {
        matcher: createSegmentMatcher('testimonials'),
        component: Testimonial,
        canActivate: segmentGuards,
        data: { routeId: 'testimonials' },
      },
      {
        matcher: createSegmentMatcher('guides'),
        component: TravelGuides,
        canActivate: segmentGuards,
        data: { routeId: 'guides' },
      },
      {
        matcher: createSegmentMatcher('restaurant'),
        component: ResturantComponent,
        canActivate: segmentGuards,
        data: { routeId: 'restaurant' },
      },
    ],
  },

  { path: '**', redirectTo: 'en' },
];
