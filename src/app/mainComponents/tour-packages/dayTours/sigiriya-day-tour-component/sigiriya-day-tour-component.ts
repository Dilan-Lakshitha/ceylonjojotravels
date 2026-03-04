import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TourDetails, TourDetailsComponent } from '../../../../sharedComponents/tour-details-component/tour-details-component';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import toursData from '../../../../databaseJson/tours.json';
import { CountryService } from '../../../../Services/country.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';

@Component({
  selector: 'app-sigiriya-day-tour-component',
  standalone: true,
  imports: [CommonModule, RouterModule, TourDetailsComponent,PackageItemComponent],
  templateUrl: './sigiriya-day-tour-component.html',
  styleUrl: './sigiriya-day-tour-component.css'
})
export class SigiriyaDayTourComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/img/onedayTour/Sigiriya/1.jpg',
    'assets/img/onedayTour/Sigiriya/2.jpg',
    'assets/img/onedayTour/Sigiriya/3.jpg',
    'assets/img/onedayTour/Sigiriya/4.jpg',
    'assets/img/onedayTour/Sigiriya/5.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

  tour = {
    title: 'Sri Lanka Sigiriya One Day Tour',
    description:
    'Discover Sri Lanka’s cultural and natural heritage on a full-day tour to Sigiriya, including temples, rock climbing, and wildlife.',
    duration: 'One Day',
    persons: '20 Persons',
    filecode: 'sigiriya-day-tour',
    overview: `
    This one-day tour to Sigiriya offers a perfect blend of culture, adventure, and wildlife.
    Begin with a visit to the Golden Cave Temple in Dambulla, followed by climbing either
    Sigiriya Rock Fortress or Pidurangala Rock for breathtaking views.
    End the day with an exciting wild elephant safari, making this tour ideal for nature
    and history lovers.
      `,
    tourType: 'Day Tour',

    itinerary: [
      {
        day: 1,
        title: 'Sigiriya Day Tour Itinerary',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Sigiriya Day Tour Itinerary',
              icon: 'fa-car',
              color: '#f39c12',
            },
            description:
              'Pickup from your hotel in a comfortable private air-conditioned vehicle.',
            image: 'assets/img/onedayTour/Sigiriya/1.jpg',
          },
          {
            type: 'Guided tour',
          title: {
            title: 'Golden Cave Temple – Dambulla',
            icon: 'fa-gopuram',
            color: '#c0392b',
          },
          description:
            'Visit the UNESCO World Heritage Dambulla Cave Temple, famous for its ancient murals and Buddha statues.',
          image: 'assets/img/onedayTour/Sigiriya/6.jpg',
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
            image: 'assets/img/onedayTour/Sigiriya/7.jpg',
          },
          {
            type: 'Adventure',
          title: {
            title: 'Sigiriya or Pidurangala Rock Climbing',
            icon: 'fa-mountain',
            color: '#f39c12',
          },
          description:
            'Climb either the iconic Sigiriya Rock Fortress or Pidurangala Rock for stunning panoramic views.',
            image: 'assets/img/onedayTour/Sigiriya/8.jpg',
          },
          {
            type: 'Safari',
          title: {
            title: 'Wild Elephant Safari',
            icon: 'fa-paw',
            color: '#27ae60',
          },
          description:
            'Experience an exciting wild elephant safari in a national park (jeep & entrance tickets not included).',
          image: 'assets/img/onedayTour/Sigiriya/9.jpg',
          },
        ],
      },
    ],

    includes: [
    'All attraction entrance fees (excluding safari entrance & jeep)',
    'Highway tickets and parking fees',
    'English speaking professional driver',
    'Private air-conditioned vehicle',
    'Lunch',
    ],
    excludes: ['Safari entrance tickets and jeep',
    'Personal expenses'],
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
          .slice(0, 3);

        this.intervalId = setInterval(() => this.nextImage(), 3000);

      } catch (error) {
        console.error('Client-side loading error:', error);
      }
    }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async loadToursWithPrices(tours: any[]) {
    const isBrowser = isPlatformBrowser(this.platformId);

    if (!isBrowser) {
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
    if (!isPlatformBrowser(this.platformId)) return;
    const barcode = 'sigiriya-day-tour';
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
