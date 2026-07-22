import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { SeoService } from './i18n/seo.service';
import { AppLang, isAppLang } from './i18n/language.constants';
import { RouteId } from './i18n/route-map';
import { TourId } from './i18n/tour-slug-map';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [RouterModule],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly transloco = inject(TranslocoService);
  private sub?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.transloco.load(`common/${this.transloco.getActiveLang()}`).subscribe();

    this.sub = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.route;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
      )
      .subscribe(async (route) => {
        const data = route.snapshot.data;
        const langParam =
          route.parent?.snapshot.paramMap.get('lang') ||
          this.router.url.split('/').filter(Boolean)[0] ||
          'en';
        const lang: AppLang = isAppLang(langParam) ? langParam : 'en';
        const routeId = (data['routeId'] as RouteId) || 'home';
        const tourId = data['tourId'] as TourId | undefined;
        const filecode = route.snapshot.paramMap.get('filecode') || undefined;

        if (tourId) {
          return;
        }

        await this.seo.applyPageSeo({
          routeId,
          lang,
          filecode: filecode || undefined,
        });
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
