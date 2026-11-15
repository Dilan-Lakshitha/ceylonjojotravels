import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay, catchError } from 'rxjs';
import { AppLang, isAppLang } from './language.constants';
import { GuideId } from './guide-slug-map';
import { TourId } from './tour-slug-map';

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  answer: string;
}

export interface GuideMonthTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface GuideArticle {
  seoTitle: string;
  seoDescription: string;
  h1: string;
  lastUpdated: string;
  directAnswer: string;
  sections: GuideSection[];
  monthTable?: GuideMonthTable;
  faq: GuideFaq[];
  relatedTours: TourId[];
  relatedGuidesNote?: string;
  ctaHeading: string;
  ctaBody: string;
  ctaWhatsapp: string;
  ctaTours: string;
  ctaContact: string;
}

@Injectable({ providedIn: 'root' })
export class GuideContentService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Observable<Record<string, GuideArticle>>>();

  getArticle(guideId: GuideId, lang: string): Observable<GuideArticle | null> {
    const safeLang: AppLang = isAppLang(lang) ? lang : 'en';
    return this.loadPack(safeLang).pipe(map((pack) => pack[guideId] ?? null));
  }

  private loadPack(lang: AppLang): Observable<Record<string, GuideArticle>> {
    if (!this.cache.has(lang)) {
      // No English fallback pack on other locales (incomplete → 301 to EN).
      const req$ = this.http
        .get<Record<string, GuideArticle>>(`assets/i18n/${lang}/guide-articles.json`)
        .pipe(
          catchError(() => of({} as Record<string, GuideArticle>)),
          shareReplay(1),
        );
      this.cache.set(lang, req$);
    }
    return this.cache.get(lang)!;
  }
}
