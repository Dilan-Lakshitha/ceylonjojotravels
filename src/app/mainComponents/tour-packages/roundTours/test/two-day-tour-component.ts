import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
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
  selector: 'app-two-day-tour-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TourDetailsComponent,
    PackageItemComponent,
  ],
  templateUrl: './two-day-tour-component.html',
  styleUrls: ['./two-day-tour-component.css'],
})
export class TwoDayTourComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/img/2daysTours/bu73qw3nuu3obcvpsegn.jpg',
    'assets/img/2daysTours/ctqieqx5ojk33b3sg7zv.jpg',
    'assets/img/2daysTours/ee9i4pplrqkjewusnhko.jpg',
    'assets/img/2daysTours/imbkh8kscrihzyrtdllf.jpg',
    'assets/img/2daysTours/himbgjcj6zckm6de1mhe.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

  tour = {
    title: 'Sri Lanka Two Days Tour',
    description:
      'Experience the beauty of Sri Lanka with 2 days full of adventure, culture, and relaxation.',
    duration: '2 Days',
    persons: '20 Persons',
    filecode: 'twodaystours',
    overview: `Experience the best of Sigiriya and Kandy on this 2 day private tour with deluxe accommodation(Half Borad) and a dedicated tour guide. 
    Explore Sigiriya's iconic Lion Rock, the enchanting Dambulla Golden Temple, the charming Hiriwadunna village, and an exhilarating wild elephant safari.
    In Kandy, visit the sacred Tooth Relic Temple, stroll along the scenic Kandy Lake, immerse yourself in the beauty of the Peradeniya Botanical Garden, and admire the historic Mathale Hindu Temple. 
    This unforgettable journey combines cultural, spiritual, and natural wonders, promising a perfect blend of adventure and relaxation.`,
    tourType: 'Round Tour',

    itinerary: [
      {
        day: 1,
        title: 'Arrival  & Sigirya Lion Rock',
        activities: [
          {
            type: 'Arrival ',
            title: { title: 'Arrival ', icon: 'fa-plane', color: '#2c3e50' },
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Sigiriya Lion Rock',
              icon: 'fa-hiking',
              color: '#f39c12',
            },
            description:
              'Sigiriya, a UNESCO World Heritage Site in Sri Lanka, features the iconic Lion Rock fortress. Renowned for ancient frescoes, stunning views, and rich history, its a must-visit cultural marvel.',
            image: 'assets/img/2daysTours/imbkh8kscrihzyrtdllf.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Dambulla Cave Temple',
              icon: 'fa-hiking',
              color: '#f39c12',
            },
            description:
              'Dambulla Cave Temple, a UNESCO World Heritage Site, is Sri Lanka s largest cave temple complex. It features stunning Buddha statues, intricate frescoes, and sacred relics within five ancient caves.',
            image: 'assets/img/2daysTours/wyusgewmwt4rs5djeqnh.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Hiriwadunna Village & Lake Adventure',
              icon: 'fa-leaf',
              color: '#8e44ad',
            },
            description:
              'The Hiriwadunna Village Tour offers an authentic glimpse into rural Sri Lankan life. Enjoy a bullock cart ride, boat safari, and traditional village meals while exploring lush landscapes.',
            image: 'assets/img/2daysTours/ee9i4pplrqkjewusnhko.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Habarana Elephant Safari',
              icon: 'fa-leaf',
              color: '#8e44ad',
            },
            description:
              "The Habarana Elephant Safari is a thrilling adventure in Sri Lanka's wilderness. Spot wild elephants, diverse wildlife, and lush landscapes on a jeep safari in this serene, nature-rich haven.",
            image: 'assets/img/2daysTours/trpcuc5klgd2n9eugdeg.jpg',
          },
          {
            type: 'Accommodation',
            title: {
              title: 'Sigiriya - HB Deluxe Accommodation',
              icon: 'fa-hotel',
              color: '#27ae60',
            },
            description: 'Overnight Stay in Sigiriya - HB Deluxe Accommodation',
            image: 'assets/img/2daysTours/uodwqeongrw5pyubbddc.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom', 'Dinner'],
          },
        ],
      },
      {
        day: 2,
        title: 'Sigiriya & Dambulla',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Mathale Hindu Kovil',
              icon: 'fa-mountain',
              color: '#e74c3c',
            },
            description:
              'The Matale Hindu Kovil, also known as Sri Muthumariamman Temple, is a vibrant Dravidian-style temple. Adorned with intricate carvings and colorful statues, it is a sacred site for Hindu festivals.',
            image: 'assets/img/2daysTours/b2qacfr5t6j0obdyl7bb.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Kandy Lake',
              icon: 'fa-leaf',
              color: '#8e44ad',
            },
            description:
              'Kandy Lake, an artificial lake in the heart of Kandy, offers serene views and a tranquil atmosphere. Surrounded by lush greenery and historic landmarks, it’s perfect for leisurely strolls.',
            image: 'assets/img/2daysTours/ctqieqx5ojk33b3sg7zv.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Temple of the Tooth Museum',
              icon: 'fa-place-of-worship',
              color: '#2980b9',
            },
            description:
              'The Temple of the Tooth Relic in Kandy, a UNESCO World Heritage Site, houses a sacred tooth of Lord Buddha. This revered temple is a spiritual hub, featuring stunning architecture and vibrant rituals.',
            image: 'assets/img/2daysTours/bu73qw3nuu3obcvpsegn.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Peradeniya Royal Botanical Garden',
              icon: 'fa-shopping-basket',
              color: '#16a085',
            },
            description:
              'Peradeniya Botanical Garden, near Kandy, is Sri Lanka s largest botanical garden. Renowned for diverse flora, it features a stunning orchid house, giant Javan fig tree, and picturesque landscapes',
            image: 'assets/img/2daysTours/himbgjcj6zckm6de1mhe.jpg',
          },
        ],
      },
    ],

    includes: [
      'Air Conditioned Private Vehicle',
      'English Speaking Professional Driver',
      "Driver's Accommodation & Meals",
      'Pickup & Drop Off',
      'Fuel & Parking Fees',
      '24 Hours Service',
      'Unlimited Mileage/Kilometer for entire round tour',
      'Your Accommodation',
    ],
    excludes: ['Food & Drinks', 'Entrance & Activities Fees'],
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private countryService: CountryService,
    @Inject(PLATFORM_ID) private platformId: Object
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
        this.multiDayTours = await this.loadToursWithPrices(toursData.multiDayTours);
        this.selectedTours = this.multiDayTours
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        this.intervalId = setInterval(() => this.nextImage(), 3000);
      } catch (err) {
        console.error('Client load failed:', err);
      }
    }

    async loadToursWithPrices(tours: any[]) {
    return Promise.all(
      tours.map(async (tour) => {
        const price = await this.loadPrice(tour.filecode);
        return { ...tour, price };
      })
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
        next: (data: any) => resolve(data?.price?.[1] ?? 0),
        error: () => {
          this.http.get(defaultFile).subscribe({
            next: (data: any) => resolve(data?.price?.[1] ?? 0),
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
      const barcode = 'twodaystours';
      localStorage.setItem('tour', JSON.stringify(this.tour));
      localStorage.setItem('filecode', barcode);
      localStorage.setItem('image', this.images[0]);

      this.router.navigate(['/booking'], {
        state: {
          tour: this.tour,
          barcode: barcode,
          Image: this.images[0],
        },
      });
    }
  }
}
