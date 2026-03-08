import { Routes } from "@angular/router";
import { LayoutComponent } from "./mainComponents/layout-component/layout-component";
import { HomePageComponent } from "./mainComponents/home-page-component/home-page-component";
import { AboutComponent } from "./mainComponents/about-component/about-component";
import { ServiceComponent } from "./mainComponents/service-component/service-component";
import { TourPackages } from "./mainComponents/tour-packages/tour-packages";
import { SevenDaysTourComponent } from "./mainComponents/tour-packages/roundTours/seven-days-tour-component/seven-days-tour-component";
import { TenDaysTourComponent } from "./mainComponents/tour-packages/roundTours/ten-days-tour-component/ten-days-tour-component";
import { FiveDaysTourComponent } from "./mainComponents/tour-packages/roundTours/five-days-tour-component/five-days-tour-component";
import { EllaDayTourComponent } from "./mainComponents/tour-packages/dayTours/ella-day-tour-component/ella-day-tour-component";
import { GalleDayTour } from "./mainComponents/tour-packages/dayTours/galle-day-tour/galle-day-tour";
import { KandyDayTourComponent } from "./mainComponents/tour-packages/dayTours/kandy-day-tour-component/kandy-day-tour-component";
import { SigiriyaDayTourComponent } from "./mainComponents/tour-packages/dayTours/sigiriya-day-tour-component/sigiriya-day-tour-component";
import { BookingComponent } from "./sharedComponents/booking-component/booking-component";
import { ContactUsComponent } from "./sharedComponents/contact-us-component/contact-us-component";
import { DestinationComponent } from "./sharedComponents/destination-component/destination-component";
import { Testimonial } from "./sharedComponents/testimonial/testimonial";
import { TravelGuides } from "./sharedComponents/travel-guides/travel-guides";
import { ResturantComponent } from "./mainComponents/resturant-component/resturant-component";
import { TwoDaysTourPlus } from "./mainComponents/tour-packages/roundTours/two-days-tour-plus/two-days-tour-plus";
import { SixDaysTour } from "./mainComponents/tour-packages/roundTours/six-days-tour/six-days-tour";
import { EightdaysComponent } from "./mainComponents/tour-packages/roundTours/eightdays-component/eightdays-component";
import { FourdaysTourComponent } from "./mainComponents/tour-packages/roundTours/fourdays-tour-component/fourdays-tour-component";
import { EllaYalaTwoDayTour } from "./mainComponents/tour-packages/roundTours/ella-yala-two-day-tour/ella-yala-two-day-tour";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
        data: {
          title: 'Sundown Tours Sri Lanka | Private & Tailor Made Sri Lanka Tours',
          description: 'Explore Sri Lanka with private tours, tailor-made holiday packages and experienced local driver guides. Discover beaches, wildlife and cultural heritage.',
          keywords: 'Sri Lanka private tours, Sri Lanka tour packages, tailor made Sri Lanka tours'
        }
      },
      {
        path: 'about-us',
        component: AboutComponent,
        data: {
          title: 'About Sundown Tours | Trusted Sri Lanka Travel Agency',
          description: 'Learn about Sundown Tours Sri Lanka, your trusted local tour operator providing customized and private Sri Lanka tours.',
          keywords: 'Sri Lanka travel agency, Sri Lanka tour operator'
        }
      },
      {
        path: 'our-services',
        component: ServiceComponent,
        data: {
          title: 'Our Services | Sundown Tours Sri Lanka',
          description: 'Explore our range of services including private tours, tailor-made holiday packages, chauffeur driven round tours and day trips.',
          keywords: 'Sri Lanka private tours, Sri Lanka tour packages, tailor made Sri Lanka tours'
        }
      },
      {
        path: 'tour-packages',
        component: TourPackages,
        data: {
          title: 'Sri Lanka Tour Packages | Private Round Tours',
          description: 'Discover our customizable Sri Lanka tour packages including round tours, wildlife safaris and beach holidays.',
          keywords: 'Sri Lanka tour packages, Sri Lanka round tours'
        }
      },

      // ROUND TOURS (SEO OPTIMIZED)
      {
        path: '7-day-sri-lanka-tour',
        component: SevenDaysTourComponent,
        data: {
          title: '7 Day Sri Lanka Tour Package | Cultural & Scenic Round Trip',
          description: 'Experience the best of Sri Lanka in 7 days including Sigiriya, Kandy, Ella and Yala safari.',
          keywords: '7 day Sri Lanka tour, Sri Lanka 1 week itinerary'
        }
      },
      {
        path: '10-day-sri-lanka-tour',
        component: TenDaysTourComponent,
        data: {
          title: '10 Day Sri Lanka Tour | Complete Island Exploration',
          description: 'Explore Sri Lanka in 10 days with beaches, wildlife safaris, hill country and cultural heritage sites.',
          keywords: '10 day Sri Lanka tour, Sri Lanka 10 day itinerary'
        }
      },
      // {
      //   path: '2-day-sri-lanka-tour',
      //   component: TwoDayTourComponent,
      //   data: {
      //     title: '2 Day Sri Lanka Tour | Quick Island Experience',
      //     description: 'Experience the highlights of Sri Lanka in just 2 days with our quick private tour package.',
      //     keywords: '2 day Sri Lanka tour, Sri Lanka 2 day itinerary'
      //   }
      // },
      {
        path: '5-day-sri-lanka-tour',
        component: FiveDaysTourComponent,
        data: {
          title: '5 Day Sri Lanka Tour | Balanced Cultural & Scenic Experience',
          description: 'Discover a balanced mix of cultural heritage, scenic beauty and wildlife in 5 days.',
          keywords: '5 day Sri Lanka tour, Sri Lanka 5 day itinerary'
        }
      },

      // DAY TOURS (VERY IMPORTANT KEYWORDS)
      {
        path: 'ella-day-tour',
        component: EllaDayTourComponent,
        data: {
          title: 'Ella Day Tour | Scenic Train & Nine Arch Bridge',
          description: 'Enjoy a private Ella day tour including Nine Arch Bridge, Little Adam’s Peak and Ravana Falls.',
          keywords: 'Ella day tour, Ella private tour'
        }
      },
      {
        path: 'galle-day-tour',
        component: GalleDayTour,
        data: {
          title: 'Galle Day Tour | Galle Fort & Southern Coast',
          description: 'Discover Galle Fort, beaches and southern coastal attractions with our private day tour.',
          keywords: 'Galle day tour, Galle fort tour'
        }
      },
      {
        path: 'kandy-day-tour',
        component: KandyDayTourComponent,
        data: {
          title: 'Kandy Day Tour | Cultural & Scenic Highlights',
          description: 'Experience the cultural and scenic highlights of Kandy including the Temple of the Sacred Tooth Relic and royal gardens.',
          keywords: 'Kandy day tour, Kandy private tour'
        }
      },
      {
        path: 'sigiriya-day-tour',
        component: SigiriyaDayTourComponent,
        data: {
          title: 'Sigiriya Day Tour | Ancient Rock Fortress',
          description: 'Explore the ancient Sigiriya rock fortress and its surrounding gardens with our private day tour.',
          keywords: 'Sigiriya day tour, Sigiriya private tour'
        }
      },

      // OTHER PAGES
      {
        path: 'booking/:filecode',
        component: BookingComponent,
        data: {
          title: 'Book Your Sri Lanka Tour | Private & Customized Travel',
          description: 'Book your private Sri Lanka tour with our customizable packages and expert local guides.',
          keywords: 'Sri Lanka booking, private Sri Lanka tour booking'
        }
      },
      {
        path: 'contact-us',
        component: ContactUsComponent,
        data: {
          title: 'Contact Sundown Tours Sri Lanka',
          description: 'Get in touch with Sundown Tours for customized Sri Lanka tour packages and private travel services.',
          keywords: 'contact Sri Lanka tour company'
        }
      },
      {
        path: 'restaurants-in-sri-lanka',
        component: ResturantComponent,
        data: {
          title: 'Restaurants in Sri Lanka | Best Local Cuisine',
          description: 'Discover the best restaurants in Sri Lanka offering authentic local cuisine and international dishes.',
          keywords: 'Sri Lanka restaurants, best restaurants in Sri Lanka'
        }
      },
      {
        path: 'destinations-sri-lanka',
        component: DestinationComponent,
        data: {
          title: 'Sri Lanka Destinations | Beaches, Wildlife & Cultural Sites',
          description: 'Explore the top Sri Lanka destinations including beaches, wildlife parks and cultural heritage sites.',
          keywords: 'Sri Lanka destinations, best places to visit in Sri Lanka'
        }
      },
      {
        path: 'customer-testimonials',
        component: Testimonial,
        data: {
          title: 'Customer Testimonials | Sundown Tours Sri Lanka',
          description: 'Read testimonials from our satisfied customers who have experienced our private Sri Lanka tours.',
          keywords: 'Sri Lanka tour testimonials, customer reviews'
        }
      },
      {
        path: 'sri-lanka-travel-guides',
        component: TravelGuides,
        data: {
          title: 'Sri Lanka Travel Guides | Expert Insights & Tips',
          description: 'Explore our comprehensive travel guides for Sri Lanka, offering expert insights and practical tips.',
          keywords: 'Sri Lanka travel guides, Sri Lanka travel tips'
        }
      },
      {
        path: '2-day-ella-kandy-private-tour-sri-lanka',
        component: TwoDaysTourPlus,
        data: {
          title: '2 Day Sri Lanka Private Tour – Ella, Kandy & Udawalawa | Airport or Hotel Drop',
          description: 'Book a 2 day Sri Lanka private tour covering Udawalawa Elephant Transit Home, Ella highlights, Ramboda Falls, Ambuluwawa Tower and Kandy Temple of the Tooth. Airport or hotel drop included.',
          keywords: '2 day Sri Lanka tour, Ella Kandy 2 day tour, Sri Lanka private tour, Udawalawa safari tour, Sri Lanka hill country tour'
        }
      },
      {
        path: '2-day-ella-yala-private-tour-sri-lanka',
        component: EllaYalaTwoDayTour,
        data: {
          title: '2 Day Ella & Yala Safari Private Tour | Sri Lanka Wildlife Experience',
          description: 'Enjoy a 2 day private tour covering Ella highlights including Nine Arch Bridge, Little Adam’s Peak and Ravana Falls, followed by an exciting Yala National Park jeep safari to see leopards, elephants and wildlife.',
          keywords: 'Ella Yala safari tour, 2 day Sri Lanka safari tour, Ella Yala private tour, Yala national park safari tour Sri Lanka'
        }
      },
      {
        path: '6-day-sri-lanka-private-tour',
        component: SixDaysTour,
        data: {
          title: '6 Day Sri Lanka Private Tour | Sigiriya, Kandy, Ella & Yala Safari',
          description: 'Explore Sri Lanka in 6 days with a private guided tour covering Sigiriya Rock Fortress, Kandy Temple of the Tooth, Ella hill country, Yala National Park safari and scenic beaches.',
          keywords: '6 day Sri Lanka tour, Sri Lanka 6 day itinerary, Sri Lanka private tour 6 days, Sigiriya Kandy Ella tour, Yala safari tour Sri Lanka'
        }
      },
      {
        path:'4-day-sri-lanka-tour',
        component: FourdaysTourComponent,
        data: {
          title: '4 Day Sri Lanka Tour | Cultural & Scenic Highlights',
          description: 'Experience the best of Sri Lanka in 4 days with a private guided tour covering Sigiriya, Kandy, Ella and Yala safari.',
          keywords: '4 day Sri Lanka tour, Sri Lanka 4 day itinerary'
        }
      },
      {
        path: '8-day-sri-lanka-private-tour',
        component: EightdaysComponent,
        data: {
          title: '8 Day Sri Lanka Private Tour | Wilpattu Safari, Sigiriya, Kandy, Ella & Beach Stay',
          description: 'Discover Sri Lanka in 8 days with a private guided tour covering Wilpattu National Park safari, Anuradhapura ancient city, Sigiriya Rock Fortress, Kandy Temple of the Tooth, Ella hill country and relaxing beach stay in Hikkaduwa.',
          keywords: '8 day Sri Lanka tour, Sri Lanka 8 day itinerary, Sri Lanka private tour 8 days, Wilpattu safari tour, Sigiriya Kandy Ella beach tour'
        }
      },
    ]
  }
];