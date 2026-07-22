import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, startWith, switchMap } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { TourId } from './tour-slug-map';
import { TourDetails } from '../sharedComponents/tour-details-component/tour-details-component';

export interface TourDetailContent extends TourDetails {
  id: TourId;
  slug: string;
  filecode: string;
  overview?: string;
  tourType?: string;
  includes?: string[];
  excludes?: string[];
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
}

interface ToursScope {
  catalog: {
    dayTours: TourCatalogItem[];
    multiDayTours: TourCatalogItem[];
  };
  details: Record<string, TourDetailContent>;
}

@Injectable({ providedIn: 'root' })
export class TourContentService {
  private readonly http = inject(HttpClient);
  private readonly transloco = inject(TranslocoService);
  private cache = new Map<string, Observable<ToursScope>>();

  private loadScope(lang: string): Observable<ToursScope> {
    if (!this.cache.has(lang)) {
      this.cache.set(
        lang,
        this.http.get<ToursScope>(`assets/i18n/${lang}/tours.json`).pipe(shareReplay(1)),
      );
    }
    return this.cache.get(lang)!;
  }

  private activeLang$(): Observable<string> {
    return this.transloco.langChanges$.pipe(
      startWith(this.transloco.getActiveLang() || 'en'),
      map((lang) => lang || 'en'),
    );
  }

  getCatalog(): Observable<{ dayTours: TourCatalogItem[]; multiDayTours: TourCatalogItem[] }> {
    return this.activeLang$().pipe(
      switchMap((lang) => this.loadScope(lang)),
      map((scope) => scope.catalog),
    );
  }

  getTour(tourId: TourId): Observable<TourDetailContent | null> {
    return this.activeLang$().pipe(
      switchMap((lang) => this.loadScope(lang)),
      map((scope) => scope.details[tourId] ?? null),
    );
  }

  getRelatedTours(excludeId: TourId, limit = 3): Observable<TourCatalogItem[]> {
    return this.getCatalog().pipe(
      map((catalog) => {
        const all = [...catalog.multiDayTours, ...catalog.dayTours].filter(
          (t) => t.filecode !== excludeId && t.id !== excludeId,
        );
        return all.slice(0, limit);
      }),
    );
  }
}
