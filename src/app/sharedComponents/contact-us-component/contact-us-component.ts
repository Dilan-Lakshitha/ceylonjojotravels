import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environment';
import countryCode from './../../../assets/data/countryCode.json';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';

@Component({
  selector: 'app-contact-us-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslocoModule,
    PageHeaderComponent,
  ],
  templateUrl: './contact-us-component.html',
  styleUrls: ['./contact-us-component.css'],
})
export class ContactUsComponent implements OnDestroy {
  @Input() homecontact = false;

  contactForm: FormGroup;
  successMessage = '';
  isError = false;
  submitting = false;
  countriesList = countryCode;
  selectedCountryCode = 'LK';
  homeLabel = 'Home';
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private transloco: TranslocoService,
    private localizedRouter: LocalizedRouterService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(4000)]],
    });

    const lang = this.transloco.getActiveLang() || 'en';
    this.transloco.load(`common/${lang}`).subscribe(() => {
      this.homeLabel = this.transloco.translate('nav.home', {}, 'common') || 'Home';
    });
    this.transloco.load(`contact/${lang}`).subscribe();
  }

  get homeLink(): any[] {
    return this.localizedRouter.commandsFor('home');
  }

  trackCountry(_index: number, country: { code: string }): string {
    return country.code;
  }

  onSubmit(): void {
    if (!isPlatformBrowser(this.platformId) || this.submitting) {
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const country = this.countriesList.find((c) => c.code === this.selectedCountryCode);
    const fullPhoneNumber =
      (country?.dial_code ?? '') + (this.contactForm.get('contactPhone')?.value ?? '');

    const formData = {
      name: String(this.contactForm.value.name || '').trim(),
      email: String(this.contactForm.value.email || '').trim(),
      contactPhone: fullPhoneNumber,
      message: String(this.contactForm.value.message || '').trim(),
    };

    this.submitting = true;
    this.successMessage = '';
    this.isError = false;

    this.http.post(`${environment.backendUrl}/send-contact-email`, formData).subscribe({
      next: () => {
        this.submitting = false;
        this.isError = false;
        this.successMessage = this.transloco.translate('messages.success', {}, 'contact');
        this.toastr.success(this.transloco.translate('toast.success', {}, 'contact'));
        this.contactForm.reset();
        this.clearStatusLater();
      },
      error: (err) => {
        console.error('Contact email error:', err);
        this.submitting = false;
        this.isError = true;
        this.successMessage = this.transloco.translate('messages.error', {}, 'contact');
        this.toastr.error(this.transloco.translate('toast.error', {}, 'contact'));
        this.clearStatusLater();
      },
    });
  }

  private clearStatusLater(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.successMessage = '';
      this.isError = false;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
