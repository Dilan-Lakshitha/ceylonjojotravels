import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { SeoService } from '../../i18n/seo.service';
import { AppLang, isAppLang } from '../../i18n/language.constants';

@Component({
  selector: 'app-booking-success-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './booking-success-page.component.html',
  styleUrl: './booking-success-page.component.css',
})
export class BookingSuccessPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);
  private readonly seo = inject(SeoService);
  private readonly isBrowser: boolean;

  data: any = null;
  homeLink: any[] = ['/', 'en'];
  toursLink: any[] = ['/', 'en', 'tours'];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const lang = (this.transloco.getActiveLang() || 'en') as AppLang;
    this.transloco.load(`booking/${lang}`).subscribe();
    this.homeLink = this.localizedRouter.commandsFor('home');
    this.toursLink = this.localizedRouter.commandsFor('tours');

    const nav = this.router.getCurrentNavigation()?.extras?.state as any;
    if (nav?.orderNumber) {
      this.data = nav;
    } else if (this.isBrowser) {
      const raw = localStorage.getItem('bookingSuccess');
      if (raw) {
        try {
          this.data = JSON.parse(raw);
        } catch {
          this.data = null;
        }
      }
    }

    void this.seo.applyPageSeo({
      routeId: 'bookingSuccess',
      lang: isAppLang(lang) ? lang : 'en',
    });
  }
}
