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
import {
  createBookingMatcher,
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

export const routes: Routes = [
  // Root → English home
  { path: '', pathMatch: 'full', redirectTo: 'en' },

  // Legacy English paths → new localized URLs
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
        data: { routeId: 'about' },
      },
      {
        matcher: createSegmentMatcher('services'),
        component: ServiceComponent,
        data: { routeId: 'services' },
      },
      {
        matcher: createTourDetailMatcher(),
        component: TourDetailPageComponent,
        resolve: { tourId: tourIdResolver },
        data: { routeId: 'tours' },
      },
      {
        matcher: createTourListMatcher(),
        component: TourPackages,
        data: { routeId: 'tours' },
      },
      {
        matcher: createSegmentMatcher('destinations'),
        component: DestinationComponent,
        data: { routeId: 'destinations' },
      },
      {
        matcher: createBookingMatcher(),
        component: BookingComponent,
        data: { routeId: 'booking' },
      },
      {
        matcher: createSegmentMatcher('contact'),
        component: ContactUsComponent,
        data: { routeId: 'contact' },
      },
      {
        matcher: createSegmentMatcher('testimonials'),
        component: Testimonial,
        data: { routeId: 'testimonials' },
      },
      {
        matcher: createSegmentMatcher('guides'),
        component: TravelGuides,
        data: { routeId: 'guides' },
      },
      {
        matcher: createSegmentMatcher('restaurant'),
        component: ResturantComponent,
        data: { routeId: 'restaurant' },
      },
    ],
  },

  { path: '**', redirectTo: 'en' },
];
