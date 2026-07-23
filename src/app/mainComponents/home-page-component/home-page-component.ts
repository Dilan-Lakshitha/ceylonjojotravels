import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ChangeDetectorRef, inject } from '@angular/core';
import { TourCardComponent } from '../../ui/tour-card/tour-card.component';
import { DestinationCardComponent } from '../../ui/destination-card/destination-card.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactUsComponent } from '../../sharedComponents/contact-us-component/contact-us-component';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { CountryService } from '../../Services/country.service';
import { TourContentService, TourCatalogItem } from '../../i18n/tour-content.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { TourId } from '../../i18n/tour-slug-map';

type PricedTour = TourCatalogItem & { price: number; link: any[] };

@Component({
  selector: 'app-home-page-component',
  standalone: true,
  imports: [
    CommonModule,
    TourCardComponent,
    DestinationCardComponent,
    RouterModule,
    ContactUsComponent,
    TranslocoModule,
  ],
  templateUrl: './home-page-component.html',
  styleUrl: './home-page-component.css',
})
export class HomePageComponent implements OnInit, OnDestroy {
  homecontact = true;
  dayTours: PricedTour[] = [];
  multiDayTours: PricedTour[] = [];
  currentIndex = 0;
  interval: any;
  userCountry = 'US';
  activeTab: 'multi' | 'day' = 'multi';
  contactLink: any[] = ['/', 'en', 'contact'];
  tour7Link: any[] = ['/', 'en', 'tours', '7-day-sri-lanka-tour'];
  tour8Link: any[] = ['/', 'en', 'tours', '8-day-sri-lanka-private-tour'];
  ellaLink: any[] = ['/', 'en', 'tours', 'ella-day-tour'];
  sigiriyaLink: any[] = ['/', 'en', 'tours', 'sigiriya-day-tour'];

  reviews = [
    {
      name: 'Sri Lanka With Roshan',
      date: 'April 28, 2025',
      comment:
        'We had a really wonderful time in Sri Lanka. We booked just the car with driver and made our own hotel bookings. The tour was quite in that it was...',
      photo: 'assets/img/testimonial-1.jpg',
      profession: 'XCOUNTRYTO',
      rating: 5,
    },
    {
      name: 'Unforgettable Experience!',
      date: 'April 28, 2025',
      comment:
        'Excellent trip with amazing and safe driver Roshan! We loved the landscape, the friendly people and the delicious...',
      photo: 'assets/img/testimonial-2.jpg',
      profession: 'JEN2SG',
      rating: 5,
    },
    {
      name: 'Wonderful Travel Experience',
      date: 'April 28, 2025',
      comment:
        'We are two Italian friends, we spent 10 days exploring Sri Lanka. Our driver, Kumara, was incredibly kind and professional...',
      photo: 'assets/img/testimonial-3.jpg',
      profession: 'MICHELA R',
      rating: 5,
    },
    {
      name: 'Family With Little Ones In Sri Lanka',
      date: 'April 27, 2025',
      comment:
        'We had Dhana as our driver for days and he was instrumental in us having a lovely holiday! Everything with the company was super easy...',
      photo: 'assets/img/testimonial-4.jpg',
      profession: 'JOANA V',
      rating: 5,
    },
  ];

  private readonly http = inject(HttpClient);
  private readonly countryService = inject(CountryService);
  private readonly tourContent = inject(TourContentService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private sub?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.contactLink = this.localizedRouter.commandsFor('contact');
    this.tour7Link = this.localizedRouter.tourLinkCommands('7-day-sri-lanka-tour');
    this.tour8Link = this.localizedRouter.tourLinkCommands('8-day-sri-lanka-private-tour');
    this.ellaLink = this.localizedRouter.tourLinkCommands('ella-day-tour');
    this.sigiriyaLink = this.localizedRouter.tourLinkCommands('sigiriya-day-tour');

    const lang = this.transloco.getActiveLang() || 'en';
    this.transloco.load(`common/${lang}`).subscribe();
    this.transloco.load(`home/${lang}`).subscribe();
    this.transloco.load(`about/${lang}`).subscribe();
    this.transloco.load(`destinations/${lang}`).subscribe();

    if (isPlatformBrowser(this.platformId)) {
      this.countryService.detectCountry().then((c) => {
        this.userCountry = c;
      });
      this.autoSlide();
    }

    this.sub = this.tourContent.getCatalog().subscribe({
      next: async (catalog) => {
        this.dayTours = await this.withPrices(catalog?.dayTours ?? []);
        this.multiDayTours = await this.withPrices(catalog?.multiDayTours ?? []);
        this.cdr.markForCheck();
      },
    });
  }

  get toursLink(): any[] {
    return this.localizedRouter.commandsFor('tours');
  }

  setTab(tab: 'multi' | 'day') {
    this.activeTab = tab;
  }

  private async withPrices(tours: TourCatalogItem[]): Promise<PricedTour[]> {
    return Promise.all(
      tours.map(async (tour) => {
        const price = await this.loadPrice(tour.filecode);
        const tourId = (tour.filecode || tour.id) as TourId;
        return {
          ...tour,
          price,
          link: this.localizedRouter.tourLinkCommands(tourId),
        };
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
            error: () => resolve(0),
          });
        },
      });
    });
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.reviews.length) % this.reviews.length;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.reviews.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }

  autoSlide() {
    this.interval = setInterval(() => {
      this.next();
    }, 5000);
  }

  scrollToSection(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
