import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import {
  TourDetails,
  TourDetailsComponent,
} from '../../../../sharedComponents/tour-details-component/tour-details-component';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import toursData from '../../../../databaseJson/tours.json';
import { CountryService } from '../../../../Services/country.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';

@Component({
  selector: 'app-kandy-day-tour-component',
  imports: [
    CommonModule,
    RouterModule,
    TourDetailsComponent,
    PackageItemComponent,
  ],
  templateUrl: './kandy-day-tour-component.html',
  styleUrl: './kandy-day-tour-component.css',
})
export class KandyDayTourComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/img/onedayTour/kandy/1.jpg',
    'assets/img/onedayTour/kandy/2.jpg',
    'assets/img/onedayTour/kandy/3.jpg',
    'assets/img/onedayTour/kandy/4.jpg',
    'assets/img/onedayTour/kandy/5.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

  tour = {
    title: 'Sri Lanka Kandy One Day Tour',
    description:
      'Experience the cultural heart of Sri Lanka with a full-day guided tour to Kandy, including elephants, temples, tea, and scenic views.',
    duration: 'One Day',
    persons: '20 Persons',
    filecode: 'kandy-day-tour',
    overview: `
            This one-day trip to Kandy takes you through Sri Lanka’s cultural capital.
            Visit the Millennium Elephant Foundation or Pinnawala Elephant Orphanage,
            explore the sacred Temple of the Tooth Relic, enjoy a tea factory and plantation visit,
            relax by Kandy Lake and View Point, and optionally stop at a herbal and spice garden.
            Perfect for travelers seeking culture, nature, and tradition in a single day.
              `,
    tourType: 'Day Tour',

    itinerary: [
      {
        day: 1,
        title: 'Kandy Day Tour Itinerary',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Kandy Day Tour Itinerary',
              icon: 'fa-car',
              color: '#f39c12',
            },
            description:
              'Observe elephants up close and learn about elephant care and conservation.',
            image: 'assets/img/onedayTour/kandy/3.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title:
                'Millennium Elephant Foundation / Pinnawala Elephant Orphanage',
              icon: 'fa-elephant',
              color: '#8e44ad',
            },
            description:
              'Observe elephants up close and learn about elephant care and conservation.',
            image: 'assets/img/onedayTour/kandy/1.jpg',
          },
          {
            type: 'Activity',
            title: {
              title: 'Temple of the Sacred Tooth Relic',
              icon: 'fa-gopuram',
              color: '#c0392b',
            },
            description:
              'Visit the most sacred Buddhist temple in Sri Lanka, located in the heart of Kandy.',
            image: 'assets/img/onedayTour/kandy/3.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Tea Factory & Tea Plantation',
              icon: 'fa-leaf',
              color: '#27ae60',
            },
            description:
              'Explore a tea factory and plantation and learn how world-famous Ceylon tea is produced.',
            image: 'assets/img/onedayTour/kandy/5.jpg',
          },
          {
            type: 'Sightseeing',
            title: {
              title: 'Kandy Lake & View Point',
              icon: 'fa-water',
              color: '#2980b9',
            },
            description:
              'Enjoy scenic views of Kandy city and relax by the picturesque Kandy Lake.',
            image: 'assets/img/onedayTour/kandy/6.jpg',
          },
          {
            type: 'Optional visit',
            title: {
              title: 'Herbal & Spice Garden',
              icon: 'fa-seedling',
              color: '#16a085',
            },
            description:
              'Optional visit to a herbal and spice garden to learn about Sri Lankan spices and herbs.',
            image: 'assets/img/onedayTour/kandy/7.jpg',
          },
        ],
      },
    ],

    includes: [
    'All attraction entrance fees',
    'Highway tickets and parking fees',
    'English speaking professional driver',
    'Private air-conditioned vehicle',
    ],
    excludes: ['Food & Drinks', 'Entrance & Activities Fees'],
  };

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

  constructor(
    private router: Router,
    private http: HttpClient,
    private countryService: CountryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
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
        toursData.multiDayTours
      );

      this.selectedTours = this.multiDayTours
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      this.intervalId = setInterval(() => this.nextImage(), 3000);
    } catch (error) {
      console.error('Client-side load error:', error);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
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

  bookNow() {
    if (isPlatformBrowser(this.platformId)) {
      const barcode = 'kandy-day-tour';
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
