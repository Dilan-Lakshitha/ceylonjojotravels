import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';
import { TourDetails, TourDetailsComponent } from '../../../../sharedComponents/tour-details-component/tour-details-component';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../../../Services/country.service';
import toursData from '../../../../databaseJson/tours.json';

@Component({
  selector: 'app-two-days-tour-plus',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TourDetailsComponent,
    PackageItemComponent,
  ],
  templateUrl: './two-days-tour-plus.html',
  styleUrl: './two-days-tour-plus.css'
})
export class TwoDaysTourPlus  implements OnInit, OnDestroy{

  images: string[] = [
    'assets/img/2daysTours/1.jpeg',
    'assets/img/2daysTours/2.jpeg',
    'assets/img/2daysTours/3.jpeg',
    'assets/img/2daysTours/4.jpg',
    'assets/img/2daysTours/5.jpg',
    'assets/img/2daysTours/6.jpeg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

tour = {
  title: '2 Day Sri Lanka Private Tour – Ella, Kandy & Udawalawa Safari | Airport Drop',
  description:
    'Discover Sri Lanka’s wildlife, scenic hill country and cultural heritage in this 2-day private tour ending at the airport or your hotel.',
  duration: '2 Days',
  persons: 'Private Tour (1-20 Persons)',
  filecode: '2-day-ella-kandy-private-tour-sri-lanka',
  overview: `Experience an unforgettable 2-day journey through Sri Lanka’s wildlife, hill country and cultural capital.
  On day one, visit the Udawalawa Elephant Transit Home before heading to Ella to explore Nine Arch Bridge, Little Adam’s Peak, Flying Ravana and Ravana Falls.
  On day two, travel through the scenic hills to Ramboda Falls and Ambuluwawa Tower before discovering the sacred Temple of the Tooth in Kandy and Pinnawala Elephant Orphanage.
  This private tour ends conveniently at the airport or your hotel.`,

  tourType: 'Round Tour',

  itinerary: [
    {
      day: 1,
      title: 'Udawalawa & Ella Adventure',
      activities: [
        {
          type: 'Wildlife Experience',
          title: {
            title: 'Udawalawa Elephant Transit Home',
            icon: 'fa-paw',
            color: '#27ae60',
          },
          description:
            'Visit the Udawalawa Elephant Transit Home to observe rescued baby elephants being cared for and rehabilitated before returning to the wild.',
          image: 'assets/img/2daysTours/udawalawa.jpg',
        },
        {
          type: 'Scenic Visit',
          title: {
            title: 'Nine Arch Bridge',
            icon: 'fa-train',
            color: '#8e44ad',
          },
          description:
            'Explore the iconic Nine Arch Bridge in Ella, surrounded by lush greenery and breathtaking hill country views.',
          image: 'assets/img/2daysTours/nine-arch.jpg',
        },
        {
          type: 'Hiking',
          title: {
            title: 'Little Adam’s Peak',
            icon: 'fa-hiking',
            color: '#f39c12',
          },
          description:
            'Enjoy a short scenic hike to Little Adam’s Peak for panoramic views of Ella Gap and the surrounding tea plantations.',
          image: 'assets/img/2daysTours/little-adams.jpg',
        },
        {
          type: 'Adventure',
          title: {
            title: 'Flying Ravana Zip Line',
            icon: 'fa-bolt',
            color: '#e74c3c',
          },
          description:
            'Experience thrilling zip-lining at Flying Ravana Adventure Park overlooking the stunning Ella landscape.',
          image: 'assets/img/2daysTours/flying-ravana.jpg',
        },
        {
          type: 'Waterfall Visit',
          title: {
            title: 'Ravana Falls',
            icon: 'fa-water',
            color: '#2980b9',
          },
          description:
            'Visit the beautiful Ravana Falls, one of Sri Lanka’s most famous waterfalls located near Ella.',
          image: 'assets/img/2daysTours/ravana-falls.jpg',
        }
      ],
    },
    {
      day: 2,
      title: 'Hill Country & Kandy Cultural Tour',
      activities: [
        {
          type: 'Waterfall Visit',
          title: {
            title: 'Ramboda Falls',
            icon: 'fa-water',
            color: '#3498db',
          },
          description:
            'Stop at Ramboda Falls, a stunning waterfall nestled in Sri Lanka’s scenic hill country.',
          image: 'assets/img/2daysTours/ramboda.jpg',
        },
        {
          type: 'Scenic Tower Visit',
          title: {
            title: 'Ambuluwawa Tower',
            icon: 'fa-mountain',
            color: '#9b59b6',
          },
          description:
            'Climb the unique Ambuluwawa Biodiversity Tower for breathtaking 360-degree views of the surrounding mountains.',
          image: 'assets/img/2daysTours/ambuluwawa.jpg',
        },
        {
          type: 'Cultural Visit',
          title: {
            title: 'Temple of the Sacred Tooth Relic',
            icon: 'fa-place-of-worship',
            color: '#d35400',
          },
          description:
            'Visit the sacred Temple of the Tooth in Kandy, one of the most important Buddhist sites in the world.',
          image: 'assets/img/2daysTours/temple-tooth.jpg',
        },
        {
          type: 'Wildlife Experience',
          title: {
            title: 'Pinnawala Elephant Orphanage',
            icon: 'fa-paw',
            color: '#16a085',
          },
          description:
            'Observe elephants bathing and feeding at the famous Pinnawala Elephant Orphanage.',
          image: 'assets/img/2daysTours/pinnawala.jpg',
        }
      ],
    },
  ],

  includes: [
    'Air-Conditioned Private Vehicle',
    'English Speaking Professional Driver',
    "Driver's Accommodation & Meals",
    'Pickup & Airport/Hotel Drop Off',
    'Fuel & Parking Fees',
    '24 Hours Service',
    'Unlimited Mileage for the entire tour',
  ],

  excludes: [
    'Entrance & Activity Fees',
    'Food & Drinks',
    'Accommodation (Can be arranged upon request)'
  ],
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
    console.log('Loading price for filecode:', filecode, 'and country:', this.userCountry);
    
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
      const barcode = '2-day-ella-kandy-private-tour-sri-lanka';
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
