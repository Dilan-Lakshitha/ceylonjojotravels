import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  TourDetails,
  TourDetailsComponent,
} from '../../../../sharedComponents/tour-details-component/tour-details-component';
import toursData from '../../../../databaseJson/tours.json';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../../../Services/country.service';

@Component({
  selector: 'app-five-days-tour-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TourDetailsComponent,
    PackageItemComponent,
  ],
  templateUrl: './five-days-tour-component.html',
  styleUrls: ['./five-days-tour-component.css'],
})
export class FiveDaysTourComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/img/5daysTours/beqnuxidbmckapjcag2m.jpg',
    'assets/img/5daysTours/fozjxf01vl9yehvucwn2.jpg',
    'assets/img/5daysTours/c8dyxgodivrwf4hxzziq.jpg',
    'assets/img/5daysTours/dp8fjrahvepdlhdudxj0.jpg',
    'assets/img/5daysTours/slqwoimy5yhfgcicn8ob.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

  tour = {
    title: '5 Day Sri Lanka Private Tour | Cultural Heritage, Hill Country & Wildlife Safari',
    description:
      'Explore Sri Lanka in 5 unforgettable days with ancient cities, UNESCO heritage sites, scenic tea plantations, thrilling wildlife safaris and relaxing coastal experiences.',
    duration: '5 Days',
    persons: '1-20 Persons',
    filecode: "5-day-sri-lanka-tour",
    overview: `Discover the highlights of Sri Lanka in this perfectly balanced 5-day private round tour. 
  Travel through the Cultural Triangle, explore Sigiriya Rock Fortress, experience Kandy’s sacred Temple of the Tooth Relic, journey through the misty tea plantations of Nuwara Eliya, enjoy an exciting Udawalawa National Park safari, and unwind along the beautiful South West Coast. 
  With private transportation, experienced English-speaking driver guide, and comfortable accommodation options, this tour offers the ideal combination of culture, nature, wildlife and relaxation — perfect for couples, families and small groups.`,

    tourType: 'Round Tour',

    itinerary: [

      {
        day: 1,
        title: 'Airport to Sigiriya – Elephants & Safari Adventure',
        activities: [
          {
            type: 'Arrival',
            title: { title: 'Airport Pickup', icon: 'fa-plane', color: '#2c3e50' },
            description:
              'Meet your professional driver guide at Bandaranaike International Airport and begin your private Sri Lanka journey heading towards the Cultural Triangle.',
          },
          {
            type: 'Wildlife Experience',
            title: {
              title: 'Pinnawala Elephant Orphanage',
              icon: 'fa-paw',
              color: '#27ae60',
            },
            description:
              'Visit Pinnawala Elephant Orphanage, a renowned sanctuary caring for rescued and orphaned elephants. Observe elephants up close and, depending on timing, witness their memorable river bathing session.',
            image: 'assets/img/5daysTours/7.jpg',
          },
          {
            type: 'Safari',
            title: {
              title: 'Minneriya National Park Safari',
              icon: 'fa-leaf',
              color: '#8e44ad',
            },
            description:
              'Enjoy a thrilling 4x4 jeep safari in Minneriya National Park, famous for “The Gathering” — one of Asia’s largest wild elephant congregations. Spot elephants, deer, buffalo and diverse bird species.',
            image: 'assets/img/5daysTours/24.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Fresco Water Villa – Sigiriya', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay at Fresco Water Villa (or similar).',
            image: 'assets/img/5daysTours/c.jpg',
            extra: ['Breakfast & Dinner Included', '3.5 Star Hotel'],
          },
        ],
      },

      {
        day: 2,
        title: 'Sigiriya to Kandy – Cultural Heritage',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Sigiriya Rock Fortress',
              icon: 'fa-mountain',
              color: '#e74c3c',
            },
            description:
              'Climb the UNESCO-listed Sigiriya Lion Rock Fortress, a 5th-century royal palace rising dramatically above the jungle plains. Explore ancient frescoes, the Mirror Wall and panoramic summit views.',
            image: 'assets/img/6daysTours/sigiriya.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Temple of the Sacred Tooth Relic',
              icon: 'fa-place-of-worship',
              color: '#2980b9',
            },
            description:
              'Visit Sri Dalada Maligawa in Kandy, one of the most sacred Buddhist temples in the world. Witness traditional rituals and admire the temple’s beautiful Kandyan architecture.',
            image: 'assets/img/6daysTours/tooth-temple.jpg',
          },
          {
            type: 'Cultural Experience',
            title: {
              title: 'Kandy Cultural Dance Show',
              icon: 'fa-theater-masks',
              color: '#e74c3c',
            },
            description:
              'Enjoy an evening cultural dance performance featuring traditional Kandyan drumming, fire walking and vibrant costumes that showcase Sri Lanka’s rich artistic heritage.',
            image: 'assets/img/6daysTours/dance-show.jpg',
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
        day: 3,
        title: 'Kandy to Nuwara Eliya – Scenic Tea Country',
        activities: [
          {
            type: 'Nature',
            title: {
              title: 'Royal Botanical Gardens Peradeniya',
              icon: 'fa-tree',
              color: '#16a085',
            },
            description:
              'Explore one of Asia’s finest botanical gardens featuring exotic orchids, towering palm avenues, medicinal plants and beautifully landscaped grounds along the Mahaweli River.',
            image: 'assets/img/6daysTours/botanical.jpg',
          },
          {
            type: 'Nature',
            title: {
              title: 'Ramboda Waterfall',
              icon: 'fa-water',
              color: '#3498db',
            },
            description:
              'Stop at Ramboda Falls, one of Sri Lanka’s tallest waterfalls, surrounded by scenic tea estates and cool mountain air.',
            image: 'assets/img/6daysTours/ramboda.jpg',
          },
          {
            type: 'Tea Experience',
            title: {
              title: 'Tea Factory & Plantation Visit',
              icon: 'fa-mug-hot',
              color: '#8B4513',
            },
            description:
              'Discover how world-famous Ceylon tea is produced from leaf to cup. Walk through lush tea plantations and enjoy a fresh tea tasting session in Sri Lanka’s hill country.',
            image: 'assets/img/6daysTours/tea.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Hotel Grand Tamarind Lake', icon: 'fa-hotel', color: '#16a085' },
            description:
              'Overnight stay at Grand Tamarind Lake (or similar).',
            image: 'assets/img/8daysTours/kandy-hotel.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          },
        ],
      },

      {
        day: 4,
        title: 'Nuwara Eliya to Ella – Mountain Scenery ',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Nine Arches Bridge',
              icon: 'fa-bridge',
              color: '#c0392b',
            },
            description:
              'The majestic Nine Arch Bridge is one of the many reasons for that. The glorious Nine Arch Bridge between Ella and Demodara station is one of the engineering marvels in the early 20th century.',
            image: 'assets/img/7dayschange/yka3mpx2nahiftrb0lpu.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: "Little Adam's Peak",
              icon: 'fa-mountain',
              color: '#8e44ad',
            },
            description:
              'It is 1141 m in height and from the entrance it takes up to 30-45 min for the hike. Views from the summit are incredible. 360 degrees panoramic views with clouds rolling in, is a treat to watch.',
            image: 'assets/img/7dayschange/e7sgetzhdjoahy2h9wgh.jpg',
          },
          {
            type: 'Accommodation',
            title: {
              title: 'Oak Ray Ella Gap Hotel',
              icon: 'fa-hotel',
              color: '#27ae60',
            },
            description:
              'Accommodation in Oak Ray Ella Gap Hotel or Similar - HB Basis',
            image: 'assets/img/7dayschange/nhm6ktdm7nimqwwrgtbm.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom'],
          },
        ],
      },
      {
        day: 5,
        title: 'Udawalawa to South West Coast – River & Conservation',
        activities: [
          {
            type: 'Conservation',
            title: {
              title: 'Sea Turtle Conservation Project',
              icon: 'fa-water',
              color: '#2980b9',
            },
            description:
              'Visit a sea turtle conservation center along the south coast and learn about marine wildlife protection, hatchery programs and rehabilitation efforts.',
            image: 'assets/img/6daysTours/turtle.jpg',
          },
          {
            type: 'Boat Safari',
            title: {
              title: 'Madu River Safari',
              icon: 'fa-ship',
              color: '#3498db',
            },
            description:
              'Enjoy a scenic boat safari through the mangrove forests and small islands of the Madu River. Discover local cinnamon cultivation and diverse wetland wildlife.',
            image: 'assets/img/6daysTours/madu.jpg',
          }
        ],
      }
    ],

    includes: [
      'Air-Conditioned Private Vehicle',
      'English Speaking Professional Driver',
      'Pickup & Airport Drop Off',
      'Fuel & Parking Fees',
      'Unlimited Mileage for entire tour',
    ],

    excludes: [
      'Entrance & Activity Fees',
      'Food & Drinks',
      'Accommodation (Can be arranged upon request)',
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

  get nextImages() {
    return Array.from({ length: 4 }, (_, i) => {
      const index = (this.currentIndex + i + 1) % this.images.length;
      return { src: this.images[index], index };
    });
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
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) {
      this.userCountry = 'US';
      this.price = 0;
      this.multiDayTours = toursData.multiDayTours.slice(0, 3);
      this.selectedTours = this.multiDayTours;
      return;
    }

    try {
      this.userCountry = await this.countryService.detectCountry();
      this.price = await this.loadPrice(this.tour.filecode);
      this.multiDayTours = await this.loadToursWithPrices(
        toursData.multiDayTours,
      );
      this.selectedTours = this.multiDayTours
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      this.intervalId = setInterval(() => this.nextImage(), 3000);
    } catch (error) {
      console.error('Browser data load failed:', error);
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
      const barcode = '5-day-sri-lanka-tour';
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
