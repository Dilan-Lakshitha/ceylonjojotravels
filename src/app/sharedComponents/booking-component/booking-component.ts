import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment';
import countriesData from './../../../assets/data/countries.json';
import countryCode from './../../../assets/data/countryCode.json';
import { catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-component.html',
  styleUrl: './booking-component.css',
})
export class BookingComponent {
  tour: any;
  travelers: number = 1;
  amountPaid: number = 0;
  orderNumber: string = '';
  prices: any = {};
  subtotal: number = 0;
  total: number = 0;
  filecode!: string;
  image!: string;
  bookingCompleted = false;
  bookingDate: Date = new Date();
  travelDate!: Date;
  firstName = '';
  lastName = '';
  email = '';
  country: string = '';
  countries: string[] = [];
  countriesList = countryCode;
  selectedCountry = this.countriesList.find((c) => c.code === 'LK');
  phoneNumber = '';
  userCountry: string = 'US';
  private isBrowser: boolean;
  groupNotice = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    if (!this.isBrowser) {
      return;
    }

    this.userCountry = await this.detectCountry();
    this.generateOrderNumber();

    this.route.paramMap.subscribe((params) => {
      this.filecode = params.get('filecode')!;
      this.loadTourPrices(this.filecode);
    });

    const navState = this.router.getCurrentNavigation()?.extras.state as {
      tour: any;
      barcode: string;
      image: string;
    };

    this.countries = countriesData.countries;

    if (navState?.tour) {
      this.tour = navState.tour;
      this.filecode = navState.barcode;
      this.image = navState.image;

      localStorage.setItem('tour', JSON.stringify(this.tour));
      localStorage.setItem('filecode', this.filecode);
      localStorage.setItem('image', this.image);
    } else {
      const storedTour = localStorage.getItem('tour');
      const storedFilecode = localStorage.getItem('filecode');
      const storedImage = localStorage.getItem('image');

      if (storedTour && storedFilecode) {
        this.tour = JSON.parse(storedTour);
        this.filecode = storedFilecode;
        this.image = storedImage!;
      } else {
        this.tour = {
          title: 'Unknown Tour',
          price: 0,
          duration: 'N/A',
          tourType: 'N/A',
        };
      }
    }

    if (this.filecode) {
      this.loadTourPrices(this.filecode);
    }
  }

  get fullPhone(): string {
    return this.selectedCountry
      ? `${this.selectedCountry.dial_code}${this.phoneNumber}`
      : this.phoneNumber;
  }

  async detectCountry(): Promise<string> {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      return data.country;
    } catch {
      return 'US';
    }
  }

  loadTourPrices(fileName: string) {
    const countryFile = `/assets/data/${this.userCountry}${fileName}.json`;
    const defaultFile = `/assets/data/US${fileName}.json`;
    this.http
      .get(countryFile)
      .pipe(
        catchError((err) => {
          console.warn(
            `Price file not found for ${this.userCountry}, loading default prices`,
          );
          return this.http.get(defaultFile);
        }),
      )
      .subscribe((data: any) => {
        this.prices = data.price;
        this.tour.title = data.title;
        this.tour.duration = data.duration;
        this.tour.tourType = data.tourType;
        this.tour.overview = data.overview;
        this.image = data.images[0];
        if (this.isBrowser) {
          localStorage.setItem('tour', JSON.stringify(this.tour));
          localStorage.setItem('filecode', this.filecode);
          localStorage.setItem('image', this.image);
          localStorage.setItem('prices', JSON.stringify(this.prices));
        }
        this.updateAmounts();
      });
  }

  generateOrderNumber() {
    if (!this.isBrowser) {
      return;
    }
    let lastOrder = localStorage.getItem('lastOrderNumber');
    let newOrder = 1;

    if (lastOrder) {
      newOrder = parseInt(lastOrder, 10) + 1;
    }

    localStorage.setItem('lastOrderNumber', newOrder.toString());

    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');

    this.orderNumber = `#${datePart}-${newOrder.toString().padStart(6, '0')}`;
  }

  updateTravelers(event: any) {
    const value = parseInt(event.target.value, 10);
    this.travelers = isNaN(value) || value < 1 ? 1 : value;
    this.updateAmounts();

    if (this.travelers >= 7) {
      this.groupNotice =
        'For groups of 7 or more travelers, please contact ceylonjojotravels@gmail.com for a customized group tour arrangement.';
    } else {
      this.groupNotice = '';
    }
  }

  updateAmounts() {
    if (this.prices && this.prices[this.travelers]) {
      this.subtotal = this.prices[this.travelers];
    } else {
      this.subtotal = 0;
    }
    this.total = this.subtotal;
  }

  get amountDue() {
    return this.total - this.amountPaid;
  }

  completeBooking() {
    const bookingDetails = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.fullPhone,
      country: this.country,
      travelers: this.travelers,
      tour: this.tour,
      orderNumber: this.orderNumber,
      total: this.total,
      bookingDate: this.bookingDate,
      travelDate: this.travelDate,
    };

    this.toastr.info('Processing your booking...', 'Please wait');
    this.http
      .post(`${environment.backendUrl}/send-booking-email`, bookingDetails)
      .subscribe({
        next: (res: any) => {
          this.toastr.success(
            'Your booking has been completed successfully!',
            'Booking Confirmed',
          );
          setTimeout(() => {
            this.bookingCompleted = true;
          }, 1500);
        },
        error: (err) => {
          console.error('Email error:', err);

          this.toastr.error(
            'There was an error processing your booking. Please try again later.',
            'Booking Failed',
          );
        },
      });
  }

  printInvoice() {
    if (!this.isBrowser) return;
    const printContents = document.getElementById('invoiceContent')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (isPlatformBrowser(this.platformId)) {
      if (printContents) {
        const printWindow = window.open('', '', 'height=700,width=900');
        printWindow!.document.write(`
      <html>
        <head>
          <title>Booking Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .card {
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              padding: 20px;
              border-radius: 10px;
            }
            .list-group-item {
              border: none;
              border-bottom: 1px solid #eee;
              padding: 10px 0;
            }
            .list-group-item:last-child {
              border-bottom: none;
            }
            .text-center { text-align: center; }
            .fw-bold { font-weight: bold; }
            .text-success { color: green; }
            .text-danger { color: red; }
            .text-primary { color: #007bff; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
        printWindow!.document.close();
        printWindow!.print();
      }
    }
  }

  onTravelDateChange(dateString: string) {
    this.travelDate = new Date(dateString);
  }

  clearLocalStorage() {
    if (!this.isBrowser) return;
    localStorage.removeItem('tour');
    localStorage.removeItem('filecode');
    localStorage.removeItem('prices');
  }

  ngOnDestroy() {
    if (!this.isBrowser) return;
    localStorage.removeItem('tour');
    localStorage.removeItem('filecode');
    localStorage.removeItem('prices');
  }
}
