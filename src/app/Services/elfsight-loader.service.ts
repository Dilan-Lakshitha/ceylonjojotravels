import { ApplicationRef, Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { filter, firstValueFrom, take } from 'rxjs';

const PLATFORM_SRC = 'https://elfsightcdn.com/platform.js';

/**
 * Loads Elfsight only after Angular hydration is stable and the browser is idle.
 * Prevents styled-components / hydration clashes and keeps LCP free of the widget.
 */
@Injectable({ providedIn: 'root' })
export class ElfsightLoaderService {
  private readonly appRef = inject(ApplicationRef);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private loadPromise: Promise<void> | null = null;

  /** Resolves once platform.js is on the page (or already present). */
  ensurePlatform(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.waitUntilSafe().then(
      () =>
        new Promise<void>((resolve) => {
          this.ngZone.runOutsideAngular(() => {
            if (
              document.querySelector(`script[data-elfsight-platform], script[src="${PLATFORM_SRC}"]`)
            ) {
              resolve();
              return;
            }
            const script = document.createElement('script');
            script.src = PLATFORM_SRC;
            script.async = true;
            script.defer = true;
            script.setAttribute('data-elfsight-platform', 'true');
            script.addEventListener('load', () => resolve(), { once: true });
            script.addEventListener('error', () => resolve(), { once: true });
            document.body.appendChild(script);
          });
        }),
    );

    return this.loadPromise;
  }

  private async waitUntilSafe(): Promise<void> {
    // Let hydration finish first (avoids styled-components error #17).
    try {
      await firstValueFrom(this.appRef.isStable.pipe(filter(Boolean), take(1)));
    } catch {
      /* ignore */
    }

    // Then wait for a quiet moment so reviews don't compete with LCP.
    await new Promise<void>((resolve) => {
      this.ngZone.runOutsideAngular(() => {
        const ric = (
          window as Window & {
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
          }
        ).requestIdleCallback;
        if (typeof ric === 'function') {
          ric(() => resolve(), { timeout: 3000 });
        } else {
          setTimeout(() => resolve(), 1200);
        }
      });
    });
  }
}
