import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TourDetails, TourDetailsComponent } from '../../../../sharedComponents/tour-details-component/tour-details-component';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../../../Services/country.service';
import toursData from '../../../../databaseJson/tours.json';

@Component({
  selector: 'app-eightdays-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TourDetailsComponent,
    PackageItemComponent,
  ],
  templateUrl: './eightdays-component.html',
  styleUrl: './eightdays-component.css'
})
export class EightdaysComponent {
 images: string[] = [
    'assets/img/7dayschange/2.jpeg',
    'assets/img/7dayschange/1.jpeg',
    'assets/img/7dayschange/w3a48osbcocecoaaq9hd.jpg',
    'assets/img/7dayschange/tijr5ztiozgdesbxotm4.jpg',
    'assets/img/7dayschange/dqzhbtiaqzhf0hxbbrar.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

  tour = {
    title: '8 Day Sri Lanka Private Tour | Safari, Culture, Hill Country & Beach',
    description:
      'An unforgettable 8 day private Sri Lanka tour covering Wilpattu Safari, Anuradhapura, Sigiriya, Kandy, Ella adventures and a relaxing southern beach stay.',
    duration: '8 Days',
    persons: '1-20 Persons',
    filecode: '8-day-sri-lanka-private-tour',
    overview: `Discover Sri Lanka’s wildlife, ancient kingdoms, scenic mountains and golden beaches in one perfectly balanced 8 day journey. 
  This tour combines safari adventure, UNESCO heritage sites, hill country landscapes, tea plantations, waterfalls and relaxing coastal experiences with half board accommodation and private transportation.`,

    tourType: 'Round Tour',

    itinerary: [

      {
        day: 1,
        title: 'Airport / Hotel – Wilpattu',
        activities: [
          {
            type: 'Safari',
            title: { title: 'Wilpattu National Park Safari', icon: 'fa-paw', color: '#27ae60' },
            description:
              'Explore Sri Lanka’s largest national park on a 5-hour 4x4 jeep safari. Spot leopards, sloth bears, elephants, deer, crocodiles and diverse birdlife.',
            image: 'assets/img/8daysTours/wilpattu.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Thimbiri Wewa Resort – Wilpattu', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay at Thimbiri Wewa Resort Wilpattu (or similar). Half Board basis.',
            image: 'assets/img/8daysTours/wilpattu-hotel.jpg',
            extra: ['Dinner Included', 'Star Class Hotel'],
          },
        ],
      },

      {
        day: 2,
        title: 'Wilpattu – Anuradhapura – Sigiriya',
        activities: [
          {
            type: 'Religious Visit',
            title: { title: 'Sri Maha Bodhi Temple', icon: 'fa-place-of-worship', color: '#8e44ad' },
            description:
              'Visit the sacred Sri Maha Bodhi Tree in Anuradhapura.',
            image: 'assets/img/8daysTours/sri-maha-bodhi.jpg',
          },
          {
            type: 'Historical Visit',
            title: { title: 'Ruwanweli Maha Seya', icon: 'fa-landmark', color: '#e67e22' },
            description:
              'Explore one of Sri Lanka’s most sacred Buddhist monuments.',
            image: 'assets/img/8daysTours/ruwanweli.jpg',
          },
          {
            type: 'Scenic Hike',
            title: { title: 'Pidurangala Rock Sunset', icon: 'fa-mountain', color: '#e74c3c' },
            description:
              'Climb Pidurangala Rock for breathtaking sunset views.',
            image: 'assets/img/8daysTours/pidurangala.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Fresco Water Villa – Sigiriya', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay at Fresco Water Villa (or similar).',
            image: 'assets/img/8daysTours/fresco.jpg',
            extra: ['Breakfast & Dinner Included', '3.5 Star Hotel'],
          },
        ],
      },

      {
        day: 3,
        title: 'Sigiriya Cultural Triangle',
        activities: [
          {
            type: 'UNESCO Site',
            title: { title: 'Sigiriya Lion Rock Fortress', icon: 'fa-mountain', color: '#c0392b' },
            description:
              'Climb the UNESCO-listed Sigiriya Rock Fortress.',
            image: 'assets/img/8daysTours/sigiriya.jpg',
          },
          {
            type: 'Village Experience',
            title: { title: 'Hiriwadunna Village Tour', icon: 'fa-leaf', color: '#27ae60' },
            description:
              'Experience authentic rural Sri Lankan village life.',
            image: 'assets/img/8daysTours/village.jpg',
          },
          {
            type: 'Safari',
            title: { title: 'Minneriya Safari', icon: 'fa-paw', color: '#2ecc71' },
            description:
              'Enjoy a 4x4 jeep safari famous for elephant gatherings.',
            image: 'assets/img/8daysTours/minneriya.jpg',
          },
          {
            type: 'Wellness',
            title: { title: 'Ayurveda Massage', icon: 'fa-spa', color: '#9b59b6' },
            description:
              'Relax with a traditional herbal oil massage.',
            image: 'assets/img/8daysTours/ayurveda.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Fresco Water Villa – Sigiriya', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay at Fresco Water Villa (or similar).',
            image: 'assets/img/8daysTours/fresco.jpg',
            extra: ['Breakfast & Dinner Included', '3.5 Star Hotel'],
          },
        ],
      },

      {
        day: 4,
        title: 'Sigiriya – Kandy',
        activities: [
          {
            type: 'Cultural Visit',
            title: { title: 'Matale Spice Garden', icon: 'fa-seedling', color: '#32CD32' },
            description:
              'Discover Sri Lanka’s famous spices and herbs.',
            image: 'assets/img/8daysTours/spice.jpg',
          },
          {
            type: 'UNESCO Site',
            title: { title: 'Temple of the Sacred Tooth Relic', icon: 'fa-place-of-worship', color: '#2980b9' },
            description:
              'Visit Sri Lanka’s most sacred Buddhist temple in Kandy.',
            image: 'assets/img/8daysTours/tooth-temple.jpg',
          },
          {
            type: 'Cultural Show',
            title: { title: 'Kandy Cultural Dance Show', icon: 'fa-theater-masks', color: '#e74c3c' },
            description:
              'Enjoy traditional Kandyan dance performances.',
            image: 'assets/img/8daysTours/cultural-show.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Hotel Topaz – Kandy', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay at Hotel Topaz (or similar).',
            image: 'assets/img/8daysTours/kandy-hotel.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          },
        ],
      },

      {
        day: 5,
        title: 'Kandy – Nuwara Eliya – Ella',
        activities: [
          {
            type: 'Tea Experience',
            title: { title: 'Blue Field Tea Factory', icon: 'fa-mug-hot', color: '#8B4513' },
            description:
              'Learn how world-famous Ceylon tea is produced.',
            image: 'assets/img/8daysTours/tea-factory.jpg',
          },
          {
            type: 'Nature',
            title: { title: 'Ramboda Waterfall', icon: 'fa-water', color: '#3498db' },
            description:
              'Visit one of Sri Lanka’s tallest waterfalls.',
            image: 'assets/img/8daysTours/ramboda.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Oak Ray Ella Gap Hotel', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay in Ella.',
            image: 'assets/img/8daysTours/ella-hotel.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          },
        ],
      },

      {
        day: 6,
        title: 'Ella – Hikkaduwa',
        activities: [
          {
            type: 'Landmark',
            title: { title: 'Nine Arch Bridge', icon: 'fa-bridge', color: '#A9A9A9' },
            description:
              'Visit the famous colonial-era railway bridge.',
            image: 'assets/img/8daysTours/ninearch.jpg',
          },
          {
            type: 'Wildlife',
            title: { title: 'Elephant Transit Home', icon: 'fa-elephant', color: '#2ecc71' },
            description:
              'Observe rescued baby elephants.',
            image: 'assets/img/8daysTours/elephant-transit.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Refresh Hotel – Hikkaduwa', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay in Hikkaduwa.',
            image: 'assets/img/8daysTours/hikkaduwa-hotel.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          },
        ],
      },

      {
        day: 7,
        title: 'Hikkaduwa Beach',
        activities: [
          {
            type: 'Beach Relaxation',
            title: { title: 'Hikkaduwa Beach', icon: 'fa-umbrella-beach', color: '#f1c40f' },
            description:
              'Relax on golden beaches and swim in the Indian Ocean.',
            image: 'assets/img/8daysTours/hikkaduwa-beach.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Refresh Hotel – Hikkaduwa', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay in Hikkaduwa.',
            image: 'assets/img/8daysTours/hikkaduwa-hotel.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          }
        ],
      },

      {
        day: 8,
        title: 'water Activities & Departure',
        activities: [
          {
            type: 'Wildlife Conservation',
            title: {
              title: 'Koggala Turtle Hatchery Visit',
              icon: 'fa-water',
              color: '#27ae60',
            },
            description:
              'Visit the Koggala Turtle Hatchery and Conservation Center where endangered sea turtles are protected and rehabilitated. Learn about Sri Lanka’s marine conservation efforts, observe baby turtles in hatchery pools and understand how rescued turtles are released back into the Indian Ocean.',
            image: 'assets/img/10daysTours/koggala-turtle-hatchery.jpg',
          },
          {
            type: 'Boat Safari',
            title: {
              title: 'Madu River Boat Safari',
              icon: 'fa-ship',
              color: '#16a085',
            },
            description:
              'Experience a scenic boat safari through the mangrove forests and small islands of the Madu River. Visit traditional cinnamon plantations and explore one of Sri Lanka’s most beautiful wetland ecosystems.',
            image: 'assets/img/10daysTours/madu-river.jpg',
          }
        ],
      },
    ],

    includes: [
      'Air-Conditioned Private Vehicle',
      'English Speaking Professional Driver',
      'Half Board Accommodation (7 Nights)',
      'Fuel & Parking Fees',
      'Airport Pickup & Drop Off',
    ],

    excludes: [
      'Entrance & Activity Fees',
      'Lunch & Drinks',
      'Personal Expenses',
    ],
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private countryService: CountryService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  get currentImage() {
    return this.images[this.currentIndex];
  }

  get tourForDetails(): TourDetails {
    return {
      title: this.tour.title,
      description: this.tour.description,
      duration: this.tour.duration,
      persons: this.tour.persons,
      price: this.price,
      tourType: this.tour.tourType,
      overview: this.tour.overview,
      itinerary: this.tour.itinerary,
      includes: this.tour.includes,
      excludes: this.tour.excludes,
    };
  }

  get nextImages() {
    return Array.from({ length: 4 }, (_, i) => {
      const index = (this.currentIndex + i + 1) % this.images.length;
      return { src: this.images[index], index };
    });
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number) {
    this.currentIndex = index;
  }

  goToImageFromThumb(index: number) {
    this.currentIndex = index;
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userCountry = await this.countryService.detectCountry();
      this.price = await this.loadPrice(this.tour.filecode);
      this.multiDayTours = await this.loadToursWithPrices(
        toursData.multiDayTours,
      );
      this.selectedTours = this.multiDayTours
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      this.intervalId = setInterval(() => this.nextImage(), 3000);
    } else {
      this.userCountry = 'US';
      this.price = 0;
      this.multiDayTours = toursData.multiDayTours.slice(0, 3);
      this.selectedTours = this.multiDayTours;
    }
  }

  async loadToursWithPrices(tours: any[]) {
    return Promise.all(
      tours.map(async (tour) => {
        const price = await this.loadPrice(tour.filecode);
        return { ...tour, price };
      }),
    );
  }

  loadPrice(filecode: string): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(0);
    }
    const countryFile = `assets/data/${this.userCountry}${filecode}.json`;
    const defaultFile = `assets/data/US${filecode}.json`;

    return new Promise((resolve) => {
      this.http.get(countryFile).subscribe({
        next: (data: any) => resolve(data?.price?.['2'] ?? 0),
        error: () => {
          this.http.get(defaultFile).subscribe({
            next: (data: any) => resolve(data?.price?.['2'] ?? 0),
            error: () => resolve(0)
          });
        }
      });
    });
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  bookNow() {
    if (isPlatformBrowser(this.platformId)) {
      const barcode = '8-day-sri-lanka-private-tour';
      localStorage.setItem('tour', JSON.stringify(this.tour));
      localStorage.setItem('filecode', barcode);
      localStorage.setItem('image', this.images[0]);

      this.router.navigate(['/booking', barcode], {
        state: {
          tour: this.tour,
          barcode: barcode,
          Image: this.images[0],
        },
      });
    }
  }
}
