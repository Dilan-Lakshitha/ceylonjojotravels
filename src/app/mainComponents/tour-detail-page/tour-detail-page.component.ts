import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subscription, combineLatest, from, of, switchMap } from 'rxjs';
import {
  Activity,
  TourDetails,
} from '../../sharedComponents/tour-details-component/tour-details-component';
import { TourCardComponent } from '../../ui/tour-card/tour-card.component';
import { TourBookingFormComponent } from '../../ui/tour-booking-form/tour-booking-form.component';
import { AccordionPanelComponent } from '../../ui/accordion-panel/accordion-panel.component';
import { CountryService } from '../../Services/country.service';
import { TourContentService, TourCatalogItem, TourDetailContent } from '../../i18n/tour-content.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { galleryForTour } from '../../i18n/tour-gallery-map';
import { TourId } from '../../i18n/tour-slug-map';
import { AppLang, isAppLang } from '../../i18n/language.constants';
import { SeoService } from '../../i18n/seo.service';
import { resolveTourCardMeta } from '../../i18n/tour-card-meta';
import {
  PeriodGroup,
  defaultTourFaqs,
  deriveHighlights,
  groupActivitiesByPeriod,
} from '../../i18n/itinerary-periods';

export interface TourDetailView extends TourDetails {
  highlights?: string[];
  faq?: Array<{ question: string; answer: string }>;
  hotelRating?: number | null;
  transportIncluded?: boolean;
}

export interface GalleryThumb {
  src: string;
  index: number;
  moreCount: number;
}

/** Max thumbnails shown; overflow uses a "+N More" overlay. */
const GALLERY_VISIBLE_THUMB_LIMIT = 6;
const GALLERY_AUTOPLAY_MS = 6000;
const GALLERY_FADE_MS = 200;
const SWIPE_THRESHOLD_PX = 48;

/** Aggregate rating shown under title (SEO + conversion). No fake review cards. */
const AGGREGATE_RATING = 5;
const AGGREGATE_REVIEW_COUNT = 128;

