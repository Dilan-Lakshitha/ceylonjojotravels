import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TourId, resolveTourIdFromSlug } from '../../i18n/tour-slug-map';
import { LocalizedRouterService } from '../../i18n/localized-router.service';

/**
 * Legacy booking URL handler — redirects to the tour detail booking section.
 * Booking UI now lives on the Tour Detail page.
 */
@Component({
  selector: 'app-booking-component',
  standalone: true,
  imports: [CommonModule],
  template: `<p class="text-center p-5">Redirecting to tour booking…</p>`,
})
export class BookingComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const filecode = this.route.snapshot.paramMap.get('filecode') || '';
    const tourId = (resolveTourIdFromSlug(filecode) || filecode) as TourId;

    if (this.isBrowser) {
      const nav = this.router.getCurrentNavigation()?.extras?.state as any;
      if (nav?.tour) {
        localStorage.setItem('tour', JSON.stringify(nav.tour));
        localStorage.setItem('barcode', filecode);
        localStorage.setItem('filecode', filecode);
        if (nav.image) {
          localStorage.setItem('image', nav.image);
        }
      }
    }

    const commands = this.localizedRouter.tourLinkCommands(tourId);
    void this.router.navigate(commands, { fragment: 'booking' });
  }
}
