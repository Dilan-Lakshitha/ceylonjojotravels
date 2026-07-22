import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';
import { environment } from '../../../../environment';
import { ToastrService } from 'ngx-toastr';
import countryCode from './../../../assets/data/countryCode.json';
import { LocalizedRouterService } from '../../i18n/localized-router.service';

@Component({
  selector: 'app-contact-us-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TranslocoModule],
  providers: [provideTranslocoScope('contact', 'common')],
  templateUrl: './contact-us-component.html',
  styleUrls: ['./contact-us-component.css'],
})
export class ContactUsComponent {
  @Input() homecontact: boolean = false;
  contactForm: any;
  successMessage = '';
  countriesList = countryCode;
  selectedCountryCode: string = 'LK'; 
  phoneNumber:string = '';
  private timeoutId: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private transloco: TranslocoService,
    private localizedRouter: LocalizedRouterService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  get homeLink(): any[] {
    return this.localizedRouter.commandsFor('home');
  }

 onSubmit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.contactForm.valid) {
      const country = this.countriesList.find(
        (c) => c.code === this.selectedCountryCode
      );

      const fullPhoneNumber =
        (country?.dial_code ?? '') +
        this.contactForm.get('contactPhone')?.value;

      const formData = {
        ...this.contactForm.value,
        contactPhone: fullPhoneNumber,
      };

      this.http
        .post(`${environment.backendUrl}/send-contact-email`, formData)
        .subscribe({
          next: (res: any) => {
            this.successMessage = this.transloco.translate('messages.success', {}, 'contact');
            this.toastr.success(this.transloco.translate('toast.success', {}, 'contact'));

            this.contactForm.reset();

            if (this.timeoutId) {
              clearTimeout(this.timeoutId);
            }

            this.timeoutId = setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (err) => {
            console.error('Email error:', err);
            this.successMessage = this.transloco.translate('messages.error', {}, 'contact');
            this.toastr.error(this.transloco.translate('toast.error', {}, 'contact'));

            if (this.timeoutId) {
              clearTimeout(this.timeoutId);
            }

            this.timeoutId = setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
        });
    }
  }
}