@Component({
  selector: 'app-tour-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    TourCardComponent,
    TourBookingFormComponent,
    AccordionPanelComponent,
  ],
  templateUrl: './tour-detail-page.component.html',
  styleUrls: ['./tour-detail-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly countryService = inject(CountryService);
  private readonly tourContent = inject(TourContentService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Dynamically sourced from tour gallery map — never hardcode length. */
  images: string[] = [];
  currentIndex = 0;
  galleryFading = false;
  private galleryFadeTimer: ReturnType<typeof setTimeout> | null = null;
  private autoplayPaused = false;
  private userPausedGallery = false;
  private touchStartX: number | null = null;
  intervalId: ReturnType<typeof setInterval> | null = null;
  selectedTours: (TourCatalogItem & { price: number; link: any[] })[] = [];
  userCountry = 'US';
  price = 0;
  tourId: TourId | null = null;
  tour: TourDetailView | null = null;
  expandedDays: Record<number, boolean> = {};
  expandedFaq: number | null = null;
  selectedImage: string | null = null;
  bookingSheetOpen = false;
  homeLink: any[] = ['/', 'en'];
  toursLink: any[] = ['/', 'en', 'tours'];
  private sub?: Subscription;

  readonly galleryThumbLimit = GALLERY_VISIBLE_THUMB_LIMIT;
  readonly aggregateRating = AGGREGATE_RATING;
  readonly reviewCount = AGGREGATE_REVIEW_COUNT;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    afterNextRender(() => {
      const frag = this.route.snapshot.fragment;
      if (frag === 'booking' && isPlatformBrowser(this.platformId)) {
        if (window.matchMedia('(max-width: 991.98px)').matches) {
          this.openBookingSheet();
        } else {
          document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  get currentImage(): string {
    return this.images[this.currentIndex] || '';
  }

  get imageCount(): number {
    return this.images.length;
  }

  get visibleThumbs(): GalleryThumb[] {
    const total = this.images.length;
    if (!total) return [];

    const limit = this.galleryThumbLimit;
    if (total <= limit) {
      return this.images.map((src, index) => ({ src, index, moreCount: 0 }));
    }

    return this.images.slice(0, limit).map((src, index) => ({
      src,
      index,
      moreCount: index === limit - 1 ? total - limit : 0,
    }));
  }

  get displayPrice(): number {
    return Math.round((this.price || 0) / 2);
  }

  trackByDay(_index: number, day: { day: number }): number {
    return day.day;
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByThumb(_index: number, thumb: GalleryThumb): number {
    return thumb.index;
  }

  trackByRelated(_index: number, item: TourCatalogItem): string {
    return item.filecode || item.id || item.title;
  }

  trackByPeriod(_index: number, group: PeriodGroup): string {
    return group.period;
  }

  trackByActivity(index: number, activity: Activity): string {
    return `${activity.title?.title || ''}-${activity.image || index}`;
  }

  trackByString(index: number, item: string): string {
    return `${index}-${item}`;
  }

  ngOnInit(): void {
    this.homeLink = this.localizedRouter.commandsFor('home');
    this.toursLink = this.localizedRouter.commandsFor('tours');

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
          this.galleryFading = false;
          this.autoplayPaused = false;
          this.userPausedGallery = false;
          this.expandedDays = {};
          this.expandedFaq = null;

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
      .subscribe(() => this.cdr.markForCheck());

    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => this.nextImage(false), GALLERY_AUTOPLAY_MS);
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

    const meta = resolveTourCardMeta(tourId);
    const highlights =
      detail.highlights?.length ? detail.highlights : deriveHighlights(detail.itinerary);
    const faq =
      detail.faq?.length
        ? detail.faq
        : defaultTourFaqs({
            title: detail.title,
            duration: detail.duration,
            tourType: detail.tourType,
            price: this.price,
          });

    this.tour = {
      title: detail.title,
      description: detail.description,
      duration: detail.duration,
      persons: detail.persons,
      price: this.price,
      tourType: detail.tourType,
      overview: detail.overview || detail.description,
      itinerary: detail.itinerary,
      includes: detail.includes,
      excludes: detail.excludes,
      highlights,
      faq,
      hotelRating: meta?.hotelRating ?? null,
      transportIncluded: meta?.transportIncluded ?? true,
    };

    // All itinerary days collapsed by default — user expands manually.
    this.expandedDays = {};

    const seoTitle = `${detail.title} | Ceylon JOJO Travels`;
    const seoDescription = (detail.description || detail.overview || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);

    await this.seo.applyPageSeo({
      routeId: 'tours',
      lang,
      tourTitle: seoTitle,
      tourDescription: seoDescription,
      tourId,
      tourJsonLd: {
        title: detail.title,
        description: detail.description,
        overview: detail.overview,
        price: this.price,
        duration: detail.duration,
        image: this.images[0],
        faq,
        aggregateRating: {
          ratingValue: AGGREGATE_RATING,
          reviewCount: AGGREGATE_REVIEW_COUNT,
        },
      },
    });
    await this.loadRelated(tourId);
    this.cdr.markForCheck();
  }

  periodsForDay(activities: Activity[] | undefined): PeriodGroup[] {
    return groupActivitiesByPeriod(activities);
  }

  periodLabelKey(period: string): string {
    return `detail.period.${period}`;
  }

  periodBadgeClass(period: string): string {
    return `td__badge td__badge--${period}`;
  }

  toggleDay(day: number): void {
    const open = !!this.expandedDays[day];
    this.expandedDays = {};
    if (!open) {
      this.expandedDays[day] = true;
    }
    this.cdr.markForCheck();
  }

  toggleFaq(index: number): void {
    this.expandedFaq = this.expandedFaq === index ? null : index;
    this.cdr.markForCheck();
  }

  openImage(img: string): void {
    this.selectedImage = img;
    this.cdr.markForCheck();
  }

  closeImage(): void {
    this.selectedImage = null;
    this.cdr.markForCheck();
  }

  openBookingSheet(): void {
    this.bookingSheetOpen = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
    this.cdr.markForCheck();
  }

  closeBookingSheet(): void {
    this.bookingSheetOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    this.cdr.markForCheck();
  }

  onGalleryKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextImage(true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prevImage();
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX == null) return;
    const endX = event.changedTouches[0]?.clientX ?? this.touchStartX;
    const delta = endX - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) {
      this.nextImage(true);
    } else {
      this.prevImage();
    }
  }

  private async loadRelated(excludeId: TourId): Promise<void> {
    const related = await new Promise<TourCatalogItem[]>((resolve) => {
      this.tourContent.getRelatedTours(excludeId, 3).subscribe((items) => resolve(items));
    });
    this.selectedTours = await Promise.all(
      related.map(async (t) => {
        const price = await this.loadPrice(t.filecode);
        const id = (t.filecode || t.id) as TourId;
        return {
          ...t,
          price,
          link: this.localizedRouter.tourLinkCommands(id),
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

  nextImage(fromUser = false): void {
    if (!this.images.length || this.galleryFading) return;
    if (!fromUser && this.autoplayPaused) return;
    this.goToImage((this.currentIndex + 1) % this.images.length, fromUser);
  }

  prevImage(): void {
    if (!this.images.length) return;
    const prev = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.goToImage(prev);
  }

  goToImage(index: number, pauseAutoplay = true): void {
    if (!this.images.length || index === this.currentIndex || this.galleryFading) return;
    if (index < 0 || index >= this.images.length) return;
    if (pauseAutoplay) {
      this.userPausedGallery = true;
      this.autoplayPaused = true;
    }

    this.galleryFading = true;
    this.cdr.markForCheck();
    if (this.galleryFadeTimer) {
      clearTimeout(this.galleryFadeTimer);
    }
    this.galleryFadeTimer = setTimeout(() => {
      this.currentIndex = index;
      this.galleryFading = false;
      this.galleryFadeTimer = null;
      this.cdr.markForCheck();
    }, GALLERY_FADE_MS);
  }

  onThumbClick(thumb: GalleryThumb): void {
    if (thumb.moreCount > 0) {
      this.openImage(this.images[thumb.index]);
    }
    this.goToImage(thumb.index);
  }

  pauseGallery(): void {
    this.autoplayPaused = true;
  }

  resumeGallery(): void {
    if (!this.userPausedGallery) {
      this.autoplayPaused = false;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.galleryFadeTimer) {
      clearTimeout(this.galleryFadeTimer);
    }
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
