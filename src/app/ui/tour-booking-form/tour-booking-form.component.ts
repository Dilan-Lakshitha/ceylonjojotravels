import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { environment } from '../../../../environment';
import countriesData from '../../../assets/data/countries.json';
import countryCode from '../../../assets/data/countryCode.json';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { CountryService } from '../../Services/country.service';

@Component({
  selector: 'app-tour-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: './tour-booking-form.component.html',
  styleUrl: './tour-booking-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourBookingFormComponent implements OnInit, OnChanges {
  @Input() tour: any;
  @Input() filecode = '';
  @Input() image = '';
  @Input() pricesInput: Record<string, number> | null = null;

  travelers = 2;
  amountPaid = 0;
  orderNumber = '';
  prices: Record<string, number> = {};
  subtotal = 0;
  total = 0;
  bookingDate: Date = new Date();
  travelDate!: Date;
  firstName = '';
  lastName = '';
  email = '';
  country = '';
  countries: string[] = [];
  countriesList = countryCode;
  selectedCountry = this.countriesList.find((c) => c.code === 'LK');
  phoneNumber = '';
  whatsapp = '';
  userCountry = 'US';
  groupNotice = '';
  submitting = false;

  private readonly isBrowser: boolean;
  private readonly transloco = inject(TranslocoService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly countryService = inject(CountryService);
  private readonly http = inject(HttpClient);
  private readonly toastr = inject(ToastrService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  trackCountry(_index: number, country: string): string {
    return country;
  }

  trackCountryCode(_index: number, c: { code: string }): string {
    return c.code;
  }

  ngOnInit(): void {
    const lang = this.transloco.getActiveLang() || 'en';
    this.transloco.load(`booking/${lang}`).subscribe();
    this.countries = countriesData.countries;
    if (!this.isBrowser) {
      return;
    }
    this.generateOrderNumber();
    void this.bootstrapPrices();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filecode'] || changes['pricesInput'] || changes['tour']) {
      void this.bootstrapPrices();
    }
  }

  get fullPhone(): string {
    return this.selectedCountry
      ? `${this.selectedCountry.dial_code}${this.phoneNumber}`
      : this.phoneNumber;
  }

  get amountDue(): number {
    return this.total - this.amountPaid;
  }

  get pricePerPerson(): number {
    if (!this.travelers || this.travelers < 1 || !this.total) {
      return 0;
    }
    return Math.round(this.total / this.travelers);
  }

  private async bootstrapPrices(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }
    if (this.pricesInput && Object.keys(this.pricesInput).length) {
      this.prices = this.pricesInput;
      this.updateAmounts();
      return;
    }
    if (!this.filecode) {
      return;
    }
    this.userCountry = await this.countryService.detectCountry();
    this.loadTourPrices(this.filecode);
  }

  loadTourPrices(fileName: string): void {
    const countryFile = `/assets/data/${this.userCountry}${fileName}.json`;
    const defaultFile = `/assets/data/US${fileName}.json`;
    this.http
      .get(countryFile)
      .pipe(
        catchError(() => {
          return this.http.get(defaultFile);
        }),
      )
      .subscribe((data: any) => {
        this.prices = data.price || {};
        if (!this.tour) {
          this.tour = {};
        }
        if (!this.tour.title && data.title) {
          this.tour.title = data.title;
        }
        if (!this.tour.duration && data.duration) {
          this.tour.duration = data.duration;
        }
        if (!this.tour.tourType && data.tourType) {
          this.tour.tourType = data.tourType;
        }
        this.updateAmounts();
        this.cdr.markForCheck();
      });
  }

  generateOrderNumber(): void {
    if (!this.isBrowser) {
      return;
    }
    const lastOrder = localStorage.getItem('lastOrderNumber');
    let newOrder = 1;
    if (lastOrder) {
      newOrder = parseInt(lastOrder, 10) + 1;
    }
    localStorage.setItem('lastOrderNumber', newOrder.toString());
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    this.orderNumber = `#${datePart}-${newOrder.toString().padStart(6, '0')}`;
  }

  updateTravelers(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.onTravelersModelChange(value);
  }

  onTravelersModelChange(value: number | string): void {
    const parsed = typeof value === 'number' ? value : parseInt(String(value), 10);
    this.travelers = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    this.updateAmounts();
    this.groupNotice =
      this.travelers >= 7
        ? this.transloco.translate('form.groupNotice', {}, 'booking')
        : '';
    this.cdr.markForCheck();
  }

  updateAmounts(): void {
    if (this.prices && this.prices[this.travelers]) {
      this.subtotal = this.prices[this.travelers];
    } else if (this.tour?.price && this.travelers === 2) {
      this.subtotal = this.tour.price;
    } else {
      this.subtotal = 0;
    }
    this.total = this.subtotal;
  }

  onTravelDateChange(dateString: string): void {
    this.travelDate = new Date(dateString);
  }

  completeBooking(): void {
    if (this.submitting || this.groupNotice) {
      return;
    }
    this.submitting = true;

    const tourPayload = {
      ...(this.tour || {}),
      filecode: this.filecode,
      whatsapp: this.whatsapp || undefined,
    };

    const bookingDetails = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.fullPhone,
      country: this.country,
      travelers: this.travelers,
      tour: tourPayload,
      orderNumber: this.orderNumber,
      total: this.total,
      bookingDate: this.bookingDate,
      travelDate: this.travelDate,
    };

    this.toastr.info(
      this.transloco.translate('toast.processing', {}, 'booking'),
      this.transloco.translate('toast.processingTitle', {}, 'booking'),
    );

    this.http.post(`${environment.backendUrl}/send-booking-email`, bookingDetails).subscribe({
      next: () => {
        this.toastr.success(
          this.transloco.translate('toast.success', {}, 'booking'),
          this.transloco.translate('toast.successTitle', {}, 'booking'),
        );
        const successState = {
          orderNumber: this.orderNumber,
          tour: tourPayload,
          total: this.total,
          travelers: this.travelers,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          bookingDate: this.bookingDate,
          travelDate: this.travelDate,
          image: this.image,
        };
        if (this.isBrowser) {
          localStorage.setItem('bookingSuccess', JSON.stringify(successState));
        }
        setTimeout(() => {
          void this.localizedRouter.navigateTo('bookingSuccess', { state: successState });
          this.submitting = false;
          this.cdr.markForCheck();
        }, 800);
      },
      error: () => {
        this.submitting = false;
        this.cdr.markForCheck();
        this.toastr.error(
          this.transloco.translate('toast.error', {}, 'booking'),
          this.transloco.translate('toast.errorTitle', {}, 'booking'),
        );
      },
    });
  }
}
