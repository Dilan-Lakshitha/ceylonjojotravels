import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription, combineLatest, from, of, switchMap } from 'rxjs';
import {
  TourDetails,
  TourDetailsComponent,
} from '../../sharedComponents/tour-details-component/tour-details-component';
import { PackageItemComponent } from '../../sharedComponents/package-item-component/package-item-component';
import { CountryService } from '../../Services/country.service';
import { TourContentService, TourCatalogItem, TourDetailContent } from '../../i18n/tour-content.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { galleryForTour } from '../../i18n/tour-gallery-map';
import { TourId } from '../../i18n/tour-slug-map';
import { AppLang, isAppLang } from '../../i18n/language.constants';
import { SeoService } from '../../i18n/seo.service';

@Component({
  selector: 'app-tour-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    TourDetailsComponent,
    PackageItemComponent,
  ],
  templateUrl: './tour-detail-page.component.html',
  styleUrls: ['./tour-detail-page.component.css'],
})
export class TourDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly countryService = inject(CountryService);
  private readonly tourContent = inject(TourContentService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);
  private readonly seo = inject(SeoService);

  images: string[] = [];
  currentIndex = 0;
  intervalId: ReturnType<typeof setInterval> | null = null;
  selectedTours: (TourCatalogItem & { price: number; link: any[] })[] = [];
  userCountry = 'US';
  price = 0;
  tourId: TourId | null = null;
  tour: TourDetails | null = null;
  private sub?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get currentImage(): string {
    return this.images[this.currentIndex] || '';
  }

  get nextImages() {
    if (!this.images.length) return [];
    return Array.from({ length: Math.min(4, this.images.length - 1) }, (_, i) => {
      const index = (this.currentIndex + i + 1) % this.images.length;
      return { src: this.images[index], index };
    });
  }

  ngOnInit(): void {
    this.sub = combineLatest([
      this.route.data,
      this.route.parent!.paramMap,
      this.transloco.langChanges$,
    ])
      .pipe(
        switchMap(([data, parentParams]) => {
          this.tourId = (data['tourId'] as TourId) || null;
          if (!this.tourId) {
            return of(null);
          }
          const langParam = parentParams.get('lang');
          const lang: AppLang = isAppLang(langParam) ? langParam : 'en';
          this.images = galleryForTour(this.tourId);
          this.currentIndex = 0;

          return this.tourContent.getTour(this.tourId).pipe(
            switchMap((detail) => {
              if (!detail || !this.tourId) {
                return of(null);
              }
              return from(this.hydrateTour(detail, lang, this.tourId));
            }),
          );
        }),
      )
      .subscribe();

    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => this.nextImage(), 3000);
    }
  }

  private async hydrateTour(
    detail: TourDetailContent,
    lang: AppLang,
    tourId: TourId,
  ): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.userCountry = await this.countryService.detectCountry();
      this.price = await this.loadPrice(detail.filecode || tourId);
    }

    this.tour = {
      title: detail.title,
      description: detail.description,
      duration: detail.duration,
      persons: detail.persons,
      price: this.price,
      tourType: detail.tourType,
      overview: detail.overview,
      itinerary: detail.itinerary,
      includes: detail.includes,
      excludes: detail.excludes,
    };

    await this.seo.applyPageSeo({
      routeId: 'tours',
      lang,
      tourTitle: detail.title,
      tourDescription: detail.description,
      tourId,
    });
    await this.loadRelated(tourId);
  }

  private async loadRelated(excludeId: TourId): Promise<void> {
    const related = await new Promise<TourCatalogItem[]>((resolve) => {
      this.tourContent.getRelatedTours(excludeId, 3).subscribe((items) => resolve(items));
    });
    this.selectedTours = await Promise.all(
      related.map(async (t) => {
        const price = await this.loadPrice(t.filecode);
        const tourId = (t.filecode || t.id) as TourId;
        return {
          ...t,
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

  nextImage(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goToImage(index: number): void {
    this.currentIndex = index;
  }

  goToImageFromThumb(index: number): void {
    this.currentIndex = index;
  }

  bookNow(): void {
    if (!isPlatformBrowser(this.platformId) || !this.tour || !this.tourId) {
      return;
    }
    const filecode = this.tourId;
    localStorage.setItem('tour', JSON.stringify({ ...this.tour, filecode }));
    localStorage.setItem('filecode', filecode);
    localStorage.setItem('image', this.images[0] || '');
    this.localizedRouter.navigateTo('booking', {
      filecode,
      state: {
        tour: this.tour,
        barcode: filecode,
        image: this.images[0],
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
