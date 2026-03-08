import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import toursData from '../../databaseJson/tours.json';
import { PackageItemComponent } from '../../sharedComponents/package-item-component/package-item-component';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../Services/country.service';

@Component({
  selector: 'app-tour-packages',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule,PackageItemComponent],
  templateUrl: './tour-packages.html',
  styleUrl: './tour-packages.css'
})
export class TourPackages {
  dayTours: any[] = [];
  multiDayTours: any[] = [];
  userCountry = 'US';

  activeTab: 'multi' | 'day' = 'multi';

  constructor(
    private http: HttpClient,
    private countryService: CountryService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  async ngOnInit() {
    this.userCountry = await this.countryService.detectCountry();
    this.dayTours = await this.loadToursWithPrices(toursData.dayTours);
    this.multiDayTours = await this.loadToursWithPrices(toursData.multiDayTours);
  }

  async loadToursWithPrices(tours: any[]) {
    return Promise.all(
      tours.map(async (tour) => {
        const price = await this.loadPrice(tour.filecode);
        return { ...tour, price };
      })
    );
  }

  loadPrice(filecode: string): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(0);
    }

    const countryFile = `assets/data/${this.userCountry}${filecode}.json`;
    const defaultFile = `assets/data/US${filecode}.json`;
    console.log(countryFile,'default',defaultFile)

    return new Promise((resolve) => {
      this.http.get(countryFile).subscribe({
        next: (data: any) => resolve(data?.price?.['2'] ?? 0),
        error: () => {
          this.http.get(defaultFile).subscribe({
            next: (data: any) => resolve(data?.price?.['2'] ?? 0),
            error: () => resolve(0)
          });
        }
      });
    });
  }

  private loadDefaultPrice(file: string, resolve: (v: number) => void) {
    this.http.get(file).subscribe({
      next: (data: any) => {
        if (data && data.price && data.price[1] != null) {
          resolve(data.price[1]);
        } else {
          console.error('Invalid default price file:', file);
          resolve(0);
        }
      },
      error: () => {
        console.error('Default price file missing:', file);
        resolve(0);
      },
    });
  }

  setTab(tab: 'multi' | 'day') {
    this.activeTab = tab;
  }
}
