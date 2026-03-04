import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TourDetails, TourDetailsComponent } from '../../../../sharedComponents/tour-details-component/tour-details-component';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../../../Services/country.service';
import toursData from '../../../../databaseJson/tours.json';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';

@Component({
  selector: 'app-galle-day-tour',
  standalone: true,
  imports: [CommonModule, RouterModule, TourDetailsComponent,PackageItemComponent],
  templateUrl: './galle-day-tour.html',
  styleUrl: './galle-day-tour.css'
})
export class GalleDayTour implements OnInit, OnDestroy{
images: string[] = [
    'assets/img/onedayTour/Galle/1.jpg',
    'assets/img/onedayTour/Galle/2.jpg',
    'assets/img/onedayTour/Galle/3.jpg',
    'assets/img/onedayTour/Galle/4.jpeg',
    'assets/img/onedayTour/Galle/5.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

  tour = {
    title: 'Sri Lanka Galle One Day Tour',
    description:
      'Enjoy a full-day guided tour to Galle with scenic coastal attractions, cultural landmarks, and memorable experiences.',
    duration: 'one Day',
    persons: '20 Persons',
    filecode: "galle-day-tour",
    overview: `This full-day guided tour to Galle offers a perfect mix of nature, history, and culture.
You will visit the famous Sea Turtle Hatchery, explore the historic Galle Dutch Fort,
enjoy a relaxing Bentota River boat ride, and learn about Sri Lanka’s history at the
Tsunami Memorial and Moonstone Mine Centre.
Ideal for couples, families, and small groups looking for a comfortable and enriching day tour.`,
    tourType: 'Day Tour',

    itinerary: [
      {
        day: 1,
        title: 'Galle Day Tour Itinerary',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Galle Day Tour Itinerary',
              icon: 'fa-hiking',
              color: '#f39c12',
            },
            description:
              'Visit a sea turtle hatchery and learn about conservation efforts while observing different turtle species.',
            image: 'assets/img/onedayTour/Galle/6.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Galle Dutch Fort',
              icon: 'fa-Galle Dutch Fort',
              color: '#8e44ad',
            },
            description:
            'Explore the UNESCO World Heritage site of Galle Dutch Fort, rich in colonial history and stunning ocean views.',
            image: 'assets/img/onedayTour/Galle/5.jpg',
          },
          {
            type: 'Activity',
            title: {
              title: 'Bentota River Boat Ride',
              icon: 'fa-ship',
              color: '#2980b9',
            },
            description:
            'Enjoy a relaxing boat ride along the Bentota River surrounded by mangroves and wildlife.',
             image: 'assets/img/onedayTour/Galle/3.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Tsunami Memorial',
              icon: 'fa-monument',
              color: '#c0392b',
            },
            description:
            'Visit the Tsunami Memorial and learn about the 2004 tsunami and its impact on Sri Lanka.',
            image: 'assets/img/onedayTour/Galle/8.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Moonstone Mine Centre',
              icon: 'fa-gem',
              color: '#f39c12',
            },
            description:
            'Discover how Sri Lanka’s famous moonstones are mined and processed.',
            image: 'assets/img/onedayTour/Galle/9.jpg',
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
      this.multiDayTours = await this.loadToursWithPrices(toursData.multiDayTours);
      this.selectedTours = this.multiDayTours
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      this.intervalId = setInterval(() => this.nextImage(), 3000);
    } catch (error) {
      console.error('Client-side load error:', error);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async loadToursWithPrices(tours: any[]) {
    if (!isPlatformBrowser(this.platformId)) {
      return tours;
    }

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
      const barcode = 'galle-day-tour';
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
