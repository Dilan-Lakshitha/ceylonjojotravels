import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslocoModule } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { PackageItemComponent } from '../../sharedComponents/package-item-component/package-item-component';
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
  imports: [CommonModule, RouterModule, PackageItemComponent, TranslocoModule],
  templateUrl: './tour-packages.html',
  styleUrl: './tour-packages.css',
})
export class TourPackages implements OnInit, OnDestroy {
  dayTours: TourCardVm[] = [];
  multiDayTours: TourCardVm[] = [];
  userCountry = 'US';
  homeLink: any[] = ['/', 'en'];
  activeTab: 'multi' | 'day' = 'multi';

  private readonly http = inject(HttpClient);
  private readonly countryService = inject(CountryService);
  private readonly tourContent = inject(TourContentService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private sub?: Subscription;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.homeLink = this.localizedRouter.commandsFor('home');
    this.sub = this.tourContent.getCatalog().subscribe(async (catalog) => {
      if (isPlatformBrowser(this.platformId)) {
        this.userCountry = await this.countryService.detectCountry();
      }
      this.dayTours = await this.withPrices(catalog.dayTours);
      this.multiDayTours = await this.withPrices(catalog.multiDayTours);
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
    if (!isPlatformBrowser(this.platformId)) {
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
