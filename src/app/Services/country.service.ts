import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private detectedCountry: string | null = null;
  private countryPromise: Promise<string> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async detectCountry(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return 'US';
    }

    const saved = localStorage.getItem('user_country');
    if (saved) {
      return saved;
    }

    try {
      const res = await fetch('https://api.country.is/');
      const data = await res.json();
      const country = data?.country || 'US';

      localStorage.setItem('user_country', country);
      return country;
    } catch {
      localStorage.setItem('user_country', 'US');
      return 'US';
    }
  }
}
