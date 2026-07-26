import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const GEO_TIMEOUT_MS = 2000;
const DEFAULT_COUNTRY = 'US';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private countryPromise: Promise<string> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async detectCountry(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return DEFAULT_COUNTRY;
    }

    const saved = localStorage.getItem('user_country');
    if (saved) {
      return saved;
    }

    if (!this.countryPromise) {
      this.countryPromise = this.fetchCountryWithTimeout().finally(() => {
        // Allow retry later only if we failed before persisting.
        if (!localStorage.getItem('user_country')) {
          this.countryPromise = null;
        }
      });
    }

    return this.countryPromise;
  }

  private async fetchCountryWithTimeout(): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

    try {
      const res = await fetch('https://api.country.is/', { signal: controller.signal });
      const data = await res.json();
      const country = (data?.country as string) || DEFAULT_COUNTRY;
      localStorage.setItem('user_country', country);
      return country;
    } catch {
      localStorage.setItem('user_country', DEFAULT_COUNTRY);
      return DEFAULT_COUNTRY;
    } finally {
      clearTimeout(timer);
    }
  }
}
