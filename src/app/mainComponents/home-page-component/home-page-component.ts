import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { TourCardComponent } from '../../ui/tour-card/tour-card.component';
import { DestinationCardComponent } from '../../ui/destination-card/destination-card.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactUsComponent } from '../../sharedComponents/contact-us-component/contact-us-component';
import { ElfsightReviewsComponent } from '../../ui/elfsight-reviews/elfsight-reviews.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { CountryService } from '../../Services/country.service';
import { TourPriceService } from '../../Services/tour-price.service';
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
    ElfsightReviewsComponent,
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
  pricesReady = false;
  /** Homepage hero carousel slide (0–5). */
  heroSlideIndex = 0;
  private readonly heroSlideCount = 6;
  private heroTimer: ReturnType<typeof setInterval> | null = null;
  private heroPaused = false;
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

  private readonly countryService = inject(CountryService);
  private readonly tourPrice = inject(TourPriceService);
  private readonly tourContent = inject(TourContentService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private sub?: Subscription;
  private packagesObserver?: IntersectionObserver;
  private pricesLoaded = false;
  private pendingCatalog: { dayTours: TourCatalogItem[]; multiDayTours: TourCatalogItem[] } | null =
    null;

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
      this.autoSlide();
      this.startHeroCarousel();
      // Country lookup is not needed for first paint; defer until idle.
      this.whenIdle(() => {
        this.countryService.detectCountry().then((c) => {
          this.userCountry = c;
          if (this.pricesLoaded && this.pendingCatalog) {
            void this.applyPrices(this.pendingCatalog);
          }
        });
      });
    }

    this.sub = this.tourContent.getCatalog().subscribe({
      next: (catalog) => {
        const day = catalog?.dayTours ?? [];
        const multi = catalog?.multiDayTours ?? [];
        this.pendingCatalog = { dayTours: day, multiDayTours: multi };
        // Paint cards immediately without blocking on N price JSON requests.
        this.dayTours = this.withoutPrices(day);
        this.multiDayTours = this.withoutPrices(multi);
        this.cdr.markForCheck();
        if (isPlatformBrowser(this.platformId)) {
          this.observePackagesForPrices();
        }
      },
    });
  }

  get toursLink(): any[] {
    return this.localizedRouter.commandsFor('tours');
  }

  setTab(tab: 'multi' | 'day') {
    this.activeTab = tab;
  }

  nextHeroSlide(event?: Event): void {
    event?.preventDefault();
    this.heroSlideIndex = (this.heroSlideIndex + 1) % this.heroSlideCount;
    this.cdr.markForCheck();
  }

  prevHeroSlide(event?: Event): void {
    event?.preventDefault();
    this.heroSlideIndex =
      (this.heroSlideIndex - 1 + this.heroSlideCount) % this.heroSlideCount;
    this.cdr.markForCheck();
  }

  pauseHeroCarousel(): void {
    this.heroPaused = true;
    this.clearHeroTimer();
  }

  resumeHeroCarousel(): void {
    this.heroPaused = false;
    this.startHeroCarousel();
  }

  private startHeroCarousel(): void {
    if (!isPlatformBrowser(this.platformId) || this.heroPaused) {
      return;
    }
    this.clearHeroTimer();
    // Outside Angular zone so setInterval does not block hydration (NG0506).
    this.ngZone.runOutsideAngular(() => {
      this.heroTimer = setInterval(() => {
        this.ngZone.run(() => this.nextHeroSlide());
      }, 5000);
    });
  }

  private clearHeroTimer(): void {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
      this.heroTimer = null;
    }
  }

  private withoutPrices(tours: TourCatalogItem[]): PricedTour[] {
    return tours.map((tour) => {
      const tourId = (tour.filecode || tour.id) as TourId;
      return {
        ...tour,
        price: 0,
        link: this.localizedRouter.tourLinkCommands(tourId),
      };
    });
  }

  private async applyPrices(catalog: {
    dayTours: TourCatalogItem[];
    multiDayTours: TourCatalogItem[];
  }): Promise<void> {
    this.dayTours = await this.withPrices(catalog.dayTours);
    this.multiDayTours = await this.withPrices(catalog.multiDayTours);
    this.pricesLoaded = true;
    this.pricesReady = true;
    this.cdr.markForCheck();
  }

  private async withPrices(tours: TourCatalogItem[]): Promise<PricedTour[]> {
    return Promise.all(
      tours.map(async (tour) => {
        const price = await this.tourPrice.getPersonPrice(tour.filecode, this.userCountry);
        const tourId = (tour.filecode || tour.id) as TourId;
        return {
          ...tour,
          price,
          link: this.localizedRouter.tourLinkCommands(tourId),
        };
      }),
    );
  }

  private observePackagesForPrices(): void {
    if (this.packagesObserver || this.pricesLoaded) {
      return;
    }
    const target = document.getElementById('packages');
    if (!target || typeof IntersectionObserver === 'undefined') {
      this.whenIdle(() => {
        if (this.pendingCatalog) {
          void this.applyPrices(this.pendingCatalog);
        }
      });
      return;
    }
    this.packagesObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) {
          return;
        }
        this.packagesObserver?.disconnect();
        this.packagesObserver = undefined;
        if (this.pendingCatalog) {
          void this.applyPrices(this.pendingCatalog);
        }
      },
      { rootMargin: '200px 0px' },
    );
    this.packagesObserver.observe(target);
  }

  private whenIdle(fn: () => void): void {
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    if (typeof ric === 'function') {
      ric(fn, { timeout: 3500 });
    } else {
      setTimeout(fn, 2000);
    }
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
    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          this.next();
          this.cdr.markForCheck();
        });
      }, 5000);
    });
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
    this.packagesObserver?.disconnect();
    this.clearHeroTimer();
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
