import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ContactUsComponent } from '../../sharedComponents/contact-us-component/contact-us-component';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [CommonModule, ContactUsComponent, RouterModule, TranslocoModule, PageHeaderComponent],
  templateUrl: './about-component.html',
  styleUrl: './about-component.css',
})
export class AboutComponent implements OnInit {
  homecontact = true;
  homeLink: any[] = ['/', 'en'];
  contactLink: any[] = ['/', 'en', 'contact'];
  homeLabel = 'Home';

  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.homeLink = this.localizedRouter.commandsFor('home');
    this.contactLink = this.localizedRouter.commandsFor('contact');
    const lang = this.transloco.getActiveLang() || 'en';
    this.transloco.load(`about/${lang}`).subscribe();
    this.transloco.load(`common/${lang}`).subscribe(() => {
      this.homeLabel = this.transloco.translate('nav.home', {}, 'common') || 'Home';
    });
    this.transloco.load(`contact/${lang}`).subscribe();
  }
}
