import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';

/**
 * Only US price JSON files ship in assets/data today.
 * Detected geo (e.g. LK) must not request missing LK*.json — that causes
 * console 500s and keeps hydration unstable (NG0506).
 */
const PRICE_FILE_COUNTRIES = new Set(['US']);

@Injectable({ providedIn: 'root' })
export class TourPriceService {
  private readonly http = inject(HttpClient);
  private readonly price$Cache = new Map<string, Observable<Record<string, number>>>();
  private readonly personCache = new Map<string, Promise<number>>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /** Map visitor country → country code that actually has a price file. */
  pricingCountry(detected: string | null | undefined): string {
    const code = (detected || 'US').toUpperCase();
    return PRICE_FILE_COUNTRIES.has(code) ? code : 'US';
  }

  /** Per-person display price (key "2" in price JSON). */
  getPersonPrice(filecode: string, detectedCountry?: string): Promise<number> {
    if (!isPlatformBrowser(this.platformId) || !filecode) {
      return Promise.resolve(0);
    }
    const country = this.pricingCountry(detectedCountry);
    const key = `${country}:${filecode}`;
    if (!this.personCache.has(key)) {
      this.personCache.set(
        key,
        new Promise((resolve) => {
          this.getPrices(filecode, country).subscribe({
            next: (prices) => resolve(prices['2'] ?? 0),
            error: () => resolve(0),
          });
        }),
      );
    }
    return this.personCache.get(key)!;
  }

  /** Full price map for booking form. */
  getPrices(filecode: string, detectedCountry?: string): Observable<Record<string, number>> {
    if (!isPlatformBrowser(this.platformId) || !filecode) {
      return of({});
    }
    const country = this.pricingCountry(detectedCountry);
    const key = `${country}:${filecode}`;
    if (!this.price$Cache.has(key)) {
      const url = `assets/data/${country}${filecode}.json`;
      this.price$Cache.set(
        key,
        this.http.get<{ price?: Record<string, number> }>(url).pipe(
          map((data) => data?.price ?? {}),
          catchError(() => {
            if (country === 'US') {
              return of({});
            }
            return this.http.get<{ price?: Record<string, number> }>(`assets/data/US${filecode}.json`).pipe(
              map((data) => data?.price ?? {}),
              catchError(() => of({})),
            );
          }),
          shareReplay(1),
        ),
      );
    }
    return this.price$Cache.get(key)!;
  }
}
