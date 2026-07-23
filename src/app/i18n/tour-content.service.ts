import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { TourId } from './tour-slug-map';
import { isAppLang } from './language.constants';
import { TourDetails } from '../sharedComponents/tour-details-component/tour-details-component';
import { resolveTourCardMeta, TourTypeKey } from './tour-card-meta';

export interface TourDetailContent extends TourDetails {
  id: TourId;
  slug: string;
  filecode: string;
  overview?: string;
  tourType?: string;
  includes?: string[];
  excludes?: string[];
  highlights?: string[];
  faq?: Array<{ question: string; answer: string }>;
  accommodationSummary?: string;
}

export interface TourCatalogItem {
  id: string;
  title: string;
  days: string;
  persons: string;
  rating: number;
  filecode: string;
  image: string;
  routerLink?: string;
  isBestseller?: boolean;
  isLimited?: boolean;
  slug?: string;
  /** Localized override; prefer tourTypeKey + i18n when empty */
  tourType?: string;
  tourTypeKey?: TourTypeKey;
  /** Hotel star rating from itinerary; null when no hotel */
  hotelRating?: number | null;
  transportIncluded?: boolean;
}

interface ToursScope {
  catalog: {
    dayTours: TourCatalogItem[];
    multiDayTours: TourCatalogItem[];
  };
  details: Record<string, TourDetailContent>;
}

const EMPTY_CATALOG: ToursScope = {
  catalog: { dayTours: [], multiDayTours: [] },
  details: {},
};

@Injectable({ providedIn: 'root' })
export class TourContentService {
  private readonly http = inject(HttpClient);
  private readonly transloco = inject(TranslocoService);
  private cache = new Map<string, Observable<ToursScope>>();

  private loadScope(lang: string): Observable<ToursScope> {
    const safeLang = isAppLang(lang) ? lang : 'en';
    if (!this.cache.has(safeLang)) {
      this.cache.set(
        safeLang,
        this.http.get<ToursScope>(`assets/i18n/${safeLang}/tours.json`).pipe(
          catchError(() =>
            safeLang === 'en'
              ? of(EMPTY_CATALOG)
              : this.http.get<ToursScope>('assets/i18n/en/tours.json').pipe(
                  catchError(() => of(EMPTY_CATALOG)),
                ),
          ),
          shareReplay(1),
        ),
      );
    }
    return this.cache.get(safeLang)!;
  }

  private activeLang$(): Observable<string> {
    return this.transloco.langChanges$.pipe(
      startWith(this.transloco.getActiveLang() || 'en'),
      map((lang) => (isAppLang(lang) ? lang : 'en')),
    );
  }

  getCatalog(): Observable<{ dayTours: TourCatalogItem[]; multiDayTours: TourCatalogItem[] }> {
    return this.activeLang$().pipe(
      switchMap((lang) => this.loadScope(lang)),
      map((scope) => {
        const catalog = scope.catalog ?? { dayTours: [], multiDayTours: [] };
        return {
          dayTours: (catalog.dayTours || []).map((item) => this.enrichCatalogItem(item)),
          multiDayTours: (catalog.multiDayTours || []).map((item) => this.enrichCatalogItem(item)),
        };
      }),
    );
  }

  private enrichCatalogItem(item: TourCatalogItem): TourCatalogItem {
    const meta = resolveTourCardMeta(item.id) ?? resolveTourCardMeta(item.filecode);
    if (!meta) {
      return item;
    }
    return {
      ...item,
      tourTypeKey: item.tourTypeKey ?? meta.tourTypeKey,
      hotelRating: item.hotelRating !== undefined ? item.hotelRating : meta.hotelRating,
      transportIncluded:
        item.transportIncluded !== undefined ? item.transportIncluded : meta.transportIncluded,
    };
  }

  getTour(tourId: TourId): Observable<TourDetailContent | null> {
    return this.activeLang$().pipe(
      switchMap((lang) => this.loadScope(lang)),
      map((scope) => scope.details?.[tourId] ?? null),
    );
  }

  getRelatedTours(excludeId: TourId, limit = 3): Observable<TourCatalogItem[]> {
    return this.getCatalog().pipe(
      map((catalog) => {
        const all = [...(catalog.multiDayTours || []), ...(catalog.dayTours || [])].filter(
          (t) => t.filecode !== excludeId && t.id !== excludeId,
        );
        return all.slice(0, limit);
      }),
    );
  }
}
