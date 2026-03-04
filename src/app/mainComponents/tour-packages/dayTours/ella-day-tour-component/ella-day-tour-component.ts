import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TourDetails, TourDetailsComponent } from '../../../../sharedComponents/tour-details-component/tour-details-component';
import toursData from '../../../../databaseJson/tours.json';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../../../Services/country.service';

@Component({
  selector: 'app-two-day-tour-component',
  standalone: true,
  imports: [CommonModule, RouterModule, TourDetailsComponent,PackageItemComponent],
  templateUrl: './ella-day-tour-component.html',
  styleUrls: ['./ella-day-tour-component.css'],
})
export class EllaDayTourComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/img/onedayTour/ella/1.jpg',
    'assets/img/onedayTour/ella/2.jpg',
    'assets/img/onedayTour/ella/3.jpg',
    'assets/img/onedayTour/ella/4.jpg',
    'assets/img/onedayTour/ella/5.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

  tour = {
    title: 'Sri Lanka Ella One Day Tour',
    description:
      'Experience the beauty of Ella with one day full of adventure, culture, and relaxation.',
    duration: 'one Day',
    persons: '20 Persons',
    filecode: "ella-day-tour",
    overview: `Discover the beauty of Sri Lanka with our unforgettable tour, featuring the iconic Ella Nine Arches Bridge, where you can marvel at the scenic train crossing. Visit the Udawalawe Elephant Orphanage to observe rescued elephants up close. Experience the natural splendor of Ravana Falls, one of the island’s most impressive waterfalls. Hike up Little Adam’s Peak for stunning panoramic views, capturing the essence of Sri Lanka’s highlands. Complete your adventure with a mini train ride through Ella’s picturesque landscapes, creating lasting memories of this enchanting journey.`,
    tourType: 'Day Tour',

    itinerary: [
      {
        day: 1,
        title: 'Nine Arches Bridge',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Nine Arches Bridge',
              icon: 'fa-hiking',
              color: '#f39c12',
            },
            description:
              'The majestic Nine Arch Bridge is one of the many reasons for that. The glorious Nine Arch Bridge between Ella and Demodara station is one of the engineering marvels in the early 20th century',
            image: 'assets/img/onedayTour/ella/1.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Ella Train Trips',
              icon: 'fa-train',
              color: '#063764ff',
            },
            description:
              'Ella train ride is the most beautiful train ride in Sri Lanka, if not in the world! Board the train and experience breathtaking views of lush green tea plantations, mountains, viaducts, valleys etc.',
            image: 'assets/img/onedayTour/ella/3.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Little Adams Peak',
              icon: 'fa-leaf',
              color: '#0f6935ff',
            },
            description:
              'It is 1141 m in height and from the entrance it takes up to 30-45 min for the hike. Views from the summit are incredible. 360 degrees panoramic views.',
            image: 'assets/img/onedayTour/ella/6.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Ravana waterfall',
              icon: 'fa-water',
              color: '#8e44ad',
            },
            description:
              'Ravana Falls, one of the widest falls in the country.The falls are quite impressive, and you can climb over some of the rocks to get a closer look.',
            image: 'assets/img/onedayTour/ella/2.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'elephant orphanage udawalawa',
              icon: 'fa-elephant',
              color: '#8e44ad',
            },
            description:
              '4th Stop: You are able to observe an animated group of around 20 or 30 juvenile and teenage pachyderms, who are fed four times a day.',
            image: 'assets/img/onedayTour/ella/7.jpg',
          },
        ],
      },
    ],

    includes: [
      'Air-Conditioned Private Vehicle',
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
    if (this.intervalId) {
      clearInterval(this.intervalId);
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
      const barcode = 'ella-day-tour';
      localStorage.setItem('tour', JSON.stringify(this.tour));
      localStorage.setItem('filecode', barcode);
      localStorage.setItem('image', this.images[0]);

      this.router.navigate(['/booking',barcode], {
        state: {
          tour: this.tour,
          barcode: barcode,
          Image: this.images[0],
        },
      });
    }
  }
}
