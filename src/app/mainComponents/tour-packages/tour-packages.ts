import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { TourCardComponent } from '../../ui/tour-card/tour-card.component';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import { CountryService } from '../../Services/country.service';
import { TourContentService, TourCatalogItem } from '../../i18n/tour-content.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { TourId } from '../../i18n/tour-slug-map';

interface TourCardVm extends TourCatalogItem {
  price: number;
  link: any[];
}

@Component({
  selector: 'app-tour-packages',
  standalone: true,
  imports: [CommonModule, RouterModule, TourCardComponent, PageHeaderComponent, TranslocoModule],
  templateUrl: './tour-packages.html',
  styleUrl: './tour-packages.css',
})
export class TourPackages implements OnInit, OnDestroy {
  dayTours: TourCardVm[] = [];
  multiDayTours: TourCardVm[] = [];
  userCountry = 'US';
  homeLink: any[] = ['/', 'en'];
  activeTab: 'multi' | 'day' = 'multi';
  loading = true;

  private readonly http = inject(HttpClient);
  private readonly countryService = inject(CountryService);
  private readonly tourContent = inject(TourContentService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly cdr = inject(ChangeDetectorRef);
  private sub?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.homeLink = this.localizedRouter.commandsFor('home');

    // Don't block catalog on geo lookup
    if (isPlatformBrowser(this.platformId)) {
      this.countryService.detectCountry().then((c) => {
        this.userCountry = c;
      });
    }

    this.sub = this.tourContent.getCatalog().subscribe({
      next: async (catalog) => {
        const day = catalog?.dayTours ?? [];
        const multi = catalog?.multiDayTours ?? [];
        this.dayTours = await this.withPrices(day);
        this.multiDayTours = await this.withPrices(multi);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  setTab(tab: 'multi' | 'day'): void {
    this.activeTab = tab;
  }

  private async withPrices(tours: TourCatalogItem[]): Promise<TourCardVm[]> {
    return Promise.all(
      tours.map(async (tour) => {
        const price = await this.loadPrice(tour.filecode);
        return {
          ...tour,
          price,
          link: this.localizedRouter.tourLinkCommands((tour.filecode || tour.id) as TourId),
        };
      }),
    );
  }

  private loadPrice(filecode: string): Promise<number> {
    if (!isPlatformBrowser(this.platformId) || !filecode) {
      return Promise.resolve(0);
    }
    const countryFile = `assets/data/${this.userCountry}${filecode}.json`;
    const defaultFile = `assets/data/US${filecode}.json`;
    return new Promise((resolve) => {
      this.http.get(countryFile).subscribe({
        next: (data: any) => resolve(data?.price?.['2'] ?? 0),
        error: () => {
          this.http.get(defaultFile).subscribe({
            next: (data: any) => resolve(data?.price?.['2'] ?? 0),
            error: () => resolve(0),
          });
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
